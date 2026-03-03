import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <span className="text-sm font-semibold text-foreground">YourHR AI</span>
            <p className="text-sm text-muted-foreground mt-1">
              Phỏng vấn có cấu trúc, quyết định tuyển dụng tốt hơn.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Văn phòng: Tầng 10, Toà nhà Harmony, 16 Lê Thánh Tôn, Q.1, TP. Hồ Chí Minh
            </p>
            <p className="text-xs text-muted-foreground">
              Email: contact@yourhr.ai · Hotline: 1900 636 899
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Sản phẩm</span>
              <div className="flex flex-col gap-1.5">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Luyện CV & phỏng vấn
                </Link>
                <Link to="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Bảng giá
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Công ty</span>
              <div className="flex flex-col gap-1.5">
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Giới thiệu
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Bảo mật
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Liên hệ</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">0909 123 456</span>
                <span className="text-sm text-muted-foreground">support@yourhr.ai</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} YourHR AI. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
