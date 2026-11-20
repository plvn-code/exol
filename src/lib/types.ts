export type Rates = {
  live: boolean;
  updated: number;
  /** USD price per coin symbol. */
  prices: Record<string, number>;
  change: Record<string, number>;
  volume: Record<string, number>;
  spark: Record<string, number[]>;
  /** Units of fiat per 1 USD. */
  fx: Record<string, number>;
};

export type RateMode = "float" | "fixed";
