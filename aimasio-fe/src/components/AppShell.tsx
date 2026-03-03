import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, BarChart3, Clock, FileText, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const navItems = [
  { to: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { to: "/cv-review", key: "cv", icon: FileText },
  { to: "/interview-setup", key: "interview-setup", icon: PlusCircle },
  { to: "/results", key: "results", icon: BarChart3 },
  { to: "/history", key: "history", icon: Clock },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("yourhr_theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.localStorage.setItem("yourhr_theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
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

            const label =
              language === "en"
                ? item.key === "dashboard"
                  ? "Overview"
                  : item.key === "cv"
                    ? "CV review"
                    : item.key === "interview-setup"
                      ? "New interview"
                      : item.key === "results"
                        ? "Results"
                        : "History"
                : item.key === "dashboard"
                  ? "Tổng quan"
                  : item.key === "cv"
                    ? "Đánh giá CV"
                    : item.key === "interview-setup"
                      ? "Tạo phỏng vấn"
                      : item.key === "results"
                        ? "Kết quả"
                        : "Lịch sử";
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
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content + mobile nav */}
      <main className="flex-1 overflow-auto bg-background-alt/30">
        <div className="w-full max-w-6xl mx-auto p-4 pb-8 lg:p-10">
          {/* Mobile top nav */}
          <div className="mb-4 flex items-center justify-between md:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary text-[10px] font-bold">
                AI
              </span>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                YourHR AI
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 text-[10px] font-medium text-muted-foreground"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-3 w-3 text-primary" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-3 w-3 text-amber-400" />
                    <span>Light</span>
                  </>
                )}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-border/80 bg-background px-3 text-[10px] font-medium text-muted-foreground"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary">
                    {language === "vi" ? "VN" : language === "en" ? "EN" : "JP"}
                  </span>
                  <span>
                    {language === "vi" ? "VI" : language === "en" ? "EN" : "JP"}
                  </span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-1 w-32 rounded-md border border-border bg-background shadow-lg text-[11px] py-1 z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage("vi");
                        setLangOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface text-foreground"
                    >
                      🇻🇳 Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage("en");
                        setLangOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface text-foreground"
                    >
                      🇺🇸 English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage("jp");
                        setLangOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface text-foreground"
                    >
                      🇯🇵 日本語
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <nav className="md:hidden mb-4 flex gap-2 overflow-x-auto rounded-full border border-border bg-background px-2 py-1 text-xs">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              const label =
                language === "en"
                  ? item.key === "dashboard"
                    ? "Overview"
                    : item.key === "cv"
                      ? "CV review"
                      : item.key === "interview-setup"
                        ? "New interview"
                        : item.key === "results"
                          ? "Results"
                          : "History"
                  : item.key === "dashboard"
                    ? "Tổng quan"
                    : item.key === "cv"
                      ? "Đánh giá CV"
                      : item.key === "interview-setup"
                        ? "Tạo phỏng vấn"
                        : item.key === "results"
                          ? "Kết quả"
                          : "Lịch sử";
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
