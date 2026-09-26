import { useState } from "react";
import { useMural } from "../../hooks/useMural";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./Mural.css";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function RecadoCard({ nome, mensagem, created_at }: { nome: string; mensagem: string; created_at: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="recado-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
      }}
    >
      <p className="recado-card__msg">{mensagem}</p>
      <div className="recado-card__footer">
        <span className="recado-card__nome">{nome}</span>
        <span className="recado-card__time">{timeAgo(created_at)}</span>
      </div>
    </div>
  );
}

export function Mural() {
  const { recados, loading, sending, enviar } = useMural();
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !mensagem.trim()) return;
    const ok = await enviar(nome.trim(), mensagem.trim());
    if (ok) {
      setNome("");
      setMensagem("");
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
    }
  }

  return (
    <section className="mural bg-alt" id="mural">
      <div className="section-container">
        <div className="section-heading">
          <span className="section-eyebrow">Recados</span>
          <h2 className="section-title">Mural de votos</h2>
        </div>

        <form className="mural__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={80}
            required
          />
          <textarea
            placeholder="Deixe sua mensagem para os noivos..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            maxLength={500}
            rows={3}
            required
          />
          <button type="submit" className="btn btn--primary" disabled={sending}>
            {sending ? "Enviando..." : "Enviar recado"}
          </button>
          {enviado && <span className="mural__success">Recado enviado!</span>}
        </form>

        {loading ? (
          <p className="mural__loading">Carregando recados...</p>
        ) : recados.length > 0 ? (
          <div className="mural__grid">
            {recados.map((r) => (
              <RecadoCard key={r.id} {...r} />
            ))}
          </div>
        ) : (
          <p className="mural__empty">Seja o primeiro a deixar um recado!</p>
        )}
      </div>
    </section>
  );
}
