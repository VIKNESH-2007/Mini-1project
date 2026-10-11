// Dedicated topic-specific multimedia curriculum data for all college computer science & engineering lessons
// All YouTube video IDs are verified, active, and embeddable educational lectures

export const lessonTopicsData = {
  // -------------------------------------------------------------
  // Course 1: C++ Data Structures & Algorithms
  // -------------------------------------------------------------
  "les-cpp-01": {
    topic: "C++ Pointers, References & Memory Addresses",
    subject: "Computer Science",
    grade: "Undergraduate CS",
    youtubeId: "2ybLD6_2gKM",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/2ybLD6_2gKM",
    summary: "Master pointer mechanics, reference aliasing, memory addresses, and the dereference operator.",
    visualTheme: "cpp-pointers",
    slides: [
      {
        title: "Memory Addresses & Pointer Declarations",
        subtitle: "How computer memory is addressed in bytes",
        diagram: "memory-cells-stack",
        formula: "int x = 42; int* ptr = &x; // ptr holds 0x7ffd58",
        keyPoint: "The address-of operator (&) extracts the memory location; the dereference operator (*) accesses or mutates the value.",
        narration: "Welcome to C++ Pointers and Memory Addresses. Every variable in your computer's RAM lives at a distinct numerical hexadecimal address. A pointer variable simply stores that memory address."
      },
      {
        title: "Dereferencing and Value Modification",
        subtitle: "Mutating variable state remotely through memory references",
        diagram: "pointer-dereference-flow",
        formula: "*ptr = 99; // x is now 99 directly in RAM",
        keyPoint: "Dereferencing allows functions to pass variables by reference without expensive copying of large data objects.",
        narration: "When you dereference a pointer using the asterisk symbol, your program follows the pointer's stored address into RAM to modify or read the target value directly."
      },
      {
        title: "Pointers vs References",
        subtitle: "Safe aliases vs reassignable memory pointers",
        diagram: "pointer-vs-reference",
        formula: "int& ref = x; // ref is an alias, cannot be null",
        keyPoint: "References must be initialized upon declaration and cannot be null, whereas pointers can be null (`nullptr`) and reassigned.",
        narration: "C++ references provide clean, non-null syntactic sugar for pointer mechanics. They ensure safe parameter passing while avoiding nullptr exceptions."
      }
    ]
  },

  "les-cpp-02": {
    topic: "STL Vectors, Dynamic Arrays & Algorithmic Complexity",
    subject: "Computer Science",
    grade: "Undergraduate CS",
    youtubeId: "vLnPwxZdW4Y",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/vLnPwxZdW4Y",
    summary: "Understand `std::vector` contiguous allocation, exponential capacity doubling, and amortized O(1) push_back.",
    visualTheme: "cpp-vector",
    slides: [
      {
        title: "Contiguous Memory & Dynamic Growth",
        subtitle: "How std::vector scales dynamically on the heap",
        diagram: "vector-capacity-doubling",
        formula: "capacity = capacity * 2 (when size == capacity)",
        keyPoint: "Vectors allocate contiguous heap buffers. When capacity overflows, a 2x larger block is allocated, elements are moved, and old memory freed.",
        narration: "Standard Template Library vectors provide dynamic array sizing while retaining contiguous memory layout for lightning-fast cache-friendly lookups."
      },
      {
        title: "Amortized Time Complexity",
        subtitle: "Why push_back is mathematically O(1) on average",
        diagram: "amortized-analysis-chart",
        formula: "Amortized Cost = Sum(Copies + Insertions) / N = O(1)",
        keyPoint: "Although doubling the buffer takes O(N) copy operations, it occurs rarely enough that each insertion costs O(1) amortized.",
        narration: "Push back operations run in amortized constant time because geometric doubling distributes the reallocation penalty across many fast insertions."
      },
      {
        title: "STL Iterators & Pointer Arithmetic",
        subtitle: "Navigating vector memory like raw pointers",
        diagram: "stl-iterators-range",
        formula: "for (auto it = vec.begin(); it != vec.end(); ++it)",
        keyPoint: "Iterators abstract pointer arithmetic across STL sequence containers like vector, deque, and list.",
        narration: "Iterators behave like smart pointers, giving algorithms generic access to contiguous memory ranges."
      }
    ]
  },

  "les-cpp-03": {
    topic: "Singly & Doubly Linked Lists Implementation",
    subject: "Computer Science",
    grade: "Undergraduate CS",
    youtubeId: "o5wJkJJpKtM",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/o5wJkJJpKtM",
    summary: "Construct dynamic linked list structures with nodes, head/tail pointers, and insertion/deletion algorithms.",
    visualTheme: "linked-list",
    slides: [
      {
        title: "Node Struct Definition",
        subtitle: "Self-referencing structures on the heap",
        diagram: "linked-list-node-diagram",
        formula: "struct Node { int data; Node* next; };",
        keyPoint: "Each node holds an individual element and a pointer referencing the subsequent heap-allocated node.",
        narration: "A linked list is a fundamental non-contiguous data structure. Each node is independently allocated in heap memory and linked by forward pointers."
      },
      {
        title: "Head Insertion & Traversal",
        subtitle: "Constant O(1) prepend operation",
        diagram: "linked-list-insert-head",
        formula: "newNode->next = head; head = newNode; // O(1)",
        keyPoint: "Inserting at the head of a linked list requires updating two pointer addresses, executing in strict O(1) constant time.",
        narration: "Unlike arrays which require shifting elements on insertion, linked lists insert at the head in O(1) time simply by swinging the head pointer."
      },
      {
        title: "Doubly Linked Lists & Deletion",
        subtitle: "Bi-directional navigation with next and prev pointers",
        diagram: "doubly-linked-list",
        formula: "node->prev->next = node->next; node->next->prev = node->prev;",
        keyPoint: "Doubly linked lists store both `next` and `prev` pointers, enabling backward traversal and O(1) removal when node pointer is given.",
        narration: "Doubly linked lists provide bidirectional traversal, allowing efficient deletions without having to traverse from the beginning to find previous nodes."
      }
    ]
  },

  "les-cpp-04": {
    topic: "Binary Search Trees & Tree Traversals",
    subject: "Computer Science",
    grade: "Undergraduate CS",
    youtubeId: "qH6yxkw0u78",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/qH6yxkw0u78",
    summary: "Master hierarchical binary search trees, In-Order, Pre-Order, and Post-Order recursion, and BST invariants.",
    visualTheme: "binary-tree",
    slides: [
      {
        title: "Binary Search Tree Invariant",
        subtitle: "Left < Root < Right ordered hierarchy",
        diagram: "bst-hierarchy",
        formula: "LeftSubtree(N) < N->val < RightSubtree(N)",
        keyPoint: "For every node in a BST, every key in its left subtree is smaller, and every key in its right subtree is larger.",
        narration: "Binary Search Trees organize hierarchical data such that search, insertion, and deletion run in O(log N) average time."
      },
      {
        title: "Tree Traversals: In-Order, Pre-Order, Post-Order",
        subtitle: "Systematic recursive depth-first visits",
        diagram: "tree-traversals-order",
        formula: "In-Order(root): Left -> Visit(root) -> Right // Sorted!",
        keyPoint: "In-order traversal of a valid BST always yields keys in strictly ascending sorted order.",
        narration: "Traversing a BST in-order recursively processes the left subtree, visits the current node, and processes the right subtree, outputting sorted data."
      },
      {
        title: "Search Complexity & Tree Balancing",
        subtitle: "Preventing degenerate O(N) skewness",
        diagram: "balanced-vs-skewed-tree",
        formula: "Balanced: O(log N) height vs Degenerate Linked List: O(N)",
        keyPoint: "If elements are inserted in sorted order, an un-balanced BST degenerates into an O(N) linked list, which AVL/Red-Black trees prevent.",
        narration: "Self-balancing binary search trees perform tree rotations to guarantee O(log N) worst-case search times even with sorted input."
      }
    ]
  },

  // -------------------------------------------------------------
  // Course 2: Java Enterprise & OOP
  // -------------------------------------------------------------
  "les-java-01": {
    topic: "Java Virtual Machine Architecture, Bytecode & Basics",
    subject: "Software Engineering",
    grade: "Undergraduate CS",
    youtubeId: "eIrMbAQSU34",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/eIrMbAQSU34",
    summary: "Examine JVM internals, class loaders, bytecode verification, JIT compilation, and Heap vs Stack memory.",
    visualTheme: "jvm-internals",
    slides: [
      {
        title: "Compile Once, Run Anywhere",
        subtitle: "The journey from source code to native CPU instructions",
        diagram: "jvm-execution-pipeline",
        formula: "App.java -> javac -> App.class (Bytecode) -> JVM JIT -> Machine Code",
        keyPoint: "Java compiles into platform-neutral bytecode (.class) which the JVM interprets and selectively compiles via Just-In-Time (JIT) compilers.",
        narration: "Java achieves cross-platform portability through the Java Virtual Machine. Your source code compiles into intermediate bytecode executed anywhere a JVM exists."
      },
      {
        title: "JVM Memory Areas: Stack vs Heap",
        subtitle: "Local variables versus dynamically allocated objects",
        diagram: "jvm-stack-heap",
        formula: "User u = new User(); // 'u' reference on Stack, User object on Heap",
        keyPoint: "Method call frames and primitive locals reside on thread-private Stacks; all class instances live on the shared garbage-collected Heap.",
        narration: "Every thread possesses its own private execution stack for method frames and local variables. All dynamically created objects reside in the shared Heap."
      },
      {
        title: "Automatic Garbage Collection",
        subtitle: "Generational garbage collection in modern JVMs",
        diagram: "jvm-garbage-collector",
        formula: "Eden Space -> Survivor (S0/S1) -> Tenured / Old Gen",
        keyPoint: "The weak generational hypothesis: most objects die young. Garbage collectors like G1 and ZGC reclaim unreferenced memory concurrently.",
        narration: "The JVM automatically manages heap memory through generational garbage collection, tracing object references to clean up unreferenced memory without manual free calls."
      }
    ]
  },

  "les-java-02": {
    topic: "OOP Principles: Encapsulation, Inheritance & Polymorphism",
    subject: "Software Engineering",
    grade: "Undergraduate CS",
    youtubeId: "GoXwIVyNvX0",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/GoXwIVyNvX0",
    summary: "Deepen understanding of the four pillars of OOP, dynamic dispatch, abstract classes, and interfaces.",
    visualTheme: "java-oop",
    slides: [
      {
        title: "Encapsulation & Data Hiding",
        subtitle: "Protecting object integrity via access modifiers",
        diagram: "encapsulation-getters-setters",
        formula: "private double balance; public void deposit(double amt) { ... }",
        keyPoint: "Keep fields private and expose validated public getters and setters to enforce business invariants.",
        narration: "Encapsulation bundles data attributes with the methods operating on that data, hiding internal state from unauthorized external mutation."
      },
      {
        title: "Inheritance & Class Hierarchies",
        subtitle: "Code reuse through the extends keyword",
        diagram: "class-inheritance-tree",
        formula: "public class SavingsAccount extends BankAccount { ... }",
        keyPoint: "Subclasses inherit protected and public members of superclasses, promoting code reuse while establishing 'is-a' relationships.",
        narration: "Inheritance models hierarchical relationships, allowing child classes to inherit properties and behaviors from parent classes."
      },
      {
        title: "Polymorphism & Dynamic Dispatch",
        subtitle: "Runtime method lookup via vtables",
        diagram: "runtime-polymorphism-dispatch",
        formula: "Shape s = new Circle(); s.draw(); // executes Circle.draw()",
        keyPoint: "At runtime, the JVM inspects the actual object type on the heap to invoke overridden methods dynamically.",
        narration: "Polymorphism lets you treat diverse child classes through a shared parent or interface type, dispatching method calls to the correct implementation at runtime."
      }
    ]
  },

  "les-java-03": {
    topic: "Java Collections Framework: ArrayList, HashMap & Sets",
    subject: "Software Engineering",
    grade: "Undergraduate CS",
    youtubeId: "BqQ0qR8kmw8",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/BqQ0qR8kmw8",
    summary: "Architect efficient enterprise code using `List`, `Set`, and `Map` contracts and understand hash collisions.",
    visualTheme: "java-collections",
    slides: [
      {
        title: "Collections Hierarchy: List vs Set vs Map",
        subtitle: "Choosing the optimal data container",
        diagram: "collections-framework-tree",
        formula: "List (Ordered, Duplicates) | Set (Unique) | Map (Key-Value)",
        keyPoint: "Use ArrayList for index-based sequential data, HashSet for unique memberships, and HashMap for associative key-value storage.",
        narration: "The Java Collections Framework provides standardized data structure interfaces and high-performance implementations for lists, sets, and key-value maps."
      },
      {
        title: "HashMap Internals & Hash Buckets",
        subtitle: "How HashMap achieves O(1) lookup performance",
        diagram: "hashmap-bucket-array",
        formula: "bucketIndex = (n - 1) & hash(key.hashCode())",
        keyPoint: "Keys are mapped to bucket indices via their hash code. Collisions are handled with linked lists, transitioning to Red-Black trees when buckets grow beyond 8 nodes.",
        narration: "A Java HashMap distributes entries across an internal bucket array. Keys are hashed, yielding instant average O(1) retrieval."
      },
      {
        title: "The equals() and hashCode() Contract",
        subtitle: "Guaranteeing correct object hashing in collections",
        diagram: "equals-hashcode-contract",
        formula: "If a.equals(b) == true, then a.hashCode() MUST equal b.hashCode()",
        keyPoint: "Violating this contract results in lost keys, duplicate set entries, and subtle memory leaks in enterprise applications.",
        narration: "Whenever overriding equals, you must consistently override hashCode to ensure HashMaps and HashSets can correctly locate your objects in bucket storage."
      }
    ]
  },

  "les-java-04": {
    topic: "Multithreading, Concurrency & Synchronization",
    subject: "Software Engineering",
    grade: "Undergraduate CS",
    youtubeId: "091vJWjl1A4",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/091vJWjl1A4",
    summary: "Master concurrency, thread lifecycles, race conditions, synchronized blocks, and modern Java virtual threads.",
    visualTheme: "multithreading",
    slides: [
      {
        title: "Threads & Process Concurrency",
        subtitle: "Parallel task execution across multiple CPU cores",
        diagram: "cpu-cores-threads",
        formula: "Thread t = new Thread(() -> doWork()); t.start();",
        keyPoint: "Threads share the same heap memory space within a process, enabling rapid communication but requiring synchronization.",
        narration: "Multithreading empowers applications to execute multiple tasks simultaneously across CPU cores, maximizing processor utilization and application responsiveness."
      },
      {
        title: "Race Conditions & Mutual Exclusion",
        subtitle: "Protecting critical sections with synchronized",
        diagram: "race-condition-mutex",
        formula: "synchronized(lock) { count++; } // Atomic read-modify-write",
        keyPoint: "Without synchronization, concurrent non-atomic writes to shared variables cause corrupted data due to interleaved CPU instructions.",
        narration: "When multiple threads concurrently read and modify shared state without synchronization, race conditions corrupt the data. Locks enforce mutual exclusion."
      },
      {
        title: "Thread Pools & Executors Framework",
        subtitle: "Managing enterprise worker thread pools efficiently",
        diagram: "executor-service-queue",
        formula: "ExecutorService pool = Executors.newFixedThreadPool(8);",
        keyPoint: "Reusing a pooled set of worker threads avoids the heavy CPU and memory overhead of creating and destroying OS threads on each request.",
        narration: "Enterprise architectures use ExecutorService thread pools to process asynchronous tasks efficiently without exhausting system resources."
      }
    ]
  },

  // -------------------------------------------------------------
  // Course 3: C Systems Programming
  // -------------------------------------------------------------
  "les-c-01": {
    topic: "C Fundamentals, Memory Model & Compiling with GCC",
    subject: "Systems Programming",
    grade: "Undergraduate CS",
    youtubeId: "KJgsSFOSQv0",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/KJgsSFOSQv0",
    summary: "Explore the C compilation pipeline (preprocessing, compilation, assembly, linking) and process memory layouts.",
    visualTheme: "c-compiler",
    slides: [
      {
        title: "The 4 Stages of C Compilation",
        subtitle: "How GCC transforms source code to an executable ELF binary",
        diagram: "gcc-pipeline-diagram",
        formula: "gcc -E (Preprocess) -> -S (Compile) -> -c (Assemble) -> ld (Link)",
        keyPoint: "Preprocessing handles macros and header inclusions; linking binds object files with runtime standard C libraries (libc).",
        narration: "The GNU Compiler Collection converts human-readable C code into a machine executable through preprocessing, compiling to assembly, assembling to machine object code, and linking libraries."
      },
      {
        title: "Process Address Space Layout",
        subtitle: "Stack, Heap, BSS, Data, and Text segments in Linux",
        diagram: "process-memory-layout",
        formula: "High Address (Stack grows down) <---> Low Address (Heap grows up)",
        keyPoint: "The text segment stores read-only CPU instructions; global initialized data lives in .data; uninitialized globals reside in .bss.",
        narration: "Every 64-bit Linux process enjoys a standardized virtual memory layout. Stack memory grows downward toward the heap, which expands upward."
      },
      {
        title: "Header Files & Header Guards",
        subtitle: "Preventing multiple declaration compiler errors",
        diagram: "c-header-guards",
        formula: "#ifndef MY_HEADER_H\n#define MY_HEADER_H\n// declarations\n#endif",
        keyPoint: "Include guards or `#pragma once` prevent compilation errors when headers are included transitively multiple times.",
        narration: "Header guards ensure each header file is processed only once by the C preprocessor, preventing duplicate symbol declarations."
      }
    ]
  },

  "les-c-02": {
    topic: "Dynamic Memory Allocation: malloc, calloc, realloc & free",
    subject: "Systems Programming",
    grade: "Undergraduate CS",
    youtubeId: "zuegQmMdy8M",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/zuegQmMdy8M",
    summary: "Understand heap memory management, memory leaks, buffer overflows, and defensive pointer sanitization.",
    visualTheme: "c-heap-memory",
    slides: [
      {
        title: "The Standard Memory Allocators",
        subtitle: "Requesting raw bytes from the operating system heap",
        diagram: "malloc-calloc-comparison",
        formula: "int* p = malloc(n * sizeof(int)); // uninitialized bytes\nint* q = calloc(n, sizeof(int)); // zero-initialized",
        keyPoint: "`malloc` returns uninitialized memory, whereas `calloc` zeroes all bytes. Always check if the returned pointer is `NULL`.",
        narration: "Dynamic memory allocation enables runtime sizing of data structures. Always verify that malloc did not return NULL due to memory exhaustion."
      },
      {
        title: "Preventing Memory Leaks & Dangling Pointers",
        subtitle: "Best practices for resource deallocation",
        diagram: "dangling-pointer-diagram",
        formula: "free(ptr);\nptr = NULL; // Zero the pointer to prevent use-after-free",
        keyPoint: "Failing to free allocated heap blocks creates memory leaks; accessing memory after freeing it triggers dangerous Use-After-Free security vulnerabilities.",
        narration: "Every malloc must be paired with free. Setting freed pointers to NULL prevents accidental use-after-free and double-free bugs."
      },
      {
        title: "Reallocating Buffers with realloc",
        subtitle: "Resizing allocated blocks safely in memory",
        diagram: "realloc-buffer-resizing",
        formula: "int* temp = realloc(arr, new_size * sizeof(int));\nif (temp) arr = temp;",
        keyPoint: "Always store `realloc` return in a temporary pointer; if realloc fails, original memory is preserved rather than leaked.",
        narration: "Realloc expands or contracts an existing heap block, relocating the data to a larger contiguous area if adjacent memory is unavailable."
      }
    ]
  },

  "les-c-03": {
    topic: "C Structs, Bitfields, Unions & Padding",
    subject: "Systems Programming",
    grade: "Undergraduate CS",
    youtubeId: "dqa0KMSMx2w",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/dqa0KMSMx2w",
    summary: "Explore structure memory layouts, memory alignment padding, unions, and bitfields for hardware registers.",
    visualTheme: "c-structs",
    slides: [
      {
        title: "Defining Structures & Typedefs",
        subtitle: "Grouping heterogeneous data into custom composite types",
        diagram: "c-struct-layout",
        formula: "typedef struct {\n    uint32_t id;\n    char name[32];\n} Student;",
        keyPoint: "Structs group heterogeneous data types contiguously. `typedef` creates clean type aliases avoiding repeated `struct` keywords.",
        narration: "C structs group variables of different types under a single named type, serving as the foundational building block for system-level data structures."
      },
      {
        title: "Structure Padding & Alignment",
        subtitle: "Why sizeof(struct) is often larger than the sum of its members",
        diagram: "struct-padding-alignment",
        formula: "struct S { char c; /* 3 pad bytes */ int i; }; // sizeof = 8 bytes",
        keyPoint: "CPUs access memory faster when multi-byte words are aligned to multiples of their natural size (4 or 8 bytes).",
        narration: "Modern CPU architectures access memory at word boundaries. Compilers insert hidden padding bytes into structs to satisfy hardware alignment requirements."
      },
      {
        title: "Unions & Bitfields for Low-Level Hardware",
        subtitle: "Sharing memory locations and manipulating single bits",
        diagram: "union-shared-memory",
        formula: "union Data { int i; float f; char str[4]; }; // All share 4 bytes",
        keyPoint: "Unions store different data types in the exact same memory location, while bitfields allow direct packing of flags into individual bits.",
        narration: "Unions overlay multiple fields onto the same memory location, while bitfields allow low-level device drivers to map hardware control registers bit-by-bit."
      }
    ]
  },

  "les-c-04": {
    topic: "Unix System Calls: fork, exec, pipes & Signals",
    subject: "Systems Programming",
    grade: "Undergraduate CS",
    youtubeId: "IFEFVXvjiHY",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/IFEFVXvjiHY",
    summary: "Interact directly with the Linux kernel via POSIX system calls for process creation, IPC pipes, and signal handling.",
    visualTheme: "unix-syscalls",
    slides: [
      {
        title: "Process Creation with fork()",
        subtitle: "Cloning calling processes via kernel copy-on-write",
        diagram: "fork-process-tree",
        formula: "pid_t pid = fork();\nif (pid == 0) { /* Child */ } else { /* Parent */ }",
        keyPoint: "fork() creates an exact duplicate of the process. It returns 0 in the child process and the child's PID in the parent process.",
        narration: "The fork system call clones the calling process. The operating system creates a duplicate process running concurrently with copy-on-write memory sharing."
      },
      {
        title: "Replacing Process Images with execvp()",
        subtitle: "Loading and executing new program binaries from disk",
        diagram: "exec-memory-replace",
        formula: "execvp(args[0], args); // Overwrites text, data, and stack segments",
        keyPoint: "`exec` replaces the current process memory with a brand new executable image, preserving open file descriptors unless flagged O_CLOEXEC.",
        narration: "Exec replaces the current process image with a new executable program from disk, transforming the child into the desired command."
      },
      {
        title: "Inter-Process Communication (IPC) via Pipes",
        subtitle: "Streaming byte buffers between processes",
        diagram: "unix-pipe-buffer",
        formula: "int fd[2]; pipe(fd); // fd[0] is read end, fd[1] is write end",
        keyPoint: "Pipes provide unidirectional FIFO byte streams managed in kernel memory buffers connecting parent and child processes.",
        narration: "Unix pipes provide unidirectional data streams between processes. The output of one process feeds directly into the input of another."
      }
    ]
  },

  // -------------------------------------------------------------
  // Course 4: C# & ASP.NET Core
  // -------------------------------------------------------------
  "les-cs-01": {
    topic: "C# Syntax, Value vs Reference Types & CLR",
    subject: "Web & API Engineering",
    grade: "Undergraduate CS",
    youtubeId: "gfkTfcpWqAY",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/gfkTfcpWqAY",
    summary: "Understand C# 12 modern language features, Common Language Runtime (CLR), and stack vs managed heap storage.",
    visualTheme: "csharp-clr",
    slides: [
      {
        title: "Modern C# & The .NET Ecosystem",
        subtitle: "High-performance type-safe cross-platform software",
        diagram: "dotnet-clr-architecture",
        formula: "C# Source -> Roslyn Compiler -> Intermediate Language (IL) -> CLR JIT",
        keyPoint: "C# compiles into Common Intermediate Language (CIL), compiled just-in-time into lightning-fast native assembly by the .NET CLR.",
        narration: "C# is a modern, statically typed language powered by the open-source .NET runtime. It combines native performance with productive enterprise tooling."
      },
      {
        title: "Value Types vs Reference Types",
        subtitle: "Structs on the stack vs Classes on the managed heap",
        diagram: "csharp-value-reference",
        formula: "int a = 5; (Value - Stack copy) | Person p = new(); (Reference - Heap pointer)",
        keyPoint: "Value types (`int`, `bool`, `struct`) copy values by value; Reference types (`class`, `string`, `record`) pass references to heap objects.",
        narration: "Understanding the distinction between stack-allocated value types and heap-allocated reference types is fundamental to high-throughput C# programming."
      },
      {
        title: "Null Safety & Modern Pattern Matching",
        subtitle: "Preventing NullReferenceException at compile time",
        diagram: "nullable-reference-types",
        formula: "string? optional = null; if (obj is Student { Gpa: >= 3.5 } honors) { ... }",
        keyPoint: "C# nullable reference types warn about potential null dereferences at compile time, eliminating null pointer exceptions.",
        narration: "C# nullable reference types and expressive pattern matching catch null bugs and simplify complex conditional checks before runtime."
      }
    ]
  },

  "les-cs-02": {
    topic: "C# OOP, Interfaces, Abstract Classes & Generics",
    subject: "Web & API Engineering",
    grade: "Undergraduate CS",
    youtubeId: "pTB0EiLXUC8",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/pTB0EiLXUC8",
    summary: "Architect clean software using interfaces, abstract classes, dependency contracts, and type-safe generics.",
    visualTheme: "csharp-oop",
    slides: [
      {
        title: "Interfaces as Architectural Contracts",
        subtitle: "Decoupling implementation from consumers",
        diagram: "interface-contract-uml",
        formula: "public interface IRepository<T> { Task<T?> GetByIdAsync(string id); }",
        keyPoint: "Interfaces define what a service does without dictating how, enabling loose coupling and testable unit architectures.",
        narration: "Interfaces establish clear contracts in your software architecture, allowing components to interact without hard dependencies on concrete classes."
      },
      {
        title: "Generics & Type Constraints",
        subtitle: "Reusable data structures without boxing overhead",
        diagram: "generics-type-parameter",
        formula: "public class Cache<T> where T : class, IEntity, new() { ... }",
        keyPoint: "Generics provide type safety and avoid boxing/unboxing performance penalties for value types.",
        narration: "C# generics allow classes and methods to operate on parameterized types with zero runtime boxing overhead."
      },
      {
        title: "Records & Immutability in Modern C#",
        subtitle: "Value-based equality and thread-safe data transfer objects",
        diagram: "csharp-records-with",
        formula: "public record UserDto(string Id, string Email);\nvar updated = original with { Email = \"new@work.com\" };",
        keyPoint: "Records provide built-in value-based equality, concise primary constructor syntax, and non-destructive mutation via `with` expressions.",
        narration: "C# records deliver immutable data models with automatic value equality, ideal for enterprise web API request and response payloads."
      }
    ]
  },

  "les-cs-03": {
    topic: "LINQ Queries, Delegates, Lambdas & Collections",
    subject: "Web & API Engineering",
    grade: "Undergraduate CS",
    youtubeId: "z3PowDJKOSA",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/z3PowDJKOSA",
    summary: "Master Language Integrated Query (LINQ), deferred execution, lambdas, and high-performance collection processing.",
    visualTheme: "csharp-linq",
    slides: [
      {
        title: "Language Integrated Query (LINQ)",
        subtitle: "Declarative functional querying for in-memory collections",
        diagram: "linq-query-pipeline",
        formula: "var topStudents = students.Where(s => s.Score > 85).OrderByDescending(s => s.Score).ToList();",
        keyPoint: "LINQ brings SQL-like query expressiveness directly into C# syntax with compile-time type checking and IntelliSense.",
        narration: "Language Integrated Query enables expressive, readable filtering, sorting, and transformations across collections and database queries."
      },
      {
        title: "Deferred Execution vs Immediate Execution",
        subtitle: "How IEnumerable delays computation until iterated",
        diagram: "deferred-execution-stream",
        formula: "IEnumerable<T> query = ... // Evaluated ONLY when foreach or ToList() is invoked",
        keyPoint: "Deferred queries only execute when enumerated. Materializing with `.ToList()` or `.ToArray()` forces immediate database queries.",
        narration: "LINQ operations use deferred execution. They represent an executable query plan that does not run until you iterate over the results."
      },
      {
        title: "Delegates, Func, Action & Lambda Expressions",
        subtitle: "First-class functional programming constructs",
        diagram: "func-action-delegates",
        formula: "Func<int, int, bool> isGreater = (a, b) => a > b;",
        keyPoint: "Delegates are type-safe function pointers; `Func<T, TResult>` and `Action<T>` are standard built-in delegates for passing callbacks.",
        narration: "Delegates and lambda expressions treat functions as first-class citizens, enabling elegant event handling and functional pipelines."
      }
    ]
  },

  "les-cs-04": {
    topic: "ASP.NET Core REST APIs, Dependency Injection & EF Core",
    subject: "Web & API Engineering",
    grade: "Undergraduate CS",
    youtubeId: "BfEjDD8mWYg",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/BfEjDD8mWYg",
    summary: "Construct production-ready enterprise REST APIs with controllers, async EF Core repositories, and middleware.",
    visualTheme: "aspnet-core-api",
    slides: [
      {
        title: "ASP.NET Core HTTP Middleware Pipeline",
        subtitle: "Bidirectional request processing pipeline",
        diagram: "middleware-pipeline-flow",
        formula: "HTTP Request -> Auth -> Routing -> Endpoint/Controller -> Response",
        keyPoint: "Middleware components execute sequentially on incoming HTTP requests and in reverse order on outgoing responses.",
        narration: "Every HTTP request in ASP.NET Core passes through an extensible middleware pipeline handling authentication, CORS, routing, and error logging."
      },
      {
        title: "Built-In Dependency Injection (IoC)",
        subtitle: "Managing service lifecycles across the application",
        diagram: "di-lifetimes-diagram",
        formula: "builder.Services.AddScoped<ICourseService, CourseService>();",
        keyPoint: "Transient creates a new instance every time; Scoped creates one per HTTP request; Singleton creates a single instance for the app lifespan.",
        narration: "ASP.NET Core features built-in Dependency Injection, decoupling classes and managing service lifespans across web requests."
      },
      {
        title: "Entity Framework Core & Async/Await",
        subtitle: "High-performance Object-Relational Mapping (ORM)",
        diagram: "efcore-dbcontext-flow",
        formula: "var course = await _db.Courses.Include(c => c.Modules).FirstOrDefaultAsync(c => c.Id == id);",
        keyPoint: "EF Core translates LINQ queries to optimized SQL queries asynchronously, freeing web server threads while waiting on database disk I/O.",
        narration: "Entity Framework Core translates high-level C# LINQ queries into optimized SQL commands, handling migrations, transactions, and entity mapping."
      }
    ]
  },

  // -------------------------------------------------------------
  // Course 5: Git & GitHub
  // -------------------------------------------------------------
  "les-git-01": {
    topic: "Git Architecture: Working Directory, Staging & Commits",
    subject: "Developer Tools",
    grade: "All Levels & DevOps",
    youtubeId: "hwP7WQkmECE",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/hwP7WQkmECE",
    summary: "Understand the fundamental three-state architecture of Git, blob hashing, and tree snapshots.",
    visualTheme: "git-architecture",
    slides: [
      {
        title: "The Three Trees of Git",
        subtitle: "Working Directory, Staging Area (Index), and Repository",
        diagram: "git-three-trees",
        formula: "Working Directory --[git add]--> Staging Area --[git commit]--> Local Repo",
        keyPoint: "The staging area lets you craft granular, atomic commits containing only related code changes.",
        narration: "Git is organized around three fundamental states: your modified working files, the staged index snapshot, and the immutable committed repository."
      },
      {
        title: "Cryptographic Commit Snapshots",
        subtitle: "How SHA-1/SHA-256 hashes guarantee data integrity",
        diagram: "git-commit-dag",
        formula: "Commit = SHA(Tree hash + Parent commit + Author + Commit message)",
        keyPoint: "Git does not store diffs; it stores complete directory tree snapshots. Identical files share existing blob hashes.",
        narration: "Every Git commit stores a complete snapshot of your codebase, cryptographically linked to its parent commits in a Directed Acyclic Graph."
      },
      {
        title: "Essential Everyday Git CLI Commands",
        subtitle: "Inspecting status, diffs, and historical logs",
        diagram: "git-cli-commands",
        formula: "git status -s\ngit diff --staged\ngit log --oneline --graph",
        keyPoint: "`git status` reveals modified and untracked files; `git diff --staged` verifies exact lines queued for the next commit.",
        narration: "Mastering CLI commands like git status, git diff, and git log gives you complete visibility and control over project history."
      }
    ]
  },

  "les-git-02": {
    topic: "Branching, Merging, Rebasing & Resolving Merge Conflicts",
    subject: "Developer Tools",
    grade: "All Levels & DevOps",
    youtubeId: "oPpnCh7InLY",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/oPpnCh7InLY",
    summary: "Master Git branches as lightweight pointers, fast-forward merges, 3-way merge commits, and conflict resolution.",
    visualTheme: "git-branching",
    slides: [
      {
        title: "Lightweight Branch Pointers",
        subtitle: "Why branching in Git costs virtually zero disk space",
        diagram: "git-branches-head",
        formula: "git checkout -b feature/auth // Creates pointer and moves HEAD",
        keyPoint: "A Git branch is simply a 41-byte text file containing a 40-character commit hash. Creating a branch is instantaneous.",
        narration: "Branches in Git are lightweight pointers that move forward with each commit, enabling developers to isolate experimental features effortlessly."
      },
      {
        title: "Fast-Forward vs 3-Way Merge",
        subtitle: "How Git combines divergent lines of development",
        diagram: "git-merge-types",
        formula: "Fast-forward: Moves branch pointer | 3-way merge: Creates merge commit C_m",
        keyPoint: "If history has diverged, Git calculates a common ancestor and performs a 3-way merge, creating a new merge commit with two parents.",
        narration: "When merging branches, Git fast-forwards if possible, or generates a merge commit by calculating diffs against the common ancestor."
      },
      {
        title: "Resolving Merge Conflicts Confidently",
        subtitle: "Decoding conflict markers in modified source files",
        diagram: "git-conflict-markers",
        formula: "<<<<<<< HEAD\ncurrent changes\n=======\nincoming branch changes\n>>>>>>> feature/auth",
        keyPoint: "Conflicts happen when both branches modify the same lines. Edit the file, remove the conflict markers, `git add`, and finalize the commit.",
        narration: "Merge conflicts occur when conflicting changes touch identical lines. Developers review both versions, pick the correct solution, and mark it resolved."
      }
    ]
  },

  "les-git-03": {
    topic: "Remote Repositories, Forking & Collaborative Pull Requests",
    subject: "Developer Tools",
    grade: "All Levels & DevOps",
    youtubeId: "nCKdihvneS0",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/nCKdihvneS0",
    summary: "Work productively with GitHub remotes, origin/upstream configurations, peer code reviews, and pull request workflows.",
    visualTheme: "github-pr",
    slides: [
      {
        title: "Remote Tracking Branches",
        subtitle: "Synchronizing local work with GitHub servers",
        diagram: "git-remote-sync",
        formula: "git remote add origin https://github.com/org/repo.git\ngit push -u origin main",
        keyPoint: "Remotes like `origin` are aliases for remote repository URLs. `git fetch` updates tracking branches (`origin/main`) without modifying your local code.",
        narration: "Remote tracking branches keep your local repository in sync with GitHub, enabling team members to push and pull updates collaboratively."
      },
      {
        title: "Forking & Feature Branch Pull Requests",
        subtitle: "The industry-standard open-source contribution model",
        diagram: "github-fork-pr-workflow",
        formula: "Fork Repo -> Clone -> Create Branch -> Push -> Open Pull Request",
        keyPoint: "Developers fork repositories, build features on isolated branches, and submit Pull Requests for team code review before merging.",
        narration: "The Pull Request model allows team members and external contributors to propose changes, review code line by line, and run automated checks."
      },
      {
        title: "Code Review & Clean PR Etiquette",
        subtitle: "Writing effective PR descriptions and squashing commits",
        diagram: "pr-review-comments",
        formula: "Small PRs (< 300 lines) = Faster reviews + Zero production regressions",
        keyPoint: "Keep pull requests focused on a single responsibility. Link issue tickets and provide before/after testing notes.",
        narration: "Effective pull requests are concise, well-documented, and thoroughly tested, accelerating peer reviews and ensuring software quality."
      }
    ]
  },

  "les-git-04": {
    topic: "GitHub Actions, CI/CD Pipelines & Automated Testing",
    subject: "Developer Tools",
    grade: "All Levels & DevOps",
    youtubeId: "R8_veQiYBjI",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/R8_veQiYBjI",
    summary: "Automate builds, test suites, linter checks, and container deployments using GitHub Actions YAML workflows.",
    visualTheme: "github-actions",
    slides: [
      {
        title: "Workflow Declarations in YAML",
        subtitle: "Declarative continuous integration pipelines in .github/workflows",
        diagram: "github-actions-syntax",
        formula: "name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest",
        keyPoint: "Workflows are defined in YAML and automatically triggered by events like pushes, pull requests, releases, or cron schedules.",
        narration: "GitHub Actions automates your software development lifecycle. Workflows declared in YAML run unit tests and builds on every pull request."
      },
      {
        title: "Jobs, Steps & Action Marketplace",
        subtitle: "Composing multi-step automated build pipelines",
        diagram: "actions-steps-runner",
        formula: "steps:\n  - uses: actions/checkout@v4\n  - uses: actions/setup-node@v4\n  - run: npm test",
        keyPoint: "Workflows contain jobs running in parallel or sequentially. Each job executes discrete steps inside clean runner containers.",
        narration: "A job contains individual sequential steps that check out your repository code, configure runtime environments, and run automated test suites."
      },
      {
        title: "Continuous Delivery (CD) & Secrets Management",
        subtitle: "Deploying production artifacts safely to the cloud",
        diagram: "cd-deployment-pipeline",
        formula: "env:\n  API_KEY: secrets.PROD_API_KEY",
        keyPoint: "Store sensitive database credentials and deployment tokens encrypted in GitHub Secrets; workflows inject them as runtime environment variables.",
        narration: "Continuous Delivery pipelines automatically package and deploy verified code to cloud providers using encrypted GitHub Secrets for credentials."
      }
    ]
  },

  // -------------------------------------------------------------
  // Course 6: Docker & DevOps
  // -------------------------------------------------------------
  "les-docker-01": {
    topic: "Containerization Concepts vs Virtual Machines",
    subject: "Cloud & DevOps",
    grade: "Undergraduate CS & DevOps",
    youtubeId: "Gjnup-PuquQ",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/Gjnup-PuquQ",
    summary: "Understand container virtualization, Linux namespaces, cgroups, Union File Systems, and how containers share the host kernel.",
    visualTheme: "docker-concepts",
    slides: [
      {
        title: "Virtual Machines vs Docker Containers",
        subtitle: "Hypervisors with guest OS vs Kernel-level isolation",
        diagram: "vm-vs-container-stack",
        formula: "VM: App + Bin/Libs + Full Guest OS (GBs)\nContainer: App + Bin/Libs (Shares Host Kernel) (MBs)",
        keyPoint: "Containers run directly as isolated processes on the host OS kernel, eliminating hypervisor overhead and booting in milliseconds.",
        narration: "Unlike virtual machines which duplicate an entire guest operating system, Docker containers share the host Linux kernel, making them lightweight and fast."
      },
      {
        title: "Linux Namespaces & Control Groups (cgroups)",
        subtitle: "The low-level kernel primitives powering Docker",
        diagram: "kernel-cgroups-namespaces",
        formula: "Namespaces (What you see: PID, NET, MNT) + cgroups (What you use: CPU, RAM)",
        keyPoint: "Namespaces provide isolation so containers cannot see each other; cgroups enforce resource limits like capping memory to 512MB.",
        narration: "Docker leverages Linux kernel namespaces for process and network isolation, while control groups enforce hard limits on CPU and memory usage."
      },
      {
        title: "Images vs Containers",
        subtitle: "Blueprints versus running execution instances",
        diagram: "image-to-container",
        formula: "docker run -d -p 8080:80 nginx:alpine // Image instantiated into Container",
        keyPoint: "A Docker Image is an immutable read-only blueprint; a Container is a live, running instance with a thin read-write scratch layer.",
        narration: "Think of a Docker image as a class definition, and a running container as an instantiated object running isolated in memory."
      }
    ]
  },

  "les-docker-02": {
    topic: "Writing Dockerfiles, Layer Caching & Multi-Stage Builds",
    subject: "Cloud & DevOps",
    grade: "Undergraduate CS & DevOps",
    youtubeId: "3c-iBn73dDE",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/3c-iBn73dDE",
    summary: "Write production-grade Dockerfiles, optimize image layer caching, minimize attack surfaces, and implement multi-stage builds.",
    visualTheme: "dockerfile-layers",
    slides: [
      {
        title: "Dockerfile Instructions & Layer Architecture",
        subtitle: "Constructing layered read-only container file systems",
        diagram: "dockerfile-layers-stack",
        formula: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD [\"npm\", \"start\"]",
        keyPoint: "Each instruction (FROM, COPY, RUN) creates an immutable filesystem layer. Unchanged layers are cached to make builds lightning fast.",
        narration: "A Dockerfile is a step-by-step recipe for building container images. Every command adds a cached filesystem layer."
      },
      {
        title: "Optimizing Layer Caching",
        subtitle: "Ordering commands to prevent unnecessary cache invalidation",
        diagram: "cache-invalidation-order",
        formula: "Rule: Copy dependency files (package.json) BEFORE copying app source code!",
        keyPoint: "If a layer changes, all subsequent layers must be rebuilt. Placing frequently changing code at the end maximizes cache hits.",
        narration: "To optimize build speeds, copy dependency definitions first, run package installs, and only then copy application source files."
      },
      {
        title: "Multi-Stage Builds for Minimal Images",
        subtitle: "Separating heavy build tools from production runtime",
        diagram: "multi-stage-build-diagram",
        formula: "Stage 1: 'FROM sdk AS build' (Compiles code)\nStage 2: 'FROM aspnet:alpine' (Copies ONLY compiled dlls, drops compiler)",
        keyPoint: "Multi-stage builds produce tiny, secure production images by discarding heavyweight compilers, SDKs, and build dependencies.",
        narration: "Multi-stage builds compile applications inside full-featured build containers, then copy only the resulting production binaries into minimal base images."
      }
    ]
  },

  "les-docker-03": {
    topic: "Docker Storage Volumes, Bind Mounts & Virtual Networks",
    subject: "Cloud & DevOps",
    grade: "Undergraduate CS & DevOps",
    youtubeId: "pg19Z8LL06w",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/pg19Z8LL06w",
    summary: "Persist database state with Docker managed volumes, use bind mounts for rapid local development, and configure bridge networks.",
    visualTheme: "docker-storage-network",
    slides: [
      {
        title: "Container Ephemerality & Docker Volumes",
        subtitle: "Persisting data beyond container deletion",
        diagram: "docker-volumes-persistence",
        formula: "docker volume create pgdata\ndocker run -v pgdata:/var/lib/postgresql/data postgres:16",
        keyPoint: "By default, container filesystems are ephemeral. Managed volumes persist data on the host machine even when containers are deleted.",
        narration: "Containers are designed to be ephemeral and disposable. Docker volumes ensure databases and uploaded files persist across container restarts."
      },
      {
        title: "Bind Mounts for Hot-Reloading Development",
        subtitle: "Mapping host project directories into live containers",
        diagram: "bind-mount-host-container",
        formula: "docker run -v $(pwd):/app -p 3000:3000 my-node-app",
        keyPoint: "Bind mounts directly project your local workstation files into the container, allowing code changes to reload instantly without rebuilding images.",
        narration: "Bind mounts link a directory on your development machine directly into a container, enabling instant live reloading during coding."
      },
      {
        title: "Docker Bridge Networks & DNS Resolution",
        subtitle: "Isolated inter-container communication",
        diagram: "docker-bridge-network-dns",
        formula: "docker network create my-net\n// Containers communicate by service name: http://api:5000",
        keyPoint: "Custom user-defined bridge networks provide automatic internal DNS resolution between containers using their container names.",
        narration: "Docker user-defined bridge networks isolate container communication and provide internal DNS lookup so services resolve each other by name."
      }
    ]
  },

  "les-docker-04": {
    topic: "Docker Compose Multi-Container Orchestration",
    subject: "Cloud & DevOps",
    grade: "Undergraduate CS & DevOps",
    youtubeId: "Qw9zlE3t8Ko",
    youtubeEmbed: "https://www.youtube-nocookie.com/embed/Qw9zlE3t8Ko",
    summary: "Orchestrate fullstack application environments (React frontend, .NET backend, PostgreSQL, Redis) using `docker-compose.yml`.",
    visualTheme: "docker-compose",
    slides: [
      {
        title: "Defining Multi-Container Architecture",
        subtitle: "Declarative application environments in docker-compose.yml",
        diagram: "docker-compose-stack",
        formula: "services:\n  web: { build: ./frontend, ports: ['3000:3000'] }\n  api: { build: ./backend, ports: ['5000:5000'] }\n  db: { image: postgres:16, volumes: ['pgdata:/var/lib/postgresql/data'] }",
        keyPoint: "Docker Compose enables launching an entire multi-tier system with one unified YAML specification.",
        narration: "Docker Compose allows developers to define and run multi-container applications, configuring web frontends, backend APIs, and databases together."
      },
      {
        title: "Service Dependencies & Healthchecks",
        subtitle: "Controlling startup order with depends_on",
        diagram: "compose-depends-on",
        formula: "depends_on:\n  db:\n    condition: service_healthy",
        keyPoint: "`depends_on` with condition health checks ensures your backend API waits until PostgreSQL is fully initialized before attempting connections.",
        narration: "Use service health checks and depends_on conditions to guarantee databases and dependencies are completely ready before dependent services boot."
      },
      {
        title: "Managing Environments with Compose CLI",
        subtitle: "Full lifecycle control with a single command",
        diagram: "compose-up-down",
        formula: "docker compose up -d --build\ndocker compose logs -f api\ndocker compose down -v",
        keyPoint: "`docker compose up` provisions networks, volumes, and builds container images in parallel; `down -v` safely tears them down.",
        narration: "With docker compose up and down, spinning up or tearing down complete development, staging, or production environments takes seconds."
      }
    ]
  }
};
