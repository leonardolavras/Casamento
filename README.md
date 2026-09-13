# Nosso Casamento 💍

Site do casamento, construído com **React + TypeScript (Vite)** e **Supabase**
como backend. A ideia é ir evoluindo aos poucos conforme o planejamento avança.

## Funcionalidades

- **Início** — página romântica com contagem regressiva para o casamento,
  história do casal, galeria de fotos (com lightbox), gerador de motivos e
  linha do tempo do relacionamento. Textos e datas editáveis em
  [`src/config/site.ts`](./src/config/site.ts).
- **Checklist de Enxoval** — cadastro dos itens do enxoval com status:
  - `Já temos`
  - `Queremos`
  - `Precisamos`

  Cada item pode ter categoria (cozinha, quarto, banheiro, área de serviço,
  farmácia, emergências domésticas, etc.), quantidade, prioridade, preço
  estimado, link de referência e observações.

Próximas seções (lista de convidados, RSVP, cronograma, etc.) serão
adicionadas conforme formos decidindo juntos.

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Supabase](https://supabase.com/) (Postgres + API) para persistência dos dados
- Oxlint para lint

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com/).
2. No **SQL Editor**, rode o script [`supabase/schema.sql`](./supabase/schema.sql)
   para criar a tabela `enxoval_itens` (com RLS habilitado — as políticas atuais
   liberam leitura/escrita pública, já que o site ainda não tem login; vamos
   refinar isso quando adicionarmos autenticação do casal).
3. (Opcional) Rode [`supabase/seed.sql`](./supabase/seed.sql) para já popular o
   checklist com uma lista inicial de itens de casa nova (cozinha, quarto,
   banheiro, área de serviço, farmácia e emergências domésticas).
4. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha `.env` com os valores copiados do Supabase:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (roda `tsc` + `vite build`)
- `npm run preview` — pré-visualiza o build de produção
- `npm run lint` — lint com Oxlint

## Estrutura do código

```
src/
  config/site.ts            # data do casamento, fotos, textos e motivos (edite aqui)
  pages/
    Home.tsx                # página inicial (hero, história, galeria, motivos, linha do tempo)
    EnxovalPage.tsx          # página do checklist de enxoval
  components/
    Navbar.tsx               # navegação entre Início e Enxoval
    home/                    # seções da página inicial
    EnxovalChecklist.tsx     # checklist (filtros + colunas por status)
    EnxovalForm.tsx          # formulário de novo item
    EnxovalItemCard.tsx      # card de item com ações
  types/enxoval.ts           # tipos e constantes (status, categorias, prioridades)
  types/database.ts          # tipagem do schema Supabase
  lib/supabase.ts            # cliente Supabase
  hooks/useEnxovalItems.ts   # CRUD dos itens (list/add/update/remove)
public/fotos/                # fotos usadas na galeria da página inicial
supabase/schema.sql          # schema da tabela enxoval_itens + RLS
supabase/seed.sql            # lista inicial de itens de enxoval (opcional)
```
