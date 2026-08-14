"use client";
import { motion } from "framer-motion";
import Background from "../ui/Background";
import { useWedding } from "../WeddingContext";

export default function CoverBlock({ background, eyebrow, groom, bride, date, description, button, logo, guest, animation }: any) {
  const { opened, openInvitation } = useWedding();
  return <motion.section className="fixed inset-0 z-[80] flex min-h-screen items-center justify-center overflow-hidden px-6 text-center" animate={opened ? { opacity: 0, scale: 1.04, pointerEvents: "none" } : { opacity: 1, scale: 1, pointerEvents: "auto" }} transition={{ duration: .9, ease: "easeInOut" }} aria-hidden={opened}>
    <Background background={background} />
    <div className="relative z-10 max-w-3xl">
      {logo?.src && <motion.img initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }} src={logo.src} alt={logo.alt || "Logo"} className="mx-auto mb-8 h-28 w-auto object-contain drop-shadow-2xl" />}
      <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: animation?.duration ?? 1 }} className="text-xs tracking-[.35em] uppercase opacity-80">{eyebrow}</motion.p>
      <motion.h1 initial={{ opacity: 0, filter: "blur(16px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ delay: .5, duration: 1.2 }} className="font-heading mt-7 text-6xl leading-[.85] md:text-9xl">{groom}<span className="mx-3 text-3xl md:text-5xl opacity-60">&</span>{bride}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .85 }} className="mt-8 tracking-[.2em] text-sm">{date}</motion.p>
      {description && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mx-auto mt-5 max-w-md text-sm opacity-70">{description}</motion.p>}
      
      {guest?.name && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }} className="mx-auto mt-8 w-full max-w-xs rounded-2xl border border-white/20 bg-black/20 p-5 backdrop-blur-md">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-2">{guest.label ?? "Kepada Yth."}</p>
          <p className="font-heading text-3xl">{guest.name}</p>
        </motion.div>
      )}

      <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} onClick={openInvitation} className="glass mt-10 rounded-full px-7 py-4 text-xs tracking-[.2em] transition hover:bg-white/20">{button?.text ?? "OPEN INVITATION"}</motion.button>
    </div>
  </motion.section>;
}
