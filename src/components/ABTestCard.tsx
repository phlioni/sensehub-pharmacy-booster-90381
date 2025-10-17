import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface ABTestCardProps {
  label: string;
  percentage: number;
  timeInSeconds: number;
  variant: "success" | "attention";
}

const ABTestCard = ({ label, percentage, timeInSeconds, variant }: ABTestCardProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Animate the percentage
            let current = 0;
            const increment = percentage / 50; // 50 frames
            const timer = setInterval(() => {
              current += increment;
              if (current >= percentage) {
                setAnimatedPercentage(percentage);
                clearInterval(timer);
              } else {
                setAnimatedPercentage(Math.floor(current));
              }
            }, 20);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [percentage, hasAnimated]);

  const bgColor = variant === "success" ? "bg-success" : "bg-attention";
  const bgLight = variant === "success" ? "bg-success-light" : "bg-insight-light";

  return (
    <Card ref={cardRef} className="p-6 space-y-4 border-2 hover:shadow-lg transition-all duration-300">
      <h4 className="font-semibold text-foreground text-lg">{label}</h4>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Engajamento Emocional Positivo</span>
          <span className="font-bold text-foreground text-xl">{animatedPercentage}%</span>
        </div>
        
        {/* Animated Bar */}
        <div className={`w-full h-8 ${bgLight} rounded-lg overflow-hidden`}>
          <div
            className={`h-full ${bgColor} transition-all duration-1000 ease-out flex items-center justify-end px-3`}
            style={{ width: `${animatedPercentage}%` }}
          >
            {animatedPercentage > 15 && (
              <span className="text-sm font-bold text-white">{animatedPercentage}%</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          Tempo Médio de Atenção: <span className="font-semibold text-foreground">{timeInSeconds} segundos</span>
        </p>
      </div>
    </Card>
  );
};

export default ABTestCard;
