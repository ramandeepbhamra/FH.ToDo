# Clean Architecture Layers - FH.ToDo

## Layer Overview

FH.ToDo follows Clean Architecture with strict layer separation:

```
┌─────────────────────────────────────────┐
│     FH.ToDo.Web.Host (Presentation)    │
│         Controllers, DI, Config         │
└────────────┬────────────────────────────┘
             │ References
             ↓
┌─────────────────────────────────────────┐
│      FH.ToDo.Services (Application)     │
│    Service implementations, Business    │
│         Logic, AutoMapper               │
└────────────┬────────────────────────────┘
             │ References
             ↓
┌─────────────────────────────────────────┐
│   FH.ToDo.Core.EF (Infrastructure)      │
│  DbContext, Configurations, Migrations  │
└────────────┬────────────────────────────┘
             │ References
             ↓
┌─────────────────────────────────────────┐
│      FH.ToDo.Core (Domain Layer)        │
│    Entities, Interfaces, No Dependencies│
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### Core (Domain)
- **Purpose**: Domain entities and core business rules
- **Contains**: Entities with BaseEntity, interfaces
- **References**: Core.Shared only
- **Rule**: ZERO infrastructure dependencies

### Core.EF (Infrastructure)
- **Purpose**: Database access and persistence
- **Contains**: DbContext, configurations, migrations
- **References**: Core only
- **Rule**: Never referenced by Core

### Services (Application)
- **Purpose**: Business logic orchestration
- **Contains**: Service implementations, AutoMapper
- **References**: Core, Core.EF, Services.Core
- **Rule**: Business logic stays here

### Web.Host (Presentation)
- **Purpose**: API endpoints and HTTP concerns
- **Contains**: Controllers, middleware, configuration
- **References**: All layers
- **Rule**: Controllers are thin

## Dependency Rules

**✅ ALLOWED**:
- Web.Host → Services → Core.EF → Core
- Services.Core → Core
- Core.Shared ← All layers

**❌ FORBIDDEN**:
- Core → Core.EF
- Core.EF → Services
- Services.Core → Core.EF
- Any circular references
