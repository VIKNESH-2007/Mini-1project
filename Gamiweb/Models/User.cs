using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

public enum UserRole
{
    Student,
    Parent,
    Teacher
}

[Table("Users")]
public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(160)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; } = UserRole.Student;

    [MaxLength(10)]
    public string PreferredLanguage { get; set; } = "en";

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual StudentProfile? StudentProfile { get; set; }
    public virtual ICollection<ParentStudentLink> ParentLinks { get; set; } = new List<ParentStudentLink>();
    public virtual ICollection<ParentStudentLink> StudentLinks { get; set; } = new List<ParentStudentLink>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
