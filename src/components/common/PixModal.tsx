import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { PIX_KEY, PIX_TITULAR, PIX_CIDADE } from "../../config/site";
import { buildPixPayload } from "../../lib/pix";
import "./PixModal.css";

interface PixModalProps {
  itemNome: string;
  valorSugerido: number | null;
  onClose: () => void;
}

export function PixModal({ itemNome, valorSugerido, onClose }: PixModalProps) {
  const [valor, setValor] = useState(valorSugerido ? valorSugerido.toFixed(2) : "");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

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

  if (!PIX_KEY) return null;

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
      </div>
    </div>
  );
}
