-- Cria a tabela de contribuições dos convidados (quem presenteou, quanto e
-- se já foi confirmado no extrato). Sem ela, o "Já pagou? Deixe seu nome"
-- da tela do Pix não salva nada e o painel dos noivos fica zerado.
--
-- Rode no SQL Editor do Supabase, numa aba nova e vazia (Ctrl+A, apagar,
-- colar este arquivo inteiro, Run). Seguro rodar mais de uma vez.
-- Já inclui a coluna "confirmado", então não precisa rodar o add-confirmado.sql.

create table if not exists public.enxoval_presentes (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.enxoval_itens(id) on delete set null,
  item_nome text not null,
  valor numeric(10, 2) not null,
  nome_doador text not null,
  mensagem text,
  confirmado boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.enxoval_presentes
  add column if not exists confirmado boolean not null default false;

alter table public.enxoval_presentes enable row level security;

drop policy if exists "Presentes: leitura publica" on public.enxoval_presentes;
create policy "Presentes: leitura publica"
  on public.enxoval_presentes for select
  using (true);

drop policy if exists "Presentes: escrita publica" on public.enxoval_presentes;
create policy "Presentes: escrita publica"
  on public.enxoval_presentes for all
  using (true)
  with check (true);

-- atualiza o painel na hora quando alguém presenteia (tempo real)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'enxoval_presentes'
  ) then
    alter publication supabase_realtime add table public.enxoval_presentes;
  end if;
end $$;
