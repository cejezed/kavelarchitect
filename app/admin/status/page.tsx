'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, Search, Users } from 'lucide-react';

interface Listing {
    kavel_id: string;
    adres: string | null;
    plaats: string | null;
    provincie: string | null;
    prijs: number | null;
    status: string;
    created_at: string;
}

export default function AdminStatusPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await fetch('/api/all-listings');
            const data = await response.json();
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (kavelId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/listings/${kavelId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setListings(listings.map(l =>
                    l.kavel_id === kavelId ? { ...l, status: newStatus } : l
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Fout bij updaten status');
        }
    };

    const filteredListings = listings.filter(listing => {
        const matchesSearch = searchQuery === '' ||
            (listing.adres && listing.adres.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (listing.plaats && listing.plaats.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = filterStatus === 'all' || listing.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published': return <CheckCircle className="text-emerald-500" size={20} />;
            case 'sold': return <XCircle className="text-red-500" size={20} />;
            case 'pending': return <Clock className="text-orange-500" size={20} />;
            default: return <Package className="text-slate-400" size={20} />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'published': return 'Beschikbaar';
            case 'sold': return 'Verkocht';
            case 'pending': return 'In behandeling';
            case 'skipped': return 'Overgeslagen';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                        <ArrowLeft size={16} className="mr-2" /> Terug naar home
                    </Link>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Kavel Status Beheer</h1>
                            <p className="text-slate-600 mt-2">Markeer kavels als verkocht of wijzig hun status</p>
                        </div>
                        <Link
                            href="/admin/leads"
                            className="flex items-center px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors shadow-sm"
                        >
                            <Users size={18} className="mr-2" />
                            Bekijk Leads
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Zoek op adres of plaats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Alle statussen</option>
                            <option value="published">Beschikbaar</option>
                            <option value="sold">Verkocht</option>
                            <option value="pending">In behandeling</option>
                            <option value="skipped">Overgeslagen</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-500">Totaal</p>
                        <p className="text-2xl font-bold text-slate-900">{listings.length}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                        <p className="text-sm text-emerald-700">Beschikbaar</p>
                        <p className="text-2xl font-bold text-emerald-900">
                            {listings.filter(l => l.status === 'published').length}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <p className="text-sm text-red-700">Verkocht</p>
                        <p className="text-2xl font-bold text-red-900">
                            {listings.filter(l => l.status === 'sold').length}
                        </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                        <p className="text-sm text-orange-700">In behandeling</p>
                        <p className="text-2xl font-bold text-orange-900">
                            {listings.filter(l => l.status === 'pending').length}
                        </p>
                    </div>
                </div>

                {/* Listings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Laden...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Adres</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Plaats</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Prijs</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Acties</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredListings.map((listing) => (
                                        <tr key={listing.kavel_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(listing.status)}
                                                    <span className="text-sm font-medium">{getStatusLabel(listing.status)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/aanbod/${listing.kavel_id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                    target="_blank"
                                                >
                                                    {listing.adres || `Bouwgrond ${listing.plaats || listing.kavel_id}`}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{listing.plaats}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {listing.prijs ? `€ ${listing.prijs.toLocaleString('nl-NL')}` : 'Op aanvraag'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {listing.status !== 'published' && (
                                                        <button
                                                            onClick={() => updateStatus(listing.kavel_id, 'published')}
                                                            className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                                                        >
                                                            Beschikbaar
                                                        </button>
                                                    )}
                                                    {listing.status !== 'sold' && (
                                                        <button
                                                            onClick={() => updateStatus(listing.kavel_id, 'sold')}
                                                            className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                                        >
                                                            Verkocht
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredListings.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    Geen kavels gevonden
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
