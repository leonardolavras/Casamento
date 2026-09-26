import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEnxovalItems } from "../../hooks/useEnxovalItems";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  type EnxovalCategoria,
  type EnxovalItemInput,
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
        observacoes: null,
      });
      setQuickName("");
    } catch {}
    setAdding(false);
  }

  async function handleAddSugestao(nome: string, categoria: EnxovalCategoria) {
    const input: EnxovalItemInput = {
      nome,
      categoria,
      status: "precisamos",
      quantidade: 1,
      prioridade: "media",
      preco_estimado: null,
      link: null,
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
                    <span className={`enxoval-row__nome ${item.status === "temos" ? "enxoval-row__nome--done" : ""}`}>
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

          {/* Status cards */}
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

          {/* Expanded item list */}
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

          {/* Add section */}
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
                            onClick={() => handleAddSugestao(s.nome, s.categoria)}
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
    </section>
  );
}
