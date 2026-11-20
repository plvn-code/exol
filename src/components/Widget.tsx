"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { coin } from "@/lib/coins";
import { CASH_CITIES, fiat as getFiat, method as getMethod, METHODS, type MethodId } from "@/lib/fiat";
import { amt, money, parseNum, usd } from "@/lib/format";
import { demoAddress, demoMemo, newOrderId, saveOrder, type Order } from "@/lib/orders";
import { FIXED_MINUTES, quoteCrypto, quoteFiat } from "@/lib/quote";
import type { RateMode } from "@/lib/types";
import { useRates } from "@/lib/useRates";
import { cardBrand, formatCard, luhn, validAddress, validEmail, validIban } from "@/lib/validate";
import { CoinIcon, FiatIcon, MethodIcon } from "./Brand";
import { Num } from "./Num";
import Picker from "./Picker";

export type Tab = "crypto" | "fiat";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
);

export default function Widget({ initialTab = "crypto", id = "swap" }: { initialTab?: Tab; id?: string }) {
  const r = useRates();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [mode, setMode] = useState<RateMode>("float");
  const [from, setFrom] = useState("BTC");
  const [fromNet, setFromNet] = useState("btc");
  const [amountStr, setAmountStr] = useState("0.05");
  const [to, setTo] = useState("USDT");
  const [toNet, setToNet] = useState("trc20");
  const [cur, setCur] = useState("UAH");
  const [meth, setMeth] = useState<MethodId>("card");
  const [picker, setPicker] = useState<null | "from" | "to" | "cur">(null);
  const [stage, setStage] = useState<"quote" | "details">("quote");
  const [spin, setSpin] = useState(0);

  const [dest, setDest] = useState("");
  const [memo, setMemo] = useState("");
  const [refund, setRefund] = useState("");
  const [email, setEmail] = useState("");
  const [holder, setHolder] = useState("");
  const [city, setCity] = useState(CASH_CITIES[0]);
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);

  // Prefill from links such as /?from=ETH&to=USDT or /fiat?from=USDT&cur=EUR&method=iban,
  // and from <SwapLink> clicks on the same page (custom event, no reload).
  useEffect(() => {
    const apply = (p: URLSearchParams) => {
      const f = p.get("from")?.toUpperCase();
      const t = p.get("to")?.toUpperCase();
      if (f && coin(f).sym === f) {
        setFrom(f);
        setFromNet(coin(f).networks[0].id);
        setAmountStr(String(+(200 / (coin(f).price || 1)).toPrecision(2)));
        if (!t && f === "USDT") setTo("BTC");
      }
      if (t && coin(t).sym === t && t !== f) {
        setTo(t);
        setToNet(coin(t).networks[0].id);
      } else if (f && !t) {
        setTo((cur) => {
          const next = cur === f ? (f === "USDT" ? "BTC" : "USDT") : cur;
          setToNet(coin(next).networks[0].id);
          return next;
        });
      }
      const c = p.get("cur")?.toUpperCase();
      if (c && getFiat(c).code === c) setCur(c);
      const m = p.get("method");
      if (m && METHODS.some((x) => x.id === m)) setMeth(m as MethodId);
      if (p.get("tab") === "fiat" || c || m) setTab("fiat");
      else if (p.get("tab") === "crypto" || t) setTab("crypto");
      if ([...p.keys()].length) setStage("quote");
    };
    apply(new URLSearchParams(window.location.search));
    const onPrefill = (e: Event) => apply(new URLSearchParams((e as CustomEvent<string>).detail));
    window.addEventListener("exol:prefill", onPrefill);
    return () => window.removeEventListener("exol:prefill", onPrefill);
  }, []);

  const fromCoin = coin(from);
  const toCoin = coin(to);
  const fromNetObj = fromCoin.networks.find((n) => n.id === fromNet) ?? fromCoin.networks[0];
  const toNetObj = toCoin.networks.find((n) => n.id === toNet) ?? toCoin.networks[0];
  const m = getMethod(meth);
  const f = getFiat(cur);
  const amount = parseNum(amountStr);

  const q = useMemo(
    () => (tab === "crypto" ? quoteCrypto(r, from, to, toNetObj, amount, mode) : quoteFiat(r, from, cur, meth, amount, mode)),
    [tab, r, from, to, toNetObj, amount, mode, cur, meth],
  );

  const methodsFor = METHODS.filter((x) => x.currencies.includes(cur));
  useEffect(() => {
    if (!m.currencies.includes(cur)) setMeth(methodsFor[0]?.id ?? "card");
  }, [cur, m, methodsFor]);

  const pickFrom = (s: string) => {
    const oldUsd = amount * (r.prices[from] ?? fromCoin.price);
    setFrom(s);
    setFromNet(coin(s).networks[0].id);
    if (oldUsd > 0) setAmountStr(String(+(oldUsd / (r.prices[s] ?? coin(s).price)).toPrecision(4)));
    if (s === to) {
      setTo(from);
      setToNet(fromCoin.networks[0].id);
    }
    setPicker(null);
  };
  const pickTo = (s: string) => {
    setTo(s);
    setToNet(coin(s).networks[0].id);
    if (s === from) {
      setFrom(to);
      setFromNet(toCoin.networks[0].id);
    }
    setPicker(null);
  };
  const flip = () => {
    setSpin((x) => x + 1);
    if (tab !== "crypto") return;
    const outAmt = q.out > 0 ? q.out : 0;
    setFrom(to);
    setFromNet(toNet);
    setTo(from);
    setToNet(fromNet);
    if (outAmt) setAmountStr(String(+outAmt.toPrecision(6)));
  };
  const closePicker = useCallback(() => setPicker(null), []);

  // Destination validation
  const destErr = (() => {
    const v = dest.trim();
    if (tab === "crypto") {
      if (!v) return "Укажите адрес";
      return validAddress(toNetObj.addr, v) ? "" : `Это не похоже на адрес ${to} в сети ${toNetObj.name}`;
    }
    if (meth === "card") return luhn(v) ? "" : "Проверьте номер карты";
    if (meth === "iban") return validIban(v) ? "" : "Проверьте IBAN";
    if (meth === "wise") return validEmail(v) || /^@?[a-z0-9_.]{3,30}$/i.test(v) ? "" : "Укажите e-mail или @тег";
    return v.replace(/\D/g, "").length >= 9 || /^@[a-z0-9_]{4,}$/i.test(v) ? "" : "Телефон или @telegram для связи";
  })();
  const holderErr = tab === "fiat" && meth !== "cash" && holder.trim().split(/\s+/).length < 2 ? "Имя и фамилия латиницей, как на карте/счёте" : "";
  const refundErr = refund.trim() && !validAddress(fromNetObj.addr, refund) ? `Неверный адрес ${from}` : "";
  const emailErr = email.trim() && !validEmail(email) ? "Неверный e-mail" : "";
  const formOk = !destErr && !holderErr && !refundErr && !emailErr && agree;

  const maskDest = () => {
    const v = dest.trim();
    if (tab === "crypto") return memo.trim() ? `${v} · memo ${memo.trim()}` : v;
    if (meth === "card") return `${cardBrand(v) || "Карта"} •••• ${v.replace(/\D/g, "").slice(-4)} · ${holder.trim().toUpperCase()}`;
    if (meth === "iban") return `${v.replace(/\s/g, "").slice(0, 4)} •••• ${v.replace(/\s/g, "").slice(-4)} · ${holder.trim()}`;
    if (meth === "wise") return `${v} · ${holder.trim()}`;
    return `${city} · ${v}`;
  };

  const submit = () => {
    setTried(true);
    if (!formOk || !q.ok) return;
    const o: Order = {
      id: newOrderId(),
      created: Date.now(),
      kind: tab,
      mode,
      from,
      fromNet: fromNetObj.name,
      amount,
      to: tab === "crypto" ? to : cur,
      toVia: tab === "crypto" ? toNetObj.name : meth,
      out: q.out,
      rate: q.rate,
      dest: maskDest(),
      deposit: demoAddress(fromNetObj.addr),
      memo: fromNetObj.memo ? demoMemo() : undefined,
      email: email.trim() || undefined,
      step: 0,
      expires: Date.now() + FIXED_MINUTES * 60000,
    };
    saveOrder(o);
    router.push(`/order?id=${o.id}`);
  };

  const goDetails = () => {
    if (!q.ok) return;
    setTried(false);
    setDest("");
    setStage("details");
  };

  const errLine =
    q.error === "min" ? `Минимум ${amt(q.minIn)} ${from}` : q.error === "max" ? `Максимум ${amt(q.maxIn)} ${from}` : q.error ?? "";

  return (
    <div className="widget" id={id}>
      <div className="w-glow" aria-hidden />
      <div className="w-inner">
        <div className="w-tabs" role="tablist" data-tab={tab}>
          <span className="w-tabs-ind" aria-hidden />
          <button role="tab" aria-selected={tab === "crypto"} onClick={() => { setTab("crypto"); setStage("quote"); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h11l-3-3M17 17H6l3 3" /></svg>
            Крипто ⇄ Крипто
          </button>
          <button role="tab" aria-selected={tab === "fiat"} onClick={() => { setTab("fiat"); setStage("quote");}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18" /></svg>
            Вывод в фиат
          </button>
        </div>

        {stage === "quote" ? (
          <div className="w-stage" key={"q" + tab}>
            <div className="w-mode">
              <div className="seg" data-on={mode}>
                <span className="seg-ind" aria-hidden />
                <button onClick={() => setMode("float")} aria-pressed={mode === "float"}>Плавающий</button>
                <button onClick={() => setMode("fixed")} aria-pressed={mode === "fixed"}>Фиксированный</button>
              </div>
              <span className="w-mode-hint">
                {mode === "float" ? "Лучший курс на момент поступления" : `Курс закреплён на ${FIXED_MINUTES} минут`}
              </span>
            </div>

            <div className={"w-field" + (q.error && q.error !== "Выберите разные монеты" && amount > 0 ? " bad" : "")}>
              <div className="w-label">
                <span>Отдаёте</span>
                <span className="mono dim">≈ {usd(q.usd || amount * (r.prices[from] ?? 0))}</span>
              </div>
              <div className="w-row">
                <input
                  className="w-amount"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value.replace(/[^\d.,]/g, ""))}
                  aria-label="Сумма"
                  placeholder="0"
                />
                <button className="asset-btn" onClick={() => setPicker("from")}>
                  <CoinIcon sym={from} size={30} />
                  <b>{from}</b>
                  <Chevron />
                </button>
              </div>
              {fromCoin.networks.length > 1 && (
                <div className="nets">
                  {fromCoin.networks.map((n) => (
                    <button key={n.id} className={"net" + (n.id === fromNetObj.id ? " on" : "")} onClick={() => setFromNet(n.id)}>
                      {n.name.replace(/ \(.+\)/, "")}
                    </button>
                  ))}
                </div>
              )}
              {errLine && amount > 0 && <div className="w-err">{errLine}</div>}
            </div>

            <button className="w-flip" onClick={flip} aria-label="Поменять местами" style={{ transform: `rotate(${spin * 180}deg)` }} disabled={tab === "fiat"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {tab === "crypto" ? <path d="M8 4v15m0 0l-3.5-3.5M8 19l3.5-3.5M16 20V5m0 0l-3.5 3.5M16 5l3.5 3.5" /> : <path d="M12 4v16m0 0l-5-5m5 5l5-5" />}
              </svg>
            </button>

            <div className="w-field to">
              <div className="w-label">
                <span>{tab === "crypto" ? "Получаете" : "Получаете · " + m.short}</span>
                <span className="mono dim">{mode === "fixed" ? "фикс" : "≈ ориентировочно"}</span>
              </div>
              <div className="w-row">
                <output className="w-amount out">
                  <Num value={q.out} format={(n) => (tab === "crypto" ? amt(n) : n.toLocaleString("ru-RU", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).replace(/ /g, " "))} />
                </output>
                {tab === "crypto" ? (
                  <button className="asset-btn" onClick={() => setPicker("to")}>
                    <CoinIcon sym={to} size={30} />
                    <b>{to}</b>
                    <Chevron />
                  </button>
                ) : (
                  <button className="asset-btn" onClick={() => setPicker("cur")}>
                    <FiatIcon code={cur} size={30} />
                    <b>{cur}</b>
                    <Chevron />
                  </button>
                )}
              </div>
              {tab === "crypto" ? (
                toCoin.networks.length > 1 && (
                  <div className="nets">
                    {toCoin.networks.map((n) => (
                      <button key={n.id} className={"net" + (n.id === toNetObj.id ? " on" : "")} onClick={() => setToNet(n.id)}>
                        {n.name.replace(/ \(.+\)/, "")}
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <div className="methods">
                  {METHODS.map((x) => (
                    <button key={x.id} className={"method" + (x.id === meth ? " on" : "")} disabled={!x.currencies.includes(cur)} onClick={() => setMeth(x.id)} title={x.note}>
                      <MethodIcon id={x.id} />
                      <span>{x.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <dl className="w-meta">
              <div>
                <dt>Курс</dt>
                <dd className="mono">
                  1 {from} ≈ {tab === "crypto" ? `${amt(q.rate)} ${to}` : money(q.rate, f.sign)}
                </dd>
              </div>
              <div>
                <dt>{tab === "crypto" ? "Комиссия сети" : "Комиссия"}</dt>
                <dd className="mono">{tab === "crypto" ? usd(toNetObj.feeUsd) : `${((m.fee + (mode === "fixed" ? 0.005 : 0)) * 100).toFixed(1)}%${m.fixedUsd ? " + " + usd(m.fixedUsd) : ""}`}</dd>
              </div>
              <div>
                <dt>Время</dt>
                <dd>{tab === "crypto" ? "2–15 минут" : m.eta}</dd>
              </div>
            </dl>

            <button className="btn btn-primary w-go" disabled={!q.ok} onClick={goDetails}>
              {tab === "crypto" ? "Обменять" : "Вывести на " + (meth === "card" ? "карту" : meth === "cash" ? "наличные" : m.short)}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14m-5-5l5 5-5 5" /></svg>
            </button>
            <p className="w-foot">Без регистрации · Без скрытых комиссий · Демо-режим</p>
          </div>
        ) : (
          <div className="w-stage details" key="d">
            <button className="w-back" onClick={() => setStage("quote")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5m5-5l-5 5 5 5" /></svg>
              Изменить сумму
            </button>
            <div className="w-sum">
              <span><CoinIcon sym={from} size={22} /> <b className="mono">{amt(amount)}</b> {from}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-5-5l5 5-5 5" /></svg>
              <span>
                {tab === "crypto" ? <CoinIcon sym={to} size={22} /> : <FiatIcon code={cur} size={22} />}{" "}
                <b className="mono">{tab === "crypto" ? amt(q.out) : money(q.out, f.sign)}</b> {tab === "crypto" ? to : ""}
              </span>
            </div>

            {tab === "crypto" ? (
              <>
                <Field label={`Адрес ${to} · ${toNetObj.name}`} err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder={demoHint(toNetObj.addr)} spellCheck={false} autoComplete="off" />
                </Field>
                {toNetObj.memo && (
                  <Field label="Memo / Tag (если требует биржа)">
                    <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Необязательно" />
                  </Field>
                )}
              </>
            ) : meth === "card" ? (
              <>
                <Field label="Номер карты" err={tried ? destErr : ""} badge={cardBrand(dest)}>
                  <input value={dest} onChange={(e) => setDest(formatCard(e.target.value))} inputMode="numeric" placeholder="0000 0000 0000 0000" autoComplete="off" />
                </Field>
                <Field label="Имя на карте" err={tried ? holderErr : ""}>
                  <input value={holder} onChange={(e) => setHolder(e.target.value.toUpperCase())} placeholder="IVAN PETRENKO" autoComplete="off" />
                </Field>
              </>
            ) : meth === "iban" ? (
              <>
                <Field label="IBAN получателя" err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ""))} placeholder="DE89 3704 0044 0532 0130 00" autoComplete="off" />
                </Field>
                <Field label="Получатель (как в банке)" err={tried ? holderErr : ""}>
                  <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Ivan Petrenko" />
                </Field>
              </>
            ) : meth === "wise" ? (
              <>
                <Field label="E-mail или @тег в Wise / Revolut" err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="name@mail.com" />
                </Field>
                <Field label="Имя получателя" err={tried ? holderErr : ""}>
                  <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Ivan Petrenko" />
                </Field>
              </>
            ) : (
              <>
                <Field label="Город выдачи">
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    {CASH_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Телефон или @telegram" err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="@username" />
                </Field>
              </>
            )}

            <Field label={`Адрес возврата ${from} (необязательно)`} err={refundErr}>
              <input value={refund} onChange={(e) => setRefund(e.target.value)} placeholder="Если обмен не состоится" spellCheck={false} />
            </Field>
            <Field label="E-mail для статуса (необязательно)" err={emailErr}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" inputMode="email" />
            </Field>

            <label className={"check" + (tried && !agree ? " bad" : "")}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="check-box" aria-hidden />
              <span>
                Согласен с <Link href="/terms">условиями</Link> и <Link href="/aml">AML/KYC-политикой</Link>
              </span>
            </label>

            <button className="btn btn-primary w-go" onClick={submit}>
              Создать заявку
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5L20 7" /></svg>
            </button>
            {tab === "fiat" && <p className="w-foot">Данные карты не сохраняются — в заявке остаются только последние 4 цифры.</p>}
          </div>
        )}
      </div>

      {picker === "from" && <Picker kind="coin" title="Вы отдаёте" value={from} onPick={pickFrom} onClose={closePicker} />}
      {picker === "to" && <Picker kind="coin" title="Вы получаете" value={to} onPick={pickTo} onClose={closePicker} />}
      {picker === "cur" && <Picker kind="fiat" title="Валюта выплаты" value={cur} onPick={(c) => { setCur(c); setPicker(null); }} onClose={closePicker} />}
    </div>
  );
}

function Field({ label, err, badge, children }: { label: string; err?: string; badge?: string; children: React.ReactNode }) {
  return (
    <label className={"field" + (err ? " bad" : "")}>
      <span className="field-label">
        {label}
        {badge && <em className="field-badge">{badge}</em>}
      </span>
      {children}
      {err && <span className="field-err">{err}</span>}
    </label>
  );
}

function demoHint(kind: string): string {
  return (
    { btc: "bc1q…", evm: "0x…", trx: "T…", sol: "Адрес Solana", ton: "UQ…", xrp: "r…", ltc: "ltc1q…", doge: "D…", xmr: "4…", ada: "addr1…", dot: "1…", xlm: "G…", near: "name.near", apt: "0x…", atom: "cosmos1…", bch: "bitcoincash:q…", ln: "Invoice lnbc… или name@wallet", zec: "t1…" } as Record<string, string>
  )[kind] ?? "Адрес";
}
