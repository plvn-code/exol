"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CoinIcon, FiatIcon } from "@/components/Brand";
import { fiat, method } from "@/lib/fiat";
import { amt, money } from "@/lib/format";
import { getOrder, listOrders, saveOrder, type Order } from "@/lib/orders";

const STEPS_CRYPTO = ["Ожидаем депозит", "Подтверждение в сети", "Обмен", "Отправка на ваш адрес", "Готово"];
const STEPS_FIAT = ["Ожидаем депозит", "Подтверждение в сети", "Конвертация в фиат", "Выплата отправлена", "Деньги зачислены"];

function Copy({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className={"copy" + (ok ? " ok" : "")}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        });
      }}
    >
      {ok ? "Скопировано" : "Копировать"}
    </button>
  );
}

export default function OrderView() {
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const [list, setList] = useState<Order[]>([]);
  const [missing, setMissing] = useState("");
  const [now, setNow] = useState(0);
  const [running, setRunning] = useState(false);

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

  // Demo: walk the status timeline once the visitor "sends" the deposit.
  useEffect(() => {
    if (!running || !order || order.step >= 4) return;
    const t = setTimeout(() => {
      const next = { ...order, step: order.step + 1 };
      saveOrder(next);
      setOrder(next);
      if (next.step >= 4) setRunning(false);
    }, order.step === 0 ? 900 : 2200);
    return () => clearTimeout(t);
  }, [running, order]);

  if (!ready) return <div className="empty">Загрузка…</div>;

  if (!order) {
    return (
      <div className="wrap" style={{ maxWidth: 760 }}>
        {missing && (
          <div className="demo-note">
            <span>⚠</span>
            <span>Заявка <b>{missing}</b> не найдена в этом браузере. В демо-режиме заявки хранятся только локально.</span>
          </div>
        )}
        <h2 style={{ fontSize: 24, marginBottom: 20 }}>Мои заявки</h2>
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
                <span className={"st" + (o.step >= 4 ? " ok" : "")}>{o.step >= 4 ? "Завершена" : "В процессе"}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty panel">
            <p style={{ marginBottom: 20 }}>Здесь появятся ваши заявки.</p>
            <Link href="/#swap" className="btn btn-primary">Создать обмен</Link>
          </div>
        )}
      </div>
    );
  }

  const steps = order.kind === "crypto" ? STEPS_CRYPTO : STEPS_FIAT;
  const left = Math.max(0, order.expires - now);
  const mm = String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  const outLabel = order.kind === "crypto" ? `${amt(order.out)} ${order.to}` : money(order.out, fiat(order.to).sign);
  const via = order.kind === "crypto" ? order.toVia : method(order.toVia).name;

  return (
    <div className="wrap">
      <div className="demo-note" data-reveal>
        <span>⚠</span>
        <span>
          <b>Демо-режим.</b> Адрес ниже сгенерирован случайно и никому не принадлежит — не отправляйте на него средства. Нажмите «Симулировать оплату», чтобы увидеть, как меняется статус.
        </span>
      </div>
      <div className="order">
        <div className="panel">
          {order.step === 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ margin: 0 }}>Отправьте депозит</h2>
                {order.mode === "fixed" && <span className="timer">⏱ {mm}:{ss}</span>}
              </div>
              <span className="lbl" style={{ marginTop: 0 }}>Сумма</span>
              <div className="dep-amount">
                <CoinIcon sym={order.from} size={36} />
                {amt(order.amount)} {order.from}
                <Copy text={String(order.amount)} />
              </div>
              <span className="lbl">Адрес · сеть {order.fromNet}</span>
              <div className="dep-addr">
                <span>{order.deposit}</span>
                <Copy text={order.deposit} />
              </div>
              {order.memo && (
                <>
                  <span className="lbl">Memo / Tag — обязательно</span>
                  <div className="dep-addr">
                    <span>{order.memo}</span>
                    <Copy text={order.memo} />
                  </div>
                </>
              )}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 28 }} onClick={() => setRunning(true)} disabled={running}>
                {running ? "Ищем транзакцию…" : "Симулировать оплату"}
              </button>
            </>
          ) : order.step < 4 ? (
            <div className="done-box">
              <div className="done-check" style={{ borderColor: "rgba(34,211,255,.5)", background: "rgba(34,211,255,.1)", color: "var(--cyan)" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "rot 1.2s linear infinite" }}><path d="M21 12a9 9 0 11-6.2-8.6" /></svg>
              </div>
              <h2>{steps[order.step]}</h2>
              <p className="dim">Страницу можно закрыть — статус сохранится по номеру заявки.</p>
            </div>
          ) : (
            <div className="done-box">
              <div className="done-check">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </div>
              <h2>{order.kind === "crypto" ? "Обмен завершён" : "Выплата зачислена"}</h2>
              <p className="dep-amount" style={{ justifyContent: "center", margin: "12px 0 8px" }}>
                {order.kind === "crypto" ? <CoinIcon sym={order.to} size={34} /> : <FiatIcon code={order.to} size={34} />} {outLabel}
              </p>
              <p className="dim">{via}</p>
              <Link href="/#swap" className="btn btn-ghost" style={{ marginTop: 24 }}>Новый обмен</Link>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          <div className="panel">
            <h2>Статус</h2>
            <ol className="tl">
              {steps.map((s, i) => (
                <li key={s} className={i < order.step || order.step === 4 ? "done" : i === order.step ? "now" : ""}>
                  <span className="tl-dot">{i < order.step || order.step === 4 ? "✓" : i + 1}</span>
                  <span>
                    <b>{s}</b>
                    {i === 1 && <small>Сеть {order.fromNet}</small>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="panel">
            <h2>Заявка</h2>
            <dl className="kv">
              <div><dt>Номер</dt><dd className="mono">{order.id}</dd></div>
              <div><dt>Курс</dt><dd>{order.mode === "fixed" ? "Фиксированный" : "Плавающий"}</dd></div>
              <div><dt>Отдаёте</dt><dd className="mono">{amt(order.amount)} {order.from}</dd></div>
              <div><dt>Получаете</dt><dd className="mono">{order.mode === "fixed" ? "" : "≈ "}{outLabel}</dd></div>
              <div><dt>{order.kind === "crypto" ? "Сеть" : "Способ"}</dt><dd>{via}</dd></div>
              <div><dt>Получатель</dt><dd className="mono" style={{ fontSize: 12.5 }}>{order.dest}</dd></div>
              {order.email && <div><dt>E-mail</dt><dd>{order.email}</dd></div>}
              <div><dt>Создана</dt><dd>{new Date(order.created).toLocaleString("ru-RU")}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
