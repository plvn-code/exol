import Link from "next/link";
import { Logo } from "./Brand";
import SwapLink from "./SwapLink";
import { SITE } from "@/lib/site";

const PAIRS = [
  ["BTC", "USDT"], ["ETH", "USDT"], ["USDT", "BTC"], ["XMR", "BTC"], ["SOL", "USDC"], ["TON", "USDT"],
  ["LTC", "XMR"], ["BTC", "ETH"], ["XRP", "USDT"], ["DOGE", "BTC"],
];

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-cta" data-reveal>
          <div>
            <h2>Готовы обменять?</h2>
            <p>30 монет, 9 фиатных валют, выплата на карту — без аккаунта и паролей.</p>
          </div>
          <div className="ftr-cta-btns">
            <Link className="btn btn-primary" href="/#swap">Начать обмен</Link>
            <Link className="btn btn-ghost" href="/fiat">Вывести на карту</Link>
          </div>
        </div>
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Logo />
            <p>Мгновенный обмен криптовалют и вывод в фиат. Фиксированный или плавающий курс, поддержка 24/7.</p>
            <div className="socials">
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.2L2.9 11.4c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5zM8.4 14.1l9.4-5.9c.4-.3.9-.1.5.2l-7.9 7.2-.3 3.4-1.7-4.9z" /></svg>
              </a>
              <a href={SITE.x} target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" /></svg>
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="E-mail">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h3>Сервис</h3>
            <Link href="/#swap">Обмен криптовалют</Link>
            <Link href="/fiat">Вывод на карту</Link>
            <Link href="/kursy">Курсы и пары</Link>
            <Link href="/order">Статус заявки</Link>
            <Link href="/faq">Вопросы и ответы</Link>
          </div>
          <div>
            <h3>Популярные пары</h3>
            <div className="ftr-pairs">
              {PAIRS.map(([a, b]) => (
                <SwapLink key={a + b} query={`from=${a}&to=${b}`}>{a} → {b}</SwapLink>
              ))}
            </div>
          </div>
          <div>
            <h3>Документы</h3>
            <Link href="/terms">Условия использования</Link>
            <Link href="/aml">AML / KYC политика</Link>
            <Link href="/privacy">Конфиденциальность</Link>
            <h3 className="mt">Поддержка 24/7</h3>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">{SITE.telegramHandle}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
        <div className="ftr-bottom">
          <span>© {SITE.year} Exol Swap. Все права защищены.</span>
          <span className="dim">Мы никогда не просим CVV, пароли и seed-фразы.</span>
        </div>
      </div>
      <div className="ftr-word" aria-hidden>EXOL SWAP</div>
    </footer>
  );
}
