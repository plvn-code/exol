import Link from "next/link";
import { LiveBadge, Rotator } from "@/components/Bits";
import { CoinIcon } from "@/components/Brand";
import HeroCanvas from "@/components/HeroCanvas";
import { MarketTable, Ticker } from "@/components/Market";
import { CountUp } from "@/components/Num";
import { CardMock, FaqList, FiatChips, Methods, SectionHead, Steps } from "@/components/Sections";
import SwapLink from "@/components/SwapLink";
import Widget from "@/components/Widget";
import { FAQ } from "@/lib/faq";

const WHY = [
  { t: "No account", d: "No login, no password, no e-mail. Your order number is all you need.", ic: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c1.5-3.5 4.5-5 8-5M16 16l5 5m0-5l-5 5", big: true },
  { t: "Locked for 30 minutes", d: "Fix the rate and get exactly the amount you saw in the calculator.", ic: "M12 7v5l3 2M12 21a9 9 0 110-18 9 9 0 010 18z" },
  { t: "Refund guarantee", d: "If a swap can’t go through, your coins go back to your address.", ic: "M3 12a9 9 0 103-6.7L3 8M3 3v5h5" },
  { t: "Real people, 24/7", d: "Telegram support replies in about 3 minutes on average — no auto-reply bots.", ic: "M4 5h16v11H8l-4 4V5zM8 10h8M8 13h5" },
  { t: "Transparent AML", d: "We only review high-risk transactions and tell you honestly why.", ic: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4" },
  { t: "Up to $250,000 per swap", d: "Larger amounts go through an OTC manager with a personal rate.", ic: "M3 17l6-6 4 4 8-8M15 7h6v6", big: true },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <HeroCanvas />
        <div className="hero-grid" aria-hidden />
        <div className="wrap hero-in">
          <div className="hero-copy">
            <LiveBadge />
            <h1 className="hero-title">
              <span className="ln"><span>Swap crypto.</span></span>
              <span className="ln"><span>Cash out to</span></span>
              <span className="ln"><Rotator words={["your card", "IBAN", "Wise", "cash", "USDT"]} /></span>
            </h1>
            <p className="hero-sub">
              Exol Swap exchanges 30 coins and pays out fiat to Visa / Mastercard cards in 9 currencies.
              No sign-up, with a rate you can lock for 30 minutes.
            </p>
            <ul className="hero-trust">
              <li><b><CountUp to={2} />–15</b> minutes per swap</li>
              <li><b><CountUp to={0.5} decimals={1} suffix="%" /></b> floating-rate spread</li>
              <li><b>24/7</b> Telegram support</li>
            </ul>
          </div>
          <div className="hero-widget">
            <Widget />
          </div>
        </div>
        <a href="#routes" className="scroll-cue" aria-label="Scroll down"><span /></a>
      </section>

      <Ticker />

      <section className="sec" id="routes">
        <div className="wrap">
          <SectionHead kicker="Two routes" title={<>One form —<br />for crypto and for cash on your card</>} />
          <div className="routes">
            <article className="route spot" data-reveal>
              <div className="route-vis swapvis" aria-hidden>
                <span className="sv-a"><CoinIcon sym="BTC" size={64} /></span>
                <span className="sv-path"><i /><i /><i /></span>
                <span className="sv-b"><CoinIcon sym="ETH" size={64} /></span>
                <span className="sv-ring" />
              </div>
              <span className="route-tag">Crypto ⇄ Crypto</span>
              <h3>Swap coins across networks</h3>
              <p>BTC to USDT on TRON, ETH to SOL, XMR to LTC — 30 coins and 20+ networks, including Lightning, TON, Arbitrum and Base.</p>
              <SwapLink className="route-link" query="from=BTC&to=USDT&tab=crypto">
                Swap BTC → USDT <span aria-hidden>→</span>
              </SwapLink>
            </article>
            <article className="route spot accent" data-reveal style={{ ["--d" as string]: "120ms" }}>
              <div className="route-vis cashvis" aria-hidden>
                <span className="cv-card"><i /></span>
                <span className="cv-drop d1"><CoinIcon sym="USDT" size={40} /></span>
                <span className="cv-drop d2"><CoinIcon sym="BTC" size={40} /></span>
                <span className="cv-drop d3"><CoinIcon sym="TON" size={40} /></span>
                <span className="cv-sum mono">+ 1,250 €</span>
              </div>
              <span className="route-tag">Crypto → Fiat</span>
              <h3>Cash out to your card</h3>
              <p>Sell USDT or BTC and receive euros, hryvnias, tenge or dollars on your card, IBAN or Wise — or pick up cash at an office.</p>
              <SwapLink className="route-link" query="from=USDT&cur=UAH&method=card">
                Cash out USDT to a card <span aria-hidden>→</span>
              </SwapLink>
            </article>
          </div>
        </div>
      </section>

      <section className="sec fiat-sec">
        <div className="wrap fiat-in">
          <div className="fiat-copy">
            <SectionHead
              kicker="Crypto → Fiat"
              title={<>Crypto → <span className="grad">money on your card</span> in 30 minutes</>}
              sub="Four payout methods, nine currencies. The fee and the final amount are shown in the calculator before you create an order — no surprises at the end."
            />
            <div data-reveal><FiatChips /></div>
            <div className="fiat-cta" data-reveal>
              <Link href="/fiat" className="btn btn-primary">More about payouts</Link>
              <SwapLink className="btn btn-ghost" query="from=USDT&cur=UAH&method=card">Calculate a payout</SwapLink>
            </div>
          </div>
          <div className="fiat-vis" data-reveal>
            <CardMock />
          </div>
        </div>
        <div className="wrap">
          <Methods />
        </div>
      </section>

      <section className="sec" id="how">
        <div className="wrap">
          <SectionHead kicker="How it works" title="Four steps, zero sign-ups" center />
          <Steps />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-row">
            <SectionHead kicker="Rates" title="The market right now" sub="Prices refresh every 30 seconds. Hit “Swap” and the coin drops straight into the calculator." />
            <Link href="/rates" className="btn btn-ghost" data-reveal>All 30 coins →</Link>
          </div>
          <div data-reveal><MarketTable limit={8} /></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead kicker="Why Exol Swap" title={<>Built for people who<br />value time and privacy</>} />
          <div className="bento">
            {WHY.map((w, i) => (
              <article key={w.t} className={"bcard spot" + (w.big ? " big" : "")} data-reveal style={{ ["--d" as string]: `${i * 60}ms` }}>
                <span className="bcard-ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={w.ic} /></svg>
                </span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap faq-wrap">
          <div>
            <SectionHead kicker="FAQ" title="Common questions" sub="Can’t find an answer? Our Telegram support is open around the clock." />
            <Link href="/faq" className="btn btn-ghost" data-reveal>All questions →</Link>
          </div>
          <FaqList items={FAQ.filter((_, i) => [0, 1, 5, 6, 10].includes(i))} />
        </div>
      </section>
    </>
  );
}
