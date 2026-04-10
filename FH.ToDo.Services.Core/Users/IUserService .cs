using FH.ToDo.Services.Core.Base;
using FH.ToDo.Services.Core.Users.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace FH.ToDo.Services.Core.Users
{
    public interface IUserService : IApplicationService

    {
        List<UserListDto> GetPeople(GetUserInput input);
    }
}
