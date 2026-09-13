import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { EnxovalItem, EnxovalItemInput } from "../types/enxoval";

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

  const addItem = useCallback(
    async (input: EnxovalItemInput) => {
      const { error: insertError } = await supabase
        .from("enxoval_itens")
        .insert(input);
      if (insertError) throw new Error(insertError.message);
      await load();
    },
    [load],
  );

  const updateItem = useCallback(
    async (id: string, input: Partial<EnxovalItemInput>) => {
      const { error: updateError } = await supabase
        .from("enxoval_itens")
        .update(input)
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      await load();
    },
    [load],
  );

  const removeItem = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase
        .from("enxoval_itens")
        .delete()
        .eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      await load();
    },
    [load],
  );

  return { items, loading, error, addItem, updateItem, removeItem, reload: load };
}
