import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does the AI scoring work?",
    a: "Our AI evaluates candidate responses against your custom rubrics, analyzing content relevance, communication clarity, and role-specific competencies. Every score includes an explanation so you understand the reasoning.",
  },
  {
    q: "Can candidates cheat the system?",
    a: "We use multiple integrity measures including time tracking, response consistency analysis, and optional video proctoring. The system flags unusual patterns for your review.",
  },
  {
    q: "Does it integrate with our ATS?",
    a: "Yes. We integrate with major ATS platforms including Greenhouse, Lever, Ashby, and Workable. Custom integrations are available on the Pro plan.",
  },
  {
    q: "What happens after the free trial?",
    a: "After 3 days, choose a plan that fits. Your data and interviews are preserved. No surprise charges — we'll remind you before the trial ends.",
  },
  {
    q: "Is candidate data secure?",
    a: "All data is encrypted at rest and in transit. We're SOC 2 compliant and GDPR ready. Candidate data is automatically purged based on your retention policy.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-background-alt">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          FAQ
        </span>
        <h2 className="text-heading mb-4">Frequently asked questions</h2>
        <p className="text-body-sm text-muted-foreground mb-12 max-w-md">Everything you need to know about YourHR AI.</p>
        <div className="max-w-2xl">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-body-sm font-medium text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-body-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
