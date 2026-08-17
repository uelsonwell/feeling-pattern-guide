/**
 * MAPA 3 PORTAS — V4.1 (estrutura congelada)
 * 20 situações · 80 alternativas · 5 experiências · 3 portas · 15 células
 *
 * Cada alternativa carrega sua codificação:
 *   experiência principal (entra na matriz 5×3)
 *   experiência secundária (armazenada, NÃO entra na matriz)
 *   porta principal + porta secundária
 * Pesos permitidos: 0 | 1 | 2 — fonte normativa: Tabela Mestre V4.1 (80/80 registros)
 */

export const VERSION = "V4.1";

export type ExperienciaId = "REJ" | "ABA" | "MAN" | "HUM" | "TRA";
export type PortaId = "MED" | "CV" | "RAI";
export type Peso = 0 | 1 | 2;
export type OpcaoLetra = "A" | "B" | "C" | "D";

export const EXPERIENCIAS: { id: ExperienciaId; nome: string; descricao: string }[] = [
  {
    id: "REJ",
    nome: "Rejeição",
    descricao: "A experiência de não ser aceito, aprovado ou escolhido como se é.",
  },
  {
    id: "ABA",
    nome: "Abandono",
    descricao: "A experiência de perder presença, vínculo e continuidade do outro.",
  },
  {
    id: "MAN",
    nome: "Manipulação",
    descricao: "A experiência de ter a própria vontade conduzida por pressão ou culpa.",
  },
  {
    id: "HUM",
    nome: "Humilhação",
    descricao: "A experiência de ser exposto, diminuído ou desvalorizado diante de outros.",
  },
  {
    id: "TRA",
    nome: "Traição",
    descricao: "A experiência de ter a confiança quebrada por quem se confiava.",
  },
];

export const PORTAS: { id: PortaId; nome: string; descricao: string }[] = [
  {
    id: "MED",
    nome: "Medo",
    descricao: "A resposta se organiza para antecipar perda, ameaça ou desamparo.",
  },
  {
    id: "CV",
    nome: "Controle/Vigilância",
    descricao: "A resposta se organiza como monitoramento, checagem e tentativa de manter tudo sob controle.",
  },
  {
    id: "RAI",
    nome: "Raiva",
    descricao: "A resposta se organiza como confronto, defesa de limite e reação.",
  },
];

export const NOME_EXPERIENCIA: Record<ExperienciaId, string> = Object.fromEntries(
  EXPERIENCIAS.map((e) => [e.id, e.nome]),
) as Record<ExperienciaId, string>;

export const NOME_PORTA: Record<PortaId, string> = Object.fromEntries(
  PORTAS.map((p) => [p.id, p.nome]),
) as Record<PortaId, string>;

export type Codificacao = {
  primary_experience: ExperienciaId;
  primary_experience_weight: Peso;
  secondary_experience: ExperienciaId | null;
  secondary_experience_weight: Peso | null;
  /** Pode ser nula: há registros da Tabela Mestre sem porta principal. */
  primary_gate: PortaId | null;
  primary_gate_weight: Peso | null;
  secondary_gate: PortaId | null;
  secondary_gate_weight: Peso | null;
};

export type Alternativa = Codificacao & {
  option: OpcaoLetra;
  texto: string;
};

export type Questao = {
  question_id: string;
  bloco: ExperienciaId;
  titulo: string;
  situacao: string;
  alternativas: Alternativa[];
};

/** Atalho para declarar a codificação de forma compacta. */
const alt = (
  option: OpcaoLetra,
  texto: string,
  exp: ExperienciaId,
  expW: Peso,
  gate: PortaId | null,
  gateW: Peso | null,
  extras: Partial<
    Pick<
      Codificacao,
      "secondary_experience" | "secondary_experience_weight" | "secondary_gate" | "secondary_gate_weight"
    >
  > = {},
): Alternativa => ({
  option,
  texto,
  primary_experience: exp,
  primary_experience_weight: expW,
  secondary_experience: extras.secondary_experience ?? null,
  secondary_experience_weight: extras.secondary_experience_weight ?? null,
  primary_gate: gate,
  primary_gate_weight: gateW,
  secondary_gate: extras.secondary_gate ?? null,
  secondary_gate_weight: extras.secondary_gate_weight ?? null,
});

export const QUESTOES: Questao[] = [
  {
    question_id: "R01",
    bloco: "REJ",
    titulo: "Desaprovação",
    situacao:
      "Você toma uma decisão importante para sua vida e alguém cuja opinião é importante para você deixa claro que não concorda. O que tende a acontecer dentro de você?",
    alternativas: [
      alt("A", "Começo a questionar se minha decisão realmente foi boa e fico inseguro(a) sobre o que fazer.", "REJ", 2, "MED", 2, {}),
      alt("B", "Fico pensando no que essa pessoa passou a pensar de mim.", "REJ", 2, "CV", 2, {}),
      alt("C", "Sinto irritação e vontade de deixar claro que a decisão é minha.", "REJ", 2, "RAI", 2, {}),
      alt("D", "Tento explicar melhor minha escolha para que a pessoa compreenda e volte a me apoiar.", "REJ", 2, null, null, { secondary_gate: "MED", secondary_gate_weight: 1 }),
    ],
  },
  {
    question_id: "R02",
    bloco: "REJ",
    titulo: "Não ser escolhido",
    situacao:
      "Você está em um grupo de pessoas e percebe que foi deixado de fora de uma escolha ou convite que considerava importante. O que mais provavelmente acontece com você?",
    alternativas: [
      alt("A", "Sinto que talvez não seja tão importante para aquelas pessoas quanto imaginava.", "REJ", 2, null, null, { secondary_gate: "CV", secondary_gate_weight: 1 }),
      alt("B", "Começo a pensar se fiz alguma coisa para provocar esse afastamento.", "REJ", 2, "CV", 2, {}),
      alt("C", "Fico incomodado(a) e tenho vontade de mostrar que não preciso daquele grupo.", "REJ", 2, "RAI", 2, {}),
      alt("D", "Tento descobrir o motivo e entender o que aconteceu antes de tirar conclusões.", "REJ", 2, null, null, {}),
    ],
  },
  {
    question_id: "R03",
    bloco: "REJ",
    titulo: "Crítica pessoal",
    situacao:
      "Alguém que você respeita faz uma crítica sobre uma característica sua, e não apenas sobre algo que você fez. Como você tende a reagir?",
    alternativas: [
      alt("A", "Fico pensando bastante naquilo e começo a observar se realmente sou daquela maneira.", "REJ", 2, "CV", 2, {}),
      alt("B", "Sinto-me diminuído(a), principalmente se outras pessoas estiverem presentes.", "HUM", 2, "CV", 2, { secondary_experience: "REJ", secondary_experience_weight: 1 }),
      alt("C", "Tenho vontade de responder imediatamente e mostrar que a pessoa também tem defeitos.", "REJ", 2, "RAI", 2, {}),
      alt("D", "Tento entender por que aquela pessoa me enxerga daquela maneira.", "REJ", 2, null, null, {}),
    ],
  },
  {
    question_id: "R04",
    bloco: "REJ",
    titulo: "Não ser suficiente",
    situacao:
      "Você se esforça muito para fazer algo importante e, mesmo assim, percebe que a outra pessoa esperava mais de você. Qual é sua reação mais espontânea?",
    alternativas: [
      alt("A", "Sinto que talvez eu não tenha sido capaz o suficiente.", "REJ", 2, "CV", 2, {}),
      alt("B", "Fico preocupado(a) com a imagem que aquela pessoa passou a ter de mim.", "REJ", 2, null, null, { secondary_gate: "MED", secondary_gate_weight: 1 }),
      alt("C", "Sinto raiva porque parece que meu esforço não foi reconhecido.", "REJ", 2, "RAI", 2, {}),
      alt("D", "Tenho vontade de fazer ainda mais para provar que consigo.", "REJ", 2, null, null, { secondary_gate: "CV", secondary_gate_weight: 1 }),
    ],
  },
  {
    question_id: "A01",
    bloco: "ABA",
    titulo: "Distanciamento",
    situacao:
      "Uma pessoa muito importante para você começa a ficar mais distante, responde menos e demonstra menos interesse. O que tende a acontecer dentro de você?",
    alternativas: [
      alt("A", "Fico preocupado(a) que esteja perdendo aquela pessoa.", "ABA", 2, "MED", 2, {}),
      alt("B", "Começo a pensar se fiz alguma coisa que provocou essa mudança.", "ABA", 2, "CV", 2, {}),
      alt("C", "Fico irritado(a) e tenho vontade de cobrar uma explicação.", "ABA", 2, "RAI", 2, {}),
      alt("D", "Também me afasto para não demonstrar que aquilo me afetou.", "ABA", 2, null, null, {}),
    ],
  },
  {
    question_id: "A02",
    bloco: "ABA",
    titulo: "Silêncio inesperado",
    situacao:
      "Você manda uma mensagem para alguém importante e percebe que a pessoa visualizou, mas não respondeu durante muitas horas. Qual é sua reação mais espontânea?",
    alternativas: [
      alt("A", "Começo a imaginar que alguma coisa aconteceu ou que essa pessoa está se afastando.", "ABA", 2, "MED", 2, {}),
      alt("B", "Penso se falei alguma coisa errada ou fiz algo que desagradou.", "ABA", 2, "CV", 2, {}),
      alt("C", "Fico irritado(a) e penso que, se ela não quer responder, também não vou procurar.", "ABA", 2, "RAI", 2, {}),
      alt("D", "Tento ocupar minha cabeça com outras coisas, mas fico esperando a resposta.", "ABA", 2, "MED", 1, {}),
    ],
  },
  {
    question_id: "A03",
    bloco: "ABA",
    titulo: "Mudança de vínculo",
    situacao:
      "Uma pessoa com quem você tinha muita proximidade começa a fazer novos amigos e passa a dedicar menos tempo a você. Como você tende a se sentir e agir?",
    alternativas: [
      alt("A", "Sinto medo de perder o lugar que eu tinha na vida daquela pessoa.", "ABA", 2, "MED", 2, {}),
      alt("B", "Começo a me perguntar o que há de errado comigo.", "ABA", 2, "CV", 2, {}),
      alt("C", "Fico incomodado(a) e tenho vontade de demonstrar que não aceito ser deixado de lado.", "ABA", 2, "RAI", 2, {}),
      alt("D", "Tento me aproximar mais para recuperar a proximidade que existia antes.", "ABA", 2, "MED", 1, {}),
    ],
  },
  {
    question_id: "A04",
    bloco: "ABA",
    titulo: "Medo de perder",
    situacao:
      "Quando percebe que uma relação importante está passando por uma fase difícil, qual é a sua tendência?",
    alternativas: [
      alt("A", "Tento me aproximar e resolver rapidamente para não perder a relação.", "ABA", 2, "MED", 2, {}),
      alt("B", "Fico pensando no que fiz de errado para a relação chegar naquele ponto.", "ABA", 2, "CV", 2, {}),
      alt("C", "Fico irritado(a) e começo a cobrar atitudes da outra pessoa.", "ABA", 2, "RAI", 2, {}),
      alt("D", "Procuro me afastar emocionalmente para não sofrer caso a relação termine.", "ABA", 2, "MED", 1, {}),
    ],
  },
  {
    question_id: "M01",
    bloco: "MAN",
    titulo: "Culpa como pressão",
    situacao:
      "Você decide não fazer algo que uma pessoa próxima queria. Em vez de aceitar sua decisão, ela diz algo que faz você se sentir culpado por não ter feito o que ela queria. Como você tende a reagir?",
    alternativas: [
      alt("A", "Acabo reconsiderando minha decisão para evitar que a pessoa fique magoada.", "MAN", 2, "MED", 2, {}),
      alt("B", "Fico pensando se estou sendo egoísta ou injusto(a).", "MAN", 2, "CV", 2, {}),
      alt("C", "Sinto raiva e tenho vontade de deixar claro que ninguém vai decidir por mim.", "MAN", 2, "RAI", 2, {}),
      alt("D", "Tento explicar minhas razões várias vezes até a pessoa aceitar minha decisão.", "MAN", 2, null, null, {}),
    ],
  },
  {
    question_id: "M02",
    bloco: "MAN",
    titulo: "Controle disfarçado de cuidado",
    situacao:
      "Uma pessoa próxima começa a questionar frequentemente suas escolhas, dizendo que faz isso porque quer proteger você e sabe o que é melhor para você. Como você tende a reagir?",
    alternativas: [
      alt("A", "Começo a duvidar das minhas próprias escolhas.", "MAN", 2, "MED", 2, {}),
      alt("B", "Fico preocupado(a) em decepcionar essa pessoa.", "MAN", 2, "CV", 1, {}),
      alt("C", "Sinto irritação e vontade de cortar aquela interferência.", "MAN", 2, "RAI", 2, {}),
      alt("D", "Passo a justificar minhas decisões para tentar fazer a pessoa entender.", "MAN", 2, null, null, {}),
    ],
  },
  {
    question_id: "M03",
    bloco: "MAN",
    titulo: "Chantagem emocional",
    situacao:
      "Alguém importante deixa claro que ficará magoado, se afastará ou mudará a relação caso você não faça aquilo que essa pessoa deseja. O que você tende a fazer?",
    alternativas: [
      alt("A", "Acabo cedendo para não correr o risco de perder a relação.", "MAN", 2, "MED", 2, {}),
      alt("B", "Fico tomado(a) pela culpa e penso que deveria fazer aquilo pela pessoa.", "MAN", 2, "CV", 2, {}),
      alt("C", "Fico com raiva e sinto vontade de romper aquela pressão.", "MAN", 2, "RAI", 2, {}),
      alt("D", "Tento negociar até encontrar uma forma de fazer a pessoa desistir da ameaça.", "MAN", 2, null, null, {}),
    ],
  },
  {
    question_id: "M04",
    bloco: "MAN",
    titulo: "Inversão de responsabilidade",
    situacao:
      "Você tenta conversar com alguém sobre algo que fez você se sentir mal. Durante a conversa, a pessoa muda o foco e você termina se sentindo culpado por ter levantado o assunto. Como você tende a reagir?",
    alternativas: [
      alt("A", "Começo a pensar que talvez eu realmente esteja exagerando.", "MAN", 2, "MED", 1, {}),
      alt("B", "Fico envergonhado(a) por ter criado aquela situação.", "MAN", 2, "CV", 2, {}),
      alt("C", "Fico muito irritado(a) porque sinto que o problema foi colocado sobre mim.", "MAN", 2, "RAI", 2, {}),
      alt("D", "Tento voltar ao assunto original e explicar novamente o que aconteceu.", "MAN", 2, null, null, {}),
    ],
  },
  {
    question_id: "H01",
    bloco: "HUM",
    titulo: "Exposição",
    situacao:
      "Alguém aponta um erro seu diante de outras pessoas, fazendo você se sentir exposto. Qual é sua reação mais espontânea?",
    alternativas: [
      alt("A", "Quero sair daquela situação o mais rápido possível.", "HUM", 2, "MED", 1, {}),
      alt("B", "Fico pensando durante muito tempo sobre como aquelas pessoas passaram a me enxergar.", "HUM", 2, "CV", 2, {}),
      alt("C", "Sinto vontade de responder na mesma intensidade.", "HUM", 2, "RAI", 2, {}),
      alt("D", "Tento agir como se aquilo não tivesse importância.", "HUM", 2, null, null, {}),
    ],
  },
  {
    question_id: "H02",
    bloco: "HUM",
    titulo: "Desvalorização",
    situacao:
      "Você apresenta uma ideia na qual acredita e alguém a trata com ironia ou faz você parecer incapaz diante dos outros. Como você tende a reagir?",
    alternativas: [
      alt("A", "Começo a questionar se minha ideia realmente era tão boa.", "HUM", 2, "CV", 2, {}),
      alt("B", "Sinto vergonha de ter falado e gostaria de não ter me exposto.", "HUM", 2, "CV", 2, {}),
      alt("C", "Fico com raiva e tenho vontade de colocar a pessoa no lugar dela.", "HUM", 2, "RAI", 2, {}),
      alt("D", "Tento explicar minha ideia ainda melhor para mostrar que ela está errada.", "HUM", 2, null, null, {}),
    ],
  },
  {
    question_id: "H03",
    bloco: "HUM",
    titulo: "Erro público",
    situacao:
      "Você comete um erro diante de várias pessoas e percebe que algumas delas estão observando sua reação. O que acontece com você naquele momento?",
    alternativas: [
      alt("A", "Quero desaparecer daquela situação.", "HUM", 2, "MED", 1, {}),
      alt("B", "Sinto-me profundamente constrangido(a) e começo a pensar no que todos estão achando.", "HUM", 2, "CV", 2, {}),
      alt("C", "Fico irritado(a), principalmente se alguém fizer algum comentário.", "HUM", 2, "RAI", 2, {}),
      alt("D", "Tento rir da situação e agir como se não tivesse sido nada demais.", "HUM", 2, null, null, {}),
    ],
  },
  {
    question_id: "H04",
    bloco: "HUM",
    titulo: "Ser diminuído",
    situacao:
      "Durante uma discussão, alguém usa uma característica sua, uma dificuldade ou um erro do passado para diminuir você. O que tende a acontecer?",
    alternativas: [
      alt("A", "Aquilo fica ecoando dentro de mim e começo a questionar meu próprio valor.", "HUM", 2, "CV", 2, {}),
      alt("B", "Sinto-me envergonhado(a) e gostaria de não ter aquela história exposta.", "HUM", 2, "CV", 2, {}),
      alt("C", "Sinto uma raiva muito forte e quero devolver a agressão.", "HUM", 2, "RAI", 2, {}),
      alt("D", "Tento mostrar que aquilo não me atinge.", "HUM", 2, null, null, {}),
    ],
  },
  {
    question_id: "T01",
    bloco: "TRA",
    titulo: "Confiança quebrada",
    situacao:
      "Você descobre que uma pessoa em quem confiava escondeu de você algo importante que poderia mudar sua percepção sobre a relação. Como tende a reagir?",
    alternativas: [
      alt("A", "Fico inseguro(a) sobre o que mais pode estar sendo escondido.", "TRA", 2, "MED", 2, {}),
      alt("B", "Começo a me perguntar por que não percebi antes e se fiz alguma coisa para isso acontecer.", "TRA", 2, "CV", 2, {}),
      alt("C", "Sinto raiva e quero confrontar a pessoa imediatamente.", "TRA", 2, "RAI", 2, {}),
      alt("D", "Passo a desconfiar de tudo o que aquela pessoa me diz.", "TRA", 2, null, null, {}),
    ],
  },
  {
    question_id: "T02",
    bloco: "TRA",
    titulo: "Descobrir uma mentira",
    situacao:
      "Você descobre que alguém próximo mentiu para você sobre algo importante. O que acontece primeiro dentro de você?",
    alternativas: [
      alt("A", "Começo a pensar que talvez não possa mais confiar naquela pessoa.", "TRA", 2, "MED", 2, {}),
      alt("B", "Fico pensando se ignorei sinais que já estavam ali.", "TRA", 2, "CV", 2, {}),
      alt("C", "Sinto raiva e tenho vontade de exigir uma explicação.", "TRA", 2, "RAI", 2, {}),
      alt("D", "Fico abalado(a) e começo a rever mentalmente tudo o que aconteceu.", "TRA", 2, null, null, {}),
    ],
  },
  {
    question_id: "T03",
    bloco: "TRA",
    titulo: "Segredo",
    situacao:
      "Você descobre que pessoas próximas sabiam de algo importante que dizia respeito a você, mas escolheram não contar. Como tende a reagir?",
    alternativas: [
      alt("A", "Fico pensando por que esconderam aquilo de mim.", "TRA", 2, "CV", 1, {}),
      alt("B", "Sinto-me diminuído(a) por terem decidido que eu não deveria saber.", "TRA", 2, "CV", 2, {}),
      alt("C", "Fico muito irritado(a) e quero saber quem decidiu esconder aquilo.", "TRA", 2, "RAI", 2, {}),
      alt("D", "Passo a desconfiar que outras coisas também podem estar sendo escondidas.", "TRA", 2, null, null, {}),
    ],
  },
  {
    question_id: "T04",
    bloco: "TRA",
    titulo: "Quebra de lealdade",
    situacao:
      "Você descobre que alguém em quem confiava tomou uma atitude importante pelas suas costas. Qual é sua reação mais espontânea?",
    alternativas: [
      alt("A", "Fico inseguro(a) e começo a questionar se realmente conhecia aquela pessoa.", "TRA", 2, "MED", 2, {}),
      alt("B", "Penso no que fiz para que ela escolhesse agir dessa maneira comigo.", "TRA", 2, "CV", 2, {}),
      alt("C", "Sinto raiva e tenho vontade de confrontá-la.", "TRA", 2, "RAI", 2, {}),
      alt("D", "Passo a me proteger e tenho dificuldade para confiar novamente.", "TRA", 2, null, null, {}),
    ],
  },
];

export const TOTAL_QUESTOES = QUESTOES.length;
/** MAX_REACHABLE congelado: máximo por célula da matriz 5×3. */
export const MAX_CELULA = 8;
/** Máximo operacional de cada porta (20 situações × 2 pontos). */
export const MAX_PORTA = TOTAL_QUESTOES * 2;
/** Margem de dominância congelada, em pontos percentuais. */
export const DOMINANCE_MARGIN = 10;
