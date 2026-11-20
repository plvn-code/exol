import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import Effects from "@/components/Effects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getRates } from "@/lib/rates";
import { SITE } from "@/lib/site";
import { RatesProvider } from "@/lib/useRates";

const display = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--f-display" });
const body = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--f-body" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--f-mono" });

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Exol Swap — обмен криптовалют и вывод на карту", template: "%s — Exol Swap" },
  description: "Мгновенный обмен 30 криптовалют без регистрации и вывод в фиат на карту Visa/Mastercard, IBAN, Wise или наличными. Фиксированный и плавающий курс.",
  openGraph: { title: "Exol Swap", description: "Обмен криптовалют и вывод на карту", type: "website", locale: "ru_RU" },
};

export const viewport: Viewport = { themeColor: "#05070d", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rates = await getRates();
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
