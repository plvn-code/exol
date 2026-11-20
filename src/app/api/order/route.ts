/**
 * Receives orders from the widget and forwards them to the operator's Telegram.
 * Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (.env.local / Vercel env). Without them it answers
 * { delivered: false } and the order page asks the client to message the operator manually.
 * The full card number exists only in this request and the Telegram message — the site stores nothing.
 */

export const dynamic = "force-dynamic";

type Payload = Record<string, unknown>;

const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 12;
}

const esc = (v: unknown) =>
  String(v ?? "")
    .slice(0, 300)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function render(p: Payload): string {
  if (p.event === "paid") {
    return [
      `💸 <b>Клиент отметил оплату</b> · <code>${esc(p.id)}</code>`,
      `Сумма: <b>${esc(p.amount)} ${esc(p.from)}</b> (${esc(p.fromNet)})`,
      p.txid ? `TxID: <code>${esc(p.txid)}</code>` : "TxID не указан",
      p.deposit ? `Кошелёк: <code>${esc(p.deposit)}</code>` : "",
    ].filter(Boolean).join("\n");
  }
  const lines = [
    `🆕 <b>Новая заявка</b> · <code>${esc(p.id)}</code>`,
    `${p.kind === "fiat" ? "Вывод в фиат" : "Крипто ⇄ крипто"} · курс ${p.mode === "fixed" ? "фиксированный" : "плавающий"}`,
    ``,
    `Отдаёт: <b>${esc(p.amount)} ${esc(p.from)}</b> (${esc(p.fromNet)})`,
    `Получает: <b>${esc(p.out)} ${esc(p.to)}</b> · ${esc(p.via)}`,
    `Курс: 1 ${esc(p.from)} = ${esc(p.rate)} ${esc(p.to)}`,
  ];
  if (p.kind === "fiat") {
    if (p.bank) lines.push(`Банк: <b>${esc(p.bank)}</b>`);
    if (p.card) lines.push(`Карта: <code>${esc(p.card)}</code>`);
    if (p.iban) lines.push(`IBAN: <code>${esc(p.iban)}</code>`);
    if (p.account) lines.push(`Счёт: <code>${esc(p.account)}</code>`);
    if (p.city) lines.push(`Город: ${esc(p.city)}`);
    if (p.contact) lines.push(`Контакт: ${esc(p.contact)}`);
    if (p.holder) lines.push(`Получатель: ${esc(p.holder)}`);
  } else {
    lines.push(`Адрес клиента: <code>${esc(p.address)}</code>`);
    if (p.memo) lines.push(`Memo: <code>${esc(p.memo)}</code>`);
  }
  lines.push(p.deposit ? `Депозит на: <code>${esc(p.deposit)}</code>` : `⚠️ Кошелёк для ${esc(p.from)} (${esc(p.fromNet)}) не настроен — выдать адрес вручную`);
  if (p.refund) lines.push(`Возврат: <code>${esc(p.refund)}</code>`);
  if (p.email) lines.push(`E-mail: ${esc(p.email)}`);
  return lines.join("\n");
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ delivered: false, error: "rate" }, { status: 429 });

  let p: Payload;
  try {
    const raw = await req.text();
    if (raw.length > 4000) return Response.json({ delivered: false }, { status: 413 });
    p = JSON.parse(raw) as Payload;
  } catch {
    return Response.json({ delivered: false }, { status: 400 });
  }
  if (typeof p.id !== "string" || !/^EX-[A-Z0-9]{6}$/.test(p.id)) return Response.json({ delivered: false }, { status: 400 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return Response.json({ delivered: false, error: "not-configured" });

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: render(p), parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    return Response.json({ delivered: res.ok });
  } catch {
    return Response.json({ delivered: false });
  }
}
