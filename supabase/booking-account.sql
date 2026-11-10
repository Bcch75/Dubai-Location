-- Options en plus (transfert…) et horaires de départ des activités
alter table public.activities add column if not exists extras jsonb not null default '[]';
alter table public.activities add column if not exists time_slots text[] not null default '{}';
-- Détail de la réservation (heure, durée, options en plus)
alter table public.order_items add column if not exists details jsonb;

-- Suppression de son propre compte (commandes, favoris et profil supprimés en cascade)
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
