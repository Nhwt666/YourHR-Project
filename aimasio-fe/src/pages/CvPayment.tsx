import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QR_EXPIRY_SECONDS = 10 * 60; // 10 minutes

const CvPayment = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [secondsLeft, setSecondsLeft] = useState(QR_EXPIRY_SECONDS);
  const state = (location.state || {}) as {
    from?: string;
    cvFile?: File;
    targetRole?: string;
    companyContext?: string;
  };

  const title =
    language === "en"
      ? "Pay 39,000đ for CV review & edits"
      : "Thanh toán 39.000đ cho đánh giá & chỉnh sửa CV";

  const subtitle =
    language === "en"
      ? "Scan the VietQR code below to complete this CV review payment step."
      : "Quét mã VietQR bên dưới để hoàn tất bước thanh toán cho lượt đánh giá CV này.";

  // Countdown: QR "expires" after 10 minutes (UI only)
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
                      ? "VIETQR_CV_39000"
                      : "VIETQR_THANH_TOAN_CV_39000",
                  )}`}
                  alt={
                    language === "en"
                      ? "VietQR for CV payment"
                      : "Mã VietQR cho thanh toán CV"
                  }
                  className="h-48 w-48"
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                {language === "en"
                  ? "Amount: 39,000đ • Content: CV39 + your email"
                  : "Số tiền: 39.000đ • Nội dung: CV39 + email của bạn"}
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
                  onClick={() => {
                    navigate("/cv-review", {
                      state:
                        state.from === "cv-review"
                          ? {
                              fromPayment: true,
                              cvFile: state.cvFile,
                              targetRole: state.targetRole,
                              companyContext: state.companyContext,
                            }
                          : undefined,
                    });
                  }}
                  className="text-xs"
                >
                  {language === "en" ? "I have completed the payment" : "Tôi đã thanh toán xong"}
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => navigate("/cv-review")}
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

export default CvPayment;

