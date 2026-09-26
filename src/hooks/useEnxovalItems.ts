import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { EnxovalItem, EnxovalItemInput } from "../types/enxoval";

const CONFIG_ERROR =
  "Supabase não configurado. Copie .env.example para .env, preencha com as credenciais do seu projeto e reinicie o servidor (npm run dev).";

interface UseEnxovalItemsResult {
  items: EnxovalItem[];
  loading: boolean;
  error: string | null;
  addItem: (input: EnxovalItemInput) => Promise<void>;
  updateItem: (id: string, input: Partial<EnxovalItemInput>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

export function useEnxovalItems(): UseEnxovalItemsResult {
  const [items, setItems] = useState<EnxovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError(CONFIG_ERROR);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("enxoval_itens")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("enxoval-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enxoval_itens" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setItems((prev) => {
              if (prev.some((i) => i.id === (payload.new as EnxovalItem).id))
                return prev;
              return [...prev, payload.new as EnxovalItem];
            });
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((i) =>
                i.id === (payload.new as EnxovalItem).id
                  ? (payload.new as EnxovalItem)
                  : i,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) =>
              prev.filter((i) => i.id !== (payload.old as { id: string }).id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addItem = useCallback(
    async (input: EnxovalItemInput) => {
      if (!isSupabaseConfigured) throw new Error(CONFIG_ERROR);
      const { error: insertError } = await supabase
        .from("enxoval_itens")
        .insert(input);
      if (insertError) throw new Error(insertError.message);
    },
    [],
  );

  const updateItem = useCallback(
    async (id: string, input: Partial<EnxovalItemInput>) => {
      if (!isSupabaseConfigured) throw new Error(CONFIG_ERROR);
      const { error: updateError } = await supabase
        .from("enxoval_itens")
        .update(input)
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
    },
    [],
  );

  const removeItem = useCallback(
    async (id: string) => {
      if (!isSupabaseConfigured) throw new Error(CONFIG_ERROR);
      const { error: deleteError } = await supabase
        .from("enxoval_itens")
        .delete()
        .eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
    },
    [],
  );

  return { items, loading, error, addItem, updateItem, removeItem, reload: load };
}
