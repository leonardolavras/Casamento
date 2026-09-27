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
