import { useEffect, useState } from "react";

export function useTypewriter(text: string, delayMs = 1200, speedMs = 45): string {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let index = 0;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) clearInterval(interval);
      }, speedMs);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delayMs, speedMs]);

  return displayed;
}
