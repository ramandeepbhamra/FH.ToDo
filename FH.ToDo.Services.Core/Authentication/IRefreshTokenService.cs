using FH.ToDo.Core.Entities.Auth;

namespace FH.ToDo.Services.Core.Authentication;

public interface IRefreshTokenService
{
    Task<RefreshToken> CreateAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<RefreshToken?> GetValidTokenAsync(string token, CancellationToken cancellationToken = default);

    Task RevokeAsync(string token, CancellationToken cancellationToken = default);

    Task RevokeAllForUserAsync(Guid userId, CancellationToken cancellationToken = default);
}
