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
    /// Maps User entity to UserListDto (simple list view)
    /// </summary>
    public partial UserListDto UserToUserListDto(User user);

    /// <summary>
    /// Maps collection of User entities to UserListDto collection
    /// </summary>
    public partial List<UserListDto> UsersToUserListDtos(List<User> users);

    /// <summary>
    /// Maps User entity to UserDto (full details)
    /// </summary>
    [MapProperty(nameof(User.FullName), nameof(UserDto.FullName))]
    public partial UserDto UserToUserDto(User user);

    /// <summary>
    /// Maps CreateUserDto to User entity
    /// Password will be hashed separately before calling this
    /// </summary>
    [MapProperty(nameof(CreateUserDto.Password), nameof(User.PasswordHash))]
    public partial User CreateUserDtoToUser(CreateUserDto dto);

    /// <summary>
    /// Maps UpdateUserDto to existing User entity (updates only provided fields)
    /// </summary>
    [MapperIgnoreTarget(nameof(User.Id))]
    [MapperIgnoreTarget(nameof(User.PasswordHash))]
    [MapperIgnoreTarget(nameof(User.CreatedDate))]
    [MapperIgnoreTarget(nameof(User.CreatedBy))]
    [MapperIgnoreTarget(nameof(User.IsDeleted))]
    [MapperIgnoreTarget(nameof(User.DeletedDate))]
    [MapperIgnoreTarget(nameof(User.DeletedBy))]
    public partial void UpdateUserDtoToUser(UpdateUserDto dto, User user);
}
