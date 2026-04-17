---
description: "Review code for Clean Architecture compliance, best practices, and maintainability"
allowed-tools: Read, Glob, Grep
argument-hint: "$PATH - File or directory to review"
---

# Review: Code Quality

## Usage

`/review:code-quality $PATH`

## Checks

- ✅ Clean Architecture layer separation
- ✅ Naming conventions
- ✅ Error handling
- ✅ Authorization
- ✅ DTO usage
- ✅ AutoMapper patterns

## Output

```markdown
## Code Review

### Architecture: ✅
- Layer separation correct
- No circular dependencies

### Quality: ⚠️
- Missing error handling in CreateAsync
- Consider extracting business logic

### Score: 7/10
```
