/** Fiat payout side: currencies (fallback FX per 1 USD, snapshot 2026-11-20) and payout methods. */

export type Fiat = { code: string; name: string; sign: string; fx: number; country: string };

export const FIATS: Fiat[] = [
  { code: "USD", name: "Доллар США", sign: "$", fx: 1, country: "US" },
  { code: "EUR", name: "Евро", sign: "€", fx: 0.9117, country: "EU" },
  { code: "UAH", name: "Гривна", sign: "₴", fx: 44.8647, country: "UA" },
  { code: "KZT", name: "Тенге", sign: "₸", fx: 451.4357, country: "KZ" },
  { code: "PLN", name: "Злотый", sign: "zł", fx: 4.0639, country: "PL" },
  { code: "GBP", name: "Фунт стерлингов", sign: "£", fx: 0.7636, country: "GB" },
  { code: "TRY", name: "Турецкая лира", sign: "₺", fx: 50.5578, country: "TR" },
  { code: "GEL", name: "Лари", sign: "₾", fx: 2.595, country: "GE" },
  { code: "AED", name: "Дирхам ОАЭ", sign: "د.إ", fx: 3.6725, country: "AE" },
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
    id: "card", name: "Банковская карта", short: "Карта", note: "Visa · Mastercard · любой банк",
    fee: 0.015, fixedUsd: 1, minUsd: 30, maxUsd: 10000, eta: "5–30 минут",
    currencies: ["USD", "EUR", "UAH", "KZT", "PLN", "GBP", "TRY", "GEL", "AED"],
  },
  {
    id: "iban", name: "Банковский перевод", short: "IBAN / SEPA", note: "SEPA Instant · SWIFT для USD",
    fee: 0.008, fixedUsd: 3, minUsd: 100, maxUsd: 100000, eta: "до 1 рабочего дня",
    currencies: ["EUR", "USD", "PLN", "GBP"],
  },
  {
    id: "wise", name: "Wise / Revolut", short: "Wise · Revolut", note: "По e-mail или @тегу",
    fee: 0.01, fixedUsd: 0, minUsd: 50, maxUsd: 20000, eta: "15–60 минут",
    currencies: ["USD", "EUR", "GBP", "PLN", "TRY"],
  },
  {
    id: "cash", name: "Наличные в офисе", short: "Наличные", note: "Встреча с кассиром по брони",
    fee: 0.02, fixedUsd: 0, minUsd: 1000, maxUsd: 500000, eta: "в день обращения",
    currencies: ["USD", "EUR", "UAH", "KZT", "AED", "TRY", "GEL"],
  },
];

export const method = (id: string): Method => METHODS.find((m) => m.id === id) ?? METHODS[0];

export const CASH_CITIES = ["Киев", "Варшава", "Алматы", "Тбилиси", "Стамбул", "Дубай"];

/** Ukrainian banks for card payouts in UAH. */
export type BankId = "mono" | "privat" | "other";
export const UA_BANKS: { id: BankId; name: string; mark: string; bg: string; fg: string }[] = [
  { id: "mono", name: "monobank", mark: "m", bg: "#0d0d0d", fg: "#ffffff" },
  { id: "privat", name: "ПриватБанк", mark: "П", bg: "#5ba43a", fg: "#ffffff" },
  { id: "other", name: "Другой банк", mark: "₴", bg: "#1b2a55", fg: "#cfe0ff" },
];
export const bankName = (id?: string) => UA_BANKS.find((b) => b.id === id)?.name;
