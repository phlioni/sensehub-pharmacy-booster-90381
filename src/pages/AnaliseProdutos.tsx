import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AnaliseProdutos = () => {
  const [searchQuery, setSearchQuery] = useState("Sérum Anti-Idade Marca Y");

  const comparisonData = [
    { metric: "Confiança", "Sérum Marca Y": 85, "Creme Marca Z": 72 },
    { metric: "Curiosidade", "Sérum Marca Y": 68, "Creme Marca Z": 75 },
    { metric: "Rejeição", "Sérum Marca Y": 12, "Creme Marca Z": 28 },
  ];

  const opportunityData = [
    { scenario: "Gôndola (altura dos olhos)", engagement: "85%" },
    { scenario: "Ponta de Gôndola Promocional", engagement: "75%" },
    { scenario: "Próximo à categoria de bebês", engagement: "60%" },
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

          {/* Product Card */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center bg-muted rounded-lg p-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">💎</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{searchQuery}</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Métricas Principais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-success-light rounded-lg">
                    <span className="text-foreground">Engajamento Médio Geral:</span>
                    <span className="font-bold text-success text-xl">78%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                    <span className="text-foreground">Emoção Predominante:</span>
                    <span className="font-bold text-primary">Confiança</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-foreground">Concorrente Direto:</span>
                    <span className="font-semibold text-foreground">Creme Rejuvenescedor Marca Z</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Comparison Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Emocional vs. Concorrente</h3>
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
          </Card>

          {/* Opportunities Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Onde este produto performa melhor?</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Cenário</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Engajamento</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunityData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 text-foreground">{row.scenario}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full transition-all duration-500"
                              style={{ width: row.engagement }}
                            />
                          </div>
                          <span className="font-semibold text-foreground w-12">{row.engagement}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-accent rounded-lg border-l-4 border-primary">
              <p className="text-sm text-foreground">
                <span className="font-bold text-primary">RECOMENDAÇÃO:</span> Priorizar o posicionamento na altura dos olhos 
                para maximizar o engajamento orgânico.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnaliseProdutos;
