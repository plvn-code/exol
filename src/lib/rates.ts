import "server-only";
import { COINS } from "./coins";
import { FIATS } from "./fiat";
import type { Rates } from "./types";

const API = "https://api.coingecko.com/api/v3";

type Market = { id: string; current_price: number | null; price_change_percentage_24h: number | null; total_volume: number | null; sparkline_in_7d?: { price: number[] } };

/** Downsample a 7-day hourly series to ~42 points for a light sparkline. */
function thin(series: number[], n = 42): number[] {
  if (series.length <= n) return series;
  const step = (series.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => series[Math.round(i * step)]);
}

export function fallbackRates(): Rates {
  return {
    live: false,
    updated: Date.parse("2026-11-20T18:00:00Z"),
    prices: Object.fromEntries(COINS.map((c) => [c.sym, c.price])),
    change: Object.fromEntries(COINS.map((c) => [c.sym, c.change])),
    volume: {},
    spark: {},
    fx: Object.fromEntries(FIATS.map((f) => [f.code, f.fx])),
  };
}

/** Live prices from CoinGecko, cached for a minute; falls back to the bundled snapshot. */
export async function getRates(): Promise<Rates> {
  const base = fallbackRates();
  try {
    const ids = COINS.map((c) => c.cg).join(",");
    const [mRes, fxRes] = await Promise.all([
      fetch(`${API}/coins/markets?vs_currency=usd&ids=${ids}&per_page=100&sparkline=true&price_change_percentage=24h`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(6000),
        headers: { accept: "application/json" },
      }),
      fetch(`${API}/exchange_rates`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(6000), headers: { accept: "application/json" } }),
    ]);
    if (!mRes.ok) return base;
    const markets = (await mRes.json()) as Market[];
    const byId = new Map(markets.map((m) => [m.id, m]));
    for (const c of COINS) {
      const m = byId.get(c.cg);
      if (!m || !m.current_price) continue;
      base.prices[c.sym] = m.current_price;
      base.change[c.sym] = m.price_change_percentage_24h ?? 0;
      if (m.total_volume) base.volume[c.sym] = m.total_volume;
      if (m.sparkline_in_7d?.price?.length) base.spark[c.sym] = thin(m.sparkline_in_7d.price);
    }
    if (fxRes.ok) {
      const fx = (await fxRes.json()) as { rates: Record<string, { value: number }> };
      const usd = fx.rates.usd?.value;
      if (usd) {
        for (const f of FIATS) {
          const v = fx.rates[f.code.toLowerCase()]?.value;
          if (v) base.fx[f.code] = v / usd;
        }
      }
    }
    base.live = true;
    base.updated = Date.now();
    return base;
  } catch {
    return base;
  }
}
