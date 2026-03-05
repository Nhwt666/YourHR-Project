import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startInterview } from "@/services/interviewApi";

const QR_EXPIRY_SECONDS = 10 * 60; // 10 minutes

const InterviewPayment = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [secondsLeft, setSecondsLeft] = useState(QR_EXPIRY_SECONDS);
  const state = (location.state || {}) as {
    from?: string;
    role?: string;
    description?: string;
    styles?: {
      technical?: boolean;
      behavioural?: boolean;
      screening?: boolean;
    };
  };

  const title =
    language === "en"
      ? "Pay 99,000đ for one AI interview"
      : "Thanh toán 99.000đ cho một buổi phỏng vấn với AI";

  const subtitle =
    language === "en"
      ? "Scan the VietQR code below to complete this interview session payment."
      : "Quét mã VietQR bên dưới để hoàn tất bước thanh toán cho lượt phỏng vấn này.";

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;
  const countdownText = `${min}:${sec.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl py-16">
        <div className="rounded-2xl border border-border bg-background/80 p-6 md:p-8 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
            {language === "en" ? "VietQR payment" : "Thanh toán VietQR"}
          </p>
          <h1 className="text-heading mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 flex flex-col items-center justify-center">
              <div className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {language === "en" ? "VietQR" : "Mã VietQR"}
              </div>
              <div className="h-56 w-56 rounded-xl bg-background border border-border flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    language === "en"
                      ? "VIETQR_INTERVIEW_99000"
                      : "VIETQR_THANH_TOAN_INTERVIEW_99000",
                  )}`}
                  alt={
                    language === "en"
                      ? "VietQR for interview payment"
                      : "Mã VietQR cho thanh toán phòng phỏng vấn"
                  }
                  className="h-48 w-48"
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                {language === "en"
                  ? "Amount: 99,000đ • Content: INT99 + your email"
                  : "Số tiền: 99.000đ • Nội dung: INT99 + email của bạn"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                {language === "en" ? "QR expires in " : "Mã QR hết hạn sau "}
                <span className="font-mono font-semibold text-foreground">{countdownText}</span>
              </p>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground">
              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="font-semibold text-foreground mb-0.5">
                  {language === "en"
                    ? "Having issues?"
                    : "Nếu có lỗi trong quá trình thanh toán"}
                </p>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Please contact customer support via our fanpage."
                    : "Vui lòng liên hệ CSKH qua fanpage của chúng tôi."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={async () => {
                    try {
                      const baseRole = state.role ?? "Frontend Developer";
                      const context = state.description
                        ? `${baseRole} | Context: ${state.description}`
                        : baseRole;
                      const styleLabels: string[] = [];
                      if (state.styles?.technical) {
                        styleLabels.push(
                          language === "en" ? "Technical interview" : "Phỏng vấn kỹ thuật",
                        );
                      }
                      if (state.styles?.behavioural) {
                        styleLabels.push(
                          language === "en" ? "Behavioural interview" : "Phỏng vấn hành vi",
                        );
                      }
                      if (state.styles?.screening) {
                        styleLabels.push(
                          language === "en" ? "Screening interview" : "Phỏng vấn sàng lọc",
                        );
                      }
                      const styleSuffix =
                        styleLabels.length > 0
                          ? ` | Styles: ${styleLabels.join(", ")}`
                          : "";

                      const jobRole = `${context}${styleSuffix}`;
                      const result = await startInterview(jobRole);
                      localStorage.setItem("aimasio_session_id", result.sessionId);
                      localStorage.setItem("aimasio_role", baseRole);
                      navigate("/live-interview");
                    } catch {
                      navigate("/interview-setup");
                    }
                  }}
                  className="text-xs"
                >
                  {language === "en" ? "I have completed the payment" : "Tôi đã thanh toán xong"}
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => navigate("/interview-setup")}
                >
                  {language === "en" ? "Back" : "Quay lại"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPayment;

