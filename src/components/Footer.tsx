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
            <h2>Ready to swap?</h2>
            <p>30 coins, 9 fiat currencies, payouts to your card — no account, no passwords.</p>
          </div>
          <div className="ftr-cta-btns">
            <Link className="btn btn-primary" href="/#swap">Start a swap</Link>
            <Link className="btn btn-ghost" href="/fiat">Cash out to card</Link>
          </div>
        </div>
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Logo />
            <p>Instant crypto swaps and fiat payouts. Fixed or floating rates, 24/7 support.</p>
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
            <h3>Service</h3>
            <Link href="/#swap">Crypto swaps</Link>
            <Link href="/fiat">Cash out to card</Link>
            <Link href="/rates">Rates & pairs</Link>
            <Link href="/order">Track order</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div>
            <h3>Popular pairs</h3>
            <div className="ftr-pairs">
              {PAIRS.map(([a, b]) => (
                <SwapLink key={a + b} query={`from=${a}&to=${b}`}>{a} → {b}</SwapLink>
              ))}
            </div>
          </div>
          <div>
            <h3>Legal</h3>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/aml">AML / KYC Policy</Link>
            <Link href="/privacy">Privacy</Link>
            <h3 className="mt">24/7 support</h3>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">{SITE.telegramHandle}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
        <div className="ftr-bottom">
          <span>© {SITE.year} Exol Swap. All rights reserved.</span>
          <span className="dim">We never ask for CVV codes, passwords or seed phrases.</span>
        </div>
      </div>
      <div className="ftr-word" aria-hidden>EXOL SWAP</div>
    </footer>
  );
}
