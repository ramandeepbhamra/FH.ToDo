using BCrypt.Net;
using FH.ToDo.Core.Entities.Users;using FH.ToDo.Core.Repositories;
using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Seeding;
using Microsoft.EntityFrameworkCore;

namespace FH.ToDo.Services.Seeding;

/// <summary>
/// Seeds initial users for every role on application startup.
/// Idempotent — skips any user whose email already exists in the database.
/// </summary>
public class DataSeeder : IDataSeeder
{
    private const string DefaultPassword = "123qwe";

    private static readonly (string First, string Last, string Email, UserRole Role)[] Seeds =
    [
        (First: "Arnold",   Last: "Schwarzenegger", Email: "fh.basic1@yopmail.com",   Role: UserRole.Basic),
        (First: "Jim",      Last: "Carrey",         Email: "fh.basic2@yopmail.com",   Role: UserRole.Basic),

        (First: "Brad",     Last: "Pitt",           Email: "fh.premium1@yopmail.com", Role: UserRole.Premium),
        (First: "Angelina", Last: "Jolie",          Email: "fh.premium2@yopmail.com", Role: UserRole.Premium),

        (First: "Robert",   Last: "Downey",         Email: "fh.admin1@yopmail.com",   Role: UserRole.Admin),
        (First: "Scarlett", Last: "Johansson",      Email: "fh.admin2@yopmail.com",   Role: UserRole.Admin),

        (First: "Keanu",    Last: "Reeves",         Email: "fh.dev1@yopmail.com",     Role: UserRole.Dev),
        (First: "Tom",      Last: "Hanks",          Email: "fh.dev2@yopmail.com",     Role: UserRole.Dev),
    ];

    private readonly IRepository<User, Guid> _userRepository;

    public DataSeeder(IRepository<User, Guid> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword, workFactor: 12);

        foreach (var seed in Seeds)
        {
            var exists = await _userRepository
                .GetAll()
                .AnyAsync(u => u.Email == seed.Email, cancellationToken);

            if (exists)
                continue;

            await _userRepository.InsertAsync(new User
            {
                Id           = Guid.NewGuid(),
                FirstName    = seed.First,
                LastName     = seed.Last,
                Email        = seed.Email,
                PasswordHash = passwordHash,
                Role         = seed.Role,
                IsActive     = true,
            }, cancellationToken);
        }
    }
}
