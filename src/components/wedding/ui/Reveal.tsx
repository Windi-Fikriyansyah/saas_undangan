"use client";
import { motion } from "framer-motion";
import { getRevealVariants } from "@/engine/animation";
import type { AnimationConfig } from "@/types/wedding";

export default function Reveal({ children, animation }: { children: React.ReactNode; animation?: Partial<AnimationConfig> }) {
  const a = animation ?? { type: "fade-up", duration: .8, delay: 0, once: true, amount: .2, stagger: .08 };
  return <motion.div initial="hidden" whileInView="visible" viewport={{ once: a.once, amount: a.amount }} variants={getRevealVariants(a.type)} transition={{ duration: a.duration, delay: a.delay }} style={{ transformPerspective: 1000 }}>{children}</motion.div>;
}
