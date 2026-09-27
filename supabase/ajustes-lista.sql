-- Ajustes da lista de presentes. Rode no SQL Editor do Supabase, numa aba
-- nova e vazia. Seguro rodar mais de uma vez.

-- 1) Status "queremos" não existe mais: a lista tem só "precisamos" e "temos".
--    Itens que estavam como "queremos" ainda não foram ganhos, então viram
--    "precisamos" e continuam aparecendo pros convidados.
update public.enxoval_itens set status = 'precisamos' where status = 'queremos';

alter table public.enxoval_itens drop constraint if exists enxoval_itens_status_check;
alter table public.enxoval_itens
  add constraint enxoval_itens_status_check check (status in ('temos', 'precisamos'));

-- 2) Presentes não são divididos em cotas: cada um tem o valor cheio e o
--    convidado escolhe pelo valor (ou escolhe um valor livre). Remove a
--    coluna, caso o add-cotas.sql de uma versão anterior tenha sido rodado.
alter table public.enxoval_itens drop column if exists cotas;
