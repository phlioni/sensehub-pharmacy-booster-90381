import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { loadFaceModels, analyzeFace } from "@/utils/faceAnalysis";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useToast } from "@/hooks/use-toast";

const DemonstracaoAoVivo = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("NEUTRA");
  const [emotionConfidence, setEmotionConfidence] = useState(0);
  const [attentionLevel, setAttentionLevel] = useState(0);
  const [emotionHistory, setEmotionHistory] = useState<any[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalDuration = 60; // 60 seconds for real analysis

  // Emotion mapping for display
  const getEmotionState = (emotion: string) => {
    const emotionMap: Record<string, { label: string; color: string; bgColor: string }> = {
      NEUTRA: { label: "NEUTRA", color: "text-muted-foreground", bgColor: "bg-muted" },
      CURIOSIDADE: { label: "CURIOSIDADE", color: "text-blue-600", bgColor: "bg-blue-50" },
      INTERESSE_POSITIVO: { label: "INTERESSE POSITIVO", color: "text-success", bgColor: "bg-success-light" },
      SURPRESA: { label: "SURPRESA", color: "text-yellow-600", bgColor: "bg-yellow-50" },
      PENSATIVA: { label: "PENSATIVA", color: "text-purple-600", bgColor: "bg-purple-50" },
    };
    return emotionMap[emotion] || emotionMap.NEUTRA;
  };

  // Generate data for the timeline chart from emotion history
  const generateChartData = () => {
    return emotionHistory.map((item, index) => ({
      time: index * 2, // Every 2 seconds
      curiosidade: item.emotion === 'CURIOSIDADE' ? item.confidence : 0,
      interesse: item.emotion === 'INTERESSE_POSITIVO' ? item.confidence : 0,
      neutralidade: item.emotion === 'NEUTRA' ? item.confidence : 0,
      atencao: item.attention
    }));
  };

  // Start camera
  const startCamera = async () => {
    try {
      console.log('🎥 Iniciando câmera e carregando modelos de IA...');
      
      toast({
        title: "Carregando IA",
        description: "Carregando modelos de análise facial...",
      });
      
      // Load face-api models first
      await loadFaceModels();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        
        toast({
          title: "Câmera ativada",
          description: "Análise facial com IA em tempo real",
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erro",
        description: "Erro ao acessar a câmera",
        variant: "destructive",
      });
    }
  };

  // Stop camera
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

  // Capture frame and analyze with face-api
  const captureAndAnalyze = async () => {
    if (!videoRef.current) {
      console.log('⚠️ Video ref não disponível');
      return;
    }

    const video = videoRef.current;
    
    if (!video.videoWidth || !video.videoHeight) {
      console.log('⚠️ Video ainda não está pronto:', video.readyState);
      return;
    }

    if (video.readyState < 2) {
      console.log('⚠️ Video readyState insuficiente:', video.readyState);
      return;
    }

    console.log('📸 Analisando frame...', { width: video.videoWidth, height: video.videoHeight });

    try {
      const analysis = await analyzeFace(video);

      if (!analysis) {
        console.log('⚠️ Nenhum rosto detectado no frame');
        return;
      }

      console.log('✅ Análise facial completa:', {
        emotion: analysis.emotion,
        confidence: analysis.confidence,
        attention: analysis.attention,
        expressions: analysis.expressions
      });

      setCurrentEmotion(analysis.emotion);
      setEmotionConfidence(analysis.confidence);
      setAttentionLevel(analysis.attention);
      
      setEmotionHistory(prev => [...prev, {
        emotion: analysis.emotion,
        confidence: analysis.confidence,
        attention: analysis.attention,
        timestamp: currentTime
      }]);

    } catch (error) {
      console.error('❌ Erro na análise facial:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < totalDuration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            setShowSummary(true);
            stopCamera();
            return totalDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  // Analysis interval effect - analyze every second for real-time detection
  useEffect(() => {
    if (isPlaying && cameraActive) {
      analysisIntervalRef.current = setInterval(() => {
        captureAndAnalyze();
      }, 1000); // Analyze every second with face-api
    } else {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isPlaying, cameraActive, currentTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handlePlayPause = async () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
      setShowSummary(false);
      setEmotionHistory([]);
    }
    
    if (!isPlaying && !cameraActive) {
      await startCamera();
    } else if (isPlaying) {
      stopCamera();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
    setShowSummary(false);
  };

  const emotionState = getEmotionState(currentEmotion);
  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Demonstração ao Vivo: Análise de Gôndola</h1>
        <p className="text-muted-foreground">Simulação de captura e análise emocional em tempo real</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Video Simulation */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Simulação da Captura</h2>
            
            {/* Video Feed */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Recording indicator */}
              {isPlaying && cameraActive && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">ANALISANDO</span>
                </div>
              )}
              
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-lg">Clique em "Iniciar Análise" para ativar a câmera</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {currentTime >= totalDuration ? "Reiniciar" : isPlaying ? "Pausar" : "Iniciar Análise"}
                </Button>
                <span className="text-sm text-muted-foreground font-mono">
                  {currentTime.toFixed(1)}s / {totalDuration}s
                </span>
              </div>
              
              {cameraActive && (
                <div className="text-sm text-blue-600 font-medium">
                  ✓ Câmera ativa - Análise em tempo real
                </div>
              )}
              
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={currentTime}
                onChange={(e) => handleSeek([parseFloat(e.target.value)])}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </Card>

          {/* Attention Level Widget */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Nível de Atenção
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Atenção Atual</span>
                <span className="font-semibold">{attentionLevel.toFixed(0)}%</span>
              </div>
              <Progress value={attentionLevel} className="h-3" />
            </div>
          </Card>
        </div>

        {/* Right Column: Real-time Analysis */}
        <div className="space-y-4">
          {/* Module 1: Instant Analysis */}
          <Card className={`p-6 transition-all duration-500 ${emotionState.bgColor}`}>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Análise Instantânea</h2>
            
            <div className={`text-4xl font-bold mb-4 transition-all duration-500 ${emotionState.color}`}>
              {emotionState.label}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confiança da IA</span>
                <span className="font-semibold">{emotionConfidence.toFixed(1)}%</span>
              </div>
              <Progress value={emotionConfidence} className="h-2" />
            </div>

            {/* Facial Landmark Graphic */}
            <div className="mt-4 p-4 bg-background/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Pontos Faciais Detectados</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-1 h-1 bg-primary rounded-full opacity-60" style={{
                    animation: isPlaying ? `pulse 2s ease-in-out ${i * 0.2}s infinite` : 'none'
                  }} />
                ))}
              </div>
            </div>
          </Card>

          {/* Module 2: Emotional Journey Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Jornada Emocional</h2>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -5 }}
                  domain={[0, 20]}
                />
                <YAxis 
                  label={{ value: 'Intensidade', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #ccc' }}
                  formatter={(value: number) => `${value.toFixed(0)}%`}
                />
                <Area 
                  type="monotone" 
                  dataKey="curiosidade" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Curiosidade"
                />
                <Area 
                  type="monotone" 
                  dataKey="interesse" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3}
                  name="Interesse Positivo"
                />
                <Area 
                  type="monotone" 
                  dataKey="neutralidade" 
                  stroke="#94a3b8" 
                  fill="#94a3b8" 
                  fillOpacity={0.2}
                  name="Neutralidade"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Module 3: Summary (appears after video ends) */}
          <Card className={`p-6 transition-all duration-500 ${showSummary ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <h2 className="text-lg font-semibold mb-4">Resumo da Interação</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tempo Total de Análise</p>
                <p className="text-2xl font-bold">{showSummary ? `${totalDuration} segundos` : "---"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Emoção Predominante</p>
                <p className="text-2xl font-bold text-success">
                  {showSummary && emotionHistory.length > 0
                    ? getEmotionState(
                        emotionHistory.reduce((acc, curr) => 
                          (emotionHistory.filter(e => e.emotion === curr.emotion).length > 
                           emotionHistory.filter(e => e.emotion === acc).length) ? curr.emotion : acc
                        , emotionHistory[0].emotion)
                      ).label
                    : "---"}
                </p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-muted-foreground">Pico de Atenção</p>
                <p className="text-xl font-bold">
                  {showSummary && emotionHistory.length > 0
                    ? `${Math.max(...emotionHistory.map(e => e.attention)).toFixed(0)}%`
                    : "---"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {showSummary && emotionHistory.length > 0
                    ? `Aos ${(emotionHistory.findIndex(e => e.attention === Math.max(...emotionHistory.map(h => h.attention))) * 2)} segundos`
                    : ""}
                </p>
              </div>
              
              <div className="space-y-2 col-span-2">
                <p className="text-sm text-muted-foreground">Nível Médio de Atenção</p>
                <div className="flex items-center gap-4">
                  <Progress 
                    value={showSummary && emotionHistory.length > 0
                      ? emotionHistory.reduce((acc, curr) => acc + curr.attention, 0) / emotionHistory.length
                      : 0} 
                    className="h-3 flex-1" 
                  />
                  <span className="text-3xl font-bold text-primary">
                    {showSummary && emotionHistory.length > 0
                      ? `${(emotionHistory.reduce((acc, curr) => acc + curr.attention, 0) / emotionHistory.length).toFixed(0)}%`
                      : "0%"}
                  </span>
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
