import { useState, useMemo } from "react";
import { useEnxovalItems } from "../hooks/useEnxovalItems";
import { useEnxovalPresentes } from "../hooks/useEnxovalPresentes";
import {
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalStatus,
} from "../types/enxoval";
import { COUPLE } from "../config/site";
import { agruparContribuicoes, formatBRL, presenteCompleto, rotuloPreco } from "../lib/presente";
import { ItemEditModal } from "../components/enxoval/ItemEditModal";
import { GiftThumb } from "../components/enxoval/GiftThumb";
import "../components/enxoval/Enxoval.css";
import "./NoivosPage.css";

function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const ADMIN_PASSWORD = "lg2028";
const STORAGE_KEY = "noivos_auth";

export function NoivosPage() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  }

  if (!authed) {
    return (
      <section className="noivos-login">
        <div className="noivos-login__card">
          <h1>{COUPLE.nome1} & {COUPLE.nome2}</h1>
          <p>Área exclusiva dos noivos</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Senha"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
              className={pwError ? "noivos-login__input--error" : ""}
            />
            <button type="submit">Entrar</button>
          </form>
          {pwError && <p className="noivos-login__error">Senha incorreta</p>}
        </div>
      </section>
    );
  }

  return <AdminPanel />;
}

type Aba = "presentes" | "recebidos";

function AdminPanel() {
  const { items, loading, error, addItem, updateItem, removeItem } = useEnxovalItems();
  const { presentes, loading: loadingPresentes } = useEnxovalPresentes();
  const [aba, setAba] = useState<Aba>("presentes");
  const [filter, setFilter] = useState<EnxovalStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<EnxovalItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const itemsPorId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const contribuicoes = useMemo(() => agruparContribuicoes(presentes), [presentes]);
  const doadoresPorItem = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const p of presentes) {
      if (!p.item_id) continue;
      map.set(p.item_id, [...(map.get(p.item_id) ?? []), p.nome_doador.split(" ")[0]]);
    }
    return map;
  }, [presentes]);
  const totalArrecadado = useMemo(() => presentes.reduce((sum, p) => sum + p.valor, 0), [presentes]);

  const { totalMeta, itensCompletos } = useMemo(() => {
    let meta = 0;
    let completos = 0;
    for (const item of items) {
      if (item.status === "temos") continue;
      if (item.preco_estimado) meta += item.preco_estimado;
      if (presenteCompleto(item, contribuicoes.get(item.id))) completos += 1;
    }
    return { totalMeta: meta, itensCompletos: completos };
  }, [items, contribuicoes]);

  const pctGeral = totalMeta > 0 ? Math.min(100, Math.round((totalArrecadado / totalMeta) * 100)) : 0;

  const contagem = useMemo(() => ({
    todos: items.length,
    precisamos: items.filter((i) => i.status === "precisamos").length,
    temos: items.filter((i) => i.status === "temos").length,
  }), [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== "todos") list = list.filter((i) => i.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.nome.toLowerCase().includes(q) || i.categoria.toLowerCase().includes(q));
    }
    return list;
  }, [items, filter, search]);

  async function handleSaveEdit(data: Partial<EnxovalItemInput>) {
    if (!editingItem) return;
    await updateItem(editingItem.id, data);
    setEditingItem(null);
  }

  async function handleAdd(data: Partial<EnxovalItemInput>) {
    await addItem(data as EnxovalItemInput);
    setShowAddForm(false);
  }

  async function handleDelete(item: EnxovalItem) {
    if (!window.confirm(`Excluir "${item.nome}" da lista?`)) return;
    await removeItem(item.id);
  }

  async function handleStatusToggle(item: EnxovalItem) {
    await updateItem(item.id, { status: item.status === "temos" ? "precisamos" : "temos" });
  }

  return (
    <section className="noivos-admin">
      <header className="noivos-admin__header">
        <span className="enxoval__eyebrow">Só vocês veem isso</span>
        <h1>Painel dos Noivos</h1>
      </header>

      <div className="noivos-hero-stat">
        <span className="noivos-hero-stat__eyebrow">Total arrecadado</span>
        <span className="noivos-hero-stat__valor">{formatBRL(totalArrecadado)}</span>
        {totalMeta > 0 && (
          <>
            <div className="noivos-hero-stat__bar">
              <div className="noivos-hero-stat__fill" style={{ width: `${pctGeral}%` }} />
            </div>
            <span className="noivos-hero-stat__label">{pctGeral}% de {formatBRL(totalMeta)} da lista</span>
          </>
        )}
        <div className="noivos-hero-stat__grid">
          <div className="noivos-hero-stat__mini">
            <strong>{presentes.length}</strong>
            <span>contribuições</span>
          </div>
          <div className="noivos-hero-stat__mini">
            <strong>{itensCompletos}</strong>
            <span>completos</span>
          </div>
          <div className="noivos-hero-stat__mini">
            <strong>{contagem.precisamos - itensCompletos}</strong>
            <span>faltam</span>
          </div>
        </div>
      </div>

      <div className="noivos-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={aba === "presentes"} onClick={() => setAba("presentes")}>
          Presentes
        </button>
        <button type="button" role="tab" aria-selected={aba === "recebidos"} onClick={() => setAba("recebidos")}>
          Recebidos {presentes.length > 0 && <span>{presentes.length}</span>}
        </button>
      </div>

      {error && <p className="enxoval__erro">Erro: {error}</p>}

      {aba === "presentes" ? (
        <>
          <div className="noivos-toolbar">
            <input
              type="search"
              placeholder="Buscar presente ou categoria…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="noivos-toolbar__search"
            />
            <div className="gift-chips">
              <button
                type="button"
                className={`gift-chip ${filter === "todos" ? "gift-chip--ativo" : ""}`}
                onClick={() => setFilter("todos")}
              >
                Todos <span>{contagem.todos}</span>
              </button>
              {ENXOVAL_STATUS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`gift-chip ${filter === s ? "gift-chip--ativo" : ""}`}
                  onClick={() => setFilter(s)}
                >
                  {ENXOVAL_STATUS_LABEL[s]} <span>{contagem[s]}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="enxoval__loading">Carregando...</p>
          ) : (
            <ul className="gift-list">
              <li>
                <button type="button" className="gift-row gift-row--criar" onClick={() => setShowAddForm(true)}>
                  <span className="gift-row__plus" aria-hidden="true">+</span>
                  <span>Criar um presente</span>
                </button>
              </li>

              {filtered.length === 0 ? (
                <li className="gift-row gift-row--vazio">Nenhum presente encontrado</li>
              ) : (
                filtered.map((item) => {
                  const c = contribuicoes.get(item.id);
                  const completo = presenteCompleto(item, c);
                  const doadores = doadoresPorItem.get(item.id);
                  return (
                    <li key={item.id} className="gift-row gift-row--admin">
                      <button
                        type="button"
                        className="gift-row__main"
                        onClick={() => setEditingItem(item)}
                        aria-label={`Editar ${item.nome}`}
                      >
                        <GiftThumb nome={item.nome} src={item.imagem_url} />
                        <span className="gift-row__info">
                          <span className="gift-row__nome">
                            {item.nome}
                            {item.quantidade > 1 && <span className="gift-row__qtd">{item.quantidade} un.</span>}
                          </span>
                          <span className="gift-row__meta">
                            {rotuloPreco(item)} · {item.categoria}
                          </span>
                          {c && doadores && (
                            <span className="gift-row__meta gift-row__meta--destaque">
                              {completo ? "Presenteado" : `${formatBRL(c.total)} recebidos`} por {doadores.join(", ")}
                            </span>
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`status-pill status-pill--${item.status}`}
                        onClick={() => handleStatusToggle(item)}
                        title="Alternar entre Precisamos e Já temos"
                      >
                        {ENXOVAL_STATUS_LABEL[item.status]}
                      </button>
                      <button
                        type="button"
                        className="gift-row__del"
                        onClick={() => handleDelete(item)}
                        aria-label={`Excluir ${item.nome}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </>
      ) : (
        <>
          <p className="noivos-presentes__aviso">
            Confirmado pelo próprio convidado ao pagar via Pix — confira no extrato do banco.
          </p>
          {loadingPresentes ? (
            <p className="enxoval__loading">Carregando...</p>
          ) : presentes.length === 0 ? (
            <p className="enxoval-section__vazio">Nenhuma contribuição registrada ainda.</p>
          ) : (
            <ul className="gift-list">
              {presentes.map((p) => {
                const item = p.item_id ? itemsPorId.get(p.item_id) : undefined;
                return (
                  <li key={p.id} className="gift-row">
                    <GiftThumb nome={p.item_nome} src={item?.imagem_url ?? null} />
                    <div className="gift-row__info">
                      <p className="gift-row__nome">{p.item_nome}</p>
                      <p className="gift-row__meta">
                        De <strong>{p.nome_doador}</strong> · {formatData(p.created_at)}
                      </p>
                      {p.mensagem && <p className="gift-row__msg">“{p.mensagem}”</p>}
                    </div>
                    <span className="noivos-presente__valor">{formatBRL(p.valor)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {editingItem && (
        <ItemEditModal
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
        />
      )}

      {showAddForm && (
        <ItemEditModal
          item={null}
          title="Criar um presente"
          onSave={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </section>
  );
}
