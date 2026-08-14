"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Maximize2 } from "lucide-react";
import { useState } from "react";

const defaultItems = ["home","couple","event","gallery","rsvp","gift","souvenir"];

export default function Navigation({ labels = {} }: { labels?: Record<string,string> }) {
  const [open, setOpen] = useState(false);
  const defaults: Record<string,string> = { home: "Home", couple: "Bride & Groom", event: "Wedding Event", gallery: "Gallery", rsvp: "RSVP", gift: "Gift", souvenir: "Souvenir Card" };
  const items = defaultItems.map((id) => ({ id, label: labels[id] ?? defaults[id] }));
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  const fullscreen = async () => { if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.(); else await document.exitFullscreen?.(); };
  return <><button aria-label="Open menu" className="glass fixed right-5 bottom-[5.25rem] z-50 grid h-12 w-12 place-items-center rounded-full" onClick={() => setOpen(true)}><Menu size={19} /></button><button aria-label="Fullscreen" className="glass fixed right-5 bottom-[8.5rem] z-50 grid h-12 w-12 place-items-center rounded-full" onClick={fullscreen}><Maximize2 size={18} /></button><AnimatePresence>{open && <motion.div className="fixed inset-0 z-[90] bg-black/45 p-5 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="glass relative ml-auto h-full w-full max-w-2xl rounded-[36px] p-8 md:p-12" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}><button className="absolute right-6 top-6 rounded-full bg-white/10 px-6 py-3 text-sm" onClick={() => setOpen(false)}><X size={18} /></button><div className="mt-20 flex flex-col gap-5 md:gap-7">{items.map((item, i) => <motion.button key={item.id} className="text-left font-heading text-4xl md:text-6xl hover:translate-x-2 transition-transform" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }} onClick={() => go(item.id)}>{item.label}</motion.button>)}</div></motion.div></motion.div>}</AnimatePresence></>;
}
