# 🌾 GamiLearn Rural — AI-Powered Offline-First Gamified Learning Platform

**GamiLearn Rural** is an inclusive, multilingual, voice-enabled, and offline-capable educational platform built to empower rural and remote students with high-quality Computer Science, Engineering, and foundational learning.

---

## ✨ Key Features

### 1. 🎥 Live AI Teacher Google Meet Classroom
- **Interactive Live Video Classes**: Conducts 24/7 autonomous classes on Data Structures, C++, Java OOP, Docker, Git, and Cloud Engineering.
- **Clear & Audible AI Voice**: Built-in Web Speech Synthesis with real-time audio waveform visualization, volume/speed controls, and synchronized live captions.
- **Live Student Camera & Mic Integration**: Uses WebRTC (`getUserMedia`) so students appear on live video; when unmuted, the AI Teacher actively listens to the student's spoken questions and replies aloud.
- **Live Participants Grid**: Displays active class attendees (**Sanjay**, **Rishi**, **Saran**, **Kavitha**, **Karthik**, **Deepika**) along with raised-hand queues and in-call chat.

### 2. 🎙️ Multilingual Rural Voice Assistant
- **Real-Time Speech Recognition**: Supports hands-free voice navigation and Q&A in **Tamil (`ta-IN`)**, **Hindi (`hi-IN`)**, and **English (`en-IN`)**.
- **Auto-Silence Detection & Audible Replies**: Streams spoken words live on screen, automatically detects when you pause speaking, and speaks the answer aloud.

### 3. 🌐 Whole-Project Dynamic Localization
- Instant, full-page translation across **7 languages**:
  - 🇬🇧 **English** (`en`)
  - 🇮🇳 **தமிழ் / Tamil** (`ta`)
  - 🇮🇳 **हिंदी / Hindi** (`hi`)
  - 🇮🇳 **తెలుగు / Telugu** (`te`)
  - 🇮🇳 **বাংলা / Bengali** (`bn`)
  - 🇮🇳 **मराठी / Marathi** (`mr`)
  - 🇪🇸 **Español / Spanish** (`es`)
- Translates all navigation menus, sidebars, dashboards, buttons, and accessibility controls dynamically.

### 4. 📶 Offline-First Packet Store & Sync
- **Zero-Internet Study**: Students can download courses, video lectures, and AI notes into local storage packets.
- **Offline Simulation & Auto-Sync**: Built-in offline mode simulator that queues quiz scores and task completions locally and syncs them when connectivity returns.

### 5. 🏆 Gamification & Leaderboard
- **XP, Levels & Daily Streaks**: Earn XP for completing coding labs, watching lessons, and solving daily quizzes.
- **Class Leaderboard**: Track weekly, monthly, and all-time rankings alongside peers (**Sanjay**, **Rishi**, **Saran**, **Lakshmi Priya**, **Kavitha**).
- **CS Skill Badges**: Unlockable achievement badges with confetti celebrations.

### 6. ♿ Universal Accessibility & Inclusive Design
- **Indian Sign Language (ISL) Interpreter**: Floating Picture-in-Picture (PiP) sign language avatar for deaf and hard-of-hearing learners.
- **Visual Adaptations**: Text size scaling (`100%`, `115%`, `130%`), **High Contrast Mode (Yellow/Black)**, **Dark Mode**, and **Dyslexia-Friendly Typography**.

### 7. 🚪 Multi-Role Portals & Google Verification Auth
- **Student Portal**: **Sanjay** (Courses, AI Classroom, Daily Quiz, Task Planner, Timetable, Report Card).
- **Faculty Portal**: **Prof. Senthil Nathan** (Assign Lab Challenges, Batch Performance Analytics, Curriculum Management).
- **College Admin Command**: **Dr. Meenakshi Sundaram** (Institutional Analytics, Faculty Workload, Student Roster).
- **Parent Portal**: **Murugan** (Child's Weekly Progress, Attendance & Teacher Messaging).
- **Verified Google Sign-In Flow**: Multi-step Google account email verification and confirmation flow.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend (`my-gami/`)** | React 19, React Router v7, Tailwind CSS, Lucide React Icons, Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), WebRTC (`getUserMedia`) |
| **Backend (`Gamiweb/`)** | C# ASP.NET Core (.NET 10.0), Entity Framework Core, SQLite / RESTful Web APIs |

---

## 📂 Project Structure

```text
my project/
├── my-gami/                     # React Frontend Application
│   ├── public/                  # Static assets & manifest
│   └── src/
│       ├── components/
│       │   ├── ai/              # AIChatWindow, GoogleMeetClassroomModal
│       │   ├── common/          # Navbar, Sidebar, OfflineBanner, VoiceAssistantModal, SignLanguageModal
│       │   ├── course/          # VideoPlayer, CourseCard, CourseNotes
│       │   └── quiz/            # QuizCard, QuizSummary
│       ├── context/             # AuthContext, LanguageContext, AccessibilityContext, OfflineContext, GamificationContext
│       ├── data/                # translations.js, mockCourses.js, mockQuiz.js, mockLeaderboard.js, mockTimetable.js
│       ├── hooks/               # useSpeechRecognition.js
│       ├── pages/               # StudentDashboard, AITutorPage, CourseLibraryPage, QuizPage, AccessibilityPage, AuthPage, etc.
│       └── routes/              # AppRoutes.jsx
│
└── Gamiweb/                     # ASP.NET Core (.NET 10.0) Backend API
    ├── Controllers/             # REST API Controllers (Auth, Courses, Quiz, Leaderboard, Tasks)
    ├── Data/                    # AppDbContext & SeedData.cs
    ├── Models/                  # Entity Models (User, Course, Quiz, TaskItem, LeaderboardEntry)
    └── Program.cs               # Application entry & middleware configuration
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- **Node.js** (v18+ recommended) & **npm**
- **.NET SDK** (.NET 10.0)

### 1. Run the Frontend (`my-gami`)
```bash
cd my-gami
npm install
npm start
```
The React app will start at **[http://localhost:3000](http://localhost:3000)**.

To create a production build:
```bash
npm run build
```

### 2. Run the Backend API (`Gamiweb`)
```bash
cd Gamiweb
dotnet restore
dotnet build
dotnet run
```
The ASP.NET Core API will start and seed the initial database automatically.

---

## 🧪 Default Demo Profiles

You can switch between roles anytime using the **Quick Role Switcher** in the top navigation bar or via the **Login & Portals Gateway**:

- 🎒 **Student**: `Sanjay` (`sanjay@college-cs.edu`)
- 👨‍🏫 **Faculty**: `Prof. Senthil Nathan`
- 🏛️ **College Admin**: `Dr. Meenakshi Sundaram`
- 👨‍👧 **Parent**: `Murugan` (Monitoring student: `Sanjay`)
