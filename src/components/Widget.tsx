"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { coin } from "@/lib/coins";
import { depositFor } from "@/lib/deposit";
import { bankName, CASH_CITIES, fiat as getFiat, method as getMethod, METHODS, UA_BANKS, type BankId, type MethodId } from "@/lib/fiat";
import { amt, money, parseNum, usd } from "@/lib/format";
import { newOrderId, saveOrder, type Order } from "@/lib/orders";
import { FIXED_MINUTES, quoteCrypto, quoteFiat } from "@/lib/quote";
import type { RateMode } from "@/lib/types";
import { useRates } from "@/lib/useRates";
import { cardBrand, formatCard, luhn, validAddress, validEmail, validIban } from "@/lib/validate";
import { CoinIcon, FiatIcon, MethodIcon } from "./Brand";
import { Num } from "./Num";
import CopyBtn from "./CopyBtn";
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
  const [from, setFrom] = useState(initialTab === "fiat" ? "USDT" : "BTC");
  const [fromNet, setFromNet] = useState(initialTab === "fiat" ? "trc20" : "btc");
  const [amountStr, setAmountStr] = useState(initialTab === "fiat" ? "100" : "0.05");
  const [to, setTo] = useState("USDT");
  const [toNet, setToNet] = useState("trc20");
  const [cur, setCur] = useState("UAH");
  const [meth, setMeth] = useState<MethodId>("card");
  const [bank, setBank] = useState<BankId>("mono");
  const [sending, setSending] = useState(false);
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
  const dep = depositFor(from, fromNetObj.id);
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
      if (!v) return "Enter the address";
      return validAddress(toNetObj.addr, v) ? "" : `This doesn't look like a ${to} address on ${toNetObj.name}`;
    }
    if (meth === "card") return luhn(v) ? "" : "Check the card number";
    if (meth === "iban") return validIban(v) ? "" : "Check the IBAN";
    if (meth === "wise") return validEmail(v) || /^@?[a-z0-9_.]{3,30}$/i.test(v) ? "" : "Enter an e-mail or @tag";
    return v.replace(/\D/g, "").length >= 9 || /^@[a-z0-9_]{4,}$/i.test(v) ? "" : "Phone or @telegram to reach you";
  })();
  const holderErr = tab === "fiat" && meth !== "cash" && holder.trim().split(/\s+/).length < 2 ? "Enter the recipient's first and last name" : "";
  const refundErr = refund.trim() && !validAddress(fromNetObj.addr, refund) ? `Invalid ${from} address` : "";
  const emailErr = email.trim() && !validEmail(email) ? "Invalid e-mail" : "";
  const formOk = !destErr && !holderErr && !refundErr && !emailErr && agree;

  const maskDest = () => {
    const v = dest.trim();
    if (tab === "crypto") return memo.trim() ? `${v} · memo ${memo.trim()}` : v;
    if (meth === "card") return `${(cur === "UAH" && bankName(bank)) || cardBrand(v) || "Card"} •••• ${v.replace(/\D/g, "").slice(-4)} · ${holder.trim()}`;
    if (meth === "iban") return `${v.replace(/\s/g, "").slice(0, 4)} •••• ${v.replace(/\s/g, "").slice(-4)} · ${holder.trim()}`;
    if (meth === "wise") return `${v} · ${holder.trim()}`;
    return `${city} · ${v}`;
  };

  const submit = async () => {
    setTried(true);
    if (!formOk || !q.ok || sending) return;
    setSending(true);
    const id = newOrderId();
    const v = dest.trim();
    const isCard = tab === "fiat" && meth === "card";
    const payload = {
      event: "new",
      id,
      kind: tab,
      mode,
      from,
      fromNet: fromNetObj.name,
      amount: amt(amount),
      to: tab === "crypto" ? to : cur,
      via: tab === "crypto" ? toNetObj.name : m.name,
      out: tab === "crypto" ? amt(q.out) : q.out.toFixed(2),
      rate: tab === "crypto" ? amt(q.rate) : q.rate.toFixed(2),
      bank: isCard && cur === "UAH" ? bankName(bank) : undefined,
      card: isCard ? v : undefined,
      iban: tab === "fiat" && meth === "iban" ? v : undefined,
      account: tab === "fiat" && meth === "wise" ? v : undefined,
      city: tab === "fiat" && meth === "cash" ? city : undefined,
      contact: tab === "fiat" && meth === "cash" ? v : undefined,
      holder: tab === "fiat" && meth !== "cash" ? holder.trim() : undefined,
      address: tab === "crypto" ? v : undefined,
      memo: tab === "crypto" ? memo.trim() || undefined : undefined,
      deposit: dep?.address,
      refund: refund.trim() || undefined,
      email: email.trim() || undefined,
    };
    let notified = false;
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      notified = res.ok && ((await res.json()) as { delivered?: boolean }).delivered === true;
    } catch {
      /* the order page tells the client to message the operator */
    }
    const o: Order = {
      id,
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
      deposit: dep?.address,
      memo: dep?.memo,
      email: email.trim() || undefined,
      bank: payload.bank,
      notified,
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
    q.error === "min" ? `Minimum ${amt(q.minIn)} ${from}` : q.error === "max" ? `Maximum ${amt(q.maxIn)} ${from}` : q.error ?? "";

  return (
    <div className="widget" id={id}>
      <div className="w-glow" aria-hidden />
      <div className="w-inner">
        <div className="w-tabs" role="tablist" data-tab={tab}>
          <span className="w-tabs-ind" aria-hidden />
          <button role="tab" aria-selected={tab === "crypto"} onClick={() => { setTab("crypto"); setStage("quote"); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h11l-3-3M17 17H6l3 3" /></svg>
            Crypto ⇄ Crypto
          </button>
          <button role="tab" aria-selected={tab === "fiat"} onClick={() => {
            setTab("fiat");
            setStage("quote");
            // Fiat payouts are mostly USDT (TRC-20) → card, so start from there.
            if (!coin(from).stable) {
              setFrom("USDT");
              setFromNet("trc20");
              setAmountStr("100");
            }
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18" /></svg>
            Crypto → Fiat
          </button>
        </div>

        {stage === "quote" ? (
          <div className="w-stage" key={"q" + tab}>
            <div className="w-mode">
              <div className="seg" data-on={mode}>
                <span className="seg-ind" aria-hidden />
                <button onClick={() => setMode("float")} aria-pressed={mode === "float"}>Floating</button>
                <button onClick={() => setMode("fixed")} aria-pressed={mode === "fixed"}>Fixed</button>
              </div>
              <span className="w-mode-hint">
                {mode === "float" ? "Best rate when funds arrive" : `Rate locked for ${FIXED_MINUTES} minutes`}
              </span>
            </div>

            <div className={"w-field" + (q.error && q.error !== "Pick two different coins" && amount > 0 ? " bad" : "")}>
              <div className="w-label">
                <span>You send</span>
                <span className="mono dim">≈ {usd(q.usd || amount * (r.prices[from] ?? 0))}</span>
              </div>
              <div className="w-row">
                <input
                  className="w-amount"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value.replace(/[^\d.,]/g, ""))}
                  aria-label="Amount"
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

            <button className="w-flip" onClick={flip} aria-label="Swap direction" style={{ transform: `rotate(${spin * 180}deg)` }} disabled={tab === "fiat"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {tab === "crypto" ? <path d="M8 4v15m0 0l-3.5-3.5M8 19l3.5-3.5M16 20V5m0 0l-3.5 3.5M16 5l3.5 3.5" /> : <path d="M12 4v16m0 0l-5-5m5 5l5-5" />}
              </svg>
            </button>

            <div className="w-field to">
              <div className="w-label">
                <span>{tab === "crypto" ? "You get" : "You get · " + m.short}</span>
                <span className="mono dim">{mode === "fixed" ? "fixed" : "≈ estimated"}</span>
              </div>
              <div className="w-row">
                <output className="w-amount out">
                  <Num value={q.out} format={(n) => (tab === "crypto" ? amt(n) : n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))} />
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
              {tab === "fiat" && meth === "card" && cur === "UAH" && (
                <div className="banks" role="radiogroup" aria-label="Recipient bank">
                  {UA_BANKS.map((b) => (
                    <button key={b.id} role="radio" aria-checked={bank === b.id} className={"bank" + (bank === b.id ? " on" : "")} onClick={() => setBank(b.id)}>
                      <span className="bank-mark" style={{ background: b.bg, color: b.fg }}>{b.mark}</span>
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <dl className="w-meta">
              <div>
                <dt>Rate</dt>
                <dd className="mono">
                  1 {from} ≈ {tab === "crypto" ? `${amt(q.rate)} ${to}` : money(q.rate, f.sign)}
                </dd>
              </div>
              <div>
                <dt>{tab === "crypto" ? "Network fee" : "Fee"}</dt>
                <dd className="mono">{tab === "crypto" ? usd(toNetObj.feeUsd) : `${((m.fee + (mode === "fixed" ? 0.005 : 0)) * 100).toFixed(1)}%${m.fixedUsd ? " + " + usd(m.fixedUsd) : ""}`}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{tab === "crypto" ? "2–15 minutes" : m.eta}</dd>
              </div>
            </dl>

            <button className="btn btn-primary w-go" disabled={!q.ok} onClick={goDetails}>
              {tab === "crypto" ? "Swap now" : "Cash out to " + (meth === "card" ? (cur === "UAH" && bank !== "other" ? bankName(bank) + " card" : "card") : meth === "cash" ? "cash" : m.short)}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14m-5-5l5 5-5 5" /></svg>
            </button>
            <p className="w-foot">No sign-up · No hidden fees · 24/7 support</p>
          </div>
        ) : (
          <div className="w-stage details" key="d">
            <button className="w-back" onClick={() => setStage("quote")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5m5-5l-5 5 5 5" /></svg>
              Change amount
            </button>
            <div className="w-sum">
              <span><CoinIcon sym={from} size={22} /> <b className="mono">{amt(amount)}</b> {from}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-5-5l5 5-5 5" /></svg>
              <span>
                {tab === "crypto" ? <CoinIcon sym={to} size={22} /> : <FiatIcon code={cur} size={22} />}{" "}
                <b className="mono">{tab === "crypto" ? amt(q.out) : money(q.out, f.sign)}</b> {tab === "crypto" ? to : ""}
              </span>
            </div>

            {dep ? (
              <div className="w-dep">
                <span className="w-dep-label">
                  Send <b className="mono">{amt(amount)} {from}</b> · {fromNetObj.name} network
                </span>
                <div className="w-dep-addr">
                  <code>{dep.address}</code>
                  <CopyBtn text={dep.address} />
                </div>
                <small>{from} on {fromNetObj.name.replace(/ \(.+\)/, "")} only. Create the order first so we know where to pay you.</small>
              </div>
            ) : (
              <div className="w-dep muted">
                <small>The operator will send the {from} ({fromNetObj.name}) deposit address after you create the order.</small>
              </div>
            )}

            {tab === "crypto" ? (
              <>
                <Field label={`Your ${to} address · ${toNetObj.name}`} err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder={demoHint(toNetObj.addr)} spellCheck={false} autoComplete="off" />
                </Field>
                {toNetObj.memo && (
                  <Field label="Memo / Tag (if your exchange requires it)">
                    <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Optional" />
                  </Field>
                )}
              </>
            ) : meth === "card" ? (
              <>
                <Field label={cur === "UAH" && bank !== "other" ? `${bankName(bank)} card number` : "Card number"} err={tried ? destErr : ""} badge={cardBrand(dest)}>
                  <input value={dest} onChange={(e) => setDest(formatCard(e.target.value))} inputMode="numeric" placeholder="0000 0000 0000 0000" autoComplete="off" />
                </Field>
                <Field label="Recipient full name" err={tried ? holderErr : ""}>
                  <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder={"Olena Koval"} autoComplete="off" />
                </Field>
              </>
            ) : meth === "iban" ? (
              <>
                <Field label="Recipient IBAN" err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ""))} placeholder="DE89 3704 0044 0532 0130 00" autoComplete="off" />
                </Field>
                <Field label="Account holder (as at the bank)" err={tried ? holderErr : ""}>
                  <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Ivan Petrenko" />
                </Field>
              </>
            ) : meth === "wise" ? (
              <>
                <Field label="Wise / Revolut e-mail or @tag" err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="name@mail.com" />
                </Field>
                <Field label="Recipient name" err={tried ? holderErr : ""}>
                  <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Ivan Petrenko" />
                </Field>
              </>
            ) : (
              <>
                <Field label="Pick-up city">
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    {CASH_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Phone or @telegram" err={tried ? destErr : ""}>
                  <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="@username" />
                </Field>
              </>
            )}

            <Field label={`${from} refund address (optional)`} err={refundErr}>
              <input value={refund} onChange={(e) => setRefund(e.target.value)} placeholder="In case the swap fails" spellCheck={false} />
            </Field>
            <Field label="E-mail for status updates (optional)" err={emailErr}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" inputMode="email" />
            </Field>

            <label className={"check" + (tried && !agree ? " bad" : "")}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="check-box" aria-hidden />
              <span>
                I agree to the <Link href="/terms">Terms</Link> and <Link href="/aml">AML/KYC Policy</Link>
              </span>
            </label>

            <button className="btn btn-primary w-go" onClick={submit} disabled={sending}>
              {sending ? "Sending…" : "Create order"}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5L20 7" /></svg>
            </button>
            {tab === "fiat" && <p className="w-foot">Only the operator sees your card number, and only to pay you. We never need your CVV or expiry date — never share them.</p>}
          </div>
        )}
      </div>

      {picker === "from" && <Picker kind="coin" title="You send" value={from} onPick={pickFrom} onClose={closePicker} />}
      {picker === "to" && <Picker kind="coin" title="You get" value={to} onPick={pickTo} onClose={closePicker} />}
      {picker === "cur" && <Picker kind="fiat" title="Payout currency" value={cur} onPick={(c) => { setCur(c); setPicker(null); }} onClose={closePicker} />}
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
    { btc: "bc1q…", evm: "0x…", trx: "T…", sol: "Solana address", ton: "UQ…", xrp: "r…", ltc: "ltc1q…", doge: "D…", xmr: "4…", ada: "addr1…", dot: "1…", xlm: "G…", near: "name.near", apt: "0x…", atom: "cosmos1…", bch: "bitcoincash:q…", ln: "Invoice lnbc… or name@wallet", zec: "t1…" } as Record<string, string>
  )[kind] ?? "Address";
}
