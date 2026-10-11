export const mockBadges = [
  {
    id: "bdg-streak-7",
    title: "7-Day Code Flame",
    category: "Consistency",
    icon: "🔥",
    description: "Coded and studied for 7 consecutive days without breaking your streak.",
    procedure: [
      "Step 1: Log in daily to your student dashboard or course library.",
      "Step 2: Watch at least one video lecture or complete a scheduled coding lab.",
      "Step 3: Solve today's daily quiz question to keep your active streak counter alive for 7 days."
    ],
    unlocked: true,
    unlockedDate: "Sep 22, 2026",
    rarity: "Common",
    xpReward: 100,
    actionText: "Check Daily Streak",
    actionLink: "/dashboard"
  },
  {
    id: "bdg-cpp-master",
    title: "C++ Pointer Master",
    category: "Languages",
    icon: "💻",
    description: "Mastered memory addresses, pointer dereferencing, and dynamic heap memory.",
    procedure: [
      "Step 1: Watch the 'Pointers, References & Dynamic Memory' lecture in the C++ Course.",
      "Step 2: Implement a Doubly Linked List with head and tail pointers and zero memory leaks.",
      "Step 3: Score 85%+ on the C++ Pointers and Memory Management Quiz."
    ],
    unlocked: true,
    unlockedDate: "Sep 24, 2026",
    rarity: "Rare",
    xpReward: 250,
    actionText: "Open C++ Course",
    actionLink: "/course/crs-cpp-01"
  },
  {
    id: "bdg-java-architect",
    title: "Java OOP Architect",
    category: "Architecture",
    icon: "☕",
    description: "Designed robust classes using Encapsulation, Polymorphism, and Interface contracts.",
    procedure: [
      "Step 1: Complete the Java Object-Oriented Programming and Interfaces lecture module.",
      "Step 2: Build a polymorphic payment gateway architecture using Java interfaces.",
      "Step 3: Pass the Java Collections & Generics assessment with 90%+ score."
    ],
    unlocked: true,
    unlockedDate: "Sep 25, 2026",
    rarity: "Epic",
    xpReward: 300,
    actionText: "Open Java Course",
    actionLink: "/course/crs-java-02"
  },
  {
    id: "bdg-docker-pro",
    title: "Docker Container Specialist",
    category: "DevOps",
    icon: "🐳",
    description: "Constructed multi-stage production Dockerfiles and containerized full-stack apps.",
    procedure: [
      "Step 1: Study the Docker Essentials & Multi-Stage Builds video lecture.",
      "Step 2: Create a production-ready Dockerfile for React and ASP.NET Core API.",
      "Step 3: Test and run docker compose with container port forwarding and volume persistence."
    ],
    unlocked: true,
    unlockedDate: "Sep 26, 2026",
    rarity: "Rare",
    xpReward: 200,
    actionText: "Open Docker Course",
    actionLink: "/course/crs-docker-06"
  },
  {
    id: "bdg-git-controller",
    title: "Git Version Controller",
    category: "Tools",
    icon: "🌿",
    description: "Mastered Git feature branches, interactive rebasing, and merge conflict resolution.",
    procedure: [
      "Step 1: Watch the Git Branching Strategies & Merge Conflicts lecture in the Git course.",
      "Step 2: Complete the Interactive Rebase and Squash Commits lab challenge in Task Planner.",
      "Step 3: Submit a clean GitHub Pull Request with meaningful conventional commits."
    ],
    unlocked: true,
    unlockedDate: "Sep 27, 2026",
    rarity: "Common",
    xpReward: 150,
    actionText: "Open Git Course",
    actionLink: "/course/crs-git-05"
  },
  {
    id: "bdg-dsa-virtuoso",
    title: "Algorithm Virtuoso",
    category: "Algorithms",
    icon: "⚡",
    description: "Implemented non-linear data structures including Binary Search Trees and Graphs.",
    procedure: [
      "Step 1: Complete lectures on Binary Trees, BST Insertion, and Tree Traversal algorithms.",
      "Step 2: Solve the Inorder, Preorder, and Postorder tree traversal coding problems.",
      "Step 3: Pass the Algorithmic Time & Space Complexity assessment test."
    ],
    unlocked: false,
    progress: "2/3 coding labs passed",
    rarity: "Epic",
    xpReward: 500,
    actionText: "Go to Daily Quiz",
    actionLink: "/quiz"
  },
  {
    id: "bdg-ai-scholar",
    title: "AI Teacher Scholar",
    category: "AI Classroom",
    icon: "🤖",
    description: "Attended 15 interactive lectures and solved doubt sessions with the 24/7 AI Teacher.",
    procedure: [
      "Step 1: Open the AI Teacher Classroom via your Student Dashboard or Sidebar.",
      "Step 2: Select a structured lecture topic (C++, Java, Docker, Git) or ask voice doubts.",
      "Step 3: Complete 15 interactive Q&A exchanges and code reviews with the AI Teacher."
    ],
    unlocked: true,
    unlockedDate: "Sep 27, 2026",
    rarity: "Common",
    xpReward: 150,
    actionText: "Enter AI Teacher Class",
    actionLink: "/ai-tutor?mode=class"
  },
  {
    id: "bdg-streak-30",
    title: "30-Day Dev Legend",
    category: "Consistency",
    icon: "👑",
    description: "Maintain a flawless 30-day continuous daily coding and quiz streak.",
    procedure: [
      "Step 1: Maintain your learning streak every day for 30 uninterrupted days.",
      "Step 2: Complete weekly tasks assigned by your professor or self-scheduled tasks.",
      "Step 3: Unlock legendary status and reach Level 15 on the college leaderboard."
    ],
    unlocked: false,
    progress: "14/30 days completed",
    rarity: "Legendary",
    xpReward: 1000,
    actionText: "View Leaderboard",
    actionLink: "/leaderboard"
  }
];
