"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { saveClientFormStep, submitFinalClientForm } from "@/app/actions/client-form";
import PhoneMockup from "@/components/ui/PhoneMockup";
import TemplateEngine from "@/components/template/TemplateEngine";
import { mapClientDataToWeddingData } from "@/lib/data-mapper";

interface DynamicHtmlFormWizardProps {
  clientToken: string;
  initialData: any;
  templateName?: string;
  templateConfig?: any;
}

export default function DynamicHtmlFormWizard({
  clientToken,
  initialData,
  templateName = "custom",
  templateConfig
}: DynamicHtmlFormWizardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const STORAGE_KEY = `draft_dynamicForm_${clientToken}`;

  // Extract custom variables from the raw-html block
  const variables = useMemo(() => {
    const rawHtmlBlock = templateConfig?.blocks?.find((b: any) => b.type === "raw-html");
    const htmlString = rawHtmlBlock?.props?.html;
    if (!htmlString) return [];

    const regex = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
    let match;
    const vars = new Set<string>();

    while ((match = regex.exec(htmlString)) !== null) {
      const varName = match[1].trim();
      // Ignore system variables that shouldn't be edited by the client
      if (varName.startsWith("guest.") || varName.startsWith("wishes.") || varName.startsWith("form.")) {
        continue;
      }
      vars.add(varName);
    }
    return Array.from(vars).sort();
  }, [templateConfig]);

  const methods = useForm({
    defaultValues: {
      customData: initialData?.customData || {},
      isCompleted: initialData?.isCompleted || false
    }
  });

  const watchAllFields = methods.watch();

  // Restore draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          methods.reset({
            isCompleted: initialData?.isCompleted || false,
            customData: { ...(initialData?.customData || {}), ...(parsed.customData || {}) }
          });
        } catch (e) {
          console.error("Failed to parse draft from localStorage", e);
        }
      }
    }
  }, [STORAGE_KEY, initialData, methods]);

  // Debounced backend save
  const debouncedBackendSave = useCallback((data: any) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setAutoSaveStatus("saving");
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveClientFormStep(clientToken, "customData", data.customData || {});
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 3000);
      } catch (err) {
        setAutoSaveStatus("error");
      }
    }, 2500);
  }, [clientToken]);

  // Watch for changes: save to LocalStorage immediately and debounce to backend
  useEffect(() => {
    const subscription = methods.watch((value, { type }) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
      if (type === "change" || type === "blur") {
         debouncedBackendSave(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, debouncedBackendSave, STORAGE_KEY]);

  const onSubmitFinal = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await saveClientFormStep(clientToken, "customData", data.customData);
      await submitFinalClientForm(clientToken);
      
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat submit data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row gap-8 relative">
      
      {/* Mobile Floating Button for Preview */}
      <button 
        onClick={() => setShowMobilePreview(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 lg:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      {/* Mobile Full Screen Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 lg:hidden">
          <div className="flex h-16 items-center justify-between bg-black px-4 text-white">
            <h2 className="text-lg font-bold">Live Preview</h2>
            <button onClick={() => setShowMobilePreview(false)} className="rounded-full bg-gray-800 p-2 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-100">
            <TemplateEngine 
              templateName={templateName}
              config={templateConfig}
              data={mapClientDataToWeddingData(watchAllFields)}
            />
          </div>
        </div>
      )}

      {/* Left Column: Form Area */}
      <div className="flex-1 w-full lg:max-w-2xl relative">
        
        {/* Auto-save Indicator */}
        <div className="absolute right-0 top-0 hidden sm:flex items-center space-x-2 text-xs font-medium -mt-6">
          {autoSaveStatus === "saving" && (
            <span className="flex items-center text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </span>
          )}
          {autoSaveStatus === "saved" && (
            <span className="flex items-center text-green-600">
              <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Tersimpan ke awan
            </span>
          )}
          {autoSaveStatus === "error" && (
            <span className="text-red-500">Gagal otomatis menyimpan</span>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Form Custom HTML</h2>
          <p className="text-sm text-gray-500 mb-6">
            Sistem mendeteksi {variables.length} variabel unik dari kode HTML tema Anda.
          </p>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitFinal)} className="space-y-6">
              
              <div className="space-y-4">
                {variables.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada variabel ({"{{...}}"}) yang ditemukan dalam kode HTML.</p>
                ) : (
                  variables.map((v) => (
                    <div key={v}>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {v}
                      </label>
                      <input
                        type="text"
                        {...methods.register(`customData.${v}`)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                        placeholder={`Isi nilai untuk ${v}`}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Selesai & Kunci Form"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      
      {/* Right Column: Live Preview (Desktop Only) */}
      <div className="hidden lg:block w-[350px] shrink-0 sticky top-8 h-[calc(100vh-4rem)]">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Live Preview
        </h3>
        <PhoneMockup className="scale-[0.9] origin-top">
          <div className="h-full overflow-y-auto overflow-x-hidden bg-gray-100 relative custom-scrollbar">
            <TemplateEngine 
              templateName={templateName}
              config={templateConfig}
              data={mapClientDataToWeddingData(watchAllFields)}
            />
          </div>
        </PhoneMockup>
      </div>

    </div>
  );
}
