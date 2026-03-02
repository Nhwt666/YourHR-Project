import AppShell from "@/components/AppShell";
import { Link } from "react-router-dom";
import { Clock3 } from "lucide-react";

const historyData = [
  { id: 1, role: "Senior Frontend Engineer", candidate: "Alex Chen", score: 8.1, date: "Feb 28, 2026", status: "Completed" },
  { id: 2, role: "Senior Frontend Engineer", candidate: "Maria Santos", score: 7.4, date: "Feb 27, 2026", status: "Completed" },
  { id: 3, role: "Product Designer", candidate: "James Kim", score: 8.9, date: "Feb 26, 2026", status: "Completed" },
  { id: 4, role: "Backend Engineer", candidate: "Sarah Patel", score: 6.8, date: "Feb 24, 2026", status: "Completed" },
  { id: 5, role: "Backend Engineer", candidate: "Tom Wilson", score: 9.2, date: "Feb 22, 2026", status: "Completed" },
  { id: 6, role: "Data Analyst", candidate: "Emily Zhang", score: 7.5, date: "Feb 20, 2026", status: "Completed" },
];

const History = () => {
  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Interview archive
        </div>
        <h1 className="text-heading">History</h1>
        <p className="text-sm text-muted-foreground mt-1">All past interviews and results.</p>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent candidates</h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" /> Last 30 days
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Candidate</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Role</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Score</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <Link to="/results" className="font-medium text-foreground hover:text-primary transition-colors">
                      {item.candidate}
                    </Link>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{item.role}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.score >= 8
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.score >= 7
                            ? "bg-secondary text-foreground border border-border"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.score}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};

export default History;
