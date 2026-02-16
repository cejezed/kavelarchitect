/**
 * Eenmalig script: regenereert _ka en _zw teksten voor alle gepubliceerde listings.
 * Draai met: node scripts/regenerate-copy.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ymwwydpywichbotrqwsy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('Zet SUPABASE_SERVICE_ROLE_KEY als environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Copy templates (mirror of lib/listingCopy.ts) ---

function esc(v) { return (v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function price(v) { return v ? `€ ${v.toLocaleString('nl-NL')}` : 'Prijs op aanvraag'; }
function sqm(v) { return v ? `${v.toLocaleString('nl-NL')} m²` : 'Onbekend'; }

function specsLines(listing) {
  const s = listing.specs || {};
  const lines = [];
  const vol = s.maxVolume || s.volume;
  const h = s.maxHeight || s.nokhoogte;
  const g = s.gutterHeight || s.goothoogte;
  if (vol) lines.push(`Max. bouwvolume: ${esc(String(vol))}`);
  if (h) lines.push(`Max. hoogte: ${esc(String(h))}`);
  if (g) lines.push(`Max. goothoogte: ${esc(String(g))}`);
  if (s.roofType) lines.push(`Daktype: ${esc(String(s.roofType))}`);
  if (s.regulations) lines.push(`Bouwregels: ${esc(String(s.regulations))}`);
  return lines;
}

function buildKaSummary(l) {
  return `Bouwkavel ${esc(l.adres)} in ${esc(l.plaats)} (${price(l.prijs)}). Een korte kavelanalyse helpt om bouwmogelijkheden, beperkingen en risico's helder te krijgen.`;
}

function buildKaArticle(l) {
  const adres = esc(l.adres), plaats = esc(l.plaats), prov = esc(l.provincie);
  const sl = specsLines(l);
  const specsHtml = sl.length
    ? `<ul>${sl.map(x=>`<li>${x}</li>`).join('')}</ul>`
    : `<p>De exacte bouwmogelijkheden hangen af van het bestemmingsplan en de welstand. Het KavelRapport geeft hier snel helderheid over.</p>`;
  return `
    <p><strong>${adres}, ${plaats}</strong> is een bouwkavel in ${prov} met een perceeloppervlak van circa ${sqm(l.oppervlakte)}. De vraagprijs is ${price(l.prijs)}.</p>
    <h3>Locatie en kenmerken</h3>
    <ul>
      <li>Adres: ${adres}, ${plaats}</li>
      <li>Provincie: ${prov}</li>
      <li>Oppervlakte: ${sqm(l.oppervlakte)}</li>
      <li>Vraagprijs: ${price(l.prijs)}</li>
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

function buildZwArticle(l) {
  const adres = esc(l.adres), plaats = esc(l.plaats), prov = esc(l.provincie);
  const sl = specsLines(l);
  const specsHtml = sl.length
    ? `<ul>${sl.map(x=>`<li>${x}</li>`).join('')}</ul>`
    : `<p>De exacte bouwmogelijkheden worden bepaald door het bestemmingsplan, het bouwvlak en eventuele welstandseisen van de gemeente. Een check vooraf voorkomt verrassingen.</p>`;
  return `
    <h2>Bouwkavel ${adres}, ${plaats}</h2>
    <p>Dit perceel in ${plaats} (${prov}) heeft een oppervlak van circa ${sqm(l.oppervlakte)}. De vraagprijs is ${price(l.prijs)}.</p>
    <h3>Bouwmogelijkheden</h3>
    ${specsHtml}
    <h3>Van kavel naar ontwerp</h3>
    <p>Elke kavel stelt zijn eigen eisen: de verhouding tussen bouwvlak en perceel, de oriëntatie op de zon, de relatie met de straat en de buren. Dat vraagt om een ontwerp dat niet alleen voldoet aan de regels, maar ook past bij de plek.</p>
    <p>Als u nadenkt over wat hier mogelijk is, kunt u <a href="https://www.zwijsen.net/contact" target="_blank" rel="noopener noreferrer">vrijblijvend afstemmen</a> over de uitgangspunten.</p>
  `.trim();
}

// --- Main ---

const { data: listings, error } = await supabase
  .from('listings')
  .select('*')
  .in('status', ['published', 'pending']);

if (error) { console.error('Fetch error:', error); process.exit(1); }

console.log(`${listings.length} listings gevonden, bezig met regenereren...`);

let ok = 0, fail = 0;
for (const l of listings) {
  const kaSummary = buildKaSummary(l);
  const kaArticle = buildKaArticle(l);
  const zwArticle = buildZwArticle(l);

  const { error: upErr } = await supabase
    .from('listings')
    .update({
      seo_summary: kaSummary,
      seo_summary_ka: kaSummary,
      seo_article_html: kaArticle,
      seo_article_html_ka: kaArticle,
      seo_article_html_zw: zwArticle,
      updated_at: new Date().toISOString(),
    })
    .eq('kavel_id', l.kavel_id);

  if (upErr) {
    console.error(`  ✗ ${l.kavel_id} (${l.adres}): ${upErr.message}`);
    fail++;
  } else {
    console.log(`  ✓ ${l.kavel_id} — ${l.adres}, ${l.plaats}`);
    ok++;
  }
}

console.log(`\nKlaar: ${ok} bijgewerkt, ${fail} fouten.`);
