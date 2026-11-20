"use client";
import { useEffect, useState } from "react";
import { COINS } from "@/lib/coins";
import { FIATS } from "@/lib/fiat";
import { useAge, useRates } from "@/lib/useRates";

/** Cycles words in the hero headline with a vertical flip. */
export function Rotator({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="rotator" aria-live="off">
      <span className="rotator-sizer" aria-hidden>{words.reduce((a, b) => (b.length > a.length ? b : a))}</span>
      {words.map((w, k) => (
        <span key={w} className={"rotator-w grad" + (k === i ? " on" : k === (i - 1 + words.length) % words.length ? " out" : "")} aria-hidden={k !== i}>
          {w}
        </span>
      ))}
    </span>
  );
}

export function LiveBadge() {
  const r = useRates();
  const age = useAge(r.updated);
  return (
    <span className="badge">
      <span className={"pulse" + (r.live ? "" : " off")} aria-hidden />
      {r.live ? `Live rates · ${age < 60 ? age + "s" : Math.round(age / 60) + " min"} ago` : "Today's rates"}
      <span className="badge-sep" />
      {COINS.length} coins · {FIATS.length} currencies
    </span>
  );
}
