alter table public.energiebelasting_aanvragen
add column if not exists scan_slaagkans integer,
add column if not exists scan_kans_label text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'energiebelasting_aanvragen_scan_slaagkans_range_chk'
  ) then
    alter table public.energiebelasting_aanvragen
    add constraint energiebelasting_aanvragen_scan_slaagkans_range_chk
    check (scan_slaagkans is null or (scan_slaagkans >= 0 and scan_slaagkans <= 100));
  end if;
end $$;
