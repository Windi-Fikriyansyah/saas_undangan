import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
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
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Klien
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                WhatsApp
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Dibuat
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Masa Aktif
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.length === 0 ? (
              <TableRow>
                <TableCell className="py-4 text-center text-gray-500">Belum ada link yang dibuat.</TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => {
                let badgeColor = "warning";
                if (order.status === "LIVE") badgeColor = "success";
                if (order.status === "EXPIRED") badgeColor = "error";

                return (
                  <TableRow key={order.id}>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.clientName}
                        </span>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          /{order.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.clientWa}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.createdAt.toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.expiresAt ? order.expiresAt.toLocaleDateString('id-ID') : 'Selamanya'}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={badgeColor as any}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
