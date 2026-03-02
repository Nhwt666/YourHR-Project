import AppShell from "@/components/AppShell";
import { Trophy } from "lucide-react";
import { useMemo } from "react";

type QaLogItem = {
  question: string;
  answer: string;
};

const scores = [
  { label: "Technical depth", score: 8.5 },
  { label: "Communication", score: 7.2 },
  { label: "Problem solving", score: 9.0 },
  { label: "Culture fit", score: 7.8 },
];

const Results = () => {
  const savedResult = useMemo(() => {
    const raw = localStorage.getItem("aimasio_result");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { score: number; feedback: string; qaLogs?: QaLogItem[] };
    } catch {
      return null;
    }
  }, []);

  const normalizedScore = savedResult ? Number(savedResult.score) / 10 : null;
  const overallScore = normalizedScore
    ? normalizedScore.toFixed(1)
    : (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1);

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Final evaluation
        </div>
        <h1 className="text-heading">Results</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-scored assessment for the latest candidate.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border p-6 flex items-center gap-4 bg-background">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl font-bold text-primary">{overallScore}</span>
            </div>
            <div>
              <h2 className="text-base font-semibold">Overall score</h2>
              <p className="text-sm text-muted-foreground">
                {savedResult ? "From latest interview end result" : `Based on ${scores.length} evaluation criteria`}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border p-6 bg-background">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              Recommendation
            </div>
            <p className="text-sm text-muted-foreground">
              {Number(overallScore) >= 8 ? "Strong fit - move to next round." : "Needs improvement before next round."}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold">Breakdown</h2>
          {scores.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-36 shrink-0">{s.label}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${s.score * 10}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground w-10 text-right">{s.score}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-3">AI Summary</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {savedResult?.feedback ??
              "Strong technical candidate with deep expertise in frontend architecture. Demonstrated excellent problem-solving skills with clear, structured thinking. Communication could be more concise in some areas. Recommended for next round with a focus on system design discussion."}
          </p>
        </div>

        {savedResult?.qaLogs?.length ? (
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <h2 className="text-base font-semibold">Interview log</h2>
            {savedResult.qaLogs.map((item, index) => (
              <div key={`${item.question}-${index}`} className="rounded-lg border border-border p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Q: {item.question}</p>
                <p className="text-sm text-muted-foreground">A: {item.answer}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
};

export default Results;
