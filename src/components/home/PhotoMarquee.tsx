import { GALLERY_PHOTOS } from "../../config/site";
import "./PhotoMarquee.css";

export function PhotoMarquee() {
  const photos = [...GALLERY_PHOTOS, ...GALLERY_PHOTOS];

  return (
    <section className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {photos.map((photo, i) => (
          <img
            key={`${photo.src}-${i}`}
            src={photo.src}
            alt=""
            className="marquee__img"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
