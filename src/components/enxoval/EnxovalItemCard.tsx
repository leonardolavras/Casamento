import {
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL,
  type EnxovalItem,
  type EnxovalStatus,
} from "../../types/enxoval";

interface EnxovalItemCardProps {
  item: EnxovalItem;
  guestMode: boolean;
  onStatusChange: (id: string, status: EnxovalStatus) => void;
  onRemove: (id: string) => void;
}

export function EnxovalItemCard({
  item,
  guestMode,
  onStatusChange,
  onRemove,
}: EnxovalItemCardProps) {
  return (
    <li className={`item-card item-card--${item.status}`}>
      <div className="item-card__top">
        <span className="item-card__nome">{item.nome}</span>
        {item.quantidade > 1 && (
          <span className="item-card__qtd">{item.quantidade}x</span>
        )}
      </div>

      <div className="item-card__meta">
        {item.preco_estimado != null && (
          <span className="item-card__preco">
            {item.preco_estimado.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        )}
        {item.prioridade === "alta" && (
          <span className="item-card__prioridade">Prioridade</span>
        )}
      </div>

      {item.observacoes && <p className="item-card__obs">{item.observacoes}</p>}

      {item.link && (
        <a
          className="item-card__link"
          href={item.link}
          target="_blank"
          rel="noreferrer"
        >
          Ver referencia
        </a>
      )}

      {guestMode ? (
        <span className={`item-card__badge item-card__badge--${item.status}`}>
          {ENXOVAL_STATUS_LABEL[item.status]}
        </span>
      ) : (
        <div className="item-card__actions">
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
            className="item-card__remove"
            onClick={() => onRemove(item.id)}
            aria-label={`Remover ${item.nome}`}
          >
            &times;
          </button>
        </div>
      )}
    </li>
  );
}
