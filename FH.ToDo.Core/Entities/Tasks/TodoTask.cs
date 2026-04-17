using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FH.ToDo.Core.Entities.Base;
using FH.ToDo.Core.Entities.Users;

namespace FH.ToDo.Core.Entities.Tasks;

[Table("TodoTasks")]
public class TodoTask : BaseEntity<Guid>
{
    public const int MaxTitleLength = 255;

    [Required]
    [MinLength(1)]
    [MaxLength(MaxTitleLength)]
    public string Title { get; set; } = string.Empty;

    public Guid ListId { get; set; }

    public Guid UserId { get; set; }

    public bool IsCompleted { get; set; }

    /// <summary>UTC timestamp of when the task was completed</summary>
    public DateTime? CompletedDate { get; set; }

    public bool IsFavourite { get; set; }

    /// <summary>Date only — no time component. Stored as date in SQL Server.</summary>
    public DateOnly? DueDate { get; set; }

    public int Order { get; set; }

    public virtual TaskList List { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual ICollection<SubTask> SubTasks { get; set; } = new List<SubTask>();
}
