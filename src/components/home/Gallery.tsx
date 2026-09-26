import { useCallback, useEffect, useState } from "react";
import { GALLERY_PHOTOS } from "../../config/site";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./Gallery.css";

function GalleryPhoto({
  src,
  caption,
  index,
  onOpen,
}: {
  src: string;
  caption: string;
  index: number;
  onOpen: (index: number) => void;
}) {
  const { ref, visible } = useScrollReveal<HTMLButtonElement>();
  const span = index % 5 === 0 ? "featured" : index % 3 === 1 ? "tall" : "normal";

  return (
    <button
      ref={ref}
      type="button"
      className={`gallery-item gallery-item--${span}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "scale(0.96)",
        transitionDelay: `${(index % 4) * 80}ms`,
      }}
      onClick={() => onOpen(index)}
      aria-label={`Ampliar foto: ${caption}`}
    >
      <img src={src} alt={caption} loading="lazy" />
      <div className="gallery-item__overlay">
        <span className="gallery-item__icon">+</span>
      </div>
    </button>
  );
}

export function Gallery() {
  const [current, setCurrent] = useState<number | null>(null);
  const total = GALLERY_PHOTOS.length;

  const close = useCallback(() => setCurrent(null), []);
  const prev = useCallback(() => setCurrent((c) => (c !== null ? (c - 1 + total) % total : null)), [total]);
  const next = useCallback(() => setCurrent((c) => (c !== null ? (c + 1) % total : null)), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (current === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    if (current !== null) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [current, close, prev, next]);

  return (
    <section className="section-container" id="galeria">
      <div className="section-heading">
        <span className="section-eyebrow">Momentos</span>
        <h2 className="section-title">Nossa galeria</h2>
      </div>

      <div className="gallery-grid">
        {GALLERY_PHOTOS.map((photo, index) => (
          <GalleryPhoto
            key={photo.src}
            src={photo.src}
            caption={photo.caption}
            index={index}
            onOpen={setCurrent}
          />
        ))}
      </div>

      {current !== null && (
        <div className="lightbox-overlay" onClick={close} role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={close} aria-label="Fechar">&times;</button>
          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Foto anterior"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <img
            className="lightbox-content"
            src={GALLERY_PHOTOS[current].src}
            alt={GALLERY_PHOTOS[current].caption}
            key={GALLERY_PHOTOS[current].src}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Próxima foto"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <span className="lightbox-counter">{current + 1} / {total}</span>
        </div>
      )}
    </section>
  );
}
