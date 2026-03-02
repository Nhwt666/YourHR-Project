namespace AIInterview.Domain.Entities;

/// <summary>
/// Interview session - represents one mock interview run (job role + questions).
/// </summary>
public class InterviewSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string JobRole { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
