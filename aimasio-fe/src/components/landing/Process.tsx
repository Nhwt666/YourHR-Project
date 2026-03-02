const steps = [
  {
    number: "01",
    title: "Set up your interview",
    description: "Define the role, add your questions, and configure scoring criteria in minutes.",
  },
  {
    number: "02",
    title: "Invite candidates",
    description: "Share a link. Candidates record answers at their convenience — no scheduling needed.",
  },
  {
    number: "03",
    title: "Review & decide",
    description: "Get AI-scored results with key insights. Compare candidates side-by-side and move fast.",
  },
];

const Process = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background-alt to-background">
      <div className="container">
        <div className="mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            How it works
          </span>
          <h2 className="text-heading max-w-2xl">Three steps from job post to hire</h2>
          <p className="text-body-sm text-muted-foreground mt-3 max-w-xl">
            A clearer interview workflow that helps you screen faster and decide with confidence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.number}
              className="relative rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Step
                </span>
                <span className="text-3xl font-bold text-primary/20 select-none leading-none">{s.number}</span>
              </div>
              <h3 className="text-subheading mb-2">{s.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
