using Microsoft.EntityFrameworkCore;
using Gamiweb.Models;

namespace Gamiweb.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<ParentStudentLink> ParentStudentLinks => Set<ParentStudentLink>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseModule> CourseModules => Set<CourseModule>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<DownloadedContent> DownloadedContents => Set<DownloadedContent>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizAttempt> QuizAttempts => Set<QuizAttempt>();
    public DbSet<QuizAnswer> QuizAnswers => Set<QuizAnswer>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<StudentBadge> StudentBadges => Set<StudentBadge>();
    public DbSet<LeaderboardSnapshot> LeaderboardSnapshots => Set<LeaderboardSnapshot>();
    public DbSet<TimetableSession> TimetableSessions => Set<TimetableSession>();
    public DbSet<AiTutorConversation> AiTutorConversations => Set<AiTutorConversation>();
    public DbSet<ProgressReport> ProgressReports => Set<ProgressReport>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<TeacherMessage> TeacherMessages => Set<TeacherMessage>();
    public DbSet<StudentTask> StudentTasks => Set<StudentTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User - StudentProfile 1:1
        modelBuilder.Entity<User>()
            .HasOne(u => u.StudentProfile)
            .WithOne(sp => sp.User)
            .HasForeignKey<StudentProfile>(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ParentStudentLinks foreign keys
        modelBuilder.Entity<ParentStudentLink>()
            .HasOne(l => l.Parent)
            .WithMany(u => u.ParentLinks)
            .HasForeignKey(l => l.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ParentStudentLink>()
            .HasOne(l => l.Student)
            .WithMany(u => u.StudentLinks)
            .HasForeignKey(l => l.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // TeacherMessage relationships
        modelBuilder.Entity<TeacherMessage>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TeacherMessage>()
            .HasOne(m => m.Receiver)
            .WithMany()
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indices
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Enrollment>().HasIndex(e => new { e.StudentId, e.CourseId });
        modelBuilder.Entity<QuizAttempt>().HasIndex(qa => qa.StudentId);
        modelBuilder.Entity<LeaderboardSnapshot>().HasIndex(ls => new { ls.Period, ls.Rank });
    }
}
