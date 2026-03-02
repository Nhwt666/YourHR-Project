using AIInterview.Application.Interfaces;

namespace AIInterview.Application.UseCases;

public class LoginUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IPasswordHasher _passwordHasher;

    public LoginUseCase(IUserRepository userRepository, IJwtTokenService jwtTokenService, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResult?> ExecuteAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email?.Trim().ToLowerInvariant() ?? "";
        if (string.IsNullOrEmpty(normalizedEmail) || string.IsNullOrEmpty(password))
            return null;

        var user = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (user == null || !_passwordHasher.Verify(password, user.PasswordHash))
            return null;

        var token = _jwtTokenService.GenerateToken(user);
        return new LoginResult(token, user.Id, user.Email);
    }
}

public record LoginResult(string Token, Guid UserId, string Email);
