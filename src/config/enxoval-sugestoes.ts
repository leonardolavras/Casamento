import type { EnxovalCategoria, EnxovalStatus } from "../types/enxoval";

export const SUGESTOES: {
  nome: string;
  categoria: EnxovalCategoria;
  status?: EnxovalStatus;
  imagem_url?: string;
}[] = [
  // Cozinha
  { nome: "Jogo de panelas", categoria: "Cozinha" },
  { nome: "Jogo de talheres", categoria: "Cozinha" },
  { nome: "Jogo de pratos", categoria: "Cozinha" },
  { nome: "Jogo de copos", categoria: "Cozinha" },
  { nome: "Jogo de xícaras", categoria: "Cozinha" },
  { nome: "Jogo de potes", categoria: "Cozinha" },
  { nome: "Formas de bolo", categoria: "Cozinha" },
  { nome: "Tábua de corte", categoria: "Cozinha" },
  { nome: "Jogo de facas", categoria: "Cozinha" },
  { nome: "Escorredor de louça", categoria: "Cozinha" },
  { nome: "Lixeira", categoria: "Cozinha" },
  { nome: "Porta temperos", categoria: "Cozinha" },

  // Quarto
  { nome: "Jogo de cama casal", categoria: "Quarto" },
  { nome: "Travesseiros", categoria: "Quarto" },
  { nome: "Edredom", categoria: "Quarto" },
  { nome: "Colchão", categoria: "Quarto" },
  { nome: "Cama box", categoria: "Quarto" },
  { nome: "Guarda-roupa", categoria: "Quarto" },
  { nome: "Criado-mudo", categoria: "Quarto" },
  { nome: "Cabideiro", categoria: "Quarto" },
  { nome: "Organizador de gaveta", categoria: "Quarto" },

  // Banheiro
  { nome: "Jogo de toalhas", categoria: "Banheiro" },
  { nome: "Tapete de banheiro", categoria: "Banheiro" },
  { nome: "Porta escova", categoria: "Banheiro" },
  { nome: "Saboneteira", categoria: "Banheiro" },
  { nome: "Lixeira de banheiro", categoria: "Banheiro" },
  { nome: "Espelho", categoria: "Banheiro" },

  // Área de Serviço
  { nome: "Ferro de passar", categoria: "Área de Serviço" },
  { nome: "Tábua de passar", categoria: "Área de Serviço" },
  { nome: "Varal", categoria: "Área de Serviço" },
  { nome: "Vassoura e rodo", categoria: "Área de Serviço" },
  { nome: "Balde e esfregão", categoria: "Área de Serviço" },

  // Sala
  { nome: "Sofá", categoria: "Sala" },
  { nome: "Mesa de centro", categoria: "Sala" },
  { nome: "Rack para TV", categoria: "Sala" },
  { nome: "Almofadas", categoria: "Sala" },
  { nome: "Tapete", categoria: "Sala" },
  { nome: "Cortinas", categoria: "Sala" },
  { nome: "Mesa de jantar", categoria: "Sala" },

  // Eletrodomésticos
  { nome: "Geladeira", categoria: "Eletrodomésticos" },
  { nome: "Fogão", categoria: "Eletrodomésticos" },
  { nome: "Máquina de lavar", categoria: "Eletrodomésticos" },
  { nome: "Micro-ondas", categoria: "Eletrodomésticos" },
  { nome: "Liquidificador", categoria: "Eletrodomésticos" },
  { nome: "Air Fryer", categoria: "Eletrodomésticos" },
  { nome: "Cafeteira", categoria: "Eletrodomésticos" },
  { nome: "Aspirador de pó", categoria: "Eletrodomésticos" },
  { nome: "Ventilador", categoria: "Eletrodomésticos" },
  { nome: "Ar-condicionado", categoria: "Eletrodomésticos" },
  { nome: "TV", categoria: "Eletrodomésticos" },

  // Decoração
  { nome: "Quadros", categoria: "Decoração" },
  { nome: "Vasos decorativos", categoria: "Decoração" },
  { nome: "Porta-retratos", categoria: "Decoração" },
  { nome: "Luminária", categoria: "Decoração" },
  { nome: "Relógio de parede", categoria: "Decoração" },

  // Farmacinha
  { nome: "Termômetro", categoria: "Farmacinha" },
  { nome: "Kit primeiros socorros", categoria: "Farmacinha" },

  // Emergências
  { nome: "Lanterna", categoria: "Emergências" },
  { nome: "Kit ferramentas", categoria: "Emergências" },
  { nome: "Extensão elétrica", categoria: "Emergências" },

  // Especiais
  { nome: "Carrinho lotado de Wepink", categoria: "Outros", status: "queremos" },
];
