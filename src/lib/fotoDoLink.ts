const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Pede pra função /api/foto-produto baixar a foto do link e devolve como arquivo. */
async function baixarPeloServidor(link: string): Promise<File> {
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

// ---- Mercado Livre pelo próprio celular ----
// O ML recusa pedidos vindos de servidores (a Vercel roda na AWS), mas costuma
// responder pro navegador de quem está usando o site. Então a API dele é
// consultada daqui, e o servidor só copia a imagem (que fica num CDN aberto).

function idsMercadoLivre(link: string): string[] {
  let host: string;
  try {
    host = new URL(link).hostname.toLowerCase();
  } catch {
    return [];
  }
  if (!/(^|\.)mercadoli(vre|bre)\.com(\.[a-z]{2})?$/.test(host)) return [];

  const produto = link.match(/\/p\/(MLB\d{5,})/i)?.[1].toUpperCase();
  const anuncios = new Set<string>();
  for (const m of link.matchAll(/(?:wid=|item_id(?::|%3A)|(?<!\/p)\/)(MLB-?\d{5,})/gi)) {
    anuncios.add(m[1].replace("-", "").toUpperCase());
  }
  if (produto) anuncios.delete(produto);

  return [
    ...[...anuncios].slice(0, 2).map((id) => `https://api.mercadolibre.com/items/${id}`),
    ...(produto ? [`https://api.mercadolibre.com/products/${produto}`] : []),
  ];
}

function primeiraFoto(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as { pictures?: { secure_url?: string; url?: string }[]; thumbnail?: string };
  const foto =
    obj.pictures?.map((p) => p.secure_url ?? p.url).find(Boolean) ??
    obj.thumbnail?.replace(/-I\.(jpe?g|webp|png)$/i, "-O.$1");
  return foto ? foto.replace(/^http:\/\//, "https://") : null;
}

async function fotoMercadoLivrePeloNavegador(link: string): Promise<string | null> {
  for (const url of idsMercadoLivre(link)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const foto = primeiraFoto(await res.json());
      if (foto) return foto;
    } catch {
      // bloqueado (CORS/rede) — segue pra próxima tentativa
    }
  }
  return null;
}

/**
 * Foto do produto a partir do link da loja: um arquivo pra subir pro Storage
 * ou, se não der pra copiar, o endereço da foto no site da loja.
 */
export async function obterFotoDoLink(link: string): Promise<File | string> {
  const fotoMl = await fotoMercadoLivrePeloNavegador(link);
  if (fotoMl) {
    try {
      return await baixarPeloServidor(fotoMl);
    } catch {
      return fotoMl;
    }
  }
  return baixarPeloServidor(link);
}

export function pareceLink(texto: string): boolean {
  return /^https?:\/\/\S+\.\S+/i.test(texto.trim());
}
