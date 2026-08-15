import { z } from "zod";

export const animationSchema = z.object({
  type: z.enum(["none","fade","fade-up","fade-down","fade-left","fade-right","scale","blur-to-sharp","clip-reveal","slow-zoom","parallax","stagger","3d-reveal"]).default("fade-up"),
  duration: z.number().default(0.8),
  delay: z.number().default(0),
  ease: z.any().optional(),
  once: z.boolean().default(true),
  amount: z.number().min(0).max(1).default(0.2),
  stagger: z.number().default(0.08)
});

export const responsiveSchema = z.object({
  mobile: z.record(z.string(), z.any()).optional(),
  tablet: z.record(z.string(), z.any()).optional(),
  desktop: z.record(z.string(), z.any()).optional()
}).optional();

export const backgroundSchema = z.object({
  type: z.enum(["image","solid","gradient"]).default("solid"),
  src: z.string().optional(),
  value: z.string().optional(),
  position: z.string().default("center"),
  size: z.string().default("cover"),
  overlay: z.string().optional(),
  blur: z.number().default(0),
  parallax: z.boolean().default(false),
  parallaxStrength: z.number().default(0.15)
});

const baseProps = z.object({
  background: backgroundSchema.optional()
});

export const blockSchemas = {
  cover: baseProps.extend({
    eyebrow: z.string().optional(), groom: z.string().optional(), bride: z.string().optional(), date: z.string().optional(),
    description: z.string().optional(), button: z.object({ text: z.string().default("OPEN INVITATION") }).optional()
  }),
  home: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), personalized: z.object({ label: z.string().optional(), guestName: z.string().optional(), parents: z.string().optional() }).optional(), social: z.object({ platform: z.string().optional(), username: z.string().optional(), url: z.string().optional() }).optional()
  }),
  couple: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), intro: z.string().optional(), bride: z.record(z.string(), z.any()).optional(), groom: z.record(z.string(), z.any()).optional()
  }),
  event: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), date: z.string().optional(), countdown: z.object({ enabled: z.boolean().default(true), target: z.string() }).optional(), events: z.array(z.record(z.string(), z.any())).default([])
  }),
  gallery: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), description: z.string().optional(), images: z.array(z.record(z.string(), z.any())).default([]), layout: z.enum(["masonry","grid","single"]).default("masonry"), lightbox: z.boolean().default(true)
  }),
  rsvp: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), description: z.string().optional(), endpoint: z.string().optional(), form: z.object({ enabled: z.boolean().default(true), fields: z.array(z.record(z.string(), z.any())).optional() }).optional()
  }),
  gift: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), description: z.string().optional(), accounts: z.array(z.record(z.string(), z.any())).default([]), qrCode: z.object({ enabled: z.boolean().default(false), src: z.string().optional(), label: z.string().optional() }).optional()
  }),
  souvenir: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), description: z.string().optional(), card: z.record(z.string(), z.any()).optional(), interaction: z.record(z.string(), z.any()).optional()
  }),
  closing: baseProps.extend({
    eyebrow: z.string().optional(), title: z.string().optional(), names: z.string().optional(), date: z.string().optional(), quote: z.string().optional(), signature: z.string().optional()
  })
} as const;

export const blockSchema = z.object({
  id: z.string(),
  type: z.enum(["cover","home","couple","event","gallery","rsvp","gift","souvenir","closing","raw-html"]),
  props: z.record(z.string(), z.any()),
  animation: animationSchema.optional(),
  responsive: responsiveSchema.optional(),
  style: z.record(z.string(), z.any()).optional()
});

export const weddingSchema = z.object({
  version: z.string().default("1.0.0"),
  colors: z.record(z.string(), z.string()),
  typography: z.record(z.string(), z.any()),
  settings: z.object({
    theme: z.string().optional(), smoothScroll: z.boolean().default(true),
    music: z.object({ enabled: z.boolean().default(false), autoplay: z.boolean().default(false), loop: z.boolean().default(true), volume: z.number().min(0).max(1).default(.35), source: z.string().optional() }).optional(),
    navigation: z.object({ enabled: z.boolean().default(true), labels: z.record(z.string(), z.string()).optional() }).optional()
  }).optional(),
  blocks: z.array(blockSchema),
  data: z.record(z.string(), z.any()).optional()
});

export type WeddingConfig = z.infer<typeof weddingSchema>;
export type WeddingBlock = z.infer<typeof blockSchema>;
export type AnimationConfig = z.infer<typeof animationSchema>;
export type BackgroundConfig = z.infer<typeof backgroundSchema>;
