import { useState } from "react";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalPrioridade,
  type EnxovalStatus,
} from "../../types/enxoval";
import "./Enxoval.css";

interface ItemEditModalProps {
  item: EnxovalItem | null;
  title?: string;
  onSave: (data: Partial<EnxovalItemInput>) => Promise<void>;
  onClose: () => void;
}

export function ItemEditModal({ item, title = "Editar item", onSave, onClose }: ItemEditModalProps) {
  const [nome, setNome] = useState(item?.nome ?? "");
  const [categoria, setCategoria] = useState<EnxovalCategoria>(item?.categoria ?? "Cozinha");
  const [status, setStatus] = useState<EnxovalStatus>(item?.status ?? "precisamos");
  const [quantidade, setQuantidade] = useState(item?.quantidade ?? 1);
  const [prioridade, setPrioridade] = useState<EnxovalPrioridade>(item?.prioridade ?? "media");
  const [precoEstimado, setPrecoEstimado] = useState(item?.preco_estimado?.toString() ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [imagemUrl, setImagemUrl] = useState(item?.imagem_url ?? "");
  const [observacoes, setObservacoes] = useState(item?.observacoes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = !item;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        nome: nome.trim(),
        categoria,
        status,
        quantidade,
        prioridade,
        preco_estimado: precoEstimado ? parseFloat(precoEstimado) : null,
        link: link.trim() || null,
        imagem_url: imagemUrl.trim() || null,
        observacoes: observacoes.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    }
    setSaving(false);
  }

  return (
    <div className="enxoval-modal-overlay" onClick={onClose}>
      <div className="enxoval-modal" onClick={(e) => e.stopPropagation()}>
        <div className="enxoval-modal__header">
          <h3>{title}</h3>
          <button type="button" className="enxoval-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="enxoval-modal__form" onSubmit={handleSubmit}>
          {error && <p className="enxoval-modal__error">{error}</p>}

          <label>
            <span>Nome</span>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus={isNew} />
          </label>

          <div className="enxoval-modal__row">
            <label>
              <span>Categoria</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value as EnxovalCategoria)}>
                {ENXOVAL_CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{ENXOVAL_CATEGORIA_ICONE[c]} {c}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as EnxovalStatus)}>
                {ENXOVAL_STATUS.map((s) => (
                  <option key={s} value={s}>{ENXOVAL_STATUS_LABEL[s]}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="enxoval-modal__row">
            <label>
              <span>Quantidade</span>
              <input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value) || 1)} />
            </label>
            <label>
              <span>Prioridade</span>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as EnxovalPrioridade)}>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </label>
            <label>
              <span>Preço est.</span>
              <input type="number" min={0} step="0.01" placeholder="R$" value={precoEstimado} onChange={(e) => setPrecoEstimado(e.target.value)} />
            </label>
          </div>

          <label>
            <span>Link do produto</span>
            <input type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
          </label>

          <label>
            <span>URL da imagem</span>
            <input type="url" placeholder="https://..." value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} />
          </label>

          {imagemUrl.trim() && (
            <div className="enxoval-modal__preview">
              <img
                src={imagemUrl}
                alt="Preview"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

          <label>
            <span>Observações</span>
            <textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          </label>

          <div className="enxoval-modal__actions">
            <button type="button" className="enxoval-modal__cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="enxoval-modal__save" disabled={saving || !nome.trim()}>
              {saving ? "Salvando..." : isNew ? "Adicionar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
