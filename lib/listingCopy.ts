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
  return `Bouwkavel ${adres} in ${plaats} (${prijs}). Een korte kavelanalyse helpt om bouwmogelijkheden, beperkingen en risico's helder te krijgen.`;
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
    <h3>Helderheid vooraf</h3>
    <p>Bij bouwkavels zit de echte winst in duidelijkheid: wat mag er, wat kost het en welke beperkingen spelen mee? Met een korte analyse voorkomt u verrassingen en weet u sneller of de kavel past bij uw wensen.</p>
    <p><a href="https://kavelarchitect.nl/kavelrapport">Lees meer over het KavelRapport</a> of vraag vrijblijvend een intake aan.</p>
    <h3>Vervolg</h3>
    <p>Wilt u zekerheid voordat u verder gaat? Dan is een onafhankelijke kavelanalyse een logische volgende stap.</p>
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
    <h2>Architectenbureau Zwijsen en deze kavel</h2>
    <p>Een bouwkavel in ${plaats} vraagt om een zorgvuldige vertaling van regels naar een passend ontwerp. Wij helpen bij het verkennen van mogelijkheden, zodat keuzes onderbouwd zijn en passen bij de omgeving.</p>
    <h3>De bouwkavel ${adres}</h3>
    <p>Deze kavel ligt in ${plaats}, ${provincie}, met een perceel van circa ${oppervlakte}. De vraagprijs is ${prijs}. Een rustige basis voor een woning met kwaliteit en aandacht voor context.</p>
    <h3>Wat kunt u bouwen?</h3>
    ${specsHtml}
    <h3>Onze rol</h3>
    <p>We denken mee over haalbaarheid, ruimtelijke kwaliteit en vergunningstraject. Zonder grote woorden; wel met aandacht voor ontwerp, regelgeving en een realistische route naar uitvoering.</p>
    <p><a href="https://www.zwijsen.net/contact" target="_blank" rel="noopener noreferrer">Neem contact op</a> als u wilt afstemmen wat er op deze plek mogelijk is.</p>
  `.trim();
}
