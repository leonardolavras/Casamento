import { COUPLE } from "../config/site";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./HistoriaPage.css";

function StoryBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="historia-block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function HistoriaPage() {
  return (
    <div className="page-transition" style={{ paddingTop: "80px" }}>
      <section className="section-container">
        <div className="section-heading">
          <span className="section-eyebrow">Sobre nós</span>
          <h2 className="section-title">Nossa história</h2>
        </div>

        <div className="historia-content">
          <StoryBlock>
            <div className="historia-photo-slot">
              <img
                src="/fotos/historia-1.jpg"
                alt={`${COUPLE.nome1} e ${COUPLE.nome2}`}
                loading="lazy"
              />
              <span className="historia-photo-slot__fallback">
                Foto do casal
              </span>
            </div>
          </StoryBlock>

          <StoryBlock delay={100}>
            <blockquote className="historia-quote">
              "O amor não se resume a olhar um para o outro, mas sim a olhar
              juntos na mesma direção."
            </blockquote>
          </StoryBlock>

          <StoryBlock delay={200}>
            <p className="historia-text">
              Em breve, vamos contar aqui como tudo começou, como nos
              apaixonamos e os momentos que marcaram a nossa história até o
              grande dia. Volte em breve para saber mais sobre{" "}
              {COUPLE.nome1} & {COUPLE.nome2}.
            </p>
          </StoryBlock>

          <StoryBlock delay={300}>
            <div className="historia-photo-slot historia-photo-slot--wide">
              <img
                src="/fotos/historia-2.jpg"
                alt={`${COUPLE.nome1} e ${COUPLE.nome2}`}
                loading="lazy"
              />
              <span className="historia-photo-slot__fallback">
                Foto do ensaio
              </span>
            </div>
          </StoryBlock>
        </div>
      </section>
    </div>
  );
}
