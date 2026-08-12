"use client";

import { useState, useRef, useEffect } from "react";
import InvitationCover from "./InvitationCover";
import TemplateEngine from "./TemplateEngine";
import ThemeProvider from "./ThemeProvider";
import { ClientFormData } from "@/lib/validations/client-form";

interface InvitationWrapperProps {
  order: {
    id: string;
    dataJson: any;
    template: {
      id: string;
      configJson: any;
    };
    guests?: any[];
  };
  guestName: string;
  isWhiteLabel?: boolean;
}

export default function InvitationWrapper({ order, guestName, isWhiteLabel = false }: InvitationWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const data = order.dataJson as ClientFormData;
  const config = order.template.configJson;
  const templateName = order.template.id;
  const orderId = order.id;
  const guests = order.guests || [];

  const bride = data.step1?.brideNickname || "Romeo";
  const groom = data.step1?.groomNickname || "Juliet";
  
  // Dummy audio for demonstration if none is provided. In future, this can come from `data`
  const audioUrl = "/audio/wedding-bgm.mp3"; 

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    
    // Fire and forget server action to record the open event
    import("@/app/actions/guest").then(module => {
      module.recordInvitationOpen(orderId, guestName).catch(console.error);
    });
  };

  useEffect(() => {
    // Attempt to preload audio
    if (typeof window !== "undefined" && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  return (
    <ThemeProvider config={config}>
      {!isOpen && (
        <InvitationCover 
          guestName={guestName} 
          bride={bride} 
          groom={groom} 
          config={config} 
          onOpen={handleOpen} 
        />
      )}
      
      {/* 
        We render the engine but hide it via CSS or just let it render behind the cover 
        so it preloads fonts/images. Cover is fixed z-50.
      */}
      <div className={`transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 h-screen overflow-hidden"} relative pb-16`}>
        <TemplateEngine 
          templateName={templateName}
          data={data}
          config={config}
          orderId={orderId}
          guests={guests}
          guestName={guestName}
        />
        
        {!isWhiteLabel && isOpen && (
          <div className="fixed bottom-0 left-0 w-full z-[100] flex justify-center pb-4 pointer-events-none">
            <a 
              href={process.env.NEXT_PUBLIC_MAIN_DOMAIN ? `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN}` : "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-black/80 shadow-lg"
            >
              <span>Made with <strong>SaaS Undangan</strong></span>
            </a>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
