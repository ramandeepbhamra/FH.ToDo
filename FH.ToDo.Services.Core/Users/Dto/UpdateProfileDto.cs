using System.ComponentModel.DataAnnotations;

namespace FH.ToDo.Services.Core.Users.Dto;

/// <summary>
/// DTO for updating the current user's own profile (FirstName, LastName, Phone only).
/// This DTO is used by the ProfileController to restrict editable fields.
/// For full user updates (email, role, password), use UpdateUserDto via UsersController.
/// </summary>
public class UpdateProfileDto
{
    /// <summary>
    /// Gets or sets the user's first name.
    /// </summary>
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's last name.
    /// </summary>
    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's phone number (optional).
    /// </summary>
    [Phone(ErrorMessage = "Invalid phone number format")]
    [MaxLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? PhoneNumber { get; set; }
}
