import { DollarSign, TrendingUp, Handshake, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: ShoppingCart,
      title: "Aumento do Ticket Médio",
      description: "Otimize o layout para incentivar a compra de produtos de maior margem.",
    },
    {
      icon: DollarSign,
      title: "ROI Rápido e Comprovado",
      description: "Tome decisões de marketing e merchandising com base em dados, não em suposições.",
    },
    {
      icon: Handshake,
      title: "Melhores Negociações com a Indústria",
      description: "Use dados emocionais para provar à indústria farmacêutica qual campanha funciona melhor no seu espaço.",
    },
    {
      icon: TrendingUp,
      title: "Aumento da Conversão no Ponto de Venda",
      description: "Entenda e elimine pontos de fricção ou desinteresse na jornada do cliente na gôndola.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Inteligência que Gera <span className="text-primary">Resultados</span>.
        </h3>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Use Case */}
          <Card className="p-8 bg-card border-2 hover:shadow-lg transition-all duration-300">
            <div className="h-full flex flex-col">
              <h4 className="text-xl font-bold text-primary mb-4">
                Caso de Uso: Otimização de Layout
              </h4>
              <p className="text-foreground leading-relaxed text-lg flex-1">
                "Uma rede de farmácias utilizou o Expositor Inteligente do SenseHub para testar e otimizar o layout de produtos e promoções. 
                Analisando as reações emocionais dos clientes, a equipe de marketing conseguiu criar estratégias mais eficazes, 
                <span className="font-semibold text-success"> elevando a conversão de vendas</span> e 
                <span className="font-semibold text-success"> aprimorando a experiência de compra geral</span>."
              </p>
            </div>
          </Card>

          {/* Right Column: Key Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-card border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-foreground mb-2">
                        {benefit.title}
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
