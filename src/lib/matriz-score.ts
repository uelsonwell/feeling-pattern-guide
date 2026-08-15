import {
  DIMENSOES,
  FAIXAS,
  LEITURA_GERAL,
  PERGUNTAS,
  RAIZES,
  type DimensaoId,
  type Faixa,
  type Raiz,
  type RaizId,
} from "@/data/matriz";
import { configPadrao, type MatrizConfig } from "@/lib/matriz-config";

export type Respostas = Record<string, number>; // perguntaId -> índice da opção

export type ResultadoDimensao = {
  id: DimensaoId;
  nome: string;
  descricao: string;
  percentual: number;
  faixa: Faixa;
};

export type ResultadoRaiz = Raiz & {
  pontos: number;
  percentual: number; // participação relativa entre as três raízes
};

export type Resultado = {
  dimensoes: ResultadoDimensao[];
  raizes: ResultadoRaiz[];
  raizPrincipal: ResultadoRaiz;
  geral: number;
  leituraGeral: Faixa;
  destaques: ResultadoDimensao[];
  recurso: ResultadoDimensao;
};

/** Escolhe a faixa (baixa / média / alta) usando os limites configuráveis. */
const faixaPara = (faixas: Faixa[], valor: number, limiteBaixo: number, limiteMedio: number): Faixa => {
  const indice = valor <= limiteBaixo ? 0 : valor <= limiteMedio ? 1 : 2;
  return (faixas[Math.min(indice, faixas.length - 1)] ?? faixas[faixas.length - 1]) as Faixa;
};

export function calcularResultado(
  respostas: Respostas,
  config: MatrizConfig = configPadrao(),
): Resultado {
  const { regras } = config;
  const pesoDe = (perguntaId: string, indice: number) =>
    config.pesos[perguntaId]?.[indice] ?? PERGUNTAS.find((p) => p.id === perguntaId)?.opcoes[indice]?.peso ?? 0;
  const raizDe = (perguntaId: string, indice: number): RaizId =>
    config.raizes[perguntaId]?.[indice] ??
    (PERGUNTAS.find((p) => p.id === perguntaId)?.opcoes[indice]?.raiz as RaizId);

  const perguntasAtivas = PERGUNTAS.filter((p) => config.ativas[p.id] !== false);

  const dimensoes = DIMENSOES.map((dim) => {
    const perguntas = perguntasAtivas.filter((p) => p.dimensao === dim.id);
    const respondidas = perguntas.filter((p) => respostas[p.id] != null);
    const contadas = regras.baseNormalizacao === "respondidas" ? respondidas : perguntas;
    const max = contadas.length * regras.pesoMaximo;
    const soma = respondidas.reduce((acc, p) => acc + pesoDe(p.id, respostas[p.id] as number), 0);
    const percentual = max === 0 ? 0 : Math.min(100, Math.round((soma / max) * 100));
    return {
      id: dim.id,
      nome: dim.nome,
      descricao: dim.descricao,
      percentual,
      faixa: faixaPara(FAIXAS[dim.id], percentual, regras.limiteBaixo, regras.limiteMedio),
    };
  });

  // Distribuição entre as emoções raiz
  const pontosRaiz: Record<RaizId, number> = { medo: 0, culpa: 0, raiva: 0 };
  perguntasAtivas.forEach((p) => {
    const idx = respostas[p.id];
    if (idx == null) return;
    const raiz = raizDe(p.id, idx);
    if (!raiz) return;
    pontosRaiz[raiz] += pesoDe(p.id, idx) * (regras.ponderacaoRaiz[raiz] ?? 1);
  });
  const totalRaiz = RAIZES.reduce((acc, r) => acc + pontosRaiz[r.id], 0);
  const raizes: ResultadoRaiz[] = RAIZES.map((r) => ({
    ...r,
    pontos: Math.round(pontosRaiz[r.id] * 10) / 10,
    percentual: totalRaiz === 0 ? 0 : Math.round((pontosRaiz[r.id] / totalRaiz) * 100),
  }));

  const geral = Math.round(
    dimensoes.reduce((acc, d) => acc + d.percentual, 0) / (dimensoes.length || 1),
  );

  const ordenadas = [...dimensoes].sort((a, b) => b.percentual - a.percentual);
  const raizesOrdenadas = [...raizes].sort((a, b) => b.percentual - a.percentual);

  return {
    dimensoes,
    raizes,
    raizPrincipal: raizesOrdenadas[0] as ResultadoRaiz,
    geral,
    leituraGeral: faixaPara(LEITURA_GERAL, geral, regras.limiteBaixo, regras.limiteMedio),
    destaques: ordenadas.slice(0, 2),
    recurso: ordenadas[ordenadas.length - 1] as ResultadoDimensao,
  };
}
