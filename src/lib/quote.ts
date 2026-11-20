import { coin, type Network } from "./coins";
import { method as getMethod, type MethodId } from "./fiat";
import type { RateMode, Rates } from "./types";

export const SPREAD: Record<RateMode, number> = { float: 0.005, fixed: 0.01 };
export const MIN_SWAP_USD = 15;
export const MAX_SWAP_USD = 250000;
export const FIXED_MINUTES = 30;

export type Quote = {
  ok: boolean;
  out: number;
  /** 1 unit of `from` = rate units of `to`. */
  rate: number;
  usd: number;
  feeUsd: number;
  minIn: number;
  maxIn: number;
  error?: string;
};

const empty = (minIn: number, maxIn: number, error?: string): Quote => ({ ok: false, out: 0, rate: 0, usd: 0, feeUsd: 0, minIn, maxIn, error });

export function quoteCrypto(r: Rates, from: string, to: string, toNet: Network, amount: number, mode: RateMode): Quote {
  const pf = r.prices[from] ?? coin(from).price;
  const pt = r.prices[to] ?? coin(to).price;
  const minIn = (MIN_SWAP_USD + toNet.feeUsd) / pf;
  const maxIn = MAX_SWAP_USD / pf;
  if (from === to) return empty(minIn, maxIn, "Pick two different coins");
  const rate = (pf / pt) * (1 - SPREAD[mode]);
  if (!(amount > 0)) return { ...empty(minIn, maxIn), rate };
  const usd = amount * pf;
  const feeUsd = usd * SPREAD[mode] + toNet.feeUsd;
  const out = Math.max(0, (usd - feeUsd) / pt);
  if (amount < minIn) return { ...empty(minIn, maxIn, "min"), rate, out, usd, feeUsd };
  if (amount > maxIn) return { ...empty(minIn, maxIn, "max"), rate, out, usd, feeUsd };
  return { ok: true, out, rate, usd, feeUsd, minIn, maxIn };
}

export function quoteFiat(r: Rates, from: string, cur: string, methodId: MethodId, amount: number, mode: RateMode): Quote {
  const m = getMethod(methodId);
  const pf = r.prices[from] ?? coin(from).price;
  const fx = r.fx[cur] ?? 1;
  const fee = m.fee + SPREAD[mode] - SPREAD.float;
  const minIn = m.minUsd / pf;
  const maxIn = m.maxUsd / pf;
  const rate = pf * fx * (1 - fee);
  if (!(amount > 0)) return { ...empty(minIn, maxIn), rate };
  const usd = amount * pf;
  const feeUsd = usd * fee + m.fixedUsd;
  const out = Math.max(0, (usd - feeUsd) * fx);
  if (amount < minIn) return { ...empty(minIn, maxIn, "min"), rate, out, usd, feeUsd };
  if (amount > maxIn) return { ...empty(minIn, maxIn, "max"), rate, out, usd, feeUsd };
  return { ok: true, out, rate, usd, feeUsd, minIn, maxIn };
}
