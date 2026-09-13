import { useMemo } from "react";
import { ENXOVAL_STATUS, ENXOVAL_STATUS_LABEL, type EnxovalItem } from "../../types/enxoval";

interface EnxovalStatsProps {
  items: EnxovalItem[];
}

export function EnxovalStats({ items }: EnxovalStatsProps) {
  const { total, counts, pct } = useMemo(() => {
    const total = items.length;
    const counts = ENXOVAL_STATUS.reduce(
      (acc, status) => {
        acc[status] = items.filter((item) => item.status === status).length;
        return acc;
      },
      {} as Record<(typeof ENXOVAL_STATUS)[number], number>,
    );
    const pct = total ? Math.round((counts.temos / total) * 100) : 0;
    return { total, counts, pct };
  }, [items]);

  if (total === 0) return null;

  return (
    <div className="enxoval-stats">
      <div className="enxoval-stats__progress">
        <div className="enxoval-stats__bar">
          <div className="enxoval-stats__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="enxoval-stats__pct">
          {pct}% do enxoval pronto · {total} {total === 1 ? "item" : "itens"} no total
        </span>
      </div>

      <div className="enxoval-stats__chips">
        {ENXOVAL_STATUS.map((status) => (
          <div key={status} className={`stat-chip stat-chip--${status}`}>
            <strong>{counts[status]}</strong>
            <span>{ENXOVAL_STATUS_LABEL[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
