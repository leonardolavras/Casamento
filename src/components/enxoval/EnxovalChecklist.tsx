import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import { Modal } from "../Modal";
import { EnxovalForm } from "./EnxovalForm";
import { EnxovalStats } from "./EnxovalStats";
import {
  EnxovalFilters,
  TODAS_CATEGORIAS,
  TODOS_STATUS,
  type CategoriaFilterValue,
  type StatusFilterValue,
} from "./EnxovalFilters";
import { CategoryGroup } from "./CategoryGroup";
import { ENXOVAL_CATEGORIAS } from "../../types/enxoval";
import "./Enxoval.css";

export function EnxovalChecklist() {
  const { items, loading, error, addItem, updateItem, removeItem } =
    useEnxovalItems();
  const [searchParams] = useSearchParams();
  const guestMode = searchParams.get("convidado") === "1";

  const [statusFilter, setStatusFilter] =
    useState<StatusFilterValue>(TODOS_STATUS);
  const [categoriaFilter, setCategoriaFilter] =
    useState<CategoriaFilterValue>(TODAS_CATEGORIAS);
  const [formOpen, setFormOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoriasComItens = useMemo(
    () =>
      ENXOVAL_CATEGORIAS.filter((categoria) =>
        items.some((item) => item.categoria === categoria),
      ),
    [items],
  );

  const itensFiltrados = useMemo(
    () =>
      items.filter((item) => {
        if (statusFilter !== TODOS_STATUS && item.status !== statusFilter)
          return false;
        if (
          categoriaFilter !== TODAS_CATEGORIAS &&
          item.categoria !== categoriaFilter
        )
          return false;
        return true;
      }),
    [items, statusFilter, categoriaFilter],
  );

  const categoriasParaExibir = useMemo(
    () =>
      ENXOVAL_CATEGORIAS.filter((categoria) =>
        itensFiltrados.some((item) => item.categoria === categoria),
      ),
    [itensFiltrados],
  );

  async function handleShare() {
    const url = new URL(window.location.href);
    url.searchParams.set("convidado", "1");
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie o link para compartilhar:", url.toString());
    }
  }

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <h1>Checklist de Enxoval</h1>
        <p>
          O que já temos, o que queremos e o que ainda precisamos comprar
          para a nossa casa nova.
        </p>
      </header>

      {guestMode && (
        <div className="enxoval__guest-banner">
          💛 Essa é a nossa lista de enxoval! Se quiser nos ajudar com algum
          item da lista de "precisamos" ou "queremos", ficaríamos muito
          felizes.
        </div>
      )}

      {!guestMode && (
        <div className="enxoval__toolbar">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setFormOpen(true)}
          >
            + Adicionar item
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleShare}>
            {copied ? "Link copiado! ✓" : "Compartilhar com convidados"}
          </button>
        </div>
      )}

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      {!loading && items.length > 0 && <EnxovalStats items={items} />}

      {!loading && items.length > 0 && (
        <EnxovalFilters
          items={items}
          categoriasComItens={categoriasComItens}
          statusFilter={statusFilter}
          categoriaFilter={categoriaFilter}
          onStatusFilterChange={setStatusFilter}
          onCategoriaFilterChange={setCategoriaFilter}
        />
      )}

      {loading ? (
        <p className="enxoval__loading">Carregando itens...</p>
      ) : items.length === 0 ? (
        <div className="enxoval__vazio-geral">
          <p>Nenhum item cadastrado ainda.</p>
          {!guestMode && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setFormOpen(true)}
            >
              + Adicionar o primeiro item
            </button>
          )}
        </div>
      ) : (
        <div className="enxoval__groups">
          {categoriasParaExibir.map((categoria) => (
            <CategoryGroup
              key={categoria}
              categoria={categoria}
              itens={itensFiltrados.filter((item) => item.categoria === categoria)}
              guestMode={guestMode}
              onStatusChange={(id, status) => updateItem(id, { status })}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}

      {formOpen && !guestMode && (
        <Modal onClose={() => setFormOpen(false)} title="Adicionar item">
          <EnxovalForm
            onSubmit={async (input) => {
              await addItem(input);
              setFormOpen(false);
            }}
          />
        </Modal>
      )}
    </section>
  );
}
