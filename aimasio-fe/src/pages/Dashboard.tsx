import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Users, Clock, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Active interviews", value: "12", icon: Users },
  { label: "Candidates this week", value: "48", icon: TrendingUp },
  { label: "Avg. completion time", value: "23 min", icon: Clock },
];

const recentInterviews = [
  { role: "Senior Frontend Engineer", candidates: 14, status: "Active", date: "Feb 28" },
  { role: "Product Designer", candidates: 8, status: "Active", date: "Feb 26" },
  { role: "Backend Engineer", candidates: 22, status: "Closed", date: "Feb 20" },
  { role: "Data Analyst", candidates: 6, status: "Draft", date: "Feb 18" },
];

const statusClasses: Record<string, string> = {
  // Centralized status styling keeps badges visually consistent across rows.
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Closed: "bg-secondary text-muted-foreground border border-border",
  Draft: "bg-amber-50 text-amber-700 border border-amber-200",
};

const Dashboard = () => {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="rounded-2xl border border-border bg-background p-6 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-heading">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Overview of your hiring pipeline.</p>
            </div>
            <Button asChild>
              <Link to="/interview-setup">
                <PlusCircle className="h-4 w-4 mr-2" />
                New interview
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-5 min-h-32">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <div className="mt-2 text-2xl font-semibold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold">Recent interviews</h2>
            <p className="text-xs text-muted-foreground mt-1">Track current roles and candidate activity at a glance.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/80">
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Candidates</th>
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((item) => (
                  <tr key={item.role} className="border-b border-border last:border-0 hover:bg-surface/70 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-foreground">{item.role}</td>
                    <td className="py-3.5 px-5 text-muted-foreground">{item.candidates}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
