export const mockCourses = [
  {
    id: "crs-cpp-01",
    title: "Data Structures & Algorithms in C++",
    subject: "Computer Science",
    subjectColor: "bg-blue-100 text-blue-800 border-blue-200",
    difficulty: "Intermediate",
    grade: "Undergraduate CS",
    language: "en",
    rating: 4.95,
    studentsCount: 3840,
    downloadSize: "28.4 MB",
    duration: "65 mins",
    isDownloaded: true,
    progress: 45,
    description: "Master modern C++ systems programming, pointer mechanics, STL containers, dynamic memory management, and algorithmic tree structures.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/2ybLD6_2gKM",
    instructor: "Prof. Vikram Aditya (Systems Architect)",
    lessons: [
      { id: "les-cpp-01", title: "1. C++ Pointers, References & Memory Addresses", duration: "12:30", completed: true },
      { id: "les-cpp-02", title: "2. STL Vectors, Dynamic Arrays & Algorithmic Complexity", duration: "18:45", completed: true },
      { id: "les-cpp-03", title: "3. Singly & Doubly Linked Lists Implementation", duration: "16:20", completed: false },
      { id: "les-cpp-04", title: "4. Binary Search Trees & Tree Traversals", duration: "17:15", completed: false },
    ],
    aiNotes: {
      summary: "Pointers store memory addresses of variables (`int* ptr = &val;`). Dereferencing (`*ptr`) accesses or modifies the value stored at that memory address.",
      keyPoints: [
        "Pointer Syntax: `int* p = &a;` stores address of `a` into pointer `p`.",
        "Dereference: `*p = 20;` modifies the value stored at address `p` directly.",
        "Linked List Node: Composed of data payload and a pointer to the next node struct (`Node* next;`).",
        "BST Property: For every node `N`, left subtree values are strictly `< N->val` and right subtree values are `> N->val`."
      ],
      formulas: ["Time Complexity (BST Search): O(h) where h is tree height (O(log N) balanced)", "Pointer Arithmetic: ptr + 1 advances by sizeof(*ptr) bytes"]
    }
  },
  {
    id: "crs-java-02",
    title: "Java Enterprise & Object-Oriented Software Engineering",
    subject: "Software Engineering",
    subjectColor: "bg-amber-100 text-amber-800 border-amber-200",
    difficulty: "Intermediate",
    grade: "Undergraduate CS",
    language: "en",
    rating: 4.9,
    studentsCount: 4210,
    downloadSize: "32.1 MB",
    duration: "70 mins",
    isDownloaded: true,
    progress: 30,
    description: "Comprehensive deep-dive into Java 21, JVM bytecode execution, Object-Oriented Design Patterns, Collections Framework, and Multithreading.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/eIrMbAQSU34",
    instructor: "Dr. Ananya Ray (Java Champion & Core Architect)",
    lessons: [
      { id: "les-java-01", title: "1. Java Virtual Machine Architecture, Bytecode & Basics", duration: "14:10", completed: true },
      { id: "les-java-02", title: "2. OOP Principles: Encapsulation, Inheritance & Polymorphism", duration: "19:00", completed: false },
      { id: "les-java-03", title: "3. Java Collections Framework: ArrayList, HashMap & Sets", duration: "18:25", completed: false },
      { id: "les-java-04", title: "4. Multithreading, Concurrency & Synchronization", duration: "18:25", completed: false }
    ],
    aiNotes: {
      summary: "Java compiles source code (`.java`) into portable bytecode (`.class`) executed by the Java Virtual Machine (JVM) via JIT compilation.",
      keyPoints: [
        "Four OOP Pillars: Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (dynamic method dispatch), and Abstraction (interfaces).",
        "JVM Memory Model: Heap (objects, garbage collected) vs Stack (stack frames, local variables, primitive types).",
        "Collections: `HashMap<K, V>` operates in average O(1) time complexity using hash buckets and balanced red-black trees for collisions.",
        "Concurrency: `synchronized` blocks and `ReentrantLock` prevent race conditions on shared state across thread boundaries."
      ],
      formulas: ["HashMap Index Calculation: index = (n - 1) & hash", "Amdahl's Law: Speedup = 1 / ((1 - P) + P/S)"]
    }
  },
  {
    id: "crs-c-03",
    title: "C Systems Programming & Low-Level Memory Management",
    subject: "Systems Programming",
    subjectColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    difficulty: "Advanced",
    grade: "Undergraduate CS",
    language: "en",
    rating: 4.92,
    studentsCount: 3120,
    downloadSize: "24.6 MB",
    duration: "60 mins",
    isDownloaded: false,
    progress: 15,
    description: "Understand OS internals, explicit memory allocation with malloc and free, memory leaks, structs, and Unix system calls like fork and exec.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/KJgsSFOSQv0",
    instructor: "Prof. Devansh Saxena (Unix Kernel Engineer)",
    lessons: [
      { id: "les-c-01", title: "1. C Fundamentals, Memory Model & Compiling with GCC", duration: "13:40", completed: true },
      { id: "les-c-02", title: "2. Dynamic Memory Allocation: malloc, calloc, realloc & free", duration: "16:50", completed: false },
      { id: "les-c-03", title: "3. C Structs, Bitfields, Unions & Padding", duration: "14:30", completed: false },
      { id: "les-c-04", title: "4. Unix System Calls: fork, exec, pipes & Signals", duration: "15:00", completed: false }
    ],
    aiNotes: {
      summary: "In C, memory is explicitly managed by the programmer. Heap memory allocated with `malloc()` must always be paired with `free()` to prevent memory leaks.",
      keyPoints: [
        "Allocation: `int* arr = (int*)malloc(n * sizeof(int));` allocates contiguous bytes on the heap.",
        "Deallocation: `free(arr); arr = NULL;` frees heap block and avoids dangling pointer bugs.",
        "Struct Alignment: Compilers insert padding bytes so data members align to natural hardware word boundaries.",
        "Unix Fork: `pid_t pid = fork();` clones the calling process; returns 0 to child and child's PID to parent."
      ],
      formulas: ["Memory Allocation: sizeof(type) * element_count", "Process Fork: fork() returns 0 in child, PID in parent, -1 on error"]
    }
  },
  {
    id: "crs-cs-04",
    title: "Modern C# & ASP.NET Core Enterprise Web APIs",
    subject: "Web & API Engineering",
    subjectColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    difficulty: "Intermediate",
    grade: "Undergraduate CS",
    language: "en",
    rating: 4.88,
    studentsCount: 2950,
    downloadSize: "29.8 MB",
    duration: "60 mins",
    isDownloaded: true,
    progress: 60,
    description: "Build robust cloud REST APIs with C# 12, .NET 10, Entity Framework Core, LINQ queries, asynchronous programming, and Dependency Injection.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/gfkTfcpWqAY",
    instructor: "Er. Shreya Kulkarni (Cloud Solutions Architect)",
    lessons: [
      { id: "les-cs-01", title: "1. C# Syntax, Value vs Reference Types & CLR", duration: "12:15", completed: true },
      { id: "les-cs-02", title: "2. C# OOP, Interfaces, Abstract Classes & Generics", duration: "16:40", completed: true },
      { id: "les-cs-03", title: "3. LINQ Queries, Delegates, Lambdas & Collections", duration: "15:20", completed: true },
      { id: "les-cs-04", title: "4. ASP.NET Core REST APIs, Dependency Injection & EF Core", duration: "16:45", completed: false }
    ],
    aiNotes: {
      summary: "C# is a modern, type-safe, object-oriented language running on the cross-platform .NET runtime with native async/await support.",
      keyPoints: [
        "Value vs Reference: `struct` is value-type (stack-allocated); `class` is reference-type (heap-allocated).",
        "LINQ: Declarative query syntax over in-memory collections and database contexts (`users.Where(u => u.IsActive).OrderBy(...)`).",
        "Async/Await: Non-blocking I/O using `Task<T>` keeps thread pool threads unblocked during DB and network requests.",
        "Dependency Injection: ASP.NET Core provides built-in IoC container with Transient, Scoped, and Singleton lifetimes."
      ],
      formulas: ["LINQ Method Chaining: source.Where(predicate).Select(selector)", "Service Lifetimes: Transient (per request), Scoped (per HTTP connection), Singleton (application-wide)"]
    }
  },
  {
    id: "crs-git-05",
    title: "Git & GitHub Version Control & Team Workflows",
    subject: "Developer Tools",
    subjectColor: "bg-purple-100 text-purple-800 border-purple-200",
    difficulty: "Essential",
    grade: "All Levels & DevOps",
    language: "en",
    rating: 4.98,
    studentsCount: 6540,
    downloadSize: "18.2 MB",
    duration: "50 mins",
    isDownloaded: true,
    progress: 80,
    description: "Become fluent with Git CLI and GitHub: branching, merging, rebasing, resolving merge conflicts, collaborative pull requests, and CI/CD automation.",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/hwP7WQkmECE",
    instructor: "Rohit Nair (Staff DevOps Engineer)",
    lessons: [
      { id: "les-git-01", title: "1. Git Architecture: Working Directory, Staging & Commits", duration: "11:20", completed: true },
      { id: "les-git-02", title: "2. Branching, Merging, Rebasing & Resolving Merge Conflicts", duration: "14:50", completed: true },
      { id: "les-git-03", title: "3. Remote Repositories, Forking & Collaborative Pull Requests", duration: "12:10", completed: true },
      { id: "les-git-04", title: "4. GitHub Actions, CI/CD Pipelines & Automated Testing", duration: "12:40", completed: false }
    ],
    aiNotes: {
      summary: "Git is a distributed version control system tracking directed acyclic graphs (DAG) of cryptographic SHA-1/SHA-256 commit snapshots.",
      keyPoints: [
        "Three Trees: Working Directory (untracked/modified), Staging Area (`git add`), Repository (`git commit`).",
        "Branching: Branches are lightweight pointers to specific commit hashes (`git checkout -b feature/login`).",
        "Merge vs Rebase: Merge creates a non-destructive merge commit; rebase rewrites project history linearly.",
        "GitHub Actions: Automated workflows declared in `.github/workflows/*.yml` triggered on push, pull_request, or cron."
      ],
      formulas: ["Basic Workflow: git add . && git commit -m 'feat: message' && git push origin main", "Commit Hash: SHA-1(tree + parent + author + committer + message)"]
    }
  },
  {
    id: "crs-docker-06",
    title: "Docker & Containerization for Modern DevOps",
    subject: "Cloud & DevOps",
    subjectColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    difficulty: "Intermediate",
    grade: "Undergraduate CS & DevOps",
    language: "en",
    rating: 4.96,
    studentsCount: 5230,
    downloadSize: "22.7 MB",
    duration: "55 mins",
    isDownloaded: false,
    progress: 25,
    description: "Build, package, and deploy isolated microservices using Docker containers, Dockerfile optimization, multi-stage builds, and Docker Compose.",
    thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/Gjnup-PuquQ",
    instructor: "Siddharth Menon (Container Platform Architect)",
    lessons: [
      { id: "les-docker-01", title: "1. Containerization Concepts vs Virtual Machines", duration: "10:30", completed: true },
      { id: "les-docker-02", title: "2. Writing Dockerfiles, Layer Caching & Multi-Stage Builds", duration: "15:45", completed: false },
      { id: "les-docker-03", title: "3. Docker Storage Volumes, Bind Mounts & Virtual Networks", duration: "14:15", completed: false },
      { id: "les-docker-04", title: "4. Docker Compose Multi-Container Orchestration", duration: "14:30", completed: false }
    ],
    aiNotes: {
      summary: "Docker containers share the host OS kernel and isolate process namespaces, cgroups, and root filesystems, delivering lightweight microservices.",
      keyPoints: [
        "Containers vs VMs: Containers share the host kernel (megabytes, milliseconds); VMs emulate entire hardware with hypervisors (gigabytes, minutes).",
        "Dockerfile Instructions: `FROM` (base image), `WORKDIR` (directory), `COPY` (files), `RUN` (build-time commands), `CMD` (runtime entrypoint).",
        "Layer Caching: Docker reuses unchanged build layers. Place frequently changing files (app source) after static files (package.json).",
        "Docker Compose: Multi-container definition in `docker-compose.yml` linking web apps, API gateways, and databases over isolated bridge networks."
      ],
      formulas: ["Run Container: docker run -d -p 8080:80 --name webapp nginx:alpine", "Compose Up: docker compose up -d --build"]
    }
  }
];
