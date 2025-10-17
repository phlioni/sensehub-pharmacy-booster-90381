import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import InteractiveHeatmap from "@/components/dashboard/InteractiveHeatmap";

const RelatorioExecutivo = () => {
  const attentionData = [
    { category: "Dermocosméticos", value: 85, color: "hsl(var(--success))" },
    { category: "Analgésicos", value: 55, color: "hsl(var(--warning))" },
    { category: "Vitaminas Infantis", value: 28, color: "hsl(var(--alert))" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Relatório Executivo: Drogaria X
        </h1>
        <p className="text-muted-foreground">Período: Setembro/2025</p>
      </div>

      {/* Section 1: High-Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-success/30">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Aumento no Engajamento do Cliente
          </p>
          <p className="text-4xl font-bold text-success mb-1">+12%</p>
          <p className="text-sm text-muted-foreground">
            Em comparação com o mês anterior.
          </p>
        </Card>

        <Card className="p-6 bg-card border-success/30">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Impacto no Ticket Médio (OTC)
          </p>
          <p className="text-4xl font-bold text-success mb-1">+R$ 4,50</p>
          <p className="text-sm text-muted-foreground">
            Em produtos das categorias analisadas.
          </p>
        </Card>

        <Card className="p-6 bg-card border-primary/30">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Campanha de Maior Sucesso
          </p>
          <p className="text-2xl font-bold text-primary mb-1">
            Lançamento Protetor Solar 'Marca Sol'
          </p>
          <p className="text-sm text-muted-foreground">
            Gerou 45% mais interesse que a média.
          </p>
        </Card>

        <Card className="p-6 bg-card border-warning/30">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Principal Oportunidade Identificada
          </p>
          <p className="text-2xl font-bold text-warning mb-1">
            Categoria de Vitaminas Infantis
          </p>
          <p className="text-sm text-muted-foreground">
            Potencial de crescimento com ajuste de layout.
          </p>
        </Card>
      </div>

      {/* Section 2: Visual Analysis */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground">
          Visual Analysis: O Que Aprendemos?
        </h2>

        {/* Module 1: O Que Funcionou */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Campanha 'Marca Sol' Aumentou o Interesse na Gôndola de Dermocosméticos
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Visual */}
            <div>
              <InteractiveHeatmap />
            </div>

            {/* Right: Insights */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  O novo display aumentou o tempo de atenção do cliente em{" "}
                  <span className="font-bold">8 segundos</span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <span className="font-bold">78% dos clientes</span> demonstraram
                  emoções positivas (curiosidade, interesse).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <span className="font-bold">Conclusão:</span> O design e a
                  localização do material de merchandising foram cruciais para o
                  sucesso da campanha.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Module 2: Onde Melhorar */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Oportunidade na Categoria de Vitaminas Infantis
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Chart */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                Nível de Atenção por Categoria
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {attentionData.map((entry, index) => (
                      <Bar key={index} dataKey="value" fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Right: Insights */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-alert mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  Produtos localizados nas{" "}
                  <span className="font-bold">prateleiras inferiores</span> receberam
                  3x menos atenção visual.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-alert mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  As embalagens atuais{" "}
                  <span className="font-bold">
                    não estão capturando o interesse
                  </span>{" "}
                  dos pais (emoção predominante: Neutra).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-alert mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <span className="font-bold">Conclusão:</span> A visibilidade e o
                  apelo visual da categoria estão abaixo do potencial e podem ser
                  otimizados.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Section 3: Action Plan */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Recomendações Estratégicas para o Próximo Mês
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recommendation 1 */}
          <Card className="p-6 bg-success-light border-success/30">
            <div className="mb-4">
              <span className="text-3xl font-bold text-success">1.</span>
              <h3 className="text-lg font-semibold text-foreground mt-2">
                Capitalizar o Sucesso
              </h3>
            </div>
            <p className="text-foreground mb-4">
              Replicar o modelo de display e a localização da campanha "Marca Sol"
              para o lançamento da nova linha de Shampoos no próximo mês.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Resultado Esperado: Aumento de até 15% no engajamento para a nova
              categoria.
            </p>
          </Card>

          {/* Recommendation 2 */}
          <Card className="p-6 bg-warning-light border-warning/30">
            <div className="mb-4">
              <span className="text-3xl font-bold text-warning">2.</span>
              <h3 className="text-lg font-semibold text-foreground mt-2">
                Otimizar a Categoria de Baixa Performance
              </h3>
            </div>
            <p className="text-foreground mb-4">
              Mover a categoria de Vitaminas Infantis para a altura dos olhos e
              introduzir um teste A/B com material de ponto de venda mais colorido.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Resultado Esperado: Dobrar o tempo de atenção e identificar a
              comunicação mais eficaz.
            </p>
          </Card>

          {/* Recommendation 3 */}
          <Card className="p-6 bg-primary-light border-primary/30">
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary">3.</span>
              <h3 className="text-lg font-semibold text-foreground mt-2">
                Incentivar a Compra Cruzada
              </h3>
            </div>
            <p className="text-foreground mb-4">
              Posicionar amostras de protetor solar infantil (produto de sucesso) ao
              lado da categoria de fraldas (alto tráfego).
            </p>
            <p className="text-sm text-muted-foreground italic">
              Resultado Esperado: Aumento de 20% nas vendas cruzadas e introdução de
              novos clientes à marca.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RelatorioExecutivo;
