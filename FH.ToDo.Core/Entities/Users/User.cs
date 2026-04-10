using FH.ToDo.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FH.ToDo.Core.Entities.Users;

[Table("Users")]
public class User : BaseEntity<Guid>
{
    public const int MaxNameLength = 100;
    public const int MaxPhoneNumberLength = 20;
    public const int MaxEmailAddressLength = 256;
    public const int MaxPasswordHashLength = 256;

    [Required]
    [MaxLength(MaxEmailAddressLength)]
    [EmailAddress]
    public virtual string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxPasswordHashLength)]
    public virtual string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxNameLength)]
    public virtual string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxNameLength)]
    public virtual string LastName { get; set; } = string.Empty;

    [MaxLength(MaxPhoneNumberLength)]
    [Phone]
    public virtual string? PhoneNumber { get; set; }

    public virtual bool IsActive { get; set; } = true;

    /// <summary>
    /// Gets the user's full name
    /// </summary>
    [NotMapped]
    public virtual string FullName => $"{FirstName} {LastName}".Trim();
}
