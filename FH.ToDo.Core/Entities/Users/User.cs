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
    public virtual string Email { get; set; } = string.Empty;

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
}
