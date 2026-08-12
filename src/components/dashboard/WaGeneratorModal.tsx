"use client";

import { useState } from "react";
import { generateWaLink } from "@/app/actions/guest";

interface WaGeneratorModalProps {
  orders: { id: string; clientName: string; slug: string }[];
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_MESSAGE = `Halo Bapak/Ibu/Saudara/i {{nama}},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Detail acara dan undangan lengkap dapat diakses melalui tautan berikut:
{{link}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia ini.

Terima kasih.`;

export default function WaGeneratorModal({ orders, isOpen, onClose }: WaGeneratorModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "");
  const [guestName, setGuestName] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_MESSAGE);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ waUrl: string; parsedMessage: string; inviteLink: string } | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !guestName) {
      setError("Silakan lengkapi pesanan dan nama tamu.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await generateWaLink(selectedOrderId, guestName, waNumber, messageTemplate);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.parsedMessage);
      alert("Pesan berhasil disalin!");
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Kirim Undangan (WhatsApp)
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {!result ? (
            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Pilih Klien/Pesanan <span className="text-danger">*</span>
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
                  required
                >
                  <option value="" disabled>Pilih Klien</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.clientName} (/{o.slug})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nama Tamu <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Bapak Budi Santoso"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Nama ini akan masuk ke link otomatis (cth: ?to=Bapak-Budi-Santoso)</p>
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nomor WhatsApp Tamu (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: 628123456789"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
                />
                <p className="mt-1 text-xs text-gray-500">Jika dikosongkan, Anda akan diminta memilih kontak di WhatsApp Web secara manual.</p>
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Template Pesan
                </label>
                <textarea
                  rows={6}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">Gunakan tag <code className="bg-gray-100 px-1">{'{{nama}}'}</code> dan <code className="bg-gray-100 px-1">{'{{link}}'}</code> untuk variabel dinamis.</p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded border border-stroke px-6 py-2 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {isLoading ? "Memproses..." : "Buat Pesan"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="rounded-sm border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4">
                <p className="mb-2 text-sm font-medium text-gray-500">Pratinjau Pesan:</p>
                <p className="whitespace-pre-wrap text-black dark:text-white text-sm font-serif">
                  {result.parsedMessage}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 rounded border border-stroke bg-white px-4 py-3 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
                >
                  Salin Teks Saja
                </button>
                <a
                  href={result.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded bg-success px-4 py-3 text-center font-medium text-white hover:bg-success/90"
                  onClick={() => {
                    // Close the modal after clicking WA if desired, but maybe keep it so they can copy just in case
                  }}
                >
                  Buka WhatsApp Web
                </a>
              </div>
              
              <button
                onClick={() => { setResult(null); setGuestName(""); setWaNumber(""); }}
                className="mt-2 text-center text-sm text-brand-500 hover:underline"
              >
                Kirim ke tamu lain
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
