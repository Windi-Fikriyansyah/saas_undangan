"use client";

import React, { useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({ onUploadSuccess, folder = "uploads", maxSizeMB = 2 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file maksimal ${maxSizeMB}MB`);
      e.target.value = '';
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diperbolehkan");
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setProgress(10);

    try {
      // 1. Get presigned URL
      const res = await fetch("/api/upload/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mendapatkan link upload");
      }

      const { signedUrl, publicUrl } = await res.json();
      setProgress(50);

      // 2. Upload to R2 directly
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file ke server");
      }

      setProgress(100);
      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-brand-50 file:text-brand-700
          hover:file:bg-brand-100
          disabled:opacity-50 disabled:cursor-not-allowed
          border rounded p-1"
      />
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded">
          <div className="w-full max-w-[80%] bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
