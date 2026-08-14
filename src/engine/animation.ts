import type { Variants } from "framer-motion";

export function getRevealVariants(type = "fade-up"): Variants {
  const common = { transition: { ease: "easeOut" as const } };
  const map: Record<string, Variants> = {
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1, ...common } },
    "fade-up": { hidden: { opacity: 0, y: 42 }, visible: { opacity: 1, y: 0, ...common } },
    "fade-down": { hidden: { opacity: 0, y: -42 }, visible: { opacity: 1, y: 0, ...common } },
    "fade-left": { hidden: { opacity: 0, x: 42 }, visible: { opacity: 1, x: 0, ...common } },
    "fade-right": { hidden: { opacity: 0, x: -42 }, visible: { opacity: 1, x: 0, ...common } },
    scale: { hidden: { opacity: 0, scale: .92 }, visible: { opacity: 1, scale: 1, ...common } },
    "blur-to-sharp": { hidden: { opacity: 0, filter: "blur(18px)" }, visible: { opacity: 1, filter: "blur(0px)", ...common } },
    "clip-reveal": { hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" }, visible: { opacity: 1, clipPath: "inset(0 0 0% 0)", ...common } },
    "3d-reveal": { hidden: { opacity: 0, rotateX: 10, y: 30 }, visible: { opacity: 1, rotateX: 0, y: 0, ...common } },
    none: { hidden: {}, visible: {} }
  };
  return map[type] ?? map["fade-up"];
}
