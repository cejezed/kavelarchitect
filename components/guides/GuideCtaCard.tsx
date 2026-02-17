type Cta = {
  title: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  note?: string;
};

export function GuideCtaCard({ cta }: { cta: Cta }) {
  return (
    <section className="guide-cta" aria-label="Call to action">
      <div className="guide-cta-title">{cta.title}</div>
      <p className="guide-cta-body">{cta.body}</p>

      <a className="guide-cta-button" href={cta.buttonHref}>
        {cta.buttonLabel}
      </a>

      {cta.note ? <div className="guide-cta-note">{cta.note}</div> : null}
    </section>
  );
}
