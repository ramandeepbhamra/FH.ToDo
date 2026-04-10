using FH.ToDo.Services.Core.Base;
using FH.ToDo.Services.Core.Users.Dto;

namespace FH.ToDo.Services.Core.Users;

public interface IUserService : IApplicationService
{
    Task<List<UserListDto>> GetPeople(GetUserInput input);
}
