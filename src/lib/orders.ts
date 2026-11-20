"use client";
import type { AddrKind } from "./coins";
import type { RateMode } from "./types";

/** Demo orders live only in the visitor's browser (localStorage) — there is no backend yet. */

export type Order = {
  id: string;
  created: number;
  kind: "crypto" | "fiat";
  mode: RateMode;
  from: string;
  fromNet: string;
  amount: number;
  to: string;
  /** Network name (crypto) or payout method id (fiat). */
  toVia: string;
  out: number;
  rate: number;
  /** Masked destination: address, card •••• 1234, IBAN, etc. */
  dest: string;
  deposit: string;
  memo?: string;
  email?: string;
  /** 0 waiting deposit · 1 confirming · 2 exchanging · 3 sending · 4 done */
  step: number;
  expires: number;
};

const KEY = "exol.orders.v1";

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: Order[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30)));
  } catch {
    /* storage unavailable */
  }
}

export const listOrders = readAll;

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id.toUpperCase());
}

export function saveOrder(o: Order) {
  writeAll([o, ...readAll().filter((x) => x.id !== o.id)]);
}

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const B32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const HEX = "0123456789abcdef";
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function rnd(alpha: string, n: number): string {
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => alpha[v % alpha.length]).join("");
}

export function newOrderId(): string {
  return "EX-" + rnd("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);
}

/** A random, never-funded address in the right shape for the network — demo only. */
export function demoAddress(kind: AddrKind): string {
  switch (kind) {
    case "btc": return "bc1q" + rnd(B32, 38);
    case "ln": return "lnbc1" + rnd(B32, 60);
    case "ltc": return "ltc1q" + rnd(B32, 38);
    case "evm": return "0x" + rnd(HEX, 40);
    case "trx": return "T" + rnd(B58, 33);
    case "sol": return rnd(B58, 44);
    case "ton": return "UQ" + rnd(B64, 46);
    case "xrp": return "r" + rnd(B58, 33);
    case "doge": return "D" + rnd(B58, 33);
    case "xmr": return "4" + rnd(B58, 94);
    case "ada": return "addr1q" + rnd(B32, 52);
    case "dot": return "1" + rnd(B58, 46);
    case "xlm": return "G" + rnd("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", 55);
    case "near": return rnd(HEX, 64);
    case "apt": return "0x" + rnd(HEX, 64);
    case "atom": return "cosmos1" + rnd(B32, 38);
    case "bch": return "bitcoincash:q" + rnd(B32, 41);
    case "zec": return "t1" + rnd(B58, 33);
  }
}

export function demoMemo(): string {
  return rnd("0123456789", 9);
}
