import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type CvEditSuggestions = {
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
};

const mockCvContent =
  "Họ và tên: Nguyễn Minh Anh\nVị trí ứng tuyển: Frontend Developer\n\nKinh nghiệm:\n- 2 năm phát triển React, TypeScript, Tailwind CSS\n- Tham gia xây dựng dashboard phân tích dữ liệu cho khách hàng nội bộ\n\nKỹ năng:\n- React, Next.js, Zustand, REST API\n- Thiết kế UI/UX cơ bản, tối ưu hiệu năng front-end\n\nThành tựu nổi bật:\n- Tối ưu thời gian tải trang chính giảm 40%\n- Đề xuất và triển khai hệ thống component UI dùng lại trong team.";

const CvEdit = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [cvContent, setCvContent] = useState(mockCvContent);
  const lastResult = (location.state as { lastResult?: unknown } | null)?.lastResult;

  const suggestions: CvEditSuggestions | null = useMemo(() => {
    const raw = localStorage.getItem("aimasio_cv_edit_suggestions");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CvEditSuggestions;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    setSaved(false);
  }, []);

  const goBackToReview = () => {
    navigate("/cv-review", { state: { fromCvEdit: true, lastResult } });
  };

  const handleConfirm = () => {
    setSaved(true);
    goBackToReview();
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([cvContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = language === "en" ? "AIInterviewMaster-CV-edited.txt" : "AIInterviewMaster-CV-da-chinh-sua.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore download errors in UI-only mode
    }
  };

  const headerTitle =
    language === "en" ? "Edit CV with AI guidance" : "Chỉnh sửa CV với gợi ý từ AI";
  const headerSubtitle =
    language === "en"
      ? "AI Interview Master highlights changes and suggests how you can polish the CV after a review."
      : "AI Interview Master gợi ý chỉnh sửa và giúp bạn hoàn thiện CV sau bước đánh giá.";

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-7">
          <h1 className="text-heading mb-1">{headerTitle}</h1>
          <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
          <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                {language === "en" ? "Current CV content" : "Nội dung CV hiện tại"}
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {language === "en"
                  ? "You can imagine this is your original CV."
                  : "Hãy tưởng tượng đây là CV gốc của bạn."}
              </span>
            </div>
            <Textarea
              className="min-h-[260px] text-sm font-mono"
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
            />
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={handleDownload}>
                {language === "en" ? "Download edited CV" : "Tải xuống CV đã chỉnh sửa"}
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                {language === "en"
                  ? "Optional edit suggestions"
                  : "Gợi ý chỉnh sửa tùy chọn"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "AI can suggest wording and layout changes like the examples below — apply if they fit your CV."
                  : "AI có thể gợi ý thay đổi câu chữ và bố cục như các ví dụ dưới đây; áp dụng nếu phù hợp với CV của bạn."}
              </p>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2">
                  <p className="font-semibold text-foreground mb-1">
                    {language === "en" ? "Make achievements more measurable" : "Làm rõ thành tựu bằng con số"}
                  </p>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? 'Instead of "Tối ưu thời gian tải trang chính giảm 40%", AI could suggest: "Optimised main landing page and reduced load time by 40%, improving conversion rate by 12%."'
                      : 'Thay vì "Tối ưu thời gian tải trang chính giảm 40%", AI có thể gợi ý: "Tối ưu trang landing chính, giảm 40% thời gian tải và tăng 12% tỷ lệ chuyển đổi."'}
                  </p>
                </div>
                <div className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-2">
                  <p className="font-semibold text-foreground mb-1">
                    {language === "en"
                      ? "Group frontend skills into one strong line"
                      : "Nhóm kỹ năng frontend thành một dòng mạnh hơn"}
                  </p>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "React, Next.js, Zustand and REST can be merged into one compact skill line to save space and stay focused."
                      : "Có thể gộp React, Next.js, Zustand và REST API vào một dòng kỹ năng gọn để tiết kiệm chỗ nhưng vẫn nổi bật."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3 text-xs">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {language === "en" ? "Edits to make (from last review)" : "Gợi ý chỉnh sửa cần thay đổi"}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {language === "en"
                    ? "Based on your latest CV review — these are the changes we recommend you make."
                    : "Dựa trên lượt đánh giá CV vừa chạy; đây là các chỉnh sửa nên thực hiện."}
                </p>
              </div>
              {suggestions ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">{suggestions.summary}</p>
                  <div className="pt-1">
                    <p className="font-medium text-foreground">
                      {language === "en" ? "Key strengths to keep" : "Điểm mạnh nên giữ lại"}
                    </p>
                    <ul className="mt-1 list-disc list-inside text-muted-foreground space-y-0.5">
                      {suggestions.strengths.slice(0, 3).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-foreground">
                      {language === "en" ? "Gaps to address" : "Khoảng thiếu cần bổ sung"}
                    </p>
                    <ul className="mt-1 list-disc list-inside text-muted-foreground space-y-0.5">
                      {suggestions.gaps.slice(0, 3).map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Run a CV review first so we can show recommended edits here."
                    : "Hãy chạy một lượt đánh giá CV trước để hiển thị gợi ý chỉnh sửa cần thay đổi tại đây."}
                </p>
              )}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={handleConfirm}>
                  {language === "en" ? "Confirm these edits" : "Xác nhận chỉnh sửa CV"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goBackToReview}
                >
                  {language === "en" ? "Back to CV review" : "Quay lại đánh giá CV"}
                </Button>
                {saved && (
                  <span className="text-[11px] text-emerald-500">
                    {language === "en"
                      ? "Edits confirmed."
                      : "Đã xác nhận chỉnh sửa."}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default CvEdit;

