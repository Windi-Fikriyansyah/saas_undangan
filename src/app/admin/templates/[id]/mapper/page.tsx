import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MapperForm from "./MapperForm";

export default async function TemplateMapperPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const isSuperAdmin = (session?.user as any)?.isAdmin === true || session?.user?.email === "diwin6634@gmail.com";
  
  if (!session?.user || !isSuperAdmin) {
    redirect("/dashboard");
  }
  
  const { id } = await params;

  const template = await prisma.template.findUnique({
    where: { id },
  });

  if (!template) {
    notFound();
  }

  const config = template.configJson as any;

  if (!config.isScraped || !config.schema) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Bukan Template Scraped</h1>
        <p>Halaman ini hanya untuk template hasil scraping yang memiliki schema.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mapping Template: {template.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Pilih data klien (contoh: Nama Mempelai Pria) yang akan menggantikan teks statis asli dari template ini.
        </p>
      </div>

      <MapperForm 
        templateId={template.id} 
        schema={config.schema} 
        initialMapping={config.mapping || {}} 
      />
    </div>
  );
}
