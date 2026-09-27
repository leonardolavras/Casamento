import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { PIX_KEY, PIX_TITULAR, PIX_CIDADE } from "../../config/site";
import { buildPixPayload } from "../../lib/pix";
import "./PixModal.css";

interface PixModalProps {
  itemNome: string;
  valorSugerido: number | null;
  onClose: () => void;
  onConfirm: (nomeDoador: string, valor: number) => Promise<void>;
}

export function PixModal({ itemNome, valorSugerido, onClose, onConfirm }: PixModalProps) {
  const [valor, setValor] = useState(valorSugerido ? valorSugerido.toFixed(2) : "");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [nomeDoador, setNomeDoador] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const valorNum = parseFloat(valor.replace(",", ".")) || 0;

  const payload = useMemo(() => {
    if (!PIX_KEY) return null;
    return buildPixPayload({
      chave: PIX_KEY,
      nomeRecebedor: PIX_TITULAR,
      cidade: PIX_CIDADE,
      valor: valorNum > 0 ? valorNum : undefined,
      descricao: itemNome,
    });
  }, [valorNum, itemNome]);

  useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    QRCode.toDataURL(payload, { margin: 1, width: 260, color: { dark: "#201d1a", light: "#ffffff" } })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => setQrDataUrl(null));
    return () => {
      cancelled = true;
    };
  }, [payload]);

  async function handleCopy() {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copie o código Pix:", payload);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeDoador.trim() || valorNum <= 0 || confirmando) return;
    setConfirmando(true);
    setErro(null);
    try {
      await onConfirm(nomeDoador.trim(), valorNum);
      setConfirmado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível registrar agora.");
    }
    setConfirmando(false);
  }

  if (!PIX_KEY) return null;

  if (confirmado) {
    return (
      <div className="pix-modal-overlay" onClick={onClose}>
        <div className="pix-modal pix-modal--sucesso" onClick={(e) => e.stopPropagation()}>
          <span className="pix-modal__check">✓</span>
          <h3>Muito obrigado, {nomeDoador.split(" ")[0]}!</h3>
          <p>Seu carinho com "{itemNome}" significa muito pra gente.</p>
          <button type="button" className="pix-modal__copy" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pix-modal-overlay" onClick={onClose}>
      <div className="pix-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pix-modal__header">
          <h3>Presentear</h3>
          <button type="button" className="pix-modal__close" onClick={onClose}>×</button>
        </div>

        <p className="pix-modal__item">{itemNome}</p>

        <label className="pix-modal__valor">
          <span>Valor da contribuição</span>
          <div className="pix-modal__valor-input">
            <span>R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
            />
          </div>
        </label>

        <div className="pix-modal__qr">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code Pix" />
          ) : (
            <div className="pix-modal__qr-placeholder">Gerando código...</div>
          )}
        </div>

        {payload && (
          <button type="button" className="pix-modal__copy" onClick={handleCopy}>
            {copiado ? "Código copiado!" : "Copiar código Pix"}
          </button>
        )}

        <p className="pix-modal__hint">
          Abra o app do seu banco, escolha Pix Copia e Cola ou escaneie o QR Code acima.
        </p>

        <form className="pix-modal__confirm" onSubmit={handleConfirm}>
          <span className="pix-modal__confirm-label">Já pagou? Deixe seu nome pra gente agradecer</span>
          <div className="pix-modal__confirm-row">
            <input
              type="text"
              placeholder="Seu nome"
              value={nomeDoador}
              onChange={(e) => setNomeDoador(e.target.value)}
              maxLength={80}
            />
            <button type="submit" disabled={!nomeDoador.trim() || valorNum <= 0 || confirmando}>
              {confirmando ? "..." : "Confirmar"}
            </button>
          </div>
          {erro && <span className="pix-modal__confirm-erro">{erro}</span>}
        </form>
      </div>
    </div>
  );
}
