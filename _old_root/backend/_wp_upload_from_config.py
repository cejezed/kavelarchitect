import yaml, os
from brikx.wordpress_client import WordPressClient

cfg = yaml.safe_load(open('config.yaml', encoding='utf-8'))
wp = cfg['wordpress']
client = WordPressClient(wp['base_url'], wp['username'], wp['application_password'])
me = client.whoami()
print('Ingelogd als:', me.get('name') or me.get('slug'), me.get('id'))

img = r'''E:\Funda Wordpress\artifacts\maps\geoapify_test.png'''
media = client.upload_media(img, title='Testkaart')
print('Media:', media.get('id'), media.get('source_url') or media.get('guid',{}).get('rendered'))

post = client.create_post(
    title='Upload test – kaart',
    content='<p>Upload test met uitgelichte afbeelding + kaart.</p>',
    status='draft',
    featured_media=media.get('id')
)
print('Post:', post.get('id'), post.get('link'))