import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Share2, Download } from "lucide-react";
import { toast } from "sonner";

const GeradorRelatorios = () => {
  const [selectedItems, setSelectedItems] = useState({
    kpis: true,
    abtest: true,
    heatmap: true,
    emotional: true,
    insights: true,
    positioning: true,
  });

  const handleGeneratePDF = () => {
    toast.success("Relatório PDF gerado com sucesso!", {
      description: "O download começará em instantes.",
    });
  };

  const handleGenerateLink = () => {
    toast.success("Link compartilhável criado!", {
      description: "O link foi copiado para sua área de transferência.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerador de Relatórios</h1>
        <p className="text-muted-foreground">Crie relatórios personalizados para apresentar aos seus clientes</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Configuration Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">Selecione a Campanha ou Produto</h3>
            </div>
            <Select defaultValue="vitamina-c">
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="vitamina-c">Campanha: Lançamento Vitamina C</SelectItem>
                <SelectItem value="protetor-solar">Campanha: Protetor Solar Verão</SelectItem>
                <SelectItem value="serum">Produto: Sérum Anti-Idade Marca Y</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Step 2 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">Selecione o Período</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Data Inicial</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                  defaultValue="2025-01-01"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Data Final</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                  defaultValue="2025-01-31"
                />
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground">Incluir no Relatório</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="kpis" 
                  checked={selectedItems.kpis}
                  onCheckedChange={(checked) => setSelectedItems({...selectedItems, kpis: checked as boolean})}
                />
                <label htmlFor="kpis" className="text-foreground cursor-pointer flex-1">
                  Resumo de KPIs e Métricas
                </label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="abtest" 
                  checked={selectedItems.abtest}
                  onCheckedChange={(checked) => setSelectedItems({...selectedItems, abtest: checked as boolean})}
                />
                <label htmlFor="abtest" className="text-foreground cursor-pointer flex-1">
                  Análise Comparativa de Campanhas
                </label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="heatmap" 
                  checked={selectedItems.heatmap}
                  onCheckedChange={(checked) => setSelectedItems({...selectedItems, heatmap: checked as boolean})}
                />
                <label htmlFor="heatmap" className="text-foreground cursor-pointer flex-1">
                  Mapa de Calor da Gôndola
                </label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="emotional" 
                  checked={selectedItems.emotional}
                  onCheckedChange={(checked) => setSelectedItems({...selectedItems, emotional: checked as boolean})}
                />
                <label htmlFor="emotional" className="text-foreground cursor-pointer flex-1">
                  Análise de Reações Emocionais
                </label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="positioning" 
                  checked={selectedItems.positioning}
                  onCheckedChange={(checked) => setSelectedItems({...selectedItems, positioning: checked as boolean})}
                />
                <label htmlFor="positioning" className="text-foreground cursor-pointer flex-1">
                  Recomendações de Posicionamento
                </label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="insights" 
                  checked={selectedItems.insights}
                  onCheckedChange={(checked) => setSelectedItems({...selectedItems, insights: checked as boolean})}
                />
                <label htmlFor="insights" className="text-foreground cursor-pointer flex-1">
                  Insights Acionáveis do SenseHub
                </label>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1 h-14 text-lg gap-2"
              onClick={handleGeneratePDF}
            >
              <Download className="w-5 h-5" />
              Gerar PDF
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1 h-14 text-lg gap-2"
              onClick={handleGenerateLink}
            >
              <Share2 className="w-5 h-5" />
              Criar Link Compartilhável
            </Button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Prévia do Relatório
            </h3>
            <div className="aspect-[3/4] bg-muted rounded-lg border-2 border-border overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Report Header Preview */}
                <div className="bg-primary p-4 text-primary-foreground">
                  <h4 className="font-bold text-sm mb-1">SenseHub</h4>
                  <p className="text-xs opacity-90">Relatório de Análise</p>
                </div>
                
                {/* Report Content Preview */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="h-3 bg-foreground/10 rounded w-3/4" />
                  <div className="h-3 bg-foreground/10 rounded w-full" />
                  <div className="h-3 bg-foreground/10 rounded w-5/6" />
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="h-20 bg-primary/5 rounded mb-2" />
                    <div className="h-2 bg-foreground/10 rounded w-2/3" />
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-foreground/10 rounded" />
                    <div className="h-2 bg-foreground/10 rounded w-4/5" />
                    <div className="h-2 bg-foreground/10 rounded w-3/4" />
                  </div>
                </div>

                {/* Report Footer Preview */}
                <div className="p-3 border-t border-border bg-muted/30">
                  <div className="h-2 bg-foreground/10 rounded w-1/2 mx-auto" />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Esta é uma prévia simplificada do relatório final
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeradorRelatorios;
