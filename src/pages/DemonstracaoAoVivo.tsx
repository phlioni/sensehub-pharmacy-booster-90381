import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { loadFaceModels } from "@/utils/faceAnalysis";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as faceapi from '@vladmandic/face-api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import tenisEsquerdo from "@/assets/tenis-esquerdo.webp";
import tenisDireito from "@/assets/tenis-direito.webp";

type SneakerData = {
  viewTime: number;
  emotions: string[];
  attentionLevels: number[];
  showPromo: boolean;
};

type ChartDataPoint = {
  timestamp: number;
  tenis: string;
  atencao: number;
  emocao: string;
  emocaoValor: number;
};

const DemonstracaoAoVivo = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentGaze, setCurrentGaze] = useState<"esquerda" | "direita" | "centro">("centro");
  
  const [leftSneaker, setLeftSneaker] = useState<SneakerData>({
    viewTime: 0,
    emotions: [],
    attentionLevels: [],
    showPromo: false,
  });
  
  const [rightSneaker, setRightSneaker] = useState<SneakerData>({
    viewTime: 0,
    emotions: [],
    attentionLevels: [],
    showPromo: false,
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gazeTimerRef = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const startCamera = async () => {
    try {
      console.log('🎥 Iniciando câmera e carregando modelos de IA...');
      
      toast({
        title: "Carregando IA",
        description: "Carregando modelos de análise facial...",
      });
      
      await loadFaceModels();
      console.log('✅ Modelos carregados com sucesso');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('✅ Stream de câmera obtido');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('✅ Vídeo carregado e pronto');
          videoRef.current?.play();
        };
        
        setCameraActive(true);
        
        toast({
          title: "Câmera ativada",
          description: "Sistema de rastreamento de olhar ativo",
        });
      }
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      toast({
        title: "Erro",
        description: "Erro ao acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const detectGazeDirection = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
      return;
    }

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections) {
        console.log('⚠️ Nenhum rosto detectado');
        return;
      }

      const landmarks = detections.landmarks;
      const nose = landmarks.getNose();
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();

      const faceBox = detections.detection.box;
      const faceCenterX = faceBox.x + faceBox.width / 2;

      const noseX = nose[3].x;
      const leftEyeCenter = leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length;
      const rightEyeCenter = rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length;
      const eyeCenterX = (leftEyeCenter + rightEyeCenter) / 2;

      const gazeOffset = noseX - eyeCenterX;
      const threshold = 5;

      let direction: "esquerda" | "direita" | "centro";
      
      if (gazeOffset > threshold) {
        direction = "direita";
      } else if (gazeOffset < -threshold) {
        direction = "esquerda";
      } else {
        direction = "centro";
      }

      console.log('👁️ Direção do olhar:', direction, 'offset:', gazeOffset.toFixed(2));
      setCurrentGaze(direction);

      const expressions = detections.expressions;
      const expressionEntries = Object.entries(expressions);
      const dominantExpression = expressionEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      const emotion = dominantExpression[0].toUpperCase();
      const confidence = dominantExpression[1] * 100;
      
      console.log('😊 Emoção detectada:', emotion, 'confiança:', confidence.toFixed(1) + '%');
      
      // Map emotion to numeric value for chart
      const emotionMap: Record<string, number> = {
        'HAPPY': 100,
        'SURPRISED': 80,
        'NEUTRAL': 50,
        'SAD': 30,
        'ANGRY': 10,
        'DISGUSTED': 20,
        'FEARFUL': 40
      };
      const emotionValue = emotionMap[emotion] || 50;
      
      const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (direction === "esquerda") {
        gazeTimerRef.current.left += 1;
        gazeTimerRef.current.right = 0;

        setLeftSneaker(prev => ({
          ...prev,
          viewTime: prev.viewTime + 1,
          emotions: [...prev.emotions, emotion],
          attentionLevels: [...prev.attentionLevels, confidence],
          showPromo: prev.viewTime + 1 >= 15,
        }));
        
        // Adicionar ao gráfico
        setChartData(prev => [...prev, {
          timestamp: currentTime,
          tenis: "Adidas Campus",
          atencao: confidence,
          emocao: emotion,
          emocaoValor: emotionValue
        }]);
        
        // Remove promo do outro tênis
        setRightSneaker(prev => ({
          ...prev,
          showPromo: false,
        }));
      } else if (direction === "direita") {
        gazeTimerRef.current.right += 1;
        gazeTimerRef.current.left = 0;

        setRightSneaker(prev => ({
          ...prev,
          viewTime: prev.viewTime + 1,
          emotions: [...prev.emotions, emotion],
          attentionLevels: [...prev.attentionLevels, confidence],
          showPromo: prev.viewTime + 1 >= 15,
        }));
        
        // Adicionar ao gráfico
        setChartData(prev => [...prev, {
          timestamp: currentTime,
          tenis: "Nike Air Force",
          atencao: confidence,
          emocao: emotion,
          emocaoValor: emotionValue
        }]);
        
        // Remove promo do outro tênis
        setLeftSneaker(prev => ({
          ...prev,
          showPromo: false,
        }));
      } else {
        gazeTimerRef.current.left = 0;
        gazeTimerRef.current.right = 0;
      }

    } catch (error) {
      console.error('❌ Erro na detecção de olhar:', error);
    }
  };

  useEffect(() => {
    console.log('📊 Analysis interval effect triggered:', { isPlaying, cameraActive });
    
    if (isPlaying && cameraActive) {
      console.log('✅ Iniciando análise contínua a cada 1 segundo');
      analysisIntervalRef.current = setInterval(() => {
        console.log('⏰ Executando análise agendada...');
        detectGazeDirection();
      }, 1000);
    } else {
      console.log('⏸️ Parando análise contínua');
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }

    return () => {
      if (analysisIntervalRef.current) {
        console.log('🧹 Limpando interval na desmontagem');
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isPlaying, cameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handlePlayPause = async () => {
    if (!isPlaying && !cameraActive) {
      await startCamera();
    } else if (isPlaying) {
      stopCamera();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setLeftSneaker({
      viewTime: 0,
      emotions: [],
      attentionLevels: [],
      showPromo: false,
    });
    setRightSneaker({
      viewTime: 0,
      emotions: [],
      attentionLevels: [],
      showPromo: false,
    });
    gazeTimerRef.current = { left: 0, right: 0 };
    setCurrentGaze("centro");
    setChartData([]);
    startTimeRef.current = Date.now();
  };

  const getAverageAttention = (data: SneakerData) => {
    if (data.attentionLevels.length === 0) return 0;
    return data.attentionLevels.reduce((a, b) => a + b, 0) / data.attentionLevels.length;
  };

  const getDominantEmotion = (data: SneakerData) => {
    if (data.emotions.length === 0) return "---";
    const counts: Record<string, number> = {};
    data.emotions.forEach(e => {
      counts[e] = (counts[e] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sistema de Análise de Interesse</h1>
          <p className="text-muted-foreground">Rastreamento de olhar e emoções em tempo real</p>
        </div>

        <Card className="p-6">
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden mb-4" style={{ height: '400px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {isPlaying && cameraActive && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">ANALISANDO</span>
              </div>
            )}

            {isPlaying && cameraActive && (
              <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">
                    Olhando para: <span className="text-primary">{currentGaze.toUpperCase()}</span>
                  </span>
                </div>
              </div>
            )}
            
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-lg">Clique em "Iniciar Análise" para ativar a câmera</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 justify-center">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? "Pausar" : "Iniciar Análise"}
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
            >
              Resetar
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 relative">
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              currentGaze === "esquerda" ? "ring-4 ring-primary" : ""
            }`} />
            <div className="relative z-10">
              <img 
                src={tenisEsquerdo} 
                alt="Tênis Esquerdo" 
                className="w-full h-64 object-contain mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Adidas Campus Green</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo de Visualização:</span>
                  <span className="font-semibold">{leftSneaker.viewTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atenção Média:</span>
                  <span className="font-semibold">{getAverageAttention(leftSneaker).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emoção Predominante:</span>
                  <span className="font-semibold">{getDominantEmotion(leftSneaker)}</span>
                </div>
              </div>

              {leftSneaker.showPromo && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white animate-fade-in">
                  <p className="font-bold text-lg mb-2">🎉 Oferta Especial!</p>
                  <p className="text-sm">
                    Vimos que você tem um grande interesse por esse tênis, se você entra na nossa loja agora mesmo ganha 10% de desconto nele!
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 relative">
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              currentGaze === "direita" ? "ring-4 ring-primary" : ""
            }`} />
            <div className="relative z-10">
              <img 
                src={tenisDireito} 
                alt="Tênis Direito" 
                className="w-full h-64 object-contain mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Nike Air Force 1 Low</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo de Visualização:</span>
                  <span className="font-semibold">{rightSneaker.viewTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atenção Média:</span>
                  <span className="font-semibold">{getAverageAttention(rightSneaker).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emoção Predominante:</span>
                  <span className="font-semibold">{getDominantEmotion(rightSneaker)}</span>
                </div>
              </div>

              {rightSneaker.showPromo && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white animate-fade-in">
                  <p className="font-bold text-lg mb-2">🎉 Oferta Especial!</p>
                  <p className="text-sm">
                    Vimos que você tem um grande interesse por esse tênis, se você entra na nossa loja agora mesmo ganha 10% de desconto nele!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Real-time Chart */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Análise em Tempo Real</h2>
          <p className="text-muted-foreground mb-6">
            Correlação entre interesse, emoção e tênis ao longo do tempo
          </p>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="timestamp" 
                label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Atenção (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Emoção (Intensidade)', angle: 90, position: 'insideRight' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #ccc' }}
                formatter={(value: any, name: string, props: any) => {
                  if (name === 'atencao') return [`${value.toFixed(1)}%`, 'Atenção'];
                  if (name === 'emocaoValor') return [`${props.payload.emocao}`, 'Emoção'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Tempo: ${label}s`}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="atencao" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Atenção (%)"
                dot={{ r: 3 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="emocaoValor" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Emoção"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Dados Adidas Campus</h3>
              <div className="text-sm text-blue-700">
                {chartData.filter(d => d.tenis === "Adidas Campus").length} registros
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Dados Nike Air Force</h3>
              <div className="text-sm text-green-700">
                {chartData.filter(d => d.tenis === "Nike Air Force").length} registros
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DemonstracaoAoVivo;
