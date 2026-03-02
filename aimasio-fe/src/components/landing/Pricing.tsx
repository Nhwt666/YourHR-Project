import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$6",
    period: "/week",
    description: "For new candidates preparing their first interviews.",
    features: [
      "3-day free trial",
      "20 AI interview sessions/week",
      "Core AI scoring and feedback",
      "Email support",
    ],
    cta: "Start 3-day trial",
    featured: false,
  },
  {
    name: "Standard",
    price: "$29",
    period: "/month",
    description: "For consistent weekly practice with practical interview coaching.",
    features: [
      "80 AI interview sessions/month",
      "Question bank by role and level",
      "Progress tracking and score trends",
      "CV review and improvement tips",
      "Priority support",
    ],
    cta: "Choose Standard",
    featured: true,
  },
  {
    name: "Career+",
    price: "$79",
    period: "/month",
    description: "For serious job seekers who want personal guidance until they land an offer.",
    features: [
      "Unlimited AI interview sessions",
      "Personalized interview roadmap",
      "Adaptive follow-up by weak topics",
      "Weekly readiness report and action plan",
      "Offer-focused coaching mode",
      "Fastest support response",
    ],
    cta: "Choose Career+",
    featured: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Pricing
        </span>
        <h2 className="text-heading mb-4 max-w-md">Simple, transparent pricing</h2>
        <p className="text-body-sm text-muted-foreground mb-14 max-w-2xl">
          Built for long-term interview prep. Start with a short trial, then scale to structured growth or full
          personalized coaching.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 ${
                plan.featured
                  ? "border-2 border-primary bg-background shadow-md"
                  : "border border-border bg-background"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-subheading">{plan.name}</h3>
                {plan.featured && (
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold text-foreground tracking-tight">{plan.price}</span>
                <span className="text-body-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-body-sm text-muted-foreground mb-6">{plan.description}</p>
              <Button
                variant={plan.featured ? "hero" : "hero-outline"}
                className="w-full mb-6"
                asChild
              >
                <Link to="/dashboard">{plan.cta}</Link>
              </Button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-body-sm text-foreground">
                    <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
