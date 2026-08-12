import { TemplateProps } from "../TemplateRegistry";
import { getFontVariable } from "@/lib/fonts";
import { ClientFormData } from "@/lib/validations/client-form";
import RsvpForm from "../RsvpForm";
import Guestbook from "../Guestbook";

export default function RusticTemplate({ data, config, orderId, guests, guestName }: TemplateProps) {
  const headingStyle = { fontFamily: `var(--font-${config.typography.headingFont})` };
  const formData = data as ClientFormData;
  
  const bride = formData.step1?.brideNickname || "Sarah";
  const groom = formData.step1?.groomNickname || "Michael";
  
  const akadDate = formData.step2?.akadDate || "24 Desember 2026";
  const akadTime = formData.step2?.akadTime || "08:00 - Selesai";
  const akadVenue = formData.step2?.akadVenue || "Taman Bunga";
  const akadAddress = formData.step2?.akadAddress || "Jl. Pegunungan No. 123";
  
  const resepsiDate = formData.step2?.resepsiDate || "24 Desember 2026";
  const resepsiTime = formData.step2?.resepsiTime || "11:00 - Selesai";
  const resepsiVenue = formData.step2?.resepsiVenue || "Outdoor Garden";
  const resepsiAddress = formData.step2?.resepsiAddress || "Jl. Pegunungan No. 123";

  const gmapsLink = formData.step2?.gmapsLink;
  const images = formData.step3?.galleryImages || [];
  const loveStory = formData.step3?.loveStory;

  const showGallery = config.features.showGallery && images.length > 0;
  const showLoveStory = config.features.showLoveStory && loveStory;
  const showGift = config.features.showGift && formData.step4?.bankAccount;

  // Rustic SVG Ornaments (Leaves/Botanical)
  const LeafOrnament = ({ className }: { className?: string }) => (
    <svg className={className} width="120" height="120" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M45.5,10.2c-5.8,11.2-11.4,22.3-15.5,34.1c-2,5.7-3.1,11.8-3.4,17.9c-0.1,2.8,0,5.6,0.3,8.4c0.5,4.7,2.2,9.3,5.1,13 c1.6,2.1,3.7,3.8,6,5.1c2.8,1.5,6.1,2.1,9.3,2c11.9-0.4,22.7-7.2,30.3-16c6.2-7.1,10.5-16.1,11.6-25.5c0.4-3.5,0.2-7.1-0.6-10.5 c-1.2-4.9-3.9-9.5-7.9-12.8c-2.4-2-5.3-3.3-8.4-4c-6.1-1.3-12.6,0.3-17.7,3.6c-4.9,3.2-8.7,8-10.9,13.3c-2.1,5.2-2.7,11-2,16.5 M51.5,84.1c-1.3-0.9-2.5-1.9-3.4-3.2c-2.3-3.1-3.6-7-3.8-10.9c-0.3-4.5,0.7-9,2.4-13.2c2.7-6.8,7-12.8,12.2-17.6 c3.3-3.1,7.2-5.7,11.5-7.3c1.9-0.7,3.8-1.2,5.8-1.3c2.4-0.1,4.7,0.7,6.8,1.9c3,1.8,5.1,4.9,6,8.2c1.3,4.7,1.2,9.7-0.1,14.3 c-2.4,8.1-7.8,15.1-14.7,19.9C67,80,59,83.4,51.5,84.1z"/>
      <path d="M29.5,43.2c-4.8,3.2-9,7.1-12.4,11.6c-3,4.1-5.1,9-5.9,14.1c-0.4,2.5-0.5,5-0.2,7.5c0.5,3.6,1.7,7.1,3.8,10 c1.4,1.8,3.1,3.3,5.1,4.3c2.8,1.4,6.1,1.8,9.2,1.3c9.1-1.4,16.6-7.8,21-15.6c3.6-6.4,5-14.1,4.2-21.4c-0.3-2.6-1.1-5.2-2.3-7.5 c-1.8-3.4-4.8-6.1-8.5-7.5c-2.2-0.8-4.7-1.1-7-0.8c-5,0.5-9.6,3.2-12.9,6.9c-3.1,3.5-5.1,8.1-5.7,12.8c-0.6,4.5,0.4,9.1,2.5,13.1"/>
    </svg>
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--color-background)] pb-20 relative overflow-hidden text-center">
      
      {/* Background Decor */}
      <LeafOrnament className="absolute -left-10 top-0 text-[var(--color-secondary)] opacity-30 rotate-45 scale-150" />
      <LeafOrnament className="absolute -right-10 top-40 text-[var(--color-secondary)] opacity-30 -rotate-90 scale-150" />

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[90vh] w-full max-w-4xl flex-col items-center justify-center">
        <div className="rounded-t-full border-4 border-[var(--color-primary)] p-12 sm:p-16 lg:p-24 shadow-2xl bg-[var(--color-background)]">
          <p className="mb-6 text-sm uppercase tracking-widest text-[var(--color-accent)] font-sans">
            The Wedding Of
          </p>
          <h1 
            className="text-7xl text-[var(--color-primary)] sm:text-8xl md:text-9xl tracking-tight"
            style={headingStyle}
          >
            {bride}
          </h1>
          <h2 className="my-2 text-4xl text-[var(--color-accent)] sm:text-5xl" style={headingStyle}>
            &
          </h2>
          <h1 
            className="text-7xl text-[var(--color-primary)] sm:text-8xl md:text-9xl tracking-tight"
            style={headingStyle}
          >
            {groom}
          </h1>
        </div>

        <div className="mt-12 space-y-3">
          <p className="text-xl text-[var(--color-text)] font-sans font-light">
            We Invite You To Celebrate
          </p>
          <p className="text-2xl font-bold tracking-widest text-[var(--color-text)] uppercase">
            {akadDate}
          </p>
        </div>
      </section>

      {/* Love Story Section */}
      {showLoveStory && (
        <section className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center py-20 px-4">
          <LeafOrnament className="mb-6 h-12 w-12 text-[var(--color-primary)]" />
          <h2 className="mb-8 text-5xl text-[var(--color-primary)]" style={headingStyle}>
            Our Story
          </h2>
          <p className="text-lg leading-loose text-[var(--color-text)] opacity-90 font-serif max-w-2xl">
            {loveStory}
          </p>
        </section>
      )}

      {/* Event Details Section */}
      <section className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center py-20 px-4">
        <h2 className="mb-16 text-5xl text-[var(--color-primary)]" style={headingStyle}>
          Wedding Events
        </h2>
        
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
          {/* Akad */}
          <div className="relative rounded-lg border-2 border-dashed border-[var(--color-primary)] bg-[#ffffff80] p-10 backdrop-blur-md">
            <h3 className="mb-4 text-4xl text-[var(--color-accent)]" style={headingStyle}>
              Akad Nikah
            </h3>
            <p className="font-bold tracking-wider text-[var(--color-text)] uppercase">{akadDate}</p>
            <p className="mb-6 font-serif italic text-[var(--color-text)]">{akadTime}</p>
            
            <p className="text-lg font-semibold text-[var(--color-text)]">{akadVenue}</p>
            <p className="font-serif text-[var(--color-text)] opacity-80">{akadAddress}</p>
          </div>

          {/* Resepsi */}
          <div className="relative rounded-lg border-2 border-dashed border-[var(--color-primary)] bg-[#ffffff80] p-10 backdrop-blur-md">
            <h3 className="mb-4 text-4xl text-[var(--color-accent)]" style={headingStyle}>
              Resepsi
            </h3>
            <p className="font-bold tracking-wider text-[var(--color-text)] uppercase">{resepsiDate}</p>
            <p className="mb-6 font-serif italic text-[var(--color-text)]">{resepsiTime}</p>
            
            <p className="text-lg font-semibold text-[var(--color-text)]">{resepsiVenue}</p>
            <p className="font-serif text-[var(--color-text)] opacity-80">{resepsiAddress}</p>
          </div>
        </div>

        {gmapsLink && (
          <div className="mt-16">
            <a 
              href={gmapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block rounded border-2 border-[var(--color-primary)] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              Open Google Maps
            </a>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      {showGallery && (
        <section className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center py-20 px-4">
          <LeafOrnament className="mb-6 h-12 w-12 text-[var(--color-accent)] rotate-180" />
          <h2 className="mb-12 text-5xl text-[var(--color-primary)]" style={headingStyle}>
            Gallery
          </h2>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.map((img: string, i: number) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded shadow-lg">
                <img src={img} alt={`Gallery ${i}`} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-125" loading="lazy" />
                <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40"></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gift Section */}
      {showGift && (
        <section className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center py-20 px-4">
          <h2 className="mb-6 text-5xl text-[var(--color-primary)]" style={headingStyle}>
            Wedding Gift
          </h2>
          <p className="mb-10 font-serif text-lg leading-relaxed text-[var(--color-text)] opacity-80">
            Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih dapat melalui rekening di bawah ini:
          </p>
          
          <div className="relative w-full rounded border border-[var(--color-secondary)] bg-[#ffffff80] p-8 shadow-sm backdrop-blur-md">
            <p className="text-xl font-bold uppercase tracking-widest text-[var(--color-primary)]">{formData.step4?.bankName}</p>
            <p className="my-4 text-4xl font-mono text-[var(--color-accent)]">{formData.step4?.bankAccount}</p>
            <p className="font-serif italic text-[var(--color-text)] text-lg">a.n. {formData.step4?.bankAccountName}</p>
          </div>
        </section>
      )}

      {/* RSVP & Guestbook Section */}
      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center py-20 px-4">
        <h2 className="mb-12 text-5xl text-[var(--color-primary)]" style={headingStyle}>
          RSVP & Guestbook
        </h2>
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
      <footer className="relative z-10 mt-10 flex w-full flex-col items-center py-12 px-4">
        {formData.step4?.quotes && (
          <p className="mb-12 max-w-xl font-serif text-xl italic leading-relaxed text-[var(--color-text)] opacity-80">
            "{formData.step4.quotes}"
          </p>
        )}
        <LeafOrnament className="mb-6 h-12 w-12 text-[var(--color-secondary)] rotate-45" />
        <h2 className="text-5xl text-[var(--color-primary)]" style={headingStyle}>
          {bride} & {groom}
        </h2>
      </footer>

    </div>
  );
}
