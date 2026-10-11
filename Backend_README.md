# ⚙️ GamiLearn Rural — Backend API Documentation (`Gamiweb`)

This file documents the **ASP.NET Core (.NET 10.0) Web API Backend (`Gamiweb`)** for **GamiLearn Rural**, providing authentication, gamification (XP, streaks, badges, leaderboards), offline synchronization, AI tutoring, lesson summarization, and ML student performance prediction.

---

## ✨ Key Backend Capabilities

### 1. 🔐 JWT Authentication & Role-Based Authorization
- **JWT Bearer Security**: Stateless token authentication via `JwtService` using HMAC-SHA256 signing.
- **Role Policies**:
  - `StudentOnly` (`Role = "Student"`)
  - `TeacherOnly` (`Role = "Teacher"`)
  - `ParentOnly` (`Role = "Parent"`)

### 2. 🗄️ Resilient Database Architecture (`AppDbContext` & `SeedData`)
- **MySQL + Automatic In-Memory Fallback**: Supports production MySQL (`Pomelo.EntityFrameworkCore.MySql`) and automatically falls back to EF Core In-Memory Database (`GamiwebDb`) if MySQL is not running locally—ensuring zero-configuration startup.
- **Automatic Startup Seeding (`SeedData.cs`)**: Seeds default Tamil student profiles (**Sanjay**, **Rishi**, **Saran**, **Kavitha**, **Karthik**, **Deepika**), parent (**Murugan**), faculty (**Prof. Senthil Nathan**), courses, quizzes, badges, and leaderboard standings.

### 3. 🧠 AI & Machine Learning Services (`Services/`)
- **`AiTutorService` (`IAiTutorService`)**: Processes student doubts and returns contextual multilingual AI teacher explanations.
- **`AiSummarizerService` (`IAiSummarizerService`)**: Generates concise lesson summaries and key takeaways for offline study notes.
- **`MlPredictionService` (`IMlPredictionService`)**: Predicts student mastery, risk levels, and recommended study interventions based on quiz scores and attendance consistency.
- **`RecommendationService` (`IRecommendationService`)**: Recommends personalized next courses and coding labs.

### 4. 🏆 Gamification Engine (`XpService` & `BadgeService`)
- **`XpService` (`IXpService`)**: Calculates XP rewards, level progression, and daily learning streaks.
- **`BadgeService` (`IBadgeService`)**: Evaluates and unlocks CS achievement badges automatically.

### 5. 📖 Offline-Ready Swagger OpenAPI UI
- Integrated Swagger UI at `/swagger` with JWT Bearer token input and offline-safe configuration (external validator disabled so it loads instantaneously even without internet).

---

## 📂 Backend Directory Structure

```text
Gamiweb/
├── Controllers/                 # RESTful API Endpoints (Auth, Courses, Quizzes, Leaderboard, AI, Analytics)
├── Data/
│   ├── AppDbContext.cs          # Entity Framework Core DbContext
│   └── SeedData.cs              # Initial data seeding (Sanjay, Rishi, Saran, Courses, Badges)
├── DTOs/                        # Request & Response Data Transfer Objects
├── Middleware/
│   └── GlobalExceptionMiddleware.cs # Centralized error handling & JSON problem responses
├── Models/                      # Database Entities (User, Course, Lesson, Quiz, Badge, Leaderboard)
├── Services/                    # Business Logic, JWT, XP, Badges, AI Tutor, ML Prediction
├── appsettings.json             # Configuration (DB Connection, JWT Settings)
├── Gamiweb.csproj               # .NET 10.0 Project File & NuGet Packages
└── Program.cs                   # Dependency Injection, Auth, CORS & Middleware Pipeline
```

---

## 🚀 How to Build & Run Backend

```bash
cd Gamiweb
dotnet restore
dotnet build
dotnet run
```
- Swagger API UI: `http://localhost:5000/swagger`
