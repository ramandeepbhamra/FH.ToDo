# FH.ToDo.Tests - Test Suite

## 📋 Overview

Automated test suite for FH.ToDo application, focusing on unit tests for core business logic. Uses **xUnit**, **Moq**, and **FluentAssertions** to ensure code quality and prevent regressions.

---

## 🧪 Running Tests

### Quick Start

```powershell
# From solution root
dotnet test

# Run specific project
dotnet test FH.ToDo.Tests

# Run with detailed output
dotnet test FH.ToDo.Tests --verbosity detailed

# Run tests in watch mode (auto-run on file changes)
dotnet watch test --project FH.ToDo.Tests
```

### Using Visual Studio

1. Open **Test Explorer** (`Test` → `Test Explorer`)
2. Click **Run All Tests** (or press `Ctrl+R, A`)
3. View results in the Test Explorer pane

---

## 📦 Current Test Coverage

### ✅ Implemented Tests (3 tests)

#### **AuthenticationServiceSimpleTests** (3 tests)
**What it tests:** Password hashing and verification logic

| Test | Purpose | Status |
|------|---------|--------|
| `VerifyPassword_WithCorrectPassword_ReturnsTrue` | Validates correct password authentication | ✅ Passing |
| `VerifyPassword_WithIncorrectPassword_ReturnsFalse` | Validates incorrect password rejection | ✅ Passing |
| `HashPassword_GeneratesValidHash` | Validates BCrypt hash generation | ✅ Passing |

**Why these tests matter:**
- ✅ Proves core authentication security works
- ✅ Validates BCrypt integration
- ✅ Ensures password hashing is deterministic and verifiable

---

## 🏗️ Test Project Structure

```
FH.ToDo.Tests/
├── Services/
│   └── AuthenticationServiceSimpleTests.cs    ✅ 3 passing tests
├── Controllers/                                (Planned)
├── Integration/                                (Planned)
└── FH.ToDo.Tests.csproj
```

---

## 🛠️ Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| xUnit | 2.9.2 | Test framework |
| Moq | 4.20.72 | Mocking dependencies |
| FluentAssertions | 7.0.0 | Readable assertions |
| MockQueryable.Moq | 8.0.0 | Async EF query mocking (future use) |
| EF Core InMemory | 10.0.5 | In-memory database for integration tests |

---

## 📋 Assumptions & Design Decisions

### ✅ Current Approach

**1. Unit Tests Over Integration Tests (Initial Focus)**
- Started with pure unit tests (no database)
- Tests password logic in isolation
- Fast execution (< 1 second)

**Why?**
- ✅ Immediate value - proves core logic works
- ✅ No database setup required
- ✅ Fast feedback loop

**Trade-off:**
- ⚠️ Doesn't test full authentication flow
- ⚠️ Doesn't validate database queries

---

**2. Mocked Dependencies (Moq)**
- `IRepository<User, Guid>` mocked with `Mock<T>`
- Simple, isolated tests
- No real database needed

**Why?**
- ✅ Fast test execution
- ✅ Predictable, repeatable results
- ✅ Easy to set up

**Trade-off:**
- ⚠️ Doesn't catch EF query bugs
- ⚠️ Doesn't validate actual SQL generation

---

**3. Static Test Data**
- Hardcoded emails: `"test@example.com"`
- Hardcoded passwords: `"MySecurePassword123!"`
- Same data in every test run

**Why?**
- ✅ Simple and readable
- ✅ Easy to debug failures

**Trade-off:**
- ⚠️ **Can't test unique constraints** (email uniqueness not validated)
- ⚠️ **Not realistic** - production data is dynamic
- ⚠️ **Parallel test issues** - If tests share database, conflicts occur

---

## 🔀 Known Limitations & Trade-offs

### 1. **Static Test Data (Current)**

**Problem:**
```csharp
// Every test uses same email - can't test unique constraints
var user = new User { Email = "test@example.com" };
```

**Impact:**
- ❌ Can't validate email uniqueness in database
- ❌ Can't run tests in parallel against shared database
- ❌ Doesn't test real-world edge cases

**Future Solution:**
```csharp
// Generate unique emails per test run
var testEmail = $"test-{Guid.NewGuid()}@example.com";
```

---

### 2. **No Integration Tests (Current)**

**What's missing:**
- Full authentication flow (request → service → database → response)
- Controller endpoint testing
- Database constraint validation (unique indexes, foreign keys)
- Repository behavior with real EF Core

**Why not added yet:**
- ⏰ Time constraint - focused on proving core logic first
- 🎯 Unit tests provide immediate value

**Future Solution:**
```csharp
[Fact]
public async Task Login_EndToEnd_ReturnsTokenAndCreatesSession()
{
    // Use real DbContext with InMemory database
    var options = new DbContextOptionsBuilder<ToDoDbContext>()
        .UseInMemoryDatabase($"TestDb-{Guid.NewGuid()}")
        .Options;
    
    using var context = new ToDoDbContext(options);
    var repo = new Repository<User, Guid>(context);
    var authService = new AuthenticationService(repo);
    
    // Seed test user
    await repo.InsertAsync(new User { Email = "test@example.com", ... });
    
    // Test full login flow
    var result = await authService.AuthenticateAsync(new LoginRequestDto { ... });
    
    result.Should().NotBeNull();
}
```

---

### 3. **No Test Data Factory (Current)**

**Current approach:**
```csharp
// Inline user creation - duplicated across tests
var user = new User 
{ 
    Email = "test@example.com",
    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
    // ... 10 more properties
};
```

**Problems:**
- Code duplication
- Hard to maintain when entity changes
- No dynamic data generation

**Future Solution:**
```csharp
// Test data factory with builder pattern
public class UserTestDataBuilder
{
    private string _email = $"test-{Guid.NewGuid()}@example.com";
    private UserRole _role = UserRole.Basic;
    
    public UserTestDataBuilder WithEmail(string email) 
    {
        _email = email;
        return this;
    }
    
    public User Build() => new User 
    { 
        Email = _email,
        Role = _role,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
        // ... other defaults
    };
}

// Usage in tests
var user = new UserTestDataBuilder()
    .WithEmail("custom@example.com")
    .WithRole(UserRole.Admin)
    .Build();
```

---

### 4. **No Asynchronous Test Support (Partially)**

**Current state:**
- Simple tests are synchronous (VerifyPassword, HashPassword)
- ✅ Fast and simple
- ❌ Can't test async service methods (GetUsersAsync, AuthenticateAsync)

**Why?**
- Async EF queries require `IAsyncQueryProvider`
- `List<T>.AsQueryable()` doesn't support async
- Need `MockQueryable` or InMemory database

**Future Solution:**
```csharp
// Use MockQueryable for async support
var users = new List<User> { testUser }
    .AsQueryable()
    .BuildMock(); // ← Supports FirstOrDefaultAsync, ToListAsync, etc.

mockRepo.Setup(r => r.GetAll()).Returns(users);
```

---

## 🚀 What I'd Do Next (With More Time)

### Priority 1: Integration Tests (45 min)
**Add end-to-end tests with InMemory database:**

```csharp
// FH.ToDo.Tests/Integration/AuthenticationIntegrationTests.cs
[Fact]
public async Task Login_WithValidCredentials_ReturnsTokenAndUser()
{
    // Real DbContext + Repository + Service
    var dbContext = CreateInMemoryDbContext();
    var repo = new Repository<User, Guid>(dbContext);
    var authService = new AuthenticationService(repo);
    
    // Seed user
    await SeedUserAsync(dbContext, "test@example.com", "Test123!");
    
    // Test real authentication
    var result = await authService.AuthenticateAsync(new LoginRequestDto 
    { 
        Email = "test@example.com", 
        Password = "Test123!" 
    });
    
    result.Should().NotBeNull();
    result.Email.Should().Be("test@example.com");
}
```

**Benefits:**
- ✅ Tests real database behavior
- ✅ Validates EF configurations
- ✅ Catches integration bugs

---

### Priority 2: Test Data Factory (30 min)
**Create reusable test data builders:**

```csharp
public static class TestData
{
    public static User CreateUser(
        string? email = null,
        UserRole role = UserRole.Basic,
        bool isActive = true)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = email ?? $"test-{Guid.NewGuid()}@example.com", // ← Unique!
            FirstName = "Test",
            LastName = "User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
            Role = role,
            IsActive = isActive,
            CreatedDate = DateTime.UtcNow
        };
    }
}
```

**Benefits:**
- ✅ DRY (Don't Repeat Yourself)
- ✅ Dynamic data generation
- ✅ Tests can run in parallel

---

### Priority 3: Controller Tests (30 min)
**Test API endpoints with mocked services:**

```csharp
[Fact]
public async Task UsersController_GetAll_ReturnsUsers()
{
    var mockUserService = new Mock<IUserService>();
    mockUserService
        .Setup(s => s.GetUsersAsync(It.IsAny<GetUsersInputDto>()))
        .ReturnsAsync(new List<UserListResponseDto> { /* test data */ });
    
    var controller = new UsersController(mockUserService.Object);
    
    var result = await controller.GetUsers(new GetUsersInputDto());
    
    result.Should().BeOfType<OkObjectResult>();
}
```

---

### Priority 4: Expand Coverage (60 min)
**Add tests for:**
- ✅ UserService filtering logic
- ✅ RefreshTokenService token generation
- ✅ TaskListService CRUD operations
- ✅ TodoTaskService subtask management
- ✅ Mapper validation (Mapperly)

**Target:** 60-80% code coverage

---

### Priority 5: Test Data Uniqueness (15 min)
**Fix static data issue:**

```csharp
// Before (static)
var email = "test@example.com"; // ❌ Same every run

// After (dynamic)
var email = $"test-{Guid.NewGuid().ToString()[..8]}@example.com"; 
// ✅ test-a1b2c3d4@example.com
```

**Benefits:**
- ✅ Tests can run against real database
- ✅ Parallel test execution supported
- ✅ No cleanup needed between runs

---

## 📝 Test Writing Guidelines

### 1. Follow AAA Pattern
```csharp
[Fact]
public void MethodName_Scenario_ExpectedBehavior()
{
    // Arrange - Set up test data and mocks
    var input = /* ... */;
    
    // Act - Execute the method under test
    var result = methodUnderTest(input);
    
    // Assert - Verify the result
    result.Should().Be(expected);
}
```

### 2. Use Descriptive Test Names
✅ Good: `GetUsersAsync_WithNameFilter_ReturnsMatchingUsers`  
❌ Bad: `TestGetUsers()`, `UserTest1()`

### 3. Use FluentAssertions
✅ Good: `result.Should().NotBeNull("because user exists")`  
❌ Bad: `Assert.NotNull(result)`

### 4. One Assert Per Test (Ideally)
Each test should verify **one specific behavior**.

---

## 🔧 Setup for New Contributors

### 1. Restore Packages
```powershell
dotnet restore FH.ToDo.Tests
```

### 2. Build Test Project
```powershell
dotnet build FH.ToDo.Tests
```

### 3. Run Tests
```powershell
dotnet test FH.ToDo.Tests
```

### 4. (Optional) Install Test Runner
```powershell
# For VS Code users
dotnet tool install --global dotnet-test-explorer
```

---

## 🐛 Troubleshooting

### Tests Won't Run

**Error:** `No test is available`  
**Fix:** Rebuild solution: `dotnet build`

**Error:** `Could not load file or assembly`  
**Fix:** Clean and rebuild:
```powershell
dotnet clean
dotnet build
dotnet test
```

---

### Mock-Related Errors

**Error:** `IQueryable doesn't implement IAsyncQueryProvider`  
**Cause:** Using `List<T>.AsQueryable()` with async EF queries  
**Fix:** Use `MockQueryable.Moq`:
```csharp
using MockQueryable.Moq;

var users = new List<User> { testUser }
    .AsQueryable()
    .BuildMock(); // ← Enables async support
```

---

### Test Data Conflicts

**Error:** `Violation of UNIQUE KEY constraint`  
**Cause:** Hardcoded emails in test data  
**Fix:** Generate unique emails:
```csharp
var email = $"test-{Guid.NewGuid()}@example.com";
```

---

## 📊 Testing Strategy

### Current Strategy: Unit Tests First

**Focus:** Test business logic in isolation
- ✅ Fast execution
- ✅ No external dependencies
- ✅ Easy to debug

**Example:** Password verification doesn't need database - just test the BCrypt logic.

---

### Future Strategy: Add Integration Tests

**Focus:** Test full workflows with real database
- Use `UseInMemoryDatabase()` for fast, isolated tests
- Test actual EF queries, relationships, and constraints
- Validate controller → service → repository → database flow

---

## 🎯 Design Decisions

### ✅ Why xUnit?
- Modern, lightweight test framework
- Great async/await support
- Parallel test execution by default
- Industry standard for .NET

### ✅ Why Moq?
- Most popular .NET mocking library
- Simple, fluent API
- Great for mocking repositories and services

### ✅ Why FluentAssertions?
- **Readable:** `result.Should().NotBeNull()` vs `Assert.NotNull(result)`
- **Better error messages:** Shows actual vs expected clearly
- **Chainable:** `result.Should().NotBeNull().And.BeOfType<UserDto>()`

### ✅ Why MockQueryable.Moq?
- Enables async EF query testing with mocks
- Converts `List<T>.AsQueryable()` to support `FirstOrDefaultAsync`, `ToListAsync`, etc.
- Avoids setting up real database for simple query tests

---

## 🚧 Current Limitations

### 1. **Static Test Data**

**Current:**
```csharp
var email = "test@example.com"; // ❌ Same every time
```

**Problem:**
- Can't test email uniqueness constraint
- Can't run tests in parallel against shared database
- Not realistic - production has dynamic data

**Future Fix:**
```csharp
var email = $"test-{Guid.NewGuid()}@example.com"; // ✅ Unique every run
```

**When to implement:** When adding integration tests with real database.

---

### 2. **No Test Data Builders**

**Current:**
```csharp
// Test data creation duplicated in every test
var user = new User 
{ 
    Email = "test@example.com",
    FirstName = "Test",
    LastName = "User",
    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
    Role = UserRole.Basic,
    IsActive = true,
    IsDeleted = false,
    CreatedDate = DateTime.UtcNow
};
```

**Problem:**
- Code duplication
- Hard to maintain when `User` entity changes
- Verbose, hard to read

**Future Fix:**
```csharp
// Create reusable test data factory
public class UserBuilder
{
    private string _email = $"test-{Guid.NewGuid()}@example.com";
    private string _password = "Test123!";
    private UserRole _role = UserRole.Basic;
    
    public UserBuilder WithEmail(string email) { _email = email; return this; }
    public UserBuilder WithRole(UserRole role) { _role = role; return this; }
    
    public User Build() => new User
    {
        Id = Guid.NewGuid(),
        Email = _email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(_password),
        Role = _role,
        FirstName = "Test",
        LastName = "User",
        IsActive = true,
        CreatedDate = DateTime.UtcNow
    };
}

// Usage - clean, readable, flexible
var admin = new UserBuilder()
    .WithEmail("admin@test.com")
    .WithRole(UserRole.Admin)
    .Build();
```

**Benefits:**
- ✅ DRY - no duplication
- ✅ Fluent, readable API
- ✅ Easy to extend for new scenarios

**When to implement:** Before adding 10+ tests.

---

### 3. **Limited Async Test Coverage**

**Current:**
- Only synchronous tests (`VerifyPassword`, `HashPassword`)
- ✅ Works for pure logic tests
- ❌ Can't test async service methods

**Problem:**
```csharp
// This test would fail - List<T>.AsQueryable() doesn't support async
var users = new List<User>().AsQueryable();
mockRepo.Setup(r => r.GetAll()).Returns(users);

await authService.AuthenticateAsync(...); // ❌ Throws IAsyncQueryProvider error
```

**Future Fix:**
```csharp
using MockQueryable.Moq;

var users = new List<User> { testUser }
    .AsQueryable()
    .BuildMock(); // ✅ Now supports FirstOrDefaultAsync, ToListAsync

mockRepo.Setup(r => r.GetAll()).Returns(users);
```

**When to implement:** When testing UserService, TaskService, etc.

---

### 4. **No Controller Tests**

**Why?**
- Controllers have many dependencies (services, JWT, config)
- Mocking all dependencies is verbose
- Integration tests provide better coverage for controllers

**Future approach:**
- Use `WebApplicationFactory<Program>` for integration tests
- Test full HTTP request/response cycle
- Validate middleware pipeline (auth, CORS, error handling)

---

## 🚀 Roadmap

### Phase 1: Core Unit Tests ✅ (Current)
- [x] AuthenticationService password logic
- [x] Basic test infrastructure setup

### Phase 2: Expand Unit Tests (Next - 60 min)
- [ ] UserService filtering and query building
- [ ] RefreshTokenService token generation
- [ ] TaskListService CRUD logic
- [ ] Test data factory implementation

### Phase 3: Integration Tests (Future - 90 min)
- [ ] Authentication flow (login → database → token)
- [ ] User CRUD with real repository
- [ ] Task management workflows
- [ ] Database constraint validation

### Phase 4: Controller Tests (Future - 60 min)
- [ ] Use `WebApplicationFactory`
- [ ] Test HTTP endpoints end-to-end
- [ ] Validate middleware pipeline
- [ ] Test authorization and error handling

### Phase 5: Coverage & Quality (Future - 30 min)
- [ ] Achieve 60-80% code coverage
- [ ] Add test data builders
- [ ] Implement dynamic test data generation
- [ ] Add mutation testing (Stryker.NET)

---

## 📚 Resources

### Testing Best Practices
- [xUnit Documentation](https://xunit.net/)
- [Moq Quickstart](https://github.com/moq/moq)
- [FluentAssertions Documentation](https://fluentassertions.com/)

### .NET Testing Guides
- [Unit Testing Best Practices](https://learn.microsoft.com/dotnet/core/testing/unit-testing-best-practices)
- [Integration Testing](https://learn.microsoft.com/aspnet/core/test/integration-tests)
- [Test Doubles (Mocks, Stubs, Fakes)](https://martinfowler.com/articles/mocksArentStubs.html)

---

## 📝 Contributing to Tests

### Adding a New Test

1. **Create test file** in appropriate folder:
   - `Services/` - For service layer tests
   - `Controllers/` - For API endpoint tests
   - `Integration/` - For end-to-end tests

2. **Follow naming convention:**
   ```
   {ClassName}Tests.cs
   ```

3. **Use AAA pattern:**
   ```csharp
   // Arrange
   // Act
   // Assert
   ```

4. **Run tests before committing:**
   ```powershell
   dotnet test
   ```

---

## ✅ Summary

**What we have:**
- ✅ Test project setup with modern stack
- ✅ 3 passing unit tests proving core logic
- ✅ Fast execution (< 1 second)
- ✅ Easy to run (`dotnet test`)

**What's next:**
- 🚧 Expand to service layer tests
- 🚧 Add integration tests
- 🚧 Implement test data factory
- 🚧 Dynamic test data generation

**Current status:** ✅ **Foundation complete** - ready to expand coverage!

---

**Version**: 1.0  
**Last Updated**: April 17, 2026  
**Test Framework**: xUnit 2.9.2  
**Build Status**: ✅ All tests passing

---

**Happy Testing! 🧪**
