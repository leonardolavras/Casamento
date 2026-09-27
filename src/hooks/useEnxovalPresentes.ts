import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { EnxovalPresente, EnxovalPresenteInput } from "../types/enxoval";

interface UseEnxovalPresentesResult {
  presentes: EnxovalPresente[];
  loading: boolean;
  registrar: (input: EnxovalPresenteInput) => Promise<void>;
  confirmar: (id: string, confirmado: boolean) => Promise<void>;
}

export function useEnxovalPresentes(): UseEnxovalPresentesResult {
  const [presentes, setPresentes] = useState<EnxovalPresente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from("enxoval_presentes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPresentes(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("enxoval-presentes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enxoval_presentes" },
        (payload) => {
          setPresentes((prev) => {
            const novo = payload.new as EnxovalPresente;
            if (prev.some((p) => p.id === novo.id)) return prev;
            return [novo, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "enxoval_presentes" },
        (payload) => {
          const atualizado = payload.new as EnxovalPresente;
          setPresentes((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const registrar = useCallback(async (input: EnxovalPresenteInput) => {
    if (!isSupabaseConfigured) throw new Error("Supabase não configurado.");
    const { error } = await supabase.from("enxoval_presentes").insert(input);
    if (error) throw new Error(error.message);
  }, []);

  const confirmar = useCallback(async (id: string, confirmado: boolean) => {
    if (!isSupabaseConfigured) throw new Error("Supabase não configurado.");
    // otimista: o botão responde na hora; desfaz se o banco recusar
    setPresentes((prev) => prev.map((p) => (p.id === id ? { ...p, confirmado } : p)));
    const { error } = await supabase.from("enxoval_presentes").update({ confirmado }).eq("id", id);
    if (error) {
      setPresentes((prev) => prev.map((p) => (p.id === id ? { ...p, confirmado: !confirmado } : p)));
      throw new Error(
        /confirmado/.test(error.message)
          ? "Falta criar a coluna no banco: rode o arquivo supabase/add-confirmado.sql no Supabase."
          : error.message,
      );
    }
  }, []);

  return { presentes, loading, registrar, confirmar };
}
