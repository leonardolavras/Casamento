import {
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL_CURTO,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalStatus,
} from "../../types/enxoval";

export const TODOS_STATUS = "todos" as const;
export const TODAS_CATEGORIAS = "todas" as const;

export type StatusFilterValue = EnxovalStatus | typeof TODOS_STATUS;
export type CategoriaFilterValue = EnxovalCategoria | typeof TODAS_CATEGORIAS;

interface EnxovalFiltersProps {
  items: EnxovalItem[];
  categoriasComItens: EnxovalCategoria[];
  statusFilter: StatusFilterValue;
  categoriaFilter: CategoriaFilterValue;
  onStatusFilterChange: (status: StatusFilterValue) => void;
  onCategoriaFilterChange: (categoria: CategoriaFilterValue) => void;
}

export function EnxovalFilters({
  items,
  categoriasComItens,
  statusFilter,
  categoriaFilter,
  onStatusFilterChange,
  onCategoriaFilterChange,
}: EnxovalFiltersProps) {
  return (
    <div className="enxoval-filters">
      <div className="filter-pills">
        <button
          type="button"
          className={statusFilter === TODOS_STATUS ? "filter-pill filter-pill--active" : "filter-pill"}
          onClick={() => onStatusFilterChange(TODOS_STATUS)}
        >
          Todos <span className="filter-pill__count">{items.length}</span>
        </button>
        {ENXOVAL_STATUS.map((status) => {
          const count = items.filter((item) => item.status === status).length;
          return (
            <button
              key={status}
              type="button"
              className={
                statusFilter === status
                  ? `filter-pill filter-pill--active filter-pill--${status}`
                  : `filter-pill filter-pill--${status}`
              }
              onClick={() => onStatusFilterChange(status)}
            >
              {ENXOVAL_STATUS_LABEL_CURTO[status]}{" "}
              <span className="filter-pill__count">{count}</span>
            </button>
          );
        })}
      </div>

      {categoriasComItens.length > 1 && (
        <div className="category-pills">
          <button
            type="button"
            className={
              categoriaFilter === TODAS_CATEGORIAS
                ? "category-pill category-pill--active"
                : "category-pill"
            }
            onClick={() => onCategoriaFilterChange(TODAS_CATEGORIAS)}
          >
            Todas as categorias
          </button>
          {categoriasComItens.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={
                categoriaFilter === categoria
                  ? "category-pill category-pill--active"
                  : "category-pill"
              }
              onClick={() => onCategoriaFilterChange(categoria)}
            >
              {ENXOVAL_CATEGORIA_ICONE[categoria]} {categoria}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
