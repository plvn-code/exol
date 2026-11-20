"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CoinIcon } from "@/components/Brand";
import CopyBtn from "@/components/CopyBtn";
import { fiat, method } from "@/lib/fiat";
import { amt, money } from "@/lib/format";
import { getOrder, listOrders, saveOrder, type Order } from "@/lib/orders";
import { SITE } from "@/lib/site";

export default function OrderView() {
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const [list, setList] = useState<Order[]>([]);
  const [missing, setMissing] = useState("");
  const [now, setNow] = useState(0);
  const [txid, setTxid] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      const o = getOrder(id);
      if (o) setOrder(o);
      else setMissing(id);
    }
    setList(listOrders());
    setNow(Date.now());
    setReady(true);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!ready) return <div className="empty">Loading…</div>;

  if (!order) {
    return (
      <div className="wrap" style={{ maxWidth: 760 }}>
        {missing && (
          <div className="demo-note">
            <span>⚠</span>
            <span>
              Order <b>{missing}</b> was not found in this browser. Message the operator on Telegram{" "}
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">{SITE.telegramHandle}</a> — they will check the status by its number.
            </span>
          </div>
        )}
        <h2 style={{ fontSize: 24, marginBottom: 20 }}>My orders</h2>
        {list.length ? (
          <div className="orders-list">
            {list.map((o) => (
              <Link key={o.id} href={`/order?id=${o.id}`} onClick={() => setOrder(o)}>
                <span className="t-coin">
                  <CoinIcon sym={o.from} size={30} />
                  <span>
                    <b className="mono">{o.id}</b>
                    <small>
                      {amt(o.amount)} {o.from} → {o.kind === "crypto" ? `${amt(o.out)} ${o.to}` : money(o.out, fiat(o.to).sign)}
                    </small>
                  </span>
                </span>
                <span className={"st" + (o.step >= 1 ? " ok" : "")}>{o.step >= 1 ? "Being checked" : "Awaiting payment"}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty panel">
            <p style={{ marginBottom: 20 }}>Your orders will appear here.</p>
            <Link href="/#swap" className="btn btn-primary">Start a swap</Link>
          </div>
        )}
      </div>
    );
  }

  const left = Math.max(0, order.expires - now);
  const mm = String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  const outLabel = order.kind === "crypto" ? `${amt(order.out)} ${order.to}` : money(order.out, fiat(order.to).sign);
  const via = order.kind === "crypto" ? order.toVia : method(order.toVia).name + (order.bank ? ` · ${order.bank}` : "");
  const netShort = order.fromNet.replace(/ \(.+\)/, "");

  const reportPaid = async () => {
    setSending(true);
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event: "paid", id: order.id, amount: amt(order.amount), from: order.from, fromNet: order.fromNet, txid: txid.trim() || undefined, deposit: order.deposit }),
      });
    } catch {
      /* operator still sees the deposit on the wallet */
    }
    const next = { ...order, step: 1, txid: txid.trim() || undefined };
    saveOrder(next);
    setOrder(next);
    setSending(false);
  };

  const steps = [
    { t: "Awaiting payment", d: `${amt(order.amount)} ${order.from} · ${netShort}` },
    { t: "Checking your deposit", d: "Usually 1–5 minutes after network confirmation" },
    { t: order.kind === "crypto" ? "Sending you " + order.to : "Payout to " + (order.bank ? order.bank + " card" : method(order.toVia).short.toLowerCase()), d: outLabel },
  ];

  return (
    <div className="wrap">
      {!order.notified && (
        <div className="demo-note">
          <span>✉</span>
          <span>
            To speed up your payout, message the operator on Telegram{" "}
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer"><b>{SITE.telegramHandle}</b></a> with order number <b className="mono">{order.id}</b>
            {order.kind === "fiat" ? " and the card number for the payout." : "."}
          </span>
        </div>
      )}
      <div className="order">
        <div className="panel">
          {order.step === 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ margin: 0 }}>Send {order.from}</h2>
                {order.mode === "fixed" && <span className="timer">⏱ {mm}:{ss}</span>}
              </div>
              <span className="lbl" style={{ marginTop: 0 }}>Amount</span>
              <div className="dep-amount">
                <CoinIcon sym={order.from} size={36} />
                {amt(order.amount)} {order.from}
                <CopyBtn text={String(order.amount)} />
              </div>
              {order.deposit ? (
                <>
                  <span className="lbl">Deposit address · {order.fromNet} network</span>
                  <div className="dep-addr">
                    <span>{order.deposit}</span>
                    <CopyBtn text={order.deposit} />
                  </div>
                  {order.memo && (
                    <>
                      <span className="lbl">Memo / Tag — required</span>
                      <div className="dep-addr">
                        <span>{order.memo}</span>
                        <CopyBtn text={order.memo} />
                      </div>
                    </>
                  )}
                  <p className="warn-line">
                    Send only <b>{order.from}</b> on the <b>{netShort}</b> network. Coins sent on any other network will be lost.
                  </p>
                  <label className="field" style={{ marginTop: 22 }}>
                    <span className="field-label">Transaction hash (TxID) — optional</span>
                    <input value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="Speeds up the check" spellCheck={false} />
                  </label>
                  <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={reportPaid} disabled={sending}>
                    {sending ? "Sending…" : "I’ve sent it"}
                  </button>
                </>
              ) : (
                <div className="demo-note" style={{ marginTop: 22, marginBottom: 0 }}>
                  <span>ℹ</span>
                  <span>
                    The operator provides the {order.from} ({order.fromNet}) deposit address. Message us on Telegram{" "}
                    <a href={SITE.telegram} target="_blank" rel="noopener noreferrer"><b>{SITE.telegramHandle}</b></a> with order number <b className="mono">{order.id}</b>.
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="done-box">
              <div className="done-check" style={{ borderColor: "rgba(34,211,255,.5)", background: "rgba(34,211,255,.1)", color: "var(--cyan)" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "rot 1.2s linear infinite" }}><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
              </div>
              <h2>Checking your deposit</h2>
              <p className="dim" style={{ maxWidth: 380, margin: "8px auto 0" }}>
                As soon as {amt(order.amount)} {order.from} reaches our wallet, the operator will send {outLabel} — {via}.
              </p>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: 24 }}>
                Message the operator
              </a>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          <div className="panel">
            <h2>Status</h2>
            <ol className="tl">
              {steps.map((s, i) => (
                <li key={s.t} className={i < order.step ? "done" : i === order.step ? "now" : ""}>
                  <span className="tl-dot">{i < order.step ? "✓" : i + 1}</span>
                  <span>
                    <b>{s.t}</b>
                    <small>{s.d}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="panel">
            <h2>Order</h2>
            <dl className="kv">
              <div><dt>Number</dt><dd className="mono">{order.id}</dd></div>
              <div><dt>Rate</dt><dd>{order.mode === "fixed" ? "Fixed" : "Floating"}</dd></div>
              <div><dt>You send</dt><dd className="mono">{amt(order.amount)} {order.from}</dd></div>
              <div><dt>You get</dt><dd className="mono">{order.mode === "fixed" ? "" : "≈ "}{outLabel}</dd></div>
              <div><dt>{order.kind === "crypto" ? "Network" : "Method"}</dt><dd>{via}</dd></div>
              <div><dt>Recipient</dt><dd className="mono" style={{ fontSize: 12.5 }}>{order.dest}</dd></div>
              {order.txid && <div><dt>TxID</dt><dd className="mono" style={{ fontSize: 12 }}>{order.txid}</dd></div>}
              {order.email && <div><dt>E-mail</dt><dd>{order.email}</dd></div>}
              <div><dt>Created</dt><dd>{new Date(order.created).toLocaleString("en-GB")}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
