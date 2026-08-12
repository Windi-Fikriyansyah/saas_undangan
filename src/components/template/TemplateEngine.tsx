"use client";

import { templateRegistry } from "./TemplateRegistry";
import { TemplateConfig } from "@/lib/validations/template-config";

interface TemplateProps {
  templateName: string;
  config: TemplateConfig;
  data: any;
  orderId?: string;
  guests?: any[];
  guestName?: string;
}

export default function TemplateEngine({ templateName, data, config, orderId, guests, guestName }: TemplateProps) {
  const TemplateComponent = templateRegistry[templateName];

  if (!TemplateComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-center">
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-600">Template Error</h2>
          <p className="mt-2 text-gray-600">
            Template <code className="rounded bg-gray-100 px-1 py-0.5">{templateName}</code> tidak ditemukan di registry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TemplateComponent 
      templateName={templateName}
      data={data} 
      config={config} 
      orderId={orderId} 
      guests={guests} 
      guestName={guestName} 
    />
  );
}
