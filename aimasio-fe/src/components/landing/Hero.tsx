import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import dashboardMock from "@/assets/dashboard-mock.png";

const Hero = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-5">
              The modern hiring platform
            </span>
            <h1 className="text-display text-foreground mb-6">
              Hire smarter with{" "}
              <span className="text-accent-gradient">AI-powered interviews</span>
            </h1>
            <p className="text-body text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Run structured, unbiased interviews at scale. Get instant candidate assessments with actionable insights — no scheduling headaches.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Start free trial
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/cv-review">Free CV review forever</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-border overflow-hidden shadow-sm bg-surface">
              <img
                src={dashboardMock}
                alt="YourHR AI dashboard showing candidate management interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
