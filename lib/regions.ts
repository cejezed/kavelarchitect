export type City = {
  name: string;
  slug: string;
  provincie: string;
  count?: number;
};

const provinceMap: Record<string, string> = {
  // Noord-Holland
  'amsterdam': 'Noord-Holland',
  'amstelveen': 'Noord-Holland',
  'badhoevedorp': 'Noord-Holland',
  'bentveld': 'Noord-Holland',
  'blaricum': 'Noord-Holland',
  'bloemendaal': 'Noord-Holland',
  'bussum': 'Noord-Holland',
  'castricum': 'Noord-Holland',
  'haarlem': 'Noord-Holland',
  'heemstede': 'Noord-Holland',
  'hilversum': 'Noord-Holland',
  'huizen': 'Noord-Holland',
  'laren': 'Noord-Holland',
  'laren nh': 'Noord-Holland',
  'loosdrecht': 'Noord-Holland',
  'naarden': 'Noord-Holland',
  'oostzaan': 'Noord-Holland',
  'schellinkhout': 'Noord-Holland',
  'warder': 'Noord-Holland',
  'watergang': 'Noord-Holland',
  'weesp': 'Noord-Holland',
  'westzaan': 'Noord-Holland',

  // Zuid-Holland
  'bergambacht': 'Zuid-Holland',
  'bodegraven': 'Zuid-Holland',
  'delft': 'Zuid-Holland',
  'den haag': 'Zuid-Holland',
  'de zilk': 'Zuid-Holland',
  'leiden': 'Zuid-Holland',
  'leidschendam': 'Zuid-Holland',
  'nieuwkoop': 'Zuid-Holland',
  'nieuwerkerk aan den ijssel': 'Zuid-Holland',
  'noordwijk': 'Zuid-Holland',
  'oude wetering': 'Zuid-Holland',
  'reeuwijk': 'Zuid-Holland',
  'rijnsaterwoude': 'Zuid-Holland',
  'rijnsburg': 'Zuid-Holland',
  'rijswijk': 'Zuid-Holland',
  'rotterdam': 'Zuid-Holland',
  'sliedrecht': 'Zuid-Holland',
  'voorburg': 'Zuid-Holland',
  'voorschoten': 'Zuid-Holland',
  'wassenaar': 'Zuid-Holland',
  'zoetermeer': 'Zuid-Holland',

  // Utrecht
  'abcoude': 'Utrecht',
  'amersfoort': 'Utrecht',
  'baarn': 'Utrecht',
  'bilthoven': 'Utrecht',
  'bunnik': 'Utrecht',
  'de bilt': 'Utrecht',
  'de hoef': 'Utrecht',
  'doorn': 'Utrecht',
  'groenekan': 'Utrecht',
  'hollandsche rading': 'Utrecht',
  'houten': 'Utrecht',
  'leersum': 'Utrecht',
  'leusden': 'Utrecht',
  'nieuwegein': 'Utrecht',
  'overberg': 'Utrecht',
  'soest': 'Utrecht',
  'soesterberg': 'Utrecht',
  'utrecht': 'Utrecht',
  'vinkeveen': 'Utrecht',
  'wilnis': 'Utrecht',
  'woerden': 'Utrecht',
  'zeist': 'Utrecht',

  // Noord-Brabant
  'breda': 'Noord-Brabant',
  'eersel': 'Noord-Brabant',
  'eindhoven': 'Noord-Brabant',
  'oisterwijk': 'Noord-Brabant',
  "'s-hertogenbosch": 'Noord-Brabant',
  'tilburg': 'Noord-Brabant',

  // Gelderland
  'apeldoorn': 'Gelderland',
  'arnhem': 'Gelderland',
  'barchem': 'Gelderland',
  'barneveld': 'Gelderland',
  'braamt': 'Gelderland',
  'culemborg': 'Gelderland',
  'dreumel': 'Gelderland',
  'eefde': 'Gelderland',
  'eerbeek': 'Gelderland',
  'epse': 'Gelderland',
  'ermelo': 'Gelderland',
  'harderwijk': 'Gelderland',
  'hengelo ge': 'Gelderland',
  'hoenderloo (gem. apeldoorn)': 'Gelderland',
  'hoenderloo': 'Gelderland',
  'kesteren': 'Gelderland',
  'lunteren': 'Gelderland',
  'nieuwaal': 'Gelderland',
  'nijmegen': 'Gelderland',
  'putten': 'Gelderland',
  'scherpenzeel': 'Gelderland',
  'stroe': 'Gelderland',
  'uddel': 'Gelderland',
  'warnsveld': 'Gelderland',
  'wilp': 'Gelderland',

  // Overijssel
  'bentelo': 'Overijssel',
  'enschede': 'Overijssel',
  'hengelo': 'Overijssel',
  'markelo': 'Overijssel',
  'overdinkel': 'Overijssel',
  'tubbergen': 'Overijssel',
  'zwartsluis': 'Overijssel',
  'zwolle': 'Overijssel',

  // Flevoland
  'almere': 'Flevoland',

  // Drenthe
  'gasselternijveen': 'Drenthe',

  // Groningen
  'groningen': 'Groningen',

  // Friesland
  'leeuwarden': 'Friesland',
};

export function getCitySlug(cityName: string): string {
  return cityName.toLowerCase().replace(/\s+/g, '-');
}

export function getProvinceForCity(cityName: string): string {
  const key = cityName.trim().toLowerCase();
  return provinceMap[key] || 'Overig';
}

export function groupCitiesByProvince(cities: City[]): Record<string, City[]> {
  const grouped = cities.reduce((acc, city) => {
    if (!acc[city.provincie]) {
      acc[city.provincie] = [];
    }
    acc[city.provincie].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  Object.values(grouped).forEach((provinceCities) => {
    provinceCities.sort((a, b) => a.name.localeCompare(b.name, 'nl'));
  });

  return grouped;
}
