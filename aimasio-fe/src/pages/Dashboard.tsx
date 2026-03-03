import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Users, Clock, TrendingUp, ArrowUpRight, Sparkles, FileText } from "lucide-react";

const stats = [
  { label: "Buổi phỏng vấn đang hoạt động", value: "12", trend: "+18%", icon: Users },
  { label: "Ứng viên tuần này", value: "48", trend: "+12%", icon: TrendingUp },
  { label: "Thời gian hoàn thành TB", value: "23 phút", trend: "-9%", icon: Clock },
];

const recentInterviews = [
  { role: "Kỹ sư Frontend cấp cao", candidates: 14, status: "Đang mở", date: "28 Thg 2" },
  { role: "Nhà thiết kế sản phẩm", candidates: 8, status: "Đang mở", date: "26 Thg 2" },
  { role: "Kỹ sư Backend", candidates: 22, status: "Đã đóng", date: "20 Thg 2" },
  { role: "Chuyên viên phân tích dữ liệu", candidates: 6, status: "Nháp", date: "18 Thg 2" },
  { role: "Chuyên viên QA Automation", candidates: 10, status: "Đang mở", date: "16 Thg 2" },
  { role: "Product Owner", candidates: 5, status: "Đã đóng", date: "12 Thg 2" },
];

const statusClasses: Record<string, string> = {
  // Centralized status styling keeps badges visually consistent across rows.
  "Đang mở": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Đã đóng": "bg-secondary text-muted-foreground border border-border",
  Nháp: "bg-amber-50 text-amber-700 border border-amber-200",
};

const Dashboard = () => {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                Trung tâm điều phối phỏng vấn
              </span>
              <h1 className="text-heading">Tổng quan</h1>
              <p className="text-sm text-muted-foreground mt-1">Theo dõi toàn bộ tiến trình phỏng vấn của bạn.</p>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link to="/cv-review">
                    <FileText className="h-4 w-4 mr-2" />
                    Đánh giá CV
                  </Link>
                </Button>
                <Button asChild className="shadow-sm">
                  <Link to="/interview-setup">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tạo phỏng vấn
                  </Link>
                </Button>
              </div>
            </div>

            <div id="account-section" className="rounded-2xl bg-background/80 border border-border/70 px-4 py-3.5 w-full max-w-sm shadow-sm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  NM
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nguyễn Minh Anh</p>
                  <p className="text-xs text-muted-foreground">Talent Acquisition · yourname@yourhr.ai</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Gói hiện tại</p>
                  <p className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Standard
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Phòng ban</p>
                  <p className="text-foreground font-medium">Tech recruitment</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Vị trí chính</p>
                  <p className="text-foreground font-medium">Frontend & Product</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Lần truy cập gần nhất</p>
                  <p className="text-foreground font-medium">Hôm qua · 21:34</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">Thanh toán</p>
                  <p className="text-foreground font-medium">Visa •••• 4242 · Gia hạn 12/2026</p>
                </div>
                <Button asChild variant="outline" size="sm" className="text-xs h-7 px-3">
                  <Link to="/account">Cập nhật hồ sơ</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-5 min-h-32 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  {s.trend}
                </div>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold">Phỏng vấn gần đây</h2>
            <p className="text-xs text-muted-foreground mt-1">Theo dõi vai trò và hoạt động ứng viên gần đây.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/80">
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Vị trí</th>
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Số ứng viên</th>
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Ngay</th>
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
