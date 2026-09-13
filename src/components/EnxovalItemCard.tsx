import { ENXOVAL_STATUS, ENXOVAL_STATUS_LABEL, type EnxovalItem, type EnxovalStatus } from "../types/enxoval";

interface EnxovalItemCardProps {
  item: EnxovalItem;
  onStatusChange: (id: string, status: EnxovalStatus) => void;
  onRemove: (id: string) => void;
}

export function EnxovalItemCard({
  item,
  onStatusChange,
  onRemove,
}: EnxovalItemCardProps) {
  return (
    <li className={`enxoval-card enxoval-card--${item.status}`}>
      <div className="enxoval-card__header">
        <span className="enxoval-card__nome">{item.nome}</span>
        <span className="enxoval-card__categoria">{item.categoria}</span>
      </div>

      <div className="enxoval-card__meta">
        <span>Qtd: {item.quantidade}</span>
        <span>Prioridade: {item.prioridade}</span>
        {item.preco_estimado != null && (
          <span>
            ~{" "}
            {item.preco_estimado.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        )}
      </div>

      {item.observacoes && (
        <p className="enxoval-card__obs">{item.observacoes}</p>
      )}

      {item.link && (
        <a
          className="enxoval-card__link"
          href={item.link}
          target="_blank"
          rel="noreferrer"
        >
          Ver referência
        </a>
      )}

      <div className="enxoval-card__actions">
        <select
          value={item.status}
          onChange={(e) =>
            onStatusChange(item.id, e.target.value as EnxovalStatus)
          }
        >
          {ENXOVAL_STATUS.map((status) => (
            <option key={status} value={status}>
              {ENXOVAL_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="enxoval-card__remove"
          onClick={() => onRemove(item.id)}
        >
          Remover
        </button>
      </div>
    </li>
  );
}
