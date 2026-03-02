import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as did from "@d-id/client-sdk";
import { endInterview, generateAvatarSpeech, getNextQuestion, submitAnswer } from "@/services/interviewApi";

type QaLogItem = {
  question: string;
  answer: string;
};

const LiveInterview = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [questionText, setQuestionText] = useState("Loading question...");
  const [questionDescription, setQuestionDescription] = useState("");
  const [transcript, setTranscript] = useState("");
  const [qaLogs, setQaLogs] = useState<QaLogItem[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("Connecting AI HR...");
  const [avatarMode, setAvatarMode] = useState<"sdk" | "fallback">("sdk");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const speakDoneTimerRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(false);
  const shouldKeepListeningRef = useRef(false);
  const transcriptRef = useRef("");
  const questionTextRef = useRef("Loading question...");
  const pendingListenAfterSpeechRef = useRef(false);
  const lastSpokenTextRef = useRef("");
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const agentManagerRef = useRef<any>(null);
  const isFinishingInterviewRef = useRef(false);

  const sessionId = localStorage.getItem("aimasio_session_id");
  const role = localStorage.getItem("aimasio_role") ?? "Candidate Session";
  const didAgentId = import.meta.env.VITE_DID_AGENT_ID ?? "v2_agt_7OafqFLv";
  const didClientKey =
    import.meta.env.VITE_DID_CLIENT_KEY ??
    "Z29vZ2xlLW9hdXRoMnwxMTU3MzA5MjEwNTYxOTg2MTE4MTg6OWVLMTlRQjg4dTEzZ2xDcncwQk9U";
  const SILENCE_MS = 2500;

  const mapDidError = (error: unknown) => {
    const raw = error instanceof Error ? error.message : "Unknown D-ID SDK error";
    if (raw.toLowerCase().includes("failed to fetch")) {
      return `D-ID SDK cannot connect. Please add ${window.location.origin} to D-ID allowed domains. Switching to fallback mode.`;
    }
    return raw;
  };

  const isRepeatQuestionRequest = (text: string) => {
    const t = text.trim().toLowerCase();
    if (!t) return false;
    return /(khong nghe ro|không nghe rõ|nhac lai|nhắc lại|noi lai|nói lại|hoi lai|hỏi lại)/.test(t);
  };

  const getTransitionLine = () => {
    const lines = [
      "Cảm ơn em, anh/chị đã ghi nhận. Mình qua câu tiếp theo nhé.",
      "Anh/chị đã nghe rõ rồi, giờ mình sang câu kế tiếp nhé.",
      "Cảm ơn phần trả lời của em. Mời em đến câu tiếp theo.",
      "Anh/chị đã nắm được ý chính. Mình tiếp tục với câu hỏi sau nhé.",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  };

  const speakAsAvatarSafely = async (text: string, timeoutMs = 9000) => {
    try {
      await Promise.race([
        speakAsAvatar(text),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error("speak_timeout")), timeoutMs)),
      ]);
    } catch {
      // Keep interview flow moving even if avatar speech hangs or times out.
    }
  };

  const isEmptyJsonResponseError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error ?? "");
    return (
      message.includes("Unexpected end of JSON input") ||
      message.includes("Failed to execute 'json' on 'Response'")
    );
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    questionTextRef.current = questionText;
  }, [questionText]);

  const clearSpeakDoneTimer = () => {
    if (speakDoneTimerRef.current) {
      window.clearTimeout(speakDoneTimerRef.current);
      speakDoneTimerRef.current = null;
    }
  };

  const speakTextLocalFallback = (text: string) => {
    if (!text || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.96;
    utterance.pitch = 1;
    // Prefer an explicit Vietnamese voice when the browser provides one.
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    const viVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith("vi"));
    if (viVoice) utterance.voice = viVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const initAvatarSdk = async () => {
    if (agentManagerRef.current) return;
    if (!didAgentId || !didClientKey) {
      throw new Error("Missing D-ID Agent ID or client key.");
    }

    const callbacks = {
      onSrcObjectReady(value: MediaStream) {
        if (!remoteVideoRef.current) return value;
        remoteStreamRef.current = value;
        remoteVideoRef.current.src = "";
        remoteVideoRef.current.srcObject = value;
        remoteVideoRef.current.muted = false;
        remoteVideoRef.current.volume = 1;
        void remoteVideoRef.current.play().catch(() => {
          // Browser may block autoplay with audio until a user gesture.
          setAvatarStatus("Audio autoplay is blocked by browser.");
        });
        return value;
      },
      onVideoStateChange(state: string) {
        if (!remoteVideoRef.current) return;
        if (state === "STOP") {
          const idleVideo = agentManagerRef.current?.agent?.presenter?.idle_video;
          if (idleVideo) {
            remoteVideoRef.current.srcObject = null;
            remoteVideoRef.current.src = idleVideo;
            void remoteVideoRef.current.play().catch(() => {});
          }
          setAvatarStatus("AI HR is listening...");
          clearSpeakDoneTimer();
          if (pendingListenAfterSpeechRef.current) {
            pendingListenAfterSpeechRef.current = false;
            startAutoListening();
          }
        } else {
          // Reattach live WebRTC stream after idle clip to keep lip-sync animation.
          if (remoteStreamRef.current) {
            remoteVideoRef.current.src = "";
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
            void remoteVideoRef.current.play().catch(() => {});
          }
          setAvatarStatus("AI HR is speaking...");
        }
      },
      onConnectionStateChange(state: string) {
        if (state === "connected") setAvatarStatus("AI HR connected.");
      },
      onError(error: unknown) {
        setAvatarStatus(`AI HR error: ${mapDidError(error)}`);
      },
    };

    const manager = await did.createAgentManager(didAgentId, {
      auth: { type: "key", clientKey: didClientKey },
      callbacks,
      streamOptions: {
        compatibilityMode: "auto",
        streamWarmup: true,
      },
    });

    agentManagerRef.current = manager;
    await manager.connect();
  };

  const cleanupAvatarSdk = async () => {
    if (agentManagerRef.current) {
      try {
        await agentManagerRef.current.disconnect();
      } catch {
        // Ignore disconnect errors.
      }
      agentManagerRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;
  };

  const speakAsAvatar = async (text: string) => {
    lastSpokenTextRef.current = text;
    stopAutoListening();
    pendingListenAfterSpeechRef.current = true;
    clearSpeakDoneTimer();

    if (avatarMode === "fallback" || !agentManagerRef.current) {
      try {
        // Try to recover live agent mode so avatar returns to the original stream face.
        await initAvatarSdk();
        setAvatarMode("sdk");
        setAvatarStatus("AI HR reconnected.");
      } catch {
        // Keep fallback mode if reconnect fails.
      }
    }

    if (agentManagerRef.current) {
      try {
        // Safety net: if SDK callback does not arrive, continue flow automatically.
        const timeoutMs = Math.max(5000, Math.min(14000, text.length * 55));
        speakDoneTimerRef.current = window.setTimeout(() => {
          if (pendingListenAfterSpeechRef.current) {
            pendingListenAfterSpeechRef.current = false;
            setAvatarStatus("AI HR is listening...");
            startAutoListening();
          }
        }, timeoutMs);

        await agentManagerRef.current.speak({
          type: "text",
          input: text,
          provider: {
            type: "microsoft",
            voice_id: "vi-VN-HoaiMyNeural",
          },
        });
        return;
      } catch (error) {
        clearSpeakDoneTimer();
        setAvatarMode("fallback");
        setAvatarStatus(`SDK failed: ${mapDidError(error)}`);
      }
    }

    // Fallback to generated short video so interview flow continues.
    const clip = await generateAvatarSpeech(text);
    if (!remoteVideoRef.current) return;
    if (clip.status === "done" && clip.videoUrl) {
      remoteVideoRef.current.srcObject = null;
      remoteVideoRef.current.src = clip.videoUrl;
      remoteVideoRef.current.onended = () => {
        clearSpeakDoneTimer();
        if (pendingListenAfterSpeechRef.current) {
          pendingListenAfterSpeechRef.current = false;
          startAutoListening();
        }
      };
      await remoteVideoRef.current.play().catch(() => {
        speakTextLocalFallback(text);
      });
      setAvatarStatus("Fallback avatar clip mode.");
    } else {
      setAvatarStatus("Fallback avatar is processing.");
      pendingListenAfterSpeechRef.current = false;
      speakTextLocalFallback(text);
    }
  };

  const stopAutoListening = () => {
    clearSilenceTimer();
    clearSpeakDoneTimer();
    shouldKeepListeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors from browser speech engine.
      }
    }
    setIsListening(false);
  };

  const requestMicPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Browser does not support microphone permissions.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setStatus("Microphone ready. Answer naturally, auto-submit is enabled.");
    } catch (error) {
      setStatus(error instanceof Error ? `Microphone permission error: ${error.message}` : "Microphone permission denied.");
    }
  };

  const startAutoListening = () => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setStatus("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stale stop errors from previous recognition session.
      }
    }

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    shouldKeepListeningRef.current = true;
    recognition.lang = "vi-VN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let heardText = "";
      for (let i = 0; i < event.results.length; i += 1) {
        heardText += `${event.results[i][0].transcript} `;
      }
      if (heardText.trim()) {
        // Keep the latest recognized phrase (including interim) to avoid missing submits.
        transcriptRef.current = heardText.trim();
        setTranscript(heardText.trim());
        clearSilenceTimer();
        silenceTimerRef.current = window.setTimeout(() => {
          void autoSubmitAnswer();
        }, SILENCE_MS);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event.error || "unknown";
      if (err === "not-allowed" || err === "service-not-allowed") {
        shouldKeepListeningRef.current = false;
      }
      setStatus(`Mic error: ${err}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!shouldKeepListeningRef.current || isSubmittingRef.current) return;

      if (transcriptRef.current.trim()) {
        void autoSubmitAnswer();
        return;
      }

      // Speech engine can stop unexpectedly; auto-restart to keep hands-free interview flow.
      window.setTimeout(() => {
        if (!shouldKeepListeningRef.current || isSubmittingRef.current) return;
        startAutoListening();
      }, 250);
    };

    try {
      recognition.start();
      setIsListening(true);
      setStatus("AI is listening... please answer.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Cannot start microphone.");
      setIsListening(false);
    }
  };

  const autoSubmitAnswer = async () => {
    const latestTranscript = transcriptRef.current.trim();
    const latestQuestion = questionTextRef.current;
    if (!sessionId || isSubmittingRef.current) return;
    if (!latestQuestion || latestQuestion === "Loading question...") return;
    if (latestQuestion === "No more questions. You can end interview.") return;
    if (!latestTranscript) return;

    try {
      isSubmittingRef.current = true;
      setLoading(true);
      stopAutoListening();
      if (isRepeatQuestionRequest(latestTranscript)) {
        // Special case only: candidate asks to repeat current question.
        transcriptRef.current = "";
        setTranscript("");
        setStatus("Anh/chị nhắc lại câu hỏi hiện tại.");
        await speakAsAvatar(`Anh/chị nhắc lại câu hỏi nhé: ${latestQuestion}`);
        return;
      }

      // Simple flow requested by user: submit once, then move to next question.
      await submitAnswer(sessionId, latestQuestion, latestTranscript);
      setQaLogs((prev) => [...prev, { question: latestQuestion, answer: latestTranscript }]);
      transcriptRef.current = "";
      setTranscript("");
      setStatus("Da ghi nhan cau tra loi. Dang chuyen sang cau tiep theo...");
      await speakAsAvatarSafely(getTransitionLine());
      // Safety cap: never exceed 5 answered questions in one interview.
      if (qaLogs.length + 1 >= 5) {
        await speakAsAvatarSafely("Cảm ơn em đã tham gia buổi phỏng vấn hôm nay. Anh/chị sẽ chấm điểm và tổng hợp kết quả ngay.");
        await finalizeInterview();
        return;
      }
      await loadQuestion();
    } catch (error: any) {
      if (isEmptyJsonResponseError(error)) {
        // Some APIs may return an empty body after successful submit; continue interview flow.
        setQaLogs((prev) => [...prev, { question: latestQuestion, answer: latestTranscript }]);
        transcriptRef.current = "";
        setTranscript("");
        setStatus("Da ghi nhan cau tra loi. Dang chuyen sang cau tiep theo...");
        await speakAsAvatarSafely(getTransitionLine());
        if (qaLogs.length + 1 >= 5) {
          await speakAsAvatarSafely("Cảm ơn em đã tham gia buổi phỏng vấn hôm nay. Anh/chị sẽ chấm điểm và tổng hợp kết quả ngay.");
          await finalizeInterview();
          return;
        }
        await loadQuestion();
        return;
      }
      setStatus(error instanceof Error ? error.message : "Failed to process answer.");
      startAutoListening();
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const finalizeInterview = async () => {
    if (!sessionId || isFinishingInterviewRef.current) return;
    isFinishingInterviewRef.current = true;
    try {
      setLoading(true);
      stopAutoListening();
      const result = await endInterview(sessionId);
      await cleanupAvatarSdk();
      // Persist final scoring + collected Q/A logs for Results page.
      localStorage.setItem("aimasio_result", JSON.stringify({ ...result, qaLogs }));
      navigate("/results");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to finalize interview.");
      isFinishingInterviewRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async () => {
    if (!sessionId) {
      setStatus("Missing session. Please create interview first.");
      return;
    }

    try {
      setLoading(true);
      const next = await getNextQuestion(sessionId);
      if (!next) {
        setQuestionText("No more questions. You can end interview.");
        setQuestionDescription("");
        setAvatarStatus("Interview complete.");
        await speakAsAvatarSafely("Cảm ơn em đã tham gia buổi phỏng vấn hôm nay. Anh/chị đã ghi nhận phần trả lời cuối, bây giờ anh/chị sẽ chấm điểm và tổng hợp kết quả ngay.");
        await finalizeInterview();
        return;
      }
      setQuestionText(next.question);
      setQuestionDescription(next.description ?? "");
      setStatus("");
      await speakAsAvatar(next.question);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load question.");
      setAvatarStatus("Avatar unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        await initAvatarSdk();
      } catch (error) {
        setAvatarMode("fallback");
        setAvatarStatus(mapDidError(error));
      }
      await requestMicPermission();
      await speakAsAvatar("Chào bạn, mình là AI HR của YourHR AI. Chúng ta bắt đầu buổi phỏng vấn nhé.");
      await loadQuestion();
    })();
    return () => {
      stopAutoListening();
      window.speechSynthesis?.cancel?.();
      void cleanupAvatarSdk();
    };
  }, []);

  const handleEnd = async () => {
    if (!sessionId) {
      setStatus("Missing session. Please create interview first.");
      return;
    }
    await finalizeInterview();
  };

  return (
    <AppShell>
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          Live session
        </div>
        <h1 className="text-heading">Live interview</h1>
        <p className="text-sm text-muted-foreground mt-1">{role} — Candidate Session</p>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground mb-3">AI HR avatar</p>
          <div className="rounded-lg border border-border overflow-hidden bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-[420px] md:h-[480px] object-contain object-center bg-black"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{avatarStatus}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isListening ? "Listening..." : "Waiting for AI / processing..."}
          </p>
        </div>

        <div className="pt-1">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={handleEnd}
            disabled={loading}
          >
            <Square className="h-4 w-4 mr-2" /> End interview
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

export default LiveInterview;
