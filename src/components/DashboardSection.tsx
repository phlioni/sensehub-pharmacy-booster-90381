import ABTestCard from "./ABTestCard";
import InsightBox from "./InsightBox";
import HeatmapModule from "./HeatmapModule";

const DashboardSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Análise de Performance | <span className="text-primary">Gôndola de Dermocosméticos</span>
        </h3>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: A/B Test Module */}
          <div className="space-y-6">
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-foreground mb-6">
                Teste A/B de Campanhas - Protetor Solar "Marca Sol"
              </h4>
              
              <div className="space-y-6">
                <ABTestCard
                  label="Campanha A (Display com Amostra Grátis)"
                  percentage={82}
                  timeInSeconds={8}
                  variant="success"
                />
                
                <ABTestCard
                  label="Campanha B (Display com 20% de Desconto)"
                  percentage={55}
                  timeInSeconds={4}
                  variant="attention"
                />
              </div>
            </div>

            <InsightBox
              text="A oferta de amostra grátis gerou 49% mais engajamento emocional positivo e dobrou o tempo de atenção do cliente. Recomendação: Priorizar estratégias de experimentação para esta categoria."
            />
          </div>

          {/* Right Column: Gondola Heatmap */}
          <div>
            <HeatmapModule />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
