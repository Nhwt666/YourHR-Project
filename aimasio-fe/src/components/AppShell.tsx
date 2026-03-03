import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, BarChart3, Clock, FileText } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/cv-review", label: "Đánh giá CV", icon: FileText },
  { to: "/interview-setup", label: "Tạo phỏng vấn", icon: PlusCircle },
  { to: "/results", label: "Kết quả", icon: BarChart3 },
  { to: "/history", label: "Lịch sử", icon: Clock },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-border bg-surface/95 px-5 py-6">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 px-1">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold">
            AI
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-foreground">
            YourHR&nbsp;<span className="text-primary">AI</span>
          </span>
        </Link>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
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
