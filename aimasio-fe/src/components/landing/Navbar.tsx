import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { clearStoredToken, getStoredToken } from "@/lib/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Read login state from local token to switch CTA actions.
  const isAuthenticated = Boolean(getStoredToken());

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
    navigate("/account");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-md shadow-[0_18px_50px_-28px_rgba(15,23,42,0.65)]">
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
              Luyện CV & phỏng vấn
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("benefits")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              Lợi ích
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("process")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              Quy trình
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              Bảng giá
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("faq")}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              Hỏi đáp
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary border border-primary/30 hover:bg-primary/15 transition-colors"
              >
                NM
              </button>
              <Button size="sm" variant="outline" className="border-border/80" onClick={handleSignOut}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="border border-primary/25 bg-background text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_8px_24px_-16px_rgba(79,70,229,0.85)]"
              asChild
            >
              <Link to="/auth">
                Đăng nhập
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
            Luyện CV & phỏng vấn
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("benefits");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Lợi ích
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("process");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Quy trình
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("pricing");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Bảng giá
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToSection("faq");
              setMobileOpen(false);
            }}
            className="block text-left w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Hỏi đáp
          </button>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
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
                <Button size="sm" variant="outline" onClick={handleSignOut}>
                  Đăng xuất
                </Button>
              </>
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
