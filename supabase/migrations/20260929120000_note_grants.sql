-- Fase 2: compartir notas en sólo lectura con personas invitadas por email.
--
-- Un permiso (grant) dice: "el dueño deja leer a <email> sus notas de <entrada>"
-- (o de todas, si entry_slug es null). Nadie más que el dueño puede escribir
-- sus notas: las políticas de UPDATE/INSERT de `notes` no cambian.

create table public.note_grants (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Email del dueño, para mostrarle al invitado quién comparte. Se valida
  -- contra el token en la política de INSERT: no se puede falsear.
  owner_email   text not null default lower(auth.jwt() ->> 'email'),
  grantee_email text not null check (
    grantee_email = lower(grantee_email)
    and grantee_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(grantee_email) <= 320
  ),
  -- null = todas las notas del dueño.
  entry_slug    text check (entry_slug is null or char_length(entry_slug) between 1 and 200),
  created_at    timestamptz not null default now(),
  constraint note_grants_not_self check (grantee_email <> owner_email),
  constraint note_grants_unique unique nulls not distinct (owner_id, grantee_email, entry_slug)
);

create index note_grants_grantee_idx on public.note_grants (grantee_email, owner_id);

alter table public.note_grants enable row level security;

create policy "grants: el dueño y el invitado leen"
  on public.note_grants for select to authenticated
  using (
    (select auth.uid()) = owner_id
    or grantee_email = lower((select auth.jwt() ->> 'email'))
  );

create policy "grants: el dueño crea"
  on public.note_grants for insert to authenticated
  with check (
    (select auth.uid()) = owner_id
    and owner_email = lower((select auth.jwt() ->> 'email'))
  );

create policy "grants: el dueño revoca"
  on public.note_grants for delete to authenticated
  using ((select auth.uid()) = owner_id);

-- Sin UPDATE: para cambiar un permiso se revoca y se crea otro.
revoke all on public.note_grants from anon;
revoke update, truncate on public.note_grants from authenticated;

-- Lectura de notas ajenas: sólo con un permiso vigente para mi email que cubra
-- esa entrada, y nunca las borradas.
create policy "notes: lectura compartida"
  on public.notes for select to authenticated
  using (
    deleted_at is null
    and exists (
      select 1
      from public.note_grants g
      where g.owner_id = notes.owner_id
        and g.grantee_email = lower((select auth.jwt() ->> 'email'))
        and (g.entry_slug is null or g.entry_slug = notes.entry_slug)
    )
  );
