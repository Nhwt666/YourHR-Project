namespace AIInterview.Application.Interfaces;

/// <summary>
/// AI provider contract (e.g. Groq). Domain/Application only; implementation in Infrastructure.
/// </summary>
public interface IAIService
{
    /// <summary>
    /// Generates 3–5 interview questions with short descriptions for the given job role.
    /// </summary>
    Task<IReadOnlyList<QuestionWithDescription>> GenerateInterviewQuestionsAsync(string jobRole, CancellationToken cancellationToken = default);

    /// <summary>
    /// Evaluates candidate answer: returns score (1–10) and feedback text.
    /// </summary>
    Task<EvaluateResult> EvaluateAnswerAsync(string questionText, string transcript, CancellationToken cancellationToken = default);

    /// <summary>
    /// Evaluates entire interview: overall score and feedback. Used at end of session.
    /// </summary>
    Task<EvaluateResult> EvaluateSessionAsync(IReadOnlyList<(string Question, string Transcript)> qaPairs, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates a short interviewer follow-up when candidate asks back.
    /// </summary>
    Task<FollowUpGenerationResult> GenerateInterviewerFollowUpAsync(
        string jobRole,
        string currentQuestion,
        string currentQuestionDescription,
        string candidateText,
        string sectionTranscript,
        int turnIndex,
        string mode,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Reviews CV text and returns score with targeted recommendations.
    /// </summary>
    Task<CvReviewResult> EvaluateCvAsync(
        string cvText,
        string targetRole,
        string companyContext,
        CancellationToken cancellationToken = default);
}

public record EvaluateResult(int Score, string Feedback);

public record QuestionWithDescription(string Question, string Description);

public record FollowUpGenerationResult(
    string Reply,
    bool CriticPass,
    string CriticIssues,
    string CriticSuggestion,
    string PlannerJson,
    string CriticJson);

public record CvReviewResult(
    int OverallScore,
    string Summary,
    IReadOnlyList<string> Strengths,
    IReadOnlyList<string> Gaps,
    IReadOnlyList<string> Recommendations);
