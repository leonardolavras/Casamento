// Configuração central do site — edite aqui conforme o planejamento avança.

export const COUPLE = {
  nome1: "Noivo(a) 1",
  nome2: "Noivo(a) 2",
};

// Data do casamento (ano, mês [0-11], dia, hora, minuto).
// TODO: substituir pela data real do casamento.
export const WEDDING_DATE = new Date(2027, 5, 20, 16, 0, 0);

export const HERO_PHOTO = "/fotos/capa.jpg";

export const GALLERY_PHOTOS: { src: string; caption: string }[] = [
  { src: "/fotos/foto1.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto2.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto3.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto4.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto5.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto6.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto7.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto8.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto9.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto10.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto11.jpeg", caption: "Um momento nosso" },
  { src: "/fotos/foto12.jpeg", caption: "Um momento nosso" },
];

// Cartõezinhos com mensagens (verso vira ao clicar). Edite os títulos e textos.
export const MESSAGE_CARDS: { titulo: string; texto: string }[] = [
  {
    titulo: "Nosso começo",
    texto: "Aqui entra a história de como vocês se conheceram.",
  },
  {
    titulo: "O pedido",
    texto: "Aqui entra a história do pedido de casamento.",
  },
  {
    titulo: "Por que nos casamos",
    texto: "Aqui entra o motivo especial de vocês para casar.",
  },
];

// Motivos para o gerador aleatório "Por que nos casamos".
export const REASONS: string[] = [
  "Porque escolhemos um ao outro todos os dias.",
  "Porque juntos somos mais fortes e mais felizes.",
  "Porque encontramos em casa um no outro.",
  "Porque queremos construir uma vida cheia de significado juntos.",
  "Porque o amor de vocês é motivo suficiente.",
];

// Itens da linha do tempo/checklist decorativo (marcos do relacionamento e do casamento).
export const TIMELINE_ITEMS: { id: string; texto: string; concluido?: boolean }[] = [
  { id: "conhecer", texto: "Nos conhecemos", concluido: true },
  { id: "namoro", texto: "Começamos a namorar", concluido: true },
  { id: "noivado", texto: "Noivado", concluido: true },
  { id: "casamento", texto: "Casamento" },
  { id: "lua-de-mel", texto: "Lua de mel" },
  { id: "lar", texto: "Construir nosso lar" },
];
