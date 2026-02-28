import { ImageResponse } from 'next/og';
import { getListing } from '@/lib/api';

export const runtime = 'nodejs'; // Use nodejs to be safe with Supabase imports
export const alt = 'KavelArchitect - Zekerheid bij het kopen van bouwgrond';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const listing = await getListing(params.id);

    if (!listing) {
        return new ImageResponse(
            (
                <div style={{ background: '#0f172a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'white', fontSize: 60, fontFamily: 'sans-serif' }}>Kavel Niet Gevonden</p>
                </div>
            ),
            { ...size }
        );
    }

    const bgImage = listing.image_url || listing.map_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';
    const priceFormatted = typeof listing.prijs === 'number' ? `€ ${listing.prijs.toLocaleString('nl-NL')}` : 'Prijs op aanvraag';
    const locationText = listing.adres && listing.plaats ? `${listing.adres}, ${listing.plaats}` : (listing.plaats || 'Bouwkavel in Nederland');

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    position: 'relative',
                    backgroundColor: '#0f172a',
                }}
            >
                {/* Background Image with Overlay */}
                <img
                    src={bgImage}
                    alt={locationText}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0) 100%)',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '60px',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {/* Badge */}
                    <div
                        style={{
                            display: 'flex',
                            padding: '10px 20px',
                            backgroundColor: listing.status === 'sold' ? '#dc2626' : '#059669',
                            color: 'white',
                            borderRadius: '30px',
                            fontSize: 24,
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {listing.status === 'sold' ? 'Verkocht' : 'Kavel beschikbaar'}
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: 64,
                            fontWeight: 800,
                            color: 'white',
                            fontFamily: 'sans-serif',
                            marginBottom: '10px',
                            lineHeight: 1.1,
                            maxWidth: '900px',
                        }}
                    >
                        {locationText}
                    </h1>

                    {/* Details (Prijs & Oppervlakte) */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                        <div style={{ display: 'flex', color: '#10b981', fontSize: 36, fontWeight: 'bold', fontFamily: 'sans-serif', marginRight: '40px' }}>
                            {priceFormatted}
                        </div>
                        {listing.oppervlakte && (
                            <div style={{ display: 'flex', color: '#cbd5e1', fontSize: 36, fontFamily: 'sans-serif' }}>
                                {listing.oppervlakte} m² perceel
                            </div>
                        )}
                    </div>
                </div>

                {/* Branding Corner */}
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                    }}
                >
                    <span style={{ color: '#0f172a', fontSize: 28, fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                        KavelArchitect
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
