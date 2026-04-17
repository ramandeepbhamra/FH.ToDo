# Audit Schema

Review database schema for best practices, performance, and compliance.

## Usage

`/audit-schema` - Audit all tables
`/audit-schema {TableName}` - Audit specific table

## What It Checks

### 1. Audit Fields
- ✅ All tables have `CreatedDate`, `CreatedBy`
- ✅ All tables have `ModifiedDate`, `ModifiedBy`
- ✅ All tables have `IsDeleted`, `DeletedDate`, `DeletedBy`

### 2. Indexes
- ✅ Primary keys are clustered
- ✅ Foreign keys have indexes
- ✅ Frequently queried columns are indexed
- ✅ Composite indexes for common query patterns
- ✅ Unique indexes where appropriate

### 3. Constraints
- ✅ NOT NULL on required fields
- ✅ String length limits set
- ✅ Foreign key constraints defined
- ✅ Check constraints for enums/ranges

### 4. Defaults
- ✅ `CreatedDate` defaults to GETUTCDATE()
- ✅ `IsDeleted` defaults to 0/false
- ✅ `IsActive` defaults to 1/true

### 5. Query Filters
- ✅ Soft delete filter: `WHERE IsDeleted = 0`
- ✅ Applied globally via HasQueryFilter

### 6. Naming Conventions
- ✅ Table names are plural (Users, Tasks)
- ✅ Column names are PascalCase
- ✅ Foreign keys follow pattern: `{Entity}Id`
- ✅ Index names: `IX_{Table}_{Column}`

## Report Format

```
Schema Audit Report
===================

Table: Users
✅ Audit fields present
✅ Soft delete configured
✅ Indexes:
   - PK_Users (Id) - Clustered
   - IX_Users_Email (Email) - Unique
   - IX_Users_IsDeleted (IsDeleted)
✅ Constraints: All required fields NOT NULL
⚠️ Missing index on FirstName + LastName composite

Table: Tasks
✅ Audit fields present
❌ Missing IsDeleted column
⚠️ No index on UserId foreign key
✅ Query filter configured

Summary:
- 2 tables audited
- 3 issues found
- 1 recommendations
```

## Recommendations

Based on audit, may suggest:
- Adding missing indexes
- Optimizing composite indexes
- Adding query hints
- Reviewing execution plans
- Implementing partitioning (large tables)

## Example

```
User: /audit-schema Users

Agent: Auditing Users table...

✅ PASS: Audit fields (CreatedDate, ModifiedDate, etc.)
✅ PASS: Soft delete (IsDeleted, DeletedDate, DeletedBy)
✅ PASS: Primary key index
✅ PASS: Unique email index
⚠️ RECOMMENDATION: Add composite index on (FirstName, LastName) for name searches
✅ PASS: Query filter for soft delete

Overall: 5/6 checks passed
```
