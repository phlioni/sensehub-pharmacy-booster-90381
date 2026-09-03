import { Card } from "@/components/ui/card";
import KPICard from "@/components/dashboard/KPICard";
import DecisionSupport from "@/components/dashboard/DecisionSupport";
import { ServiceOfflineNotice } from "@/components/dashboard/ServiceStateNotice";
import { Users, MousePointerClick, Timer, Smile } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import {
  useInsights, useOverview, useProductMetrics,
} from "@/hooks/useVisionMetrics";

const pct = (v: number | undefined) => `${Math.round((v ?? 0) * 100)}%`;

const DashboardGeral = () => {
  const overview = useOverview();
  const products = useProductMetrics();
  const insights = useInsights();

  const offline = overview.isError && products.isError;
  const o = overview.data;

  const productChart = (products.data ?? []).map((p) => ({
    name: p.name,
    atencao: p.avg_attention,
    retencao: Number((p.avg_dwell_ms / 1000).toFixed(1)),
    viewers: p.unique_viewers,
  }));

  const valence = o?.valence_split ?? { positiva: 0, neutra: 0, negativa: 0 };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Performance</h1>
        <p className="text-muted-foreground">
          Visão consolidada da sessão atual — tráfego, retenção, emoção e demografia no ponto de venda
        </p>
      </div>

      {offline && <ServiceOfflineNotice detail={String(overview.error)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Taxa de Captura"
          value={pct(o?.capture_rate)}
          subtitle={`${o?.stoppers ?? 0} pararam de ${o?.passersby ?? 0} que passaram`}
          icon={MousePointerClick}
          variant={o && o.capture_rate < 0.35 ? "alert" : "success"}
        />
        <KPICard
          title="Retenção Média (Dwell)"
          value={`${((o?.avg_dwell_ms ?? 0) / 1000).toFixed(1)}s`}
          subtitle="olhar fixo por visita a produto"
          icon={Timer}
        />
        <KPICard
          title="Visitantes Únicos"
          value={String(o?.unique_visitors ?? 0)}
          subtitle="pessoas distintas na sessão"
          icon={Users}
        />
        <KPICard
          title="Valência Positiva"
          value={pct(valence.positiva)}
          subtitle={`neutra ${pct(valence.neutra)} · negativa ${pct(valence.negativa)}`}
          icon={Smile}
          variant={valence.negativa > 0.35 ? "alert" : "success"}
        />
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Âncora Visual — Retenção e Atenção por Produto</h3>
          <p className="text-sm text-muted-foreground">
            Qual produto segura mais o olhar dos clientes
          </p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={productChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar yAxisId="l" dataKey="atencao" name="Atenção (%)" fill="hsl(var(--chart-blue))" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="r" dataKey="retencao" name="Retenção (s)" fill="hsl(var(--chart-green))" radius={[8, 8, 0, 0]}>
              {productChart.map((_, i) => (
                <Cell key={i} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Interesse por Produto</h3>
            <p className="text-sm text-muted-foreground">Pessoas que olharam vs. que pararam</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Produto</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Olharam</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Pararam</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Retenção</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Emoção</th>
                </tr>
              </thead>
              <tbody>
                {(products.data ?? []).map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 text-foreground font-medium">{p.name}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">{p.unique_viewers}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">{p.stoppers}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">
                      {(p.avg_dwell_ms / 1000).toFixed(1)}s
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-foreground">
                      {p.dominant_emotion_pt}
                    </td>
                  </tr>
                ))}
                {(products.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                      Sem dados ainda — rode uma sessão na Demonstração ao Vivo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <DecisionSupport insights={insights.data ?? []} />
      </div>
    </div>
  );
};

export default DashboardGeral;
