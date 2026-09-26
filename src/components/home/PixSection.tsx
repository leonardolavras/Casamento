import { useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { PIX_KEY } from "../../config/site";
import "./PixSection.css";

export function PixSection() {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const [copied, setCopied] = useState(false);

  if (!PIX_KEY) return null;

  function handleCopy() {
    navigator.clipboard.writeText(PIX_KEY!).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
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
          Se preferir contribuir via Pix, use a chave abaixo.
          Qualquer valor nos ajuda a construir nosso lar.
        </p>

        <div className="pix-section__key-box">
          <span className="pix-section__label">Chave Pix</span>
          <div className="pix-section__key-row">
            <code className="pix-section__key">{PIX_KEY}</code>
            <button
              type="button"
              className="pix-section__copy"
              onClick={handleCopy}
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
          </div>
          {copied && <span className="pix-section__copied">Chave copiada!</span>}
        </div>
      </div>
    </section>
  );
}
