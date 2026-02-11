export type FaqArticle = {
    slug: string;
    title: string;
    description: string;
    date: string;
    contentHtml: string;
};

export const FAQ_ARTICLES: FaqArticle[] = [
    {
        slug: 'hoe-vind-ik-een-bouwkavel-in-nederland',
        title: 'Hoe vind ik een bouwkavel in Nederland?',
        description: 'Een praktische gids voor Funda, gemeentes, makelaars en off-market aanbod.',
        date: '2026-02-06',
        contentHtml: `
<p>Een bouwkavel vinden is frustrerender dan de meeste mensen denken. Je checkt Funda elke dag, belt gemeentes die je doorverwijzen naar een afdeling die niet opneemt, en als je eindelijk iets vindt is het al verkocht of blijkt het niet geschikt.</p>

<h2>Waar kijken mensen meestal?</h2>
<p><strong>Funda en vergelijkbare platforms</strong> tonen openbare kavels, maar dat is het topje van de ijsberg. Deze kavels zijn vaak al door tientallen mensen bekeken en je zit in een biedingsstrijd. Bovendien staat er zelden bij of je er echt kunt bouwen wat je wil.</p>
<p><strong>Gemeentelijke websites</strong> publiceren soms nieuwbouwprojecten, maar de informatie is vaak verouderd. Bij een recente check in Bodegraven stond een lijst met kavels die al anderhalf jaar verkocht waren.</p>
<p><strong>Makelaars</strong> kunnen helpen, maar die focussen zich vooral op duurdere kavels (EUR 300k+) waar hun provisie de moeite waard is. Voor een "gewone" kavel in de Achterhoek van EUR 150k heb je weinig aan een NVM-makelaar.</p>

<h2>De kavels die je mist</h2>
<p>De beste kavels komen vaak nooit online. Voorbeelden die wij zien:</p>
<ul>
  <li>Een agrarier in Gelderland die stopte en zijn erf splitste - 3 kavels verkocht aan kennissen voordat het online kwam.</li>
  <li>Gemeentegrond in Reeuwijk die eerst werd aangeboden aan mensen op een interne wachtlijst.</li>
  <li>Een erfenis waarbij kinderen snel verkochten onder marktprijs omdat ze de waarde niet kenden.</li>
</ul>
<p>Dit zijn <strong>off-market kavels</strong>. Daar kom je alleen bij via netwerk.</p>

<h2>Hoe wij kavels vinden</h2>
<p>Door ons netwerk van gemeentecontacten, notarissen en agrariers krijgen we signalen voordat kavels publiek worden. Niet omdat we makelaars zijn (dat zijn we niet), maar omdat we als specialist in kavelhaalbaarheid veel met deze partijen samenwerken. Bij de helft van de kavels die we voorstellen staat nog geen Funda-bord.</p>
<p>We screenen ook kavels op haalbaarheid. Niet elk perceel met "bouwbestemming" is geschikt. We houden mensen geregeld tegen die een kavel willen kopen waar hun ontwerp niet past. Dat voorkomt teleurstelling en dure fouten.</p>

<h2>Wil je dat we meekijken?</h2>
<p>Geef je zoekopdracht door en we melden ons als er iets langskomt dat past. Geen verplichtingen, gewoon in je achterhoofd houden.</p>
<p>
  Bekijk het actuele aanbod op <a href="/aanbod">/aanbod</a> of start met een quick-check via <a href="/kavelrapport">KavelRapport</a>.
</p>
`
    },
    {
        slug: 'waar-kan-ik-een-kavel-kopen',
        title: 'Waar kan ik een kavel kopen?',
        description: 'Gemeentes, makelaars en particulieren: de drie belangrijkste bronnen met hun voor- en nadelen.',
        date: '2026-02-06',
        contentHtml: `
<p>Kavels komen grofweg uit drie bronnen, elk met eigen voor- en nadelen.</p>

<h2>1. Gemeentes</h2>
<p>Gemeentes verkopen kavels vaak via inschrijvingen of selectieprocedures. Dit zijn meestal bouwrijpe kavels met kavelpaspoort en duidelijke regels.</p>
<p><strong>Voordeel:</strong> zekerheid. <strong>Nadeel:</strong> veel concurrentie en selectiecriteria (bijv. "binding met de gemeente").</p>
<p>Gemeentekavels zijn vaak duurder omdat de gemeente de grond bouwrijp maakt en die kosten doorberekent.</p>

<h2>2. Makelaars</h2>
<p>Via Funda en NVM-makelaars vind je meer variatie: van ruwe grond tot exclusieve locaties. Check altijd zelf of je mag bouwen wat je wil; makelaars controleren dit zelden grondig.</p>
<p>Voorbeeld: een kavel in Laren werd verkocht met "prachtige bouwmogelijkheden voor villa". Het bestemmingsplan stond echter een maximale goothoogte van 4 meter toe - te laag voor een volwaardige villa.</p>

<h2>3. Particulieren</h2>
<p>Via Marktplaats, lokale Facebook-groepen of een bord langs de weg vind je soms de beste deals. Vaak agrariers die stoppen, erfenissen, of mensen die grond over hebben.</p>
<p><strong>Let op:</strong> hier loop je de meeste risico's: onduidelijke erfdienstbaarheden, bodemverontreiniging of zelfs geen bouwbestemming.</p>

<h2>Onze rol</h2>
<p>Wij kopen zelf geen kavels op (geen makelaar), maar signaleren wel wat er beschikbaar komt via ons netwerk. En belangrijker: we checken of een kavel echt geschikt is voordat je een bod doet.</p>
<p>
  Start met het actuele aanbod: <a href="/aanbod">/aanbod</a> of laat een kavel toetsen via <a href="/kavelrapport">KavelRapport</a>.
</p>
`
    },
    {
        slug: 'waarop-letten-bij-kopen-bouwkavel',
        title: 'Waar moet ik op letten bij het kopen van een bouwkavel?',
        description: 'De 10 belangrijkste aandachtspunten: bestemming, bouwvlak, bodem, kosten en meer.',
        date: '2026-02-06',
        contentHtml: `
<p>Te veel mensen kopen impulsief: mooie plek, emotie, tekenen. Drie maanden later ontdekken ze dat het ontwerp niet past, de bodem vervuild is of dat er EUR 20.000 aan verborgen kosten bijkomt.</p>

<h2>De top 10 aandachtspunten</h2>
<ol>
  <li><strong>Bestemming in het omgevingsplan.</strong> Staat er echt "wonen"? Let op uitzonderingen zoals "agrarisch met nevengeschikte woning".</li>
  <li><strong>Bouwvlak en hoogte.</strong> Bouwvlak bepaalt waar je mag bouwen. Goothoogte en nokhoogte bepalen het aantal verdiepingen.</li>
  <li><strong>Bodemkwaliteit.</strong> Vraag een schoongrondverklaring. Bij twijfel: bodemonderzoek (EUR 500-EUR 2.000).</li>
  <li><strong>Bouwrijpheid.</strong> Zijn riolering, elektra en water al aangesloten? Zo niet, tel EUR 5.000-EUR 15.000 extra.</li>
  <li><strong>Omgeving en toekomstplannen.</strong> Check gemeentelijke plannen; uitzicht kan verdwijnen door nieuwbouw.</li>
  <li><strong>Bouwtermijn.</strong> Gemeentes eisen vaak bouwen binnen 2-5 jaar. Dit kan druk geven.</li>
  <li><strong>Extra kosten.</strong> Notaris, kadaster, aansluitingen, bodemonderzoek, welstand.</li>
  <li><strong>Financiering.</strong> Banken financieren maximaal ~80% van alleen grond.</li>
  <li><strong>Welstand en stijl.</strong> Sommige regio's eisen rieten kap of specifieke materialen.</li>
  <li><strong>Toekomstwaarde.</strong> In groeigebieden stijgen prijzen, in krimpregio's minder.</li>
</ol>

<h2>Hoe checken wij dit?</h2>
<p>Wij doen deze check dagelijks en kunnen binnen 48 uur in begrijpelijk Nederlands uitleggen wat je mag bouwen, welke risico's er zijn en of het past bij je wensen.</p>
<p>
  Wil je zekerheid? Bekijk <a href="/kavelrapport">KavelRapport</a> of bekijk het actuele aanbod via <a href="/aanbod">/aanbod</a>.
</p>
`
    },
    {
        slug: 'welke-kosten-bij-kopen-kavel',
        title: 'Welke kosten komen bij het kopen van een kavel kijken?',
        description: 'Volledige kostenlijst: notaris, belasting, onderzoek en aansluitingen.',
        date: '2026-02-06',
        contentHtml: `
<p>De koopprijs is pas het begin. Veel mensen rekenen alleen met de grondprijs en ontdekken later dat er EUR 30.000-EUR 50.000 aan bijkomende kosten bijkomt.</p>

<h2>Verplichte kosten bij aankoop</h2>
<ul>
  <li>Notaris: EUR 1.000-EUR 2.000</li>
  <li>Overdrachtsbelasting: 2% (soms vrijstelling, check met notaris)</li>
  <li>Kadaster: EUR 50-EUR 150</li>
</ul>

<h2>Onderzoekskosten</h2>
<ul>
  <li>Bodemonderzoek: EUR 500-EUR 2.000 bij twijfel</li>
  <li>Bestemmingsplan-interpretatie: zelf doen of laten checken</li>
</ul>

<h2>Aansluitkosten (als kavel niet bouwrijp is)</h2>
<ul>
  <li>Riolering: EUR 3.000-EUR 8.000</li>
  <li>Elektra: EUR 2.000-EUR 5.000</li>
  <li>Water: EUR 1.000-EUR 3.000</li>
  <li>Gas (optioneel): EUR 1.500-EUR 3.000</li>
  <li>Totaal: EUR 5.000-EUR 15.000 (soms meer)</li>
</ul>

<h2>Overige kosten</h2>
<ul>
  <li>Makelaar: 1-2% (bij NVM)</li>
  <li>Erfpacht: jaarlijkse canon bij gemeentegrond</li>
  <li>OZB: EUR 200-EUR 500/jaar</li>
</ul>

<h2>Voorbeeld</h2>
<p>Kavel in Bodegraven, EUR 250.000:</p>
<ul>
  <li>Grond: EUR 250.000</li>
  <li>Notaris: EUR 1.500</li>
  <li>Overdrachtsbelasting: EUR 0 (vrijstelling)</li>
  <li>Kadaster: EUR 100</li>
  <li>Bodemonderzoek: EUR 800</li>
  <li>Aansluitingen: EUR 10.000</li>
  <li><strong>Totaal: EUR 262.400</strong></li>
</ul>

<p>Wil je zeker weten waar je aan toe bent? Laat ons de kavel checken via <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'bestemmingsplan-omgevingsplan-lezen',
        title: 'Hoe lees ik een bestemmingsplan / omgevingsplan?',
        description: 'Uitleg in begrijpelijk Nederlands: verbeelding, regels en valkuilen.',
        date: '2026-02-06',
        contentHtml: `
<p>Bestemmingsplannen lezen is een vak apart. Juridische taal, moeilijke kaarten en veel uitzonderingen.</p>

<h2>Waar vind je het?</h2>
<p>Ga naar Ruimtelijkeplannen.nl, vul het adres in en je krijgt een kaart (de "verbeelding") en een set regels.</p>

<h2>Wat zie je op de kaart?</h2>
<p>De kaart toont kleuren voor bestemmingen (bijv. wonen, tuin, water). Vaak zie je een bouwvlak: daar moet je hoofdgebouw binnen vallen.</p>

<h2>Valkuilen</h2>
<ul>
  <li>"Maximale goothoogte 6 meter" betekent niet altijd 2 verdiepingen.</li>
  <li>"Bijgebouwen max 50 m2" geldt soms alleen achter de achtergevel.</li>
  <li>"Wonen toegestaan" kan gekoppeld zijn aan extra welstandseisen.</li>
</ul>

<h2>Hoe lees je de regels?</h2>
<p>Zoek het artikel dat over jouw bestemming gaat (meestal "Wonen"). Let op:</p>
<ul>
  <li>Maximale oppervlakte</li>
  <li>Goothoogte en nokhoogte</li>
  <li>Afstand tot erfgrens</li>
  <li>Regels voor bijgebouwen</li>
  <li>Welstandseisen</li>
</ul>

<h2>Te ingewikkeld?</h2>
<p>Dat is logisch. Wij vertalen dit dagelijks naar begrijpelijke taal. Wil je dat we meekijken? Bekijk <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'wat-kost-een-bouwkavel-gemiddeld',
        title: 'Wat kost een bouwkavel gemiddeld in Nederland?',
        description: 'Gemiddelde prijsrange per provincie (2026) en waar je op moet letten.',
        date: '2026-02-06',
        contentHtml: `
<p>Kavelprijzen variëren enorm: van EUR 100/m2 in Groningen tot EUR 800/m2 in Zuid-Holland. Het hangt af van regio, gemeente en zelfs wijk.</p>

<h2>Gemiddelde prijzen per provincie (2026)</h2>
<ul>
  <li>Zuid-Holland: EUR 400-EUR 800/m2</li>
  <li>Noord-Holland: EUR 350-EUR 700/m2</li>
  <li>Utrecht: EUR 300-EUR 600/m2</li>
  <li>Gelderland: EUR 200-EUR 450/m2</li>
  <li>Overijssel, Drenthe, Groningen: EUR 100-EUR 300/m2</li>
</ul>

<h2>Voorbeeldberekening</h2>
<p>Kavel 500 m2 in Reeuwijk a EUR 500/m2 = EUR 250.000.</p>
<p>Plus bijkomende kosten (10-20%) = totaal EUR 275.000-EUR 300.000 voordat je begint met bouwen.</p>

<h2>Let op verborgen kosten</h2>
<p>Goedkope kavels zijn vaak niet bouwrijp. Een kavel in Groningen voor EUR 100/m2 kan door aansluitkosten en reistijd minder aantrekkelijk zijn.</p>

<h2>Waar liggen de kansen?</h2>
<p>Gelderland en Overijssel bieden in 2026 de beste prijs-kwaliteit. Denk aan Ermelo, Putten en Barneveld.</p>

<p>Wil je actuele kavels vergelijken? Bekijk <a href="/aanbod">/aanbod</a>.</p>
`
    },
    {
        slug: 'hypotheek-voor-alleen-een-kavel',
        title: 'Kan ik een hypotheek krijgen voor alleen een kavel?',
        description: 'Ja, maar voorwaarden zijn strenger: lagere LTV, hogere rente en bouwplannen vereist.',
        date: '2026-02-06',
        contentHtml: `
<p>Ja, maar het is lastiger en duurder dan een hypotheek voor een bestaande woning.</p>

<h2>Voorwaarden</h2>
<ul>
  <li>Maximaal 80% LTV: je hebt minimaal 20% eigen geld nodig.</li>
  <li>Hogere rente: vaak 0,2-0,5% hoger.</li>
  <li>Concrete bouwplannen: banken willen bewijs dat bouwen mogelijk is.</li>
  <li>Kortere looptijd: vaak binnen 2-3 jaar starten met bouwen.</li>
  <li>Banken vragen om bewijs uit het bestemmingsplan.</li>
</ul>

<h2>Waarom zo streng?</h2>
<p>Een kavel is lastiger te verkopen dan een woning. Voor de bank is het risico hoger.</p>

<h2>Slimmer alternatief: zelfbouwhypotheek</h2>
<p>Financiert kavel + bouw in een keer. Lagere rente, soms 100% met NHG en uitbetaling via bouwdepot.</p>

<p>Wil je bewijs dat je mag bouwen? Laat ons meekijken via <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'wat-is-bouwrijpe-grond',
        title: 'Wat is bouwrijpe grond en waarom is dat belangrijk?',
        description: 'Bouwrijp betekent klaar om te bouwen. Ruwe grond brengt extra kosten en tijd.',
        date: '2026-02-06',
        contentHtml: `
<p>Bouwrijpe grond betekent: klaar om te bouwen. Alle voorzieningen zijn aangesloten en er is een kavelpaspoort.</p>

<h2>Ruwe grond = extra kosten</h2>
<ul>
  <li>Riolering: EUR 3.000-EUR 8.000</li>
  <li>Elektra: EUR 2.000-EUR 5.000</li>
  <li>Water: EUR 1.000-EUR 3.000</li>
  <li>Ontsluitingsweg: EUR 5.000-EUR 20.000</li>
</ul>

<h2>Waarom belangrijk?</h2>
<ul>
  <li><strong>Budget:</strong> ruwe grond lijkt goedkoper maar wordt vaak duurder.</li>
  <li><strong>Tijd:</strong> aansluitingen regelen duurt 6-12 maanden.</li>
  <li><strong>Hypotheek:</strong> banken financieren bouwrijp makkelijker.</li>
</ul>

<h2>Hoe herken je bouwrijp?</h2>
<p>De verkoper noemt het expliciet of er is een kavelpaspoort. Bij twijfel: vraag bewijs van aansluitingen.</p>

<p>Wij kunnen dit checken in het kavelpaspoort of via de gemeente. Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'hoe-snel-bouwen-na-aankoop',
        title: 'Hoe snel moet ik bouwen na aankoop van bouwgrond?',
        description: 'Termijnen verschillen per verkoper. Gemeentes hanteren meestal 2-5 jaar.',
        date: '2026-02-06',
        contentHtml: `
<p>Dit hangt af van de verkoper en staat in het kavelpaspoort of de koopakte.</p>

<h2>Typische termijnen</h2>
<ul>
  <li>Gemeente-kavels: 2-3 jaar voor vergunning, 5 jaar totaal voor oplevering.</li>
  <li>Projectontwikkelaars: meestal 2-4 jaar, vaak soepeler.</li>
  <li>Particulieren: meestal geen termijn.</li>
</ul>

<h2>Wat telt als "gebouwd"?</h2>
<p>Meestal: woning wind- en waterdicht + bewoonbaar. Fundering alleen is niet genoeg.</p>

<h2>Hoe voorkom je problemen?</h2>
<p>Start vroeg met ontwerp en vergunning. Check de realisatieplicht en vraag bij vertraging op tijd om verlenging.</p>

<p>Meer zekerheid? Laat ons de kavelvoorwaarden checken via <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'wanneer-bodemonderzoek-doen',
        title: 'Wanneer moet ik een bodemonderzoek doen bij een kavel?',
        description: 'Bodemonderzoek is vaak verstandig en soms verplicht. Hier lees je wanneer.',
        date: '2026-02-06',
        contentHtml: `
<p>Bodemonderzoek is niet altijd verplicht, maar vaak wel verstandig. Vervuilde grond kan bouwen onmogelijk maken of EUR 50.000+ aan sanering kosten.</p>

<h2>Wanneer is het nodig?</h2>
<ul>
  <li>Voormalig bedrijventerrein (tankstations, fabrieken, stortplaatsen)</li>
  <li>Landbouwgrond met intensief pesticidengebruik</li>
  <li>Dicht bij vervuilingsbronnen (snelweg, spoorlijn)</li>
  <li>Geen schoongrondverklaring beschikbaar</li>
  <li>Bank eist het voor de hypotheek</li>
</ul>

<h2>Wat kost het?</h2>
<ul>
  <li>Quickscan: EUR 500-EUR 800</li>
  <li>Volledig onderzoek (NEN5740): EUR 1.500-EUR 2.500</li>
</ul>

<h2>Kan je bouwen op vervuilde grond?</h2>
<p>Soms wel, met extra maatregelen (schone laag, damwand). Dit kost geld en tijd.</p>

<p>Wij beoordelen de kavelgeschiedenis en adviseren of bodemonderzoek nodig is. Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'wat-mag-ik-bouwen-op-mijn-kavel',
        title: 'Wat mag ik bouwen op mijn kavel?',
        description: 'Uitleg over omgevingsplan, bouwvlak, hoogte, oppervlakte en welstand.',
        date: '2026-02-06',
        contentHtml: `
<p>Wat je mag bouwen wordt bepaald door het omgevingsplan van je gemeente. Dit regelt de bestemming, het bouwvlak, de maximale hoogte, oppervlakte en vaak ook welstandseisen over architectuurstijl.</p>

<h2>De belangrijkste bouwregels</h2>
<ul>
  <li><strong>Bestemming:</strong> meestal "wonen", soms "wonen met bedrijf aan huis" of "wonen in combinatie met agrarisch". Dat maakt verschil voor gebruik.</li>
  <li><strong>Bouwvlak:</strong> de zone waar je hoofdgebouw moet staan. Vaak de eerste 12-15 meter vanaf de voorgevel.</li>
  <li><strong>Maximale oppervlakte:</strong> bijvoorbeeld "maximaal 150m2 BVO" (bruto vloeroppervlak). Dit is inclusief verdiepingen en bijgebouwen die als woonruimte gelden.</li>
  <li><strong>Goothoogte en nokhoogte:</strong> bepalen hoeveel verdiepingen mogelijk zijn. Goothoogte 6m en nokhoogte 10m betekent meestal 1,5 tot 2 verdiepingen met schuin dak. Bij een plat dak is het anders.</li>
  <li><strong>Bijgebouwen:</strong> vaak maximaal 50m2 achter de achtergevellijn. Meestal geen woonruimte, tenzij mantelzorg met tijdelijke vergunning.</li>
  <li><strong>Welstand:</strong> sommige gemeentes eisen specifieke materialen, kleuren of stijlen. Dit staat in het kavelpaspoort of in bijlagen van het plan.</li>
</ul>

<h2>Waar wordt dit lastig?</h2>
<p>De interpretatie. "Goothoogte 6m" klinkt duidelijk, maar vanaf waar meet je? Gemeentes hanteren verschillende definities. Ook "bijgebouwen max 50m2": geldt dat totaal of per bijgebouw? Details staan verspreid in de regels.</p>

<h2>Hoe kom je erachter wat precies mag?</h2>
<p>Ga naar Ruimtelijkeplannen.nl, zoek je kaveladres op, en lees zowel de kaart (verbeelding) als de regels. Let op definities achterin. Bij onduidelijkheid: bel de gemeente (Ruimtelijke Ordening of Omgevingsvergunning).</p>
<p>Of laat het uitzoeken door iemand die dit dagelijks doet. Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'hoeveel-huizen-mag-je-bouwen-op-een-kavel',
        title: 'Hoeveel huizen mag je bouwen op 1 kavel?',
        description: 'Meestal 1 woning, tenzij het omgevingsplan meer toestaat.',
        date: '2026-02-06',
        contentHtml: `
<p>Standaard: een woning per kavel. Meerdere woningen zijn alleen mogelijk als het omgevingsplan dit expliciet toestaat.</p>

<h2>Wanneer zijn meerdere woningen mogelijk?</h2>
<ul>
  <li><strong>Plan staat het toe:</strong> er staat expliciet "maximaal 2 wooneenheden" of "hofjes toegestaan".</li>
  <li><strong>Kavel is groot genoeg:</strong> vaak minimaal 800-1.000m2 per extra woning.</li>
  <li><strong>Splitsingsvergunning:</strong> kadastraal splitsen via notaris + instemming gemeente (kosten EUR 2.000-EUR 5.000).</li>
  <li><strong>Afwijkingsvergunning:</strong> omgevingsvergunning om af te wijken (6-12 maanden, niet altijd succesvol).</li>
  <li><strong>Mantelzorgwoning:</strong> tijdelijk toegestaan, vervalt als zorg stopt.</li>
</ul>

<h2>Valkuilen</h2>
<p>Gemeentes toetsen op oppervlak, parkeren en stedenbouwkundige visie. Banken financieren splitsing lastiger. Dit traject is complex en tijdrovend.</p>

<p>Wij kunnen onderzoeken of jouw kavel splitsbaar is en wat de voorwaarden zijn. Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'hoe-werkt-een-zelfbouwhypotheek',
        title: 'Hoe werkt een zelfbouwhypotheek en bouwdepot?',
        description: 'Kavel en bouw in een keer financieren, met uitbetaling via bouwdepot.',
        date: '2026-02-06',
        contentHtml: `
<p>Een zelfbouwhypotheek financiert kavel en bouw in een keer. Het geld komt gefaseerd vrij via een bouwdepot: na elke bouwfase keurt een inspecteur het werk en stort de bank het volgende deel uit.</p>

<h2>Stappenplan</h2>
<ol>
  <li><strong>Aanvraag:</strong> hypotheek voor kavel + bouwkosten.</li>
  <li><strong>Taxatie:</strong> bank taxeert de waarde na oplevering.</li>
  <li><strong>Bouwdepot:</strong> bouwgeld staat apart en wordt gefaseerd uitgekeerd.</li>
  <li><strong>Gefaseerde uitkering:</strong> bijvoorbeeld 40% ruwbouw, 30% wind- en waterdicht, 20% afbouw, 10% oplevering.</li>
  <li><strong>Oplevering:</strong> hypotheek wordt normale annuiteitenhypotheek.</li>
 </ol>

<h2>Voordelen</h2>
<ul>
  <li>Lagere rente dan alleen grond.</li>
  <li>NHG mogelijk als totaal onder de grens blijft.</li>
  <li>Tot 100% financiering soms mogelijk.</li>
  <li>Meer zekerheid door controle per bouwfase.</li>
</ul>

<h2>Wat heb je nodig?</h2>
<ul>
  <li>Kavelpaspoort of bewijs dat je mag bouwen</li>
  <li>Bouwplan + begroting</li>
  <li>Offertes van aannemers</li>
  <li>Budgetbewijzen</li>
</ul>

<p>Meer zekerheid over de bouwmogelijkheden? Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'hoe-bereken-ik-mijn-totale-budget',
        title: 'Hoe bereken ik mijn totale budget voor kavel + bouw?',
        description: 'Praktische budgetopbouw met kostenposten en een vuistregel.',
        date: '2026-02-06',
        contentHtml: `
<p>Budget berekenen is complexer dan het lijkt. Je hebt niet alleen grond en bouw, maar ook bijkomende kosten die snel oplopen tot 15-20% van het totaal.</p>

<h2>Budget-opbouw</h2>
<ul>
  <li><strong>Grondprijs:</strong> varieert van EUR 100.000 tot EUR 400.000+.</li>
  <li><strong>Bouwkosten:</strong> grofweg EUR 1.800-EUR 3.500+ per m2.</li>
  <li><strong>Bijkomende kosten:</strong> notaris, architect, vergunning, bouwdepot, kwaliteitsborger, aansluitingen, tuin, onvoorzien.</li>
</ul>

<h2>Vuistregel 40-40-20</h2>
<p>Bij totaalbudget EUR 500.000:</p>
<ul>
  <li>40% grond = EUR 200.000</li>
  <li>40% bouw = EUR 200.000</li>
  <li>20% bijkomend = EUR 100.000</li>
</ul>

<h2>Wat als je budget te krap is?</h2>
<p>Goedkopere regio, kleiner bouwen, eenvoudiger afwerking of zelf klussen. Bespaar niet op constructie of isolatie.</p>

<p>Wil je een realistische check? Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'hoe-vind-ik-off-market-kavels',
        title: 'Hoe vind ik off-market kavels die niet online staan?',
        description: 'Praktische tips voor off-market aanbod en waarom het lastiger is.',
        date: '2026-02-06',
        contentHtml: `
<p>De beste kavels komen vaak nooit op Funda. Ze worden verkocht via netwerken, particuliere contacten of direct aan geïnteresseerden.</p>

<h2>Waarom interessant?</h2>
<ul>
  <li>Geen concurrentie en minder biedingen.</li>
  <li>Betere prijs doordat makelaarskosten wegvallen.</li>
  <li>Sneller proces.</li>
  <li>Exclusieve locaties.</li>
</ul>

<h2>Hoe vind je ze?</h2>
<ul>
  <li>Bel de gemeente (Grondbeleid) en vraag naar wachtlijsten.</li>
  <li>Benader agrariers of eigenaren direct.</li>
  <li>Bouw relaties op met notarissen en makelaars.</li>
  <li>Gebruik lokale netwerken en mond-tot-mond.</li>
</ul>

<p>Off-market betekent ook meer risico: minder documentatie en vaker onduidelijke bouwbestemming. Wij kunnen signaleren en screenen via ons netwerk. Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'hoe-vraag-ik-een-kavelpaspoort-op',
        title: 'Hoe vraag ik een kavelpaspoort op?',
        description: 'Wat het is, wat erin staat en hoe je het opvraagt bij gemeente of verkoper.',
        date: '2026-02-06',
        contentHtml: `
<p>Een kavelpaspoort is een document van de gemeente met bouwregels, aansluitingen en verplichtingen voor jouw kavel.</p>

<h2>Wat staat erin?</h2>
<ul>
  <li>Perceelgegevens en oppervlakte</li>
  <li>Bestemming, bouwvlak, hoogte en oppervlakte</li>
  <li>Bouwrijpheid en aansluitingen</li>
  <li>Welstandseisen</li>
  <li>Bouwtermijn en erfdienstbaarheden</li>
  <li>Kosten zoals erfpacht</li>
</ul>

<h2>Waar haal je het op?</h2>
<ul>
  <li>Bij de verkoper (gemeente of projectontwikkelaar)</li>
  <li>Bij de gemeente (Grondbeleid of Ruimtelijke Ordening)</li>
  <li>Soms online bij nieuwbouwprojecten</li>
</ul>

<h2>Geen paspoort?</h2>
<p>Bij particuliere verkoop is er vaak geen kavelpaspoort. Dan moet je het bestemmingsplan checken en de gemeente bellen. Een alternatief is een vooroverleg omgevingsvergunning.</p>

<p>Wij kunnen dit voor je uitzoeken. Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'veelgemaakte-fouten-bij-kavel-kopen',
        title: 'Wat zijn veelgemaakte fouten bij kavel kopen?',
        description: 'De 10 meest gemaakte fouten en hoe je ze voorkomt.',
        date: '2026-02-06',
        contentHtml: `
<p>Kavel kopen zonder expertise is risicovol. Dit zijn de meest voorkomende fouten:</p>

<ol>
  <li>Geen bestemmingsplancheck.</li>
  <li>Geen bodemonderzoek bij twijfel.</li>
  <li>Te weinig budget (bijkomende kosten vergeten).</li>
  <li>Geen bouwrijpe grond en aansluitkosten onderschatten.</li>
  <li>Te korte bouwtermijn.</li>
  <li>Geen hypotheekcheck vooraf.</li>
  <li>Welstandseisen negeren.</li>
  <li>Emotioneel overbieden.</li>
  <li>Geen erfdienstbaarheid-check.</li>
  <li>Geen haalbaarheidscheck vooraf.</li>
</ol>

<h2>Hoe voorkom je dit?</h2>
<p>Doe onderzoek voordat je tekent en laat een expert meekijken. Dat voorkomt dure fouten.</p>
<p>Meer zekerheid? Zie <a href="/kavelrapport">KavelRapport</a>.</p>
`
    },
    {
        slug: 'waar-is-bouwgrond-het-goedkoopst',
        title: 'Waar is bouwgrond het goedkoopst in Nederland?',
        description: 'Goedkope regioâ€™s en waarom goedkoop niet altijd slim is.',
        date: '2026-02-06',
        contentHtml: `
<p>Bouwgrond is het goedkoopst in regio's met lage vraag: Drenthe, Groningen en delen van Zeeland en Oost-Gelderland.</p>

<h2>Goedkoopste provincies</h2>
<ul>
  <li><strong>Drenthe:</strong> EUR 100-EUR 250/m2</li>
  <li><strong>Groningen:</strong> EUR 120-EUR 280/m2</li>
  <li><strong>Oost-Gelderland:</strong> EUR 150-EUR 300/m2</li>
  <li><strong>Zeeland:</strong> EUR 180-EUR 350/m2</li>
  <li><strong>Zuid-Limburg:</strong> EUR 200-EUR 400/m2</li>
</ul>

<h2>Waarom zo goedkoop?</h2>
<ul>
  <li>Krimpregio's met lagere vraag</li>
  <li>Minder voorzieningen</li>
  <li>Meer aanbod dan vraag</li>
</ul>

<h2>Waarom goedkoop niet altijd slim is</h2>
<p>Goedkoop betekent vaak lagere toekomstwaarde, lastiger financieren en minder professionals beschikbaar.</p>
<p>Vaak is prijs-kwaliteit beter in Gelderland, Overijssel of delen van Noord-Brabant.</p>

<p>Wil je actuele kavels vergelijken? Bekijk <a href="/aanbod">/aanbod</a>.</p>
`
    },
    {
        slug: 'wat-verandert-er-voor-hypotheken-in-2026',
        title: 'Wat verandert er voor hypotheken in 2026?',
        description: 'Overzicht van NHG-grens, rente, eigen middelen en nieuwe eisen.',
        date: '2026-02-06',
        contentHtml: `
<p>Hypotheekvoorwaarden veranderen jaarlijks. Dit zijn de regels voor 2026 volgens de huidige marktpraktijk.</p>

<h2>NHG-grens</h2>
<p>EUR 450.000 voor zelfbouw (kavel + bouw samen). NHG geldt niet voor alleen een kavel.</p>

<h2>Indicatieve rentes 2026</h2>
<ul>
  <li>Zelfbouwhypotheek met NHG: 3,0-3,5%</li>
  <li>Zelfbouwhypotheek zonder NHG: 3,5-4,0%</li>
  <li>Alleen kavel: 3,8-4,5%</li>
</ul>

<h2>Eigen middelen</h2>
<ul>
  <li>Alleen kavel: minimaal 20% eigen geld</li>
  <li>Kavel + bouw met NHG: 0-10% eigen geld</li>
  <li>Kavel + bouw zonder NHG: 10-20% eigen geld</li>
</ul>

<h2>Nieuw in 2026</h2>
<ul>
  <li>Duurzaamheidstoets (minimaal label A)</li>
  <li>Klimaatadaptatie en risico op wateroverlast</li>
  <li>Strengere inkomenstoets door hogere rentes</li>
</ul>

<p>Banken eisen meer bewijs vooraf: bestemmingsplan, kavelpaspoort of toelichting op bouwmogelijkheden.</p>
`
    },
    {
        slug: 'is-investeren-in-bouwgrond-een-goed-idee',
        title: 'Is investeren in bouwgrond een goed idee?',
        description: 'Voor- en nadelen, risicoâ€™s en wanneer het rendabel kan zijn.',
        date: '2026-02-06',
        contentHtml: `
<p>Bouwgrond als investering kan lucratief zijn, maar is riskanter dan vastgoed met opstal.</p>

<h2>Voordelen</h2>
<ul>
  <li>Waardestijging in groeiregio's</li>
  <li>Beperkt aanbod drijft vraag</li>
  <li>Hefboomwerking met financiering</li>
  <li>Lagere instap dan een woning</li>
</ul>

<h2>Nadelen</h2>
<ul>
  <li>Geen cashflow</li>
  <li>Doorlopende kosten (OZB, erfpacht)</li>
  <li>Risico op herbestemming</li>
  <li>Hoge transactiekosten</li>
  <li>Marktrisico in krimpregio's</li>
  <li>Strengere financiering (max 80%)</li>
</ul>

<h2>Wanneer kan het werken?</h2>
<p>Koop in groeikernen, check bestemming grondig en houd minimaal 5 jaar aan. Hoger rendement haal je door splitsen of bouwrijp maken.</p>
<p>Voor passief beleggen zijn vaak betere opties. Voor actief ontwikkelen kan het interessant zijn.</p>
`
    }
    ,
        {
        slug: 'wat-zijn-de-stappen-na-kavelaankoop',
        title: 'Wat zijn de stappen na kavelaankoop?',
        description: 'Kavel gekocht: wat nu? Volg 7 concrete stappen van haalbaarheid en PvE tot vergunning, aanbesteding en bouw.',
        date: '2026-02-11',
        contentHtml: `
<p>Je hebt een kavel gekocht. Gefeliciteerd. Nu begint de fase waarin keuzes het verschil maken tussen een soepel traject en maanden vertraging. De route van kavelaankoop naar oplevering bestaat uit zeven duidelijke stappen.</p>

<p><strong>Snelle kernpunten:</strong></p>
<ul>
  <li><strong>Totale tijdlijn:</strong> meestal 12-24 maanden van aankoop tot sleutel.</li>
  <li><strong>Kritieke eerste stap:</strong> haalbaarheid definitief toetsen op jouw concrete plan.</li>
  <li><strong>Belangrijkste voorbereiding:</strong> eerst PvE en budget, daarna pas ontwerp en aannemer.</li>
  <li><strong>Grootste fout:</strong> direct starten zonder heldere scope en planning.</li>
</ul>

<h2>De 7 stappen in volgorde</h2>
<table>
  <tr><th>Stap</th><th>Duur</th><th>Resultaat</th></tr>
  <tr><td>1. Haalbaarheid definitief</td><td>1-2 weken</td><td>Heldere randvoorwaarden per kavel</td></tr>
  <tr><td>2. Programma van Eisen (PvE)</td><td>3-6 weken</td><td>Concreet wensenpakket</td></tr>
  <tr><td>3. Budget definitief</td><td>1-2 weken</td><td>Realistische totale begroting</td></tr>
  <tr><td>4. Architect selecteren</td><td>2-4 weken</td><td>Passend team en werkwijze</td></tr>
  <tr><td>5. Ontwerp + vergunning</td><td>16-26 weken</td><td>Vergunningsrijp plan</td></tr>
  <tr><td>6. Aanbesteding</td><td>4-6 weken</td><td>Aannemer gecontracteerd</td></tr>
  <tr><td>7. Bouwen</td><td>8-15 maanden</td><td>Opgeleverde woning</td></tr>
</table>

<h2>Stap 1: Haalbaarheid definitief checken</h2>
<p>Ook als je voor aankoop al een <a href="/diensten/kavelrapport">KavelRapport</a> hebt gebruikt, is na aankoop een projectspecifieke toets slim. Dan kijk je niet meer alleen naar algemene mogelijkheden, maar naar de beste positionering, volume en risico's voor jouw woningplan.</p>
<p>Bij twijfel over regels of afwijkingen helpt dit artikel: <a href="https://architectenbureau-zwijsen.nl/kennisbank/vragen/vergunningen-en-welstand/wanneer-is-vooroverleg-of-bopa-zinvol">wanneer is vooroverleg of BOPA zinvol</a>.</p>

<h2>Stap 2: PvE opstellen</h2>
<p>Een goed PvE vertaalt wensen naar ontwerpbare eisen: functies, m2, licht, privacy, techniek en prioriteiten. Zonder dit document krijg je onnodig veel herontwerprondes.</p>
<p>Gebruik hiervoor bijvoorbeeld de <a href="https://brikxai.nl/tools/pve-generator">PvE generator</a> als structuurhulp.</p>

<h2>Stap 3: Budget definitief maken</h2>
<p>Werk met totaalbudget, niet alleen bouwsom. Neem ook adviseurs, vergunning, aansluitingen, terreininrichting en buffer mee. Voor een eerste opzet kun je de <a href="https://brikxai.nl/tools/bouwbudget-calculator">bouwbudget-calculator</a> gebruiken.</p>

<h2>Stap 4: Architect selecteren</h2>
<p>Selecteer op klik, ervaring met jouw type project en transparantie over proces en kosten. Niet op alleen stijlbeelden. Dit helpt voor een goed gesprek: <a href="https://architectenbureau-zwijsen.nl/kennisbank/vragen/architect-kosten-en-bouwen/welke-vragen-stel-je-aan-architect">welke vragen stel je aan architect</a>.</p>

<h2>Stap 5: Ontwerp en vergunning</h2>
<p>Reken voor schets tot vergunning op meerdere maanden. De gemeentelijke procedure zelf is vaak 8-14 weken in de praktijk. Doorlooptijd artikel: <a href="https://architectenbureau-zwijsen.nl/kennisbank/vragen/vergunningen-en-welstand/hoe-lang-duurt-een-omgevingsvergunning">hoe lang duurt een omgevingsvergunning</a>.</p>

<h2>Stap 6: Aanbesteding</h2>
<p>Laat offertes vergelijken op dezelfde scope. Kies niet automatisch de laagste prijs. Een complete uitvraag voorkomt meerwerkdiscussies tijdens uitvoering.</p>

<h2>Stap 7: Bouwen</h2>
<p>Tijdens uitvoering blijft besluitdiscipline cruciaal. Werk met een vaste planning en keuzemomenten. Een praktische tool hiervoor is de <a href="https://brikxai.nl/tools/keuzetijdlijn">keuzetijdlijn</a>.</p>

<h2>Veelgemaakte fouten na kavelaankoop</h2>
<ul>
  <li>Te snel starten zonder heldere scope.</li>
  <li>Budget onderschatten door vergeten posten.</li>
  <li>Te laat materiaal- en installatieskeuzes maken.</li>
  <li>Vergelijking van aannemers op prijs in plaats van scope.</li>
</ul>

<h2>Praktische eerste stap vandaag</h2>
<ul>
  <li>Heb je al gekocht: start met een definitieve haalbaarheidstoets en werk je PvE uit.</li>
  <li>Twijfel je nog over richting: lees <a href="https://architectenbureau-zwijsen.nl/kennisbank/vragen/architect-kosten-en-bouwen/waar-begin-ik-met-bouwen-of-verbouwen">waar begin ik met bouwen of verbouwen</a>.</li>
  <li>Zoek je nog: activeer <a href="/diensten/kavel-alert">Kavel Alert</a>.</li>
</ul>

<p><em>Bronvermelding: tijdlijnen en kostenbandbreedtes zijn praktijkindicaties en verschillen per locatie, kavelvoorwaarden en projectcomplexiteit. Laatst bijgewerkt: februari 2026.</em></p>
`
    }
];

export function getFaqArticle(slug: string): FaqArticle | undefined {
    return FAQ_ARTICLES.find((article) => article.slug === slug);
}




