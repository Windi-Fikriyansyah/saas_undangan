"use client";

import { ReactNode } from "react";
import { TemplateConfig } from "@/lib/validations/template-config";
import { getTemplateFontVariables } from "@/lib/fonts";

interface ThemeProviderProps {
  config: TemplateConfig;
  children: ReactNode;
}

export default function ThemeProvider({ config, children }: ThemeProviderProps) {
  // Extract custom properties (CSS Variables) from the config colors
  const cssVariables = {
    "--color-primary": config.colors.primary,
    "--color-secondary": config.colors.secondary,
    "--color-accent": config.colors.accent,
    "--color-background": config.colors.background,
    "--color-text": config.colors.text,
  } as React.CSSProperties;

  // Get the font variable classes
  const fontClasses = getTemplateFontVariables(
    config.typography.headingFont,
    config.typography.bodyFont
  );

  return (
    <div 
      className={`min-h-screen w-full ${fontClasses} text-[var(--color-text)] bg-[var(--color-background)] font-body`}
      style={cssVariables}
    >
      {/* We apply a generic 'font-body' here (assuming tailwind handles it)
          But since we use dynamic variables, we can enforce it via global CSS 
          or inline styles, but Tailwind's typography works best if we configure 
          tailwind.config.ts to map to these variables. 
          For now, we'll just let the components use `font-[var(--font-heading)]` etc.
      */}
      {children}
    </div>
  );
}
