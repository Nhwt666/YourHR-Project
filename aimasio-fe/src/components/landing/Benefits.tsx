import { Zap, BarChart3, Shield, Activity, MessageSquare, FileCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const benefitsVi = [
  {
    icon: Zap,
    title: "AI điều chỉnh câu hỏi theo bạn",
    description:
      "AI điều chỉnh câu hỏi dựa trên vai trò, cấp độ và câu trả lời trước đó để mô phỏng một buổi phỏng vấn sát với bối cảnh thực tế.",
  },
  {
    icon: MessageSquare,
    title: "Nhận xét hiệu năng cá nhân",
    description:
      "Nhận phản hồi về cấu trúc câu trả lời, độ rõ ràng khi giao tiếp và mức độ trôi chảy khi trả lời để biết điểm cần cải thiện.",
  },
  {
    icon: BarChart3,
    title: "Đánh giá có cấu trúc",
    description:
      "Kết quả được tổng hợp thành bảng điểm theo các tiêu chí như nội dung, giao tiếp và tư duy để dễ theo dõi và cải thiện.",
  },
  {
    icon: Shield,
    title: "Đánh giá nhất quán",
    description:
      "Các câu trả lời được đánh giá theo cùng một bộ tiêu chí để đảm bảo sự nhất quán giữa các buổi phỏng vấn.",
  },
  {
    icon: Activity,
    title: "Phân tích tín hiệu giao tiếp",
    description:
      "Hệ thống phân tích một số tín hiệu như tốc độ nói, khoảng dừng và biểu cảm cơ bản để cung cấp phản hồi sau buổi phỏng vấn.",
  },
  {
    icon: FileCheck,
    title: "Chuẩn bị CV tốt hơn trước phỏng vấn",
    description:
      "AI phân tích CV và gợi ý cải thiện nội dung để giúp ứng viên chuẩn bị tốt hơn trước khi bước vào phỏng vấn.",
  },
];

const benefitsEn = [
  {
    icon: Zap,
    title: "Personalised interviews in minutes",
    description: "AI Interview Master adapts questions to role, level and your answers. Practice repeatedly in a simulated high-pressure environment to build confidence over time.",
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
      ? "Why candidates and hiring teams choose AI Interview Master"
      : "Vì sao ứng viên và nhà tuyển dụng chọn AI Interview Master";

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
