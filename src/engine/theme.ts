import type { CSSProperties } from "react";
import type { WeddingConfig } from "@/types/wedding";

export function themeVariables(config: WeddingConfig): CSSProperties {
  const c = config.colors as Record<string, string>;
  const t = config.typography as Record<string, any>;
  return {
    "--w-bg": c.background ?? "#0b0d0c",
    "--w-fg": c.foreground ?? "#f5f2ea",
    "--w-primary": c.primary ?? "#d8d0bd",
    "--w-secondary": c.secondary ?? "#879181",
    "--w-accent": c.accent ?? "#c8b58a",
    "--w-muted": c.muted ?? "#a8aea4",
    "--w-dark": c.dark ?? "#0b0d0c",
    "--w-glass": c.glass ?? "rgba(255,255,255,.12)",
    "--w-border": c.border ?? "rgba(255,255,255,.22)",
    "--font-heading": t.heading?.family ?? "Cormorant Garamond, serif",
    "--font-body": t.body?.family ?? "DM Sans, sans-serif"
  } as CSSProperties;
}
