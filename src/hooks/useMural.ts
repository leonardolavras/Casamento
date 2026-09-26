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

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("mural-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mural_recados" },
        (payload) => {
          setRecados((prev) => {
            const novo = payload.new as MuralRecado;
            if (prev.some((r) => r.id === novo.id)) return prev;
            return [novo, ...prev];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const enviar = useCallback(async (nome: string, mensagem: string) => {
    if (!isSupabaseConfigured) return false;
    setSending(true);
    const { error } = await supabase
      .from("mural_recados")
      .insert({ nome, mensagem });
    setSending(false);
    if (error) return false;
    return true;
  }, []);

  return { recados, loading, sending, enviar };
}
