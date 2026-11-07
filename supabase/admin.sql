-- Les adresses listées ici deviennent administrateur à l'inscription
create table if not exists public.admin_emails (email text primary key);
alter table public.admin_emails enable row level security;
insert into public.admin_emails (email) values ('bach.amk2705@gmail.com') on conflict do nothing;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, is_admin)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone',
          exists (select 1 from public.admin_emails a where lower(a.email) = lower(new.email)))
  on conflict (id) do nothing;
  return new;
end $$;

-- Si le compte existe déjà : on le passe admin tout de suite
update public.profiles p set is_admin = true
from auth.users u where u.id = p.id and lower(u.email) in (select lower(email) from public.admin_emails);
