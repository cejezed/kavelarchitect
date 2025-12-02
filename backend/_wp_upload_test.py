from brikx.wordpress_client import WordPressClient
import os, sys

base = os.getenv('WP_BASE') or 'https://kavelarchitect.nl'   # of hardcode hier
user = os.getenv('WP_USER') or 'JOUW_GEBRUIKERSNAAM'
appw = os.getenv('WP_APPW') or 'JOUW_APP_PASSWORD'

img = r'''E:\Funda Wordpress\artifacts\maps\geoapify_test.png'''
title = 'Upload test – kaart'
content = '<p>Dit is een upload-test met uitgelichte afbeelding.</p>'

wp = WordPressClient(base, user, appw)
me = wp.whoami()
print('Ingelogd als:', me.get('name'), me.get('id'))

media = wp.upload_media(img, title='Testkaart')
print('Media:', media.get('id'), media.get('source_url'))

post = wp.create_post(title=title, content=content, status='draft', featured_media=media.get('id'))
print('Post:', post.get('id'), post.get('link'))