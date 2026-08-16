import { EXPERIENCIAS, NOME_EXPERIENCIA, NOME_PORTA, PORTAS } from "@/data/mapa-v41";
import { ROTULO_NIVEL, chaveCelula, type MapaResultado } from "@/lib/mapa-engine";

export function MatrizHeatmap({ resultado }: { resultado: MapaResultado }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-separate border-spacing-1 text-sm">
        <thead>
          <tr>
            <th className="w-28 text-left font-normal text-muted-foreground">Experiência</th>
            {PORTAS.map((p) => (
              <th key={p.id} className="font-heading text-base font-normal text-foreground">
                {NOME_PORTA[p.id]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EXPERIENCIAS.map((e) => (
            <tr key={e.id}>
              <th className="text-left font-heading text-base font-normal text-foreground">
                {NOME_EXPERIENCIA[e.id]}
              </th>
              {PORTAS.map((p) => {
                const c = resultado.matriz[chaveCelula(e.id, p.id)]!;
                return (
                  <td key={p.id} className="p-0">
                    <div
                      className="rounded-xl border border-border/60 px-2 py-3 text-center"
                      style={{ backgroundColor: `color-mix(in oklab, var(--color-primary) ${c.percent}%, var(--color-card))` }}
                      title={`${NOME_EXPERIENCIA[e.id]} × ${NOME_PORTA[p.id]} — ${c.raw}/8 · ${ROTULO_NIVEL[c.level]}`}
                    >
                      <span className="font-heading text-lg text-foreground">{c.percent}%</span>
                      <span className="block text-xs text-muted-foreground">
                        {c.raw}/8 · {ROTULO_NIVEL[c.level]}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
