using System.Security.Claims;
using System.Text;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using AIInterview.Application.Interfaces;
using AIInterview.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UglyToad.PdfPig;

namespace AIInterview.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InterviewController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly IInterviewRepository _repository;
    private readonly StartInterviewUseCase _startInterview;
    private readonly GetNextQuestionUseCase _getNextQuestion;
    private readonly SubmitAnswerUseCase _submitAnswer;
    private readonly EndInterviewUseCase _endInterview;
    private readonly EvaluateAnswerUseCase _evaluateAnswer;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public InterviewController(
        IAIService aiService,
        IInterviewRepository repository,
        StartInterviewUseCase startInterview,
        GetNextQuestionUseCase getNextQuestion,
        SubmitAnswerUseCase submitAnswer,
        EndInterviewUseCase endInterview,
        EvaluateAnswerUseCase evaluateAnswer,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration)
    {
        _aiService = aiService;
        _repository = repository;
        _startInterview = startInterview;
        _getNextQuestion = getNextQuestion;
        _submitAnswer = submitAnswer;
        _endInterview = endInterview;
        _evaluateAnswer = evaluateAnswer;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("userId") ?? User.FindFirstValue("sub");
        return Guid.TryParse(sub, out var id) ? id : Guid.Empty;
    }

    /// <summary>
    /// Start interview: creates session, generates questions (not returned). Returns only sessionId.
    /// </summary>
    [HttpPost("start")]
    public async Task<ActionResult<StartInterviewResponse>> Start([FromBody] StartInterviewRequest request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty) return Unauthorized("Invalid or missing user token.");
        try
        {
            var result = await _startInterview.ExecuteAsync(userId, request.JobRole, cancellationToken);
            return Ok(new StartInterviewResponse(result.SessionId));
        }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        catch (Exception ex)
        {
            return StatusCode(500, $"Start interview failed: {ex.Message}");
        }
    }

    /// <summary>
    /// Get next question (one at a time, like real interview). Null when no more questions.
    /// </summary>
    [HttpGet("next-question/{sessionId:guid}")]
    public async Task<ActionResult<QuestionItemDto?>> GetNextQuestion(Guid sessionId, CancellationToken cancellationToken)
    {
        var q = await _getNextQuestion.ExecuteAsync(sessionId, cancellationToken);
        if (q == null) return Ok((QuestionItemDto?)null);
        return Ok(new QuestionItemDto(q.Question, q.Description));
    }

    /// <summary>
    /// Submit answer (no evaluation). Score at end of interview.
    /// </summary>
    [HttpPost("submit-answer")]
    public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await _submitAnswer.ExecuteAsync(request.SessionId, request.QuestionText, request.Transcript ?? "", cancellationToken);
            return Ok();
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(ex.Message);
        }
    }

    /// <summary>
    /// Candidate asks back; AI gives short follow-up and returns to main interview flow.
    /// </summary>
    [HttpPost("follow-up")]
    public async Task<ActionResult<FollowUpResponse>> FollowUp([FromBody] FollowUpRequest request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetSessionByIdAsync(request.SessionId, cancellationToken);
        if (session == null) return NotFound($"Session {request.SessionId} not found.");

        var generated = await _aiService.GenerateInterviewerFollowUpAsync(
            session.JobRole,
            request.CurrentQuestion ?? string.Empty,
            request.CurrentQuestionDescription ?? string.Empty,
            request.CandidateText ?? string.Empty,
            request.SectionTranscript ?? string.Empty,
            request.TurnIndex ?? 1,
            request.Mode ?? "support",
            cancellationToken);

        var learningEventId = await _repository.SaveLearningEventAsync(new AIInterview.Domain.Entities.InterviewLearningEvent
        {
            Id = Guid.NewGuid(),
            SessionId = request.SessionId,
            CreatedAt = DateTime.UtcNow,
            TurnIndex = request.TurnIndex ?? 1,
            Mode = request.Mode ?? "support",
            CurrentQuestion = request.CurrentQuestion ?? string.Empty,
            CurrentQuestionDescription = request.CurrentQuestionDescription ?? string.Empty,
            CandidateText = request.CandidateText ?? string.Empty,
            SectionTranscript = request.SectionTranscript ?? string.Empty,
            AiReply = generated.Reply,
            CriticPass = generated.CriticPass,
            CriticIssues = generated.CriticIssues,
            CriticSuggestion = generated.CriticSuggestion,
            PlannerJson = generated.PlannerJson,
            CriticJson = generated.CriticJson
        }, cancellationToken);

        return Ok(new FollowUpResponse(generated.Reply, learningEventId, generated.CriticPass));
    }

    /// <summary>
    /// Saves end-user rating/feedback for a specific learning event.
    /// </summary>
    [HttpPost("learning-feedback")]
    public async Task<IActionResult> SaveLearningFeedback([FromBody] LearningFeedbackRequest request, CancellationToken cancellationToken)
    {
        if (request.UserRating is < 1 or > 5) return BadRequest("userRating must be between 1 and 5.");
        var ok = await _repository.SaveLearningFeedbackAsync(
            request.LearningEventId,
            request.UserRating,
            request.UserFeedback,
            cancellationToken);
        return ok ? Ok() : NotFound($"Learning event {request.LearningEventId} not found.");
    }

    /// <summary>
    /// Upload CV (pdf/txt) and get score + recommendations for target role.
    /// </summary>
    [HttpPost("cv-review")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<CvReviewResponse>> ReviewCv([FromForm] CvReviewRequest request, CancellationToken cancellationToken)
    {
        if (request.CvFile == null || request.CvFile.Length == 0)
            return BadRequest("CV file is required.");

        var ext = Path.GetExtension(request.CvFile.FileName).ToLowerInvariant();
        if (ext is not ".pdf" and not ".txt" and not ".md")
            return BadRequest("Only .pdf/.txt/.md files are supported.");

        var cvText = await ExtractCvTextAsync(request.CvFile, ext, cancellationToken);
        if (string.IsNullOrWhiteSpace(cvText))
            return BadRequest("Không trích xuất được nội dung CV. Nếu đây là PDF scan ảnh, vui lòng dùng PDF có text hoặc file .txt/.md.");

        var targetRole = string.IsNullOrWhiteSpace(request.TargetRole) ? "Lập trình viên Backend" : request.TargetRole.Trim();
        var companyContext = string.IsNullOrWhiteSpace(request.CompanyContext)
            ? "FPT Software Việt Nam | Môi trường outsourcing enterprise | Team Agile/Scrum"
            : request.CompanyContext.Trim();

        var result = await _aiService.EvaluateCvAsync(cvText, targetRole, companyContext, cancellationToken);
        return Ok(new CvReviewResponse(
            result.OverallScore,
            result.Summary,
            result.Strengths,
            result.Gaps,
            result.Recommendations));
    }

    /// <summary>
    /// End interview: get overall score and feedback.
    /// </summary>
    [HttpPost("end")]
    public async Task<ActionResult<EvaluateAnswerResponse>> End([FromBody] EndInterviewRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _endInterview.ExecuteAsync(request.SessionId, cancellationToken);
            return Ok(new EvaluateAnswerResponse(result.Score, result.Feedback));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(ex.Message);
        }
    }

    /// <summary>
    /// [Legacy] Evaluate single answer.
    /// </summary>
    [HttpPost("evaluate")]
    public async Task<ActionResult<EvaluateAnswerResponse>> Evaluate([FromBody] EvaluateAnswerRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _evaluateAnswer.ExecuteAsync(
                request.SessionId,
                request.QuestionText,
                request.Transcript ?? string.Empty,
                cancellationToken);
            return Ok(new EvaluateAnswerResponse(result.Score, result.Feedback));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(ex.Message);
        }
    }

    /// <summary>
    /// Generate an HR avatar video for the provided question text using D-ID.
    /// </summary>
    [HttpPost("avatar/speak")]
    public async Task<ActionResult<AvatarSpeakResponse>> GenerateAvatarSpeech([FromBody] AvatarSpeakRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
            return BadRequest("text is required.");

        var dIdApiKey = _configuration["DId:ApiKey"] ?? _configuration["DID_API_KEY"];
        var sourceUrl = _configuration["DId:SourceUrl"] ?? _configuration["DID_SOURCE_URL"];
        if (string.IsNullOrWhiteSpace(dIdApiKey) || string.IsNullOrWhiteSpace(sourceUrl))
            return BadRequest("D-ID is not configured. Missing DId:ApiKey or DId:SourceUrl.");

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.d-id.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(dIdApiKey)));

        var createPayload = new
        {
            source_url = sourceUrl,
            script = new
            {
                type = "text",
                input = request.Text,
                provider = new
                {
                    // Force Vietnamese neural voice so interviewer always speaks Vietnamese.
                    type = "microsoft",
                    voice_id = "vi-VN-HoaiMyNeural"
                }
            }
        };

        var createResponse = await client.PostAsJsonAsync("talks", createPayload, cancellationToken);
        if (!createResponse.IsSuccessStatusCode)
        {
            var createError = await createResponse.Content.ReadAsStringAsync(cancellationToken);
            return BadRequest($"D-ID create talk failed: {(int)createResponse.StatusCode} {createError}");
        }

        var created = await createResponse.Content.ReadFromJsonAsync<DIdTalkResponse>(cancellationToken: cancellationToken);
        if (created == null || string.IsNullOrWhiteSpace(created.id))
            return BadRequest("D-ID response is invalid.");

        // Poll until the rendered video is ready (small timeout for UI responsiveness).
        for (var i = 0; i < 16; i++)
        {
            await Task.Delay(1200, cancellationToken);
            var statusResponse = await client.GetAsync($"talks/{created.id}", cancellationToken);
            if (!statusResponse.IsSuccessStatusCode) continue;

            var status = await statusResponse.Content.ReadFromJsonAsync<DIdTalkResponse>(cancellationToken: cancellationToken);
            if (status == null) continue;
            if (string.Equals(status.status, "done", StringComparison.OrdinalIgnoreCase))
                return Ok(new AvatarSpeakResponse(status.result_url ?? "", status.id ?? created.id ?? "", status.status ?? "done"));
            if (string.Equals(status.status, "error", StringComparison.OrdinalIgnoreCase))
                return BadRequest("D-ID rendering error.");
        }

        return Ok(new AvatarSpeakResponse("", created.id ?? "", "processing"));
    }

    [HttpPost("avatar-stream/init")]
    public async Task<IActionResult> InitAvatarStream([FromBody] AvatarStreamInitRequest request, CancellationToken cancellationToken)
    {
        var dIdApiKey = _configuration["DId:ApiKey"] ?? _configuration["DID_API_KEY"];
        var agentId = _configuration["DId:AgentId"] ?? _configuration["DID_AGENT_ID"];
        if (string.IsNullOrWhiteSpace(dIdApiKey) || string.IsNullOrWhiteSpace(agentId))
            return BadRequest("D-ID stream is not configured. Missing DId:ApiKey or DId:AgentId.");

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.d-id.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(dIdApiKey)));

        var initPayload = new
        {
            stream_warmup = request.StreamWarmup ?? true,
            fluent = request.Fluent ?? false,
            compatibility_mode = string.IsNullOrWhiteSpace(request.CompatibilityMode) ? "auto" : request.CompatibilityMode
        };

        var response = await client.PostAsJsonAsync($"agents/{agentId}/streams", initPayload, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, responseText);
    }

    [HttpPost("avatar-stream/sdp")]
    public async Task<IActionResult> StartAvatarStreamConnection([FromBody] AvatarStreamSdpRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.StreamId) || request.Answer == null)
            return BadRequest("streamId and answer are required.");

        var dIdApiKey = _configuration["DId:ApiKey"] ?? _configuration["DID_API_KEY"];
        var agentId = _configuration["DId:AgentId"] ?? _configuration["DID_AGENT_ID"];
        if (string.IsNullOrWhiteSpace(dIdApiKey) || string.IsNullOrWhiteSpace(agentId))
            return BadRequest("D-ID stream is not configured. Missing DId:ApiKey or DId:AgentId.");

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.d-id.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(dIdApiKey)));

        var payload = new
        {
            session_id = request.SessionId,
            answer = new { type = request.Answer.Type, sdp = request.Answer.Sdp }
        };

        var response = await client.PostAsJsonAsync($"agents/{agentId}/streams/{request.StreamId}/sdp", payload, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, responseText);
    }

    [HttpPost("avatar-stream/ice")]
    public async Task<IActionResult> AddAvatarStreamIceCandidate([FromBody] AvatarStreamIceRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.StreamId))
            return BadRequest("streamId is required.");

        var dIdApiKey = _configuration["DId:ApiKey"] ?? _configuration["DID_API_KEY"];
        var agentId = _configuration["DId:AgentId"] ?? _configuration["DID_AGENT_ID"];
        if (string.IsNullOrWhiteSpace(dIdApiKey) || string.IsNullOrWhiteSpace(agentId))
            return BadRequest("D-ID stream is not configured. Missing DId:ApiKey or DId:AgentId.");

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.d-id.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(dIdApiKey)));

        object payload = string.IsNullOrWhiteSpace(request.Candidate)
            ? new { session_id = request.SessionId }
            : new
            {
                session_id = request.SessionId,
                candidate = request.Candidate,
                sdpMid = request.SdpMid,
                sdpMLineIndex = request.SdpMLineIndex
            };

        var response = await client.PostAsJsonAsync($"agents/{agentId}/streams/{request.StreamId}/ice", payload, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, responseText);
    }

    [HttpPost("avatar-stream/speak")]
    public async Task<IActionResult> SpeakAvatarStream([FromBody] AvatarStreamSpeakRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.StreamId) || string.IsNullOrWhiteSpace(request.Text))
            return BadRequest("streamId and text are required.");

        var dIdApiKey = _configuration["DId:ApiKey"] ?? _configuration["DID_API_KEY"];
        var agentId = _configuration["DId:AgentId"] ?? _configuration["DID_AGENT_ID"];
        if (string.IsNullOrWhiteSpace(dIdApiKey) || string.IsNullOrWhiteSpace(agentId))
            return BadRequest("D-ID stream is not configured. Missing DId:ApiKey or DId:AgentId.");

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.d-id.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(dIdApiKey)));

        var payload = new
        {
            session_id = request.SessionId,
            script = new
            {
                type = "text",
                input = request.Text,
                provider = new
                {
                    type = "microsoft",
                    voice_id = "vi-VN-HoaiMyNeural"
                }
            }
        };

        var response = await client.PostAsJsonAsync($"agents/{agentId}/streams/{request.StreamId}", payload, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, responseText);
    }

    [HttpDelete("avatar-stream/{streamId}")]
    public async Task<IActionResult> DeleteAvatarStream(string streamId, [FromQuery] string? sessionId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(streamId))
            return BadRequest("streamId is required.");

        var dIdApiKey = _configuration["DId:ApiKey"] ?? _configuration["DID_API_KEY"];
        var agentId = _configuration["DId:AgentId"] ?? _configuration["DID_AGENT_ID"];
        if (string.IsNullOrWhiteSpace(dIdApiKey) || string.IsNullOrWhiteSpace(agentId))
            return BadRequest("D-ID stream is not configured. Missing DId:ApiKey or DId:AgentId.");

        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://api.d-id.com/");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(dIdApiKey)));

        var requestMessage = new HttpRequestMessage(HttpMethod.Delete, $"agents/{agentId}/streams/{streamId}")
        {
            Content = JsonContent.Create(new { session_id = sessionId })
        };

        var response = await client.SendAsync(requestMessage, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
        return StatusCode((int)response.StatusCode, responseText);
    }

    private static async Task<string> ExtractCvTextAsync(IFormFile file, string ext, CancellationToken cancellationToken)
    {
        if (ext is ".txt" or ".md")
        {
            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream, Encoding.UTF8, true);
            return await reader.ReadToEndAsync(cancellationToken);
        }

        if (ext == ".pdf")
        {
            await using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);
            ms.Position = 0;
            using var doc = PdfDocument.Open(ms);
            var sb = new StringBuilder();
            foreach (var page in doc.GetPages())
            {
                var text = page.Text;
                if (!string.IsNullOrWhiteSpace(text))
                {
                    sb.AppendLine(text);
                    sb.AppendLine();
                }
                else if (page.Letters.Count > 0)
                {
                    // Fallback for PDFs where page.Text is empty but letters are still present.
                    var lettersText = string.Concat(page.Letters.Select(l => l.Value));
                    if (!string.IsNullOrWhiteSpace(lettersText))
                    {
                        sb.AppendLine(lettersText);
                        sb.AppendLine();
                    }
                }
            }
            return sb.ToString();
        }

        return string.Empty;
    }
}

// DTOs for API contract (Presentation layer)
public record StartInterviewRequest(string JobRole);
public record StartInterviewResponse(Guid SessionId);

public record QuestionItemDto(string Question, string Description);

public record SubmitAnswerRequest(Guid SessionId, string QuestionText, string? Transcript);
public record EndInterviewRequest(Guid SessionId);
public record FollowUpRequest(
    Guid SessionId,
    string? CurrentQuestion,
    string? CurrentQuestionDescription,
    string? CandidateText,
    string? SectionTranscript,
    int? TurnIndex,
    string? Mode);
public record FollowUpResponse(string Reply, Guid LearningEventId, bool CriticPass);
public record LearningFeedbackRequest(Guid LearningEventId, int UserRating, string? UserFeedback);
public record CvReviewResponse(
    int OverallScore,
    string Summary,
    IReadOnlyList<string> Strengths,
    IReadOnlyList<string> Gaps,
    IReadOnlyList<string> Recommendations);

public record EvaluateAnswerRequest(Guid SessionId, string QuestionText, string? Transcript);
public record EvaluateAnswerResponse(int Score, string Feedback);
public record AvatarSpeakRequest(string Text);
public record AvatarSpeakResponse(string VideoUrl, string TalkId, string Status);
public record AvatarStreamInitRequest(bool? StreamWarmup, bool? Fluent, string? CompatibilityMode);
public record AvatarStreamJsepAnswer(string Type, string Sdp);
public record AvatarStreamSdpRequest(string StreamId, string? SessionId, AvatarStreamJsepAnswer Answer);
public record AvatarStreamIceRequest(string StreamId, string? SessionId, string? Candidate, string? SdpMid, int? SdpMLineIndex);
public record AvatarStreamSpeakRequest(string StreamId, string? SessionId, string Text);

public class DIdTalkResponse
{
    public string? id { get; set; }
    public string? status { get; set; }
    public string? result_url { get; set; }
}

public class CvReviewRequest
{
    public IFormFile? CvFile { get; set; }
    public string? TargetRole { get; set; }
    public string? CompanyContext { get; set; }
}
