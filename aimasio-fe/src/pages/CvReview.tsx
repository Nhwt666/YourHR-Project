import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Award, CheckCircle2, FileText, Sparkles, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { reviewCv, type CvReviewResponse } from "@/services/interviewApi";
import { useLanguage } from "@/i18n/LanguageContext";

const CvReview = () => {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Front End - FPT Software");
  const [companyContext, setCompanyContext] = useState("FPT Software Việt Nam | Nhóm Agile/Scrum");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<CvReviewResponse | null>(null);

  const handleReview = async () => {
    if (!file) {
      setStatus(
        language === "en"
          ? "Please choose a CV file (.pdf, .txt, .md)."
          : "Vui lòng chọn file CV (.pdf, .txt, .md).",
      );
      return;
    }
    try {
      setLoading(true);
      setStatus(
        language === "en"
          ? "Analyzing your CV with AI..."
          : "Đang phân tích CV bằng AI...",
      );
      const data = await reviewCv({
        cvFile: file,
        targetRole,
        companyContext,
      });
      setResult(data);
      setStatus(
        language === "en" ? "CV review completed." : "Đánh giá CV hoàn tất.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : language === "en"
            ? "The CV cannot be reviewed right now."
            : "Chưa thể đánh giá CV lúc này.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          {language === "en" ? "Free CV review" : "Đánh giá CV miễn phí"}
        </div>
        <h1 className="text-heading">
          {language === "en" ? "CV review" : "Đánh giá CV"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {language === "en"
            ? "Upload your CV and receive an AI-based assessment: score, strengths, gaps and ideas to improve."
            : "Tải CV lên và nhận đánh giá thực tế từ AI: điểm số, điểm mạnh, khoảng thiếu và hướng cải thiện."}
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-primary" />
            {language === "en" ? "Role fit score" : "Mức độ phù hợp vị trí"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "en"
              ? "Measure how well your CV matches the target role."
              : "Đo mức độ khớp giữa CV và yêu cầu vị trí."}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            {language === "en" ? "Skill gaps" : "Khoảng thiếu kỹ năng"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "en"
              ? "Identify missing skills and their priority."
              : "Xác định kỹ năng còn thiếu và mức ưu tiên bổ sung."}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            {language === "en"
              ? "Actions you can apply now"
              : "Gợi ý có thể áp dụng ngay"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "en"
              ? "Get clear, practical suggestions you can act on."
              : "Nhận đề xuất rõ ràng, thực tế và dễ hành động."}
          </p>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-sm">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              {language === "en" ? "CV file" : "Tệp CV"}
            </p>
            <Input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {language === "en"
                ? "Supported formats: PDF, TXT, MD"
                : "Định dạng hỗ trợ: PDF, TXT, MD"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">
              {language === "en" ? "Target role" : "Vị trí mục tiêu"}
            </p>
            <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">
              {language === "en" ? "Company context" : "Bối cảnh công ty"}
            </p>
            <Textarea value={companyContext} onChange={(e) => setCompanyContext(e.target.value)} rows={3} />
          </div>
          <Button onClick={handleReview} disabled={loading} className="min-w-44">
            {loading
              ? language === "en"
                ? "Analyzing..."
                : "Đang phân tích..."
              : language === "en"
                ? "Review CV for free"
                : "Đánh giá CV miễn phí"}
          </Button>
          {status ? (
            <p className="text-xs rounded-md px-2.5 py-1.5 inline-flex text-muted-foreground bg-surface border border-border">
              {status}
            </p>
          ) : null}
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Overall score" : "Điểm tổng quan"}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-primary">{result.overallScore}/100</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Award className="h-3.5 w-3.5" />
                  {language === "en" ? "Reviewed by AI" : "Đã được AI đánh giá"}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{result.summary}</p>
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-base font-semibold mb-2">
                {language === "en" ? "Strengths" : "Điểm mạnh"}
              </h2>
              {result.strengths.map((item, idx) => (
                <div key={`strength-${idx}`} className="mb-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-base font-semibold mb-2">
                {language === "en" ? "Gaps" : "Khoảng thiếu"}
              </h2>
              {result.gaps.map((item, idx) => (
                <div key={`gap-${idx}`} className="mb-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-base font-semibold mb-2">
                {language === "en" ? "Recommendations" : "Đề xuất cải thiện"}
              </h2>
              {result.recommendations.map((item, idx) => (
                <div key={`rec-${idx}`} className="mb-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
};

export default CvReview;
