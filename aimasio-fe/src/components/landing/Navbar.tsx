import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { clearStoredToken, getStoredToken } from "@/lib/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Read login state from local token to switch CTA actions.
  const isAuthenticated = Boolean(getStoredToken());
  const productLink = isAuthenticated ? "/dashboard" : "/auth";

  const handleSignOut = () => {
    clearStoredToken();
    localStorage.removeItem("aimasio_user_email");
    localStorage.removeItem("aimasio_session_id");
    localStorage.removeItem("aimasio_result");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container flex h-[72px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
              AI
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">YourHR AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 rounded-lg border border-border/80 bg-surface/60 p-1">
            <Link to={productLink} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors">
              Product
            </Link>
            <Link to="#pricing" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="#faq" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" className="border-border/80" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth">Get started</Link>
              </Button>
            </>
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
          <Link to={productLink} className="block text-sm text-muted-foreground hover:text-foreground">Product</Link>
          <Link to="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link to="#faq" className="block text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/dashboard">Dashboard</Link></Button>
                <Button size="sm" variant="outline" onClick={handleSignOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/auth">Sign in</Link></Button>
                <Button size="sm" asChild><Link to="/auth">Get started</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
