import { TemplateProps } from "../TemplateRegistry";
import { getFontVariable } from "@/lib/fonts";
import { ClientFormData } from "@/lib/validations/client-form";
import RsvpForm from "../RsvpForm";
import Guestbook from "../Guestbook";
import { toast } from "sonner";

export default function EleganTemplate({ data, config, orderId, guests, guestName }: TemplateProps) {
  // Use a highly elegant serif font if available, fallback to whatever is configured
  const headingFontClass = getFontVariable(config.typography.headingFont);
  const headingStyle = { fontFamily: `var(--font-${config.typography.headingFont})` };
  
  const formData = data as ClientFormData;
  
  const bride = formData.step1?.brideNickname || "Romeo";
  const groom = formData.step1?.groomNickname || "Juliet";
  const brideFull = formData.step1?.brideName || "Romeo Montague";
  const groomFull = formData.step1?.groomName || "Juliet Capulet";
  
  const akadDate = formData.step2?.akadDate || "24 Desember 2026";
  const akadTime = formData.step2?.akadTime || "08:00 - Selesai";
  const akadVenue = formData.step2?.akadVenue || "Masjid Raya";
  const akadAddress = formData.step2?.akadAddress || "Jl. Contoh No. 123";
  
  const resepsiDate = formData.step2?.resepsiDate || "24 Desember 2026";
  const resepsiTime = formData.step2?.resepsiTime || "11:00 - Selesai";
  const resepsiVenue = formData.step2?.resepsiVenue || "Gedung Pernikahan";
  const resepsiAddress = formData.step2?.resepsiAddress || "Jl. Contoh No. 123";

  const gmapsLink = formData.step2?.gmapsLink;
  
  const images = formData.step3?.galleryImages || [];
  // Dummy gallery if none provided just to show the beauty
  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
  ];

  const loveStory = formData.step3?.loveStory || "Awal pertemuan kami seperti sebuah kebetulan yang sempurna. Seiring berjalannya waktu, kami menyadari bahwa kami saling melengkapi. Dan kini, kami siap untuk mengikat janji suci dan memulai babak baru dalam kehidupan kami.";

  const showGallery = config.features.showGallery !== false;
  const showLoveStory = config.features.showLoveStory !== false;
  const showGift = config.features.showGift !== false;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden selection:bg-[#d4af37] selection:text-[#0f172a]">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#d4af37] blur-[120px]"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-900 blur-[120px]"></div>
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-slate-800 blur-[150px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center text-center px-4 overflow-hidden z-10 pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/80 to-[#0f172a]"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-[#d4af37]">
            Pernikahan Suci
          </p>
          <div className="relative">
            <h1 
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none text-white font-light tracking-tight"
              style={headingStyle}
            >
              {bride}
              <span className="block text-4xl sm:text-5xl md:text-6xl text-[#d4af37] italic my-2 sm:my-4">&</span>
              {groom}
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-light tracking-widest text-slate-300 mt-8 border-t border-b border-[#d4af37]/30 py-4 px-8">
            {akadDate}
          </p>
        </div>
      </section>

      {/* Surah / Quote Section */}
      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center py-32 px-6 text-center">
        <div className="text-4xl text-[#d4af37] mb-8">❝</div>
        <p className="text-lg md:text-xl font-light leading-relaxed text-slate-300 italic">
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
        </p>
        <p className="mt-6 text-sm uppercase tracking-widest text-[#d4af37]">
          (Ar-Rum: 21)
        </p>
      </section>

      {/* Couple Section */}
      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl mb-24 text-center text-white" style={headingStyle}>
          Mempelai
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 w-full">
          
          {/* Bride */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-48 h-64 md:w-56 md:h-72 mb-8 rounded-t-full rounded-b-md overflow-hidden p-1 border border-[#d4af37]/40 relative">
              <div className="w-full h-full rounded-t-full rounded-b-sm overflow-hidden bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1543165365-07232ed12fad?q=80&w=1974&auto=format&fit=crop" 
                  alt="Bride" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>
            <h3 className="text-3xl text-white mb-2" style={headingStyle}>{brideFull}</h3>
            <p className="text-slate-400 text-sm">{formData.step1?.brideParents || "Putri dari Bapak & Ibu"}</p>
          </div>

          <div className="text-[#d4af37] text-5xl italic font-serif">
            &
          </div>

          {/* Groom */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-48 h-64 md:w-56 md:h-72 mb-8 rounded-t-full rounded-b-md overflow-hidden p-1 border border-[#d4af37]/40 relative">
              <div className="w-full h-full rounded-t-full rounded-b-sm overflow-hidden bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                  alt="Groom" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>
            <h3 className="text-3xl text-white mb-2" style={headingStyle}>{groomFull}</h3>
            <p className="text-slate-400 text-sm">{formData.step1?.groomParents || "Putra dari Bapak & Ibu"}</p>
          </div>

        </div>
      </section>

      {/* Love Story Section */}
      {showLoveStory && (
        <section className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent mb-12"></div>
          <h2 className="mb-8 text-4xl md:text-5xl text-white" style={headingStyle}>
            Kisah Kasih
          </h2>
          <p className="leading-relaxed text-slate-300 font-light text-lg">
            {loveStory}
          </p>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent mt-12"></div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="relative z-10 flex w-full flex-col items-center justify-center py-24 px-6 bg-[#0B1120] w-screen">
        <h2 className="mb-16 text-4xl md:text-5xl text-center text-white" style={headingStyle}>
          Rangkaian Acara
        </h2>
        
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Akad */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] p-10 hover:border-[#d4af37]/50 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="mb-8 flex justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            
            <h3 className="mb-6 text-3xl text-center text-white" style={headingStyle}>
              Akad Nikah
            </h3>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-[#d4af37] uppercase tracking-widest text-sm mb-1">Tanggal</p>
                <p className="font-light text-lg text-slate-200">{akadDate}</p>
                <p className="text-sm text-slate-400">{akadTime}</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[#d4af37] uppercase tracking-widest text-sm mb-1">Tempat</p>
                <p className="font-light text-lg text-slate-200">{akadVenue}</p>
                <p className="text-sm text-slate-400 mt-1">{akadAddress}</p>
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] p-10 hover:border-[#d4af37]/50 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="mb-8 flex justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            
            <h3 className="mb-6 text-3xl text-center text-white" style={headingStyle}>
              Resepsi
            </h3>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-[#d4af37] uppercase tracking-widest text-sm mb-1">Tanggal</p>
                <p className="font-light text-lg text-slate-200">{resepsiDate}</p>
                <p className="text-sm text-slate-400">{resepsiTime}</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[#d4af37] uppercase tracking-widest text-sm mb-1">Tempat</p>
                <p className="font-light text-lg text-slate-200">{resepsiVenue}</p>
                <p className="text-sm text-slate-400 mt-1">{resepsiAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {gmapsLink && (
          <div className="mt-16">
            <a 
              href={gmapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#d4af37] bg-transparent px-8 py-4 text-sm uppercase tracking-widest text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-[#0f172a]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Buka Peta Lokasi
            </a>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      {showGallery && (
        <section className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center py-24 px-4 sm:px-6">
          <h2 className="mb-16 text-4xl md:text-5xl text-white" style={headingStyle}>
            Galeri
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-full">
            {displayImages.map((img: string, i: number) => (
              <div 
                key={i} 
                className={`relative overflow-hidden rounded-sm group ${i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover min-h-[200px] md:min-h-[300px] transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                  loading="lazy" 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gift Section */}
      {showGift && (
        <section className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center py-24 px-6 text-center">
          <h2 className="mb-8 text-4xl md:text-5xl text-white" style={headingStyle}>
            Tanda Kasih
          </h2>
          <p className="mb-10 font-light text-slate-300 leading-relaxed">
            Doa dan restu Anda di hari bahagia kami sudah sangat cukup bagi kami. Namun jika Anda ingin memberikan hadiah, silakan melalui rekening di bawah ini:
          </p>
          
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-800 to-[#0f172a] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37]"></div>
            
            <p className="text-xl text-[#d4af37] mb-4">{formData.step4?.bankName || "BCA"}</p>
            <div className="bg-slate-900/50 rounded p-4 mb-4">
              <p className="text-3xl font-mono text-white tracking-widest">{formData.step4?.bankAccount || "1234 5678 90"}</p>
            </div>
            <p className="text-slate-400">a.n. <span className="text-white">{formData.step4?.bankAccountName || "Nama Pemilik Rekening"}</span></p>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(formData.step4?.bankAccount || "1234 5678 90");
                toast.success("Nomor rekening berhasil disalin!");
              }}
              className="mt-8 text-xs uppercase tracking-widest text-slate-400 hover:text-[#d4af37] transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Salin Nomor Rekening
            </button>
          </div>
        </section>
      )}

      {/* RSVP & Guestbook Section */}
      <section className="relative z-10 flex w-full flex-col items-center justify-center py-24 px-6 bg-[#0B1120] w-screen">
        <h2 className="mb-16 text-4xl md:text-5xl text-white text-center" style={headingStyle}>
          Kehadiran & Ucapan
        </h2>
        
        <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="w-full">
            <h3 className="text-2xl text-[#d4af37] mb-8 font-light border-b border-slate-800 pb-4">Konfirmasi Kehadiran</h3>
            {orderId ? (
              <div className="bg-[#0f172a] p-6 sm:p-8 rounded-xl border border-slate-800">
                <RsvpForm orderId={orderId} defaultName={guestName} config={{...config, colorScheme: { primary: "#d4af37", secondary: "#1e293b", background: "#0f172a", text: "#e2e8f0", accent: "#fde047" }}} />
              </div>
            ) : (
              <div className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-10 flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p className="text-slate-400 font-light">Form RSVP akan tersedia pada undangan yang telah dipublikasikan.</p>
              </div>
            )}
          </div>
          
          <div className="w-full">
            <h3 className="text-2xl text-[#d4af37] mb-8 font-light border-b border-slate-800 pb-4">Buku Tamu</h3>
            <div className="bg-[#0f172a] p-4 sm:p-6 rounded-xl border border-slate-800 h-[500px] overflow-hidden">
              <Guestbook guests={guests || []} config={{...config, colorScheme: { primary: "#d4af37", secondary: "#1e293b", background: "#0f172a", text: "#e2e8f0", accent: "#fde047" }}} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 flex w-full flex-col items-center py-24 text-center px-4">
        {formData.step4?.quotes && (
          <p className="mb-12 max-w-xl italic font-light text-slate-400 text-lg">
            "{formData.step4.quotes}"
          </p>
        )}
        <p className="text-sm uppercase tracking-[0.3em] text-[#d4af37] mb-4">
          Terima Kasih
        </p>
        <h2 className="text-5xl text-white" style={headingStyle}>
          {bride} & {groom}
        </h2>
      </footer>

    </div>
  );
}
