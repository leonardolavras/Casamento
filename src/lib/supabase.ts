import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja .env.example). O checklist de Enxoval não vai funcionar até isso ser configurado.",
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);
