# DTO Creation Standards

## DTO Types

### CreateDto (Input)
```csharp
public record Create{Entity}Dto(
    string Property1,
    string? OptionalProperty,
    Guid ForeignKey
);
```

- Use `record` for immutability
- Properties are constructor parameters
- Required properties first, optional last

### UpdateDto (Input)
```csharp
public record Update{Entity}Dto(
    string Property1,
    string? OptionalProperty,
    bool IsActive
);
```

- Use `record`
- Include updatable fields only
- No Id (passed in route)

### ListDto (Output)
```csharp
public class {Entity}ListDto
{
    public Guid Id { get; set; }
    public string Property1 { get; set; }
    public bool IsActive { get; set; }
}
```

- Use `class`
- Include only fields for list display
- Keep lightweight

### DetailDto (Output)
```csharp
public class {Entity}DetailDto
{
    public Guid Id { get; set; }
    public string Property1 { get; set; }
    public string? OptionalProperty { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; }
}
```

- Use `class`
- Include all relevant fields
- Can include navigation properties

## Location

`FH.ToDo.Services.Core/{Domain}/Dto/`

## Naming

- `Create{Entity}Dto`
- `Update{Entity}Dto`
- `{Entity}ListDto`
- `{Entity}DetailDto`
