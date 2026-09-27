// Catálogo da LeveVara. Para mudar produtos, preços ou pacotes, edite este arquivo.
// Cada produto tem: id único, categoria (um dos ids de `categorias`), nome,
// descrição curta, preço em reais e um emoji que aparece nas costas da capivara.
window.LEVEVARA_DADOS = {
  categorias: [
    { id: 'pets', nome: 'Pets', faixa: 'cães, gatos e cia.', para: 'o seu pet' },
    { id: 'bebes', nome: 'Bebês', faixa: '0 a 2 anos', para: 'bebês' },
    { id: 'criancas', nome: 'Crianças', faixa: '3 a 12 anos', para: 'crianças' },
    { id: 'adolescentes', nome: 'Adolescentes', faixa: '13 a 17 anos', para: 'adolescentes' },
    { id: 'adultos', nome: 'Adultos', faixa: '18 anos ou mais', para: 'adultos' },
    { id: 'melhor-idade', nome: 'Vovós e vovôs', faixa: '60 anos ou mais', para: 'vovós e vovôs' },
    { id: 'casa', nome: 'Casa e mais', faixa: 'para todo mundo', para: 'a casa toda' },
    { id: 'aniversario', nome: 'Aniversário', faixa: 'para a festa', para: 'a festa' }
  ],

  produtos: [
    // Pets
    { id: 'caminha-pet', categoria: 'pets', nome: 'Caminha Capivara', descricao: 'Caminha fofa em formato de capivara para cães e gatos de até 10 kg.', preco: 189.9, emoji: '🛏️' },
    { id: 'mordedor', categoria: 'pets', nome: 'Mordedor Capivarinha', descricao: 'Borracha atóxica e resistente, do tamanho certo para a boca do seu pet.', preco: 34.9, emoji: '🦴' },
    { id: 'fantasia-pet', categoria: 'pets', nome: 'Fantasia de Capivara para Pet', descricao: 'Capuz com orelhinhas de capivara. Tamanhos P, M e G.', preco: 69.9, emoji: '🐶' },
    { id: 'arranhador', categoria: 'pets', nome: 'Arranhador Lagoa', descricao: 'Arranhador de sisal com uma capivara no topo, para o gato ficar de olho em tudo.', preco: 149.9, emoji: '🐱' },
    { id: 'coleira', categoria: 'pets', nome: 'Coleira Capivara', descricao: 'Coleira ajustável estampada, com plaquinha de identificação.', preco: 39.9, emoji: '🐾' },

    // Bebês
    { id: 'naninha', categoria: 'bebes', nome: 'Naninha Capivara', descricao: 'Paninho macio com cabecinha de capivara para a hora de dormir.', preco: 59.9, emoji: '💤' },
    { id: 'body-bebe', categoria: 'bebes', nome: 'Body Pequena Capivara', descricao: 'Algodão com botão de pressão. Do RN ao 18 meses.', preco: 44.9, emoji: '👶' },
    { id: 'mobile-berco', categoria: 'bebes', nome: 'Móbile Capivaras no Céu', descricao: 'Capivarinhas de feltro girando em cima do berço.', preco: 119.9, emoji: '🌙' },
    { id: 'chocalho', categoria: 'bebes', nome: 'Chocalho Capivara', descricao: 'Chocalho macio, fácil de segurar e de lavar.', preco: 29.9, emoji: '🎶' },

    // Crianças
    { id: 'pelucia-gigante', categoria: 'criancas', nome: 'Pelúcia Capivara Gigante', descricao: '60 cm de capivara para abraçar. Pode lavar na máquina.', preco: 159.9, emoji: '🧸' },
    { id: 'mochila', categoria: 'criancas', nome: 'Mochila Escolar Capivara', descricao: 'Com orelhinhas e bolso térmico para o lanche.', preco: 129.9, emoji: '🎒' },
    { id: 'quebra-cabeca', categoria: 'criancas', nome: 'Quebra-cabeça Capivaras na Lagoa', descricao: '100 peças grandes. A partir de 5 anos.', preco: 49.9, emoji: '🧩' },
    { id: 'pijama', categoria: 'criancas', nome: 'Pijama Capivara com Capuz', descricao: 'Macacão quentinho com capuz de capivara. Do 2 ao 12.', preco: 89.9, emoji: '🌛' },
    { id: 'kit-pintura', categoria: 'criancas', nome: 'Kit Pintura Capivara', descricao: '10 desenhos de capivara para colorir e 12 gizes de cera.', preco: 34.9, emoji: '🖍️' },

    // Adolescentes
    { id: 'moletom', categoria: 'adolescentes', nome: 'Moletom Modo Capivara', descricao: 'Oversized, com a estampa "modo capivara: ativado". Do P ao GG.', preco: 179.9, emoji: '🧥' },
    { id: 'capinha', categoria: 'adolescentes', nome: 'Capinha de Celular Capivara', descricao: 'Silicone com capivara em relevo. Vários modelos de celular.', preco: 49.9, emoji: '📱' },
    { id: 'headphone', categoria: 'adolescentes', nome: 'Headphone Orelhinha de Capivara', descricao: 'Fone sem fio com orelhinhas que acendem.', preco: 139.9, emoji: '🎧' },
    { id: 'caderno', categoria: 'adolescentes', nome: 'Caderno Capivara 10 Matérias', descricao: 'Capa dura com capivaras estudando.', preco: 39.9, emoji: '📓' },
    { id: 'chaveiro', categoria: 'adolescentes', nome: 'Chaveiro Capivara', descricao: 'Chaveiro de pelúcia para pendurar na mochila.', preco: 19.9, emoji: '🔑' },

    // Adultos
    { id: 'caneca', categoria: 'adultos', nome: 'Caneca Calma, Sou Capivara', descricao: 'Porcelana de 350 ml. Pode ir ao micro-ondas.', preco: 49.9, emoji: '☕' },
    { id: 'camiseta', categoria: 'adultos', nome: 'Camiseta Capivara Zen', descricao: 'Algodão, com uma capivara meditando. Do P ao XGG.', preco: 79.9, emoji: '👕' },
    { id: 'kit-banho', categoria: 'adultos', nome: 'Kit Banho de Capivara', descricao: 'Sais de banho e toalha de rosto, inspirados nas capivaras que tomam banho quente nos zoológicos do Japão.', preco: 99.9, emoji: '🛁' },
    { id: 'meias', categoria: 'adultos', nome: 'Meias Capivara (3 pares)', descricao: 'Três estampas diferentes. Do 35 ao 43.', preco: 44.9, emoji: '🧦' },

    // Vovós e vovôs
    { id: 'manta', categoria: 'melhor-idade', nome: 'Manta de Tricô Capivara', descricao: 'Manta quentinha para o sofá, com capivaras bordadas.', preco: 149.9, emoji: '🧶' },
    { id: 'pantufa', categoria: 'melhor-idade', nome: 'Pantufa Capivara', descricao: 'Sola antiderrapante e forro macio. Do 34 ao 44.', preco: 69.9, emoji: '🥿' },
    { id: 'porta-retrato', categoria: 'melhor-idade', nome: 'Porta-retrato Família Capivara', descricao: 'Para a foto dos netos. Tamanho 15 × 21 cm.', preco: 59.9, emoji: '🖼️' },
    { id: 'palavras-cruzadas', categoria: 'melhor-idade', nome: 'Palavras Cruzadas da Capivara', descricao: 'Revista com letra grande e 120 passatempos.', preco: 29.9, emoji: '✏️' },
    { id: 'cordao-oculos', categoria: 'melhor-idade', nome: 'Cordão para Óculos Capivara', descricao: 'Continhas de capivara para os óculos nunca mais sumirem.', preco: 24.9, emoji: '👓' },

    // Casa e mais
    { id: 'luminaria', categoria: 'casa', nome: 'Luminária Capivara', descricao: 'Luz amarelinha de LED para o quarto ou a sala.', preco: 119.9, emoji: '💡' },
    { id: 'almofada', categoria: 'casa', nome: 'Almofada Capivara', descricao: 'Almofada de 45 cm em formato de capivara deitada.', preco: 89.9, emoji: '🛋️' },
    { id: 'guarda-chuva', categoria: 'casa', nome: 'Guarda-chuva Capivara', descricao: 'Guarda-chuva com orelhinhas de capivara na ponta.', preco: 69.9, emoji: '☂️' },
    { id: 'adesivos', categoria: 'casa', nome: 'Adesivos Capivara (50 un.)', descricao: 'Para notebook, garrafa, geladeira e caderno.', preco: 19.9, emoji: '✨' },

    // Aniversário
    { id: 'coroa', categoria: 'aniversario', nome: 'Coroa de Capivara', descricao: 'Coroa de pelúcia com carinha de capivara. Tamanhos criança, adulto e pet.', preco: 39.9, emoji: '' },
    { id: 'kit-festa', categoria: 'aniversario', nome: 'Kit Festa Capivara', descricao: 'Pratos, copos, guardanapos e toalha de mesa para 20 convidados.', preco: 129.9, emoji: '🎉' },
    { id: 'topo-bolo', categoria: 'aniversario', nome: 'Topo de Bolo Capivara', descricao: 'Capivara de biscuit com plaquinha de "Parabéns!".', preco: 24.9, emoji: '🎂' },
    { id: 'baloes', categoria: 'aniversario', nome: 'Balões Capivara (10 un.)', descricao: 'Balões metalizados em formato de capivara.', preco: 44.9, emoji: '🎈' },
    { id: 'vela', categoria: 'aniversario', nome: 'Vela Número Capivara', descricao: 'Números de 0 a 9 com uma capivara em cima. Preço por vela.', preco: 14.9, emoji: '🕯️' },
    { id: 'convites', categoria: 'aniversario', nome: 'Convites Capivara (20 un.)', descricao: 'Convites impressos com envelope, para preencher à mão.', preco: 34.9, emoji: '💌' },
    { id: 'chapeu', categoria: 'aniversario', nome: 'Chapéu de Festa Capivara (10 un.)', descricao: 'Chapéus de cone com orelhinhas de capivara.', preco: 29.9, emoji: '🥳' },
    { id: 'lembrancinha', categoria: 'aniversario', nome: 'Lembrancinha Mini Capivara (10 un.)', descricao: 'Mini pelúcias de 8 cm para os convidados levarem para casa.', preco: 79.9, emoji: '🎁' }
  ],

  // Pacotes do Parabéns na Porta: a equipe vai até a casa, canta parabéns
  // e coloca a coroa de capivara no aniversariante.
  pacotes: [
    {
      id: 'parabens-capivara',
      nome: 'Parabéns Capivara',
      preco: 199,
      equipe: '2 capivareiros',
      duracao: '15 minutos',
      itens: [
        'Parabéns cantado na sua porta',
        'Coroa de capivara no aniversariante, que fica de presente',
        'Foto do momento enviada pelo WhatsApp'
      ]
    },
    {
      id: 'festa-na-porta',
      nome: 'Festa na Porta',
      preco: 349,
      equipe: '3 capivareiros fantasiados',
      duracao: '30 minutos',
      itens: [
        'Tudo do Parabéns Capivara',
        'Equipe vestida de capivara',
        'Bolo de doce de leite para 10 pessoas',
        '5 balões de capivara'
      ]
    },
    {
      id: 'capivarada-completa',
      nome: 'Capivarada Completa',
      preco: 599,
      equipe: '4 capivareiros e um violão',
      duracao: '45 minutos',
      itens: [
        'Tudo da Festa na Porta',
        'Parabéns ao vivo com violão',
        'Pelúcia Capivara Gigante de presente',
        'Vídeo da surpresa para guardar'
      ]
    }
  ]
};
