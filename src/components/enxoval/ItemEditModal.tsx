import { useState } from "react";
import { createPortal } from "react-dom";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalPrioridade,
  type EnxovalStatus,
} from "../../types/enxoval";
import { uploadEnxovalFoto } from "../../lib/uploadEnxovalFoto";
import { baixarFotoDoLink, pareceLink } from "../../lib/fotoDoLink";
import { rotuloPreco } from "../../lib/presente";
import { GiftThumb } from "./GiftThumb";
import { useTravarRolagem } from "../../hooks/useTravarRolagem";
import "./Enxoval.css";

interface ItemEditModalProps {
  item: EnxovalItem | null;
  title?: string;
  onSave: (data: Partial<EnxovalItemInput>) => Promise<void>;
  onClose: () => void;
}

// Aceita "1.599,00", "1599,00", "1599.00" e "1.599" (ponto de milhar).
function parsePreco(texto: string): number | null {
  let t = texto.replace(/[R$\s]/g, "");
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (!/\.\d{1,2}$/.test(t)) t = t.replace(/\./g, "");
  const n = parseFloat(t);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

function formatPrecoInput(valor: number | null | undefined): string {
  return valor != null ? valor.toFixed(2).replace(".", ",") : "";
}

export function ItemEditModal({ item, title = "Editar presente", onSave, onClose }: ItemEditModalProps) {
  useTravarRolagem();
  const [nome, setNome] = useState(item?.nome ?? "");
  const [categoria, setCategoria] = useState<EnxovalCategoria>(item?.categoria ?? "Cozinha");
  const [status, setStatus] = useState<EnxovalStatus>(item?.status ?? "precisamos");
  const [quantidade, setQuantidade] = useState(item?.quantidade ?? 1);
  const [prioridade, setPrioridade] = useState<EnxovalPrioridade>(item?.prioridade ?? "media");
  const [preco, setPreco] = useState(formatPrecoInput(item?.preco_estimado));
  const [link, setLink] = useState(item?.link ?? "");
  const [imagemUrl, setImagemUrl] = useState(item?.imagem_url ?? "");
  const [observacoes, setObservacoes] = useState(item?.observacoes ?? "");
  const [maisOpcoes, setMaisOpcoes] = useState(false);
  const [fotoStatus, setFotoStatus] = useState<"enviando" | "buscando" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = !item;
  const precoNum = parsePreco(preco);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setFotoStatus("enviando");
    setError(null);
    try {
      setImagemUrl(await uploadEnxovalFoto(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar a foto");
    }
    setFotoStatus(null);
  }

  // Baixa a foto do anúncio e guarda uma cópia no Storage, pra não depender da loja.
  async function buscarFotoDoLink(url: string) {
    if (!pareceLink(url) || fotoStatus) return;
    setFotoStatus("buscando");
    setError(null);
    try {
      setImagemUrl(await uploadEnxovalFoto(await baixarFotoDoLink(url.trim())));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não consegui buscar a foto desse link.");
    }
    setFotoStatus(null);
  }

  function handleColarLink(e: React.ClipboardEvent<HTMLInputElement>) {
    const colado = e.clipboardData.getData("text").trim();
    if (!imagemUrl && pareceLink(colado)) void buscarFotoDoLink(colado);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || saving || fotoStatus) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        nome: nome.trim(),
        categoria,
        status,
        quantidade,
        prioridade,
        preco_estimado: precoNum,
        link: link.trim() || null,
        imagem_url: imagemUrl.trim() || null,
        observacoes: observacoes.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    }
    setSaving(false);
  }

  return createPortal(
    <div className="enxoval-modal-overlay" onClick={onClose}>
      <div className="enxoval-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="enxoval-modal__header">
          <h3>{title}</h3>
          <button type="button" className="enxoval-modal__close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <form className="enxoval-modal__form" onSubmit={handleSubmit}>
          {error && <p className="enxoval-modal__error">{error}</p>}

          <div className="enxoval-modal__foto-row">
            <label
              className={`enxoval-modal__foto ${imagemUrl ? "enxoval-modal__foto--com-foto" : ""}`}
              title={imagemUrl ? "Trocar foto" : "Adicionar foto"}
            >
              {fotoStatus ? (
                <span className="enxoval-modal__foto-status">{fotoStatus === "buscando" ? "Buscando foto…" : "Enviando…"}</span>
              ) : imagemUrl ? (
                <img src={imagemUrl} alt="" />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
              <input type="file" accept="image/*" onChange={handleFoto} disabled={Boolean(fotoStatus)} aria-label="Foto do presente" />
            </label>
            <label>
              <span>Nome do presente</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Jantar romântico"
                autoFocus={isNew}
              />
            </label>
          </div>
          {imagemUrl && !fotoStatus && (
            <div className="enxoval-modal__foto-acoes">
              <button type="button" onClick={() => setImagemUrl("")}>Remover foto</button>
            </div>
          )}

          <label>
            <span>Link do produto (opcional) — a foto vem sozinha</span>
            <div className="enxoval-modal__link">
              <input
                type="url"
                inputMode="url"
                placeholder="Cole o link do Mercado Livre, Amazon, Magalu…"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onPaste={handleColarLink}
              />
              <button
                type="button"
                onClick={() => buscarFotoDoLink(link)}
                disabled={!pareceLink(link) || Boolean(fotoStatus)}
              >
                {fotoStatus === "buscando" ? "Buscando…" : imagemUrl ? "Trocar foto" : "Buscar foto"}
              </button>
            </div>
          </label>

          <label>
            <span>Valor do presente (R$)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </label>

          <div className="enxoval-modal__preview-linha" aria-label="Prévia na lista">
            <GiftThumb nome={nome || "?"} src={imagemUrl || null} />
            <div>
              <p className="enxoval-modal__preview-nome">{nome || "Nome do presente"}</p>
              <p className="enxoval-modal__preview-meta">{rotuloPreco({ preco_estimado: precoNum })}</p>
            </div>
          </div>

          <div className="enxoval-modal__row">
            <label>
              <span>Categoria</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value as EnxovalCategoria)}>
                {ENXOVAL_CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
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

          {maisOpcoes ? (
            <>
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
              </div>
              <label>
                <span>URL da foto (opcional, se não enviar arquivo)</span>
                <input type="url" placeholder="https://..." value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} />
              </label>
              <label>
                <span>Observações</span>
                <textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
              </label>
            </>
          ) : (
            <button type="button" className="enxoval-modal__mais" onClick={() => setMaisOpcoes(true)}>
              + Mais opções (quantidade, observações)
            </button>
          )}

          <div className="enxoval-modal__actions">
            <button type="button" className="enxoval-modal__cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="enxoval-modal__save" disabled={saving || Boolean(fotoStatus) || !nome.trim()}>
              {saving ? "Salvando..." : isNew ? "Criar presente" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
