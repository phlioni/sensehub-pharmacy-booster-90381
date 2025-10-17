import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InsightBoxProps {
  text: string;
}

const InsightBox = ({ text }: InsightBoxProps) => {
  return (
    <Card className="p-6 bg-insight-light border-2 border-insight/30 hover:border-insight/50 transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-insight/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-insight" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-insight-foreground mb-2 text-sm uppercase tracking-wide">
            INSIGHT SENSEHUB
          </h4>
          <p className="text-foreground leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default InsightBox;
