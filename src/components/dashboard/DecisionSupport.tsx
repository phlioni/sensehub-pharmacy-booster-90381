import { Card } from "@/components/ui/card";
import { Lightbulb, Anchor, Compass, Users, MessageSquareWarning, Tag } from "lucide-react";
import type { Insight } from "@/lib/visionApi";

const PILLAR_META: Record<
  Insight["pillar"],
  { icon: typeof Lightbulb; label: string }
> = {
  retencao: { icon: Anchor, label: "Âncora Visual" },
  captura: { icon: Compass, label: "Ângulo / Posição" },
  demografia: { icon: Users, label: "Público-alvo" },
  valencia: { icon: MessageSquareWarning, label: "Comunicação" },
  promocao: { icon: Tag, label: "Promoção" },
};

const SEVERITY_STYLE: Record<Insight["severity"], string> = {
  info: "border-success/30 bg-success-light",
  warning: "border-alert/30 bg-alert-light",
  action: "border-primary/30 bg-accent",
};

export default function DecisionSupport({ insights }: { insights: Insight[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Apoio à Decisão</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Recomendações geradas a partir dos 4 pilares — cada uma com o dado que a sustenta.
      </p>

      {insights.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sem recomendações no momento. Rode uma sessão na Demonstração ao Vivo para gerar dados.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins, i) => {
            const meta = PILLAR_META[ins.pillar] ?? PILLAR_META.promocao;
            const Icon = meta.icon;
            return (
              <div key={i} className={`p-4 rounded-lg border ${SEVERITY_STYLE[ins.severity]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {meta.label}
                  </span>
                </div>
                <p className="font-semibold text-sm text-foreground">{ins.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{ins.message}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(ins.evidence).map(([k, v]) => (
                    <span key={k} className="text-xs bg-card px-2 py-0.5 rounded border border-border">
                      {k}: <span className="font-semibold text-foreground">
                        {typeof v === "number" && !Number.isInteger(v) ? v.toFixed(2) : v}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
