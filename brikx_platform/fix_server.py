with open('e:/Funda Wordpress/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix spaces before > in HTML tags
import re
content = re.sub(r'"\s+>', '">', content)

with open('e:/Funda Wordpress/server.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed HTML tags')
