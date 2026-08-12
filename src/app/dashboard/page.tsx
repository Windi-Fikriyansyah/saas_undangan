import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import MonthlyOpensChart from "@/components/dashboard/MonthlyOpensChart";
import RsvpStatusChart from "@/components/dashboard/RsvpStatusChart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/db";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vendor Dashboard | Undangan Digital SaaS",
  description: "Vendor Analytics Overview",
};

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect("/api/auth/signin");
  }

  const vendorId = (session?.user as any).id;
  const tenantPrisma = getTenantPrisma(vendorId);

  // Fetch basic metrics
  const [totalOrders, activeOrders, vendor, guests] = await Promise.all([
    tenantPrisma.order.count(),
    tenantPrisma.order.count({ where: { status: 'LIVE' } }),
    prisma.vendor.findUnique({ where: { id: vendorId } }),
    tenantPrisma.guest.findMany({
      where: { order: { vendorId } },
      select: { rsvpStatus: true, rsvpCount: true, openedAt: true, openCount: true }
    })
  ]);

  // Aggregate RSVP
  let hadir = 0, tidakHadir = 0, ragu = 0, pending = 0;
  let totalAttendingGuests = 0; // count seat/rsvpCount

  guests.forEach(g => {
    if (g.rsvpStatus === "HADIR") {
      hadir++;
      totalAttendingGuests += g.rsvpCount || 1;
    } else if (g.rsvpStatus === "TIDAK_HADIR") {
      tidakHadir++;
    } else if (g.rsvpStatus === "RAGU") {
      ragu++;
    } else {
      pending++;
    }
  });

  const metrics = {
    totalOrders,
    activeOrders,
    totalGuests: totalAttendingGuests,
    quotaUsed: vendor?.quotaUsed || 0,
    quotaLimit: vendor?.planType === 'FREE_TRIAL' ? 3 : (vendor?.planType === 'PRO' || vendor?.planType === 'BUSINESS' ? -1 : 10),
  };

  // Aggregate Opens per month (for current year)
  const currentYear = new Date().getFullYear();
  const monthlyOpens = new Array(12).fill(0);

  guests.forEach(g => {
    if (g.openedAt) {
      const date = new Date(g.openedAt);
      if (date.getFullYear() === currentYear) {
        monthlyOpens[date.getMonth()] += (g.openCount > 0 ? g.openCount : 1);
      }
    }
  });

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics metrics={metrics} />
      </div>

      <div className="col-span-12 xl:col-span-8">
        <MonthlyOpensChart data={monthlyOpens} />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <RsvpStatusChart 
          hadir={hadir} 
          tidakHadir={tidakHadir} 
          ragu={ragu} 
          pending={pending} 
        />
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
