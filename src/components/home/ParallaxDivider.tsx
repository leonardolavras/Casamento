import "./ParallaxDivider.css";

interface Props {
  src: string;
  alt?: string;
  children?: React.ReactNode;
}

export function ParallaxDivider({ src, alt = "", children }: Props) {
  return (
    <section className="parallax-divider" style={{ backgroundImage: `url(${src})` }}>
      <div className="parallax-divider__scrim" />
      {children && <div className="parallax-divider__content">{children}</div>}
      <span className="sr-only">{alt}</span>
    </section>
  );
}
