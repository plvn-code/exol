/** Fiat payout side: currencies (fallback FX per 1 USD, snapshot 2026-11-20) and payout methods. */

export type Fiat = { code: string; name: string; sign: string; fx: number; country: string };

export const FIATS: Fiat[] = [
  { code: "USD", name: "US dollar", sign: "$", fx: 1, country: "US" },
  { code: "EUR", name: "Euro", sign: "€", fx: 0.9117, country: "EU" },
  { code: "UAH", name: "Ukrainian hryvnia", sign: "₴", fx: 44.8647, country: "UA" },
  { code: "KZT", name: "Kazakhstani tenge", sign: "₸", fx: 451.4357, country: "KZ" },
  { code: "PLN", name: "Polish złoty", sign: "zł", fx: 4.0639, country: "PL" },
  { code: "GBP", name: "British pound", sign: "£", fx: 0.7636, country: "GB" },
  { code: "TRY", name: "Turkish lira", sign: "₺", fx: 50.5578, country: "TR" },
  { code: "GEL", name: "Georgian lari", sign: "₾", fx: 2.595, country: "GE" },
  { code: "AED", name: "UAE dirham", sign: "د.إ", fx: 3.6725, country: "AE" },
];

export const fiat = (code: string): Fiat => FIATS.find((f) => f.code === code) ?? FIATS[0];

export type MethodId = "card" | "iban" | "wise" | "cash";

export type Method = {
  id: MethodId;
  name: string;
  short: string;
  note: string;
  /** Exchange fee as a fraction. */
  fee: number;
  /** Fixed payout fee, USD. */
  fixedUsd: number;
  minUsd: number;
  maxUsd: number;
  eta: string;
  currencies: string[];
};

export const METHODS: Method[] = [
  {
    id: "card", name: "Bank card", short: "Card", note: "Visa · Mastercard · any bank",
    fee: 0.015, fixedUsd: 1, minUsd: 30, maxUsd: 10000, eta: "5–30 minutes",
    currencies: ["USD", "EUR", "UAH", "KZT", "PLN", "GBP", "TRY", "GEL", "AED"],
  },
  {
    id: "iban", name: "Bank transfer", short: "IBAN / SEPA", note: "SEPA Instant · SWIFT for USD",
    fee: 0.008, fixedUsd: 3, minUsd: 100, maxUsd: 100000, eta: "within 1 business day",
    currencies: ["EUR", "USD", "PLN", "GBP"],
  },
  {
    id: "wise", name: "Wise / Revolut", short: "Wise · Revolut", note: "By e-mail or @tag",
    fee: 0.01, fixedUsd: 0, minUsd: 50, maxUsd: 20000, eta: "15–60 minutes",
    currencies: ["USD", "EUR", "GBP", "PLN", "TRY"],
  },
  {
    id: "cash", name: "Cash at an office", short: "Cash", note: "Meet a cashier by appointment",
    fee: 0.02, fixedUsd: 0, minUsd: 1000, maxUsd: 500000, eta: "same day",
    currencies: ["USD", "EUR", "UAH", "KZT", "AED", "TRY", "GEL"],
  },
];

export const method = (id: string): Method => METHODS.find((m) => m.id === id) ?? METHODS[0];

export const CASH_CITIES = ["Kyiv", "Warsaw", "Almaty", "Tbilisi", "Istanbul", "Dubai"];

/** Ukrainian banks for card payouts in UAH. */
export type BankId = "mono" | "privat" | "other";
export const UA_BANKS: { id: BankId; name: string; mark: string; bg: string; fg: string }[] = [
  { id: "mono", name: "monobank", mark: "m", bg: "#0d0d0d", fg: "#ffffff" },
  { id: "privat", name: "PrivatBank", mark: "P", bg: "#5ba43a", fg: "#ffffff" },
  { id: "other", name: "Other bank", mark: "₴", bg: "#1b2a55", fg: "#cfe0ff" },
];
export const bankName = (id?: string) => UA_BANKS.find((b) => b.id === id)?.name;
