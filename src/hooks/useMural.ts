import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { MuralRecado } from "../types/database";

export function useMural() {
  const [recados, setRecados] = useState<MuralRecado[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from("mural_recados")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setRecados(data);
        setLoading(false);
      });
  }, []);

  const enviar = useCallback(async (nome: string, mensagem: string) => {
    if (!isSupabaseConfigured) return false;
    setSending(true);
    const { data, error } = await supabase
      .from("mural_recados")
      .insert({ nome, mensagem })
      .select()
      .single();
    setSending(false);
    if (error || !data) return false;
    setRecados((prev) => [data, ...prev]);
    return true;
  }, []);

  return { recados, loading, sending, enviar };
}
