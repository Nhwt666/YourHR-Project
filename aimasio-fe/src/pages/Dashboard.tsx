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
                {language === "en" ? "Manage your YourHR AI account" : "Quản lý tài khoản YourHR AI"}
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

              <div className="divide-y divide-border text-sm">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {language === "en" ? "Language & timezone" : "Ngôn ngữ & múi giờ"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "en"
                        ? "Vietnamese · GMT+7 (Asia/Ho_Chi_Minh)"
                        : "Tiếng Việt · GMT+7 (Asia/Ho_Chi_Minh)"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    {language === "en" ? "Configure" : "Thiết lập"}
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {fullName.slice(0, 2).toUpperCase() || "NM"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Usage model" : "Hình thức sử dụng"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {language === "en" ? "Pay per use" : "Mua theo lượt"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Billing status" : "Trạng thái thanh toán"}
                  </span>
                  <span className="text-foreground font-medium">
                    {language === "en" ? "Active" : "Đang hoạt động"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {language === "en" ? "Last sign‑in" : "Lần đăng nhập gần nhất"}
                  </span>
                  <span className="text-foreground font-medium">
                    {language === "en" ? "Yesterday · 21:34" : "Hôm qua · 21:34"}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {language === "en" ? "Billing" : "Thanh toán"}
                </h2>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {language === "en" ? "Saved payment method" : "Thẻ thanh toán đã lưu"}
                    </p>
                    <p className="text-muted-foreground">
                      {language === "en" ? "Visa •••• 4242 · Expires 12/2026" : "Visa •••• 4242 · Hết hạn 12/2026"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    {language === "en" ? "Change" : "Thay đổi"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {language === "en" ? "Billing history" : "Lịch sử thanh toán"}
                    </p>
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "3 most recent transactions in the last 90 days."
                        : "3 giao dịch gần nhất trong 90 ngày."}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    {language === "en" ? "View details" : "Xem chi tiết"}
                  </Button>
                </div>
              </div>
            </section>

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
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground">
                    {language === "en" ? "Connected apps" : "Quản lý ứng dụng đã kết nối"}
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    {language === "en" ? "0 apps" : "0 ứng dụng"}
                  </Button>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground">
                    {language === "en" ? "Notification settings" : "Quản lý thông báo"}
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    {language === "en" ? "Email & browser" : "Email & trình duyệt"}
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
                  {language === "en" ? "Data & access" : "Dữ liệu & quyền truy cập"}
                </div>
              </div>
              <p>
                {language === "en"
                  ? "You can request an export of your interview data or full account deletion according to data protection rules. This feature will be added in upcoming releases."
                  : "Bạn có thể yêu cầu trích xuất dữ liệu buổi phỏng vấn hoặc xoá hoàn toàn tài khoản theo quy định bảo vệ dữ liệu cá nhân. Tính năng này sẽ được bổ sung trong các bản cập nhật tiếp theo."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
