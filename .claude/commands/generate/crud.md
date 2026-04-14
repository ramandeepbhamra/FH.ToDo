---
description: "Generate complete CRUD: Entity → Configuration → Migration → DTOs → Mapping → Service → Controller"
allowed-tools: Read, Write, Edit, Bash
argument-hint: "$ENTITY_NAME - Entity name for full CRUD generation"
---

# Generate CRUD

## Usage

`/generate:crud $ARGUMENTS`

## Creates (Full Stack)

1. Entity + configuration
2. DbSet in DbContext
3. Migration
4. DTOs (Create, Update, List, Detail)
5. AutoMapper profile
6. Service interface + implementation
7. API controller
8. Applies migration

## Workflow

1. Ask for entity properties
2. Create entity with BaseEntity inheritance
3. Create Fluent API configuration
4. Generate migration
5. Create 4 DTOs
6. Create AutoMapper profile
7. Create service interface/implementation
8. Create controller with CRUD endpoints
9. Register service in DI
10. Build and verify

## Example

```
/generate:crud Task

Creates complete stack for Task management with:
- GET /api/tasks
- GET /api/tasks/{id}
- POST /api/tasks
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}
```
