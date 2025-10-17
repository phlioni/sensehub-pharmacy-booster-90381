import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "alert";
  trend?: {
    value: string;
    positive: boolean;
  };
}

const KPICard = ({ title, value, subtitle, icon: Icon, variant = "default", trend }: KPICardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/30 bg-success-light";
      case "alert":
        return "border-alert/30 bg-alert-light";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <Card className={`p-6 ${getVariantStyles()} hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            variant === "alert" ? "bg-alert/20" : variant === "success" ? "bg-success/20" : "bg-primary/10"
          }`}>
            <Icon className={`w-5 h-5 ${
              variant === "alert" ? "text-alert" : variant === "success" ? "text-success" : "text-primary"
            }`} />
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-sm font-semibold ${trend.positive ? "text-success" : "text-alert"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
            <span className="text-xs text-muted-foreground">vs. mês anterior</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPICard;
