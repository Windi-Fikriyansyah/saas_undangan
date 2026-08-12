"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema, ClientFormData } from "@/lib/validations/client-form";
import { saveClientFormStep, submitFinalClientForm } from "@/app/actions/client-form";

import Step1Couple from "./steps/Step1Couple";
import Step2Events from "./steps/Step2Events";
import Step3Gallery from "./steps/Step3Gallery";
import Step4Extras from "./steps/Step4Extras";
import Step5Review from "./steps/Step5Review";

interface ClientFormWizardProps {
  clientToken: string;
  initialData: any;
}

export default function ClientFormWizard({ clientToken, initialData }: ClientFormWizardProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema) as any,
    defaultValues: {
      isCompleted: initialData?.isCompleted || false,
      step1: initialData?.step1 || {},
      step2: initialData?.step2 || {},
      step3: initialData?.step3 || { galleryImages: [] },
      step4: initialData?.step4 || {},
    },
    mode: "onBlur",
  });

  const totalSteps = 5;

  const handleNext = async () => {
    // Determine which nested field to validate based on active step
    const stepKey = `step${activeStep}` as keyof ClientFormData;
    
    // Trigger validation for the current step fields
    const isStepValid = await methods.trigger(stepKey);
    
    if (isStepValid) {
      // Auto-save
      try {
        setIsSaving(true);
        setError(null);
        const stepData = methods.getValues(stepKey);
        await saveClientFormStep(clientToken, stepKey, stepData);
        setActiveStep((prev) => Math.min(prev + 1, totalSteps));
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan data otomatis.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmitFinal = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      // Validate everything one last time (zod handles it via handleSubmit)
      // Save step 4 if not saved yet
      await saveClientFormStep(clientToken, "step4", data.step4);
      
      // Final submit locks the order
      await submitFinalClientForm(clientToken);
      
      // Force a page refresh to show the locked state
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat submit data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-colors ${
                  activeStep === step
                    ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                    : activeStep > step
                    ? "border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400"
                    : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                {step}
              </div>
              <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                {step === 1 && "Mempelai"}
                {step === 2 && "Acara"}
                {step === 3 && "Galeri"}
                {step === 4 && "Ekstra"}
                {step === 5 && "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-[-28px] hidden w-full px-5 sm:block -z-10">
          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700"></div>
          <div 
            className="absolute top-0 h-1 bg-blue-600 transition-all dark:bg-blue-500" 
            style={{ width: `${((activeStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form Content */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmitFinal)} className="space-y-6">
            
            {activeStep === 1 && <Step1Couple />}
            {activeStep === 2 && <Step2Events />}
            {activeStep === 3 && <Step3Gallery clientToken={clientToken} />}
            {activeStep === 4 && <Step4Extras />}
            {activeStep === 5 && <Step5Review />}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
              <button
                type="button"
                onClick={handleBack}
                disabled={activeStep === 1 || isSaving || isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Kembali
              </button>
              
              {activeStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "Lanjut & Simpan"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Selesai & Kunci Form"}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
