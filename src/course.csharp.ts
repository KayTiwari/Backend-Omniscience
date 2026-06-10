import type { Subject } from './course'
import { CSharpIcon } from './TechIcons'

// C# & .NET from absolute zero. Every lesson follows the interactive ladder:
// see real code run, predict its output, change one thing, and self-check.
// Outputs in the examples are verified against the .NET SDK.

export const csharpSubject: Subject = {
  id: 'csharp-fundamentals',
  title: 'C# & .NET Fundamentals',
  subtitle:
    'Start from zero: what .NET is, why companies use it, and how to write C# from your first line to a real data-shaping program.',
  icon: CSharpIcon,
  color: '#512bd4',
  problems: [
    {
      id: 'cs-rung-what-is-dotnet',
      title: 'Rung 1: What Is .NET, And Why Does It Exist?',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 15,
      prompt:
        'Understand what .NET is, what C# is, how they relate, and why so many companies build their backends on them.',
      explanation: `Three names get mixed up constantly, so pin them down first.

**C#.** The programming language. You write C# the way you would write Python or JavaScript: files of code with variables, loops, and functions. It is statically typed, which means you declare what kind of data each variable holds and the compiler checks your work before the program ever runs.

**.NET.** The platform your C# code runs on. It bundles three things: a runtime that executes your program and manages memory for you, a huge standard library (collections, files, HTTP, JSON, cryptography), and the command-line tooling (the dotnet command) that builds and runs projects. It is free, open source, and runs on Windows, macOS, and Linux.

**ASP.NET Core.** The web framework inside .NET, used to build APIs and websites. It plays the same role Express plays for Node or Django plays for Python.

**Why companies pick it.** Banks, airlines, healthcare systems, and game studios run on .NET because the compiler catches whole categories of bugs before deployment, performance is near the top of web framework benchmarks, and one platform covers web APIs, background workers, desktop apps, and Unity games. When you see a job posting for a "C# backend engineer", the day-to-day work is ASP.NET Core APIs talking to SQL databases.

**How code runs.** Your C# compiles to an intermediate language (IL). The runtime translates IL into machine code for whatever CPU it lands on. That two-step design is why one compiled app runs on Windows, Linux, and macOS without changes.`,
      production:
        'In production, .NET services are typically ASP.NET Core APIs in Docker containers on Linux. A team chooses it for the type system, the async story, and tooling that scales to large codebases with many engineers. Knowing what the runtime does for you (memory, JIT, garbage collection) is the difference between using the platform and being surprised by it.',
      walkthrough: [
        'Say the three layers out loud: C# is the language, .NET is the runtime plus libraries plus tooling, ASP.NET Core is the web framework.',
        'To try code without installing anything, open dotnetfiddle.net in a browser tab.',
        'To work locally, install the .NET SDK and run: dotnet new console, then dotnet run.',
        'Read the example below. Console.WriteLine prints a line of text, like print in Python.',
      ],
      questions: [
        'What is the difference between C# and .NET?',
        'What does the runtime do for your program?',
        'Why does compiling to IL make .NET cross-platform?',
        'What is ASP.NET Core used for?',
      ],
      checklist: [
        'Explain C#, .NET, and ASP.NET Core in one sentence each.',
        'Name two reasons companies choose .NET for backends.',
        'Know one way to run C# code right now (dotnetfiddle.net or dotnet run).',
      ],
      interactive: {
        intro:
          'This is a complete .NET program. Since .NET 6, a console app can be a single file of plain statements. No ceremony required to start.',
        example: {
          code: 'Console.WriteLine("Hello from .NET!");\nConsole.WriteLine(2 + 2);',
          output: 'Hello from .NET!\n4',
          explain:
            'Line 1 prints the text between quotes. Line 2 does the math first, then prints 4. Each statement ends with a semicolon, and the program runs top to bottom.',
        },
        predicts: [
          {
            question: 'Which one is the programming language?',
            options: ['.NET', 'C#', 'ASP.NET Core'],
            correct: 1,
            why: 'C# is the language you write. .NET is the platform it runs on, and ASP.NET Core is the web framework inside .NET.',
          },
          {
            question: 'What does Console.WriteLine(2 + 2) print?',
            options: ['2 + 2', '4', 'an error'],
            correct: 1,
            why: 'Without quotes, 2 + 2 is arithmetic. The result 4 is computed first and then printed.',
          },
          {
            question: 'Your compiled .NET app can run on Linux because...',
            options: [
              'the compiler produces intermediate language that the runtime translates per machine',
              '.NET only works on Windows',
              'C# is interpreted line by line like a shell script',
            ],
            correct: 0,
            why: 'C# compiles to IL, and the runtime turns IL into native machine code on whatever OS and CPU it runs on.',
          },
        ],
        tweak: {
          instruction: 'On dotnetfiddle.net, change the text to your own name and run it.',
          reveal:
            'Console.WriteLine prints exactly what is between the quotes. The semicolon marks the end of the statement, and forgetting it is the first compiler error most people meet.',
        },
      },
    },
    {
      id: 'cs-rung-program-shape',
      title: 'Rung 2: The Shape Of A C# Program',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Learn the anatomy of a C# file: statements, semicolons, braces, comments, and how dotnet run executes Program.cs.',
      explanation: `A C# project starts from two files. The .csproj file describes the project (its target .NET version and its packages). Program.cs holds your code. When you run dotnet run, the SDK compiles every .cs file in the project and executes the result.

**Statements.** One instruction, ended by a semicolon. The compiler reads semicolons as "this instruction is finished", so line breaks and spacing are for humans.

**Braces.** Curly braces { } group statements into a block. Blocks belong to ifs, loops, methods, and classes. Python uses indentation for this; C# uses braces, and indentation is just style.

**Comments.** Two slashes start a comment that runs to the end of the line. The compiler ignores comments completely.

**Case sensitivity.** console.writeline does not compile. The class is Console and the method is WriteLine. C# convention capitalizes type names and method names (PascalCase) and uses camelCase for variables.`,
      production:
        'Real services have dozens of .cs files, but the execution model never changes: the entry point runs top to bottom and calls into other files. When a production app fails at startup, the stack trace points into this same path, so knowing what runs first is a debugging skill from day one.',
      walkthrough: [
        'Create a project with: dotnet new console -n HelloApi.',
        'Open Program.cs and read it. It may be a single WriteLine.',
        'Add a second statement and run dotnet run again.',
        'Delete a semicolon on purpose and read the compiler error. Errors name the file and line.',
      ],
      questions: [
        'What does a semicolon mean to the compiler?',
        'What do braces do in C#?',
        'Why does console.writeline fail to compile?',
      ],
      checklist: [
        'Create and run a console project with the dotnet CLI or dotnetfiddle.',
        'Explain statements, semicolons, and braces.',
        'Read one compiler error and find the line it points to.',
      ],
      interactive: {
        example: {
          code: '// This is a comment. The compiler skips it.\nConsole.WriteLine("First");\nConsole.WriteLine("Second");\n\n// Spacing is for people; semicolons end statements:\nConsole.Write("Same ");\nConsole.WriteLine("line");',
          output: 'First\nSecond\nSame line',
          explain:
            'WriteLine prints and moves to the next line. Write prints and stays on the same line, so "Same " and "line" join into one printed line.',
        },
        predicts: [
          {
            question: 'What happens if you remove a semicolon from a statement?',
            options: [
              'the program skips the line',
              'the compiler refuses to build and names the line',
              'the runtime crashes halfway',
            ],
            correct: 1,
            why: 'C# is compiled. Syntax problems stop the build before anything runs, and the error message points at the file and line.',
          },
          {
            question: 'What does Console.Write (without Line) do differently?',
            options: [
              'it prints without moving to the next line',
              'it prints twice',
              'it writes to a file',
            ],
            correct: 0,
            why: 'Write stays on the same output line. WriteLine adds a line break after printing.',
          },
        ],
        tweak: {
          instruction: 'Change Console.WriteLine to console.writeline and try to run it.',
          reveal:
            "The build fails with an error like \"The name 'console' does not exist in the current context\". C# is case sensitive, and the class is named Console.",
        },
      },
    },
    {
      id: 'cs-rung-types',
      title: 'Rung 3: Static Types: int, double, string, bool',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Learn the four everyday types, what static typing means, and what var does and does not do.',
      explanation: `In Python, any variable can hold anything. In C#, every variable has a declared type, and the compiler holds you to it. This is the single biggest mental shift coming from a dynamic language, and it is the main reason teams pick C# for large systems.

**int.** A whole number, like 42. Math on ints stays in whole numbers.

**double.** A number with a decimal point, like 19.99. There is also decimal, preferred for money because it avoids binary rounding surprises.

**string.** Text in double quotes. Single quotes are different in C#: they hold a single char like 'a'.

**bool.** Exactly true or false, lowercase in code. When printed, .NET shows them capitalized as True and False, which surprises everyone once.

**var.** Shorthand that asks the compiler to infer the type from the right-hand side. var count = 42 makes count an int forever. var changes how the declaration reads; the variable is still fully statically typed, and assigning a string to it later will fail to compile.`,
      production:
        'Static types are executable documentation. When a production method declares it returns int, every caller can rely on that forever, and refactors that break the contract fail the build instead of failing at 2am. Type mismatch bugs that plague dynamic codebases mostly cannot ship in C#.',
      walkthrough: [
        'Declare one variable of each type: int, double, string, bool.',
        'Try assigning a string into the int and read the compiler error.',
        'Use GetType() to print what the runtime thinks each value is.',
        'Rewrite one declaration with var and confirm nothing changes at runtime.',
      ],
      questions: [
        'What does it mean that C# is statically typed?',
        'Does var make a variable dynamic?',
        'Why does .NET print booleans as True instead of true?',
        'When would you choose decimal over double?',
      ],
      checklist: [
        'Declare int, double, string, and bool variables.',
        'Explain what the compiler does with a type mismatch.',
        'Explain why var is still static typing.',
      ],
      interactive: {
        example: {
          code: 'int count = 42;\ndouble price = 19.99;\nstring name = "Ada";\nbool active = true;\n\nConsole.WriteLine(count.GetType());\nConsole.WriteLine(price.GetType());\nConsole.WriteLine(name.GetType());\nConsole.WriteLine(active);',
          output: 'System.Int32\nSystem.Double\nSystem.String\nTrue',
          explain:
            'GetType reveals the runtime type behind each keyword: int is System.Int32, double is System.Double, and string is System.String. Printing a bool shows True with a capital T.',
        },
        predicts: [
          {
            question: 'What happens at build time if you write: int count = "hello";',
            options: [
              'count becomes a string',
              'the compiler rejects it with a type error',
              'it compiles but crashes when run',
            ],
            correct: 1,
            why: 'The declared type is a contract. A string cannot be assigned to an int, and the build fails before anything runs.',
          },
          {
            question: 'After var count = 42; what is count allowed to hold later?',
            options: ['anything', 'only int values', 'ints and strings'],
            correct: 1,
            why: 'var infers int from 42 at compile time. From then on count is an int like any other.',
          },
          {
            question: 'What does Console.WriteLine(active) print when active is true?',
            options: ['true', 'True', '1'],
            correct: 1,
            why: '.NET formats booleans with a capital letter: True and False.',
          },
        ],
        tweak: {
          instruction: 'Add: count = count + 1; then print count. Then try: count = "many"; and rebuild.',
          reveal:
            'The first change prints 43. The second refuses to compile with CS0029: cannot implicitly convert type string to int. The compiler is your first test suite.',
        },
      },
    },
    {
      id: 'cs-rung-strings',
      title: 'Rung 4: Strings And Interpolation',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Work with text: interpolation with $"", Length, indexing, and the methods you will use daily.',
      explanation: `Backend work is mostly moving text around: request fields, JSON, SQL parameters, log lines. C# strings come with a rich set of tools.

**Interpolation.** Put a dollar sign before the opening quote and you can embed any expression in curly braces: $"Hello, {name}!". This is the C# equivalent of Python f-strings and the standard way to build text.

**Immutability.** String methods never change the original. name.ToUpper() returns a new string and leaves name untouched. If you want the result, assign it to something.

**Everyday methods.** ToUpper and ToLower change case. Trim removes surrounding whitespace. Contains, StartsWith, and EndsWith answer questions and return bools. Replace swaps text. Split breaks a string into an array. Length is a property (no parentheses) that counts characters.

**Indexing.** name[0] reads the first character, counting from zero. The result is a char, which is why it prints without quotes.`,
      production:
        'Normalizing user input is daily backend work: Trim it, lowercase the email, validate with StartsWith or Contains before it reaches the database. Forgetting that strings are immutable (calling ToUpper and discarding the result) is one of the most common bugs in code review.',
      walkthrough: [
        'Build a sentence with $"" interpolation instead of + concatenation.',
        'Chain methods: " Ada ".Trim().ToUpper() runs left to right.',
        'Check membership with Contains and read the bool it returns.',
        'Read Length without parentheses; it is a property, while ToUpper() is a method.',
      ],
      questions: [
        'What does the $ before a string enable?',
        'What does "immutable" mean for strings?',
        'Why is it Length but ToUpper()?',
      ],
      checklist: [
        'Build a string with interpolation.',
        'Use Trim, ToUpper, and Contains.',
        'Explain why methods return new strings.',
      ],
      interactive: {
        example: {
          code: 'string first = "ada";\nConsole.WriteLine(first.ToUpper());\nConsole.WriteLine($"Hello, {first}!");\nConsole.WriteLine(first.Length);\nConsole.WriteLine(first.Contains("da"));\nConsole.WriteLine(first[0]);',
          output: 'ADA\nHello, ada!\n3\nTrue\na',
          explain:
            'ToUpper returns a capitalized copy while first stays "ada", which is why the interpolated line still shows lowercase. Length counts 3 chars, Contains returns a bool, and [0] reads the first character.',
        },
        predicts: [
          {
            question: 'After first.ToUpper() runs, what does first hold?',
            options: ['"ADA"', '"ada"', 'nothing'],
            correct: 1,
            why: 'Strings are immutable. ToUpper returned a new string "ADA" that was printed and discarded; first never changed.',
          },
          {
            question: 'What does first.Contains("da") return?',
            options: ['the position 1', 'True', '"da"'],
            correct: 1,
            why: 'Contains answers yes or no as a bool, and "ada" does contain "da".',
          },
          {
            question: 'What is first.Length?',
            options: ['2', '3', '4'],
            correct: 1,
            why: 'Length counts the characters a, d, a.',
          },
        ],
        tweak: {
          instruction: 'Change the interpolation to $"Hello, {first.ToUpper()}!" and predict the output.',
          reveal:
            'Interpolation braces accept any expression, so it prints Hello, ADA!. This trick of computing inside the braces is everywhere in real code.',
        },
      },
    },
    {
      id: 'cs-rung-numbers',
      title: 'Rung 5: Numbers, Division, And The Integer Trap',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Learn C# arithmetic and the most famous beginner trap: integer division.',
      explanation: `Arithmetic looks familiar: + - * / and % for remainder. One rule causes real bugs: the type of the operands decides the type of the result.

**Integer division.** When both sides of / are ints, the result is an int and the decimal part is thrown away. 7 / 2 is 3. There is no rounding; the fraction is truncated.

**Getting real division.** Make either side a double: 7.0 / 2 is 3.5, and (double)a / b casts the variable a to double first. The cast syntax (double)x converts for that one expression.

**Remainder.** 7 % 2 is 1. The remainder operator drives even/odd checks, batching, and wrap-around indexing, exactly like in Python.

**Overflow.** An int holds values up to about 2.1 billion. Production code that counts bytes or rows can exceed that, which is why you will see long (a 64-bit integer) on sizes and IDs.`,
      production:
        'Integer division bugs ship constantly: an average computed as sum / count silently returns 0 when both are ints and count exceeds sum. Percentage calculations, money splits, and progress bars are the classic victims. The fix is one cast, but you have to know to look.',
      walkthrough: [
        'Predict 7 / 2 before running it, then run it.',
        'Fix it with 7.0 / 2 and with (double)7 / 2; both print 3.5.',
        'Use % to test for even numbers: n % 2 == 0.',
        'Remember the rule: int op int gives int.',
      ],
      questions: [
        'Why is 7 / 2 equal to 3 in C#?',
        'How do you force real division?',
        'Where does % show up in real code?',
      ],
      checklist: [
        'Predict integer vs double division correctly.',
        'Cast with (double) to fix truncation.',
        'Use % for an even/odd check.',
      ],
      interactive: {
        example: {
          code: 'Console.WriteLine(7 + 3);\nConsole.WriteLine(7 / 2);\nConsole.WriteLine(7.0 / 2);\nConsole.WriteLine(7 % 2);\nConsole.WriteLine((double)7 / 2);',
          output: '10\n3\n3.5\n1\n3.5',
          explain:
            'Line 2 is the trap: both operands are ints, so the result is the int 3. Making either side a double (line 3 or the cast on line 5) gives 3.5. The % gives the remainder 1.',
        },
        predicts: [
          {
            question: 'What does 9 / 2 print?',
            options: ['4.5', '4', '5'],
            correct: 1,
            why: 'Both operands are ints, so the result is an int. The fraction is truncated, leaving 4.',
          },
          {
            question: 'Which expression gives 4.5?',
            options: ['9 / 2', '(double)9 / 2', '(int)(9.0 / 2)'],
            correct: 1,
            why: 'Casting one operand to double makes the whole division floating point: 4.5.',
          },
        ],
        tweak: {
          instruction: 'Compute an average: int sum = 7; int count = 2; print sum / count, then fix it.',
          reveal:
            'sum / count prints 3 because both are ints. (double)sum / count prints 3.5. This exact bug appears in real dashboards and billing code.',
        },
      },
    },
    {
      id: 'cs-rung-booleans',
      title: 'Rung 6: Booleans, Comparison, And Logic',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt:
        'Combine conditions with &&, ||, and !, and learn how C# evaluates them.',
      explanation: `Every permission check, validation rule, and branch decision compiles down to boolean logic.

**Comparison operators.** == tests equality, != tests inequality, and < <= > >= compare order. Each produces a bool.

**Logical operators.** && is AND (both sides must be true). || is OR (at least one side true). ! flips a bool. These are the symbols behind the words you used in Python.

**Short-circuiting.** && stops evaluating when the left side is false, and || stops when the left side is true. This is a correctness tool: user != null && user.Active is safe because the right side never runs when user is null.

**No truthiness.** C# refuses to treat other values as booleans. if (count) does not compile; you must write if (count > 0). This removes a whole class of accidental bugs that dynamic languages allow.`,
      production:
        'Authorization is boolean logic: active && (isOwner || isAdmin). Short-circuit order also matters for performance and safety, like checking a cheap flag before calling a slow service. Getting the parentheses wrong in a permission check is a security bug, so reviewers read these lines hard.',
      walkthrough: [
        'Write a comparison and print the bool it produces.',
        'Combine two checks with && and with ||.',
        'Flip one with ! and re-read the line out loud.',
        'Lean on short-circuit order: put null checks on the left.',
      ],
      questions: [
        'When does && evaluate its right side?',
        'Why does if (count) fail to compile in C#?',
        'How does short-circuiting make null checks safe?',
      ],
      checklist: [
        'Use &&, ||, and ! in expressions.',
        'Explain short-circuit evaluation.',
        'Explain why C# has no truthiness.',
      ],
      interactive: {
        example: {
          code: 'bool active = true;\nstring role = "admin";\n\nConsole.WriteLine(active && role == "admin");\nConsole.WriteLine(!active);\nConsole.WriteLine(role == "user" || active);\nConsole.WriteLine(10 > 3 && 2 != 2);',
          output: 'True\nFalse\nTrue\nFalse',
          explain:
            'Line 1: both sides true, so True. Line 2 flips true. Line 3: the right side rescues it. Line 4: 2 != 2 is false, and && needs both.',
        },
        predicts: [
          {
            question: 'With active = false, what does active && Expensive() do?',
            options: [
              'calls Expensive() then returns false',
              'returns false without calling Expensive()',
              'throws an error',
            ],
            correct: 1,
            why: '&& short-circuits: once the left side is false the result is decided, so the right side never runs.',
          },
          {
            question: 'Why does if (count) not compile when count is an int?',
            options: [
              'C# requires an actual bool in conditions',
              'count must be capitalized',
              'if needs two conditions',
            ],
            correct: 0,
            why: 'C# has no truthiness. Conditions must be bools, so you write if (count > 0).',
          },
        ],
        tweak: {
          instruction: 'Change role to "user" and re-evaluate all four lines before running.',
          reveal:
            'Line 1 becomes False (right side fails), line 3 stays True only because active is true. Logic bugs hide in exactly this kind of re-reading.',
        },
      },
    },
    {
      id: 'cs-rung-if-else',
      title: 'Rung 7: If, Else If, Else',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Branch with if / else if / else, and learn how braces scope each path.',
      explanation: `Branching in C# reads like English once you know the shape: a condition in parentheses, a block in braces.

**The chain.** if checks first. Each else if is tried only when everything above it failed. else catches whatever is left. The first match wins and the rest of the chain is skipped, so order the conditions from most specific to least.

**Braces and scope.** Variables declared inside braces exist only inside those braces. Declaring string grade inside the if and using it after the chain will not compile. Declare before the chain, assign inside.

**The ternary.** condition ? a : b is a one-line if/else for choosing between two values: var label = score >= 70 ? "pass" : "fail". Use it for simple picks and a full chain for anything with multiple branches.`,
      production:
        'Branch ordering is a real bug source: a discount tier check written from smallest to largest matches the small tier first and never reaches the big one. Reviewers also look for missing else branches on validation chains, where an unhandled case slides through silently.',
      walkthrough: [
        'Write the chain with conditions ordered from highest threshold down.',
        'Declare result variables before the chain, assign inside.',
        'Add an else so every input lands somewhere.',
        'Collapse a simple two-way choice into a ternary.',
      ],
      questions: [
        'Why does condition order matter in an if / else if chain?',
        'What happens to a variable declared inside braces?',
        'When is a ternary clearer than a full chain?',
      ],
      checklist: [
        'Write an if / else if / else chain.',
        'Order conditions so the right branch wins.',
        'Use a ternary for a two-way choice.',
      ],
      interactive: {
        example: {
          code: 'int score = 72;\nstring grade;\n\nif (score >= 90)\n{\n    grade = "A";\n}\nelse if (score >= 70)\n{\n    grade = "B";\n}\nelse\n{\n    grade = "C";\n}\n\nConsole.WriteLine(grade);\nConsole.WriteLine(score >= 70 ? "pass" : "fail");',
          output: 'B\npass',
          explain:
            '72 fails the >= 90 check, passes >= 70, so grade is B and the else never runs. The ternary picks "pass" for the same reason.',
        },
        predicts: [
          {
            question: 'With score = 95, which branch assigns grade?',
            options: ['the >= 90 branch', 'the >= 70 branch', 'both branches'],
            correct: 0,
            why: 'The first matching branch wins and the rest of the chain is skipped, even though 95 also passes >= 70.',
          },
          {
            question: 'What if the chain were written with if (score >= 70) first and else if (score >= 90) second?',
            options: [
              'nothing changes',
              'a 95 would land in the >= 70 branch and never reach >= 90',
              'the compiler reorders them',
            ],
            correct: 1,
            why: 'Chains evaluate top to bottom. A broader condition placed first swallows inputs meant for the narrower one below it.',
          },
        ],
        tweak: {
          instruction: 'Move the string grade declaration inside the first if block and rebuild.',
          reveal:
            'The build fails at Console.WriteLine(grade) because grade only exists inside those braces. Scope follows braces exactly.',
        },
      },
    },
    {
      id: 'cs-rung-collections',
      title: 'Rung 8: Arrays And List<T>',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 15,
      prompt:
        'Store ordered data in arrays and List<T>, and meet generics through the angle brackets.',
      explanation: `C# gives you two everyday containers for ordered items.

**Arrays.** Fixed size, declared with square brackets: int[] scores = { 10, 20, 30 }. You can read and overwrite slots, but you can never add a fourth slot. Size is locked at creation. The item count is the Length property.

**List<T>.** The growable workhorse, used far more often: List<int> nums = new List<int> { 10, 20, 30 }. Add appends, Remove deletes, and Count (a property) tracks size. Backend code that builds up results almost always uses List.

**The angle brackets.** The T in List<T> is a generic type parameter. List<int> holds only ints; List<string> holds only strings. The compiler enforces it, so nums.Add("hello") on a List<int> fails the build. Generics give you typed collections without writing a new class per type.

**Indexing.** Both use [0] for the first item, and reading past the end throws IndexOutOfRangeException at runtime. C# has no negative indexing like Python; the last item is nums[nums.Count - 1], or nums[^1] with the index-from-end operator.`,
      production:
        'API handlers build a List of results while filtering or transforming rows from a database, then serialize it to JSON. The compiler guaranteeing every element type means downstream code never needs to check what is inside, which is a quiet productivity win across a large codebase.',
      walkthrough: [
        'Make an array with three values and read slot 0.',
        'Make a List<int>, Add a value, and read Count.',
        'Try adding a string to the List<int> and read the compile error.',
        'Read the last item with nums[nums.Count - 1] or nums[^1].',
      ],
      questions: [
        'When is an array the wrong choice?',
        'What does the T in List<T> mean?',
        'What happens when you read index 10 of a 4-item list?',
      ],
      checklist: [
        'Create and index an array.',
        'Create a List<T>, Add to it, and read Count.',
        'Explain what the compiler enforces about element types.',
      ],
      interactive: {
        example: {
          code: 'int[] scores = { 10, 20, 30 };\nConsole.WriteLine(scores[0]);\nConsole.WriteLine(scores.Length);\n\nList<int> nums = new List<int> { 10, 20, 30 };\nnums.Add(40);\nConsole.WriteLine(nums[3]);\nConsole.WriteLine(nums.Count);\nConsole.WriteLine(nums[^1]);',
          output: '10\n3\n40\n4\n40',
          explain:
            'The array reports Length 3 and can never grow. The List accepts Add, so slot 3 (the fourth item) holds 40, Count is 4, and ^1 reads from the end.',
        },
        predicts: [
          {
            question: 'What does nums.Add("hello") do on a List<int>?',
            options: [
              'adds the string',
              'fails to compile',
              'converts "hello" to a number',
            ],
            correct: 1,
            why: 'List<int> is locked to ints by its generic parameter. The compiler rejects other types at build time.',
          },
          {
            question: 'After Add(40), what is nums[3]?',
            options: ['30', '40', 'an error'],
            correct: 1,
            why: 'Indexes start at 0, so slot 3 is the fourth item, which is the freshly added 40.',
          },
          {
            question: 'What does scores.Add(40) do when scores is an array?',
            options: ['appends 40', 'fails to compile', 'overwrites the last slot'],
            correct: 1,
            why: 'Arrays are fixed size and have no Add method. Growable collections are what List<T> is for.',
          },
        ],
        tweak: {
          instruction: 'Print nums[10] and run it.',
          reveal:
            'The build succeeds but the run crashes with ArgumentOutOfRangeException. Index errors are runtime errors because the compiler cannot know list sizes in advance.',
        },
      },
    },
    {
      id: 'cs-rung-loops',
      title: 'Rung 9: Loops: foreach, for, while',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Repeat work with foreach over collections, for with a counter, and while for open-ended conditions.',
      explanation: `C# has three loop shapes, and choosing the right one makes code read like intent.

**foreach.** The default. foreach (int n in nums) visits every item in order with no index bookkeeping. When you just need each item, this is the one. The loop variable is read-only; you cannot assign to n to change the list.

**for.** The counted loop: for (int i = 0; i < 3; i++) declares a counter, a continue-condition, and a step. Use it when you need the index itself or a numeric range. There is no built-in range() like Python; the for loop is that tool.

**while.** Repeats while a condition holds. Use it when you do not know the iteration count in advance: reading until a queue is empty, retrying until a deadline. The classic bug is forgetting to change the condition inside the body, which loops forever.

**The accumulator pattern.** Declare a total before the loop, add inside, use after. This exact shape powers summing, counting, and joining in every language you will ever use.`,
      production:
        'Most production loops are foreach over rows, messages, or files. Off-by-one errors live almost entirely in manual for loops (i <= n instead of i < n), which is a strong argument for reaching for foreach first and for LINQ once you know it.',
      walkthrough: [
        'Total a list with foreach and an accumulator.',
        'Print 0, 1, 2 with a for loop and note i < 3 stops before 3.',
        'Write a while that counts down and always changes its condition variable.',
        'Pick foreach by default; use for only when you need the index.',
      ],
      questions: [
        'When do you need for instead of foreach?',
        'What causes an infinite while loop?',
        'Where does the accumulator pattern appear in real code?',
      ],
      checklist: [
        'Sum a list with foreach.',
        'Write a for loop with a correct boundary.',
        'Explain when while is the right loop.',
      ],
      interactive: {
        example: {
          code: 'var nums = new List<int> { 1, 2, 3, 4 };\nint total = 0;\nforeach (int n in nums)\n{\n    total += n;\n}\nConsole.WriteLine(total);\n\nfor (int i = 0; i < 3; i++)\n{\n    Console.WriteLine(i);\n}',
          output: '10\n0\n1\n2',
          explain:
            'The foreach adds 1+2+3+4 into total. The for loop starts at 0 and stops when i < 3 fails, so it prints 0, 1, 2.',
        },
        predicts: [
          {
            question: 'How many lines does for (int i = 0; i <= 3; i++) print?',
            options: ['3', '4', 'infinite'],
            correct: 1,
            why: '<= includes 3 itself, so it prints 0, 1, 2, 3. The difference between < and <= is the classic off-by-one.',
          },
          {
            question: 'What is wrong with: while (count > 0) { Console.WriteLine(count); }',
            options: [
              'nothing',
              'count never changes, so it loops forever',
              'while needs braces around the condition',
            ],
            correct: 1,
            why: 'The body never decrements count, so the condition stays true forever. Every while body must move toward ending.',
          },
        ],
        tweak: {
          instruction: 'Change the for loop to start at int i = 1 and predict the printed numbers.',
          reveal: 'It prints 1 and 2. The start, the condition, and the step each independently shape the range.',
        },
      },
    },
    {
      id: 'cs-rung-dictionaries',
      title: 'Rung 10: Dictionary<TKey, TValue>',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 14,
      prompt:
        'Map keys to values with Dictionary, handle missing keys safely, and connect it to JSON.',
      explanation: `A Dictionary<TKey, TValue> maps keys to values with fast lookup, like a Python dict with declared types for both sides.

**Creating and reading.** new Dictionary<string, string> { ["name"] = "Kay" } builds one with the index initializer. user["name"] looks up a key. Both the key type and the value type are enforced by the compiler.

**The missing-key crash.** Reading user["email"] when that key is absent throws KeyNotFoundException at runtime. Production code uses the safe forms: TryGetValue(key, out var value) returns a bool and hands you the value, or GetValueOrDefault(key, fallback) returns the fallback when the key is missing.

**Writing.** Assigning to a key adds it when absent and overwrites when present. ContainsKey asks without reading. Count says how many pairs exist.

**Why this matters.** A JSON object is conceptually a dictionary, and request headers, query parameters, and cache lookups all flow through this type. Reading a dictionary safely is the same skill as handling an optional field in an API payload.`,
      production:
        'Caches, feature-flag tables, and header maps are dictionaries. The missing-key exception is a top-ten production crash for new C# developers, usually from assuming an optional field always arrives. TryGetValue in handlers is the habit that prevents it.',
      walkthrough: [
        'Build a Dictionary<string, string> with two keys.',
        'Read a present key with [], then a missing one with GetValueOrDefault.',
        'Add a key by assigning to it, then print Count.',
        'Replace one risky [] read with TryGetValue.',
      ],
      questions: [
        'What happens when you read a missing key with []?',
        'How do TryGetValue and GetValueOrDefault differ?',
        'Why are dictionaries the right model for JSON objects?',
      ],
      checklist: [
        'Create, read, and add to a Dictionary.',
        'Handle a missing key without crashing.',
        'Map the concept onto a JSON object.',
      ],
      interactive: {
        example: {
          code: 'var user = new Dictionary<string, string>\n{\n    ["name"] = "Kay",\n    ["role"] = "admin",\n};\n\nConsole.WriteLine(user["name"]);\nConsole.WriteLine(user.GetValueOrDefault("email", "none"));\nuser["active"] = "yes";\nConsole.WriteLine(user.Count);',
          output: 'Kay\nnone\n3',
          explain:
            'The [] read works because name exists. email does not, so GetValueOrDefault returns the fallback instead of crashing. Assigning active adds a third pair.',
        },
        predicts: [
          {
            question: 'What does user["email"] do when the key is missing?',
            options: [
              'returns null',
              'throws KeyNotFoundException',
              'returns an empty string',
            ],
            correct: 1,
            why: 'Square-bracket reads throw on missing keys. The safe forms are TryGetValue and GetValueOrDefault.',
          },
          {
            question: 'What does assigning user["role"] = "viewer" do when role already exists?',
            options: ['throws', 'adds a second role key', 'overwrites the value'],
            correct: 2,
            why: 'Keys are unique. Assigning to an existing key replaces its value in place.',
          },
        ],
        tweak: {
          instruction: 'Replace the GetValueOrDefault line with: if (user.TryGetValue("email", out var email)) Console.WriteLine(email); else Console.WriteLine("no email");',
          reveal:
            'It prints no email. TryGetValue returns false for missing keys and never throws, which is why it dominates production code.',
        },
      },
    },
    {
      id: 'cs-rung-methods',
      title: 'Rung 11: Methods: Signatures And Return Types',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 15,
      prompt:
        'Write methods with typed parameters and return values, defaults, and expression bodies.',
      explanation: `A C# method declares its entire contract in one line called the signature: what it returns, what it is named, and what it takes.

**The signature.** string Greet(string name) says: give me a string, I give you back a string. The compiler enforces both directions. Callers cannot pass an int, and the body cannot forget to return.

**void.** A method that returns nothing declares void. Calling it is a statement, and trying to assign its result is a compile error.

**Defaults and naming.** string Greet(string name, string greeting = "Hello") makes the second argument optional. Callers can also name arguments for clarity: Greet(name: "Kay").

**Expression bodies.** One-expression methods can use the arrow form: int Square(int x) => x * x;. Same behavior, less ceremony, used heavily in real codebases.

**Return over print.** A method that returns its result can be tested, reused, and composed. Console output is for humans at the edges of the program. This rule carries over from every language and matters even more here because the return type is part of the public contract.`,
      production:
        'Method signatures are how large teams coordinate. A service method declared as decimal CalculateTax(Order order) tells every caller the input and output without reading the body. Changing a signature is a visible, build-breaking event, which is exactly what you want for a contract change.',
      walkthrough: [
        'Write a method with two typed parameters and a typed return.',
        'Give one parameter a default and call it both ways.',
        'Convert a one-liner to the => expression form.',
        'Return the value; print only at the call site.',
      ],
      questions: [
        'What information does a signature carry?',
        'What does void mean?',
        'Why prefer returning over printing inside methods?',
      ],
      checklist: [
        'Write a method with parameters and a return type.',
        'Use a default parameter value.',
        'Use the => expression body form.',
      ],
      interactive: {
        example: {
          code: 'string Greet(string name, string greeting = "Hello")\n{\n    return $"{greeting}, {name}!";\n}\n\nint Square(int x) => x * x;\n\nConsole.WriteLine(Greet("Kay"));\nConsole.WriteLine(Greet("Sam", "Hi"));\nConsole.WriteLine(Square(6));',
          output: 'Hello, Kay!\nHi, Sam!\n36',
          explain:
            'The first call omits greeting so the default fills in. The second overrides it. Square shows the arrow form for one-expression methods.',
        },
        predicts: [
          {
            question: 'What does Greet(42) do?',
            options: [
              'prints Hello, 42!',
              'fails to compile',
              'converts 42 to a string',
            ],
            correct: 1,
            why: 'The parameter is declared string. An int argument is a compile-time type error.',
          },
          {
            question: 'A method declared int Add(int a, int b) must...',
            options: [
              'return an int on every path',
              'print its result',
              'be called exactly once',
            ],
            correct: 0,
            why: 'The return type is a promise. Any path that fails to return an int stops the build.',
          },
        ],
        tweak: {
          instruction: 'Remove the return statement from Greet and rebuild.',
          reveal:
            "The compiler reports \"not all code paths return a value\". The return type makes forgetting impossible, which is the static-typing payoff in one error message.",
        },
      },
    },
    {
      id: 'cs-rung-classes',
      title: 'Rung 12: Classes, Properties, And Objects',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 18,
      prompt:
        'Model a concept with a class: properties, a constructor, methods, and the new keyword.',
      explanation: `C# is class-based at its core. Where a Python dict might carry loose fields, C# code defines a class so the compiler knows exactly what a User or an Order looks like.

**The class.** A blueprint grouping data (properties) and behavior (methods). class Counter { ... } defines the shape; new Counter() creates an instance, and each instance has its own data.

**Properties.** public int Value { get; private set; } declares readable data with controlled writing: anyone can read Value, only code inside the class can change it. Auto-properties like this replace the getter/setter boilerplate of other languages.

**Constructors.** A method with the class name that runs at new time, used to require initial data: new BankAccount("Kay", 100). If you do not write one, a default empty constructor exists.

**Encapsulation in one sentence.** Expose what callers need, protect what keeps the object valid. The private set above means no outside code can corrupt the counter; the only path is the Increment method, which the class controls.

**Top-level note.** In a single-file program, class declarations go below the top-level statements. The compiler requires that ordering.`,
      production:
        'Every entity in a production .NET service is a class or record: User, Order, Invoice. Encapsulation is what stops a teammate from setting order.Total directly instead of going through the method that also writes the audit log. Code review in C# shops leans on access modifiers doing this work.',
      walkthrough: [
        'Define a class with one auto-property and one method.',
        'Restrict writes with private set.',
        'Create two instances and confirm they hold separate state.',
        'Add a constructor that requires a starting value.',
      ],
      questions: [
        'What is the difference between a class and an instance?',
        'What does private set protect against?',
        'When does a constructor run?',
      ],
      checklist: [
        'Define a class with a property and a method.',
        'Create instances with new and confirm separate state.',
        'Explain what private set enforces.',
      ],
      interactive: {
        example: {
          code: 'var a = new Counter();\nvar b = new Counter();\na.Increment();\na.Increment();\nb.Increment();\n\nConsole.WriteLine(a.Value);\nConsole.WriteLine(b.Value);\n\nclass Counter\n{\n    public int Value { get; private set; }\n\n    public void Increment() => Value++;\n}',
          output: '2\n1',
          explain:
            'a and b are separate instances with separate Value state: a was incremented twice, b once. The class declaration sits below the top-level statements.',
        },
        predicts: [
          {
            question: 'What does a.Value = 100; do outside the class?',
            options: [
              'sets the counter to 100',
              'fails to compile because the setter is private',
              'creates a new property',
            ],
            correct: 1,
            why: 'private set means only code inside Counter can write Value. Outside code gets a compile error, which is the encapsulation working.',
          },
          {
            question: 'After var c = new Counter(); what is c.Value?',
            options: ['0', 'null', 'unset until Increment runs'],
            correct: 0,
            why: 'int properties default to 0. Every new Counter starts at zero unless a constructor says otherwise.',
          },
          {
            question: 'Why did b print 1 instead of 2?',
            options: [
              'instances share state',
              'each instance has its own Value, and b was incremented once',
              'b copied a at creation',
            ],
            correct: 1,
            why: 'new creates independent objects. Calls on a never touch the data inside b.',
          },
        ],
        tweak: {
          instruction: 'Add a constructor: public Counter(int start) => Value = start; then create new Counter(10) and increment it.',
          reveal:
            'It prints 11. Constructors let the creator supply required starting state, and adding one removes the default empty constructor, so new Counter() now needs an argument.',
        },
      },
    },
    {
      id: 'cs-rung-linq',
      title: 'Rung 13: LINQ: Where, Select, Count',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 16,
      prompt:
        'Filter and transform collections with LINQ, the feature C# developers miss most in other languages.',
      explanation: `LINQ (Language Integrated Query) turns the filter/transform/summarize loop patterns into named, chainable operations on any collection.

**Where filters.** nums.Where(n => n % 2 == 0) keeps elements where the test returns true. The n => ... syntax is a lambda: a tiny inline function taking n and returning the expression.

**Select transforms.** evens.Select(n => n * n) builds a new sequence by applying the lambda to each element. Where decides which items survive; Select decides what each becomes.

**Count, Sum, First, Any.** Count(predicate) counts matches, Sum totals, Any answers "does at least one match" as a bool, First grabs the first match (and throws if none; FirstOrDefault returns the type default instead).

**Laziness and ToList.** Most LINQ operators build a description of work that executes when consumed. Calling ToList() runs the chain and materializes a real List. Until then, the query is a recipe rather than a result.

**Reading chains.** Production code chains these left to right: users.Where(u => u.Active).Select(u => u.Email).ToList() reads as filter, then shape, then materialize. This one line replaces ten lines of loop and accumulator.`,
      production:
        'LINQ is also the API of Entity Framework Core: the same Where and Select compile into SQL when pointed at a database table. Learning it on lists transfers directly to database queries, which is why this rung matters more than any other for backend job-readiness.',
      walkthrough: [
        'Filter a list with Where and a lambda.',
        'Transform the survivors with Select.',
        'Summarize with Count and a predicate.',
        'Materialize with ToList and print with string.Join.',
      ],
      questions: [
        'What does a lambda like n => n * n consist of?',
        'How do Where and Select divide the work?',
        'What does ToList actually do?',
      ],
      checklist: [
        'Filter with Where.',
        'Transform with Select.',
        'Explain the difference between the two.',
      ],
      interactive: {
        example: {
          code: 'var nums = new List<int> { 1, 2, 3, 4, 5, 6 };\n\nvar evens = nums.Where(n => n % 2 == 0).ToList();\nConsole.WriteLine(string.Join(", ", evens));\n\nvar squares = evens.Select(n => n * n);\nConsole.WriteLine(string.Join(", ", squares));\n\nConsole.WriteLine(nums.Count(n => n > 3));\nConsole.WriteLine(nums.Any(n => n > 100));',
          output: '2, 4, 6\n4, 16, 36\n3\nFalse',
          explain:
            'Where keeps 2, 4, 6. Select squares each survivor. Count with a predicate counts 4, 5, 6. Any returns a bool, printed as False since nothing exceeds 100.',
        },
        predicts: [
          {
            question: 'What does nums.Where(n => n > 4) keep?',
            options: ['5, 6', '4, 5, 6', '1, 2, 3'],
            correct: 0,
            why: 'The lambda is the test. Only 5 and 6 make n > 4 true.',
          },
          {
            question: 'Which operation changes what each element becomes?',
            options: ['Where', 'Select', 'Count'],
            correct: 1,
            why: 'Select maps each element through the lambda. Where only decides survival and never alters elements.',
          },
          {
            question: 'What does nums.First(n => n > 100) do?',
            options: [
              'returns null',
              'throws InvalidOperationException',
              'returns 0',
            ],
            correct: 1,
            why: 'First throws when nothing matches. FirstOrDefault is the safe variant that returns the type default, 0 for int.',
          },
        ],
        tweak: {
          instruction: 'Chain it all in one line: nums.Where(n => n % 2 == 0).Select(n => n * 10).ToList() and print it.',
          reveal:
            'It prints 20, 40, 60. Chains read left to right: filter first, then transform the survivors. This shape is most of what backend data code looks like.',
        },
      },
    },
    {
      id: 'cs-rung-exceptions',
      title: 'Rung 14: Exceptions And try / catch',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Handle expected failures with try/catch, catch specific exception types, and know when to let errors surface.',
      explanation: `When something goes wrong at runtime, .NET throws an exception: an object describing the failure that unwinds the call stack until something catches it. Uncaught, it terminates the program with a stack trace.

**try / catch.** Wrap risky work in try; handle a failure in catch. Catch the most specific type you can: catch (DivideByZeroException) documents exactly what you expect to go wrong. A bare catch (Exception) swallows everything, including bugs you wanted to know about.

**Common types.** DivideByZeroException for integer division by zero. KeyNotFoundException from dictionary reads. FormatException from parsing bad input with int.Parse. NullReferenceException when calling members on null, the most famous of all.

**finally and throw.** A finally block runs whether or not an exception occurred, used for cleanup. Inside a catch, a bare throw; re-raises the same exception after you log it, preserving the stack trace.

**The judgment call.** Catch when you have a real recovery: a fallback value, a retry, a clean error response. Let it propagate when the failure is a bug; a crash with a stack trace beats silently wrong behavior every time.`,
      production:
        'ASP.NET Core wraps every request in middleware that converts uncaught exceptions into 500 responses and log entries. Handlers catch the expected cases (validation, not-found) and convert them into 400s and 404s. A catch block that hides exceptions without logging is the most common cause of impossible-to-debug production incidents.',
      walkthrough: [
        'Wrap a division in try and catch DivideByZeroException.',
        'Return a fallback from the catch.',
        'Print exception .Message to see what the object carries.',
        'Delete the try/catch once and watch the crash output.',
      ],
      questions: [
        'Why catch a specific exception type instead of Exception?',
        'When is letting an exception propagate the right call?',
        'What does finally guarantee?',
      ],
      checklist: [
        'Catch a specific exception type.',
        'Recover with a fallback value.',
        'Explain when catching is the wrong move.',
      ],
      interactive: {
        example: {
          code: 'int SafeDivide(int a, int b)\n{\n    try\n    {\n        return a / b;\n    }\n    catch (DivideByZeroException)\n    {\n        return 0;\n    }\n}\n\nConsole.WriteLine(SafeDivide(10, 2));\nConsole.WriteLine(SafeDivide(10, 0));',
          output: '5\n0',
          explain:
            '10 / 2 succeeds normally. 10 / 0 throws DivideByZeroException, the catch grabs it, and the method returns the fallback 0 instead of crashing.',
        },
        predicts: [
          {
            question: 'Without the try/catch, what does SafeDivide(10, 0) do?',
            options: [
              'returns 0 anyway',
              'crashes with DivideByZeroException',
              'returns infinity',
            ],
            correct: 1,
            why: 'Integer division by zero always throws. Unhandled, it terminates the program with a stack trace.',
          },
          {
            question: 'Why is catch (Exception) { } considered dangerous?',
            options: [
              'it is slow',
              'it silently swallows every failure, including real bugs',
              'it does not compile',
            ],
            correct: 1,
            why: 'Catching everything and doing nothing hides bugs. You lose the stack trace and ship silently wrong behavior.',
          },
        ],
        tweak: {
          instruction: 'Change the catch to catch (DivideByZeroException ex) and print ex.Message before returning.',
          reveal:
            'It prints "Attempted to divide by zero." before the fallback. The exception object carries the message and the stack trace your logs depend on.',
        },
      },
    },
    {
      id: 'cs-rung-capstone',
      title: 'Rung 15: Capstone: Records To Summary (0 to 1)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 18,
      prompt:
        'Put everything together: model records, filter with LINQ, and build a summary, the exact shape of real backend work.',
      explanation: `This is the payoff rung. The program below is a miniature of what a real API endpoint does: take typed records, keep the relevant ones, shape a response.

**Records.** record User(string Name, bool Active); declares an immutable data type in one line: the constructor, the properties, value equality, and a readable ToString all come free. Production DTOs (data transfer objects) are records exactly like this.

**Target-typed new.** Inside the list initializer, new("Kay", true) omits the type name because the compiler already knows the list holds Users.

**The pipeline.** users.Where(u => u.Active).Select(u => u.Name).ToList() is the universal backend move: filter rows, project the fields you need, materialize. Swap the list for a database table and this same line becomes an Entity Framework query.

**Interpolation for output.** The summary line is string interpolation pulling from the computed values. In an API, this step would be JSON serialization instead, but the shape of the code is identical.

If you can read and modify this program confidently, you have crossed from 0 to 1 in C#.`,
      production:
        'Every list endpoint in production is this program: query records, filter by a flag or a user id, project to a response shape, serialize. Recognizing the pattern means you can read most handler code in any .NET codebase on your first day.',
      walkthrough: [
        'Declare the record at the bottom of the file.',
        'Build the list with target-typed new.',
        'Filter actives with Where, project names with Select.',
        'Print a summary with interpolation.',
      ],
      questions: [
        'What does a positional record declaration give you for free?',
        'Why does new("Kay", true) work without a type name?',
        'How does this map onto a database query?',
      ],
      checklist: [
        'Declare and use a record.',
        'Filter and project with LINQ.',
        'Explain how this mirrors a real endpoint.',
      ],
      interactive: {
        intro: 'Everything from rungs 1 through 14 appears in this one program.',
        example: {
          code: 'var users = new List<User>\n{\n    new("Kay", true),\n    new("Sam", false),\n    new("Lee", true),\n};\n\nvar activeNames = users\n    .Where(u => u.Active)\n    .Select(u => u.Name)\n    .ToList();\n\nConsole.WriteLine($"Active: {activeNames.Count}");\nConsole.WriteLine(string.Join(", ", activeNames));\n\nrecord User(string Name, bool Active);',
          output: 'Active: 2\nKay, Lee',
          explain:
            'The record gives User typed Name and Active properties. Where keeps Kay and Lee, Select extracts their names, and the summary prints the count and the joined list.',
        },
        predicts: [
          {
            question: 'What is activeNames.Count here?',
            options: ['3', '2', '1'],
            correct: 1,
            why: 'Two users have Active set to true: Kay and Lee.',
          },
          {
            question: 'What does the record declaration generate for you?',
            options: [
              'just a class name',
              'constructor, properties, value equality, and ToString',
              'a database table',
            ],
            correct: 1,
            why: 'Positional records are one-line data types: the compiler writes the boilerplate a class would need by hand.',
          },
          {
            question: 'To get the emails of inactive users instead, you would change...',
            options: [
              'the Where lambda and the Select lambda',
              'only the record',
              'the ToList call',
            ],
            correct: 0,
            why: 'Where(u => !u.Active) flips the filter and Select(u => u.Email) changes the projection, assuming the record gains an Email field. The pipeline shape stays identical.',
          },
        ],
        tweak: {
          instruction: 'Flip the filter to !u.Active and predict both printed lines.',
          reveal: 'Active: 1 and then Sam. One character changed the business rule, and the types kept everything else intact.',
        },
      },
    },
    {
      id: 'cs-rung-aspnet',
      title: 'Rung 16: Where This Goes: ASP.NET Core And The Ecosystem',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 16,
      prompt:
        'See how the C# you just learned becomes a real web API, and map the .NET ecosystem you will meet next.',
      explanation: `Here is the bridge from console programs to the day job. A minimal ASP.NET Core API is a few lines, and every line uses concepts you now know.

**The minimal API.** WebApplication.CreateBuilder configures the app. MapGet("/health", () => ...) attaches a lambda to a URL: the same lambda syntax from LINQ, returning an object that the framework serializes to JSON automatically. app.Run() starts Kestrel, the built-in production web server, listening for HTTP requests.

**What the framework does per request.** Parses HTTP, matches the route, binds parameters into typed method arguments, runs your lambda or handler, serializes the return value to JSON, writes the response. Your code stays small because the platform owns the plumbing.

**The ecosystem map.** NuGet is the package manager (the npm or pip of .NET). Entity Framework Core talks to databases using the LINQ you learned on lists. xUnit writes tests. Serilog structures logs. Docker images for ASP.NET are first-class and most production deployments run on Linux containers.

**Your route from here.** Console fluency (rungs 1 to 15), then a minimal API with two or three routes, then EF Core against SQLite, then auth and deployment. Each step reuses everything below it.`,
      production:
        'A real service adds middleware (auth, logging, error handling), configuration per environment, health checks for the orchestrator, and dependency injection wiring. All of it is registered in this same Program.cs, which is why understanding this small file unlocks reading production startup code.',
      walkthrough: [
        'Read the example and name what each of the four lines does.',
        'Map the lambda in MapGet back to the LINQ lambdas you wrote.',
        'Note the anonymous object new { ok = true } becomes the JSON body.',
        'When ready locally: dotnet new web, paste the route, dotnet run, then open /health in a browser.',
      ],
      questions: [
        'What does MapGet connect?',
        'Who turns the returned object into JSON?',
        'What roles do NuGet and EF Core play?',
        'What is Kestrel?',
      ],
      checklist: [
        'Explain each line of a minimal API.',
        'Name the package manager, ORM, and test framework of .NET.',
        'Describe the request path from URL to JSON response.',
      ],
      interactive: {
        intro:
          'This is a complete, production-grade web server. The output shows what an HTTP client sees when it calls the route.',
        example: {
          code: 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet("/health", () => new { ok = true, service = "api" });\n\napp.Run();',
          output: 'GET http://localhost:5000/health\n\n{"ok":true,"service":"api"}',
          explain:
            'MapGet binds the URL to a lambda. The anonymous object it returns is serialized to JSON by the framework. app.Run starts Kestrel and blocks, serving requests until shutdown.',
        },
        predicts: [
          {
            question: 'The () => new { ok = true } in MapGet is...',
            options: [
              'a special routing keyword',
              'the same lambda syntax used in LINQ, returning a value per request',
              'a string template',
            ],
            correct: 1,
            why: 'It is an ordinary lambda. The framework calls it for each matching request and serializes whatever it returns.',
          },
          {
            question: 'Who converts new { ok = true } into the JSON text {"ok":true}?',
            options: [
              'you write the conversion by hand',
              'ASP.NET Core serializes return values automatically',
              'the browser',
            ],
            correct: 1,
            why: 'Automatic JSON serialization of handler return values is a core framework feature, which keeps handlers focused on logic.',
          },
          {
            question: 'Adding a second route for GET /users would mean...',
            options: [
              'a second MapGet line with its own lambda',
              'a new project',
              'editing Kestrel',
            ],
            correct: 0,
            why: 'Routes are added one MapGet (or MapPost, MapPut, MapDelete) line at a time, each binding a path to a handler.',
          },
        ],
        tweak: {
          instruction: 'Add: app.MapGet("/greet/{name}", (string name) => $"Hello, {name}!"); and call /greet/Kay.',
          reveal:
            'It returns Hello, Kay!. The {name} route segment binds into the typed string parameter automatically. Typed parameter binding is rungs 3 and 11 doing web work.',
        },
      },
    },
  ],
}
