-- Checklist de Enxoval
-- Execute este script no SQL Editor do seu projeto Supabase.

create table if not exists public.enxoval_itens (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  categoria text not null default 'Outros',
  status text not null default 'precisamos'
    check (status in ('temos', 'queremos', 'precisamos')),
  quantidade integer not null default 1,
  prioridade text not null default 'media'
    check (prioridade in ('baixa', 'media', 'alta')),
  preco_estimado numeric(10, 2),
  link text,
  imagem_url text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Caso a tabela já exista de uma execução anterior deste script, garante
-- que a coluna de imagem também seja criada.
alter table public.enxoval_itens
  add column if not exists imagem_url text;

-- Mantém updated_at sempre atualizado
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_enxoval_itens_updated_at on public.enxoval_itens;
create trigger trg_enxoval_itens_updated_at
  before update on public.enxoval_itens
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.enxoval_itens enable row level security;

-- Política inicial simples: como o site ainda não tem login, liberamos
-- leitura/escrita para a chave "anon". Quando adicionarmos autenticação
-- (ex: só o casal poder editar), substituímos essas políticas.
drop policy if exists "Enxoval: leitura publica" on public.enxoval_itens;
create policy "Enxoval: leitura publica"
  on public.enxoval_itens for select
  using (true);

drop policy if exists "Enxoval: escrita publica" on public.enxoval_itens;
create policy "Enxoval: escrita publica"
  on public.enxoval_itens for all
  using (true)
  with check (true);

-- Bucket de armazenamento para as fotos dos itens do enxoval.
insert into storage.buckets (id, name, public)
values ('enxoval-fotos', 'enxoval-fotos', true)
on conflict (id) do nothing;

drop policy if exists "Enxoval fotos: leitura publica" on storage.objects;
create policy "Enxoval fotos: leitura publica"
  on storage.objects for select
  using (bucket_id = 'enxoval-fotos');

drop policy if exists "Enxoval fotos: upload publico" on storage.objects;
create policy "Enxoval fotos: upload publico"
  on storage.objects for insert
  with check (bucket_id = 'enxoval-fotos');

drop policy if exists "Enxoval fotos: update publico" on storage.objects;
create policy "Enxoval fotos: update publico"
  on storage.objects for update
  using (bucket_id = 'enxoval-fotos');

drop policy if exists "Enxoval fotos: delete publico" on storage.objects;
create policy "Enxoval fotos: delete publico"
  on storage.objects for delete
  using (bucket_id = 'enxoval-fotos');

-- Mural de recados dos convidados
create table if not exists public.mural_recados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  mensagem text not null,
  created_at timestamptz not null default now()
);

alter table public.mural_recados enable row level security;

drop policy if exists "Mural: leitura publica" on public.mural_recados;
create policy "Mural: leitura publica"
  on public.mural_recados for select
  using (true);

drop policy if exists "Mural: escrita publica" on public.mural_recados;
create policy "Mural: escrita publica"
  on public.mural_recados for insert
  with check (true);
