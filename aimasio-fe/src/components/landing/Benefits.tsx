import { Zap, BarChart3, Shield } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Save 80% of screening time",
    description: "Automated interviews run 24/7. Candidates complete them on their schedule, you review results when ready.",
  },
  {
    icon: BarChart3,
    title: "Data-driven decisions",
    description: "Every answer scored consistently. Compare candidates objectively with structured rubrics and AI analysis.",
  },
  {
    icon: Shield,
    title: "Reduce hiring bias",
    description: "Standardized questions and blind scoring ensure every candidate gets a fair, equal evaluation.",
  },
];

const Benefits = () => {
  return (
    <section className="py-24">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Why YourHR AI
        </span>
        <h2 className="text-heading mb-14 max-w-md">Built for teams that hire with intention</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((b) => (
            <div key={b.title}>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-subheading mb-2">{b.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
