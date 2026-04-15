# Copilot Instructions

## Project Guidelines

### Types
- All types (interfaces, classes, enums, DTOs) must be defined in separate files — one type per file — on both backend and frontend. This rule applies to ALL type declarations, including nested static classes, nested enums, and nested interfaces. Use C# partial classes to split nested types across files while preserving the outer class name.

### Angular Components
- All **new** components must have a separate `.ts` class file and a `.html` template file — no inline templates.
- No inline `template: \`...\`` in new component `.ts` files — the template must live in a paired `.html` file referenced via `templateUrl`.
- Existing components that use inline templates will be migrated to the separate-file pattern in a dedicated refactor pass — do not change them as part of feature work.

### General
- Confirm all changes with the user before applying them.
- Do not create new markdown files — **exception: `README.md` at the repo root is permitted and must be kept up to date**.
- Do not create new markdown files.
