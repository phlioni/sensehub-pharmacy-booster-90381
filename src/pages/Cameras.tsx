import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Camera, CheckCircle2, ImagePlus, Loader2, Package, Plug, RefreshCw, Trash2, XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServiceOfflineNotice } from "@/components/dashboard/ServiceStateNotice";
import {
  useCameraMode, useCameras, useCameraMutations, useProducts, useProductMutations, useVisionHealth,
} from "@/hooks/useVisionMetrics";
import { productImageUrl, type CameraSlot, type Product } from "@/lib/visionApi";

type Draft = Partial<CameraSlot> & { password?: string };

const CameraSlotCard = ({
  base,
  status,
  products,
}: {
  base: CameraSlot;
  status?: { connected: boolean; error: string | null; label: string };
  products: Product[];
}) => {
  const { toast } = useToast();
  const { save, remove, test } = useCameraMutations();
  const [draft, setDraft] = useState<Draft>({});
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => setDraft({}), [base.slot]);

  const v = useMemo(() => ({ ...base, ...draft }), [base, draft]);
  const set = (patch: Draft) => setDraft((d) => ({ ...d, ...patch }));

  const body: Draft = {
    name: v.name,
    enabled: v.enabled,
    connection: v.connection,
    host: v.host,
    port: Number(v.port) || 554,
    username: v.username,
    rtsp_path: v.rtsp_path,
    rtsp_transport: v.rtsp_transport,
    onvif_profile: v.onvif_profile,
    product_id: v.product_id ?? null,
    ...(draft.password ? { password: draft.password } : {}),
  };

  const onSave = async () => {
    await save.mutateAsync({ slot: base.slot, body });
    setDraft({});
    toast({ title: `Câmera ${base.slot} salva` });
  };

  const onTest = async () => {
    setTestResult(null);
    const r = await test.mutateAsync({ slot: base.slot, body });
    if ("error" in r) setTestResult(`Falhou — ${r.error}`);
    else setTestResult(`OK — ${r.width}×${r.height} (${r.source})`);
  };

  const onClear = async () => {
    await remove.mutateAsync(base.slot);
    setDraft({});
    setTestResult(null);
    toast({ title: `Slot ${base.slot} limpo` });
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Câmera {base.slot}</h3>
          {status && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                status.connected
                  ? "bg-success-light text-success"
                  : base.configured
                    ? "bg-alert-light text-alert"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {status.connected ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {status.connected ? "conectada" : base.configured ? "sem sinal" : "vazia"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`en-${base.slot}`} className="text-xs text-muted-foreground">Ativa</Label>
          <Switch
            id={`en-${base.slot}`}
            checked={!!v.enabled}
            onCheckedChange={(c) => set({ enabled: c })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label className="text-xs">Nome</Label>
          <Input value={v.name} onChange={(e) => set({ name: e.target.value })} placeholder={`Câmera ${base.slot}`} />
        </div>

        <div>
          <Label className="text-xs">Protocolo</Label>
          <Select value={v.connection} onValueChange={(c) => set({ connection: c as "rtsp" | "onvif" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="rtsp">RTSP</SelectItem>
              <SelectItem value="onvif">ONVIF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Produto vinculado</Label>
          <div className="flex items-center gap-2">
            {(() => {
              const bound = products.find((p) => p.id === v.product_id);
              const src = bound ? productImageUrl(bound) : null;
              return src ? (
                <img src={src} alt="" className="w-9 h-9 rounded object-cover border border-border" />
              ) : null;
            })()}
            <Select
              value={v.product_id ?? "none"}
              onValueChange={(p) => set({ product_id: p === "none" ? null : p })}
            >
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="none">— nenhum —</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs">IP / host</Label>
          <Input value={v.host} onChange={(e) => set({ host: e.target.value })} placeholder="192.168.0.50" />
        </div>
        <div>
          <Label className="text-xs">Porta</Label>
          <Input
            type="number"
            value={v.port}
            onChange={(e) => set({ port: Number(e.target.value) })}
            placeholder={v.connection === "onvif" ? "80" : "554"}
          />
        </div>

        <div>
          <Label className="text-xs">Usuário</Label>
          <Input value={v.username} onChange={(e) => set({ username: e.target.value })} placeholder="admin" />
        </div>
        <div>
          <Label className="text-xs">Senha</Label>
          <Input
            type="password"
            value={draft.password ?? ""}
            onChange={(e) => set({ password: e.target.value })}
            placeholder={base.has_password ? "•••••• (mantém a atual)" : ""}
          />
        </div>

        {v.connection === "rtsp" ? (
          <>
            <div>
              <Label className="text-xs">Caminho RTSP</Label>
              <Input
                value={v.rtsp_path}
                onChange={(e) => set({ rtsp_path: e.target.value })}
                placeholder="/Streaming/Channels/101"
              />
            </div>
            <div>
              <Label className="text-xs">Transporte</Label>
              <Select value={v.rtsp_transport} onValueChange={(t) => set({ rtsp_transport: t as "tcp" | "udp" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div className="col-span-2">
            <Label className="text-xs">Profile ONVIF (opcional)</Label>
            <Input
              value={v.onvif_profile}
              onChange={(e) => set({ onvif_profile: e.target.value })}
              placeholder="vazio = escolha automática"
            />
          </div>
        )}
      </div>

      {(testResult || status?.error) && (
        <p className={`text-xs ${testResult?.startsWith("OK") ? "text-success" : "text-alert"}`}>
          {testResult ?? `sinal: ${status?.error}`}
        </p>
      )}

      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={save.isPending}>
          {save.isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />} Salvar
        </Button>
        <Button size="sm" variant="outline" onClick={onTest} disabled={test.isPending}>
          {test.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Plug className="w-3 h-3 mr-1" />}
          Testar
        </Button>
        {base.configured && (
          <Button size="sm" variant="ghost" onClick={onClear} disabled={remove.isPending}>
            Limpar
          </Button>
        )}
      </div>
    </Card>
  );
};

const ProductsManager = () => {
  const { toast } = useToast();
  const products = useProducts();
  const { create, remove } = useProductMutations();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const add = async () => {
    if (!name.trim()) return;
    await create.mutateAsync({ name: name.trim(), image: file });
    setName("");
    setFile(null);
    toast({ title: "Produto cadastrado" });
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Produtos monitorados</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {(products.data ?? []).map((p) => {
          const src = productImageUrl(p);
          return (
            <div key={p.id} className="flex items-center gap-2 border border-border rounded-lg p-2 pr-3">
              <div className="w-10 h-10 rounded bg-muted overflow-hidden flex items-center justify-center">
                {src ? (
                  <img src={src} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.source === "yaml" ? "config" : "cadastrado"}
                  {p.camera_slot ? ` · câmera ${p.camera_slot}` : ""}
                </p>
              </div>
              {p.source === "ui" && (
                <button
                  onClick={async () => {
                    await remove.mutateAsync(p.id);
                    toast({ title: "Produto removido" });
                  }}
                  className="text-muted-foreground hover:text-alert"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-border">
        <div className="flex-1 min-w-[180px]">
          <Label className="text-xs">Nome do produto</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Tênis Nike Revolution" />
        </div>
        <div>
          <Label className="text-xs">Foto (opcional)</Label>
          <label className="flex items-center gap-2 h-10 px-3 border border-border rounded-md cursor-pointer bg-card text-sm text-muted-foreground hover:bg-muted/50">
            <ImagePlus className="w-4 h-4" />
            {file ? file.name.slice(0, 18) : "Escolher imagem"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <Button onClick={add} disabled={create.isPending || !name.trim()}>
          {create.isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />} Cadastrar
        </Button>
      </div>
    </Card>
  );
};

const Cameras = () => {
  const { toast } = useToast();
  const mode = useCameraMode();
  const cameras = useCameras();
  const products = useProducts();
  const health = useVisionHealth();
  const { reload } = useCameraMutations();

  const offline = cameras.isError && mode.isError;
  const statusBySlot = new Map(
    (health.data?.cameras ?? []).map((c) => [c.slot, c]),
  );

  const applyAndConnect = async () => {
    const st = await reload.mutateAsync();
    const connected = st.cameras.filter((c) => c.connected).length;
    toast({
      title: "Câmeras recarregadas",
      description: `Modo ${st.mode} · ${connected}/${st.cameras.length} conectada(s)`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Câmeras</h1>
          <p className="text-muted-foreground">
            Endereços das câmeras IP e vínculo com os produtos. Cada servidor suporta até{" "}
            {mode.data?.max_ip_cameras ?? 4} câmeras — uma por produto.
          </p>
        </div>
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${
            mode.data?.mode === "ip" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          modo: {mode.data?.mode ?? "…"}
        </span>
      </div>

      {offline && <ServiceOfflineNotice detail={String(cameras.error)} />}

      <ProductsManager />

      {mode.data?.mode === "webcam" && (
        <Card className="p-4 border-primary/30 bg-accent text-sm text-muted-foreground">
          O serviço está em <strong>modo webcam</strong>. Você pode cadastrar as câmeras IP agora;
          elas só entram em uso quando o serviço subir com <code>CAMERA_MODE=ip</code> (ou{" "}
          <code>camera.mode: ip</code> no <code>products.yaml</code>).
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {(cameras.data ?? []).map((c) => (
          <CameraSlotCard
            key={c.slot}
            base={c}
            status={statusBySlot.get(c.slot)}
            products={products.data ?? []}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={applyAndConnect} disabled={reload.isPending} className="gap-2">
          {reload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Aplicar e conectar
        </Button>
        <p className="text-sm text-muted-foreground">
          Reconecta as câmeras habilitadas sem reiniciar o serviço.
        </p>
      </div>
    </div>
  );
};

export default Cameras;
