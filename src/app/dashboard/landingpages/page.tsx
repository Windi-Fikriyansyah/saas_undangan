import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import LandingPageTableClient from "./LandingPageTableClient";

export default async function LandingPagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  const vendorId = (session!.user as any).id;

  const landingPages = await prisma.landingPage.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Landing Page Promosi
        </h2>
        
        <Link href="/dashboard/landingpages/create">
          <Button>Buat Landing Page</Button>
        </Link>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <LandingPageTableClient landingPages={landingPages} />
        </div>
      </div>
    </div>
  );
}
