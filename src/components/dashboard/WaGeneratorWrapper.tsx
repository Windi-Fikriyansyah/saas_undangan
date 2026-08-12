"use client";

import { useState } from "react";
import WaGeneratorModal from "./WaGeneratorModal";

interface WaGeneratorWrapperProps {
  orders: { id: string; clientName: string; slug: string }[];
}

export default function WaGeneratorWrapper({ orders }: WaGeneratorWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded bg-success px-4 py-2 font-medium text-white transition hover:bg-success/90"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Kirim Undangan (WA)
      </button>

      <WaGeneratorModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        orders={orders} 
      />
    </>
  );
}
