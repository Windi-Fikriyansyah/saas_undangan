import type { AnimationConfig, BackgroundConfig } from "@/types/wedding";
import Background from "./Background";
import Reveal from "./Reveal";

export default function Section({ children, background, animation, className = "", id }: { children: React.ReactNode; background?: BackgroundConfig; animation?: AnimationConfig; className?: string; id?: string }) {
  return <section id={id} className={`wedding-section min-h-screen px-5 py-20 md:px-10 md:py-28 ${className}`}><Background background={background} /><Reveal animation={animation}>{children}</Reveal></section>;
}
