import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export const BlockRegistry: Record<string, ComponentType<any>> = {
  cover: dynamic(() => import("@/components/wedding/blocks/CoverBlock")),
  home: dynamic(() => import("@/components/wedding/blocks/HomeBlock")),
  couple: dynamic(() => import("@/components/wedding/blocks/CoupleBlock")),
  event: dynamic(() => import("@/components/wedding/blocks/EventBlock")),
  gallery: dynamic(() => import("@/components/wedding/blocks/GalleryBlock")),
  rsvp: dynamic(() => import("@/components/wedding/blocks/RsvpBlock")),
  gift: dynamic(() => import("@/components/wedding/blocks/GiftBlock")),
  souvenir: dynamic(() => import("@/components/wedding/blocks/SouvenirBlock")),
  closing: dynamic(() => import("@/components/wedding/blocks/ClosingBlock")),
  "raw-html": dynamic(() => import("@/components/wedding/blocks/RawHtmlBlock"))
};

export function hasBlock(type: string) { return Boolean(BlockRegistry[type]); }
