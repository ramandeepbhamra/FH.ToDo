using FH.ToDo.Services.Core.Common.Dto;

namespace FH.ToDo.Services.Core.Users.Dto;

/// <summary>
/// Input parameters for getting users list
/// </summary>
public class GetUsersInputDto : PagedAndSortedRequestDto
{
    /// <summary>
    /// Filter by active status
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Filter by email (partial match)
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Filter by name (FirstName or LastName partial match)
    /// </summary>
    public string? Name { get; set; }
}
