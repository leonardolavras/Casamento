export const ENXOVAL_STATUS = ["precisamos", "temos"] as const;
export type EnxovalStatus = (typeof ENXOVAL_STATUS)[number];

export const ENXOVAL_STATUS_LABEL: Record<EnxovalStatus, string> = {
  precisamos: "Precisamos",
  temos: "Já temos",
};

export const ENXOVAL_STATUS_LABEL_CURTO: Record<EnxovalStatus, string> = {
  precisamos: "Precisamos",
  temos: "Temos",
};

export const ENXOVAL_CATEGORIAS = [
  "Cozinha",
  "Quarto",
  "Banheiro",
  "Área de Serviço",
  "Sala",
  "Decoração",
  "Eletrodomésticos",
  "Farmacinha",
  "Emergências",
  "Lua de Mel",
  "Outros",
] as const;
export type EnxovalCategoria = (typeof ENXOVAL_CATEGORIAS)[number];

export const ENXOVAL_PRIORIDADES = ["baixa", "media", "alta"] as const;
export type EnxovalPrioridade = (typeof ENXOVAL_PRIORIDADES)[number];

export type EnxovalItem = {
  id: string;
  nome: string;
  categoria: EnxovalCategoria;
  status: EnxovalStatus;
  quantidade: number;
  prioridade: EnxovalPrioridade;
  preco_estimado: number | null;
  cotas: number | null;
  link: string | null;
  imagem_url: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
};

export type EnxovalItemInput = Omit<
  EnxovalItem,
  "id" | "created_at" | "updated_at"
>;

export type EnxovalPresente = {
  id: string;
  item_id: string | null;
  item_nome: string;
  valor: number;
  nome_doador: string;
  mensagem: string | null;
  created_at: string;
};

export type EnxovalPresenteInput = Omit<EnxovalPresente, "id" | "created_at">;
