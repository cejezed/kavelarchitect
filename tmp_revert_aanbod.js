const fs = require('fs');
const path = require('path');

const targetPath = path.join('d:', '_Internetsite', 'kavelarchitect', 'kavelarchitect', 'app', 'aanbod', '[id]', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace('<article className="lg:col-span-2 space-y-12">', '<div className="lg:col-span-2 space-y-12">');
content = content.replace('</article>\n\n        {/* Sidebar CTA */}\n        <aside className="lg:col-span-1">', '</div>\n\n        {/* Sidebar CTA */}\n        <div className="lg:col-span-1">');
content = content.replace('</aside>\n\n      </div>\n\n      <section className="max-w-7xl mx-auto', '</div>\n\n      </div>\n\n      <section className="max-w-7xl mx-auto');

fs.writeFileSync(targetPath, content);
console.log('Revert complete.');
