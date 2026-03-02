import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-sm font-semibold text-foreground">YourHR AI</span>
            <p className="text-sm text-muted-foreground mt-1">Structured interviews, better hires.</p>
          </div>
          <div className="flex gap-8">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Product</span>
              <div className="flex flex-col gap-1.5">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Company</span>
              <div className="flex flex-col gap-1.5">
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} YourHR AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
