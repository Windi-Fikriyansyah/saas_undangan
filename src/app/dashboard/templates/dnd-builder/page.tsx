"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFabricStore } from "@/store/useFabricStore";
import { upsertVendorTemplate, getVendorTemplateById } from "@/app/actions/template";
import { serializeCanvas, deserializeCanvas, isFabricConfig } from "@/lib/fabric/serializer";
import { toast } from "sonner";
import FabricBuilderLayout from "@/components/fabric-builder/FabricBuilderLayout";

function BuilderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const {
    canvas,
    templateId,
    templateMeta,
    setTemplateId,
    setTemplateMeta,
    isDirty,
    setDirty,
  } = useFabricStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load template data from DB
  useEffect(() => {
    if (!editId) return;
    setTemplateId(editId);

    getVendorTemplateById(editId)
      .then((template) => {
        if (template) {
          setTemplateMeta({
            name: template.name,
            category: template.category,
            tier: template.tier,
            isActive: template.isActive,
            thumbnailUrl: template.thumbnailUrl || "",
          });
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load template:", err);
        toast.error("Gagal memuat template");
      });
  }, [editId, setTemplateId, setTemplateMeta]);

  // Load canvas data once canvas is ready and template is loaded
  useEffect(() => {
    if (!canvas || !editId || !isLoaded) return;

    getVendorTemplateById(editId)
      .then(async (template) => {
        if (template?.configJson && isFabricConfig(template.configJson)) {
          await deserializeCanvas(template.configJson, canvas);
          toast.success("Canvas berhasil dimuat!");
        }
      })
      .catch(console.error);
  }, [canvas, editId, isLoaded]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!canvas || !editId) return;

    const interval = setInterval(() => {
      if (isDirty) {
        try {
          const json = JSON.stringify(
            canvas.toJSON(["id", "name", "data", "selectable", "evented"])
          );
          localStorage.setItem(`fabric_draft_${editId}`, json);
          setDirty(false);
        } catch (e) {
          console.error("Auto-save failed:", e);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [canvas, editId, isDirty, setDirty]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Anda memiliki perubahan yang belum disimpan.";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Save template
  const handleSave = useCallback(async () => {
    if (!canvas) {
      toast.error("Canvas belum siap");
      return;
    }

    const id = templateId || editId;
    if (!id) {
      toast.error("ID template tidak ditemukan");
      return;
    }

    if (!templateMeta.name) {
      toast.error("Nama template wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      const configJson = serializeCanvas(canvas);

      await upsertVendorTemplate({
        id,
        name: templateMeta.name,
        category: templateMeta.category,
        tier: templateMeta.tier,
        isActive: templateMeta.isActive,
        thumbnailUrl: templateMeta.thumbnailUrl,
        configJson: JSON.stringify(configJson),
      });

      // Clean up localStorage draft
      localStorage.removeItem(`fabric_draft_${id}`);
      setDirty(false);

      toast.success("Template berhasil disimpan!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  }, [canvas, templateId, editId, templateMeta, setDirty]);

  const handleBack = () => {
    if (isDirty) {
      if (!confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?")) {
        return;
      }
    }
    router.push("/dashboard/templates");
  };

  // Auto-generate thumbnail from canvas
  const handleGenerateThumbnail = useCallback(() => {
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL({
        format: "png",
        quality: 0.8,
        multiplier: 0.5, // Half resolution for thumbnail
      });
      // For now just log — in production, upload to R2
      console.log("Thumbnail generated (data URL length):", dataUrl.length);
      toast.info("Thumbnail otomatis belum terintegrasikan dengan upload. Gunakan upload manual.");
    } catch (e) {
      console.error("Failed to generate thumbnail:", e);
    }
  }, [canvas]);

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col bg-gray-950">
      {/* Top Navigation */}
      <div className="h-12 bg-gray-950 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali
          </button>
          <span className="text-white/20">|</span>
          <span className="text-sm font-semibold text-white">
            Fabric Canvas Builder
          </span>
          {templateMeta.name && (
            <span className="text-xs text-gray-500">— {templateMeta.name}</span>
          )}
          {isDirty && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Belum disimpan</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={templateMeta.name}
            onChange={(e) => setTemplateMeta({ name: e.target.value })}
            placeholder="Nama Template..."
            className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-brand-500 w-48"
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-brand-500 px-5 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Builder */}
      <div className="flex-1 overflow-hidden">
        <FabricBuilderLayout />
      </div>
    </div>
  );
}

export default function FabricBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Memuat builder...</p>
          </div>
        </div>
      }
    >
      <BuilderPageContent />
    </Suspense>
  );
}
