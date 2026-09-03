import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlayCircle, Megaphone, Tag, FileText, Presentation, Camera } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Dashboard Geral", icon: LayoutDashboard },
    { path: "/demonstracao", label: "Demonstração ao Vivo", icon: PlayCircle },
    { path: "/cameras", label: "Câmeras", icon: Camera },
    { path: "/campanhas", label: "Análise de Campanhas", icon: Megaphone },
    { path: "/produtos", label: "Análise de Produtos", icon: Tag },
    { path: "/relatorios", label: "Gerador de Relatórios", icon: FileText },
    { path: "/relatorio-executivo", label: "Relatório Executivo", icon: Presentation },
  ];

  return (
    <aside className="w-64 bg-sidebar h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-hover">
        <h1 className="text-2xl font-bold text-sidebar-foreground">
          Sense<span className="text-sidebar-active">Hub</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-active text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-hover"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-hover">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          © 2025 SenseHub
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
