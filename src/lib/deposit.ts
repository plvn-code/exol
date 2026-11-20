/**
 * Real deposit wallets of the exchange, per coin + network ("SYM:networkId").
 * Only pairs listed here show an address to the client; for everything else the
 * operator sends the address manually in Telegram.
 * Change an address only after checking its checksum — a typo loses client funds.
 */
export const DEPOSITS: Record<string, { address: string; memo?: string }> = {
  "USDT:trc20": { address: "TKxMJT4iQWfTfhyKwvx7d1xQwXyhaQs5E3" },
};

export const depositFor = (sym: string, net: string) => DEPOSITS[`${sym}:${net}`];
