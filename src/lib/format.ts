/** Crypto amount with precision that adapts to magnitude. */
export function amt(n: number, max = 8): string {
  if (!isFinite(n) || n === 0) return "0";
  const a = Math.abs(n);
  const d = a >= 1000 ? 2 : a >= 1 ? 4 : a >= 0.01 ? 6 : max;
  return n.toLocaleString("ru-RU", { maximumFractionDigits: d, minimumFractionDigits: 0 }).replace(/ /g, " ");
}

export function usd(n: number): string {
  const a = Math.abs(n);
  const d = a >= 1 ? 2 : a >= 0.01 ? 4 : 8;
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: a >= 1 ? 2 : 0 });
}

export function money(n: number, sign: string): string {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).replace(/ /g, " ") + " " + sign;
}

export function compact(n: number): string {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + " млрд";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + " млн";
  return usd(n);
}

export function pct(n: number): string {
  return (n > 0 ? "+" : "") + n.toFixed(2) + "%";
}

/** Parse a user-typed number: accepts comma or dot, ignores spaces. */
export function parseNum(s: string): number {
  const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return isFinite(n) ? n : 0;
}
