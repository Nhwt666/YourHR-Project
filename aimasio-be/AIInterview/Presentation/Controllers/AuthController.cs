using AIInterview.Application.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace AIInterview.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RegisterUseCase _register;
    private readonly LoginUseCase _login;

    public AuthController(RegisterUseCase register, LoginUseCase login)
    {
        _register = register;
        _login = login;
    }

    /// <summary>
    /// Register with email and password. Required before using interview features.
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _register.ExecuteAsync(request.Email, request.Password, cancellationToken);
            return Ok(new AuthResponse { UserId = result.UserId, Email = result.Email, Message = "Registered successfully. Use login to get a token." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
        {
            return Conflict(ex.Message);
        }
    }

    /// <summary>
    /// Login with email and password. Returns JWT to use in Authorization header for interview APIs.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await _login.ExecuteAsync(request.Email, request.Password, cancellationToken);
        if (result == null)
            return Unauthorized("Invalid email or password.");
        return Ok(new LoginResponse { Token = result.Token, UserId = result.UserId, Email = result.Email });
    }
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);

public class AuthResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = "";
    public string Message { get; set; } = "";
}

public class LoginResponse
{
    public string Token { get; set; } = "";
    public Guid UserId { get; set; }
    public string Email { get; set; } = "";
}
