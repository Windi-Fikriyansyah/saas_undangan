"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PlanType, TemplateTier } from "@/generated/prisma/client";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).isAdmin) {
    throw new Error("Unauthorized");
  }
}

export async function updateVendorPlan(vendorId: string, planType: string) {
  await checkAdmin();
  
  let planExpiresAt = null;
  if (planType !== "FREE_TRIAL") {
    planExpiresAt = new Date();
    planExpiresAt.setFullYear(planExpiresAt.getFullYear() + 1);
  }

  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      planType: planType as PlanType,
      planExpiresAt
    }
  });
  return { success: true };
}

export async function upsertTemplate(data: {
  id: string;
  name: string;
  category: string;
  tier: string;
  isActive: boolean;
  thumbnailUrl: string;
  configJson: string;
}) {
  await checkAdmin();
  
  let parsedConfig = {};
  try {
    parsedConfig = JSON.parse(data.configJson);
  } catch (e) {
    throw new Error("Invalid config JSON");
  }

  const existing = await prisma.template.findUnique({ where: { id: data.id } });

  if (existing) {
    await prisma.template.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category,
        tier: data.tier as TemplateTier,
        isActive: data.isActive,
        thumbnailUrl: data.thumbnailUrl,
        configJson: parsedConfig
      }
    });
  } else {
    await prisma.template.create({
      data: {
        id: data.id,
        name: data.name,
        category: data.category,
        tier: data.tier as TemplateTier,
        isActive: data.isActive,
        thumbnailUrl: data.thumbnailUrl,
        configJson: parsedConfig
      }
    });
  }

  return { success: true };
}
