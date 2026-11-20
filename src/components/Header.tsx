"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Brand";

const NAV = [
  { href: "/#swap", label: "Обмен" },
  { href: "/fiat", label: "Вывод на карту" },
  { href: "/kursy", label: "Курсы" },
  { href: "/#how", label: "Как это работает" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [track, setTrack] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    setOpen(false);
    setTrack(false);
  }, [path]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const v = id.trim().toUpperCase();
    if (v) router.push(`/order?id=${encodeURIComponent(v.startsWith("EX-") ? v : "EX-" + v)}`);
  };

  return (
    <header className={"hdr" + (scrolled ? " scrolled" : "") + (open ? " open" : "")}>
      <div className="hdr-in wrap">
        <Link href="/" aria-label="Exol Swap — на главную" className="hdr-logo">
          <Logo />
        </Link>
        <nav className="hdr-nav" aria-label="Основное меню">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={path === n.href ? "on" : ""}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-actions">
          <div className={"track" + (track ? " open" : "")}>
            <button className="btn btn-ghost sm" onClick={() => setTrack(!track)} aria-expanded={track}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <span>Статус заявки</span>
            </button>
            <form className="track-pop" onSubmit={go}>
              <label htmlFor="track-id">Номер заявки</label>
              <div className="track-row">
                <input id="track-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="EX-XXXXXX" autoComplete="off" />
                <button className="btn btn-primary sm">Найти</button>
              </div>
            </form>
          </div>
          <Link href="/#swap" className="btn btn-primary sm hide-s">Обменять</Link>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open}>
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className="mnav" aria-hidden={!open}>
        {NAV.map((n, i) => (
          <Link key={n.href} href={n.href} style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            {n.label}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-5-5l5 5-5 5" /></svg>
          </Link>
        ))}
        <Link href="/order" className="btn btn-primary" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>Мои заявки</Link>
      </div>
    </header>
  );
}
