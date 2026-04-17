using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Users;
using FH.ToDo.Services.Core.Users.Dto;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// User management controller — Admin only (POST is AllowAnonymous for self-registration)
/// </summary>
[Authorize(Roles = nameof(UserRole.Admin))]
public class UsersController : ApiControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get paginated list of users
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersInputDto input)
    {
        input.ExcludeUserId = CurrentUserId;
        var result = await _userService.GetUsersAsync(input);
        return Success(result);
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return Success(user);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost]
    [AllowAnonymous] // Allow registration without authentication
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto input)
    {
        var user = await _userService.CreateUserAsync(input);
        return Created(user, "User created successfully");
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto input)
    {
        var user = await _userService.UpdateUserAsync(id, input);
        return Success(user, "User updated successfully");
    }

    /// <summary>
    /// Delete a user (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        await _userService.DeleteUserAsync(id);
        return Success("User deleted successfully");
    }
}
