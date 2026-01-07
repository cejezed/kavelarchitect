'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { RegionFAQ } from '@/lib/region-faq-data';
import { trackFAQInteraction } from '@/lib/analytics';

interface FAQAccordionProps {
    faqs: RegionFAQ[];
    cityName: string;
}

export default function FAQAccordion({ faqs, cityName }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const toggleFAQ = (index: number) => {
        const newIndex = openIndex === index ? null : index;
        setOpenIndex(newIndex);

        // Track FAQ interaction for behavioral signals
        if (newIndex !== null) {
            trackFAQInteraction(faqs[index].question, cityName);
        }
    };

    return (
        <section className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                    Veelgestelde vragen over bouwen in {cityName}
                </h2>
                <p className="text-lg text-slate-600">
                    Antwoorden op de meest gestelde vragen over bouwkavels in {cityName}
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <h3 className="font-bold text-lg text-navy-900 pr-4">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`flex-shrink-0 text-navy-900 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                        }`}
                                    size={24}
                                />
                            </button>

                            <div
                                id={`faq-answer-${index}`}
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 pt-2">
                                    <p className="text-slate-700 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <p className="text-slate-600 mb-4">
                    Heeft u een andere vraag over bouwen in {cityName}?
                </p>
                <a
                    href={`mailto:info@kavelarchitect.nl?subject=Vraag over bouwen in ${cityName}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                >
                    Stel uw vraag
                </a>
            </div>
        </section>
    );
}
