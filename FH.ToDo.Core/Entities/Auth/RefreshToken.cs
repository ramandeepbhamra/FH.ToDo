using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FH.ToDo.Core.Entities.Base;
using FH.ToDo.Core.Entities.Users;

namespace FH.ToDo.Core.Entities.Auth;

[Table("RefreshTokens")]
public class RefreshToken : IEntity<Guid>
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [Required]
    [MaxLength(256)]
    public string Token { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime? RevokedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
