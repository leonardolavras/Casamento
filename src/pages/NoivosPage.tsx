import { useState, useMemo } from "react";
import { useEnxovalItems } from "../hooks/useEnxovalItems";
import { useEnxovalPresentes } from "../hooks/useEnxovalPresentes";
import {
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS,
  ENXOVAL_STATUS_LABEL_CURTO,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalStatus,
} from "../types/enxoval";
import { COUPLE } from "../config/site";
import { ItemEditModal } from "../components/enxoval/ItemEditModal";
import "./NoivosPage.css";

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

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

function AdminPanel() {
  const { items, loading, error, addItem, updateItem, removeItem } = useEnxovalItems();
  const { presentes, loading: loadingPresentes } = useEnxovalPresentes();
  const [filter, setFilter] = useState<EnxovalStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<EnxovalItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const itemsPorId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const totalArrecadado = useMemo(() => presentes.reduce((sum, p) => sum + p.valor, 0), [presentes]);

  const contribuicoesPorItem = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const p of presentes) {
      if (!p.item_id) continue;
      const atual = map.get(p.item_id) ?? { total: 0, count: 0 };
      map.set(p.item_id, { total: atual.total + p.valor, count: atual.count + 1 });
    }
    return map;
  }, [presentes]);

  const { totalMeta, itensCompletos } = useMemo(() => {
    let meta = 0;
    let completos = 0;
    for (const item of items) {
      if (item.status === "temos") continue;
      if (item.preco_estimado) meta += item.preco_estimado;
      const c = contribuicoesPorItem.get(item.id);
      if (!c) continue;
      const dividido = (item.cotas ?? 1) > 1;
      const completo = dividido
        ? c.count >= (item.cotas ?? 1)
        : item.preco_estimado != null && c.total >= item.preco_estimado;
      if (completo) completos += 1;
    }
    return { totalMeta: meta, itensCompletos: completos };
  }, [items, contribuicoesPorItem]);

  const pctGeral = totalMeta > 0 ? Math.min(100, Math.round((totalArrecadado / totalMeta) * 100)) : 0;

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== "todos") list = list.filter((i) => i.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.nome.toLowerCase().includes(q) || i.categoria.toLowerCase().includes(q));
    }
    return list;
  }, [items, filter, search]);

  const stats = useMemo(() => ({
    total: items.length,
    temos: items.filter((i) => i.status === "temos").length,
    queremos: items.filter((i) => i.status === "queremos").length,
    precisamos: items.filter((i) => i.status === "precisamos").length,
  }), [items]);

  async function handleSaveEdit(data: Partial<EnxovalItemInput>) {
    if (!editingItem) return;
    await updateItem(editingItem.id, data);
    setEditingItem(null);
  }

  async function handleAdd(data: Partial<EnxovalItemInput>) {
    await addItem(data as EnxovalItemInput);
    setShowAddForm(false);
  }

  async function handleDelete(id: string) {
    await removeItem(id);
  }

  async function handleStatusToggle(id: string, current: EnxovalStatus) {
    const order: EnxovalStatus[] = ["precisamos", "queremos", "temos"];
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];
    await updateItem(id, { status: next });
  }

  return (
    <section className="noivos-admin">
      <header className="noivos-admin__header">
        <h1>Painel dos Noivos</h1>
        <p>Gerencie o enxoval, itens e configurações do site.</p>
      </header>

      <div className="noivos-hero-stat">
        <span className="noivos-hero-stat__eyebrow">Total arrecadado</span>
        <span className="noivos-hero-stat__valor">{formatBRL(totalArrecadado)}</span>
        {totalMeta > 0 && (
          <>
            <div className="noivos-hero-stat__bar">
              <div className="noivos-hero-stat__fill" style={{ width: `${pctGeral}%` }} />
            </div>
            <span className="noivos-hero-stat__label">de {formatBRL(totalMeta)} em metas ({pctGeral}%)</span>
          </>
        )}
        <div className="noivos-hero-stat__grid">
          <div className="noivos-hero-stat__mini">
            <strong>{itensCompletos}</strong>
            <span>itens completos</span>
          </div>
          <div className="noivos-hero-stat__mini">
            <strong>{presentes.length}</strong>
            <span>contribuições</span>
          </div>
          <div className="noivos-hero-stat__mini">
            <strong>{stats.precisamos}</strong>
            <span>ainda faltam</span>
          </div>
        </div>
      </div>

      <div className="noivos-stats">
        <div className="noivos-stat">
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        {ENXOVAL_STATUS.map((s) => (
          <div key={s} className={`noivos-stat noivos-stat--${s}`}>
            <strong>{stats[s]}</strong>
            <span>{ENXOVAL_STATUS_LABEL_CURTO[s]}</span>
          </div>
        ))}
      </div>

      {error && <p className="noivos-admin__erro">Erro: {error}</p>}

      <div className="noivos-toolbar">
        <input
          type="text"
          placeholder="Buscar itens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="noivos-toolbar__search"
        />
        <div className="noivos-toolbar__filters">
          <button
            type="button"
            className={`noivos-toolbar__filter ${filter === "todos" ? "noivos-toolbar__filter--active" : ""}`}
            onClick={() => setFilter("todos")}
          >
            Todos
          </button>
          {ENXOVAL_STATUS.map((s) => (
            <button
              key={s}
              type="button"
              className={`noivos-toolbar__filter ${filter === s ? "noivos-toolbar__filter--active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {ENXOVAL_STATUS_LABEL_CURTO[s]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="noivos-toolbar__add"
          onClick={() => setShowAddForm(true)}
        >
          + Novo item
        </button>
      </div>

      {loading ? (
        <p className="noivos-admin__loading">Carregando...</p>
      ) : (
        <div className="noivos-table-wrap">
          <table className="noivos-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Qtd</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="noivos-table__empty">Nenhum item encontrado</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="noivos-table__nome">
                      {item.imagem_url && (
                        <img src={item.imagem_url} alt="" className="noivos-table__thumb" />
                      )}
                      <span>{item.nome}</span>
                    </td>
                    <td>
                      <span className="noivos-table__cat">
                        {ENXOVAL_CATEGORIA_ICONE[item.categoria]} {item.categoria}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`noivos-table__status noivos-table__status--${item.status}`}
                        onClick={() => handleStatusToggle(item.id, item.status)}
                      >
                        {ENXOVAL_STATUS_LABEL_CURTO[item.status]}
                      </button>
                    </td>
                    <td className="noivos-table__qty">{item.quantidade}</td>
                    <td className="noivos-table__actions">
                      <button type="button" onClick={() => setEditingItem(item)} title="Editar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button type="button" onClick={() => handleDelete(item.id)} title="Excluir" className="noivos-table__del">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="noivos-presentes">
        <div className="noivos-presentes__header">
          <h2>Presentes recebidos</h2>
          <span className="noivos-presentes__total">{formatBRL(totalArrecadado)}</span>
        </div>
        <p className="noivos-presentes__aviso">
          Confirmado pelo próprio convidado ao pagar via Pix — não há confirmação bancária automática.
        </p>

        {loadingPresentes ? (
          <p className="noivos-admin__loading">Carregando...</p>
        ) : presentes.length === 0 ? (
          <p className="noivos-presentes__vazio">Nenhuma contribuição registrada ainda.</p>
        ) : (
          <div className="noivos-presentes__list">
            {presentes.map((p) => {
              const item = p.item_id ? itemsPorId.get(p.item_id) : undefined;
              return (
                <div key={p.id} className="noivos-presente">
                  <div className="noivos-presente__foto">
                    {item?.imagem_url && <img src={item.imagem_url} alt="" />}
                  </div>
                  <div className="noivos-presente__info">
                    <p className="noivos-presente__item">{p.item_nome}</p>
                    <p className="noivos-presente__doador">De {p.nome_doador}</p>
                  </div>
                  <div className="noivos-presente__meta">
                    <span className="noivos-presente__valor">{formatBRL(p.valor)}</span>
                    <span className="noivos-presente__data">{formatData(p.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
          title="Novo item"
          onSave={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </section>
  );
}
