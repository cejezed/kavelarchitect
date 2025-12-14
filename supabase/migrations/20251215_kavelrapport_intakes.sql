-- Create table for KavelRapport intakes (plots and existing properties)
create table if not exists public.kavelrapport_intakes (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    analysis_type text not null check (analysis_type in ('plot', 'existing_property')),
    address text not null,
    link text not null,
    stage text not null check (stage in ('orientation', 'considering_offer', 'offer_made')),
    time_horizon text not null check (time_horizon in ('0_6', '6_12', '12_plus')),
    email text not null,
    goal text null check (goal in ('renovate', 'rebuild', 'unsure')),
    notes text null,
    status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'archived'))
);

create index if not exists kavelrapport_intakes_created_at_idx on public.kavelrapport_intakes (created_at desc);
