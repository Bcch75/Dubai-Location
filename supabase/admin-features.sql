-- ═══════════════════════════════════════════════════════════
--  Fonctions admin : calendrier, dates complètes, promos, réglages, statistiques
--  (aucune donnée client n'est envoyée à un service extérieur)
-- ═══════════════════════════════════════════════════════════

-- ───── Réglages du site (lisibles par tous, modifiables par l'admin)
create table if not exists public.settings (id int primary key default 1 check (id = 1), data jsonb not null default '{}');
alter table public.settings enable row level security;
drop policy if exists "settings: lecture" on public.settings;
create policy "settings: lecture" on public.settings for select using (true);
drop policy if exists "settings: admin" on public.settings;
create policy "settings: admin" on public.settings for all using (public.is_admin()) with check (public.is_admin());
insert into public.settings (id, data) values (1, jsonb_build_object(
  'whatsapp', '971569736810', 'phone', '+971 56 973 6810', 'email', 'dubailocation19@gmail.com',
  'hours', '7j/7 · 8h – 23h (heure de Dubaï)', 'hero_title', 'Trouvez et réservez des activités',
  'hero_image', '', 'search_placeholder', 'Destination ou une activité...'
)) on conflict (id) do nothing;

-- ───── Réglages privés (admin uniquement) : lien de republication du site
create table if not exists public.admin_settings (id int primary key default 1 check (id = 1), deploy_hook text);
alter table public.admin_settings enable row level security;
drop policy if exists "admin_settings: admin" on public.admin_settings;
create policy "admin_settings: admin" on public.admin_settings for all using (public.is_admin()) with check (public.is_admin());
insert into public.admin_settings (id) values (1) on conflict (id) do nothing;

-- ───── Dates complètes
create table if not exists public.blocked_dates (
  id bigint generated always as identity primary key,
  item_type text not null check (item_type in ('activity','car')),
  item_slug text not null,
  day date not null,
  note text,
  unique (item_type, item_slug, day)
);
alter table public.blocked_dates enable row level security;
drop policy if exists "bloqué: lecture" on public.blocked_dates;
create policy "bloqué: lecture" on public.blocked_dates for select using (true);
drop policy if exists "bloqué: admin" on public.blocked_dates;
create policy "bloqué: admin" on public.blocked_dates for all using (public.is_admin()) with check (public.is_admin());

-- ───── Codes promo (non lisibles par le public : vérifiés par une fonction)
create table if not exists public.promo_codes (
  code text primary key,
  percent int not null check (percent between 1 and 90),
  active boolean not null default true,
  expires_on date,
  max_uses int,
  uses int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.promo_codes enable row level security;
drop policy if exists "promo: admin" on public.promo_codes;
create policy "promo: admin" on public.promo_codes for all using (public.is_admin()) with check (public.is_admin());
create or replace function public.check_promo(p_code text) returns int
language sql stable security definer set search_path = public as $$
  select percent from public.promo_codes
  where upper(code) = upper(trim(p_code)) and active
    and (expires_on is null or expires_on >= current_date)
    and (max_uses is null or uses < max_uses)
$$;
grant execute on function public.check_promo(text) to anon, authenticated;

alter table public.orders add column if not exists promo_code text;
alter table public.orders add column if not exists discount_percent int;

-- ───── Finalisation d'une commande : vérifie et compte le code promo
create or replace function public.finalize_order(p_order bigint) returns void
language plpgsql security definer set search_path = public as $$
declare o record; pct int;
begin
  select * into o from public.orders where id = p_order and user_id = auth.uid();
  if not found then raise exception 'commande introuvable'; end if;
  if o.promo_code is not null then
    pct := public.check_promo(o.promo_code);
    if pct is null then update public.orders set promo_code = null, discount_percent = null where id = o.id;
    else update public.promo_codes set uses = uses + 1 where upper(code) = upper(o.promo_code); end if;
  end if;
end $$;
grant execute on function public.finalize_order(bigint) to authenticated;

-- ───── Statistiques de visites (anonymes : page, activité, provenance, fuseau horaire)
create table if not exists public.visits (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  path text, item_slug text, source text, tz text
);
alter table public.visits enable row level security;
drop policy if exists "visites: admin" on public.visits;
create policy "visites: admin" on public.visits for select using (public.is_admin());
create or replace function public.log_visit(p_path text, p_slug text, p_source text, p_tz text) returns void
language sql security definer set search_path = public as $$
  insert into public.visits (path, item_slug, source, tz) values (left(p_path, 200), left(p_slug, 120), left(p_source, 40), left(p_tz, 60));
$$;
grant execute on function public.log_visit(text, text, text, text) to anon, authenticated;

-- ───── Alerte en direct dans l'espace admin (Supabase Realtime sur les commandes)
do $$ begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null; end $$;
