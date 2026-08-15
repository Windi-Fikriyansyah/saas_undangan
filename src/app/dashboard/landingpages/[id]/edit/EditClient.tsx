"use client";

import React, { useState, useEffect } from "react";
import { BuilderLayout } from "@/components/landing-builder/BuilderLayout";
import { useBuilderStore } from "@/components/landing-builder/store";
import { saveLandingPage } from "@/app/actions/landingpage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";

interface EditLandingPageClientProps {
  landingPage: {
    id: string;
    name: string;
    slug: string;
    content: any;
    isActive: boolean;
  };
}

export default function EditLandingPageClient({ landingPage }: EditLandingPageClientProps) {
  const { blocks, pageMeta, setInitialState } = useBuilderStore();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load store on mount
    const initialBlocks = Array.isArray(landingPage.content) ? landingPage.content : [];
    setInitialState(initialBlocks, { name: landingPage.name, slug: landingPage.slug });
  }, [setInitialState, landingPage]);

  // Handle browser refresh or closing tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (blocks.length > 0 && !isSaving) {
        e.preventDefault();
        e.returnValue = "Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?";
        return e.returnValue;
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [blocks, isSaving]);

  const handleBack = () => {
    if (confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar tanpa menyimpan?")) {
      router.push("/dashboard/landingpages");
    }
  };

  const handleSave = async (isPublished: boolean) => {
    if (!pageMeta.name || !pageMeta.slug) {
      toast.error("Nama halaman dan URL Slug wajib diisi di Pengaturan Halaman");
      return;
    }
    
    if (blocks.length === 0) {
      toast.error("Halaman masih kosong, tambahkan minimal 1 komponen");
      return;
    }

    setIsSaving(true);
    try {
      await saveLandingPage({
        id: landingPage.id,
        name: pageMeta.name,
        slug: pageMeta.slug,
        blocks: blocks,
        isActive: isPublished,
      });
      toast.success(isPublished ? "Landing page berhasil diperbarui!" : "Landing page disimpan sebagai draft!");
      router.push("/dashboard/landingpages");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan landing page");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="bg-white border-b border-stroke dark:bg-boxdark dark:border-strokedark px-6 py-3 flex items-center justify-between z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 text-sm font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            Kembali
          </button>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Edit Promosi Halaman
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)} 
            disabled={isSaving}
          >
            Simpan Draft
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleSave(true)} 
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan & Publish"}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <BuilderLayout />
      </div>
    </div>
  );
}
