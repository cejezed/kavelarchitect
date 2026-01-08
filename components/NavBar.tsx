import NavBarClient from './NavBarClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCitySlug, getProvinceForCity, groupCitiesByProvince, type City } from '@/lib/regions';

export default async function NavBar() {
  const { data: cityData } = await supabaseAdmin
    .from('listings')
    .select('plaats')
    .eq('status', 'published');

  const cityCounts = new Map<string, number>();
  cityData?.forEach((item) => {
    if (!item.plaats) return;
    cityCounts.set(item.plaats, (cityCounts.get(item.plaats) || 0) + 1);
  });

  const uniqueCityNames = Array.from(cityCounts.keys()).sort((a, b) => a.localeCompare(b, 'nl'));

  const cities: City[] = uniqueCityNames.map((cityName) => ({
    name: cityName,
    slug: getCitySlug(cityName),
    provincie: getProvinceForCity(cityName),
    count: cityCounts.get(cityName) || 0,
  }));

  const citiesByProvince = groupCitiesByProvince(cities);
  const topCities = [...cities]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'nl'))
    .slice(0, 12);

  return <NavBarClient citiesByProvince={citiesByProvince} topCities={topCities} />;
}
