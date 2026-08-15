import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Download, RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { DIMENSOES, PERGUNTAS, RAIZES, type RaizId } from "@/data/matriz";
import { AUDITORIA_POR_CODIGO, ROTULO_REDUNDANCIA, type NivelRedundancia } from "@/data/auditoria";
import { useMatrizConfig, type MatrizConfig } from "@/lib/matriz-config";

export const Route = createFileRoute("/calibrar")({
  head: () => ({
    meta: [
      { title: "Calibrar pesos e regras | Matriz de Padrões Emocionais" },
      {
        name: "description",
        content:
          "Painel para ajustar pesos das alternativas, emoção raiz de cada opção e as regras de cálculo do score da matriz.",
      },
      { property: "og:title", content: "Calibrar pesos e regras da Matriz" },
      {
        property: "og:description",
        content: "Ajuste pesos, portas de emoção raiz e limites de faixa para alinhar a devolutiva à sua metodologia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Calibrar,
});

const CORES_REDUNDANCIA: Record<NivelRedundancia, string> = {
  baixa: "bg-primary/15 text-primary",
  moderada: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  atencao: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  alta: "bg-destructive/15 text-destructive",
};

function Calibrar() {
  const { config, atualizar, restaurar } = useMatrizConfig();
  const [salvo, setSalvo] = useState(false);

  const set = (fn: (c: MatrizConfig) => MatrizConfig) => {
    atualizar(fn(structuredClone(config)));
    setSalvo(true);
    window.setTimeout(() => setSalvo(false), 1600);
  };

  const somaPorDimensao = useMemo(
    () =>
      DIMENSOES.map((d) => {
        const perguntas = PERGUNTAS.filter(
          (p) => p.dimensao === d.id && config.ativas[p.id] !== false,
        );
        const maxBloco = perguntas.length * config.regras.pesoMaximo;
        return { ...d, perguntas: perguntas.length, maxBloco };
      }),
    [config],
  );

  const exportar = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "matriz-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao mapeamento
          </Link>
          <div className="flex items-center gap-2">
            {salvo && (
              <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                <Save className="h-4 w-4" /> Salvo
              </span>
            )}
            <Button variant="outline" size="sm" className="rounded-full" onClick={exportar}>
              <Download className="mr-1.5 h-4 w-4" />
              Exportar JSON
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={restaurar}>
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Restaurar padrão
            </Button>
          </div>
        </div>

        <header className="mt-8">
          <div className="flex items-center gap-2 text-sm text-primary">
            <SlidersHorizontal className="h-4 w-4" />
            Calibração da metodologia
          </div>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-foreground">
            Pesos e regras de cálculo
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Ajuste o peso de cada alternativa, a porta de emoção raiz que ela ativa e as regras de
            normalização. As alterações são aplicadas na devolutiva imediatamente e ficam salvas
            neste navegador.
          </p>
        </header>

        {/* ---------------- REGRAS ---------------- */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-heading text-2xl text-card-foreground">Regras de cálculo</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-foreground">Peso máximo por resposta</span>
              <Input
                type="number"
                min={1}
                max={10}
                value={config.regras.pesoMaximo}
                onChange={(e) =>
                  set((c) => {
                    c.regras.pesoMaximo = Math.max(1, Number(e.target.value) || 1);
                    return c;
                  })
                }
                className="mt-2"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                Define o teto usado para normalizar cada bloco em 0–100%.
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Base de normalização</span>
              <select
                value={config.regras.baseNormalizacao}
                onChange={(e) =>
                  set((c) => {
                    c.regras.baseNormalizacao = e.target.value as "todas" | "respondidas";
                    return c;
                  })
                }
                className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="todas">Todas as perguntas ativas do bloco</option>
                <option value="respondidas">Apenas as perguntas respondidas</option>
              </select>
              <span className="mt-1 block text-xs text-muted-foreground">
                "Respondidas" evita penalizar blocos incompletos.
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">
                Limite da faixa baixa (%) — até {config.regras.limiteBaixo}
              </span>
              <Input
                type="number"
                min={1}
                max={98}
                value={config.regras.limiteBaixo}
                onChange={(e) =>
                  set((c) => {
                    c.regras.limiteBaixo = Math.min(98, Math.max(1, Number(e.target.value) || 1));
                    return c;
                  })
                }
                className="mt-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">
                Limite da faixa média (%) — até {config.regras.limiteMedio}
              </span>
              <Input
                type="number"
                min={2}
                max={99}
                value={config.regras.limiteMedio}
                onChange={(e) =>
                  set((c) => {
                    c.regras.limiteMedio = Math.min(99, Math.max(2, Number(e.target.value) || 2));
                    return c;
                  })
                }
                className="mt-2"
              />
            </label>
          </div>

          <h3 className="mt-8 font-heading text-lg text-card-foreground">
            Ponderação das emoções raiz
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Multiplicador aplicado aos pontos de cada porta antes de calcular a distribuição.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {RAIZES.map((r) => (
              <label key={r.id} className="block">
                <span className="text-sm font-medium text-foreground">{r.nome}</span>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  max={3}
                  value={config.regras.ponderacaoRaiz[r.id]}
                  onChange={(e) =>
                    set((c) => {
                      c.regras.ponderacaoRaiz[r.id] = Math.max(0, Number(e.target.value) || 0);
                      return c;
                    })
                  }
                  className="mt-2"
                />
              </label>
            ))}
          </div>
        </section>

        {/* ---------------- RESUMO DOS BLOCOS ---------------- */}
        <section className="mt-6 grid gap-3 sm:grid-cols-5">
          {somaPorDimensao.map((d) => (
            <div key={d.id} className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="font-heading text-base text-card-foreground">{d.nome}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.perguntas} perguntas ativas · máx. {d.maxBloco} pts
              </p>
            </div>
          ))}
        </section>

        {/* ---------------- PERGUNTAS ---------------- */}
        <h2 className="mt-12 font-heading text-2xl text-foreground">Pesos por alternativa</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          O selo indica a redundância estrutural apontada na auditoria semântica do Mapa 3 Portas
          V3 — use-o para priorizar quais questões recalibrar ou desativar.
        </p>

        <div className="mt-6 space-y-5">
          {PERGUNTAS.map((p) => {
            const auditoria = AUDITORIA_POR_CODIGO[p.codigo];
            const ativa = config.ativas[p.id] !== false;
            return (
              <article
                key={p.id}
                className={`rounded-3xl border p-5 transition-opacity sm:p-6 ${
                  ativa ? "border-border bg-card" : "border-dashed border-border bg-card/50 opacity-60"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-wide text-primary uppercase">
                      {p.codigo} · {DIMENSOES.find((d) => d.id === p.dimensao)?.nome} · {p.titulo}
                    </p>
                    <h3 className="mt-2 max-w-2xl font-heading text-lg leading-snug text-card-foreground">
                      {p.texto}
                    </h3>
                    {auditoria && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${CORES_REDUNDANCIA[auditoria.redundancia]}`}
                        >
                          {ROTULO_REDUNDANCIA[auditoria.redundancia]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Portas: {auditoria.portas} · Estrutura: {auditoria.estrutura}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Switch
                      checked={ativa}
                      onCheckedChange={(v) =>
                        set((c) => {
                          c.ativas[p.id] = v;
                          return c;
                        })
                      }
                    />
                    {ativa ? "No cálculo" : "Fora"}
                  </label>
                </div>

                <div className="mt-5 space-y-2">
                  {p.opcoes.map((o, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3"
                    >
                      <p className="min-w-[220px] flex-1 text-sm leading-relaxed text-foreground">
                        {o.texto}
                      </p>
                      <select
                        aria-label={`Emoção raiz da alternativa ${i + 1} de ${p.codigo}`}
                        value={config.raizes[p.id]?.[i] ?? o.raiz}
                        onChange={(e) =>
                          set((c) => {
                            c.raizes[p.id]![i] = e.target.value as RaizId;
                            return c;
                          })
                        }
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                      >
                        {RAIZES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nome}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <input
                          aria-label={`Peso da alternativa ${i + 1} de ${p.codigo}`}
                          type="range"
                          min={0}
                          max={config.regras.pesoMaximo}
                          step={1}
                          value={config.pesos[p.id]?.[i] ?? o.peso}
                          onChange={(e) =>
                            set((c) => {
                              c.pesos[p.id]![i] = Number(e.target.value);
                              return c;
                            })
                          }
                          className="w-28 accent-[var(--color-primary)]"
                        />
                        <span className="w-6 text-right text-sm font-medium text-foreground tabular-nums">
                          {config.pesos[p.id]?.[i] ?? o.peso}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild className="rounded-full px-7">
            <Link to="/">Testar a devolutiva</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
