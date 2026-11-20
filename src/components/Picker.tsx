"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COINS } from "@/lib/coins";
import { FIATS } from "@/lib/fiat";
import { usd } from "@/lib/format";
import { useRates } from "@/lib/useRates";
import { CoinIcon, FiatIcon } from "./Brand";

type Props = {
  kind: "coin" | "fiat";
  title: string;
  value: string;
  exclude?: string;
  onPick: (v: string) => void;
  onClose: () => void;
};

/** Searchable sheet for choosing a coin or a fiat currency. */
export default function Picker({ kind, title, value, exclude, onPick, onClose }: Props) {
  const r = useRates();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (kind === "fiat") {
      return FIATS.filter((f) => !s || f.code.toLowerCase().includes(s) || f.name.toLowerCase().includes(s)).map((f) => ({
        key: f.code, label: f.code, sub: f.name, right: (r.fx[f.code] ?? f.fx).toLocaleString("ru-RU", { maximumFractionDigits: 2 }) + " за $1", change: null as number | null,
      }));
    }
    return COINS.filter((c) => !s || c.sym.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)).map((c) => ({
      key: c.sym, label: c.sym, sub: c.name, right: usd(r.prices[c.sym] ?? c.price), change: r.change[c.sym] ?? c.change,
    }));
  }, [q, kind, r]);

  return createPortal(
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-head">
          <b>{title}</b>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <label className="sheet-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={kind === "coin" ? "Название или тикер" : "Валюта"} />
        </label>
        {kind === "coin" && !q && (
          <div className="sheet-pop">
            {COINS.filter((c) => c.popular).map((c) => (
              <button key={c.sym} className={"chip" + (c.sym === value ? " on" : "")} disabled={c.sym === exclude} onClick={() => onPick(c.sym)}>
                <CoinIcon sym={c.sym} size={20} /> {c.sym}
              </button>
            ))}
          </div>
        )}
        <ul className="sheet-list">
          {items.map((it) => (
            <li key={it.key}>
              <button className={it.key === value ? "on" : ""} disabled={it.key === exclude} onClick={() => onPick(it.key)}>
                {kind === "coin" ? <CoinIcon sym={it.key} size={36} /> : <FiatIcon code={it.key} size={36} />}
                <span className="sl-name">
                  <b>{it.label}</b>
                  <small>{it.sub}</small>
                </span>
                <span className="sl-right">
                  <span className="mono">{it.right}</span>
                  {it.change !== null && <small className={it.change >= 0 ? "up" : "down"}>{(it.change >= 0 ? "+" : "") + it.change.toFixed(2)}%</small>}
                </span>
              </button>
            </li>
          ))}
          {!items.length && <li className="sheet-empty">Ничего не найдено — напишите в поддержку, добавим монету.</li>}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
