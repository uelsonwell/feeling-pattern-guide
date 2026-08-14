import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ResultadoDimensao } from "@/lib/matriz-score";

export function RadarResultado({ dimensoes }: { dimensoes: ResultadoDimensao[] }) {
  const data = dimensoes.map((d) => ({ eixo: d.nome, valor: d.percentual }));

  return (
    <div className="h-[340px] w-full sm:h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis
            dataKey="eixo"
            tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="valor"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.28}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
