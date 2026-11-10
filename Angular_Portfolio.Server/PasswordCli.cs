using Angular_Portfolio.Server.Security;

namespace Angular_Portfolio.Server;

/// <summary>
/// Small command-line helper for generating BCrypt hashes to paste into SQL.
///
///   dotnet run -- hash-password "YourNewPassword"
///
/// Then:
///   INSERT INTO users (Email, DisplayName, PasswordHash, Role, IsActive, CreatedUtc)
///   VALUES ('you@example.com', 'Your Name', '<paste hash>', 'Admin', 1, UTC_TIMESTAMP(6));
/// </summary>
public static class PasswordCli
{
    public static bool TryRun(string[] args)
    {
        if (args.Length < 2 || !string.Equals(args[0], "hash-password", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var password = args[1];

        if (password.Length < 8)
        {
            Console.Error.WriteLine("Password must be at least 8 characters.");
            return true;
        }

        var hasher = new BCryptPasswordHasher();
        var hash = hasher.Hash(password);

        Console.WriteLine(hash);

        // Prove the hash we just printed actually verifies.
        Console.Error.WriteLine(hasher.Verify(password, hash)
            ? "(verified OK)"
            : "(WARNING: hash did not verify)");

        return true;
    }
}