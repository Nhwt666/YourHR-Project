import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const plansVi = [
  {
    name: "Review & chỉnh sửa CV",
    price: "39.000đ",
    period: "/lượt",
    description: "Gửi CV của bạn để AI phân tích, chấm điểm và gợi ý chỉnh sửa chi tiết.",
    features: [
      "Đánh giá cấu trúc, nội dung và mức độ rõ ràng của CV",
      "Nhận gợi ý câu chữ cụ thể để tăng sức thuyết phục",
      "Highlight điểm mạnh và khoảng thiếu trong kinh nghiệm",
      "Xuất bản tóm tắt CV gọn gàng, dễ đọc cho nhà tuyển dụng",
    ],
    cta: "Đánh giá & chỉnh sửa CV",
    featured: false,
  },
  {
    name: "Tạo phòng phỏng vấn",
    price: "99.000đ",
    period: "/lượt",
    description:
      "Tạo một phòng phỏng vấn mô phỏng chuyên nghiệp, với các tuỳ chọn linh hoạt do chính bạn chọn.",
    features: [
      "Tạo một cuộc phỏng vấn với các tuỳ chọn vai trò, cấp độ và phong cách hỏi riêng cho bạn",
      "Hệ thống chấm điểm rõ ràng theo nhiều tiêu chí: kỹ thuật, giao tiếp, giải quyết vấn đề, phù hợp văn hoá",
      "Báo cáo phân tích mang tính cá nhân hoá: điểm mạnh, điểm trừ và các ví dụ cụ thể",
      "Đề xuất mục tiêu luyện tập tiếp theo để cải thiện điểm yếu và phát huy tiềm năng",
      "Lưu lại lịch sử để theo dõi tiến bộ giữa các buổi phỏng vấn",
    ],
    cta: "Tạo phòng phỏng vấn",
    featured: true,
  },
];

const Pricing = () => {
  const { language } = useLanguage();
  const plans = plansVi; // Nội dung gói giữ tiếng Việt, chỉ dịch phần heading/intro

  const label = language === "en" ? "Pricing" : "Bảng giá";
  const heading =
    language === "en"
      ? "Clear pricing for each action"
      : "Giá rõ ràng cho từng lượt sử dụng";
  const subtitle =
    language === "en"
      ? "Optimize your CV and practice interviews with AI whenever you need. Simple, transparent and easy to start."
      : "Tối ưu CV và luyện phỏng vấn với AI theo nhu cầu của bạn. Đơn giản, minh bạch và dễ bắt đầu.";

  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          {label}
        </span>
        <h2 className="text-heading mb-4 max-w-md">{heading}</h2>
        <p className="text-body-sm text-muted-foreground mb-14 max-w-2xl">
          {subtitle}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 ${
                plan.featured
                  ? "border-2 border-primary bg-background shadow-md"
                  : "border border-border bg-background"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-subheading">{plan.name}</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold text-foreground tracking-tight">{plan.price}</span>
                <span className="text-body-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-body-sm text-muted-foreground mb-6">{plan.description}</p>
              <Button
                variant={plan.featured ? "hero" : "hero-outline"}
                className="w-full mb-6"
                asChild
              >
                <Link to={plan.name === "Review & chỉnh sửa CV" ? "/cv-review" : "/interview-setup"}>
                  {plan.cta}
                </Link>
              </Button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-body-sm text-foreground">
                    <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
