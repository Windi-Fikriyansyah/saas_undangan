"use client";
import { BlockRegistry } from "@/engine/registry";
import ResponsiveFrame from "./ui/ResponsiveFrame";
import type { WeddingBlock } from "@/types/wedding";

export default function BlockRenderer({ block, data }: { block: WeddingBlock, data?: any }) {
  const Component = BlockRegistry[block.type];
  if (!Component) return null;
  if (block.type === "cover" || block.type === "raw-html") return <Component {...block.props} animation={block.animation} data={data} />;
  return <ResponsiveFrame block={block}><Component {...block.props} animation={block.animation} data={data} /></ResponsiveFrame>;
}
