import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, TrendingUp, Clock, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import InteractiveHeatmap from "@/components/dashboard/InteractiveHeatmap";

const AnaliseCampanhas = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>("vitamina-c");

  const emotionData = [
    { emotion: "Interesse", "Embalagem A": 75, "Embalagem B": 88 },
    { emotion: "Confiança", "Embalagem A": 82, "Embalagem B": 68 },
    { emotion: "Surpresa", "Embalagem A": 45, "Embalagem B": 85 },
    { emotion: "Dúvida", "Embalagem A": 32, "Embalagem B": 25 },
  ];

  const performanceMetrics = [
    { time: "08:00", engagement: 45, conversion: 8 },
    { time: "10:00", engagement: 62, conversion: 12 },
    { time: "12:00", engagement: 88, conversion: 22 },
    { time: "14:00", engagement: 75, conversion: 18 },
    { time: "16:00", engagement: 68, conversion: 15 },
    { time: "18:00", engagement: 55, conversion: 11 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Análise de Campanhas</h1>
        <p className="text-muted-foreground">Análise profunda de campanhas de marketing e suas métricas emocionais</p>
      </div>

      {/* Filter Bar */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Rede de Farmácia</label>
            <Select defaultValue="drogaria-x">
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="drogaria-x">Drogaria X</SelectItem>
                <SelectItem value="farmacia-y">Farmácia Popular Y</SelectItem>
                <SelectItem value="pague-menos">Pague Menos Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Marca do Produto</label>
            <Select defaultValue="todas">
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="todas">Todas as Marcas</SelectItem>
                <SelectItem value="marca-sol">Marca Sol</SelectItem>
                <SelectItem value="vitamina-c">Vitamina C Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Período</label>
            <Select defaultValue="30dias">
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Campaign Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Campanhas Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Nome da Campanha</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Rede</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Engajamento</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">ROI</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${selectedCampaign === "vitamina-c" ? "bg-accent/50" : ""}`}>
                <td className="py-3 px-2 text-foreground font-medium">Lançamento Vitamina C</td>
                <td className="py-3 px-2 text-foreground">Drogaria X</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-1 bg-success-light text-success text-xs font-semibold rounded">Ativa</span>
                </td>
                <td className="py-3 px-2 font-semibold text-success">88%</td>
                <td className="py-3 px-2 font-semibold text-foreground">4.2x</td>
                <td className="py-3 px-2">
                  <Button 
                    size="sm" 
                    variant={selectedCampaign === "vitamina-c" ? "default" : "outline"}
                    onClick={() => setSelectedCampaign("vitamina-c")}
                  >
                    {selectedCampaign === "vitamina-c" ? "Visualizando" : "Ver Detalhes"}
                  </Button>
                </td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-2 text-foreground">Protetor Solar Verão</td>
                <td className="py-3 px-2 text-foreground">Farmácia Popular Y</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded">Encerrada</span>
                </td>
                <td className="py-3 px-2 font-semibold text-foreground">75%</td>
                <td className="py-3 px-2 font-semibold text-foreground">3.1x</td>
                <td className="py-3 px-2">
                  <Button size="sm" variant="outline">Ver Detalhes</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed Campaign View */}
      {selectedCampaign === "vitamina-c" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-primary rounded" />
            <h2 className="text-2xl font-bold text-foreground">Detalhes da Campanha: Lançamento Vitamina C</h2>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-success-light border-success/30">
              <div className="flex items-start justify-between mb-2">
                <Target className="w-8 h-8 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">22%</p>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">9.8s</p>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">4.2x</p>
              <p className="text-sm text-muted-foreground">ROI da Campanha</p>
            </Card>
            <Card className="p-4 bg-accent">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-2xl font-bold text-foreground">1.247</p>
              <p className="text-sm text-muted-foreground">Interações</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* A/B Test */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Comparação de Embalagens</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border-2 border-border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3">Embalagem A (Design Minimalista)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emoção Dominante:</span>
                        <span className="font-semibold text-foreground">Confiança (82%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo de Atenção:</span>
                        <span className="font-semibold text-foreground">11.2 segundos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Conversão:</span>
                        <span className="font-semibold text-foreground">18%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-success rounded-lg bg-success-light">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">Embalagem B (Design Vibrante)</h4>
                      <span className="px-2 py-1 bg-success text-success-foreground text-xs font-bold rounded">
                        VENCEDOR
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emoção Dominante:</span>
                        <span className="font-semibold text-success">Interesse (88%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo de Atenção:</span>
                        <span className="font-semibold text-foreground">8.5 segundos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Conversão:</span>
                        <span className="font-semibold text-success">26%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Emotion Analysis */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Análise de Reações Emocionais</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="emotion" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Embalagem A" fill="hsl(var(--chart-purple))" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Embalagem B" fill="hsl(var(--chart-green))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Interactive Heatmap */}
              <Card className="p-6">
                <InteractiveHeatmap />
              </Card>

              {/* Insights */}
              <Card className="p-6 bg-accent border-primary/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Insights Acionáveis</h3>
                    <div className="space-y-3 text-sm text-foreground">
                      <div className="p-3 bg-card rounded-lg">
                        <p className="font-semibold mb-1">💡 Design Vibrante Converte Melhor</p>
                        <p className="text-muted-foreground">
                          A embalagem B gerou 44% mais conversões, apesar do tempo de atenção menor. 
                          O impacto visual inicial é decisivo.
                        </p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="font-semibold mb-1">⏰ Horário de Pico</p>
                        <p className="text-muted-foreground">
                          O engajamento é 96% maior entre 11h-13h. Reforce equipe e materiais neste período.
                        </p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="font-semibold mb-1">🎯 Posicionamento Estratégico</p>
                        <p className="text-muted-foreground">
                          Produtos na altura dos olhos (prateleira 2) recebem 3x mais atenção.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnaliseCampanhas;
