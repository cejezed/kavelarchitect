import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCitySlug, getProvinceForCity, groupCitiesByProvince, type City } from '@/lib/regions';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: "Regio's | KavelArchitect - Bouwkavels per regio",
  description: "Overzicht van regio's met bouwkavels in Nederland. Bekijk per provincie alle beschikbare kavels en lokale pagina's.",
  keywords: ['regio', 'bouwkavel', "regio's", 'bouwgrond', 'provincie', 'kavelarchitect'],
  alternates: {
    canonical: 'https://kavelarchitect.nl/regio',
  },
  openGraph: {
    title: "Regio's | KavelArchitect",
    description: "Overzicht van regio's met bouwkavels in Nederland.",
    url: 'https://kavelarchitect.nl/regio',
    siteName: 'KavelArchitect',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Regio's | KavelArchitect",
    description: "Overzicht van regio's met bouwkavels in Nederland.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RegioIndexPage() {
  let cityData: any[] | null = [];
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('plaats')
      .eq('status', 'published');
    cityData = data;
  } catch (error) {
    console.error('RegioIndexPage fetch failed:', error);
  }

  const cityCounts = new Map<string, number>();
  cityData?.forEach((item) => {
    if (!item.plaats) return;
    cityCounts.set(item.plaats, (cityCounts.get(item.plaats) || 0) + 1);
  });

  const cities: City[] = Array.from(cityCounts.keys())
    .sort((a, b) => a.localeCompare(b, 'nl'))
    .map((cityName) => ({
      name: cityName,
      slug: getCitySlug(cityName),
      provincie: getProvinceForCity(cityName),
      count: cityCounts.get(cityName) || 0,
    }));

  const citiesByProvince = groupCitiesByProvince(cities);
  const provinceEntries = Object.entries(citiesByProvince).sort(([a], [b]) => a.localeCompare(b, 'nl'));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kavelarchitect.nl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kavels',
        item: 'https://kavelarchitect.nl/aanbod',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: "Regio's",
        item: 'https://kavelarchitect.nl/regio',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-20 md:pt-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-slate-700">Home</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/aanbod" className="hover:text-slate-700">Kavels</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-slate-700">Regio's</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-slate-900 mb-2">
              Regio's met bouwkavels
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Vind per provincie alle beschikbare regio's en bijbehorende bouwkavels.
            </p>
          </div>
          <Link
            href="/aanbod"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors"
          >
            <MapPin size={16} />
            Bekijk alle kavels
          </Link>
        </div>

        {provinceEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-600">
            Er zijn nog geen regio's beschikbaar. Probeer het later opnieuw.
          </div>
        ) : (
          <div className="grid gap-6">
            {provinceEntries.map(([province, provinceCities]) => {
              const provinceSlug = province.toLowerCase().replace(/\s+/g, '-');
              return (
                <section
                  key={province}
                  id={provinceSlug}
                  className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900">
                      {province}
                    </h2>
                    <span className="text-xs text-slate-500">
                      {provinceCities.length} regio's
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {provinceCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/regio/${city.slug}`}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{city.name}</div>
                          <div className="text-xs text-slate-500">Bouwkavels bekijken</div>
                        </div>
                        {city.count ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                            {city.count}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
