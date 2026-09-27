const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Pede pra função /api/foto-produto baixar a foto do anúncio e devolve como arquivo. */
export async function baixarFotoDoLink(link: string): Promise<File> {
  const res = await fetch(`/api/foto-produto?url=${encodeURIComponent(link)}`);
  const tipo = (res.headers.get("content-type") ?? "").split(";")[0].trim();

  if (!res.ok) {
    let mensagem = "Não consegui buscar a foto desse link. Envie a foto manualmente.";
    if (tipo === "application/json") {
      const corpo = (await res.json().catch(() => null)) as { erro?: string } | null;
      if (corpo?.erro) mensagem = corpo.erro;
    }
    throw new Error(mensagem);
  }

  // no `npm run dev` a rota /api não existe e o Vite devolve o index.html
  const extensao = EXTENSOES[tipo];
  if (!extensao) throw new Error("A busca de foto pelo link só funciona no site publicado na Vercel.");

  const blob = await res.blob();
  return new File([blob], `produto.${extensao}`, { type: tipo });
}

export function pareceLink(texto: string): boolean {
  return /^https?:\/\/\S+\.\S+/i.test(texto.trim());
}
