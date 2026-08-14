"use client";
import { useEffect, useMemo, useState } from "react";

function remaining(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  return { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}

export default function Countdown({ target }: { target: string }) {
  const [value, setValue] = useState(() => remaining(target));
  useEffect(() => { const id = window.setInterval(() => setValue(remaining(target)), 1000); return () => clearInterval(id); }, [target]);
  const items = useMemo(() => Object.entries(value), [value]);
  return <div className="grid grid-cols-4 gap-2 md:gap-4">{items.map(([label, number]) => <div key={label} className="glass rounded-2xl p-3 text-center"><div className="font-heading text-3xl md:text-5xl" suppressHydrationWarning>{String(number).padStart(2, "0")}</div><div className="mt-1 text-[9px] tracking-[.2em] uppercase opacity-60">{label}</div></div>)}</div>;
}
