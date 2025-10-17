import heroImage from "@/assets/pharmacy-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          Suas Gôndolas Vendem. <br />
          <span className="text-insight">Mas elas Encantam?</span>
        </h1>
        
        <h2 className="text-xl md:text-2xl lg:text-3xl text-primary-foreground/95 max-w-4xl mx-auto leading-relaxed font-light">
          Descubra o que seus clientes <span className="font-semibold italic">sentem</span> ao interagir com seus produtos. 
          Transforme seu ponto de venda em uma fonte de inteligência emocional com o <span className="font-bold">SenseHub</span>.
        </h2>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
