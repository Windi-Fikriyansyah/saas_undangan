"use server";

import { prisma } from "@/lib/db";
import { clientFormSchema } from "@/lib/validations/client-form";

export async function saveClientFormStep(
  clientToken: string,
  stepKey: string,
  stepData: any
) {
  // Validate token exists and is not expired
  const order = await prisma.order.findUnique({
    where: { clientToken }
  });

  if (!order) {
    throw new Error("Link tidak valid");
  }

  if (order.status === "EXPIRED" || order.status === "LIVE") {
    throw new Error("Formulir ini sudah dikunci atau kedaluwarsa");
  }

  // Current data
  const currentData = (order.dataJson as any) || {};
  
  // Merge new step data
  currentData[stepKey] = stepData;

  // Validate the partial data format just in case
  const parsedData = clientFormSchema.safeParse(currentData);
  const dataToSave = parsedData.success ? parsedData.data : currentData;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      dataJson: dataToSave,
      status: "FILLING", // Mark as filling since they started saving
    }
  });

  return { success: true };
}

export async function submitFinalClientForm(clientToken: string) {
  const order = await prisma.order.findUnique({
    where: { clientToken }
  });

  if (!order) {
    throw new Error("Link tidak valid");
  }

  if (order.status === "EXPIRED" || order.status === "LIVE") {
    throw new Error("Formulir ini sudah dikunci atau kedaluwarsa");
  }

  const currentData = (order.dataJson as any) || {};
  currentData.isCompleted = true;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      dataJson: currentData,
      status: "LIVE", // Lock the form
    }
  });

  return { success: true };
}
