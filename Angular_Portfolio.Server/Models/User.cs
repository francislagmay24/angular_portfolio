namespace Angular_Portfolio.Server.Models;

/// <summary>
/// A login account. Mirrors the `users` table created by Database/schema.sql.
/// Keep this class and that script in step if you change either.
/// </summary>
public class User
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    /// <summary>BCrypt hash. Never store or log the plaintext password.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = Roles.User;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedUtc { get; set; }

    public DateTime? LastLoginUtc { get; set; }
}

public static class Roles
{
    public const string User = "User";
    public const string Admin = "Admin";
}
