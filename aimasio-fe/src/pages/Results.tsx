import AppShell from "@/components/AppShell";
import { Trophy } from "lucide-react";
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

  const strongestArea = translatedScores.reduce((best, current) =>
    current.score > best.score ? current : best,
  );
  const weakestArea = translatedScores.reduce((worst, current) =>
    current.score < worst.score ? current : worst,
  );

  const percentile = Math.round((overallScoreNumber / 10) * 100);

  // Ghép lịch sử mock với điểm hiện tại (buổi 3 luôn là gần nhất trong UI)
  const history = historyMock.map((item, index, arr) =>
    index === arr.length - 1 ? { ...item, score: overallScoreNumber } : item,
  );
  const previousSession = history[history.length - 2];
  const latestSession = history[history.length - 1];
  const improvement = latestSession.score - previousSession.score;

  const trendLabel =
    overallScoreNumber >= 8.5
      ? language === "en"
        ? "Top performance range"
        : "Nhóm hiệu suất rất cao"
      : overallScoreNumber >= 7.5
        ? language === "en"
          ? "Strong performance range"
          : "Nhóm hiệu suất tốt"
        : language === "en"
          ? "Needs improvement"
          : "Cần cải thiện";

  const focusSuggestions =
    language === "en"
      ? [
          "Practice explaining solutions out loud in 2–3 concise steps.",
          "Prepare 2–3 concrete project stories that show impact, not just tasks.",
          "Simulate whiteboard/system‑design sessions to improve structure and trade‑off discussions.",
        ]
      : [
          "Luyện thói quen trình bày lời giải gọn trong 2–3 ý chính.",
          "Chuẩn bị 2–3 câu chuyện dự án nêu rõ tác động, không chỉ liệt kê công việc.",
          "Mô phỏng các buổi whiteboard/system design để quen phân tích trade‑off.",
        ];

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
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

      <div className="max-w-5xl space-y-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch">
          <div className="rounded-xl border border-border p-6 bg-background flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl font-bold text-primary">{overallScore}</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold">
                {language === "en" ? "Overall score" : "Điểm tổng quan"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {savedResult
                  ? language === "en"
                    ? "Taken from your latest interview result."
                    : "Lấy từ kết quả buổi phỏng vấn mới nhất."
                  : language === "en"
                    ? `Aggregated from ${translatedScores.length} evaluation dimensions.`
                    : `Tổng hợp từ ${translatedScores.length} tiêu chí đánh giá.`}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "Scale 0–10. Anything above 7.5 is generally considered strong performance."
                  : "Thang điểm 0–10. Mức trên 7.5 thường được xem là thể hiện tốt."}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border p-6 bg-background space-y-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Trophy className="h-4 w-4 text-primary" />
                {language === "en" ? "Recommendation" : "Khuyến nghị"}
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {trendLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {overallScoreNumber >= 8
                ? language === "en"
                  ? "Strong overall performance – recommended to move to the next interview round."
                  : "Hiệu suất tổng thể tốt – nên được đề xuất vào vòng phỏng vấn tiếp theo."
                : language === "en"
                  ? "Some signals are not yet consistent – consider one more practice session before advancing."
                  : "Một số tín hiệu chưa ổn định – nên luyện thêm 1 buổi nữa trước khi vào vòng tiếp theo."}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
                  {language === "en" ? "Percentile" : "Nhóm phần trăm"}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{percentile}th</p>
                <p className="mt-0.5">
                  {language === "en"
                    ? "Estimated vs other candidates who practice with YourHR AI."
                    : "Ước tính so với các ứng viên khác đang luyện tập trên YourHR AI."}
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
                  {language === "en" ? "Session quality" : "Chất lượng phiên luyện"}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {overallScoreNumber >= 8.5
                    ? language === "en"
                      ? "Very consistent"
                      : "Rất ổn định"
                    : overallScoreNumber >= 7.5
                      ? language === "en"
                        ? "Good but uneven"
                        : "Tốt nhưng chưa đều"
                      : language === "en"
                        ? "Inconsistent"
                        : "Chưa ổn định"}
                </p>
                <p className="mt-0.5">
                  {language === "en"
                    ? "Based on balance between technical, problem‑solving and soft skills."
                    : "Dựa trên sự cân bằng giữa kỹ thuật, giải quyết vấn đề và kỹ năng mềm."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold">
                {language === "en" ? "Score breakdown" : "Chi tiết điểm"}
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {language === "en" ? "Longer bar = stronger signal" : "Thanh dài hơn = tín hiệu mạnh hơn"}
              </span>
            </div>
            {translatedScores.map((s) => (
              <div key={s.key} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-40 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(s.score / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-10 text-right">
                  {s.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5 text-sm">
              <h3 className="font-semibold text-foreground mb-2">
                {language === "en"
                  ? "Progress vs previous sessions"
                  : "Tiến bộ so với các buổi trước"}
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    {language === "en"
                      ? "Latest vs previous session"
                      : "Buổi gần nhất so với buổi liền trước"}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      improvement >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {improvement >= 0 ? "+" : ""}
                    {improvement.toFixed(1)}
                  </span>
                </div>
                <p>
                  {language === "en"
                    ? "Your last session improved compared to the one before it, showing measurable progress over time."
                    : "Buổi gần nhất đã cải thiện so với buổi trước đó, cho thấy tiến bộ có thể đo được theo thời gian."}
                </p>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="w-28 shrink-0 text-foreground font-medium text-[11px]">
                      {language === "en" ? item.labelEn : item.labelVi}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/80"
                        style={{ width: `${item.score * 10}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] text-foreground font-medium">
                      {item.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-5 text-sm">
              <h3 className="font-semibold text-foreground mb-2">
                {language === "en" ? "Strongest signal" : "Tín hiệu mạnh nhất"}
              </h3>
              <p className="text-xs font-medium text-primary mb-1">{strongestArea.label}</p>
              <p className="text-xs text-muted-foreground mb-1">
                {language === "en"
                  ? "This is the dimension where you currently stand out the most."
                  : "Đây là tiêu chí bạn đang thể hiện nổi bật nhất."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-5 text-sm">
              <h3 className="font-semibold text-foreground mb-2">
                {language === "en" ? "Priority to improve" : "Ưu tiên cải thiện"}
              </h3>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                {weakestArea.label}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                {language === "en"
                  ? "Focus your next 1–2 practice sessions here to lift the whole profile."
                  : "Tập trung 1–2 buổi luyện tiếp theo vào tiêu chí này để kéo mặt bằng chung lên."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)]">
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-base font-semibold mb-3">
              {language === "en" ? "AI summary" : "Tổng kết AI"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {savedResult?.feedback ??
                (language === "en"
                  ? "You show a solid technical foundation and clear problem‑solving mindset. Communication can be more concise in a few parts. Recommended for the next round with a focus on system design."
                  : "Ứng viên có nền tảng kỹ thuật tốt và tư duy giải quyết vấn đề rõ ràng. Khả năng trình bày cần gọn hơn ở một vài điểm. Đề xuất vào vòng tiếp theo với trọng tâm về system design.")}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 text-sm">
            <h2 className="text-base font-semibold mb-2">
              {language === "en" ? "Next steps to practice" : "Bước tiếp theo nên luyện"}
            </h2>
            <ul className="mt-1 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              {focusSuggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-base font-semibold">
              {language === "en" ? "Signals detected in this session" : "Các tín hiệu chính trong phiên này"}
            </h2>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 font-medium">
                {language === "en" ? "Confident on core topics" : "Tự tin ở chủ đề cốt lõi"}
              </span>
              <span className="rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 px-2 py-0.5 font-medium">
                {language === "en" ? "Structured problem solving" : "Giải quyết vấn đề có cấu trúc"}
              </span>
              <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 font-medium">
                {language === "en" ? "Storytelling needs polish" : "Câu chuyện dự án cần mượt hơn"}
              </span>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
              <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
                {language === "en" ? "Technical signals" : "Tín hiệu kỹ thuật"}
              </p>
              <p className="mt-1">
                {language === "en"
                  ? "Good coverage of core concepts. Can add more depth on trade‑offs and complexity analysis."
                  : "Bao phủ tốt các khái niệm cốt lõi. Có thể đào sâu thêm về trade‑off và phân tích độ phức tạp."}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
              <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
                {language === "en" ? "Communication" : "Giao tiếp"}
              </p>
              <p className="mt-1">
                {language === "en"
                  ? "Explains steps clearly but sometimes adds extra details – practice shorter, sharper answers."
                  : "Trình bày rõ ràng nhưng đôi lúc lan man – nên luyện trả lời ngắn gọn, đi thẳng vào ý chính."}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
              <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
                {language === "en" ? "Culture & ownership" : "Phù hợp văn hóa & chủ động"}
              </p>
              <p className="mt-1">
                {language === "en"
                  ? "Shows ownership mindset and care for impact; can highlight collaboration examples more."
                  : "Thể hiện tư duy sở hữu và quan tâm đến tác động; có thể kể thêm ví dụ về hợp tác với team."}
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-border/70 pt-3 grid gap-3 md:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide mb-1.5">
                {language === "en" ? "Main penalties this time" : "Điểm trừ chính trong phiên này"}
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  {language === "en"
                    ? "Skipped edge cases in at least one coding answer."
                    : "Bỏ qua các edge case trong ít nhất một câu trả lời coding."}
                </li>
                <li>
                  {language === "en"
                    ? "Did not always mention complexity or trade‑offs when changing the solution."
                    : "Chưa luôn phân tích độ phức tạp hoặc trade‑off khi thay đổi hướng giải."}
                </li>
                <li>
                  {language === "en"
                    ? "Some answers lacked a clear closing summary."
                    : "Một vài câu trả lời chưa có phần chốt lại rõ ràng."}
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground text-[11px] uppercase tracking-wide mb-1.5">
                {language === "en" ? "Visible improvements vs old sessions" : "Điểm đã cải thiện so với trước"}
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  {language === "en"
                    ? "More structured when breaking down large problems into steps."
                    : "Có cấu trúc hơn khi chia nhỏ bài toán lớn thành từng bước."}
                </li>
                <li>
                  {language === "en"
                    ? "Better at tying answers back to impact on users or business."
                    : "Giải thích rõ hơn tác động của giải pháp tới người dùng hoặc business."}
                </li>
                <li>
                  {language === "en"
                    ? "Less hesitation at the beginning of answers compared to earlier sessions."
                    : "Ít ngập ngừng ở phần mở đầu câu trả lời hơn các buổi trước."}
                </li>
              </ul>
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
