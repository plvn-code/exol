import type { Metadata } from "next";
import OrderView from "./OrderView";

export const metadata: Metadata = { title: "Статус заявки", robots: { index: false } };

export default function OrderPage() {
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <span className="kicker">Заявка</span>
          <h1>Статус <span className="grad">обмена</span></h1>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 40 }}>
        <OrderView />
      </section>
    </>
  );
}
