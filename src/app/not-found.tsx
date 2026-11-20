import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf">
      <div>
        <b className="grad">404</b>
        <p>Такой страницы нет — но обменник на месте.</p>
        <Link href="/" className="btn btn-primary">На главную</Link>
      </div>
    </section>
  );
}
