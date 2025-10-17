import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import shelfImage from "@/assets/shelf-heatmap.jpg";

const AnaliseCampanhas = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>("vitamina-c");

  const genderData = [
    { name: "Feminino", value: 75 },
    { name: "Masculino", value: 25 },
  ];

  const ageData = [
    { name: "18-25", value: 15 },
    { name: "26-34", value: 25 },
    { name: "35-45", value: 40 },
    { name: "46+", value: 20 },
  ];

  const COLORS = ["hsl(var(--chart-blue))", "hsl(var(--chart-purple))", "hsl(var(--chart-orange))", "hsl(var(--chart-green))"];

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

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* A/B Test */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Teste A/B de Embalagens</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border-2 border-border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3">Embalagem A (Minimalista)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emoção Dominante:</span>
                        <span className="font-semibold text-foreground">Curiosidade (45%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo Médio de Atenção:</span>
                        <span className="font-semibold text-foreground">9 segundos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reação ao Preço:</span>
                        <span className="font-semibold text-foreground">Neutra (70%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-success rounded-lg bg-success-light">
                    <h4 className="font-semibold text-foreground mb-3">Embalagem B (Cores Vibrantes) ✓</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emoção Dominante:</span>
                        <span className="font-semibold text-success">Surpresa Positiva (55%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo Médio de Atenção:</span>
                        <span className="font-semibold text-foreground">6 segundos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reação ao Preço:</span>
                        <span className="font-semibold text-success">Positiva (40%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Demographics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Análise Demográfica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">Engajamento por Gênero</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={genderData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label>
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">Engajamento por Faixa Etária</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={ageData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label>
                          {ageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Heatmap */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Jornada de Atenção na Gôndola</h3>
                <div className="relative rounded-lg overflow-hidden">
                  <img src={shelfImage} alt="Shelf Heatmap" className="w-full" />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-32 h-32 bg-alert/60 rounded-full blur-3xl" />
                    <div className="absolute top-[50%] right-[30%] w-20 h-20 bg-chart-orange/40 rounded-full blur-2xl" />
                  </div>
                </div>
              </Card>

              {/* Insights */}
              <Card className="p-6 bg-accent border-primary/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Insights Acionáveis do SenseHub</h3>
                    <div className="space-y-3 text-sm text-foreground">
                      <p className="leading-relaxed">
                        <span className="font-semibold">Insight 1:</span> A embalagem B (vibrante) é mais eficiente para capturar a atenção inicial, 
                        enquanto a embalagem A (minimalista) retém o interesse por mais tempo, sugerindo que o cliente está lendo as informações.
                      </p>
                      <p className="leading-relaxed">
                        <span className="font-semibold">Insight 2:</span> O pico de interesse antes do almoço indica uma oportunidade para ações 
                        de amostragem ou consultoria no local nesse horário.
                      </p>
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
