import Badge from "../ui/badge/Badge";
import RecentOrdersTableClient from "./RecentOrdersTableClient";
import { getTenantPrisma, prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateOrderModal from "./CreateOrderModal";

export default async function RecentOrders() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;

  const tenantPrisma = getTenantPrisma((session?.user as any).id);
  const [orders, templates] = await Promise.all([
    tenantPrisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { guests: true }
    }),
    prisma.template.findMany({
      where: { isActive: true },
    })
  ]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Link Undangan Klien
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <CreateOrderModal templates={templates} />
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <RecentOrdersTableClient orders={orders} />
      </div>
    </div>
  );
}
