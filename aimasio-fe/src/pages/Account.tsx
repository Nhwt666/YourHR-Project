import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Account = () => {
  const [status, setStatus] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would call an API. For now we just show a confirmation.
    setStatus("Thông tin hồ sơ đã được lưu (demo).");
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl">
        <div className="rounded-2xl border border-border bg-background p-6 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
                Tài khoản & hồ sơ
              </span>
              <h1 className="text-heading">Cập nhật hồ sơ</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Thay đổi thông tin cá nhân và chi tiết thanh toán của bạn.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground">Thông tin cá nhân</h2>
              <div>
                <Label htmlFor="full-name">Họ và tên</Label>
                <Input id="full-name" className="mt-1.5" defaultValue="Nguyễn Minh Anh" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-1.5" defaultValue="yourname@yourhr.ai" />
              </div>
              <div>
                <Label htmlFor="department">Phòng ban</Label>
                <Input id="department" className="mt-1.5" defaultValue="Tech recruitment" />
              </div>
              <div>
                <Label htmlFor="role">Vai trò</Label>
                <Input id="role" className="mt-1.5" defaultValue="Talent Acquisition" />
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold text-foreground">Thanh toán & ghi chú</h2>
              <div>
                <Label htmlFor="plan">Gói hiện tại</Label>
                <Input id="plan" className="mt-1.5" defaultValue="Standard" />
              </div>
              <div>
                <Label htmlFor="card">Thẻ thanh toán</Label>
                <Input id="card" className="mt-1.5" defaultValue="Visa •••• 4242 · Hết hạn 12/2026" />
              </div>
              <div>
                <Label htmlFor="notes">Ghi chú nội bộ</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  className="mt-1.5"
                  placeholder="Ví dụ: chỉ định phỏng vấn cho vị trí Frontend, ưu tiên ứng viên có kinh nghiệm startup."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">Lưu thay đổi</Button>
            {status && <p className="text-xs text-muted-foreground">{status}</p>}
          </div>
        </form>
      </div>
    </AppShell>
  );
};

export default Account;

