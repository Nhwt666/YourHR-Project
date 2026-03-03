import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, PhoneOff, Rocket, Video } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Hero = () => {
  const { language } = useLanguage();

  const heading =
    language === "en"
      ? "Interview smarter with AI"
      : "Phỏng vấn thông minh hơn cùng AI";

  const subheading =
    language === "en"
      ? "Modern interview platform"
      : "Nền tảng phỏng vấn hiện đại";

  const body =
    language === "en"
      ? "Structured interviews, clear tracking, and instant feedback after every session. The system also simulates a real-life interview so you can practice in realistic scenarios."
      : "Phỏng vấn có cấu trúc, theo dõi rõ ràng và nhận đánh giá nhanh sau mỗi buổi. Đồng thời, hệ thống mô phỏng trực quan một buổi phỏng vấn thực tế để bạn luyện tập sát tình huống thật.";

  const cta =
    language === "en" ? "Start practicing interviews" : "Bắt đầu dùng thử phỏng vấn";

  return (
    <section id="overview" className="py-24 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-5">
              {subheading}
            </span>
            <h1 className="text-display text-accent-gradient mb-6">
              {heading}
            </h1>
            <p className="text-body text-muted-foreground mb-10 leading-relaxed max-w-lg">
              {body}
            </p>
            <div>
              <Button variant="hero" size="xl" className="h-12 px-7 text-base shadow-[0_14px_30px_-16px_rgba(79,70,229,0.95)]" asChild>
                <Link to="/dashboard">
                  <Rocket className="mr-1.5 h-4 w-4" />
                  {cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-border bg-background p-4 shadow-sm md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground">Phiên phỏng vấn trực tuyến</p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Đang ghi nhận
                </span>
              </div>

              <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-slate-100 md:h-72">
                <img
                  src="https://res.cloudinary.com/dsuxvr70l/image/upload/v1772537575/Attached_image_zcdzul.png"
                  alt=""
                  className="h-full w-full object-coSSver object-center"
                />

                <div className="absolute bottom-4 right-4 w-28 overflow-hidden rounded-md border border-border bg-background shadow-sm md:w-40">
                  <img
                    src="https://res.cloudinary.com/dsuxvr70l/image/upload/v1772537695/istockphoto-1332969352-640x640_czjhqe.jpg"
                    alt=""
                    className="h-20 w-full object-cover object-center md:h-24"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                  <Mic className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                  <Video className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-destructive px-3 text-[11px] font-medium text-destructive-foreground">
                  <PhoneOff className="h-3.5 w-3.5" />
                  Kết thúc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
