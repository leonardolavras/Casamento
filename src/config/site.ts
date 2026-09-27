// Configuração central do site — edite aqui conforme o planejamento avança.

export const COUPLE = {
  nome1: "Leonardo",
  nome2: "Gabriella",
};

// Data do casamento (ano, mês [0-11], dia, hora, minuto).
export const WEDDING_DATE = new Date(2028, 2, 11, 12, 0, 0);

export const HERO_PHOTO = "/fotos/capa.jpg";

// Informações do evento — edite com local, endereço e horários reais assim
// que estiverem definidos.
export interface EventoInfo {
  titulo: string;
  data: string;
  hora: string;
  local: string;
  endereco: string;
  mapaUrl: string | null;
}

export const CERIMONIA: EventoInfo = {
  titulo: "Cerimônia",
  data: "11 de março de 2028",
  hora: "12h",
  local: "Local a definir",
  endereco: "Endereço a definir",
  mapaUrl: null,
};

export const RECEPCAO: EventoInfo = {
  titulo: "Recepção",
  data: "11 de março de 2028",
  hora: "Logo após a cerimônia (almoço)",
  local: "Local a definir",
  endereco: "Endereço a definir",
  mapaUrl: null,
};

export const DRESS_CODE = "Traje social. Cores a evitar: branco.";

// Lua de mel — preencha destino e foto quando estiver decidido; o card some
// sozinho enquanto for null.
export const HONEYMOON: { destino: string; foto: string } | null = null;

// Playlist do casamento no Spotify (link de compartilhamento). O card some
// sozinho enquanto for null.
export const SPOTIFY_PLAYLIST_URL: string | null = null;

// Dados usados para gerar o QR Code Pix na lista de presentes.
export const PIX_KEY: string | null = "+5519995869463";
export const PIX_TITULAR = `${COUPLE.nome1} e ${COUPLE.nome2}`;
// TODO: confirmar a cidade real do titular da chave Pix (aparece no app do convidado).
export const PIX_CIDADE = "Campinas";

export const PALETA_CORES: { nome: string; hex: string; descricao?: string }[] = [
  { nome: "Coral", hex: "#DAC8B3", descricao: "Bege Perfeito" },
];

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

