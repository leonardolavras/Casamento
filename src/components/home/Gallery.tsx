import { useState } from "react";
import { GALLERY_PHOTOS } from "../../config/site";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./Gallery.css";

function GalleryPhoto({
  src,
  caption,
  onOpen,
}: {
  src: string;
  caption: string;
  onOpen: (src: string) => void;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`photo-frame ${visible ? "photo-frame--visible" : ""}`}
    >
      <img src={src} alt={caption} onClick={() => onOpen(src)} />
      <span className="photo-caption">{caption}</span>
    </div>
  );
}

export function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="section-container bg-alt">
      <h2 className="section-title">Memórias</h2>
      <div className="gallery-grid">
        {GALLERY_PHOTOS.map((photo) => (
          <GalleryPhoto
            key={photo.src}
            src={photo.src}
            caption={photo.caption}
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
