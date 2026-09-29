-- Avisos (campana). Por ahora un tipo: "te compartieron notas".
--
-- Los crea la base con un trigger al insertar un permiso en `note_grants`:
-- ningún cliente puede crear avisos, así que no se pueden falsificar. El
-- destinatario va por email para cubrir a quien todavía no tiene cuenta.

create table public.notifications (
  id              uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  kind            text not null check (kind in ('note_shared')),
  actor_id        uuid references auth.users (id) on delete cascade,
  -- Copia del email del que comparte: el aviso se sigue entendiendo aunque
  -- después revoque (y ya no se pueda leer su perfil).
  actor_email     text not null,
  -- null cuando se revocó el permiso: el aviso queda como "ya no tenés acceso".
  grant_id        uuid references public.note_grants (id) on delete set null,
  -- null = compartió todas sus notas.
  entry_slug      text,
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);

create index notifications_recipient_idx on public.notifications (recipient_email, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications: el destinatario lee las suyas"
  on public.notifications for select to authenticated
  using (recipient_email = lower((select auth.jwt() ->> 'email')));

create policy "notifications: el destinatario las marca como leídas"
  on public.notifications for update to authenticated
  using (recipient_email = lower((select auth.jwt() ->> 'email')))
  with check (recipient_email = lower((select auth.jwt() ->> 'email')));

-- Los clientes sólo pueden cambiar `read_at`; ni crear ni borrar.
revoke all on public.notifications from anon, authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

create function public.notify_note_shared()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (recipient_email, kind, actor_id, actor_email, grant_id, entry_slug)
  values (new.grantee_email, 'note_shared', new.owner_id, new.owner_email, new.id, new.entry_slug);
  return new;
end;
$$;

revoke execute on function public.notify_note_shared() from public, anon, authenticated;

create trigger note_grants_notify
  after insert on public.note_grants
  for each row execute function public.notify_note_shared();

-- Limpieza diaria: los leídos hace más de 90 días.
create extension if not exists pg_cron;

select cron.schedule(
  'notifications-cleanup',
  '0 4 * * *',
  $$delete from public.notifications where read_at < now() - interval '90 days'$$
);
