"use client";
import type { RateMode } from "./types";

/** A copy of each order is kept in the visitor's browser (localStorage); the full order goes to the operator via /api/order. */

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
  /** Exchange wallet for the deposit; absent when the operator gives it manually. */
  deposit?: string;
  memo?: string;
  email?: string;
  bank?: string;
  /** Whether /api/order delivered the order to the operator. */
  notified: boolean;
  /** 0 waiting for deposit · 1 client reported payment, operator is checking */
  step: number;
  txid?: string;
  expires: number;
};

const KEY = "exol.orders.v2";

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

function rnd(alpha: string, n: number): string {
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => alpha[v % alpha.length]).join("");
}

export function newOrderId(): string {
  return "EX-" + rnd("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);
}
