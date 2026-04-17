# Add Migration

Generate an EF Core migration for FH.ToDo database changes.

## Usage

`/add-migration {MigrationName}`

**Examples**:
- `/add-migration AddTaskEntity`
- `/add-migration AddUserPhoneNumberIndex`
- `/add-migration UpdateTaskDueDateNullable`

## What It Does

1. Analyzes entity/configuration changes
2. Generates migration files in `FH.ToDo.Core.EF/Migrations/`
3. Reviews generated SQL for safety
4. Provides rollback instructions

## Workflow

```bash
cd C:\Projects\FunctionHealth\FH.ToDo\FH.ToDo.Core.EF
dotnet ef migrations add {MigrationName}
```

## Migration Naming

✅ **Good Names** (descriptive, action-based):
- `AddTaskEntity`
- `AddUserEmailIndex`
- `UpdateTaskStatusEnum`
- `RemoveUserPhoneNumber`

❌ **Bad Names** (vague, non-descriptive):
- `Changes`
- `Update1`
- `Fix`
- `NewMigration`

## Generated Files

- `{Timestamp}_{MigrationName}.cs` - Migration code
- `{Timestamp}_{MigrationName}.Designer.cs` - Metadata
- `ToDoDbContextModelSnapshot.cs` - Current model state (updated)

## Safety Checks

Before applying, review for:
- **Destructive changes**: DROP TABLE, DROP COLUMN
- **Data loss**: Changing column types, reducing lengths
- **Nullable changes**: NOT NULL on existing columns
- **Default values**: Missing defaults for new required fields

## Common Migration Patterns

### Add New Entity
```csharp
migrationBuilder.CreateTable(
    name: "Tasks",
    columns: table => new { ... }
);
```

### Add Index
```csharp
migrationBuilder.CreateIndex(
    name: "IX_Tasks_UserId",
    table: "Tasks",
    column: "UserId"
);
```

### Add Column
```csharp
migrationBuilder.AddColumn<string>(
    name: "PhoneNumber",
    table: "Users",
    maxLength: 20,
    nullable: true
);
```

## Next Steps

After migration is generated:
1. **Review** migration SQL
2. **Test** in development database first
3. **Apply**: `/apply-migration`
4. **Verify** schema changes

## Rollback

If migration needs to be removed (before applying):
```bash
dotnet ef migrations remove
```

## Example

```
User: /add-migration AddTaskEntity

Agent: Generating migration for Task entity...

Migration created: 20260410150000_AddTaskEntity.cs

Changes:
✅ CREATE TABLE Tasks (columns, constraints)
✅ CREATE INDEX IX_Tasks_UserId
✅ CREATE INDEX IX_Tasks_DueDate
✅ No destructive changes detected

Next step: /apply-migration
```
