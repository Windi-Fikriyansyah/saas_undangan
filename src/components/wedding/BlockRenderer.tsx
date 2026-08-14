"use client";
import { BlockRegistry } from "@/engine/registry";
import ResponsiveFrame from "./ui/ResponsiveFrame";
import type { WeddingBlock } from "@/types/wedding";

export default function BlockRenderer({ block }: { block: WeddingBlock }) {
  const Component = BlockRegistry[block.type];
  if (!Component) return null;
  if (block.type === "cover") return <Component {...block.props} animation={block.animation} />;
  return <ResponsiveFrame block={block}><Component {...block.props} animation={block.animation} /></ResponsiveFrame>;
}
