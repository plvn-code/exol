import type { Metadata } from "next";
import { FaqList } from "@/components/Sections";
import { FAQ } from "@/lib/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ", description: "How Exol Swap works: rates, timing, limits, card payouts, AML and refunds." };

const GROUPS = ["Swapping", "Cashing out", "Security"] as const;

export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">FAQ</span>
          <h1>Questions & <span className="grad">answers</span></h1>
          <p>
            Didn’t find what you need? Message us on Telegram at <a className="grad" href={SITE.telegram} target="_blank" rel="noopener noreferrer">{SITE.telegramHandle}</a> — we reply around the clock.
          </p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 56 }}>
        <div className="wrap faq-groups">
          {GROUPS.map((g) => (
            <div key={g} className="faq-wrap">
              <h2 data-reveal>{g}</h2>
              <FaqList items={FAQ.filter((f) => f.group === g)} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
