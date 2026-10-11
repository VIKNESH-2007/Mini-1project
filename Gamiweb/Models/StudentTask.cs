using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

[Table("StudentTasks")]
public class StudentTask
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Subject { get; set; } = "Computer Science";

    [MaxLength(50)]
    public string Category { get; set; } = "Coding Lab"; // Coding Lab, Lecture Review, Project Sprint, Quiz Practice, Revision

    [MaxLength(30)]
    public string Priority { get; set; } = "Medium"; // High, Medium, Low

    public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(1);

    public int EstimatedMinutes { get; set; } = 45;

    public bool IsCompleted { get; set; } = false;

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool ReminderEnabled { get; set; } = true;
}
