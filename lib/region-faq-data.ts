// FAQ data for region pages - optimized for Schema.org FAQPage
export interface RegionFAQ {
    question: string;
    answer: string;
}

export const getRegionFAQs = (cityName: string): RegionFAQ[] => {
    const baseFAQs: RegionFAQ[] = [
        {
            question: `Hoeveel kost een bouwkavel in ${cityName}?`,
            answer: `De prijs van een bouwkavel in ${cityName} hangt af van ligging, oppervlakte, bouwmogelijkheden en schaarste. In de praktijk loopt dit vaak uiteen van EUR 150.000 tot EUR 400.000 of hoger. Belangrijk: kijk niet alleen naar koopprijs, maar ook naar bijkomende kosten zoals notaris, onderzoeken, aansluitingen en vergunning.`
        },
        {
            question: `Welke welstandseisen gelden er in ${cityName}?`,
            answer: `${cityName} heeft vaak gebiedsgerichte welstandseisen. Die gaan over massa, kapvorm, materialen en inpassing in de omgeving. Per kavel kan dat flink verschillen. Laat daarom vooraf toetsen wat kansrijk is, zodat u niet later hoeft te herontwerpen.`
        },
        {
            question: `Hoe lang duurt een bouwvergunning in ${cityName}?`,
            answer: `Reken in de praktijk meestal op 10-14 weken, ook al is de wettelijke beslistermijn vaak 8 weken. Bij aanvullende vragen, welstandsoverleg of afwijkingen van het omgevingsplan loopt dit op. In complexe situaties (zoals monumenten of BOPA-trajecten) is 20-26 weken reëel.`
        },
        {
            question: `Heb ik al een architect nodig voordat ik een kavel koop in ${cityName}?`,
            answer: `Dat is vaak verstandig. Met een vroege haalbaarheidscheck voorkomt u dat u een kavel koopt waar uw woonwensen of budget niet op passen. U krijgt vooraf inzicht in bouwmogelijkheden, risico's en verwachte doorlooptijd.`
        },
        {
            question: `Wat zijn off-market kavels en hoe krijg ik daar toegang toe?`,
            answer: `Off-market kavels zijn locaties die niet publiek op platforms zoals Funda staan. Ze komen via netwerken, eigenaren en lokale contacten beschikbaar. KavelArchitect signaleert dit soort kansen en toetst ze vroeg op haalbaarheid, zodat u sneller kunt schakelen met minder verrassingen.`
        }
    ];

    const citySpecificFAQs: Record<string, RegionFAQ[]> = {
        'Loenen aan de Vecht': [
            {
                question: 'Welke welstandseisen gelden er bij landgoed Cronenburgh in Loenen aan de Vecht?',
                answer: 'Landgoed Cronenburgh kent specifieke eisen door de ruimtelijke kwaliteit en context. Er wordt scherp gekeken naar schaal, kapvorm, materialisatie en positionering op de kavel. Vooroverleg met gemeente en welstand is hier vrijwel altijd zinvol.'
            },
            {
                question: 'Mag ik een moderne villa bouwen in Loenen aan de Vecht?',
                answer: 'Ja, dat kan, mits het ontwerp goed aansluit op de lokale beeldkwaliteit en planregels. Moderne architectuur is vaak mogelijk, maar vraagt een zorgvuldige onderbouwing van volume, gevelopbouw en materiaalkeuze.'
            },
            {
                question: 'Hoe zit het met de bereikbaarheid van Loenen aan de Vecht?',
                answer: 'Loenen aan de Vecht ligt gunstig tussen Amsterdam en Utrecht via de A2. Die combinatie van landelijke kwaliteit en stedelijke bereikbaarheid maakt de vraag naar bouwkavels hoog en het aanbod beperkt.'
            }
        ],
        'Hilversum': [
            {
                question: 'Welke architectuurstijl past bij Hilversum?',
                answer: 'Hilversum heeft een sterke architectuuridentiteit en vaak duidelijke welstandsverwachtingen. Zowel eigentijdse als meer traditionele ontwerpen zijn mogelijk, zolang het plan ruimtelijk klopt en zorgvuldig is uitgewerkt.'
            }
        ],
        'Breukelen': [
            {
                question: 'Kan ik bouwen aan de Vecht in Breukelen?',
                answer: 'Dat kan, maar kavels aan de Vecht zijn schaars en kennen meestal extra randvoorwaarden door ligging, zichtlijnen en beschermde waarden. Een vroege haalbaarheidscheck voorkomt dat u later vastloopt in vergunning of ontwerp.'
            }
        ]
    };

    return citySpecificFAQs[cityName] || baseFAQs;
};

export const generateFAQSchema = (cityName: string) => {
    const faqs = getRegionFAQs(cityName);

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
            }
        }))
    };
};
