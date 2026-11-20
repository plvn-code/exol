# STATUS — Exol Swap (2026-11-20)

## Done
- Home: animated hero (canvas globe, rotating headline word, perspective grid), exchange widget, live ticker, two routes (crypto⇄crypto / crypto→fiat) with CSS animations, fiat section (3D tilt card, 4 payout methods), 4 steps, live market table with 7-day sparklines, bento «why», FAQ, CTA footer.
- Widget: float/fixed rate, 30 coins / 20+ networks, flip, coin search sheet, min/max, network fee; fiat tab with 9 currencies × card / IBAN / Wise·Revolut / cash; validation (addresses, Luhn, IBAN, e-mail); creates an order → /order with countdown, timeline and «Симулировать оплату».
- Pages: /fiat (widget preset to fiat, comparison table), /kursy (search + sort), /faq, /aml, /terms, /privacy (template texts), 404.
- Live prices: CoinGecko (no key) via /api/rates, falls back to bundled snapshot.

## Open questions for the owner
1. Real backend / liquidity provider (ChangeNOW, SimpleSwap, own OTC desk?) and payout processor for cards.
2. Real fees, spreads and limits (now: float 0.5%, fixed 1%, card 1.5% + $1, IBAN 0.8% + $3, Wise 1%, cash 2%).
3. Contacts: Telegram support, e-mail, domain (placeholders in src/lib/site.ts).
4. Legal entity / jurisdiction for Terms & AML texts; cash cities list.
5. Add RUB or other currencies? English version?
6. GitHub repo + Vercel — not created yet (ask first).
