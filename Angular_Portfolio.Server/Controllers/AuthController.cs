using System.Security.Claims;
using Angular_Portfolio.Server.Contracts;
using Angular_Portfolio.Server.Data;
using Angular_Portfolio.Server.Models;
using Angular_Portfolio.Server.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Angular_Portfolio.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    AppDbContext db,
    IPasswordHasher passwordHasher,
    ITokenService tokenService,
    ILogger<AuthController> logger) : ControllerBase
{
    /// <summary>
    /// Exchanges email + password for a JWT.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        // Normalise: emails are stored lower-cased so the unique index is usable.
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        // Deliberately identical response for "no such user", "wrong password"
        // and "account disabled". Distinguishing them would let an attacker
        // enumerate which email addresses have accounts.
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            logger.LogWarning("Failed login attempt for {Email}", email);
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (!user.IsActive)
        {
            logger.LogWarning("Login attempt on disabled account {Email}", email);
            return Unauthorized(new { message = "Invalid email or password." });
        }

        user.LastLoginUtc = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        var token = tokenService.CreateToken(user, out var expiresUtc);
        logger.LogInformation("User {UserId} logged in", user.Id);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresUtc = expiresUtc,
            User = ToDto(user),
        });
    }

    /// <summary>
    /// Returns the current user. The client calls this on startup to decide
    /// whether a stored token is still good.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me(CancellationToken cancellationToken)
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null || !user.IsActive)
        {
            return Unauthorized();
        }

        return Ok(ToDto(user));
    }

    private static UserDto ToDto(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        DisplayName = user.DisplayName,
        Role = user.Role,
    };
}
