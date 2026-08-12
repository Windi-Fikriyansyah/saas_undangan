import dynamic from "next/dynamic";

// Define a common interface that all templates will receive
export interface TemplateProps {
  templateName: string;
  data: any; // Ideally ClientFormData, but using any for flexibility across components
  config: any; // TemplateConfig
  orderId?: string;
  guests?: any[];
  guestName?: string;
}

// Lazy-load template components so that only the requested template is bundled/loaded
export const templateRegistry: Record<string, React.ComponentType<TemplateProps>> = {
  "minimalist-1": dynamic(() => import("./designs/MinimalistTemplate")),
  "rustic-1": dynamic(() => import("./designs/RusticTemplate")),
  "elegan-1": dynamic(() => import("./designs/EleganTemplate")),
};
