import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS_LABEL,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalStatus,
} from "../../types/enxoval";
import { PALETA_CORES } from "../../config/site";
import { SUGESTOES } from "../../config/enxoval-sugestoes";
import { ItemEditModal } from "./ItemEditModal";
import "./Enxoval.css";

const STATUS_EMPTY_MSG: Record<EnxovalStatus, string> = {
  temos: "Nenhum item marcado como 'já temos' ainda.",
  queremos: "Nenhum item marcado como 'queremos' ainda.",
  precisamos: "Nenhum item marcado como 'precisamos' ainda.",
};

const SECTION_TITLE: Record<EnxovalStatus, string> = {
  temos: "O que já temos",
  queremos: "O que queremos",
  precisamos: "O que precisamos",
};

const STATUS_ORDER: EnxovalStatus[] = ["temos", "queremos", "precisamos"];

function scrollToSection(status: EnxovalStatus) {
  const el = document.getElementById(`enxoval-${status}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---- Owner row ---- */
function OwnerRow({
  item,
  onToggle,
  onEdit,
  onRemove,
  confirmId,
}: {
  item: EnxovalItem;
  onToggle: (id: string, s: EnxovalStatus) => void;
  onEdit: (item: EnxovalItem) => void;
  onRemove: (id: string) => void;
  confirmId: string | null;
}) {
  return (
    <div className={`enxoval-row enxoval-row--${item.status}`}>
      <button
        type="button"
        className="enxoval-row__check"
        onClick={() => onToggle(item.id, item.status)}
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
      <span
        className={`enxoval-row__nome enxoval-row__nome--editable ${item.status === "temos" ? "enxoval-row__nome--done" : ""}`}
        onClick={() => onEdit(item)}
      >
        {item.nome}
      </span>
      {item.quantidade > 1 && (
        <span className="enxoval-row__qty">{item.quantidade}x</span>
      )}
      <button
        type="button"
        className={`enxoval-row__del ${confirmId === item.id ? "enxoval-row__del--confirm" : ""}`}
        onClick={() => onRemove(item.id)}
      >
        {confirmId === item.id ? "remover?" : "×"}
      </button>
    </div>
  );
}

/* ---- Guest row ---- */
function GuestRow({ item }: { item: EnxovalItem }) {
  return (
    <div className={`enxoval-row enxoval-row--${item.status} enxoval-row--guest`}>
      <span className={`enxoval-row__nome ${item.status === "temos" ? "enxoval-row__nome--done" : ""}`}>
        {item.nome}
      </span>
      {item.quantidade > 1 && (
        <span className="enxoval-row__qty">{item.quantidade}x</span>
      )}
      {item.status !== "temos" && item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="enxoval-row__gift"
        >
          Presentear
        </a>
      )}
    </div>
  );
}

export function EnxovalChecklist() {
  const { items, loading, error, addItem, updateItem, removeItem } =
    useEnxovalItems();
  const [searchParams] = useSearchParams();
  const guestMode = searchParams.get("convidado") === "1";

  const [showAdd, setShowAdd] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickCat, setQuickCat] = useState<EnxovalCategoria>("Cozinha");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sugestoesCat, setSugestoesCat] = useState<EnxovalCategoria>("Cozinha");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EnxovalItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  function showErrorMsg(err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro inesperado";
    setActionError(msg);
    setTimeout(() => setActionError(null), 4000);
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
    } catch (err) {
      showErrorMsg(err);
    }
    setAdding(false);
  }

  async function handleAddSugestao(s: (typeof SUGESTOES)[number]) {
    try {
      await addItem({
        nome: s.nome,
        categoria: s.categoria,
        status: s.status ?? "precisamos",
        quantidade: 1,
        prioridade: "media",
        preco_estimado: null,
        link: null,
        imagem_url: s.imagem_url ?? null,
        observacoes: null,
      });
    } catch (err) {
      showErrorMsg(err);
    }
  }

  const handleToggleStatus = useCallback(async (id: string, currentStatus: EnxovalStatus) => {
    const next: EnxovalStatus = currentStatus === "temos" ? "precisamos" : "temos";
    try {
      await updateItem(id, { status: next });
    } catch (err) {
      showErrorMsg(err);
    }
  }, [updateItem]);

  const handleRemove = useCallback(async (id: string) => {
    setConfirmRemove((prev) => {
      if (prev === id) {
        removeItem(id).catch(showErrorMsg);
        return null;
      }
      setTimeout(() => setConfirmRemove(null), 3000);
      return id;
    });
  }, [removeItem]);

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

  function renderCategoryGroup(list: EnxovalItem[]) {
    const cats = ENXOVAL_CATEGORIAS.filter((cat) =>
      list.some((i) => i.categoria === cat),
    );

    return cats.map((cat) => {
      const catItems = list.filter((i) => i.categoria === cat);
      return (
        <div key={cat} className="enxoval-expand__group">
          <h4 className="enxoval-expand__cat">
            {ENXOVAL_CATEGORIA_ICONE[cat]} {cat}
            <span>{catItems.length}</span>
          </h4>
          <div className="enxoval-expand__items">
            {catItems.map((item) =>
              guestMode ? (
                <GuestRow key={item.id} item={item} />
              ) : (
                <OwnerRow
                  key={item.id}
                  item={item}
                  onToggle={handleToggleStatus}
                  onEdit={setEditingItem}
                  onRemove={handleRemove}
                  confirmId={confirmRemove}
                />
              ),
            )}
          </div>
        </div>
      );
    });
  }

  return (
    <section className="enxoval">
      <header className="enxoval__header">
        <h1>{guestMode ? "Lista de Presentes" : "Nosso Enxoval"}</h1>
        <p>
          {guestMode
            ? "Veja o que ainda precisamos e escolha um presente especial."
            : "Tudo que já temos e o que ainda falta para a nossa casa nova."}
        </p>
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

      {(error || actionError) && (
        <p className="enxoval__erro">Erro: {error || actionError}</p>
      )}

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
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                className={`enxoval-card enxoval-card--${s}`}
                onClick={() => scrollToSection(s)}
              >
                <strong>{grouped[s].length}</strong>
                <span>{ENXOVAL_STATUS_LABEL[s]}</span>
              </button>
            ))}
          </div>

          {STATUS_ORDER.map((status) => (
            <div key={status} id={`enxoval-${status}`} className="enxoval-section">
              <div className={`enxoval-section__header enxoval-section__header--${status}`}>
                <h3>{SECTION_TITLE[status]}</h3>
                <span className="enxoval-section__count">{grouped[status].length}</span>
              </div>
              {grouped[status].length === 0 ? (
                <p className="enxoval-section__vazio">{STATUS_EMPTY_MSG[status]}</p>
              ) : (
                <div className="enxoval-expand__groups">
                  {renderCategoryGroup(grouped[status])}
                </div>
              )}
            </div>
          ))}

          {!guestMode && (
            <>
              <button
                type="button"
                className={`enxoval-add-btn ${showAdd ? "enxoval-add-btn--open" : ""}`}
                onClick={() => setShowAdd((v) => !v)}
              >
                + Adicionar itens
              </button>

              {showAdd && (
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

              <button type="button" className="enxoval-share" onClick={handleShare}>
                {copied ? "Link copiado!" : "Compartilhar com convidados"}
              </button>
            </>
          )}
        </>
      )}

      {editingItem && !guestMode && (
        <ItemEditModal
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
        />
      )}
    </section>
  );
}
