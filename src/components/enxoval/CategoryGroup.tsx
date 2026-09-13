import { useMemo } from "react";
import {
  ENXOVAL_CATEGORIA_ICONE,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalStatus,
} from "../../types/enxoval";
import { EnxovalItemCard } from "./EnxovalItemCard";

interface CategoryGroupProps {
  categoria: EnxovalCategoria;
  itens: EnxovalItem[];
  guestMode: boolean;
  onStatusChange: (id: string, status: EnxovalStatus) => void;
  onRemove: (id: string) => void;
}

export function CategoryGroup({
  categoria,
  itens,
  guestMode,
  onStatusChange,
  onRemove,
}: CategoryGroupProps) {
  const { temos, total, pct } = useMemo(() => {
    const total = itens.length;
    const temos = itens.filter((item) => item.status === "temos").length;
    return { temos, total, pct: total ? Math.round((temos / total) * 100) : 0 };
  }, [itens]);

  return (
    <div className="category-group">
      <div className="category-group__header">
        <h3>
          <span className="category-group__icon">{ENXOVAL_CATEGORIA_ICONE[categoria]}</span>
          {categoria}
        </h3>
        <div className="category-group__progress">
          <div className="category-group__bar">
            <div
              className="category-group__bar-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span>
            {temos}/{total}
          </span>
        </div>
      </div>

      <ul className="category-group__items">
        {itens.map((item) => (
          <EnxovalItemCard
            key={item.id}
            item={item}
            guestMode={guestMode}
            onStatusChange={onStatusChange}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </div>
  );
}
