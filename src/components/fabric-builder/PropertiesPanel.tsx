"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useFabricStore } from "@/store/useFabricStore";
import { BINDING_VARIABLES } from "@/lib/fabric/wedding-presets";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  Link2,
} from "lucide-react";

// Google Fonts loader helper
function loadGoogleFont(fontFamily: string) {
  const cleanName = fontFamily.split(",")[0].trim().replace(/['"]/g, "");
  if (document.querySelector(`link[data-font="${cleanName}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanName)}:wght@300;400;500;600;700&display=swap`;
  link.setAttribute("data-font", cleanName);
  document.head.appendChild(link);
}

// Popular Google Fonts curated for wedding
const POPULAR_FONTS = [
  "Cormorant Garamond", "Playfair Display", "Great Vibes", "Cinzel",
  "Lora", "Libre Baskerville", "EB Garamond", "Crimson Text",
  "Dancing Script", "Parisienne", "Alex Brush", "Sacramento",
  "Josefin Sans", "Montserrat", "Raleway", "Poppins",
  "DM Sans", "Inter", "Outfit", "Nunito",
  "Tangerine", "Allura", "Pinyon Script", "Satisfy",
  "Italiana", "Cormorant", "Spectral", "Source Serif 4",
];

// ─── Properties Tab ───
function PropertiesTab() {
  const { canvas, selectedObjectIds } = useFabricStore();
  const [objState, setObjState] = useState<any>(null);
  const [fontSearch, setFontSearch] = useState("");
  const [showFontList, setShowFontList] = useState(false);

  // Get selected object
  const getSelectedObject = useCallback(() => {
    if (!canvas || selectedObjectIds.length === 0) return null;
    return canvas.getActiveObject();
  }, [canvas, selectedObjectIds]);

  // Sync state from canvas object
  const syncFromObject = useCallback(() => {
    const obj = getSelectedObject();
    if (!obj) {
      setObjState(null);
      return;
    }

    setObjState({
      id: obj.id,
      type: obj.type,
      name: obj.name || obj.type,
      left: Math.round(obj.left || 0),
      top: Math.round(obj.top || 0),
      width: Math.round(obj.getScaledWidth?.() || obj.width || 0),
      height: Math.round(obj.getScaledHeight?.() || obj.height || 0),
      angle: Math.round(obj.angle || 0),
      opacity: Math.round((obj.opacity ?? 1) * 100),
      fill: obj.fill || "transparent",
      stroke: obj.stroke || "",
      strokeWidth: obj.strokeWidth || 0,
      // Text-specific
      text: obj.text,
      fontSize: obj.fontSize,
      fontFamily: obj.fontFamily,
      fontWeight: obj.fontWeight,
      fontStyle: obj.fontStyle,
      underline: obj.underline,
      textAlign: obj.textAlign,
      lineHeight: obj.lineHeight,
      charSpacing: obj.charSpacing || 0,
      // Shadow
      shadow: obj.shadow,
      // Border radius (Rect)
      rx: obj.rx || 0,
      ry: obj.ry || 0,
      // Binding
      binding: obj.data?.binding || "",
    });
  }, [getSelectedObject]);

  useEffect(() => {
    syncFromObject();
  }, [selectedObjectIds, syncFromObject]);

  // Listen to canvas object modifications
  useEffect(() => {
    if (!canvas) return;
    const handler = () => syncFromObject();
    canvas.on("object:modified", handler);
    canvas.on("object:scaling", handler);
    canvas.on("object:moving", handler);
    canvas.on("object:rotating", handler);
    canvas.on("text:changed", handler);
    return () => {
      canvas.off("object:modified", handler);
      canvas.off("object:scaling", handler);
      canvas.off("object:moving", handler);
      canvas.off("object:rotating", handler);
      canvas.off("text:changed", handler);
    };
  }, [canvas, syncFromObject]);

  // Update object property
  const updateProp = (prop: string, value: any) => {
    const obj = getSelectedObject();
    if (!obj || !canvas) return;

    if (prop === "width") {
      const scaleX = value / (obj.width || 1);
      obj.set("scaleX", scaleX);
    } else if (prop === "height") {
      const scaleY = value / (obj.height || 1);
      obj.set("scaleY", scaleY);
    } else if (prop === "opacity") {
      obj.set("opacity", value / 100);
    } else if (prop === "name") {
      obj.name = value;
    } else if (prop === "fontFamily") {
      loadGoogleFont(value);
      obj.set("fontFamily", value);
    } else {
      obj.set(prop, value);
    }

    obj.setCoords();
    canvas.renderAll();
    setObjState((prev: any) => ({ ...prev, [prop]: value }));
  };

  if (!objState) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-6">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <Type size={20} className="text-gray-600" />
        </div>
        <p className="text-xs">Pilih objek di canvas untuk mengedit propertinya.</p>
      </div>
    );
  }

  const isText = objState.type === "textbox" || objState.type === "i-text" || objState.text !== undefined;
  const isShape = objState.type === "rect" || objState.type === "circle" || objState.type === "line";

  const filteredFonts = fontSearch
    ? POPULAR_FONTS.filter((f) => f.toLowerCase().includes(fontSearch.toLowerCase()))
    : POPULAR_FONTS;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Object Name */}
      <div className="px-4 py-3 border-b border-white/10">
        <input
          type="text"
          value={objState.name || ""}
          onChange={(e) => updateProp("name", e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-white border-none outline-none"
          placeholder="Nama objek"
        />
        <span className="text-[10px] text-gray-600 font-mono">{objState.type} • {objState.id}</span>
      </div>

      {/* Position & Size */}
      <Section title="Posisi & Ukuran">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={objState.left} onChange={(v) => updateProp("left", v)} />
          <NumberInput label="Y" value={objState.top} onChange={(v) => updateProp("top", v)} />
          <NumberInput label="W" value={objState.width} onChange={(v) => updateProp("width", v)} />
          <NumberInput label="H" value={objState.height} onChange={(v) => updateProp("height", v)} />
          <NumberInput label="Rotasi" value={objState.angle} onChange={(v) => updateProp("angle", v)} suffix="°" />
          <NumberInput label="Opacity" value={objState.opacity} onChange={(v) => updateProp("opacity", v)} min={0} max={100} suffix="%" />
        </div>
      </Section>

      {/* Text Properties */}
      {isText && (
        <Section title="Teks">
          {/* Font Family with search */}
          <div className="mb-3 relative">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Font</label>
            <input
              type="text"
              value={fontSearch || objState.fontFamily || ""}
              onFocus={() => {
                setShowFontList(true);
                setFontSearch("");
              }}
              onChange={(e) => {
                setFontSearch(e.target.value);
                setShowFontList(true);
              }}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500"
              placeholder="Cari font..."
            />
            {showFontList && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-900 border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {filteredFonts.map((font) => {
                  loadGoogleFont(font);
                  return (
                    <button
                      key={font}
                      onClick={() => {
                        updateProp("fontFamily", font);
                        setShowFontList(false);
                        setFontSearch("");
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  );
                })}
                {filteredFonts.length === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Ketik nama font Google lalu tekan Enter
                    <button
                      className="block mt-1 text-brand-400 hover:underline"
                      onClick={() => {
                        if (fontSearch) {
                          updateProp("fontFamily", fontSearch);
                          setShowFontList(false);
                          setFontSearch("");
                        }
                      }}
                    >
                      Gunakan &quot;{fontSearch}&quot;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <NumberInput label="Ukuran" value={objState.fontSize} onChange={(v) => updateProp("fontSize", v)} />
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Tebal</label>
              <select
                value={objState.fontWeight || "400"}
                onChange={(e) => updateProp("fontWeight", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none"
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">SemiBold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>

          {/* Text Formatting Buttons */}
          <div className="flex gap-1 mb-3">
            <ToggleButton
              active={objState.fontWeight === "bold" || parseInt(objState.fontWeight) >= 700}
              onClick={() => updateProp("fontWeight", objState.fontWeight === "bold" || parseInt(objState.fontWeight) >= 700 ? "400" : "bold")}
            >
              <Bold size={14} />
            </ToggleButton>
            <ToggleButton
              active={objState.fontStyle === "italic"}
              onClick={() => updateProp("fontStyle", objState.fontStyle === "italic" ? "normal" : "italic")}
            >
              <Italic size={14} />
            </ToggleButton>
            <ToggleButton
              active={objState.underline}
              onClick={() => updateProp("underline", !objState.underline)}
            >
              <Underline size={14} />
            </ToggleButton>
            <div className="w-px bg-white/10 mx-1" />
            <ToggleButton active={objState.textAlign === "left"} onClick={() => updateProp("textAlign", "left")}>
              <AlignLeft size={14} />
            </ToggleButton>
            <ToggleButton active={objState.textAlign === "center"} onClick={() => updateProp("textAlign", "center")}>
              <AlignCenter size={14} />
            </ToggleButton>
            <ToggleButton active={objState.textAlign === "right"} onClick={() => updateProp("textAlign", "right")}>
              <AlignRight size={14} />
            </ToggleButton>
          </div>

          {/* Color */}
          <ColorInput label="Warna Teks" value={objState.fill} onChange={(v) => updateProp("fill", v)} />

          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <NumberInput label="Line Height" value={objState.lineHeight || 1.2} onChange={(v) => updateProp("lineHeight", v)} step={0.1} min={0.5} max={3} />
            <NumberInput label="Spacing" value={objState.charSpacing || 0} onChange={(v) => updateProp("charSpacing", v)} step={50} />
          </div>
        </Section>
      )}

      {/* Shape Properties */}
      {(isShape || !isText) && (
        <Section title="Tampilan">
          <ColorInput label="Fill" value={objState.fill} onChange={(v) => updateProp("fill", v)} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ColorInput label="Border" value={objState.stroke} onChange={(v) => updateProp("stroke", v)} />
            <NumberInput label="Border Width" value={objState.strokeWidth} onChange={(v) => updateProp("strokeWidth", v)} />
          </div>
          {objState.type === "rect" && (
            <div className="mt-2">
              <NumberInput label="Border Radius" value={objState.rx} onChange={(v) => { updateProp("rx", v); updateProp("ry", v); }} />
            </div>
          )}
        </Section>
      )}

      {/* Shadow */}
      <Section title="Bayangan">
        <ShadowEditor
          shadow={objState.shadow}
          onChange={(shadow) => {
            const obj = getSelectedObject();
            if (!obj || !canvas) return;
            if (shadow) {
              import("fabric").then(({ Shadow }) => {
                obj.set("shadow", new Shadow(shadow));
                canvas.renderAll();
              });
            } else {
              obj.set("shadow", null);
              canvas.renderAll();
            }
          }}
        />
      </Section>
    </div>
  );
}

// ─── Binding Tab ───
function BindingTab() {
  const { canvas, selectedObjectIds } = useFabricStore();
  const [currentBinding, setCurrentBinding] = useState("");
  const [search, setSearch] = useState("");

  const obj = canvas?.getActiveObject();

  useEffect(() => {
    if (obj?.data?.binding) {
      setCurrentBinding(obj.data.binding);
    } else {
      setCurrentBinding("");
    }
  }, [obj, selectedObjectIds]);

  const applyBinding = (varPath: string) => {
    if (!obj || !canvas) return;
    if (!obj.data) obj.data = {};
    obj.data.binding = varPath;
    setCurrentBinding(varPath);

    // Show placeholder in text
    if (obj.text !== undefined) {
      const variable = BINDING_VARIABLES.find((v) => v.path === varPath);
      obj.set("text", `{{${varPath}}}`);
      canvas.renderAll();
    }
  };

  const removeBinding = () => {
    if (!obj || !canvas) return;
    if (obj.data) {
      delete obj.data.binding;
    }
    setCurrentBinding("");
    canvas.renderAll();
  };

  if (!obj) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-6">
        <Link2 size={20} className="text-gray-600 mb-3" />
        <p className="text-xs">Pilih objek lalu bind ke variabel data klien.</p>
      </div>
    );
  }

  const filtered = search
    ? BINDING_VARIABLES.filter(
        (v) =>
          v.path.toLowerCase().includes(search.toLowerCase()) ||
          v.label.toLowerCase().includes(search.toLowerCase())
      )
    : BINDING_VARIABLES;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-[10px] text-gray-500 mb-3">
        Hubungkan objek <span className="text-brand-300 font-medium">&quot;{obj.name || obj.type}&quot;</span> ke variabel data klien:
      </p>

      {currentBinding && (
        <div className="mb-4 p-3 rounded-lg bg-brand-500/10 border border-brand-500/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500">Terhubung ke:</span>
              <p className="text-sm text-brand-300 font-mono">{`{{${currentBinding}}}`}</p>
            </div>
            <button
              onClick={removeBinding}
              className="text-xs text-red-400 hover:text-red-300 hover:underline"
            >
              Lepas
            </button>
          </div>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari variabel..."
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-brand-500 mb-3"
      />

      <div className="flex flex-col gap-1">
        {filtered.map((v) => (
          <button
            key={v.path}
            onClick={() => applyBinding(v.path)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
              currentBinding === v.path
                ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                : "text-gray-400 hover:bg-white/5 border border-transparent"
            }`}
          >
            <span className="font-medium text-gray-200 block">{v.label}</span>
            <span className="font-mono text-[10px] text-gray-500">{`{{${v.path}}}`}</span>
            <span className="ml-2 text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">{v.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Properties Panel (Right Sidebar) ───
export default function PropertiesPanel() {
  const { activeRightTab, setActiveRightTab } = useFabricStore();

  return (
    <div className="w-72 border-l border-white/10 bg-gray-950 flex flex-col h-full flex-shrink-0">
      {/* Tab Switcher */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveRightTab("properties")}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeRightTab === "properties"
              ? "text-brand-400 border-b-2 border-brand-400 bg-white/[0.03]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Properti
        </button>
        <button
          onClick={() => setActiveRightTab("binding")}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeRightTab === "binding"
              ? "text-brand-400 border-b-2 border-brand-400 bg-white/[0.03]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Data Binding
        </button>
      </div>

      {activeRightTab === "properties" ? <PropertiesTab /> : <BindingTab />}
    </div>
  );
}

// ─── Reusable Sub-components ───

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-white/10">
      <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">{title}</h4>
      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value?.startsWith?.("#") ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-white/10 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 font-mono"
          placeholder="transparent"
        />
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active ? "bg-brand-500/20 text-brand-400" : "text-gray-500 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function ShadowEditor({
  shadow,
  onChange,
}: {
  shadow: any;
  onChange: (shadow: { color: string; blur: number; offsetX: number; offsetY: number } | null) => void;
}) {
  const hasShadow = !!shadow;
  const s = shadow || { color: "rgba(0,0,0,0.5)", blur: 10, offsetX: 2, offsetY: 2 };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={hasShadow}
          onChange={(e) => {
            if (e.target.checked) {
              onChange({ color: "rgba(0,0,0,0.5)", blur: 10, offsetX: 2, offsetY: 2 });
            } else {
              onChange(null);
            }
          }}
          className="rounded"
        />
        <span className="text-xs text-gray-400">Aktifkan bayangan</span>
      </div>
      {hasShadow && (
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Blur" value={s.blur || 0} onChange={(v) => onChange({ ...s, blur: v })} />
          <NumberInput label="Offset X" value={s.offsetX || 0} onChange={(v) => onChange({ ...s, offsetX: v })} />
          <NumberInput label="Offset Y" value={s.offsetY || 0} onChange={(v) => onChange({ ...s, offsetY: v })} />
          <ColorInput label="Warna" value={s.color || "#000"} onChange={(v) => onChange({ ...s, color: v })} />
        </div>
      )}
    </div>
  );
}
