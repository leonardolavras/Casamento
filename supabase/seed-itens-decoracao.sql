-- Itens de decoração e complementares de primeira casa
-- Rode no SQL Editor do Supabase DEPOIS de schema.sql e dos seeds anteriores.
-- Pode rodar mais de uma vez sem duplicar (usa nome como chave, on conflict do nothing).
--
-- Continuação da curadoria de seed-itens-grandes.sql: aqueles 16 eram só os
-- essenciais de primeira casa; aqui entram os itens secundários (decoração,
-- móveis complementares de sala/quarto) que tinham ficado de fora "por
-- enquanto". 15 itens pesquisados nesta rodada.
--
-- Preços: pesquisados em setembro/2026 via WebSearch (Mercado Livre, Amazon.com.br,
-- Magazine Luiza, Tok&Stok, Leroy Merlin, MadeiraMadeira), sempre a versão
-- boa/intermediária de cada item.
--
-- *** imagem_url: NENHUM item tem foto real nesta versão ***
-- WebFetch continua bloqueado pela política de rede do ambiente (confirmado
-- de novo nesta sessão: mercadolivre.com.br retorna EGRESS_BLOCKED). Assim
-- que a rede for liberada, as fotos podem ser preenchidas depois via UPDATE,
-- mesmo padrão de update-precos-fotos.sql.

insert into public.enxoval_itens (nome, categoria, status, quantidade, prioridade, preco_estimado, imagem_url)
values
  -- Sala
  ('Rack para TV', 'Sala', 'precisamos', 1, 'media', 399.00, null),
  ('Mesa de centro', 'Sala', 'precisamos', 1, 'media', 349.00, null),
  ('Estante / prateleira', 'Sala', 'precisamos', 1, 'baixa', 349.00, null),
  ('Poltrona decorativa', 'Sala', 'precisamos', 1, 'baixa', 899.00, null),

  -- Quarto
  ('Criado-mudo (par)', 'Quarto', 'precisamos', 1, 'media', 399.00, null),
  ('Cabideiro de chão', 'Quarto', 'precisamos', 1, 'baixa', 249.00, null),

  -- Cozinha
  ('Jogo de toalha de mesa e americano', 'Cozinha', 'precisamos', 1, 'baixa', 79.90, null),

  -- Área de Serviço
  ('Caixas organizadoras multiuso', 'Área de Serviço', 'precisamos', 3, 'baixa', 89.90, null),

  -- Decoração
  ('Tapete para sala', 'Decoração', 'precisamos', 1, 'media', 249.90, null),
  ('Jogo de cortina para sala', 'Decoração', 'precisamos', 1, 'media', 149.90, null),
  ('Espelho decorativo de parede', 'Decoração', 'precisamos', 1, 'baixa', 249.90, null),
  ('Luminária de chão / abajur', 'Decoração', 'precisamos', 1, 'baixa', 199.90, null),
  ('Kit quadros decorativos', 'Decoração', 'precisamos', 1, 'baixa', 129.90, null),
  ('Vaso decorativo grande', 'Decoração', 'precisamos', 1, 'baixa', 149.90, null),
  ('Capacho para porta', 'Decoração', 'precisamos', 1, 'baixa', 49.90, null)
on conflict (nome) do nothing;
