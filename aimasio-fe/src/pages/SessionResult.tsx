import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { InterviewHistoryItem } from "@/data/interviewHistory";

const baseScoreKeys = [
  { key: "techDepth", labelVi: "Độ sâu kỹ thuật", labelEn: "Technical depth" },
  { key: "communication", labelVi: "Giao tiếp", labelEn: "Communication" },
  { key: "problemSolving", labelVi: "Giải quyết vấn đề", labelEn: "Problem solving" },
  { key: "cultureFit", labelVi: "Phù hợp văn hóa", labelEn: "Culture fit" },
];

/** Một bộ mock cố định cho tất cả phiên — bấm phiên nào cũng quy về trang này. */
const MOCK_OVERALL = 8.1;
const MOCK_BREAKDOWN = [8.5, 7.2, 9.0, 7.8];
const MOCK_HISTORY = [
  { id: 1, labelVi: "Buổi 1", labelEn: "Session 1", score: 6.8 },
  { id: 2, labelVi: "Buổi 2", labelEn: "Session 2", score: 7.4 },
  { id: 3, labelVi: "Buổi 3 (gần nhất)", labelEn: "Session 3 (latest)", score: MOCK_OVERALL },
];
const MOCK_IMPROVEMENT = MOCK_HISTORY[2].score - MOCK_HISTORY[1].score;

const SessionResult = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const stateSession = (location.state as { session?: InterviewHistoryItem } | null)?.session;

  const headerSession: InterviewHistoryItem = stateSession ?? {
    id: 0,
    title: language === "en" ? "Interview session" : "Phiên luyện phỏng vấn",
    role: "",
    score: MOCK_OVERALL,
    comment: "",
    date: "",
  };

  const overallScore = MOCK_OVERALL.toFixed(1);
  const translatedScores = baseScoreKeys.map((item, i) => ({
    ...item,
    label: language === "en" ? item.labelEn : item.labelVi,
    score: MOCK_BREAKDOWN[i],
  }));
  const history = MOCK_HISTORY;
  const improvement = MOCK_IMPROVEMENT;

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-3 gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => navigate("/history")}
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "en" ? "Back" : "Quay lại"}
          </Button>
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
            {language === "en" ? "Session detail" : "Chi tiết phiên luyện"}
          </div>
          <h1 className="text-heading">{headerSession.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {headerSession.role ? `${headerSession.role} · ${headerSession.date}` : headerSession.date || ""}
          </p>
        </div>
      </div>

      <div className="max-w-5xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-4">
            {language === "en" ? "Score" : "Điểm"}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center justify-center sm:justify-start min-w-[5rem]">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-2xl font-bold text-primary tabular-nums">{overallScore}/10</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground mb-2">
                {language === "en" ? "Breakdown" : "Chi tiết"}
              </p>
              <div className="space-y-2.5">
                {translatedScores.map((s) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{s.label}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden min-w-0">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(s.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-8 text-right tabular-nums">{s.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-border bg-background p-5 text-sm">
            <h3 className="font-semibold text-foreground mb-3">
              {language === "en" ? "Current score vs last 3 sessions" : "Điểm hiện tại so với 3 buổi gần nhất"}
            </h3>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] text-muted-foreground">
                {language === "en" ? "Change vs previous" : "Chênh so với buổi trước"}
              </span>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  improvement >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {improvement >= 0 ? "+" : ""}{improvement.toFixed(1)}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {history.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="w-24 shrink-0 text-foreground font-medium text-[11px]">
                    {language === "en" ? item.labelEn : item.labelVi}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden min-w-0">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${item.score * 10}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-foreground font-medium tabular-nums">
                    {item.score.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-5 flex flex-col justify-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {language === "en" ? "Avg. last 3 sessions" : "Trung bình 3 buổi gần nhất"}
            </p>
            <p className="text-2xl font-bold text-primary tabular-nums">
              {(history.reduce((a, b) => a + b.score, 0) / history.length).toFixed(1)}/10
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "en" ? "Trend vs previous session on the left." : "Xu hướng so với buổi trước bên trái."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-3">
            {language === "en" ? "Overall feedback" : "Nhận xét tổng quan"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {headerSession.comment ||
              (language === "en"
                ? "Your answers were structured and easy to follow. You showed a good grasp of fundamentals and gave concrete examples. We recommend focusing the next practice on system design and trade-off discussion."
                : "Câu trả lời có bố cục, dễ theo dõi. Bạn thể hiện nắm vững kiến thức nền và đưa ví dụ cụ thể. Nên tập trung buổi sau vào system design và thảo luận trade-off.")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-4">
            {language === "en" ? "Feedback by round" : "Nhận xét theo từng vòng"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <p className="font-semibold text-foreground">{language === "en" ? "1. Screening" : "1. Phỏng vấn sàng lọc"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en" ? "Check basic background and fit for the role." : "Kiểm tra nền tảng cơ bản và mức độ phù hợp với vị trí."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{language === "en" ? "Usually 10–15 min." : "Thường 10–15 phút."}</p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground list-disc list-inside">
                <li>{language === "en" ? "Introduce yourself" : "Giới thiệu bản thân"}</li>
                <li>{language === "en" ? "Current role & experience" : "Công việc hiện tại, kinh nghiệm & dự án"}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <p className="font-semibold text-foreground">{language === "en" ? "2. Technical" : "2. Phỏng vấn kỹ thuật"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en" ? "Test technical knowledge and problem-solving." : "Kiểm tra kiến thức kỹ thuật và khả năng giải quyết vấn đề."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{language === "en" ? "Usually 20–40 min." : "Thường 20–40 phút."}</p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground list-disc list-inside">
                <li>{language === "en" ? "Coding challenge" : "Bài coding, REST API, sync/async, debugging"}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <p className="font-semibold text-foreground">{language === "en" ? "3. Behavioral" : "3. Phỏng vấn hành vi"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en" ? "How you work in a team and handle situations." : "Cách bạn làm việc nhóm và xử lý tình huống."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{language === "en" ? "Usually 15–25 min." : "Thường 15–25 phút."}</p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground list-disc list-inside">
                <li>{language === "en" ? "Teamwork, conflict, failure, leadership" : "Làm việc nhóm, xung đột, thất bại, dẫn dắt"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-4">
            {language === "en" ? "Strengths, gaps & what to build on" : "Điểm mạnh, điểm yếu & cần phát huy"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-lg border border-border/70 bg-emerald-500/5 px-4 py-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-1.5">
                {language === "en" ? "Strengths" : "Điểm mạnh"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "Your answers were structured and easy to follow; you showed a good grasp of fundamentals and gave concrete examples."
                  : "Câu trả lời có bố cục, dễ theo dõi; bạn thể hiện nắm vững kiến thức nền và đưa ví dụ cụ thể."}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-amber-500/5 px-4 py-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1.5">
                {language === "en" ? "Gaps" : "Điểm yếu"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "In a few answers you went into detail before the main point; one behavioral story could state cause-and-effect more clearly."
                  : "Ở một vài câu bạn đi vào chi tiết trước ý chính; một câu chuyện hành vi có thể nêu rõ hơn mối quan hệ nhân quả."}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-primary/5 px-4 py-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide text-primary mb-1.5">
                {language === "en" ? "Build on" : "Cần phát huy"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "Lead with the conclusion then expand; practice system design and trade-off discussion."
                  : "Nêu kết luận trước rồi mở rộng; luyện thêm system design và thảo luận trade-off."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SessionResult;
