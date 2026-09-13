import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
import { uploadEnxovalFoto } from "../../lib/uploadEnxovalFoto";

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
  imagem_url: null,
  observacoes: null,
};

export function EnxovalForm({ onSubmit }: EnxovalFormProps) {
  const [form, setForm] = useState<EnxovalItemInput>(initialState);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!fotoFile) {
      setFotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(fotoFile);
    setFotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoFile]);

  function handleFotoChange(event: ChangeEvent<HTMLInputElement>) {
    setFotoFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.nome.trim()) return;

    setSubmitting(true);
    setErro(null);
    try {
      let imagem_url = form.imagem_url;
      if (fotoFile) {
        imagem_url = await uploadEnxovalFoto(fotoFile);
      }
      await onSubmit({ ...form, imagem_url });
      setForm(initialState);
      setFotoFile(null);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao adicionar item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="enxoval-form" onSubmit={handleSubmit}>
      <label className="enxoval-form__full enxoval-form__foto">
        Foto do item (opcional)
        <div className="enxoval-form__foto-picker">
          {fotoPreview && (
            <img src={fotoPreview} alt="" className="enxoval-form__foto-preview" />
          )}
          <input type="file" accept="image/*" onChange={handleFotoChange} />
        </div>
      </label>

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

      {erro && <p className="enxoval-form__erro">{erro}</p>}

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
