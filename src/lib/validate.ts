import type { AddrKind } from "./coins";

const B58 = "1-9A-HJ-NP-Za-km-z";

const ADDR: Record<AddrKind, RegExp> = {
  btc: new RegExp(`^(bc1[a-z0-9]{25,62}|[13][${B58}]{25,34})$`),
  ln: /^(lnbc[a-z0-9]{20,}|[^@\s]+@[^@\s]+\.[a-z]{2,})$/i,
  ltc: new RegExp(`^(ltc1[a-z0-9]{25,62}|[LM3][${B58}]{26,33})$`),
  evm: /^0x[a-fA-F0-9]{40}$/,
  trx: new RegExp(`^T[${B58}]{33}$`),
  sol: new RegExp(`^[${B58}]{32,44}$`),
  ton: /^(UQ|EQ|kQ|0Q)[A-Za-z0-9_-]{46}$|^-?[01]:[a-fA-F0-9]{64}$/,
  xrp: new RegExp(`^r[${B58}]{24,34}$`),
  doge: new RegExp(`^[DA9][${B58}]{25,34}$`),
  xmr: new RegExp(`^[48][${B58}]{94,105}$`),
  ada: /^addr1[a-z0-9]{50,110}$/,
  dot: new RegExp(`^1[${B58}]{45,47}$`),
  xlm: /^G[A-Z2-7]{55}$/,
  near: /^([a-f0-9]{64}|[a-z0-9_.-]{2,59}\.near)$/,
  apt: /^0x[a-fA-F0-9]{1,64}$/,
  atom: /^cosmos1[a-z0-9]{38}$/,
  bch: /^(bitcoincash:)?[qp][a-z0-9]{41}$/,
  zec: new RegExp(`^t[13][${B58}]{33}$`),
};

export const validAddress = (kind: AddrKind, s: string) => ADDR[kind].test(s.trim());

export function luhn(num: string): boolean {
  const d = num.replace(/\D/g, "");
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i];
    if (i % 2) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export function cardBrand(num: string): string {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "MASTERCARD";
  if (/^(5[06-9]|6)/.test(d)) return "MAESTRO";
  return "";
}

export function formatCard(s: string): string {
  return s.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function validIban(s: string): boolean {
  const v = s.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(v)) return false;
  const re = (v.slice(4) + v.slice(0, 4)).replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let r = 0;
  for (const ch of re) r = (r * 10 + +ch) % 97;
  return r === 1;
}

export const validEmail = (s: string) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(s.trim());
