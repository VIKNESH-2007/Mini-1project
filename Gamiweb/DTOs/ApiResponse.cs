namespace Gamiweb.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Error { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Request successful")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<T> Fail(string message, string? error = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Data = default,
            Message = message,
            Error = error
        };
    }
}

public class PagedResponse<T> : ApiResponse<IEnumerable<T>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));

    public static PagedResponse<T> Create(IEnumerable<T> items, int totalCount, int page, int pageSize, string message = "Success")
    {
        return new PagedResponse<T>
        {
            Success = true,
            Data = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            Message = message
        };
    }
}
