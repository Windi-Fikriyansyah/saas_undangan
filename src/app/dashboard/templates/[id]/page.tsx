import { redirect } from "next/navigation";

export default async function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  redirect(`/preview/template/${resolvedParams.id}`);
}
