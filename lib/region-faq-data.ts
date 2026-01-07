// FAQ data for region pages - optimized for Schema.org FAQPage
export interface RegionFAQ {
    question: string;
    answer: string;
}

export const getRegionFAQs = (cityName: string): RegionFAQ[] => {
    // Base FAQs for all regions
    const baseFAQs: RegionFAQ[] = [
        {
            question: `Hoeveel kost een bouwkavel in ${cityName}?`,
            answer: `De prijs van een bouwkavel in ${cityName} varieert sterk afhankelijk van de locatie, grootte en bouwmogelijkheden. Gemiddeld liggen de prijzen tussen €150.000 en €400.000. Via KavelArchitect krijgt u toegang tot zowel publieke als off-market kavels, waardoor u meer keuze heeft in verschillende prijsklassen.`
        },
        {
            question: `Welke welstandseisen gelden er in ${cityName}?`,
            answer: `${cityName} heeft specifieke welstandseisen die per gebied kunnen verschillen. Wij kennen de lokale welstandscriteria en begeleiden u door het hele proces. Bij elk kavel dat wij aanbieden, checken we vooraf de welstandseisen en architectonische mogelijkheden, zodat u geen verrassingen krijgt.`
        },
        {
            question: `Hoe lang duurt het om een bouwvergunning te krijgen in ${cityName}?`,
            answer: `De doorlooptijd voor een bouwvergunning in ${cityName} is gemiddeld 8-12 weken. Met onze ervaring in de regio kunnen we dit proces versnellen door vooraf alle documentatie correct aan te leveren en proactief te communiceren met de gemeente ${cityName}.`
        },
        {
            question: `Kan ik een architect inschakelen voor mijn bouwkavel in ${cityName}?`,
            answer: `Ja, sterker nog: wij raden dit sterk aan. Architectenbureau Zwijsen begeleidt u van haalbaarheidscheck tot vergunningaanvraag. Wij kennen de lokale regelgeving in ${cityName}, hebben ervaring met de welstandscommissie, en zorgen dat uw ontwerp past binnen de mogelijkheden van uw kavel.`
        },
        {
            question: `Wat zijn off-market kavels en hoe krijg ik daar toegang toe?`,
            answer: `Off-market kavels zijn bouwkavels die niet publiekelijk worden aangeboden op platforms zoals Funda. Deze kavels worden vaak via makelaarsnetwerken, projectontwikkelaars of particuliere verkopen aangeboden. Via KavelArchitect krijgt u gratis toegang tot deze exclusieve kavels in ${cityName}, vaak 2-4 weken voordat ze publiek worden.`
        }
    ];

    // City-specific FAQs
    const citySpecificFAQs: Record<string, RegionFAQ[]> = {
        'Loenen aan de Vecht': [
            {
                question: 'Welke welstandseisen gelden er bij landgoed Cronenburgh in Loenen aan de Vecht?',
                answer: 'Landgoed Cronenburgh valt onder bijzondere welstandscriteria vanwege de beschermde status. Er gelden strikte eisen voor architectuur, materiaalgebruik en inpassing in het landschap. Wij hebben ervaring met projecten in dit gebied en begeleiden u door het welstandsproces, inclusief vooroverleg met de welstandscommissie Stichtse Vecht.'
            },
            {
                question: 'Mag ik een moderne villa bouwen in Loenen aan de Vecht?',
                answer: 'Ja, moderne architectuur is mogelijk in Loenen aan de Vecht, mits het ontwerp past binnen de welstandscriteria en het karakter van de omgeving. In sommige gebieden zoals het centrum en landgoederen gelden strengere eisen. Wij adviseren vooraf over de architectonische mogelijkheden per kavel.'
            },
            {
                question: 'Hoe zit het met de bereikbaarheid van Loenen aan de Vecht?',
                answer: 'Loenen aan de Vecht ligt strategisch tussen Amsterdam (25 min) en Utrecht (20 min) via de A2. De combinatie van landelijke rust en stedelijke bereikbaarheid maakt het een zeer gewilde locatie voor nieuwbouw. Ook het openbaar vervoer is goed geregeld met busverbindingen naar Breukelen en Utrecht.'
            }
        ],
        'Hilversum': [
            {
                question: 'Welke architectuurstijl past bij Hilversum?',
                answer: 'Hilversum staat bekend om de Dudok-architectuur en heeft een rijke architectonische geschiedenis. Moderne interpretaties van deze stijl worden vaak gewaardeerd door de welstandscommissie. Wij hebben ervaring met diverse architectuurstijlen in Hilversum en adviseren u over wat past bij uw kavel en de omgeving.'
            }
        ],
        'Breukelen': [
            {
                question: 'Kan ik bouwen aan de Vecht in Breukelen?',
                answer: 'Kavels aan de Vecht in Breukelen zijn zeer gewild en schaars. Er gelden specifieke eisen voor bouwen in het beschermd dorpsgezicht en nabij de rivier. Wij monitoren actief wanneer er kavels beschikbaar komen en kennen de specifieke bouwmogelijkheden per locatie.'
            }
        ]
    };

    // Return city-specific FAQs if available, otherwise return base FAQs
    return citySpecificFAQs[cityName] || baseFAQs;
};

// Generate FAQ Schema.org structured data
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
