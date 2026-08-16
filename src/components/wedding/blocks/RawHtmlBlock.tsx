"use client";
import { useRef } from "react";

export default function RawHtmlBlock({ html, data }: { html: string, data?: any }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // We let CSS handle the dimensions (fixed inset-0) so it perfectly fits 
  // its containing block, allowing the iframe's internal scrollbar to work.

  const scriptToInject = `
    <script>
      // Mock URLSearchParams so the template can read query parameters from the parent window
      (function() {
        try {
          const parentSearch = window.parent.location.search;
          const OriginalURLSearchParams = window.URLSearchParams;
          window.URLSearchParams = function(init) {
            if (init === undefined || init === '' || init === window.location.search) {
              return new OriginalURLSearchParams(parentSearch);
            }
            return new OriginalURLSearchParams(init);
          };
        } catch(e) {} // Ignore cross-origin errors if any
      })();

      window.addEventListener('DOMContentLoaded', () => {
        const data = ${JSON.stringify(data || {})};
        
        function getPath(obj, path) {
          if (!path) return undefined;
          return path.split('.').reduce((acc, key) => acc?.[key], obj);
        }

        document.querySelectorAll('[data-var]').forEach(el => {
          const varName = el.getAttribute('data-var');
          if (!varName) return;
          
          const value = getPath(data, varName);
          if (value !== undefined && value !== null && value !== '') {
            const varType = el.getAttribute('data-var-type');
            if (varType === 'image' && el.tagName === 'IMG') {
              el.src = value;
            } else if (varType === 'background') {
              el.style.backgroundImage = 'url(' + value + ')';
            } else if (varType === 'countdown') {
              // Set up countdown logic
              const targetDate = new Date(value).getTime();
              if (!isNaN(targetDate)) {
                // Initial update
                updateCountdown(el, targetDate);
                // Start interval
                setInterval(() => updateCountdown(el, targetDate), 1000);
              }
            } else if (varType === 'date' || varType === 'datetime') {
              // Format date nicely
              const d = new Date(value);
              if (!isNaN(d.getTime())) {
                const options = varType === 'datetime' 
                  ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                  : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formatted = d.toLocaleDateString('id-ID', options);
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                  el.value = formatted;
                } else {
                  el.textContent = formatted;
                }
              }
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.value = value;
            } else {
              el.textContent = value;
            }
          }
        });
        
        function updateCountdown(el, targetDate) {
          const now = new Date().getTime();
          const distance = targetDate - now;
          if (distance < 0) return; // Expired
          
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          const dEl = el.querySelector('.days, .hari, [data-time="days"]');
          const hEl = el.querySelector('.hours, .jam, [data-time="hours"]');
          const mEl = el.querySelector('.minutes, .menit, [data-time="minutes"]');
          const sEl = el.querySelector('.seconds, .detik, [data-time="seconds"]');
          
          if (dEl || hEl || mEl || sEl) {
            if (dEl) dEl.textContent = days.toString().padStart(2, '0');
            if (hEl) hEl.textContent = hours.toString().padStart(2, '0');
            if (mEl) mEl.textContent = minutes.toString().padStart(2, '0');
            if (sEl) sEl.textContent = seconds.toString().padStart(2, '0');
          } else {
            // Fallback if no specific children found
            el.textContent = days + " Hari " + hours + " Jam " + minutes + " Menit " + seconds + " Detik";
          }
        }
      });
    </script>
    `;

  const finalHtml = html + scriptToInject;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={finalHtml}
      className="w-full h-full absolute inset-0 border-none z-10"
      title="Custom HTML Template"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}
