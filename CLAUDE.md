# EXOL SWAP — крипто-обменник + вывод в фиат

Own/agency demo: crypto exchanger «Exol Swap» (brief 2026-11-20: «похожий на swapuz.com, чёрный + синий, анимированный, вывод денег в фиат на карту и т.д., но не идентичный»). **Talk to the user in Russian; site copy is ENGLISH only** (switched 2026-11-20 at the user's request — no RU version, no language switch). Operator Telegram messages in `api/order` stay Russian. Read `docs/STATUS.md` first.

## Commands
```bash
npm run build && npm start               # production on :3027
kill $(lsof -ti tcp:3027 -sTCP:LISTEN)   # restart only our port
npm run lint && npx tsc --noEmit         # must stay clean
open -a "Google Chrome" http://localhost:3027
```
`node_modules` → symlink to `~/Desktop/nudes/node_modules` (same Next 15.5 / React 19 set).

## Stack
Next.js 15 App Router · React 19 · TS strict · plain CSS (`src/app/globals.css`, tokens in `:root`, black #05070d + blue #3b7bff→cyan #22d3ff) · fonts Unbounded (display) + Manrope (body) + JetBrains Mono (numbers) via next/font, latin subset · numbers formatted en-US · no UI/animation libs.

## Layout
```
src/app/            / · /fiat · /rates (old /kursy → 308) · /faq · /order (status, client-only) · /aml /terms /privacy · api/rates · api/order (→ operator Telegram) · 404 · sitemap · robots
src/components/     Widget (the exchange form: tabs Крипто⇄Крипто / Вывод в фиат, float/fixed, coin+network, payout method, details stage → creates order)
                    Picker (coin/fiat sheet) · HeroCanvas (rotating dot globe + orbit packets) · Market (Ticker, MarketTable, Spark)
                    Sections (CardMock 3D card, Methods, Steps, FaqList) · SwapLink (prefills widget in place via `exol:prefill` event) · Effects (reveal/spotlight/tilt) · Header · Footer · Brand (logo, coin/fiat/method icons)
src/lib/            coins.ts (30 coins, networks, fallback prices) · fiat.ts (9 currencies, 4 payout methods: card/iban/wise/cash, fees+limits) · quote.ts (pricing math, spreads)
                    rates.ts (server: CoinGecko markets + exchange_rates, revalidate 60 s, fallback snapshot) · useRates (client context, polls /api/rates 30 s)
                    deposit.ts (REAL exchange wallets per coin:network — now only USDT:trc20) · orders.ts (client copy of orders in localStorage) · validate.ts (address regex per network, Luhn, IBAN mod-97) · faq.ts · site.ts (placeholder contacts)
```
Rules: real money flow is manual — the client sends to the wallet in `src/lib/deposit.ts` (USDT TRC-20 `TKxMJT4iQWfTfhyKwvx7d1xQwXyhaQs5E3`, checksum verified 2026-11-20; verify checksum before changing), the order (incl. full card number) goes only to the operator via `/api/order` → Telegram bot (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, see `.env.example`); the site stores only last 4 digits. Coins without a wallet in deposit.ts show «адрес выдаст оператор». No fake/simulated payout statuses. UAH card payouts have bank choice monobank / PrivatBank / Other bank. Keep it visually distinct from swapuz.com (no copied text/layout/branding). Never put state classes on `[data-reveal]` (Effects sets `data-in`; a MutationObserver picks up late-mounted ones).
Playwright MCP: inject `document.documentElement.style.scrollBehavior='auto'` and set `data-in` on `[data-reveal]` before screenshots.
