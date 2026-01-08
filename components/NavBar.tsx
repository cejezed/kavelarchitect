import NavBarClient from './NavBarClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type City = {
  name: string;
  slug: string;
  provincie: string;
};

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

export default async function NavBar() {
  const { data: cityData } = await supabaseAdmin
    .from('listings')
    .select('plaats')
    .eq('status', 'published');

  const uniqueCityNames = cityData
    ? Array.from(new Set(cityData.map((item) => item.plaats)))
        .filter(Boolean)
        .sort()
    : [];

  const cities: City[] = uniqueCityNames.map((cityName) => ({
    name: cityName,
    slug: cityName.toLowerCase().replace(/\s+/g, '-'),
    provincie: getProvinceForCity(cityName),
  }));

  const citiesByProvince = cities.reduce((acc, city) => {
    if (!acc[city.provincie]) {
      acc[city.provincie] = [];
    }
    acc[city.provincie].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  return <NavBarClient citiesByProvince={citiesByProvince} />;
}
