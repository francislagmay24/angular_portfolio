using Angular_Portfolio.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Angular_Portfolio.Server.Data;

/// <summary>
/// EF Core context over the `angular_portfolio` MySQL schema.
///
/// The tables are created by Database/schema.sql rather than by EF migrations —
/// the schema script is what you run in MySQL Workbench. EF is mapped onto it
/// explicitly below so the two cannot drift silently.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Email).HasMaxLength(256).IsRequired();
            entity.Property(u => u.DisplayName).HasMaxLength(128).IsRequired();
            entity.Property(u => u.PasswordHash).HasMaxLength(512).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(64).IsRequired();
            entity.Property(u => u.IsActive).IsRequired();
            entity.Property(u => u.CreatedUtc).IsRequired();

            // Emails are stored lower-cased; this unique index makes login lookup cheap.
            entity.HasIndex(u => u.Email).IsUnique().HasDatabaseName("IX_users_Email");
        });

        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.ToTable("contact_messages");
            entity.HasKey(m => m.Id);

            entity.Property(m => m.Name).HasMaxLength(120).IsRequired();
            entity.Property(m => m.Email).HasMaxLength(256).IsRequired();
            entity.Property(m => m.Company).HasMaxLength(160);
            entity.Property(m => m.Message).HasMaxLength(4000).IsRequired();
            entity.Property(m => m.CreatedUtc).IsRequired();
            entity.Property(m => m.IsHandled).IsRequired();
            entity.Property(m => m.IpAddress).HasMaxLength(45);

            entity.HasIndex(m => new { m.IsHandled, m.CreatedUtc })
                .HasDatabaseName("IX_contact_messages_IsHandled_CreatedUtc");
        });
    }
}
