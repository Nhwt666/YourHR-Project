using AIInterview.Application.Interfaces;

namespace AIInterview.Application.UseCases;

public class GetNextQuestionUseCase
{
    private readonly IInterviewRepository _repository;

    public GetNextQuestionUseCase(IInterviewRepository repository) => _repository = repository;

    public async Task<QuestionWithDescription?> ExecuteAsync(Guid sessionId, CancellationToken ct = default)
    {
        var session = await _repository.GetSessionByIdAsync(sessionId, ct);
        if (session == null) return null;
        return await _repository.GetNextQuestionAsync(sessionId, ct);
    }
}
