'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Listing } from '@/lib/api';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
    iconRetinaUrl: (markerIcon2x as unknown as { src?: string }).src || (markerIcon2x as unknown as string),
    iconUrl: (markerIcon as unknown as { src?: string }).src || (markerIcon as unknown as string),
    shadowUrl: (markerShadow as unknown as { src?: string }).src || (markerShadow as unknown as string),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const defaultCenter: [number, number] = [52.1326, 5.2913]; // Nederland

type Props = {
    listings: Listing[];
};

export function AanbodMapClient({ listings }: Props) {
    const points = useMemo(() => {
        return listings.filter((l) => typeof l.lat === 'number' && typeof l.lng === 'number');
    }, [listings]);

    const center = useMemo<[number, number]>(() => {
        if (points.length === 0) return defaultCenter;
        const avgLat = points.reduce((sum, p) => sum + (p.lat as number), 0) / points.length;
        const avgLng = points.reduce((sum, p) => sum + (p.lng as number), 0) / points.length;
        return [avgLat, avgLng];
    }, [points]);

    const bounds = useMemo<[number, number][] | undefined>(() => {
        if (points.length === 0) return undefined;
        return points.map((p) => [p.lat as number, p.lng as number]);
    }, [points]);

    if (points.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                Nog geen kaartpunten beschikbaar. We voegen de locatiegegevens momenteel toe.
            </div>
        );
    }

    return (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <MapContainer
                center={center}
                bounds={bounds}
                zoom={8}
                scrollWheelZoom={false}
                className="h-[420px] md:h-[520px] w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {points.map((listing) => (
                    <Marker
                        key={listing.kavel_id}
                        position={[listing.lat as number, listing.lng as number]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <div className="font-semibold text-slate-900">{listing.adres}</div>
                                <div className="text-slate-600">{listing.plaats}, {listing.provincie}</div>
                                <div className="mt-2 text-slate-700">
                                    € {listing.prijs?.toLocaleString('nl-NL')} · {listing.oppervlakte} m²
                                </div>
                                <Link
                                    href={`/aanbod/${listing.kavel_id}`}
                                    className="mt-2 inline-block text-navy-900 underline underline-offset-2"
                                >
                                    Bekijk kavel
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
