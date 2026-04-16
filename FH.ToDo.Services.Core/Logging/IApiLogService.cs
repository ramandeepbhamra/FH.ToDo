using FH.ToDo.Services.Core.Common.Dto;
using FH.ToDo.Services.Core.Logging.Dto;

namespace FH.ToDo.Services.Core.Logging;

public interface IApiLogService
{
    Task CreateAsync(CreateApiLogDto dto, CancellationToken cancellationToken = default);

    Task<PagedResultDto<ApiLogDto>> GetLogsAsync(GetApiLogsInputDto input, CancellationToken cancellationToken = default);
}
