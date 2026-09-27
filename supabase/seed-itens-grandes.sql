-- Itens "principais" de primeira casa (móveis e eletrodomésticos essenciais)
-- Rode no SQL Editor do Supabase DEPOIS de schema.sql e dos seeds anteriores.
-- Pode rodar mais de uma vez sem duplicar (usa nome como chave, on conflict do nothing).
--
-- Curadoria: lista completa pesquisada tinha 36 itens (móveis, eletro e decoração);
-- aqui ficaram só os ~16 essenciais de primeira casa, a pedido do casal — os demais
-- (decoração, itens secundários de quarto/sala) foram deixados de fora por enquanto,
-- mas os preços já pesquisados continuam disponíveis se quiserem adicionar depois.
--
-- Preços: pesquisados em setembro/2026 via WebSearch (Mercado Livre, Amazon.com.br,
-- Magazine Luiza, Casas Bahia), sempre a versão boa/intermediária de cada item.
--
-- *** imagem_url: NENHUM item tem foto real nesta versão ***
-- WebFetch está bloqueado por política de rede do ambiente (testado em vários
-- domínios). Assim que a rede for liberada, as fotos podem ser preenchidas depois
-- via UPDATE, mesmo padrão de update-precos-fotos.sql.

insert into public.enxoval_itens (nome, categoria, status, quantidade, prioridade, preco_estimado, imagem_url)
values
  -- Eletrodomésticos essenciais
  ('Geladeira', 'Eletrodomésticos', 'precisamos', 1, 'alta', 2399.00, null),
  ('Fogão', 'Eletrodomésticos', 'precisamos', 1, 'alta', 999.00, null),
  ('Máquina de lavar', 'Eletrodomésticos', 'precisamos', 1, 'alta', 1999.00, null),
  ('Micro-ondas', 'Eletrodomésticos', 'precisamos', 1, 'media', 549.00, null),
  ('TV', 'Eletrodomésticos', 'precisamos', 1, 'alta', 2599.00, null),
  ('Liquidificador', 'Eletrodomésticos', 'precisamos', 1, 'media', 199.00, null),
  ('Air Fryer', 'Eletrodomésticos', 'precisamos', 1, 'media', 449.00, null),
  ('Cafeteira', 'Eletrodomésticos', 'precisamos', 1, 'media', 279.00, null),
  ('Ventilador', 'Eletrodomésticos', 'precisamos', 1, 'media', 149.90, null),
  ('Aspirador de pó', 'Eletrodomésticos', 'precisamos', 1, 'media', 349.00, null),

  -- Móveis essenciais
  ('Sofá', 'Sala', 'precisamos', 1, 'alta', 1599.00, null),
  ('Mesa de jantar', 'Sala', 'precisamos', 1, 'alta', 999.00, null),
  ('Colchão', 'Quarto', 'precisamos', 1, 'alta', 899.00, null),
  ('Cama box', 'Quarto', 'precisamos', 1, 'alta', 799.00, null),
  ('Guarda-roupa', 'Quarto', 'precisamos', 1, 'alta', 1399.00, null),

  -- Farmacinha
  ('Kit primeiros socorros', 'Farmacinha', 'precisamos', 1, 'alta', 89.90, null)
on conflict (nome) do nothing;
