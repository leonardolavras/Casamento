// Função da Vercel: GET /api/foto-produto?url=<link da loja>
// Abre a página do produto, acha a foto principal (og:image, JSON-LD, Amazon…)
// e devolve os bytes da imagem. O navegador então sobe essa imagem pro
// Supabase Storage, então a foto não depende do anúncio continuar no ar.
//
// É um endpoint público que busca URLs de terceiros, então só aceita http(s)
// em porta padrão, recusa IP direto e hosts que resolvem pra rede interna,
// valida cada redirecionamento e só devolve imagem raster com tamanho limitado.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const TIMEOUT_MS = 8000;
const MAX_HTML = 3_000_000;
const MAX_IMAGEM = 4_000_000;
const MAX_REDIRECTS = 5;
const TIPOS_IMAGEM = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "accept-language": "pt-BR,pt;q=0.9,en;q=0.6",
};

class ErroFoto extends Error {
  status: number;
  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

function ipv4Privado(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

export function ipPrivado(ip: string): boolean {
  if (isIP(ip) === 4) return ipv4Privado(ip);
  const v6 = ip.toLowerCase();
  const mapeado = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapeado) return ipv4Privado(mapeado[1]);
  return v6 === "::" || v6 === "::1" || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6);
}

async function validarUrl(bruta: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(bruta);
  } catch {
    throw new ErroFoto(400, "Esse link não parece válido.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new ErroFoto(400, "Use um link que comece com https://");
  if (url.username || url.password || (url.port && url.port !== "80" && url.port !== "443")) {
    throw new ErroFoto(400, "Esse link não é suportado.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host)) throw new ErroFoto(400, "Use o link da loja.");

  let enderecos: { address: string }[];
  try {
    enderecos = await lookup(host, { all: true });
  } catch {
    throw new ErroFoto(400, "Não encontrei esse site.");
  }
  if (enderecos.length === 0 || enderecos.some((e) => ipPrivado(e.address))) {
    throw new ErroFoto(400, "Esse link não é suportado.");
  }
  return url;
}

// fetch com redirect manual pra validar o destino de cada salto
async function buscar(bruta: string, accept: string): Promise<{ res: Response; url: URL }> {
  let url = await validarUrl(bruta);
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { ...HEADERS, accept },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const destino = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
    if (!destino) return { res, url };
    await res.body?.cancel();
    url = await validarUrl(new URL(destino, url).toString());
  }
  throw new ErroFoto(502, "A loja redirecionou demais.");
}

async function lerLimitado(res: Response, max: number): Promise<Uint8Array> {
  const tamanho = Number(res.headers.get("content-length") ?? 0);
  if (tamanho > max) throw new ErroFoto(413, "Arquivo grande demais.");
  if (!res.body) return new Uint8Array();

  const reader = res.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      throw new ErroFoto(413, "Arquivo grande demais.");
    }
    partes.push(value);
  }
  const bytes = new Uint8Array(total);
  let pos = 0;
  for (const p of partes) {
    bytes.set(p, pos);
    pos += p.byteLength;
  }
  return bytes;
}

function decodificarEntidades(texto: string): string {
  return texto
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function atributos(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    attrs[m[1].toLowerCase()] = decodificarEntidades(m[3] ?? m[4] ?? m[5] ?? "");
  }
  return attrs;
}

function imagensJsonLd(valor: unknown, produto = false): string[] {
  if (Array.isArray(valor)) return valor.flatMap((v) => imagensJsonLd(v, produto));
  if (!valor || typeof valor !== "object") return [];
  const obj = valor as Record<string, unknown>;
  const tipo = ([] as unknown[]).concat(obj["@type"] ?? []).map(String);
  const ehProduto = produto || tipo.some((t) => /product/i.test(t));

  const achadas: string[] = [];
  if (ehProduto && obj.image) {
    for (const img of ([] as unknown[]).concat(obj.image)) {
      if (typeof img === "string") achadas.push(img);
      else if (img && typeof img === "object" && typeof (img as { url?: unknown }).url === "string") {
        achadas.push((img as { url: string }).url);
      }
    }
  }
  for (const chave of ["@graph", "mainEntity", "itemListElement"]) {
    if (obj[chave]) achadas.push(...imagensJsonLd(obj[chave], false));
  }
  return achadas;
}

/** Lista de possíveis fotos do produto na página, da mais confiável pra menos. */
export function extrairImagens(html: string, base: URL): string[] {
  const porChave = new Map<string, string>();
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = atributos(m[0]);
    const chave = (a.property ?? a.name ?? a.itemprop ?? "").toLowerCase();
    if (a.content && !porChave.has(chave)) porChave.set(chave, a.content);
  }

  const jsonLd: string[] = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonLd.push(...imagensJsonLd(JSON.parse(m[1].trim())));
    } catch {
      // JSON-LD malformado é comum; segue pros outros métodos
    }
  }

  // Amazon costuma não ter og:image; a foto grande fica nesses atributos
  const amazon: string[] = [];
  const hires = html.match(/data-old-hires\s*=\s*"(https?:[^"]+)"/i) ?? html.match(/"hiRes"\s*:\s*"(https?:[^"]+)"/);
  if (hires) amazon.push(hires[1]);
  const dinamica = html.match(/data-a-dynamic-image\s*=\s*"([^"]+)"/i);
  if (dinamica) {
    try {
      const mapa = JSON.parse(decodificarEntidades(dinamica[1])) as Record<string, [number, number]>;
      const maior = Object.entries(mapa).sort((x, y) => y[1][0] * y[1][1] - x[1][0] * x[1][1])[0];
      if (maior) amazon.push(maior[0]);
    } catch {
      // ignora
    }
  }

  const imageSrc = html.match(/<link\b[^>]*rel\s*=\s*["']?image_src["']?[^>]*>/i);

  const candidatas = [
    porChave.get("og:image:secure_url"),
    porChave.get("og:image"),
    porChave.get("og:image:url"),
    ...jsonLd,
    ...amazon,
    porChave.get("twitter:image"),
    porChave.get("twitter:image:src"),
    imageSrc ? atributos(imageSrc[0]).href : undefined,
    porChave.get("image"),
  ];

  const vistas = new Set<string>();
  const resultado: string[] = [];
  for (const c of candidatas) {
    if (!c) continue;
    let absoluta: string;
    try {
      absoluta = new URL(c.trim(), base).toString();
    } catch {
      continue;
    }
    if (!/^https?:\/\//.test(absoluta) || vistas.has(absoluta)) continue;
    vistas.add(absoluta);
    resultado.push(absoluta);
  }
  return resultado;
}

function tipoImagem(res: Response): string | null {
  const tipo = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  return TIPOS_IMAGEM.includes(tipo) ? tipo : null;
}

function respostaImagem(bytes: Uint8Array, tipo: string): Response {
  return new Response(bytes, { headers: { "content-type": tipo, "cache-control": "no-store" } });
}

function respostaErro(status: number, erro: string): Response {
  return Response.json({ erro }, { status, headers: { "cache-control": "no-store" } });
}

export async function GET(request: Request): Promise<Response> {
  const link = new URL(request.url).searchParams.get("url")?.trim();
  if (!link) return respostaErro(400, "Cole o link do produto.");

  try {
    const pagina = await buscar(link, "text/html,application/xhtml+xml,image/*;q=0.8,*/*;q=0.5");
    if (!pagina.res.ok) {
      throw new ErroFoto(502, `A loja não deixou abrir a página (erro ${pagina.res.status}). Tente outro link ou envie a foto.`);
    }

    // o link já é a própria imagem
    const tipoDireto = tipoImagem(pagina.res);
    if (tipoDireto) return respostaImagem(await lerLimitado(pagina.res, MAX_IMAGEM), tipoDireto);

    const html = new TextDecoder().decode(await lerLimitado(pagina.res, MAX_HTML));
    const candidatas = extrairImagens(html, pagina.url);
    if (candidatas.length === 0) throw new ErroFoto(404, "Não achei a foto nessa página. Envie a foto manualmente.");

    for (const candidata of candidatas.slice(0, 4)) {
      try {
        const img = await buscar(candidata, "image/avif,image/webp,image/*;q=0.8");
        const tipo = img.res.ok ? tipoImagem(img.res) : null;
        if (!tipo) {
          await img.res.body?.cancel();
          continue;
        }
        return respostaImagem(await lerLimitado(img.res, MAX_IMAGEM), tipo);
      } catch {
        // tenta a próxima candidata
      }
    }
    throw new ErroFoto(502, "Achei a foto, mas não consegui baixar. Envie a foto manualmente.");
  } catch (err) {
    if (err instanceof ErroFoto) return respostaErro(err.status, err.message);
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      return respostaErro(504, "A loja demorou demais para responder. Tente de novo.");
    }
    return respostaErro(502, "Não consegui abrir esse link. Envie a foto manualmente.");
  }
}
