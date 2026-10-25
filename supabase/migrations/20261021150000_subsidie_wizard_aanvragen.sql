-- Kolommen, controles en storage voor de SVOH/ISDE-wizard (app/subsidie/aanvragen/svoh).
-- Het oude formulier (app/subsidie/aanvragen/components/AanvraagForm.jsx) schrijft naar dezelfde
-- tabel en moet blijven werken, dus de oude kolommen blijven bestaan.

-- ─── Kolommen ────────────────────────────────────────────────────────────────
alter table public.subsidie_aanvragen
  add column if not exists aanvrager_type text,
  add column if not exists bron_pad text,
  add column if not exists kvk_nummer text,
  add column if not exists bedrijfsnaam text,
  add column if not exists meer_dan_250 boolean,
  add column if not exists voorletters text,
  add column if not exists tussenvoegsel text,
  add column if not exists geslacht text,
  add column if not exists bsn text,
  add column if not exists iban text,
  add column if not exists woonadres jsonb,
  add column if not exists correspondentieadres jsonb,
  add column if not exists maatregelen jsonb,
  add column if not exists verklaringen_akkoord boolean not null default false,
  add column if not exists subzy_machtiging boolean not null default false;

-- Een bedrijf geeft voorletters in plaats van een voornaam, en de wizard kent
-- meerdere maatregelen (maatregelen jsonb) in plaats van één maatregel.
alter table public.subsidie_aanvragen
  alter column voornaam drop not null,
  alter column maatregel drop not null,
  alter column al_geinstalleerd drop not null;

alter table public.subsidie_aanvragen
  drop constraint if exists subsidie_aanvragen_aanvrager_type_check,
  add constraint subsidie_aanvragen_aanvrager_type_check
    check (aanvrager_type is null or aanvrager_type in ('bedrijf', 'particulier'));

-- Een aanvraag uit de wizard (geen losse maatregel) mag alleen met beide verklaringen.
-- Oude formulier-aanvragen hebben altijd een maatregel en vallen hier buiten.
alter table public.subsidie_aanvragen
  drop constraint if exists subsidie_aanvragen_verklaringen_check,
  add constraint subsidie_aanvragen_verklaringen_check
    check (maatregel is not null or (verklaringen_akkoord and subzy_machtiging));

-- ─── Indienen ook als ingelogde gebruiker ────────────────────────────────────
-- Er stonden twee identieke anon-policies; vervangen door één voor anon en authenticated.
drop policy if exists "Aanvragen indienen" on public.subsidie_aanvragen;
drop policy if exists "anon_insert_subsidie_aanvragen" on public.subsidie_aanvragen;
create policy "Aanvragen indienen" on public.subsidie_aanvragen
  for insert to anon, authenticated
  with check (status = 'nieuw');

-- ─── Storage voor documenten ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'subsidie-documenten',
  'subsidie-documenten',
  false,
  10485760, -- 10 MB, gelijk aan de limiet in Step4
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Bezoekers kunnen subsidie_aanvragen niet lezen, dus de storage-policy kijkt via
-- deze functie of de map hoort bij een aanvraag van het afgelopen uur.
create or replace function public.subsidie_aanvraag_uploadbaar(p_folder text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subsidie_aanvragen
    where id::text = p_folder
      and created_at > now() - interval '1 hour'
  );
$$;

revoke all on function public.subsidie_aanvraag_uploadbaar(text) from public;
grant execute on function public.subsidie_aanvraag_uploadbaar(text) to anon, authenticated;

-- Alleen uploaden (geen lezen, overschrijven of verwijderen) in de map van een verse aanvraag.
drop policy if exists "subsidie-documenten: upload bij aanvraag" on storage.objects;
create policy "subsidie-documenten: upload bij aanvraag" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'subsidie-documenten'
    and public.subsidie_aanvraag_uploadbaar((storage.foldername(name))[1])
  );

-- ─── Toegang voor staff/admin (admin-dashboard) ──────────────────────────────
-- Alleen op rol; een ingelogde portal-klant is ook "authenticated" en mag hier niets zien.
drop policy if exists "Staff leest aanvragen" on public.subsidie_aanvragen;
create policy "Staff leest aanvragen" on public.subsidie_aanvragen
  for select to authenticated
  using (public.get_user_role(auth.uid()) in ('staff', 'admin'));

drop policy if exists "Staff wijzigt aanvragen" on public.subsidie_aanvragen;
create policy "Staff wijzigt aanvragen" on public.subsidie_aanvragen
  for update to authenticated
  using (public.get_user_role(auth.uid()) in ('staff', 'admin'))
  with check (public.get_user_role(auth.uid()) in ('staff', 'admin'));

drop policy if exists "subsidie-documenten: staff leest" on storage.objects;
create policy "subsidie-documenten: staff leest" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'subsidie-documenten'
    and public.get_user_role(auth.uid()) in ('staff', 'admin')
  );
