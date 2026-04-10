using FH.ToDo.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FH.ToDo.Core.Entities.Users;

[Table("Users")]
public class User : BaseEntity
{
    public const int MaxNameLength = 100;
    public const int MaxPhoneNumberLength = 20;
    public const int MaxEmailAddressLength = 256;

    [Required]
    [MaxLength(MaxEmailAddressLength)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

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
}
