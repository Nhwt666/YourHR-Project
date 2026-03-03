using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using AIInterview.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AIInterview.Infrastructure.AI;

/// <summary>
/// Groq LLM implementation. Model from config, default llama-3.1-8b-instant (llama3-8b-8192 deprecated).
/// </summary>
public class GroqAIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GroqAIService> _logger;
    private readonly string _model;
    private readonly string _knowledgeBasePath;
    private readonly object _kbLock = new();
    private List<RagChunk>? _kbChunks;

    public GroqAIService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<GroqAIService> logger,
        IHostEnvironment hostEnvironment)
    {
        _httpClient = httpClient;
        _logger = logger;
        _model = configuration["Groq:Model"] ?? "llama-3.1-8b-instant";
        _knowledgeBasePath = configuration["Rag:KnowledgeBasePath"]
            ?? Path.Combine(hostEnvironment.ContentRootPath, "KnowledgeBase");
        var apiKey = configuration["Groq:ApiKey"] ?? configuration["GROQ_API_KEY"];
        if (string.IsNullOrEmpty(apiKey))
            _logger.LogWarning("Groq API key not set. Set Groq:ApiKey or GROQ_API_KEY.");
        _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "Bearer " + apiKey);
        _httpClient.BaseAddress = new Uri("https://api.groq.com");
    }

    public async Task<IReadOnlyList<QuestionWithDescription>> GenerateInterviewQuestionsAsync(string jobRole, CancellationToken cancellationToken = default)
    {
        var targetQuestionCount = Random.Shared.Next(4, 6);
        var ragContext = BuildRagContext($"generate_questions {jobRole}", topK: 4);
        var systemPrompt = """
            Bạn là HR senior phỏng vấn tuyển dụng bằng tiếng Việt.
            Mặc định toàn bộ phỏng vấn phải đặt trong bối cảnh FPT Software Việt Nam.
            Trả về DUY NHẤT một JSON array gồm đúng số lượng câu theo yêu cầu người dùng.
            Mỗi item có 2 field: "question", "description".
            Ràng buộc:
            - Dùng tiếng Việt thuần, tự nhiên, dễ nghe; tránh pha tiếng Anh nếu có từ Việt tương đương.
            - Câu hỏi ngắn gọn, rõ nghĩa, ưu tiên văn nói lịch sự của nhà tuyển dụng.
            - Câu hỏi phải sát vị trí tuyển dụng và bối cảnh công ty/ngách (nếu có), tuyệt đối không hỏi chung chung.
            - Các câu phải KHÁC NHAU rõ ràng, không lặp ý.
            - Trộn mức độ: 1 mở đầu ngắn, 2 câu chuyên môn, 1 câu xử lý tình huống, 1 câu hành vi.
            - Nếu input có "Bối cảnh công ty: ...", mọi câu hỏi phải có liên hệ trực tiếp đến bối cảnh này.
            - Tránh bộ câu quen thuộc lặp đi lặp lại như: "Giới thiệu bản thân", "Vì sao ứng tuyển", "Điểm mạnh lớn nhất".
            - "description" ngắn (8-18 từ), nêu mục tiêu đánh giá.
            - Không thêm markdown, không giải thích ngoài JSON.
            """;
        var userPrompt = $"""
            Hồ sơ phỏng vấn: {jobRole}
            Số lượng câu hỏi cần tạo: {targetQuestionCount} câu (chỉ trong khoảng 4-5 câu).

            Tài liệu tham chiếu nội bộ (RAG):
            {ragContext}
            """;

        try
        {
            var content = await CallGroqAsync(systemPrompt, userPrompt, cancellationToken);
            var list = ParseQuestionsWithDescriptions(content)
                .Where(x => !string.IsNullOrWhiteSpace(x.Question))
                .GroupBy(x => x.Question.Trim(), StringComparer.OrdinalIgnoreCase)
                .Select(g => g.First())
                .Take(targetQuestionCount)
                .ToList();

            if (list.Count >= 4) return list;
            return BuildFallbackQuestions(jobRole, targetQuestionCount);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "GenerateInterviewQuestionsAsync failed. Using fallback questions.");
            return BuildFallbackQuestions(jobRole, targetQuestionCount);
        }
    }

    public async Task<EvaluateResult> EvaluateSessionAsync(IReadOnlyList<(string Question, string Transcript)> qaPairs, CancellationToken cancellationToken = default)
    {
        if (qaPairs.Count == 0) return new EvaluateResult(5, "Chưa có câu trả lời nào.");
        var sb = new System.Text.StringBuilder();
        foreach (var (q, t) in qaPairs)
            sb.AppendLine($"Q: {q}\nA: {t}\n");
        var systemPrompt = "Bạn là giám khảo phỏng vấn. Đánh giá TỔNG THỂ toàn bộ cuộc phỏng vấn. Trả về CHỈ một JSON: {\"score\": số 1-10, \"feedback\": \"nhận xét tổng hợp bằng tiếng Việt\"}. Ví dụ: {\"score\": 7, \"feedback\": \"Câu trả lời có cấu trúc tốt; nên thêm ví dụ cụ thể hơn.\"}";
        var userPrompt = "Nội dung phỏng vấn:\n" + sb;
        var content = await CallGroqAsync(systemPrompt, userPrompt.ToString(), cancellationToken);
        return ParseEvaluateResult(content);
    }

    public async Task<EvaluateResult> EvaluateAnswerAsync(string questionText, string transcript, CancellationToken cancellationToken = default)
    {
        var systemPrompt = "You are an interview evaluator. Return ONLY a JSON object with \"score\" (integer 1-10) and \"feedback\" (string). All feedback MUST be in Vietnamese (tiếng Việt). Example: {\"score\": 7, \"feedback\": \"Cấu trúc ổn; nên thêm ví dụ cụ thể.\"}";
        var userPrompt = $"Question: {questionText}\n\nCandidate answer: {transcript}";

        var content = await CallGroqAsync(systemPrompt, userPrompt, cancellationToken);
        return ParseEvaluateResult(content);
    }

    public async Task<CvReviewResult> EvaluateCvAsync(
        string cvText,
        string targetRole,
        string companyContext,
        CancellationToken cancellationToken = default)
    {
        var ragContext = BuildRagContext($"cv review {targetRole} {companyContext}", topK: 6);
        var systemPrompt = """
            Bạn là HR senior của FPT Software Việt Nam.
            Nhiệm vụ: chấm điểm CV theo mức độ phù hợp với vị trí và bối cảnh công ty.
            Trả về DUY NHẤT một JSON object theo schema:
            {
              "overallScore": 0-100,
              "summary": "2-4 câu nhận xét tổng quan",
              "strengths": ["...", "..."],
              "gaps": ["...", "..."],
              "recommendations": ["...", "..."]
            }

            Ràng buộc:
            - Nhận xét thực tế, cụ thể, không chung chung.
            - recommendations phải là action item có thể làm ngay.
            - strengths/gaps/recommendations mỗi mục 2-6 ý.
            - Không markdown, không giải thích ngoài JSON.
            """;

        var userPrompt = $"""
            Target role: {targetRole}
            Company context: {companyContext}

            Tài liệu tham chiếu nội bộ (RAG):
            {ragContext}

            CV text:
            {cvText}
            """;

        try
        {
            var content = await CallGroqAsync(systemPrompt, userPrompt, cancellationToken, 0.2);
            return ParseCvReview(content);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "EvaluateCvAsync failed. Returning fallback CV review.");
            return BuildCvFallback();
        }
    }

    public async Task<FollowUpGenerationResult> GenerateInterviewerFollowUpAsync(
        string jobRole,
        string currentQuestion,
        string currentQuestionDescription,
        string candidateText,
        string sectionTranscript,
        int turnIndex,
        string mode,
        CancellationToken cancellationToken = default)
    {
        if (string.Equals(mode, "support", StringComparison.OrdinalIgnoreCase) && IsRepeatQuestionRequest(candidateText))
        {
            // Deterministic path for "không nghe rõ/nhắc lại" so interviewer stays on current question.
            var repeatedQuestionReply = $"Anh/chị nhắc lại câu hỏi nhé: {currentQuestion}";
            return new FollowUpGenerationResult(repeatedQuestionReply, true, "", "", "{}", "{}");
        }

        var ragQuery = $"followup {jobRole}\nQ:{currentQuestion}\nA:{candidateText}\nHistory:{sectionTranscript}";
        var ragContext = BuildRagContext(ragQuery, topK: 5);

        var planner = await CreatePlanAsync(
            jobRole, currentQuestion, currentQuestionDescription, candidateText, sectionTranscript, turnIndex, mode, ragContext, null, cancellationToken);
        if (planner == null)
        {
            var fallback = BuildSafeFallback(mode, currentQuestion);
            return new FollowUpGenerationResult(fallback, false, "planner_null", "planner parse failed", "{}", "{}");
        }

        var critic = await CritiquePlanAsync(
            planner, jobRole, currentQuestion, currentQuestionDescription, sectionTranscript, mode, ragContext, cancellationToken);

        // Nếu critic đánh fail, regenerate 1 lần với lỗi cụ thể để câu hỏi bớt generic/lặp.
        if (critic is { Pass: false })
        {
            planner = await CreatePlanAsync(
                jobRole, currentQuestion, currentQuestionDescription, candidateText, sectionTranscript, turnIndex, mode, ragContext, critic, cancellationToken)
                ?? planner;
            critic = await CritiquePlanAsync(
                planner, jobRole, currentQuestion, currentQuestionDescription, sectionTranscript, mode, ragContext, cancellationToken);
        }

        if (critic is { Pass: false })
        {
            var fallback = BuildSafeFallback(mode, currentQuestion);
            return new FollowUpGenerationResult(
                fallback,
                false,
                string.Join("; ", critic.Issues),
                critic.Suggestion,
                JsonSerializer.Serialize(planner),
                JsonSerializer.Serialize(critic));
        }

        var reply = ComposeHrReply(planner, mode);
        return new FollowUpGenerationResult(
            reply,
            critic?.Pass ?? false,
            critic == null ? "critic_null" : string.Join("; ", critic.Issues),
            critic?.Suggestion ?? "",
            JsonSerializer.Serialize(planner),
            critic == null ? "{}" : JsonSerializer.Serialize(critic));
    }

    private async Task<string> CallGroqAsync(string systemPrompt, string userPrompt, CancellationToken cancellationToken, double temperature = 0.3)
    {
        var body = new
        {
            model = _model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
            temperature,
            max_tokens = 1024
            // stream = false by default
        };

        using var response = await _httpClient.PostAsJsonAsync("/openai/v1/chat/completions", body, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("Groq API {StatusCode}: {Body}", response.StatusCode, errorBody);
            throw new HttpRequestException($"Groq API returned {(int)response.StatusCode}: {errorBody}");
        }
        var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken);
        return json.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "{}";
    }

    private static List<QuestionWithDescription> ParseQuestionsWithDescriptions(string content)
    {
        try
        {
            var trimmed = content.Trim();
            if (!trimmed.StartsWith("[")) return new List<QuestionWithDescription>();
            using var doc = JsonDocument.Parse(trimmed);
            var list = new List<QuestionWithDescription>();
            foreach (var el in doc.RootElement.EnumerateArray())
            {
                var q = el.TryGetProperty("question", out var qp) ? qp.GetString() ?? "" : "";
                var d = el.TryGetProperty("description", out var dp) ? dp.GetString() ?? "" : "";
                if (!string.IsNullOrWhiteSpace(q)) list.Add(new QuestionWithDescription(q, d ?? ""));
            }
            return list;
        }
        catch { return new List<QuestionWithDescription>(); }
    }

    private static EvaluateResult ParseEvaluateResult(string content)
    {
        try
        {
            var trimmed = content.Trim();
            using var doc = JsonDocument.Parse(trimmed);
            var root = doc.RootElement;
            var score = root.TryGetProperty("score", out var s) ? s.GetInt32() : 5;
            var feedback = root.TryGetProperty("feedback", out var f) ? f.GetString() ?? "No feedback." : "No feedback.";
            score = Math.Clamp(score, 1, 10);
            return new EvaluateResult(score, feedback);
        }
        catch
        {
            return new EvaluateResult(5, "Evaluation could not be parsed.");
        }
    }

    private static CvReviewResult ParseCvReview(string content)
    {
        try
        {
            var jsonText = ExtractFirstJsonObject(content);
            if (string.IsNullOrWhiteSpace(jsonText)) return BuildCvFallback();
            using var doc = JsonDocument.Parse(jsonText);
            var root = doc.RootElement;

            var score = root.TryGetProperty("overallScore", out var s) ? s.GetInt32() : 55;
            score = Math.Clamp(score, 0, 100);
            var summary = root.TryGetProperty("summary", out var sum) ? sum.GetString() ?? "" : "";
            var strengths = ReadStringArray(root, "strengths");
            var gaps = ReadStringArray(root, "gaps");
            var recommendations = ReadStringArray(root, "recommendations");

            return new CvReviewResult(
                score,
                string.IsNullOrWhiteSpace(summary) ? "CV có nền tảng cơ bản nhưng cần làm rõ thành tựu định lượng." : summary.Trim(),
                strengths.Count > 0 ? strengths : new List<string> { "Có thông tin kinh nghiệm nền tảng phù hợp vị trí kỹ thuật." },
                gaps.Count > 0 ? gaps : new List<string> { "Thiếu số liệu định lượng để chứng minh kết quả công việc." },
                recommendations.Count > 0 ? recommendations : new List<string> { "Bổ sung kết quả đo được cho từng dự án (latency, throughput, defect rate...)."} );
        }
        catch
        {
            return BuildCvFallback();
        }
    }

    private static List<string> ReadStringArray(JsonElement root, string propertyName)
    {
        var result = new List<string>();
        if (!root.TryGetProperty(propertyName, out var arr) || arr.ValueKind != JsonValueKind.Array) return result;
        foreach (var item in arr.EnumerateArray())
        {
            var text = item.GetString();
            if (!string.IsNullOrWhiteSpace(text)) result.Add(text.Trim());
        }
        return result;
    }

    private static CvReviewResult BuildCvFallback()
    {
        return new CvReviewResult(
            55,
            "CV có nền tảng cơ bản, nhưng cần tăng độ rõ ràng về tác động công việc để phù hợp FPT Software Việt Nam.",
            new List<string> { "Có kinh nghiệm kỹ thuật liên quan.", "Bố cục CV tương đối đầy đủ." },
            new List<string> { "Thiếu số liệu định lượng kết quả.", "Mô tả trách nhiệm nhiều hơn thành tựu." },
            new List<string>
            {
                "Mỗi dự án thêm 1-2 chỉ số cụ thể (performance, uptime, chi phí, lead time).",
                "Nêu rõ vai trò cá nhân và quyết định kỹ thuật quan trọng trong team.",
                "Ưu tiên mô tả dự án gần với bối cảnh outsourcing enterprise."
            });
    }

    private static IReadOnlyList<QuestionWithDescription> BuildFallbackQuestions(string jobRole, int targetQuestionCount)
    {
        var pool = new List<QuestionWithDescription>
        {
            new($"Nếu nhận vị trí {jobRole}, trong 30 ngày đầu em sẽ ưu tiên việc gì trước?", "Đo tư duy ưu tiên và kế hoạch hòa nhập thực tế."),
            new("Em hãy kể một lỗi nghiêm trọng từng gặp và cách em xử lý từ đầu đến cuối.", "Đánh giá kỹ năng xử lý sự cố và trách nhiệm cá nhân."),
            new("Khi yêu cầu công việc chưa rõ, em thường làm rõ với nhóm theo cách nào?", "Kiểm tra kỹ năng làm rõ yêu cầu và giao tiếp liên phòng ban."),
            new("Em từng bảo vệ một quyết định kỹ thuật trước nhóm như thế nào?", "Đo lập luận kỹ thuật và khả năng phản biện tích cực."),
            new("Nếu thời gian rất gấp nhưng chất lượng có thể giảm, em sẽ cân bằng ra sao?", "Đánh giá tư duy cân bằng giữa tiến độ và chất lượng."),
            new("Em dựa vào tiêu chí nào để biết một tính năng đã làm tốt chưa?", "Kiểm tra tư duy đo lường kết quả và cải tiến liên tục."),
            new("Em hãy nêu một ví dụ em giúp đồng đội vượt qua bế tắc kỹ thuật.", "Đánh giá tinh thần hợp tác và ảnh hưởng trong nhóm."),
            new("Trước khi nhận một việc hoàn toàn mới, em thường chuẩn bị như thế nào?", "Đo khả năng học nhanh và chủ động tìm thông tin.")
        };

        return pool
            .OrderBy(_ => Random.Shared.Next())
            .Take(Math.Clamp(targetQuestionCount, 4, 5))
            .ToList();
    }

    private async Task<FollowUpPlan?> CreatePlanAsync(
        string jobRole,
        string currentQuestion,
        string currentQuestionDescription,
        string candidateText,
        string sectionTranscript,
        int turnIndex,
        string mode,
        string ragContext,
        CriticResult? criticFeedback,
        CancellationToken cancellationToken)
    {
        var systemPrompt = """
            Bạn là planner cho HR interviewer.
            Trả về DUY NHẤT JSON object có schema:
            {
              "intent": "probe|support|advance",
              "hr_bridge": "1 câu mở ngắn tự nhiên",
              "next_question": "1 câu hỏi tiếp theo",
              "reasoning_focus": "ý chính đang bám theo",
              "specificity_score": 1-10,
              "company_alignment_score": 1-10
            }

            Ràng buộc:
            - Xưng hô kiểu HR: "anh/chị" - "em", không dùng "bạn".
            - Không lặp wording cũ trong section.
            - Nếu có bối cảnh công ty/ngách, câu hỏi phải bám sát bối cảnh đó.
            - Luôn ưu tiên dùng thông tin trong "Tài liệu tham chiếu nội bộ (RAG)" nếu có.
            - Nếu profile chưa nêu rõ công ty, mặc định suy luận là FPT Software Việt Nam.
            - "next_question" phải cụ thể, không generic.
            - Với mode=deepen_answer: bắt buộc intent=probe.
            - Với mode=support: intent=support hoặc probe.
            - Không markdown, không giải thích ngoài JSON.
            """;

        var criticHints = criticFeedback == null
            ? ""
            : $"Lỗi từ critic trước đó: {string.Join("; ", criticFeedback.Issues)}\nGợi ý sửa: {criticFeedback.Suggestion}";

        var userPrompt = $"""
            mode={mode}
            profile={jobRole}
            current_question={currentQuestion}
            current_question_goal={currentQuestionDescription}
            turn_index={turnIndex}
            candidate_latest={candidateText}
            section_history=
            {sectionTranscript}

            Tài liệu tham chiếu nội bộ (RAG):
            {ragContext}

            {criticHints}
            """;

        var content = await CallGroqAsync(systemPrompt, userPrompt, cancellationToken, mode == "deepen_answer" ? 0.35 : 0.25);
        return ParsePlan(content);
    }

    private async Task<CriticResult?> CritiquePlanAsync(
        FollowUpPlan plan,
        string jobRole,
        string currentQuestion,
        string currentQuestionDescription,
        string sectionTranscript,
        string mode,
        string ragContext,
        CancellationToken cancellationToken)
    {
        var systemPrompt = """
            Bạn là critic kiểm soát chất lượng câu hỏi phỏng vấn.
            Trả về DUY NHẤT JSON object:
            {
              "pass": true|false,
              "issues": ["..."],
              "suggestion": "..."
            }

            Tiêu chí fail:
            - Câu hỏi generic/chung chung.
            - Không bám bối cảnh FPT Software Việt Nam hoặc profile công ty/ngách.
            - Không nối tiếp được với lịch sử section hiện tại.
            - Lặp ý/câu với history.
            - Xưng hô không phù hợp HR interview.
            - Bỏ qua thông tin quan trọng trong RAG khi RAG có dữ liệu liên quan.
            Không markdown, không giải thích ngoài JSON.
            """;

        var userPrompt = $"""
            mode={mode}
            profile={jobRole}
            current_question={currentQuestion}
            current_question_goal={currentQuestionDescription}
            section_history=
            {sectionTranscript}

            Tài liệu tham chiếu nội bộ (RAG):
            {ragContext}

            candidate_plan_json=
            {JsonSerializer.Serialize(plan)}
            """;

        var content = await CallGroqAsync(systemPrompt, userPrompt, cancellationToken, 0.1);
        return ParseCritic(content);
    }

    private static string ComposeHrReply(FollowUpPlan plan, string mode)
    {
        var bridge = (plan.HrBridge ?? "").Trim();
        var nextQuestion = (plan.NextQuestion ?? "").Trim();
        if (string.IsNullOrWhiteSpace(bridge) && string.IsNullOrWhiteSpace(nextQuestion))
            return BuildSafeFallback(mode, "");
        if (string.IsNullOrWhiteSpace(nextQuestion)) return bridge;
        if (string.IsNullOrWhiteSpace(bridge)) return nextQuestion;
        return $"{bridge} {nextQuestion}";
    }

    private static string BuildSafeFallback(string mode, string currentQuestion)
    {
        return mode == "deepen_answer"
            ? "Anh/chị muốn đi sâu thêm một chút. Em có thể nêu một ví dụ cụ thể gần nhất và kết quả đo được không?"
            : $"Không sao, anh/chị gợi ý ngắn: em bám một tình huống thực tế, nêu cách xử lý và kết quả. Em thử trả lời lại câu này nhé: {currentQuestion}";
    }

    private static bool IsRepeatQuestionRequest(string text)
    {
        var normalized = (text ?? "").Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(normalized)) return false;
        return normalized.Contains("không nghe rõ")
               || normalized.Contains("khong nghe ro")
               || normalized.Contains("nhắc lại")
               || normalized.Contains("nhac lai")
               || normalized.Contains("nói lại")
               || normalized.Contains("noi lai");
    }

    private static FollowUpPlan? ParsePlan(string content)
    {
        try
        {
            var jsonText = ExtractFirstJsonObject(content);
            if (string.IsNullOrWhiteSpace(jsonText)) return null;
            using var doc = JsonDocument.Parse(jsonText);
            var root = doc.RootElement;
            var intent = root.TryGetProperty("intent", out var i) ? i.GetString() ?? "probe" : "probe";
            var bridge = root.TryGetProperty("hr_bridge", out var b) ? b.GetString() ?? "" : "";
            var next = root.TryGetProperty("next_question", out var q) ? q.GetString() ?? "" : "";
            var focus = root.TryGetProperty("reasoning_focus", out var f) ? f.GetString() ?? "" : "";
            var s = root.TryGetProperty("specificity_score", out var sp) ? sp.GetInt32() : 5;
            var c = root.TryGetProperty("company_alignment_score", out var ca) ? ca.GetInt32() : 5;
            return new FollowUpPlan(intent, bridge, next, focus, s, c);
        }
        catch { return null; }
    }

    private static CriticResult? ParseCritic(string content)
    {
        try
        {
            var jsonText = ExtractFirstJsonObject(content);
            if (string.IsNullOrWhiteSpace(jsonText)) return null;
            using var doc = JsonDocument.Parse(jsonText);
            var root = doc.RootElement;
            var pass = root.TryGetProperty("pass", out var p) && p.ValueKind == JsonValueKind.True;
            var suggestion = root.TryGetProperty("suggestion", out var s) ? s.GetString() ?? "" : "";
            var issues = new List<string>();
            if (root.TryGetProperty("issues", out var i) && i.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in i.EnumerateArray())
                {
                    var text = item.GetString();
                    if (!string.IsNullOrWhiteSpace(text)) issues.Add(text);
                }
            }
            return new CriticResult(pass, issues, suggestion);
        }
        catch { return null; }
    }

    private static string ExtractFirstJsonObject(string raw)
    {
        var text = (raw ?? "").Trim();
        if (text.StartsWith("{") && text.EndsWith("}")) return text;
        var first = text.IndexOf('{');
        var last = text.LastIndexOf('}');
        return first >= 0 && last > first ? text[first..(last + 1)] : "";
    }

    private string BuildRagContext(string query, int topK)
    {
        EnsureKnowledgeBaseLoaded();
        var chunks = _kbChunks;
        if (chunks == null || chunks.Count == 0) return "Khong co du lieu RAG.";

        var queryTokens = Tokenize(query);
        var ranked = chunks
            .Select(c => new { Chunk = c, Score = ScoreChunk(c, queryTokens) })
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Chunk.Text.Length)
            .Take(topK)
            .ToList();

        if (!ranked.Any()) return "Khong tim thay tai lieu lien quan.";

        return string.Join(
            "\n\n---\n",
            ranked.Select(x => $"[{x.Chunk.Source}] {x.Chunk.Title}\n{x.Chunk.Text}"));
    }

    private void EnsureKnowledgeBaseLoaded()
    {
        if (_kbChunks != null) return;
        lock (_kbLock)
        {
            if (_kbChunks != null) return;
            var chunks = new List<RagChunk>();
            try
            {
                if (!Directory.Exists(_knowledgeBasePath))
                {
                    _logger.LogWarning("RAG knowledge base path not found: {Path}", _knowledgeBasePath);
                    _kbChunks = chunks;
                    return;
                }

                var files = Directory.GetFiles(_knowledgeBasePath, "*.*", SearchOption.AllDirectories)
                    .Where(f => f.EndsWith(".md", StringComparison.OrdinalIgnoreCase)
                                || f.EndsWith(".txt", StringComparison.OrdinalIgnoreCase))
                    .ToList();

                foreach (var file in files)
                {
                    var raw = File.ReadAllText(file);
                    var normalized = NormalizeText(raw);
                    if (string.IsNullOrWhiteSpace(normalized)) continue;

                    var title = Path.GetFileNameWithoutExtension(file);
                    var paragraphs = normalized.Split("\n\n", StringSplitOptions.RemoveEmptyEntries);
                    var buffer = new List<string>();
                    var currentLen = 0;
                    foreach (var p in paragraphs)
                    {
                        var seg = p.Trim();
                        if (seg.Length == 0) continue;
                        if (currentLen + seg.Length > 700 && buffer.Count > 0)
                        {
                            var text = string.Join("\n", buffer);
                            chunks.Add(new RagChunk(Path.GetFileName(file), title, text, Tokenize(text)));
                            buffer.Clear();
                            currentLen = 0;
                        }

                        buffer.Add(seg);
                        currentLen += seg.Length;
                    }

                    if (buffer.Count > 0)
                    {
                        var text = string.Join("\n", buffer);
                        chunks.Add(new RagChunk(Path.GetFileName(file), title, text, Tokenize(text)));
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to load RAG knowledge base.");
            }

            _kbChunks = chunks;
            _logger.LogInformation("RAG loaded {Count} chunks from {Path}", chunks.Count, _knowledgeBasePath);
        }
    }

    private static double ScoreChunk(RagChunk chunk, HashSet<string> queryTokens)
    {
        if (queryTokens.Count == 0) return 0;
        var overlap = queryTokens.Count(t => chunk.Tokens.Contains(t));
        if (overlap == 0) return 0;
        var density = overlap / (double)Math.Max(8, chunk.Tokens.Count);
        return overlap * 2.0 + density * 8.0;
    }

    private static HashSet<string> Tokenize(string text)
    {
        var normalized = NormalizeText(text);
        var parts = normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return parts.Where(p => p.Length >= 2).ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private static string NormalizeText(string text)
    {
        var lower = (text ?? "").ToLowerInvariant();
        lower = Regex.Replace(lower, @"[^\p{L}\p{N}\s]", " ");
        lower = Regex.Replace(lower, @"\s+", " ").Trim();
        return lower.Replace(" .", ".").Replace(" ,", ",");
    }

    private sealed record FollowUpPlan(
        string Intent,
        string HrBridge,
        string NextQuestion,
        string ReasoningFocus,
        int SpecificityScore,
        int CompanyAlignmentScore);

    private sealed record CriticResult(bool Pass, List<string> Issues, string Suggestion);
    private sealed record RagChunk(string Source, string Title, string Text, HashSet<string> Tokens);
}
