using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Services.Core.Users.Dto;
using Riok.Mapperly.Abstractions;

namespace FH.ToDo.Services.Mapping;

/// <summary>
/// Mapperly source generator for User entity mappings
/// Zero runtime overhead, compile-time safe mappings
/// </summary>
[Mapper]
public partial class UserMapper
{
    /// <summary>
    /// Maps User entity to UserListDto
    /// </summary>
    public partial UserListDto UserToUserListDto(User user);

    /// <summary>
    /// Maps collection of User entities to UserListDto collection
    /// </summary>
    public partial List<UserListDto> UsersToUserListDtos(List<User> users);
}
