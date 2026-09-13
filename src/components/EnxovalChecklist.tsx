import { useMemo, useState } from "react";
import { useEnxovalItems } from "../hooks/useEnxovalItems";
import { EnxovalForm } from "./EnxovalForm";
import { EnxovalItemCard } from "./EnxovalItemCard";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL,
  type EnxovalCategoria,
} from "../types/enxoval";

const TODAS_CATEGORIAS = "Todas" as const;

export function EnxovalChecklist() {
  const { items, loading, error, addItem, updateItem, removeItem } =
    useEnxovalItems();
  const [filtroCategoria, setFiltroCategoria] = useState<
    EnxovalCategoria | typeof TODAS_CATEGORIAS
  >(TODAS_CATEGORIAS);

  const itensFiltrados = useMemo(
    () =>
      filtroCategoria === TODAS_CATEGORIAS
        ? items
        : items.filter((item) => item.categoria === filtroCategoria),
    [items, filtroCategoria],
  );

  const contagemPorStatus = useMemo(() => {
    return ENXOVAL_STATUS.reduce(
      (acc, status) => {
        acc[status] = itensFiltrados.filter(
          (item) => item.status === status,
        ).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [itensFiltrados]);

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <h1>Checklist de Enxoval</h1>
        <p>O que já temos, o que queremos e o que ainda precisamos comprar.</p>
      </header>

      <EnxovalForm onSubmit={addItem} />

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      <div className="enxoval__filtros">
        <label>
          Filtrar por categoria:
          <select
            value={filtroCategoria}
            onChange={(e) =>
              setFiltroCategoria(
                e.target.value as EnxovalCategoria | typeof TODAS_CATEGORIAS,
              )
            }
          >
            <option value={TODAS_CATEGORIAS}>Todas</option>
            {ENXOVAL_CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Carregando itens...</p>
      ) : (
        <div className="enxoval__colunas">
          {ENXOVAL_STATUS.map((status) => (
            <div key={status} className="enxoval__coluna">
              <h2>
                {ENXOVAL_STATUS_LABEL[status]} ({contagemPorStatus[status]})
              </h2>
              <ul className="enxoval__lista">
                {itensFiltrados
                  .filter((item) => item.status === status)
                  .map((item) => (
                    <EnxovalItemCard
                      key={item.id}
                      item={item}
                      onStatusChange={(id, novoStatus) =>
                        updateItem(id, { status: novoStatus })
                      }
                      onRemove={removeItem}
                    />
                  ))}
                {itensFiltrados.filter((item) => item.status === status)
                  .length === 0 && (
                  <li className="enxoval__vazio">Nenhum item aqui ainda.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
