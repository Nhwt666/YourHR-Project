using AIInterview.Application.Interfaces;

namespace AIInterview.Application.UseCases;

/// <summary>
/// Starts interview: creates session, generates random questions (stored, not returned). Like real interview.
/// </summary>
public class StartInterviewUseCase
{
    private readonly IInterviewRepository _repository;
    private readonly IAIService _aiService;

    public StartInterviewUseCase(IInterviewRepository repository, IAIService aiService)
    {
        _repository = repository;
        _aiService = aiService;
    }

    public async Task<StartInterviewResult> ExecuteAsync(Guid userId, string jobRole, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(jobRole))
            throw new ArgumentException("Job role is required.", nameof(jobRole));

        var session = await _repository.CreateSessionAsync(userId, jobRole.Trim(), cancellationToken);
        var questions = await _aiService.GenerateInterviewQuestionsAsync(session.JobRole, cancellationToken);
        await _repository.SaveQuestionsAsync(session.Id, questions, cancellationToken);

        return new StartInterviewResult(session.Id);
    }
}

public record StartInterviewResult(Guid SessionId);
