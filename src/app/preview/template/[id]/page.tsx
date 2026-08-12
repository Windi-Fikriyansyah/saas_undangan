import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ElementorRenderer } from "@/components/elementor/ElementorRenderer";

export default async function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/api/auth/signin");
  }

  const template = await prisma.template.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!template) {
    notFound();
  }

  const config = template.configJson as any;
  const elements = config?.content || [];

  return (
    <div className="elementor-preview-wrapper w-full bg-white min-h-screen">
      {elements.length > 0 ? (
        <ElementorRenderer elements={elements} />
      ) : (
        <div className="p-20 text-center text-gray-500">
          Template kosong atau format tidak valid.
        </div>
      )}
    </div>
  );
}
