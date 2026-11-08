-- ═════════ Catégories d'activités (gérées depuis l'espace admin) ═════════
create table if not exists public.categories (
  slug text primary key,
  label text not null,
  icon text,
  subtitle text,
  image_url text,
  position int not null default 100,
  in_menu boolean not null default false,
  on_home boolean not null default true,
  active boolean not null default true
);
alter table public.categories enable row level security;
drop policy if exists "catégories: lecture" on public.categories;
create policy "catégories: lecture" on public.categories for select using (true);
drop policy if exists "catégories: admin" on public.categories;
create policy "catégories: admin" on public.categories for all using (public.is_admin()) with check (public.is_admin());
insert into public.categories (slug, label, icon, subtitle, image_url, position, in_menu, on_home) values
  ('desert', 'Désert', '🏜️', 'Quad, buggy, dîner bédouin : l’aventure au cœur des dunes.', '/img/desert.webp', 10, true, true),
  ('mer', 'Mer & yacht', '🛥️', 'Yacht privé, jet-ski, plongée et croisière à Oman.', '/img/yacht.webp', 20, true, true),
  ('ciel', 'Dans les airs', '🎈', 'Montgolfière et hélicoptère : Dubaï vue du ciel.', '/img/montgolfiere.webp', 30, true, false),
  ('incontournables', 'Incontournables', '🏙️', 'Burj Khalifa, Ski Dubai, parcs d’attractions…', '/img/burj-khalifa.webp', 40, false, true),
  ('excursions', 'Excursions', '🧭', 'Abu Dhabi, Oman : partez à la découverte.', '/img/oman.webp', 50, false, false),
  ('famille', 'En famille', '👨‍👩‍👧', 'Des sorties pour petits et grands.', '/img/dolphin.webp', 60, false, true)
on conflict (slug) do nothing;
