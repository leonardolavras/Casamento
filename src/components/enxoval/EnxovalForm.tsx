import { useState, type FormEvent } from "react";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_PRIORIDADES,
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL,
  type EnxovalCategoria,
  type EnxovalItemInput,
  type EnxovalPrioridade,
  type EnxovalStatus,
} from "../../types/enxoval";

interface EnxovalFormProps {
  onSubmit: (input: EnxovalItemInput) => Promise<void>;
}

const initialState: EnxovalItemInput = {
  nome: "",
  categoria: "Outros",
  status: "precisamos",
  quantidade: 1,
  prioridade: "media",
  preco_estimado: null,
  link: null,
  observacoes: null,
};

export function EnxovalForm({ onSubmit }: EnxovalFormProps) {
  const [form, setForm] = useState<EnxovalItemInput>(initialState);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.nome.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="enxoval-form" onSubmit={handleSubmit}>
      <label className="enxoval-form__full">
        Nome do item
        <input
          type="text"
          placeholder="Ex: Jogo de panelas"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          autoFocus
          required
        />
      </label>

      <div className="enxoval-form__grid">
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as EnxovalStatus })
            }
          >
            {ENXOVAL_STATUS.map((status) => (
              <option key={status} value={status}>
                {ENXOVAL_STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoria
          <select
            value={form.categoria}
            onChange={(e) =>
              setForm({
                ...form,
                categoria: e.target.value as EnxovalCategoria,
              })
            }
          >
            {ENXOVAL_CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantidade
          <input
            type="number"
            min={1}
            value={form.quantidade}
            onChange={(e) =>
              setForm({ ...form, quantidade: Number(e.target.value) || 1 })
            }
          />
        </label>

        <label>
          Prioridade
          <select
            value={form.prioridade}
            onChange={(e) =>
              setForm({
                ...form,
                prioridade: e.target.value as EnxovalPrioridade,
              })
            }
          >
            {ENXOVAL_PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Preço estimado (R$)
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.preco_estimado ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                preco_estimado: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </label>

        <label>
          Link (loja, referência)
          <input
            type="url"
            value={form.link ?? ""}
            onChange={(e) =>
              setForm({ ...form, link: e.target.value || null })
            }
          />
        </label>

        <label className="enxoval-form__full">
          Observações
          <textarea
            value={form.observacoes ?? ""}
            onChange={(e) =>
              setForm({ ...form, observacoes: e.target.value || null })
            }
            rows={2}
          />
        </label>
      </div>

      <button
        type="submit"
        className="enxoval-form__submit"
        disabled={submitting || !form.nome.trim()}
      >
        {submitting ? "Adicionando..." : "Adicionar item"}
      </button>
    </form>
  );
}
