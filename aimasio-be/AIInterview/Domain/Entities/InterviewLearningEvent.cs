namespace AIInterview.Domain.Entities;

/// <summary>
/// Stores follow-up generation quality signals for later prompt/model tuning.
/// </summary>
public class InterviewLearningEvent
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public DateTime CreatedAt { get; set; }

    public int TurnIndex { get; set; }
    public string Mode { get; set; } = string.Empty;

    public string CurrentQuestion { get; set; } = string.Empty;
    public string CurrentQuestionDescription { get; set; } = string.Empty;
    public string CandidateText { get; set; } = string.Empty;
    public string SectionTranscript { get; set; } = string.Empty;
    public string AiReply { get; set; } = string.Empty;

    public bool CriticPass { get; set; }
    public string CriticIssues { get; set; } = string.Empty;
    public string CriticSuggestion { get; set; } = string.Empty;
    public string PlannerJson { get; set; } = string.Empty;
    public string CriticJson { get; set; } = string.Empty;

    public int? UserRating { get; set; }
    public string UserFeedback { get; set; } = string.Empty;
}
