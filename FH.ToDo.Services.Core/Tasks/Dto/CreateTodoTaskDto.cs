using System.ComponentModel.DataAnnotations;

namespace FH.ToDo.Services.Core.Tasks.Dto;

public class CreateTodoTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(1, ErrorMessage = "Title cannot be empty")]
    [MaxLength(255, ErrorMessage = "Title cannot exceed 255 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "List is required")]
    public Guid ListId { get; set; }

    public DateOnly? DueDate { get; set; }
}
