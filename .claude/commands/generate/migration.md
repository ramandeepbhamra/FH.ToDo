---
description: "Generate EF Core migration for database schema changes"
allowed-tools: Read, Bash
argument-hint: "$MIGRATION_NAME - Descriptive migration name (e.g., AddTaskEntity)"
---

# Generate Migration

## Usage

`/generate:migration $ARGUMENTS`

## What It Does

1. Analyzes entity/configuration changes
2. Generates migration files
3. Reviews SQL for safety
4. Provides next steps

## Command

```bash
cd C:\Projects\FunctionHealth\FH.ToDo\FH.ToDo.Core.EF
dotnet ef migrations add $MIGRATION_NAME
```

## Migration Naming

✅ **Good**: AddTaskEntity, AddUserEmailIndex, UpdateTaskStatusColumn  
❌ **Bad**: Changes, Update1, Fix

## Generated Files

- `{Timestamp}_{Name}.cs`
- `{Timestamp}_{Name}.Designer.cs`
- `ToDoDbContextModelSnapshot.cs` (updated)

## Safety Review

Checks for:
- ⚠️ DROP TABLE, DROP COLUMN (data loss)
- ⚠️ Column type changes (potential data loss)
- ⚠️ String length reductions (truncation)
- ⚠️ Adding NOT NULL without default

## Example

```
/generate:migration AddTaskEntity

Agent: Generating migration...

✅ Migration created: 20260410150000_AddTaskEntity.cs

Changes:
- CREATE TABLE Tasks
- CREATE INDEX IX_Tasks_UserId
- No destructive changes

Next: Apply with /generate:crud or manually apply
```
