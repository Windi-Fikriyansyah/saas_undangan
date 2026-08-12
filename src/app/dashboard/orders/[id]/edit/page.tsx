import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import VendorDataEditor from "@/components/dashboard/VendorDataEditor";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect("/api/auth/signin");
  }

  const vendorId = (session?.user as any).id;
  const tenantPrisma = getTenantPrisma(vendorId);
  const { id } = await params;

  const order = await tenantPrisma.order.findUnique({
    where: { id, vendorId },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Edit Data Undangan
        </h2>
        <div className="text-sm text-gray-500">
          Klien: <span className="font-semibold text-black dark:text-white">{order.clientName}</span>
        </div>
      </div>

      <VendorDataEditor 
        orderId={order.id}
        clientToken={order.clientToken}
        initialData={order.dataJson}
      />
    </div>
  );
}
