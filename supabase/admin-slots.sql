-- Créneaux ajoutés par l'admin (réservation par téléphone / WhatsApp)
alter table public.orders add column if not exists source text not null default 'site';

drop function if exists public.admin_add_slot(text,text,text,text,date,date,text,text,text,text,text,int);
create or replace function public.admin_add_slot(
  p_type text, p_slug text, p_title text, p_option text, p_date date, p_end date, p_time text, p_end_time text,
  p_first text, p_last text, p_phone text, p_note text, p_people int default 1
) returns bigint language plpgsql security definer set search_path = public as $$
declare oid bigint;
begin
  if not public.is_admin() then raise exception 'réservé à l''admin'; end if;
  insert into public.orders (user_id, contact_name, contact_phone, notes, status, source)
  values (auth.uid(), trim(coalesce(p_first, '') || ' ' || coalesce(p_last, '')), p_phone, nullif(p_note, ''), 'pending', 'admin')
  returning id into oid;
  insert into public.order_items (order_id, item_type, item_slug, item_title, item_option, date, end_date, people, details)
  values (oid, p_type, p_slug, p_title, nullif(p_option, ''), p_date, case when p_type = 'car' then p_end end, greatest(coalesce(p_people, 1), 1),
          jsonb_build_object('time', nullif(p_time, ''), 'end_time', nullif(p_end_time, ''), 'first_name', p_first, 'last_name', p_last));
  update public.orders set status = 'confirmed' where id = oid;   -- bloque aussi les dates des voitures
  return oid;
end $$;
revoke all on function public.admin_add_slot(text,text,text,text,date,date,text,text,text,text,text,text,int) from public, anon;
grant execute on function public.admin_add_slot(text,text,text,text,date,date,text,text,text,text,text,text,int) to authenticated;

-- Horaires déjà pris pour une activité un jour donné (visible par tous, sans données personnelles)
drop function if exists public.taken_slots(text, date);
create or replace function public.taken_slots(p_slug text, p_day date) returns table (start_time text, end_time text)
language sql stable security definer set search_path = public as $$
  select distinct i.details->>'time', coalesce(i.details->>'end_time', i.details->>'time') from public.order_items i join public.orders o on o.id = i.order_id
  where i.item_type = 'activity' and i.item_slug = p_slug and i.date = p_day
    and o.status in ('confirmed', 'done') and i.details->>'time' is not null;
$$;
grant execute on function public.taken_slots(text, date) to anon, authenticated;
