import type { Metadata } from "next";
import Legal from "@/components/Legal";

export const metadata: Metadata = { title: "AML / KYC Policy" };

export default function Page() {
  return (
    <Legal
      kicker="Compliance"
      title="AML / KYC Policy"
      intro="How Exol Swap screens transactions and when we may ask you to verify your identity."
      sections={[
        { h: "Why we screen", p: ["We must prevent money laundering, terrorist financing and sanctions evasion. Every incoming transaction is automatically checked by an AML scanner against public databases of high-risk addresses."] },
        { h: "When verification is required", p: ["A transaction gets a high risk score (links to darknet markets, mixers, hacks or sanctioned addresses).", "Fiat payouts exceed $10,000 per day or $15,000 in a single IBAN transfer.", "Cash pick-up — ID is checked when you meet the cashier."] },
        { h: "How the check works", p: ["A compliance specialist contacts you by the e-mail or Telegram in your order. An ID document and a short explanation of where the funds came from are usually enough. It takes up to 30 minutes during business hours."] },
        { h: "If the check is not passed", p: ["Funds are returned to the sender address minus the network fee, unless this is prohibited by law or by an order of a competent authority."] },
        { h: "Restricted countries", p: ["The service is not available to residents of, or persons in, jurisdictions under comprehensive sanctions. The list is kept up to date by the company’s lawyer."] },
      ]}
    />
  );
}
