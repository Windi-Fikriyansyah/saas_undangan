import Section from "../ui/Section";
export default function ClosingBlock({ background, eyebrow, title, names, date, quote, signature, logo, social, animation }: any) { return <Section id="closing" background={background} animation={animation} className="flex items-center justify-center text-center"><div>
  {logo?.src && <img src={logo.src} alt={logo.alt || "Logo"} className="mx-auto mb-8 h-20 w-auto object-contain drop-shadow-xl" />}
  <p className="text-xs tracking-[.35em] uppercase opacity-65">{eyebrow}</p>
  <h2 className="font-heading mt-5 text-7xl md:text-[10rem] leading-[.8]">{title}</h2>
  <p className="font-heading mt-8 text-4xl md:text-6xl">{names}</p>
  <p className="mt-5 text-xs tracking-[.2em] opacity-60">{date}</p>
  <p className="mx-auto mt-10 max-w-xl font-heading text-2xl italic opacity-75">“{quote}”</p>
  <div className="mx-auto mt-10 h-px w-24 bg-white/40"/>
  <p className="mt-4 text-xs tracking-[.3em] uppercase opacity-60">{signature}</p>
  {social?.username && <a href={`https://instagram.com/${social.username.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center px-4 py-2 text-xs tracking-[.15em] opacity-80 hover:opacity-100">{social.username}</a>}
</div></Section>; }
