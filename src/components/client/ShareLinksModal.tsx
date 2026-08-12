"use client";

import { useState } from "react";

interface Guest {
  id: string;
  name: string;
}

interface ShareLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  domain: string;
  orderSlug: string;
}

export default function ShareLinksModal({ isOpen, onClose, guests, domain, orderSlug }: ShareLinksModalProps) {
  const [messageTemplate, setMessageTemplate] = useState(
    "Kepada Yth. Bapak/Ibu/Saudara/i {nama_tamu},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir pada acara pernikahan kami. Berikut adalah link undangan Anda:\n\n{link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih."
  );

  if (!isOpen) return null;

  const generateMessage = (guestName: string) => {
    const link = `${domain}/${orderSlug}?to=${guestName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return messageTemplate
      .replace(/{nama_tamu}/g, guestName)
      .replace(/{link}/g, link);
  };

  const handleCopySingle = (guestName: string) => {
    const text = generateMessage(guestName);
    navigator.clipboard.writeText(text);
    alert(`Pesan untuk ${guestName} berhasil disalin!`);
  };

  const handleCopyAll = () => {
    const allLinks = guests.map(guest => {
      const link = `${domain}/${orderSlug}?to=${guest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return `${guest.name} - ${link}`;
    }).join("\n");
    
    navigator.clipboard.writeText(allLinks);
    alert("Semua link tamu berhasil disalin!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl dark:bg-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bagikan Undangan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Template Pesan
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Gunakan <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{"{nama_tamu}"}</span> dan <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{"{link}"}</span> sebagai variabel otomatis.
            </p>
            <textarea
              rows={6}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Daftar Tamu ({guests.length})</h4>
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Salin Semua Link
            </button>
          </div>

          <div className="space-y-3">
            {guests.map(guest => (
              <div key={guest.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-750">
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{guest.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {`${domain}/${orderSlug}?to=${guest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  </p>
                </div>
                <button
                  onClick={() => handleCopySingle(guest.name)}
                  className="shrink-0 inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Salin Pesan
                </button>
              </div>
            ))}
            {guests.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada daftar tamu.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
