import { coin } from "@/lib/coins";
import type { MethodId } from "@/lib/fiat";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg className="logomark" width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b7bff" />
          <stop offset="1" stopColor="#22d3ff" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0b1330" stroke="url(#lm-g)" strokeWidth="1.5" />
      <path className="lm-a" d="M11 14.5c3.2-4.6 10.6-6 15.6-1.6l2.2 2" fill="none" stroke="url(#lm-g)" strokeWidth="2.6" strokeLinecap="round" />
      <path className="lm-a" d="M29 11.5v4.2h-4.2" fill="none" stroke="url(#lm-g)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path className="lm-b" d="M29 25.5c-3.2 4.6-10.6 6-15.6 1.6l-2.2-2" fill="none" stroke="#e8eeff" strokeWidth="2.6" strokeLinecap="round" />
      <path className="lm-b" d="M11 28.5v-4.2h4.2" fill="none" stroke="#e8eeff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.2" fill="#22d3ff" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">
        exol<b>swap</b>
      </span>
    </span>
  );
}

export function CoinIcon({ sym, size = 32 }: { sym: string; size?: number }) {
  const c = coin(sym);
  return (
    <span
      className="coin-ic"
      style={{ width: size, height: size, fontSize: size * 0.48, ["--c" as string]: c.color }}
      aria-hidden
    >
      {c.glyph}
    </span>
  );
}

export function FiatIcon({ code, size = 32 }: { code: string; size?: number }) {
  return (
    <span className="fiat-ic" style={{ width: size, height: size, fontSize: size * 0.3 }} aria-hidden>
      {code}
    </span>
  );
}

export function MethodIcon({ id }: { id: MethodId }) {
  const p = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "card") return <svg {...p}><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 9.5h19M6 15h4" /></svg>;
  if (id === "iban") return <svg {...p}><path d="M3 10l9-6 9 6M5 10v8m4.5-8v8m5-8v8M19 10v8M3 20h18" /></svg>;
  if (id === "wise") return <svg {...p}><path d="M4 7l4 10 4-7 4 7 4-10" /></svg>;
  return <svg {...p}><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9v.01M18 15v.01" /></svg>;
}
