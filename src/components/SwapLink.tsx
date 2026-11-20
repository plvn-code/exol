"use client";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Link that prefills the exchange widget. If a widget is already on the page it updates it in place
 * and scrolls to it; otherwise it navigates to `base` with the query.
 */
export default function SwapLink({ query, base = "/", className, children }: { query: string; base?: string; className?: string; children: ReactNode }) {
  const href = `${base}?${query}#swap`;
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        const w = document.getElementById("swap");
        if (!w) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("exol:prefill", { detail: query }));
        w.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
    >
      {children}
    </Link>
  );
}
