import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CreateOrderForm from "./CreateOrderForm";

export default async function NewOrderPage() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  // Fetch templates for the user to choose from
  const templates = await prisma.template.findMany({
    where: { isActive: true },
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Buat Order Baru
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Formulir Pesanan Klien
          </h3>
        </div>
        <div className="p-6.5">
          <CreateOrderForm templates={templates} />
        </div>
      </div>
    </div>
  );
}
