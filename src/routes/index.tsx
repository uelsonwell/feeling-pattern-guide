import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Leaf, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DIMENSOES, PERGUNTAS, RAIZES } from "@/data/matriz";
import { calcularResultado, type Respostas } from "@/lib/matriz-score";
import { RadarResultado } from "@/components/matriz/RadarResultado";
import { BarraDimensao } from "@/components/matriz/BarraDimensao";
import { RaizesResultado } from "@/components/matriz/RaizesResultado";
import { useMatrizConfig } from "@/lib/matriz-config";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sessão de Mapeamento Emocional | Matriz de Padrões" },
      {
        name: "description",
        content:
          "Questionário de mapeamento de comportamento e padrões emocionais para adultos 35+ e casais. Receba uma devolutiva em cinco dimensões.",
      },
      { property: "og:title", content: "Sessão de Mapeamento Emocional" },
      {
        property: "og:description",
        content:
          "Responda 15 perguntas e receba um gráfico com a leitura dos seus padrões emocionais em cinco dimensões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Etapa = "intro" | "quiz" | "resultado";

function Index() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({});
  const { config } = useMatrizConfig();

  const pergunta = PERGUNTAS[atual]!;
  const total = PERGUNTAS.length;
  const respondidas = Object.keys(respostas).length;
  const resultado = useMemo(() => calcularResultado(respostas, config), [respostas, config]);

  const responder = (indice: number) => {
    setRespostas((r) => ({ ...r, [pergunta.id]: indice }));
    window.setTimeout(() => {
      if (atual < total - 1) setAtual((a) => a + 1);
      else setEtapa("resultado");
    }, 220);
  };

  const reiniciar = () => {
    setRespostas({});
    setAtual(0);
    setEtapa("intro");
  };

  return (
    <main className="min-h-screen px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center gap-2 text-sm text-muted-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          <span className="tracking-wide uppercase">Sessão de Mapeamento Emocional</span>
          <Link
            to="/mapa"
            className="ml-auto inline-flex items-center gap-1.5 hover:text-foreground"
          >
            MAPA 3 Portas V4.1
          </Link>
          <Link to="/calibrar" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Calibrar
          </Link>

        </header>

        {etapa === "intro" && (
          <section className="mt-10">
            <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
              Matriz de comportamento e padrões emocionais
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Um mapeamento para quem já viveu decepções e frustrações e quer entender quais padrões
              ainda estão comandando as escolhas — sozinho(a) ou em casal.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {DIMENSOES.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)]"
                >
                  <h3 className="font-heading text-lg text-card-foreground">{d.nome}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {d.descricao}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 font-heading text-2xl text-foreground">Emoções raiz</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cada resposta também revela qual emoção raiz comanda sua reação.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {RAIZES.map((r) => (
                <div key={r.id} className="rounded-2xl border border-primary/30 bg-accent/40 p-5">
                  <h3 className="font-heading text-lg text-accent-foreground">{r.nome}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{r.descricao}</p>
                </div>
              ))}
            </div>


            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full px-7" onClick={() => setEtapa("quiz")}>
                Iniciar mapeamento
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {total} perguntas · cerca de 8 minutos · nada é armazenado
              </span>
            </div>
          </section>
        )}

        {etapa === "quiz" && (
          <section className="mt-10">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Pergunta {atual + 1} de {total}
              </span>
              <span>{Math.round((respondidas / total) * 100)}% concluído</span>
            </div>
            <Progress value={(respondidas / total) * 100} className="mt-3 h-1.5" />

            <div className="mt-9 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <p className="text-xs tracking-wide text-primary uppercase">
                {pergunta.codigo} · {DIMENSOES.find((d) => d.id === pergunta.dimensao)?.nome} ·{" "}
                {pergunta.titulo}
              </p>

              <h2 className="mt-3 font-heading text-2xl leading-snug text-card-foreground">
                {pergunta.texto}
              </h2>

              <div className="mt-7 space-y-3">
                {pergunta.opcoes.map((opcao, i) => {
                  const selecionada = respostas[pergunta.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => responder(i)}
                      className={`w-full rounded-2xl border px-5 py-4 text-left text-[15px] leading-relaxed transition-all ${
                        selecionada
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background/60 text-foreground hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      {opcao.texto}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                className="rounded-full"
                disabled={atual === 0}
                onClick={() => setAtual((a) => Math.max(0, a - 1))}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
              {respondidas === total && (
                <Button className="rounded-full" onClick={() => setEtapa("resultado")}>
                  Ver devolutiva
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </section>
        )}

        {etapa === "resultado" && (
          <section className="mt-10">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Sua devolutiva
            </div>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-foreground">
              {resultado.leituraGeral.rotulo}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {resultado.leituraGeral.leitura}
            </p>

            <div className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
              <RadarResultado dimensoes={resultado.dimensoes} />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Quanto mais para fora o traçado, mais ativo está o padrão naquela dimensão.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/30 bg-accent/50 p-5">
                <h3 className="font-heading text-lg text-accent-foreground">Onde focar primeiro</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {resultado.destaques.map((d) => d.nome).join(" e ")} — são as dimensões com maior
                  ativação hoje e onde a sessão gera mais movimento.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-lg text-card-foreground">Seu recurso disponível</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {resultado.recurso.nome} é sua área mais preservada. Ela pode ser usada como apoio
                  no trabalho das demais.
                </p>
              </div>
            </div>

            <h2 className="mt-12 font-heading text-2xl text-foreground">Sua emoção raiz</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              <strong className="text-foreground">{resultado.raizPrincipal.nome}</strong>{" "}
              ({resultado.raizPrincipal.percentual}%) — {resultado.raizPrincipal.leitura}
            </p>
            <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm italic leading-relaxed text-foreground/80">
              {resultado.raizPrincipal.caminho}
            </p>
            <div className="mt-5">
              <RaizesResultado raizes={resultado.raizes} />
            </div>



            <h2 className="mt-12 font-heading text-2xl text-foreground">
              Leitura por emoção secundária
            </h2>

            <div className="mt-4 space-y-4">
              {resultado.dimensoes.map((d) => (
                <BarraDimensao key={d.id} dimensao={d} />
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-primary/30 bg-[image:var(--gradient-leaf)] p-7 text-primary-foreground">
              <h3 className="font-heading text-2xl">Próximo passo</h3>
              <p className="mt-2 leading-relaxed opacity-95">
                {resultado.leituraGeral.caminho}
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="rounded-full" onClick={reiniciar}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Refazer o mapeamento
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
