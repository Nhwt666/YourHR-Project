/** Shared list for History page and SessionResult detail (lookup by id). */
export type InterviewHistoryItem = {
  id: number;
  title: string;
  role: string;
  score: number;
  comment: string;
  date: string;
};

export const interviewHistoryList: InterviewHistoryItem[] = [
  { id: 1, title: "Luyện Frontend cấp cao", role: "Kỹ sư Frontend cấp cao", score: 8.1, comment: "Tự tin khi giải thích, cần bổ sung ví dụ thực tế hơn ở phần performance.", date: "28 Thg 2, 2026" },
  { id: 2, title: "Luyện vòng System Design", role: "Kỹ sư Frontend cấp cao", score: 7.4, comment: "Ý tưởng đúng hướng nhưng còn thiếu cấu trúc tổng thể, dễ bị lặp ý.", date: "27 Thg 2, 2026" },
  { id: 3, title: "Luyện Product Thinking", role: "Nhà thiết kế sản phẩm", score: 8.9, comment: "Khả năng phân tích nhu cầu tốt, nên rút gọn cách trình bày cho rõ phần ưu tiên.", date: "26 Thg 2, 2026" },
  { id: 4, title: "Luyện Backend cơ bản", role: "Kỹ sư Backend", score: 6.8, comment: "Thiếu tự tin khi nói về database và transaction, cần ôn lại khái niệm chuẩn.", date: "24 Thg 2, 2026" },
  { id: 5, title: "Luyện phỏng vấn gấp", role: "Kỹ sư Backend", score: 9.2, comment: "Trình bày rõ ràng, ví dụ cụ thể, chỉ cần luyện thêm cách kết câu gọn hơn.", date: "22 Thg 2, 2026" },
  { id: 6, title: "Luyện Data Interview", role: "Chuyên viên phân tích dữ liệu", score: 7.5, comment: "Nắm khung phân tích tốt, nhưng phần giải thích thuật ngữ còn hơi dài dòng.", date: "20 Thg 2, 2026" },
  { id: 7, title: "Luyện QA Automation", role: "Chuyên viên QA Automation", score: 8.3, comment: "Case test đa dạng, cần bổ sung thêm cách đo lường hiệu quả test.", date: "19 Thg 2, 2026" },
  { id: 8, title: "Luyện Product Owner", role: "Product Owner", score: 7.9, comment: "Cách nói chuyện thân thiện, nên nhấn mạnh hơn vào trade‑off khi ra quyết định.", date: "18 Thg 2, 2026" },
  { id: 9, title: "Luyện Data Scientist", role: "Data Scientist", score: 8.7, comment: "Hiểu mô hình tốt, cần thêm ví dụ về đánh giá mô hình trong môi trường thực tế.", date: "16 Thg 2, 2026" },
];
