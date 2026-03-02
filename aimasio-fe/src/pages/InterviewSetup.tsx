import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "@/services/interviewApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleOptions = [
  "Front End - FPT Software",
  "Back End - FPT Software",
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(roleOptions[0]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);

  const handleCreateInterview = async () => {
    if (!role.trim()) {
      setStatus("Please choose a role title.");
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
      setStatus(error instanceof Error ? error.message : "Create interview failed.");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Interview setup
        </div>
        <h1 className="text-heading">New interview</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose role track, then YourHR AI generates interview questions automatically.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="space-y-4 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Interview details</h2>
          </div>
          <div>
            <Label htmlFor="role" className="text-sm font-medium">Role title</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="mt-1.5">
                <SelectValue placeholder="Choose role" />
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
            <Label htmlFor="desc" className="text-sm font-medium">Description</Label>
            <Textarea
              id="desc"
              placeholder="Optional: JD highlights, candidate level, or focus skills."
              className="mt-1.5"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleCreateInterview} disabled={loadingCreate}>
            {loadingCreate ? "Creating..." : "Create interview"}
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
