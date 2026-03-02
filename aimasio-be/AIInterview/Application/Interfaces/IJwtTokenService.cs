using AIInterview.Domain.Entities;

namespace AIInterview.Application.Interfaces;

/// <summary>
/// Generates JWT for authenticated user. Implementation in Infrastructure.
/// </summary>
public interface IJwtTokenService
{
    string GenerateToken(User user);
}
