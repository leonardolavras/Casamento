import { useEffect, useState } from "react";

interface Countdown {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  passou: boolean;
}

function calcular(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  const passou = diff <= 0;
  const abs = Math.abs(diff);

  return {
    dias: Math.floor(abs / (1000 * 60 * 60 * 24)),
    horas: Math.floor((abs / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((abs / (1000 * 60)) % 60),
    segundos: Math.floor((abs / 1000) % 60),
    passou,
  };
}

export function useCountdown(target: Date): Countdown {
  const [countdown, setCountdown] = useState(() => calcular(target));

  useEffect(() => {
    const interval = setInterval(() => setCountdown(calcular(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return countdown;
}
