-- Seed inicial do checklist de enxoval, baseado na lista "Minha Primeira Casa".
-- Rode este script no SQL Editor do Supabase DEPOIS de rodar schema.sql.
-- Os itens marcados como já tendo em mãos entram como 'temos'; o restante como 'precisamos'.
-- Pode rodar mais de uma vez sem duplicar (usa o nome do item como chave de deduplicação).

insert into public.enxoval_itens (nome, categoria, status, quantidade, prioridade)
values
  -- Cozinha
  ('Jogo de talheres', 'Cozinha', 'temos', 1, 'media'),
  ('Jogo de pratos', 'Cozinha', 'precisamos', 1, 'media'),
  ('Jogo de copos', 'Cozinha', 'precisamos', 1, 'media'),
  ('Jogo de panelas', 'Cozinha', 'precisamos', 1, 'alta'),
  ('Assadeiras', 'Cozinha', 'precisamos', 1, 'media'),
  ('Colheres para cozinhar', 'Cozinha', 'temos', 1, 'media'),
  ('Concha p/ caldos', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Escumadeira p/ frituras', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Facas', 'Cozinha', 'temos', 1, 'media'),
  ('Pegador de massa', 'Cozinha', 'temos', 1, 'baixa'),
  ('Escorredor de massa', 'Cozinha', 'precisamos', 1, 'media'),
  ('Abridor de latas / garrafas', 'Cozinha', 'precisamos', 1, 'media'),
  ('Saca-rolhas', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Peneira', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Escorredor de louça', 'Cozinha', 'precisamos', 1, 'media'),
  ('Jarra p/ água', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Porta detergente/esponja', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Lixeira (cozinha)', 'Cozinha', 'precisamos', 1, 'media'),
  ('Panos de prato', 'Cozinha', 'precisamos', 1, 'media'),
  ('Pano de pia', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Tesoura', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Formas de gelo', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Potes', 'Cozinha', 'precisamos', 1, 'media'),
  ('Saleiro', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Tábua de corte', 'Cozinha', 'precisamos', 1, 'media'),
  ('Porta temperos', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Ralador de queijo', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Porta-guardanapos', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Isqueiro', 'Cozinha', 'precisamos', 1, 'baixa'),

  -- Quarto
  ('Protetor de colchão', 'Quarto', 'temos', 1, 'alta'),
  ('Protetor de travesseiro', 'Quarto', 'temos', 1, 'media'),
  ('Jogos de lençol', 'Quarto', 'temos', 1, 'alta'),
  ('Coberta pesada', 'Quarto', 'precisamos', 1, 'media'),
  ('Coberta leve', 'Quarto', 'precisamos', 1, 'media'),
  ('Travesseiro', 'Quarto', 'precisamos', 1, 'alta'),
  ('Cabides de roupa', 'Quarto', 'precisamos', 1, 'media'),

  -- Banheiro
  ('Toalhas de banho', 'Banheiro', 'temos', 1, 'alta'),
  ('Toalhas de rosto', 'Banheiro', 'precisamos', 1, 'media'),
  ('Toalha de piso', 'Banheiro', 'temos', 1, 'media'),
  ('Lixeira (banheiro)', 'Banheiro', 'precisamos', 1, 'media'),
  ('Porta escova de dente', 'Banheiro', 'precisamos', 1, 'baixa'),
  ('Porta sabonete', 'Banheiro', 'precisamos', 1, 'baixa'),
  ('Escova sanitária', 'Banheiro', 'precisamos', 1, 'media'),

  -- Área de Serviço
  ('Vassoura e rodo', 'Área de Serviço', 'precisamos', 1, 'media'),
  ('Pá de lixo', 'Área de Serviço', 'precisamos', 1, 'baixa'),
  ('Panos de chão', 'Área de Serviço', 'precisamos', 1, 'baixa'),
  ('Panos p/ limpeza', 'Área de Serviço', 'precisamos', 1, 'media'),
  ('Escova de limpeza', 'Área de Serviço', 'precisamos', 1, 'baixa'),
  ('Pregadores de roupa', 'Área de Serviço', 'precisamos', 1, 'baixa'),
  ('Varal', 'Área de Serviço', 'precisamos', 1, 'media'),
  ('Baldes', 'Área de Serviço', 'precisamos', 1, 'media'),

  -- Farmácia
  ('Termômetro', 'Farmácia', 'precisamos', 1, 'media'),
  ('Analgésico', 'Farmácia', 'precisamos', 1, 'media'),
  ('Antitérmico', 'Farmácia', 'precisamos', 1, 'media'),
  ('Relaxante muscular', 'Farmácia', 'precisamos', 1, 'baixa'),
  ('Antiácido p/ o estômago', 'Farmácia', 'precisamos', 1, 'baixa'),
  ('Antisséptico', 'Farmácia', 'precisamos', 1, 'media'),
  ('Curativos', 'Farmácia', 'precisamos', 1, 'media'),

  -- Emergências Domésticas
  ('Extensão elétrica', 'Emergências Domésticas', 'precisamos', 1, 'media'),
  ('Adaptador de tomada', 'Emergências Domésticas', 'precisamos', 1, 'baixa'),
  ('Velas', 'Emergências Domésticas', 'precisamos', 1, 'baixa'),
  ('Martelo', 'Emergências Domésticas', 'precisamos', 1, 'media'),
  ('Chave de fenda', 'Emergências Domésticas', 'precisamos', 1, 'media'),
  ('Chave Philips', 'Emergências Domésticas', 'precisamos', 1, 'media'),
  ('Pregos', 'Emergências Domésticas', 'precisamos', 1, 'baixa'),
  ('Cola instantânea', 'Emergências Domésticas', 'precisamos', 1, 'baixa'),
  ('Lâmpada extra', 'Emergências Domésticas', 'precisamos', 1, 'media'),
  ('Pilhas', 'Emergências Domésticas', 'precisamos', 1, 'media')
on conflict (nome) do nothing;
