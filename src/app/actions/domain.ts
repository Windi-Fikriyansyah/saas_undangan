"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const API_BASE = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/custom_hostnames`;

async function fetchCF(endpoint: string, method: string = "GET", body?: any) {
  if (!CF_API_TOKEN || !CF_ZONE_ID) {
    throw new Error("Cloudflare configuration is missing");
  }

  const res = await fetch(endpoint, {
    method,
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return res.json();
}

export async function addCustomDomain(hostname: string) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const vendorId = (session?.user as any).id;

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new Error("Vendor not found");

  if (vendor.planType !== "PRO" && vendor.planType !== "BUSINESS") {
    throw new Error("Custom domain hanya tersedia untuk paket Pro & Business");
  }

  // 1. Add to Cloudflare
  const cfRes = await fetchCF(API_BASE, "POST", {
    hostname,
    ssl: {
      method: "http",
      type: "dv",
      settings: {
        min_tls_version: "1.2"
      }
    }
  });

  if (!cfRes.success) {
    console.error("Cloudflare Add Error:", cfRes.errors);
    throw new Error(cfRes.errors?.[0]?.message || "Gagal menambahkan domain di Cloudflare");
  }

  // 2. Save to database
  await prisma.vendor.update({
    where: { id: vendorId },
    data: { customDomain: hostname }
  });

  return { success: true, data: cfRes.result };
}

export async function removeCustomDomain() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const vendorId = (session?.user as any).id;

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor || !vendor.customDomain) throw new Error("Tidak ada domain aktif");

  // 1. Find the custom hostname ID in Cloudflare
  const listRes = await fetchCF(`${API_BASE}?hostname=${vendor.customDomain}`);
  if (listRes.success && listRes.result?.length > 0) {
    const cfId = listRes.result[0].id;
    // 2. Delete from Cloudflare
    await fetchCF(`${API_BASE}/${cfId}`, "DELETE");
  }

  // 3. Remove from database
  await prisma.vendor.update({
    where: { id: vendorId },
    data: { customDomain: null }
  });

  return { success: true };
}

export async function checkDomainStatus() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  const vendorId = (session?.user as any).id;

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor || !vendor.customDomain) return null;

  try {
    const listRes = await fetchCF(`${API_BASE}?hostname=${vendor.customDomain}`);
    if (listRes.success && listRes.result?.length > 0) {
      return {
        domain: vendor.customDomain,
        status: listRes.result[0].status,
        sslStatus: listRes.result[0].ssl?.status,
      };
    }
  } catch (err) {
    console.error("CF Status Error:", err);
  }

  return { domain: vendor.customDomain, status: "pending", sslStatus: "pending" };
}
