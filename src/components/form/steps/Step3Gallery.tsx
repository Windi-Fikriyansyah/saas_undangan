"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ClientFormData } from "@/lib/validations/client-form";

export default function Step3Gallery({ clientToken }: { clientToken: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ClientFormData>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const images = watch("step3.galleryImages") || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      setUploadError("Maksimal hanya 10 foto yang diperbolehkan.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} terlalu besar (Max 5MB).`);
        }

        // 1. Get presigned URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            clientToken,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal mendapatkan akses upload.");
        }

        const { signedUrl, publicUrl } = await res.json();

        // 2. Upload file directly to Cloudflare R2
        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error(`Gagal mengunggah ${file.name}.`);
        }

        newImages.push(publicUrl);
      }

      // Update form state
      setValue("step3.galleryImages", newImages, { shouldValidate: true, shouldDirty: true });
    } catch (err: any) {
      setUploadError(err.message || "Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("step3.galleryImages", newImages, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Galeri & Cerita</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Unggah momen pre-wedding terbaik Anda (Maksimal 10 foto).
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Foto Galeri ({images.length}/10)
        </label>
        
        {/* Upload Dropzone */}
        <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <svg className="mb-2 h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mengunggah foto...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-500">Klik untuk unggah</span> atau seret foto ke sini
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (Max 5MB)</p>
            </div>
          )}
          <input 
            type="file" 
            multiple 
            accept="image/jpeg, image/png, image/webp"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" 
            onChange={handleFileUpload}
            disabled={isUploading || images.length >= 10}
          />
        </div>
        
        {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
        {errors.step3?.galleryImages && <p className="mt-2 text-sm text-red-500">{errors.step3.galleryImages.message}</p>}

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((url, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <img src={url} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Link Video Prawedding (Opsional)</label>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          Masukkan link YouTube atau Vimeo jika ada.
        </p>
        <input 
          {...register("step3.videoLink")} 
          placeholder="https://youtube.com/watch?v=..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
        />
        {errors.step3?.videoLink && <p className="mt-1 text-xs text-red-500">{errors.step3.videoLink.message}</p>}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Cerita Cinta Singkat (Opsional)</label>
        <textarea 
          {...register("step3.loveStory")} 
          rows={4}
          placeholder="Awal mula bertemu..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
        />
      </div>
    </div>
  );
}
