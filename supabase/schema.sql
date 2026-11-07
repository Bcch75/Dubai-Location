-- ═══════════════════════════════════════════════════════════
--  Dubai Location : schéma de la base Supabase
-- ═══════════════════════════════════════════════════════════

-- Profils (1 par compte)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Crée automatiquement le profil à l'inscription
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- Activités
create table if not exists public.activities (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  categories text[] not null default '{}',
  tagline text,
  description text,
  image_url text,
  image_alt text,
  price integer not null default 0,
  price_from boolean not null default true,
  price_unit text,
  duration text,
  location text,
  highlights text[] not null default '{}',
  options jsonb not null default '[]',
  badge text,
  featured boolean not null default false,
  position integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Voitures
create table if not exists public.cars (
  id bigint generated always as identity primary key,
  slug text unique not null,
  brand text not null,
  model text not null,
  category text not null,
  image_url text,
  seats integer,
  engine text,
  price_per_day integer,
  tag text,
  available boolean not null default true,
  position integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Blog
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  published boolean not null default true,
  published_at timestamptz not null default now()
);

-- Favoris
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('activity','car')),
  item_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_slug)
);

-- Commandes (réservations) + lignes
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','done')),
  contact_name text,
  contact_phone text,
  contact_email text,
  notes text,
  total_estimate integer,
  admin_note text,
  created_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  item_type text not null check (item_type in ('activity','car')),
  item_slug text not null,
  item_title text not null,
  item_option text,
  date date,
  end_date date,
  people integer,
  unit_price integer,
  price_label text
);

-- ═════════ Sécurité (RLS) ═════════
alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.cars enable row level security;
alter table public.posts enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profil: lecture" on public.profiles;
create policy "profil: lecture" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profil: maj" on public.profiles;
create policy "profil: maj" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid()));

do $$ declare t text; begin
  foreach t in array array['activities','cars'] loop
    execute format('drop policy if exists "public: lecture" on public.%I', t);
    execute format('create policy "public: lecture" on public.%I for select using (active or public.is_admin())', t);
    execute format('drop policy if exists "admin: tout" on public.%I', t);
    execute format('create policy "admin: tout" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;
drop policy if exists "public: lecture" on public.posts;
create policy "public: lecture" on public.posts for select using (published or public.is_admin());
drop policy if exists "admin: tout" on public.posts;
create policy "admin: tout" on public.posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "favoris: les miens" on public.favorites;
create policy "favoris: les miens" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "commandes: lecture" on public.orders;
create policy "commandes: lecture" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "commandes: création" on public.orders;
create policy "commandes: création" on public.orders for insert with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "commandes: admin maj" on public.orders;
create policy "commandes: admin maj" on public.orders for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lignes: lecture" on public.order_items;
create policy "lignes: lecture" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
drop policy if exists "lignes: création" on public.order_items;
create policy "lignes: création" on public.order_items for insert with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'pending'));

-- ═════════ Stockage des photos (admin) ═════════
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;
drop policy if exists "images: lecture" on storage.objects;
create policy "images: lecture" on storage.objects for select using (bucket_id = 'images');
drop policy if exists "images: admin" on storage.objects;
create policy "images: admin" on storage.objects for all using (bucket_id = 'images' and public.is_admin()) with check (bucket_id = 'images' and public.is_admin());

-- ═════════ Champs complémentaires (fiche détaillée) ═════════
alter table public.activities add column if not exists old_price integer;
alter table public.activities add column if not exists perk text;
alter table public.activities add column if not exists gallery text[] not null default '{}';
alter table public.activities add column if not exists included text[] not null default '{}';
alter table public.activities add column if not exists excluded text[] not null default '{}';
alter table public.activities add column if not exists important text;
alter table public.activities add column if not exists qty_label text not null default 'Participants';
alter table public.cars add column if not exists perk text;
alter table public.cars add column if not exists old_price integer;
alter table public.cars add column if not exists description text;

-- ═════════ Notes, avis et vidéos (affichés seulement s'ils sont renseignés) ═════════
alter table public.activities add column if not exists rating numeric(2,1);
alter table public.activities add column if not exists reviews_count integer;
alter table public.activities add column if not exists video_url text;
alter table public.cars add column if not exists rating numeric(2,1);
alter table public.cars add column if not exists reviews_count integer;
alter table public.cars add column if not exists video_url text;
