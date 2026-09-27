import { useState } from "react";

/** Foto do item ou, sem foto, a inicial do nome sobre um fundo neutro. */
export function GiftThumb({ nome, src, size = "md" }: { nome: string; src: string | null; size?: "sm" | "md" }) {
  const [falhou, setFalhou] = useState(false);
  const mostrarFoto = src && !falhou;

  return (
    <span className={`gift-thumb gift-thumb--${size}`}>
      {mostrarFoto ? (
        <img src={src} alt="" loading="lazy" onError={() => setFalhou(true)} />
      ) : (
        <span className="gift-thumb__inicial">{nome.trim().charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}
