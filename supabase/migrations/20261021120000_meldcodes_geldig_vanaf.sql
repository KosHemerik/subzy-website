-- Meldcodelijsten worden per RVO-publicatie bewaard: elke lijst krijgt de datum waarop hij ingaat.
-- Een nieuwe lijst wordt toegevoegd met een nieuwe geldig_vanaf, oude rijen blijven staan.
-- Dezelfde meldcode mag daardoor in meerdere lijsten voorkomen, maar één keer per lijst.

do $$
declare
  t text;
begin
  foreach t in array array[
    'meldcodes_warmtepompen',
    'meldcodes_zonneboilers',
    'meldcodes_ventilatie',
    'meldcodes_isolatie',
    'meldcodes_glas'
  ]
  loop
    execute format('alter table public.%I add column if not exists geldig_vanaf date', t);
    execute format('update public.%I set geldig_vanaf = %L where geldig_vanaf is null', t, '2026-03-01');
    execute format('alter table public.%I alter column geldig_vanaf set not null', t);

    execute format('alter table public.%I drop constraint if exists %I', t, t || '_meldcode_key');
    execute format('alter table public.%I add constraint %I unique (meldcode, geldig_vanaf)', t, t || '_meldcode_geldig_vanaf_key');
    execute format('create index if not exists %I on public.%I (geldig_vanaf)', 'idx_' || t || '_geldig_vanaf', t);
  end loop;
end $$;
