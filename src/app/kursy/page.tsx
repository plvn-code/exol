import type { Metadata } from "next";
import { MarketTable } from "@/components/Market";

export const metadata: Metadata = {
  title: "Курсы криптовалют",
  description: "Живые курсы 30 криптовалют: цена, изменение за 24 часа, объём и график за 7 дней. Обмен в один клик.",
};

export default function RatesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">Курсы</span>
          <h1>Рынок <span className="grad">в реальном времени</span></h1>
          <p>Цены в долларах США, обновление каждые 30 секунд. Нажмите «Обменять» у любой монеты — она подставится в калькулятор.</p>
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
