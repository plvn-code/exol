export default function Legal({ kicker, title, intro, sections }: { kicker: string; title: string; intro: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker">{kicker}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap prose">
          {sections.map((s) => (
            <div key={s.h} data-reveal>
              <h2>{s.h}</h2>
              {s.p.map((t) => <p key={t}>{t}</p>)}
            </div>
          ))}
          <p className="dim" style={{ marginTop: 48, fontSize: 13 }}>Template document. The final version is to be approved by a lawyer for the company’s jurisdiction.</p>
        </div>
      </section>
    </>
  );
}
