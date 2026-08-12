"use client";

import { useState } from "react";
import TemplateEngine from "@/components/template/TemplateEngine";
import { TemplateConfig } from "@/lib/validations/template-config";

export default function PreviewEnginePage() {
  // Mock Template Config (Interactive to prove JSON-driven nature)
  const [config, setConfig] = useState<TemplateConfig>({
    colors: {
      primary: "#1e3a8a", // Blue 900
      secondary: "#93c5fd", // Blue 300
      accent: "#d97706",
      background: "#f8fafc", // Slate 50
      text: "#334155", // Slate 700
    },
    typography: {
      headingFont: "playfair",
      bodyFont: "inter",
    },
    layout: {
      heroStyle: "center",
    },
    features: {
      showGallery: true,
      showLoveStory: true,
      showLiveStream: true,
      showGift: true,
    },
  });

  // Mock Client Data
  const mockData = {
    step1: {
      brideNickname: "Sarah",
      groomNickname: "Michael",
    },
    step2: {
      akadDate: "24 Desember 2026",
    },
    step3: {
      loveStory: "Berawal dari sebuah pertemuan singkat di kedai kopi, kami akhirnya memutuskan untuk mengikat janji suci sehidup semati. Terima kasih telah menjadi bagian dari perjalanan cinta kami.",
    },
  };

  const handleColorChange = (key: keyof TemplateConfig["colors"], value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleFontChange = (font: string) => {
    setConfig((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        headingFont: font,
      },
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Control Panel (Admin/Vendor View Simulation) */}
      <div className="w-80 shrink-0 border-r border-gray-800 bg-black p-6 text-white shadow-xl z-50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Template Control</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-300 border-b border-gray-800 pb-2">Colors</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Primary</label>
              <input 
                type="color" 
                value={config.colors.primary} 
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Background</label>
              <input 
                type="color" 
                value={config.colors.background} 
                onChange={(e) => handleColorChange("background", e.target.value)}
                className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Text</label>
              <input 
                type="color" 
                value={config.colors.text} 
                onChange={(e) => handleColorChange("text", e.target.value)}
                className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-300 border-b border-gray-800 pb-2">Typography</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm">Heading Font</label>
              <select 
                value={config.typography.headingFont}
                onChange={(e) => handleFontChange(e.target.value)}
                className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="playfair">Playfair Display (Serif)</option>
                <option value="great-vibes">Great Vibes (Script)</option>
                <option value="dancing-script">Dancing Script</option>
                <option value="lora">Lora (Serif)</option>
                <option value="montserrat">Montserrat (Sans)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 rounded-lg bg-blue-900/30 p-4 border border-blue-900/50 text-xs text-blue-200">
            <p><strong>Note:</strong> In a real scenario, this JSON config is merged with Client Data inside the database.</p>
          </div>
        </div>
      </div>

      {/* Preview Area (Client Invitation View) */}
      <div className="flex-1 relative overflow-y-auto">
        {/* We use key={JSON.stringify(config)} to force re-render if needed, but react handles it. */}
        <TemplateEngine 
          templateName="minimalist-1" 
          config={config} 
          data={mockData} 
        />
      </div>
    </div>
  );
}
