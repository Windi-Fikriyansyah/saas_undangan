"use client";

import { useState, useEffect } from "react";
import { completeOnboarding, checkSubdomainAvailability } from "@/app/actions/vendor";
import { useRouter } from "next/navigation";

interface OnboardingWizardProps {
  initialData: { name: string; email: string };
}

export default function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    logoUrl: "",
    waNumber: "",
    subdomain: "",
  });

  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    if (!formData.subdomain || formData.subdomain.length < 3) {
      setSubdomainStatus("idle");
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setSubdomainStatus("checking");
      try {
        const isAvailable = await checkSubdomainAvailability(formData.subdomain);
        setSubdomainStatus(isAvailable ? "available" : "taken");
      } catch (err) {
        setSubdomainStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.subdomain]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    setUploading(true);
    try {
      // Get presigned URL
      const res = await fetch("/api/upload/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: logoFile.name,
          contentType: logoFile.type,
          folder: "logos",
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mendapatkan link upload");
      }

      const { signedUrl, publicUrl } = await res.json();

      // Upload to R2 directly
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": logoFile.type,
        },
        body: logoFile,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file ke server");
      }

      return publicUrl;
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah logo");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalLogoUrl = formData.logoUrl;
      
      // If user selected a new logo, upload it first
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          finalLogoUrl = uploadedUrl;
        } else {
          setLoading(false);
          return; // Stop if upload failed
        }
      }

      await completeOnboarding({
        ...formData,
        logoUrl: finalLogoUrl,
      });

      setStep(3); // Go to success step
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-10">
      
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${step >= 1 ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>1</div>
        <div className={`h-1 w-16 rounded ${step >= 2 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${step >= 2 ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>2</div>
        <div className={`h-1 w-16 rounded ${step >= 3 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${step >= 3 ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>3</div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-black dark:text-white">Profil Bisnis</h2>
          
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nama Bisnis / Brand
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Misal: Senja Undangan"
              className="w-full rounded border border-stroke bg-transparent px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Logo Bisnis (Opsional)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 overflow-hidden rounded-full border border-stroke bg-gray-100 dark:border-strokedark dark:bg-gray-800">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                )}
              </div>
              <label className="cursor-pointer rounded border border-stroke px-4 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
                Pilih File
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!formData.name}
              className="rounded bg-brand-500 px-8 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-xl font-bold text-black dark:text-white">Domain & Kontak</h2>
          
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nomor WhatsApp Admin
            </label>
            <input
              type="text"
              required
              value={formData.waNumber}
              onChange={(e) => setFormData({ ...formData, waNumber: e.target.value })}
              placeholder="081234567890"
              className="w-full rounded border border-stroke bg-transparent px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-brand-500"
            />
            <p className="mt-1 text-xs text-gray-500">Nomor ini akan digunakan klien untuk menghubungi Anda.</p>
          </div>

          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Subdomain URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l border border-r-0 border-stroke bg-gray-2 px-4 py-3 text-sm text-gray-600 dark:border-strokedark dark:bg-meta-4 dark:text-gray-300">
                https://
              </span>
              <input
                type="text"
                required
                value={formData.subdomain}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                  setFormData({ ...formData, subdomain: val });
                }}
                placeholder="tes"
                className="w-full border border-stroke bg-transparent px-4.5 py-3 text-black focus:border-brand-500 focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-brand-500"
              />
              <span className="inline-flex items-center rounded-r border border-l-0 border-stroke bg-gray-2 px-4 py-3 text-sm text-gray-600 dark:border-strokedark dark:bg-meta-4 dark:text-gray-300">
                .{process.env.NEXT_PUBLIC_MAIN_DOMAIN || "saas-undangan.com"}
              </span>
            </div>
            
            <div className="mt-2 h-5">
              {subdomainStatus === "checking" && <p className="text-xs text-gray-500">Mengecek ketersediaan...</p>}
              {subdomainStatus === "available" && <p className="text-xs text-success font-medium">✅ Subdomain tersedia!</p>}
              {subdomainStatus === "taken" && <p className="text-xs text-danger font-medium">❌ Subdomain sudah digunakan, pilih yang lain.</p>}
              {subdomainStatus === "idle" && <p className="text-xs text-gray-500">Hanya boleh huruf kecil, angka, dan tanda hubung (-). Min. 3 karakter.</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={loading}
              className="rounded border border-stroke px-8 py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.waNumber || !formData.subdomain || subdomainStatus === "taken"}
              className="rounded bg-brand-500 px-8 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Selesai & Simpan"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center animate-in zoom-in duration-500 py-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Selamat!</h2>
          <p className="text-gray-500">
            Profil bisnis Anda berhasil diatur. Anda sudah siap untuk menerima pesanan undangan pertama Anda.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 inline-flex rounded bg-brand-500 px-8 py-3 font-medium text-white hover:bg-brand-600"
          >
            Masuk ke Dashboard
          </button>
        </div>
      )}

    </div>
  );
}
