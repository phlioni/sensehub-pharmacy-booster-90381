import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Anchor, Clock, Eye, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import KPICard from "@/components/dashboard/KPICard";
import DecisionSupport from "@/components/dashboard/DecisionSupport";
import { ServiceOfflineNotice } from "@/components/dashboard/ServiceStateNotice";
import {
  useDemographics, useInsights, useProductMetrics,
} from "@/hooks/useVisionMetrics";
import { EMOTION_LABEL } from "@/lib/visionApi";

const AnaliseProdutos = () => {
  const products = useProductMetrics();
  const demographics = useDemographics();
  const insights = useInsights();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = products.data ?? [];
  const current = list.find((p) => p.id === selectedId) ?? list[0];
  const demo = (demographics.data ?? []).find((d) => d.id === current?.id);

  const emotionChart = useMemo(() => {
    if (!current) return [];
    return Object.entries(current.emotions)
      .map(([k, v]) => ({ emocao: EMOTION_LABEL[k] ?? k, valor: v }))
      .sort((a, b) => b.valor - a.valor);
  }, [current]);

  const demoChart = useMemo(() => {
    if (!demo) return [];
    const buckets: Record<string, { faixa: string; male: number; female: number }> = {};
    for (const row of demo.distribution) {
      const b = (buckets[row.age_bucket] ??= { faixa: row.age_bucket, male: 0, female: 0 });
      if (row.gender === "male") b.male += row.count;
      else if (row.gender === "female") b.female += row.count;
    }
    return Object.values(buckets);
  }, [demo]);

  const offline = products.isError;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Análise de Produtos</h1>
        <p className="text-muted-foreground">
          Retenção, emoção e público-alvo por produto (SKU) monitorado no expositor
        </p>
      </div>

      {offline && <ServiceOfflineNotice detail={String(products.error)} />}

      <Card className="p-6">
        <label className="text-sm font-medium text-foreground mb-2 block">Produto monitorado</label>
        <Select value={current?.id} onValueChange={setSelectedId}>
          <SelectTrigger className="bg-card max-w-md">
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {list.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {current && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard
              title="Âncora Visual (Retenção)"
              value={`${(current.avg_dwell_ms / 1000).toFixed(1)}s`}
              subtitle="olhar fixo médio por visita"
              icon={Anchor}
            />
            <KPICard
              title="Atenção Média"
              value={`${current.avg_attention.toFixed(0)}%`}
              subtitle="engajamento visual"
              icon={Clock}
              variant={current.avg_attention < 35 ? "alert" : "default"}
            />
            <KPICard
              title="Pessoas que Olharam"
              value={String(current.unique_viewers)}
              subtitle={`${current.stoppers} pararam`}
              icon={Eye}
            />
            <KPICard
              title="No Público-alvo"
              value={demo ? `${Math.round(demo.on_target_pct * 100)}%` : "—"}
              subtitle={
                demo
                  ? `alvo ${demo.target.age[0]}-${demo.target.age[1]} anos (${demo.samples} amostras)`
                  : "sem amostras de demografia"
              }
              icon={Users}
              variant={demo && demo.off_target_pct > 0.6 ? "alert" : "default"}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Mapa de Emoções</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Reações registradas enquanto olhavam {current.name}
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={emotionChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="emocao" width={90} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="valor" name="Ticks" fill="hsl(var(--chart-blue))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex gap-2 text-xs">
                {Object.entries(current.valence).map(([k, v]) => (
                  <span key={k} className="px-2 py-1 rounded bg-muted text-muted-foreground">
                    {k}: <span className="font-semibold text-foreground">{v}</span>
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Demografia Estimada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Distribuição por faixa etária e gênero (estimativa agregada)
              </p>
              {demoChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={demoChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="faixa" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="female" name="Feminino" stackId="g" fill="hsl(var(--chart-purple))" />
                    <Bar dataKey="male" name="Masculino" stackId="g" fill="hsl(var(--chart-blue))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground py-12 text-center">
                  Ainda sem amostras de demografia. Ative o estimador de idade/gênero no serviço
                  (<code>ENABLE_DEMOGRAPHICS=true</code>) e rode uma sessão.
                </p>
              )}
            </Card>
          </div>

          <DecisionSupport
            insights={(insights.data ?? []).filter((i) => i.product_id === current.id)}
          />
        </>
      )}
    </div>
  );
};

export default AnaliseProdutos;
