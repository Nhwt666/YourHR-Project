import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredToken } from "@/lib/api";
import { loginUser, registerUser } from "@/services/interviewApi";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Please login to continue.");
  const [loading, setLoading] = useState(false);

  if (getStoredToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  const getReadableError = (error: unknown) => {
    if (!(error instanceof Error)) return "Request failed.";
    if (error.message === "Failed to fetch") {
      return "Cannot connect to API. Please ensure backend is running on localhost:5298.";
    }
    return error.message;
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setStatus("Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      await registerUser(email, password);
      setStatus("Register success. You can login now.");
    } catch (error) {
      setStatus(getReadableError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setStatus("Please enter email and password.");
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

  return (
    <div className="min-h-screen bg-background-alt/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome to YourHR AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access product features.</p>
        </div>

        <div className="space-y-3">
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
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={handleRegister} disabled={loading}>
            Register
          </Button>
          <Button type="button" onClick={handleLogin} disabled={loading}>
            Sign in
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default Auth;
