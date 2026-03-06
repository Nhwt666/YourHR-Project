import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CreditCard, Shield, LogOut } from "lucide-react";
import { clearStoredToken } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [profileStatus, setProfileStatus] = useState("");
  const [fullName, setFullName] = useState("Nguyễn Minh Anh");
  const [email, setEmail] = useState("yourname@yourhr.ai");
  const [targetPosition, setTargetPosition] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(language === "en" ? "Profile saved." : "Thông tin hồ sơ đã được lưu.");
  };

  const handleSignOutAll = () => {
    clearStoredToken();
    localStorage.removeItem("aimasio_user_email");
    localStorage.removeItem("aimasio_session_id");
    localStorage.removeItem("aimasio_result");
    navigate("/");
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
                {language === "en" ? "Manage your AI Interview Master account" : "Quản lý tài khoản"}
              </span>
              <h1 className="text-heading">
                {language === "en" ? "Account" : "Tài khoản"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "en"
                  ? "Manage your profile, language and security. Pay per use when you run a CV review or interview."
                  : "Quản lý hồ sơ, ngôn ngữ và bảo mật. Thanh toán theo lượt khi bạn dùng đánh giá CV hoặc phỏng vấn."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-1">
              <h2 className="text-sm font-semibold text-foreground">
                {language === "en" ? "Account" : "Tài khoản"}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {language === "en"
                  ? "Configure your personal information and display language."
                  : "Cấu hình thông tin cá nhân và ngôn ngữ hiển thị."}
              </p>

              {/* Inline profile form — no separate page */}
              <form onSubmit={handleProfileSubmit} className="space-y-3 rounded-xl border border-border/80 bg-muted/30 p-4 mb-4">
                <p className="text-xs font-medium text-foreground">
                  {language === "en" ? "Personal information" : "Thông tin cá nhân"}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="dashboard-fullname" className="text-xs">
                      {language === "en" ? "Full name" : "Họ và tên"}
                    </Label>
                    <Input
                      id="dashboard-fullname"
                      className="h-8 text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dashboard-email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="dashboard-email"
                      type="email"
                      className="h-8 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dashboard-target-position" className="text-xs">
                      {language === "en" ? "Target position" : "Vị trí mục tiêu"}
                    </Label>
                    <Input
                      id="dashboard-target-position"
                      className="h-8 text-sm"
                      value={targetPosition}
                      onChange={(e) => setTargetPosition(e.target.value)}
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dashboard-experience-level" className="text-xs">
                      {language === "en" ? "Experience level" : "Mức kinh nghiệm"}
                    </Label>
                    <Input
                      id="dashboard-experience-level"
                      className="h-8 text-sm"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" className="h-8 text-xs">
                    {language === "en" ? "Save" : "Lưu thay đổi"}
                  </Button>
                  {profileStatus && (
                    <span className="text-xs text-muted-foreground">{profileStatus}</span>
                  )}
                </div>
              </form>

              {/* Đã ẩn block Ngôn ngữ & múi giờ theo yêu cầu */}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {language === "en" ? "Security & privacy" : "Bảo mật & quyền riêng tư"}
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground">
                    {language === "en" ? "Change password" : "Đổi mật khẩu"}
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    {language === "en" ? "Configure" : "Thiết lập"}
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/80">
                  <span className="text-foreground flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5" />
                    {language === "en" ? "Sign out everywhere" : "Đăng xuất ở mọi nơi"}
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleSignOutAll}>
                    {language === "en" ? "Sign out" : "Đăng xuất"}
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-dashed border-border bg-background/60 p-5 md:p-6 text-xs text-muted-foreground">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-foreground text-sm">
                  {language === "en" ? "Data commitment" : "Cam kết dữ liệu người dùng"}
                </div>
              </div>
              <p>
                {language === "en"
                  ? "AI Interview Master only uses your data to run CV reviews and practice interviews. Interview content, CV files and scores are stored securely and are never sold or shared with third parties."
                  : "AI Interview Master chỉ sử dụng dữ liệu để phục vụ việc đánh giá CV và buổi phỏng vấn thử. Nội dung phỏng vấn, file CV và điểm số được lưu trữ an toàn, không bán và không chia sẻ cho bên thứ ba."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
