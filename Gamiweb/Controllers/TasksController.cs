using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/tasks")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{studentId}")]
    public async Task<ActionResult<ApiResponse<List<StudentTaskDto>>>> GetTasks(
        string studentId,
        [FromQuery] string? status = null,
        [FromQuery] string? subject = null,
        [FromQuery] string? priority = null)
    {
        var query = _context.StudentTasks
            .Where(t => t.StudentId == studentId)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(subject) && subject != "All")
        {
            query = query.Where(t => t.Subject == subject);
        }

        if (!string.IsNullOrWhiteSpace(priority) && priority != "All")
        {
            query = query.Where(t => t.Priority == priority);
        }

        var now = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(status))
        {
            switch (status.ToLower())
            {
                case "completed":
                    query = query.Where(t => t.IsCompleted);
                    break;
                case "in-progress":
                case "pending":
                    query = query.Where(t => !t.IsCompleted && t.DueDate >= now);
                    break;
                case "overdue":
                    query = query.Where(t => !t.IsCompleted && t.DueDate < now);
                    break;
                case "today":
                    var startOfDay = now.Date;
                    var endOfDay = startOfDay.AddDays(1);
                    query = query.Where(t => t.DueDate >= startOfDay && t.DueDate < endOfDay);
                    break;
                case "upcoming":
                    query = query.Where(t => !t.IsCompleted && t.DueDate >= now);
                    break;
            }
        }

        var tasks = await query
            .OrderBy(t => t.IsCompleted)
            .ThenBy(t => t.DueDate)
            .Select(t => new StudentTaskDto
            {
                Id = t.Id,
                StudentId = t.StudentId,
                Title = t.Title,
                Description = t.Description,
                Subject = t.Subject,
                Category = t.Category,
                Priority = t.Priority,
                DueDate = t.DueDate,
                EstimatedMinutes = t.EstimatedMinutes,
                IsCompleted = t.IsCompleted,
                CompletedAt = t.CompletedAt,
                CreatedAt = t.CreatedAt,
                ReminderEnabled = t.ReminderEnabled
            })
            .ToListAsync();

        return Ok(ApiResponse<List<StudentTaskDto>>.Ok(tasks));
    }

    [HttpGet("{studentId}/progress")]
    public async Task<ActionResult<ApiResponse<TaskProgressSummaryDto>>> GetProgress(string studentId)
    {
        var tasks = await _context.StudentTasks
            .Where(t => t.StudentId == studentId)
            .ToListAsync();

        var now = DateTime.UtcNow;
        var total = tasks.Count;
        var completed = tasks.Count(t => t.IsCompleted);
        var pending = tasks.Count(t => !t.IsCompleted);
        var overdue = tasks.Count(t => !t.IsCompleted && t.DueDate < now);

        double rate = total > 0 ? Math.Round((double)completed / total * 100, 1) : 0;
        int totalMinutes = tasks.Sum(t => t.EstimatedMinutes);
        int completedMinutes = tasks.Where(t => t.IsCompleted).Sum(t => t.EstimatedMinutes);

        var subjects = new[]
        {
            "Computer Science",
            "Software Engineering",
            "Systems Programming",
            "Web & API Engineering",
            "Developer Tools",
            "Cloud & DevOps"
        };

        var subjectProgress = subjects.Select(sub =>
        {
            var subTasks = tasks.Where(t => t.Subject == sub).ToList();
            int subTotal = subTasks.Count;
            int subDone = subTasks.Count(t => t.IsCompleted);
            double subRate = subTotal > 0 ? Math.Round((double)subDone / subTotal * 100, 1) : 0;

            return new SubjectTaskProgressDto
            {
                Subject = sub,
                Total = subTotal,
                Completed = subDone,
                ProgressPercent = subRate
            };
        }).ToList();

        var categoryCounts = tasks
            .GroupBy(t => t.Category)
            .Select(g => new CategoryTaskCountDto
            {
                Category = g.Key,
                Count = g.Count()
            })
            .ToList();

        var summary = new TaskProgressSummaryDto
        {
            TotalTasks = total,
            CompletedTasks = completed,
            PendingTasks = pending,
            OverdueTasks = overdue,
            CompletionRatePercent = rate,
            TotalEstimatedMinutes = totalMinutes,
            CompletedMinutes = completedMinutes,
            SubjectProgress = subjectProgress,
            CategoryCounts = categoryCounts
        };

        return Ok(ApiResponse<TaskProgressSummaryDto>.Ok(summary));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<StudentTaskDto>>> CreateTask([FromBody] CreateStudentTaskDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest(ApiResponse<StudentTaskDto>.Fail("Title is required."));
        }

        var task = new StudentTask
        {
            StudentId = dto.StudentId,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            Subject = string.IsNullOrWhiteSpace(dto.Subject) ? "Computer Science" : dto.Subject,
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "Coding Lab" : dto.Category,
            Priority = string.IsNullOrWhiteSpace(dto.Priority) ? "Medium" : dto.Priority,
            DueDate = dto.DueDate ?? DateTime.UtcNow.AddDays(1),
            EstimatedMinutes = dto.EstimatedMinutes > 0 ? dto.EstimatedMinutes : 45,
            ReminderEnabled = dto.ReminderEnabled,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.StudentTasks.Add(task);
        await _context.SaveChangesAsync();

        var resultDto = new StudentTaskDto
        {
            Id = task.Id,
            StudentId = task.StudentId,
            Title = task.Title,
            Description = task.Description,
            Subject = task.Subject,
            Category = task.Category,
            Priority = task.Priority,
            DueDate = task.DueDate,
            EstimatedMinutes = task.EstimatedMinutes,
            IsCompleted = task.IsCompleted,
            CompletedAt = task.CompletedAt,
            CreatedAt = task.CreatedAt,
            ReminderEnabled = task.ReminderEnabled
        };

        return CreatedAtAction(nameof(GetTasks), new { studentId = task.StudentId }, ApiResponse<StudentTaskDto>.Ok(resultDto, "Task created successfully."));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<StudentTaskDto>>> UpdateTask(string id, [FromBody] UpdateStudentTaskDto dto)
    {
        var task = await _context.StudentTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<StudentTaskDto>.Fail("Task not found."));
        }

        if (dto.Title != null) task.Title = dto.Title.Trim();
        if (dto.Description != null) task.Description = dto.Description.Trim();
        if (dto.Subject != null) task.Subject = dto.Subject;
        if (dto.Category != null) task.Category = dto.Category;
        if (dto.Priority != null) task.Priority = dto.Priority;
        if (dto.DueDate.HasValue) task.DueDate = dto.DueDate.Value;
        if (dto.EstimatedMinutes.HasValue) task.EstimatedMinutes = dto.EstimatedMinutes.Value;
        if (dto.ReminderEnabled.HasValue) task.ReminderEnabled = dto.ReminderEnabled.Value;

        if (dto.IsCompleted.HasValue)
        {
            task.IsCompleted = dto.IsCompleted.Value;
            task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;
        }

        await _context.SaveChangesAsync();

        var resultDto = new StudentTaskDto
        {
            Id = task.Id,
            StudentId = task.StudentId,
            Title = task.Title,
            Description = task.Description,
            Subject = task.Subject,
            Category = task.Category,
            Priority = task.Priority,
            DueDate = task.DueDate,
            EstimatedMinutes = task.EstimatedMinutes,
            IsCompleted = task.IsCompleted,
            CompletedAt = task.CompletedAt,
            CreatedAt = task.CreatedAt,
            ReminderEnabled = task.ReminderEnabled
        };

        return Ok(ApiResponse<StudentTaskDto>.Ok(resultDto, "Task updated successfully."));
    }

    [HttpPatch("{id}/toggle")]
    public async Task<ActionResult<ApiResponse<StudentTaskDto>>> ToggleTaskCompletion(string id)
    {
        var task = await _context.StudentTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<StudentTaskDto>.Fail("Task not found."));
        }

        task.IsCompleted = !task.IsCompleted;
        task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;

        // If completed, award XP to student profile
        if (task.IsCompleted)
        {
            var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == task.StudentId);
            if (profile != null)
            {
                profile.XpPoints += 40; // 40 XP reward for task completion
                profile.LastActiveDate = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        var resultDto = new StudentTaskDto
        {
            Id = task.Id,
            StudentId = task.StudentId,
            Title = task.Title,
            Description = task.Description,
            Subject = task.Subject,
            Category = task.Category,
            Priority = task.Priority,
            DueDate = task.DueDate,
            EstimatedMinutes = task.EstimatedMinutes,
            IsCompleted = task.IsCompleted,
            CompletedAt = task.CompletedAt,
            CreatedAt = task.CreatedAt,
            ReminderEnabled = task.ReminderEnabled
        };

        return Ok(ApiResponse<StudentTaskDto>.Ok(resultDto, task.IsCompleted ? "Task marked completed! +40 XP earned." : "Task marked incomplete."));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteTask(string id)
    {
        var task = await _context.StudentTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<bool>.Fail("Task not found."));
        }

        _context.StudentTasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Ok(true, "Task deleted successfully."));
    }
}
