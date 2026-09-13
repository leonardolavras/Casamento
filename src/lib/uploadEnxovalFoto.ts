import { supabase } from "./supabase";

const BUCKET = "enxoval-fotos";

export async function uploadEnxovalFoto(file: File): Promise<string> {
  const extensao = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nomeArquivo, file, { cacheControl: "3600", upsert: false });

  if (error) {
    throw new Error(`Falha ao enviar a foto: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nomeArquivo);
  return data.publicUrl;
}
