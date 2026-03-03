import { useLanguage } from "@/i18n/LanguageContext";

const stepsVi = [
  {
    number: "01",
    title: "Chọn hồ sơ phỏng vấn",
    description: "Chọn vai trò và bối cảnh để AI cá nhân hóa bộ câu hỏi đúng mục tiêu.",
  },
  {
    number: "02",
    title: "Phỏng vấn trực tiếp cá nhân hóa",
    description: "Trả lời theo thời gian thực, AI tự điều chỉnh câu hỏi tiếp theo dựa trên nội dung bạn vừa nói.",
  },
  {
    number: "03",
    title: "Nhận báo cáo AI ngay lập tức",
    description: "Xem điểm số, điểm mạnh, khoảng thiếu và đề xuất cải thiện có thể áp dụng ngay.",
  },
];

const Process = () => {
  const { language } = useLanguage();

  const steps =
    language === "en"
      ? [
          {
            number: "01",
            title: "Choose interview profile",
            description: "Select role and context so AI can generate the right question set.",
          },
          {
            number: "02",
            title: "Run a live, adaptive interview",
            description: "Answer in real time while AI adjusts follow‑up questions based on what you say.",
          },
          {
            number: "03",
            title: "Get instant AI report",
            description: "See scores, strengths, gaps and actionable recommendations right after the session.",
          },
        ]
      : stepsVi;

  const label = language === "en" ? "How it works" : "Quy trình hoạt động";
  const heading =
    language === "en"
      ? "3 steps to complete a personalised interview"
      : "3 bước để hoàn thành một buổi phỏng vấn cá nhân hóa";
  const subtitle =
    language === "en"
      ? "A simple flow: choose context, interview, then review a structured AI report."
      : "Luồng xử lý gọn gàng: chọn bối cảnh, phỏng vấn, nhận báo cáo AI có cấu trúc.";

  return (
    <section id="process" className="py-24 bg-gradient-to-b from-background-alt to-background">
      <div className="container">
        <div className="mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            {label}
          </span>
          <h2 className="text-heading max-w-2xl">{heading}</h2>
          <p className="text-body-sm text-muted-foreground mt-3 max-w-xl">
            {subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.number}
              className="relative rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Bước
                </span>
                <span className="text-3xl font-bold text-primary/20 select-none leading-none">{s.number}</span>
              </div>
              <h3 className="text-subheading mb-2">{s.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
