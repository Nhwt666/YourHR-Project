namespace AIInterview.Domain.Entities;

/// <summary>
/// Stored question for a session. Generated at start, revealed one by one.
/// </summary>
public class InterviewQuestion
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public int OrderIndex { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
