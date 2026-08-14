import {
  DIMENSOES,
  FAIXAS,
  LEITURA_GERAL,
  PERGUNTAS,
  PESO_MAXIMO,
  RAIZES,
  type DimensaoId,
  type Faixa,
  type Raiz,
  type RaizId,
} from "@/data/matriz";

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

const faixaPara = (faixas: Faixa[], valor: number): Faixa =>
  (faixas.find((f) => valor <= f.limite) ?? faixas[faixas.length - 1]) as Faixa;

export function calcularResultado(respostas: Respostas): Resultado {
  const dimensoes = DIMENSOES.map((dim) => {
    const perguntas = PERGUNTAS.filter((p) => p.dimensao === dim.id);
    const max = perguntas.length * PESO_MAXIMO;
    const soma = perguntas.reduce((acc, p) => {
      const idx = respostas[p.id];
      return acc + (idx == null ? 0 : (p.opcoes[idx]?.peso ?? 0));
    }, 0);
    const percentual = max === 0 ? 0 : Math.round((soma / max) * 100);
    return {
      id: dim.id,
      nome: dim.nome,
      descricao: dim.descricao,
      percentual,
      faixa: faixaPara(FAIXAS[dim.id], percentual),
    };
  });

  // Distribuição entre as emoções raiz
  const pontosRaiz: Record<RaizId, number> = { medo: 0, culpa: 0, raiva: 0 };
  PERGUNTAS.forEach((p) => {
    const idx = respostas[p.id];
    if (idx == null) return;
    const opcao = p.opcoes[idx];
    if (!opcao) return;
    pontosRaiz[opcao.raiz] += opcao.peso;
  });
  const totalRaiz = RAIZES.reduce((acc, r) => acc + pontosRaiz[r.id], 0);
  const raizes: ResultadoRaiz[] = RAIZES.map((r) => ({
    ...r,
    pontos: pontosRaiz[r.id],
    percentual: totalRaiz === 0 ? 0 : Math.round((pontosRaiz[r.id] / totalRaiz) * 100),
  }));

  const geral = Math.round(
    dimensoes.reduce((acc, d) => acc + d.percentual, 0) / dimensoes.length,
  );

  const ordenadas = [...dimensoes].sort((a, b) => b.percentual - a.percentual);
  const raizesOrdenadas = [...raizes].sort((a, b) => b.percentual - a.percentual);

  return {
    dimensoes,
    raizes,
    raizPrincipal: raizesOrdenadas[0] as ResultadoRaiz,
    geral,
    leituraGeral: faixaPara(LEITURA_GERAL, geral),
    destaques: ordenadas.slice(0, 2),
    recurso: ordenadas[ordenadas.length - 1] as ResultadoDimensao,
  };
}
