import type { Listing } from '@/lib/api';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(value?: number) {
  if (!value) return 'Prijs op aanvraag';
  return `€ ${value.toLocaleString('nl-NL')}`;
}

function formatSqm(value?: number) {
  if (!value) return 'Onbekend';
  return `${value.toLocaleString('nl-NL')} m²`;
}

function getSpecsLines(listing: Listing): string[] {
  const specs = listing.specs;
  if (!specs) return [];

  const volume = specs.maxVolume || specs.volume;
  const height = specs.maxHeight || specs.nokhoogte;
  const gutter = specs.gutterHeight || specs.goothoogte;
  const roofType = specs.roofType;

  const lines = [];
  if (volume) lines.push(`Max. bouwvolume: ${escapeHtml(String(volume))}`);
  if (height) lines.push(`Max. hoogte: ${escapeHtml(String(height))}`);
  if (gutter) lines.push(`Max. goothoogte: ${escapeHtml(String(gutter))}`);
  if (roofType) lines.push(`Daktype: ${escapeHtml(String(roofType))}`);
  if (specs.regulations) lines.push(`Bouwregels: ${escapeHtml(String(specs.regulations))}`);

  return lines;
}

export function buildKavelArchitectSummary(listing: Listing) {
  const adres = escapeHtml(listing.adres);
  const plaats = escapeHtml(listing.plaats);
  const prijs = formatCurrency(listing.prijs);
  return `Bouwkavel ${adres} in ${plaats} (${prijs}). Laat een KavelRapport maken voor zekerheid over bouwmogelijkheden en risico's.`;
}

export function buildKavelArchitectArticle(listing: Listing) {
  const adres = escapeHtml(listing.adres);
  const plaats = escapeHtml(listing.plaats);
  const provincie = escapeHtml(listing.provincie);
  const prijs = formatCurrency(listing.prijs);
  const oppervlakte = formatSqm(listing.oppervlakte);
  const specsLines = getSpecsLines(listing);

  const specsHtml = specsLines.length
    ? `<ul>${specsLines.map((line) => `<li>${line}</li>`).join('')}</ul>`
    : `<p>De exacte bouwmogelijkheden hangen af van het bestemmingsplan en de welstand. Het KavelRapport geeft hier snel helderheid over.</p>`;

  return `
    <p><strong>${adres}, ${plaats}</strong> is een bouwkavel in ${provincie} met een perceeloppervlak van circa ${oppervlakte}. De vraagprijs is ${prijs}.</p>
    <h3>Locatie en kenmerken</h3>
    <ul>
      <li>Adres: ${adres}, ${plaats}</li>
      <li>Provincie: ${provincie}</li>
      <li>Oppervlakte: ${oppervlakte}</li>
      <li>Vraagprijs: ${prijs}</li>
    </ul>
    <h3>Wat mag u hier bouwen?</h3>
    ${specsHtml}
    <h3>KavelRapport: zekerheid voor aankoop</h3>
    <p>Een kavel kopen zonder heldere analyse is risicovol. Met het KavelRapport krijgt u inzicht in bouwmogelijkheden, beperkingen en risico's voordat u een bod doet.</p>
    <p><a href="https://kavelarchitect.nl/kavelrapport">Bekijk het KavelRapport</a> of start direct een intake voor deze kavel.</p>
    <h3>Volgende stap</h3>
    <p>Wilt u zeker weten wat hier kan? Laat een KavelRapport opstellen en beslis met vertrouwen.</p>
  `.trim();
}

export function buildZwijsenArticle(listing: Listing) {
  const adres = escapeHtml(listing.adres);
  const plaats = escapeHtml(listing.plaats);
  const provincie = escapeHtml(listing.provincie);
  const prijs = formatCurrency(listing.prijs);
  const oppervlakte = formatSqm(listing.oppervlakte);
  const specsLines = getSpecsLines(listing);

  const specsHtml = specsLines.length
    ? `<ul>${specsLines.map((line) => `<li>${line}</li>`).join('')}</ul>`
    : `<p>Het bestemmingsplan en de welstand bepalen de exacte bouwmogelijkheden. Wij vertalen dit naar een concreet ontwerp en haalbaar plan.</p>`;

  return `
    <h2>Architect Jules Zwijsen begeleidt u van kavel tot droomhuis</h2>
    <p>Een bouwkavel kopen in ${plaats} klinkt als een droom, maar is vaak complex. Als ervaren architect begeleid ik u persoonlijk van de eerste schets tot vergunning en realisatie.</p>
    <h3>De bouwkavel ${adres}: locatie en mogelijkheden</h3>
    <p>Deze kavel ligt in ${plaats}, ${provincie}, met een perceel van circa ${oppervlakte}. De vraagprijs is ${prijs}. Een ideale basis voor een vrijstaande woning met maximale privacy en woonkwaliteit.</p>
    <h3>Wat kunt u bouwen?</h3>
    ${specsHtml}
    <h3>Persoonlijke begeleiding door Architectenbureau Zwijsen</h3>
    <p>Ik help u met haalbaarheid, ontwerp en vergunningen. Geen standaard traject, maar maatwerk met focus op kwaliteit, esthetiek en bouwmogelijkheden.</p>
    <p><a href="https://www.zwijsen.net/contact" target="_blank" rel="noopener noreferrer">Neem contact op voor een vrijblijvend gesprek</a> en ontdek wat er mogelijk is op deze kavel.</p>
  `.trim();
}
