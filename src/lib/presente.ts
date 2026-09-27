import type { EnxovalItem, EnxovalPresente } from "../types/enxoval";

export function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export type Contribuicao = { total: number; count: number };

export function agruparContribuicoes(presentes: EnxovalPresente[]): Map<string, Contribuicao> {
  const map = new Map<string, Contribuicao>();
  for (const p of presentes) {
    if (!p.item_id) continue;
    const atual = map.get(p.item_id) ?? { total: 0, count: 0 };
    map.set(p.item_id, { total: atual.total + p.valor, count: atual.count + 1 });
  }
  return map;
}

/** Sem preço definido o item nunca "completa" sozinho — os noivos marcam como "Já temos". */
export function presenteCompleto(item: EnxovalItem, c: Contribuicao | undefined): boolean {
  return item.preco_estimado != null && (c?.total ?? 0) >= item.preco_estimado - 0.005;
}

export function rotuloPreco(item: Pick<EnxovalItem, "preco_estimado">): string {
  return item.preco_estimado != null ? formatBRL(item.preco_estimado) : "Valor a definir";
}

/** Contribuições sem presente vinculado (convidado escolheu o próprio valor). */
export const NOME_VALOR_LIVRE = "Presente em valor livre";
