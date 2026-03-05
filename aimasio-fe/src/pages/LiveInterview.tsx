import { Mic, Video, PhoneOff, Maximize2, Minimize2 } from "lucide-react";
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
  const [questionText, setQuestionText] = useState("Đang tải câu hỏi...");
  const [questionDescription, setQuestionDescription] = useState("");
  const [transcript, setTranscript] = useState("");
  const [qaLogs, setQaLogs] = useState<QaLogItem[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("Đang kết nối AI HR...");
  const [avatarMode, setAvatarMode] = useState<"sdk" | "fallback">("sdk");
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const speakDoneTimerRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(false);
  const shouldKeepListeningRef = useRef(false);
  const transcriptRef = useRef("");
  const questionTextRef = useRef("Đang tải câu hỏi...");
  const pendingListenAfterSpeechRef = useRef(false);
  const lastSpokenTextRef = useRef("");
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const agentManagerRef = useRef<any>(null);
  const isFinishingInterviewRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // Mặc định vào fullscreen khi mở trang Live Interview
  useEffect(() => {
    const el = containerRef.current;
    if (el?.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Silently ignore fullscreen errors; UI still usable without it.
    }
  };

  const sessionId = localStorage.getItem("aimasio_session_id");
  const role = localStorage.getItem("aimasio_role") ?? "Phiên ứng viên";
  const didAgentId = import.meta.env.VITE_DID_AGENT_ID ?? "v2_agt_7OafqFLv";
  const didClientKey =
    import.meta.env.VITE_DID_CLIENT_KEY ??
    "Z29vZ2xlLW9hdXRoMnwxMTU3MzA5MjEwNTYxOTg2MTE4MTg6OWVLMTlRQjg4dTEzZ2xDcncwQk9U";
  const SILENCE_MS = 2500;

  const mapDidError = (error: unknown) => {
    const raw = error instanceof Error ? error.message : "Lỗi D-ID SDK không xác định";
    if (raw.toLowerCase().includes("failed to fetch")) {
      return `D-ID SDK không thể kết nối. Vui lòng thêm ${window.location.origin} vào danh sách domain được phép trên D-ID. Hệ thống sẽ chuyển sang chế độ fallback.`;
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
      throw new Error("Thiếu D-ID Agent ID hoặc client key.");
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
          setAvatarStatus("Trình duyệt đang chặn tự động phát âm thanh.");
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
          setAvatarStatus("AI HR đang lắng nghe...");
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
          setAvatarStatus("AI HR đang nói...");
        }
      },
      onConnectionStateChange(state: string) {
        if (state === "connected") setAvatarStatus("AI HR đã kết nối.");
      },
      onError(error: unknown) {
        setAvatarStatus(`Lỗi AI HR: ${mapDidError(error)}`);
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

  const cleanupLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
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
        setAvatarStatus("AI HR đã kết nối lại.");
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
            setAvatarStatus("AI HR đang lắng nghe...");
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
        setAvatarStatus(`SDK lỗi: ${mapDidError(error)}`);
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
      setAvatarStatus("Đang chạy chế độ clip fallback.");
    } else {
      setAvatarStatus("Avatar fallback đang xử lý.");
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
      setStatus("Trình duyệt không hỗ trợ cấp quyền microphone.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setStatus("Microphone sẵn sàng. Bạn có thể trả lời tự nhiên, hệ thống tự động gửi.");
    } catch (error) {
      setStatus(error instanceof Error ? `Lỗi quyền microphone: ${error.message}` : "Bạn đã từ chối quyền microphone.");
    }
  };

  const startAutoListening = () => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setStatus("Trình duyệt hiện tại không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome.");
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
      setStatus(`Lỗi microphone: ${err}`);
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
      setStatus("AI đang lắng nghe... vui lòng trả lời.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không thể bật microphone.");
      setIsListening(false);
    }
  };

  const autoSubmitAnswer = async () => {
    const latestTranscript = transcriptRef.current.trim();
    const latestQuestion = questionTextRef.current;
    if (!sessionId || isSubmittingRef.current) return;
    if (!latestQuestion || latestQuestion === "Đang tải câu hỏi...") return;
    if (latestQuestion === "Đã hết câu hỏi. Bạn có thể kết thúc phỏng vấn.") return;
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
      setStatus("Đã ghi nhận câu trả lời. Đang chuyển sang câu tiếp theo...");
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
        setStatus("Đã ghi nhận câu trả lời. Đang chuyển sang câu tiếp theo...");
        await speakAsAvatarSafely(getTransitionLine());
        if (qaLogs.length + 1 >= 5) {
          await speakAsAvatarSafely("Cảm ơn em đã tham gia buổi phỏng vấn hôm nay. Anh/chị sẽ chấm điểm và tổng hợp kết quả ngay.");
          await finalizeInterview();
          return;
        }
        await loadQuestion();
        return;
      }
      setStatus(error instanceof Error ? error.message : "Không thể xử lý câu trả lời.");
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
      setStatus(error instanceof Error ? error.message : "Không thể kết thúc buổi phỏng vấn.");
      isFinishingInterviewRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async () => {
    if (!sessionId) {
      setStatus("Thiếu phiên làm việc. Vui lòng tạo buổi phỏng vấn trước.");
      return;
    }

    try {
      setLoading(true);
      const next = await getNextQuestion(sessionId);
      if (!next) {
        setQuestionText("Đã hết câu hỏi. Bạn có thể kết thúc phỏng vấn.");
        setQuestionDescription("");
        setAvatarStatus("Đã hoàn thành phỏng vấn.");
        await speakAsAvatarSafely("Cảm ơn em đã tham gia buổi phỏng vấn hôm nay. Anh/chị đã ghi nhận phần trả lời cuối, bây giờ anh/chị sẽ chấm điểm và tổng hợp kết quả ngay.");
        await finalizeInterview();
        return;
      }
      setQuestionText(next.question);
      setQuestionDescription(next.description ?? "");
      setStatus("");
      await speakAsAvatar(next.question);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không thể tải câu hỏi.");
      setAvatarStatus("Không thể sử dụng avatar.");
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
      await speakAsAvatar("Chào bạn, mình là AI HR của YourHR AI. Chúng ta bắt đầu buổi phỏng vấn nhé.");
      await loadQuestion();
    })();
    return () => {
      stopAutoListening();
      window.speechSynthesis?.cancel?.();
      void cleanupAvatarSdk();
      cleanupLocalStream();
    };
  }, []);

  const handleEnd = async () => {
    if (!sessionId) {
      setStatus("Thiếu phiên làm việc. Vui lòng tạo buổi phỏng vấn trước.");
      return;
    }
    await finalizeInterview();
  };

  const handleMicToggle = async () => {
    if (micEnabled) {
      stopAutoListening();
      setMicEnabled(false);
      setStatus("Đã tắt microphone cho buổi phỏng vấn.");
      return;
    }
    await requestMicPermission();
    startAutoListening();
    setMicEnabled(true);
  };

  const handleCameraToggle = async () => {
    if (cameraEnabled) {
      cleanupLocalStream();
      setCameraEnabled(false);
      setStatus("Đã tắt camera xem trước.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Trình duyệt không hỗ trợ camera.");
      return;
    }

    try {
      // Constraints compatible with mobile (facingMode: user) and desktop
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }
      setCameraEnabled(true);
      setStatus("Camera đã bật. Bạn có thể xem trước khung hình của mình.");
    } catch (error) {
      setStatus(
        error instanceof Error ? `Lỗi quyền camera: ${error.message}` : "Bạn đã từ chối quyền camera."
      );
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Phiên phỏng vấn trực tuyến</p>
          <h1 className="text-lg md:text-2xl font-semibold text-foreground mt-0.5">Live interview</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{role} — Phiên ứng viên</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          Đang ghi nhận
        </span>
      </header>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="relative flex-1 min-h-[50vh] bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-contain object-center bg-black"
          />
          <div className="absolute bottom-4 right-4 w-28 md:w-40 rounded-md border border-border bg-background/90 shadow-sm overflow-hidden z-10">
            {/* Video always mounted so ref exists when we assign stream (fixes camera not showing) */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`h-20 md:h-24 w-full object-cover object-center ${cameraEnabled ? "block" : "hidden"}`}
            />
            {!cameraEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface text-xs text-muted-foreground">
                Xem trước camera
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 py-4 flex flex-col items-center gap-2 bg-background border-t border-border">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleMicToggle}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                micEnabled ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
              disabled={loading}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleCameraToggle}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                cameraEnabled ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
              disabled={loading}
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleEnd}
              disabled={loading}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-destructive px-5 text-sm font-medium text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              <PhoneOff className="h-4 w-4" />
              Kết thúc
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center px-4">
            {avatarStatus} · {isListening ? "Microphone đang bật, AI đang lắng nghe bạn." : "Nhấn micro để bật ghi âm trả lời."}
          </p>
          {status ? (
            <p className="text-xs rounded-md px-2.5 py-1.5 text-muted-foreground bg-surface border border-border">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;
