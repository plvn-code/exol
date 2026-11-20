"use client";
import { useMemo, useState } from "react";
import { COINS } from "@/lib/coins";
import { compact, pct, usd } from "@/lib/format";
import { useAge, useRates } from "@/lib/useRates";
import { CoinIcon } from "./Brand";
import { Num } from "./Num";
import SwapLink from "./SwapLink";

export function Spark({ data, up, w = 120, h = 36 }: { data?: number[]; up: boolean; w?: number; h?: number }) {
  if (!data || data.length < 2) return <svg width={w} height={h} className="spark" aria-hidden><path d={`M0 ${h / 2}H${w}`} className="spark-flat" /></svg>;
  const min = Math.min(...data), max = Math.max(...data);
  const k = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / k) * (h - 6)]);
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("");
  const id = "sg" + (up ? "u" : "d");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={"spark " + (up ? "up" : "down")} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d + `L${w} ${h}L0 ${h}Z`} fill={`url(#${id})`} className="spark-fill" />
      <path d={d} className="spark-line" pathLength={1} />
    </svg>
  );
}

/** Live price ribbon under the hero. */
export function Ticker() {
  const r = useRates();
  const row = COINS.slice(0, 18);
  const items = (dup: boolean) =>
    row.map((c) => {
      const ch = r.change[c.sym] ?? c.change;
      return (
        <SwapLink key={c.sym + dup} query={`from=${c.sym}`} className="tick">
          <CoinIcon sym={c.sym} size={22} />
          <b>{c.sym}</b>
          <span className="mono">{usd(r.prices[c.sym] ?? c.price)}</span>
          <span className={"mono " + (ch >= 0 ? "up" : "down")}>{pct(ch)}</span>
        </SwapLink>
      );
    });
  return (
    <div className="ticker" aria-label="Курсы монет">
      <div className="ticker-track">
        {items(false)}
        <span className="ticker-dup" aria-hidden>{items(true)}</span>
      </div>
    </div>
  );
}

type SortKey = "rank" | "price" | "change" | "volume";

/** Market table: on the home page a top-N teaser, on /kursy the full searchable list. */
export function MarketTable({ limit, search = false }: { limit?: number; search?: boolean }) {
  const r = useRates();
  const age = useAge(r.updated);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("rank");
  const [desc, setDesc] = useState(true);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = COINS.map((c, i) => ({
      c, i,
      price: r.prices[c.sym] ?? c.price,
      change: r.change[c.sym] ?? c.change,
      volume: r.volume[c.sym] ?? 0,
    })).filter((x) => !s || x.c.sym.toLowerCase().includes(s) || x.c.name.toLowerCase().includes(s));
    if (sort !== "rank") list = [...list].sort((a, b) => (desc ? b[sort] - a[sort] : a[sort] - b[sort]));
    return limit ? list.slice(0, limit) : list;
  }, [q, sort, desc, r, limit]);

  const th = (k: SortKey, label: string, cls = "") => (
    <th className={cls}>
      {search ? (
        <button className={"th-sort" + (sort === k ? " on" : "")} onClick={() => (sort === k ? setDesc(!desc) : (setSort(k), setDesc(true)))}>
          {label}
          {sort === k && <span>{desc ? "↓" : "↑"}</span>}
        </button>
      ) : (
        label
      )}
    </th>
  );

  return (
    <div className="market">
      <div className="market-bar">
        <span className={"live-dot" + (r.live ? "" : " off")}>{r.live ? `Live · обновлено ${age < 60 ? age + " с" : Math.round(age / 60) + " мин"} назад` : "Снимок курсов · live недоступен"}</span>
        {search && (
          <label className="sheet-search small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск монеты" />
          </label>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {th("rank", "#", "num")}
              <th>Монета</th>
              {th("price", "Цена", "r")}
              {th("change", "24ч", "r")}
              {th("volume", "Объём 24ч", "r hide-m")}
              <th className="r hide-s">7 дней</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ c, i, price, change, volume }) => (
              <tr key={c.sym}>
                <td className="num dim">{i + 1}</td>
                <td>
                  <span className="t-coin">
                    <CoinIcon sym={c.sym} size={34} />
                    <span>
                      <b>{c.name}</b>
                      <small>{c.sym}</small>
                    </span>
                  </span>
                </td>
                <td className="r mono"><Num value={price} format={usd} /></td>
                <td className={"r mono " + (change >= 0 ? "up" : "down")}>{pct(change)}</td>
                <td className="r mono dim hide-m">{volume ? compact(volume) : "—"}</td>
                <td className="r hide-s"><Spark data={r.spark[c.sym]} up={change >= 0} /></td>
                <td className="r">
                  <SwapLink className="btn btn-ghost sm" query={`from=${c.sym}`}>Обменять</SwapLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
