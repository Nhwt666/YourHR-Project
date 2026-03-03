import AppShell from "@/components/AppShell";
import { Link } from "react-router-dom";
import { Clock3 } from "lucide-react";

const historyData = [
  { id: 1, role: "Kỹ sư Frontend cấp cao", candidate: "Alex Chen", score: 8.1, date: "28 Thg 2, 2026", status: "Hoàn tất" },
  { id: 2, role: "Kỹ sư Frontend cấp cao", candidate: "Maria Santos", score: 7.4, date: "27 Thg 2, 2026", status: "Hoàn tất" },
  { id: 3, role: "Nhà thiết kế sản phẩm", candidate: "James Kim", score: 8.9, date: "26 Thg 2, 2026", status: "Hoàn tất" },
  { id: 4, role: "Kỹ sư Backend", candidate: "Sarah Patel", score: 6.8, date: "24 Thg 2, 2026", status: "Hoàn tất" },
  { id: 5, role: "Kỹ sư Backend", candidate: "Tom Wilson", score: 9.2, date: "22 Thg 2, 2026", status: "Hoàn tất" },
  { id: 6, role: "Chuyên viên phân tích dữ liệu", candidate: "Emily Zhang", score: 7.5, date: "20 Thg 2, 2026", status: "Hoàn tất" },
  { id: 7, role: "Chuyên viên QA Automation", candidate: "Huy Nguyễn", score: 8.3, date: "19 Thg 2, 2026", status: "Hoàn tất" },
  { id: 8, role: "Product Owner", candidate: "Linh Trần", score: 7.9, date: "18 Thg 2, 2026", status: "Hoàn tất" },
  { id: 9, role: "Data Scientist", candidate: "Michael Lee", score: 8.7, date: "16 Thg 2, 2026", status: "Hoàn tất" },
];

const History = () => {
  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Interview archive
        </div>
        <h1 className="text-heading">Lịch sử</h1>
        <p className="text-sm text-muted-foreground mt-1">Tất cả buổi phỏng vấn và kết quả trước đó.</p>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold">Ứng viên gần đây</h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" /> 30 ngày gần nhất
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Ứng viên</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Vị trí</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Điểm</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Ngày</th>
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
