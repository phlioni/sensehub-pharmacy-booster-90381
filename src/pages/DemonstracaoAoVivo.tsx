import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const DemonstracaoAoVivo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const totalDuration = 20; // 20 seconds

  // Emotion mapping based on time
  const getEmotionState = (time: number) => {
    if (time < 5) return { label: "NEUTRA", color: "text-muted-foreground", bgColor: "bg-muted" };
    if (time < 10) return { label: "CURIOSIDADE", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (time < 15) return { label: "INTERESSE POSITIVO", color: "text-success", bgColor: "bg-success-light" };
    return { label: "PENSATIVA", color: "text-muted-foreground", bgColor: "bg-muted" };
  };

  // Generate data for the timeline chart
  const generateChartData = () => {
    const data = [];
    for (let t = 0; t <= currentTime; t += 0.5) {
      let curiosidade = 0;
      let interesse = 0;
      let neutralidade = 90;

      if (t >= 5 && t <= 9) {
        curiosidade = 20 + (t - 5) * 15;
        neutralidade = 90 - (t - 5) * 15;
      } else if (t > 9 && t < 10) {
        curiosidade = 80 - (t - 9) * 30;
        neutralidade = 30 + (t - 9) * 20;
      }

      if (t >= 8 && t <= 13) {
        interesse = (t - 8) * 18;
        if (t > 10) neutralidade = Math.max(10, 50 - (t - 10) * 8);
      } else if (t > 13 && t <= 15) {
        interesse = 90 - (t - 13) * 25;
      }

      if (t > 15) {
        neutralidade = 10 + (t - 15) * 16;
        interesse = Math.max(0, 40 - (t - 15) * 8);
      }

      data.push({
        time: t,
        curiosidade: Math.max(0, Math.min(100, curiosidade)),
        interesse: Math.max(0, Math.min(100, interesse)),
        neutralidade: Math.max(0, Math.min(100, neutralidade)),
      });
    }
    return data;
  };

  // Gaze position animation
  const getGazePosition = (time: number) => {
    const progress = (time / totalDuration) * 100;
    const x = 20 + (progress * 0.6);
    const y = 30 + Math.sin(progress / 10) * 20;
    return { x: `${x}%`, y: `${y}%` };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < totalDuration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            setShowSummary(true);
            return totalDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  const handlePlayPause = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
      setShowSummary(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
    setShowSummary(false);
  };

  const emotionState = getEmotionState(currentTime);
  const confidence = 92 + Math.sin(currentTime) * 6;
  const gazePos = getGazePosition(currentTime);
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
            
            {/* Video Placeholder with Face Animation */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              {/* Simulated face with emotion states */}
              <div className="relative w-48 h-48">
                {/* Face outline */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <ellipse cx="50" cy="50" rx="30" ry="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                  
                  {/* Eyes */}
                  <circle cx="40" cy="40" r="3" fill="rgba(255,255,255,0.6)">
                    <animate attributeName="r" values="3;3.5;3" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="60" cy="40" r="3" fill="rgba(255,255,255,0.6)">
                    <animate attributeName="r" values="3;3.5;3" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Eyebrows - animate based on emotion */}
                  <path 
                    d={currentTime >= 5 && currentTime < 15 ? "M 35 35 Q 40 32 45 35" : "M 35 36 Q 40 34 45 36"} 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="1" 
                    fill="none"
                    className="transition-all duration-500"
                  />
                  <path 
                    d={currentTime >= 5 && currentTime < 15 ? "M 55 35 Q 60 32 65 35" : "M 55 36 Q 60 34 65 36"} 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="1" 
                    fill="none"
                    className="transition-all duration-500"
                  />
                  
                  {/* Mouth - changes with emotion */}
                  <path 
                    d={
                      currentTime >= 10 && currentTime < 15 
                        ? "M 38 60 Q 50 68 62 60" 
                        : currentTime >= 5 && currentTime < 10 
                        ? "M 38 60 Q 50 64 62 60"
                        : "M 38 60 Q 50 60 62 60"
                    }
                    stroke="rgba(255,255,255,0.6)" 
                    strokeWidth="1.5" 
                    fill="none"
                    className="transition-all duration-500"
                  />
                  
                  {/* Facial landmark dots */}
                  <circle cx="35" cy="38" r="1" fill="#60a5fa" opacity={isPlaying ? "1" : "0.3"}>
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="65" cy="38" r="1" fill="#60a5fa" opacity={isPlaying ? "1" : "0.3"}>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="50" cy="48" r="1" fill="#60a5fa" opacity={isPlaying ? "1" : "0.3"}>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="38" cy="62" r="1" fill="#60a5fa" opacity={isPlaying ? "1" : "0.3"}>
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="62" cy="62" r="1" fill="#60a5fa" opacity={isPlaying ? "1" : "0.3"}>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>

              {/* Recording indicator */}
              {isPlaying && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">REC</span>
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

          {/* Gaze Tracking Widget */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Foco de Atenção
            </h3>
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-40 overflow-hidden">
              {/* Gondola simulation */}
              <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white/50 rounded border border-slate-300" />
                ))}
              </div>
              
              {/* Gaze indicator */}
              {currentTime > 0 && (
                <div
                  className="absolute w-6 h-6 transition-all duration-100"
                  style={{ left: gazePos.x, top: gazePos.y }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full opacity-30 animate-ping" />
                    <div className="relative w-6 h-6 bg-primary rounded-full opacity-80 border-2 border-white" />
                  </div>
                </div>
              )}
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
                <span className="font-semibold">{confidence.toFixed(1)}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
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
                <p className="text-2xl font-bold">{showSummary ? "20 segundos" : "---"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Emoção Predominante</p>
                <p className="text-2xl font-bold text-success">{showSummary ? "Interesse Positivo" : "---"}</p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-muted-foreground">Pico de Engajamento</p>
                <p className="text-xl font-bold">{showSummary ? "13 segundos" : "---"}</p>
                <p className="text-sm text-muted-foreground">{showSummary ? "Produto: Sérum Anti-Idade" : ""}</p>
              </div>
              
              <div className="space-y-2 col-span-2">
                <p className="text-sm text-muted-foreground">Índice de Engajamento Final</p>
                <div className="flex items-center gap-4">
                  <Progress value={showSummary ? 88 : 0} className="h-3 flex-1" />
                  <span className="text-3xl font-bold text-primary">{showSummary ? "88%" : "0%"}</span>
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
