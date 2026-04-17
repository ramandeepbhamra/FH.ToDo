using System.ComponentModel.DataAnnotations;

namespace FH.ToDo.Services.Core.Tasks.Dto;

public class UpdateTaskListDto
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(1, ErrorMessage = "Title cannot be empty")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty;
}
