import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { reviewCv, type CvReviewResponse } from "@/services/interviewApi";

const CvReview = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Front End - FPT Software");
  const [companyContext, setCompanyContext] = useState("FPT Software Việt Nam | Team Agile/Scrum");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<CvReviewResponse | null>(null);

  const handleReview = async () => {
    if (!file) {
      setStatus("Vui lòng chọn CV (.pdf/.txt/.md).");
      return;
    }
    try {
      setLoading(true);
      setStatus("Đang phân tích CV bằng AI...");
      const data = await reviewCv({
        cvFile: file,
        targetRole,
        companyContext,
      });
      setResult(data);
      setStatus("Đã đánh giá xong CV.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không thể đánh giá CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Free CV review
        </div>
        <h1 className="text-heading">CV Review</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tải CV lên để AI phân tích mức độ phù hợp và gợi ý cải thiện.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-5 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">CV file</p>
            <Input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Vị trí mục tiêu</p>
            <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Bối cảnh công ty</p>
            <Textarea value={companyContext} onChange={(e) => setCompanyContext(e.target.value)} rows={3} />
          </div>
          <Button onClick={handleReview} disabled={loading}>
            {loading ? "Đang đánh giá..." : "Đánh giá CV miễn phí"}
          </Button>
          {status ? (
            <p className="text-xs rounded-md px-2.5 py-1.5 inline-flex text-muted-foreground bg-surface border border-border">
              {status}
            </p>
          ) : null}
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">Điểm tổng quan</p>
              <p className="text-3xl font-bold text-primary mt-1">{result.overallScore}/100</p>
              <p className="text-sm text-muted-foreground mt-3">{result.summary}</p>
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-base font-semibold mb-2">Điểm mạnh</h2>
              {result.strengths.map((item, idx) => (
                <p key={`strength-${idx}`} className="text-sm text-muted-foreground">
                  - {item}
                </p>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-base font-semibold mb-2">Khoảng thiếu</h2>
              {result.gaps.map((item, idx) => (
                <p key={`gap-${idx}`} className="text-sm text-muted-foreground">
                  - {item}
                </p>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-base font-semibold mb-2">Gợi ý cải thiện</h2>
              {result.recommendations.map((item, idx) => (
                <p key={`rec-${idx}`} className="text-sm text-muted-foreground">
                  - {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
};

export default CvReview;
