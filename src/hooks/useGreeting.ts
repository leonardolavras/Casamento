import { useEffect, useState } from "react";

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function useGreeting(): string {
  const [greeting, setGreeting] = useState(() =>
    greetingForHour(new Date().getHours()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(greetingForHour(new Date().getHours()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}
