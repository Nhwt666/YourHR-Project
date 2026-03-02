using AIInterview.Application.Interfaces;
using AIInterview.Domain.Entities;

namespace AIInterview.Application.UseCases;

/// <summary>
/// Evaluates one answer: calls AI for score/feedback, persists and returns result.
/// </summary>
public class EvaluateAnswerUseCase
{
    private readonly IInterviewRepository _repository;
    private readonly IAIService _aiService;

    public EvaluateAnswerUseCase(IInterviewRepository repository, IAIService aiService)
    {
        _repository = repository;
        _aiService = aiService;
    }

    public async Task<EvaluateAnswerResult> ExecuteAsync(Guid sessionId, string questionText, string transcript, CancellationToken cancellationToken = default)
    {
        var session = await _repository.GetSessionByIdAsync(sessionId, cancellationToken);
        if (session == null)
            throw new InvalidOperationException($"Session {sessionId} not found.");

        var evaluation = await _aiService.EvaluateAnswerAsync(questionText, transcript ?? string.Empty, cancellationToken);

        var answer = new InterviewAnswer
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            QuestionText = questionText,
            Transcript = transcript ?? string.Empty,
            Score = evaluation.Score,
            Feedback = evaluation.Feedback
        };
        await _repository.SaveAnswerAsync(answer, cancellationToken);

        return new EvaluateAnswerResult(answer.Score, answer.Feedback);
    }
}

public record EvaluateAnswerResult(int Score, string Feedback);
