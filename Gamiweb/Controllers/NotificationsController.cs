using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotificationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<ApiResponse<List<object>>>> GetNotifications(string userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(30)
            .Select(n => new
            {
                n.Id,
                n.Title,
                n.Message,
                Type = n.Type.ToString(),
                n.ReadStatus,
                CreatedAt = n.CreatedAt.ToString("o")
            })
            .ToListAsync();

        return Ok(ApiResponse<List<object>>.Ok(notifications.Cast<object>().ToList()));
    }

    [HttpPatch("{id}/read")]
    public async Task<ActionResult<ApiResponse<string>>> MarkAsRead(string id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null)
        {
            return NotFound(ApiResponse<string>.Fail("Notification not found."));
        }

        notification.ReadStatus = true;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<string>.Ok("Notification marked as read"));
    }
}
