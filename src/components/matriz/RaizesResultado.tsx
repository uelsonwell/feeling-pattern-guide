import type { ResultadoRaiz } from "@/lib/matriz-score";

export function RaizesResultado({ raizes }: { raizes: ResultadoRaiz[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {raizes.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-heading text-lg text-card-foreground">{r.nome}</h4>
            <span className="text-sm text-muted-foreground">{r.percentual}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-[image:var(--gradient-leaf)] transition-all duration-700"
              style={{ width: `${r.percentual}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.descricao}</p>
        </div>
      ))}
    </div>
  );
}
