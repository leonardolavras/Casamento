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

export type ResumoPresente = {
  /** true quando o item foi dividido em cotas (cotas > 1 e tem preço) */
  dividido: boolean;
  /** valor que o convidado paga ao clicar em presentear: a cota ou o item inteiro */
  valorPresente: number | null;
  totalCotas: number;
  cotasPreenchidas: number;
  completo: boolean;
};

export function resumirPresente(item: EnxovalItem, c: Contribuicao | undefined): ResumoPresente {
  const meta = item.preco_estimado;
  const totalCotas = item.cotas ?? 1;
  const dividido = totalCotas > 1 && meta != null;
  const count = c?.count ?? 0;
  const total = c?.total ?? 0;

  if (dividido) {
    const cotasPreenchidas = Math.min(totalCotas, count);
    return {
      dividido,
      valorPresente: meta / totalCotas,
      totalCotas,
      cotasPreenchidas,
      completo: cotasPreenchidas >= totalCotas,
    };
  }

  return {
    dividido,
    valorPresente: meta,
    totalCotas: 1,
    cotasPreenchidas: 0,
    // sem preço definido o item nunca "completa" sozinho — os noivos marcam como "temos"
    completo: meta != null && total >= meta - 0.005,
  };
}

/** "R$ 529,00 | único" ou "R$ 181,50 | 22 cotas" — mesmo formato da referência */
export function rotuloPreco(resumo: ResumoPresente): string {
  if (resumo.valorPresente == null) return "Valor a definir";
  const valor = formatBRL(resumo.valorPresente);
  return resumo.dividido ? `${valor} | ${resumo.totalCotas} cotas` : `${valor} | único`;
}
