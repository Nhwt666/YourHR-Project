import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/landing/Navbar";
import { getStoredToken } from "@/lib/api";
import { loginUser, registerUser } from "@/services/interviewApi";
import { Zap, Shield, BarChart3 } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    title: "Vào nhanh không cần cấu hình",
    description: "Chỉ cần tài khoản là bắt đầu luyện CV và phỏng vấn ngay.",
  },
  {
    icon: BarChart3,
    title: "Theo dõi tiến bộ theo buổi",
    description: "Kết quả được lưu lại để bạn xem lại và cải thiện dần.",
  },
  {
    icon: Shield,
    title: "Dữ liệu an toàn",
    description: "Thông tin phỏng vấn và CV được bảo vệ và chỉ bạn mới xem được.",
  },
];

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("Vui lòng đăng nhập để tiếp tục.");
  const [loading, setLoading] = useState(false);

  if (getStoredToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  const getReadableError = (error: unknown) => {
    if (!(error instanceof Error)) return "Yêu cầu thất bại.";
    if (error.message === "Failed to fetch") {
      return "Không thể kết nối API. Vui lòng kiểm tra backend và proxy deployment (/api).";
    }
    return error.message;
  };

  const handleRegister = async () => {
    if (!fullName) {
      setStatus("Vui lòng nhập họ và tên.");
      return;
    }
    if (!email || !password) {
      setStatus("Vui lòng nhập email và mật khẩu.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      setLoading(true);
      await registerUser(email, password);
      setStatus("Đăng ký thành công. Bạn có thể đăng nhập ngay.");
    } catch (error) {
      setStatus(getReadableError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setStatus("Vui lòng nhập email và mật khẩu.");
      return;
    }
    try {
      setLoading(true);
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      setStatus(getReadableError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    setStatus(`Đăng nhập bằng ${provider} sẽ sớm ra mắt.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-alt/40 via-background to-background-alt/60">
      <Navbar />
      <div className="container mx-auto flex min-h-[calc(100vh-72px)] items-center px-4 py-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Nền tảng luyện CV & phỏng vấn với AI
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Chào mừng đến với YourHR AI
              </h1>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-lg">
                Đăng nhập để tiếp tục luyện phỏng vấn, kiểm tra CV và xem lại toàn bộ kết quả được lưu trước đó.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-background/60 p-3 shadow-sm"
                >
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-3xl" />
            <div className="w-full max-w-md lg:max-w-sm rounded-2xl border border-border bg-background/95 p-6 shadow-md mx-auto space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {mode === "login" ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {mode === "login"
                    ? "Sử dụng email đã đăng ký để tiếp tục phiên luyện tập."
                    : "Sử dụng email và mật khẩu để tạo tài khoản luyện CV & phỏng vấn."}
                </p>
              </div>

              <div className="space-y-3">
                {mode === "register" && (
                  <div>
                    <Label htmlFor="auth-fullname">Họ và tên</Label>
                    <Input
                      id="auth-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="mt-1.5"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="auth-email">Email</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="auth-password">Mật khẩu</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="mt-1.5"
                  />
                </div>
                {mode === "register" && (
                  <div>
                    <Label htmlFor="auth-password-confirm">Xác nhận mật khẩu</Label>
                    <Input
                      id="auth-password-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="mt-1.5"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  <span>Hoặc đăng nhập nhanh</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-background/80"
                    onClick={() => handleSocialClick("Google")}
                    disabled={loading}
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-white text-[11px] font-semibold text-primary shadow-sm">
                      G
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-background/80"
                    onClick={() => handleSocialClick("Facebook")}
                    disabled={loading}
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[11px] font-semibold text-white shadow-sm">
                      f
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={mode === "login" ? handleLogin : handleRegister}
                  disabled={loading}
                  className="w-full"
                >
                  {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = mode === "login" ? "register" : "login";
                    setMode(nextMode);
                    setStatus(
                      nextMode === "login"
                        ? "Vui lòng đăng nhập để tiếp tục."
                        : "Điền thông tin để tạo tài khoản mới."
                    );
                  }}
                  className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mode === "login"
                    ? "Chưa có tài khoản? Đăng ký ngay."
                    : "Đã có tài khoản? Quay lại đăng nhập."}
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed min-h-[1.5rem]">{status}</p>
              <p className="text-[10px] text-muted-foreground/80">
                Bằng việc tiếp tục, bạn đồng ý để YourHR AI lưu lại lịch sử luyện phỏng vấn và kết quả chấm điểm nhằm cải thiện trải nghiệm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
