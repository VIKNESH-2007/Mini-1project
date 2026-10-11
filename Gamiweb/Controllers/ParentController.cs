using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/parent")]
public class ParentController : ControllerBase
{
    private readonly AppDbContext _context;

    public ParentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{parentId}/children")]
    public async Task<ActionResult<ApiResponse<List<ParentChildDto>>>> GetChildren(string parentId)
    {
        var links = await _context.ParentStudentLinks
            .Include(l => l.Student)
            .ThenInclude(s => s!.StudentProfile)
            .Where(l => l.ParentId == parentId)
            .ToListAsync();

        var children = links.Select(l =>
        {
            var s = l.Student;
            var sp = s?.StudentProfile;

            return new ParentChildDto
            {
                StudentId = s?.Id ?? string.Empty,
                Name = s?.Name ?? "Student",
                Grade = sp?.Grade ?? "Class 8",
                SchoolName = sp?.SchoolName ?? "Rural School",
                XpPoints = sp?.XpPoints ?? 0,
                Level = sp?.Level ?? 1,
                StreakCount = sp?.StreakCount ?? 0,
                AttendanceRate = 100.0,
                DailyStudyMinutes = 62,
                RecentMilestones = new List<string>
                {
                    "Maintained 7-day study streak",
                    "Scored 100% on Market Fractions Quiz",
                    "Completed organic vermicomposting experiment"
                }
            };
        }).ToList();

        return Ok(ApiResponse<List<ParentChildDto>>.Ok(children));
    }

    [HttpPost("message-teacher")]
    public async Task<ActionResult<ApiResponse<string>>> MessageTeacher([FromBody] SendTeacherMessageDto message)
    {
        if (string.IsNullOrWhiteSpace(message.MessageText))
        {
            return BadRequest(ApiResponse<string>.Fail("Message cannot be empty."));
        }

        var teacher = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Teacher);
        var teacherId = !string.IsNullOrEmpty(message.TeacherId) ? message.TeacherId : teacher?.Id ?? "usr-teacher-01";

        _context.TeacherMessages.Add(new TeacherMessage
        {
            SenderId = message.ParentId,
            ReceiverId = teacherId,
            StudentId = message.StudentId,
            MessageText = message.MessageText,
            SentAt = DateTime.UtcNow
        });

        _context.Notifications.Add(new Notification
        {
            UserId = teacherId,
            Title = "New Parent Message",
            Message = $"You received a message regarding student progress: \"{message.MessageText}\"",
            Type = NotificationType.Message
        });

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("Message delivered to teacher successfully."));
    }

    [HttpGet("{studentId}/milestones")]
    public async Task<ActionResult<ApiResponse<List<object>>>> GetMilestones(string studentId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == studentId && n.Type == NotificationType.Milestone)
            .OrderByDescending(n => n.CreatedAt)
            .Take(10)
            .Select(n => new
            {
                n.Id,
                n.Title,
                n.Message,
                Date = n.CreatedAt.ToString("MMM dd, yyyy h:mm tt")
            })
            .ToListAsync();

        return Ok(ApiResponse<List<object>>.Ok(notifications.Cast<object>().ToList()));
    }
}
