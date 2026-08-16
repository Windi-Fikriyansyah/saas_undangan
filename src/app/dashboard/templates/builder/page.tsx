"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { upsertVendorTemplate, getVendorTemplateById } from "@/app/actions/template";
import { toast } from "sonner";
import ImageUploader from "@/components/ui/ImageUploader";

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  
  const [meta, setMeta] = useState({
    id: editId || "",
    name: "",
    category: "Custom HTML",
    tier: "PREMIUM",
    isActive: true,
    thumbnailUrl: "",
  });

  const [rawInput, setRawInput] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanDocRef = useRef<string>("");
  const [workspaceVisible, setWorkspaceVisible] = useState(false);
  
  const [isSelectMode, setIsSelectMode] = useState(true);
  const isSelectModeRef = useRef(true);
  const toggleMode = (mode: boolean) => {
    setIsSelectMode(mode);
    isSelectModeRef.current = mode;
  };
  
  const selectedElRef = useRef<HTMLElement | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<{
    tagName: string;
    text: string;
    label: string;
    varName: string;
    hasBinding: boolean;
    elementType: 'text' | 'image' | 'background' | 'date' | 'datetime' | 'countdown';
    imageSrc: string;
  } | null>(null);

  const [bindings, setBindings] = useState<Array<{label: string, varName: string}>>([]);
  const [exportOutput, setExportOutput] = useState("");

  useEffect(() => {
    if (editId) {
      getVendorTemplateById(editId).then((template) => {
        if (template) {
          setMeta({
            id: template.id,
            name: template.name,
            category: template.category,
            tier: template.tier,
            isActive: template.isActive,
            thumbnailUrl: template.thumbnailUrl || "",
          });
          
          let htmlCode = "";
          if (template.configJson && (template.configJson as any).blocks) {
             const rawBlock = (template.configJson as any).blocks.find((b: any) => b.type === "raw-html");
             if (rawBlock && rawBlock.props && rawBlock.props.html) {
               htmlCode = rawBlock.props.html;
             }
          }
          if (htmlCode) {
            setRawInput(htmlCode);
            processAndLoadPreview(htmlCode);
          }
        }
      }).catch(console.error);
    }
  }, [editId]);

  const processAndLoadPreview = (htmlString: string) => {
    if (!htmlString.trim()) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let idCounter = 1;
    doc.querySelectorAll('*').forEach(el => {
      el.setAttribute('data-builder-id', idCounter.toString());
      idCounter++;
    });

    const isFullDoc = /<html[\s>]/i.test(htmlString);
    let pristineHtml = "";
    if (isFullDoc) {
      const hasDoctype = /<!DOCTYPE/i.test(htmlString);
      pristineHtml = (hasDoctype ? "<!DOCTYPE html>\n" : "") + doc.documentElement.outerHTML;
    } else {
      const headContent = doc.head.innerHTML.trim();
      const bodyContent = doc.body.innerHTML.trim();
      pristineHtml = (headContent ? headContent + "\n" : "") + bodyContent;
    }

    cleanDocRef.current = pristineHtml;
    setPreviewHtml(pristineHtml);
    setWorkspaceVisible(true);
    selectedElRef.current = null;
    setSelectedInfo(null);
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setMeta(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Delete old image from R2
  const deleteFromR2 = async (url: string) => {
    if (!url) return;
    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch (err) {
      console.error("Failed to delete old thumbnail from R2:", err);
    }
  };

  const handleThumbnailUpload = async (newUrl: string) => {
    if (meta.thumbnailUrl) {
      await deleteFromR2(meta.thumbnailUrl);
    }
    setMeta(prev => ({ ...prev, thumbnailUrl: newUrl }));
    toast.success("Thumbnail berhasil diunggah!");
  };

  const handleThumbnailRemove = async () => {
    if (meta.thumbnailUrl) {
      await deleteFromR2(meta.thumbnailUrl);
      setMeta(prev => ({ ...prev, thumbnailUrl: "" }));
      toast.success("Thumbnail berhasil dihapus.");
    }
  };

  const slugify = (str: string) => {
    return str.trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || 'field';
  };

  const isValueEl = (el: HTMLElement) => {
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  };

  const loadPreview = () => {
    processAndLoadPreview(rawInput);
  };

  const resetPreview = () => {
    if(!rawInput) return;
    setPreviewHtml(rawInput);
    selectedElRef.current = null;
    setSelectedInfo(null);
  };

  const setupInteractivity = () => {
    const iframe = iframeRef.current;
    if(!iframe) return;
    const doc = iframe.contentDocument;
    if(!doc || !doc.body) return;

    doc.addEventListener('submit', e => e.preventDefault(), true);

    if(!doc.getElementById('tpl-badge-style')){
      const style = doc.createElement('style');
      style.id = 'tpl-badge-style';
      style.textContent = `
        [data-var]:not(input):not(textarea):not(select)::before{
          content: "{{" attr(data-var) "}}";
          position:absolute;
          top:-18px; left:0;
          background:#3c6e5c; color:#fff;
          font:10px/1.4 'SFMono-Regular', Consolas, monospace;
          padding:1px 6px;
          border-radius:4px 4px 4px 0;
          white-space:nowrap;
          z-index:999;
          pointer-events:none;
        }
        .tpl-badge-runtime{
          position:absolute; top:-18px; left:0;
          background:#3c6e5c; color:#fff;
          font:10px/1.4 'SFMono-Regular', Consolas, monospace;
          padding:1px 6px;
          border-radius:4px 4px 4px 0;
          white-space:nowrap;
          z-index:999;
          pointer-events:none;
        }
      `;
      doc.head.appendChild(style);
    }

    doc.body.addEventListener('mouseover', e => {
      if(!isSelectModeRef.current) return;
      const el = e.target as HTMLElement;
      if(el === selectedElRef.current || el.hasAttribute('data-var')) return;
      el.style.outline = '2px solid #8fb3a6';
      el.style.outlineOffset = '1px';
      el.style.cursor = 'pointer';
    });

    doc.body.addEventListener('mouseout', e => {
      if(!isSelectModeRef.current) return;
      const el = e.target as HTMLElement;
      if(el === selectedElRef.current || el.hasAttribute('data-var')) return;
      el.style.outline = '';
      el.style.outlineOffset = '';
    });

    doc.body.addEventListener('click', e => {
      if(!isSelectModeRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      let el = e.target as HTMLElement;
      if(el.classList && el.classList.contains('tpl-badge-runtime')) {
        el = el.nextElementSibling as HTMLElement;
      }
      selectElement(el);
    }, true);

    refreshBoundStyles(doc);
    updateBindingsState();
  };

  const refreshBoundStyles = (doc: Document) => {
    doc.querySelectorAll('[data-var]').forEach(el => {
      (el as HTMLElement).style.outline = '2px dashed #3c6e5c';
      (el as HTMLElement).style.outlineOffset = '1px';
    });
  };

  const selectElement = (el: HTMLElement) => {
    if(selectedElRef.current && selectedElRef.current !== el && !selectedElRef.current.hasAttribute('data-var')){
      selectedElRef.current.style.outline = '';
      selectedElRef.current.style.outlineOffset = '';
    }
    selectedElRef.current = el;
    el.style.outline = '2px solid #2f5c4c';
    el.style.outlineOffset = '1px';
    
    updateEditorArea();
  };

  const updateEditorArea = () => {
    const el = selectedElRef.current;
    if(!el) {
      setSelectedInfo(null);
      return;
    }

    const currentVar = el.getAttribute('data-var') || '';
    const currentLabel = el.dataset.tplLabel || '';
    
    // Detect element type: image, background-image, or text
    let elementType: 'text' | 'image' | 'background' | 'date' | 'datetime' | 'countdown' = 'text';
    let imageSrc = '';
    
    if (el.tagName === 'IMG') {
      elementType = 'image';
      imageSrc = (el as HTMLImageElement).src || '';
    } else {
      // Check for background-image in inline style or computed style
      const bgImage = el.style.backgroundImage || el.style.background || '';
      
      const extractUrl = (str: string) => {
        const match = str.match(/url\(['"]?(.*?)['"]?\)/i);
        return match ? match[1] : '';
      };

      const inlineUrl = extractUrl(bgImage);
      
      if (inlineUrl) {
        elementType = 'background';
        imageSrc = inlineUrl;
      } else {
        // Check computed style
        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          const computed = iframe.contentWindow.getComputedStyle(el);
          const computedBg = computed.backgroundImage || '';
          const computedUrl = extractUrl(computedBg);
          if (computedUrl && computedUrl !== 'none') {
            elementType = 'background';
            imageSrc = computedUrl;
          }
        }
      }
    }

    const currentText = isValueEl(el)
      ? (el as HTMLInputElement).value
      : el.textContent?.trim() || "";

    setSelectedInfo({
      tagName: el.tagName.toLowerCase(),
      text: elementType === 'text' ? currentText : (imageSrc ? '[gambar]' : currentText),
      label: currentLabel,
      varName: currentVar,
      hasBinding: el.hasAttribute('data-var'),
      elementType,
      imageSrc,
    });
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'label' | 'varName') => {
    if(!selectedInfo) return;
    setSelectedInfo({...selectedInfo, [field]: e.target.value});
  };

  const applyCurrentBinding = () => {
    const el = selectedElRef.current;
    if(!el || !selectedInfo) return;

    const label = selectedInfo.label.trim() || 'Tanpa nama';
    const varName = slugify(selectedInfo.varName || label);

    el.setAttribute('data-var', varName);
    el.dataset.tplLabel = label;
    
    // Mark the variable type for proper rendering later
    if (selectedInfo.elementType === 'image') {
      el.setAttribute('data-var-type', 'image');
    } else if (selectedInfo.elementType === 'background') {
      el.setAttribute('data-var-type', 'background');
    } else if (selectedInfo.elementType === 'date') {
      el.setAttribute('data-var-type', 'date');
    } else if (selectedInfo.elementType === 'datetime') {
      el.setAttribute('data-var-type', 'datetime');
    } else if (selectedInfo.elementType === 'countdown') {
      el.setAttribute('data-var-type', 'countdown');
    } else {
      el.removeAttribute('data-var-type');
    }

    el.style.outline = '2px dashed #3c6e5c';
    el.style.outlineOffset = '1px';
    el.style.backgroundColor = 'rgba(60,110,92,0.08)';

    updateEditorArea();
    updateBindingsState();
  };

  const removeCurrentBinding = () => {
    const el = selectedElRef.current;
    if(!el || !el.hasAttribute('data-var')) return;
    
    el.removeAttribute('data-var');
    delete el.dataset.tplLabel;
    
    el.style.outline = '2px solid #2f5c4c';
    el.style.outlineOffset = '1px';
    el.style.backgroundColor = '';

    updateEditorArea();
    updateBindingsState();
  };

  const updateBindingsState = () => {
    const doc = iframeRef.current?.contentDocument;
    if(!doc) return;
    
    const bound = Array.from(doc.querySelectorAll('[data-var]')) as HTMLElement[];
    setBindings(bound.map(el => ({
      label: el.dataset.tplLabel || 'Tanpa nama',
      varName: el.getAttribute('data-var') || ''
    })));
    
    generateExportOutput();
  };

  const jumpToBinding = (idx: number) => {
    const doc = iframeRef.current?.contentDocument;
    if(!doc) return;
    const bound = Array.from(doc.querySelectorAll('[data-var]')) as HTMLElement[];
    if(bound[idx]) selectElement(bound[idx]);
  };

  const generateExportOutput = () => {
    const runningDoc = iframeRef.current?.contentDocument;
    if(!runningDoc || !cleanDocRef.current) return;

    // Parse the pristine HTML
    const parser = new DOMParser();
    const exportDoc = parser.parseFromString(cleanDocRef.current, 'text/html');

    // Transfer data-var
    runningDoc.querySelectorAll('[data-var]').forEach(el => {
      const builderId = el.getAttribute('data-builder-id');
      const varName = el.getAttribute('data-var');
      const tplLabel = (el as HTMLElement).dataset.tplLabel;
      const varType = el.getAttribute('data-var-type');
      
      if (builderId && varName) {
        const targetEl = exportDoc.querySelector(`[data-builder-id="${builderId}"]`);
        if (targetEl) {
          targetEl.setAttribute('data-var', varName);
          if (tplLabel) targetEl.setAttribute('data-tpl-label', tplLabel);
          if (varType) targetEl.setAttribute('data-var-type', varType);
        }
      }
    });

    // Clean up builder IDs
    exportDoc.querySelectorAll('[data-builder-id]').forEach(el => {
      el.removeAttribute('data-builder-id');
    });

    const isFullDoc = /<html[\s>]/i.test(rawInput);
    let output = "";
    if (isFullDoc) {
      const hasDoctype = /<!DOCTYPE/i.test(rawInput);
      output = (hasDoctype ? "<!DOCTYPE html>\n" : "") + exportDoc.documentElement.outerHTML;
    } else {
      const headContent = exportDoc.head.innerHTML.trim();
      const bodyContent = exportDoc.body.innerHTML.trim();
      output = (headContent ? headContent + "\n" : "") + bodyContent;
    }
    
    setExportOutput(output);
  };

  const copyExport = () => {
    navigator.clipboard && navigator.clipboard.writeText(exportOutput).catch(() => {});
  };

  const uniqueBindings = Array.from(new Map(bindings.map(b => [b.varName, b])).values());

  const handleSaveTemplate = async () => {
    if(!meta.id || !meta.name) {
      toast.error("ID dan Nama Tema wajib diisi");
      return;
    }
    
    // Check if we have exportOutput (means preview is loaded)
    let finalHtml = exportOutput;
    
    // If preview was never loaded, save raw input
    if(!finalHtml && rawInput.trim()) {
      finalHtml = rawInput;
    }
    
    if(!finalHtml) {
      toast.error("HTML tidak boleh kosong");
      return;
    }
    
    setIsLoading(true);
    try {
      const configJson = {
        version: "1.0.0",
        colors: {},
        typography: {},
        settings: {
          theme: "custom-html",
          navigation: { enabled: false },
          music: { enabled: false }
        },
        blocks: [
          {
            id: "html-template",
            type: "raw-html",
            props: {
              html: finalHtml
            }
          }
        ]
      };

      await upsertVendorTemplate({
        id: meta.id,
        name: meta.name,
        category: meta.category,
        tier: meta.tier,
        isActive: meta.isActive,
        thumbnailUrl: meta.thumbnailUrl,
        configJson: JSON.stringify(configJson)
      });
      
      toast.success("Template berhasil disimpan!");
      router.push("/dashboard/templates");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Visual Template Builder
          </h2>
          <p className="text-sm text-gray-500">Tempel kode HTML, lihat preview, dan klik bagian yang ingin dijadikan variabel.</p>
        </div>
        <button
          onClick={() => router.push("/admin/templates")}
          className="rounded border border-stroke px-4 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        >
          Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Metadata & Input */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Metadata Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="font-medium text-black dark:text-white mb-4">Informasi Tema</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">ID Tema (Unik)</label>
                <input type="text" name="id" value={meta.id} onChange={handleMetaChange} required placeholder="contoh: html-premium-1" className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-sm outline-none dark:border-strokedark" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Nama Tema</label>
                <input type="text" name="name" value={meta.name} onChange={handleMetaChange} required placeholder="Nama Template" className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-sm outline-none dark:border-strokedark" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Kategori</label>
                <input type="text" name="category" value={meta.category} onChange={handleMetaChange} required className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-sm outline-none dark:border-strokedark" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Tier</label>
                <select name="tier" value={meta.tier} onChange={handleMetaChange} className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-sm outline-none dark:border-strokedark">
                  <option value="BASIC">BASIC</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Thumbnail</label>
                
                {meta.thumbnailUrl ? (
                  <div className="relative group rounded-lg border border-stroke dark:border-strokedark overflow-hidden">
                    <img 
                      src={meta.thumbnailUrl} 
                      alt="Thumbnail Preview" 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 bg-white text-black rounded-md text-xs font-medium cursor-pointer hover:bg-gray-100 transition">
                        Ganti
                        <ImageUploader 
                          onUploadSuccess={handleThumbnailUpload} 
                          folder="templates/thumbnails" 
                          maxSizeMB={2} 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleThumbnailRemove}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                    </svg>
                    <p className="text-xs text-gray-500 mb-2">Upload thumbnail (Max 2MB)</p>
                    <ImageUploader 
                      onUploadSuccess={handleThumbnailUpload} 
                      folder="templates/thumbnails" 
                      maxSizeMB={2} 
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={meta.isActive} onChange={handleMetaChange} id="html-isActive" />
                <label htmlFor="html-isActive" className="text-sm font-medium text-black dark:text-white">Aktif (Bisa digunakan)</label>
              </div>
              
              <button 
                onClick={handleSaveTemplate}
                disabled={isLoading}
                className="mt-2 w-full rounded bg-brand-500 py-2 px-4 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan Tema HTML"}
              </button>
            </div>
          </div>
        </div>

        {/* Middle/Right Column - Editor Workspace */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="font-medium text-black dark:text-white mb-2 uppercase text-xs tracking-wider">1. Tempel Kode HTML</h3>
            <textarea 
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="<div>&#10;  <label>Nama</label>&#10;  <span>Budi Santoso</span>&#10;</div>"
              className="w-full h-32 rounded border border-stroke bg-gray-50 p-4 font-mono text-sm outline-none focus:border-brand-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
            <div className="mt-3 flex gap-3">
              <button onClick={loadPreview} className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Tampilkan Preview</button>
              <button onClick={resetPreview} className="rounded border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4">Reset ke kode asal</button>
            </div>
          </div>

          {workspaceVisible && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-black dark:text-white uppercase text-xs tracking-wider">2. Klik elemen di preview</h3>
                  <div className="flex bg-gray-100 rounded-md p-1 border border-stroke dark:bg-meta-4 dark:border-strokedark">
                    <button 
                      onClick={() => toggleMode(true)} 
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${isSelectMode ? 'bg-white shadow-sm text-brand-500' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      Mode Pilih
                    </button>
                    <button 
                      onClick={() => toggleMode(false)} 
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${!isSelectMode ? 'bg-white shadow-sm text-brand-500' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      Mode Interaksi
                    </button>
                  </div>
                </div>
                <div className={`rounded-lg border border-dashed border-stroke bg-white overflow-hidden dark:border-strokedark transition-all ${isSelectMode ? 'ring-2 ring-brand-500 ring-offset-2' : ''}`}>
                  <iframe 
                    ref={iframeRef} 
                    id="preview" 
                    srcDoc={previewHtml}
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={setupInteractivity}
                    className="w-full h-[500px] border-none bg-white"
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">Arahkan kursor untuk melihat elemen tersorot, lalu klik untuk membuka form label & variabel.</p>
              </div>

              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <h3 className="font-medium text-black dark:text-white mb-2 uppercase text-xs tracking-wider">3. Beri label & variabel</h3>
                
                {!selectedInfo ? (
                  <div className="rounded-lg border border-dashed border-stroke bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-strokedark dark:bg-meta-4">
                    Belum ada elemen dipilih.<br/>Klik salah satu bagian di preview sebelah kiri.
                  </div>
                ) : (
                  <div className="rounded-lg border border-brand-500 bg-brand-50 p-4 dark:bg-brand-500/10">
                    <span className="inline-flex items-center gap-2 rounded-md border border-stroke bg-white px-2 py-0.5 font-mono text-xs text-brand-600 dark:border-strokedark dark:bg-boxdark dark:text-brand-300 mb-3">
                      &lt;{selectedInfo.tagName}&gt;
                      {selectedInfo.elementType === 'image' && (
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold">IMG</span>
                      )}
                      {selectedInfo.elementType === 'background' && (
                        <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold">BG</span>
                      )}
                      {selectedInfo.elementType === 'text' && (
                        <span className="font-sans"> — &quot;{selectedInfo.text.length > 40 ? selectedInfo.text.slice(0,40) + '...' : selectedInfo.text}&quot;</span>
                      )}
                    </span>
                    
                    {/* Allow user to override detected element type */}
                    <div className="mb-3 flex items-center justify-between border-b border-stroke pb-3 dark:border-strokedark">
                      <label className="text-xs font-semibold text-black dark:text-white">Deteksi Elemen:</label>
                      <select 
                        className="rounded border border-stroke px-2 py-1 text-xs outline-none focus:border-brand-500 dark:border-strokedark dark:bg-boxdark"
                        value={selectedInfo.elementType}
                        onChange={(e) => setSelectedInfo({ ...selectedInfo, elementType: e.target.value as any })}
                      >
                        <option value="text">Teks Biasa</option>
                        {selectedInfo.tagName === 'img' && <option value="image">Gambar (IMG)</option>}
                        <option value="background">Background Gambar</option>
                        <option value="date">Tanggal (Pilih Tanggal)</option>
                        <option value="datetime">Tanggal & Waktu</option>
                        <option value="countdown">Countdown (Hitung Mundur Otomatis)</option>
                      </select>
                    </div>

                    {/* Hints based on element type */}
                    {(selectedInfo.elementType === 'image' || selectedInfo.elementType === 'background') && (
                      <div className="mb-3 rounded bg-blue-50 p-2 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <strong>Info:</strong> Klien nantinya akan mengunggah gambar untuk menggantikan {selectedInfo.elementType === 'image' ? 'elemen <img>' : 'background-image'} ini melalui form mereka.
                      </div>
                    )}
                    {selectedInfo.elementType === 'countdown' && (
                      <div className="mb-3 rounded bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <strong>Sistem Countdown Cerdas:</strong> Klien akan memilih tanggal & waktu. Pastikan elemen yang Anda klik adalah pembungkus utama countdown. Di dalamnya, angka akan otomatis diperbarui jika memiliki <em>class</em> <code>.days</code>, <code>.hours</code>, <code>.minutes</code>, dan <code>.seconds</code> (Atau .hari, .jam, .menit, .detik).
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-semibold text-black dark:text-white">Nama label (untuk pengingat)</label>
                      <input 
                        type="text" 
                        value={selectedInfo.label} 
                        onChange={(e) => handleInfoChange(e, 'label')} 
                        placeholder="Contoh: Nama Pelanggan"
                        className="w-full rounded border border-stroke px-3 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-strokedark dark:bg-boxdark"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="mb-1 block text-xs font-semibold text-black dark:text-white">Nama variabel</label>
                      <input 
                        type="text" 
                        value={selectedInfo.varName} 
                        onChange={(e) => handleInfoChange(e, 'varName')}
                        placeholder="Contoh: nama_pelanggan"
                        className="w-full rounded border border-stroke px-3 py-1.5 text-sm font-mono outline-none focus:border-brand-500 dark:border-strokedark dark:bg-boxdark"
                      />
                      <div className="mt-1 font-mono text-xs text-brand-600 dark:text-brand-300">
                        {`{{${selectedInfo.varName || '...'}}}`}
                      </div>
                    </div>
                    
                    {uniqueBindings.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-stroke dark:border-strokedark">
                        <label className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400">Atau pilih dari yang sudah ada:</label>
                        <select 
                          className="w-full rounded border border-stroke px-3 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-strokedark dark:bg-boxdark text-gray-700 dark:text-gray-300"
                          onChange={(e) => {
                            const b = uniqueBindings.find(x => x.varName === e.target.value);
                            if (b && selectedInfo) {
                              setSelectedInfo({ ...selectedInfo, varName: b.varName, label: b.label });
                            }
                          }}
                          value=""
                        >
                          <option value="" disabled>-- Pilih Variabel --</option>
                          {uniqueBindings.map(b => (
                            <option key={b.varName} value={b.varName}>{b.label} ({b.varName})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={applyCurrentBinding} className="rounded bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600">
                        Jadikan variabel
                      </button>
                      {selectedInfo.hasBinding && (
                        <button onClick={removeCurrentBinding} className="rounded border border-danger text-danger px-3 py-1.5 text-sm font-medium hover:bg-danger hover:text-white">
                          Hapus variabel
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <h3 className="font-medium text-black dark:text-white mb-2 mt-6 uppercase text-xs tracking-wider">Daftar Variabel Unik ({uniqueBindings.length})</h3>
                {uniqueBindings.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada variabel dibuat.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {uniqueBindings.map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded border border-stroke p-2 dark:border-strokedark">
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-semibold text-black dark:text-white">{b.label}</span>
                          <span className="font-mono text-xs text-brand-600 dark:text-brand-300">{`{{${b.varName}}}`}</span>
                        </div>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded dark:bg-meta-4 dark:text-gray-300">
                          {bindings.filter(x => x.varName === b.varName).length}x dipakai
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <details className="mt-6 group">
                  <summary className="cursor-pointer text-sm font-medium text-brand-500">Lihat & salin kode HTML hasil</summary>
                  <div className="mt-3 relative">
                    <pre className="max-h-60 overflow-auto rounded bg-black p-4 font-mono text-xs text-white">
                      {exportOutput}
                    </pre>
                    <button onClick={copyExport} className="absolute top-2 right-2 rounded bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30">
                      Salin
                    </button>
                  </div>
                </details>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TemplateBuilderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading template...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
