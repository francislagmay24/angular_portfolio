using BCrypt.Net;

namespace Angular_Portfolio.Server.Security;

/// <summary>
/// Password hashing built on BCrypt (work factor 12).
///
/// BCrypt embeds a random per-password salt and the cost factor in the hash
/// itself, so there is nothing extra to store alongside it. Hashing is
/// deliberately slow (~250ms at factor 12), which is what makes offline
/// brute-forcing of a stolen database expensive.
/// </summary>
public interface IPasswordHasher
{
    string Hash(string password);

    bool Verify(string password, string hash);
}

public class BCryptPasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12;

    public string Hash(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public bool Verify(string password, string hash)
    {
        if (string.IsNullOrEmpty(hash))
        {
            return false;
        }

        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (SaltParseException)
        {
            // Stored hash is malformed (hand-edited row, truncated column).
            // Treat as a failed login rather than a 500.
            return false;
        }
    }
}
