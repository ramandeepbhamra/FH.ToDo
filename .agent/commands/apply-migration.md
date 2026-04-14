# Apply Migration

Apply pending EF Core migrations to the database.

## Usage

`/apply-migration`

Optionally target specific migration:
`/apply-migration {MigrationName}`

## What It Does

1. Checks pending migrations
2. Applies migrations to database
3. Updates `__EFMigrationsHistory` table
4. Verifies schema changes

## Command

```bash
cd C:\Projects\FunctionHealth\FH.ToDo\FH.ToDo.Core.EF

# Apply all pending migrations
dotnet ef database update

# Apply to specific migration
dotnet ef database update {MigrationName}

# Rollback to previous migration
dotnet ef database update {PreviousMigrationName}

# Rollback all migrations
dotnet ef database update 0
```

## Pre-Flight Checks

Before applying, verify:
- ✅ Migration has been reviewed
- ✅ Development database backup exists
- ✅ No destructive changes without data migration plan
- ✅ Connection string is correct

## Database Targets

**Development** (`appsettings.Development.json`):
```
Server=...;Database=FHToDo_Dev;...
```

**Production** (`appsettings.json`):
```
Server=...;Database=FHToDo;...
```

## Connection Resiliency

ToDoDbContext is configured with:
- Max retry count: 5
- Max retry delay: 30 seconds
- Command timeout: 60 seconds

## Verification Steps

After applying:
1. Check database schema in SSMS or Azure Data Studio
2. Verify indexes were created
3. Verify constraints and defaults
4. Test CRUD operations

## Rollback Process

If migration causes issues:

```bash
# List all migrations
dotnet ef migrations list

# Rollback to previous
dotnet ef database update {PreviousMigrationName}

# Remove problematic migration (if not applied elsewhere)
dotnet ef migrations remove
```

## Common Issues

### Issue: Connection string not found
**Solution**: Ensure `appsettings.json` exists in `FH.ToDo.Core.EF` with `ConnectionStrings:DefaultConnection`

### Issue: Migration already applied
**Solution**: Migration is already in database, no action needed

### Issue: Pending model changes
**Solution**: Generate a new migration first: `/add-migration`

## Example

```
User: /apply-migration

Agent: Checking pending migrations...

Pending migrations:
1. 20260410150000_AddTaskEntity

Applying to database: FHToDo_Dev

✅ Migration applied successfully

Changes made:
- Created table: Tasks
- Created index: IX_Tasks_UserId
- Created index: IX_Tasks_DueDate

Database is up to date!
```
