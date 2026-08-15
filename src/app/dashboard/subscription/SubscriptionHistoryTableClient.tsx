"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Payment {
  id: string;
  orderId: string;
  createdAt: Date;
  planType: string;
  amount: number;
  status: string;
}

interface SubscriptionHistoryTableClientProps {
  payments: Payment[];
}

export default function SubscriptionHistoryTableClient({ payments }: SubscriptionHistoryTableClientProps) {
  const columns = useMemo<ColumnDef<Payment>[]>(() => [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => (
        <p className="text-sm font-medium text-black dark:text-white">{row.original.orderId}</p>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal",
      cell: ({ row }) => (
        <p className="text-sm text-black dark:text-white">
          {new Date(row.original.createdAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      ),
    },
    {
      accessorKey: "planType",
      header: "Paket",
      cell: ({ row }) => (
        <p className="text-sm text-black dark:text-white">{row.original.planType}</p>
      ),
    },
    {
      accessorKey: "amount",
      header: "Total",
      cell: ({ row }) => (
        <p className="text-sm text-black dark:text-white">Rp {row.original.amount.toLocaleString("id-ID")}</p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass = status === 'SUCCESS' ? 'bg-success text-success' : 
                          status === 'PENDING' ? 'bg-warning text-warning' : 'bg-danger text-danger';
        return (
          <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${colorClass}`}>
            {status}
          </p>
        );
      },
    },
  ], []);

  return (
    <DataTable columns={columns} data={payments} showSearch={false} />
  );
}
