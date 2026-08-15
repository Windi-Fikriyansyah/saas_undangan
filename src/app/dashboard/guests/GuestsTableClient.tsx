"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/ui/badge/Badge";

interface GuestsTableClientProps {
  guests: any[];
}

export default function GuestsTableClient({ guests }: GuestsTableClientProps) {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "order.clientName",
      header: "Klien / Pesanan",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-black dark:text-white">
          {row.original.order?.clientName || "-"}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Tamu",
      cell: ({ row }) => (
        <span className="text-sm text-black dark:text-white">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "rsvpStatus",
      header: "RSVP",
      cell: ({ row }) => {
        let badgeColor = "primary";
        if (row.original.rsvpStatus === "HADIR") badgeColor = "success";
        if (row.original.rsvpStatus === "TIDAK_HADIR") badgeColor = "error";
        if (row.original.rsvpStatus === "RAGU") badgeColor = "warning";
        return (
          <Badge size="sm" color={badgeColor as any}>
            {row.original.rsvpStatus} ({row.original.rsvpCount})
          </Badge>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Pesan",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm text-black dark:text-white" title={row.original.message}>
          {row.original.message || "-"}
        </div>
      ),
    },
    {
      accessorKey: "openCount",
      header: "Jml. Buka",
      cell: ({ row }) => (
        <span className="text-sm text-black dark:text-white text-center">
          {row.original.openCount}x
        </span>
      ),
    },
  ], []);

  return (
    <DataTable columns={columns} data={guests} showSearch searchKey="name" searchPlaceholder="Cari nama tamu..." />
  );
}
