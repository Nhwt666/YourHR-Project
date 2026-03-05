import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, FileText, Sparkles, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { reviewCv, type CvReviewResponse } from "@/services/interviewApi";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CvReview = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Front End - FPT Software");
  const [companyContext, setCompanyContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<CvReviewResponse | null>(null);

  const handleReview = async (options?: {
    fileOverride?: File;
    targetRoleOverride?: string;
    companyContextOverride?: string;
  }) => {
    const effectiveFile = options?.fileOverride ?? file;
    const effectiveRole = options?.targetRoleOverride ?? targetRole;
    const effectiveContext =
      options?.companyContextOverride !== undefined
        ? options.companyContextOverride
        : companyContext;

    if (!effectiveFile) {
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
        cvFile: effectiveFile,
        targetRole: effectiveRole,
        companyContext: effectiveContext,
      });
      setResult(data);
      // Lưu data cho bước hỗ trợ chỉnh sửa CV và dùng lại khi quay lại trang
      try {
        const payload = {
          summary: data.summary,
          strengths: data.strengths,
          gaps: data.gaps,
          recommendations: data.recommendations,
        };
        localStorage.setItem("aimasio_cv_edit_suggestions", JSON.stringify(payload));
      } catch {
        // ignore
      }
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

  // Chỉ khôi phục kết quả khi quay lại từ trang Chỉnh sửa CV (qua state), không đọc localStorage
  useEffect(() => {
    const navState = location.state as
      | { fromCvEdit?: boolean; lastResult?: CvReviewResponse }
      | null
      | undefined;
    if (navState?.fromCvEdit && navState?.lastResult) {
      setResult(navState.lastResult);
      navigate("/cv-review", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const navState = location.state as
      | {
          fromPayment?: boolean;
          cvFile?: File;
          targetRole?: string;
          companyContext?: string;
        }
      | null
      | undefined;

    if (!navState?.fromPayment || !navState.cvFile) {
      return;
    }

    void handleReview({
      fileOverride: navState.cvFile,
      targetRoleOverride: navState.targetRole,
      companyContextOverride: navState.companyContext,
    });

    // Clear navigation state so refresh doesn't re-run review
    navigate("/cv-review", { replace: true, state: null });
  }, [handleReview, location.state, navigate]);

  return (
    <AppShell>
      <div className="mb-6 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          {language === "en" ? "CV review & edits" : "Đánh giá & chỉnh sửa CV"}
        </span>
        <h1 className="text-heading">
          {language === "en" ? "CV review" : "Đánh giá CV"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {language === "en"
            ? "Upload your CV and receive an AI-based assessment: score, strengths, gaps and ideas to improve."
            : "Tải CV lên và nhận đánh giá thực tế từ AI: điểm số, điểm mạnh, khoảng thiếu và hướng cải thiện."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {language === "en"
            ? "Each 39k review also includes a guided edit step to help you polish the CV right after the feedback."
            : "Mỗi lượt 39k đã bao gồm thêm bước hỗ trợ chỉnh sửa CV ngay sau khi nhận feedback."}
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center text-sm font-semibold">
            {language === "en" ? "Role fit score" : "Mức độ phù hợp vị trí"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "en"
              ? "Measure how well your CV matches the target role."
              : "Đo mức độ khớp giữa CV và yêu cầu vị trí."}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center text-sm font-semibold">
            {language === "en" ? "Skills" : "Kỹ năng"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "en"
              ? "Highlight the skills that are missing or need more weight."
              : "Làm rõ nhóm kỹ năng còn thiếu hoặc cần nhấn mạnh thêm."}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center text-sm font-semibold">
            {language === "en" ? "Suggestions" : "Gợi ý"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "en"
              ? "Short, concrete tips you can apply right away."
              : "Các gợi ý ngắn gọn, dễ áp dụng ngay cho CV của bạn."}
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
              {language === "en" ? "Target job" : "Công việc mục tiêu"}
            </p>
            <Select value={targetRole} onValueChange={setTargetRole}>
              <SelectTrigger className="mt-0.5">
                <SelectValue
                  placeholder={
                    language === "en" ? "Select target job" : "Chọn công việc mục tiêu"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Front End - FPT Software">Front End - FPT Software</SelectItem>
                <SelectItem value="Back End - FPT Software">Back End - FPT Software</SelectItem>
                <SelectItem value="Frontend Developer - React/Next.js">
                  Frontend Developer - React/Next.js
                </SelectItem>
                <SelectItem value="Backend Developer - Node.js/Express">
                  Backend Developer - Node.js/Express
                </SelectItem>
                <SelectItem value="Fullstack Developer - JS/TS">
                  Fullstack Developer - JS/TS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">
              {language === "en" ? "Additional description" : "Mô tả bổ sung"}
            </p>
            <Textarea
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              rows={3}
              placeholder={
                language === "en"
                  ? "Optional: JD highlights, target company, tech stack..."
                  : "Tuỳ chọn: vài ý JD, công ty mục tiêu, tech stack..."
              }
            />
          </div>
          <Button
            onClick={() => {
              if (!file) {
                setStatus(
                  language === "en"
                    ? "Please choose a CV file (.pdf, .txt, .md) before paying."
                    : "Vui lòng chọn file CV (.pdf, .txt, .md) trước khi thanh toán.",
                );
                return;
              }
              setStatus("");
              navigate("/cv-payment", {
                state: {
                  from: "cv-review",
                  cvFile: file,
                  targetRole,
                  companyContext,
                },
              });
            }}
            disabled={loading}
            className="min-w-44"
          >
            {language === "en" ? "Review CV" : "Đánh giá CV"}
          </Button>
          {status ? (
            <p className="text-xs rounded-md px-2.5 py-1.5 inline-flex text-muted-foreground bg-surface border border-border">
              {status}
            </p>
          ) : null}
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Overall score" : "Điểm tổng quan"}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-primary">{(result.overallScore / 10).toFixed(1)}/10</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="sm"
                  variant="hero"
                  className="text-xs"
                  type="button"
                  onClick={() => navigate("/cv-edit", { state: { lastResult: result } })}
                >
                  {language === "en"
                    ? "Get help editing this CV"
                    : "Hỗ trợ chỉnh sửa CV này"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.setItem("aimasio_use_cv_for_interview", "1");
                    } catch {
                      // ignore
                    }
                    navigate("/interview-setup");
                  }}
                >
                  {language === "en"
                    ? "Create practice interview from this CV"
                    : "Tạo buổi phỏng vấn thử từ CV này"}
                </Button>
              </div>
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
