import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Play, BarChart3, Clock, FileText } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cv-review", label: "CV Review", icon: FileText },
  { to: "/interview-setup", label: "New Interview", icon: PlusCircle },
  { to: "/live-interview", label: "Live Interview", icon: Play },
  { to: "/results", label: "Results", icon: BarChart3 },
  { to: "/history", label: "History", icon: Clock },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-surface p-4">
        <Link to="/" className="text-base font-semibold text-foreground mb-8 px-3">
          YourHR AI
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-background-alt/30">
        <div className="w-full max-w-6xl mx-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
