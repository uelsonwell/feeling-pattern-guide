import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EXPERIENCIAS, NOME_EXPERIENCIA } from "@/data/mapa-v41";
import { ROTULO_NIVEL, type MapaResultado } from "@/lib/mapa-engine";

export function ExperienciasResonancia({ resultado }: { resultado: MapaResultado }) {
  const data = EXPERIENCIAS.map((e) => {
    const d = resultado.experiencias[e.id];
    return {
      experiencia: NOME_EXPERIENCIA[e.id],
      resonance: d.resonance,
      level: ROTULO_NIVEL[d.level],
    };
  });

  return (
    <div className="h-[320px] w-full sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="experiencia"
            tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-accent)", opacity: 0.4 }}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: "1rem",
              color: "var(--color-card-foreground)",
            }}
            formatter={(value: number, _name, props) => [
              `${value}% — ${props?.payload?.level}`,
              "Ressonância",
            ]}
          />
          <Bar
            dataKey="resonance"
            fill="var(--color-primary)"
            radius={[8, 8, 0, 0]}
            fillOpacity={0.85}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
