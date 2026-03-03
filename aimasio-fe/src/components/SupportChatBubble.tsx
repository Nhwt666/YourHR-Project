import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Question = {
  id: string;
  labelVi: string;
  labelEn: string;
  answerVi: string;
  answerEn: string;
};

const questions: Question[] = [
  {
    id: "how-interview-works",
    labelVi: "Buổi phỏng vấn hoạt động thế nào?",
    labelEn: "How does the AI interview work?",
    answerVi:
      "Mỗi buổi phỏng vấn gồm nhiều câu hỏi theo vai trò. AI sẽ đọc câu trả lời của bạn, chấm điểm và cuối buổi tạo báo cáo tổng hợp điểm mạnh, điểm yếu và gợi ý cải thiện.",
    answerEn:
      "Each interview consists of role‑specific questions. The AI listens to your answers, scores them and then generates a report with strengths, gaps and concrete suggestions.",
  },
  {
    id: "cv-review",
    labelVi: "AI đánh giá CV ra sao?",
    labelEn: "How does CV review work?",
    answerVi:
      "Bạn tải CV lên, chọn vị trí và bối cảnh công ty. AI sẽ đọc nội dung, cho điểm tổng quan, liệt kê điểm mạnh, khoảng thiếu và các đề xuất chỉnh sửa từng phần.",
    answerEn:
      "You upload your CV, choose a target role and company context. The AI analyses the content, gives an overall score, highlights strengths, missing skills and concrete edit suggestions.",
  },
  {
    id: "pricing",
    labelVi: "Các gói giá khác nhau thế nào?",
    labelEn: "What is the difference between plans?",
    answerVi:
      "Gói miễn phí phù hợp để làm quen sản phẩm. Các gói trả phí (Standard, Premium) mở thêm số buổi phỏng vấn mỗi tháng, nhiều mẫu câu hỏi hơn và báo cáo chi tiết hơn.",
    answerEn:
      "The free plan is great for trying the product. Paid plans (Standard, Premium) increase the number of monthly sessions, question banks and depth of reporting.",
  },
];

const SupportChatBubble = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState<Question | null>(null);

  const title =
    language === "en" ? "Need quick help?" : "Cần hỗ trợ nhanh?";
  const intro =
    language === "en"
      ? "Ask YourHR AI assistant about how the product works."
      : "Hỏi trợ lý YourHR AI về cách sản phẩm hoạt động.";
  const placeholder =
    language === "en"
      ? "Shortly this will become a real chat. For now, pick a quick question above."
      : "Trong bản demo này, bạn hãy chọn một câu hỏi có sẵn ở trên để xem giải thích nhanh.";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 max-w-[90vw] rounded-2xl border border-border bg-background shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/80">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                AI
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">{title}</span>
                <span className="text-[10px] text-muted-foreground">
                  YourHR assistant
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-surface"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <div className="px-4 py-3 space-y-3">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              {intro}
            </p>
            <div className="space-y-1.5">
              {questions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveAnswer(q)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-left text-[11px] text-foreground hover:border-primary/40"
                >
                  {language === "en" ? q.labelEn : q.labelVi}
                </button>
              ))}
            </div>
            <div className="rounded-lg border border-dashed border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
              {activeAnswer ? (
                <>
                  <p className="font-semibold text-foreground mb-1">
                    {language === "en" ? activeAnswer.labelEn : activeAnswer.labelVi}
                  </p>
                  <p>
                    {language === "en" ? activeAnswer.answerEn : activeAnswer.answerVi}
                  </p>
                </>
              ) : (
                <p>{placeholder}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_18px_40px_-24px_rgba(79,70,229,0.9)] hover:scale-105"
        aria-label="Open support chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SupportChatBubble;

