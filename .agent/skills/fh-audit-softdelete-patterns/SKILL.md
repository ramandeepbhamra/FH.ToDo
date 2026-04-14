---
name: fh-audit-softdelete-patterns
description: "Audit tracking and soft delete implementation for FH.ToDo using BaseEntity and DbContext interceptors"
---

# FH.ToDo Audit & Soft Delete Patterns

## BaseEntity

All entities inherit audit and soft delete fields:

```csharp
public abstract class BaseEntity
{
    // Primary Key
    public Guid Id { get; set; }

    // Audit Fields
    public DateTime CreatedDate { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string? ModifiedBy { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedDate { get; set; }
    public string? DeletedBy { get; set; }
}
```

## Automatic Audit Tracking

Implemented in `ToDoDbContext.SaveChanges()`:

```csharp
public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
{
    SetAuditFields();
    return await base.SaveChangesAsync(cancellationToken);
}

private void SetAuditFields()
{
    var entries = ChangeTracker.Entries<IAuditableEntity>();
    var currentTime = DateTime.UtcNow;

    foreach (var entry in entries)
    {
        switch (entry.State)
        {
            case EntityState.Added:
                entry.Entity.CreatedDate = currentTime;
                // CreatedBy set by application layer
                break;

            case EntityState.Modified:
                entry.Entity.ModifiedDate = currentTime;
                // ModifiedBy set by application layer
                // Prevent overwriting CreatedDate/CreatedBy
                entry.Property(nameof(IAuditableEntity.CreatedDate)).IsModified = false;
                entry.Property(nameof(IAuditableEntity.CreatedBy)).IsModified = false;
                break;
        }
    }
}
```

## Automatic Soft Delete

```csharp
private void SetAuditFields()
{
    // ... (audit tracking code above)

    // Handle soft deletes
    var softDeletableEntries = ChangeTracker.Entries<ISoftDeletable>()
        .Where(e => e.State == EntityState.Deleted);

    foreach (var entry in softDeletableEntries)
    {
        entry.State = EntityState.Modified;  // Convert DELETE to UPDATE
        entry.Entity.IsDeleted = true;
        entry.Entity.DeletedDate = DateTime.UtcNow;
        // DeletedBy set by application layer
    }
}
```

## Query Filter Configuration

In entity configuration:

```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Query filter excludes soft-deleted records
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
```

## SQL Defaults

```csharp
// CreatedDate defaults to GETUTCDATE()
builder.Property(u => u.CreatedDate)
    .HasDefaultValueSql("GETUTCDATE()");

// IsDeleted defaults to false
builder.Property(u => u.IsDeleted)
    .HasDefaultValue(false);
```

## Service Layer Usage

### Setting Created By
```csharp
public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
{
    var user = _mapper.Map<User>(dto);
    user.Id = Guid.NewGuid();
    user.CreatedBy = _currentUser.Email;  // Set by application

    _context.Users.Add(user);
    await _context.SaveChangesAsync();  // CreatedDate set automatically

    return _mapper.Map<UserDto>(user);
}
```

### Setting Modified By
```csharp
public async Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto dto)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null) throw new NotFoundException();

    _mapper.Map(dto, user);
    user.ModifiedBy = _currentUser.Email;  // Set by application

    await _context.SaveChangesAsync();  // ModifiedDate set automatically

    return _mapper.Map<UserDto>(user);
}
```

### Soft Delete
```csharp
public async Task DeleteUserAsync(Guid id)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null) throw new NotFoundException();

    user.DeletedBy = _currentUser.Email;  // Set by application
    _context.Users.Remove(user);  // Converted to UPDATE, sets IsDeleted=true

    await _context.SaveChangesAsync();
}
```

## Including Soft-Deleted Records

### Query with Soft-Deleted
```csharp
var allUsers = await _context.Users
    .IgnoreQueryFilters()  // Include soft-deleted
    .Where(u => u.IsDeleted)
    .ToListAsync();
```

### Count Including Deleted
```csharp
var totalCount = await _context.Users
    .IgnoreQueryFilters()
    .CountAsync();
```

## Hard Delete (Permanent)

```csharp
// For administrative purposes only
var user = await _context.Users
    .IgnoreQueryFilters()
    .FirstOrDefaultAsync(u => u.Id == id);

if (user != null)
{
    _context.Entry(user).State = EntityState.Deleted;  // Permanent delete
    await _context.SaveChangesAsync();
}
```

## Restore Soft-Deleted

```csharp
public async Task RestoreUserAsync(Guid id)
{
    var user = await _context.Users
        .IgnoreQueryFilters()
        .FirstOrDefaultAsync(u => u.Id == id && u.IsDeleted);

    if (user == null) throw new NotFoundException();

    user.IsDeleted = false;
    user.DeletedDate = null;
    user.DeletedBy = null;

    await _context.SaveChangesAsync();
}
```

## Current User Service

Implement `ICurrentUserService` to get current user info:

```csharp
public interface ICurrentUserService
{
    string? UserId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
}

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => _httpContextAccessor.HttpContext?
        .User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public string? Email => _httpContextAccessor.HttpContext?
        .User?.FindFirst(ClaimTypes.Email)?.Value;

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?
        .User?.Identity?.IsAuthenticated ?? false;
}
```

## Best Practices

✅ **DO**:
- Always use soft delete for business data
- Set CreatedBy/ModifiedBy/DeletedBy in application layer
- Use IgnoreQueryFilters() when you need soft-deleted records
- Index IsDeleted column for performance

❌ **DON'T**:
- Use hard delete unless absolutely necessary
- Expose soft-deleted records in API by default
- Forget to set DeletedBy before soft deleting
- Skip audit fields on any entity

## Database Impact

All queries automatically filtered:
```sql
-- What developer writes:
SELECT * FROM Users WHERE Email = 'user@example.com'

-- What EF Core executes:
SELECT * FROM Users 
WHERE Email = 'user@example.com' 
  AND IsDeleted = 0  -- Added by query filter
```
