-- "Confirmado no extrato": os noivos marcam cada contribuição depois de
-- conferir o Pix no banco, e o painel separa o valor confirmado do valor
-- só informado pelos convidados.
-- Rode no SQL Editor do Supabase, numa aba nova e vazia. Seguro rodar mais de uma vez.

alter table public.enxoval_presentes
  add column if not exists confirmado boolean not null default false;
