# AutoMapper Setup - FH.ToDo

## Package

AutoMapper v14.0.0 (no known vulnerabilities)

## Installation

```xml
<!-- FH.ToDo.Services -->
<PackageReference Include="AutoMapper" Version="14.0.0" />

<!-- FH.ToDo.Web.Host -->
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
```

## Registration

In `Program.cs`:

```csharp
builder.Services.AddAutoMapper(typeof(UserMappingProfile).Assembly);
```

This auto-discovers all `Profile` classes in the Services assembly.

## Profile Structure

```csharp
public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // Entity → DTO
        CreateMap<User, UserListDto>();
        
        // DTO → Entity
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            // ... ignore all audit fields
    }
}
```

## Usage in Services

```csharp
public class UserService : IUserService
{
    private readonly IMapper _mapper;

    public UserService(IMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task<UserListDto> GetUserAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        return _mapper.Map<UserListDto>(user);
    }
}
```

## Best Practices

1. Create one profile per domain aggregate
2. Always ignore audit fields when mapping from DTO
3. Use explicit ForMember for clarity
4. Test mappings in unit tests
