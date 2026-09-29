-- Perfil mínimo: un nickname opcional que reemplaza al email cuando se muestran
-- notas compartidas.
--
-- Visibilidad: cada uno ve el suyo, y el invitado ve el de quien le comparte
-- (para mostrar "de <nickname>"). No es público.

create table public.profiles (
  id            uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  nickname      text check (nickname ~ '^[A-Za-z0-9][A-Za-z0-9_.-]{1,22}[A-Za-z0-9]$'),
  -- Cuándo respondió (o salteó) la bienvenida del primer login.
  onboarded_at  timestamptz,
  updated_at    timestamptz not null default now()
);

-- Único sin distinguir mayúsculas: "Draco" y "draco" son el mismo.
create unique index profiles_nickname_unique on public.profiles (lower(nickname));

alter table public.profiles enable row level security;

create policy "profiles: cada uno lee el suyo"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: el invitado lee el de quien le comparte"
  on public.profiles for select to authenticated
  using (
    exists (
      select 1 from public.note_grants g
      where g.owner_id = profiles.id
        and g.grantee_email = lower((select auth.jwt() ->> 'email'))
    )
  );

create policy "profiles: cada uno crea el suyo"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles: cada uno edita el suyo"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke all on public.profiles from anon;
revoke delete, truncate on public.profiles from authenticated;
