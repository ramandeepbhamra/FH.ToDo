using FH.ToDo.Core.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FH.ToDo.Core.EF.Configurations;

/// <summary>
/// Entity configuration for User entity
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table name already defined via [Table("Users")] attribute
        // Annotations already handle Required, MaxLength validation

        // Primary Key
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .ValueGeneratedOnAdd();

        // Password Hash - Required
        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(User.MaxPasswordHashLength);

        // Audit Fields - SQL Defaults
        builder.Property(u => u.CreatedDate)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(u => u.IsActive)
            .HasDefaultValue(true);

        builder.Property(u => u.IsDeleted)
            .HasDefaultValue(false);

        // Database-Specific Constraints (Can't do with annotations!)

        // Indexes
        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_Users_Email");

        builder.HasIndex(u => u.IsDeleted)
            .HasDatabaseName("IX_Users_IsDeleted");

        builder.HasIndex(u => new { u.FirstName, u.LastName })
            .HasDatabaseName("IX_Users_FullName");

        // Query Filter for Soft Delete
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
