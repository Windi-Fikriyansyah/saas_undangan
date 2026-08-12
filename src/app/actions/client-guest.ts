"use server";

import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils/token";
import { RsvpStatus } from "@/generated/prisma/client";

async function validateClient(clientToken: string) {
  const order = await prisma.order.findUnique({
    where: { clientToken },
  });

  if (!order) {
    throw new Error("Akses ditolak. Token tidak valid.");
  }

  return order;
}

export async function getGuestsByClient(clientToken: string, search?: string, status?: string) {
  const order = await validateClient(clientToken);

  const whereCondition: any = { orderId: order.id };

  if (search) {
    whereCondition.name = { contains: search, mode: "insensitive" };
  }

  if (status && status !== "ALL") {
    whereCondition.rsvpStatus = status as RsvpStatus;
  }

  const guests = await prisma.guest.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
  });

  return guests;
}

export async function createGuestByClient(
  clientToken: string, 
  data: { name: string; waNumber?: string; category?: string; seatCount?: number }
) {
  const order = await validateClient(clientToken);
  
  const slug = generateSlug(data.name);

  // Check if guest with same name already exists in this order
  const existingGuest = await prisma.guest.findFirst({
    where: { orderId: order.id, name: data.name },
  });

  if (existingGuest) {
    throw new Error(`Tamu dengan nama "${data.name}" sudah ada.`);
  }

  const guest = await prisma.guest.create({
    data: {
      orderId: order.id,
      name: data.name,
      slug,
      waNumber: data.waNumber || null,
      category: data.category || null,
      seatCount: data.seatCount || 1,
      openCount: 0,
    },
  });

  return guest;
}

export async function updateGuestByClient(
  clientToken: string,
  guestId: string,
  data: { name: string; waNumber?: string; category?: string; seatCount?: number; rsvpStatus?: string; rsvpCount?: number }
) {
  const order = await validateClient(clientToken);

  // Ensure guest belongs to this order
  const guest = await prisma.guest.findUnique({
    where: { id: guestId },
  });

  if (!guest || guest.orderId !== order.id) {
    throw new Error("Data tamu tidak ditemukan atau akses ditolak.");
  }

  const slug = generateSlug(data.name);

  const updatedGuest = await prisma.guest.update({
    where: { id: guestId },
    data: {
      name: data.name,
      slug,
      waNumber: data.waNumber || null,
      category: data.category || null,
      seatCount: data.seatCount || 1,
      ...(data.rsvpStatus ? { rsvpStatus: data.rsvpStatus as RsvpStatus } : {}),
      ...(data.rsvpCount !== undefined ? { rsvpCount: data.rsvpCount } : {}),
    },
  });

  return updatedGuest;
}

export async function deleteGuestByClient(clientToken: string, guestId: string) {
  const order = await validateClient(clientToken);

  // Ensure guest belongs to this order
  const guest = await prisma.guest.findUnique({
    where: { id: guestId },
  });

  if (!guest || guest.orderId !== order.id) {
    throw new Error("Data tamu tidak ditemukan atau akses ditolak.");
  }

  await prisma.guest.delete({
    where: { id: guestId },
  });

  return { success: true };
}

export async function bulkCreateGuestsByClient(
  clientToken: string,
  guests: { name: string; waNumber?: string; category?: string; seatCount?: number }[]
) {
  const order = await validateClient(clientToken);

  // Get existing guests to check for duplicates
  const existingGuests = await prisma.guest.findMany({
    where: { orderId: order.id },
    select: { name: true },
  });
  
  const existingNames = new Set(existingGuests.map(g => g.name.toLowerCase()));

  const newGuests = guests
    .filter(g => g.name && g.name.trim() !== "")
    .filter(g => !existingNames.has(g.name.toLowerCase()))
    .map(g => ({
      orderId: order.id,
      name: g.name.trim(),
      slug: generateSlug(g.name.trim()),
      waNumber: g.waNumber || null,
      category: g.category || null,
      seatCount: g.seatCount || 1,
      openCount: 0,
    }));

  if (newGuests.length === 0) {
    return { added: 0, message: "Tidak ada tamu baru yang ditambahkan (semua duplikat atau kosong)." };
  }

  const result = await prisma.guest.createMany({
    data: newGuests,
    skipDuplicates: true,
  });

  return { added: result.count, message: `${result.count} tamu berhasil ditambahkan.` };
}
