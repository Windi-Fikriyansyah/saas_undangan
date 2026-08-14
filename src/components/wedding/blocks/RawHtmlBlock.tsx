"use client";
import { useEffect, useRef } from "react";

export default function RawHtmlBlock({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Resize iframe to fit content if needed, but since this is a full-page template,
    // we can just make it take the full screen height.
    const adjustHeight = () => {
      if (iframeRef.current) {
        // Full viewport height
        iframeRef.current.style.height = '100vh';
      }
    };
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      className="w-full border-none fixed inset-0 z-[9999]"
      title="Custom HTML Template"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}
