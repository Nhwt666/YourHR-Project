import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

type QaLogItem = {
  question: string;
  answer: string;
};

const baseScores = [
  { key: "techDepth", label: "Độ sâu kỹ thuật", score: 8.5 },
  { key: "communication", label: "Giao tiếp", score: 7.2 },
  { key: "problemSolving", label: "Giải quyết vấn đề", score: 9.0 },
  { key: "cultureFit", label: "Phù hợp văn hóa", score: 7.8 },
];

// Mock lịch sử các buổi phỏng vấn gần đây để so sánh tiến bộ (UI-only)
const historyMock = [
  { id: 1, labelVi: "Buổi 1", labelEn: "Session 1", score: 6.8 },
  { id: 2, labelVi: "Buổi 2", labelEn: "Session 2", score: 7.4 },
  { id: 3, labelVi: "Buổi 3 (gần nhất)", labelEn: "Session 3 (latest)", score: 8.1 },
];

const Results = () => {
  const { language } = useLanguage();
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
  const overallScoreNumber = normalizedScore
    ? normalizedScore
    : baseScores.reduce((sum, s) => sum + s.score, 0) / baseScores.length;

  const overallScore = overallScoreNumber.toFixed(1);

  const translatedScores = baseScores.map((item) => {
    if (language === "en") {
      if (item.key === "techDepth") {
        return { ...item, label: "Technical depth" };
      }
      if (item.key === "communication") {
        return { ...item, label: "Communication" };
      }
      if (item.key === "problemSolving") {
        return { ...item, label: "Problem solving" };
      }
      if (item.key === "cultureFit") {
        return { ...item, label: "Culture fit" };
      }
    }
    return item;
  });

  // Ghép lịch sử mock với điểm hiện tại (buổi 3 luôn là gần nhất trong UI)
  const history = historyMock.map((item, index, arr) =>
    index === arr.length - 1 ? { ...item, score: overallScoreNumber } : item,
  );
  const previousSession = history[history.length - 2];
  const latestSession = history[history.length - 1];
  const improvement = latestSession.score - previousSession.score;

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            {language === "en" ? "Final evaluation" : "Đánh giá cuối cùng"}
          </div>
          <h1 className="text-heading">
            {language === "en" ? "Results" : "Kết quả"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === "en"
              ? "AI evaluation report for your most recent interview session."
              : "Báo cáo đánh giá AI cho buổi phỏng vấn gần nhất của bạn."}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-2 shrink-0 cursor-default" disabled>
          <Video className="h-4 w-4" />
          {language === "en" ? "View recording" : "Xem lại record"}
        </Button>
      </div>

      <div className="max-w-5xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-4">
            {language === "en" ? "Score" : "Điểm"}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center justify-center sm:justify-start min-w-[5rem]">
              <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 px-5 py-3 min-w-[5.5rem]">
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
                        style={{ width: `${(s.score / 10) * 120}%` }}
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
              {language === "en"
                ? "Current score vs last 3 sessions"
                : "Điểm hiện tại so với 3 buổi gần nhất"}
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
              {language === "en"
                ? "Trend vs previous session on the left."
                : "Xu hướng so với buổi trước bên trái."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-3">
            {language === "en" ? "Overall feedback" : "Nhận xét tổng quan"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {(savedResult?.feedback && savedResult.feedback.trim()) ? savedResult.feedback :
              (language === "en"
                ? "You show a solid technical foundation and a clear problem‑solving mindset. In the coding part, your answers were well structured: you broke the task into steps, discussed time and space complexity where it mattered, and considered edge cases in at least one solution. In the behavioral section you gave concrete examples with context and outcome, though in one story the link between your action and the result could be stated more explicitly. Communication is generally clear and easy to follow; in a couple of technical explanations you went into implementation detail before giving the high-level takeaway — in a real interview, leading with the conclusion or the one-line summary and then expanding often works better. We did not see major red flags; we’d recommend moving to the next round and suggest focusing the next practice on system design and trade-off discussion so you can show how you weigh options under constraints."
                : "Bạn có nền tảng kỹ thuật vững và tư duy giải quyết vấn đề rõ. Ở phần coding, câu trả lời có bố cục tốt: bạn chia bài ra từng bước, nói đến độ phức tạp thời gian và bộ nhớ đúng chỗ, và có xét edge case trong ít nhất một lời giải. Ở vòng hành vi bạn đưa được ví dụ cụ thể có ngữ cảnh và kết quả, dù một câu chuyện có thể nêu rõ hơn mối liên hệ giữa hành động của bạn và kết quả. Giao tiếp nhìn chung rõ ràng, dễ theo dõi; đôi chỗ trong phần kỹ thuật bạn đi vào chi tiết triển khai trước khi đưa ra ý chính — trong phỏng vấn thật, nên nêu kết luận hoặc một câu tóm tắt trước rồi mới mở rộng. Không thấy điểm trừ nghiêm trọng; có thể cân nhắc cho qua vòng sau và nên ưu tiên luyện thêm system design cùng thảo luận trade-off để thể hiện cách bạn cân nhắc phương án trong điều kiện ràng buộc.")}
          </p>
        </div>

        {/* Nhận xét theo 3 vòng phỏng vấn (Sàng lọc, Kỹ thuật, Hành vi) */}
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-4">
            {language === "en" ? "Feedback by round" : "Nhận xét theo từng vòng"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            {/* Vòng 1: Sàng lọc */}
            <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <p className="font-semibold text-foreground">
                {language === "en" ? "1. Screening" : "1. Phỏng vấn sàng lọc"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en"
                  ? "Check basic background and fit for the role."
                  : "Kiểm tra nền tảng cơ bản và mức độ phù hợp với vị trí."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {language === "en" ? "Usually 10–15 min." : "Thường 10–15 phút."}
              </p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground list-disc list-inside">
                <li>{language === "en" ? "Introduce yourself" : "Giới thiệu bản thân"}</li>
                <li>{language === "en" ? "Current role & experience" : "Công việc hiện tại, kinh nghiệm & dự án"}</li>
              </ul>
            </div>
            {/* Vòng 2: Kỹ thuật */}
            <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <p className="font-semibold text-foreground">
                {language === "en" ? "2. Technical" : "2. Phỏng vấn kỹ thuật"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en"
                  ? "Test technical knowledge and problem-solving."
                  : "Kiểm tra kiến thức kỹ thuật và khả năng giải quyết vấn đề."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {language === "en" ? "Usually 20–40 min." : "Thường 20–40 phút."}
              </p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground list-disc list-inside">
                <li>{language === "en" ? "Coding challenge" : "Bài coding, REST API, sync/async, debugging"}</li>
              </ul>
            </div>
            {/* Vòng 3: Hành vi */}
            <div className="rounded-lg border border-border/70 bg-muted/40 px-4 py-3">
              <p className="font-semibold text-foreground">
                {language === "en" ? "3. Behavioral" : "3. Phỏng vấn hành vi"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "en"
                  ? "How you work in a team and handle situations."
                  : "Cách bạn làm việc nhóm và xử lý tình huống."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {language === "en" ? "Usually 15–25 min." : "Thường 15–25 phút."}
              </p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground list-disc list-inside">
                <li>{language === "en" ? "Teamwork, conflict, failure, leadership" : "Làm việc nhóm, xung đột, thất bại, dẫn dắt"}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Điểm mạnh, điểm yếu, cần phát huy — nhận xét cá nhân hóa */}
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
                  ? "Your answers were structured and easy to follow: you broke problems into steps and stated assumptions before diving in. You showed a good grasp of fundamentals (data structures, complexity) and gave concrete behavioral examples with context and outcome. In the technical part you considered edge cases in at least one solution and mentioned time/space complexity where it mattered. Overall you come across as prepared and thoughtful."
                  : "Câu trả lời có bố cục, dễ theo dõi: bạn chia bài ra từng bước và nêu giả định trước khi đi sâu. Bạn thể hiện nắm vững kiến thức nền (cấu trúc dữ liệu, độ phức tạp) và kể ví dụ hành vi cụ thể có ngữ cảnh và kết quả. Ở phần kỹ thuật bạn có xét edge case trong ít nhất một lời giải và nhắc độ phức tạp đúng chỗ. Nhìn chung bạn thể hiện sự chuẩn bị và suy nghĩ có hệ thống."}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-amber-500/5 px-4 py-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1.5">
                {language === "en" ? "Gaps" : "Điểm yếu"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "In a few answers you went into detail before stating the main point, so the interviewer had to wait for the punchline. One coding answer did not fully cover edge cases or failure modes. In one behavioral story the cause-and-effect between your action and the result could be clearer. These are all improvable with a bit of practice on structure and closing each answer with a one-line summary."
                  : "Ở một vài câu bạn đi vào chi tiết trước khi nêu ý chính nên người phỏng vấn phải chờ đến cuối mới nắm được kết luận. Một câu coding chưa xử lý đủ edge case hoặc trường hợp lỗi. Trong một câu chuyện hành vi, mối quan hệ nhân quả giữa hành động của bạn và kết quả có thể nêu rõ hơn. Những điểm này đều có thể cải thiện khi luyện thêm cách sắp xếp ý và kết mỗi câu trả lời bằng một câu tóm tắt."}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-primary/5 px-4 py-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide text-primary mb-1.5">
                {language === "en" ? "Build on" : "Cần phát huy"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "en"
                  ? "Practice leading with the conclusion or the one-line takeaway, then expanding: that helps in both technical and behavioral answers. For the next sessions, focus on system design and trade-off discussion — how you’d scale a solution, what you’d sacrifice for latency vs consistency, and how you’d validate assumptions. Building a habit of stating impact and outcome in behavioral stories will also strengthen your profile."
                  : "Nên luyện cách nêu kết luận hoặc một câu chốt trước rồi mới mở rộng: áp dụng được cho cả câu kỹ thuật và hành vi. Các buổi sau nên tập trung vào system design và thảo luận trade-off — cách mở rộng giải pháp, đánh đổi giữa độ trễ và tính nhất quán, cách kiểm chứng giả định. Tạo thói quen nêu rõ tác động và kết quả trong câu chuyện hành vi sẽ giúp phần trình bày của bạn thuyết phục hơn."}
              </p>
            </div>
          </div>
        </div>

        {savedResult?.qaLogs?.length ? (
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <h2 className="text-base font-semibold">
              {language === "en" ? "Interview log" : "Nhật ký phỏng vấn"}
            </h2>
            {savedResult.qaLogs.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-lg border border-border p-4 space-y-2 bg-muted/40"
              >
                <p className="text-sm font-medium text-foreground">
                  {language === "en" ? "Q:" : "Hỏi:"} {item.question}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "A:" : "Đáp:"} {item.answer}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
};

export default Results;
