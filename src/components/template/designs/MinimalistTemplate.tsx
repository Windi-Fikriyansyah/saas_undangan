import { TemplateProps } from "../TemplateRegistry";
import { getFontVariable } from "@/lib/fonts";
import { ClientFormData } from "@/lib/validations/client-form";
import RsvpForm from "../RsvpForm";
import Guestbook from "../Guestbook";

export default function MinimalistTemplate({ data, config, orderId, guests, guestName }: TemplateProps) {
  const headingFontClass = getFontVariable(config.typography.headingFont);
  const headingStyle = { fontFamily: `var(--font-${config.typography.headingFont})` };
  
  // Safe extraction of data (Cast to ClientFormData for type hinting)
  const formData = data as ClientFormData;
  
  const bride = formData.step1?.brideNickname || "Romeo";
  const groom = formData.step1?.groomNickname || "Juliet";
  
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
  const loveStory = formData.step3?.loveStory;

  const showGallery = config.features.showGallery && images.length > 0;
  const showLoveStory = config.features.showLoveStory && loveStory;
  const showGift = config.features.showGift && formData.step4?.bankAccount;

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-[var(--color-background)]">
      
      {/* Hero Section */}
      <section className="flex min-h-[90vh] w-full max-w-4xl flex-col items-center justify-center text-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-[var(--color-accent)]">
            The Wedding Of
          </p>
          <h1 
            className="text-6xl text-[var(--color-primary)] sm:text-7xl md:text-8xl"
            style={headingStyle}
          >
            {bride} & {groom}
          </h1>
        </div>

        <div className="my-12 h-px w-24 bg-[var(--color-secondary)]"></div>

        <div className="space-y-2">
          <p className="text-lg text-[var(--color-text)]">
            Save The Date
          </p>
          <p className="text-2xl font-medium tracking-wider text-[var(--color-text)]">
            {akadDate}
          </p>
        </div>
      </section>

      {/* Love Story Section */}
      {showLoveStory && (
        <section className="flex w-full max-w-2xl flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-8 text-4xl text-[var(--color-primary)]" style={headingStyle}>
            Our Story
          </h2>
          <p className="leading-relaxed text-[var(--color-text)] opacity-80">
            {loveStory}
          </p>
        </section>
      )}

      {/* Event Details Section */}
      <section className="flex w-full max-w-4xl flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-12 text-4xl text-[var(--color-primary)]" style={headingStyle}>
          Wedding Events
        </h2>
        
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
          {/* Akad */}
          <div className="rounded-2xl border border-[var(--color-secondary)] bg-black/5 p-8 backdrop-blur-sm">
            <h3 className="mb-2 text-2xl text-[var(--color-primary)]" style={headingStyle}>
              Akad Nikah
            </h3>
            <p className="font-semibold text-[var(--color-text)]">{akadDate}</p>
            <p className="mb-4 text-sm text-[var(--color-text)] opacity-80">{akadTime}</p>
            
            <p className="font-medium text-[var(--color-text)]">{akadVenue}</p>
            <p className="text-sm text-[var(--color-text)] opacity-80">{akadAddress}</p>
          </div>

          {/* Resepsi */}
          <div className="rounded-2xl border border-[var(--color-secondary)] bg-black/5 p-8 backdrop-blur-sm">
            <h3 className="mb-2 text-2xl text-[var(--color-primary)]" style={headingStyle}>
              Resepsi
            </h3>
            <p className="font-semibold text-[var(--color-text)]">{resepsiDate}</p>
            <p className="mb-4 text-sm text-[var(--color-text)] opacity-80">{resepsiTime}</p>
            
            <p className="font-medium text-[var(--color-text)]">{resepsiVenue}</p>
            <p className="text-sm text-[var(--color-text)] opacity-80">{resepsiAddress}</p>
          </div>
        </div>

        {gmapsLink && (
          <div className="mt-12">
            <a 
              href={gmapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium tracking-wider text-white transition-opacity hover:opacity-90"
            >
              Buka Google Maps
            </a>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      {showGallery && (
        <section className="flex w-full max-w-5xl flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-12 text-4xl text-[var(--color-primary)]" style={headingStyle}>
            Our Gallery
          </h2>
          
          <div className="columns-2 gap-4 space-y-4 md:columns-3">
            {images.map((img: string, i: number) => (
              <div key={i} className="break-inside-avoid overflow-hidden rounded-xl">
                <img src={img} alt={`Gallery ${i}`} className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gift Section */}
      {showGift && (
        <section className="flex w-full max-w-2xl flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-6 text-4xl text-[var(--color-primary)]" style={headingStyle}>
            Wedding Gift
          </h2>
          <p className="mb-8 text-[var(--color-text)] opacity-80">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda ingin memberikan tanda kasih, Anda dapat mengirimkannya melalui:
          </p>
          
          <div className="w-full rounded-2xl border border-[var(--color-secondary)] bg-white p-6 shadow-sm">
            <p className="text-lg font-bold text-[var(--color-text)]">{formData.step4?.bankName}</p>
            <p className="my-2 text-3xl font-mono text-[var(--color-primary)]">{formData.step4?.bankAccount}</p>
            <p className="text-sm text-[var(--color-text)] opacity-80">a.n. {formData.step4?.bankAccountName}</p>
          </div>
        </section>
      )}

      {/* RSVP & Guestbook Section */}
      <section className="flex w-full max-w-4xl flex-col items-center justify-center py-20">
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-12">
          {orderId ? (
            <RsvpForm orderId={orderId} defaultName={guestName} config={config} />
          ) : (
            <div className="w-full rounded-xl border border-dashed border-gray-300 p-6 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Form RSVP (Tersedia dalam Mode Publik)</p>
            </div>
          )}
          <Guestbook guests={guests || []} config={config} />
        </div>
      </section>

      {/* Footer / Quotes */}
      <footer className="mt-10 flex w-full flex-col items-center border-t border-[var(--color-secondary)] py-12 text-center">
        {formData.step4?.quotes && (
          <p className="mb-8 max-w-lg italic text-[var(--color-text)] opacity-80">
            "{formData.step4.quotes}"
          </p>
        )}
        <h2 className="text-3xl text-[var(--color-primary)]" style={headingStyle}>
          {bride} & {groom}
        </h2>
      </footer>

    </div>
  );
}
