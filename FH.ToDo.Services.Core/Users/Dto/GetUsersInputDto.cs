using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Common.Dto;

namespace FH.ToDo.Services.Core.Users.Dto;

/// <summary>
/// Input parameters for getting users list
/// </summary>
public class GetUsersInputDto : PagedAndSortedRequestDto
{
    public bool? IsActive { get; set; }
    public bool? IsSystemUser { get; set; }
    public string? Email { get; set; }
    public string? Name { get; set; }
    public UserRole? Role { get; set; }
    public Guid? ExcludeUserId { get; set; }
}
