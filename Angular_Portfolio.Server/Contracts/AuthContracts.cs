using System.ComponentModel.DataAnnotations;

namespace Angular_Portfolio.Server.Contracts;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = string.Empty;
}

/// <summary>Returned on successful login. <see cref="Token"/> is the JWT.</summary>
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresUtc { get; set; }

    public UserDto User { get; set; } = new();
}

public class UserDto
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
}

public class ContactRequest
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(160)]
    public string? Company { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Honeypot. Hidden in the form, so a real person never fills it in.
    /// Any non-empty value means a bot, and the submission is silently dropped.
    /// </summary>
    public string? Website { get; set; }
}
