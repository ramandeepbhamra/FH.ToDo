namespace FH.ToDo.Core.Shared.Enums;

/// <summary>
/// User role types
/// </summary>
public enum UserRole
{
    /// <summary>Basic user with limited access (10 active task limit)</summary>
    BasicUser = 1,

    /// <summary>Premium user with unlimited tasks</summary>
    Premium = 2,

    /// <summary>Administrator — user/system management only, no task access</summary>
    Admin = 3,

    /// <summary>Developer user with unlimited tasks</summary>
    DevUser = 4
}
