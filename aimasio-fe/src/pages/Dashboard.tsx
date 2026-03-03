import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FileText, CreditCard, Shield, LogOut } from "lucide-react";
import { clearStoredToken } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();

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
                Quản lý tài khoản YourHR AI
              </span>
              <h1 className="text-heading">Tài khoản & gói đăng ký</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Xem gói hiện tại, chỉnh sửa thông tin cá nhân và cấu hình thanh toán cho tài khoản của bạn.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                    Gói của bạn
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">Gói miễn phí · Cá nhân</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Gia hạn vào ngày <span className="font-medium">07/03/2026</span>. Thanh toán qua{" "}
                    <span className="font-medium">Visa •••• 4242</span>.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Button size="sm" className="px-4 h-8">
                    Quản lý gói
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-1">
              <h2 className="text-sm font-semibold text-foreground">Tài khoản</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Cấu hình thông tin cá nhân và ngôn ngữ hiển thị.
              </p>
              <div className="divide-y divide-border text-sm">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Chỉnh sửa thông tin cá nhân</p>
                    <p className="text-xs text-muted-foreground">
                      Cập nhật tên, email và phòng ban sử dụng YourHR AI.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <Link to="/account">Cập nhật</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Ngôn ngữ & múi giờ</p>
                    <p className="text-xs text-muted-foreground">Tiếng Việt · GMT+7 (Asia/Ho_Chi_Minh)</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Thiết lập
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  NM
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nguyễn Minh Anh</p>
                  <p className="text-xs text-muted-foreground">Talent Acquisition · yourname@yourhr.ai</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gói hiện tại</span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Gói miễn phí
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Trạng thái thanh toán</span>
                  <span className="text-foreground font-medium">Đang hoạt động</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lần đăng nhập gần nhất</span>
                  <span className="text-foreground font-medium">Hôm qua · 21:34</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">Thanh toán</h2>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Thẻ thanh toán đã lưu</p>
                    <p className="text-muted-foreground">Visa •••• 4242 · Hết hạn 12/2026</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Thay đổi
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Lịch sử thanh toán</p>
                    <p className="text-muted-foreground">3 giao dịch gần nhất trong 90 ngày.</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5 md:p-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">Bảo mật & quyền riêng tư</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground">Đổi mật khẩu</span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Thiết lập
                  </Button>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground">Quản lý ứng dụng đã kết nối</span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    0 ứng dụng
                  </Button>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-foreground">Quản lý thông báo</span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Email & trình duyệt
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/80">
                  <span className="text-foreground flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5" />
                    Đăng xuất ở mọi nơi
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleSignOutAll}>
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-dashed border-border bg-background/60 p-5 md:p-6 text-xs text-muted-foreground">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-foreground text-sm">Dữ liệu & quyền truy cập</div>
              </div>
              <p>
                Bạn có thể yêu cầu trích xuất dữ liệu buổi phỏng vấn hoặc xoá hoàn toàn tài khoản theo quy định bảo vệ
                dữ liệu cá nhân. Tính năng này sẽ được bổ sung trong các bản cập nhật tiếp theo.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
