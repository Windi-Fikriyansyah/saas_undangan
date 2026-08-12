import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/api/auth/signin");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: (session?.user as any).id }
  });

  if (!vendor) {
    redirect("/api/auth/signin");
  }

  // If already onboarded, redirect to dashboard
  if (vendor.isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Selamat Datang di SaaS Undangan
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Mari selesaikan profil bisnis Anda terlebih dahulu sebelum memulai.
          </p>
        </div>

        <OnboardingWizard initialData={{
          name: vendor.name,
          email: vendor.email,
        }} />
      </div>
    </div>
  );
}
