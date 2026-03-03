import AppShell from "@/components/AppShell";
import { Link } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const historyData = [
  {
    id: 1,
    title: "Luyện Frontend cấp cao",
    role: "Kỹ sư Frontend cấp cao",
    score: 8.1,
    comment: "Tự tin khi giải thích, cần bổ sung ví dụ thực tế hơn ở phần performance.",
    date: "28 Thg 2, 2026",
  },
  {
    id: 2,
    title: "Luyện vòng System Design",
    role: "Kỹ sư Frontend cấp cao",
    score: 7.4,
    comment: "Ý tưởng đúng hướng nhưng còn thiếu cấu trúc tổng thể, dễ bị lặp ý.",
    date: "27 Thg 2, 2026",
  },
  {
    id: 3,
    title: "Luyện Product Thinking",
    role: "Nhà thiết kế sản phẩm",
    score: 8.9,
    comment: "Khả năng phân tích nhu cầu tốt, nên rút gọn cách trình bày cho rõ phần ưu tiên.",
    date: "26 Thg 2, 2026",
  },
  {
    id: 4,
    title: "Luyện Backend cơ bản",
    role: "Kỹ sư Backend",
    score: 6.8,
    comment: "Thiếu tự tin khi nói về database và transaction, cần ôn lại khái niệm chuẩn.",
    date: "24 Thg 2, 2026",
  },
  {
    id: 5,
    title: "Luyện phỏng vấn gấp",
    role: "Kỹ sư Backend",
    score: 9.2,
    comment: "Trình bày rõ ràng, ví dụ cụ thể, chỉ cần luyện thêm cách kết câu gọn hơn.",
    date: "22 Thg 2, 2026",
  },
  {
    id: 6,
    title: "Luyện Data Interview",
    role: "Chuyên viên phân tích dữ liệu",
    score: 7.5,
    comment: "Nắm khung phân tích tốt, nhưng phần giải thích thuật ngữ còn hơi dài dòng.",
    date: "20 Thg 2, 2026",
  },
  {
    id: 7,
    title: "Luyện QA Automation",
    role: "Chuyên viên QA Automation",
    score: 8.3,
    comment: "Case test đa dạng, cần bổ sung thêm cách đo lường hiệu quả test.",
    date: "19 Thg 2, 2026",
  },
  {
    id: 8,
    title: "Luyện Product Owner",
    role: "Product Owner",
    score: 7.9,
    comment: "Cách nói chuyện thân thiện, nên nhấn mạnh hơn vào trade‑off khi ra quyết định.",
    date: "18 Thg 2, 2026",
  },
  {
    id: 9,
    title: "Luyện Data Scientist",
    role: "Data Scientist",
    score: 8.7,
    comment: "Hiểu mô hình tốt, cần thêm ví dụ về đánh giá mô hình trong môi trường thực tế.",
    date: "16 Thg 2, 2026",
  },
];

const History = () => {
  const { language } = useLanguage();

  const title =
    language === "en"
      ? "Your interview practice history"
      : "Lịch sử luyện phỏng vấn của bạn";
  const subtitle =
    language === "en"
      ? "Overview of your recent AI practice sessions for this account only."
      : "Tổng hợp các buổi luyện tập gần đây cùng AI, chỉ hiển thị cho tài khoản hiện tại.";
  const tableTitle =
    language === "en" ? "Recent practice sessions" : "Phiên luyện gần đây";
  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Interview archive
        </div>
        <h1 className="text-heading">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold">{tableTitle}</h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" /> 30 ngày gần nhất
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Phiên luyện</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Vị trí</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Điểm</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Nhận xét nhanh</th>
                <th className="text-left py-3 px-5 font-medium text-muted-foreground">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <Link to="/results" className="font-medium text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{item.role}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.score >= 8
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.score >= 7
                            ? "bg-secondary text-foreground border border-border"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.score}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-xs text-muted-foreground max-w-xs">
                    {item.comment}
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};

export default History;
