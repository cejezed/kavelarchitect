alter table public.listings
    add column if not exists lat double precision,
    add column if not exists lng double precision;

create index if not exists listings_lat_lng_idx on public.listings (lat, lng);
