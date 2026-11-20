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
          <span className="card3d-paid">+ 12 480,00 ₴</span>
        </div>
        <div className="card3d-chip" aria-hidden />
        <div className="card3d-num mono">4441 •••• •••• 2817</div>
        <div className="card3d-bottom">
          <span>
            <small>Получатель</small>
            OLENA KOVAL
          </span>
          <span className="card3d-mc" aria-hidden><i /><i /></span>
        </div>
      </div>
      <div className="card3d-toast" aria-hidden>
        <span className="ok-dot">✓</span>
        <span>
          <b>Выплата отправлена</b>
          <small>290 USDT → карта · 11 мин</small>
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
            <div><dt>Комиссия</dt><dd className="mono">{(m.fee * 100).toFixed(1)}%{m.fixedUsd ? ` + $${m.fixedUsd}` : ""}</dd></div>
            <div><dt>Лимит</dt><dd className="mono">${m.minUsd.toLocaleString("ru-RU")} – ${m.maxUsd.toLocaleString("ru-RU")}</dd></div>
          </dl>
          {detailed && <div className="mcard-cur">{m.currencies.map((c) => <span key={c}>{c}</span>)}</div>}
        </article>
      ))}
    </div>
  );
}

export function FiatChips() {
  return (
    <div className="fiat-chips" aria-label="Валюты выплаты">
      {FIATS.map((f) => (
        <span key={f.code} className="fchip">
          <b>{f.sign}</b> {f.code}
        </span>
      ))}
    </div>
  );
}

const STEPS = [
  { t: "Выберите пару", d: "Монету, сеть и тип курса — фиксированный на 30 минут или плавающий по рынку." },
  { t: "Укажите, куда платить", d: "Адрес кошелька, карту, IBAN или Wise. Номер заявки появится сразу." },
  { t: "Отправьте депозит", d: "Переведите монеты на выданный адрес. Статус обновляется по каждому подтверждению." },
  { t: "Получите средства", d: "Обмен и выплата — автоматически. Обычно 2–15 минут, на карту — до 30." },
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
