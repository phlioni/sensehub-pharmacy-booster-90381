import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import PersonScatterChart from "@/components/demo/PersonScatterChart";
import { useLiveFeed } from "@/hooks/useVisionMetrics";
import { EMOTION_LABEL, PREVIEW_MJPEG_URL, visionApi } from "@/lib/visionApi";

const emotionLabel = (e: string) => EMOTION_LABEL[e] ?? e?.toUpperCase() ?? "---";

const DemonstracaoAoVivo = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const { snapshot, chart, connected, resetChart } = useLiveFeed(isPlaying);

  const products = snapshot?.products ?? [];
  const left = products[0];
  const right = products[1];
  const currentGaze = snapshot?.current_gaze ?? "centro";

  const handlePlayPause = () => {
    if (!isPlaying) {
      toast({ title: "Conectando", description: "Assinando o feed do serviço SenseHub Vision..." });
    }
    setIsPlaying((v) => !v);
  };

  const handleReset = async () => {
    try {
      await visionApi.resetSession();
      resetChart();
      toast({ title: "Sessão reiniciada", description: "Agregados zerados no serviço." });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível reiniciar a sessão. O serviço está no ar?",
        variant: "destructive",
      });
    }
  };

  const renderProductCard = (
    product: typeof left,
    active: boolean,
    ring: string,
    promoClass: string,
  ) => (
    <Card className="p-4 relative">
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${active ? ring : ""}`} />
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-2">{product?.name ?? "—"}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Retenção méd.:</span>
            <p className="font-semibold">{((product?.avg_dwell_ms ?? 0) / 1000).toFixed(1)}s</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Atenção:</span>
            <p className="font-semibold">{(product?.avg_attention ?? 0).toFixed(0)}%</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Olharam:</span>
            <p className="font-semibold">{product?.unique_viewers ?? 0}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Emoção:</span>
            <p className="font-semibold">{emotionLabel(product?.dominant_emotion ?? "")}</p>
          </div>
        </div>
        {product && Object.keys(product.viewers_by_emotion ?? {}).length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {Object.entries(product.viewers_by_emotion)
              .filter(([, n]) => n > 0)
              .map(([e, n]) => `${n} com ${emotionLabel(e).toLowerCase()}`)
              .join(" · ")}
          </p>
        )}
        {product?.show_promo && (
          <div className={`mt-2 p-2 rounded text-white text-xs ${promoClass}`}>
            <p className="font-bold">🎉 Sugestão: destacar / promover este produto</p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative flex items-center mb-6">
          <div className="text-left">
            <h1 className="text-2xl font-bold" style={{ color: "#612cb5" }}>SenseHub</h1>
            <p className="text-xs text-muted-foreground">
              by <span style={{ color: "#612cb5" }} className="font-semibold">D&P Soft</span>
            </p>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-3xl font-bold text-foreground">Sistema de Análise de Interesse</h2>
            <p className="text-sm text-muted-foreground">
              Processamento no serviço local (Python) — atenção, emoção e demografia em tempo real
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-4 lg:col-span-1">
            <div
              className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden mb-3"
              style={{ height: "280px" }}
            >
              {isPlaying ? (
                <img
                  src={PREVIEW_MJPEG_URL}
                  alt="Preview da câmera"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-white text-sm text-center px-4">Clique em "Iniciar" para conectar</p>
              )}

              {isPlaying && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {connected ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">ANALISANDO</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-medium">CONECTANDO</span>
                    </>
                  )}
                </div>
              )}

              {isPlaying && connected && (
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span className="font-semibold">{currentGaze.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Button onClick={handlePlayPause} size="sm" className="flex items-center gap-1">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pausar" : "Iniciar"}
              </Button>
              <Button onClick={handleReset} size="sm" variant="outline">Resetar</Button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Pessoas ativas</p>
                <p className="text-2xl font-bold" style={{ color: "#612cb5" }}>
                  {snapshot?.active_people ?? 0}
                </p>
              </div>
              <div className="p-2 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Taxa de captura</p>
                <p className="text-2xl font-bold" style={{ color: "#612cb5" }}>
                  {snapshot ? `${Math.round(snapshot.capture_rate * 100)}%` : "—"}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              {connected ? <Wifi className="w-3 h-3 text-green-600" /> : <WifiOff className="w-3 h-3" />}
              {snapshot
                ? `${snapshot.passersby} passaram · ${snapshot.stoppers} pararam`
                : "aguardando serviço"}
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {renderProductCard(
              left,
              currentGaze === "esquerda",
              "ring-4 ring-green-500",
              "bg-gradient-to-r from-green-500 to-emerald-600",
            )}
            {renderProductCard(
              right,
              currentGaze === "direita",
              "ring-4 ring-blue-500",
              "bg-gradient-to-r from-blue-500 to-indigo-600",
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <PersonScatterChart sessions={snapshot?.persons ?? []} />

          <Card className="p-3 md:p-4">
            <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Análise em Tempo Real</h3>
            <p className="text-xs text-muted-foreground mb-2 md:mb-4">
              Correlação entre atenção, emoção e produto ao longo do tempo
            </p>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chart} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 10 }}
                  label={{ value: "Tempo (s)", position: "insideBottom", offset: -5, fontSize: 10 }}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} width={35} domain={[0, 100]}
                  label={{ value: "Atenção (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} width={35} domain={[0, 100]}
                  label={{ value: "Emoção", angle: 90, position: "insideRight", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #ccc", fontSize: "11px" }}
                  formatter={(value: number, name: string, props: { payload?: { emocao?: string; produto?: string } }) => {
                    if (name === "Atenção (%)") return [`${Number(value).toFixed(1)}%`, "Atenção"];
                    if (name === "Emoção")
                      return [`${emotionLabel(props.payload?.emocao ?? "")} (${Number(value).toFixed(0)})`, "Emoção"];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Tempo: ${label}s`}
                />
                <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }} iconSize={8} />
                <Line yAxisId="left" type="monotone" dataKey="atencao" stroke="#3b82f6" strokeWidth={2} name="Atenção (%)" dot={{ r: 2 }} />
                <Line yAxisId="right" type="monotone" dataKey="emocaoValor" stroke="#22c55e" strokeWidth={2} name="Emoção" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-2 md:mt-4 grid grid-cols-2 gap-2">
              {products.map((p, i) => (
                <div key={p.id} className={`p-2 rounded ${i === 0 ? "bg-green-50" : "bg-blue-50"}`}>
                  <h4 className={`font-semibold text-xs md:text-sm ${i === 0 ? "text-green-900" : "text-blue-900"}`}>
                    {p.name}
                  </h4>
                  <div className={`text-xs ${i === 0 ? "text-green-700" : "text-blue-700"}`}>
                    {chart.filter((d) => d.produto_id === p.id).length} registros
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemonstracaoAoVivo;
