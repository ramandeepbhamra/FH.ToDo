using System.ComponentModel.DataAnnotations;

namespace FH.ToDo.Services.Core.Tasks.Dto;

public class CreateSubTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(1, ErrorMessage = "Title cannot be empty")]
    [MaxLength(255, ErrorMessage = "Title cannot exceed 255 characters")]
    public string Title { get; set; } = string.Empty;
}
