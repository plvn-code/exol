import type { Metadata } from "next";
import { MarketTable } from "@/components/Market";

export const metadata: Metadata = {
  title: "Crypto rates",
  description: "Live rates for 30 cryptocurrencies: price, 24-hour change, volume and a 7-day chart. Swap in one click.",
};

export default function RatesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">Rates</span>
          <h1>The market <span className="grad">in real time</span></h1>
          <p>Prices in US dollars, refreshed every 30 seconds. Hit “Swap” next to any coin and it drops straight into the calculator.</p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 56 }}>
        <div className="wrap" data-reveal>
          <MarketTable search />
        </div>
      </section>
    </>
  );
}
