# STATUS — Exol Swap (2026-11-20)

## Done
- Home: animated hero (canvas globe, rotating headline word, perspective grid), exchange widget, live ticker, two routes (crypto⇄crypto / crypto→fiat) with CSS animations, fiat section (3D tilt card, 4 payout methods), 4 steps, live market table with 7-day sparklines, bento «why», FAQ, CTA footer.
- Widget: float/fixed rate, 30 coins / 20+ networks, flip, coin search sheet, min/max, network fee; fiat tab with 9 currencies × card / IBAN / Wise·Revolut / cash; validation (addresses, Luhn, IBAN, e-mail); creates an order → /order with countdown, timeline and «Симулировать оплату».
- Pages: /fiat (widget preset to fiat, comparison table), /kursy (search + sort), /faq, /aml, /terms, /privacy (template texts), 404.
- Live prices: CoinGecko (no key) via /api/rates, falls back to bundled snapshot.

## 2026-11-20 (2)
- Real deposit wallet for USDT TRC-20: TKxMJT4iQWfTfhyKwvx7d1xQwXyhaQs5E3 — shown in the widget after the amount step and on the order page (copy buttons, network warning).
- Fiat tab starts at USDT (TRC-20) → UAH → card; bank choice monobank / ПриватБанк / другой банк, card number + holder name.
- Orders POST to /api/order → Telegram bot (env vars not set yet → order page asks the client to message @exolswap_support).
- Removed demo simulation and random addresses; «Я отправил(а)» + optional TxID notifies the operator.

## 2026-11-20 (3)
- Whole site translated to English (user chose English only, no switcher); /kursy renamed /rates with a permanent redirect; en-US number format; fonts latin-only.
- Fixed «-0» flash in hero counters (they now render the real value server-side).

## Open questions for the owner
0. **Telegram bot token + chat id** for order delivery, and the real support @username (placeholder @exolswap_support).
0b. Wallets for other coins (BTC, ETH, USDT ERC-20/BEP-20…) — now the operator gives them manually.
0c. Own UAH rate/fee for USDT → card (now market rate ~44.1 ₴ after 1.5% + $1).
1. Real backend / liquidity provider (ChangeNOW, SimpleSwap, own OTC desk?) and payout processor for cards.
2. Real fees, spreads and limits (now: float 0.5%, fixed 1%, card 1.5% + $1, IBAN 0.8% + $3, Wise 1%, cash 2%).
3. Contacts: Telegram support, e-mail, domain (placeholders in src/lib/site.ts).
4. Legal entity / jurisdiction for Terms & AML texts; cash cities list.
5. Add RUB or other currencies?
6. GitHub: plvn-code/exol (main, pushed 2026-11-20). Vercel — not yet (ask first).
