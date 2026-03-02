using AIInterview.Application.Interfaces;

namespace AIInterview.Application.UseCases;

/// <summary>
/// Evaluates full interview and returns overall score + feedback.
/// </summary>
public class EndInterviewUseCase
{
    private readonly IInterviewRepository _repository;
    private readonly IAIService _aiService;

    public EndInterviewUseCase(IInterviewRepository repository, IAIService aiService)
    {
        _repository = repository;
        _aiService = aiService;
    }

    public async Task<EvaluateResult> ExecuteAsync(Guid sessionId, CancellationToken ct = default)
    {
        var session = await _repository.GetSessionByIdAsync(sessionId, ct);
        if (session == null) throw new InvalidOperationException($"Session {sessionId} not found.");

        var qaPairs = await _repository.GetSessionAnswersAsync(sessionId, ct);
        return await _aiService.EvaluateSessionAsync(qaPairs, ct);
    }
}
