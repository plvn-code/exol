"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Rates } from "./types";

const Ctx = createContext<Rates | null>(null);

/** Holds the latest rates; seeded from the server render and refreshed from /api/rates every 30 s. */
export function RatesProvider({ initial, children }: { initial: Rates; children: ReactNode }) {
  const [rates, setRates] = useState(initial);
  useEffect(() => {
    let alive = true;
    const pull = async () => {
      try {
        const res = await fetch("/api/rates", { cache: "no-store" });
        if (res.ok && alive) setRates((await res.json()) as Rates);
      } catch {
        /* keep the previous rates */
      }
    };
    const t = setInterval(() => {
      if (document.visibilityState === "visible") pull();
    }, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return <Ctx.Provider value={rates}>{children}</Ctx.Provider>;
}

export function useRates(): Rates {
  const r = useContext(Ctx);
  if (!r) throw new Error("useRates outside RatesProvider");
  return r;
}

/** Seconds since the rates were refreshed, ticking every second. */
export function useAge(updated: number): number {
  const [now, setNow] = useState(updated);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [updated]);
  return Math.max(0, Math.round((now - updated) / 1000));
}
