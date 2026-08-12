"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema, ClientFormData } from "@/lib/validations/client-form";
import { updateOrderData } from "@/app/actions/order";
import { useRouter } from "next/navigation";

// Reuse existing step components
import Step1Couple from "@/components/form/steps/Step1Couple";
import Step2Events from "@/components/form/steps/Step2Events";
import Step3Gallery from "@/components/form/steps/Step3Gallery";
import Step4Extras from "@/components/form/steps/Step4Extras";

interface VendorDataEditorProps {
  orderId: string;
  clientToken: string;
  initialData: any;
}

export default function VendorDataEditor({ orderId, clientToken, initialData }: VendorDataEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(1);
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

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updateOrderData(orderId, data);
      router.push("/dashboard/orders");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 1, label: "Mempelai" },
    { id: 2, label: "Acara" },
    { id: 3, label: "Galeri" },
    { id: 4, label: "Ekstra" },
  ];

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {error && (
        <div className="mb-6 rounded bg-red-100 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex border-b border-stroke dark:border-strokedark overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="min-h-[400px]">
            {activeTab === 1 && <Step1Couple />}
            {activeTab === 2 && <Step2Events />}
            {activeTab === 3 && <Step3Gallery clientToken={clientToken} />}
            {activeTab === 4 && <Step4Extras />}
          </div>

          <div className="flex justify-end gap-4 border-t border-stroke pt-6 dark:border-strokedark">
            <button
              type="button"
              onClick={() => router.push("/dashboard/orders")}
              className="rounded-lg border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
