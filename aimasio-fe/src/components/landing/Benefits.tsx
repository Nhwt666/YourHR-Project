import { Zap, BarChart3, Shield, Activity } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Phỏng vấn cá nhân hóa chỉ trong vài phút",
    description: "YourHR AI điều chỉnh luồng câu hỏi theo vai trò, cấp độ và câu trả lời để buổi phỏng vấn sát thực tế hơn.",
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
    description: "Đo tín hiệu biểu cảm, giọng nói và tạo tình huống áp lực có kiểm soát để đánh giá độ ổn định khi trả lời.",
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Vì sao ứng viên và nhà tuyển dụng chọn YourHR AI
        </span>
        <h2 className="text-heading mb-3 max-w-2xl">Xây dựng cho phỏng vấn cá nhân hóa</h2>
        <p className="mb-14 max-w-2xl text-body-sm text-muted-foreground">
          Đặt câu hỏi sát hơn. Thu được tín hiệu tốt hơn. Ra quyết định nhanh hơn.
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
