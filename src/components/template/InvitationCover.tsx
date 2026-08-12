"use client";

import { useState } from "react";
import { getFontVariable } from "@/lib/fonts";

interface InvitationCoverProps {
  guestName: string;
  bride: string;
  groom: string;
  onOpen: () => void;
  config: any;
}

export default function InvitationCover({ guestName, bride, groom, onOpen, config }: InvitationCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const headingFontClass = getFontVariable(config?.typography?.headingFont || "playfair");
  const headingStyle = { fontFamily: `var(--font-${config?.typography?.headingFont || "playfair"})` };
  
  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 800); // Matches transition duration
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background)] transition-transform duration-1000 ease-in-out ${isOpening ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
      
      <div className="z-10 text-center px-4 max-w-lg w-full flex flex-col items-center justify-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-sans">
            The Wedding Of
          </p>
          <h1 
            className="text-6xl text-[var(--color-primary)] sm:text-7xl"
            style={headingStyle}
          >
            {bride} & {groom}
          </h1>
        </div>

        <div className="my-10 h-px w-32 bg-[var(--color-secondary)]"></div>

        <div className="space-y-4 rounded-xl border border-[var(--color-secondary)] bg-[#ffffff90] backdrop-blur p-8 w-full shadow-lg">
          <p className="text-sm text-[var(--color-text)] opacity-80">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="text-3xl font-semibold text-[var(--color-primary)]" style={headingStyle}>
            {guestName}
          </p>
          <p className="text-xs italic text-[var(--color-text)] opacity-60">
            *Mohon maaf apabila ada kesalahan penulisan nama/gelar.
          </p>
        </div>

        <button 
          onClick={handleOpen}
          className="mt-8 rounded-full bg-[var(--color-primary)] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/>
            <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2h0a2 2 0 0 1 2 2v0a2 2 0 0 0 2 2h1.5a2 2 0 0 1 1.5.66"/>
            <path d="M2 15h4.5a2 2 0 0 1 2 2v4.5"/>
            <path d="M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10Z"/>
          </svg>
          Buka Undangan
        </button>
      </div>
    </div>
  );
}
