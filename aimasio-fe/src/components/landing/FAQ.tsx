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
    q: "Hệ thống có lưu lịch sử phỏng vấn và CV không?",
    a: "Có. AI Interview Master tự động lưu lịch sử buổi phỏng vấn và các lượt đánh giá CV để bạn xem lại, so sánh tiến bộ và tải xuống khi cần.",
  },
  {
    q: "Cách tính phí và dùng thử?",
    a: "Không dùng gói. Bạn mua theo lượt: 39.000đ/lượt đánh giá & chỉnh sửa CV, 99.000đ/lượt tạo phòng phỏng vấn. User đăng ký mới được tặng 1 lần đánh giá và chỉnh sửa CV miễn phí.",
  },
  {
    q: "Dữ liệu ứng viên có an toàn không?",
    a: "Dữ liệu được mã hóa khi truyền và lưu trữ. Bạn có thể cài chỉnh chính sách lưu giữ và xóa dữ liệu.",
  },
];

const faqsEn = [
  {
    q: "How does the AI score?",
    a: "The AI scores against your chosen criteria, analysing relevance, clarity of expression and fit for the role.",
  },
  {
    q: "Can candidates cheat?",
    a: "The platform tracks timing, answer consistency and flags unusual behaviour for you to review.",
  },
  {
    q: "Does the system store interview and CV history?",
    a: "Yes. AI Interview Master keeps a history of your interview sessions and CV reviews so you can review them later, track progress and download data when needed.",
  },
  {
    q: "How is pricing and free trial?",
    a: "No plans—pay per use: 39,000 VND per CV review & edit, 99,000 VND per interview room. New sign-ups get 1 free CV review and edit.",
  },
  {
    q: "Is candidate data safe?",
    a: "Data is encrypted in transit and at rest. You can configure retention and deletion policies.",
  },
];

const FAQ = () => {
  const { language } = useLanguage();
  const faqs = language === "en" ? faqsEn : faqsVi;

  const label = language === "en" ? "FAQ" : "Hỏi đáp";
  const heading =
    language === "en" ? "Frequently asked questions" : "Câu hỏi thường gặp";
  const subtitle =
    language === "en"
      ? "Key information about how AI Interview Master works."
      : "Tất cả thông tin quan trọng về AI Interview Master.";

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

