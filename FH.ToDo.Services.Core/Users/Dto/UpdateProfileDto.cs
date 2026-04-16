using System.ComponentModel.DataAnnotations;

namespace FH.ToDo.Services.Core.Users.Dto;

/// <summary>
/// DTO for updating the current user's own profile (FirstName, LastName, Phone only)
/// </summary>
public class UpdateProfileDto
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string LastName { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Invalid phone number format")]
    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? PhoneNumber { get; set; }
}
