import AppShell from "@/components/AppShell";
import { interviewHistoryList } from "@/data/interviewHistory";
import { Link } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

const cvHistory = [
  {
    id: 1,
    title: "Đánh giá CV Frontend Developer",
    role: "Công việc mục tiêu: Frontend Developer",
    score: 8.0,
    comment: "CV rõ ràng, nên bổ sung thêm thành tựu có số liệu và phần kỹ năng frontend chuyên sâu.",
    date: "15 Thg 2, 2026",
  },
  {
    id: 2,
    title: "Đánh giá CV Backend Developer",
    role: "Công việc mục tiêu: Backend Developer",
    score: 7.3,
    comment: "Kinh nghiệm backend tốt nhưng phần mô tả dự án còn chung chung, thiếu vai trò cụ thể.",
    date: "10 Thg 2, 2026",
  },
  {
    id: 3,
    title: "Đánh giá CV Data Analyst",
    role: "Công việc mục tiêu: Data Analyst",
    score: 7.8,
    comment: "Nên làm nổi bật kỹ năng SQL, dashboard và chỉ số kinh doanh đã cải thiện nhờ phân tích dữ liệu.",
    date: "5 Thg 2, 2026",
  },
  {
    id: 4,
    title: "Đánh giá CV QA Automation",
    role: "Công việc mục tiêu: QA Automation Engineer",
    score: 7.1,
    comment: "Thiếu phần tóm tắt kinh nghiệm, nên gom tool test và framework vào một nhóm kỹ năng rõ ràng.",
    date: "1 Thg 2, 2026",
  },
];

const History = () => {
  const { language } = useLanguage();
  const [view, setView] = useState<"interview" | "cv">("interview");

  const title =
    language === "en"
      ? "Your practice history with AI Interview Master"
      : "Lịch sử luyện với AI Interview Master";
  const subtitle =
    language === "en"
      ? "Overview of your recent AI interview sessions and CV reviews for this account."
      : "Tổng hợp các buổi luyện phỏng vấn và đánh giá CV gần đây cùng AI cho tài khoản hiện tại.";
  const tableTitle =
    view === "interview"
      ? language === "en"
        ? "Recent interview practice sessions"
        : "Phiên luyện phỏng vấn gần đây"
      : language === "en"
        ? "Recent CV review sessions"
        : "Lượt đánh giá CV gần đây";

  const rows = view === "interview" ? interviewHistoryList : cvHistory;

  const firstColumnLabel =
    view === "interview"
      ? language === "en"
        ? "Session"
        : "Phiên luyện"
      : language === "en"
        ? "Review"
        : "Lượt đánh giá CV";
  const secondColumnLabel =
    view === "interview"
      ? language === "en"
        ? "Role"
        : "Vị trí"
      : language === "en"
        ? "Target job"
        : "Công việc mục tiêu";
  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Interview archive
        </div>
        <h1 className="text-heading">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold">{tableTitle}</h2>
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full bg-surface p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setView("interview")}
                className={`px-3 py-1 rounded-full transition-colors ${
                  view === "interview"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "en" ? "Interview history" : "Lịch sử phỏng vấn"}
              </button>
              <button
                type="button"
                onClick={() => setView("cv")}
                className={`px-3 py-1 rounded-full transition-colors ${
                  view === "cv"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "en" ? "CV review history" : "Lịch sử đánh giá CV"}
              </button>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" /> 30 ngày gần nhất
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">
                  {firstColumnLabel}
                </th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">
                  {secondColumnLabel}
                </th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">
                  {language === "en" ? "Score" : "Điểm"}
                </th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">
                  {language === "en" ? "Quick note" : "Nhận xét nhanh"}
                </th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">
                  {language === "en" ? "Date" : "Ngày"}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <Link
                      to={view === "interview" ? `/history/session/${item.id}` : `/history/cv-review/${item.id}`}
                      state={view === "interview" ? { session: item } : { cvReview: item }}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.title}
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
                      {item.score}/10
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-xs text-muted-foreground max-w-xs">
                    {item.comment}
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
