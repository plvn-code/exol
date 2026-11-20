import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf">
      <div>
        <b className="grad">404</b>
        <p>This page doesn’t exist — but the exchange is right here.</p>
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
