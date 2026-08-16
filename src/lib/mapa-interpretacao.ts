/**
 * Camada de interpretação — separada do motor.
 * Transforma o objeto estruturado em linguagem compreensível,
 * sem inferir nada que não esteja sustentado pelos dados.
 */

import { NOME_EXPERIENCIA, NOME_PORTA, type ExperienciaId, type PortaId } from "@/data/mapa-v41";
import { ROTULO_CONVERGENCIA, type MapaResultado } from "@/lib/mapa-engine";

export const LEITURA_PORTA: Record<PortaId, string> = {
  MED: "A leitura indica organização em torno da antecipação: proteger o vínculo, evitar perda e prever o que pode dar errado.",
  CV: "A leitura indica organização em torno da responsabilização de si: revisar a própria conduta, o próprio valor e a própria exposição.",
  RAI: "A leitura indica organização em torno do confronto: marcar limite, responder à pressão e recuperar posição.",
};

export const LEITURA_EXPERIENCIA: Record<ExperienciaId, string> = {
  REJ: "Situações em que a aceitação está em jogo mobilizam mais recursos internos do que as demais.",
  ABA: "Situações que sinalizam afastamento ou perda de presença mobilizam mais recursos internos do que as demais.",
  MAN: "Situações em que a própria vontade é pressionada mobilizam mais recursos internos do que as demais.",
  HUM: "Situações de exposição diante de outros mobilizam mais recursos internos do que as demais.",
  TRA: "Situações que envolvem confiança quebrada mobilizam mais recursos internos do que as demais.",
};

export function tituloResultado(r: MapaResultado): string {
  const { dominant_gate } = r.classificacao;
  const exp = r.ire.dominant_experience;
  if (exp && dominant_gate) return `${NOME_EXPERIENCIA[exp]} pela porta ${NOME_PORTA[dominant_gate]}`;
  if (dominant_gate) return `Porta predominante: ${NOME_PORTA[dominant_gate]}`;
  if (exp) return `Experiência predominante: ${NOME_EXPERIENCIA[exp]}`;
  return "Perfil distribuído";
}

export function leituraEstrutural(r: MapaResultado): string {
  const { convergence, convergence_cell, dominant_gate, secondary_gate } = r.classificacao;
  const exp = r.ire.dominant_experience;

  if (convergence === "DISTRIBUTED" || !exp || !dominant_gate) {
    return "Os dados não sustentam uma predominância clara. Nenhuma porta supera a segunda em pelo menos 10 pontos percentuais, ou as experiências aparecem muito próximas entre si. Neste caso o motor preserva a incerteza: o padrão está distribuído e a leitura deve ser feita célula a célula.";
  }

  const celula = convergence_cell
    ? `${NOME_EXPERIENCIA[exp]} × ${NOME_PORTA[dominant_gate]} = ${convergence_cell.percent}%`
    : "";

  if (convergence === "STRONG")
    return `${ROTULO_CONVERGENCIA[convergence]}: a experiência dominante, a porta dominante e a célula correspondente (${celula}) apontam na mesma direção.`;
  if (convergence === "MODERATE")
    return `${ROTULO_CONVERGENCIA[convergence]}: experiência e porta dominantes estão presentes, mas a célula correspondente (${celula}) mostra associação apenas moderada.`;
  return `${ROTULO_CONVERGENCIA[convergence]}: apesar de ${NOME_EXPERIENCIA[exp]} e ${NOME_PORTA[dominant_gate]} aparecerem como dominantes, a célula correspondente (${celula}) é baixa. A associação entre as duas não se confirma nos dados${secondary_gate ? `, e a porta ${NOME_PORTA[secondary_gate]} permanece relevante` : ""}.`;
}

export function leituraPerfil(r: MapaResultado): string {
  const { profile_type, multiple_elevated_gates } = r.classificacao;
  const exps = r.ire.multiple_dominant_experiences;
  if (profile_type === "HYBRID")
    return `Perfil híbrido: ressonância elevada compartilhada entre ${exps.map((e) => NOME_EXPERIENCIA[e]).join(" e ")}${
      multiple_elevated_gates.length > 1
        ? `, com mais de uma porta ativa (${multiple_elevated_gates.map((p) => NOME_PORTA[p]).join(" e ")})`
        : ""
    }. O resultado não deve ser reduzido a uma única categoria.`;
  if (profile_type === "DISTRIBUTED")
    return "Perfil distribuído: os dados não indicam concentração suficiente para eleger uma experiência ou uma porta única.";
  return "Perfil concentrado: uma experiência e uma porta se destacam com margem suficiente sobre as demais.";
}

export const AVISO =
  "Este material é descritivo e estrutural. Não constitui diagnóstico psicológico, psiquiátrico ou médico.";
