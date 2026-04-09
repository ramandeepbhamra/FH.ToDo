namespace FH.ToDo.Core.EF.Entities.Base;

/// <summary>
/// Base entity class with GUID primary key and audit fields
/// </summary>
public abstract class BaseEntity : IEntity<Guid>, IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string? ModifiedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedDate { get; set; }
    public string? DeletedBy { get; set; }
}
