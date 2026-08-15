import { useCallback, useEffect, useState } from "react";
import { PERGUNTAS, PESO_MAXIMO, type RaizId } from "@/data/matriz";

export type Regras = {
  pesoMaximo: number;
  /** "todas" divide pelo total de perguntas do bloco; "respondidas" só pelas respondidas. */
  baseNormalizacao: "todas" | "respondidas";
  limiteBaixo: number;
  limiteMedio: number;
  ponderacaoRaiz: Record<RaizId, number>;
};

export type MatrizConfig = {
  pesos: Record<string, number[]>;
  raizes: Record<string, RaizId[]>;
  ativas: Record<string, boolean>;
  regras: Regras;
};

export const STORAGE_KEY = "matriz-config-v1";

export function configPadrao(): MatrizConfig {
  const pesos: Record<string, number[]> = {};
  const raizes: Record<string, RaizId[]> = {};
  const ativas: Record<string, boolean> = {};
  PERGUNTAS.forEach((p) => {
    pesos[p.id] = p.opcoes.map((o) => o.peso);
    raizes[p.id] = p.opcoes.map((o) => o.raiz);
    ativas[p.id] = true;
  });
  return {
    pesos,
    raizes,
    ativas,
    regras: {
      pesoMaximo: PESO_MAXIMO,
      baseNormalizacao: "todas",
      limiteBaixo: 33,
      limiteMedio: 66,
      ponderacaoRaiz: { medo: 1, culpa: 1, raiva: 1 },
    },
  };
}

function mesclar(bruto: unknown): MatrizConfig {
  const base = configPadrao();
  if (!bruto || typeof bruto !== "object") return base;
  const c = bruto as Partial<MatrizConfig>;
  const cfg = configPadrao();
  PERGUNTAS.forEach((p) => {
    const pesos = c.pesos?.[p.id];
    if (Array.isArray(pesos) && pesos.length === p.opcoes.length) cfg.pesos[p.id] = pesos.map(Number);
    const raizes = c.raizes?.[p.id];
    if (Array.isArray(raizes) && raizes.length === p.opcoes.length)
      cfg.raizes[p.id] = raizes as RaizId[];
    if (typeof c.ativas?.[p.id] === "boolean") cfg.ativas[p.id] = c.ativas[p.id] as boolean;
  });
  cfg.regras = { ...cfg.regras, ...(c.regras ?? {}) };
  cfg.regras.ponderacaoRaiz = {
    ...base.regras.ponderacaoRaiz,
    ...(c.regras?.ponderacaoRaiz ?? {}),
  };
  return cfg;
}

export function carregarConfig(): MatrizConfig {
  if (typeof window === "undefined") return configPadrao();
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    return bruto ? mesclar(JSON.parse(bruto)) : configPadrao();
  } catch {
    return configPadrao();
  }
}

export function salvarConfig(cfg: MatrizConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  window.dispatchEvent(new CustomEvent("matriz-config-change"));
}

export function useMatrizConfig() {
  const [config, setConfig] = useState<MatrizConfig>(() => configPadrao());

  useEffect(() => {
    setConfig(carregarConfig());
    const onChange = () => setConfig(carregarConfig());
    window.addEventListener("matriz-config-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("matriz-config-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const atualizar = useCallback((next: MatrizConfig) => {
    setConfig(next);
    salvarConfig(next);
  }, []);

  const restaurar = useCallback(() => {
    const padrao = configPadrao();
    setConfig(padrao);
    salvarConfig(padrao);
  }, []);

  return { config, atualizar, restaurar };
}
