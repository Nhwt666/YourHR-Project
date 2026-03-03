import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const plansVi = [
  {
    name: "Starter",
    price: "169.000đ",
    period: "/tuần",
    description: "Phù hợp cho sinh viên và ứng viên mới luyện phỏng vấn.",
    features: ["8 phiên phỏng vấn/tuần", "Luyện trước 1-2 vòng phỏng vấn quan trọng", "Chấm điểm AI cơ bản và gợi ý cải thiện", "Hỗ trợ qua email"],
    cta: "Bắt đầu với Starter",
    featured: false,
  },
  {
    name: "Standard",
    price: "399.000đ",
    period: "/tháng",
    description: "Gói bán chính cho luyện tập đều đặn và theo dõi tiến bộ.",
    features: [
      "50 phiên phỏng vấn/tháng",
      "Ngân hàng câu hỏi theo vai trò và cấp độ",
      "Theo dõi điểm và tiến độ theo tuần",
      "Đánh giá CV và gợi ý nâng cấp",
      "Hỗ trợ ưu tiên",
    ],
    cta: "Chọn Standard",
    featured: true,
  },
  {
    name: "Premium",
    price: "699.000đ",
    period: "/tháng",
    description: "Dành cho người luyện gấp và ứng tuyển nhiều công ty cùng lúc.",
    features: [
      "100 phiên phỏng vấn/tháng",
      "Lộ trình phỏng vấn cá nhân hóa",
      "Follow-up thích ứng theo điểm yếu",
      "Báo cáo sẵn sàng hàng tuần",
      "Chế độ luyện tập hướng offer",
      "Hỗ trợ nhanh nhất",
    ],
    cta: "Chọn Premium",
    featured: false,
  },
];

const Pricing = () => {
  const { language } = useLanguage();
  const plans = plansVi; // Nội dung gói giữ tiếng Việt, chỉ dịch phần heading/intro

  const label = language === "en" ? "Pricing" : "Bảng giá";
  const heading =
    language === "en"
      ? "Clear pricing for each goal"
      : "Giá rõ ràng, dễ chọn theo mục tiêu";
  const subtitle =
    language === "en"
      ? "Start with a smaller plan to build fundamentals, then upgrade as your interview practice increases."
      : "Bắt đầu với gói nhỏ để luyện nền tảng, sau đó nâng cấp theo tần suất luyện tập và mục tiêu ứng tuyển.";

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
        <div className="grid md:grid-cols-3 gap-6">
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
                {plan.featured && (
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                    Gói phổ biến
                  </span>
                )}
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
                <Link to="/dashboard">{plan.cta}</Link>
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
