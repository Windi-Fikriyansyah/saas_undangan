import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditLandingPageClient from "./EditClient";

export default async function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect("/login");
  }

  const vendorId = (session!.user as any).id;
  const { id: pageId } = await params;

  const landingPage = await prisma.landingPage.findUnique({
    where: { id: pageId },
  });

  if (!landingPage || landingPage.vendorId !== vendorId) {
    redirect("/dashboard/landingpages");
  }

  return <EditLandingPageClient landingPage={landingPage} />;
}
