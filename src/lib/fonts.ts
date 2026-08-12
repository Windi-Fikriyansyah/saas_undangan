import { 
  Inter, 
  Playfair_Display, 
  Lora, 
  Great_Vibes, 
  Montserrat,
  Dancing_Script 
} from "next/font/google";

// Curated Fonts Definition

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script" });

// Font Registry
export const curatedFonts = {
  inter: inter.variable,
  montserrat: montserrat.variable,
  playfair: playfair.variable,
  lora: lora.variable,
  "great-vibes": greatVibes.variable,
  "dancing-script": dancingScript.variable,
};

// Helper to get font variable class
export function getFontVariable(fontKey: string): string {
  return curatedFonts[fontKey as keyof typeof curatedFonts] || curatedFonts.inter;
}

// A generic string of all variables to attach to the root HTML if needed,
// but usually we can just return the specific ones needed for a template.
export function getTemplateFontVariables(headingFont: string, bodyFont: string): string {
  const heading = getFontVariable(headingFont);
  const body = getFontVariable(bodyFont);
  // Return string of classes e.g., "var(--font-playfair) var(--font-inter)"
  // Actually, we inject them into className
  return `${heading} ${body}`;
}
