import React from "react";

/**
 * StaticBlockRenderer - Server Component
 * 
 * Renders landing page blocks as pure static HTML on the server.
 * Zero client-side JavaScript is shipped to the browser.
 * This is used ONLY for the public-facing landing page (not the builder).
 */

// --- Static Render Functions (no hooks, no state, no interactivity) ---

function renderNavbar(data: any) {
  return (
    <nav
      className="border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm"
      style={{ backgroundColor: data.backgroundColor || "#ffffff", color: data.textColor || "#111827" }}
    >
      <div className="font-bold text-xl">{data.logoText}</div>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        {data.links?.map((link: any, idx: number) => (
          <a key={idx} href={link.url} className="hover:opacity-70 transition">
            {link.label}
          </a>
        ))}
      </div>
      {data.buttonText && (
        <a
          href={data.buttonUrl}
          className="px-5 py-2 rounded-md text-sm font-medium transition hover:opacity-90"
          style={{ backgroundColor: data.buttonColor || "#3b82f6", color: "#ffffff" }}
        >
          {data.buttonText}
        </a>
      )}
    </nav>
  );
}

function renderHero(data: any) {
  const hasBgImage = !!data.backgroundImage;
  return (
    <section
      className="relative py-24 px-4 text-center overflow-hidden"
      style={{
        backgroundColor: data.backgroundColor || (hasBgImage ? "#000" : "#f8fafc"),
        color: data.textColor || (hasBgImage ? "#ffffff" : "#111827"),
      }}
    >
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </>
      )}
      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{data.title}</h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl">{data.subtitle}</p>
        {data.buttonText && (
          <a
            href={data.buttonUrl}
            className="inline-block font-semibold px-8 py-3 rounded-full transition shadow-lg"
            style={{
              backgroundColor: data.buttonColor || (hasBgImage ? "#ffffff" : "#3b82f6"),
              color: hasBgImage && !data.buttonColor ? "#111827" : "#ffffff",
            }}
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

function renderTemplateShowcase(data: any) {
  return (
    <section className="py-20 px-4 bg-gray-50" id="templates">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.templates?.map((tpl: any, idx: number) => (
          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group">
            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
              {tpl.imageUrl ? (
                <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              ) : (
                <span>[Preview]</span>
              )}
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg">{tpl.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{tpl.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderFeatureGrid(data: any) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.features?.map((feature: any, idx: number) => (
          <div key={idx} className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition bg-gray-50">
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderHowItWorks(data: any) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
        {data.steps?.map((step: any, idx: number) => (
          <div key={idx} className="text-center max-w-xs">
            <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-brand-500/30">
              {step.number}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderPricing(data: any) {
  const highlightColor = data.highlightColor || "#3b82f6";
  return (
    <section className="py-20 px-4" id="pricing" style={{ backgroundColor: data.backgroundColor || "#ffffff", color: data.textColor || "#111827" }}>
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="max-w-2xl mx-auto opacity-80">{data.subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {data.packages?.map((pkg: any, idx: number) => (
          <div
            key={idx}
            className={`w-full md:w-80 p-8 rounded-2xl flex flex-col transition-all ${pkg.isHighlighted ? "shadow-xl transform md:-translate-y-4" : "border border-gray-100/10 shadow-sm"}`}
            style={pkg.isHighlighted ? { backgroundColor: highlightColor, color: "#ffffff" } : { backgroundColor: "rgba(0,0,0,0.02)" }}
          >
            <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
            <div className="mb-6"><span className="text-3xl font-bold">{pkg.price}</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {pkg.features?.map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: pkg.isHighlighted ? "#ffffff" : highlightColor }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span className={pkg.isHighlighted ? "opacity-90" : "opacity-80"}>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={pkg.buttonUrl}
              className="text-center py-3 rounded-lg font-semibold transition hover:opacity-90"
              style={pkg.isHighlighted ? { backgroundColor: "#ffffff", color: highlightColor } : { backgroundColor: highlightColor, color: "#ffffff" }}
            >
              {pkg.buttonText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderTestimonial(data: any) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {data.testimonials?.map((item: any, idx: number) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">{item.name?.charAt(0) || "?"}</div>
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">{item.role}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">&quot;{item.text}&quot;</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderFAQ(data: any) {
  return (
    <section className="py-20 px-4 bg-white" id="faq">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {data.items?.map((item: any, idx: number) => (
          <details key={idx} className="bg-gray-50 rounded-lg border border-gray-100 group">
            <summary className="cursor-pointer px-6 py-4 font-medium text-gray-900 list-none flex justify-between items-center">
              {item.question}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

function renderCallToAction(data: any) {
  return (
    <section
      className="py-20 px-4 text-center"
      style={{ backgroundColor: data.backgroundColor || "#111827", color: data.textColor || "#ffffff" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.title}</h2>
        <p className="text-lg mb-8 opacity-80">{data.subtitle}</p>
        {data.buttonText && (
          <a
            href={data.buttonUrl}
            className="inline-block font-semibold px-8 py-3 rounded-full transition shadow-lg hover:opacity-90"
            style={{ backgroundColor: data.buttonColor || "#3b82f6", color: "#ffffff" }}
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

function renderFooter(data: any) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-bold text-white text-xl mb-2">{data.brandName}</p>
        <p className="text-sm opacity-70 mb-6">{data.tagline}</p>
        {data.links && data.links.length > 0 && (
          <div className="flex justify-center gap-6 mb-6">
            {data.links.map((link: any, idx: number) => (
              <a key={idx} href={link.url} className="text-sm hover:text-white transition">{link.label}</a>
            ))}
          </div>
        )}
        <p className="text-xs opacity-50">{data.copyright}</p>
      </div>
    </footer>
  );
}

function renderCustomSection(data: any) {
  return (
    <section className={`${data.styles?.paddingY || "py-16"} w-full`} style={{ backgroundColor: data.styles?.backgroundColor || "#ffffff" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`flex flex-wrap md:flex-nowrap ${data.styles?.gap || "gap-8"} ${data.styles?.alignItems || "items-center"}`}>
          {data.columns?.map((col: any) => (
            <div key={col.id} className={`${col.width} flex-shrink-0 w-full`}>
              {col.elements?.map((el: any) => {
                const alignClass = el.styles?.textAlign ? `text-${el.styles.textAlign}` : "";
                const colorStyle = el.styles?.color ? { color: el.styles.color } : {};

                switch (el.type) {
                  case "heading":
                    return <h3 key={el.id} className={`font-bold mb-4 ${el.styles?.fontSize || "text-3xl"} ${alignClass}`} style={colorStyle}>{el.content}</h3>;
                  case "text":
                    return <p key={el.id} className={`mb-4 leading-relaxed ${el.styles?.fontSize || "text-base"} ${alignClass}`} style={colorStyle}>{el.content}</p>;
                  case "image":
                    return el.content ? (
                      <img key={el.id} src={el.content} alt="" className="max-w-full rounded-lg shadow-sm mb-4 h-auto" loading="lazy" />
                    ) : (
                      <div key={el.id} className="w-full bg-gray-200 aspect-video flex items-center justify-center rounded-lg mb-4 text-gray-500 text-sm">[Gambar]</div>
                    );
                  case "button":
                    return (
                      <div key={el.id} className={`mb-4 ${alignClass}`}>
                        <a
                          href={el.url || "#"}
                          className="inline-block px-6 py-3 rounded-md font-medium transition hover:opacity-90"
                          style={el.styles?.color ? { backgroundColor: el.styles.color, color: "#ffffff" } : { backgroundColor: "#3b82f6", color: "#ffffff" }}
                        >
                          {el.content || "Klik Disini"}
                        </a>
                      </div>
                    );
                  case "spacer":
                    return <div key={el.id} style={{ height: el.styles?.height || "2rem" }} />;
                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Block Type → Render Function Mapping ---
const RENDERERS: Record<string, (data: any) => React.ReactNode> = {
  navbar: renderNavbar,
  hero: renderHero,
  "template-showcase": renderTemplateShowcase,
  "feature-grid": renderFeatureGrid,
  "how-it-works": renderHowItWorks,
  pricing: renderPricing,
  testimonial: renderTestimonial,
  faq: renderFAQ,
  "call-to-action": renderCallToAction,
  footer: renderFooter,
  "custom-section": renderCustomSection,
};

// --- Main Component (Server Component - NO "use client") ---
export default function StaticBlockRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div className="w-full min-h-screen bg-white">
      {blocks.map((block) => {
        const render = RENDERERS[block.type];
        if (!render) return null;
        return <React.Fragment key={block.id}>{render(block.data)}</React.Fragment>;
      })}
    </div>
  );
}
