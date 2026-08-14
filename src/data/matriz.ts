/**
 * MATRIZ DE COMPORTAMENTO E PADRÕES EMOCIONAIS
 * ---------------------------------------------------------------
 * Como editar:
 * 1. DIMENSOES: os eixos avaliados (aparecem no gráfico).
 * 2. PERGUNTAS: cada pergunta pertence a uma dimensão e tem opções.
 *    Cada opção tem um `peso` de 0 a 4 (0 = padrão saudável,
 *    4 = padrão emocional muito ativo).
 * 3. A pontuação de cada dimensão é normalizada em % (0 a 100).
 * 4. FAIXAS: textos de devolutiva por nível de cada dimensão.
 */

export const PESO_MAXIMO = 4;

export type DimensaoId =
  | "confianca"
  | "autoprotecao"
  | "vinculo"
  | "regulacao"
  | "autovalor";

export type Dimensao = {
  id: DimensaoId;
  nome: string;
  descricao: string;
};

export const DIMENSOES: Dimensao[] = [
  {
    id: "confianca",
    nome: "Confiança",
    descricao:
      "O quanto você consegue se abrir e acreditar na intenção do outro depois das decepções vividas.",
  },
  {
    id: "autoprotecao",
    nome: "Autoproteção",
    descricao:
      "Mecanismos de defesa acionados para evitar novas dores: controle, distanciamento, antecipação de perdas.",
  },
  {
    id: "vinculo",
    nome: "Vínculo",
    descricao:
      "A forma como você se aproxima, permanece e negocia intimidade em relações significativas.",
  },
  {
    id: "regulacao",
    nome: "Regulação emocional",
    descricao:
      "Como as emoções intensas surgem, quanto tempo permanecem e o que você faz com elas.",
  },
  {
    id: "autovalor",
    nome: "Autovalor",
    descricao:
      "A medida do seu merecimento interno: o que você acredita poder pedir, receber e ocupar.",
  },
];

export type Opcao = { texto: string; peso: number };

export type Pergunta = {
  id: string;
  dimensao: DimensaoId;
  texto: string;
  opcoes: Opcao[];
};

export const PERGUNTAS: Pergunta[] = [
  {
    id: "q1",
    dimensao: "confianca",
    texto: "Quando alguém demonstra interesse genuíno por você, sua primeira reação interna é:",
    opcoes: [
      { texto: "Acolho e retribuo com naturalidade", peso: 0 },
      { texto: "Gosto, mas fico observando por um tempo", peso: 2 },
      { texto: "Desconfio e procuro o que há por trás", peso: 3 },
      { texto: "Tenho certeza de que em algum momento vai decepcionar", peso: 4 },
    ],
  },
  {
    id: "q2",
    dimensao: "confianca",
    texto: "Diante de uma promessa feita a você, o que costuma acontecer:",
    opcoes: [
      { texto: "Confio até que exista motivo real para duvidar", peso: 0 },
      { texto: "Confio, mas já penso num plano alternativo", peso: 2 },
      { texto: "Prefiro não criar expectativa nenhuma", peso: 3 },
      { texto: "Já me preparo para o descumprimento", peso: 4 },
    ],
  },
  {
    id: "q3",
    dimensao: "confianca",
    texto: "Ao lembrar de uma traição ou quebra de confiança do passado:",
    opcoes: [
      { texto: "Consigo olhar com serenidade, virou aprendizado", peso: 0 },
      { texto: "Ainda incomoda, mas não guia minhas escolhas", peso: 1 },
      { texto: "Influencia como eu escolho as pessoas hoje", peso: 3 },
      { texto: "Revivo a cena com a mesma intensidade de antes", peso: 4 },
    ],
  },
  {
    id: "q4",
    dimensao: "autoprotecao",
    texto: "Quando uma relação começa a ficar íntima demais, você:",
    opcoes: [
      { texto: "Permaneço presente e converso sobre o que sinto", peso: 0 },
      { texto: "Sigo, mas preservo uma parte só minha", peso: 1 },
      { texto: "Crio distância sem explicar direito o motivo", peso: 3 },
      { texto: "Encontro defeitos e me afasto antes de sofrer", peso: 4 },
    ],
  },
  {
    id: "q5",
    dimensao: "autoprotecao",
    texto: "Sobre pedir ajuda quando você está mal:",
    opcoes: [
      { texto: "Peço com tranquilidade a quem confio", peso: 0 },
      { texto: "Peço, mas só depois de tentar resolver sozinho(a)", peso: 2 },
      { texto: "Raramente peço, acho que incomoda", peso: 3 },
      { texto: "Nunca peço, aprendi a contar só comigo", peso: 4 },
    ],
  },
  {
    id: "q6",
    dimensao: "autoprotecao",
    texto: "Diante de um conflito importante, sua tendência é:",
    opcoes: [
      { texto: "Enfrentar a conversa mesmo sendo desconfortável", peso: 0 },
      { texto: "Esperar esfriar e depois falar", peso: 1 },
      { texto: "Engolir para não gerar tensão", peso: 3 },
      { texto: "Me calar e ir cortando o vínculo por dentro", peso: 4 },
    ],
  },
  {
    id: "q7",
    dimensao: "vinculo",
    texto: "No relacionamento afetivo, o que mais aparece em você:",
    opcoes: [
      { texto: "Presença tranquila, com espaço para os dois", peso: 0 },
      { texto: "Preciso de sinais frequentes de que está tudo bem", peso: 2 },
      { texto: "Oscilo entre querer muito perto e querer sumir", peso: 3 },
      { texto: "Me anulo para manter a relação de pé", peso: 4 },
    ],
  },
  {
    id: "q8",
    dimensao: "vinculo",
    texto: "Quando o outro fica quieto ou distante por algumas horas:",
    opcoes: [
      { texto: "Entendo que cada um tem seu tempo", peso: 0 },
      { texto: "Fico atento(a), mas sigo minha rotina", peso: 1 },
      { texto: "Começo a imaginar que fiz algo errado", peso: 3 },
      { texto: "Entro em alerta e preciso resolver imediatamente", peso: 4 },
    ],
  },
  {
    id: "q9",
    dimensao: "vinculo",
    texto: "Sobre dizer 'não' para quem você ama:",
    opcoes: [
      { texto: "Digo com clareza e sem culpa", peso: 0 },
      { texto: "Digo, mas fico remoendo depois", peso: 2 },
      { texto: "Custo muito e quase sempre cedo", peso: 3 },
      { texto: "Não consigo, sinto que vou perder a pessoa", peso: 4 },
    ],
  },
  {
    id: "q10",
    dimensao: "regulacao",
    texto: "Quando uma emoção forte aparece (raiva, medo, tristeza):",
    opcoes: [
      { texto: "Reconheço, sinto e ela passa em pouco tempo", peso: 0 },
      { texto: "Demoro um pouco, mas consigo me organizar", peso: 1 },
      { texto: "Ela toma conta do meu dia inteiro", peso: 3 },
      { texto: "Perco o controle ou desligo completamente", peso: 4 },
    ],
  },
  {
    id: "q11",
    dimensao: "regulacao",
    texto: "Seu corpo em situações de estresse emocional:",
    opcoes: [
      { texto: "Reage e volta ao normal com facilidade", peso: 0 },
      { texto: "Fica tenso, mas relaxa depois", peso: 1 },
      { texto: "Insônia, aperto no peito ou dores frequentes", peso: 3 },
      { texto: "Vive em estado de alerta quase o tempo todo", peso: 4 },
    ],
  },
  {
    id: "q12",
    dimensao: "regulacao",
    texto: "Sobre remoer conversas e cenas na cabeça:",
    opcoes: [
      { texto: "Raramente acontece", peso: 0 },
      { texto: "Acontece em situações realmente importantes", peso: 2 },
      { texto: "Acontece toda semana", peso: 3 },
      { texto: "É praticamente diário e me esgota", peso: 4 },
    ],
  },
  {
    id: "q13",
    dimensao: "autovalor",
    texto: "Ao receber um elogio sincero:",
    opcoes: [
      { texto: "Recebo e agradeço", peso: 0 },
      { texto: "Fico sem jeito, mas aceito", peso: 1 },
      { texto: "Minimizo na hora", peso: 3 },
      { texto: "Não acredito, acho que é gentileza", peso: 4 },
    ],
  },
  {
    id: "q14",
    dimensao: "autovalor",
    texto: "Sobre o que você acredita merecer numa relação:",
    opcoes: [
      { texto: "Reciprocidade, respeito e cuidado", peso: 0 },
      { texto: "Mereço, mas nem sempre peço", peso: 2 },
      { texto: "Aceito bem menos do que gostaria", peso: 3 },
      { texto: "Sinto que preciso provar valor para ser amado(a)", peso: 4 },
    ],
  },
  {
    id: "q15",
    dimensao: "autovalor",
    texto: "Quando algo dá errado em uma relação, sua leitura interna é:",
    opcoes: [
      { texto: "Existem dois lados e responsabilidades divididas", peso: 0 },
      { texto: "Analiso, mas puxo boa parte para mim", peso: 2 },
      { texto: "A culpa costuma ser minha", peso: 3 },
      { texto: "É sempre sobre eu não ser suficiente", peso: 4 },
    ],
  },
];

export type Faixa = {
  limite: number; // percentual máximo desta faixa
  rotulo: string;
  leitura: string;
  caminho: string;
};

export const FAIXAS: Record<DimensaoId, Faixa[]> = {
  confianca: [
    {
      limite: 33,
      rotulo: "Confiança preservada",
      leitura:
        "As decepções vividas não fecharam sua porta. Você ainda consegue avaliar cada pessoa pelo que ela é.",
      caminho: "Continue nomeando o que você observa em vez de generalizar experiências antigas.",
    },
    {
      limite: 66,
      rotulo: "Confiança em vigilância",
      leitura:
        "Você se aproxima, mas mantém um radar ligado. A parte de você que confia divide espaço com a que fiscaliza.",
      caminho:
        "Experimente separar o que é leitura do presente do que é memória do passado antes de decidir.",
    },
    {
      limite: 100,
      rotulo: "Confiança fraturada",
      leitura:
        "A expectativa de decepção chegou antes da experiência. Você já entra nas relações preparado(a) para a perda.",
      caminho:
        "O trabalho aqui é reconstruir segurança em doses pequenas e verificáveis, não de uma vez.",
    },
  ],
  autoprotecao: [
    {
      limite: 33,
      rotulo: "Defesas flexíveis",
      leitura: "Você se protege quando é necessário e baixa a guarda quando é seguro.",
      caminho: "Mantenha o hábito de dizer o que sente antes que vire distância.",
    },
    {
      limite: 66,
      rotulo: "Armadura frequente",
      leitura:
        "Boa parte da sua energia vai para não ser pego(a) de surpresa. Autonomia virou também isolamento.",
      caminho: "Escolha uma pessoa segura e pratique pedir algo pequeno esta semana.",
    },
    {
      limite: 100,
      rotulo: "Blindagem permanente",
      leitura:
        "A proteção passou a custar a intimidade. Você se afasta antes que a dor tenha chance de chegar.",
      caminho: "Comece observando o momento exato em que a vontade de sumir aparece — e o que a dispara.",
    },
  ],
  vinculo: [
    {
      limite: 33,
      rotulo: "Vínculo seguro",
      leitura: "Você consegue estar perto sem se perder e longe sem se desesperar.",
      caminho: "Siga cultivando acordos claros e conversas diretas.",
    },
    {
      limite: 66,
      rotulo: "Vínculo ansioso",
      leitura:
        "A relação ocupa muito do seu termômetro interno. Silêncios viram interpretações e cobranças.",
      caminho: "Antes de reagir, dê nome à emoção e espere o corpo baixar a intensidade.",
    },
    {
      limite: 100,
      rotulo: "Vínculo de sobrevivência",
      leitura:
        "Você se apaga para manter a relação viva. Permanecer virou mais importante do que estar bem.",
      caminho: "Recupere um desejo próprio por semana e comunique-o, mesmo que gere desconforto.",
    },
  ],
  regulacao: [
    {
      limite: 33,
      rotulo: "Boa regulação",
      leitura: "As emoções chegam, cumprem sua função e passam.",
      caminho: "Mantenha suas rotinas de descarga: sono, corpo, conversa.",
    },
    {
      limite: 66,
      rotulo: "Regulação instável",
      leitura:
        "As emoções ficam mais tempo do que precisariam e sequestram seu dia com alguma frequência.",
      caminho: "Trabalhe respiração e nomeação emocional nos primeiros 90 segundos da ativação.",
    },
    {
      limite: 100,
      rotulo: "Sistema em alerta",
      leitura:
        "Seu corpo vive em estado de defesa. O cansaço não é falta de força, é excesso de vigilância.",
      caminho: "A prioridade é regular o corpo antes de tentar resolver a história.",
    },
  ],
  autovalor: [
    {
      limite: 33,
      rotulo: "Autovalor firme",
      leitura: "Você sabe o que merece e sustenta isso sem precisar provar nada.",
      caminho: "Continue escolhendo ambientes que confirmam esse valor.",
    },
    {
      limite: 66,
      rotulo: "Autovalor condicionado",
      leitura:
        "Seu valor sobe e desce conforme a resposta do outro. Você merece, mas nem sempre pede.",
      caminho: "Pratique pedir algo legítimo sem justificar em excesso.",
    },
    {
      limite: 100,
      rotulo: "Autovalor comprometido",
      leitura:
        "A culpa virou lente padrão e o merecimento ficou condicionado ao esforço e à entrega ao outro.",
      caminho:
        "O ponto de partida é registrar diariamente uma evidência concreta de valor próprio.",
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
      "Sua sessão pode priorizar as duas dimensões mais altas do gráfico — é ali que está a maior alavanca de mudança.",
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
