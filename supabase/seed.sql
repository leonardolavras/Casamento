-- Seed inicial do checklist de enxoval, baseado na lista "Minha Primeira Casa".
-- Rode este script no SQL Editor do Supabase DEPOIS de rodar schema.sql.
-- Os itens marcados como já tendo em mãos entram como 'temos'; o restante como 'precisamos'.
-- Cada item já vem com uma imagem ilustrativa (servida pelo próprio site, em
-- /public/enxoval-fotos) — não é a foto real do produto, mas dá uma cara
-- bonita à lista até vocês trocarem por fotos de verdade (dá pra editar a
-- foto de qualquer item direto pela tela, com upload).
-- Pode rodar mais de uma vez sem duplicar (usa o nome do item como chave de deduplicação).

insert into public.enxoval_itens (nome, categoria, status, quantidade, prioridade, imagem_url)
values
  -- Cozinha
  ('Jogo de talheres', 'Cozinha', 'temos', 1, 'media', '/enxoval-fotos/jogo-de-talheres.jpg'),
  ('Jogo de pratos', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/jogo-de-pratos.jpg'),
  ('Jogo de copos', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/jogo-de-copos.jpg'),
  ('Jogo de panelas', 'Cozinha', 'precisamos', 1, 'alta', '/enxoval-fotos/jogo-de-panelas.jpg'),
  ('Assadeiras', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/assadeiras.jpg'),
  ('Colheres para cozinhar', 'Cozinha', 'temos', 1, 'media', '/enxoval-fotos/colheres-para-cozinhar.jpg'),
  ('Concha p/ caldos', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/concha-p-caldos.jpg'),
  ('Escumadeira p/ frituras', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/escumadeira-p-frituras.jpg'),
  ('Facas', 'Cozinha', 'temos', 1, 'media', '/enxoval-fotos/facas.jpg'),
  ('Pegador de massa', 'Cozinha', 'temos', 1, 'baixa', '/enxoval-fotos/pegador-de-massa.jpg'),
  ('Escorredor de massa', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/escorredor-de-massa.jpg'),
  ('Abridor de latas / garrafas', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/abridor-de-latas-garrafas.jpg'),
  ('Saca-rolhas', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/saca-rolhas.jpg'),
  ('Peneira', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/peneira.jpg'),
  ('Escorredor de louça', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/escorredor-de-louca.jpg'),
  ('Jarra p/ água', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/jarra-p-agua.jpg'),
  ('Porta detergente/esponja', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/porta-detergente-esponja.jpg'),
  ('Lixeira (cozinha)', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/lixeira-cozinha.jpg'),
  ('Panos de prato', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/panos-de-prato.jpg'),
  ('Pano de pia', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/pano-de-pia.jpg'),
  ('Tesoura', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/tesoura.jpg'),
  ('Formas de gelo', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/formas-de-gelo.jpg'),
  ('Potes', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/potes.jpg'),
  ('Saleiro', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/saleiro.jpg'),
  ('Tábua de corte', 'Cozinha', 'precisamos', 1, 'media', '/enxoval-fotos/tabua-de-corte.jpg'),
  ('Porta temperos', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/porta-temperos.jpg'),
  ('Ralador de queijo', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/ralador-de-queijo.jpg'),
  ('Porta-guardanapos', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/porta-guardanapos.jpg'),
  ('Isqueiro', 'Cozinha', 'precisamos', 1, 'baixa', '/enxoval-fotos/isqueiro.jpg'),

  -- Quarto
  ('Protetor de colchão', 'Quarto', 'temos', 1, 'alta', '/enxoval-fotos/protetor-de-colchao.jpg'),
  ('Protetor de travesseiro', 'Quarto', 'temos', 1, 'media', '/enxoval-fotos/protetor-de-travesseiro.jpg'),
  ('Jogos de lençol', 'Quarto', 'temos', 1, 'alta', '/enxoval-fotos/jogos-de-lencol.jpg'),
  ('Coberta pesada', 'Quarto', 'precisamos', 1, 'media', '/enxoval-fotos/coberta-pesada.jpg'),
  ('Coberta leve', 'Quarto', 'precisamos', 1, 'media', '/enxoval-fotos/coberta-leve.jpg'),
  ('Travesseiro', 'Quarto', 'precisamos', 1, 'alta', '/enxoval-fotos/travesseiro.jpg'),
  ('Cabides de roupa', 'Quarto', 'precisamos', 1, 'media', '/enxoval-fotos/cabides-de-roupa.jpg'),

  -- Banheiro
  ('Toalhas de banho', 'Banheiro', 'temos', 1, 'alta', '/enxoval-fotos/toalhas-de-banho.jpg'),
  ('Toalhas de rosto', 'Banheiro', 'precisamos', 1, 'media', '/enxoval-fotos/toalhas-de-rosto.jpg'),
  ('Toalha de piso', 'Banheiro', 'temos', 1, 'media', '/enxoval-fotos/toalha-de-piso.jpg'),
  ('Lixeira (banheiro)', 'Banheiro', 'precisamos', 1, 'media', '/enxoval-fotos/lixeira-banheiro.jpg'),
  ('Porta escova de dente', 'Banheiro', 'precisamos', 1, 'baixa', '/enxoval-fotos/porta-escova-de-dente.jpg'),
  ('Porta sabonete', 'Banheiro', 'precisamos', 1, 'baixa', '/enxoval-fotos/porta-sabonete.jpg'),
  ('Escova sanitária', 'Banheiro', 'precisamos', 1, 'media', '/enxoval-fotos/escova-sanitaria.jpg'),

  -- Área de Serviço
  ('Vassoura e rodo', 'Área de Serviço', 'precisamos', 1, 'media', '/enxoval-fotos/vassoura-e-rodo.jpg'),
  ('Pá de lixo', 'Área de Serviço', 'precisamos', 1, 'baixa', '/enxoval-fotos/pa-de-lixo.jpg'),
  ('Panos de chão', 'Área de Serviço', 'precisamos', 1, 'baixa', '/enxoval-fotos/panos-de-chao.jpg'),
  ('Panos p/ limpeza', 'Área de Serviço', 'precisamos', 1, 'media', '/enxoval-fotos/panos-p-limpeza.jpg'),
  ('Escova de limpeza', 'Área de Serviço', 'precisamos', 1, 'baixa', '/enxoval-fotos/escova-de-limpeza.jpg'),
  ('Pregadores de roupa', 'Área de Serviço', 'precisamos', 1, 'baixa', '/enxoval-fotos/pregadores-de-roupa.jpg'),
  ('Varal', 'Área de Serviço', 'precisamos', 1, 'media', '/enxoval-fotos/varal.jpg'),
  ('Baldes', 'Área de Serviço', 'precisamos', 1, 'media', '/enxoval-fotos/baldes.jpg'),

  -- Farmacinha
  ('Termômetro', 'Farmacinha', 'precisamos', 1, 'alta', null),
  ('Analgésico', 'Farmacinha', 'precisamos', 1, 'alta', null),
  ('Antitérmico', 'Farmacinha', 'precisamos', 1, 'alta', null),
  ('Relaxante muscular', 'Farmacinha', 'precisamos', 1, 'media', null),
  ('Antiácido', 'Farmacinha', 'precisamos', 1, 'media', null),
  ('Antisséptico', 'Farmacinha', 'precisamos', 1, 'media', null),
  ('Curativos', 'Farmacinha', 'precisamos', 1, 'alta', null),

  -- Emergências domésticas
  ('Extensão elétrica', 'Emergências', 'precisamos', 1, 'alta', null),
  ('Adaptador de tomada', 'Emergências', 'precisamos', 3, 'media', null),
  ('Velas', 'Emergências', 'precisamos', 4, 'media', null),
  ('Martelo', 'Emergências', 'precisamos', 1, 'alta', null),
  ('Chave de fenda', 'Emergências', 'precisamos', 1, 'media', null),
  ('Chave Philips', 'Emergências', 'precisamos', 1, 'media', null),
  ('Pregos sortidos', 'Emergências', 'precisamos', 1, 'baixa', null),
  ('Cola instantânea', 'Emergências', 'precisamos', 1, 'baixa', null),
  ('Lâmpada extra', 'Emergências', 'precisamos', 2, 'media', null),
  ('Pilhas', 'Emergências', 'precisamos', 1, 'media', null)
on conflict (nome) do update set imagem_url = excluded.imagem_url;
