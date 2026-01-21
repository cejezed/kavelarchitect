import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/bedankt/', '/betaling/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/bedankt/', '/betaling/'],
                crawlDelay: 0,
            },
        ],
        sitemap: 'https://kavelarchitect.nl/sitemap.xml',
        host: 'https://kavelarchitect.nl',
    };
}
