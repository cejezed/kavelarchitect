from brikx.gmail_client import GmailClient
import yaml, pprint

cfg = yaml.safe_load(open('config.yaml', encoding='utf-8'))
gm = GmailClient(cfg['gmail']['credentials_file'], cfg['gmail']['token_file'])
query = cfg['gmail'].get('query','')
msgs = gm.search_messages(query=query, max_results=10)
print('Gevonden mails:', len(msgs))
t = 0
for i, m in enumerate(msgs, 1):
    urls = gm.extract_funda_urls(m)
    lst  = gm.extract_listings(m)
    print(f'[{i}] detail-urls={len(urls)}  listings={len(lst)}')
    for it in lst:
        print('   -', it['url'], '|', it.get('place'), it.get('price'), it.get('surface'))
        t += 1
print('TOTAL listings:', t)