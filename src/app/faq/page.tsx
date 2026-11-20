import type { Metadata } from "next";
import { FaqList } from "@/components/Sections";
import { FAQ } from "@/lib/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Вопросы и ответы", description: "Как работает обмен на Exol Swap: курсы, сроки, лимиты, вывод на карту, AML и возвраты." };

const GROUPS = ["Обмен", "Вывод в фиат", "Безопасность"] as const;

export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">FAQ</span>
          <h1>Вопросы и <span className="grad">ответы</span></h1>
          <p>
            Не нашли нужное — напишите в Telegram <a className="grad" href={SITE.telegram} target="_blank" rel="noopener noreferrer">{SITE.telegramHandle}</a>, отвечаем круглосуточно.
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
