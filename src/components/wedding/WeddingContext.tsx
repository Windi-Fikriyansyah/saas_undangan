"use client";
import { createContext, useContext, useState } from "react";

type WeddingContextValue = { opened: boolean; openInvitation: () => void };
const WeddingContext = createContext<WeddingContextValue | null>(null);
export function WeddingProvider({ children }: { children: React.ReactNode }) { const [opened, setOpened] = useState(false); return <WeddingContext.Provider value={{ opened, openInvitation: () => setOpened(true) }}>{children}</WeddingContext.Provider>; }
export function useWedding() { const value = useContext(WeddingContext); if (!value) throw new Error("useWedding must be used inside WeddingProvider"); return value; }
