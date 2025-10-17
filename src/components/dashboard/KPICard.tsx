import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "alert";
}

const KPICard = ({ title, value, icon: Icon, variant = "default" }: KPICardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/30 bg-success-light";
      case "alert":
        return "border-alert/30 bg-alert-light";
      default:
        return "border-border";
    }
  };

  return (
    <Card className={`p-6 ${getVariantStyles()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            variant === "alert" ? "bg-alert/20" : "bg-primary/10"
          }`}>
            <Icon className={`w-5 h-5 ${
              variant === "alert" ? "text-alert" : "text-primary"
            }`} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPICard;
