-- Seed do checklist de enxoval — lista "Minha Primeira Casa"
-- Rode no SQL Editor do Supabase DEPOIS de schema.sql.
-- Pode rodar mais de uma vez sem duplicar (usa nome como chave).

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
  ('Panos de prato', 'Cozinha', 'precisamos', 4, 'media'),
  ('Pano de pia', 'Cozinha', 'precisamos', 2, 'baixa'),
  ('Tesoura', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Formas de gelo', 'Cozinha', 'precisamos', 2, 'baixa'),
  ('Potes', 'Cozinha', 'precisamos', 1, 'media'),
  ('Saleiro', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Tábua de corte', 'Cozinha', 'precisamos', 1, 'media'),
  ('Porta temperos', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Ralador de queijo', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Porta-guardanapos', 'Cozinha', 'precisamos', 1, 'baixa'),
  ('Isqueiro', 'Cozinha', 'precisamos', 1, 'baixa'),

  -- Quarto
  ('Protetor de colchão', 'Quarto', 'temos', 1, 'alta'),
  ('Protetor de travesseiro', 'Quarto', 'temos', 2, 'media'),
  ('Jogos de lençol', 'Quarto', 'temos', 2, 'alta'),
  ('Coberta pesada', 'Quarto', 'precisamos', 1, 'media'),
  ('Coberta leve', 'Quarto', 'precisamos', 1, 'media'),
  ('Travesseiro', 'Quarto', 'precisamos', 2, 'alta'),
  ('Cabides de roupa', 'Quarto', 'precisamos', 20, 'media'),

  -- Banheiro
  ('Toalhas de banho', 'Banheiro', 'temos', 4, 'alta'),
  ('Toalhas de rosto', 'Banheiro', 'precisamos', 4, 'media'),
  ('Toalha de piso', 'Banheiro', 'temos', 1, 'media'),
  ('Lixeira (banheiro)', 'Banheiro', 'precisamos', 1, 'media'),
  ('Porta escova de dente', 'Banheiro', 'precisamos', 1, 'baixa'),
  ('Porta sabonete', 'Banheiro', 'precisamos', 1, 'baixa'),
  ('Escova sanitária', 'Banheiro', 'precisamos', 1, 'media'),

  -- Área de Serviço
  ('Vassoura e rodo', 'Área de Serviço', 'precisamos', 1, 'media'),
  ('Pá de lixo', 'Área de Serviço', 'precisamos', 1, 'baixa'),
  ('Panos de chão', 'Área de Serviço', 'precisamos', 3, 'baixa'),
  ('Panos p/ limpeza', 'Área de Serviço', 'precisamos', 4, 'media'),
  ('Escova de limpeza', 'Área de Serviço', 'precisamos', 1, 'baixa'),
  ('Pregadores de roupa', 'Área de Serviço', 'precisamos', 24, 'baixa'),
  ('Varal', 'Área de Serviço', 'precisamos', 1, 'media'),
  ('Baldes', 'Área de Serviço', 'precisamos', 2, 'media'),

  -- Farmacinha
  ('Termômetro', 'Farmacinha', 'precisamos', 1, 'alta'),
  ('Analgésico', 'Farmacinha', 'precisamos', 1, 'alta'),
  ('Antitérmico', 'Farmacinha', 'precisamos', 1, 'alta'),
  ('Relaxante muscular', 'Farmacinha', 'precisamos', 1, 'media'),
  ('Antiácido', 'Farmacinha', 'precisamos', 1, 'media'),
  ('Antisséptico', 'Farmacinha', 'precisamos', 1, 'media'),
  ('Curativos', 'Farmacinha', 'precisamos', 1, 'alta'),

  -- Emergências domésticas
  ('Extensão elétrica', 'Emergências', 'precisamos', 1, 'alta'),
  ('Adaptador de tomada', 'Emergências', 'precisamos', 3, 'media'),
  ('Velas', 'Emergências', 'precisamos', 4, 'media'),
  ('Martelo', 'Emergências', 'precisamos', 1, 'alta'),
  ('Chave de fenda', 'Emergências', 'precisamos', 1, 'media'),
  ('Chave Philips', 'Emergências', 'precisamos', 1, 'media'),
  ('Pregos sortidos', 'Emergências', 'precisamos', 1, 'baixa'),
  ('Cola instantânea', 'Emergências', 'precisamos', 1, 'baixa'),
  ('Lâmpada extra', 'Emergências', 'precisamos', 2, 'media'),
  ('Pilhas', 'Emergências', 'precisamos', 1, 'media')
on conflict (nome) do nothing;
