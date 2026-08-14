"use client";
import { useEffect } from "react";
import type { WeddingConfig } from "@/types/wedding";
import { interpolate } from "@/engine/interpolation";
import { themeVariables } from "@/engine/theme";
import { WeddingProvider, useWedding } from "./WeddingContext";
import BlockRenderer from "./BlockRenderer";
import Navigation from "./ui/Navigation";
import MusicPlayer from "./ui/MusicPlayer";

function WeddingInner({ config, data, isPreviewMode }: { config: WeddingConfig; data: Record<string, any>; isPreviewMode?: boolean }) {
  const { opened } = useWedding();
  useEffect(() => { 
    if (!isPreviewMode) {
      document.body.style.overflow = opened ? "" : "hidden"; 
    }
    return () => { 
      if (!isPreviewMode) document.body.style.overflow = ""; 
    }; 
  }, [opened, isPreviewMode]);
  const mergedData = { ...(config.data ?? {}), ...data };
  const blocks = config.blocks.map((block) => interpolate(block, mergedData));
  const music = config.settings?.music;
  const nav = config.settings?.navigation;
  return <main className="wedding-root relative h-full w-full" style={themeVariables(config)}>{blocks.map((block, index) => <BlockRenderer key={block.id || index} block={block} data={mergedData} />)}{opened && nav?.enabled !== false && <Navigation labels={nav?.labels} />}{opened && music?.enabled !== false && music?.source && <MusicPlayer source={music.source} autoplay={music.autoplay} loop={music.loop} volume={music.volume} />}</main>;
}

export default function WeddingRenderer({ config, data = {}, isPreviewMode }: { config: WeddingConfig; data?: Record<string, any>; isPreviewMode?: boolean }) { return <WeddingProvider><WeddingInner config={config} data={data} isPreviewMode={isPreviewMode} /></WeddingProvider>; }
