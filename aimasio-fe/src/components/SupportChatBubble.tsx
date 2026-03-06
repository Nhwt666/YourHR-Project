import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  id: number;
  from: "user" | "assistant";
  text: string;
};

const SupportChatBubble = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 1,
      from: "assistant",
      text:
        language === "en"
          ? "Hi, this is the AI Interview Master assistant. This is a demo chat — send a message and it will stay here as your note."
          : "Chào bạn, mình là trợ lý AI Interview Master. Đây là khung chat demo, bạn có thể gửi tin nhắn để lưu lại ghi chú của riêng mình.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const title =
    language === "en" ? "Need quick help?" : "Cần hỗ trợ nhanh?";
  const intro =
    language === "en"
      ? "This chat is a simple demo and does not send data to any server."
      : "Khung chat này chỉ là demo giao diện, không gửi dữ liệu ra bên ngoài.";
  const inputPlaceholder =
    language === "en"
      ? "Type a message..."
      : "Nhập nội dung cần ghi chú...";

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "user", text: trimmed },
    ]);
    setDraft("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 max-w-[90vw] rounded-2xl border border-border bg-background shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/80">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                AI
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">{title}</span>
                <span className="text-[10px] text-muted-foreground">
                  AI Interview Master assistant
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-surface"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-1 flex flex-col px-4 py-3 gap-3">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              {intro}
            </p>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed ${
                      m.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-foreground border border-border/70"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            className="border-t border-border/80 px-3 py-2 flex items-center gap-2 bg-background"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" size="sm" className="h-7 px-3 text-[11px]">
              {language === "en" ? "Send" : "Gửi"}
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_18px_40px_-24px_rgba(79,70,229,0.9)] hover:scale-105"
        aria-label="Open support chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SupportChatBubble;

