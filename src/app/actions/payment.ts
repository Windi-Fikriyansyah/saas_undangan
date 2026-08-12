"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PlanType } from "@/generated/prisma/client";

export async function createPaymentRequest(planType: PlanType, amount: number) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session?.user as any).id;
  const orderId = `SUB-${vendorId}-${planType}-${Date.now()}`;

  // Create PENDING payment
  await prisma.payment.create({
    data: {
      vendorId,
      planType,
      amount,
      status: "PENDING",
      orderId,
    }
  });

  const slug = process.env.PAKASIR_PROJECT_SLUG || "demo";
  const redirectUrl = encodeURIComponent(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/subscription/callback`);
  
  return `https://app.pakasir.com/pay/${slug}/${amount}?order_id=${orderId}&redirect=${redirectUrl}`;
}
