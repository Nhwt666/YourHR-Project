using AIInterview.Domain.Entities;

namespace AIInterview.Application.Interfaces;

/// <summary>
/// Persistence contract for interview sessions and answers. Implementation in Infrastructure.
/// </summary>
public interface IInterviewRepository
{
    Task<InterviewSession> CreateSessionAsync(Guid userId, string jobRole, CancellationToken cancellationToken = default);
    Task<InterviewSession?> GetSessionByIdAsync(Guid sessionId, CancellationToken cancellationToken = default);
    Task SaveQuestionsAsync(Guid sessionId, IReadOnlyList<QuestionWithDescription> questions, CancellationToken ct = default);
    Task<QuestionWithDescription?> GetNextQuestionAsync(Guid sessionId, CancellationToken ct = default);
    Task SaveAnswerAsync(InterviewAnswer answer, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<(string Question, string Transcript)>> GetSessionAnswersAsync(Guid sessionId, CancellationToken ct = default);
    Task<Guid> SaveLearningEventAsync(InterviewLearningEvent learningEvent, CancellationToken cancellationToken = default);
    Task<bool> SaveLearningFeedbackAsync(Guid learningEventId, int? userRating, string? userFeedback, CancellationToken cancellationToken = default);
}
