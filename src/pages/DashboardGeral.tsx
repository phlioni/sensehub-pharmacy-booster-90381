import { Card } from "@/components/ui/card";
import KPICard from "@/components/dashboard/KPICard";
import { TrendingUp, Target, Zap, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState } from "react";

const DashboardGeral = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const chartData = [
    { date: "Sem 1", engagement: 65, conversao: 12 },
    { date: "Sem 2", engagement: 68, conversao: 14 },
    { date: "Sem 3", engagement: 72, conversao: 16 },
    { date: "Sem 4", engagement: 78, conversao: 18 },
    { date: "Sem 5", engagement: 85, conversao: 22 },
    { date: "Sem 6", engagement: 80, conversao: 20 },
    { date: "Sem 7", engagement: 82, conversao: 21 },
  ];

  const networkData = [
    { name: "Drogaria X - Centro", engagement: "82%", variation: "+5%", positive: true, revenue: "R$ 45.2K" },
    { name: "Farmácia Popular Y - Norte", engagement: "68%", variation: "-2%", positive: false, revenue: "R$ 32.8K" },
    { name: "Pague Menos Z - Sul", engagement: "75%", variation: "+8%", positive: true, revenue: "R$ 38.5K" },
    { name: "Drogaria X - Oeste", engagement: "79%", variation: "+3%", positive: true, revenue: "R$ 41.1K" },
  ];

  // Regiões do mapa de calor
  const heatmapRegions = [
    { id: "centro", x: 35, y: 25, intensity: "high", name: "Centro", stores: 8, avgEngagement: "82%" },
    { id: "norte", x: 50, y: 15, intensity: "medium", name: "Norte", stores: 5, avgEngagement: "68%" },
    { id: "sul", x: 45, y: 65, intensity: "high", name: "Sul", stores: 6, avgEngagement: "75%" },
    { id: "leste", x: 75, y: 40, intensity: "medium", name: "Leste", stores: 4, avgEngagement: "71%" },
    { id: "oeste", x: 20, y: 50, intensity: "high", name: "Oeste", stores: 7, avgEngagement: "79%" },
  ];

  const getIntensityColor = (intensity: string) => {
    return intensity === "high" ? "bg-success" : "bg-chart-orange";
  };

  const getIntensitySize = (intensity: string) => {
    return intensity === "high" ? "w-20 h-20" : "w-16 h-16";
  };

  const selectedRegion = heatmapRegions.find((r) => r.id === hoveredRegion);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Performance</h1>
        <p className="text-muted-foreground">Visão geral consolidada das métricas mais importantes</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Taxa de Conversão Média" 
          value="18.5%" 
          subtitle="em todas as campanhas ativas"
          icon={Target}
          variant="success"
          trend={{ value: "12%", positive: true }}
        />
        <KPICard 
          title="Tempo Médio de Atenção" 
          value="8.2s" 
          subtitle="por produto analisado"
          icon={Zap}
          trend={{ value: "0.8s", positive: true }}
        />
        <KPICard 
          title="ROI de Campanhas" 
          value="3.4x" 
          subtitle="retorno sobre investimento"
          icon={TrendingUp}
          variant="success"
          trend={{ value: "0.6x", positive: true }}
        />
        <KPICard 
          title="Pontos de Atenção" 
          value="3" 
          subtitle="gôndolas com baixo desempenho"
          icon={AlertTriangle}
          variant="alert"
        />
      </div>

      {/* Main Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Evolução de Engajamento e Conversão
          </h3>
          <p className="text-sm text-muted-foreground">Últimas 7 semanas</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-blue))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-blue))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConversao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-green))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-green))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="hsl(var(--chart-blue))" 
              fillOpacity={1}
              fill="url(#colorEngagement)"
              strokeWidth={2}
              name="Engajamento (%)"
            />
            <Area 
              type="monotone" 
              dataKey="conversao" 
              stroke="hsl(var(--chart-green))" 
              fillOpacity={1}
              fill="url(#colorConversao)"
              strokeWidth={2}
              name="Conversão (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Table */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Performance por Localização
            </h3>
            <p className="text-sm text-muted-foreground">Comparativo de todas as unidades</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Unidade</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Engajamento</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Variação</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Receita</th>
                </tr>
              </thead>
              <tbody>
                {networkData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 text-foreground font-medium">{row.name}</td>
                    <td className="py-3 px-2">
                      <span className="font-semibold text-foreground">{row.engagement}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${row.positive ? "text-success" : "text-alert"}`}>
                        {row.positive ? "↑" : "↓"} {row.variation}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-foreground">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Interactive Heatmap */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Mapa de Calor - Engajamento por Região
            </h3>
            <p className="text-sm text-muted-foreground">Passe o mouse para ver detalhes</p>
          </div>
          
          <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
            {/* Mapa de fundo simulado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Grid de fundo */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border-b border-foreground" style={{ height: "12.5%" }} />
                  ))}
                </div>

                {/* Regiões interativas */}
                {heatmapRegions.map((region) => (
                  <div key={region.id}>
                    {/* Área de calor */}
                    <div
                      className={`absolute ${getIntensitySize(region.intensity)} ${getIntensityColor(
                        region.intensity
                      )}/30 rounded-full blur-2xl transition-all duration-300 ${
                        hoveredRegion === region.id ? "scale-125 opacity-100" : "opacity-70"
                      }`}
                      style={{
                        left: `${region.x}%`,
                        top: `${region.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                    
                    {/* Marcador interativo */}
                    <button
                      onMouseEnter={() => setHoveredRegion(region.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-125 ${
                        hoveredRegion === region.id
                          ? "bg-primary border-primary scale-125 z-10"
                          : "bg-card border-foreground/30 hover:border-primary"
                      }`}
                      style={{
                        left: `${region.x}%`,
                        top: `${region.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="text-xs font-bold text-foreground">
                        {region.stores}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          {selectedRegion ? (
            <div className="mt-4 p-4 bg-accent rounded-lg border border-primary/30 animate-fade-in">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground">{selectedRegion.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  selectedRegion.intensity === "high" 
                    ? "bg-success-light text-success" 
                    : "bg-chart-orange/20 text-chart-orange"
                }`}>
                  {selectedRegion.intensity === "high" ? "Alto Desempenho" : "Médio Desempenho"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Lojas Monitoradas</p>
                  <p className="font-semibold text-foreground">{selectedRegion.stores} unidades</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Engajamento Médio</p>
                  <p className="font-semibold text-success">{selectedRegion.avgEngagement}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Passe o mouse sobre as regiões para ver os detalhes
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">Alto Engajamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-orange rounded-full" />
              <span className="text-muted-foreground">Médio Engajamento</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGeral;
