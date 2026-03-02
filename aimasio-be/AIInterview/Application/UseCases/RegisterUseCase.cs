using AIInterview.Application.Interfaces;
using AIInterview.Domain.Entities;

namespace AIInterview.Application.UseCases;

public class RegisterUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterUseCase(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterResult> ExecuteAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email?.Trim().ToLowerInvariant() ?? "";
        if (string.IsNullOrEmpty(normalizedEmail) || string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Email and password are required.");

        if (password.Length < 6)
            throw new ArgumentException("Password must be at least 6 characters.");

        var existing = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (existing != null)
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.Hash(password),
            CreatedAt = DateTime.UtcNow
        };
        await _userRepository.CreateAsync(user, cancellationToken);
        return new RegisterResult(user.Id, user.Email);
    }
}

public record RegisterResult(Guid UserId, string Email);
