import { useEffect, useState } from "react";
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
  onOpen: (src: string) => void;
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
      onClick={() => onOpen(src)}
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
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    if (lightbox) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

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
            onOpen={setLightbox}
          />
        ))}
      </div>

      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <span className="lightbox-close">&times;</span>
          <img className="lightbox-content" src={lightbox} alt="" />
        </div>
      )}
    </section>
  );
}
