"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll reveals ([data-reveal] → data-in), pointer spotlight on .spot cards, 3D tilt on [data-tilt]. */
export default function Effects() {
  const path = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    scan();
    // Client components (order view, widget stages) can mount reveal targets later.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [path]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const spot = t?.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const tilt = t?.closest<HTMLElement>("[data-tilt]");
      if (tilt && e.pointerType === "mouse") {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(x * 18).toFixed(2)}deg`);
        tilt.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
      }
    };
    const onLeave = (e: PointerEvent) => {
      const tilt = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-tilt]");
      if (tilt && !tilt.contains(e.relatedTarget as Node)) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return null;
}
