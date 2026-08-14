import type { ResultadoDimensao } from "@/lib/matriz-score";

export function BarraDimensao({ dimensao }: { dimensao: ResultadoDimensao }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-heading text-lg text-card-foreground">{dimensao.nome}</h4>
        <span className="text-sm text-muted-foreground">
          {dimensao.faixa.rotulo} · {dimensao.percentual}%
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-leaf)] transition-all duration-700"
          style={{ width: `${dimensao.percentual}%` }}
        />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{dimensao.faixa.leitura}</p>
      <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm italic leading-relaxed text-foreground/80">
        {dimensao.faixa.caminho}
      </p>
    </div>
  );
}
