import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const handleCTAClick = () => {
    // This would typically link to a contact form or scheduling system
    console.log("CTA clicked - Request PoC Demo");
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-primary via-primary-hover to-primary">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
          Leve a Inteligência Emocional para o Ponto de Venda.
        </h2>
        
        <p className="text-xl text-primary-foreground/95 leading-relaxed max-w-3xl mx-auto">
          Ofereça aos seus clientes de farmácia mais do que um serviço de merchandising. 
          Ofereça resultados comprovados por dados. Agende uma demonstração e veja como podemos 
          implementar uma <span className="font-bold">Prova de Conceito (PoC)</span> para validar o poder do SenseHub.
        </p>

        <div className="pt-6">
          <Button
            size="lg"
            onClick={handleCTAClick}
            className="bg-success hover:bg-success/90 text-success-foreground text-lg px-8 py-6 h-auto rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Solicitar Demonstração da Prova de Conceito
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-8 text-primary-foreground/80 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Sem compromisso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Resultados em 30 dias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>ROI mensurável</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
