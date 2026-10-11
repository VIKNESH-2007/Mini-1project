export const mockQuizzes = [
  {
    id: "quiz-daily-01",
    title: "College Computer Science & Engineering Challenge",
    category: "Daily Challenge",
    timeLimitSeconds: 75,
    totalXP: 100,
    questions: [
      {
        id: "q-01",
        question: "Given `int arr[] = {10, 20, 30, 40}; int *p = arr;`, what is the value of `*(p + 2)` in C/C++?",
        text: "Given `int arr[] = {10, 20, 30, 40}; int *p = arr;`, what is the value of `*(p + 2)` in C/C++?",
        options: [
          "10",
          "20",
          "30",
          "40"
        ],
        correctIndex: 2,
        correctAnswer: 2,
        hint: "Pointer arithmetic advances by the size of the data type. `*(p + 0)` is arr[0], `*(p + 1)` is arr[1]...",
        explanation: "`arr` decays to a pointer to its first element. `*(p + 2)` offsets the address by 2 integers, dereferencing `arr[2]` which contains 30.",
        xp: 25
      },
      {
        id: "q-02",
        question: "In Java, what happens during runtime when a method overridden in a subclass is invoked through a superclass reference variable?",
        text: "In Java, what happens during runtime when a method overridden in a subclass is invoked through a superclass reference variable?",
        options: [
          "The superclass method executes because of static binding",
          "The subclass overridden method executes due to dynamic method dispatch",
          "A ClassCastException is thrown at runtime",
          "The Java compiler rejects the code with a compilation error"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Think about the 4th pillar of OOP: Polymorphism and the JVM method table (vtable).",
        explanation: "Java employs dynamic method dispatch (runtime polymorphism). The JVM inspects the actual object type residing on the heap at runtime and executes the subclass's overridden method.",
        xp: 25
      },
      {
        id: "q-03",
        question: "What is the primary architectural difference between Docker containers and traditional Virtual Machines (VMs)?",
        text: "What is the primary architectural difference between Docker containers and traditional Virtual Machines (VMs)?",
        options: [
          "Containers require a full guest operating system and hypervisor",
          "Containers share the host OS kernel and use Linux namespaces/cgroups for isolation",
          "Virtual Machines can only run on Linux, while containers run on any hardware",
          "Docker containers emulate CPU hardware instructions directly"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Consider how containers remain lightweight (megabytes instead of gigabytes).",
        explanation: "Docker containers share the underlying host operating system kernel and isolate processes using kernel namespaces and control groups (cgroups), eliminating the heavyweight overhead of hypervisors and separate guest OS kernels.",
        xp: 25
      },
      {
        id: "q-04",
        question: "In Git, what is the key difference between `git merge` and `git rebase` when incorporating upstream changes?",
        text: "In Git, what is the key difference between `git merge` and `git rebase` when incorporating upstream changes?",
        options: [
          "Merge rewrites commit hashes, while rebase preserves exact historical commits",
          "Merge creates a non-destructive 3-way merge commit, while rebase rewrites project history linearly by replaying commits",
          "Rebase deletes the current working tree files",
          "Git merge can only be run once per repository"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "One creates a new commit joining two parent branches; the other replays your commits on top of the target base.",
        explanation: "`git merge` combines two divergent branches by creating a merge commit preserving historical branches. `git rebase` rewrites history by moving the base of your feature branch to the tip of target branch, producing a clean linear commit graph.",
        xp: 25
      }
    ]
  },
  {
    id: "quiz-devops-02",
    title: "Docker & Git DevOps Sprint",
    category: "DevOps & Tools",
    timeLimitSeconds: 90,
    totalXP: 120,
    questions: [
      {
        id: "qd-01",
        question: "Why should you place `COPY package*.json ./` and `RUN npm install` BEFORE `COPY . .` in a Node.js Dockerfile?",
        text: "Why should you place `COPY package*.json ./` and `RUN npm install` BEFORE `COPY . .` in a Node.js Dockerfile?",
        options: [
          "Docker requires package.json to be located at root directory",
          "To leverage Docker's layer cache so npm dependencies are not reinstalled when source code changes",
          "Because source code must be compiled after npm install finishes",
          "It reduces the container memory usage at runtime"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Think about Docker image layer caching.",
        explanation: "Docker caches image layers. By copying package manifests and installing dependencies first, Docker only re-executes npm install if package.json changes, drastically accelerating rebuild times when modifying source code.",
        xp: 30
      },
      {
        id: "qd-02",
        question: "Which Git command is used to safely discard unstaged modifications in your local working directory for a specific file?",
        text: "Which Git command is used to safely discard unstaged modifications in your local working directory for a specific file?",
        options: [
          "git commit --amend",
          "git restore <filename>",
          "git push -f",
          "git rebase --abort"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Modern Git introduced `restore` specifically to replace ambiguous uses of `checkout`.",
        explanation: "`git restore <filename>` discards uncommitted local modifications in the working tree, reverting the file to match the HEAD commit or staged index.",
        xp: 30
      },
      {
        id: "qd-03",
        question: "In Docker Compose, what does the `volumes:` directive under a database service accomplish?",
        text: "In Docker Compose, what does the `volumes:` directive under a database service accomplish?",
        options: [
          "It limits the volume of network packets the database can transmit",
          "It mounts persistent host storage so database records survive container restarts and rebuilds",
          "It increases the audio volume for container alerts",
          "It creates an encrypted git backup of database tables"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Containers are ephemeral by default. How do we keep data safe?",
        explanation: "Container storage is ephemeral. Docker volumes mount persistent host filesystem directories to the container data path (e.g. `/var/lib/postgresql/data`), ensuring database tables remain intact when containers stop or recreate.",
        xp: 30
      },
      {
        id: "qd-04",
        question: "In C# ASP.NET Core Dependency Injection, which service lifetime registers an instance created once per HTTP request scope?",
        text: "In C# ASP.NET Core Dependency Injection, which service lifetime registers an instance created once per HTTP request scope?",
        options: [
          "AddTransient",
          "AddScoped",
          "AddSingleton",
          "AddStatic"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "This lifetime is typically used for DbContext so all repositories in a single web request share the same database connection.",
        explanation: "`AddScoped` creates a single instance per incoming HTTP request. Services like Entity Framework `DbContext` are registered as Scoped so changes are tracked cohesively across that request.",
        xp: 30
      }
    ]
  }
];
