export const mockQuizzes = [
  {
    id: "quiz-daily-01",
    title: "Comprehensive Computer Science & Engineering Challenge (20 Questions)",
    category: "All Subjects Mega Quiz",
    timeLimitSeconds: 300,
    totalXP: 500,
    questions: [
      {
        id: "q-01",
        question: "Given `int arr[] = {10, 20, 30, 40}; int *p = arr;`, what is the value of `*(p + 2)` in C/C++?",
        text: "Given `int arr[] = {10, 20, 30, 40}; int *p = arr;`, what is the value of `*(p + 2)` in C/C++?",
        options: ["10", "20", "30", "40"],
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
        explanation: "Docker containers share the underlying host operating system kernel and isolate processes using kernel namespaces and control groups (cgroups), eliminating the heavyweight overhead of hypervisors.",
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
        explanation: "`git merge` combines two divergent branches by creating a merge commit preserving historical branches. `git rebase` rewrites history by moving the base of your feature branch to the tip of the target branch.",
        xp: 25
      },
      {
        id: "q-05",
        question: "What is the worst-case and average-case time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
        text: "What is the worst-case and average-case time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "At each node comparison, half of the remaining subtree is eliminated.",
        explanation: "A height-balanced Binary Search Tree maintains a height of O(log n), guaranteeing O(log n) time complexity for search, insertion, and deletion.",
        xp: 25
      },
      {
        id: "q-06",
        question: "In C programming, what happens if you allocate heap memory using `malloc()` and forget to call `free()` before the pointer goes out of scope?",
        text: "In C programming, what happens if you allocate heap memory using `malloc()` and forget to call `free()` before the pointer goes out of scope?",
        options: [
          "The C compiler automatically runs garbage collection",
          "A memory leak occurs because the allocated heap block remains reserved until program termination",
          "The operating system immediately restarts the computer",
          "The memory is automatically moved to the CPU registers"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "C does not have an automatic garbage collector like Java or C#.",
        explanation: "Without calling `free()`, the heap memory remains allocated without any pointer referencing it, causing a memory leak that consumes RAM over time.",
        xp: 25
      },
      {
        id: "q-07",
        question: "Which data structure operates on the LIFO (Last-In, First-Out) principle and is used by the CPU to manage function call frames and recursion?",
        text: "Which data structure operates on the LIFO (Last-In, First-Out) principle and is used by the CPU to manage function call frames and recursion?",
        options: ["Queue", "Stack", "Hash Table", "Min-Heap"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Think about `push()` and `pop()` operations and the 'Call ____'.",
        explanation: "A Stack follows Last-In, First-Out (LIFO). Every function call pushes a new stack frame containing local variables and return addresses onto the call stack.",
        xp: 25
      },
      {
        id: "q-08",
        question: "In C# ASP.NET Core Dependency Injection, which service lifetime creates a single instance per incoming HTTP request?",
        text: "In C# ASP.NET Core Dependency Injection, which service lifetime creates a single instance per incoming HTTP request?",
        options: ["AddTransient", "AddScoped", "AddSingleton", "AddStatic"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "This lifetime is standard for Entity Framework Core `DbContext`.",
        explanation: "`AddScoped` creates one instance per HTTP request scope, ensuring all services within the same web request share the same `DbContext` instance.",
        xp: 25
      },
      {
        id: "q-09",
        question: "In Java Collections, what is the average time complexity of `get(key)` and `put(key, value)` in a properly sized `HashMap`?",
        text: "In Java Collections, what is the average time complexity of `get(key)` and `put(key, value)` in a properly sized `HashMap`?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctIndex: 0,
        correctAnswer: 0,
        hint: "Hash functions compute the bucket array index directly from the key's hash code.",
        explanation: "`HashMap` uses `hashCode()` to compute the bucket index in constant O(1) average time. In Java 8+, if a bucket experiences many collisions, it converts the linked list into a Red-Black Tree for O(log n) worst-case lookup.",
        xp: 25
      },
      {
        id: "q-10",
        question: "Why should `COPY package*.json ./` and `RUN npm install` be placed BEFORE `COPY . .` in a production Dockerfile?",
        text: "Why should `COPY package*.json ./` and `RUN npm install` be placed BEFORE `COPY . .` in a production Dockerfile?",
        options: [
          "Docker requires package.json to be the first line of every Dockerfile",
          "To leverage Docker layer caching so dependencies are not reinstalled every time source code changes",
          "Because Node.js cannot read source files if npm install runs afterward",
          "To disable container networking during the build phase"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Docker caches unchanged layers from top to bottom.",
        explanation: "By copying `package.json` and installing dependencies before copying frequently modified source code, Docker reuses the cached `node_modules` layer on subsequent builds unless dependencies change.",
        xp: 25
      },
      {
        id: "q-11",
        question: "In C++, what is the purpose of declaring a base class destructor as `virtual`?",
        text: "In C++, what is the purpose of declaring a base class destructor as `virtual`?",
        options: [
          "To prevent the class from being inherited",
          "To ensure the derived class destructor is called properly when deleting an object through a base class pointer",
          "To allocate the object on the CPU cache instead of RAM",
          "To allow constructor overloading"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "What happens when you run `delete basePtr;` where `basePtr` points to a `Derived` object?",
        explanation: "If the base destructor is not `virtual`, deleting a derived object via a base class pointer invokes only the base destructor, causing resource leaks in the derived part.",
        xp: 25
      },
      {
        id: "q-12",
        question: "Which Git command safely discards unstaged changes in a specific file in your working directory?",
        text: "Which Git command safely discards unstaged changes in a specific file in your working directory?",
        options: [
          "git commit --amend",
          "git restore <filename>",
          "git push --force",
          "git remote prune origin"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Introduced in Git 2.23 to separate file restoration from branch switching.",
        explanation: "`git restore <filename>` discards unstaged modifications in the working directory and restores the file to match the current index/HEAD.",
        xp: 25
      },
      {
        id: "q-13",
        question: "In Operating Systems, what happens when a process calls the Unix `fork()` system call?",
        text: "In Operating Systems, what happens when a process calls the Unix `fork()` system call?",
        options: [
          "The current process terminates immediately",
          "A new child process is created as a duplicate; `fork()` returns 0 to the child and the child's PID to the parent",
          "The system formats the disk partition",
          "A new kernel thread replaces the init process"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Check the return value of `fork()` in parent vs child.",
        explanation: "`fork()` duplicates the calling process. It returns `0` inside the newly created child process and returns the positive Process ID (PID) of the child to the parent process.",
        xp: 25
      },
      {
        id: "q-14",
        question: "Which sorting algorithm uses a 'Divide and Conquer' strategy, guarantees O(n log n) time complexity in all cases (best, average, worst), and is stable?",
        text: "Which sorting algorithm uses a 'Divide and Conquer' strategy, guarantees O(n log n) time complexity in all cases (best, average, worst), and is stable?",
        options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"],
        correctIndex: 2,
        correctAnswer: 2,
        hint: "It recursively splits the array into halves and merges sorted subarrays.",
        explanation: "Merge Sort recursively divides the array into two halves, sorts them, and merges them in O(n) time, guaranteeing O(n log n) worst-case complexity and preserving relative order of equal elements.",
        xp: 25
      },
      {
        id: "q-15",
        question: "In SQL relational databases, what does the 'A' in ACID transactions stand for?",
        text: "In SQL relational databases, what does the 'A' in ACID transactions stand for?",
        options: [
          "Availability — the database is always online",
          "Atomicity — all operations in a transaction succeed together or the entire transaction rolls back",
          "Asynchronous — queries run without waiting for disk writes",
          "Authentication — only logged-in users can query tables"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Think 'All or Nothing' when transferring money between two bank accounts.",
        explanation: "Atomicity guarantees that a database transaction is treated as a single indivisible unit: either all statements commit successfully, or none take effect (rollback).",
        xp: 25
      },
      {
        id: "q-16",
        question: "In C# and .NET, what is the primary difference between a `struct` and a `class`?",
        text: "In C# and .NET, what is the primary difference between a `struct` and a `class`?",
        options: [
          "A struct is a value type (typically stack-allocated), whereas a class is a reference type (heap-allocated)",
          "A struct supports inheritance from multiple classes, whereas a class does not",
          "A class cannot contain methods, whereas a struct can",
          "Structs can only hold strings"
        ],
        correctIndex: 0,
        correctAnswer: 0,
        hint: "Think about Value Types vs Reference Types in the Common Language Runtime (CLR).",
        explanation: "In C#, `struct` is a value type that stores its data directly (usually on the stack), while `class` is a reference type allocated on the managed GC heap.",
        xp: 25
      },
      {
        id: "q-17",
        question: "In Docker Compose, what is the role of the `volumes:` section for a MySQL or PostgreSQL database container?",
        text: "In Docker Compose, what is the role of the `volumes:` section for a MySQL or PostgreSQL database container?",
        options: [
          "It controls the speaker volume of the server",
          "It persists database files on the host machine so data survives when containers are stopped or recreated",
          "It compresses the Docker image into a zip archive",
          "It opens firewall ports to the public internet"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Containers are ephemeral by default—what happens to data inside a container when `docker compose down` runs?",
        explanation: "Docker volumes map persistent host storage into the container filesystem, ensuring database tables and records are preserved across container restarts and upgrades.",
        xp: 25
      },
      {
        id: "q-18",
        question: "In Graph Algorithms, which traversal algorithm uses a Queue (FIFO) and is guaranteed to find the shortest path in an unweighted graph?",
        text: "In Graph Algorithms, which traversal algorithm uses a Queue (FIFO) and is guaranteed to find the shortest path in an unweighted graph?",
        options: [
          "Depth-First Search (DFS)",
          "Breadth-First Search (BFS)",
          "Binary Search",
          "Kruskal's Minimum Spanning Tree"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "It explores vertices level-by-level (distance 1, then distance 2, etc.).",
        explanation: "Breadth-First Search (BFS) uses a FIFO Queue to visit nodes layer by layer according to their distance from the source, guaranteeing the shortest path in unweighted graphs.",
        xp: 25
      },
      {
        id: "q-19",
        question: "In RESTful Web APIs, which HTTP method is idempotent and typically used to completely replace or update an existing resource at a known URI?",
        text: "In RESTful Web APIs, which HTTP method is idempotent and typically used to completely replace or update an existing resource at a known URI?",
        options: ["POST", "PUT", "CONNECT", "TRACE"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Calling this method multiple times with the same payload produces the exact same server state.",
        explanation: "`PUT` is idempotent and updates/replaces the target resource representation at a specific URI, whereas `POST` creates a new resource and is not idempotent.",
        xp: 25
      },
      {
        id: "q-20",
        question: "In Java multithreading, what does the `synchronized` keyword guarantee when applied to a method or block?",
        text: "In Java multithreading, what does the `synchronized` keyword guarantee when applied to a method or block?",
        options: [
          "All threads execute the block simultaneously in parallel",
          "Mutual exclusion (only one thread can execute the critical section at a time on the monitor lock) and memory visibility",
          "The thread is converted into a separate operating system process",
          "The JVM disables garbage collection permanently"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "It prevents race conditions when multiple threads access shared mutable state.",
        explanation: "`synchronized` acquires an intrinsic lock (monitor) on the object, ensuring only one thread enters the critical section at a time and flushing changes to main memory.",
        xp: 25
      }
    ]
  },
  {
    id: "quiz-cpp-dsa-02",
    title: "C, C++ & Data Structures Mastery (8 Questions)",
    category: "C++ & DSA",
    timeLimitSeconds: 180,
    totalXP: 200,
    questions: [
      {
        id: "qcpp-01",
        question: "Given `int arr[] = {10, 20, 30, 40}; int *p = arr;`, what is the value of `*(p + 2)` in C/C++?",
        text: "Given `int arr[] = {10, 20, 30, 40}; int *p = arr;`, what is the value of `*(p + 2)` in C/C++?",
        options: ["10", "20", "30", "40"],
        correctIndex: 2,
        correctAnswer: 2,
        hint: "Pointer arithmetic advances by the size of the data type.",
        explanation: "`*(p + 2)` accesses `arr[2]`, which is 30.",
        xp: 25
      },
      {
        id: "qcpp-02",
        question: "What is the time complexity of inserting a new node at the head (beginning) of a Singly Linked List?",
        text: "What is the time complexity of inserting a new node at the head (beginning) of a Singly Linked List?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 0,
        correctAnswer: 0,
        hint: "You only need to update `newNode->next = head; head = newNode;`.",
        explanation: "Inserting at the head of a linked list requires only two pointer assignments, taking constant O(1) time regardless of list length.",
        xp: 25
      },
      {
        id: "qcpp-03",
        question: "In C++, which STL container is implemented as a dynamic contiguous array that doubles its capacity when full?",
        text: "In C++, which STL container is implemented as a dynamic contiguous array that doubles its capacity when full?",
        options: ["std::list", "std::vector", "std::map", "std::set"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "It provides O(1) random access via `operator[]` and amortized O(1) `push_back()`.",
        explanation: "`std::vector` manages a contiguous heap array, offering cache-friendly O(1) random access and amortized O(1) insertion at the end.",
        xp: 25
      },
      {
        id: "qcpp-04",
        question: "What traversal order of a Binary Search Tree (BST) always visits the node values in ascending sorted order?",
        text: "What traversal order of a Binary Search Tree (BST) always visits the node values in ascending sorted order?",
        options: ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Visit all smaller elements in the left subtree first, then the current node, then larger elements in the right subtree.",
        explanation: "In-order traversal (`Left -> Root -> Right`) of any valid Binary Search Tree produces keys in non-decreasing sorted order.",
        xp: 25
      },
      {
        id: "qcpp-05",
        question: "In C, what is the difference between `malloc(n * sizeof(int))` and `calloc(n, sizeof(int))`?",
        text: "In C, what is the difference between `malloc(n * sizeof(int))` and `calloc(n, sizeof(int))`?",
        options: [
          "malloc allocates on the stack while calloc allocates on the heap",
          "calloc initializes all allocated bytes to zero, whereas malloc leaves the memory uninitialized",
          "malloc is only for strings while calloc is only for floats",
          "calloc cannot be freed with free()"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "`calloc` stands for contiguous allocation and clears the memory.",
        explanation: "`calloc()` allocates memory for an array of elements and zero-initializes every byte, whereas `malloc()` returns uninitialized heap memory.",
        xp: 25
      },
      {
        id: "qcpp-06",
        question: "What is a 'dangling pointer' in C/C++?",
        text: "What is a 'dangling pointer' in C/C++?",
        options: [
          "A pointer initialized to nullptr",
          "A pointer that still holds the memory address of an object that has already been freed or deallocated",
          "A pointer that points to a constant integer",
          "A pointer used inside a recursion function"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "It happens when you call `free(ptr)` or `delete ptr` without setting `ptr = nullptr`.",
        explanation: "A dangling pointer points to memory that has already been deallocated. Dereferencing it causes undefined behavior or segmentation faults.",
        xp: 25
      },
      {
        id: "qcpp-07",
        question: "Which algorithm is used to find the shortest path from a single source vertex to all other vertices in a graph with non-negative edge weights?",
        text: "Which algorithm is used to find the shortest path from a single source vertex to all other vertices in a graph with non-negative edge weights?",
        options: ["Dijkstra's Algorithm", "Bubble Sort", "Kadane's Algorithm", "Binary Search"],
        correctIndex: 0,
        correctAnswer: 0,
        hint: "It greedily relaxes edges using a Min-Priority Queue.",
        explanation: "Dijkstra's algorithm uses a priority queue to greedily select the closest unvisited vertex and relax its outgoing edges in O((V + E) log V) time.",
        xp: 25
      },
      {
        id: "qcpp-08",
        question: "In C++, what is the difference between passing an argument by value (`void fn(int x)`) vs passing by reference (`void fn(int &x)`)?",
        text: "In C++, what is the difference between passing an argument by value (`void fn(int x)`) vs passing by reference (`void fn(int &x)`)?",
        options: [
          "Pass by value modifies the caller's variable; pass by reference creates a copy",
          "Pass by value copies the argument; pass by reference aliases the original variable allowing direct modification without copying",
          "Pass by reference only works for char arrays",
          "There is no difference in C++"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "`&x` binds directly to the caller's variable in memory.",
        explanation: "Passing by reference (`int &x`) avoids copying and allows the function to directly read or mutate the caller's original variable.",
        xp: 25
      }
    ]
  },
  {
    id: "quiz-devops-03",
    title: "Java, C#, Docker & Git Engineering Sprint (8 Questions)",
    category: "Java, .NET & DevOps",
    timeLimitSeconds: 180,
    totalXP: 200,
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
        explanation: "Docker caches image layers. Copying package manifests and installing dependencies first avoids reinstalling packages when only source code changes.",
        xp: 25
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
        explanation: "`git restore <filename>` discards uncommitted local modifications in the working tree, reverting the file to match HEAD.",
        xp: 25
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
        explanation: "Docker volumes mount persistent host directories to the container data path so database records survive container recreation.",
        xp: 25
      },
      {
        id: "qd-04",
        question: "In C# ASP.NET Core Dependency Injection, which service lifetime registers an instance created once per HTTP request scope?",
        text: "In C# ASP.NET Core Dependency Injection, which service lifetime registers an instance created once per HTTP request scope?",
        options: ["AddTransient", "AddScoped", "AddSingleton", "AddStatic"],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Used for Entity Framework `DbContext`.",
        explanation: "`AddScoped` creates a single instance per incoming HTTP request scope.",
        xp: 25
      },
      {
        id: "qd-05",
        question: "In Java, what is the difference between an `interface` and an `abstract class`?",
        text: "In Java, what is the difference between an `interface` and an `abstract class`?",
        options: [
          "A class can implement multiple interfaces, but can only extend a single abstract class",
          "An interface can have constructors, while an abstract class cannot",
          "Abstract classes cannot contain concrete methods",
          "Interfaces can only be used in Android apps"
        ],
        correctIndex: 0,
        correctAnswer: 0,
        hint: "Think about how Java supports multiple inheritance of type.",
        explanation: "Java classes support single class inheritance (`extends`), but can implement multiple interfaces (`implements`) to achieve polymorphic contracts.",
        xp: 25
      },
      {
        id: "qd-06",
        question: "In C# LINQ, what does 'Deferred Execution' mean when you write `var query = list.Where(x => x > 10);`?",
        text: "In C# LINQ, what does 'Deferred Execution' mean when you write `var query = list.Where(x => x > 10);`?",
        options: [
          "The query runs on a background thread after 10 seconds",
          "The query is not actually executed until the results are iterated (e.g., via `foreach` or `.ToList()`)",
          "The query deletes elements from the database",
          "The compiler skips type checking"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Defining the query expression only builds an enumerable pipeline.",
        explanation: "LINQ queries use deferred execution—the filtering or projection only executes when the sequence is enumerated with `foreach`, `.ToList()`, or `.Count()`.",
        xp: 25
      },
      {
        id: "qd-07",
        question: "What is the purpose of a Multi-Stage Build in a Dockerfile (`FROM node:20 AS build` ... `FROM nginx:alpine`)?",
        text: "What is the purpose of a Multi-Stage Build in a Dockerfile (`FROM node:20 AS build` ... `FROM nginx:alpine`)?",
        options: [
          "To run multiple operating systems simultaneously inside one container",
          "To compile the app in a build container and copy only the small compiled artifacts into a minimal production image",
          "To bypass Docker Hub authentication",
          "To double the container RAM limit"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Your final production image doesn't need compilers, SDKs, or devDependencies.",
        explanation: "Multi-stage builds keep production container images small and secure by leaving behind heavy build tools and copying only compiled assets into a lightweight runtime image.",
        xp: 25
      },
      {
        id: "qd-08",
        question: "In Git, what does `git stash` do when you are in the middle of working on a feature branch?",
        text: "In Git, what does `git stash` do when you are in the middle of working on a feature branch?",
        options: [
          "Permanently deletes all uncommitted files",
          "Temporarily shelves your uncommitted local changes onto a stack so you can switch branches cleanly, and lets you re-apply them later with `git stash pop`",
          "Pushes your code directly to the main branch on GitHub",
          "Creates a new remote repository"
        ],
        correctIndex: 1,
        correctAnswer: 1,
        hint: "Useful when you need to quickly switch branches without committing half-done work.",
        explanation: "`git stash` saves your modified tracked files and staged changes on a local stack and reverts the working directory to match HEAD until you run `git stash pop`.",
        xp: 25
      }
    ]
  }
];
