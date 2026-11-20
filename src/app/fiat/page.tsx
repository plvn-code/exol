import type { Metadata } from "next";
import { CardMock, FaqList, FiatChips, Methods, SectionHead } from "@/components/Sections";
import Widget from "@/components/Widget";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Cash out crypto to a card",
  description: "Sell USDT, BTC, ETH and 27 more coins with payouts to Visa/Mastercard, IBAN/SEPA, Wise/Revolut or cash. 9 currencies, payouts from 5 minutes.",
};

export default function FiatPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">Crypto → Fiat</span>
          <h1>
            Cash out crypto <span className="grad">to your card</span>, bank account or cash
          </h1>
          <p>Sell any of 30 coins and receive USD, EUR, UAH, KZT, PLN, GBP, TRY, GEL or AED. You know the exact payout before you send your deposit.</p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 64 }}>
        <div className="wrap split">
          <div>
            <div data-reveal><CardMock /></div>
            <div className="facts">
              <div className="fact" data-reveal><b>5–30 min</b><span>card payout after your deposit is confirmed</span></div>
              <div className="fact" data-reveal style={{ ["--d" as string]: "80ms" }}><b>from 0.8%</b><span>fee — the total is shown in the calculator</span></div>
              <div className="fact" data-reveal style={{ ["--d" as string]: "160ms" }}><b>$500,000</b><span>maximum cash payout</span></div>
            </div>
            <div style={{ marginTop: 40 }} data-reveal>
              <span className="lbl" style={{ marginTop: 0, marginBottom: 12 }}>Payout currencies</span>
              <FiatChips />
            </div>
          </div>
          <div className="split-sticky">
            <Widget initialTab="fiat" />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead kicker="Payout methods" title="Choose where to get your money" sub="Fees and limits are per order. A fixed rate adds 0.5% for the guaranteed amount." />
          <Methods detailed />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead kicker="Comparison" title="Which method to choose" />
          <div className="table-wrap cmp" data-reveal>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Card</th>
                  <th>IBAN / SEPA</th>
                  <th>Wise · Revolut</th>
                  <th>Cash</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Best for</td><td>Up to $10,000</td><td>Large transfers in the EU</td><td>Fast EUR/GBP transfers</td><td>From $1,000, in person</td></tr>
                <tr><td>Speed</td><td>5–30 minutes</td><td>within 1 business day</td><td>15–60 minutes</td><td>same day</td></tr>
                <tr><td>What you enter</td><td>Card number and name</td><td>IBAN and recipient</td><td>E-mail or @tag</td><td>City and Telegram</td></tr>
                <tr><td>Verification</td><td>Over $10,000/day</td><td>Over $15,000</td><td>Over $10,000/day</td><td>ID at the meeting</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap faq-wrap">
          <SectionHead kicker="FAQ" title="Payout questions" />
          <FaqList items={FAQ.filter((f) => f.group === "Cashing out")} />
        </div>
      </section>
    </>
  );
}
