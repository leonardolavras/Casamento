import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { PIX_KEY, PIX_TITULAR, PIX_CIDADE } from "../../config/site";
import { buildPixPayload } from "../../lib/pix";
import "./PixSection.css";

export function PixSection() {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const [valor, setValor] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const valorNum = parseFloat(valor.replace(",", ".")) || 0;

  const payload = useMemo(() => {
    if (!PIX_KEY) return null;
    return buildPixPayload({
      chave: PIX_KEY,
      nomeRecebedor: PIX_TITULAR,
      cidade: PIX_CIDADE,
      valor: valorNum > 0 ? valorNum : undefined,
      descricao: "Presente de casamento",
    });
  }, [valorNum]);

  useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    QRCode.toDataURL(payload, { margin: 1, width: 220, color: { dark: "#201d1a", light: "#ffffff" } })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => setQrDataUrl(null));
    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (!PIX_KEY) return null;

  async function handleCopy() {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie o código Pix:", payload);
    }
  }

  return (
    <section
      ref={ref}
      className="pix-section"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
      }}
    >
      <div className="pix-section__inner">
        <span className="pix-section__eyebrow">Presente</span>
        <h2 className="pix-section__title">Prefere presentear em dinheiro?</h2>
        <p className="pix-section__lead">
          Escaneie o QR Code ou copie o código Pix abaixo. Qualquer valor nos
          ajuda a construir nosso lar.
        </p>

        <div className="pix-section__box">
          <label className="pix-section__valor">
            <span>Valor (opcional)</span>
            <div className="pix-section__valor-input">
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

          <div className="pix-section__qr">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code Pix" />
            ) : (
              <div className="pix-section__qr-placeholder">Gerando código...</div>
            )}
          </div>

          <button type="button" className="pix-section__copy" onClick={handleCopy}>
            {copied ? "Código copiado!" : "Copiar código Pix"}
          </button>
        </div>
      </div>
    </section>
  );
}
