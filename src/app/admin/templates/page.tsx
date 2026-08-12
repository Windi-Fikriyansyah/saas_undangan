import { prisma } from "@/lib/db";
import React from "react";
import TemplateModal from "./TemplateModal";

export const revalidate = 0;

export default async function AdminTemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Manajemen Template
          </h2>
          <p className="text-sm text-gray-500">Daftar semua template undangan yang tersedia untuk klien.</p>
        </div>
        <TemplateModal />
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-6 border-b border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">ID & Nama Template</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Kategori</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Tier</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Status</p>
          </div>
          <div className="col-span-2 flex items-center justify-end">
            <p className="font-medium">Aksi</p>
          </div>
        </div>

        {templates.map((template, key) => (
          <div
            className={`grid grid-cols-6 sm:grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 ${
              key === templates.length - 1 ? "border-b" : ""
            }`}
            key={template.id}
          >
            <div className="col-span-2 flex flex-col justify-center">
              <p className="text-sm font-medium text-black dark:text-white">
                {template.name}
              </p>
              <p className="text-xs text-gray-500">{template.id}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {template.category}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-xs font-medium ${template.tier === 'PREMIUM' ? 'bg-warning text-warning' : 'bg-primary text-primary'}`}>
                {template.tier}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-xs font-medium ${template.isActive ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                {template.isActive ? "Aktif" : "Nonaktif"}
              </p>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <TemplateModal template={template} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
