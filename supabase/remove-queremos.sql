-- Remove o status "queremos": a lista passa a ter só "precisamos" e "temos".
-- Itens que estavam como "queremos" ainda não foram ganhos, então viram
-- "precisamos" (continuam aparecendo na lista de presentes).
-- Rode no SQL Editor do Supabase, numa aba limpa. Seguro rodar mais de uma vez.

update public.enxoval_itens set status = 'precisamos' where status = 'queremos';

alter table public.enxoval_itens drop constraint if exists enxoval_itens_status_check;
alter table public.enxoval_itens
  add constraint enxoval_itens_status_check check (status in ('temos', 'precisamos'));
