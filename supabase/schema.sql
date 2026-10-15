-- Plataforma Partners Campus EAFIT — esquema del área privada (Supabase)
-- Ejecutar completo en: Supabase → SQL Editor → New query → Run.
-- Es idempotente: se puede volver a ejecutar sin perder datos.

-- ─────────────────────────────────────────────────────────────
-- 1. Miembros autorizados
--    Solo los correos de esta tabla (activos) pueden ver contenido
--    privado. La Junta la mantiene desde /miembros/admin o desde el
--    Table Editor de Supabase.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.miembros (
  email       text primary key check (email = lower(email)),
  nombre      text not null,
  rol         text not null default 'miembro' check (rol in ('miembro', 'junta', 'admin')),
  comite      text,
  estado      text not null default 'activo'
              check (estado in ('nuevo', 'activo', 'honorario', 'licencia', 'practica', 'prueba')),
  telefono    text,
  cargo       text,
  activo      boolean not null default true,
  creado      timestamptz not null default now()
);

create or replace function public.correo_actual() returns text
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function public.es_miembro() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from miembros where email = correo_actual() and activo)
$$;

create or replace function public.es_junta() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from miembros where email = correo_actual() and activo and rol in ('junta', 'admin'))
$$;

alter table public.miembros enable row level security;
drop policy if exists "miembros: leer" on public.miembros;
create policy "miembros: leer" on public.miembros for select using (es_miembro());
drop policy if exists "miembros: junta escribe" on public.miembros;
create policy "miembros: junta escribe" on public.miembros for all using (es_junta()) with check (es_junta());

-- ─────────────────────────────────────────────────────────────
-- 2. Biblioteca interna
-- ─────────────────────────────────────────────────────────────
create table if not exists public.documentos (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  descripcion  text,
  categoria    text not null default 'otros',
  responsable  text,
  actualizado  date not null default current_date,
  vigente      boolean not null default true,
  archivo      text,          -- ruta dentro del bucket "biblioteca"
  enlace       text,          -- o enlace externo (Drive, Canva…)
  subido_por   text default correo_actual(),
  creado       timestamptz not null default now()
);

alter table public.documentos enable row level security;
drop policy if exists "documentos: leer" on public.documentos;
create policy "documentos: leer" on public.documentos for select using (es_miembro());
drop policy if exists "documentos: junta escribe" on public.documentos;
create policy "documentos: junta escribe" on public.documentos for all using (es_junta()) with check (es_junta());

insert into storage.buckets (id, name, public)
values ('biblioteca', 'biblioteca', false)
on conflict (id) do nothing;

drop policy if exists "biblioteca: leer" on storage.objects;
create policy "biblioteca: leer" on storage.objects for select
  using (bucket_id = 'biblioteca' and public.es_miembro());
drop policy if exists "biblioteca: junta sube" on storage.objects;
create policy "biblioteca: junta sube" on storage.objects for insert
  with check (bucket_id = 'biblioteca' and public.es_junta());
drop policy if exists "biblioteca: junta edita" on storage.objects;
create policy "biblioteca: junta edita" on storage.objects for update
  using (bucket_id = 'biblioteca' and public.es_junta());
drop policy if exists "biblioteca: junta borra" on storage.objects;
create policy "biblioteca: junta borra" on storage.objects for delete
  using (bucket_id = 'biblioteca' and public.es_junta());

-- ─────────────────────────────────────────────────────────────
-- 3. Seguimiento de participación (tabla de permanencia)
--    Cada miembro ve solo sus registros; la Junta ve y registra todos.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.participacion (
  id             uuid primary key default gen_random_uuid(),
  email          text not null references public.miembros (email) on update cascade on delete cascade,
  semestre       text not null,            -- ej. 2026-2
  fecha          date not null default current_date,
  actividad      text not null,
  tipo           text not null default 'asistencia'
                 check (tipo in ('asistencia', 'comite', 'evento', 'asamblea', 'excusa', 'falta')),
  puntos         numeric not null default 0,
  nota           text,
  registrado_por text default correo_actual(),
  creado         timestamptz not null default now()
);

alter table public.participacion enable row level security;
drop policy if exists "participacion: leer propia" on public.participacion;
create policy "participacion: leer propia" on public.participacion for select
  using (email = correo_actual() or es_junta());
drop policy if exists "participacion: junta escribe" on public.participacion;
create policy "participacion: junta escribe" on public.participacion for all
  using (es_junta()) with check (es_junta());

-- ─────────────────────────────────────────────────────────────
-- 4. Primer administrador
--    Cambia el correo y ejecuta esta línea una sola vez.
-- ─────────────────────────────────────────────────────────────
-- insert into public.miembros (email, nombre, rol, cargo)
-- values ('tu.correo@eafit.edu.co', 'Tu nombre', 'admin', 'Presidencia')
-- on conflict (email) do update set rol = 'admin', activo = true;
