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

    private static readonly (string First, string Last, string Email, UserRole Role, bool IsSystemUser)[] Seeds =
    [
        // BASIC (10)
        (First: "Arnold",    Last: "Schwarzenegger", Email: "fh.basic1@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: true),
        (First: "Jim",       Last: "Carrey",         Email: "fh.basic2@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: true),
        (First: "Will",      Last: "Smith",          Email: "fh.basic3@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Leonardo",  Last: "DiCaprio",       Email: "fh.basic4@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Morgan",    Last: "Freeman",        Email: "fh.basic5@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Denzel",    Last: "Washington",     Email: "fh.basic6@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Chris",     Last: "Pratt",          Email: "fh.basic7@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Matt",      Last: "Damon",          Email: "fh.basic8@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Hugh",      Last: "Jackman",        Email: "fh.basic9@yopmail.com",   Role: UserRole.Basic,   IsSystemUser: false),
        (First: "Ryan",      Last: "Reynolds",       Email: "fh.basic10@yopmail.com",  Role: UserRole.Basic,   IsSystemUser: false),

        // PREMIUM (10)
        (First: "Brad",      Last: "Pitt",           Email: "fh.premium1@yopmail.com", Role: UserRole.Premium, IsSystemUser: true),
        (First: "Angelina",  Last: "Jolie",          Email: "fh.premium2@yopmail.com", Role: UserRole.Premium, IsSystemUser: true),
        (First: "Johnny",    Last: "Depp",           Email: "fh.premium3@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Tom",       Last: "Cruise",         Email: "fh.premium4@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Robert",    Last: "DeNiro",         Email: "fh.premium5@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Al",        Last: "Pacino",         Email: "fh.premium6@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Christian", Last: "Bale",           Email: "fh.premium7@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Henry",     Last: "Cavill",         Email: "fh.premium8@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Chris",     Last: "Hemsworth",      Email: "fh.premium9@yopmail.com", Role: UserRole.Premium, IsSystemUser: false),
        (First: "Mark",      Last: "Wahlberg",       Email: "fh.premium10@yopmail.com",Role: UserRole.Premium, IsSystemUser: false),

        // ADMIN (10)
        (First: "Robert",    Last: "Downey",         Email: "fh.admin1@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: true),
        (First: "Scarlett",  Last: "Johansson",      Email: "fh.admin2@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: true),
        (First: "Natalie",   Last: "Portman",        Email: "fh.admin3@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Emma",      Last: "Stone",          Email: "fh.admin4@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Jennifer",  Last: "Lawrence",       Email: "fh.admin5@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Anne",      Last: "Hathaway",       Email: "fh.admin6@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Gal",       Last: "Gadot",          Email: "fh.admin7@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Margot",    Last: "Robbie",         Email: "fh.admin8@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Zendaya",   Last: "Coleman",        Email: "fh.admin9@yopmail.com",   Role: UserRole.Admin,   IsSystemUser: false),
        (First: "Charlize",  Last: "Theron",         Email: "fh.admin10@yopmail.com",  Role: UserRole.Admin,   IsSystemUser: false),

        // DEV (10)
        (First: "Keanu",     Last: "Reeves",         Email: "fh.dev1@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: true),
        (First: "Tom",       Last: "Hanks",          Email: "fh.dev2@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: true),
        (First: "Benedict",  Last: "Cumberbatch",    Email: "fh.dev3@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Andrew",    Last: "Garfield",       Email: "fh.dev4@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Tobey",     Last: "Maguire",        Email: "fh.dev5@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Daniel",    Last: "Radcliffe",      Email: "fh.dev6@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Elijah",    Last: "Wood",           Email: "fh.dev7@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Orlando",   Last: "Bloom",          Email: "fh.dev8@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Chris",     Last: "Evans",          Email: "fh.dev9@yopmail.com",     Role: UserRole.Dev,     IsSystemUser: false),
        (First: "Sebastian", Last: "Stan",           Email: "fh.dev10@yopmail.com",    Role: UserRole.Dev,     IsSystemUser: false),
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
                IsSystemUser = seed.IsSystemUser,
            }, cancellationToken);
        }
    }
}
