import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Card } from "@/components/ui/card";

type PersonSession = {
  id: number;
  startTime: number;
  leftTime: number;
  rightTime: number;
  dominantEmotion: string;
};

interface PersonScatterChartProps {
  sessions: PersonSession[];
}

const PersonScatterChart = ({ sessions }: PersonScatterChartProps) => {
  const leftData = sessions.map(s => ({
    pessoa: s.id,
    tempo: s.leftTime,
    emocao: s.dominantEmotion,
  }));

  const rightData = sessions.map(s => ({
    pessoa: s.id,
    tempo: s.rightTime,
    emocao: s.dominantEmotion,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-2">Pessoas vs Tempo de Visualização</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Cada ponto representa uma pessoa e quanto tempo olhou para cada tênis
      </p>
      
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="pessoa" 
            name="Pessoa" 
            label={{ value: 'Pessoa #', position: 'bottom', offset: 0 }}
          />
          <YAxis 
            type="number" 
            dataKey="tempo" 
            name="Tempo (s)" 
            label={{ value: 'Tempo (s)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value: any, name: string) => [`${value}s`, name]}
          />
          <Legend />
          <Scatter 
            name="Adidas Campus" 
            data={leftData} 
            fill="#22c55e"
          />
          <Scatter 
            name="Nike Air Force" 
            data={rightData} 
            fill="#3b82f6"
          />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="p-2 bg-green-50 rounded">
          <span className="font-semibold text-green-800">Adidas:</span>
          <span className="text-green-700 ml-2">
            {sessions.filter(s => s.leftTime > 0).length} pessoas
          </span>
        </div>
        <div className="p-2 bg-blue-50 rounded">
          <span className="font-semibold text-blue-800">Nike:</span>
          <span className="text-blue-700 ml-2">
            {sessions.filter(s => s.rightTime > 0).length} pessoas
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PersonScatterChart;
