import {
  DIMENSOES,
  FAIXAS,
  LEITURA_GERAL,
  PERGUNTAS,
  PESO_MAXIMO,
  type DimensaoId,
  type Faixa,
} from "@/data/matriz";

export type Respostas = Record<string, number>; // perguntaId -> índice da opção

export type ResultadoDimensao = {
  id: DimensaoId;
  nome: string;
  descricao: string;
  percentual: number;
  faixa: Faixa;
};

export type Resultado = {
  dimensoes: ResultadoDimensao[];
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

  const geral = Math.round(
    dimensoes.reduce((acc, d) => acc + d.percentual, 0) / dimensoes.length,
  );

  const ordenadas = [...dimensoes].sort((a, b) => b.percentual - a.percentual);

  return {
    dimensoes,
    geral,
    leituraGeral: faixaPara(LEITURA_GERAL, geral),
    destaques: ordenadas.slice(0, 2),
    recurso: ordenadas[ordenadas.length - 1],
  };
}
