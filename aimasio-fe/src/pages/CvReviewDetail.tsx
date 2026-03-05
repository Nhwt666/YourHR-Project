import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";

/** Mock data for "chi tiết lượt đánh giá CV" — one page for all history items. */
const mockStrengths = [
  "Kinh nghiệm lập trình Java và Spring Boot",
  "Kỹ năng teamwork và lãnh đạo",
  "Kinh nghiệm sử dụng Git, IntelliJ IDEA, Postman",
  "Kinh nghiệm phát triển dự án lớn (Enterprise Project Tracking)",
  "Kỹ năng Spring Data JPA, Hibernate",
  "Kinh nghiệm Lombok, Spring",
];

const mockGaps = [
  "Thiếu kinh nghiệm Front-end",
  "Thiếu kỹ năng React, Angular, Vue.js",
  "Thiếu kinh nghiệm thiết kế và phát triển ứng dụng di động",
  "Thiếu kỹ năng Webpack, Babel, ESLint",
  "Thiếu kinh nghiệm bảo mật và an ninh mạng",
  "Thiếu kỹ năng Machine Learning, AI",
];

const mockRecommendations = [
  "Nên tham gia các khóa học về Front-end và công nghệ liên quan",
  "Nên tham gia các dự án Front-end và thiết kế ứng dụng di động",
  "Nên học hỏi về bảo mật và an ninh mạng",
  "Nên tham gia cộng đồng lập trình và học hỏi từ chuyên gia",
  "Nên phát triển kỹ năng lãnh đạo và teamwork",
  "Nên tham gia khóa học quản lý dự án và kỹ năng mềm",
];

type CvReviewHistoryItem = {
  id: number;
  title: string;
  role: string;
  score: number;
  comment: string;
  date: string;
};

const CvReviewDetail = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { reviewId } = useParams<{ reviewId: string }>();
  const location = useLocation();
  const stateItem = (location.state as { cvReview?: CvReviewHistoryItem } | null)?.cvReview;

  const item = stateItem ?? {
    id: Number(reviewId) || 1,
    title: language === "en" ? "CV Review" : "Đánh giá CV",
    role: language === "en" ? "Target job" : "Công việc mục tiêu",
    score: 8.0,
    comment:
      language === "en"
        ? "CV has solid experience in Java and Spring Boot; lacks Front-end and newer tech skills."
        : "CV có nhiều kinh nghiệm về Java và Spring Boot, thiếu kinh nghiệm Front-end và kỹ năng công nghệ mới.",
    date: "",
  };

  const scoreDisplay = (item.score ?? 8).toFixed(1);
  const summary = item.comment || (language === "en" ? "Summary from this CV review." : "Tóm tắt từ lượt đánh giá CV này.");

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
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
          {language === "en" ? "CV review detail" : "Chi tiết lượt đánh giá CV"}
        </div>
        <h1 className="text-heading">{item.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {item.role}
          {item.date ? ` · ${item.date}` : ""}
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-5 shadow-sm space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Overall score" : "Điểm tổng quan"}
            </p>
            <p className="mt-1 text-3xl font-bold text-primary">{scoreDisplay}/10</p>
          </div>
          <p className="text-sm text-muted-foreground">{summary}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="sm"
              variant="default"
              className="text-xs"
              type="button"
              onClick={() => navigate("/cv-edit")}
            >
              {language === "en" ? "Get help editing this CV" : "Hỗ trợ chỉnh sửa CV này"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              type="button"
              onClick={() => navigate("/interview-setup")}
            >
              {language === "en"
                ? "Create practice interview from this CV"
                : "Tạo buổi phỏng vấn từ CV này"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-2">
            {language === "en" ? "Strengths" : "Điểm mạnh"}
          </h2>
          {mockStrengths.map((s, idx) => (
            <div key={idx} className="mb-1.5 flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-2">
            {language === "en" ? "Gaps" : "Khoảng thiếu"}
          </h2>
          {mockGaps.map((s, idx) => (
            <div key={idx} className="mb-1.5 flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="text-base font-semibold mb-2">
            {language === "en" ? "Recommendations" : "Đề xuất cải thiện"}
          </h2>
          {mockRecommendations.map((s, idx) => (
            <div key={idx} className="mb-1.5 flex items-start gap-2 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default CvReviewDetail;
