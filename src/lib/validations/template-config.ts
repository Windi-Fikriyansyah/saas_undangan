import { z } from "zod";

export const templateConfigSchema = z.object({
  colors: z.object({
    primary: z.string().default("#1e3a8a"),    // e.g. Tailwind blue-900
    secondary: z.string().default("#bfdbfe"),  // e.g. Tailwind blue-200
    accent: z.string().default("#d97706"),     // e.g. Tailwind amber-600
    background: z.string().default("#ffffff"),
    text: z.string().default("#1f2937"),       // e.g. Tailwind gray-800
  }).default({}),
  typography: z.object({
    headingFont: z.string().default("playfair"), // Will map to a curated font key
    bodyFont: z.string().default("inter"),       // Will map to a curated font key
  }).default({}),
  layout: z.object({
    heroStyle: z.enum(["center", "split", "fullscreen"]).default("center"),
  }).default({}),
  features: z.object({
    showGallery: z.boolean().default(true),
    showLoveStory: z.boolean().default(true),
    showLiveStream: z.boolean().default(true),
    showGift: z.boolean().default(true),
  }).default({}),
  blocks: z.array(
    z.object({
      id: z.string().optional(),
      type: z.string(),
      props: z.record(z.any()).default({}),
    })
  ).optional(),
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
