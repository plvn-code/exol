"use client";
import { useEffect, useRef, useState } from "react";

/** Tweens between numeric values so quotes "roll" when the amount or rate changes. */
export function Num({ value, format, ms = 450 }: { value: number; format: (n: number) => string; ms?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const cur = useRef(value);
  useEffect(() => {
    from.current = cur.current;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, Math.max(0, (t - start) / ms));
      const e = 1 - Math.pow(1 - k, 3);
      cur.current = from.current + (value - from.current) * e;
      setShown(cur.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return <>{format(shown)}</>;
}

/** Counts up once when scrolled into view. */
export function CountUp({ to, suffix = "", prefix = "", decimals = 0 }: { to: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Start at the real value so crawlers, no-JS and background tabs never show 0; the count-up replays on view.
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let done: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, Math.max(0, (t - start) / 1400));
        setN(to * (1 - Math.pow(1 - k, 4)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // rAF pauses in background tabs — make sure the final number still lands.
      done = setTimeout(() => setN(to), 1600);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [to]);
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
