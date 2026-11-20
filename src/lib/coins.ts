/** Coins Exol Swap lists. `cg` is the CoinGecko id used for live prices; `price`/`change` is a fallback snapshot (2026-11-20). */

export type Network = {
  id: string;
  name: string;
  /** Network fee charged on the payout, in USD equivalent. */
  feeUsd: number;
  confirms: number;
  /** Address family for the demo deposit address. */
  addr: AddrKind;
  memo?: boolean;
};

export type AddrKind = "btc" | "evm" | "trx" | "sol" | "ton" | "xrp" | "doge" | "ltc" | "xmr" | "ada" | "dot" | "xlm" | "near" | "apt" | "atom" | "bch" | "ln" | "zec";

export type Coin = {
  sym: string;
  name: string;
  cg: string;
  color: string;
  glyph: string;
  networks: Network[];
  price: number;
  change: number;
  popular?: boolean;
  stable?: boolean;
};

const ERC20: Network = { id: "erc20", name: "Ethereum (ERC-20)", feeUsd: 2.5, confirms: 12, addr: "evm" };
const BEP20: Network = { id: "bep20", name: "BNB Smart Chain (BEP-20)", feeUsd: 0.2, confirms: 15, addr: "evm" };
const TRC20: Network = { id: "trc20", name: "Tron (TRC-20)", feeUsd: 1, confirms: 20, addr: "trx" };
const SOL: Network = { id: "sol", name: "Solana", feeUsd: 0.05, confirms: 1, addr: "sol" };
const TON: Network = { id: "ton", name: "TON", feeUsd: 0.05, confirms: 1, addr: "ton", memo: true };
const ARB: Network = { id: "arb", name: "Arbitrum One", feeUsd: 0.15, confirms: 20, addr: "evm" };
const BASE: Network = { id: "base", name: "Base", feeUsd: 0.1, confirms: 20, addr: "evm" };
const POLY: Network = { id: "polygon", name: "Polygon PoS", feeUsd: 0.05, confirms: 64, addr: "evm" };
const OP: Network = { id: "op", name: "Optimism", feeUsd: 0.1, confirms: 20, addr: "evm" };

const net = (id: string, name: string, feeUsd: number, confirms: number, addr: AddrKind, memo?: boolean): Network => ({ id, name, feeUsd, confirms, addr, memo });

export const COINS: Coin[] = [
  { sym: "BTC", name: "Bitcoin", cg: "bitcoin", color: "#f7931a", glyph: "₿", popular: true, price: 58244, change: -7.18,
    networks: [net("btc", "Bitcoin", 1.5, 2, "btc"), net("ln", "Lightning", 0.05, 1, "ln")] },
  { sym: "ETH", name: "Ethereum", cg: "ethereum", color: "#8c9eff", glyph: "Ξ", popular: true, price: 1611.97, change: -9.2,
    networks: [{ ...ERC20, name: "Ethereum" }, ARB, BASE, OP] },
  { sym: "USDT", name: "Tether", cg: "tether", color: "#26a17b", glyph: "₮", popular: true, stable: true, price: 0.999, change: -0.02,
    networks: [TRC20, ERC20, BEP20, TON, SOL, ARB, POLY] },
  { sym: "USDC", name: "USD Coin", cg: "usd-coin", color: "#2775ca", glyph: "$", popular: true, stable: true, price: 0.9996, change: 0.01,
    networks: [ERC20, SOL, BASE, ARB, POLY, BEP20] },
  { sym: "SOL", name: "Solana", cg: "solana", color: "#14f195", glyph: "◎", popular: true, price: 68.73, change: -6.96, networks: [SOL] },
  { sym: "TON", name: "Toncoin", cg: "the-open-network", color: "#0098ea", glyph: "◆", popular: true, price: 0.9719, change: -5.51, networks: [TON] },
  { sym: "BNB", name: "BNB", cg: "binancecoin", color: "#f3ba2f", glyph: "◈", price: 537.7, change: -8.22, networks: [{ ...BEP20, name: "BNB Smart Chain" }] },
  { sym: "XRP", name: "XRP", cg: "ripple", color: "#9aa6b8", glyph: "✕", popular: true, price: 0.9041, change: -6.97, networks: [net("xrp", "XRP Ledger", 0.02, 1, "xrp", true)] },
  { sym: "TRX", name: "TRON", cg: "tron", color: "#ff0013", glyph: "▼", price: 0.3015, change: -2.84, networks: [{ ...TRC20, name: "Tron" }] },
  { sym: "LTC", name: "Litecoin", cg: "litecoin", color: "#bfbbbb", glyph: "Ł", popular: true, price: 40.09, change: -6.6, networks: [net("ltc", "Litecoin", 0.05, 6, "ltc")] },
  { sym: "XMR", name: "Monero", cg: "monero", color: "#ff6600", glyph: "ɱ", popular: true, price: 447.99, change: -9.16, networks: [net("xmr", "Monero", 0.1, 10, "xmr")] },
  { sym: "DOGE", name: "Dogecoin", cg: "dogecoin", color: "#c2a633", glyph: "Ð", price: 0.05375, change: -8.46, networks: [net("doge", "Dogecoin", 0.1, 20, "doge")] },
  { sym: "ADA", name: "Cardano", cg: "cardano", color: "#3468d1", glyph: "₳", price: 0.1403, change: -8.41, networks: [net("ada", "Cardano", 0.2, 15, "ada")] },
  { sym: "DOT", name: "Polkadot", cg: "polkadot", color: "#e6007a", glyph: "●", price: 0.6634, change: -7.75, networks: [net("dot", "Polkadot", 0.1, 1, "dot")] },
  { sym: "AVAX", name: "Avalanche", cg: "avalanche-2", color: "#e84142", glyph: "▲", price: 6.53, change: -7.29, networks: [net("avaxc", "Avalanche C-Chain", 0.1, 1, "evm")] },
  { sym: "LINK", name: "Chainlink", cg: "chainlink", color: "#2a5ada", glyph: "⬡", price: 8.39, change: -7.31, networks: [ERC20, BEP20, ARB] },
  { sym: "BCH", name: "Bitcoin Cash", cg: "bitcoin-cash", color: "#8dc351", glyph: "Ƀ", price: 191.49, change: -7.69, networks: [net("bch", "Bitcoin Cash", 0.02, 6, "bch")] },
  { sym: "XLM", name: "Stellar", cg: "stellar", color: "#7d8ca3", glyph: "✦", price: 0.127, change: -5.0, networks: [net("xlm", "Stellar", 0.01, 1, "xlm", true)] },
  { sym: "ZEC", name: "Zcash", cg: "zcash", color: "#ecb244", glyph: "ⓩ", price: 769.29, change: -15.45, networks: [net("zec", "Zcash (t-адрес)", 0.05, 10, "zec")] },
  { sym: "NEAR", name: "NEAR Protocol", cg: "near", color: "#00ec97", glyph: "Ⓝ", price: 2.85, change: -13.06, networks: [net("near", "NEAR", 0.02, 1, "near")] },
  { sym: "SUI", name: "Sui", cg: "sui", color: "#4da2ff", glyph: "∿", price: 0.649, change: -9.42, networks: [net("sui", "Sui", 0.02, 1, "apt")] },
  { sym: "APT", name: "Aptos", cg: "aptos", color: "#2ed8a7", glyph: "≋", price: 0.3712, change: -10.88, networks: [net("apt", "Aptos", 0.02, 1, "apt")] },
  { sym: "ARB", name: "Arbitrum", cg: "arbitrum", color: "#28a0f0", glyph: "◭", price: 0.1128, change: -9.22, networks: [ARB, ERC20] },
  { sym: "POL", name: "Polygon", cg: "polygon-ecosystem-token", color: "#8247e5", glyph: "⬢", price: 0.07457, change: -7.78, networks: [POLY, ERC20] },
  { sym: "UNI", name: "Uniswap", cg: "uniswap", color: "#ff007a", glyph: "U", price: 4.42, change: -11.61, networks: [ERC20, ARB, BASE] },
  { sym: "ATOM", name: "Cosmos", cg: "cosmos", color: "#6f7390", glyph: "⚛", price: 1.22, change: -4.45, networks: [net("atom", "Cosmos Hub", 0.02, 1, "atom", true)] },
  { sym: "ETC", name: "Ethereum Classic", cg: "ethereum-classic", color: "#34d07f", glyph: "ξ", price: 5.42, change: -6.6, networks: [net("etc", "Ethereum Classic", 0.05, 40, "evm")] },
  { sym: "DAI", name: "Dai", cg: "dai", color: "#f5ac37", glyph: "◇", stable: true, price: 1, change: 0.01, networks: [ERC20, ARB, BASE, OP, POLY] },
  { sym: "SHIB", name: "Shiba Inu", cg: "shiba-inu", color: "#ffa409", glyph: "犬", price: 0.00000354, change: -7.33, networks: [ERC20, BEP20] },
  { sym: "PEPE", name: "Pepe", cg: "pepe", color: "#3d9a3b", glyph: "P", price: 0.00000344, change: -8.46, networks: [ERC20, BEP20, ARB] },
];

export const COIN_BY_SYM: Record<string, Coin> = Object.fromEntries(COINS.map((c) => [c.sym, c]));

export const coin = (sym: string): Coin => COIN_BY_SYM[sym] ?? COINS[0];
