-- Fase 1: notas propias sincronizadas en la nube.
-- Cada usuario sólo ve y escribe sus notas. No hay DELETE: el borrado es lógico
-- (`deleted_at`) para que la sincronización con localStorage lo propague.

create table public.notes (
  id          uuid primary key,
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  entry_slug  text not null check (char_length(entry_slug) between 1 and 200),
  name        text not null check (char_length(name) between 1 and 200),
  body        text not null check (octet_length(body) <= 200000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index notes_owner_updated_idx on public.notes (owner_id, updated_at);

alter table public.notes enable row level security;

create policy "notes: el dueño lee"
  on public.notes for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "notes: el dueño crea"
  on public.notes for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "notes: el dueño modifica"
  on public.notes for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

-- Sin permisos para anon; authenticated sin DELETE.
revoke all on public.notes from anon;
revoke delete, truncate on public.notes from authenticated;
