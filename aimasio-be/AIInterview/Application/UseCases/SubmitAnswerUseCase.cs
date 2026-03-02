using AIInterview.Application.Interfaces;
using AIInterview.Domain.Entities;

namespace AIInterview.Application.UseCases;

/// <summary>
/// Saves answer without evaluation. Score at end of interview.
/// </summary>
public class SubmitAnswerUseCase
{
    private readonly IInterviewRepository _repository;

    public SubmitAnswerUseCase(IInterviewRepository repository) => _repository = repository;

    public async Task ExecuteAsync(Guid sessionId, string questionText, string transcript, CancellationToken ct = default)
    {
        var session = await _repository.GetSessionByIdAsync(sessionId, ct);
        if (session == null) throw new InvalidOperationException($"Session {sessionId} not found.");

        var answer = new InterviewAnswer
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            QuestionText = questionText,
            Transcript = transcript ?? string.Empty,
            Score = 0,
            Feedback = ""
        };
        await _repository.SaveAnswerAsync(answer, ct);
    }
}
