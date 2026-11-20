import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import Effects from "@/components/Effects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getRates } from "@/lib/rates";
import { SITE } from "@/lib/site";
import { RatesProvider } from "@/lib/useRates";

const display = Unbounded({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-display" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--f-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-mono" });

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Exol Swap — swap crypto and cash out to your card", template: "%s — Exol Swap" },
  description: "Instant swaps between 30 cryptocurrencies with no sign-up, and fiat payouts to Visa/Mastercard cards, IBAN, Wise or cash. Fixed and floating rates.",
  openGraph: { title: "Exol Swap", description: "Swap crypto and cash out to your card", type: "website", locale: "en_US" },
};

export const viewport: Viewport = { themeColor: "#05070d", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rates = await getRates();
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <RatesProvider initial={rates}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Effects />
        </RatesProvider>
      </body>
    </html>
  );
}
