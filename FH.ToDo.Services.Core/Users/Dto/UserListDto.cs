using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FH.ToDo.Services.Core.Users.Dto
{
    public class UserListDto
    {
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
