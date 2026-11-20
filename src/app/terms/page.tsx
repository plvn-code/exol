import type { Metadata } from "next";
import Legal from "@/components/Legal";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Page() {
  return (
    <Legal
      kicker="Legal"
      title="Terms of Use"
      intro="By creating an order you agree to these terms."
      sections={[
        { h: "1. The service", p: ["Exol Swap is an instant exchange service for digital assets and payouts of their equivalent in fiat currency. The service does not hold user funds: each order is executed separately."] },
        { h: "2. Rates", p: ["A floating rate is set once the deposit reaches the required number of confirmations. A fixed rate is valid for 30 minutes from order creation; if the deposit arrives later or in a different amount, the order is recalculated at the current rate."] },
        { h: "3. Fees", p: ["The service fee is included in the rate and shown in the calculator before you create an order. The payout network fee is deducted from the payout amount."] },
        { h: "4. Your responsibility", p: ["You are responsible for entering the correct address, network, memo/tag and payment details. Funds sent on an unsupported network or without a required memo are returned on request to support, where technically possible."] },
        { h: "5. Refunds", p: ["If a swap cannot be completed, funds are returned to the refund address or the sender address minus the network fee."] },
      ]}
    />
  );
}
