-- Bewaar het WordPress media ID voor een eigen uitgelichte afbeelding
alter table public.listings
add column if not exists featured_media_id integer;
