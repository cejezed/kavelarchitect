-- Add site-specific SEO copy fields for KavelArchitect and Zwijsen
alter table public.listings
add column if not exists seo_title_ka text,
add column if not exists seo_summary_ka text,
add column if not exists seo_article_html_ka text,
add column if not exists seo_title_zw text,
add column if not exists seo_summary_zw text,
add column if not exists seo_article_html_zw text;
