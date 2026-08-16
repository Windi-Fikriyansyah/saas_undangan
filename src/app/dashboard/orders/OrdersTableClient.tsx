"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/ui/badge/Badge";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import { OrderStatus } from "@/generated/prisma/client";

interface OrdersTableClientProps {
  orders: any[];
  templates: any[];
}

export default function OrdersTableClient({ orders, templates }: OrdersTableClientProps) {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "clientName",
      header: "Klien",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-black dark:text-white">
            {row.original.clientName}
          </span>
          <span className="text-sm text-gray-500">
            /{row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "clientWa",
      header: "WhatsApp",
      cell: ({ row }) => (
        <span className="text-sm text-black dark:text-white">
          {row.original.clientWa}
        </span>
      ),
    },
    {
      accessorKey: "templateId",
      header: "Template",
      cell: ({ row }) => {
        const template = templates.find(t => t.id === row.original.templateId);
        return (
          <span className="text-sm text-black dark:text-white">
            {template?.name || 'Custom'}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Tgl Dibuat",
      cell: ({ row }) => (
        <span className="text-sm text-black dark:text-white">
          {new Date(row.original.createdAt).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Masa Aktif",
      cell: ({ row }) => (
        <span className="text-sm text-black dark:text-white">
          {row.original.expiresAt ? new Date(row.original.expiresAt).toLocaleDateString("id-ID") : "Selamanya"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        let statusText = row.original.status;
        let badgeColor = "warning";
        
        // Dynamically compute EXPIRED if expiresAt is passed
        const isExpired = row.original.status === "EXPIRED" || (row.original.expiresAt && new Date(row.original.expiresAt) < new Date());

        if (isExpired) {
          statusText = "EXPIRED";
          badgeColor = "error";
        } else if (statusText === "LIVE") {
          badgeColor = "success";
        }

        return (
          <Badge size="sm" color={badgeColor as any}>
            {statusText}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CopyLinkButton clientToken={row.original.clientToken} />
          <a
            href={`/dashboard/orders/${row.original.id}/edit`}
            className="inline-flex items-center justify-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            title="Edit Data Undangan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </a>
        </div>
      ),
    },
  ], [templates]);

  return (
    <DataTable columns={columns} data={orders} showSearch searchKey="clientName" searchPlaceholder="Cari klien..." />
  );
}
