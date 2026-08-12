"use client";

import { useState } from "react";
import { submitRsvp } from "@/app/actions/guest";
import { useRouter } from "next/navigation";

interface RsvpFormProps {
  orderId: string;
  defaultName?: string;
  config?: any;
}

export default function RsvpForm({ orderId, defaultName = "", config }: RsvpFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const headingStyle = { fontFamily: `var(--font-${config?.typography?.headingFont || "playfair"})` };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const rsvpStatus = formData.get("rsvpStatus") as string;
    const rsvpCount = parseInt(formData.get("rsvpCount") as string);
    const message = formData.get("message") as string;

    try {
      await submitRsvp(orderId, { name, rsvpStatus, rsvpCount, message });
      setSuccess(true);
      router.refresh(); // refresh the server component to get new guestbook entries
    } catch (err: any) {
      setError(err.message || "Gagal mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-[var(--color-secondary)] bg-[#ffffff90] p-6 backdrop-blur shadow-sm text-left relative z-10">
      <h3 className="mb-6 text-3xl text-[var(--color-primary)] text-center" style={headingStyle}>
        RSVP & Ucapan
      </h3>
      
      {success ? (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 text-center border border-green-200">
          <p className="font-semibold">Terima Kasih!</p>
          <p className="text-sm">Konfirmasi kehadiran dan pesan Anda telah terkirim.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 text-xs underline text-green-700"
          >
            Kirim pesan lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Nama
            </label>
            <input
              name="name"
              required
              defaultValue={defaultName}
              placeholder="Nama Anda"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
                Kehadiran
              </label>
              <select
                name="rsvpStatus"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="HADIR">Hadir</option>
                <option value="TIDAK_HADIR">Tidak Hadir</option>
                <option value="RAGU">Mungkin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
                Jumlah Hadir
              </label>
              <select
                name="rsvpCount"
                required
                defaultValue="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
                <option value="3">3 Orang</option>
                <option value="4">4+ Orang</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Pesan / Ucapan Doa
            </label>
            <textarea
              name="message"
              required
              rows={3}
              placeholder="Tuliskan ucapan dan doa restu..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            ></textarea>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim RSVP"}
          </button>
        </form>
      )}
    </div>
  );
}
