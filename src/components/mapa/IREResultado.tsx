import { EXPERIENCIAS, NOME_EXPERIENCIA } from "@/data/mapa-v41";
import { ROTULO_NIVEL, type MapaResultado } from "@/lib/mapa-engine";
import { LEITURA_EXPERIENCIA } from "@/lib/mapa-interpretacao";

export function IREResultado({ resultado }: { resultado: MapaResultado }) {
  return (
    <div className="space-y-3">
      {EXPERIENCIAS.map((e) => {
        const d = resultado.experiencias[e.id];
        const dominante = resultado.ire.dominant_experience === e.id;
        return (
          <div
            key={e.id}
            className={`rounded-2xl border p-5 ${
              dominante ? "border-primary/50 bg-accent/40" : "border-border bg-card"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-heading text-lg text-card-foreground">{NOME_EXPERIENCIA[e.id]}</h4>
              <span className="text-sm text-muted-foreground">
                Ressonância {d.resonance}% ({ROTULO_NIVEL[d.level]}) · Presença {d.presence}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-[image:var(--gradient-leaf)] transition-all duration-700"
                style={{ width: `${d.resonance}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {d.level === "LOW" ? e.descricao : LEITURA_EXPERIENCIA[e.id]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
