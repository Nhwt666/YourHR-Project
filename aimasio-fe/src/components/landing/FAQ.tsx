import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/i18n/LanguageContext";

const faqsVi = [
  {
    q: "AI chấm điểm như thế nào?",
    a: "Hệ thống AI chấm điểm theo tiêu chí bạn chọn, phân tích độ liên quan nội dung, khả năng diễn đạt và năng lực theo vai trò.",
  },
  {
    q: "Ứng viên có thể gian lận không?",
    a: "Nền tảng theo dõi thời gian, độ nhất quán câu trả lời và đánh dấu hành vi bất thường để bạn kiểm tra lại.",
  },
  {
    q: "Có kết nối với ATS không?",
    a: "Có. Hệ thống hỗ trợ kết nối với các nền tảng ATS phổ biến và có thể mở rộng theo nhu cầu.",
  },
  {
    q: "Sau khi hết dùng thử thì sao?",
    a: "Bạn chọn gói phù hợp để tiếp tục. Dữ liệu phỏng vấn và kết quả vẫn được giữ nguyên.",
  },
  {
    q: "Dữ liệu ứng viên có an toàn không?",
    a: "Dữ liệu được mã hóa khi truyền và lưu trữ. Bạn có thể cài chỉnh chính sách lưu giữ và xóa dữ liệu.",
  },
];

const FAQ = () => {
  const { language } = useLanguage();
  const faqs = faqsVi;

  const label = language === "en" ? "FAQ" : "Hỏi đáp";
  const heading =
    language === "en" ? "Frequently asked questions" : "Câu hỏi thường gặp";
  const subtitle =
    language === "en"
      ? "Key information about how YourHR AI works."
      : "Tất cả thông tin quan trọng về YourHR AI.";

  return (
    <section id="faq" className="py-24 bg-background-alt">
      <div className="container">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          {label}
        </span>
        <h2 className="text-heading mb-4">{heading}</h2>
        <p className="text-body-sm text-muted-foreground mb-12 max-w-md">
          {subtitle}
        </p>
        <div className="max-w-2xl">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-lg px-6 bg-background"
              >
                <AccordionTrigger className="text-body-sm font-medium text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-body-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

