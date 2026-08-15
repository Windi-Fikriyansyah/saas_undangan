"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

interface LandingPageTableClientProps {
  landingPages: any[];
}

export default function LandingPageTableClient({ landingPages }: LandingPageTableClientProps) {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Nama Landing Page",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-black dark:text-white">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "slug",
      header: "URL / Slug",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          /{row.original.slug}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge size="sm" color={row.original.isActive ? "success" : "warning"}>
          {row.original.isActive ? "Aktif" : "Tidak Aktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/landingpages/${row.original.id}/edit`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
          <a href={`/${row.original.slug}`} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline">Lihat</Button>
          </a>
        </div>
      ),
    },
  ], []);

  return (
    <DataTable columns={columns} data={landingPages} showSearch searchKey="name" searchPlaceholder="Cari nama..." />
  );
}
