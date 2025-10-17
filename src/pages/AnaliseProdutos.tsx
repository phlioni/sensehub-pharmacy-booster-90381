import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock, Eye, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const AnaliseProdutos = () => {
  const [searchQuery, setSearchQuery] = useState("Sérum Anti-Idade Marca Y");

  const comparisonData = [
    { metric: "Interesse", "Sérum Marca Y": 85, "Creme Marca Z": 72 },
    { metric: "Confiança", "Sérum Marca Y": 78, "Creme Marca Z": 68 },
    { metric: "Surpresa", "Sérum Marca Y": 68, "Creme Marca Z": 75 },
    { metric: "Rejeição", "Sérum Marca Y": 12, "Creme Marca Z": 28 },
  ];

  const performanceData = [
    { attribute: "Atenção Visual", value: 85 },
    { attribute: "Tempo de Engajamento", value: 78 },
    { attribute: "Reação ao Preço", value: 72 },
    { attribute: "Interesse na Embalagem", value: 88 },
    { attribute: "Posicionamento", value: 92 },
  ];

  const opportunityData = [
    { 
      scenario: "Altura dos Olhos (Prateleira 2)", 
      engagement: "92%", 
      conversion: "24%",
      revenue: "R$ 12.8K/mês" 
    },
    { 
      scenario: "Ponta de Gôndola Promocional", 
      engagement: "85%", 
      conversion: "28%",
      revenue: "R$ 15.2K/mês" 
    },
    { 
      scenario: "Próximo a Produtos Complementares", 
      engagement: "78%", 
      conversion: "19%",
      revenue: "R$ 9.5K/mês" 
    },
    { 
      scenario: "Prateleira Inferior (Base)", 
      engagement: "45%", 
      conversion: "8%",
      revenue: "R$ 3.2K/mês" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Análise de Produtos</h1>
        <p className="text-muted-foreground">Investigação detalhada de performance de produtos específicos (SKU level)</p>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar por produto ou marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg bg-card"
          />
        </div>
      </Card>

      {/* Product Results */}
      {searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-primary rounded" />
            <h2 className="text-2xl font-bold text-foreground">Resultados para: "{searchQuery}"</h2>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-success-light border-success/30">
              <div className="flex items-start justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">78%</p>
              <p className="text-sm text-muted-foreground">Engajamento Geral</p>
              <p className="text-xs text-success mt-1">↑ 12% vs. mês anterior</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">11.5s</p>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-xs text-success mt-1">↑ 2.3s vs. média</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">3.241</p>
              <p className="text-sm text-muted-foreground">Visualizações</p>
              <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
            </Card>
            <Card className="p-4 bg-accent">
              <div className="flex items-start justify-between mb-2">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">21%</p>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-xs text-success mt-1">↑ 8% vs. categoria</p>
            </Card>
          </div>

          {/* Product Overview */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8">
                <div className="text-center">
                  <div className="w-40 h-40 bg-card rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-6xl">💎</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{searchQuery}</h3>
                  <p className="text-sm text-muted-foreground">Categoria: Dermocosméticos Anti-Idade</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-success-light text-success text-xs font-semibold rounded-full">
                      TOP 3 na categoria
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Análise de Atributos</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Radar 
                      name="Performance" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-blue))" 
                      fill="hsl(var(--chart-blue))" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Comparison Chart */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Performance Emocional vs. Concorrente</h3>
              <p className="text-sm text-muted-foreground">Comparação com: Creme Rejuvenescedor Marca Z</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }}
                />
                <Legend />
                <Bar dataKey="Sérum Marca Y" fill="hsl(var(--chart-blue))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Creme Marca Z" fill="hsl(var(--chart-purple))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-success-light rounded-lg border-l-4 border-success">
              <p className="text-sm font-semibold text-foreground">
                ✓ Seu produto supera o concorrente em 3 de 4 métricas principais
              </p>
            </div>
          </Card>

          {/* Opportunities Table */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Onde este produto performa melhor?</h3>
              <p className="text-sm text-muted-foreground">Análise de posicionamento e oportunidades de receita</p>
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Cenário de Posicionamento</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Engajamento</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Conversão</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-foreground">Receita Estimada</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunityData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 text-foreground font-medium">{row.scenario}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                parseInt(row.engagement) > 80 ? "bg-success" : 
                                parseInt(row.engagement) > 60 ? "bg-chart-orange" : 
                                "bg-chart-blue"
                              }`}
                              style={{ width: row.engagement }}
                            />
                          </div>
                          <span className="font-semibold text-foreground text-sm w-12">{row.engagement}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-semibold ${
                          parseInt(row.conversion) > 20 ? "text-success" : "text-foreground"
                        }`}>{row.conversion}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-foreground">{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-accent rounded-lg border-l-4 border-primary">
                <p className="text-sm font-bold text-primary mb-1">💡 RECOMENDAÇÃO PRINCIPAL</p>
                <p className="text-sm text-foreground">
                  Priorizar posicionamento em pontas de gôndola promocionais. Maior conversão (28%) 
                  e potencial de receita adicional de <span className="font-bold">R$ 5.7K/mês</span>.
                </p>
              </div>
              <div className="p-4 bg-alert-light rounded-lg border-l-4 border-alert">
                <p className="text-sm font-bold text-alert mb-1">⚠️ ATENÇÃO</p>
                <p className="text-sm text-foreground">
                  Evitar prateleiras inferiores. Performance 51% abaixo da média e 
                  perda estimada de <span className="font-bold">R$ 9.6K/mês</span> em receita potencial.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnaliseProdutos;
