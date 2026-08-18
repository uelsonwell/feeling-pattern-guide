import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Compass, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  NOME_EXPERIENCIA,
  QUESTOES,
  TOTAL_QUESTOES,
  VERSION,
  type OpcaoLetra,
} from "@/data/mapa-v41";
import { calcularMapa, type Respostas } from "@/lib/mapa-engine";
import {
  AVISO,
  leituraEstrutural,
  leituraPerfil,
  tituloResultado,
} from "@/lib/mapa-interpretacao";
import { PortasResultado } from "@/components/mapa/PortasResultado";
import { MatrizHeatmap } from "@/components/mapa/MatrizHeatmap";
import { IREResultado } from "@/components/mapa/IREResultado";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "MAPA 3 Portas V4.1 | Sessão de Mapeamento" },
      {
        name: "description",
        content:
          "Sessão de mapeamento MAPA 3 Portas V4.1: 20 situações, 5 experiências, 3 portas e matriz 5×3 com leitura estrutural de convergência.",
      },
      { property: "og:title", content: "MAPA 3 Portas V4.1 — Sessão de Mapeamento" },
      {
        property: "og:description",
        content:
          "Responda 20 situações e receba a leitura estrutural das portas Medo, Controle/Vigilância e Raiva na matriz 5×3.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapaPage,
});

type Etapa = "intro" | "quiz" | "resultado";

function MapaPage() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({});

  const questao = QUESTOES[atual]!;
  const respondidas = Object.keys(respostas).length;
  const resultado = useMemo(() => calcularMapa(respostas), [respostas]);

  const responder = (opcao: OpcaoLetra) => {
    setRespostas((r) => ({ ...r, [questao.question_id]: opcao }));
    window.setTimeout(() => {
      if (atual < TOTAL_QUESTOES - 1) setAtual((a) => a + 1);
      else setEtapa("resultado");
    }, 200);
  };

  const reiniciar = () => {
    setRespostas({});
    setAtual(0);
    setEtapa("intro");
  };

  const baixarJson = () => {
    const blob = new Blob([JSON.stringify(resultado, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mapa-3-portas-${VERSION}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center gap-2 text-sm text-muted-foreground">
          <Compass className="h-4 w-4 text-primary" />
          <span className="tracking-wide uppercase">MAPA 3 Portas · {VERSION}</span>
          <Link to="/" className="ml-auto hover:text-foreground">
            Outra sessão
          </Link>
        </header>

        {etapa === "intro" && (
          <section className="mt-10">
            <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
              Sessão de mapeamento MAPA 3 Portas
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              20 situações concretas, 4 alternativas cada. Não existem respostas certas ou erradas —
              escolha a que mais se aproxima da sua reação espontânea.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card/70 p-5">
                <h2 className="font-heading text-lg text-card-foreground">3 portas</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Medo, Controle/Vigilância e Raiva — como a resposta se organiza.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/70 p-5">
                <h2 className="font-heading text-lg text-card-foreground">5 experiências</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Rejeição, Abandono, Manipulação, Humilhação e Traição — onde a resposta acontece.
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{AVISO}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full px-7" onClick={() => setEtapa("quiz")}>
                Iniciar sessão
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {TOTAL_QUESTOES} situações · nada é armazenado
              </span>
            </div>
          </section>
        )}

        {etapa === "quiz" && (
          <section className="mt-10">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Situação {atual + 1} de {TOTAL_QUESTOES}
              </span>
              <span>{Math.round((respondidas / TOTAL_QUESTOES) * 100)}% concluído</span>
            </div>
            <Progress value={(respondidas / TOTAL_QUESTOES) * 100} className="mt-3 h-1.5" />

            <div className="mt-9 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <p className="text-xs tracking-wide text-primary uppercase">
                {questao.question_id} · {NOME_EXPERIENCIA[questao.bloco]} · {questao.titulo}
              </p>
              <h2 className="mt-3 font-heading text-2xl leading-snug text-card-foreground">
                {questao.situacao}
              </h2>

              <div className="mt-7 space-y-3">
                {questao.alternativas.map((a) => {
                  const selecionada = respostas[questao.question_id] === a.option;
                  return (
                    <button
                      key={a.option}
                      onClick={() => responder(a.option)}
                      className={`flex w-full gap-3 rounded-2xl border px-5 py-4 text-left text-[15px] leading-relaxed transition-all ${
                        selecionada
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background/60 text-foreground hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-heading text-primary">{a.option}</span>
                      <span>{a.texto}</span>
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
              {respondidas === TOTAL_QUESTOES && (
                <Button className="rounded-full" onClick={() => setEtapa("resultado")}>
                  Ver resultado
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </section>
        )}

        {etapa === "resultado" && (
          <section className="mt-10">
            <p className="text-sm tracking-wide text-primary uppercase">
              Resultado estrutural · {VERSION}
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-foreground">
              {tituloResultado(resultado)}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {leituraEstrutural(resultado)}
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{leituraPerfil(resultado)}</p>

            <h2 className="mt-12 font-heading text-2xl text-foreground">Portas</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Margem de dominância aplicada: {resultado.classificacao.dominance_margin} pontos
              percentuais.
            </p>
            <div className="mt-4">
              <PortasResultado resultado={resultado} />
            </div>

            <h2 className="mt-12 font-heading text-2xl text-foreground">
              Ranking das 15 células · TOP 1, TOP 2 e Δ
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Normalização R = (RAW ÷ 8) × 100. Empates são preservados: quando o Δ fica abaixo de{" "}
              {resultado.classificacao.dominance_margin} p.p., a liderança não é forçada.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { rotulo: "TOP 1", celula: resultado.top_1 },
                { rotulo: "TOP 2", celula: resultado.top_2 },
              ].map(({ rotulo, celula }) => (
                <div key={rotulo} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-xs tracking-wide text-primary uppercase">{rotulo}</p>
                  <p className="mt-1 font-heading text-lg text-card-foreground">
                    {celula
                      ? `${NOME_EXPERIENCIA[celula.experiencia]} × ${NOME_PORTA[celula.porta]}`
                      : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {celula ? `${celula.percent}% · bruto ${celula.raw}` : "sem nível registrado"}
                    {celula?.tie ? " · empate preservado" : ""}
                  </p>
                </div>
              ))}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs tracking-wide text-primary uppercase">Δ (TOP 1 − TOP 2)</p>
                <p className="mt-1 font-heading text-lg text-card-foreground">
                  {resultado.delta} p.p.
                </p>
                <p className="text-sm text-muted-foreground">
                  {resultado.robustness.delta_sustains_top
                    ? "diferença sustenta a leitura"
                    : "diferença não sustenta liderança"}
                </p>
              </div>
            </div>
            <ol className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {resultado.ranking.map((c, i) => (
                <li
                  key={`${c.experiencia}_${c.porta}`}
                  className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} · {NOME_EXPERIENCIA[c.experiencia]} ×{" "}
                    {NOME_PORTA[c.porta]}
                    {c.tie && <span className="ml-2 text-xs text-primary">empate</span>}
                  </span>
                  <span className="text-card-foreground">
                    {c.percent}% · bruto {c.raw}
                  </span>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 font-heading text-2xl text-foreground">Matriz 5 × 3</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              MAX_REACHABLE = 8 por célula. A associação entre experiência e porta só é considerada
              quando a célula correspondente sustenta.
            </p>
            <div className="mt-4 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
              <MatrizHeatmap resultado={resultado} />
            </div>


            <h2 className="mt-12 font-heading text-2xl text-foreground">
              IRE — presença e ressonância
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Presença e ressonância permanecem variáveis independentes.
            </p>
            <div className="mt-4">
              <IREResultado resultado={resultado} />
            </div>

            <p className="mt-10 rounded-2xl border border-border bg-card/70 p-5 text-sm leading-relaxed text-muted-foreground">
              {AVISO}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="rounded-full" onClick={baixarJson}>
                <Download className="mr-2 h-4 w-4" />
                Baixar objeto estruturado (JSON)
              </Button>
              <Button variant="ghost" className="rounded-full" onClick={reiniciar}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Refazer a sessão
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
