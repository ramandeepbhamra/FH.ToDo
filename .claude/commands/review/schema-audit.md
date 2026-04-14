---
description: "Audit database schema for compliance, performance, and best practices"
allowed-tools: Read, Glob, Grep
argument-hint: "$TABLE_NAME - Optional table name to audit, or omit for all tables"
---

# Review: Schema Audit

## Usage

`/review:schema-audit` - Audit all tables  
`/review:schema-audit $TABLE_NAME` - Audit specific table

## Checks

### Audit Fields
- ✅ CreatedDate, CreatedBy, ModifiedDate, ModifiedBy
- ✅ IsDeleted, DeletedDate, DeletedBy
- ✅ SQL defaults configured

### Indexes
- ✅ Primary keys
- ✅ Foreign keys
- ✅ Unique constraints
- ✅ Frequently queried columns

### Performance
- ⚠️ Missing indexes
- ⚠️ Table scans
- ⚠️ Optimization opportunities

## Report Format

```markdown
## Schema Audit: {Table}

✅ Audit fields present
✅ Soft delete configured
⚠️ Missing index on {Column}

Recommendations:
1. Add index on UserId (FK)
2. Consider composite index on (DueDate, IsCompleted)

Score: 8/10
```
