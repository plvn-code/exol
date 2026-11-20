import type { Metadata } from "next";
import Legal from "@/components/Legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <Legal
      kicker="Legal"
      title="Privacy"
      intro="We collect only the data needed to complete your order."
      sections={[
        { h: "What we keep", p: ["Order number, addresses and transaction hashes, amount and rate. Your e-mail, if you entered one, for status updates. The card number and recipient name go to the operator only to make the payout; the site keeps just the last 4 digits."] },
        { h: "What we never keep", p: ["CVV codes, card expiry dates, passwords and seed phrases — we never ask for them. If anyone asks for them on behalf of Exol Swap, it is a scam."] },
        { h: "Retention", p: ["Order data is kept for as long as the AML laws of the company’s jurisdiction require, then deleted."] },
        { h: "Cookies", p: ["The site uses no advertising or analytics cookies. Your list of orders is stored in your browser’s local storage and is not shared with third parties."] },
      ]}
    />
  );
}
