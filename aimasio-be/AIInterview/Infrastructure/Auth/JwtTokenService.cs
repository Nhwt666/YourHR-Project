using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIInterview.Application.Interfaces;
using AIInterview.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AIInterview.Infrastructure.Auth;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config) => _config = config;

    public string GenerateToken(User user)
    {
        var secret = _config["Jwt:Secret"] ?? _config["JWT_SECRET"] ?? throw new InvalidOperationException("Jwt:Secret not configured.");
        var issuer = _config["Jwt:Issuer"] ?? "AIInterview";
        var audience = _config["Jwt:Audience"] ?? "AIInterview";
        var expMinutes = int.TryParse(_config["Jwt:ExpirationMinutes"], out var m) ? m : 60;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("userId", user.Id.ToString())
        };
        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(expMinutes),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
