// Hooks react-query para o serviço SenseHub Vision + feed ao vivo por WebSocket.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  CameraSlot,
  LiveSnapshot,
  VISION_WS_URL,
  visionApi,
} from "@/lib/visionApi";

type Range = { from?: string; to?: string };

const REFETCH = 15_000;

export function useVisionHealth() {
  return useQuery({
    queryKey: ["vision", "health"],
    queryFn: visionApi.health,
    refetchInterval: 10_000,
    retry: false,
  });
}

export function useProducts() {
  return useQuery({ queryKey: ["vision", "products"], queryFn: visionApi.products, retry: 1 });
}

export function useOverview(range: Range = {}) {
  return useQuery({
    queryKey: ["vision", "overview", range],
    queryFn: () => visionApi.overview(range),
    refetchInterval: REFETCH,
    retry: 1,
  });
}

export function useProductMetrics(range: Range = {}) {
  return useQuery({
    queryKey: ["vision", "product-metrics", range],
    queryFn: () => visionApi.productMetrics(range),
    refetchInterval: REFETCH,
    retry: 1,
  });
}

export function useDemographics(range: Range = {}) {
  return useQuery({
    queryKey: ["vision", "demographics", range],
    queryFn: () => visionApi.demographics(range),
    refetchInterval: REFETCH,
    retry: 1,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ["vision", "insights"],
    queryFn: visionApi.insights,
    refetchInterval: REFETCH,
    retry: 1,
  });
}

export function useProductMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["vision", "products"] });
    qc.invalidateQueries({ queryKey: ["vision", "product-metrics"] });
  };
  return {
    create: useMutation({
      mutationFn: (v: { name: string; image?: File | null }) =>
        visionApi.createProduct(v.name, v.image),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: (v: { id: string; name?: string; image?: File | null }) =>
        visionApi.updateProduct(v.id, v.name, v.image),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => visionApi.deleteProduct(id),
      onSuccess: invalidate,
    }),
  };
}

export function useCameraMode() {
  return useQuery({ queryKey: ["vision", "camera-mode"], queryFn: visionApi.cameraMode, retry: 1 });
}

export function useCameras() {
  return useQuery({
    queryKey: ["vision", "cameras"],
    queryFn: visionApi.cameras,
    refetchInterval: 10_000,
    retry: 1,
  });
}

export function useCameraMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["vision", "cameras"] });
    qc.invalidateQueries({ queryKey: ["vision", "products"] });
  };
  return {
    save: useMutation({
      mutationFn: (v: { slot: number; body: Partial<CameraSlot> & { password?: string } }) =>
        visionApi.saveCamera(v.slot, v.body),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (slot: number) => visionApi.deleteCamera(slot),
      onSuccess: invalidate,
    }),
    test: useMutation({
      mutationFn: (v: { slot: number; body?: Partial<CameraSlot> & { password?: string } }) =>
        visionApi.testCamera(v.slot, v.body),
    }),
    reload: useMutation({ mutationFn: visionApi.reloadCameras, onSuccess: invalidate }),
  };
}

export type ChartPoint = {
  timestamp: number;
  produto: string;
  produto_id: string;
  atencao: number;
  emocao: string;
  emocaoValor: number;
};

/**
 * Assina /ws/live. `active` controla a conexão (botão Iniciar/Pausar da demo).
 * Acumula os chart_point num histórico local para o gráfico de linha.
 */
export function useLiveFeed(active: boolean) {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const lastChartTs = useRef<number>(-1);

  useEffect(() => {
    if (!active) {
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
      return;
    }

    let stopped = false;
    let retry: ReturnType<typeof setTimeout>;

    const connect = () => {
      if (stopped) return;
      const ws = new WebSocket(`${VISION_WS_URL}/ws/live`);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        if (!stopped) retry = setTimeout(connect, 2000);
      };
      ws.onerror = () => ws.close();
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as LiveSnapshot;
          setSnapshot(data);
          const cp = data.chart_point;
          if (cp && cp.timestamp !== lastChartTs.current) {
            lastChartTs.current = cp.timestamp;
            setChart((prev) => [...prev.slice(-120), cp]);
          }
        } catch {
          /* ignora frame malformado */
        }
      };
    };

    connect();
    return () => {
      stopped = true;
      clearTimeout(retry);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [active]);

  const resetChart = () => {
    setChart([]);
    lastChartTs.current = -1;
  };

  return { snapshot, chart, connected, resetChart };
}
