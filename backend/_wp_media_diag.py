import yaml, os
from brikx.wordpress_client import WordPressClient

cfg = yaml.safe_load(open('config.yaml', 'r', encoding='utf-8'))
wp = WordPressClient(cfg['wordpress']['base_url'], cfg['wordpress']['username'], cfg['wordpress']['application_password'])

me = wp.whoami()
print('Ingelogd als:', me.get('name'), me.get('id'))

img = r'''E:\Funda Wordpress\artifacts\maps\geoapify_test.png'''
media = wp.upload_media(img, title='Testkaart (upload-check)')
print('Media upload OK:', media.get('id'), media.get('source_url'))

post = wp.create_post(
    title='Upload test – kaart als featured',
    content='<p>Dit is een upload-test met uitgelichte afbeelding.</p>',
    status='draft',
    featured_media=media.get('id')
)
print('Post OK:', post.get('id'), post.get('link'))