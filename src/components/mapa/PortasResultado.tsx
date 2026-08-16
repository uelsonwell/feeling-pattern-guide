import { NOME_PORTA, PORTAS } from "@/data/mapa-v41";
import { ROTULO_NIVEL, type MapaResultado } from "@/lib/mapa-engine";
import { LEITURA_PORTA } from "@/lib/mapa-interpretacao";

export function PortasResultado({ resultado }: { resultado: MapaResultado }) {
  return (
    <div className="space-y-4">
      {PORTAS.map((p) => {
        const dado = resultado.portas[p.id];
        const dominante = resultado.classificacao.dominant_gate === p.id;
        return (
          <div
            key={p.id}
            className={`rounded-2xl border p-5 shadow-[var(--shadow-soft)] ${
              dominante ? "border-primary/50 bg-accent/40" : "border-border bg-card"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-heading text-lg text-card-foreground">
                {NOME_PORTA[p.id]}
                {dominante && (
                  <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                    porta dominante
                  </span>
                )}
              </h4>
              <span className="text-sm text-muted-foreground">
                {ROTULO_NIVEL[dado.level]} · {dado.percent}% · bruto {dado.raw}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-[image:var(--gradient-leaf)] transition-all duration-700"
                style={{ width: `${dado.percent}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {dado.level === "LOW" ? p.descricao : LEITURA_PORTA[p.id]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
