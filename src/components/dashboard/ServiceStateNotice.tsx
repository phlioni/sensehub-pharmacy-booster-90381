import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, FlaskConical } from "lucide-react";

export function ServiceOfflineNotice({ detail }: { detail?: string }) {
  return (
    <Card className="p-4 border-alert/40 bg-alert-light flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-alert mt-0.5 flex-shrink-0" />
      <div className="text-sm">
        <p className="font-semibold text-foreground">Serviço SenseHub Vision indisponível</p>
        <p className="text-muted-foreground">
          Não foi possível falar com a API em <code>{import.meta.env.VITE_VISION_API_URL}</code>.
          Suba o serviço Python (<code>uv run uvicorn app.main:app</code>) e o Redis/Postgres
          (<code>docker compose up -d</code>).
        </p>
        {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
      </div>
    </Card>
  );
}

export function SampleDataNotice({ children }: { children?: ReactNode }) {
  return (
    <Card className="p-3 border-primary/30 bg-accent flex items-start gap-3">
      <FlaskConical className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      <p className="text-xs text-muted-foreground">
        {children ??
          "Esta página ainda usa dados de amostra. As métricas reais chegam do serviço SenseHub Vision conforme as sessões são gravadas."}
      </p>
    </Card>
  );
}
