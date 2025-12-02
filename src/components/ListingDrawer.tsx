
import React, { useState } from 'react';
import { Listing } from '../types';
import { X, ExternalLink, Building2, Send, Trash2, Check, AlertCircle, CheckCircle2, Map as MapIcon, MapPin, Globe } from 'lucide-react';
import { api } from '../services/api';

interface ListingDrawerProps {
    listing: Listing | null;
    onClose: () => void;
    onProcessed: () => void;
}

export const ListingDrawer: React.FC<ListingDrawerProps> = ({ listing, onClose, onProcessed }) => {
    const [selectedSites, setSelectedSites] = useState<string[]>(['kavelarchitect', 'zwijsen']);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');

    // Reset state when listing changes
    React.useEffect(() => {
        if (listing) {
            setSuccessMessage(null);
            setSelectedSites(['kavelarchitect', 'zwijsen']);
            setMapType('satellite'); // Default to satellite for land plots
        }
    }, [listing]);

    if (!listing) return null;

    const toggleSite = (site: string) => {
        setSelectedSites(prev =>
            prev.includes(site) ? prev.filter(s => s !== site) : [...prev, site]
        );
    };

    const handlePublish = async () => {
        if (selectedSites.length === 0) return;
        setIsPublishing(true);
        setSuccessMessage(null);
        try {
            const result = await api.publishListing(listing.kavel_id, selectedSites);

            if (result.success) {
                setSuccessMessage(result.message);
                // Wait a moment so user can read message before closing
                setTimeout(() => {
                    onProcessed();
                    onClose();
                }, 2500);
            } else {
                alert('Fout: ' + result.message);
            }
        } catch (e) {
            console.error(e);
            alert('Er is iets misgegaan bij het publiceren.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleSkip = async () => {
        if (!confirm('Weet je zeker dat je deze kavel wilt overslaan?')) return;
        setIsSkipping(true);
        try {
            await api.skipListing(listing.kavel_id);
            onProcessed();
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSkipping(false);
        }
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
    const pricePerSqm = listing.oppervlakte > 0 ? listing.prijs / listing.oppervlakte : 0;

    // Google Maps URL construction
    // t=m (map), t=k (satellite), t=h (hybrid)
    // z=19 (zoom level suitable for plots)
    const mapTypeParam = mapType === 'satellite' ? 'h' : 'm';
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(listing.adres + ' ' + listing.plaats)}&t=${mapTypeParam}&z=19&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-2xl w-full flex">
                <div className="h-full w-full bg-white shadow-2xl flex flex-col transform transition-transform">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Details & Publicatie</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1 rounded">ID: {listing.kavel_id.slice(0, 8)}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">

                        {successMessage && (
                            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Publicatie Geslaagd!</h3>
                                <p className="text-slate-600 max-w-sm">{successMessage}</p>
                                <p className="text-sm text-slate-400 mt-8">Venster sluit automatisch...</p>
                            </div>
                        )}

                        {/* 1. Quick Stats Banner (Editable) */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <label className="block text-xs font-uppercase text-slate-400 font-semibold tracking-wider mb-1">Vraagprijs (€)</label>
                                <input
                                    type="number"
                                    className="w-full text-lg font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:border-blue-500 focus:ring-0 px-0 py-1"
                                    defaultValue={listing.prijs}
                                    onChange={(e) => listing.prijs = parseInt(e.target.value) || 0}
                                />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <label className="block text-xs font-uppercase text-slate-400 font-semibold tracking-wider mb-1">Oppervlakte (m²)</label>
                                <input
                                    type="number"
                                    className="w-full text-lg font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:border-blue-500 focus:ring-0 px-0 py-1"
                                    defaultValue={listing.oppervlakte}
                                    onChange={(e) => listing.oppervlakte = parseInt(e.target.value) || 0}
                                />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <span className="text-xs font-uppercase text-slate-400 font-semibold tracking-wider">Prijs / m²</span>
                                <div className="text-xl md:text-2xl font-bold text-blue-600">{formatPrice(pricePerSqm)}</div>
                            </div>
                        </div>

                        {/* 2. MAP & LOCATION SECTION (Editable) */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 flex items-center"><MapPin size={16} className="mr-2" /> Locatie & Omgeving</h3>

                                {/* Map Toggle Controls */}
                                <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium">
                                    <button
                                        onClick={() => setMapType('roadmap')}
                                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${mapType === 'roadmap' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <MapIcon size={14} /> Kaart
                                    </button>
                                    <button
                                        onClick={() => setMapType('satellite')}
                                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${mapType === 'satellite' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Globe size={14} /> Satelliet
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-100 rounded-xl overflow-hidden h-72 flex items-center justify-center border border-slate-200 relative shadow-inner">
                                {listing.map_url ? (
                                    <img src={listing.map_url} alt="Locatie kaart" className="w-full h-full object-cover" />
                                ) : (
                                    // Fallback to Google Maps Embed
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={mapSrc}
                                    ></iframe>
                                )}
                            </div>

                            {/* Editable Address Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-slate-500">Adres</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.adres}
                                        onChange={(e) => listing.adres = e.target.value}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500">Postcode</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.postcode}
                                        onChange={(e) => listing.postcode = e.target.value}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500">Plaats</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.plaats}
                                        onChange={(e) => listing.plaats = e.target.value}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500">Provincie</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.provincie}
                                        onChange={(e) => listing.provincie = e.target.value}
                                    >
                                        <option value="Noord-Holland">Noord-Holland</option>
                                        <option value="Zuid-Holland">Zuid-Holland</option>
                                        <option value="Utrecht">Utrecht</option>
                                        <option value="Flevoland">Flevoland</option>
                                        <option value="Gelderland">Gelderland</option>
                                        <option value="Overijssel">Overijssel</option>
                                        <option value="Drenthe">Drenthe</option>
                                        <option value="Groningen">Groningen</option>
                                        <option value="Friesland">Friesland</option>
                                        <option value="Noord-Brabant">Noord-Brabant</option>
                                        <option value="Limburg">Limburg</option>
                                        <option value="Zeeland">Zeeland</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. Main Image Preview (if available and not same as map) */}
                        {listing.image_url && (
                            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                <img src={listing.image_url} alt="Kavel Foto" className="w-full h-48 object-cover" />
                            </div>
                        )}

                        {/* 4. Basic Info & Link */}
                        <div>
                            <a
                                href={listing.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Bekijk origineel op Funda <ExternalLink size={14} className="ml-1" />
                            </a>
                        </div>

                        {/* 5. AI Content & Building Specs (Editable) */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                        Perplexity Analyse
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-700 ml-3">Bouwregels & Content</h4>
                                </div>
                            </div>

                            {/* Building Specs Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Goothoogte (m)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.specs?.goothoogte || ''}
                                        placeholder="bv. 6.0"
                                        onChange={(e) => {
                                            // In a real app, update local state here
                                            if (!listing.specs) listing.specs = {};
                                            listing.specs.goothoogte = parseFloat(e.target.value);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Nokhoogte (m)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.specs?.nokhoogte || ''}
                                        placeholder="bv. 9.0"
                                        onChange={(e) => {
                                            if (!listing.specs) listing.specs = {};
                                            listing.specs.nokhoogte = parseFloat(e.target.value);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Volume (m³)</label>
                                    <input
                                        type="number"
                                        className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={listing.specs?.volume || ''}
                                        placeholder="bv. 750"
                                        onChange={(e) => {
                                            if (!listing.specs) listing.specs = {};
                                            listing.specs.volume = parseFloat(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Regulations Text Area */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Bestemmingsplan / Regels</label>
                                <textarea
                                    className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20"
                                    defaultValue={listing.specs?.regulations || ''}
                                    placeholder="Korte samenvatting van de bouwregels..."
                                    onChange={(e) => {
                                        if (!listing.specs) listing.specs = {};
                                        listing.specs.regulations = e.target.value;
                                    }}
                                />
                            </div>

                            <div className="h-px bg-slate-200 my-2"></div>

                            {/* SEO Content Editable */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">SEO Titel</label>
                                <input
                                    type="text"
                                    className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-medium"
                                    defaultValue={listing.seo_title || ''}
                                    onChange={(e) => listing.seo_title = e.target.value}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">SEO Samenvatting</label>
                                <textarea
                                    className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
                                    defaultValue={listing.seo_summary || ''}
                                    onChange={(e) => listing.seo_summary = e.target.value}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">SEO Artikel (HTML)</label>
                                <textarea
                                    className="w-full text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-64 font-mono"
                                    defaultValue={listing.seo_article_html || ''}
                                    onChange={(e) => listing.seo_article_html = e.target.value}
                                    placeholder="<p>Schrijf hier je artikel...</p>"
                                />
                                <p className="text-xs text-slate-400 mt-1">Gebruik HTML tags zoals &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt; voor opmaak.</p>
                            </div>
                        </div>

                        {/* 6. Customer Matches */}
                        {listing.potential_matches.length > 0 && (
                            <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-5">
                                <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                                    <Building2 size={16} className="mr-2" />
                                    Gevonden Matches ({listing.potential_matches.length})
                                </h4>
                                <ul className="space-y-2">
                                    {listing.potential_matches.map(match => (
                                        <li key={match.klant_id} className="flex justify-between items-center bg-white p-2 rounded border border-indigo-100 text-sm">
                                            <span className="font-medium text-slate-700">{match.naam}</span>
                                            <span className="text-slate-500 text-xs">{match.email}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-indigo-700 mt-3 flex items-center">
                                    <AlertCircle size={12} className="mr-1" />
                                    Klanten ontvangen automatisch bericht na publicatie.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">

                        {/* Image Preview for Publish */}
                        <div className="mb-4 flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                                {listing.image_url ? (
                                    <img src={listing.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={listing.map_url || `https://maps.google.com/maps/api/staticmap?center=${listing.lat},${listing.lon}&zoom=19&size=100x100&maptype=satellite&sensor=false`} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Map'} />
                                )}
                            </div>
                            <p>
                                <span className="font-bold">Uitgelichte afbeelding:</span> {listing.image_url ? 'Funda Foto' : 'Satelliet Kaart'} wordt gebruikt op WordPress.
                            </p>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Publicatie instellingen</h4>

                        <div className="flex gap-4 mb-6">
                            <label className={`flex-1 flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSites.includes('kavelarchitect') ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedSites.includes('kavelarchitect')}
                                    onChange={() => toggleSite('kavelarchitect')}
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${selectedSites.includes('kavelarchitect') ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                                    {selectedSites.includes('kavelarchitect') && <Check size={14} className="text-white" />}
                                </div>
                                <div>
                                    <span className="block font-bold text-sm text-slate-900">KavelArchitect.nl</span>
                                    <span className="block text-xs text-slate-500">Niche focus</span>
                                </div>
                            </label>

                            <label className={`flex-1 flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSites.includes('zwijsen') ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedSites.includes('zwijsen')}
                                    onChange={() => toggleSite('zwijsen')}
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${selectedSites.includes('zwijsen') ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                                    {selectedSites.includes('zwijsen') && <Check size={14} className="text-white" />}
                                </div>
                                <div>
                                    <span className="block font-bold text-sm text-slate-900">Zwijsen.net</span>
                                    <span className="block text-xs text-slate-500">Hoofdbrand</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSkip}
                                disabled={isSkipping || isPublishing || !!successMessage}
                                className="px-4 py-3 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 hover:text-red-600 transition-colors flex items-center"
                                title="Verwijder uit lijst"
                            >
                                <Trash2 size={18} />
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        await api.updateListing(listing.kavel_id, {
                                            specs: listing.specs,
                                            seo_title: listing.seo_title,
                                            seo_summary: listing.seo_summary,
                                            seo_article_html: listing.seo_article_html,
                                            prijs: listing.prijs,
                                            oppervlakte: listing.oppervlakte,
                                            adres: listing.adres,
                                            plaats: listing.plaats,
                                            postcode: listing.postcode,
                                            provincie: listing.provincie
                                        });
                                        // Show small toast or feedback
                                        const btn = document.getElementById('save-btn');
                                        if (btn) {
                                            const originalText = btn.innerHTML;
                                            btn.innerHTML = '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Opgeslagen</span>';
                                            setTimeout(() => btn.innerHTML = originalText, 2000);
                                        }
                                    } catch (e) {
                                        alert('Kon niet opslaan');
                                    }
                                }}
                                id="save-btn"
                                className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center"
                            >
                                Opslaan
                            </button>

                            <button
                                onClick={async () => {
                                    // First save any changes
                                    await api.updateListing(listing.kavel_id, {
                                        specs: listing.specs,
                                        seo_title: listing.seo_title,
                                        seo_summary: listing.seo_summary,
                                        seo_article_html: listing.seo_article_html,
                                        prijs: listing.prijs,
                                        oppervlakte: listing.oppervlakte,
                                        adres: listing.adres,
                                        plaats: listing.plaats,
                                        postcode: listing.postcode,
                                        provincie: listing.provincie
                                    });
                                    // Then publish
                                    handlePublish();
                                }}
                                disabled={isPublishing || isSkipping || selectedSites.length === 0 || !!successMessage}
                                className="flex-1 px-5 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPublishing ? (
                                    <>Publiceren...</>
                                ) : (
                                    <>
                                        <Send size={18} className="mr-2" />
                                        Publiceer & Match
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
