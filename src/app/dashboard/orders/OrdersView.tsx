import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma, prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import CreateOrderModal from "@/components/ecommerce/CreateOrderModal";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import { OrderStatus } from "@/generated/prisma/client";
import React from "react";

export default async function OrdersView({
  statusFilter,
  pageTitle
}: {
  statusFilter?: string;
  pageTitle: string;
}) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect("/api/auth/signin");
  }

  const vendorId = (session?.user as any).id;
  const tenantPrisma = getTenantPrisma(vendorId);

  let mappedStatusFilter: OrderStatus | undefined;
  if (statusFilter && Object.keys(OrderStatus).includes(statusFilter.toUpperCase())) {
    mappedStatusFilter = statusFilter.toUpperCase() as OrderStatus;
  }
  
  const whereCondition: any = {};
  if (mappedStatusFilter === OrderStatus.PENDING) {
    whereCondition.status = { in: [OrderStatus.PENDING, OrderStatus.FILLING] };
  } else if (mappedStatusFilter) {
    whereCondition.status = mappedStatusFilter;
  }

  const [orders, templates] = await Promise.all([
    tenantPrisma.order.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    }),
    prisma.template.findMany({
      where: { isActive: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageTitle}
        </h2>
        <div className="flex items-center gap-3">
          <CreateOrderModal templates={templates} />
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-stroke dark:border-strokedark">
              <TableRow>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">Klien</TableCell>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">WhatsApp</TableCell>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">Template</TableCell>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">Tgl Dibuat</TableCell>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">Masa Aktif</TableCell>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">Status</TableCell>
                <TableCell isHeader className="py-4 font-medium text-black dark:text-white">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-stroke dark:divide-strokedark">
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell className="py-8 text-center text-gray-500" colSpan={7}>
                    Belum ada order {mappedStatusFilter ? `dengan status ${pageTitle}` : ''}.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any) => {
                  let badgeColor = "warning";
                  if (order.status === "LIVE") badgeColor = "success";
                  if (order.status === "EXPIRED") badgeColor = "error";

                  const template = templates.find(t => t.id === order.templateId);

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-black dark:text-white">
                            {order.clientName}
                          </span>
                          <span className="text-sm text-gray-500">
                            /{order.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-black dark:text-white">
                        {order.clientWa}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-black dark:text-white">
                        {template?.name || 'Custom'}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-black dark:text-white">
                        {order.createdAt.toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-black dark:text-white">
                        {order.expiresAt ? order.expiresAt.toLocaleDateString("id-ID") : "Selamanya"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge size="sm" color={badgeColor as any}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <CopyLinkButton clientToken={order.clientToken} />
                          <a 
                            href={`/dashboard/orders/${order.id}/edit`}
                            className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                            title="Edit Data Undangan"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
