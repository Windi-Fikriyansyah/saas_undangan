/**
 * Canvas to Blocks Converter
 * Converts Fabric.js canvas objects into the legacy blocks[] format
 * used by WeddingRenderer for public rendering.
 * 
 * This ensures backward compatibility — templates created in the Fabric builder
 * can still be rendered by the existing WeddingRenderer pipeline.
 */

interface CanvasObject {
  type: string;
  id?: string;
  name?: string;
  text?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  data?: {
    binding?: string;
    bindingType?: string;
    isImagePlaceholder?: boolean;
  };
  [key: string]: any;
}

interface LegacyBlock {
  id: string;
  type: string;
  props: Record<string, any>;
  animation?: {
    type: string;
    duration: number;
  };
}

/**
 * Convert an array of canvas objects into legacy blocks format.
 * This is a best-effort conversion — complex layouts may need manual mapping.
 */
export function canvasToBlocks(
  objects: CanvasObject[],
  bindings: Record<string, string> = {}
): LegacyBlock[] {
  const blocks: LegacyBlock[] = [];

  // Group objects by their section prefix (if they follow naming convention)
  const sectionMap = new Map<string, CanvasObject[]>();
  const ungrouped: CanvasObject[] = [];

  objects.forEach((obj) => {
    if (obj.data?.isGrid) return; // Skip grid lines

    const name = obj.name || "";
    // Check for section prefixes like "Cover", "Couple", "Event", etc.
    const sectionMatch = name.match(/^(Cover|Couple|Event|RSVP|Gift|Gallery|Closing|Home|Souvenir)\s/i);
    if (sectionMatch) {
      const sectionKey = sectionMatch[1].toLowerCase();
      if (!sectionMap.has(sectionKey)) {
        sectionMap.set(sectionKey, []);
      }
      sectionMap.get(sectionKey)!.push(obj);
    } else {
      ungrouped.push(obj);
    }
  });

  // Convert section groups to blocks
  sectionMap.forEach((sectionObjects, sectionType) => {
    const block = convertSectionToBlock(sectionType, sectionObjects, bindings);
    if (block) blocks.push(block);
  });

  // Convert ungrouped objects into a generic "custom" block
  if (ungrouped.length > 0) {
    blocks.push({
      id: "custom-elements",
      type: "raw-html",
      props: {
        html: generateHtmlFromObjects(ungrouped),
      },
    });
  }

  return blocks;
}

function convertSectionToBlock(
  sectionType: string,
  objects: CanvasObject[],
  bindings: Record<string, string>
): LegacyBlock | null {
  const getText = (nameContains: string): string => {
    const obj = objects.find((o) =>
      o.name?.toLowerCase().includes(nameContains.toLowerCase())
    );
    if (!obj) return "";
    // Check for binding
    const id = obj.id || obj.name || "";
    const binding = bindings[id] || obj.data?.binding;
    if (binding) return `{{${binding}}}`;
    return obj.text || "";
  };

  const getImage = (nameContains: string): string => {
    const obj = objects.find((o) =>
      o.name?.toLowerCase().includes(nameContains.toLowerCase())
    );
    if (!obj) return "";
    const id = obj.id || obj.name || "";
    const binding = bindings[id] || obj.data?.binding;
    if (binding) return `{{${binding}}}`;
    return obj.src || "";
  };

  switch (sectionType) {
    case "cover":
      return {
        id: "cover",
        type: "cover",
        props: {
          background: { type: "image", src: "", overlay: "rgba(5,8,6,.52)" },
          eyebrow: getText("eyebrow") || "THE WEDDING OF",
          groom: getText("names")?.split("&")[1]?.trim() || "Groom",
          bride: getText("names")?.split("&")[0]?.trim() || "Bride",
          date: getText("date") || "24 . 08 . 2026",
          button: { text: "OPEN INVITATION" },
        },
        animation: { type: "blur-to-sharp", duration: 1.2 },
      };

    case "couple":
      return {
        id: "couple",
        type: "couple",
        props: {
          eyebrow: getText("label") || "THE COUPLE",
          title: getText("title") || "Bride & Groom",
          bride: {
            name: getText("bride"),
            image: getImage("bride_photo"),
          },
          groom: {
            name: getText("groom"),
            image: getImage("groom_photo"),
          },
        },
        animation: { type: "fade-up", duration: 0.9 },
      };

    case "event":
      return {
        id: "event",
        type: "event",
        props: {
          eyebrow: getText("label") || "SAVE THE DATE",
          title: getText("title") || "Wedding Event",
          events: [
            {
              type: "CEREMONY",
              title: getText("ceremony_title") || "Akad Nikah",
              time: getText("ceremony_time") || "08:00 - 10:00 WIB",
              venue: getText("ceremony_venue") || "Venue",
            },
          ],
        },
        animation: { type: "fade-up", duration: 0.9 },
      };

    case "rsvp":
      return {
        id: "rsvp",
        type: "rsvp",
        props: {
          eyebrow: getText("label") || "KINDLY RESPOND",
          title: getText("title") || "Are You Attending?",
          form: { enabled: true },
        },
        animation: { type: "fade-up", duration: 0.9 },
      };

    case "gift":
      return {
        id: "gift",
        type: "gift",
        props: {
          eyebrow: getText("label") || "WEDDING GIFT",
          title: getText("title") || "Your Presence Is Our Greatest Gift",
          accounts: [],
        },
        animation: { type: "fade-up", duration: 0.9 },
      };

    case "closing":
      return {
        id: "closing",
        type: "closing",
        props: {
          eyebrow: getText("label") || "WITH LOVE",
          title: getText("title") || "Thank You",
          names: getText("names") || "Bride & Groom",
        },
        animation: { type: "blur-to-sharp", duration: 1.2 },
      };

    default:
      return null;
  }
}

/**
 * Generate a simple HTML representation from canvas objects.
 * Used as fallback for objects that don't map to known block types.
 */
function generateHtmlFromObjects(objects: CanvasObject[]): string {
  const elements = objects.map((obj) => {
    const style = [
      `position: absolute`,
      `left: ${obj.left || 0}px`,
      `top: ${obj.top || 0}px`,
    ];

    if (obj.type === "textbox" || obj.type === "i-text") {
      style.push(
        `font-family: ${obj.fontFamily || "sans-serif"}`,
        `font-size: ${obj.fontSize || 16}px`,
        `color: ${obj.fill || "#fff"}`,
        `text-align: ${obj.textAlign || "left"}`
      );
      if (obj.width) style.push(`width: ${obj.width}px`);

      const binding = obj.data?.binding;
      const dataAttr = binding ? ` data-var="${binding}"` : "";
      return `<div style="${style.join("; ")}"${dataAttr}>${obj.text || ""}</div>`;
    }

    if (obj.type === "rect") {
      style.push(
        `width: ${obj.width || 100}px`,
        `height: ${obj.height || 100}px`,
        `background: ${obj.fill || "transparent"}`
      );
      if (obj.rx) style.push(`border-radius: ${obj.rx}px`);
      if (obj.stroke) style.push(`border: ${obj.strokeWidth || 1}px solid ${obj.stroke}`);
      return `<div style="${style.join("; ")}"></div>`;
    }

    return "";
  });

  return `<div style="position: relative; width: 100%; min-height: 100vh;">${elements.join("\n")}</div>`;
}
