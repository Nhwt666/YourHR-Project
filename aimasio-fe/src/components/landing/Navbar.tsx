import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clearStoredToken, getStoredToken } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [languageOpen, setLanguageOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  // Read login state from local token to switch CTA actions.
  const isAuthenticated = Boolean(getStoredToken());

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navOffset = 80;
    const targetY = el.getBoundingClientRect().top + window.scrollY - navOffset;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 500;

    if (distance === 0) return;

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startY + distance * eased);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handleSignOut = () => {
    clearStoredToken();
    localStorage.removeItem("aimasio_user_email");
    localStorage.removeItem("aimasio_session_id");
    localStorage.removeItem("aimasio_result");
    navigate("/");
  };

  const handlePrimaryNav = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    scrollToSection("overview");
  };

  const handleAvatarClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-md shadow-[0_18px_50px_-28px_rgba(15,23,42,0.65)]">
      <div className="container flex h-[72px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
              AI
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">YourHR</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 rounded-full border border-border/70 bg-background/90 px-1 py-0.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.75)]">
            <button
              type="button"
              onClick={handlePrimaryNav}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              {language === "en" ? "Features" : "Chức năng"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("benefits")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              {language === "en" ? "Benefits" : "Lợi ích"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("process")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              {language === "en" ? "How it works" : "Quy trình"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              {language === "en" ? "Pricing" : "Bảng giá"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("faq")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              {language === "en" ? "FAQ" : "Hỏi đáp"}
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-surface"
          >
            {theme === "light" ? (
              <>
                <Moon className="h-3.5 w-3.5 text-primary" />
                <span>{language === "en" ? "Dark mode" : "Dark mode"}</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>{language === "en" ? "Light mode" : "Light mode"}</span>
              </>
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-border/80 bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-surface"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {language === "vi" ? "VN" : language === "en" ? "EN" : "JP"}
              </span>
              <span>
                {language === "vi" ? "Tiếng Việt" : language === "en" ? "English" : "日本語"}
              </span>
            </button>
            {languageOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-background shadow-lg text-xs py-1">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("vi");
                    setLanguageOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface text-foreground"
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("en");
                    setLanguageOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface text-foreground"
                >
                  🇺🇸 English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("jp");
                    setLanguageOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface text-foreground"
                >
                  🇯🇵 日本語
                </button>
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary border border-primary/30 hover:bg-primary/15 transition-colors"
              >
                NM
              </button>
              <button
                type="button"
                aria-label={language === "en" ? "Notifications" : "Thông báo"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
              >
                <Bell className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Button
              size="sm"
              className="border border-primary/25 bg-background text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_8px_24px_-16px_rgba(79,70,229,0.85)]"
              asChild
            >
              <Link to="/auth">
                {language === "en" ? "Sign in" : "Đăng nhập"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <button
            type="button"
            onClick={() => {
              handlePrimaryNav();
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {language === "en" ? "Features" : "Chức năng"}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("benefits");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {language === "en" ? "Benefits" : "Lợi ích"}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("process");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {language === "en" ? "How it works" : "Quy trình"}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("pricing");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {language === "en" ? "Pricing" : "Bảng giá"}
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("faq");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            {language === "en" ? "FAQ" : "Hỏi đáp"}
          </button>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  handleAvatarClick();
                  setMobileOpen(false);
                }}
              >
                Hồ sơ cá nhân
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/auth">Đăng nhập</Link></Button>
                <Button size="sm" asChild><Link to="/auth">Bắt đầu</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
