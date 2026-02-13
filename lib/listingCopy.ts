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
    : `<p>De exacte bouwmogelijkheden worden bepaald door het bestemmingsplan, het bouwvlak en eventuele welstandseisen van de gemeente. Een check vooraf voorkomt verrassingen.</p>`;

  return `
    <h2>Bouwkavel ${adres}, ${plaats}</h2>
    <p>Dit perceel in ${plaats} (${provincie}) heeft een oppervlak van circa ${oppervlakte}. De vraagprijs is ${prijs}.</p>
    <h3>Bouwmogelijkheden</h3>
    ${specsHtml}
    <h3>Van kavel naar ontwerp</h3>
    <p>Elke kavel stelt zijn eigen eisen: de verhouding tussen bouwvlak en perceel, de oriëntatie op de zon, de relatie met de straat en de buren. Dat vraagt om een ontwerp dat niet alleen voldoet aan de regels, maar ook past bij de plek.</p>
    <p>Als u nadenkt over wat hier mogelijk is, kunt u <a href="https://www.zwijsen.net/contact" target="_blank" rel="noopener noreferrer">vrijblijvend afstemmen</a> over de uitgangspunten.</p>
  `.trim();
}
