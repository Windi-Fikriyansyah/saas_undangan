import { z } from "zod";

export const step1Schema = z.object({
  brideName: z.string().min(1, "Nama lengkap mempelai wanita wajib diisi"),
  brideNickname: z.string().min(1, "Nama panggilan wajib diisi"),
  brideParents: z.string().min(1, "Nama orang tua wajib diisi"),
  brideIg: z.string().optional(),
  groomName: z.string().min(1, "Nama lengkap mempelai pria wajib diisi"),
  groomNickname: z.string().min(1, "Nama panggilan wajib diisi"),
  groomParents: z.string().min(1, "Nama orang tua wajib diisi"),
  groomIg: z.string().optional(),
});

export const step2Schema = z.object({
  akadDate: z.string().min(1, "Tanggal akad wajib diisi"),
  akadTime: z.string().min(1, "Waktu akad wajib diisi"),
  akadVenue: z.string().min(1, "Tempat akad wajib diisi"),
  akadAddress: z.string().min(1, "Alamat akad wajib diisi"),
  resepsiDate: z.string().min(1, "Tanggal resepsi wajib diisi"),
  resepsiTime: z.string().min(1, "Waktu resepsi wajib diisi"),
  resepsiVenue: z.string().min(1, "Tempat resepsi wajib diisi"),
  resepsiAddress: z.string().min(1, "Alamat resepsi wajib diisi"),
  gmapsLink: z.string().url("Link Google Maps tidak valid").optional().or(z.literal("")),
});

export const step3Schema = z.object({
  galleryImages: z.array(z.string()).max(10, "Maksimal 10 foto"),
  videoLink: z.string().url("Link video tidak valid").optional().or(z.literal("")),
  loveStory: z.string().optional(),
});

export const step4Schema = z.object({
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAccountName: z.string().optional(),
  liveStreamLink: z.string().url("Link live streaming tidak valid").optional().or(z.literal("")),
  quotes: z.string().optional(),
});

export const clientFormSchema = z.object({
  step1: step1Schema.optional(),
  step2: step2Schema.optional(),
  step3: step3Schema.optional(),
  step4: step4Schema.optional(),
  customData: z.record(z.any()).optional(),
  isCompleted: z.boolean().default(false),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
