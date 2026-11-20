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
  { t: "Без аккаунта", d: "Ни логина, ни пароля, ни почты. Номер заявки — всё, что нужно.", ic: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c1.5-3.5 4.5-5 8-5M16 16l5 5m0-5l-5 5", big: true },
  { t: "Фикс на 30 минут", d: "Закрепите курс и получите ровно ту сумму, что видели в калькуляторе.", ic: "M12 7v5l3 2M12 21a9 9 0 110-18 9 9 0 010 18z" },
  { t: "Гарантия возврата", d: "Если обмен не состоялся — монеты вернутся на ваш адрес.", ic: "M3 12a9 9 0 103-6.7L3 8M3 3v5h5" },
  { t: "Живые люди 24/7", d: "Поддержка в Telegram отвечает в среднем за 3 минуты — без ботов-автоответчиков.", ic: "M4 5h16v11H8l-4 4V5zM8 10h8M8 13h5" },
  { t: "Прозрачный AML", d: "Проверяем только рискованные транзакции и честно объясняем, почему.", ic: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4" },
  { t: "До $250 000 за раз", d: "Крупнее — через OTC-менеджера с персональным курсом.", ic: "M3 17l6-6 4 4 8-8M15 7h6v6", big: true },
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
              <span className="ln"><span>Обмен крипты</span></span>
              <span className="ln"><span>и вывод на</span></span>
              <span className="ln"><Rotator words={["карту", "IBAN", "Wise", "наличные", "USDT"]} /></span>
            </h1>
            <p className="hero-sub">
              Exol Swap меняет 30 монет между собой и выплачивает фиат на карту Visa / Mastercard в 9 валютах.
              Без регистрации, с фиксированным курсом на 30 минут.
            </p>
            <ul className="hero-trust">
              <li><b><CountUp to={2} />–15</b> минут на обмен</li>
              <li><b><CountUp to={0.5} decimals={1} suffix="%" /></b> спред плавающего курса</li>
              <li><b>24/7</b> поддержка в Telegram</li>
            </ul>
          </div>
          <div className="hero-widget">
            <Widget />
          </div>
        </div>
        <a href="#routes" className="scroll-cue" aria-label="Листать вниз"><span /></a>
      </section>

      <Ticker />

      <section className="sec" id="routes">
        <div className="wrap">
          <SectionHead kicker="Два маршрута" title={<>Одна форма —<br />и крипта, и деньги на карте</>} />
          <div className="routes">
            <article className="route spot" data-reveal>
              <div className="route-vis swapvis" aria-hidden>
                <span className="sv-a"><CoinIcon sym="BTC" size={64} /></span>
                <span className="sv-path"><i /><i /><i /></span>
                <span className="sv-b"><CoinIcon sym="ETH" size={64} /></span>
                <span className="sv-ring" />
              </div>
              <span className="route-tag">Крипто ⇄ Крипто</span>
              <h3>Меняйте монеты между сетями</h3>
              <p>BTC в USDT на TRON, ETH в SOL, XMR в LTC — 30 монет и 20+ сетей, включая Lightning, TON, Arbitrum и Base.</p>
              <SwapLink className="route-link" query="from=BTC&to=USDT&tab=crypto">
                Обменять BTC → USDT <span aria-hidden>→</span>
              </SwapLink>
            </article>
            <article className="route spot accent" data-reveal style={{ ["--d" as string]: "120ms" }}>
              <div className="route-vis cashvis" aria-hidden>
                <span className="cv-card"><i /></span>
                <span className="cv-drop d1"><CoinIcon sym="USDT" size={40} /></span>
                <span className="cv-drop d2"><CoinIcon sym="BTC" size={40} /></span>
                <span className="cv-drop d3"><CoinIcon sym="TON" size={40} /></span>
                <span className="cv-sum mono">+ 1 250 €</span>
              </div>
              <span className="route-tag">Крипто → Фиат</span>
              <h3>Выводите деньги на карту</h3>
              <p>Продайте USDT или BTC и получите евро, гривны, тенге или доллары на карту, IBAN, Wise — или наличными в офисе.</p>
              <SwapLink className="route-link" query="from=USDT&cur=EUR&method=card">
                Вывести USDT на карту <span aria-hidden>→</span>
              </SwapLink>
            </article>
          </div>
        </div>
      </section>

      <section className="sec fiat-sec">
        <div className="wrap fiat-in">
          <div className="fiat-copy">
            <SectionHead
              kicker="Вывод в фиат"
              title={<>Крипта → <span className="grad">деньги на карте</span> за 30 минут</>}
              sub="Четыре способа выплаты, девять валют. Комиссия и итоговая сумма — в калькуляторе до создания заявки, без сюрпризов на выходе."
            />
            <div data-reveal><FiatChips /></div>
            <div className="fiat-cta" data-reveal>
              <Link href="/fiat" className="btn btn-primary">Подробнее о выводе</Link>
              <SwapLink className="btn btn-ghost" query="from=USDT&cur=UAH&method=card">Рассчитать выплату</SwapLink>
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
          <SectionHead kicker="Как это работает" title="Четыре шага, ноль регистраций" center />
          <Steps />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-row">
            <SectionHead kicker="Курсы" title="Рынок прямо сейчас" sub="Цены обновляются каждые 30 секунд. Нажмите «Обменять» — монета подставится в калькулятор." />
            <Link href="/kursy" className="btn btn-ghost" data-reveal>Все 30 монет →</Link>
          </div>
          <div data-reveal><MarketTable limit={8} /></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead kicker="Почему Exol Swap" title={<>Сделано для тех, кто<br />ценит время и приватность</>} />
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
            <SectionHead kicker="FAQ" title="Частые вопросы" sub="Не нашли ответ? Поддержка в Telegram работает круглосуточно." />
            <Link href="/faq" className="btn btn-ghost" data-reveal>Все вопросы →</Link>
          </div>
          <FaqList items={FAQ.filter((_, i) => [0, 1, 5, 6, 9].includes(i))} />
        </div>
      </section>
    </>
  );
}
