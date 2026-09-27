-- Adiciona suporte a "cotas": presentes caros (ex: lua de mel, móveis grandes)
-- podem ser divididos em N cotas, e cada convidado presenteia uma cota por vez
-- em vez do valor cheio. Rode no SQL Editor do Supabase.
--
-- cotas = null ou 1 -> presente "único" (comportamento atual, sem mudança)
-- cotas > 1 -> valor de cada cota = preco_estimado / cotas

alter table public.enxoval_itens
  add column if not exists cotas integer;
