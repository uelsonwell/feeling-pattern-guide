/**
 * MATRIZ DE COMPORTAMENTO E PADRÕES EMOCIONAIS
 * ---------------------------------------------------------------
 * Estrutura:
 * - EMOÇÕES RAIZ: Medo, Culpa/Vergonha e Raiva.
 * - EMOÇÕES SECUNDÁRIAS (blocos/dimensões): Rejeição, Abandono,
 *   Manipulação, Humilhação e Traição.
 * - 20 perguntas (4 por bloco), cada uma com 4 alternativas.
 * - Cada alternativa tem:
 *     `raiz`  -> qual emoção raiz ela ativa ("medo" | "culpa" | "raiva")
 *     `peso`  -> intensidade do padrão, de 0 (saudável) a 4 (muito ativo)
 * - A intensidade de cada bloco é normalizada em % (0 a 100).
 * - O perfil raiz mostra a distribuição percentual entre Medo,
 *   Culpa/Vergonha e Raiva.
 */

export const PESO_MAXIMO = 4;

/* ------------------------------------------------------------------ */
/* EMOÇÕES RAIZ                                                        */
/* ------------------------------------------------------------------ */

export type RaizId = "medo" | "culpa" | "raiva";

export type Raiz = {
  id: RaizId;
  nome: string;
  descricao: string;
  leitura: string;
  caminho: string;
};

export const RAIZES: Raiz[] = [
  {
    id: "medo",
    nome: "Medo",
    descricao: "Antecipação de perda, insegurança e necessidade de garantir o vínculo.",
    leitura:
      "Sua reação principal diante da dor é proteger o vínculo e evitar a perda. Você tende a ceder, monitorar e antecipar cenários para não ser pego(a) de surpresa.",
    caminho:
      "O trabalho começa pela regulação do corpo e por experiências pequenas de segurança: sustentar uma decisão sem buscar confirmação imediata.",
  },
  {
    id: "culpa",
    nome: "Culpa / Vergonha",
    descricao: "Responsabilização de si, autocrítica e preocupação com a própria imagem.",
    leitura:
      "Diante do conflito, sua mente vira para dentro: você procura o que fez de errado e o que os outros passaram a pensar de você. O problema vira uma questão de valor pessoal.",
    caminho:
      "O foco é separar responsabilidade de identidade: o que é fato, o que é interpretação e o que simplesmente não é seu para carregar.",
  },
  {
    id: "raiva",
    nome: "Raiva",
    descricao: "Defesa ativa, confronto e reação imediata para restabelecer limite.",
    leitura:
      "Sua energia de defesa é rápida e direta. A raiva protege a sua fronteira, mas costuma chegar antes da conversa e cobrar um preço nas relações.",
    caminho:
      "O caminho é usar a raiva como informação de limite: nomear o que foi violado antes de responder à altura.",
  },
];

/* ------------------------------------------------------------------ */
/* EMOÇÕES SECUNDÁRIAS (BLOCOS)                                        */
/* ------------------------------------------------------------------ */

export type DimensaoId = "rejeicao" | "abandono" | "manipulacao" | "humilhacao" | "traicao";

export type Dimensao = {
  id: DimensaoId;
  nome: string;
  descricao: string;
};

export const DIMENSOES: Dimensao[] = [
  {
    id: "rejeicao",
    nome: "Rejeição",
    descricao:
      "A dor de não ser aprovado(a), escolhido(a) ou considerado(a) suficiente pelo outro.",
  },
  {
    id: "abandono",
    nome: "Abandono",
    descricao: "A ameaça de perder o vínculo: distanciamento, silêncio e mudança de proximidade.",
  },
  {
    id: "manipulacao",
    nome: "Manipulação",
    descricao:
      "Culpa usada como pressão, controle disfarçado de cuidado e inversão de responsabilidade.",
  },
  {
    id: "humilhacao",
    nome: "Humilhação",
    descricao: "Exposição, desvalorização pública e a sensação de ser diminuído(a) diante dos outros.",
  },
  {
    id: "traicao",
    nome: "Traição",
    descricao: "Quebra de confiança, mentira, segredo e deslealdade de quem estava próximo.",
  },
];

/* ------------------------------------------------------------------ */
/* PERGUNTAS                                                           */
/* ------------------------------------------------------------------ */

export type Opcao = { texto: string; raiz: RaizId; peso: number };

export type Pergunta = {
  id: string;
  codigo: string;
  dimensao: DimensaoId;
  titulo: string;
  texto: string;
  opcoes: Opcao[];
};

export const PERGUNTAS: Pergunta[] = [
  /* ---------------- BLOCO 1 — REJEIÇÃO ---------------- */
  {
    id: "R01",
    codigo: "R01",
    dimensao: "rejeicao",
    titulo: "Desaprovação",
    texto:
      "Você toma uma decisão importante para sua vida e alguém cuja opinião é importante para você deixa claro que não concorda. O que tende a acontecer dentro de você?",
    opcoes: [
      {
        texto: "Começo a questionar se minha decisão realmente foi boa e fico inseguro(a) sobre o que fazer.",
        raiz: "medo",
        peso: 3,
      },
      { texto: "Fico pensando no que essa pessoa passou a pensar de mim.", raiz: "culpa", peso: 3 },
      { texto: "Sinto irritação e vontade de deixar claro que a decisão é minha.", raiz: "raiva", peso: 3 },
      {
        texto: "Tento explicar melhor minha escolha para que a pessoa compreenda e volte a me apoiar.",
        raiz: "medo",
        peso: 2,
      },
    ],
  },
  {
    id: "R02",
    codigo: "R02",
    dimensao: "rejeicao",
    titulo: "Não ser escolhido",
    texto:
      "Você está em um grupo de pessoas e percebe que foi deixado de fora de uma escolha ou convite que considerava importante. O que mais provavelmente acontece com você?",
    opcoes: [
      {
        texto: "Sinto que talvez não seja tão importante para aquelas pessoas quanto imaginava.",
        raiz: "medo",
        peso: 3,
      },
      { texto: "Começo a pensar se fiz alguma coisa para provocar esse afastamento.", raiz: "culpa", peso: 3 },
      {
        texto: "Fico incomodado(a) e tenho vontade de mostrar que não preciso daquele grupo.",
        raiz: "raiva",
        peso: 4,
      },
      {
        texto: "Tento descobrir o motivo e entender o que aconteceu antes de tirar conclusões.",
        raiz: "medo",
        peso: 1,
      },
    ],
  },
  {
    id: "R03",
    codigo: "R03",
    dimensao: "rejeicao",
    titulo: "Crítica pessoal",
    texto:
      "Alguém que você respeita faz uma crítica sobre uma característica sua, e não apenas sobre algo que você fez. Como você tende a reagir?",
    opcoes: [
      {
        texto: "Fico pensando bastante naquilo e começo a observar se realmente sou daquela maneira.",
        raiz: "culpa",
        peso: 2,
      },
      { texto: "Sinto-me diminuído(a), principalmente se outras pessoas estiverem presentes.", raiz: "culpa", peso: 4 },
      {
        texto: "Tenho vontade de responder imediatamente e mostrar que a pessoa também tem defeitos.",
        raiz: "raiva",
        peso: 4,
      },
      { texto: "Tento entender por que aquela pessoa me enxerga daquela maneira.", raiz: "medo", peso: 1 },
    ],
  },
  {
    id: "R04",
    codigo: "R04",
    dimensao: "rejeicao",
    titulo: "Não ser suficiente",
    texto:
      "Você se esforça muito para fazer algo importante e, mesmo assim, percebe que a outra pessoa esperava mais de você. Qual é sua reação mais espontânea?",
    opcoes: [
      { texto: "Sinto que talvez eu não tenha sido capaz o suficiente.", raiz: "culpa", peso: 4 },
      { texto: "Fico preocupado(a) com a imagem que aquela pessoa passou a ter de mim.", raiz: "culpa", peso: 3 },
      { texto: "Sinto raiva porque parece que meu esforço não foi reconhecido.", raiz: "raiva", peso: 3 },
      { texto: "Tenho vontade de fazer ainda mais para provar que consigo.", raiz: "medo", peso: 3 },
    ],
  },

  /* ---------------- BLOCO 2 — ABANDONO ---------------- */
  {
    id: "A01",
    codigo: "A01",
    dimensao: "abandono",
    titulo: "Distanciamento",
    texto:
      "Uma pessoa muito importante para você começa a ficar mais distante, responde menos e demonstra menos interesse. O que tende a acontecer dentro de você?",
    opcoes: [
      { texto: "Fico preocupado(a) que esteja perdendo aquela pessoa.", raiz: "medo", peso: 4 },
      { texto: "Começo a pensar se fiz alguma coisa que provocou essa mudança.", raiz: "culpa", peso: 3 },
      { texto: "Fico irritado(a) e tenho vontade de cobrar uma explicação.", raiz: "raiva", peso: 3 },
      { texto: "Também me afasto para não demonstrar que aquilo me afetou.", raiz: "medo", peso: 3 },
    ],
  },
  {
    id: "A02",
    codigo: "A02",
    dimensao: "abandono",
    titulo: "Silêncio inesperado",
    texto:
      "Você manda uma mensagem para alguém importante e percebe que a pessoa visualizou, mas não respondeu durante muitas horas. Qual é sua reação mais espontânea?",
    opcoes: [
      {
        texto: "Começo a imaginar que alguma coisa aconteceu ou que essa pessoa está se afastando.",
        raiz: "medo",
        peso: 4,
      },
      { texto: "Penso se falei alguma coisa errada ou fiz algo que desagradou.", raiz: "culpa", peso: 3 },
      {
        texto: "Fico irritado(a) e penso que, se ela não quer responder, também não vou procurar.",
        raiz: "raiva",
        peso: 3,
      },
      { texto: "Tento ocupar minha cabeça com outras coisas, mas fico esperando a resposta.", raiz: "medo", peso: 2 },
    ],
  },
  {
    id: "A03",
    codigo: "A03",
    dimensao: "abandono",
    titulo: "Mudança de vínculo",
    texto:
      "Uma pessoa com quem você tinha muita proximidade começa a fazer novos amigos e passa a dedicar menos tempo a você. Como você tende a se sentir e agir?",
    opcoes: [
      { texto: "Sinto medo de perder o lugar que eu tinha na vida daquela pessoa.", raiz: "medo", peso: 4 },
      { texto: "Começo a me perguntar o que há de errado comigo.", raiz: "culpa", peso: 4 },
      {
        texto: "Fico incomodado(a) e tenho vontade de demonstrar que não aceito ser deixado de lado.",
        raiz: "raiva",
        peso: 3,
      },
      { texto: "Tento me aproximar mais para recuperar a proximidade que existia antes.", raiz: "medo", peso: 2 },
    ],
  },
  {
    id: "A04",
    codigo: "A04",
    dimensao: "abandono",
    titulo: "Medo de perder",
    texto:
      "Quando percebe que uma relação importante está passando por uma fase difícil, qual é a sua tendência?",
    opcoes: [
      { texto: "Tento me aproximar e resolver rapidamente para não perder a relação.", raiz: "medo", peso: 3 },
      { texto: "Fico pensando no que fiz de errado para a relação chegar naquele ponto.", raiz: "culpa", peso: 3 },
      { texto: "Fico irritado(a) e começo a cobrar atitudes da outra pessoa.", raiz: "raiva", peso: 3 },
      { texto: "Procuro me afastar emocionalmente para não sofrer caso a relação termine.", raiz: "medo", peso: 4 },
    ],
  },

  /* ---------------- BLOCO 3 — MANIPULAÇÃO ---------------- */
  {
    id: "M01",
    codigo: "M01",
    dimensao: "manipulacao",
    titulo: "Culpa como pressão",
    texto:
      "Você decide não fazer algo que uma pessoa próxima queria. Em vez de aceitar sua decisão, ela diz algo que faz você se sentir culpado por não ter feito o que ela queria. Como você tende a reagir?",
    opcoes: [
      { texto: "Acabo reconsiderando minha decisão para evitar que a pessoa fique magoada.", raiz: "medo", peso: 4 },
      { texto: "Fico pensando se estou sendo egoísta ou injusto(a).", raiz: "culpa", peso: 4 },
      {
        texto: "Sinto raiva e tenho vontade de deixar claro que ninguém vai decidir por mim.",
        raiz: "raiva",
        peso: 3,
      },
      { texto: "Tento explicar minhas razões várias vezes até a pessoa aceitar minha decisão.", raiz: "culpa", peso: 2 },
    ],
  },
  {
    id: "M02",
    codigo: "M02",
    dimensao: "manipulacao",
    titulo: "Controle disfarçado de cuidado",
    texto:
      "Uma pessoa próxima começa a questionar frequentemente suas escolhas, dizendo que faz isso porque quer proteger você e sabe o que é melhor para você. Como você tende a reagir?",
    opcoes: [
      { texto: "Começo a duvidar das minhas próprias escolhas.", raiz: "medo", peso: 4 },
      { texto: "Fico preocupado(a) em decepcionar essa pessoa.", raiz: "culpa", peso: 3 },
      { texto: "Sinto irritação e vontade de cortar aquela interferência.", raiz: "raiva", peso: 3 },
      { texto: "Passo a justificar minhas decisões para tentar fazer a pessoa entender.", raiz: "culpa", peso: 2 },
    ],
  },
  {
    id: "M03",
    codigo: "M03",
    dimensao: "manipulacao",
    titulo: "Chantagem emocional",
    texto:
      "Alguém importante deixa claro que ficará magoado, se afastará ou mudará a relação caso você não faça aquilo que essa pessoa deseja. O que você tende a fazer?",
    opcoes: [
      { texto: "Acabo cedendo para não correr o risco de perder a relação.", raiz: "medo", peso: 4 },
      { texto: "Fico tomado(a) pela culpa e penso que deveria fazer aquilo pela pessoa.", raiz: "culpa", peso: 4 },
      { texto: "Fico com raiva e sinto vontade de romper aquela pressão.", raiz: "raiva", peso: 3 },
      {
        texto: "Tento negociar até encontrar uma forma de fazer a pessoa desistir da ameaça.",
        raiz: "medo",
        peso: 2,
      },
    ],
  },
  {
    id: "M04",
    codigo: "M04",
    dimensao: "manipulacao",
    titulo: "Inversão de responsabilidade",
    texto:
      "Você tenta conversar com alguém sobre algo que fez você se sentir mal. Durante a conversa, a pessoa muda o foco e você termina se sentindo culpado por ter levantado o assunto. Como você tende a reagir?",
    opcoes: [
      { texto: "Começo a pensar que talvez eu realmente esteja exagerando.", raiz: "culpa", peso: 4 },
      { texto: "Fico envergonhado(a) por ter criado aquela situação.", raiz: "culpa", peso: 4 },
      {
        texto: "Fico muito irritado(a) porque sinto que o problema foi colocado sobre mim.",
        raiz: "raiva",
        peso: 3,
      },
      { texto: "Tento voltar ao assunto original e explicar novamente o que aconteceu.", raiz: "medo", peso: 1 },
    ],
  },

  /* ---------------- BLOCO 4 — HUMILHAÇÃO ---------------- */
  {
    id: "H01",
    codigo: "H01",
    dimensao: "humilhacao",
    titulo: "Exposição",
    texto:
      "Alguém aponta um erro seu diante de outras pessoas, fazendo você se sentir exposto. Qual é sua reação mais espontânea?",
    opcoes: [
      { texto: "Quero sair daquela situação o mais rápido possível.", raiz: "medo", peso: 3 },
      {
        texto: "Fico pensando durante muito tempo sobre como aquelas pessoas passaram a me enxergar.",
        raiz: "culpa",
        peso: 4,
      },
      { texto: "Sinto vontade de responder na mesma intensidade.", raiz: "raiva", peso: 4 },
      { texto: "Tento agir como se aquilo não tivesse importância.", raiz: "medo", peso: 2 },
    ],
  },
  {
    id: "H02",
    codigo: "H02",
    dimensao: "humilhacao",
    titulo: "Desvalorização",
    texto:
      "Você apresenta uma ideia na qual acredita e alguém a trata com ironia ou faz você parecer incapaz diante dos outros. Como você tende a reagir?",
    opcoes: [
      { texto: "Começo a questionar se minha ideia realmente era tão boa.", raiz: "culpa", peso: 3 },
      { texto: "Sinto vergonha de ter falado e gostaria de não ter me exposto.", raiz: "culpa", peso: 4 },
      { texto: "Fico com raiva e tenho vontade de colocar a pessoa no lugar dela.", raiz: "raiva", peso: 4 },
      { texto: "Tento explicar minha ideia ainda melhor para mostrar que ela está errada.", raiz: "raiva", peso: 2 },
    ],
  },
  {
    id: "H03",
    codigo: "H03",
    dimensao: "humilhacao",
    titulo: "Erro público",
    texto:
      "Você comete um erro diante de várias pessoas e percebe que algumas delas estão observando sua reação. O que acontece com você naquele momento?",
    opcoes: [
      { texto: "Quero desaparecer daquela situação.", raiz: "medo", peso: 4 },
      {
        texto: "Sinto-me profundamente constrangido(a) e começo a pensar no que todos estão achando.",
        raiz: "culpa",
        peso: 4,
      },
      { texto: "Fico irritado(a), principalmente se alguém fizer algum comentário.", raiz: "raiva", peso: 3 },
      { texto: "Tento rir da situação e agir como se não tivesse sido nada demais.", raiz: "medo", peso: 1 },
    ],
  },
  {
    id: "H04",
    codigo: "H04",
    dimensao: "humilhacao",
    titulo: "Ser diminuído",
    texto:
      "Durante uma discussão, alguém usa uma característica sua, uma dificuldade ou um erro do passado para diminuir você. O que tende a acontecer?",
    opcoes: [
      { texto: "Aquilo fica ecoando dentro de mim e começo a questionar meu próprio valor.", raiz: "culpa", peso: 4 },
      { texto: "Sinto-me envergonhado(a) e gostaria de não ter aquela história exposta.", raiz: "culpa", peso: 3 },
      { texto: "Sinto uma raiva muito forte e quero devolver a agressão.", raiz: "raiva", peso: 4 },
      { texto: "Tento mostrar que aquilo não me atinge.", raiz: "medo", peso: 2 },
    ],
  },

  /* ---------------- BLOCO 5 — TRAIÇÃO ---------------- */
  {
    id: "T01",
    codigo: "T01",
    dimensao: "traicao",
    titulo: "Confiança quebrada",
    texto:
      "Você descobre que uma pessoa em quem confiava escondeu de você algo importante que poderia mudar sua percepção sobre a relação. Como tende a reagir?",
    opcoes: [
      { texto: "Fico inseguro(a) sobre o que mais pode estar sendo escondido.", raiz: "medo", peso: 3 },
      {
        texto: "Começo a me perguntar por que não percebi antes e se fiz alguma coisa para isso acontecer.",
        raiz: "culpa",
        peso: 3,
      },
      { texto: "Sinto raiva e quero confrontar a pessoa imediatamente.", raiz: "raiva", peso: 3 },
      { texto: "Passo a desconfiar de tudo o que aquela pessoa me diz.", raiz: "medo", peso: 4 },
    ],
  },
  {
    id: "T02",
    codigo: "T02",
    dimensao: "traicao",
    titulo: "Descobrir uma mentira",
    texto:
      "Você descobre que alguém próximo mentiu para você sobre algo importante. O que acontece primeiro dentro de você?",
    opcoes: [
      { texto: "Começo a pensar que talvez não possa mais confiar naquela pessoa.", raiz: "medo", peso: 3 },
      { texto: "Fico pensando se ignorei sinais que já estavam ali.", raiz: "culpa", peso: 3 },
      { texto: "Sinto raiva e tenho vontade de exigir uma explicação.", raiz: "raiva", peso: 3 },
      { texto: "Fico abalado(a) e começo a rever mentalmente tudo o que aconteceu.", raiz: "medo", peso: 4 },
    ],
  },
  {
    id: "T03",
    codigo: "T03",
    dimensao: "traicao",
    titulo: "Segredo",
    texto:
      "Você descobre que pessoas próximas sabiam de algo importante que dizia respeito a você, mas escolheram não contar. Como tende a reagir?",
    opcoes: [
      { texto: "Fico pensando por que esconderam aquilo de mim.", raiz: "medo", peso: 2 },
      { texto: "Sinto-me diminuído(a) por terem decidido que eu não deveria saber.", raiz: "culpa", peso: 4 },
      { texto: "Fico muito irritado(a) e quero saber quem decidiu esconder aquilo.", raiz: "raiva", peso: 4 },
      { texto: "Passo a desconfiar que outras coisas também podem estar sendo escondidas.", raiz: "medo", peso: 4 },
    ],
  },
  {
    id: "T04",
    codigo: "T04",
    dimensao: "traicao",
    titulo: "Quebra de lealdade",
    texto:
      "Você descobre que alguém em quem confiava tomou uma atitude importante pelas suas costas. Qual é sua reação mais espontânea?",
    opcoes: [
      { texto: "Fico inseguro(a) e começo a questionar se realmente conhecia aquela pessoa.", raiz: "medo", peso: 3 },
      { texto: "Penso no que fiz para que ela escolhesse agir dessa maneira comigo.", raiz: "culpa", peso: 4 },
      { texto: "Sinto raiva e tenho vontade de confrontá-la.", raiz: "raiva", peso: 3 },
      { texto: "Passo a me proteger e tenho dificuldade para confiar novamente.", raiz: "medo", peso: 4 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAIXAS DE DEVOLUTIVA                                                */
/* ------------------------------------------------------------------ */

export type Faixa = {
  limite: number; // percentual máximo desta faixa
  rotulo: string;
  leitura: string;
  caminho: string;
};

export const FAIXAS: Record<DimensaoId, Faixa[]> = {
  rejeicao: [
    {
      limite: 33,
      rotulo: "Rejeição pouco ativa",
      leitura:
        "A opinião do outro tem peso, mas não define quem você é. Você consegue divergir sem se sentir descartado(a).",
      caminho: "Continue checando os fatos antes de interpretar um não como recusa a você.",
    },
    {
      limite: 66,
      rotulo: "Rejeição sensível",
      leitura:
        "Desaprovação e exclusão mexem bastante com você e ligam um esforço interno para reconquistar aprovação.",
      caminho: "Antes de se explicar, pergunte-se: preciso ser compreendido(a) ou aprovado(a)?",
    },
    {
      limite: 100,
      rotulo: "Rejeição em ferida aberta",
      leitura:
        "Não ser escolhido(a) é vivido como prova de que você não é suficiente. A validação externa virou combustível.",
      caminho:
        "O trabalho é reconstruir critérios internos de valor que não dependam da resposta do outro.",
    },
  ],
  abandono: [
    {
      limite: 33,
      rotulo: "Abandono pouco ativo",
      leitura: "Distâncias e silêncios não disparam alarme. Você suporta o intervalo sem se desorganizar.",
      caminho: "Mantenha o hábito de falar sobre o que sente antes que vire interpretação.",
    },
    {
      limite: 66,
      rotulo: "Abandono em alerta",
      leitura:
        "Mudanças de ritmo do outro ligam seu radar. Você monitora sinais e antecipa afastamentos.",
      caminho: "Nos primeiros 90 segundos da ativação, regule o corpo antes de agir ou cobrar.",
    },
    {
      limite: 100,
      rotulo: "Abandono dominante",
      leitura:
        "Perder o vínculo organiza suas escolhas: você cede, cobra ou se afasta primeiro para não sofrer a perda.",
      caminho: "Comece nomeando o gatilho exato do pânico de perda e o que ele repete de uma história antiga.",
    },
  ],
  manipulacao: [
    {
      limite: 33,
      rotulo: "Limites preservados",
      leitura: "Você identifica pressão e culpa induzida e mantém sua decisão sem precisar brigar.",
      caminho: "Siga praticando o não curto, sem justificativas em excesso.",
    },
    {
      limite: 66,
      rotulo: "Permeável à pressão",
      leitura:
        "A culpa induzida funciona com você: mesmo percebendo, você negocia, se justifica e às vezes cede.",
      caminho: "Treine frases de limite curtas e repetíveis, sem abrir o mérito da decisão de novo.",
    },
    {
      limite: 100,
      rotulo: "Limite capturado",
      leitura:
        "Sua decisão depende do humor do outro. Chantagem e inversão de responsabilidade te levam a duvidar da própria percepção.",
      caminho: "Registre os fatos por escrito antes de conversar — isso protege sua leitura da realidade.",
    },
  ],
  humilhacao: [
    {
      limite: 33,
      rotulo: "Exposição tolerável",
      leitura: "Errar diante dos outros incomoda, mas não abala seu senso de valor.",
      caminho: "Continue tratando erro como evento, não como identidade.",
    },
    {
      limite: 66,
      rotulo: "Vergonha ativa",
      leitura:
        "A avaliação alheia pesa. Você revive cenas de exposição e evita se colocar para não correr o risco.",
      caminho: "Exponha-se em doses pequenas e controladas para reduzir a carga da vergonha.",
    },
    {
      limite: 100,
      rotulo: "Humilhação em ferida aberta",
      leitura:
        "Ser diminuído(a) dispara uma reação intensa — sumir ou revidar. A cena fica ecoando por muito tempo.",
      caminho: "A prioridade é regular o corpo na hora da exposição antes de qualquer resposta.",
    },
  ],
  traicao: [
    {
      limite: 33,
      rotulo: "Confiança preservada",
      leitura: "Você avalia cada pessoa pelo que ela faz, sem generalizar decepções antigas.",
      caminho: "Mantenha acordos claros e conversas diretas quando algo não bater.",
    },
    {
      limite: 66,
      rotulo: "Confiança em vigilância",
      leitura:
        "Você se aproxima, mas mantém um radar ligado. Uma parte confia e outra fiscaliza o tempo todo.",
      caminho: "Separe leitura do presente de memória do passado antes de decidir.",
    },
    {
      limite: 100,
      rotulo: "Confiança fraturada",
      leitura:
        "A expectativa de ser enganado(a) chegou antes da experiência. Desconfiança virou postura padrão.",
      caminho: "Reconstrua segurança em doses pequenas e verificáveis, não de uma vez.",
    },
  ],
};

export const LEITURA_GERAL: Faixa[] = [
  {
    limite: 33,
    rotulo: "Padrão emocional estável",
    leitura:
      "Suas experiências difíceis foram integradas. Existem pontos sensíveis, mas eles não comandam suas escolhas.",
    caminho: "Sua sessão pode focar em aprofundamento e propósito, não em reparação.",
  },
  {
    limite: 66,
    rotulo: "Padrão emocional em tensão",
    leitura:
      "Há partes suas que funcionam bem e partes que ainda operam a partir da defesa. É o retrato clássico de quem já se decepcionou e seguiu adiante sem elaborar tudo.",
    caminho:
      "Sua sessão pode priorizar as duas emoções secundárias mais altas do gráfico — é ali que está a maior alavanca de mudança.",
  },
  {
    limite: 100,
    rotulo: "Padrão emocional em sobrecarga",
    leitura:
      "A maior parte do seu sistema emocional está organizada em torno de evitar dor. Isso consome energia que poderia estar disponível para viver.",
    caminho:
      "Sua sessão deve começar pela regulação e pela segurança interna antes de qualquer trabalho de vínculo.",
  },
];
