"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantPrisma, prisma } from "@/lib/db";
import { generateClientToken, generateSlug } from "@/lib/utils/token";
import { PLAN_LIMITS } from "@/lib/constants/billing";

interface CreateOrderParams {
  clientName: string;
  clientWa: string;
  expiresInDays?: number;
  templateId?: string;
}

export async function createOrder({
  clientName,
  clientWa,
  expiresInDays = 30,
  templateId,
}: CreateOrderParams) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session?.user as any).id;
  const tenantPrisma = getTenantPrisma(vendorId);

  // Check Quota
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new Error("Vendor not found");

  const limits = PLAN_LIMITS[vendor.planType];
  const orderCount = await prisma.order.count({ where: { vendorId } });

  if (orderCount >= limits.maxOrders) {
    throw new Error(`Batas kuota pesanan Anda (${limits.maxOrders}) telah habis. Silakan upgrade paket.`);
  }

  // Use provided templateId or grab first active
  let template = await prisma.template.findFirst({
    where: { 
      isActive: true,
      ...(templateId ? { id: templateId } : {})
    },
  });

  if (!template) {
    template = await prisma.template.create({
      data: {
        name: "Default Template",
        category: "Wedding",
        configJson: {},
      }
    });
  }

  const clientToken = generateClientToken();
  const slug = generateSlug(clientName);
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const order = await tenantPrisma.order.create({
    data: {
      vendorId, // Pass it explicitly to satisfy TS, though extension might override it
      templateId: template.id,
      clientName,
      clientWa,
      slug,
      clientToken,
      expiresAt,
    },
  });

  return order;
}

export async function validateClientToken(token: string) {
  const order = await prisma.order.findUnique({
    where: { clientToken: token },
    include: { vendor: true, template: true }
  });

  if (!order) {
    return { valid: false, reason: "Link tidak ditemukan." };
  }

  if (order.status === "EXPIRED") {
    return { valid: false, reason: "Link telah kedaluwarsa." };
  }

  // Check custom expiration date
  if (order.expiresAt && order.expiresAt < new Date()) {
    // Optionally update status to EXPIRED in DB
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "EXPIRED" }
    });
    return { valid: false, reason: "Masa aktif link telah habis." };
  }
  
  // If no expiresAt is set, we fall back to checking if it's older than 30 days
  if (!order.expiresAt) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (order.createdAt < thirtyDaysAgo) {
      return { valid: false, reason: "Masa aktif link (30 hari) telah habis." };
    }
  }

  return { valid: true, order };
}

export async function updateOrderData(orderId: string, dataJson: any) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session?.user as any).id;
  const tenantPrisma = getTenantPrisma(vendorId);

  // Parse if string
  let parsedData = dataJson;
  if (typeof dataJson === 'string') {
    try {
      parsedData = JSON.parse(dataJson);
    } catch (e) {
      throw new Error("Invalid JSON data format");
    }
  }

  const order = await tenantPrisma.order.update({
    where: { id: orderId, vendorId },
    data: {
      dataJson: parsedData,
    }
  });

  return order;
}
