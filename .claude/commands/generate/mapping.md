---
description: "Create AutoMapper profile and DTOs for an entity"
allowed-tools: Read, Write, Edit
argument-hint: "$ENTITY_NAME - Entity to create mappings for"
---

# Generate Mapping

## Usage

`/generate:mapping $ARGUMENTS`

## Creates

1. `Create{Entity}Dto` (input, record)
2. `Update{Entity}Dto` (input, record)
3. `{Entity}ListDto` (output, class)
4. `{Entity}DetailDto` (output, class)
5. `{Entity}MappingProfile` (AutoMapper)

## AutoMapper Template

```csharp
public class {Entity}MappingProfile : Profile
{
    public {Entity}MappingProfile()
    {
        CreateMap<{Entity}, {Entity}ListDto>();
        
        CreateMap<Create{Entity}Dto, {Entity}>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            // ... ignore all audit fields
    }
}
```

## Location

- DTOs: `FH.ToDo.Services.Core/{Domain}/Dto/`
- Profile: `FH.ToDo.Services/Mappers/`
