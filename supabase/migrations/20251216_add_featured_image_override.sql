-- Optionele override voor uitgelichte afbeelding in WordPress
alter table public.listings
add column if not exists featured_image_url text;
