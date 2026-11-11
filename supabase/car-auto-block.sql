-- Une location de voiture confirmée bloque automatiquement ses dates (et les libère si elle est annulée)
alter table public.blocked_dates add column if not exists order_id bigint references public.orders(id) on delete cascade;

create or replace function public.sync_car_blocks() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.blocked_dates where order_id = new.id;
  if new.status in ('confirmed', 'done') then
    insert into public.blocked_dates (item_type, item_slug, day, note, order_id)
    select 'car', i.item_slug, d::date, 'Réservation n°' || new.id, new.id
    from public.order_items i
    cross join lateral generate_series(i.date, coalesce(i.end_date, i.date), interval '1 day') d
    where i.order_id = new.id and i.item_type = 'car' and i.date is not null
    on conflict (item_type, item_slug, day) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists orders_car_blocks on public.orders;
create trigger orders_car_blocks after insert or update of status on public.orders
  for each row execute function public.sync_car_blocks();

-- Réservations déjà confirmées : on bloque leurs dates maintenant
update public.orders set status = status where status in ('confirmed', 'done');
