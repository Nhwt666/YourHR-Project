using AIInterview.Application.Interfaces;
using AIInterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIInterview.Infrastructure.Persistence;

public class InterviewRepository : IInterviewRepository
{
    private readonly AppDbContext _db;

    public InterviewRepository(AppDbContext db) => _db = db;

    public async Task<InterviewSession> CreateSessionAsync(Guid userId, string jobRole, CancellationToken cancellationToken = default)
    {
        var session = new InterviewSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            JobRole = jobRole,
            CreatedAt = DateTime.UtcNow
        };
        _db.InterviewSessions.Add(session);
        await _db.SaveChangesAsync(cancellationToken);
        return session;
    }

    public Task<InterviewSession?> GetSessionByIdAsync(Guid sessionId, CancellationToken cancellationToken = default)
        => _db.InterviewSessions.AsNoTracking().FirstOrDefaultAsync(s => s.Id == sessionId, cancellationToken);

    public async Task SaveQuestionsAsync(Guid sessionId, IReadOnlyList<QuestionWithDescription> questions, CancellationToken ct = default)
    {
        for (var i = 0; i < questions.Count; i++)
        {
            _db.InterviewQuestions.Add(new InterviewQuestion
            {
                Id = Guid.NewGuid(),
                SessionId = sessionId,
                OrderIndex = i,
                QuestionText = questions[i].Question,
                Description = questions[i].Description
            });
        }
        await _db.SaveChangesAsync(ct);
    }

    public async Task<QuestionWithDescription?> GetNextQuestionAsync(Guid sessionId, CancellationToken ct = default)
    {
        var answeredCount = await _db.InterviewAnswers.CountAsync(a => a.SessionId == sessionId, ct);
        var next = await _db.InterviewQuestions
            .AsNoTracking()
            .Where(q => q.SessionId == sessionId && q.OrderIndex == answeredCount)
            .Select(q => new QuestionWithDescription(q.QuestionText, q.Description))
            .FirstOrDefaultAsync(ct);
        return next;
    }

    public async Task SaveAnswerAsync(InterviewAnswer answer, CancellationToken cancellationToken = default)
    {
        _db.InterviewAnswers.Add(answer);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<(string Question, string Transcript)>> GetSessionAnswersAsync(Guid sessionId, CancellationToken ct = default)
    {
        var questions = await _db.InterviewQuestions.AsNoTracking().Where(q => q.SessionId == sessionId).OrderBy(q => q.OrderIndex).ToListAsync(ct);
        var answers = await _db.InterviewAnswers.AsNoTracking().Where(a => a.SessionId == sessionId).ToListAsync(ct);
        var result = new List<(string, string)>();
        foreach (var q in questions)
        {
            var a = answers.FirstOrDefault(x => x.QuestionText == q.QuestionText);
            if (a != null) result.Add((q.QuestionText, a.Transcript));
        }
        return result;
    }

    public async Task<Guid> SaveLearningEventAsync(InterviewLearningEvent learningEvent, CancellationToken cancellationToken = default)
    {
        _db.InterviewLearningEvents.Add(learningEvent);
        await _db.SaveChangesAsync(cancellationToken);
        return learningEvent.Id;
    }

    public async Task<bool> SaveLearningFeedbackAsync(
        Guid learningEventId,
        int? userRating,
        string? userFeedback,
        CancellationToken cancellationToken = default)
    {
        var ev = await _db.InterviewLearningEvents.FirstOrDefaultAsync(x => x.Id == learningEventId, cancellationToken);
        if (ev == null) return false;
        ev.UserRating = userRating;
        ev.UserFeedback = userFeedback ?? string.Empty;
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
