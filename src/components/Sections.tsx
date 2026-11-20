import { CoinIcon, LogoMark, MethodIcon } from "./Brand";
import { FIATS, METHODS } from "@/lib/fiat";
import type { Faq } from "@/lib/faq";

export function SectionHead({ kicker, title, sub, center }: { kicker: string; title: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={"shead" + (center ? " center" : "")} data-reveal>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/** Branded payout card with 3D tilt + moving shine; crypto coins orbit it. */
export function CardMock() {
  return (
    <div className="card3d-stage" data-tilt>
      <div className="card3d-orbit" aria-hidden>
        {["BTC", "USDT", "ETH", "TON", "SOL", "LTC"].map((s, i) => (
          <span key={s} className="orb-coin" style={{ ["--i" as string]: i }}>
            <CoinIcon sym={s} size={38} />
          </span>
        ))}
      </div>
      <div className="card3d">
        <div className="card3d-shine" aria-hidden />
        <div className="card3d-top">
          <span className="card3d-brand"><LogoMark size={26} /><span>exol<b>swap</b></span></span>
          <span className="card3d-paid">+ 12,480.00 ₴</span>
        </div>
        <div className="card3d-chip" aria-hidden />
        <div className="card3d-num mono">4441 •••• •••• 2817</div>
        <div className="card3d-bottom">
          <span>
            <small>Card holder</small>
            OLENA KOVAL
          </span>
          <span className="card3d-mc" aria-hidden><i /><i /></span>
        </div>
      </div>
      <div className="card3d-toast" aria-hidden>
        <span className="ok-dot">✓</span>
        <span>
          <b>Payout sent</b>
          <small>290 USDT → card · 11 min</small>
        </span>
      </div>
    </div>
  );
}

export function Methods({ detailed }: { detailed?: boolean }) {
  return (
    <div className={"methods-grid" + (detailed ? " detailed" : "")}>
      {METHODS.map((m, i) => (
        <article key={m.id} className="mcard spot" data-reveal style={{ ["--d" as string]: `${i * 70}ms` }}>
          <div className="mcard-top">
            <span className="mcard-ic"><MethodIcon id={m.id} /></span>
            <span className="mcard-eta">{m.eta}</span>
          </div>
          <h3>{m.name}</h3>
          <p>{m.note}</p>
          <dl>
            <div><dt>Fee</dt><dd className="mono">{(m.fee * 100).toFixed(1)}%{m.fixedUsd ? ` + $${m.fixedUsd}` : ""}</dd></div>
            <div><dt>Limit</dt><dd className="mono">${m.minUsd.toLocaleString("en-US")} – ${m.maxUsd.toLocaleString("en-US")}</dd></div>
          </dl>
          {detailed && <div className="mcard-cur">{m.currencies.map((c) => <span key={c}>{c}</span>)}</div>}
        </article>
      ))}
    </div>
  );
}

export function FiatChips() {
  return (
    <div className="fiat-chips" aria-label="Payout currencies">
      {FIATS.map((f) => (
        <span key={f.code} className="fchip">
          <b>{f.sign}</b> {f.code}
        </span>
      ))}
    </div>
  );
}

const STEPS = [
  { t: "Pick a pair", d: "Coin, network and rate type — fixed for 30 minutes or floating with the market." },
  { t: "Tell us where to pay", d: "A wallet address, card, IBAN or Wise. You get an order number right away." },
  { t: "Send your deposit", d: "Transfer the coins to the address shown. We check the deposit as soon as you mark it sent." },
  { t: "Get paid", d: "Usually 2–15 minutes, up to 30 for card payouts." },
];

export function Steps() {
  return (
    <ol className="steps" data-reveal>
      <span className="steps-line" aria-hidden><i /></span>
      {STEPS.map((s, i) => (
        <li key={s.t} style={{ ["--d" as string]: `${200 + i * 220}ms` }}>
          <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} className="faq-item" data-reveal style={{ ["--d" as string]: `${i * 40}ms` }}>
          <summary>
            <span>{f.q}</span>
            <i aria-hidden />
          </summary>
          <div className="faq-a"><p>{f.a}</p></div>
        </details>
      ))}
    </div>
  );
}
