"use client";

import React from "react";
import { BlockRegistry } from "./BlockRegistry";

interface LiveLandingPageProps {
  blocks: any[];
}

export default function LiveLandingPage({ blocks }: LiveLandingPageProps) {
  return (
    <div className="w-full min-h-screen bg-white">
      {blocks.map((block) => {
        const BlockDef = BlockRegistry[block.type];
        if (!BlockDef) return null;

        const Component = BlockDef.component;
        return (
          <div key={block.id} id={block.id}>
            <Component data={block.data} isPreview={false} />
          </div>
        );
      })}
    </div>
  );
}
