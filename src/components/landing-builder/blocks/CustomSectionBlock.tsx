import React, { useState } from "react";
import { z } from "zod";
import { BlockDefinition } from "../types";
import { v4 as uuidv4 } from "uuid";

// Schemas
const StyleSchema = z.object({
  paddingY: z.string().default("py-12"),
  backgroundColor: z.string().default("#ffffff"),
  gap: z.string().default("gap-6"),
  alignItems: z.string().default("items-start"),
});

const ElementSchema = z.object({
  id: z.string(),
  type: z.enum(["heading", "text", "image", "button", "spacer"]),
  content: z.string(), // Text content, Image URL, or Button Text
  url: z.string().optional(), // For Button link
  styles: z.object({
    fontSize: z.string().optional(),
    color: z.string().optional(),
    textAlign: z.string().optional(),
    height: z.string().optional(), // For spacer
  }).optional()
});

const ColumnSchema = z.object({
  id: z.string(),
  width: z.string().default("w-full md:w-1/2"), // Tailwind width classes
  elements: z.array(ElementSchema),
});

export const CustomSectionSchema = z.object({
  styles: StyleSchema,
  columns: z.array(ColumnSchema),
});

type CustomSectionData = z.infer<typeof CustomSectionSchema>;
type ElementData = z.infer<typeof ElementSchema>;
type ColumnData = z.infer<typeof ColumnSchema>;

// Component Renderer
const CustomSectionComponent = ({ data, isPreview }: { data: CustomSectionData, isPreview?: boolean }) => {
  const { styles, columns } = data;

  const renderElement = (el: ElementData) => {
    const alignClass = el.styles?.textAlign ? `text-${el.styles.textAlign}` : "";
    const colorStyle = el.styles?.color ? { color: el.styles.color } : {};

    switch (el.type) {
      case "heading":
        return <h3 className={`font-bold mb-4 ${el.styles?.fontSize || "text-3xl"} ${alignClass}`} style={colorStyle}>{el.content}</h3>;
      case "text":
        return <p className={`mb-4 leading-relaxed ${el.styles?.fontSize || "text-base"} ${alignClass}`} style={colorStyle}>{el.content}</p>;
      case "image":
        return el.content ? (
          <img src={el.content} alt="Custom" className="max-w-full rounded-lg shadow-sm mb-4 h-auto" />
        ) : (
          <div className="w-full bg-gray-200 aspect-video flex items-center justify-center rounded-lg mb-4 text-gray-500 text-sm">[Gambar]</div>
        );
      case "button":
        return (
          <div className={`mb-4 ${alignClass}`}>
            <a 
              href={isPreview ? "#" : (el.url || "#")} 
              className="inline-block px-6 py-3 bg-brand-500 text-white rounded-md font-medium hover:bg-brand-600 transition"
              style={el.styles?.color ? { backgroundColor: el.styles.color } : {}}
            >
              {el.content || "Klik Disini"}
            </a>
          </div>
        );
      case "spacer":
        return <div style={{ height: el.styles?.height || "2rem" }}></div>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`${styles.paddingY} w-full`} 
      style={{ backgroundColor: styles.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className={`flex flex-wrap md:flex-nowrap ${styles.gap} ${styles.alignItems}`}>
          {columns.map((col) => (
            <div key={col.id} className={`${col.width} flex-shrink-0 w-full`}>
              {col.elements.map(el => (
                <React.Fragment key={el.id}>
                  {renderElement(el)}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Editor Component
const CustomSectionEditor = ({ data, onChange }: { data: CustomSectionData; onChange: (data: CustomSectionData) => void }) => {
  
  const addColumn = () => {
    onChange({
      ...data,
      columns: [...data.columns, { id: uuidv4(), width: "w-full md:w-1/2", elements: [] }]
    });
  };

  const removeColumn = (colId: string) => {
    onChange({
      ...data,
      columns: data.columns.filter(c => c.id !== colId)
    });
  };

  const updateColumnWidth = (colId: string, width: string) => {
    onChange({
      ...data,
      columns: data.columns.map(c => c.id === colId ? { ...c, width } : c)
    });
  };

  const addElement = (colId: string, type: ElementData["type"]) => {
    let content = "";
    if (type === "heading") content = "Heading Baru";
    if (type === "text") content = "Teks paragraf baru...";
    if (type === "button") content = "Tombol";

    const newElement: ElementData = {
      id: uuidv4(),
      type,
      content,
      styles: { textAlign: "left" }
    };

    onChange({
      ...data,
      columns: data.columns.map(c => c.id === colId ? { ...c, elements: [...c.elements, newElement] } : c)
    });
  };

  const removeElement = (colId: string, elId: string) => {
    onChange({
      ...data,
      columns: data.columns.map(c => c.id === colId ? { ...c, elements: c.elements.filter(e => e.id !== elId) } : c)
    });
  };

  const updateElement = (colId: string, elId: string, updates: Partial<ElementData>) => {
    onChange({
      ...data,
      columns: data.columns.map(c => 
        c.id === colId ? { 
          ...c, 
          elements: c.elements.map(e => e.id === elId ? { ...e, ...updates } : e) 
        } : c
      )
    });
  };

  return (
    <div className="space-y-6">
      {/* SECTION SETTINGS */}
      <div className="bg-gray-50 p-3 rounded border">
        <h4 className="text-sm font-semibold mb-3">Pengaturan Section</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Padding (Atas/Bawah)</label>
            <select 
              value={data.styles.paddingY} 
              onChange={(e) => onChange({ ...data, styles: { ...data.styles, paddingY: e.target.value } })}
              className="w-full text-sm border rounded p-1.5"
            >
              <option value="py-0">Tidak ada (0)</option>
              <option value="py-8">Kecil (Small)</option>
              <option value="py-16">Sedang (Medium)</option>
              <option value="py-24">Besar (Large)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Jarak Antar Kolom (Gap)</label>
            <select 
              value={data.styles.gap} 
              onChange={(e) => onChange({ ...data, styles: { ...data.styles, gap: e.target.value } })}
              className="w-full text-sm border rounded p-1.5"
            >
              <option value="gap-4">Kecil</option>
              <option value="gap-8">Sedang</option>
              <option value="gap-16">Besar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Alignment Kolom</label>
            <select 
              value={data.styles.alignItems} 
              onChange={(e) => onChange({ ...data, styles: { ...data.styles, alignItems: e.target.value } })}
              className="w-full text-sm border rounded p-1.5"
            >
              <option value="items-start">Atas (Start)</option>
              <option value="items-center">Tengah (Center)</option>
              <option value="items-end">Bawah (End)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Background Warna</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={data.styles.backgroundColor} 
                onChange={(e) => onChange({ ...data, styles: { ...data.styles, backgroundColor: e.target.value } })}
                className="w-8 h-8 rounded cursor-pointer border p-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* COLUMNS & ELEMENTS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold">Kolom & Konten</h4>
          <button onClick={addColumn} className="text-xs bg-brand-500 text-white px-2 py-1 rounded">
            + Tambah Kolom
          </button>
        </div>

        <div className="space-y-4">
          {data.columns.map((col, colIdx) => (
            <div key={col.id} className="border border-brand-200 bg-white rounded p-3">
              <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">KOLOM {colIdx + 1}</span>
                  <select 
                    value={col.width}
                    onChange={(e) => updateColumnWidth(col.id, e.target.value)}
                    className="text-xs border rounded p-1"
                  >
                    <option value="w-full md:w-full">100% (Penuh)</option>
                    <option value="w-full md:w-1/2">50% (Setengah)</option>
                    <option value="w-full md:w-1/3">33% (Sepertiga)</option>
                    <option value="w-full md:w-2/3">66% (Dua Pertiga)</option>
                    <option value="w-full md:w-1/4">25% (Seperempat)</option>
                  </select>
                </div>
                <button onClick={() => removeColumn(col.id)} className="text-red-500 text-xs font-bold">Hapus</button>
              </div>

              {/* Elements List */}
              <div className="space-y-3 mb-3">
                {col.elements.map((el, elIdx) => (
                  <div key={el.id} className="bg-gray-50 border rounded p-2 relative group">
                    <button 
                      onClick={() => removeElement(col.id, el.id)}
                      className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{el.type}</div>
                    
                    {el.type === 'heading' || el.type === 'text' ? (
                      <>
                        {el.type === 'heading' ? (
                          <input 
                            type="text" value={el.content} 
                            onChange={e => updateElement(col.id, el.id, { content: e.target.value })}
                            className="w-full text-sm border rounded p-1 mb-1 font-semibold" 
                          />
                        ) : (
                          <textarea 
                            value={el.content} 
                            onChange={e => updateElement(col.id, el.id, { content: e.target.value })}
                            className="w-full text-xs border rounded p-1 mb-1" rows={3}
                          />
                        )}
                        <div className="flex gap-2">
                          <select 
                            value={el.styles?.textAlign || "left"} 
                            onChange={e => updateElement(col.id, el.id, { styles: { ...el.styles, textAlign: e.target.value }})}
                            className="text-[10px] border rounded p-1"
                          >
                            <option value="left">Kiri</option>
                            <option value="center">Tengah</option>
                            <option value="right">Kanan</option>
                          </select>
                          {el.type === 'heading' && (
                            <select 
                              value={el.styles?.fontSize || "text-3xl"} 
                              onChange={e => updateElement(col.id, el.id, { styles: { ...el.styles, fontSize: e.target.value }})}
                              className="text-[10px] border rounded p-1"
                            >
                              <option value="text-xl">H4 (Kecil)</option>
                              <option value="text-2xl">H3 (Sedang)</option>
                              <option value="text-3xl">H2 (Besar)</option>
                              <option value="text-5xl">H1 (Sangat Besar)</option>
                            </select>
                          )}
                          <input type="color" value={el.styles?.color || "#000000"} onChange={e => updateElement(col.id, el.id, { styles: { ...el.styles, color: e.target.value }})} className="w-5 h-5 rounded cursor-pointer p-0 border-0" />
                        </div>
                      </>
                    ) : el.type === 'image' ? (
                      <>
                        <input 
                          type="text" value={el.content} placeholder="URL Gambar"
                          onChange={e => updateElement(col.id, el.id, { content: e.target.value })}
                          className="w-full text-xs border rounded p-1" 
                        />
                      </>
                    ) : el.type === 'button' ? (
                      <>
                        <input 
                          type="text" value={el.content} placeholder="Teks Tombol"
                          onChange={e => updateElement(col.id, el.id, { content: e.target.value })}
                          className="w-full text-xs border rounded p-1 mb-1" 
                        />
                        <input 
                          type="text" value={el.url || ""} placeholder="URL Link (#)"
                          onChange={e => updateElement(col.id, el.id, { url: e.target.value })}
                          className="w-full text-xs border rounded p-1 mb-1" 
                        />
                        <div className="flex gap-2">
                           <select 
                            value={el.styles?.textAlign || "left"} 
                            onChange={e => updateElement(col.id, el.id, { styles: { ...el.styles, textAlign: e.target.value }})}
                            className="text-[10px] border rounded p-1"
                          >
                            <option value="left">Kiri</option>
                            <option value="center">Tengah</option>
                            <option value="right">Kanan</option>
                          </select>
                          <input type="color" title="Warna Tombol" value={el.styles?.color || "#3b82f6"} onChange={e => updateElement(col.id, el.id, { styles: { ...el.styles, color: e.target.value }})} className="w-5 h-5 rounded cursor-pointer p-0 border-0" />
                        </div>
                      </>
                    ) : el.type === 'spacer' ? (
                      <select 
                        value={el.styles?.height || "2rem"} 
                        onChange={e => updateElement(col.id, el.id, { styles: { ...el.styles, height: e.target.value }})}
                        className="w-full text-xs border rounded p-1"
                      >
                        <option value="1rem">Kecil (1rem)</option>
                        <option value="2rem">Sedang (2rem)</option>
                        <option value="4rem">Besar (4rem)</option>
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Add Element Buttons */}
              <div className="flex flex-wrap gap-1 border-t pt-2 border-brand-100">
                <button onClick={() => addElement(col.id, 'heading')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+ Heading</button>
                <button onClick={() => addElement(col.id, 'text')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+ Teks</button>
                <button onClick={() => addElement(col.id, 'image')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+ Gambar</button>
                <button onClick={() => addElement(col.id, 'button')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+ Tombol</button>
                <button onClick={() => addElement(col.id, 'spacer')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+ Jarak</button>
              </div>
            </div>
          ))}
          {data.columns.length === 0 && (
            <div className="text-center p-4 text-sm text-gray-500 border border-dashed rounded">
              Tidak ada kolom. Silakan klik "Tambah Kolom" di atas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CustomSectionBlockDef: BlockDefinition<CustomSectionData> = {
  type: "custom-section",
  label: "Advanced Custom Section",
  category: "Advanced",
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
  ),
  defaultData: {
    styles: {
      paddingY: "py-16",
      backgroundColor: "#ffffff",
      gap: "gap-8",
      alignItems: "items-center",
    },
    columns: [
      {
        id: "col-1",
        width: "w-full md:w-1/2",
        elements: [
          { id: "el-1", type: "heading", content: "Kreasikan Imajinasi Anda", styles: { fontSize: "text-4xl" } },
          { id: "el-2", type: "text", content: "Gunakan Custom Section ini untuk membangun layout grid sesuka hati Anda. Atur kolom, gambar, teks, dan tombol secara bebas tanpa batas." },
          { id: "el-3", type: "button", content: "Hubungi Kami", url: "#" }
        ]
      },
      {
        id: "col-2",
        width: "w-full md:w-1/2",
        elements: [
          { id: "el-4", type: "image", content: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop" }
        ]
      }
    ]
  },
  schema: CustomSectionSchema,
  component: CustomSectionComponent,
  editor: CustomSectionEditor,
};
