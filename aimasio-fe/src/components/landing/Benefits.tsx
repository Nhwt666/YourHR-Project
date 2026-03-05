import { Zap, BarChart3, Shield, Activity, MessageSquare, FileCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const benefitsVi = [
  {
    icon: Zap,
    title: "Phỏng vấn cá nhân hóa chỉ trong vài phút",
    description: "YourHR AI điều chỉnh luồng câu hỏi theo vai trò, cấp độ và câu trả lời. Luyện nhiều lần trong môi trường mô phỏng áp lực thật để quen dần và tự tin hơn.",
  },
  {
    icon: MessageSquare,
    title: "Nhận xét hiệu năng cá nhân, rõ từng điểm",
    description: "Nhận phản hồi tức thì về cấu trúc câu trả lời, độ rõ ràng khi giao tiếp, giọng nói và biểu cảm — giúp bạn biết cần cải thiện đâu thay vì chỉ dựa vào cảm tính.",
  },
  {
    icon: BarChart3,
    title: "Tín hiệu rõ ràng, không nhận xét chung chung",
    description: "Nhận bảng điểm có cấu trúc, điểm mạnh và khoảng thiếu để ra quyết định dựa trên dữ liệu.",
  },
  {
    icon: Shield,
    title: "Đánh giá công bằng và nhất quán",
    description: "Tiêu chí minh bạch và cách chấm điểm thống nhất giúp mỗi buổi đánh giá đồng bộ, hạn chế thiên kiến.",
  },
  {
    icon: Activity,
    title: "Phân tích biểu cảm và mô phỏng áp lực",
    description: "Đo tín hiệu biểu cảm, giọng nói và tạo tình huống áp lực có kiểm soát. Luyện lặp lại giúp giảm lo lắng và nâng độ ổn định khi trả lời.",
  },
  {
    icon: FileCheck,
    title: "CV sẵn sàng và tự tin hơn trước phỏng vấn",
    description: "Điểm hóa CV và gợi ý cải thiện theo kỳ vọng nhà tuyển dụng, giúp ứng viên cảm thấy sẵn sàng hơn trước khi bước vào phỏng vấn.",
  },
];

const benefitsEn = [
  {
    icon: Zap,
    title: "Personalised interviews in minutes",
    description: "YourHR AI adapts questions to role, level and your answers. Practice repeatedly in a simulated high-pressure environment to build confidence over time.",
  },
  {
    icon: MessageSquare,
    title: "Personalised performance feedback",
    description: "Get instant feedback on answer structure, communication clarity, voice tone and facial expression — so you know exactly what to improve instead of guessing.",
  },
  {
    icon: BarChart3,
    title: "Clear, structured signals",
    description: "Get structured scorecards with strengths, gaps and next steps instead of vague comments.",
  },
  {
    icon: Shield,
    title: "Fair and consistent evaluation",
    description: "Transparent criteria and consistent scoring help reduce bias across all interview sessions.",
  },
  {
    icon: Activity,
    title: "Behavior & expression under pressure",
    description: "Track voice and facial cues and simulate controlled pressure. Repeated practice helps reduce anxiety and improves stability when answering.",
  },
  {
    icon: FileCheck,
    title: "CV readiness and confidence before interviews",
    description: "AI-based CV scoring and improvement suggestions aligned with recruiter expectations, so you feel more prepared before stepping into the interview.",
  },
];

const Benefits = () => {
  const { language } = useLanguage();
  const benefits = language === "en" ? benefitsEn : benefitsVi;

  const sectionTitle =
    language === "en"
      ? "Why candidates and hiring teams choose YourHR AI"
      : "Vì sao ứng viên và nhà tuyển dụng chọn YourHR AI";

  const heading =
    language === "en"
      ? "Built for personalised interviews"
      : "Xây dựng cho phỏng vấn cá nhân hóa";

  const subtitle =
    language === "en"
      ? "Ask sharper questions. Capture better signals. Decide faster."
      : "Đặt câu hỏi sát hơn. Thu được tín hiệu tốt hơn. Ra quyết định nhanh hơn.";

  return (
    <section id="benefits" className="py-24">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          {sectionTitle}
        </span>
        <h2 className="text-heading mb-3 max-w-2xl">{heading}</h2>
        <p className="mb-14 max-w-2xl text-body-sm text-muted-foreground">
          {subtitle}
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-background p-5 shadow-sm transition-colors hover:border-primary/30">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-subheading mb-2">{b.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
