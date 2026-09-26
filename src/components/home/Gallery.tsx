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

  // Rotate through a couple of aspect ratios so the mosaic feels organic
  const aspects = ["tall", "wide", "square"] as const;
  const shape = aspects[index % aspects.length];

  return (
    <button
      ref={ref}
      type="button"
      className={`gallery-item gallery-item--${shape} ${visible ? "gallery-item--visible" : ""}`}
      onClick={() => onOpen(src)}
      aria-label={`Ampliar foto: ${caption}`}
    >
      <img src={src} alt={caption} loading="lazy" />
    </button>
  );
}

export function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    if (lightbox) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section className="section-container">
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
