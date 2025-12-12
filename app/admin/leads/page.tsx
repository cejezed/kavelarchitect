'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ExternalLink, AlertTriangle, Flame, Snowflake, Search } from 'lucide-react';

interface Customer {
    klant_id: string;
    naam: string;
    email: string;
    telefoonnummer?: string;
    provincies: string[] | string;
    min_oppervlakte: number;
    bouwbudget: string;
    bouwstijl: string;
    tijdslijn: string;
    kavel_type: string;
    opmerkingen?: string;
    early_access_rapport: boolean;
    created_at: string;
    status: string;
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/customers');
            const data = await response.json();
            // Ensure data is array
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLeadScore = (lead: Customer) => {
        // Cleaning budget string to number for comparison
        let budgetVal = 0;
        if (lead.bouwbudget) {
            if (lead.bouwbudget.includes('2m+')) budgetVal = 2000000;
            else if (lead.bouwbudget.includes('1m-2m')) budgetVal = 1500000;
            else if (lead.bouwbudget.includes('500k-1m')) budgetVal = 750000;
            else if (lead.bouwbudget.includes('<500k')) budgetVal = 400000;
        }

        // Hot Lead Logic
        const isHot = budgetVal >= 1000000 || lead.tijdslijn === '0-6 maanden';

        // Cold Lead Logic
        const isCold = budgetVal < 500000 && lead.tijdslijn === '> 12 maanden';

        if (isHot) return 'hot';
        if (isCold) return 'cold';
        return 'warm';
    };

    const filteredLeads = leads.filter(lead =>
        (lead.naam?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (lead.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link href="/admin/status" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                            <ArrowLeft size={16} className="mr-2" /> Terug naar Status Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Leads & Aanmeldingen</h1>
                        <p className="text-slate-600 mt-2">Overzicht van alle KavelAlert inschrijvingen</p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Zoek op naam of email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Laden...</div>
                    ) : filteredLeads.map((lead) => {
                        const score = getLeadScore(lead);
                        return (
                            <div key={lead.klant_id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {score === 'hot' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Flame size={12} className="mr-1" /> Hot Lead</span>}
                                            {score === 'cold' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Snowflake size={12} className="mr-1" /> Cold Lead</span>}
                                            {score === 'warm' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Warm Lead</span>}
                                            <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{lead.naam}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                                            <a href={`mailto:${lead.email}`} className="flex items-center hover:text-blue-600"><Mail size={16} className="mr-1.5" /> {lead.email}</a>
                                            {lead.telefoonnummer && <a href={`tel:${lead.telefoonnummer}`} className="flex items-center hover:text-blue-600"><Phone size={16} className="mr-1.5" /> {lead.telefoonnummer}</a>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-sm border border-slate-100">
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Zoekprofiel</p>
                                                <div className="space-y-1">
                                                    <p className="flex items-center"><MapPin size={14} className="mr-2 text-slate-400" /> {Array.isArray(lead.provincies) ? lead.provincies.join(', ') : lead.provincies}</p>
                                                    <p className="flex items-center"><AlertTriangle size={14} className="mr-2 text-slate-400" /> Min. {lead.min_oppervlakte}m²</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Status & Budget</p>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-slate-900">Budget: {lead.bouwbudget}</p>
                                                    <p className="flex items-center text-slate-600"><Calendar size={14} className="mr-2 text-slate-400" /> {lead.tijdslijn}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {lead.opmerkingen && (
                                            <div className="mt-4 text-sm text-slate-600 bg-yellow-50 p-3 rounded border border-yellow-100">
                                                <strong>Opmerking:</strong> {lead.opmerkingen}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[150px]">
                                        <div className="text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${lead.early_access_rapport ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                                {lead.early_access_rapport ? 'Rapport: JA' : 'Rapport: NEE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
