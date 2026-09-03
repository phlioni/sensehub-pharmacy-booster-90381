import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardGeral from "./pages/DashboardGeral";
import DemonstracaoAoVivo from "./pages/DemonstracaoAoVivo";
import AnaliseCampanhas from "./pages/AnaliseCampanhas";
import AnaliseProdutos from "./pages/AnaliseProdutos";
import GeradorRelatorios from "./pages/GeradorRelatorios";
import RelatorioExecutivo from "./pages/RelatorioExecutivo";
import Cameras from "./pages/Cameras";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const withLayout = (node: ReactNode) => <DashboardLayout>{node}</DashboardLayout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={withLayout(<DashboardGeral />)} />
          <Route path="/demonstracao" element={<DemonstracaoAoVivo />} />
          <Route path="/campanhas" element={withLayout(<AnaliseCampanhas />)} />
          <Route path="/produtos" element={withLayout(<AnaliseProdutos />)} />
          <Route path="/relatorios" element={withLayout(<GeradorRelatorios />)} />
          <Route path="/relatorio-executivo" element={withLayout(<RelatorioExecutivo />)} />
          <Route path="/cameras" element={withLayout(<Cameras />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
