import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import TemplateEngine from "@/components/template/TemplateEngine";

export default async function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  const template = await prisma.template.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!template) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen">
      <TemplateEngine 
        templateName={template.id} 
        config={template.configJson as any} 
        data={{}} 
      />
    </div>
  );
}
