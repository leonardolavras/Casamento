import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalPrioridade,
  type EnxovalStatus,
} from "../../types/enxoval";
import { PALETA_CORES } from "../../config/site";
import { SUGESTOES } from "../../config/enxoval-sugestoes";
import "./Enxoval.css";

export function EnxovalChecklist() {
  const { items, loading, error, addItem, updateItem, removeItem } =
    useEnxovalItems();
  const [searchParams] = useSearchParams();
  const guestMode = searchParams.get("convidado") === "1";

  const [openSection, setOpenSection] = useState<EnxovalStatus | "adicionar" | null>(null);
  const [quickName, setQuickName] = useState("");
  const [quickCat, setQuickCat] = useState<EnxovalCategoria>("Cozinha");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sugestoesCat, setSugestoesCat] = useState<EnxovalCategoria>("Cozinha");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EnxovalItem | null>(null);

  const existingNames = useMemo(
    () => new Set(items.map((i) => i.nome.toLowerCase())),
    [items],
  );

  const grouped = useMemo(() => {
    const temos = items.filter((i) => i.status === "temos");
    const queremos = items.filter((i) => i.status === "queremos");
    const precisamos = items.filter((i) => i.status === "precisamos");
    return { temos, queremos, precisamos };
  }, [items]);

  const sugestoesFiltradas = useMemo(
    () =>
      SUGESTOES.filter(
        (s) =>
          s.categoria === sugestoesCat &&
          !existingNames.has(s.nome.toLowerCase()),
      ),
    [sugestoesCat, existingNames],
  );

  const pct = items.length ? Math.round((grouped.temos.length / items.length) * 100) : 0;

  function toggleSection(section: EnxovalStatus | "adicionar") {
    setOpenSection((prev) => (prev === section ? null : section));
  }

  async function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!quickName.trim() || adding) return;
    setAdding(true);
    try {
      await addItem({
        nome: quickName.trim(),
        categoria: quickCat,
        status: "precisamos",
        quantidade: 1,
        prioridade: "media",
        preco_estimado: null,
        link: null,
        imagem_url: null,
        observacoes: null,
      });
      setQuickName("");
    } catch {}
    setAdding(false);
  }

  async function handleAddSugestao(s: (typeof SUGESTOES)[number]) {
    const input: EnxovalItemInput = {
      nome: s.nome,
      categoria: s.categoria,
      status: s.status ?? "precisamos",
      quantidade: 1,
      prioridade: "media",
      preco_estimado: null,
      link: null,
      imagem_url: s.imagem_url ?? null,
      observacoes: null,
    };
    try { await addItem(input); } catch {}
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const next = currentStatus === "temos" ? "precisamos" : "temos";
    await updateItem(id, { status: next as EnxovalStatus });
  }

  async function handleRemove(id: string) {
    if (confirmRemove === id) {
      await removeItem(id);
      setConfirmRemove(null);
    } else {
      setConfirmRemove(id);
      setTimeout(() => setConfirmRemove(null), 3000);
    }
  }

  async function handleShare() {
    const url = new URL(window.location.href);
    url.searchParams.set("convidado", "1");
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie o link:", url.toString());
    }
  }

  async function handleSaveEdit(updated: Partial<EnxovalItemInput>) {
    if (!editingItem) return;
    await updateItem(editingItem.id, updated);
    setEditingItem(null);
  }

  function renderItems(list: typeof items, status: EnxovalStatus) {
    if (list.length === 0) {
      return (
        <p className="enxoval-expand__vazio">
          {status === "temos"
            ? "Nenhum item marcado como 'já temos' ainda."
            : status === "queremos"
              ? "Nenhum item marcado como 'queremos' ainda."
              : "Nenhum item marcado como 'precisamos' ainda."}
        </p>
      );
    }

    const byCategory = ENXOVAL_CATEGORIAS.filter((cat) =>
      list.some((i) => i.categoria === cat),
    );

    return (
      <div className="enxoval-expand__groups">
        {byCategory.map((cat) => {
          const catItems = list.filter((i) => i.categoria === cat);
          return (
            <div key={cat} className="enxoval-expand__group">
              <h4 className="enxoval-expand__cat">
                {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
                <span>{catItems.length}</span>
              </h4>
              <div className="enxoval-expand__items">
                {catItems.map((item) => (
                  <div key={item.id} className={`enxoval-row enxoval-row--${item.status}`}>
                    {!guestMode && (
                      <button
                        type="button"
                        className="enxoval-row__check"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        aria-label={
                          item.status === "temos"
                            ? `Desmarcar ${item.nome}`
                            : `Marcar ${item.nome} como temos`
                        }
                      >
                        {item.status === "temos" ? (
                          <span className="enxoval-row__box enxoval-row__box--checked">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </span>
                        ) : (
                          <span className="enxoval-row__box" />
                        )}
                      </button>
                    )}
                    {item.imagem_url && (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="enxoval-row__img"
                        loading="lazy"
                      />
                    )}
                    <span
                      className={`enxoval-row__nome ${item.status === "temos" ? "enxoval-row__nome--done" : ""} ${!guestMode ? "enxoval-row__nome--editable" : ""}`}
                      onClick={!guestMode ? () => setEditingItem(item) : undefined}
                    >
                      {item.nome}
                    </span>
                    {item.quantidade > 1 && (
                      <span className="enxoval-row__qty">{item.quantidade}x</span>
                    )}
                    {!guestMode && (
                      <button
                        type="button"
                        className={`enxoval-row__del ${confirmRemove === item.id ? "enxoval-row__del--confirm" : ""}`}
                        onClick={() => handleRemove(item.id)}
                      >
                        {confirmRemove === item.id ? "remover?" : "×"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <h1>Nosso Enxoval</h1>
        <p>Tudo que já temos e o que ainda falta para a nossa casa nova.</p>
      </header>

      {PALETA_CORES.length > 0 && (
        <div className="paleta-cores">
          <h2 className="paleta-cores__titulo">Nossa paleta de cores</h2>
          <p className="paleta-cores__sub">
            Para presentes de decoração ou tecidos, essas são as cores do nosso lar.
          </p>
          <div className="paleta-cores__swatches">
            {PALETA_CORES.map((cor) => (
              <div key={cor.hex} className="paleta-swatch">
                <div className="paleta-swatch__color" style={{ backgroundColor: cor.hex }} />
                <div className="paleta-swatch__info">
                  <span className="paleta-swatch__nome">{cor.nome}</span>
                  {cor.descricao && <span className="paleta-swatch__desc">{cor.descricao}</span>}
                  <span className="paleta-swatch__hex">{cor.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      {loading ? (
        <p className="enxoval__loading">Carregando...</p>
      ) : (
        <>
          {items.length > 0 && (
            <div className="enxoval-progress">
              <div className="enxoval-progress__bar">
                <div className="enxoval-progress__fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="enxoval-progress__info">
                <span className="enxoval-progress__pct">{pct}% pronto</span>
                <span className="enxoval-progress__label">
                  {grouped.temos.length} de {items.length} itens
                </span>
              </div>
            </div>
          )}

          <div className="enxoval-cards">
            <button
              type="button"
              className={`enxoval-card enxoval-card--temos ${openSection === "temos" ? "enxoval-card--open" : ""}`}
              onClick={() => toggleSection("temos")}
            >
              <strong>{grouped.temos.length}</strong>
              <span>Já temos</span>
              <svg className="enxoval-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <button
              type="button"
              className={`enxoval-card enxoval-card--queremos ${openSection === "queremos" ? "enxoval-card--open" : ""}`}
              onClick={() => toggleSection("queremos")}
            >
              <strong>{grouped.queremos.length}</strong>
              <span>Queremos</span>
              <svg className="enxoval-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <button
              type="button"
              className={`enxoval-card enxoval-card--precisamos ${openSection === "precisamos" ? "enxoval-card--open" : ""}`}
              onClick={() => toggleSection("precisamos")}
            >
              <strong>{grouped.precisamos.length}</strong>
              <span>Precisamos</span>
              <svg className="enxoval-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          {openSection && openSection !== "adicionar" && (
            <div className="enxoval-expand" key={openSection}>
              <div className={`enxoval-expand__header enxoval-expand__header--${openSection}`}>
                <h3>
                  {openSection === "temos" && "O que já temos"}
                  {openSection === "queremos" && "O que queremos"}
                  {openSection === "precisamos" && "O que precisamos"}
                </h3>
              </div>
              {renderItems(grouped[openSection], openSection)}
            </div>
          )}

          {!guestMode && (
            <>
              <button
                type="button"
                className={`enxoval-add-btn ${openSection === "adicionar" ? "enxoval-add-btn--open" : ""}`}
                onClick={() => toggleSection("adicionar")}
              >
                + Adicionar itens
              </button>

              {openSection === "adicionar" && (
                <div className="enxoval-expand">
                  <form className="enxoval-quickadd" onSubmit={handleQuickAdd}>
                    <input
                      type="text"
                      placeholder="Nome do item..."
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      autoFocus
                    />
                    <select
                      value={quickCat}
                      onChange={(e) => setQuickCat(e.target.value as EnxovalCategoria)}
                    >
                      {ENXOVAL_CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
                        </option>
                      ))}
                    </select>
                    <button type="submit" disabled={adding || !quickName.trim()}>
                      {adding ? "..." : "Adicionar"}
                    </button>
                  </form>

                  <div className="enxoval-sugestoes">
                    <h3>Sugestões rápidas</h3>
                    <div className="enxoval-sugestoes__cats">
                      {ENXOVAL_CATEGORIAS.filter((cat) =>
                        SUGESTOES.some((s) => s.categoria === cat),
                      ).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`enxoval-sugestoes__cat ${sugestoesCat === cat ? "enxoval-sugestoes__cat--active" : ""}`}
                          onClick={() => setSugestoesCat(cat)}
                        >
                          {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
                        </button>
                      ))}
                    </div>
                    <div className="enxoval-sugestoes__list">
                      {sugestoesFiltradas.length === 0 ? (
                        <p className="enxoval-sugestoes__vazio">
                          Todos os itens dessa categoria já foram adicionados!
                        </p>
                      ) : (
                        sugestoesFiltradas.map((s) => (
                          <button
                            key={s.nome}
                            type="button"
                            className="enxoval-sugestoes__item"
                            onClick={() => handleAddSugestao(s)}
                          >
                            + {s.nome}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!guestMode && (
            <button type="button" className="enxoval-share" onClick={handleShare}>
              {copied ? "Link copiado!" : "Compartilhar com convidados"}
            </button>
          )}
        </>
      )}

      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
        />
      )}
    </section>
  );
}

function EditModal({
  item,
  onSave,
  onClose,
}: {
  item: EnxovalItem;
  onSave: (data: Partial<EnxovalItemInput>) => Promise<void>;
  onClose: () => void;
}) {
  const [nome, setNome] = useState(item.nome);
  const [categoria, setCategoria] = useState<EnxovalCategoria>(item.categoria);
  const [status, setStatus] = useState<EnxovalStatus>(item.status);
  const [quantidade, setQuantidade] = useState(item.quantidade);
  const [prioridade, setPrioridade] = useState<EnxovalPrioridade>(item.prioridade);
  const [precoEstimado, setPrecoEstimado] = useState(item.preco_estimado?.toString() ?? "");
  const [link, setLink] = useState(item.link ?? "");
  const [imagemUrl, setImagemUrl] = useState(item.imagem_url ?? "");
  const [observacoes, setObservacoes] = useState(item.observacoes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
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
    } catch {}
    setSaving(false);
  }

  return (
    <div className="enxoval-modal-overlay" onClick={onClose}>
      <div className="enxoval-modal" onClick={(e) => e.stopPropagation()}>
        <div className="enxoval-modal__header">
          <h3>Editar item</h3>
          <button type="button" className="enxoval-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="enxoval-modal__form" onSubmit={handleSubmit}>
          <label>
            <span>Nome</span>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
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
                  <option key={s} value={s}>{s === "temos" ? "Já temos" : s === "queremos" ? "Queremos" : "Precisamos"}</option>
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
              <img src={imagemUrl} alt="Preview" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
