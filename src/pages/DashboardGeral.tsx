import { Card } from "@/components/ui/card";
import KPICard from "@/components/dashboard/KPICard";
import { Activity, TrendingUp, AlertCircle, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DashboardGeral = () => {
  const chartData = [
    { date: "01/01", engagement: 65 },
    { date: "05/01", engagement: 68 },
    { date: "10/01", engagement: 72 },
    { date: "15/01", engagement: 78 },
    { date: "20/01", engagement: 85 },
    { date: "25/01", engagement: 80 },
    { date: "30/01", engagement: 82 },
  ];

  const networkData = [
    { name: "Drogaria X", engagement: "82%", variation: "+5%", positive: true },
    { name: "Farmácia Popular Y", engagement: "68%", variation: "-2%", positive: false },
    { name: "Pague Menos Z", engagement: "75%", variation: "+8%", positive: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Performance</h1>
        <p className="text-muted-foreground">Visão geral consolidada de todas as farmácias monitoradas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Campanhas Ativas" value="12" icon={Activity} />
        <KPICard 
          title="Melhor Campanha (Mês)" 
          value="Lançamento Vitamina C - Drogaria X" 
          icon={TrendingUp}
          variant="success"
        />
        <KPICard 
          title="Produto em Destaque" 
          value="Sérum Anti-Idade Marca Y" 
          icon={Star}
        />
        <KPICard 
          title="Alerta Importante" 
          value="Baixo engajamento na categoria de analgésicos na filial Z" 
          icon={AlertCircle}
          variant="alert"
        />
      </div>

      {/* Main Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Engajamento Emocional Consolidado (Últimos 30 dias)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="hsl(var(--chart-blue))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-blue))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Performance por Rede de Farmácia
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Nome da Rede</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Engajamento Médio</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Variação</th>
                </tr>
              </thead>
              <tbody>
                {networkData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 text-foreground">{row.name}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">{row.engagement}</td>
                    <td className={`py-3 px-2 font-semibold ${row.positive ? "text-success" : "text-alert"}`}>
                      {row.variation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Heatmap Widget */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Mapa de Calor de Engajamento por Localização
          </h3>
          <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
            {/* Simulated map with dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Green dots - high engagement */}
                <div className="absolute top-[20%] left-[30%] w-4 h-4 bg-success rounded-full animate-pulse" />
                <div className="absolute top-[40%] right-[25%] w-4 h-4 bg-success rounded-full animate-pulse" />
                <div className="absolute bottom-[30%] left-[45%] w-4 h-4 bg-success rounded-full animate-pulse" />
                
                {/* Red dots - low engagement */}
                <div className="absolute top-[60%] left-[20%] w-4 h-4 bg-alert rounded-full" />
                <div className="absolute bottom-[20%] right-[30%] w-4 h-4 bg-alert rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">Alto Engajamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-alert rounded-full" />
              <span className="text-muted-foreground">Baixo Engajamento</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGeral;
