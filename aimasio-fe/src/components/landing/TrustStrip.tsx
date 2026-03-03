const logos = [
  "Stripe", "Notion", "Linear", "Vercel", "Figma", "Slack"
];

const TrustStrip = () => {
  return (
    <section className="py-12 border-y border-border">
      <div className="container">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6 text-center">
          Được tin dùng bởi các đội ngũ hướng tới đổi mới
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-subtle select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
