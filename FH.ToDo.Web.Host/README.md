# FH.ToDo.Web.Host - ASP.NET Core Web API

## 📋 Overview
This is the **Presentation Layer** - an ASP.NET Core Web API that exposes HTTP endpoints for the FH.ToDo application. It serves as the entry point for client applications and orchestrates business logic using the domain and infrastructure layers.

---

## 🏗️ Architecture

### Clean Architecture Position
```
FH.ToDo.Web.Host (Presentation - YOU ARE HERE)
    ↓ references
FH.ToDo.Core (Domain)
FH.ToDo.Core.EF (Infrastructure)
FH.ToDo.Core.Shared (Shared)
```

### Project Structure
```
FH.ToDo.Web.Host/
├── Controllers/          # API endpoints (to be added)
├── DTOs/                # Data Transfer Objects (to be added)
├── Mapping/             # AutoMapper profiles (to be added)
├── appsettings.json     # Configuration
├── appsettings.Development.json
├── Program.cs           # Application entry point
└── README.md
```

---

## 🎯 Current Status

### ✅ Completed
- Project structure created
- References to Core and Core.EF configured
- Connection strings configured
- EF Core Design package added (for migrations support)

### 🚧 To Be Implemented
- [ ] Register DbContext in DI container
- [ ] Create controllers (Users, Tasks, etc.)
- [ ] Add DTOs and AutoMapper
- [ ] Add authentication/authorization
- [ ] Add Swagger documentation
- [ ] Add logging and error handling
- [ ] Add validation middleware

---

## ⚙️ Configuration

### Connection Strings

**Development** (`appsettings.Development.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YuvrajzAlien\\AGAMZMSSQLSERVER;Database=FHToDoDev;..."
  }
}
```

**Production** (`appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YuvrajzAlien\\AGAMZMSSQLSERVER;Database=FHToDo;..."
  }
}
```

---

## 📦 Dependencies

### NuGet Packages
- Microsoft.AspNetCore.OpenApi (10.0.5)
- Microsoft.EntityFrameworkCore.Design (10.0.5) - For migrations support

### Project References
- FH.ToDo.Core - Domain entities
- FH.ToDo.Core.EF - DbContext and EF infrastructure

---

## 🚀 Next Steps

### 1. Register DbContext

Add to `Program.cs`:
```csharp
using FH.ToDo.Core.EF.Context;
using Microsoft.EntityFrameworkCore;

builder.Services.AddDbContext<ToDoDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
            sqlOptions.CommandTimeout(60);
        });

    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});
```

### 2. Create a Sample Controller

```csharp
using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Core.EF.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FH.ToDo.Web.Host.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ToDoDbContext _context;

    public UsersController(ToDoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        return user;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        user.Id = Guid.NewGuid();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
}
```

### 3. Add Swagger/OpenAPI

Already configured via `Microsoft.AspNetCore.OpenApi` package.

Access at: `https://localhost:<port>/swagger`

---

## 🛡️ Best Practices to Implement

### 1. Use DTOs Instead of Entities
```csharp
public record CreateUserDto(
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber
);
```

### 2. Add AutoMapper
```csharp
CreateMap<CreateUserDto, User>();
CreateMap<User, UserDto>();
```

### 3. Add Validation
```csharp
public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
    }
}
```

### 4. Add Global Error Handling
```csharp
app.UseExceptionHandler("/error");
```

### 5. Add Logging
```csharp
_logger.LogInformation("User {UserId} created", user.Id);
```

---

## 🔒 Security Considerations

- [ ] Add authentication (JWT, Identity, etc.)
- [ ] Add authorization (role-based, claims-based)
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Secure connection strings (Key Vault)

---

## 🧪 Testing

### Manual Testing
1. Run the application: `dotnet run`
2. Navigate to: `https://localhost:<port>/swagger`
3. Test endpoints using Swagger UI

### Unit Testing (to be added)
```
FH.ToDo.Tests/
├── Controllers/
├── Services/
└── Validators/
```

---

## 📚 Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Web API Best Practices](https://docs.microsoft.com/aspnet/core/web-api)
- [Minimal APIs](https://docs.microsoft.com/aspnet/core/fundamentals/minimal-apis)

---

## ✅ Summary

This project provides:
- ✅ ASP.NET Core 10 Web API
- ✅ References to Core and Core.EF
- ✅ Connection strings configured
- ✅ Ready for controller implementation
- ✅ Swagger/OpenAPI support

**Version**: 1.0  
**Target Framework**: .NET 10  
**Architecture**: Clean Architecture / Presentation Layer
