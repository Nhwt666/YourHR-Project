namespace AIInterview.Domain.Entities;

/// <summary>
/// Single Q&A within a session: question text, user transcript, score and feedback.
/// </summary>
public class InterviewAnswer
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string Transcript { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Feedback { get; set; } = string.Empty;
}
