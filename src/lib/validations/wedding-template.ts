import { z } from "zod";

// 1. Global Settings
export const GlobalSettingsSchema = z.object({
  theme: z.string().default("classic"),
  music: z.object({
    enabled: z.boolean().default(false),
    url: z.string().optional(),
    autoplay: z.boolean().default(true),
  }),
  typography: z.object({
    headingFont: z.string().default("Playfair Display"),
    bodyFont: z.string().default("Inter"),
  }),
  background: z.object({
    color: z.string().default("#ffffff"),
    imageUrl: z.string().optional(),
  })
});

// 2. Block Schema Base
export const BlockSchema = z.object({
  id: z.string(), // Unique ID per block instance on the canvas
  type: z.string(), // Maps to BlockRegistry (e.g., "heading", "cover")
  props: z.record(z.any()), // Component-specific props (text, color, sizes)
  bindings: z.record(z.string()).optional(), // Maps props to client data variables (e.g., text -> "couple.groom.name")
  animation: z.object({
    type: z.string(),
    duration: z.number().default(600),
    delay: z.number().default(0),
  }).optional(),
});

// To support nested children (like Container -> blocks), we need to use z.lazy
export const RecursiveBlockSchema: z.ZodType<any> = z.lazy(() => 
  BlockSchema.extend({
    children: z.array(RecursiveBlockSchema).optional(),
  })
);

export type BuilderBlock = z.infer<typeof BlockSchema> & {
  children?: BuilderBlock[];
};

export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>;

// 3. Root Template Schema
export const TemplateConfigSchema = z.object({
  version: z.string().default("2.0.0"),
  global: GlobalSettingsSchema,
  blocks: z.array(RecursiveBlockSchema),
});

export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;

export const defaultTemplateConfig: TemplateConfig = {
  version: "2.0.0",
  global: {
    theme: "classic",
    music: { enabled: false, autoplay: true },
    typography: { headingFont: "Playfair Display", bodyFont: "Inter" },
    background: { color: "#ffffff" }
  },
  blocks: []
};
