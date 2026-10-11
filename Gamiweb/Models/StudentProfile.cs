using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

[Table("StudentProfiles")]
public class StudentProfile
{
    [Key, ForeignKey("User")]
    public string UserId { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Grade { get; set; } = "Class 8";

    [MaxLength(160)]
    public string SchoolName { get; set; } = "Bilaspur Govt High School";

    [MaxLength(120)]
    public string District { get; set; } = "Bilaspur, Chhattisgarh";

    public int XpPoints { get; set; } = 0;

    public int Level { get; set; } = 1;

    public int StreakCount { get; set; } = 0;

    public DateTime LastActiveDate { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual User? User { get; set; }
}

[Table("ParentStudentLinks")]
public class ParentStudentLink
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string ParentId { get; set; } = string.Empty;

    [Required]
    public string StudentId { get; set; } = string.Empty;

    public DateTime LinkedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("ParentId")]
    public virtual User? Parent { get; set; }

    [ForeignKey("StudentId")]
    public virtual User? Student { get; set; }
}
