"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import type { BackgroundConfig } from "@/types/wedding";

export default function Background({ background }: { background?: BackgroundConfig }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, (background?.parallaxStrength ?? .15) * -100]);
  if (!background) return null;
  const image = background.type === "image" && background.src ? `url(${background.src})` : undefined;
  const backgroundImage = image ? `${background.overlay ? `linear-gradient(${background.overlay},${background.overlay}),` : ""}${image}` : undefined;
  return <motion.div aria-hidden className="absolute inset-0 -z-10 overflow-hidden" style={{ y: background.parallax ? y : 0 }}><div className="absolute -inset-[6%]" style={{ background: background.type === "solid" ? background.value : background.type === "gradient" ? background.value : undefined, backgroundImage, backgroundSize: background.size, backgroundPosition: background.position, filter: background.blur ? `blur(${background.blur}px)` : undefined }} /><div className="absolute inset-0 bg-black/5" /></motion.div>;
}
