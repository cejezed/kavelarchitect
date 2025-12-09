import os, json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env')
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase = create_client(url, key)

# Find Huizen listing
res = supabase.table('listings').select('kavel_id, adres, plaats, prijs, oppervlakte, specs').eq('plaats', 'Huizen').limit(1).execute()

if res.data:
    l = res.data[0]
    print(f'Kavel: {l.get("adres")}, {l.get("plaats")}')
    print(f'ID: {l.get("kavel_id")}')
    print(f'URL: {l.get("source_url")}')
    print(f'Database prijs: €{l.get("prijs"):,}' if l.get("prijs") else 'Database prijs: None')
    print(f'Database oppervlakte: {l.get("oppervlakte")} m²' if l.get("oppervlakte") else 'Database oppervlakte: None')
    
    specs = l.get('specs', {})
    if isinstance(specs, dict):
        print(f'Lat: {specs.get("lat")}')
        print(f'Lon: {specs.get("lon")}')
        print(f'Map URL: {specs.get("map_url")}')
        
        gmail = specs.get('gmail', {})
        print(f'Gmail URL: {gmail.get("url")}')
        
        pplx = specs.get('perplexity', {})
        
        print(f'\nGmail price: {gmail.get("price")}')
        print(f'Gmail surface: {gmail.get("surface")}')
        print(f'\nPerplexity price: {pplx.get("price")}')
        print(f'Perplexity surface: {pplx.get("surface")}')
else:
    print('No Huizen listing found')
