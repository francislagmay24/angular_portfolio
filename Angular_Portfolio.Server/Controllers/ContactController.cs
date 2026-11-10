using Angular_Portfolio.Server.Contracts;
using Angular_Portfolio.Server.Data;
using Angular_Portfolio.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Angular_Portfolio.Server.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController(
    AppDbContext db,
    ILogger<ContactController> logger) : ControllerBase
{
    /// <summary>
    /// Stores a portfolio contact-form submission.
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Submit(
        ContactRequest request,
        CancellationToken cancellationToken)
    {
        // Honeypot: the "Website" field is visually hidden, so only a bot fills it.
        // Answer exactly as we do for a genuine submission so the bot cannot tell
        // it was detected, but store nothing.
        if (!string.IsNullOrWhiteSpace(request.Website))
        {
            logger.LogInformation("Contact form honeypot triggered; submission discarded");
            return Accepted(new { message = "Thanks — your message has been received." });
        }

        var message = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Company = string.IsNullOrWhiteSpace(request.Company) ? null : request.Company.Trim(),
            Message = request.Message.Trim(),
            CreatedUtc = DateTime.UtcNow,
            IsHandled = false,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
        };

        db.ContactMessages.Add(message);
        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Contact message {Id} stored from {Email}", message.Id, message.Email);

        return Accepted(new { message = "Thanks — your message has been received." });
    }

    /// <summary>
    /// Lists contact messages for the signed-in owner.
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var messages = await db.ContactMessages
            .AsNoTracking()
            .OrderByDescending(m => m.CreatedUtc)
            .Select(m => new
            {
                m.Id,
                m.Name,
                m.Email,
                m.Company,
                m.Message,
                m.CreatedUtc,
                m.IsHandled,
            })
            .ToListAsync(cancellationToken);

        return Ok(messages);
    }
}
