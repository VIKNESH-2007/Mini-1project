using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/timetable")]
public class TimetableController : ControllerBase
{
    private readonly AppDbContext _context;

    public TimetableController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{studentId}")]
    public async Task<ActionResult<ApiResponse<List<TimetableSessionDto>>>> GetTimetable(string studentId)
    {
        var sessions = await _context.TimetableSessions
            .Where(t => t.StudentId == studentId)
            .OrderBy(t => t.DayOfWeek)
            .ToListAsync();

        var dtos = sessions.Select(t => new TimetableSessionDto
        {
            Id = t.Id,
            DayOfWeek = t.DayOfWeek,
            Subject = t.Subject,
            Topic = t.Topic,
            StartTime = t.StartTime,
            EndTime = t.EndTime,
            Room = t.RoomOrLink,
            Status = t.IsCompleted ? "completed" : "upcoming",
            Color = t.Subject == "Mathematics" ? "bg-blue-500" :
                    t.Subject == "Science" ? "bg-emerald-500" :
                    t.Subject == "Agriculture" ? "bg-amber-500" :
                    t.Subject == "Digital Skills" ? "bg-purple-500" : "bg-rose-500",
            BadgeColor = "bg-brand-100 text-brand-800",
            OfflineReady = t.ReminderEnabled
        }).ToList();

        return Ok(ApiResponse<List<TimetableSessionDto>>.Ok(dtos));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TimetableSessionDto>>> CreateSession([FromBody] CreateTimetableSessionDto dto)
    {
        var session = new TimetableSession
        {
            StudentId = dto.StudentId,
            Subject = dto.Subject,
            Topic = dto.Topic,
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            ReminderEnabled = dto.OfflineReady,
            RoomOrLink = "Home Study / Offline Tab",
            IsCompleted = false
        };

        _context.TimetableSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<TimetableSessionDto>.Ok(new TimetableSessionDto
        {
            Id = session.Id,
            DayOfWeek = session.DayOfWeek,
            Subject = session.Subject,
            Topic = session.Topic,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            OfflineReady = session.ReminderEnabled,
            Status = "upcoming"
        }, "Session created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateSession(string id, [FromBody] CreateTimetableSessionDto dto)
    {
        var session = await _context.TimetableSessions.FindAsync(id);
        if (session == null)
        {
            return NotFound(ApiResponse<string>.Fail("Timetable session not found."));
        }

        session.Subject = dto.Subject;
        session.Topic = dto.Topic;
        session.DayOfWeek = dto.DayOfWeek;
        session.StartTime = dto.StartTime;
        session.EndTime = dto.EndTime;
        session.ReminderEnabled = dto.OfflineReady;

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("Session updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteSession(string id)
    {
        var session = await _context.TimetableSessions.FindAsync(id);
        if (session == null)
        {
            return NotFound(ApiResponse<string>.Fail("Timetable session not found."));
        }

        _context.TimetableSessions.Remove(session);
        await _context.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("Session deleted successfully"));
    }
}
