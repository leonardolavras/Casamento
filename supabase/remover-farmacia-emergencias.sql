-- Rode este script UMA VEZ se você já tinha rodado o seed.sql antigo
-- (que incluía as categorias Farmácia e Emergências Domésticas, removidas
-- do site). Isso apaga os itens dessas categorias do seu banco.

delete from public.enxoval_itens
where categoria in ('Farmácia', 'Emergências Domésticas');
