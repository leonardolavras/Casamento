-- ============================================================
-- SCRIPT ÚNICO: roda tudo que falta de uma vez só (preços +
-- itens grandes + lua de mel + decoração + ajustes).
-- Cole este arquivo INTEIRO em uma aba NOVA e limpa do SQL Editor
-- do Supabase (Ctrl+A, apagar o que tiver lá, colar isso, Run).
-- Seguro rodar mais de uma vez: usa nome como chave / IF NOT EXISTS.
-- ============================================================

-- ---- 1) preços dos 68 itens base do enxoval ----
-- Atualização de preço estimado e foto para os itens de public.enxoval_itens
-- Gerado a partir de pesquisa de preços médios de mercado (BRL) em lojas como
-- Mercado Livre, Amazon.com.br, Magazine Luiza e Casas Bahia (setembro/2026).
--
-- *** ATENÇÃO — imagem_url AINDA NÃO FOI PREENCHIDA NESTA VERSÃO ***
-- A tarefa original pedia fotos reais extraídas de anúncios do Mercado Livre
-- ou da Amazon.com.br (dominios http2.mlstatic.com / m.media-amazon.com).
-- Neste ambiente de execução, a ferramenta de navegação (WebFetch) está
-- BLOQUEADA pelo proxy de rede para QUALQUER domínio externo — o bloqueio foi
-- confirmado não só para mercadolivre.com.br e amazon.com.br, mas também para
-- magazineluiza.com.br, unsplash.com e até domínios neutros como
-- wikipedia.org e example.com. Ou seja, não é um bloqueio específico desses
-- sites: é a política de rede do ambiente que impede qualquer fetch de página
-- externa nesta sessão. Por isso NÃO foi possível abrir os anúncios para
-- extrair as URLs reais das fotos dos produtos (e inventar essas URLs/IDs
-- foi explicitamente proibido pela tarefa, com razão — um hash de imagem
-- ou ID de foto "chutado" quase certamente não existe e a imagem não carrega).
--
-- Os preços abaixo foram obtidos via WebSearch (que funciona neste ambiente)
-- e são valores médios realistas. Rode este arquivo para atualizar os preços
-- desde já; a coluna imagem_url pode ser preenchida depois, item a item, em
-- um novo arquivo (ou editando esse mesmo) assim que houver acesso de rede
-- liberado para mercadolivre.com.br / amazon.com.br (ou images.unsplash.com
-- como alternativa), via configuração de rede do ambiente.

-- ==================== Cozinha ====================
UPDATE public.enxoval_itens SET preco_estimado = 89.90 WHERE nome = 'Jogo de talheres';
UPDATE public.enxoval_itens SET preco_estimado = 219.00 WHERE nome = 'Jogo de pratos';
UPDATE public.enxoval_itens SET preco_estimado = 79.90 WHERE nome = 'Jogo de copos';
UPDATE public.enxoval_itens SET preco_estimado = 399.00 WHERE nome = 'Jogo de panelas';
UPDATE public.enxoval_itens SET preco_estimado = 59.90 WHERE nome = 'Assadeiras';
UPDATE public.enxoval_itens SET preco_estimado = 49.90 WHERE nome = 'Colheres para cozinhar';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Concha p/ caldos';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Escumadeira p/ frituras';
UPDATE public.enxoval_itens SET preco_estimado = 129.90 WHERE nome = 'Facas';
UPDATE public.enxoval_itens SET preco_estimado = 29.90 WHERE nome = 'Pegador de massa';
UPDATE public.enxoval_itens SET preco_estimado = 39.90 WHERE nome = 'Escorredor de massa';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Abridor de latas / garrafas';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Saca-rolhas';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Peneira';
UPDATE public.enxoval_itens SET preco_estimado = 69.90 WHERE nome = 'Escorredor de louça';
UPDATE public.enxoval_itens SET preco_estimado = 34.90 WHERE nome = 'Jarra p/ água';
UPDATE public.enxoval_itens SET preco_estimado = 29.90 WHERE nome = 'Porta detergente/esponja';
UPDATE public.enxoval_itens SET preco_estimado = 89.90 WHERE nome = 'Lixeira (cozinha)';
UPDATE public.enxoval_itens SET preco_estimado = 29.90 WHERE nome = 'Panos de prato';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Pano de pia';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Tesoura';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Formas de gelo';
UPDATE public.enxoval_itens SET preco_estimado = 69.90 WHERE nome = 'Potes';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Saleiro';
UPDATE public.enxoval_itens SET preco_estimado = 39.90 WHERE nome = 'Tábua de corte';
UPDATE public.enxoval_itens SET preco_estimado = 34.90 WHERE nome = 'Porta temperos';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Ralador de queijo';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Porta-guardanapos';
UPDATE public.enxoval_itens SET preco_estimado = 5.00 WHERE nome = 'Isqueiro';

-- ==================== Quarto ====================
UPDATE public.enxoval_itens SET preco_estimado = 89.90 WHERE nome = 'Protetor de colchão';
UPDATE public.enxoval_itens SET preco_estimado = 29.90 WHERE nome = 'Protetor de travesseiro';
UPDATE public.enxoval_itens SET preco_estimado = 99.90 WHERE nome = 'Jogos de lençol';
UPDATE public.enxoval_itens SET preco_estimado = 129.90 WHERE nome = 'Coberta pesada';
UPDATE public.enxoval_itens SET preco_estimado = 69.90 WHERE nome = 'Coberta leve';
UPDATE public.enxoval_itens SET preco_estimado = 49.90 WHERE nome = 'Travesseiro';
UPDATE public.enxoval_itens SET preco_estimado = 34.90 WHERE nome = 'Cabides de roupa';

-- ==================== Banheiro ====================
UPDATE public.enxoval_itens SET preco_estimado = 89.90 WHERE nome = 'Toalhas de banho';
UPDATE public.enxoval_itens SET preco_estimado = 39.90 WHERE nome = 'Toalhas de rosto';
UPDATE public.enxoval_itens SET preco_estimado = 29.90 WHERE nome = 'Toalha de piso';
UPDATE public.enxoval_itens SET preco_estimado = 39.90 WHERE nome = 'Lixeira (banheiro)';
UPDATE public.enxoval_itens SET preco_estimado = 29.90 WHERE nome = 'Porta escova de dente';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Porta sabonete';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Escova sanitária';

-- ==================== Área de Serviço ====================
UPDATE public.enxoval_itens SET preco_estimado = 49.90 WHERE nome = 'Vassoura e rodo';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Pá de lixo';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Panos de chão';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Panos p/ limpeza';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Escova de limpeza';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Pregadores de roupa';
UPDATE public.enxoval_itens SET preco_estimado = 89.90 WHERE nome = 'Varal';
UPDATE public.enxoval_itens SET preco_estimado = 34.90 WHERE nome = 'Baldes';

-- ==================== Farmacinha ====================
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Termômetro';
UPDATE public.enxoval_itens SET preco_estimado = 12.90 WHERE nome = 'Analgésico';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Antitérmico';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Relaxante muscular';
UPDATE public.enxoval_itens SET preco_estimado = 9.90 WHERE nome = 'Antiácido';
UPDATE public.enxoval_itens SET preco_estimado = 24.90 WHERE nome = 'Antisséptico';
UPDATE public.enxoval_itens SET preco_estimado = 18.90 WHERE nome = 'Curativos';

-- ==================== Emergências ====================
UPDATE public.enxoval_itens SET preco_estimado = 39.90 WHERE nome = 'Extensão elétrica';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Adaptador de tomada';
UPDATE public.enxoval_itens SET preco_estimado = 12.90 WHERE nome = 'Velas';
UPDATE public.enxoval_itens SET preco_estimado = 34.90 WHERE nome = 'Martelo';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Chave de fenda';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Chave Philips';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Pregos sortidos';
UPDATE public.enxoval_itens SET preco_estimado = 9.90 WHERE nome = 'Cola instantânea';
UPDATE public.enxoval_itens SET preco_estimado = 14.90 WHERE nome = 'Lâmpada extra';
UPDATE public.enxoval_itens SET preco_estimado = 19.90 WHERE nome = 'Pilhas';

-- ---- 2) itens grandes (móveis e eletro essenciais) ----
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

-- ---- 3) itens de lua de mel ----
-- Itens "experiência" pra lua de mel — não são produto físico, então o
-- valor é uma meta redonda plausível, não preço de mercado pesquisado.
-- Rode DEPOIS de schema.sql (que já cria a coluna categoria como texto
-- livre, sem CHECK constraint, então não precisa alterar o schema).
-- Pode rodar mais de uma vez sem duplicar (usa nome como chave).

insert into public.enxoval_itens (nome, categoria, status, quantidade, prioridade, preco_estimado)
values
  ('Jantar romântico na lua de mel', 'Lua de Mel', 'precisamos', 1, 'media', 300.00),
  ('Diária de hotel na lua de mel', 'Lua de Mel', 'precisamos', 1, 'alta', 600.00),
  ('Passeio na lua de mel', 'Lua de Mel', 'precisamos', 1, 'media', 250.00)
on conflict (nome) do nothing;

-- ---- 4) itens de decoração e complementares ----
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


-- ---- 5) ajustes: remove "queremos" e a coluna de cotas ----
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
