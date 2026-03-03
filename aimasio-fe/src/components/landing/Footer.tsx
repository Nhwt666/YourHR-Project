import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  const tagline =
    language === "en"
      ? "Structured interviews for better hiring decisions."
      : "Phỏng vấn có cấu trúc, quyết định tuyển dụng tốt hơn.";

  const officeLabel =
    language === "en"
      ? "Office: 10th floor, Harmony Building, 16 Le Thanh Ton, Dist.1, Ho Chi Minh City"
      : "Văn phòng: Tầng 10, Toà nhà Harmony, 16 Lê Thánh Tôn, Q.1, TP. Hồ Chí Minh";

  const contactTitle = language === "en" ? "Contact" : "Liên hệ";
  const productTitle = language === "en" ? "Product" : "Sản phẩm";
  const companyTitle = language === "en" ? "Company" : "Công ty";
  const practiceLink =
    language === "en" ? "Practice CV & interviews" : "Luyện CV & phỏng vấn";
  const pricingLink = language === "en" ? "Pricing" : "Bảng giá";
  const aboutLink = language === "en" ? "About" : "Giới thiệu";
  const privacyLink = language === "en" ? "Privacy" : "Bảo mật";
  const copyright =
    language === "en"
      ? `© ${new Date().getFullYear()} YourHR AI. All rights reserved.`
      : `© ${new Date().getFullYear()} YourHR AI. Đã đăng ký bản quyền.`;

  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <span className="text-sm font-semibold text-foreground">YourHR AI</span>
            <p className="text-sm text-muted-foreground mt-1">
              {tagline}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {officeLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              Email: contact@yourhr.ai · Hotline: 1900 636 899
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {productTitle}
              </span>
              <div className="flex flex-col gap-1.5">
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {practiceLink}
                </Link>
                <Link
                  to="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {pricingLink}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {companyTitle}
              </span>
              <div className="flex flex-col gap-1.5">
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {aboutLink}
                </Link>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {privacyLink}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {contactTitle}
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">0909 123 456</span>
                <span className="text-sm text-muted-foreground">support@yourhr.ai</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
