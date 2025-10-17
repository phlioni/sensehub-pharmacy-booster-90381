import { Card } from "@/components/ui/card";
import shelfImage from "@/assets/shelf-heatmap.jpg";

const HeatmapModule = () => {
  return (
    <Card className="p-6 space-y-4 border-2 h-full">
      <h4 className="font-semibold text-foreground text-lg">Mapa de Calor da Gôndola</h4>
      
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <img 
          src={shelfImage} 
          alt="Gondola Shelf Heatmap"
          className="w-full h-auto"
        />
        
        {/* Heatmap Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Hot spot - top center */}
          <div 
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-32 h-32 bg-destructive/60 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          {/* Warm spots */}
          <div className="absolute top-[40%] left-[30%] w-24 h-24 bg-attention/40 rounded-full blur-2xl" />
          <div className="absolute top-[40%] right-[30%] w-20 h-20 bg-attention/30 rounded-full blur-2xl" />
          
          {/* Cool spots - bottom */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-40 h-24 bg-primary/20 rounded-full blur-2xl" />
        </div>
      </div>

      <div className="pt-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          O novo sérum anti-idade capturou <span className="font-semibold text-success">65% da atenção visual</span> na prateleira superior. 
          A base da gôndola é uma <span className="font-semibold text-primary">'zona fria'</span>.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs pt-2 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive rounded-full" />
          <span className="text-muted-foreground">Alta atenção</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-attention rounded-full" />
          <span className="text-muted-foreground">Média atenção</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="text-muted-foreground">Baixa atenção</span>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapModule;
