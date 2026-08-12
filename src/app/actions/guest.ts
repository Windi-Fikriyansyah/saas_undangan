"use server";

import { prisma } from "@/lib/db";
import { RsvpStatus } from "@/generated/prisma/client";
import { generateSlug } from "@/lib/utils/token";

export async function recordInvitationOpen(orderId: string, guestName: string) {
  try {
    const slug = generateSlug(guestName);

    // Find existing guest by orderId and name or slug
    const existingGuest = await prisma.guest.findFirst({
      where: {
        orderId,
        OR: [
          { name: { equals: guestName, mode: "insensitive" } },
          { slug: guestName },
          { slug: slug },
          { slug: { startsWith: guestName + "-" } }
        ]
      },
    });

    if (existingGuest) {
      await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          openCount: { increment: 1 },
          lastOpenedAt: new Date(),
          ...(existingGuest.openedAt ? {} : { openedAt: new Date() }), // set openedAt if null
        },
      });
    } else {
      await prisma.guest.create({
        data: {
          orderId,
          name: guestName,
          slug,
          openCount: 1,
          openedAt: new Date(),
          lastOpenedAt: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to record open:", error);
    return { success: false };
  }
}

export async function submitRsvp(
  orderId: string, 
  data: { name: string; rsvpStatus: string; rsvpCount: number; message: string }
) {
  try {
    const slug = generateSlug(data.name);

    // Find existing
    const existingGuest = await prisma.guest.findFirst({
      where: {
        orderId,
        OR: [
          { name: { equals: data.name, mode: "insensitive" } },
          { slug: data.name },
          { slug: slug },
          { slug: { startsWith: data.name + "-" } }
        ]
      },
    });

    if (existingGuest) {
      await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          rsvpStatus: data.rsvpStatus as RsvpStatus,
          rsvpCount: data.rsvpCount,
          message: data.message,
        },
      });
    } else {
      await prisma.guest.create({
        data: {
          orderId,
          name: data.name,
          slug,
          rsvpStatus: data.rsvpStatus as RsvpStatus,
          rsvpCount: data.rsvpCount,
          message: data.message,
          // Since they submit, we can consider it opened too
          openCount: 1,
          openedAt: new Date(),
          lastOpenedAt: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit RSVP:", error);
    throw new Error("Gagal mengirim RSVP/Pesan.");
  }
}

export async function generateWaLink(orderId: string, guestName: string, waNumber: string, messageTemplate: string) {
  try {
    const slug = generateSlug(guestName);
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    let existingGuest = await prisma.guest.findFirst({
      where: { 
        orderId, 
        OR: [
          { name: { equals: guestName, mode: "insensitive" } },
          { slug: guestName },
          { slug: slug },
          { slug: { startsWith: guestName + "-" } }
        ]
      }
    });

    let finalSlug = slug;
    
    if (existingGuest) {
      finalSlug = existingGuest.slug;
      await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          waNumber: waNumber || null,
          waStatus: "SENT",
          waSentAt: new Date()
        }
      });
    } else {
      await prisma.guest.create({
        data: {
          orderId,
          name: guestName,
          slug: finalSlug,
          waNumber: waNumber || null,
          waStatus: "SENT",
          waSentAt: new Date(),
          openCount: 0
        }
      });
    }

    const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteLink = `${domain}/${order.slug}?to=${finalSlug}`;
    
    // Replace placeholders in the message template
    const parsedMessage = messageTemplate
      .replace(/{{nama}}/g, guestName)
      .replace(/{{link}}/g, inviteLink);

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(parsedMessage);
    
    // Clean WA number (remove +, spaces, leading 0 to 62 if needed)
    let cleanWa = waNumber.replace(/\D/g, "");
    if (cleanWa.startsWith("0")) {
      cleanWa = "62" + cleanWa.slice(1);
    }

    const waUrl = cleanWa 
      ? `https://wa.me/${cleanWa}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;

    return { success: true, waUrl, parsedMessage, inviteLink };
  } catch (error) {
    console.error("Failed to generate WA link:", error);
    throw new Error("Gagal generate link WhatsApp");
  }
}
