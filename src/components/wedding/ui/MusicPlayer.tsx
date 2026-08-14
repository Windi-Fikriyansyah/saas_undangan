"use client";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ source, autoplay = false, loop = true, volume = .35 }: { source?: string; autoplay?: boolean; loop?: boolean; volume?: number }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { if (!audio.current) return; audio.current.volume = volume; if (!autoplay) return; audio.current.play().then(() => setPlaying(true)).catch(() => {}); }, [autoplay, volume]);
  const toggle = async () => { if (!audio.current) return; if (audio.current.paused) { try { await audio.current.play(); setPlaying(true); } catch {} } else { audio.current.pause(); setPlaying(false); } };
  if (!source) return null;
  return <><audio ref={audio} src={source} loop={loop} preload="metadata" onEnded={() => setPlaying(false)} /><button aria-label={playing ? "Pause music" : "Play music"} className="glass fixed right-5 bottom-5 z-50 grid h-12 w-12 place-items-center rounded-full" onClick={toggle}>{playing ? <Volume2 size={19} /> : <VolumeX size={19} />}</button></>;
}
