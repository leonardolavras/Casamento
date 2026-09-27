import { useEffect } from "react";

/** Enquanto o componente estiver na tela, a página de fundo não rola. */
export function useTravarRolagem() {
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);
}
