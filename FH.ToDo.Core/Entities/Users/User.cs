using FH.ToDo.Core.Entities.Base;
using FH.ToDo.Core.Shared.Enums;
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
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxPasswordHashLength)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxNameLength)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxNameLength)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(MaxPhoneNumberLength)]
    [Phone]
    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public UserRole Role { get; set; } = UserRole.BasicUser;

    /// <summary>
    /// Gets the user's full name
    /// </summary>
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}".Trim();
}
