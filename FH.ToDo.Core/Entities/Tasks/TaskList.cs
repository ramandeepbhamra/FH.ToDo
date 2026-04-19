using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FH.ToDo.Core.Entities.Base;
using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Core.Shared.Constants;

namespace FH.ToDo.Core.Entities.Tasks;

[Table("TaskLists")]
public class TaskList : BaseEntity<Guid>
{
    [Required]
    [MinLength(ValidationConstants.TaskListTitle.MinLength)]
    [MaxLength(ValidationConstants.TaskListTitle.MaxLength)]
    public string Title { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public int Order { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
}
