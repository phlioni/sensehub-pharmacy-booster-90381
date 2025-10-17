import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import shelfImage from "@/assets/shelf-heatmap.jpg";

interface HotSpot {
  id: string;
  x: number;
  y: number;
  intensity: "high" | "medium" | "low";
  product: string;
  attentionTime: string;
  engagementRate: string;
}

const InteractiveHeatmap = () => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const hotSpots: HotSpot[] = [
    {
      id: "spot-1",
      x: 50,
      y: 20,
      intensity: "high",
      product: "Sérum Anti-Idade Premium",
      attentionTime: "12 segundos",
      engagementRate: "85%",
    },
    {
      id: "spot-2",
      x: 30,
      y: 45,
      intensity: "medium",
      product: "Hidratante Facial",
      attentionTime: "7 segundos",
      engagementRate: "62%",
    },
    {
      id: "spot-3",
      x: 70,
      y: 40,
      intensity: "medium",
      product: "Protetor Solar FPS 50",
      attentionTime: "6 segundos",
      engagementRate: "58%",
    },
    {
      id: "spot-4",
      x: 50,
      y: 75,
      intensity: "low",
      product: "Creme para Mãos",
      attentionTime: "3 segundos",
      engagementRate: "28%",
    },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "bg-alert";
      case "medium":
        return "bg-chart-orange";
      case "low":
        return "bg-chart-blue";
      default:
        return "bg-primary";
    }
  };

  const getIntensitySize = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "w-32 h-32";
      case "medium":
        return "w-24 h-24";
      case "low":
        return "w-20 h-20";
      default:
        return "w-20 h-20";
    }
  };

  const selectedSpotData = hotSpots.find((spot) => spot.id === selectedSpot);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Jornada de Atenção na Gôndola</h3>
          <p className="text-sm text-muted-foreground">Clique nos pontos para ver detalhes</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHeatmap(!showHeatmap)}
        >
          {showHeatmap ? "Ocultar" : "Mostrar"} Mapa de Calor
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden bg-muted">
        <img src={shelfImage} alt="Gondola Shelf" className="w-full" />

        {/* Heatmap Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none">
            {hotSpots.map((spot) => (
              <div
                key={spot.id}
                className={`absolute ${getIntensitySize(spot.intensity)} ${getIntensityColor(
                  spot.intensity
                )}/40 rounded-full blur-3xl animate-pulse`}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: "translate(-50%, -50%)",
                  animationDuration: spot.intensity === "high" ? "2s" : "3s",
                }}
              />
            ))}
          </div>
        )}

        {/* Interactive Markers */}
        <div className="absolute inset-0">
          {hotSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setSelectedSpot(selectedSpot === spot.id ? null : spot.id)}
              className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-125 ${
                selectedSpot === spot.id
                  ? "bg-primary border-primary scale-125"
                  : "bg-card/90 border-foreground/30 hover:border-primary"
              }`}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="text-xs font-bold text-foreground">
                {spot.intensity === "high" ? "!" : spot.intensity === "medium" ? "•" : "·"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      {selectedSpotData && (
        <Card className="p-4 bg-accent border-primary/30 animate-fade-in">
          <div className="flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full ${getIntensityColor(
                selectedSpotData.intensity
              )} mt-1.5`}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2">{selectedSpotData.product}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tempo de Atenção</p>
                  <p className="font-semibold text-foreground">{selectedSpotData.attentionTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Taxa de Engajamento</p>
                  <p className="font-semibold text-success">{selectedSpotData.engagementRate}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-alert rounded-full" />
          <span className="text-muted-foreground">Alta Atenção (&gt;10s)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-orange rounded-full" />
          <span className="text-muted-foreground">Média Atenção (5-10s)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-blue rounded-full" />
          <span className="text-muted-foreground">Baixa Atenção (&lt;5s)</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeatmap;
