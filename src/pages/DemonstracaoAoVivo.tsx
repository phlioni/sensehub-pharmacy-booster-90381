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
import PersonScatterChart from "@/components/demo/PersonScatterChart";

type PersonSession = {
  id: number;
  startTime: number;
  leftTime: number;
  rightTime: number;
  dominantEmotion: string;
};

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
  const [personSessions, setPersonSessions] = useState<PersonSession[]>([]);
  const currentPersonRef = useRef<number>(1);
  const lastFaceDetectedRef = useRef<number>(Date.now());
  const faceAbsentCountRef = useRef<number>(0);
  const lastFaceDescriptorRef = useRef<Float32Array | null>(null);
  const newPersonConfirmCountRef = useRef<number>(0);
  const candidateDescriptorRef = useRef<Float32Array | null>(null);
  const emotionHistoryRef = useRef<string[]>([]);
  const expressionSmoothRef = useRef<Record<string, number>>({
    happy: 0, sad: 0, angry: 0, surprised: 0, neutral: 0, disgusted: 0, fearful: 0
  });

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
        .withFaceExpressions()
        .withFaceDescriptor();

      if (!detections) {
        console.log('⚠️ Nenhum rosto detectado');
        faceAbsentCountRef.current += 1;
        // Se não detectar rosto por 5 segundos, considera nova pessoa
        if (faceAbsentCountRef.current >= 5) {
          currentPersonRef.current += 1;
          faceAbsentCountRef.current = 0;
          lastFaceDescriptorRef.current = null;
          candidateDescriptorRef.current = null;
          newPersonConfirmCountRef.current = 0;
          console.log('👤 Próxima pessoa terá ID:', currentPersonRef.current);
        }
        return;
      }
      
      // Comparar face descriptor para detectar nova pessoa
      const currentDescriptor = detections.descriptor;
      const DISTANCE_THRESHOLD = 0.6; // Limiar para considerar pessoa diferente
      const CONFIRMATION_FRAMES = 3; // Frames consecutivos para confirmar nova pessoa
      
      if (lastFaceDescriptorRef.current) {
        const distance = faceapi.euclideanDistance(lastFaceDescriptorRef.current, currentDescriptor);
        console.log('📏 Distância entre rostos:', distance.toFixed(3));
        
        if (distance > DISTANCE_THRESHOLD) {
          // Possível nova pessoa - verificar se é consistente
          if (candidateDescriptorRef.current) {
            const candidateDistance = faceapi.euclideanDistance(candidateDescriptorRef.current, currentDescriptor);
            console.log('📏 Distância do candidato:', candidateDistance.toFixed(3));
            
            if (candidateDistance < 0.4) {
              // Mesma pessoa candidata detectada novamente
              newPersonConfirmCountRef.current += 1;
              console.log('🔍 Confirmações de nova pessoa:', newPersonConfirmCountRef.current);
              
              if (newPersonConfirmCountRef.current >= CONFIRMATION_FRAMES) {
                // Confirmado: é uma nova pessoa
                currentPersonRef.current += 1;
                lastFaceDescriptorRef.current = currentDescriptor;
                candidateDescriptorRef.current = null;
                newPersonConfirmCountRef.current = 0;
                console.log('✅ Nova pessoa CONFIRMADA! ID:', currentPersonRef.current);
              }
            } else {
              // Candidato diferente - reiniciar
              candidateDescriptorRef.current = currentDescriptor;
              newPersonConfirmCountRef.current = 1;
            }
          } else {
            // Primeiro frame de possível nova pessoa
            candidateDescriptorRef.current = currentDescriptor;
            newPersonConfirmCountRef.current = 1;
            console.log('🔍 Candidato a nova pessoa detectado');
          }
        } else {
          // Mesma pessoa - resetar contadores de candidato
          candidateDescriptorRef.current = null;
          newPersonConfirmCountRef.current = 0;
          lastFaceDescriptorRef.current = currentDescriptor; // Atualizar descriptor
        }
      } else {
        // Primeiro rosto detectado
        lastFaceDescriptorRef.current = currentDescriptor;
      }
      
      // Rosto detectado - resetar contador de ausência
      const personId = currentPersonRef.current;
      faceAbsentCountRef.current = 0;
      lastFaceDetectedRef.current = Date.now();
      
      // Registrar pessoa na primeira detecção
      setPersonSessions(prev => {
        const exists = prev.find(p => p.id === personId);
        if (!exists) {
          console.log('👤 Nova pessoa registrada:', personId);
          return [...prev, { 
            id: personId, 
            startTime: Math.floor((Date.now() - startTimeRef.current) / 1000), 
            leftTime: 0, 
            rightTime: 0, 
            dominantEmotion: 'NEUTRO' 
          }];
        }
        return prev;
      });

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
      
      // INVERTIDO: a câmera é espelhada, então direita real = esquerda na imagem
      if (gazeOffset > threshold) {
        direction = "esquerda"; // Usuário olhando para DIREITA dele (esquerda na tela)
      } else if (gazeOffset < -threshold) {
        direction = "direita"; // Usuário olhando para ESQUERDA dele (direita na tela)
      } else {
        direction = "centro";
      }

      console.log('👁️ Direção do olhar:', direction, 'offset:', gazeOffset.toFixed(2));
      setCurrentGaze(direction);

      const expressions = detections.expressions;
      
      // Suavizar expressões com média móvel exponencial (EMA)
      const smoothingFactor = 0.4; // Maior = mais responsivo, menor = mais suave
      const smoothedExpressions: Record<string, number> = {};
      
      Object.entries(expressions).forEach(([key, value]) => {
        const prevValue = expressionSmoothRef.current[key] || 0;
        const newValue = prevValue * (1 - smoothingFactor) + (value as number) * smoothingFactor;
        smoothedExpressions[key] = newValue;
        expressionSmoothRef.current[key] = newValue;
      });
      
      console.log('📊 Expressões suavizadas:', Object.entries(smoothedExpressions).map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`).join(', '));
      
      // Encontrar emoção dominante com threshold mínimo
      const MIN_CONFIDENCE_THRESHOLD = 0.15; // Pelo menos 15% de confiança
      const expressionEntries = Object.entries(smoothedExpressions);
      let dominantExpression = expressionEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      
      // Se a confiança for muito baixa, considerar neutro
      if (dominantExpression[1] < MIN_CONFIDENCE_THRESHOLD) {
        dominantExpression = ['neutral', smoothedExpressions['neutral'] || 0.5];
      }
      
      const emotionKey = dominantExpression[0];
      const confidence = dominantExpression[1] * 100;
      
      // Traduzir emoções para português
      const emotionTranslation: Record<string, string> = {
        'happy': 'FELIZ',
        'sad': 'TRISTE',
        'angry': 'BRAVO',
        'surprised': 'SURPRESO',
        'neutral': 'NEUTRO',
        'disgusted': 'DESGOSTOSO',
        'fearful': 'TEMEROSO'
      };
      
      const rawEmotion = emotionTranslation[emotionKey] || 'NEUTRO';
      
      // Estabilizar emoção com histórico (evitar oscilações rápidas)
      emotionHistoryRef.current.push(rawEmotion);
      if (emotionHistoryRef.current.length > 3) {
        emotionHistoryRef.current.shift();
      }
      
      // Usar emoção mais frequente no histórico
      const emotionCounts: Record<string, number> = {};
      emotionHistoryRef.current.forEach(e => {
        emotionCounts[e] = (emotionCounts[e] || 0) + 1;
      });
      const emotion = Object.entries(emotionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      console.log('😊 Emoção detectada:', emotion, 'confiança:', confidence.toFixed(1) + '%', 'histórico:', emotionHistoryRef.current.join(','));
      
      // Map emotion to numeric value for chart
      const emotionMap: Record<string, number> = {
        'FELIZ': 100,
        'SURPRESO': 80,
        'NEUTRO': 50,
        'TRISTE': 30,
        'BRAVO': 10,
        'DESGOSTOSO': 20,
        'TEMEROSO': 40
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
        
        // Atualizar sessão da pessoa
        setPersonSessions(prev => {
          const existing = prev.find(p => p.id === personId);
          if (existing) {
            return prev.map(p => p.id === personId 
              ? { ...p, leftTime: p.leftTime + 1, dominantEmotion: emotion }
              : p
            );
          }
          return [...prev, { id: personId, startTime: currentTime, leftTime: 1, rightTime: 0, dominantEmotion: emotion }];
        });
        
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
        
        // Atualizar sessão da pessoa
        setPersonSessions(prev => {
          const existing = prev.find(p => p.id === personId);
          if (existing) {
            return prev.map(p => p.id === personId 
              ? { ...p, rightTime: p.rightTime + 1, dominantEmotion: emotion }
              : p
            );
          }
          return [...prev, { id: personId, startTime: currentTime, leftTime: 0, rightTime: 1, dominantEmotion: emotion }];
        });
        
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
    setPersonSessions([]);
    currentPersonRef.current = 1;
    faceAbsentCountRef.current = 0;
    lastFaceDescriptorRef.current = null;
    candidateDescriptorRef.current = null;
    newPersonConfirmCountRef.current = 0;
    emotionHistoryRef.current = [];
    expressionSmoothRef.current = {
      happy: 0, sad: 0, angry: 0, surprised: 0, neutral: 0, disgusted: 0, fearful: 0
    };
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
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    console.log('📊 Contagem de emoções:', counts, 'Predominante:', sorted[0]);
    return sorted.length > 0 ? sorted[0][0] : "---";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - Single Row */}
        <div className="relative flex items-center mb-6">
          {/* Left: SenseHub */}
          <div className="text-left">
            <h1 className="text-2xl font-bold" style={{ color: '#612cb5' }}>SenseHub</h1>
            <p className="text-xs text-muted-foreground">
              by <span style={{ color: '#612cb5' }} className="font-semibold">Mosten</span>
            </p>
          </div>

          {/* Center: Sistema de Análise */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-3xl font-bold text-foreground">Sistema de Análise de Interesse</h2>
            <p className="text-sm text-muted-foreground">Rastreamento de olhar e emoções em tempo real</p>
          </div>
        </div>

        {/* Main Content: Camera left, Sneakers right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camera Section - Left */}
          <Card className="p-4 lg:col-span-1">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden mb-3" style={{ height: '280px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />

              {isPlaying && cameraActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">ANALISANDO</span>
                </div>
              )}

              {isPlaying && cameraActive && (
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span className="font-semibold">{currentGaze.toUpperCase()}</span>
                  </div>
                </div>
              )}
              
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-sm text-center px-4">Clique em "Iniciar" para ativar</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Button
                onClick={handlePlayPause}
                size="sm"
                className="flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pausar" : "Iniciar"}
              </Button>
              <Button
                onClick={handleReset}
                size="sm"
                variant="outline"
              >
                Resetar
              </Button>
            </div>
            
            {/* Person Counter */}
            <div className="mt-3 p-2 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Pessoas detectadas</p>
              <p className="text-2xl font-bold" style={{ color: '#612cb5' }}>{personSessions.length}</p>
            </div>
          </Card>

          {/* Sneakers Section - Right */}
          <div className="lg:col-span-2 space-y-4">
            {/* Adidas Sneaker */}
            <Card className="p-4 relative">
              <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                currentGaze === "esquerda" ? "ring-4 ring-green-500" : ""
              }`} />
              <div className="relative z-10 flex gap-4">
                <img 
                  src={tenisEsquerdo} 
                  alt="Tênis Esquerdo" 
                  className="w-32 h-32 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Adidas Campus Green</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">Tempo:</span>
                      <p className="font-semibold">{leftSneaker.viewTime}s</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Atenção:</span>
                      <p className="font-semibold">{getAverageAttention(leftSneaker).toFixed(0)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Emoção:</span>
                      <p className="font-semibold">{getDominantEmotion(leftSneaker)}</p>
                    </div>
                  </div>
                  {leftSneaker.showPromo && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded text-white text-xs">
                      <p className="font-bold">🎉 10% de desconto!</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Nike Sneaker */}
            <Card className="p-4 relative">
              <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                currentGaze === "direita" ? "ring-4 ring-blue-500" : ""
              }`} />
              <div className="relative z-10 flex gap-4">
                <img 
                  src={tenisDireito} 
                  alt="Tênis Direito" 
                  className="w-32 h-32 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Nike Air Force 1 Low</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">Tempo:</span>
                      <p className="font-semibold">{rightSneaker.viewTime}s</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Atenção:</span>
                      <p className="font-semibold">{getAverageAttention(rightSneaker).toFixed(0)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Emoção:</span>
                      <p className="font-semibold">{getDominantEmotion(rightSneaker)}</p>
                    </div>
                  </div>
                  {rightSneaker.showPromo && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded text-white text-xs">
                      <p className="font-bold">🎉 10% de desconto!</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Person Scatter Chart */}
          <PersonScatterChart sessions={personSessions} />
          
          {/* Real-time Line Chart */}
          <Card className="p-3 md:p-4">
            <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Análise em Tempo Real</h3>
            <p className="text-xs text-muted-foreground mb-2 md:mb-4">
              Correlação entre interesse, emoção e tênis ao longo do tempo
            </p>
            
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  width={35}
                  label={{ value: 'Atenção (%)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  width={35}
                  label={{ value: 'Emoção', angle: 90, position: 'insideRight', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #ccc', fontSize: '11px' }}
                  formatter={(value: any, name: string, props: any) => {
                    if (name === 'Atenção (%)') return [`${Number(value).toFixed(1)}%`, 'Atenção'];
                    if (name === 'Emoção') {
                      const emocao = props.payload.emocao || 'NEUTRO';
                      const valor = Number(value).toFixed(0);
                      return [`${emocao} (${valor})`, 'Emoção'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Tempo: ${label}s`}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconSize={8} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="atencao" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Atenção (%)"
                  dot={{ r: 2 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="emocaoValor" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Emoção"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-2 md:mt-4 grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded">
                <h4 className="font-semibold text-blue-900 text-xs md:text-sm">Adidas Campus</h4>
                <div className="text-xs text-blue-700">
                  {chartData.filter(d => d.tenis === "Adidas Campus").length} registros
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <h4 className="font-semibold text-green-900 text-xs md:text-sm">Nike Air Force</h4>
                <div className="text-xs text-green-700">
                  {chartData.filter(d => d.tenis === "Nike Air Force").length} registros
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemonstracaoAoVivo;
