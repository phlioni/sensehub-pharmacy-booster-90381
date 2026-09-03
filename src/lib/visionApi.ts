// Cliente do serviço SenseHub Vision (Python). Toda métrica do dashboard vem daqui.

export const VISION_API_URL =
  import.meta.env.VITE_VISION_API_URL ?? "http://localhost:8000";
export const VISION_WS_URL =
  import.meta.env.VITE_VISION_WS_URL ?? "ws://localhost:8000";

export const PREVIEW_MJPEG_URL = `${VISION_API_URL}/preview.mjpg`;

export type Product = {
  id: string;
  name: string;
  gaze: string | null;
  bbox: [number, number, number, number] | null;
  camera_slot: number | null;
  source: "yaml" | "ui";
  has_image: boolean;
  image_url: string | null;
  target_demographic: { age: [number, number]; gender: string };
};

export const productImageUrl = (p: Product) =>
  p.image_url ? `${VISION_API_URL}${p.image_url}` : null;

export type CameraMode = { mode: "webcam" | "ip"; max_ip_cameras: number };

export type CameraSlot = {
  slot: number;
  configured: boolean;
  enabled: boolean;
  name: string;
  connection: "rtsp" | "onvif";
  host: string;
  port: number;
  username: string;
  has_password: boolean;
  rtsp_path: string;
  rtsp_transport: "tcp" | "udp";
  onvif_profile: string;
  product_id: string | null;
};

export type CameraTestResult =
  | { ok: true; width: number; height: number; source: string }
  | { ok: false; error: string; source: string };

export type CameraStatus = {
  mode: "webcam" | "ip";
  cameras: {
    slot: number;
    label: string;
    connected: boolean;
    product_id: string | null;
    error: string | null;
  }[];
};

export type Overview = {
  scope: "live" | "history";
  passersby: number;
  stoppers: number;
  capture_rate: number;
  unique_visitors: number;
  avg_attention: number;
  avg_dwell_ms: number;
  valence_split: { positiva: number; neutra: number; negativa: number };
  cold_products: string[];
};

export type ProductMetric = {
  id: string;
  name: string;
  unique_viewers: number;
  stoppers: number;
  avg_dwell_ms: number;
  capture_rate: number;
  avg_attention: number;
  emotions: Record<string, number>;
  emotions_pt: Record<string, number>;
  valence: Record<string, number>;
  viewers_by_emotion: Record<string, number>;
  dominant_emotion: string;
  dominant_emotion_pt: string;
};

export type DemographicsMetric = {
  id: string;
  name: string;
  target: { age: [number, number]; gender: string };
  distribution: { age_bucket: string; gender: string; count: number }[];
  on_target_pct: number;
  off_target_pct: number;
  samples: number;
};

export type Insight = {
  pillar: "retencao" | "captura" | "demografia" | "valencia" | "promocao";
  type: string;
  severity: "info" | "warning" | "action";
  product_id: string;
  title: string;
  message: string;
  evidence: Record<string, number>;
};

export type LiveSnapshot = {
  ts: number;
  session_id: string;
  active_people: number;
  visitors_total: number;
  passersby: number;
  stoppers: number;
  capture_rate: number;
  current_gaze: string;
  products: {
    id: string;
    name: string;
    current_viewers: number;
    unique_viewers: number;
    stoppers: number;
    dwell_ms_total: number;
    avg_dwell_ms: number;
    avg_attention: number;
    emotions: Record<string, number>;
    valence: Record<string, number>;
    viewers_by_emotion: Record<string, number>;
    dominant_emotion: string;
    show_promo: boolean;
    promo_kind: "highlight" | "review" | null;
  }[];
  persons: {
    id: number;
    startTime: number;
    leftTime: number;
    rightTime: number;
    dominantEmotion: string;
    stopped: boolean;
  }[];
  chart_point: {
    timestamp: number;
    produto: string;
    produto_id: string;
    atencao: number;
    emocao: string;
    emocaoValor: number;
  } | null;
};

async function get<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(path, VISION_API_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Vision API ${res.status} em ${path}`);
  return res.json() as Promise<T>;
}

type Range = { from?: string; to?: string };

export const visionApi = {
  health: () =>
    get<{
      status: string;
      camera_connected: boolean;
      camera_mode: "webcam" | "ip";
      cameras: { slot: number; label: string; connected: boolean; product_id: string | null; error: string | null }[];
      redis: boolean;
      demographics: boolean;
      session_id: string;
    }>("/health"),
  products: () => get<Product[]>("/api/products"),
  overview: (r: Range = {}) => get<Overview>("/api/metrics/overview", r),
  productMetrics: (r: Range = {}) => get<ProductMetric[]>("/api/metrics/products", r),
  demographics: (r: Range = {}) => get<DemographicsMetric[]>("/api/metrics/demographics", r),
  insights: () => get<Insight[]>("/api/metrics/insights"),
  resetSession: () => post<{ session_id: string }>("/api/session/reset"),

  createProduct: (name: string, image?: File | null) => {
    const fd = new FormData();
    fd.append("name", name);
    if (image) fd.append("image", image);
    return form<{ id: string; name: string }>("/api/products", "POST", fd);
  },
  updateProduct: (id: string, name?: string, image?: File | null) => {
    const fd = new FormData();
    if (name) fd.append("name", name);
    if (image) fd.append("image", image);
    return form<{ id: string; name: string }>(`/api/products/${id}`, "PUT", fd);
  },
  deleteProduct: (id: string) => del<{ ok: true }>(`/api/products/${id}`),

  cameraMode: () => get<CameraMode>("/api/camera/mode"),
  cameras: () => get<CameraSlot[]>("/api/cameras"),
  saveCamera: (slot: number, body: Partial<CameraSlot> & { password?: string }) =>
    put<CameraSlot>(`/api/cameras/${slot}`, body),
  deleteCamera: (slot: number) => del<{ ok: true }>(`/api/cameras/${slot}`),
  testCamera: (slot: number, body?: Partial<CameraSlot> & { password?: string }) =>
    post<CameraTestResult>(`/api/cameras/${slot}/test`, body ?? {}),
  reloadCameras: () => post<CameraStatus>("/api/cameras/reload"),
};

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${VISION_API_URL}${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${VISION_API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${VISION_API_URL}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function form<T>(path: string, method: "POST" | "PUT", body: FormData): Promise<T> {
  const res = await fetch(`${VISION_API_URL}${path}`, { method, body });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const EMOTION_LABEL: Record<string, string> = {
  happy: "Feliz",
  surprise: "Surpreso",
  neutral: "Neutro",
  sad: "Triste",
  fear: "Temeroso",
  disgust: "Desgosto",
  angry: "Bravo",
};
