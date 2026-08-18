/**
 * MOTOR DE PONTUAÇÃO — MAPA 3 PORTAS V4.1 (estrutura congelada)
 * O motor apenas calcula números, relações e classificações.
 * Nenhum texto interpretativo é produzido aqui.
 */

import {
  DOMINANCE_MARGIN,
  EXPERIENCIAS,
  MAX_CELULA,
  MAX_PORTA,
  PORTAS,
  QUESTOES,
  TOTAL_QUESTOES,
  VERSION,
  type Alternativa,
  type ExperienciaId,
  type OpcaoLetra,
  type PortaId,
} from "@/data/mapa-v41";

export type Nivel = "LOW" | "MODERATE" | "HIGH";
export type Convergencia = "STRONG" | "MODERATE" | "DIVERGENT" | "DISTRIBUTED";

export type Respostas = Record<string, OpcaoLetra>;

export type ResultadoPorta = {
  id: PortaId;
  raw: number;
  percent: number;
  level: Nivel;
};

export type ResultadoCelula = {
  experiencia: ExperienciaId;
  porta: PortaId;
  raw: number;
  percent: number;
  level: Nivel;
};

export type ResultadoExperiencia = {
  id: ExperienciaId;
  /** % das 4 situações do bloco em que houve contribuição registrada. */
  presence: number;
  /** Pontos da linha da matriz ÷ 8 × 100. */
  resonance: number;
  raw: number;
  level: Nivel;
};

export type CelulaRanking = ResultadoCelula & { rank: number; tie: boolean };

export type CodigoErro =
  | "E001_QUESTIONNAIRE_INCOMPLETE"
  | "E002_INVALID_ALTERNATIVE"
  | "E003_INVALID_QUESTION"
  | "E004_VERSION_MISMATCH"
  | "E005_DUPLICATE_RESPONSE"
  | "E006_MASTER_TABLE_MAPPING_NOT_FOUND";

export type ErroMapa = { code: CodigoErro; detail: string };

export type MapaResultado = {
  metadata: {
    version: string;
    assessment_id: string;
    created_at: string;
    total_questions: number;
    answered: number;
  };
  status: "OK" | "ERROR";
  responses: { question_id: string; selected_option: OpcaoLetra }[];
  /** Dados secundários preservados, sem virar pontuação adicional. */
  secondary_data: {
    question_id: string;
    selected_option: OpcaoLetra;
    secondary_experience: ExperienciaId | null;
    secondary_experience_weight: number | null;
    secondary_gate: PortaId | null;
    secondary_gate_weight: number | null;
  }[];
  portas: Record<PortaId, ResultadoPorta>;
  experiencias: Record<ExperienciaId, ResultadoExperiencia>;
  matriz: Record<string, ResultadoCelula>;
  ranking: CelulaRanking[];
  top_1: CelulaRanking | null;
  top_2: CelulaRanking | null;
  /** TOP 1 − TOP 2 em pontos percentuais. */
  delta: number;
  ire: {
    dominant_experience: ExperienciaId | null;
    secondary_experience: ExperienciaId | null;
    multiple_dominant_experiences: ExperienciaId[];
  };
  classificacao: {
    dominant_gate: PortaId | null;
    secondary_gate: PortaId | null;
    dominance_margin: number;
    multiple_elevated_gates: PortaId[];
    convergence: Convergencia;
    convergence_cell: ResultadoCelula | null;
    profile_type: "SINGLE" | "HYBRID" | "DISTRIBUTED";
  };
  robustness: {
    /** Δ ≥ margem congelada → leitura sustentada. */
    delta_sustains_top: boolean;
    tied_top_cells: number;
    answered_ratio: number;
  };
  erros: ErroMapa[];
};


export const nivelDe = (percent: number): Nivel =>
  percent >= 70 ? "HIGH" : percent >= 40 ? "MODERATE" : "LOW";

export const ROTULO_NIVEL: Record<Nivel, string> = {
  LOW: "Baixa",
  MODERATE: "Moderada",
  HIGH: "Alta",
};

export const ROTULO_CONVERGENCIA: Record<Convergencia, string> = {
  STRONG: "Convergência forte",
  MODERATE: "Convergência moderada",
  DIVERGENT: "Perfil divergente",
  DISTRIBUTED: "Perfil distribuído",
};

export const chaveCelula = (e: ExperienciaId, p: PortaId) => `${e}_${p}`;

const alternativaDe = (questionId: string, opcao: OpcaoLetra): Alternativa | undefined =>
  QUESTOES.find((q) => q.question_id === questionId)?.alternativas.find((a) => a.option === opcao);

export function calcularMapa(respostas: Respostas, assessmentId = "ASS-LOCAL"): MapaResultado {
  const erros: ErroMapa[] = [];

  // ── Estruturas zeradas
  const portasRaw: Record<PortaId, number> = { MED: 0, CV: 0, RAI: 0 };
  const matrizRaw: Record<string, number> = {};
  EXPERIENCIAS.forEach((e) =>
    PORTAS.forEach((p) => {
      matrizRaw[chaveCelula(e.id, p.id)] = 0;
    }),
  );
  const presencaContagem: Record<ExperienciaId, number> = { REJ: 0, ABA: 0, MAN: 0, HUM: 0, TRA: 0 };

  const responses: MapaResultado["responses"] = [];
  const secondary_data: MapaResultado["secondary_data"] = [];

  QUESTOES.forEach((q) => {
    const escolhida = respostas[q.question_id];
    if (!escolhida) return;
    if (!["A", "B", "C", "D"].includes(escolhida)) {
      erros.push({ code: "E002_INVALID_ALTERNATIVE", detail: `${q.question_id}-${escolhida}` });
      return;
    }
    const codigo = alternativaDe(q.question_id, escolhida);
    if (!codigo) {
      erros.push({
        code: "E006_MASTER_TABLE_MAPPING_NOT_FOUND",
        detail: `${q.question_id}-${escolhida}`,
      });
      return;
    }
    responses.push({ question_id: q.question_id, selected_option: escolhida });

    // Dados secundários: preservados, nunca convertidos em pontuação
    secondary_data.push({
      question_id: q.question_id,
      selected_option: escolhida,
      secondary_experience: codigo.secondary_experience,
      secondary_experience_weight: codigo.secondary_experience_weight,
      secondary_gate: codigo.secondary_gate,
      secondary_gate_weight: codigo.secondary_gate_weight,
    });

    const pesoPrincipal = codigo.primary_gate_weight ?? 0;

    // Portas (bruto)
    if (codigo.primary_gate) portasRaw[codigo.primary_gate] += pesoPrincipal;
    if (codigo.secondary_gate && codigo.secondary_gate_weight)
      portasRaw[codigo.secondary_gate] += codigo.secondary_gate_weight;

    // Matriz 5×3 — apenas experiência principal × porta principal
    if (codigo.primary_gate && pesoPrincipal > 0) {
      const cell = chaveCelula(codigo.primary_experience, codigo.primary_gate);
      matrizRaw[cell] = (matrizRaw[cell] ?? 0) + pesoPrincipal;
      presencaContagem[codigo.primary_experience] += 1;
    }
  });

  const answered = responses.length;

  // ── Portas normalizadas
  const portas = Object.fromEntries(
    PORTAS.map((p) => {
      const raw = portasRaw[p.id];
      const percent = Math.round((raw / MAX_PORTA) * 1000) / 10;
      return [p.id, { id: p.id, raw, percent, level: nivelDe(percent) } satisfies ResultadoPorta];
    }),
  ) as Record<PortaId, ResultadoPorta>;

  // ── Matriz normalizada — MAX_REACHABLE = 8 por célula
  const matriz: Record<string, ResultadoCelula> = {};
  EXPERIENCIAS.forEach((e) =>
    PORTAS.forEach((p) => {
      const key = chaveCelula(e.id, p.id);
      const raw = Math.min(matrizRaw[key] ?? 0, MAX_CELULA);

      matriz[key] = {
        experiencia: e.id,
        porta: p.id,
        raw,
        percent: Math.round((raw / MAX_CELULA) * 1000) / 10,
        level: nivelDe((raw / MAX_CELULA) * 100),
      };
    }),
  );

  // ── IRE (presença × ressonância mantidas separadas)
  const experiencias = Object.fromEntries(
    EXPERIENCIAS.map((e) => {
      const raw = PORTAS.reduce((acc, p) => acc + (matriz[chaveCelula(e.id, p.id)]?.raw ?? 0), 0);
      const resonance = Math.round((raw / MAX_CELULA) * 1000) / 10;
      const presence = Math.round((presencaContagem[e.id] / 4) * 1000) / 10;
      return [
        e.id,
        { id: e.id, raw, presence, resonance, level: nivelDe(resonance) } satisfies ResultadoExperiencia,
      ];
    }),
  ) as Record<ExperienciaId, ResultadoExperiencia>;

  // ── Dominância das portas (margem de 10 p.p.)
  const portasOrd = [...Object.values(portas)].sort((a, b) => b.percent - a.percent);
  const margem = (portasOrd[0]?.percent ?? 0) - (portasOrd[1]?.percent ?? 0);
  const dominant_gate = margem >= DOMINANCE_MARGIN ? (portasOrd[0]?.id ?? null) : null;
  const secondary_gate = dominant_gate ? (portasOrd[1]?.id ?? null) : null;
  const multiple_elevated_gates = portasOrd.filter((p) => p.level !== "LOW").map((p) => p.id);

  // ── Dominância das experiências (mesma regra de não forçamento)
  const expOrd = [...Object.values(experiencias)].sort((a, b) => b.resonance - a.resonance);
  const margemExp = (expOrd[0]?.resonance ?? 0) - (expOrd[1]?.resonance ?? 0);
  const dominant_experience = margemExp >= DOMINANCE_MARGIN ? (expOrd[0]?.id ?? null) : null;
  const secondary_experience_ire = dominant_experience ? (expOrd[1]?.id ?? null) : null;
  const topo = expOrd[0]?.resonance ?? 0;
  const multiple_dominant_experiences = expOrd
    .filter((e) => topo - e.resonance < DOMINANCE_MARGIN && e.resonance > 0)
    .map((e) => e.id);

  // ── Convergência: sempre verificada na célula experiência × porta
  let convergence: Convergencia = "DISTRIBUTED";
  let convergence_cell: ResultadoCelula | null = null;
  if (dominant_experience && dominant_gate) {
    convergence_cell = matriz[chaveCelula(dominant_experience, dominant_gate)] ?? null;
    const nivel = convergence_cell?.level ?? "LOW";
    convergence = nivel === "HIGH" ? "STRONG" : nivel === "MODERATE" ? "MODERATE" : "DIVERGENT";
  }

  const profile_type =
    multiple_dominant_experiences.length > 1 || multiple_elevated_gates.length > 1
      ? dominant_experience && dominant_gate
        ? "HYBRID"
        : "DISTRIBUTED"
      : dominant_experience && dominant_gate
        ? "SINGLE"
        : "DISTRIBUTED";

  // ── Ranking das 15 células (empates preservados) + TOP 1, TOP 2 e Δ
  const ordenadas = Object.values(matriz).sort(
    (a, b) => b.percent - a.percent || a.experiencia.localeCompare(b.experiencia),
  );
  const ranking: CelulaRanking[] = ordenadas.map((c, i) => {
    const rank = ordenadas.findIndex((o) => o.percent === c.percent) + 1;
    const tie = ordenadas.filter((o) => o.percent === c.percent).length > 1;
    return { ...c, rank: rank || i + 1, tie };
  });
  const top_1 = ranking[0] ?? null;
  const nivel2 = ranking.find((c) => c.percent < (top_1?.percent ?? 0)) ?? null;
  const top_2 = nivel2;
  const delta = Math.round(((top_1?.percent ?? 0) - (top_2?.percent ?? 0)) * 10) / 10;

  if (answered < TOTAL_QUESTOES)
    erros.push({
      code: "E001_QUESTIONNAIRE_INCOMPLETE",
      detail: `${answered}/${TOTAL_QUESTOES} respostas`,
    });

  return {
    metadata: {
      version: VERSION,
      assessment_id: assessmentId,
      created_at: new Date().toISOString(),
      total_questions: TOTAL_QUESTOES,
      answered,
    },
    status: erros.length ? "ERROR" : "OK",
    responses,
    secondary_data,
    portas,
    experiencias,
    matriz,
    ranking,
    top_1,
    top_2,
    delta,
    ire: {
      dominant_experience,
      secondary_experience: secondary_experience_ire,
      multiple_dominant_experiences,
    },
    classificacao: {
      dominant_gate,
      secondary_gate,
      dominance_margin: DOMINANCE_MARGIN,
      multiple_elevated_gates,
      convergence,
      convergence_cell,
      profile_type: profile_type as MapaResultado["classificacao"]["profile_type"],
    },
    robustness: {
      delta_sustains_top: delta >= DOMINANCE_MARGIN,
      tied_top_cells: ranking.filter((c) => c.percent === (top_1?.percent ?? 0)).length,
      answered_ratio: Math.round((answered / TOTAL_QUESTOES) * 1000) / 10,
    },
    erros,
  };
}

