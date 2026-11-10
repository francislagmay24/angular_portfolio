namespace Angular_Portfolio.Server.Models;

/// <summary>
/// A message sent through the portfolio contact form.
/// Mirrors the `contact_messages` table in Database/schema.sql.
/// </summary>
public class ContactMessage
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Company { get; set; }

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedUtc { get; set; }

    public bool IsHandled { get; set; }

    public string? IpAddress { get; set; }
}
