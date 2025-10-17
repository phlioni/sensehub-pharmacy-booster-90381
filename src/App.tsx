import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardGeral from "./pages/DashboardGeral";
import AnaliseCampanhas from "./pages/AnaliseCampanhas";
import AnaliseProdutos from "./pages/AnaliseProdutos";
import GeradorRelatorios from "./pages/GeradorRelatorios";
import RelatorioExecutivo from "./pages/RelatorioExecutivo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout><DashboardGeral /></DashboardLayout>} />
          <Route path="/campanhas" element={<DashboardLayout><AnaliseCampanhas /></DashboardLayout>} />
          <Route path="/produtos" element={<DashboardLayout><AnaliseProdutos /></DashboardLayout>} />
          <Route path="/relatorios" element={<DashboardLayout><GeradorRelatorios /></DashboardLayout>} />
          <Route path="/relatorio-executivo" element={<DashboardLayout><RelatorioExecutivo /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
