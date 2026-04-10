namespace FH.ToDo.Services.Core.Users.Dto;

/// <summary>
/// DTO for updating an existing user
/// </summary>
public class UpdateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public string? Password { get; set; } // Optional - only if changing password
}
