using BCrypt.Net;
using Gamiweb.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Gamiweb.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return; // DB already seeded
        }

        string defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("demopass123");

        // 1. Seed Users & Student Profiles
        var studentUser = new User
        {
            Id = "usr-student-01",
            Name = "Sanjay",
            Email = "sanjay@college-cs.edu",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Student,
            PreferredLanguage = "en",
            AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
            CreatedAt = DateTime.UtcNow
        };

        var studentProfile = new StudentProfile
        {
            UserId = studentUser.Id,
            Grade = "B.Tech Computer Science - Year 2",
            SchoolName = "Institute of Technology & Computer Science",
            District = "Engineering Campus",
            XpPoints = 2850,
            Level = 14,
            StreakCount = 18,
            LastActiveDate = DateTime.UtcNow
        };

        var parentUser = new User
        {
            Id = "usr-parent-01",
            Name = "Murugan",
            Email = "murugan@familymail.in",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Parent,
            PreferredLanguage = "en",
            AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=RameshParent",
            CreatedAt = DateTime.UtcNow
        };

        var teacherUser = new User
        {
            Id = "usr-teacher-01",
            Name = "Prof. Vikram Aditya",
            Email = "prof.aditya@cs-faculty.edu",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Teacher,
            PreferredLanguage = "en",
            AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=TeacherVikram",
            CreatedAt = DateTime.UtcNow
        };

        context.Users.AddRange(studentUser, parentUser, teacherUser);
        context.StudentProfiles.Add(studentProfile);

        // Parent - Student Link
        context.ParentStudentLinks.Add(new ParentStudentLink
        {
            ParentId = parentUser.Id,
            StudentId = studentUser.Id,
            LinkedAt = DateTime.UtcNow
        });

        // 2. Seed Courses & Modules (College Level CS, Languages & DevOps Tools)
        var courses = new List<Course>
        {
            new()
            {
                Id = "crs-cpp-01",
                Title = "Data Structures & Algorithms in C++",
                Subject = "Computer Science",
                Description = "Master modern C++ systems programming, pointer mechanics, STL containers, dynamic memory management, and algorithmic tree structures.",
                Language = "en",
                DifficultyLevel = "Intermediate",
                Grade = "Undergraduate CS",
                Instructor = "Prof. Vikram Aditya (Systems Architect)",
                Rating = 4.95,
                StudentsCount = 3840,
                DownloadableSizeMb = 28.4,
                ThumbnailUrl = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
                VideoUrl = "https://www.youtube-nocookie.com/embed/2ybLD6_2gKM",
                AiSummaryText = "Pointers store memory addresses of variables. Dereferencing accesses or mutates values directly in RAM. STL vectors provide dynamic arrays with amortized O(1) push_back.",
                AiKeyPointsJson = JsonSerializer.Serialize(new List<string>
                {
                    "Pointer Syntax: int* p = &a; stores address of variable a into pointer p.",
                    "Dereferencing: *p = 20; mutates the value stored at address p directly.",
                    "Linked List Node: Composed of data payload and a pointer to the next node struct.",
                    "BST Property: For every node N, left subtree values are < N and right subtree values are > N."
                }),
                Modules = new List<CourseModule>
                {
                    new() { Id = "les-cpp-01", Title = "1. C++ Pointers, References & Memory Addresses", SequenceOrder = 1, DurationMinutes = "12:30", VideoUrl = "https://www.youtube-nocookie.com/embed/2ybLD6_2gKM" },
                    new() { Id = "les-cpp-02", Title = "2. STL Vectors, Dynamic Arrays & Algorithmic Complexity", SequenceOrder = 2, DurationMinutes = "18:45", VideoUrl = "https://www.youtube-nocookie.com/embed/vLnPwxZdW4Y" },
                    new() { Id = "les-cpp-03", Title = "3. Singly & Doubly Linked Lists Implementation", SequenceOrder = 3, DurationMinutes = "16:20", VideoUrl = "https://www.youtube-nocookie.com/embed/o5wJkJJpKtM" },
                    new() { Id = "les-cpp-04", Title = "4. Binary Search Trees & Tree Traversals", SequenceOrder = 4, DurationMinutes = "17:15", VideoUrl = "https://www.youtube-nocookie.com/embed/qH6yxkw0u78" }
                }
            },
            new()
            {
                Id = "crs-java-02",
                Title = "Java Enterprise & Object-Oriented Software Engineering",
                Subject = "Software Engineering",
                Description = "Comprehensive deep-dive into Java 21, JVM bytecode execution, Object-Oriented Design Patterns, Collections Framework, and Multithreading.",
                Language = "en",
                DifficultyLevel = "Intermediate",
                Grade = "Undergraduate CS",
                Instructor = "Dr. Ananya Ray (Java Champion & Core Architect)",
                Rating = 4.9,
                StudentsCount = 4210,
                DownloadableSizeMb = 32.1,
                ThumbnailUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
                VideoUrl = "https://www.youtube-nocookie.com/embed/eIrMbAQSU34",
                AiSummaryText = "Java compiles into bytecode executed by the JVM. Object-oriented architecture enforces encapsulation, inheritance, polymorphism, and abstraction.",
                AiKeyPointsJson = JsonSerializer.Serialize(new List<string>
                {
                    "JVM Memory: Heap stores objects (garbage collected); Stack holds thread method frames.",
                    "Polymorphism: Dynamic method dispatch invokes child overrides at runtime.",
                    "Collections: HashMap provides average O(1) lookup via bucket arrays and hashing.",
                    "Concurrency: Thread pools and synchronized blocks protect critical sections from race conditions."
                }),
                Modules = new List<CourseModule>
                {
                    new() { Id = "les-java-01", Title = "1. Java Virtual Machine Architecture, Bytecode & Basics", SequenceOrder = 1, DurationMinutes = "14:10", VideoUrl = "https://www.youtube-nocookie.com/embed/eIrMbAQSU34" },
                    new() { Id = "les-java-02", Title = "2. OOP Principles: Encapsulation, Inheritance & Polymorphism", SequenceOrder = 2, DurationMinutes = "19:00", VideoUrl = "https://www.youtube-nocookie.com/embed/GoXwIVyNvX0" },
                    new() { Id = "les-java-03", Title = "3. Java Collections Framework: ArrayList, HashMap & Sets", SequenceOrder = 3, DurationMinutes = "18:25", VideoUrl = "https://www.youtube-nocookie.com/embed/BqQ0qR8kmw8" },
                    new() { Id = "les-java-04", Title = "4. Multithreading, Concurrency & Synchronization", SequenceOrder = 4, DurationMinutes = "18:25", VideoUrl = "https://www.youtube-nocookie.com/embed/091vJWjl1A4" }
                }
            },
            new()
            {
                Id = "crs-c-03",
                Title = "C Systems Programming & Low-Level Memory Management",
                Subject = "Systems Programming",
                Description = "Understand OS internals, explicit memory allocation with malloc and free, memory leaks, structs, and Unix system calls like fork and exec.",
                Language = "en",
                DifficultyLevel = "Advanced",
                Grade = "Undergraduate CS",
                Instructor = "Prof. Devansh Saxena (Unix Kernel Engineer)",
                Rating = 4.92,
                StudentsCount = 3120,
                DownloadableSizeMb = 24.6,
                ThumbnailUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                VideoUrl = "https://www.youtube-nocookie.com/embed/KJgsSFOSQv0",
                AiSummaryText = "In C, memory is manually managed. Heap memory allocated with malloc must be freed to avoid leaks. Structs map directly to byte layouts.",
                AiKeyPointsJson = JsonSerializer.Serialize(new List<string>
                {
                    "Allocation: malloc(n * sizeof(int)) allocates contiguous raw heap bytes.",
                    "Deallocation: free(p); p = NULL; prevents dangling pointers.",
                    "Unix fork: clones current process; returns 0 to child, PID to parent.",
                    "Pipes: provide unidirectional byte streaming IPC between processes."
                }),
                Modules = new List<CourseModule>
                {
                    new() { Id = "les-c-01", Title = "1. C Fundamentals, Memory Model & Compiling with GCC", SequenceOrder = 1, DurationMinutes = "13:40", VideoUrl = "https://www.youtube-nocookie.com/embed/KJgsSFOSQv0" },
                    new() { Id = "les-c-02", Title = "2. Dynamic Memory Allocation: malloc, calloc, realloc & free", SequenceOrder = 2, DurationMinutes = "16:50", VideoUrl = "https://www.youtube-nocookie.com/embed/zuegQmMdy8M" },
                    new() { Id = "les-c-03", Title = "3. C Structs, Bitfields, Unions & Padding", SequenceOrder = 3, DurationMinutes = "14:30", VideoUrl = "https://www.youtube-nocookie.com/embed/dqa0KMSMx2w" },
                    new() { Id = "les-c-04", Title = "4. Unix System Calls: fork, exec, pipes & Signals", SequenceOrder = 4, DurationMinutes = "15:00", VideoUrl = "https://www.youtube-nocookie.com/embed/IFEFVXvjiHY" }
                }
            },
            new()
            {
                Id = "crs-cs-04",
                Title = "Modern C# & ASP.NET Core Enterprise Web APIs",
                Subject = "Web & API Engineering",
                Description = "Build robust cloud REST APIs with C# 12, .NET 10, Entity Framework Core, LINQ queries, asynchronous programming, and Dependency Injection.",
                Language = "en",
                DifficultyLevel = "Intermediate",
                Grade = "Undergraduate CS",
                Instructor = "Er. Shreya Kulkarni (Cloud Solutions Architect)",
                Rating = 4.88,
                StudentsCount = 2950,
                DownloadableSizeMb = 29.8,
                ThumbnailUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
                VideoUrl = "https://www.youtube-nocookie.com/embed/gfkTfcpWqAY",
                AiSummaryText = "C# combines type-safety and object orientation with high performance on the cross-platform .NET runtime with built-in async/await and DI.",
                AiKeyPointsJson = JsonSerializer.Serialize(new List<string>
                {
                    "Value vs Reference: struct is stack-allocated; class is managed heap-allocated.",
                    "LINQ: Declarative query syntax for filtering and projection with deferred execution.",
                    "ASP.NET Core: Built-in Dependency Injection supporting Transient, Scoped, and Singleton.",
                    "EF Core: Translates LINQ expressions asynchronously into optimized database SQL."
                }),
                Modules = new List<CourseModule>
                {
                    new() { Id = "les-cs-01", Title = "1. C# Syntax, Value vs Reference Types & CLR", SequenceOrder = 1, DurationMinutes = "12:15", VideoUrl = "https://www.youtube-nocookie.com/embed/gfkTfcpWqAY" },
                    new() { Id = "les-cs-02", Title = "2. C# OOP, Interfaces, Abstract Classes & Generics", SequenceOrder = 2, DurationMinutes = "16:40", VideoUrl = "https://www.youtube-nocookie.com/embed/pTB0EiLXUC8" },
                    new() { Id = "les-cs-03", Title = "3. LINQ Queries, Delegates, Lambdas & Collections", SequenceOrder = 3, DurationMinutes = "15:20", VideoUrl = "https://www.youtube-nocookie.com/embed/z3PowDJKOSA" },
                    new() { Id = "les-cs-04", Title = "4. ASP.NET Core REST APIs, Dependency Injection & EF Core", SequenceOrder = 4, DurationMinutes = "16:45", VideoUrl = "https://www.youtube-nocookie.com/embed/BfEjDD8mWYg" }
                }
            },
            new()
            {
                Id = "crs-git-05",
                Title = "Git & GitHub Version Control & Team Workflows",
                Subject = "Developer Tools",
                Description = "Become fluent with Git CLI and GitHub: branching, merging, rebasing, resolving merge conflicts, collaborative pull requests, and CI/CD automation.",
                Language = "en",
                DifficultyLevel = "Essential",
                Grade = "All Levels & DevOps",
                Instructor = "Rohit Nair (Staff DevOps Engineer)",
                Rating = 4.98,
                StudentsCount = 6540,
                DownloadableSizeMb = 18.2,
                ThumbnailUrl = "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80",
                VideoUrl = "https://www.youtube-nocookie.com/embed/hwP7WQkmECE",
                AiSummaryText = "Git tracks directed acyclic graphs of cryptographic commit snapshots across working directory, staging area, and local/remote repositories.",
                AiKeyPointsJson = JsonSerializer.Serialize(new List<string>
                {
                    "Three States: Working tree (modified), Staging area (index), and Committed history.",
                    "Branching: Branches are fast 41-byte pointers to commit hashes.",
                    "Pull Requests: Feature branch PRs facilitate code review and automated CI test runs.",
                    "GitHub Actions: Automated workflows written in YAML triggered on push and pull requests."
                }),
                Modules = new List<CourseModule>
                {
                    new() { Id = "les-git-01", Title = "1. Git Architecture: Working Directory, Staging & Commits", SequenceOrder = 1, DurationMinutes = "11:20", VideoUrl = "https://www.youtube-nocookie.com/embed/hwP7WQkmECE" },
                    new() { Id = "les-git-02", Title = "2. Branching, Merging, Rebasing & Resolving Merge Conflicts", SequenceOrder = 2, DurationMinutes = "14:50", VideoUrl = "https://www.youtube-nocookie.com/embed/oPpnCh7InLY" },
                    new() { Id = "les-git-03", Title = "3. Remote Repositories, Forking & Collaborative Pull Requests", SequenceOrder = 3, DurationMinutes = "12:10", VideoUrl = "https://www.youtube-nocookie.com/embed/nCKdihvneS0" },
                    new() { Id = "les-git-04", Title = "4. GitHub Actions, CI/CD Pipelines & Automated Testing", SequenceOrder = 4, DurationMinutes = "12:40", VideoUrl = "https://www.youtube-nocookie.com/embed/R8_veQiYBjI" }
                }
            },
            new()
            {
                Id = "crs-docker-06",
                Title = "Docker & Containerization for Modern DevOps",
                Subject = "Cloud & DevOps",
                Description = "Build, package, and deploy isolated microservices using Docker containers, Dockerfile optimization, multi-stage builds, and Docker Compose.",
                Language = "en",
                DifficultyLevel = "Intermediate",
                Grade = "Undergraduate CS & DevOps",
                Instructor = "Siddharth Menon (Container Platform Architect)",
                Rating = 4.96,
                StudentsCount = 5230,
                DownloadableSizeMb = 22.7,
                ThumbnailUrl = "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
                VideoUrl = "https://www.youtube-nocookie.com/embed/Gjnup-PuquQ",
                AiSummaryText = "Containers share the host kernel and isolate processes using namespaces and cgroups. Multi-stage Dockerfiles produce compact production images.",
                AiKeyPointsJson = JsonSerializer.Serialize(new List<string>
                {
                    "Containers vs VMs: Containers share host kernel; VMs duplicate entire guest OS.",
                    "Layer Caching: Unchanged layers are cached. Place dependencies before app source.",
                    "Docker Volumes: Mount persistent host directories so DB records survive container recreation.",
                    "Compose: Orchestrates multi-container networks with declarative docker-compose.yml."
                }),
                Modules = new List<CourseModule>
                {
                    new() { Id = "les-docker-01", Title = "1. Containerization Concepts vs Virtual Machines", SequenceOrder = 1, DurationMinutes = "10:30", VideoUrl = "https://www.youtube-nocookie.com/embed/Gjnup-PuquQ" },
                    new() { Id = "les-docker-02", Title = "2. Writing Dockerfiles, Layer Caching & Multi-Stage Builds", SequenceOrder = 2, DurationMinutes = "15:45", VideoUrl = "https://www.youtube-nocookie.com/embed/3c-iBn73dDE" },
                    new() { Id = "les-docker-03", Title = "3. Docker Storage Volumes, Bind Mounts & Virtual Networks", SequenceOrder = 3, DurationMinutes = "14:15", VideoUrl = "https://www.youtube-nocookie.com/embed/pg19Z8LL06w" },
                    new() { Id = "les-docker-04", Title = "4. Docker Compose Multi-Container Orchestration", SequenceOrder = 4, DurationMinutes = "14:30", VideoUrl = "https://www.youtube-nocookie.com/embed/Qw9zlE3t8Ko" }
                }
            }
        };

        context.Courses.AddRange(courses);

        // Enroll student in Course 1 (C++)
        context.Enrollments.Add(new Enrollment
        {
            StudentId = studentUser.Id,
            CourseId = "crs-cpp-01",
            ProgressPercent = 45,
            Status = EnrollmentStatus.InProgress,
            EnrolledAt = DateTime.UtcNow.AddDays(-10)
        });

        // Offline downloaded content record
        context.DownloadedContents.Add(new DownloadedContent
        {
            StudentId = studentUser.Id,
            CourseId = "crs-cpp-01",
            DownloadedAt = DateTime.UtcNow.AddDays(-3),
            SyncStatus = "CachedOffline"
        });

        // 3. Seed Quizzes & Questions
        var dailyQuiz = new Quiz
        {
            Id = "quiz-daily-01",
            Title = "College Computer Science & Engineering Challenge",
            Subject = "Computer Science",
            Difficulty = "Intermediate",
            TimeLimitSeconds = 75,
            TotalXp = 100,
            Questions = new List<QuizQuestion>
            {
                new()
                {
                    Id = "q-01",
                    QuestionText = "Given int arr[] = {10, 20, 30, 40}; int *p = arr;, what is the value of *(p + 2) in C/C++?",
                    OptionsJson = JsonSerializer.Serialize(new List<string>
                    {
                        "10",
                        "20",
                        "30",
                        "40"
                    }),
                    CorrectOption = 2,
                    HintText = "Pointer arithmetic advances by data type size. *(p + 2) accesses arr[2].",
                    ExplanationText = "arr decays to a pointer to arr[0]. Adding 2 offsets the address by 2 ints, dereferencing arr[2] (30).",
                    XpValue = 25
                },
                new()
                {
                    Id = "q-02",
                    QuestionText = "In Java, what happens during runtime when an overridden method is invoked through a superclass reference variable?",
                    OptionsJson = JsonSerializer.Serialize(new List<string>
                    {
                        "The superclass method executes because of static binding",
                        "The subclass overridden method executes due to dynamic method dispatch",
                        "A ClassCastException is thrown at runtime",
                        "The Java compiler rejects the code with a compilation error"
                    }),
                    CorrectOption = 1,
                    HintText = "Think about Polymorphism and runtime vtable lookup.",
                    ExplanationText = "Java uses dynamic method dispatch. The JVM resolves the actual heap object type at runtime and executes the subclass override.",
                    XpValue = 25
                },
                new()
                {
                    Id = "q-03",
                    QuestionText = "What is the primary architectural difference between Docker containers and traditional Virtual Machines (VMs)?",
                    OptionsJson = JsonSerializer.Serialize(new List<string>
                    {
                        "Containers require a full guest operating system and hypervisor",
                        "Containers share the host OS kernel and use Linux namespaces/cgroups for isolation",
                        "Virtual Machines can only run on Linux, while containers run on any hardware",
                        "Docker containers emulate CPU hardware instructions directly"
                    }),
                    CorrectOption = 1,
                    HintText = "Consider how containers remain lightweight (megabytes vs gigabytes).",
                    ExplanationText = "Docker containers share the host kernel and use namespaces and cgroups, avoiding the heavy overhead of hypervisors and duplicate guest kernels.",
                    XpValue = 25
                },
                new()
                {
                    Id = "q-04",
                    QuestionText = "In Git, what is the key difference between git merge and git rebase when incorporating upstream changes?",
                    OptionsJson = JsonSerializer.Serialize(new List<string>
                    {
                        "Merge rewrites commit hashes, while rebase preserves exact historical commits",
                        "Merge creates a non-destructive 3-way merge commit, while rebase rewrites history linearly by replaying commits",
                        "Rebase deletes the current working tree files",
                        "Git merge can only be run once per repository"
                    }),
                    CorrectOption = 1,
                    HintText = "One preserves divergent branch topology; the other produces a linear commit history.",
                    ExplanationText = "git merge creates a 3-way merge commit connecting two parent branches. git rebase replays commits on top of the target base, creating a linear history.",
                    XpValue = 25
                }
            }
        };

        context.Quizzes.Add(dailyQuiz);

        // 4. Seed Badges
        var badges = new List<Badge>
        {
            new() { Id = "bdg-streak-7", Name = "7-Day Flame", Category = "Consistency", IconEmoji = "🔥", Description = "Studied for 7 consecutive days without missing a lab session.", Rarity = "Common", XpReward = 100, RequirementType = "Streak", RequirementValue = 7 },
            new() { Id = "bdg-cpp-master", Name = "C++ Systems Architect", Category = "Mastery", IconEmoji = "⚡", Description = "Mastered C++ pointers, references, and binary search trees.", Rarity = "Epic", XpReward = 350, RequirementType = "CourseCompleted", RequirementValue = 1 },
            new() { Id = "bdg-devops-pro", Name = "DevOps & Docker Ninja", Category = "Cloud", IconEmoji = "🐳", Description = "Built and deployed multi-container applications with Docker Compose.", Rarity = "Rare", XpReward = 300, RequirementType = "DevOpsChallenge", RequirementValue = 1 },
            new() { Id = "bdg-git-guru", Name = "Git & CI/CD Master", Category = "Tools", IconEmoji = "🐙", Description = "Resolved complex merge conflicts and automated GitHub Actions workflows.", Rarity = "Rare", XpReward = 250, RequirementType = "GitChallenge", RequirementValue = 1 },
            new() { Id = "bdg-streak-30", Name = "30-Day Legend", Category = "Consistency", IconEmoji = "🏆", Description = "Maintain a flawless 30-day continuous coding streak.", Rarity = "Legendary", XpReward = 1000, RequirementType = "Streak", RequirementValue = 30 }
        };

        context.Badges.AddRange(badges);

        // Award student the 7-day flame badge
        context.StudentBadges.Add(new StudentBadge
        {
            StudentId = studentUser.Id,
            BadgeId = "bdg-streak-7",
            EarnedAt = DateTime.UtcNow.AddDays(-2)
        });

        // 5. Seed Leaderboard Snapshots
        var leaderboardEntries = new List<LeaderboardSnapshot>
        {
            new() { StudentId = "usr-02", StudentName = "Rishi", SchoolName = "Madurai Tech Institute", District = "Madurai", XpPoints = 3450, Rank = 1, Streak = 28, Level = 18, AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Rishi", Period = LeaderboardPeriod.Weekly },
            new() { StudentId = "usr-03", StudentName = "Lakshmi Priya", SchoolName = "Anna University CompSci", District = "Chennai", XpPoints = 3280, Rank = 2, Streak = 24, Level = 17, AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Lakshmi", Period = LeaderboardPeriod.Weekly },
            new() { StudentId = "usr-04", StudentName = "Saran", SchoolName = "Coimbatore Tech Engineering", District = "Coimbatore", XpPoints = 3110, Rank = 3, Streak = 20, Level = 16, AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Saran", Period = LeaderboardPeriod.Weekly },
            new() { StudentId = studentUser.Id, StudentName = "Sanjay (You)", SchoolName = "Institute of Technology & CS", District = "Campus", XpPoints = 2850, Rank = 4, Streak = 18, Level = 14, AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay", Period = LeaderboardPeriod.Weekly }
        };

        context.LeaderboardSnapshots.AddRange(leaderboardEntries);

        // 6. Seed Timetable Sessions (College Schedule)
        var timetableSessions = new List<TimetableSession>
        {
            new() { StudentId = studentUser.Id, Subject = "Computer Science", Topic = "Data Structures in C++: Pointers & Linked Lists", DayOfWeek = "Monday", StartTime = "08:30 AM", EndTime = "10:00 AM", RoomOrLink = "Systems & Algorithms Lab (CS-101)", ReminderEnabled = true, IsCompleted = true },
            new() { StudentId = studentUser.Id, Subject = "Software Engineering", Topic = "Java OOP Architecture & JVM Internals", DayOfWeek = "Monday", StartTime = "10:30 AM", EndTime = "12:00 PM", RoomOrLink = "Lecture Hall A - CompSci Wing", ReminderEnabled = true, IsCompleted = true },
            new() { StudentId = studentUser.Id, Subject = "Developer Tools", Topic = "Git & GitHub: Branching, Pull Requests & Team CI/CD", DayOfWeek = "Tuesday", StartTime = "09:00 AM", EndTime = "10:30 AM", RoomOrLink = "DevOps & Cloud Lab (CS-204)", ReminderEnabled = true, IsCompleted = true },
            new() { StudentId = studentUser.Id, Subject = "Systems Programming", Topic = "C Low-Level Programming & Dynamic Memory (malloc/free)", DayOfWeek = "Wednesday", StartTime = "08:30 AM", EndTime = "10:00 AM", RoomOrLink = "Hardware & Operating Systems Lab", ReminderEnabled = true, IsCompleted = false },
            new() { StudentId = studentUser.Id, Subject = "Cloud & DevOps", Topic = "Docker Containers, Microservices & Dockerfile Mastery", DayOfWeek = "Thursday", StartTime = "11:00 AM", EndTime = "12:30 PM", RoomOrLink = "Cloud Virtualization Center", ReminderEnabled = true, IsCompleted = false },
            new() { StudentId = studentUser.Id, Subject = "Web & API Engineering", Topic = "Modern C# & ASP.NET Core REST APIs with Entity Framework", DayOfWeek = "Friday", StartTime = "09:30 AM", EndTime = "11:00 AM", RoomOrLink = "Enterprise Architecture Lab", ReminderEnabled = true, IsCompleted = false }
        };

        context.TimetableSessions.AddRange(timetableSessions);

        // 7. Seed Student Tasks (Interactive Task Scheduling & Progress Tracking)
        var studentTasks = new List<StudentTask>
        {
            new()
            {
                Id = "task-01",
                StudentId = studentUser.Id,
                Title = "Implement Doubly Linked List with Head & Tail Pointers",
                Description = "Write C++ class with insertAtHead, insertAtTail, deleteNode, and reverseTraversal methods.",
                Subject = "Computer Science",
                Category = "Coding Lab",
                Priority = "High",
                DueDate = DateTime.UtcNow.Date.AddHours(14),
                EstimatedMinutes = 60,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddHours(-3),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                ReminderEnabled = true
            },
            new()
            {
                Id = "task-02",
                StudentId = studentUser.Id,
                Title = "Watch Java Collections & HashMap Bucket Internals",
                Description = "Study how hash codes map to bucket indices and how tree bins handle hash collisions.",
                Subject = "Software Engineering",
                Category = "Lecture Review",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.Date.AddHours(17),
                EstimatedMinutes = 45,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddHours(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                ReminderEnabled = true
            },
            new()
            {
                Id = "task-03",
                StudentId = studentUser.Id,
                Title = "Dockerize React Frontend & ASP.NET Core API",
                Description = "Author multi-stage Dockerfiles and docker-compose.yml with bridge network and persistent volume.",
                Subject = "Cloud & DevOps",
                Category = "Project Sprint",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(1).Date.AddHours(16),
                EstimatedMinutes = 90,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                ReminderEnabled = true
            },
            new()
            {
                Id = "task-04",
                StudentId = studentUser.Id,
                Title = "Git Interactive Rebase & Conflict Resolution Sprint",
                Description = "Practice squashing feature commits and resolving 3-way conflict markers cleanly in Git CLI.",
                Subject = "Developer Tools",
                Category = "Coding Lab",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(2).Date.AddHours(11),
                EstimatedMinutes = 40,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                ReminderEnabled = true
            },
            new()
            {
                Id = "task-05",
                StudentId = studentUser.Id,
                Title = "C Dynamic Memory & Valgrind Memory Leak Audit",
                Description = "Debug dangling pointers, check for buffer overflows, and ensure all malloc blocks are freed.",
                Subject = "Systems Programming",
                Category = "Debugging",
                Priority = "High",
                DueDate = DateTime.UtcNow.AddDays(3).Date.AddHours(15),
                EstimatedMinutes = 50,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                ReminderEnabled = true
            },
            new()
            {
                Id = "task-06",
                StudentId = studentUser.Id,
                Title = "Build RESTful Endpoints with EF Core & C#",
                Description = "Create async controller endpoints with dependency injection and DTO validations in .NET 10.",
                Subject = "Web & API Engineering",
                Category = "Project Sprint",
                Priority = "Medium",
                DueDate = DateTime.UtcNow.AddDays(4).Date.AddHours(18),
                EstimatedMinutes = 75,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                ReminderEnabled = true
            }
        };

        context.StudentTasks.AddRange(studentTasks);

        await context.SaveChangesAsync();
    }
}
