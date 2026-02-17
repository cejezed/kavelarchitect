export function GuideToc({ items }: { items: { id: string; label: string }[] }) {
  if (!items?.length) return null;

  return (
    <nav className="guide-toc" aria-label="Inhoudsopgave">
      <div className="guide-toc-title">Inhoud</div>
      <ul className="guide-toc-list">
        {items.map((it) => (
          <li key={it.id} className="guide-toc-item">
            <a href={`#${it.id}`} className="guide-toc-link">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
