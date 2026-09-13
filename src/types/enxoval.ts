export const ENXOVAL_STATUS = ["temos", "queremos", "precisamos"] as const;
export type EnxovalStatus = (typeof ENXOVAL_STATUS)[number];

export const ENXOVAL_STATUS_LABEL: Record<EnxovalStatus, string> = {
  temos: "Já temos",
  queremos: "Queremos",
  precisamos: "Precisamos",
};

export const ENXOVAL_STATUS_LABEL_CURTO: Record<EnxovalStatus, string> = {
  temos: "Temos",
  queremos: "Queremos",
  precisamos: "Precisamos",
};

export const ENXOVAL_CATEGORIAS = [
  "Cozinha",
  "Quarto",
  "Banheiro",
  "Área de Serviço",
  "Sala",
  "Decoração",
  "Eletrodomésticos",
  "Outros",
] as const;
export type EnxovalCategoria = (typeof ENXOVAL_CATEGORIAS)[number];

export const ENXOVAL_CATEGORIA_ICONE: Record<EnxovalCategoria, string> = {
  Cozinha: "🍳",
  Quarto: "🛏️",
  Banheiro: "🛁",
  "Área de Serviço": "🧺",
  Sala: "🛋️",
  Decoração: "🎀",
  Eletrodomésticos: "🔌",
  Outros: "📦",
};

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
