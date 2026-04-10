using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Core.Extensions;
using FH.ToDo.Core.Repositories;
using FH.ToDo.Services.Core.Users;
using FH.ToDo.Services.Core.Users.Dto;
using FH.ToDo.Services.Mapping;
using Microsoft.EntityFrameworkCore;

namespace FH.ToDo.Services.Users;

/// <summary>
/// User service implementation with business logic
/// Uses generic repository with private query builder methods for complex queries
/// All business logic (filtering, sorting, searching) is handled in the service layer
/// </summary>
public class UserServices : IUserService
{
    private readonly IRepository<User, Guid> _userRepository;
    private readonly UserMapper _mapper;

    public UserServices(IRepository<User, Guid> userRepository, UserMapper mapper)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    /// <summary>
    /// Get list of users with filtering
    /// Public API method - delegates complex query logic to private query builder
    /// </summary>
    public async Task<List<UserListDto>> GetPeople(GetUserInput input)
    {
        // Build query using private query builder method
        var query = GetUsersFilteredQuery(input);

        // Apply business logic: ordering
        query = query
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName);

        // Execute query and get results
        var users = await query.ToListAsync();

        // Map entities to DTOs (never expose entities outside service layer)
        return _mapper.UsersToUserListDtos(users);
    }

    /// <summary>
    /// Private query builder: Constructs filtered query for users
    /// Returns IQueryable (not executed) - allows caller to add additional operations
    /// Centralizes all user filtering business logic in one reusable method
    /// </summary>
    private IQueryable<User> GetUsersFilteredQuery(GetUserInput? input)
    {
        var query = _userRepository.GetAll();

        // Data access pattern: Soft-delete filter (always exclude deleted)
        query = query.Where(u => !u.IsDeleted);

        // Business logic: Active users only by default
        query = query.Where(u => u.IsActive);

        // Conditional search filter using WhereIf extension
        query = query.WhereIf(
            input?.Filter.HasValue() ?? false,
            u => u.Email.ToLower().Contains(input!.Filter!.Trim().ToLower()) ||
                 u.FirstName.ToLower().Contains(input.Filter.Trim().ToLower()) ||
                 u.LastName.ToLower().Contains(input.Filter.Trim().ToLower()));

        return query;
    }

    // Example: Additional query builders can be added for different scenarios
    // Uncomment and customize as needed
    /*
    private IQueryable<User> GetActiveUsersWithRolesQuery()
    {
        return _userRepository
            .GetAllIncluding(u => u.Roles)  // Eager load roles to avoid N+1
            .Where(u => !u.IsDeleted && u.IsActive);
    }

    private IQueryable<User> GetPremiumUsersQuery()
    {
        return _userRepository.GetAll()
            .Where(u => !u.IsDeleted && u.IsActive && u.IsPremium);
    }
    */
}
