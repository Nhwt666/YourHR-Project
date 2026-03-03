import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, FileUp, Lock, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "@/services/interviewApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";

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

const interviewStyles = [
  "Sàng lọc tổng quan",
  "Đào sâu kỹ thuật",
  "Hành vi + phù hợp văn hóa",
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
  const [style, setStyle] = useState(interviewStyles[0]);
  const [experience, setExperience] = useState(experienceLevels[1]);
  const [status, setStatus] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [advancedStatus, setAdvancedStatus] = useState("");

  const handleCreateInterview = async () => {
    if (!role.trim()) {
      setStatus(
        language === "en"
          ? "Please select a role for the interview."
          : "Vui lòng chọn vị trí phỏng vấn.",
      );
      return;
    }

    try {
      setLoadingCreate(true);
      // Send selected track + optional context so BE can generate role-specific questions.
      const jobRole = description.trim()
        ? `${role.trim()} | Context: ${description.trim()}`
        : role.trim();
      const result = await startInterview(jobRole);
      // Keep session in storage so live/results pages can load after route changes.
      localStorage.setItem("aimasio_session_id", result.sessionId);
      localStorage.setItem("aimasio_role", role.trim());
      navigate("/live-interview");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : language === "en"
            ? "Failed to create interview session."
            : "Tạo buổi phỏng vấn thất bại.",
      );
    } finally {
      setLoadingCreate(false);
    }
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
            ? "Choose a role and YourHR AI will automatically generate the question set."
            : "Chọn vai trò, sau đó YourHR AI sẽ tạo bộ câu hỏi tự động."}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {language === "en" ? "Current plan" : "Gói hiện tại"}
            </p>
            <p className="text-sm font-semibold">
              {language === "en" ? "Standard plan" : "Gói Standard"}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Crown className="mr-1.5 h-4 w-4" />
            {language === "en" ? "Manage Standard features" : "Quản lý tính năng Standard"}
          </Button>
        </div>
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
            <Label htmlFor="style" className="text-sm font-medium">
              {language === "en" ? "Interview style" : "Kiểu phỏng vấn"}
            </Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style" className="mt-1.5">
                <SelectValue
                  placeholder={
                    language === "en" ? "Choose interview style" : "Chọn kiểu phỏng vấn"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {interviewStyles.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              {language === "en"
                ? "UI-only option. Backend interview flow stays unchanged."
                : "Tùy chọn giao diện. Luồng xử lý backend hiện tại không thay đổi."}
            </p>
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
                {language === "en" ? "Standard+ features" : "Tính năng Standard+"}
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              Xem trước
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium">
                {language === "en"
                  ? "Upload CV for personalised interviews"
                  : "Nhập CV để AI cá nhân hóa phỏng vấn"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {language === "en"
                  ? "AI generates questions based on strengths, gaps and experience in your CV."
                  : "AI tạo câu hỏi dựa trên điểm mạnh, khoảng thiếu và kinh nghiệm trong CV."}
              </p>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAdvancedStatus(
                      language === "en"
                        ? "CV-based personalised interview is enabled for this Standard account (demo only)."
                        : "Chế độ phỏng vấn cá nhân hóa theo CV đã được bật cho tài khoản Standard này (demo UI).",
                    )
                  }
                >
                  <FileUp className="mr-1.5 h-4 w-4" />
                  {language === "en" ? "Upload CV" : "Tải CV"}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium">
                {language === "en" ? "Adaptive follow-up questions" : "Follow-up đào sâu thích ứng"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {language === "en"
                  ? "AI asks follow-up questions based on each answer and your confidence level."
                  : "AI đặt câu hỏi tiếp theo dựa trên từng câu trả lời và mức độ tự tin."}
              </p>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAdvancedStatus(
                      language === "en"
                        ? "Interview duration is currently set to a default length; in the upgraded version you can pick 15, 30, 45, 60 minutes or a custom length (demo UI only)."
                        : "Thời lượng buổi phỏng vấn hiện đang ở mức mặc định; ở phiên bản nâng cấp bạn có thể chọn 15, 30, 45, 60 phút hoặc tuỳ chỉnh (UI demo).",
                    )
                  }
                >
                  {language === "en" ? "Enable deep dive" : "Bật chế độ đào sâu"}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3 md:col-span-2">
              <p className="text-sm font-medium">
                {language === "en"
                  ? "Planned interview duration"
                  : "Thời lượng buổi phỏng vấn"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {language === "en"
                  ? "Choose default or custom durations like 15, 30, 45, 60 minutes for each practice session."
                  : "Chọn thời lượng mặc định hoặc tuỳ chỉnh như 15, 30, 45, 60 phút cho mỗi buổi luyện."}
              </p>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAdvancedStatus(
                      language === "en"
                        ? "Custom scoring rubric saved for this Standard account (demo only)."
                        : "Thiết lập thời lượng phỏng vấn đã được lưu cho tài khoản Standard này (UI demo).",
                    )
                  }
                >
                  {language === "en" ? "Set duration" : "Thiết lập thời lượng"}
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
