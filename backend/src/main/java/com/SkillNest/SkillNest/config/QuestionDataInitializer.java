package com.SkillNest.SkillNest.config;

import com.SkillNest.SkillNest.entity.Question;
import com.SkillNest.SkillNest.repo.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Order(2)
public class QuestionDataInitializer implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    public QuestionDataInitializer(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) {
        // Clean up known dummy questions
        cleanupDummyQuestions();

        // Seed 12+ questions for all 9 categories
        seedCategoryIfFew("java", getJavaQuestions());
        seedCategoryIfFew("python", getPythonQuestions());
        seedCategoryIfFew("c++", getCppQuestions());
        seedCategoryIfFew("html", getHtmlQuestions());
        seedCategoryIfFew("css", getCssQuestions());
        seedCategoryIfFew("javascript", getJavascriptQuestions());
        seedCategoryIfFew("react", getReactQuestions());
        seedCategoryIfFew("node.js", getNodeJsQuestions());
        seedCategoryIfFew("sql", getSqlQuestions());

        System.out.println("Question bank check complete. Total questions in database: " + questionRepository.count());
    }

    private void cleanupDummyQuestions() {
        List<Question> all = questionRepository.findAll();
        for (Question q : all) {
            String title = q.getTitle() != null ? q.getTitle().toLowerCase() : "";
            String optA = q.getOptionA() != null ? q.getOptionA().toLowerCase() : "";
            if (title.contains("college name") || title.contains("who is aarya") ||
                optA.contains("adfasdfasdf") || optA.contains("aditya ramesh") ||
                title.equals("what is cpp") || title.contains("full form of ui")) {
                try {
                    questionRepository.deleteFromQuizQuestions(q.getId());
                    questionRepository.deleteById(q.getId());
                    System.out.println("Removed dummy test question: " + q.getTitle());
                } catch (Exception e) {
                    System.err.println("Could not delete dummy question ID " + q.getId() + ": " + e.getMessage());
                }
            }
        }
    }

    private void seedCategoryIfFew(String category, List<Question> curatedQuestions) {
        List<Question> existing = questionRepository.findByCategoryIgnoreCase(category);
        if (existing.size() < 10) {
            System.out.println("Seeding " + curatedQuestions.size() + " questions for category: " + category);
            questionRepository.saveAll(curatedQuestions);
        }
    }

    private Question createQ(String title, String category, String topic, String difficulty,
                             String optA, String optB, String optC, String optD,
                             int answer, String explanation) {
        Question q = new Question();
        q.setTitle(title);
        q.setCategory(category.toLowerCase());
        q.setTopic(topic);
        q.setDifficulty(difficulty);
        q.setOptionA(optA);
        q.setOptionB(optB);
        q.setOptionC(optC);
        q.setOptionD(optD);
        q.setAnswer(answer);
        q.setExplanation(explanation);
        q.setMarks(1);
        return q;
    }

    // =========================================================================
    // 1. JAVA QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getJavaQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "Which component in Java is responsible for converting bytecode into machine code?",
                "java", "JVM Architecture", "Easy",
                "JDK (Java Development Kit)",
                "JVM (Java Virtual Machine) JIT Compiler",
                "Javadoc Tool",
                "Java ClassLoader",
                1, "The Just-In-Time (JIT) compiler inside the JVM compiles bytecode into native machine instructions at runtime for improved performance."
        ));
        list.add(createQ(
                "Why are Strings immutable in Java?",
                "java", "Core Concepts", "Medium",
                "To save disk storage on the server",
                "For security, synchronization thread-safety, and string pool caching",
                "Because Java does not allow dynamic memory allocation",
                "To prevent inheritance of primitive types",
                1, "String immutability ensures security (e.g., in network connections and file paths), thread-safety without synchronization, and enables String Constant Pool caching."
        ));
        list.add(createQ(
                "Which keyword is used by a class to inherit another class in Java?",
                "java", "OOP", "Easy",
                "implements",
                "inherits",
                "extends",
                "super",
                2, "In Java, a class inherits another class using the 'extends' keyword. The 'implements' keyword is used to implement interfaces."
        ));
        list.add(createQ(
                "How does HashMap handle collisions in Java 8 and later?",
                "java", "Collections Framework", "Hard",
                "By throwing a HashCollisionException",
                "Using separate chaining with linked lists, transitioning to red-black trees when a bucket exceeds 8 elements",
                "Using linear probing only",
                "By expanding the table capacity immediately without storing the second element",
                1, "In Java 8+, HashMap uses linked lists for collisions, but converts them into balanced red-black trees once a bucket reaches TREEIFY_THRESHOLD (8 elements) to improve lookup time from O(n) to O(log n)."
        ));
        list.add(createQ(
                "Which statement is true regarding the difference between an Abstract Class and an Interface in Java 8+?",
                "java", "OOP Design", "Medium",
                "Abstract classes cannot have constructors, while interfaces can",
                "Interfaces can have default and static methods with implementations, but cannot maintain mutable instance state",
                "A class can extend multiple abstract classes",
                "Interfaces can have private instance fields",
                1, "Java 8 introduced default and static methods in interfaces, but interfaces still cannot have instance variables (state) or constructors, unlike abstract classes."
        ));
        list.add(createQ(
                "Which of the following is an Unchecked Exception in Java?",
                "java", "Exception Handling", "Easy",
                "IOException",
                "SQLException",
                "NullPointerException",
                "ClassNotFoundException",
                2, "NullPointerException inherits from RuntimeException, making it an unchecked exception that the compiler does not force you to declare or catch."
        ));
        list.add(createQ(
                "What is the effect of the 'volatile' keyword when applied to a variable in Java?",
                "java", "Multithreading", "Hard",
                "It makes the variable immutable across all threads",
                "It guarantees atomic operations on compound assignments like count++",
                "It ensures that reads and writes are visible immediately to all threads by bypassing thread-local caches",
                "It automatically synchronizes all method calls on the variable",
                2, "The 'volatile' keyword establishes a happens-before relationship ensuring memory visibility across threads, though it does not guarantee atomicity for compound operations."
        ));
        list.add(createQ(
                "In the Java 8 Stream API, what is the primary difference between map() and flatMap()?",
                "java", "Streams & Functional", "Medium",
                "map() filters elements, while flatMap() sorts them",
                "map() transforms each element into a single value, while flatMap() flattens a stream of streams into a single stream",
                "map() is a terminal operation, while flatMap() is intermediate",
                "flatMap() can only be applied to primitive types",
                1, "map() applies a 1-to-1 transformation, whereas flatMap() maps each element to a stream and then flattens all resulting streams into one continuous stream (1-to-many)."
        ));
        list.add(createQ(
                "What is the difference between equals() and '==' when comparing two objects in Java?",
                "java", "Core Concepts", "Easy",
                "'==' compares object state, while equals() compares memory addresses",
                "'==' compares memory references, while equals() is overridden to compare meaningful object equality",
                "There is no difference; they are interchangeable aliases",
                "'==' is only for String comparison, equals() is for numbers",
                1, "The '==' operator checks reference equality (whether both references point to the exact same memory address), whereas equals() evaluates value equivalence when properly overridden."
        ));
        list.add(createQ(
                "What happens during autoboxing in Java?",
                "java", "Core Java", "Easy",
                "A class is automatically converted into an interface",
                "The automatic conversion that the Java compiler makes between primitive types and their corresponding wrapper classes",
                "Automatic garbage collection of heap references",
                "Conversion of byte arrays to String representations",
                1, "Autoboxing is the automatic conversion by the Java compiler of primitive types (like int, double) into their corresponding object wrapper classes (like Integer, Double)."
        ));
        list.add(createQ(
                "Which collection class does NOT permit null keys or null values and is synchronized?",
                "java", "Collections Framework", "Medium",
                "HashMap",
                "Hashtable",
                "TreeMap",
                "LinkedHashMap",
                1, "Hashtable is thread-safe (synchronized) and strictly forbids null keys and null values, throwing a NullPointerException if either is inserted."
        ));
        list.add(createQ(
                "What is the purpose of the 'finally' block in a Java try-catch statement?",
                "java", "Exception Handling", "Easy",
                "To catch runtime exceptions exclusively",
                "To guarantee execution of cleanup code (like closing streams) regardless of whether an exception occurred",
                "To restart the try block if an error occurred",
                "To terminate the JVM immediately",
                1, "The 'finally' block always executes when the try block exits, ensuring crucial resource cleanups (such as closing database connections and file descriptors) are performed."
        ));
        return list;
    }

    // =========================================================================
    // 2. PYTHON QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getPythonQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "What is a common pitfall of using a mutable default argument (like a list) in a Python function?",
                "python", "Functions & Arguments", "Medium",
                "Python raises a SyntaxError at compile time",
                "The default object is created once when the function is defined and shared across all subsequent invocations",
                "The list is deleted after the first function call",
                "Mutable default arguments can only accept tuples",
                1, "Default arguments in Python are evaluated once at function definition time, so a mutable default list persists and accumulates state across subsequent calls."
        ));
        list.add(createQ(
                "What is the Global Interpreter Lock (GIL) in CPython?",
                "python", "Concurrency & Internals", "Hard",
                "A lock that encrypts Python scripts before bytecode compilation",
                "A mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython",
                "A security sandbox preventing unauthorized file system access",
                "A database connection manager built into Python core",
                1, "The GIL is a mutex in CPython that protects access to Python objects, preventing multiple threads from executing Python bytecode in parallel on multiple CPU cores."
        ));
        list.add(createQ(
                "What is the primary memory advantage of a Generator over a List Comprehension in Python?",
                "python", "Generators & Iterators", "Medium",
                "Generators run on the GPU",
                "Generators produce items lazily on demand via 'yield', avoiding allocating the entire sequence in memory",
                "Generators compress values using zlib",
                "Generators convert all data into C arrays",
                1, "Generators compute items one by one on-the-fly via the iterator protocol, maintaining O(1) memory consumption regardless of how large the sequence is."
        ));
        list.add(createQ(
                "In Python, what is the difference between the '==' operator and the 'is' operator?",
                "python", "Core Syntax", "Easy",
                "'==' compares identity (memory address), while 'is' compares equality of values",
                "'==' compares equality of values, while 'is' checks object identity (same memory location via id())",
                "They are identical in Python 3",
                "'is' is only used for boolean comparisons",
                1, "'==' checks whether the values of the operands are equal, while 'is' evaluates whether two variables point to the exact same object in memory."
        ));
        list.add(createQ(
                "What does the *args and **kwargs syntax in a function definition allow?",
                "python", "Functions", "Easy",
                "Passing an arbitrary number of positional arguments (*args) and keyword arguments (**kwargs)",
                "Multiplying numbers and raising them to powers inside the parameters",
                "Defining pointer types and reference variables",
                "Creating global variables within the function scope",
                0, "*args collects extra positional arguments into a tuple, while **kwargs collects extra keyword arguments into a dictionary."
        ));
        list.add(createQ(
                "What is the purpose of the '@classmethod' decorator in Python?",
                "python", "OOP", "Medium",
                "It makes a method private so it cannot be called outside the class",
                "It passes the class (cls) as the first argument rather than the instance (self), allowing access to class-level state",
                "It converts a regular method into a constructor",
                "It forces the method to run statically on a background thread",
                1, "A @classmethod receives the class object as its first parameter 'cls', allowing factory methods and class-level attribute manipulation independent of instance state."
        ));
        list.add(createQ(
                "What is the difference between a shallow copy and a deep copy in Python's 'copy' module?",
                "python", "Memory & Objects", "Medium",
                "Shallow copy copies only strings, while deep copy copies integers",
                "A shallow copy constructs a new collection and inserts references to child objects; a deep copy recursively copies child objects",
                "Shallow copies are read-only; deep copies are mutable",
                "There is no difference for nested dictionaries",
                1, "A shallow copy creates a new container but references the original nested objects. A deep copy recursively duplicates every nested object, ensuring complete independence."
        ));
        list.add(createQ(
                "What is the average time complexity of key lookup in a Python dictionary?",
                "python", "Data Structures", "Easy",
                "O(n)",
                "O(log n)",
                "O(1)",
                "O(n^2)",
                2, "Python dictionaries are implemented using hash tables with open addressing, providing average O(1) time complexity for key lookups, insertions, and deletions."
        ));
        list.add(createQ(
                "How does Python manage memory and clean up unused objects?",
                "python", "Memory Management", "Medium",
                "Manual free() calls required by the developer",
                "Reference counting supplemented by a cyclic garbage collector to detect circular references",
                "A stop-the-world JVM-style mark and sweep collector only",
                "Operating system paging without internal tracking",
                1, "CPython relies primarily on reference counting (deallocating immediately when reference count drops to zero), supplemented by a generational cycle-detecting garbage collector."
        ));
        list.add(createQ(
                "Which dunder (magic) method is called to construct and return a new instance before __init__ is called?",
                "python", "OOP & Metaclasses", "Hard",
                "__construct__",
                "__new__",
                "__create__",
                "__build__",
                1, "__new__ is the static method responsible for actually creating and returning the new instance object, whereas __init__ simply initializes the newly created instance."
        ));
        list.add(createQ(
                "What protocol must an object implement to be used in a Python 'with' statement (Context Manager)?",
                "python", "Context Managers", "Medium",
                "__open__ and __close__",
                "__enter__ and __exit__",
                "__start__ and __stop__",
                "__init__ and __del__",
                1, "The Context Management protocol requires defining the __enter__() method (executed before entering the with block) and __exit__() (executed on block exit, handling exceptions)."
        ));
        list.add(createQ(
                "Which built-in Python function is used to pair elements from two or more iterables together into tuples?",
                "python", "Built-ins", "Easy",
                "combine()",
                "pair()",
                "zip()",
                "enumerate()",
                2, "zip() aggregates elements from each of the iterables into tuples and returns an iterator that stops when the shortest input iterable is exhausted."
        ));
        return list;
    }

    // =========================================================================
    // 3. C++ QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getCppQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "Why should a base class in C++ with virtual functions declare a virtual destructor?",
                "c++", "OOP & Memory", "Medium",
                "To enable multiple inheritance",
                "To ensure that the derived class destructor is invoked when deleting an object through a base class pointer, preventing memory leaks",
                "To allow private members to be inherited",
                "To automatically allocate memory on the heap",
                1, "Deleting a derived class object through a base pointer with a non-virtual destructor results in undefined behavior and leaks derived class resources because only the base destructor runs."
        ));
        list.add(createQ(
                "What is the core principle of RAII (Resource Acquisition Is Initialization) in C++?",
                "c++", "Resource Management", "Medium",
                "Resources must be allocated inside global main() only",
                "Resource lifetime is bound to object lifetime: resources are acquired in constructors and released in destructors",
                "All memory must be allocated using malloc() before creating classes",
                "Constructors should never throw exceptions",
                1, "RAII ties resource management (memory, file handles, mutex locks) to object scope. When the object goes out of scope, its destructor automatically frees the resource safely."
        ));
        list.add(createQ(
                "What is the difference between a pointer and a reference in C++?",
                "c++", "Pointers & References", "Easy",
                "Pointers cannot be NULL, while references can",
                "A pointer can be re-assigned and can be nullptr; a reference must be initialized on declaration and cannot be reseated",
                "References require explicit dereferencing using the * operator",
                "Pointers take no memory, while references require 64 bits",
                1, "References are aliases for existing objects, cannot be null, and cannot be reseated once bound. Pointers hold addresses, can be re-assigned, and can hold nullptr."
        ));
        list.add(createQ(
                "What is the difference between std::unique_ptr and std::shared_ptr in modern C++?",
                "c++", "Smart Pointers", "Medium",
                "std::unique_ptr allows shared ownership; std::shared_ptr enforces exclusive ownership",
                "std::unique_ptr enforces exclusive ownership and cannot be copied (only moved); std::shared_ptr manages shared ownership via reference counting",
                "std::shared_ptr does not free memory automatically",
                "std::unique_ptr cannot be used with vectors",
                1, "std::unique_ptr represents sole ownership with zero overhead (cannot be copied, only moved). std::shared_ptr uses a control block with atomic reference counting for shared ownership."
        ));
        list.add(createQ(
                "How does dynamic dispatch (runtime polymorphism) work under the hood in C++?",
                "c++", "Polymorphism & Internals", "Hard",
                "Through runtime string comparisons of function names",
                "Using a virtual method table (vtable) and a hidden virtual pointer (vptr) in each polymorphic object",
                "By recompiling the function every time it is invoked",
                "Using the operating system dynamic linker on every virtual call",
                1, "Each class with virtual functions has a compiler-generated virtual method table (vtable). Each instance holds a hidden vptr pointing to the class vtable to resolve method addresses at runtime."
        ));
        list.add(createQ(
                "What is the difference between 'new' / 'delete' and 'malloc()' / 'free()' in C++?",
                "c++", "Memory Allocation", "Easy",
                "'new' and 'delete' call constructors and destructors; 'malloc()' and 'free()' only allocate raw bytes without calling object lifecycle methods",
                "'malloc()' is type-safe; 'new' returns a void pointer",
                "'delete' requires passing the size of the allocated memory",
                "There is no difference; 'new' is simply an alias for 'malloc()'",
                0, "'new' is a type-safe operator that calculates object size and calls constructors. 'malloc()' is a C library function that allocates raw memory without invoking constructors."
        ));
        list.add(createQ(
                "In C++, what is the effect of declaring a member function as 'const' (e.g., int getVal() const)?",
                "c++", "Const Correctness", "Easy",
                "The function can only be called once during program execution",
                "The function promises not to modify any non-mutable member variables of the calling object",
                "The function cannot return any values",
                "The function must be static",
                1, "A const member function cannot modify non-mutable member variables of the object and can be safely invoked on const instances of that class."
        ));
        list.add(createQ(
                "What happens when a std::vector exceeds its current capacity during push_back()?",
                "c++", "STL Containers", "Medium",
                "It throws a std::out_of_range exception immediately",
                "It allocates a new larger memory block (typically 1.5x or 2x), moves/copies existing elements over, and deallocates the old memory",
                "It creates a linked list segment linked to the end",
                "It overwrites the earliest elements in a ring buffer fashion",
                1, "std::vector allocates a larger contiguous memory block, moves/copies all existing elements into the new block, and frees the old block, which invalidates existing iterators."
        ));
        list.add(createQ(
                "What is the purpose of the 'mutable' keyword in C++?",
                "c++", "Language Features", "Medium",
                "To declare variables that can change their data type at runtime",
                "To allow a specific member variable of a class to be modified even inside a const member function",
                "To disable compiler optimizations for hardware registers",
                "To make a variable accessible across multiple threads without locking",
                1, "The 'mutable' keyword permits a member variable (such as a mutex or debug cache counter) to be modified by a const member function."
        ));
        list.add(createQ(
                "What is the Rule of Five in modern C++ (C++11 onwards)?",
                "c++", "Object Lifecycle", "Hard",
                "A class should never have more than five member variables",
                "If a class manages resources and requires a custom Destructor, Copy Constructor, or Copy Assignment, it should also define or delete the Move Constructor and Move Assignment Operator",
                "Five access specifiers are required: public, private, protected, internal, and external",
                "Every header must include at most five standard library modules",
                1, "With move semantics introduced in C++11, managing ownership of resources requires considering Destructor, Copy Constructor, Copy Assignment, Move Constructor, and Move Assignment."
        ));
        list.add(createQ(
                "Which C++ cast operator should be used to safely cast a base class pointer to a derived class pointer with runtime type checking?",
                "c++", "Type Casting", "Medium",
                "static_cast",
                "dynamic_cast",
                "reinterpret_cast",
                "const_cast",
                1, "dynamic_cast relies on RTTI (Run-Time Type Information) to safely downcast pointers, returning nullptr (or throwing std::bad_cast for references) if the cast is invalid."
        ));
        list.add(createQ(
                "What does the 'inline' keyword suggest to the C++ compiler?",
                "c++", "Optimization & Compiler", "Easy",
                "The function must be executed on a separate core",
                "The compiler should attempt to replace function calls with the actual function code body to eliminate call overhead",
                "The function must never return a pointer",
                "The function is loaded dynamically at runtime",
                1, "The 'inline' hint suggests substituting the function code directly at each call site, eliminating call stack overhead, though the compiler may ignore it for large functions."
        ));
        return list;
    }

    // =========================================================================
    // 4. HTML QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getHtmlQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "Which HTML5 element represents self-contained content that could be distributed independently, like a blog post or news story?",
                "html", "HTML5 Semantics", "Easy",
                "<section>",
                "<article>",
                "<aside>",
                "<div>",
                1, "The <article> tag specifies independent, self-contained content that makes sense on its own (e.g., blog posts, newspaper articles, comments)."
        ));
        list.add(createQ(
                "What is the difference between the 'async' and 'defer' attributes on a <script> tag?",
                "html", "Script Loading", "Medium",
                "'async' loads scripts synchronously; 'defer' loads them asynchronously",
                "'async' downloads in parallel and executes as soon as downloaded; 'defer' downloads in parallel but waits to execute until the HTML document is fully parsed",
                "'defer' executes before the DOM starts parsing",
                "There is no difference in modern browsers",
                1, "Both fetch scripts asynchronously without blocking HTML parsing. However, 'async' executes immediately when ready, whereas 'defer' preserves script execution order and waits until DOM parsing finishes."
        ));
        list.add(createQ(
                "What is the primary purpose of the 'alt' attribute on an <img> element?",
                "html", "Accessibility & SEO", "Easy",
                "To set the hover tooltip popup text",
                "To provide alternative text for screen readers and when the image fails to load",
                "To set the aspect ratio of the image",
                "To define the fallback image URL",
                1, "The 'alt' attribute provides essential alternative text for visually impaired users using screen readers, and is displayed by browsers if the image fails to load."
        ));
        list.add(createQ(
                "What is the purpose of the <!DOCTYPE html> declaration at the top of an HTML document?",
                "html", "Document Standards", "Easy",
                "It links the external stylesheet to the page",
                "It instructs the web browser to render the page in standards mode according to the HTML5 specification",
                "It defines the character encoding for the page",
                "It is a required security tag to prevent Cross-Site Scripting",
                1, "<!DOCTYPE html> is the HTML5 doctype that ensures modern browsers render the document in standards-compliant mode rather than 'quirks mode'."
        ));
        list.add(createQ(
                "What is the key difference between SVG and HTML5 <canvas>?",
                "html", "Graphics & Canvas", "Medium",
                "SVG is vector-based (DOM elements with resolution independence); Canvas is raster-based (pixel manipulation via JavaScript)",
                "Canvas is scalable without pixelation; SVG pixelates when zoomed",
                "Canvas supports CSS styling; SVG does not",
                "SVG cannot be scripted with JavaScript",
                0, "SVG renders scalable vector graphics as individual DOM elements that can be styled with CSS. Canvas provides a bitmap drawing surface manipulated procedurally pixel-by-pixel via JS."
        ));
        list.add(createQ(
                "Which meta tag is required in HTML5 to ensure proper responsive scaling on mobile devices?",
                "html", "Responsive Web", "Easy",
                "<meta name='mobile' content='responsive=true'>",
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
                "<meta http-equiv='screen-size' content='mobile'>",
                "<meta name='screen' content='max-width=100%'>",
                1, "The viewport meta tag '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">' tells mobile browsers to match screen width and sets initial zoom level."
        ));
        list.add(createQ(
                "What is the capacity difference and persistence behavior between localStorage and sessionStorage in HTML5?",
                "html", "Web Storage", "Medium",
                "localStorage is cleared when the tab closes; sessionStorage persists forever",
                "localStorage persists indefinitely across browser restarts; sessionStorage data is wiped when the browser tab/session closes",
                "sessionStorage can store up to 500MB; localStorage is capped at 1KB",
                "Both are automatically sent with every HTTP request header like cookies",
                1, "localStorage retains data permanently until cleared by the user/app. sessionStorage retains data only for the duration of the current page session/tab."
        ));
        list.add(createQ(
                "Which HTML5 element provides an 'autocomplete' dropdown list of predefined options for an <input> field?",
                "html", "Forms & Input", "Easy",
                "<select>",
                "<datalist>",
                "<dropdown>",
                "<optionlist>",
                1, "The <datalist> tag specifies a list of pre-defined options for an <input> element, providing autocomplete capabilities while still allowing arbitrary user inputs."
        ));
        list.add(createQ(
                "What is the security purpose of the 'sandbox' attribute on an <iframe> element?",
                "html", "Security & Frames", "Medium",
                "To optimize the iframe loading speed",
                "To restrict iframe capabilities, disabling scripts, forms, popups, and same-origin access by default unless explicitly granted",
                "To encrypt all traffic sent inside the iframe",
                "To prevent the iframe from loading images",
                1, "The 'sandbox' attribute applies strict security restrictions on content inside an iframe (blocking scripts, forms, and same-origin access) to prevent malicious third-party attacks."
        ));
        list.add(createQ(
                "What is the semantic difference between the <strong> and <b> tags in HTML?",
                "html", "Semantics & Typography", "Easy",
                "<b> conveys strong importance for screen readers; <strong> is purely visual",
                "<strong> conveys semantic importance and urgency (read emphatically by assistive technology); <b> draws visual attention without extra importance",
                "They are strictly identical in all specifications",
                "<strong> is deprecated in HTML5",
                1, "<strong> represents strong importance, seriousness, or urgency for content. <b> is used for stylistically bold text without conveying extra semantic weight to screen readers."
        ));
        list.add(createQ(
                "Which HTML5 semantic element is intended to hold indirect content such as sidebars, callout boxes, or related advertising?",
                "html", "HTML5 Semantics", "Easy",
                "<section>",
                "<nav>",
                "<aside>",
                "<footer>",
                2, "The <aside> element represents a portion of a document whose content is only tangentially related to the content around it, such as sidebars or callout boxes."
        ));
        list.add(createQ(
                "What does the 'target=\"_blank\" rel=\"noopener noreferrer\"' attribute combination do on an anchor <a> tag?",
                "html", "Security & Links", "Medium",
                "Opens the link in a new tab while preventing the new page from accessing window.opener to protect against reverse tab-nabbing",
                "Forces the link to download as a file",
                "Opens the link in a modal popup window",
                "Prevents the browser from caching the linked web page",
                0, "'_blank' opens in a new tab. 'noopener' prevents the opened page from manipulating window.opener (avoiding malicious redirection), and 'noreferrer' omits the Referer header."
        ));
        return list;
    }

    // =========================================================================
    // 5. CSS QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getCssQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "What is the difference between 'box-sizing: content-box' (default) and 'box-sizing: border-box'?",
                "css", "Box Model", "Easy",
                "'content-box' includes padding and border in the specified width; 'border-box' adds them outside the width",
                "'border-box' includes padding and border within the specified width and height, preventing unexpected element expansion",
                "'border-box' removes all margins from the element",
                "They behave identically on block-level elements",
                1, "With 'border-box', an element's padding and border are included in the total declared width and height, making responsive layout calculations straightforward."
        ));
        list.add(createQ(
                "In CSS Flexbox, what is the difference between 'justify-content' and 'align-items'?",
                "css", "Flexbox", "Easy",
                "'justify-content' aligns along the cross axis; 'align-items' aligns along the main axis",
                "'justify-content' distributes items along the main axis; 'align-items' distributes items along the cross axis",
                "Both align along the vertical axis only",
                "'justify-content' only works when flex-direction is column",
                1, "'justify-content' controls alignment along the main axis (horizontal by default for row), while 'align-items' controls alignment along the perpendicular cross axis."
        ));
        list.add(createQ(
                "Which CSS selector has the highest specificity?",
                "css", "Specificity", "Medium",
                "div.container p.text",
                "#header-nav ul li",
                "body main article section p",
                ":root div[data-active='true']",
                1, "#header-nav ul li has an ID selector, which gives it a specificity score of (1, 0, 2), beating class and attribute selectors (which score in the second column)."
        ));
        list.add(createQ(
                "What is the difference between 'position: absolute' and 'position: fixed'?",
                "css", "Positioning", "Medium",
                "'absolute' is positioned relative to the browser viewport; 'fixed' is positioned relative to the nearest parent",
                "'absolute' is positioned relative to its nearest positioned ancestor; 'fixed' is positioned relative to the viewport and stays put during scrolling",
                "'fixed' removes the element from the document flow; 'absolute' keeps its space reserved",
                "There is no difference if the ancestor is the <body> element",
                1, "'fixed' positions relative to the viewport (does not move with page scroll). 'absolute' positions relative to the closest ancestor whose position is anything other than static."
        ));
        list.add(createQ(
                "What is the difference between 'display: none' and 'visibility: hidden'?",
                "css", "Layout & Visibility", "Easy",
                "'visibility: hidden' removes the element and its space from the DOM layout entirely",
                "'display: none' removes the element from the layout flow (takes 0 space); 'visibility: hidden' hides the element while still preserving its physical space in the layout",
                "'display: none' can still be read by screen readers",
                "Both trigger animations in the same way",
                1, "'display: none' removes the element from the document layout flow entirely. 'visibility: hidden' makes the element invisible, but preserves its exact width and height in the layout."
        ));
        list.add(createQ(
                "How does 'rem' differ from 'em' in CSS typography?",
                "css", "Units & Sizing", "Easy",
                "'rem' is relative to the root <html> font-size; 'em' is relative to the immediate parent element's font-size",
                "'rem' is relative to the viewport height; 'em' is relative to viewport width",
                "'rem' only applies to margins, while 'em' applies to font sizes",
                "'em' is an absolute pixel measurement",
                0, "'rem' (root em) always scales relative to the root <html> font-size (typically 16px), whereas 'em' compounds and scales relative to the font-size of its current parent element."
        ));
        list.add(createQ(
                "In CSS Grid, what does 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))' accomplish?",
                "css", "CSS Grid", "Medium",
                "Creates exactly 250 identical columns",
                "Creates a responsive column layout that automatically fits as many 250px+ columns as will fit, stretching them to share remaining space without media queries",
                "Limits the grid container width to 250px max",
                "Requires JavaScript to compute column widths",
                1, "This pattern creates an intrinsically responsive grid layout: columns never shrink below 250px, automatically wrap to new rows, and expand equally (1fr) to fill available space."
        ));
        list.add(createQ(
                "What is a CSS Stacking Context and what triggers its creation?",
                "css", "Z-Index & Stacking", "Hard",
                "A grid layout triggered by display: stack",
                "A three-dimensional conceptualization of HTML elements along the z-axis, triggered by properties like position + z-index != auto, opacity < 1, or transform",
                "A CSS table created using display: table",
                "An algorithm that calculates font sizes hierarchically",
                1, "A stacking context confines child z-index values to within that parent container. It is triggered by position with z-index, opacity < 1, transform, filter, or will-change."
        ));
        list.add(createQ(
                "What is the difference between pseudo-classes (:hover, :focus) and pseudo-elements (::before, ::after)?",
                "css", "Selectors", "Easy",
                "Pseudo-classes style virtual sub-elements; pseudo-elements target state",
                "Pseudo-classes select elements based on their state or structural position; pseudo-elements create and style virtual DOM content not present in the HTML",
                "Pseudo-elements can only be used on <a> tags",
                "They are syntax variations for the exact same feature",
                1, "Pseudo-classes (:hover, :nth-child) target an existing element in a specific state. Pseudo-elements (::before, ::placeholder) style specific parts of an element or inject virtual content."
        ));
        list.add(createQ(
                "How do you declare and consume a CSS Custom Property (Variable)?",
                "css", "Modern CSS", "Easy",
                "$primary-color: #333; color: $primary-color;",
                "--primary-color: #333; color: var(--primary-color);",
                "@variable primary-color = #333; color: @primary-color;",
                "set(primary-color, #333); color: get(primary-color);",
                1, "Native CSS Custom Properties are declared with two dashes (e.g. --brand-color: #99775C;) and referenced using the var(--brand-color) function."
        ));
        list.add(createQ(
                "What does the CSS property 'pointer-events: none' do?",
                "css", "Interactivity", "Medium",
                "Disables cursor hover icons",
                "Prevents the element from receiving mouse/touch events, letting clicks pass through to underlying elements",
                "Hides the mouse pointer on the entire screen",
                "Disables JavaScript execution on the page",
                1, "'pointer-events: none' makes an element completely transparent to click, hover, and touch events, allowing interactions to reach elements positioned underneath it."
        ));
        list.add(createQ(
                "Which CSS property controls how background images or videos fit within their container without distortion?",
                "css", "Images & Media", "Easy",
                "image-rendering",
                "object-fit",
                "aspect-ratio",
                "background-origin",
                1, "'object-fit' (with values like cover, contain, fill) specifies how the content of a replaced element (like <img> or <video>) should resize to fit its container box."
        ));
        return list;
    }

    // =========================================================================
    // 6. JAVASCRIPT QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getJavascriptQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "In the JavaScript Event Loop, what is the execution priority difference between Microtasks and Macrotasks?",
                "javascript", "Event Loop", "Hard",
                "Macrotasks execute before Microtasks",
                "All Microtasks (Promise callbacks, queueMicrotask) are executed completely before the next Macrotask (setTimeout, setInterval) is dequeued",
                "Microtasks only execute when the page is reloaded",
                "They run in parallel on separate threads",
                1, "The call stack empties -> all pending Microtasks (Promises, MutationObserver) run to completion -> DOM render -> the next Macrotask (setTimeout) is dequeued."
        ));
        list.add(createQ(
                "What is a Closure in JavaScript?",
                "javascript", "Scope & Closures", "Medium",
                "A syntax error caused by forgetting to close curly braces",
                "A function bundled together with references to its surrounding lexical environment, allowing it to access outer variables even after the outer function has returned",
                "A method that closes network sockets automatically",
                "A function that accepts no arguments and returns nothing",
                1, "A closure gives an inner function access to an outer function's scope even after the outer function has finished executing and returned."
        ));
        list.add(createQ(
                "What is the difference between 'let', 'const', and 'var' in JavaScript?",
                "javascript", "Variables & Hoisting", "Easy",
                "'var' is block-scoped; 'let' and 'const' are function-scoped",
                "'let' and 'const' are block-scoped and subject to the Temporal Dead Zone; 'var' is function-scoped and hoisted initialized to undefined",
                "'const' makes objects completely immutable and freezes their properties",
                "'let' cannot be reassigned; 'const' can",
                1, "'let' and 'const' enforce block scoping and throw ReferenceError if accessed before declaration (TDZ). 'var' is hoisted with undefined and is scoped to the enclosing function."
        ));
        list.add(createQ(
                "What is the difference between loose equality (==) and strict equality (===) in JavaScript?",
                "javascript", "Type Coercion", "Easy",
                "'==' performs type coercion before comparison; '===' compares both value and type without coercion",
                "'===' allows string to number conversion automatically",
                "'==' is only for objects; '===' is only for numbers",
                "There is no difference in modern JavaScript",
                0, "'==' coerces operand types if they differ (e.g. 5 == '5' is true). '===' evaluates to true only if both operands are of the same type and have the same value (5 === '5' is false)."
        ));
        list.add(createQ(
                "How do Arrow Functions differ from standard function declarations regarding 'this' binding?",
                "javascript", "Functions & Context", "Medium",
                "Arrow functions bind 'this' dynamically to the calling object",
                "Arrow functions do not have their own 'this'; they lexically capture 'this' from their enclosing lexical context",
                "Arrow functions can be used as constructors with the 'new' keyword",
                "Arrow functions have access to the arguments object",
                1, "Arrow functions do not define their own 'this', 'arguments', or 'prototype'. They lexically inherit 'this' from the enclosing scope where they were declared."
        ));
        list.add(createQ(
                "What is the output of typeof null in JavaScript?",
                "javascript", "Core Types", "Easy",
                "\"null\"",
                "\"undefined\"",
                "\"object\"",
                "\"boolean\"",
                2, "In JavaScript, 'typeof null' returns 'object'. This is a historical bug from the earliest version of JS where objects had a type tag of 0 and null was represented as a NULL pointer (0x00)."
        ));
        list.add(createQ(
                "What is Event Bubbling in the browser DOM?",
                "javascript", "DOM & Events", "Medium",
                "Events triggering only on the topmost <html> tag",
                "When an event occurs on a target element, it executes handlers on the target, then bubbles upward through its ancestors in the DOM tree",
                "Events being cancelled automatically by the browser",
                "A technique for optimizing memory allocation of event listeners",
                1, "Event propagation moves down during the capture phase, hits the target, and then bubbles upwards through parent elements, triggering any listeners attached on ancestors."
        ));
        list.add(createQ(
                "What does the Array.prototype.reduce() method do in JavaScript?",
                "javascript", "Array Methods", "Easy",
                "Reduces the length of the array by removing duplicate items",
                "Executes a reducer function on each element of the array, culminating in a single accumulated output value",
                "Filters out elements that do not meet a condition",
                "Sorts array numbers in descending order",
                1, "reduce() applies an accumulator function against each element of an array to reduce the entire collection down to a single value (number, object, array, or string)."
        ));
        list.add(createQ(
                "What is Debouncing and how does it differ from Throttling?",
                "javascript", "Performance Patterns", "Medium",
                "Debouncing executes at a fixed interval; throttling waits until all user actions stop",
                "Debouncing delays invoking a function until a specified time has elapsed since the last event; throttling limits execution to at most once per time window",
                "Both are identical techniques to clear intervals",
                "Debouncing only applies to HTTP requests; throttling is for CSS animations",
                1, "Debounce waits for a pause in events (e.g. search autocomplete after user stops typing). Throttle guarantees execution at most once every X milliseconds (e.g. window resize/scroll)."
        ));
        list.add(createQ(
                "What does Promise.all() do when one of the passed promises rejects?",
                "javascript", "Async Programming", "Medium",
                "It waits for all others to resolve and ignores the rejection",
                "It immediately rejects with the error of the first promise that rejected (fail-fast behavior)",
                "It returns null for the rejected promise and continues",
                "It converts the rejection into an empty array",
                1, "Promise.all() exhibits fail-fast behavior: if any promise in the iterable rejects, the returned promise immediately rejects with that reason, abandoning remaining results."
        ));
        list.add(createQ(
                "How does prototypal inheritance work when accessing a property on an object in JavaScript?",
                "javascript", "Prototypes", "Medium",
                "Properties are copied to each instance upon creation",
                "If the property is not found on the object itself, JS searches up the prototype chain (__proto__) until found or reaching null",
                "All objects inherit directly from the window object",
                "JavaScript searches child classes for the property",
                1, "JavaScript uses prototype chaining: when accessing obj.prop, the engine checks obj, then obj.__proto__, and continues up the chain until finding the property or hitting null."
        ));
        list.add(createQ(
                "What values does JSON.stringify() omit or convert to null when serializing an object?",
                "javascript", "JSON Serialization", "Medium",
                "Numbers and strings",
                "Functions, undefined, and Symbols are omitted from objects (or converted to null inside arrays)",
                "Booleans and empty objects",
                "Nested arrays",
                1, "JSON.stringify() drops function properties, undefined, and Symbol keys from objects, and converts them to null when present as array elements."
        ));
        return list;
    }

    // =========================================================================
    // 7. REACT QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getReactQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "Why must the 'key' prop be unique among siblings when rendering lists in React?",
                "react", "Core Concepts", "Easy",
                "To set the HTML id attribute on the rendered element",
                "To help React's reconciliation algorithm identify which items have changed, been added, or been removed, minimizing DOM mutations",
                "Keys are required by CSS selectors for styling",
                "To enable automatic caching in localStorage",
                1, "Keys give elements a stable identity across renders, allowing React to diff lists efficiently and reorder or update existing DOM nodes rather than recreating them."
        ));
        list.add(createQ(
                "What is the difference between useMemo and useCallback in React?",
                "react", "Hooks & Optimization", "Medium",
                "useMemo memoizes a computed value; useCallback memoizes a callback function definition between renders",
                "useCallback is for API calls; useMemo is for styling",
                "useMemo can only be called once in the application lifetime",
                "There is no difference; useCallback is an alias for useMemo",
                0, "useMemo(() => computeValue(a, b), [a, b]) caches the result of a calculation. useCallback(fn, deps) caches the function instance itself to prevent unnecessary child re-renders."
        ));
        list.add(createQ(
                "How does React's Virtual DOM improve application performance?",
                "react", "Reconciliation", "Medium",
                "By compiling JavaScript directly to C++",
                "By keeping a lightweight JavaScript representation of the UI in memory, calculating minimal diffs, and batching updates to the real DOM",
                "By bypassing the browser DOM entirely and rendering directly on a canvas",
                "By executing all component logic on the server",
                1, "Direct DOM manipulation is slow. The Virtual DOM computes diffs (reconciliation) in JavaScript memory and applies only the necessary changes to the real DOM in batched updates."
        ));
        list.add(createQ(
                "When should you use the functional updater form with useState (e.g., setCount(prev => prev + 1))?",
                "react", "Hooks & State", "Easy",
                "Only when updating string state",
                "When the new state depends on the previous state, ensuring accurate updates even during state batching",
                "When creating custom form inputs",
                "Whenever an async function is declared",
                1, "Because state updates may be batched or asynchronous, passing an updater function ensures you receive the most current, guaranteed up-to-date state value."
        ));
        list.add(createQ(
                "What does the cleanup function in a useEffect hook do and when does it run?",
                "react", "Hooks & Lifecycle", "Medium",
                "It deletes the component file from memory",
                "It runs before the component unmounts and prior to re-running the effect on dependency change, allowing cleanup of subscriptions and timers",
                "It clears the browser history cache",
                "It triggers a garbage collection cycle",
                1, "The cleanup function returned by useEffect cleans up previous side effects (canceling timers, closing subscriptions, removing listeners) before re-running the effect or on unmount."
        ));
        list.add(createQ(
                "What is the purpose of the useRef hook in React?",
                "react", "Hooks", "Easy",
                "To trigger a re-render whenever the stored value changes",
                "To store a mutable value that persists across renders without triggering a component re-render, and to access DOM nodes directly",
                "To create global Redux store slices",
                "To validate component prop types",
                1, "useRef returns a mutable object { current: value } that persists across renders. Mutating .current does not cause a re-render, making it ideal for DOM references and timers."
        ));
        list.add(createQ(
                "What is a Controlled Component in React?",
                "react", "Forms", "Easy",
                "A component managed by Redux exclusively",
                "A form element whose value is driven by React state and whose changes are handled by event callbacks",
                "A component that cannot receive props",
                "A component wrapped with an error boundary",
                1, "In a controlled component, form inputs receive their value from React state (e.g. value={text}) and notify changes via callbacks (onChange), making React the single source of truth."
        ));
        list.add(createQ(
                "What is Prop Drilling and what is the idiomatic React solution to avoid it for global data?",
                "react", "State Architecture", "Medium",
                "Passing props to child components without using TypeScript; solved using Babel",
                "Passing props through intermediate components that don't need them; solved using the React Context API or state management libraries",
                "Mutating props directly inside child components",
                "Using multiple return statements in a component",
                1, "Prop drilling occurs when data is threaded through several layers of intermediate components. React Context allows broadcasting values (like auth or theme) directly to deeply nested consumers."
        ));
        list.add(createQ(
                "Why does React in StrictMode call component render functions and effects twice in development mode?",
                "react", "StrictMode & Debugging", "Medium",
                "It is a known bug in React 18 that cannot be fixed",
                "To intentionally expose unexpected side effects and ensure components are pure and cleanup functions work properly",
                "To increase bundle size verification",
                "To simulate slow network conditions",
                1, "React StrictMode intentionally double-invokes renders and mount/unmount lifecycles in development to help developers catch impure code, memory leaks, and missing effect cleanups."
        ));
        list.add(createQ(
                "What are the Rules of Hooks in React?",
                "react", "Hooks Rules", "Easy",
                "Hooks must be called inside loops and if statements",
                "Only call Hooks at the top level (never inside loops, conditions, or nested functions), and only call Hooks from React function components or custom Hooks",
                "Hooks can only be declared inside class components",
                "Custom hooks must return an array of exactly two items",
                1, "Calling Hooks only at the top level guarantees that React reads Hook calls in the exact same sequence on every single render, which is how React associates state with Hook calls."
        ));
        list.add(createQ(
                "What is an Error Boundary in React?",
                "react", "Error Handling", "Medium",
                "A CSS border styled with red color for failed inputs",
                "A class component implementing componentDidCatch or getDerivedStateFromError to catch JavaScript errors anywhere in its child component tree and display a fallback UI",
                "A try-catch block placed around JSX markup",
                "A hook introduced in React 18 for server components",
                1, "Error Boundaries catch errors during rendering, lifecycle methods, and constructors in the component tree beneath them, preventing the entire React app from crashing."
        ));
        list.add(createQ(
                "What is the difference between React Server Components (RSC) and traditional Client Components?",
                "react", "Architecture & Next.js", "Hard",
                "Server components only run on Internet Explorer",
                "Server Components execute exclusively on the server and send zero JavaScript to the client bundle, while Client Components ship interactivity and hydration to the browser",
                "Server Components cannot fetch data from databases",
                "Client Components cannot use CSS stylesheets",
                1, "Server Components render on the server, accessing databases directly and reducing client bundle sizes by shipping only pre-rendered HTML/JSON without component JS code."
        ));
        return list;
    }

    // =========================================================================
    // 8. NODE.JS QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getNodeJsQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "How does Node.js handle concurrency despite being single-threaded for JavaScript execution?",
                "node.js", "Event Loop & Libuv", "Medium",
                "It runs multiple copies of V8 on separate CPU threads automatically",
                "Through an event-driven architecture utilizing the libuv library, which delegates I/O and intensive tasks to a background thread pool",
                "By compiling JavaScript directly to threaded assembly language",
                "Node.js is not single-threaded; each function runs on a new thread",
                1, "Node.js runs JS on a single thread event loop, but offloads blocking operations (file system, DNS, crypto) to libuv's C thread pool, signaling completion via callbacks/promises."
        ));
        list.add(createQ(
                "What is the difference between process.nextTick() and setImmediate() in Node.js?",
                "node.js", "Event Loop", "Hard",
                "setImmediate() runs before process.nextTick()",
                "process.nextTick() runs immediately after the current operation finishes (microtask queue), before the event loop continues; setImmediate() runs in the Check phase of the event loop",
                "process.nextTick() only runs inside HTTP servers",
                "They are exact aliases",
                1, "process.nextTick() callbacks fire before the event loop continues (at the end of current phase). setImmediate() is queued in the event loop's 'Check' phase."
        ));
        list.add(createQ(
                "What is the difference between CommonJS and ES Modules (ESM) in Node.js?",
                "node.js", "Module System", "Easy",
                "CommonJS uses require() and module.exports (synchronous); ESM uses import and export statements (asynchronous and statically analyzable)",
                "ES Modules cannot be used in modern Node.js",
                "CommonJS was introduced in ES2020",
                "ESM modules are evaluated only at runtime",
                0, "CommonJS (require/module.exports) is synchronous and evaluated at runtime. ES Modules (import/export) are static, asynchronous, and standard across modern JavaScript."
        ));
        list.add(createQ(
                "Why are Streams preferred over fs.readFile() when processing large files in Node.js?",
                "node.js", "Streams & Buffer", "Medium",
                "Streams encrypt file contents automatically",
                "Streams read data in chunks piece-by-piece, keeping memory footprint low and enabling processing before the entire file is read",
                "fs.readFile() does not support UTF-8 encoding",
                "Streams only work with audio files",
                1, "fs.readFile() buffers the entire file into RAM, which can crash the process on large files. Streams process data in small chunks (buffers), providing high memory efficiency."
        ));
        list.add(createQ(
                "What is Express.js middleware and what does the 'next' parameter do?",
                "node.js", "Express.js", "Easy",
                "Middleware is an external database driver",
                "Functions with access to req, res, and next; calling next() passes control to the next middleware in the request-response pipeline",
                "next terminates the HTTP connection immediately",
                "Middleware only executes when an error occurs",
                1, "Middleware functions intercept requests and responses. Invoking next() passes control to the subsequent middleware handler in the pipeline."
        ));
        list.add(createQ(
                "What is a Buffer in Node.js?",
                "node.js", "Buffers & Binary", "Medium",
                "A temporary cache for storing string HTML templates",
                "A class designed to handle raw binary data directly outside the V8 heap in allocated memory",
                "A queue for storing HTTP request headers",
                "A tool for managing CPU memory allocation",
                1, "The Buffer class provides raw memory allocations outside the V8 heap to handle binary streams (files, TCP network packets, cryptographic hashes) efficiently."
        ));
        list.add(createQ(
                "What does the Node.js 'cluster' module enable applications to do?",
                "node.js", "Clustering & Scaling", "Medium",
                "Group multiple database queries into one batch",
                "Spawn multiple child worker processes that share the same server port to take full advantage of multi-core CPU architectures",
                "Create CSS bundles for frontend deployment",
                "Manage microservice configurations automatically",
                1, "Because Node.js runs on a single core by default, the cluster module forks worker processes (one per CPU core) that share server ports, vastly improving throughput."
        ));
        list.add(createQ(
                "What is the purpose of package.json 'dependencies' versus 'devDependencies'?",
                "node.js", "Package Management", "Easy",
                "dependencies are for testing tools; devDependencies are for production server libraries",
                "dependencies are required for running the application in production; devDependencies are only needed for local development and build tooling",
                "devDependencies are downloaded automatically on production servers",
                "There is no difference when using npm install",
                1, "dependencies (e.g., express, mysql2) are essential for production runtime. devDependencies (e.g., eslint, nodemon, vitest) are development and build tools omitted in production."
        ));
        list.add(createQ(
                "How does Node.js EventEmitter handle error events if no listener is registered for 'error'?",
                "node.js", "Event Emitter", "Medium",
                "It logs a silent warning and ignores the error",
                "It throws the unhandled Error, which prints a stack trace and crashes the Node.js process",
                "It sends an HTTP 500 status code to the client",
                "It restarts the server automatically",
                1, "If an EventEmitter emits an 'error' event and has no listeners registered for 'error', Node.js treats it as an unhandled exception, prints the stack trace, and exits the process."
        ));
        list.add(createQ(
                "What is Cross-Origin Resource Sharing (CORS) and why is it necessary in Node/Express APIs?",
                "node.js", "API Security", "Easy",
                "A protocol for compressing JSON responses",
                "A browser security mechanism using HTTP headers that dictates whether a web app on one origin can request resources from a different origin",
                "A database connection pool optimizer",
                "A library for encrypting JWT tokens",
                1, "CORS is enforced by browsers to prevent unauthorized cross-origin requests. Express APIs use CORS headers (Access-Control-Allow-Origin) to specify which origins are allowed access."
        ));
        list.add(createQ(
                "How should sensitive secrets (database passwords, API keys) be managed in a Node.js project?",
                "node.js", "Security & Config", "Easy",
                "Hardcoded directly into GitHub repository files",
                "Stored in environment variables (via .env files loaded with dotenv) and excluded from version control via .gitignore",
                "Saved inside public package.json files",
                "Passed as URL query parameters in API requests",
                1, "Secrets must never be committed to source control. They should be configured via environment variables (.env files ignored in .gitignore) and accessed through process.env."
        ));
        list.add(createQ(
                "What is the default thread pool size for libuv in Node.js, and how can it be adjusted?",
                "node.js", "Libuv & Threading", "Hard",
                "Default is 1; cannot be changed",
                "Default is 4; can be increased up to 1024 by setting UV_THREADPOOL_SIZE before startup",
                "Default is 16; configured in package.json",
                "Default matches the number of CPU cores",
                1, "libuv uses a default thread pool size of 4. Applications can tune this for heavy I/O or crypto workloads by setting the environment variable UV_THREADPOOL_SIZE (up to 1024)."
        ));
        return list;
    }

    // =========================================================================
    // 9. SQL QUESTIONS (12 questions)
    // =========================================================================
    private List<Question> getSqlQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(createQ(
                "What is the difference between an INNER JOIN and a LEFT JOIN in SQL?",
                "sql", "Joins", "Easy",
                "INNER JOIN returns all rows from the right table; LEFT JOIN returns matching rows only",
                "INNER JOIN returns only rows where there is a match in both tables; LEFT JOIN returns all rows from the left table and matched rows from the right table (with NULLs for non-matches)",
                "LEFT JOIN is faster and does not support ON conditions",
                "There is no difference in relational databases",
                1, "INNER JOIN produces rows that satisfy the join condition in both tables. LEFT JOIN retains every record from the left table, filling missing right table values with NULL."
        ));
        list.add(createQ(
                "What is the difference between the WHERE clause and the HAVING clause in SQL?",
                "sql", "Filtering & Aggregation", "Medium",
                "WHERE filters rows after grouping; HAVING filters rows before grouping",
                "WHERE filters individual rows before aggregation; HAVING filters aggregated groups after the GROUP BY clause",
                "HAVING cannot be used with aggregate functions like COUNT() or SUM()",
                "WHERE can only be used with numeric columns",
                1, "WHERE filters individual rows before grouping occurs. HAVING filters the result sets produced by aggregate functions after GROUP BY has processed them."
        ));
        list.add(createQ(
                "What are the ACID properties in relational database management systems?",
                "sql", "Transactions", "Medium",
                "Access, Control, Integrity, Durability",
                "Atomicity, Consistency, Isolation, Durability",
                "Authentication, Compression, Indexing, Distribution",
                "Association, Clustering, Inheritance, Delegation",
                1, "ACID guarantees that database transactions are processed reliably: Atomicity (all-or-nothing), Consistency (rules valid), Isolation (concurrency safe), Durability (persisted)."
        ));
        list.add(createQ(
                "What is the difference between DELETE, TRUNCATE, and DROP statements in SQL?",
                "sql", "Data Manipulation & DDL", "Medium",
                "DELETE is DDL; TRUNCATE is DML",
                "DELETE removes rows one by one and can be rolled back; TRUNCATE empties the entire table quickly resetting identity; DROP completely deletes the table structure and its data",
                "DROP only removes table data while preserving columns",
                "TRUNCATE accepts a WHERE clause for selective deletion",
                1, "DELETE is a DML statement (row-by-row, logged, supports WHERE). TRUNCATE is DDL (deallocates table pages quickly without row logs). DROP destroys the entire table schema and data."
        ));
        list.add(createQ(
                "How does a B-Tree Database Index improve SELECT query performance?",
                "sql", "Indexing", "Medium",
                "By compressing table columns with gzip",
                "By organizing column values in a balanced hierarchical search tree, reducing disk lookups from O(n) table scans to O(log n)",
                "By copying the table into the browser cache",
                "By converting SQL queries into binary format",
                1, "B-Tree indexes maintain sorted data in balanced hierarchical tree nodes, enabling binary search lookups in O(log n) disk reads rather than scanning every single table row."
        ));
        list.add(createQ(
                "What is the difference between a Primary Key and a Unique Key constraint?",
                "sql", "Constraints", "Easy",
                "A table can have multiple Primary Keys but only one Unique Key",
                "A table can have only one Primary Key and it strictly forbids NULL values; a table can have multiple Unique Keys, which typically allow NULL values",
                "Unique keys cannot be referenced by foreign keys",
                "Primary keys are only for numeric columns",
                1, "A table can have only one Primary Key (which must be unique and NOT NULL). Multiple Unique Key constraints can exist on a table, and they can accept NULL values."
        ));
        list.add(createQ(
                "What is Database Normalization and what is the primary requirement for Third Normal Form (3NF)?",
                "sql", "Database Design", "Hard",
                "Storing duplicate rows across tables; 3NF requires composite keys",
                "Organizing data to minimize redundancy and dependency anomalies; 3NF requires the table to be in 2NF with no transitive functional dependencies",
                "Encrypting database columns with hash algorithms",
                "Ensuring tables have at most 3 columns",
                1, "Normalization reduces redundancy and update anomalies. 3NF states that every non-key column must depend directly on the primary key, eliminating transitive dependencies."
        ));
        list.add(createQ(
                "What is the difference between UNION and UNION ALL in SQL?",
                "sql", "Set Operators", "Easy",
                "UNION ALL removes duplicate rows; UNION retains all duplicates",
                "UNION combines result sets and removes duplicate rows (requires sorting); UNION ALL combines result sets without removing duplicates, making it faster",
                "UNION only works between tables in different databases",
                "UNION ALL can only combine numeric columns",
                1, "UNION performs an implicit distinct sort operation to eliminate duplicate rows across sets. UNION ALL simply concatenates rows without deduplication, offering faster execution."
        ));
        list.add(createQ(
                "What does 'ON DELETE CASCADE' specify on a Foreign Key relationship?",
                "sql", "Foreign Keys", "Medium",
                "Prevents parent rows from ever being deleted",
                "When a parent row is deleted, all corresponding child rows referencing that parent are automatically deleted",
                "Sets child foreign key values to NULL when parent is deleted",
                "Backs up deleted rows into an archive table",
                1, "ON DELETE CASCADE guarantees referential integrity by automatically cascading deletions: if a parent record is deleted, all dependent child rows are removed automatically."
        ));
        list.add(createQ(
                "How do Parameterized Queries (Prepared Statements) prevent SQL Injection attacks?",
                "sql", "Security", "Easy",
                "By encrypting the database with SSL",
                "By treating user input strictly as literal data rather than executable SQL code, pre-compiling the query structure before parameters are bound",
                "By stripping all quotation marks from user input strings",
                "By blocking IP addresses from untrusted domains",
                1, "Prepared statements compile the SQL query template first. When parameters are subsequently bound, the database treats them purely as literal values, rendering SQL injection impossible."
        ));
        list.add(createQ(
                "What is a Correlated Subquery in SQL?",
                "sql", "Subqueries", "Hard",
                "A subquery that runs once before the outer query executes",
                "A subquery that references columns from the outer query, meaning it must be evaluated repeatedly once for each row evaluated by the outer query",
                "A query that joins two tables with identical column names",
                "A subquery that returns a constant single integer value",
                1, "A correlated subquery depends on values from the current row of the outer query. It cannot be executed independently and evaluates once per candidate outer query row."
        ));
        list.add(createQ(
                "Which SQL aggregate function counts only non-null values in a specific column?",
                "sql", "Aggregate Functions", "Easy",
                "COUNT(*)",
                "COUNT(column_name)",
                "TOTAL(column_name)",
                "SUM(column_name)",
                1, "COUNT(*) counts all rows including NULLs. In contrast, COUNT(column_name) counts only rows where that specific column contains a non-null value."
        ));
        return list;
    }
}
