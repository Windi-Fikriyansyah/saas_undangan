"use client";

interface GuestbookProps {
  guests: any[];
  config?: any;
}

export default function Guestbook({ guests, config }: GuestbookProps) {
  const headingStyle = { fontFamily: `var(--font-${config?.typography?.headingFont || "playfair"})` };

  // Filter out guests without messages
  const messages = guests.filter(g => g.message && g.message.trim() !== "");

  return (
    <div className="w-full relative z-10">
      <h3 className="mb-6 text-3xl text-[var(--color-primary)] text-center" style={headingStyle}>
        Buku Tamu
      </h3>
      
      <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-text)] opacity-70 italic">
            Belum ada ucapan. Jadilah yang pertama memberikan ucapan!
          </p>
        ) : (
          messages.map((g) => (
            <div key={g.id} className="rounded-xl border border-[var(--color-secondary)] bg-white/60 p-4 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-[var(--color-text)]">{g.name}</p>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider ${
                  g.rsvpStatus === "HADIR" ? "bg-green-100 text-green-700" :
                  g.rsvpStatus === "TIDAK_HADIR" ? "bg-red-100 text-red-700" :
                  "bg-gray-200 text-gray-700"
                }`}>
                  {g.rsvpStatus.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed opacity-90">
                {g.message}
              </p>
              <p className="text-xs text-[var(--color-text)] opacity-50 mt-3 text-right">
                {new Date(g.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
