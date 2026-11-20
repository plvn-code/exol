import type { Metadata } from "next";
import { CardMock, FaqList, FiatChips, Methods, SectionHead } from "@/components/Sections";
import Widget from "@/components/Widget";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Вывод криптовалюты на карту",
  description: "Продайте USDT, BTC, ETH и ещё 27 монет с выплатой на карту Visa/Mastercard, IBAN/SEPA, Wise/Revolut или наличными. 9 валют, выплата от 5 минут.",
};

export default function FiatPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">Крипто → Фиат</span>
          <h1>
            Выводите крипту <span className="grad">на карту</span>, счёт или наличными
          </h1>
          <p>Продайте любую из 30 монет и получите USD, EUR, UAH, KZT, PLN, GBP, TRY, GEL или AED. Сумма к получению известна заранее — до того, как вы отправите депозит.</p>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 64 }}>
        <div className="wrap split">
          <div>
            <div data-reveal><CardMock /></div>
            <div className="facts">
              <div className="fact" data-reveal><b>5–30 мин</b><span>выплата на карту после подтверждения депозита</span></div>
              <div className="fact" data-reveal style={{ ["--d" as string]: "80ms" }}><b>от 0,8%</b><span>комиссия — итог виден в калькуляторе</span></div>
              <div className="fact" data-reveal style={{ ["--d" as string]: "160ms" }}><b>$500 000</b><span>максимальная выплата наличными</span></div>
            </div>
            <div style={{ marginTop: 40 }} data-reveal>
              <span className="lbl" style={{ marginTop: 0, marginBottom: 12 }}>Валюты выплаты</span>
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
          <SectionHead kicker="Способы выплаты" title="Выберите, куда получить деньги" sub="Комиссии и лимиты указаны за одну заявку. При фиксированном курсе добавляется 0,5% за гарантию суммы." />
          <Methods detailed />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead kicker="Сравнение" title="Какой способ выбрать" />
          <div className="table-wrap cmp" data-reveal>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Карта</th>
                  <th>IBAN / SEPA</th>
                  <th>Wise · Revolut</th>
                  <th>Наличные</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Подходит для</td><td>Сумм до $10 000</td><td>Крупных переводов в EU</td><td>Быстрых переводов в EUR/GBP</td><td>От $1 000, лично</td></tr>
                <tr><td>Скорость</td><td>5–30 минут</td><td>до 1 рабочего дня</td><td>15–60 минут</td><td>в день обращения</td></tr>
                <tr><td>Что указать</td><td>Номер карты и имя</td><td>IBAN и получателя</td><td>E-mail или @тег</td><td>Город и Telegram</td></tr>
                <tr><td>Верификация</td><td>Свыше $10 000/сутки</td><td>Свыше $15 000</td><td>Свыше $10 000/сутки</td><td>Паспорт при встрече</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap faq-wrap">
          <SectionHead kicker="FAQ" title="Вопросы о выводе" />
          <FaqList items={FAQ.filter((f) => f.group === "Вывод в фиат")} />
        </div>
      </section>
    </>
  );
}
