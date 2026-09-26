import { useState, useMemo } from "react";
import { useEnxovalItems } from "../hooks/useEnxovalItems";
import {
  ENXOVAL_CATEGORIAS,
  ENXOVAL_CATEGORIA_ICONE,
  ENXOVAL_STATUS,
  type EnxovalCategoria,
  type EnxovalItem,
  type EnxovalItemInput,
  type EnxovalPrioridade,
  type EnxovalStatus,
} from "../types/enxoval";
import { COUPLE } from "../config/site";
import "./NoivosPage.css";

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
  const [filter, setFilter] = useState<EnxovalStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<EnxovalItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  async function handleSaveEdit(id: string, data: Partial<EnxovalItemInput>) {
    await updateItem(id, data);
    setEditingItem(null);
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

      <div className="noivos-stats">
        <div className="noivos-stat">
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        <div className="noivos-stat noivos-stat--temos">
          <strong>{stats.temos}</strong>
          <span>Temos</span>
        </div>
        <div className="noivos-stat noivos-stat--queremos">
          <strong>{stats.queremos}</strong>
          <span>Queremos</span>
        </div>
        <div className="noivos-stat noivos-stat--precisamos">
          <strong>{stats.precisamos}</strong>
          <span>Precisamos</span>
        </div>
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
          {(["todos", ...ENXOVAL_STATUS] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`noivos-toolbar__filter ${filter === s ? "noivos-toolbar__filter--active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "todos" ? "Todos" : s === "temos" ? "Temos" : s === "queremos" ? "Queremos" : "Precisamos"}
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
                        {item.status === "temos" ? "Temos" : item.status === "queremos" ? "Queremos" : "Precisamos"}
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

      {editingItem && (
        <AdminEditModal
          item={editingItem}
          onSave={(data) => handleSaveEdit(editingItem.id, data)}
          onClose={() => setEditingItem(null)}
        />
      )}

      {showAddForm && (
        <AdminAddModal
          onAdd={async (input) => { await addItem(input); setShowAddForm(false); }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </section>
  );
}

function AdminEditModal({
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
          <button type="button" className="enxoval-modal__close" onClick={onClose}>×</button>
        </div>
        <form className="enxoval-modal__form" onSubmit={handleSubmit}>
          <label><span>Nome</span><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} /></label>
          <div className="enxoval-modal__row">
            <label><span>Categoria</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value as EnxovalCategoria)}>
                {ENXOVAL_CATEGORIAS.map((c) => <option key={c} value={c}>{ENXOVAL_CATEGORIA_ICONE[c]} {c}</option>)}
              </select>
            </label>
            <label><span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as EnxovalStatus)}>
                {ENXOVAL_STATUS.map((s) => <option key={s} value={s}>{s === "temos" ? "Já temos" : s === "queremos" ? "Queremos" : "Precisamos"}</option>)}
              </select>
            </label>
          </div>
          <div className="enxoval-modal__row">
            <label><span>Quantidade</span><input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value) || 1)} /></label>
            <label><span>Prioridade</span>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as EnxovalPrioridade)}>
                <option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option>
              </select>
            </label>
            <label><span>Preço est.</span><input type="number" min={0} step="0.01" placeholder="R$" value={precoEstimado} onChange={(e) => setPrecoEstimado(e.target.value)} /></label>
          </div>
          <label><span>Link do produto</span><input type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} /></label>
          <label><span>URL da imagem</span><input type="url" placeholder="https://..." value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} /></label>
          {imagemUrl.trim() && (
            <div className="enxoval-modal__preview"><img src={imagemUrl} alt="Preview" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /></div>
          )}
          <label><span>Observações</span><textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} /></label>
          <div className="enxoval-modal__actions">
            <button type="button" className="enxoval-modal__cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="enxoval-modal__save" disabled={saving || !nome.trim()}>{saving ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminAddModal({
  onAdd,
  onClose,
}: {
  onAdd: (input: EnxovalItemInput) => Promise<void>;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<EnxovalCategoria>("Cozinha");
  const [status, setStatus] = useState<EnxovalStatus>("precisamos");
  const [quantidade, setQuantidade] = useState(1);
  const [imagemUrl, setImagemUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
    try {
      await onAdd({
        nome: nome.trim(),
        categoria,
        status,
        quantidade,
        prioridade: "media",
        preco_estimado: null,
        link: null,
        imagem_url: imagemUrl.trim() || null,
        observacoes: null,
      });
    } catch {}
    setSaving(false);
  }

  return (
    <div className="enxoval-modal-overlay" onClick={onClose}>
      <div className="enxoval-modal" onClick={(e) => e.stopPropagation()}>
        <div className="enxoval-modal__header">
          <h3>Novo item</h3>
          <button type="button" className="enxoval-modal__close" onClick={onClose}>×</button>
        </div>
        <form className="enxoval-modal__form" onSubmit={handleSubmit}>
          <label><span>Nome</span><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus /></label>
          <div className="enxoval-modal__row">
            <label><span>Categoria</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value as EnxovalCategoria)}>
                {ENXOVAL_CATEGORIAS.map((c) => <option key={c} value={c}>{ENXOVAL_CATEGORIA_ICONE[c]} {c}</option>)}
              </select>
            </label>
            <label><span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as EnxovalStatus)}>
                {ENXOVAL_STATUS.map((s) => <option key={s} value={s}>{s === "temos" ? "Já temos" : s === "queremos" ? "Queremos" : "Precisamos"}</option>)}
              </select>
            </label>
          </div>
          <div className="enxoval-modal__row">
            <label><span>Quantidade</span><input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value) || 1)} /></label>
          </div>
          <label><span>URL da imagem</span><input type="url" placeholder="https://..." value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} /></label>
          <div className="enxoval-modal__actions">
            <button type="button" className="enxoval-modal__cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="enxoval-modal__save" disabled={saving || !nome.trim()}>{saving ? "Adicionando..." : "Adicionar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
