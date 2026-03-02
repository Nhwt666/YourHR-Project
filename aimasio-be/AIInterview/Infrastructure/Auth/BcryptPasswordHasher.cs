using AIInterview.Application.Interfaces;

namespace AIInterview.Infrastructure.Auth;

public class BcryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(10));

    public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
