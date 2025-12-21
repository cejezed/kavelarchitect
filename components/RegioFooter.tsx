import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Helper function to map city name to province
function getProvinceForCity(cityName: string): string {
  const provinceMap: Record<string, string> = {
    // Noord-Holland
    'blaricum': 'Noord-Holland',
    'laren': 'Noord-Holland',
    'hilversum': 'Noord-Holland',
    'huizen': 'Noord-Holland',
    'naarden': 'Noord-Holland',
    'bloemendaal': 'Noord-Holland',
    'heemstede': 'Noord-Holland',
    'haarlem': 'Noord-Holland',
    'amsterdam': 'Noord-Holland',
    'amstelveen': 'Noord-Holland',
    'bussum': 'Noord-Holland',
    'weesp': 'Noord-Holland',

    // Zuid-Holland
    'wassenaar': 'Zuid-Holland',
    'noordwijk': 'Zuid-Holland',
    'voorschoten': 'Zuid-Holland',
    'leidschendam': 'Zuid-Holland',
    'zoetermeer': 'Zuid-Holland',
    'den haag': 'Zuid-Holland',
    'rotterdam': 'Zuid-Holland',
    'leiden': 'Zuid-Holland',
    'delft': 'Zuid-Holland',
    'voorburg': 'Zuid-Holland',
    'rijswijk': 'Zuid-Holland',
    'nieuwkoop': 'Zuid-Holland',

    // Utrecht
    'bunnik': 'Utrecht',
    'de bilt': 'Utrecht',
    'zeist': 'Utrecht',
    'utrecht': 'Utrecht',
    'woerden': 'Utrecht',
    'amersfoort': 'Utrecht',
    'nieuwegein': 'Utrecht',
    'houten': 'Utrecht',

    // Noord-Brabant
    'oisterwijk': 'Noord-Brabant',
    'eersel': 'Noord-Brabant',
    'eindhoven': 'Noord-Brabant',
    'tilburg': 'Noord-Brabant',
    'breda': 'Noord-Brabant',
    's-hertogenbosch': 'Noord-Brabant',

    // Overige provincies
    'arnhem': 'Gelderland',
    'nijmegen': 'Gelderland',
    'apeldoorn': 'Gelderland',
    'enschede': 'Overijssel',
    'zwolle': 'Overijssel',
    'groningen': 'Groningen',
    'leeuwarden': 'Friesland',
  };

  return provinceMap[cityName.toLowerCase()] || 'Overig';
}

export default async function RegioFooter() {
  // Fetch all unique cities from published listings
  const { data: cityData } = await supabaseAdmin
    .from('listings')
    .select('plaats')
    .eq('status', 'published');

  const uniqueCityNames = cityData
    ? Array.from(new Set(cityData.map(item => item.plaats)))
        .filter(Boolean)
        .sort()
    : [];

  // Create city objects with slug and province
  const cities = uniqueCityNames.map(cityName => ({
    name: cityName,
    slug: cityName.toLowerCase().replace(/\s+/g, '-'),
    provincie: getProvinceForCity(cityName)
  }));

  // Group cities by provincie
  const citiesByProvince = cities.reduce((acc, city) => {
    if (!acc[city.provincie]) {
      acc[city.provincie] = [];
    }
    acc[city.provincie].push(city);
    return acc;
  }, {} as Record<string, typeof cities>);

  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Regio Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={24} className="text-blue-400" />
            <h3 className="font-serif text-2xl font-bold">Bouwkavel kopen per regio</h3>
          </div>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Bekijk het actuele aanbod van bouwkavels per gemeente. Ook voor exclusieve off-market kavels
            die niet op Funda staan.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(citiesByProvince).map(([provincie, cities]) => (
              <div key={provincie}>
                <h4 className="font-bold text-blue-400 mb-3 text-sm uppercase tracking-wider">
                  {provincie}
                </h4>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/regio/${city.slug}`}
                        className="text-slate-300 hover:text-white text-sm transition-colors inline-block"
                      >
                        Bouwkavel {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">KavelArchitect</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vind sneller uw ideale bouwkavel met expert begeleiding van Architectenbureau Jules Zwijsen.
              Exclusieve toegang tot off-market kavels.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/aanbod" className="text-slate-400 hover:text-white transition-colors">
                  Kavels
                </Link>
              </li>
              <li>
                <Link href="/diensten" className="text-slate-400 hover:text-white transition-colors">
                  Diensten
                </Link>
              </li>
              <li>
                <Link href="/kennisbank" className="text-slate-400 hover:text-white transition-colors">
                  Kennisbank
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-slate-400 hover:text-white transition-colors">
                  Over Ons
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-slate-400 text-sm">
              Architectenbureau Jules Zwijsen
              <br />
              <a href="mailto:info@kavelarchitect.nl" className="hover:text-white transition-colors">
                info@kavelarchitect.nl
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
          © {new Date().getFullYear()} KavelArchitect - Powered by Architectenbureau Jules Zwijsen
        </div>
      </div>
    </footer>
  );
}
