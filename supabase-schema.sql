-- Run this in your Supabase SQL editor

create type website_status as enum ('none', 'bad', 'correct', 'good');
create type prospect_status as enum ('to_visit', 'not_interested', 'to_follow_up', 'meeting_booked', 'client');

create table prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text,
  address text,
  city text,
  phone text,
  google_reviews integer,
  google_rating decimal(2,1),
  website_status website_status,
  status prospect_status not null default 'to_visit',
  visit_date date,
  visit_notes text,
  pitch_argument text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger prospects_updated_at
  before update on prospects
  for each row execute function update_updated_at();

-- Enable Row Level Security (public access since we handle auth via PIN)
alter table prospects enable row level security;

create policy "Allow all" on prospects
  for all
  using (true)
  with check (true);
