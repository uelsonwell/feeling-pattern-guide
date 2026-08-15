/**
 * Auditoria semântica — Mapa 3 Portas V3
 * Redundância estrutural observada por questão.
 */

export type NivelRedundancia = "baixa" | "moderada" | "atencao" | "alta";

export type AuditoriaItem = {
  codigo: string;
  portas: string;
  estrutura: string;
  redundancia: NivelRedundancia;
};

export const ROTULO_REDUNDANCIA: Record<NivelRedundancia, string> = {
  baixa: "Baixa redundância",
  moderada: "Redundância moderada",
  atencao: "Atenção",
  alta: "Alta redundância",
};

export const AUDITORIA: AuditoriaItem[] = [
  { codigo: "R01", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / REJ2", redundancia: "baixa" },
  { codigo: "R02", portas: "MED / CV / RAI", estrutura: "CV1-sec / CV2 / RAI2 / REJ2", redundancia: "baixa" },
  { codigo: "R03", portas: "CV / RAI", estrutura: "CV2 / HUM2+REJ1+CV2 / RAI2 / REJ2", redundancia: "baixa" },
  { codigo: "R04", portas: "MED-sec / CV / RAI", estrutura: "CV2 / REJ2+MED1 / RAI2 / CV1-sec", redundancia: "baixa" },
  { codigo: "A01", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / ABA2", redundancia: "baixa" },
  { codigo: "A02", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / ABA2+MED1", redundancia: "alta" },
  { codigo: "A03", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / ABA2+MED1", redundancia: "alta" },
  { codigo: "A04", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / ABA2+MED1", redundancia: "alta" },
  { codigo: "M01", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / MAN2", redundancia: "moderada" },
  { codigo: "M02", portas: "MED / CV / RAI", estrutura: "MED2 / CV1 / RAI2 / MAN2", redundancia: "moderada" },
  { codigo: "M03", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / MAN2", redundancia: "alta" },
  { codigo: "M04", portas: "MED / CV / RAI", estrutura: "MED1 / CV2 / RAI2 / MAN2", redundancia: "moderada" },
  { codigo: "H01", portas: "MED / CV / RAI", estrutura: "MED1 / CV2 / RAI2 / HUM2", redundancia: "alta" },
  { codigo: "H02", portas: "CV / RAI", estrutura: "CV2 / CV2 / RAI2 / HUM2", redundancia: "alta" },
  { codigo: "H03", portas: "MED / CV / RAI", estrutura: "MED1 / CV2 / RAI2 / HUM2", redundancia: "alta" },
  { codigo: "H04", portas: "CV / RAI", estrutura: "CV2 / CV2 / RAI2 / HUM2", redundancia: "alta" },
  { codigo: "T01", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / TRA2", redundancia: "alta" },
  { codigo: "T02", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / TRA2", redundancia: "alta" },
  { codigo: "T03", portas: "CV / RAI", estrutura: "CV1 / CV2 / RAI2 / TRA2", redundancia: "moderada" },
  { codigo: "T04", portas: "MED / CV / RAI", estrutura: "MED2 / CV2 / RAI2 / TRA2", redundancia: "alta" },
];

export const AUDITORIA_POR_CODIGO: Record<string, AuditoriaItem> = Object.fromEntries(
  AUDITORIA.map((a) => [a.codigo, a]),
);
