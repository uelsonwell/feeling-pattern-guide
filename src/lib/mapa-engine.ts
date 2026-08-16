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

export type MapaResultado = {
  metadata: {
    version: string;
    assessment_id: string;
    created_at: string;
    total_questions: number;
    answered: number;
  };
  responses: { question_id: string; selected_option: OpcaoLetra }[];
  portas: Record<PortaId, ResultadoPorta>;
  experiencias: Record<ExperienciaId, ResultadoExperiencia>;
  matriz: Record<string, ResultadoCelula>;
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
  erros: string[];
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
  const erros: string[] = [];

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

  QUESTOES.forEach((q) => {
    const escolhida = respostas[q.question_id];
    if (!escolhida) return;
    if (!["A", "B", "C", "D"].includes(escolhida)) {
      erros.push(`Alternativa inválida em ${q.question_id}`);
      return;
    }
    const codigo = alternativaDe(q.question_id, escolhida);
    if (!codigo) {
      erros.push(`Codificação ausente para ${q.question_id}-${escolhida}`);
      return;
    }
    responses.push({ question_id: q.question_id, selected_option: escolhida });

    // Portas (bruto)
    portasRaw[codigo.primary_gate] += codigo.primary_gate_weight;
    if (codigo.secondary_gate && codigo.secondary_gate_weight)
      portasRaw[codigo.secondary_gate] += codigo.secondary_gate_weight;

    // Matriz 5×3 — apenas experiência principal × porta principal
    const cell = chaveCelula(codigo.primary_experience, codigo.primary_gate);
    matrizRaw[cell] = (matrizRaw[cell] ?? 0) + codigo.primary_gate_weight;
    if (codigo.primary_gate_weight > 0) presencaContagem[codigo.primary_experience] += 1;
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

  // ── Matriz normalizada (teto operacional de 8 pontos por célula)
  const matriz: Record<string, ResultadoCelula> = {};
  EXPERIENCIAS.forEach((e) =>
    PORTAS.forEach((p) => {
      const key = chaveCelula(e.id, p.id);
      const raw = Math.min(matrizRaw[key] ?? 0, MAX_CELULA);
      if ((matrizRaw[key] ?? 0) > MAX_CELULA) erros.push(`Célula ${key} acima do máximo operacional`);
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

  if (answered < TOTAL_QUESTOES) erros.push("Questionário incompleto");

  return {
    metadata: {
      version: VERSION,
      assessment_id: assessmentId,
      created_at: new Date().toISOString(),
      total_questions: TOTAL_QUESTOES,
      answered,
    },
    responses,
    portas,
    experiencias,
    matriz,
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
    erros,
  };
}
