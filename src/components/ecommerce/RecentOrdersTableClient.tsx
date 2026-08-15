"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/ui/badge/Badge";

interface RecentOrdersTableClientProps {
  orders: any[];
}

export default function RecentOrdersTableClient({ orders }: RecentOrdersTableClientProps) {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "clientName",
      header: "Klien",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {row.original.clientName}
          </span>
          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
            /{row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "clientWa",
      header: "WhatsApp",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
          {row.original.clientWa}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
          {new Date(row.original.createdAt).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Masa Aktif",
      cell: ({ row }) => (
        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
          {row.original.expiresAt ? new Date(row.original.expiresAt).toLocaleDateString("id-ID") : "Selamanya"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        let badgeColor = "warning";
        if (row.original.status === "LIVE") badgeColor = "success";
        if (row.original.status === "EXPIRED") badgeColor = "error";
        return (
          <Badge size="sm" color={badgeColor as any}>
            {row.original.status}
          </Badge>
        );
      },
    },
  ], []);

  return (
    <DataTable columns={columns} data={orders} showSearch={false} />
  );
}
