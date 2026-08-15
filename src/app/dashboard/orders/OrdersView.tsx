import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma, prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import CreateOrderModal from "@/components/ecommerce/CreateOrderModal";
import OrdersTableClient from "./OrdersTableClient";
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
    redirect("/signin");
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
          <OrdersTableClient orders={orders} templates={templates} />
        </div>
      </div>
    </div>
  );
}
