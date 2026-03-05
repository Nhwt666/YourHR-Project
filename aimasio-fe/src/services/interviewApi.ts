import { apiFetch, setStoredToken } from "@/lib/api";

export type LoginResponse = {
  token: string;
  userId: string;
  email: string;
};

export type StartInterviewResponse = {
  sessionId: string;
};

export type QuestionItemDto = {
  question: string;
  description: string;
} | null;

export type EndInterviewResponse = {
  score: number;
  feedback: string;
};

export type CvReviewResponse = {
  overallScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
};

export type FollowUpResponse = {
  reply: string;
  learningEventId?: string;
  criticPass?: boolean;
};

export type AvatarSpeakResponse = {
  videoUrl: string;
  talkId: string;
  status: string;
};

export type DIdJsep = {
  type: "offer" | "answer";
  sdp: string;
};

export type DIdIceServer = {
  urls: string | string[];
  username?: string;
  credential?: string;
};

export type AvatarStreamInitResponse = {
  id: string;
  session_id?: string;
  offer?: DIdJsep;
  jsep?: DIdJsep;
  ice_servers: DIdIceServer[];
};

/** Response from BE POST /Auth/register (PascalCase as serialized by .NET) */
export type RegisterResponse = {
  UserId: string;
  Email: string;
  Message: string;
};

export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
  return apiFetch<RegisterResponse>("/Auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const loginUser = async (email: string, password: string) => {
  const result = await apiFetch<LoginResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(result.token);
  localStorage.setItem("aimasio_user_email", result.email);
  return result;
};

export const startInterview = (jobRole: string) =>
  apiFetch<StartInterviewResponse>("/Interview/start", {
    method: "POST",
    body: JSON.stringify({ jobRole }),
  });

export const getNextQuestion = (sessionId: string) =>
  apiFetch<QuestionItemDto>(`/Interview/next-question/${sessionId}`);

export const submitAnswer = (sessionId: string, questionText: string, transcript: string) =>
  apiFetch<void>("/Interview/submit-answer", {
    method: "POST",
    body: JSON.stringify({ sessionId, questionText, transcript }),
  });

export const requestFollowUp = (payload: {
  sessionId: string;
  currentQuestion: string;
  currentQuestionDescription?: string;
  candidateText: string;
  sectionTranscript: string;
  turnIndex: number;
  mode: "support" | "deepen_answer";
}) =>
  apiFetch<FollowUpResponse>("/Interview/follow-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const endInterview = (sessionId: string) =>
  apiFetch<EndInterviewResponse>("/Interview/end", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });

export const reviewCv = (payload: { cvFile: File; targetRole?: string; companyContext?: string }) => {
  const formData = new FormData();
  formData.append("CvFile", payload.cvFile);
  if (payload.targetRole?.trim()) formData.append("TargetRole", payload.targetRole.trim());
  if (payload.companyContext?.trim()) formData.append("CompanyContext", payload.companyContext.trim());
  return apiFetch<CvReviewResponse>("/Interview/cv-review", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const generateAvatarSpeech = (text: string) =>
  apiFetch<AvatarSpeakResponse>("/Interview/avatar/speak", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

export const initAvatarStream = () =>
  apiFetch<AvatarStreamInitResponse>("/Interview/avatar-stream/init", {
    method: "POST",
    body: JSON.stringify({ streamWarmup: true, fluent: false, compatibilityMode: "auto" }),
  });

export const startAvatarStreamSdp = (streamId: string, sessionId: string | undefined, answer: DIdJsep) =>
  apiFetch<{ status: string }>("/Interview/avatar-stream/sdp", {
    method: "POST",
    body: JSON.stringify({ streamId, sessionId, answer: { type: answer.type, sdp: answer.sdp } }),
  });

export const addAvatarStreamIce = (
  streamId: string,
  sessionId: string | undefined,
  candidate: RTCIceCandidate | RTCIceCandidateInit | null
) =>
  apiFetch<{ status: string }>("/Interview/avatar-stream/ice", {
    method: "POST",
    body: JSON.stringify({
      streamId,
      sessionId,
      candidate: candidate?.candidate ?? null,
      sdpMid: candidate?.sdpMid ?? null,
      sdpMLineIndex: candidate?.sdpMLineIndex ?? null,
    }),
  });

export const speakAvatarStream = (streamId: string, sessionId: string | undefined, text: string) =>
  apiFetch<{ status: string; duration?: number }>("/Interview/avatar-stream/speak", {
    method: "POST",
    body: JSON.stringify({ streamId, sessionId, text }),
  });

export const deleteAvatarStream = (streamId: string, sessionId: string | undefined) =>
  apiFetch<{ status: string }>(`/Interview/avatar-stream/${streamId}?sessionId=${encodeURIComponent(sessionId ?? "")}`, {
    method: "DELETE",
  });
