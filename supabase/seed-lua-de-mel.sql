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
