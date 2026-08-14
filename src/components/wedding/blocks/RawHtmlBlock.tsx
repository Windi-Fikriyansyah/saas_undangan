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
          // Only overwrite if the value is truthy (not undefined, null, or empty string).
          // Otherwise, it keeps the default text originally present in the HTML.
          if (value !== undefined && value !== null && value !== '') {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.value = value;
            } else {
              el.textContent = value;
            }
          }
        });
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
