import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, FileUp, Lock, WandSparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";

const roleOptions = [
  "Front End - FPT Software",
  "Back End - FPT Software",
  "Front End - JavaScript",
  "Front End - TypeScript",
  "Front End - React",
  "Front End - Next.js",
  "Front End - Vue",
  "Front End - Angular",
  "Front End - Tailwind CSS",
  "Front End - Redux / Zustand",
  "Back End - REST API",
  "Back End - GraphQL",
  "Front End - Testing (Jest / RTL)",
  "Front End - Web Performance",
  "DevOps - CI/CD cơ bản",
];

const experienceLevels = [
  "Intern/Fresher",
  "Junior (1-2 năm)",
  "Middle (2-4 năm)",
  "Senior (4+ năm)",
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [role, setRole] = useState(roleOptions[0]);
  const [description, setDescription] = useState("");
  const [styleTech, setStyleTech] = useState(true);
  const [styleBehavior, setStyleBehavior] = useState(true);
  const [styleScreening, setStyleScreening] = useState(true);
  const [deepDiveEnabled, setDeepDiveEnabled] = useState(false);
  const [uploadedCvName, setUploadedCvName] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [experience, setExperience] = useState(experienceLevels[1]);
  const [status, setStatus] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [advancedStatus, setAdvancedStatus] = useState("");
  const [hasCvFromReview, setHasCvFromReview] = useState(false);

  useEffect(() => {
    try {
      const flag = localStorage.getItem("aimasio_use_cv_for_interview");
      if (flag === "1") {
        setHasCvFromReview(true);
        localStorage.removeItem("aimasio_use_cv_for_interview");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCreateInterview = async () => {
    if (!styleTech && !styleBehavior && !styleScreening) {
      setStatus(
        language === "en"
          ? "Choose at least one interview style (technical, behavioural or screening)."
          : "Vui lòng chọn ít nhất một kiểu phỏng vấn (kỹ thuật, hành vi hoặc sàng lọc).",
      );
      return;
    }

    if (!role.trim()) {
      setStatus(
        language === "en"
          ? "Please select a role for the interview."
          : "Vui lòng chọn vị trí phỏng vấn.",
      );
      return;
    }

    setStatus("");
    navigate("/interview-payment", {
      state: {
        from: "interview-setup",
        role: role.trim(),
        description: description.trim(),
        styles: {
          technical: styleTech,
          behavioural: styleBehavior,
          screening: styleScreening,
        },
      },
    });
  };

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          {language === "en" ? "Interview setup" : "Thiết lập phỏng vấn"}
        </div>
        <h1 className="text-heading">
          {language === "en" ? "Create a new interview" : "Tạo phỏng vấn mới"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === "en"
            ? "Choose a role and YourHR AI will automatically generate the question set for this paid interview."
            : "Chọn vai trò, sau đó YourHR AI sẽ tạo bộ câu hỏi tự động cho từng lượt phỏng vấn đã thanh toán."}
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="space-y-4 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">
              {language === "en" ? "Interview details" : "Thông tin buổi phỏng vấn"}
            </h2>
          </div>
          <div>
            <Label htmlFor="role" className="text-sm font-medium">
              {language === "en" ? "Role" : "Vị trí"}
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="mt-1.5">
                <SelectValue placeholder="Chọn vị trí" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="desc" className="text-sm font-medium">
              {language === "en" ? "Additional context" : "Mô tả bổ sung"}
            </Label>
            <Textarea
              id="desc"
              placeholder={
                language === "en"
                  ? "Optional: brief JD, candidate level, skills to focus on."
                  : "Tùy chọn: tóm tắt JD, cấp độ ứng viên, kỹ năng cần tập trung."
              }
              className="mt-1.5"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-5">
            <Label className="text-sm font-medium">
              {language === "en" ? "Design your own interview" : "THIẾT KẾ BUỔI PHỎNG VẤN RIÊNG BẠN"}
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {language === "en"
                ? "Combine different interview styles for this session. A complete interview usually mixes technical, behavioural and quick screening questions."
                : "Kết hợp các kiểu phỏng vấn khác nhau cho phiên này. Một buổi phỏng vấn hoàn chỉnh thường gồm câu hỏi kỹ thuật, hành vi và sàng lọc nhanh."}
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={styleTech}
                  onCheckedChange={(v) => setStyleTech(Boolean(v))}
                />
                <span>{language === "en" ? "Technical interview" : "Phỏng vấn kỹ thuật"}</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={styleBehavior}
                  onCheckedChange={(v) => setStyleBehavior(Boolean(v))}
                />
                <span>{language === "en" ? "Behavioural interview" : "Phỏng vấn hành vi"}</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={styleScreening}
                  onCheckedChange={(v) => setStyleScreening(Boolean(v))}
                />
                <span>{language === "en" ? "Screening interview" : "Phỏng vấn sàng lọc"}</span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5">
            <Label htmlFor="experience" className="text-sm font-medium">
              {language === "en" ? "Candidate level" : "Cấp độ ứng viên"}
            </Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger id="experience" className="mt-1.5">
                <SelectValue
                  placeholder={
                    language === "en" ? "Choose level" : "Chọn cấp độ"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              {language === "en"
                ? "Helps you keep the context clear before starting."
                : "Giúp người dùng có bối cảnh rõ ràng trước khi bắt đầu."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">
                {language === "en" ? "Advanced features" : "Tính năng nâng cao"}
              </h2>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium">
                {language === "en"
                  ? "Upload CV for personalised interviews"
                  : "Nhập CV để AI cá nhân hóa phỏng vấn"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {hasCvFromReview
                  ? language === "en"
                    ? "Using the CV from your latest review so AI can generate more personalised questions."
                    : "Sử dụng CV vừa được đánh giá gần nhất để AI tạo bộ câu hỏi cá nhân hoá hơn."
                  : language === "en"
                    ? "Upload a CV file (PDF) so AI can later personalise questions for this candidate."
                    : "Chọn một file CV (PDF) để AI có thể cá nhân hoá câu hỏi cho ứng viên về sau."}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <FileUp className="mr-1.5 h-4 w-4" />
                  {language === "en" ? "Upload CV" : "Tải CV"}
                </Button>
                {uploadedCvName ? (
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {uploadedCvName}
                  </span>
                ) : null}
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadedCvName(file.name);
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium">
                {language === "en" ? "Deep‑dive follow‑up mode" : "Chế độ hỏi sâu"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {language === "en"
                  ? "AI adds extra follow‑up questions based on your answers to dig deeper into your experience and thinking."
                  : "AI sẽ đặt thêm các câu hỏi liên quan dựa trên câu trả lời của bạn để đào sâu vào kinh nghiệm và cách suy nghĩ."}
              </p>
              <div className="mt-3">
                <Button
                  variant={deepDiveEnabled ? "default" : "outline"}
                  size="sm"
                  className={deepDiveEnabled ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""}
                  type="button"
                  onClick={() => setDeepDiveEnabled((prev) => !prev)}
                >
                  {deepDiveEnabled
                    ? language === "en"
                      ? "Disable deep dive"
                      : "Tắt chế độ hỏi sâu"
                    : language === "en"
                      ? "Enable deep dive"
                      : "Bật chế độ hỏi sâu"}
                </Button>
              </div>
            </div>

          </div>
          {advancedStatus && (
            <p className="mt-4 text-xs rounded-md px-3 py-2 inline-flex bg-primary/5 text-primary border border-primary/20">
              {advancedStatus}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleCreateInterview} disabled={loadingCreate}>
            {loadingCreate
              ? language === "en"
                ? "Creating..."
                : "Đang tạo..."
              : language === "en"
                ? "Create interview"
                : "Tạo phỏng vấn"}
          </Button>
        </div>
        {status ? (
          <p className="text-xs rounded-md px-2.5 py-1.5 inline-flex text-muted-foreground bg-surface border border-border">
            {status}
          </p>
        ) : null}
      </div>
    </AppShell>
  );
};

export default InterviewSetup;
