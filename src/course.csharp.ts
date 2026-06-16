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
      title: 'Module 1: What Is .NET, And Why Does It Exist?',
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
        coldOpen:
          'People say ".NET" and "C#" and "ASP.NET" as if they are one thing. They are three, and knowing which is which is the difference between sounding lost and sounding fluent in your first interview. One is the language you type, one is the platform it runs on, one is the web framework. Which is which?',
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
        build: {
          simple: 'C# is a language you write to make programs.',
          actually:
            'C# is the language, .NET is the cross-platform runtime and libraries it runs on, and ASP.NET Core is the web framework inside .NET. C# compiles to intermediate language (IL), which the runtime turns into native code on whatever OS it runs on, so the same build runs on Windows, Linux, and Mac.',
          breaks:
            'Conflating the three trips people up: you cannot "install C#" without .NET, and ASP.NET is not a separate language. The IL-then-native model is also why startup has a brief warm-up the first time code runs.',
        },
        doThisNow: [
          {
            task: 'Open dotnetfiddle.net, paste the two lines above, change the text to your own name, and run it.',
            reveal:
              'Console.WriteLine prints exactly what is between the quotes. The semicolon ends the statement, and forgetting it is the first compiler error almost everyone meets.',
          },
          {
            task: 'Name which is the language, which is the platform, and which is the web framework: C#, .NET, ASP.NET Core.',
            reveal:
              'C# = language you type. .NET = platform/runtime it runs on. ASP.NET Core = web framework inside .NET. Saying these correctly is an instant fluency signal.',
          },
        ],
        warStory:
          'A new hire spent an afternoon trying to "download the C# runtime" and got nowhere, because there is no such thing: you install the .NET SDK, which includes the C# compiler. Five minutes of understanding the three-part naming would have saved the afternoon.',
        tweak: {
          instruction: 'On dotnetfiddle.net, change the text to your own name and run it.',
          reveal:
            'Console.WriteLine prints exactly what is between the quotes. The semicolon marks the end of the statement, and forgetting it is the first compiler error most people meet.',
        },
        receipt: {
          explain: [
            'The difference between C#, .NET, and ASP.NET Core.',
            'Why one compiled .NET build runs on any OS.',
          ],
          question: 'You can print a line. What is the actual file-and-project structure a C# program runs from?',
        },
      },
    },
    {
      id: 'cs-rung-program-shape',
      title: 'Module 2: The Shape Of A C# Program',
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
        coldOpen:
          'Type console.writeline with a lowercase c and the program will not even build. C# is case sensitive, compiled, and brace-delimited, and each of those facts produces a specific first-day error. Better to meet them on purpose now than at 2am later. What does the compiler actually check before anything runs?',
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
        build: {
          simple: 'A C# program is statements in a file.',
          actually:
            'A project is a .csproj (version, packages) plus .cs files; dotnet run compiles them all and runs the entry point top to bottom. Semicolons end statements, braces group blocks (not indentation), // starts a comment, and the language is case sensitive with PascalCase types/methods and camelCase variables.',
          breaks:
            'Because C# is compiled, syntax errors stop the build before anything runs and name the file and line, unlike interpreted languages that fail mid-execution. A missing semicolon or a lowercase Console is a build failure, not a runtime surprise.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, run the example, then break it on purpose: change Console to console and run again. Read the exact error.',
            reveal:
              "The build fails: \"The name 'console' does not exist in the current context.\" C# is case sensitive and the class is Console. The error names the line, which is how you will fix most build failures.",
          },
          {
            task: 'Predict the difference: what does Console.Write do that Console.WriteLine does not?',
            reveal:
              'Write prints and stays on the same line; WriteLine adds a line break after. That is why "Same " and "line" join into one output line in the example.',
          },
        ],
        warStory:
          'A team\'s production deploy failed at startup with a cryptic stack trace. The root cause was a single uninitialized line in Program.cs, the very first file that runs. Knowing the entry point executes top to bottom turned a 40-minute hunt into a 2-minute fix.',
        tweak: {
          instruction: 'Change Console.WriteLine to console.writeline and try to run it.',
          reveal:
            "The build fails with an error like \"The name 'console' does not exist in the current context\". C# is case sensitive, and the class is named Console.",
        },
        receipt: {
          explain: [
            'What semicolons, braces, and case sensitivity mean to the compiler.',
            'Why compiled languages catch errors before running.',
          ],
          question: 'You can write statements. Why does C# make you declare the type of every value?',
        },
      },
    },
    {
      id: 'cs-rung-types',
      title: 'Module 3: Static Types: int, double, string, bool',
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
        coldOpen:
          'In a dynamic language, int count = "hello" blows up at 2am in production. In C# it never ships: the compiler refuses to build it. Static types are a test suite that runs on every line before your code ever executes. So why does var count = 42 not throw that safety away?',
        mental:
          'A type declaration is a signed contract with the compiler: it reads every line of your code before anything runs and rejects the build over any broken promise.',
        diagram: {
          nodes: ['Declare type', 'Compiler checks', 'Build fails early', 'Runtime trusts'],
          explanations: [
            'int count = 42 promises this name holds whole numbers, forever.',
            'The compiler verifies every assignment and every use across the whole program, before it runs.',
            'A violation like count = "hello" stops the build with a named file and line. The bug never reaches a user.',
            'At runtime, nothing needs re-checking: code can trust its values because the contract was enforced up front.',
          ],
        },
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
        build: {
          simple: 'Every variable has a fixed type.',
          actually:
            'C# is statically typed: int, double, string, bool are declared and checked at compile time, so the runtime never re-checks. var infers the type from the right-hand side (var count = 42 makes count an int forever); it is shorthand, not dynamic typing. decimal beats double when exact money math matters.',
          breaks:
            'A type mismatch (int count = "hello") fails the build, not the runtime, so the whole class of type bugs that plague dynamic code cannot ship. Surprise: .NET prints bool as True/False with a capital letter.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, declare an int, then add count = "many"; and rebuild. Read the exact compiler error.',
            reveal:
              'CS0029: cannot implicitly convert type string to int. The build fails before running. The compiler is your first test suite, catching the mismatch at the line it happens.',
          },
          {
            task: 'Predict then verify: after var count = 42; is count allowed to hold a string later? Try it.',
            reveal:
              'No. var inferred int from 42 at compile time, so count is an int like any other and a later string assignment fails to build. var changes how it reads, not how it is typed.',
          },
        ],
        warStory:
          'A team migrated a dynamically-typed service to C#. During the port, the compiler flagged dozens of places where an id was sometimes a string and sometimes a number, latent bugs that had been silently shipping for years in the old codebase. Static types surfaced them all before a single request was served.',
        tweak: {
          instruction: 'Add: count = count + 1; then print count. Then try: count = "many"; and rebuild.',
          reveal:
            'The first change prints 43. The second refuses to compile with CS0029: cannot implicitly convert type string to int. The compiler is your first test suite.',
        },
        receipt: {
          explain: [
            'What static typing checks and when.',
            'Why var is still fully static typing.',
          ],
          question: 'You can store text in a string. How do you build and manipulate that text?',
        },
      },
    },
    {
      id: 'cs-rung-strings',
      title: 'Module 4: Strings And Interpolation',
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
        coldOpen:
          'You call email.Trim() to clean a signup, save the user, and the spaces are still there. The method ran and you threw away its answer, because C# strings never change in place. The same trap that bites JavaScript developers bites here. What is the rule, and what is the C# way to build text cleanly?',
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
        build: {
          simple: 'C# has lots of string methods.',
          actually:
            'Build text with interpolation ($"Hello, {name}!", the f-string equivalent). Strings are immutable, so ToUpper/Trim/Replace return a NEW string and leave the original alone. Length is a property (no parens); methods like ToUpper() use parens. Indexing [0] returns a char (single quotes), not a string.',
          breaks:
            'Calling a string method and discarding the result does nothing: email.Trim() alone leaves the spaces; you need email = email.Trim(). This immutability trap is one of the most common review comments.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, compute inside an interpolation: print $"Hello, {first.ToUpper()}!" and confirm braces accept full expressions.',
            reveal:
              'Prints Hello, ADA!. Interpolation braces run any expression, including method calls. This is everywhere in real C#.',
          },
          {
            task: 'Prove immutability: ToUpper() a string without assigning, then print the original. Did it change?',
            reveal:
              'No. ToUpper returned a new uppercase string that you ignored; the original is untouched. Assign the result (s = s.ToUpper()) to keep it.',
          },
        ],
        warStory:
          'A signup normalized emails with email.ToLower() but never assigned it back. Kay@Site.com and kay@site.com became two accounts, and the "already registered" check missed the duplicate. One missing assignment, weeks of confused support tickets, in C# exactly as in JavaScript.',
        tweak: {
          instruction: 'Change the interpolation to $"Hello, {first.ToUpper()}!" and predict the output.',
          reveal:
            'Interpolation braces accept any expression, so it prints Hello, ADA!. This trick of computing inside the braces is everywhere in real code.',
        },
        receipt: {
          explain: [
            'How interpolation builds text and why strings are immutable.',
            'Why Length has no parens but ToUpper() does.',
          ],
          question: 'Text is handled. Why does 7 / 2 give you 3 in C# instead of 3.5?',
        },
      },
    },
    {
      id: 'cs-rung-numbers',
      title: 'Module 5: Numbers, Division, And The Integer Trap',
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
        coldOpen:
          'An average computed as sum / count returns 0 when count is bigger than sum, and nobody notices until a dashboard shows zeroes. Both values were ints, so C# threw away the fraction. This exact bug ships in real billing and analytics code. Why does 7 / 2 equal 3, and what one character fixes it?',
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
        build: {
          simple: 'C# does arithmetic like a calculator.',
          actually:
            'The operand types decide the result type. int / int gives an int with the fraction truncated (7 / 2 is 3, no rounding). Force real division by making one side a double (7.0 / 2 or (double)a / b). % is the remainder, and long (64-bit) holds values past int\'s ~2.1 billion limit.',
          breaks:
            'Integer division silently truncates: averages, percentages, and money splits computed with two ints quietly drop the fraction. The fix is one cast, but only if you know to look. And an int counting bytes or rows can overflow past 2.1 billion.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, compute an average wrong then right: int sum=7, count=2; print sum/count, then (double)sum/count.',
            reveal:
              'First prints 3 (both ints, truncated), second prints 3.5. This is the integer-division bug that hides in real dashboards and billing code, fixed by one cast.',
          },
          {
            task: 'Predict before running: which of 9/2, (double)9/2, (int)(9.0/2) gives 4.5?',
            reveal:
              '(double)9/2 gives 4.5. 9/2 truncates to 4; (int)(9.0/2) computes 4.5 then casts back to 4. Casting an operand before the division is what keeps the fraction.',
          },
        ],
        warStory:
          'A billing feature split a total across users with total / userCount, both ints. For a $7 charge across 2 users it billed $3 each and quietly lost a dollar every time. The numbers looked plausible, so it ran for months. One (decimal) cast fixed it and a regression test pinned it.',
        tweak: {
          instruction: 'Compute an average: int sum = 7; int count = 2; print sum / count, then fix it.',
          reveal:
            'sum / count prints 3 because both are ints. (double)sum / count prints 3.5. This exact bug appears in real dashboards and billing code.',
        },
        receipt: {
          explain: [
            'Why int / int truncates and how a cast fixes it.',
            'What % does and when to reach for long.',
          ],
          question: 'Numbers are safe. How does C# combine true/false conditions, and why is there no truthiness?',
        },
      },
    },
    {
      id: 'cs-rung-booleans',
      title: 'Module 6: Booleans, Comparison, And Logic',
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
        coldOpen:
          'In a dynamic language, if (count) silently treats 0 as false and a typo as a bug. C# refuses to compile it: conditions must be real booleans. And user != null && user.Active never crashes on a null user, because && stops early. These two rules quietly delete a class of bugs. How do they work?',
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
        build: {
          simple: 'Combine conditions with and, or, not.',
          actually:
            '== and != test equality, < <= > >= compare order, each yielding a bool. && (and), || (or), ! (not) combine them. && short-circuits when the left is false and || when the left is true, so user != null && user.Active is null-safe. C# has no truthiness: conditions must be actual bools.',
          breaks:
            'Getting parentheses wrong in a permission check (active && isOwner || isAdmin vs active && (isOwner || isAdmin)) is a security bug. And relying on truthiness from another language fails to compile here, which is the point: if (count) must be if (count > 0).',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, prove short-circuiting is null-safe: evaluate user != null && user.Active with user set to null. Does it crash?',
            reveal:
              'No crash, it returns false. && stops at the first false, so user.Active never runs when user is null. This is the everyday guard against null reference exceptions.',
          },
          {
            task: 'Re-evaluate the four example lines after changing role to "user". Predict each before running.',
            reveal:
              'Line 1 becomes False (the right side fails), line 3 stays True only because active is true. Re-reading boolean lines carefully is where permission bugs are caught.',
          },
        ],
        warStory:
          'An authorization check read active && isOwner || isAdmin without parentheses. Operator precedence made it (active && isOwner) || isAdmin, so any admin flag bypassed the active check entirely, including deactivated admins. One pair of parentheses was the difference between a gate and a hole.',
        tweak: {
          instruction: 'Change role to "user" and re-evaluate all four lines before running.',
          reveal:
            'Line 1 becomes False (right side fails), line 3 stays True only because active is true. Logic bugs hide in exactly this kind of re-reading.',
        },
        receipt: {
          explain: [
            'How && and || short-circuit and why that is null-safe.',
            'Why C# requires real booleans in conditions.',
          ],
          question: 'You can evaluate a condition. How do you take different paths based on it?',
        },
      },
    },
    {
      id: 'cs-rung-if-else',
      title: 'Module 7: If, Else If, Else',
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
        coldOpen:
          'A login check tests if (subscribed) before if (banned), and a banned subscriber walks right in. Both conditions were correct; the order was the bug. In an if chain the first match wins and the rest never run, so the sequence is the logic. There is also a C# twist: a variable born inside braces dies at the closing brace.',
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
        build: {
          simple: 'if / else if / else picks a path.',
          actually:
            'The chain runs top to bottom; the first true branch wins and the rest are skipped, so order from most specific to least. Braces define scope: a variable declared inside a block does not exist outside it, so declare before the chain and assign inside. A ternary (cond ? a : b) handles simple two-way picks.',
          breaks:
            'A broad condition placed before a narrow one swallows its inputs, which in authorization is a security hole. And declaring a variable inside an if and using it after the chain fails to compile, because scope follows braces exactly.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, reorder the chain so >= 70 comes before >= 90, set score = 95, and run. What grade does a 95 get?',
            reveal:
              'B. The broad >= 70 matched first, so the A branch became unreachable. Order in an if chain is logic, not formatting.',
          },
          {
            task: 'Trigger a scope error: move string grade inside the first if block and rebuild. What fails and why?',
            reveal:
              'The build fails at Console.WriteLine(grade): grade only exists inside those braces. Declare it before the chain so it outlives each block.',
          },
        ],
        warStory:
          'A subscription gate checked the cheapest-tier condition first, and since every paying user also satisfied it, everyone was served the cheapest tier. Revenue leaked for a month. The conditions were all correct; reordering them most-specific-first fixed it in one commit.',
        tweak: {
          instruction: 'Move the string grade declaration inside the first if block and rebuild.',
          reveal:
            'The build fails at Console.WriteLine(grade) because grade only exists inside those braces. Scope follows braces exactly.',
        },
        receipt: {
          explain: [
            'Why the first matching branch wins and order matters.',
            'How brace scope governs where a variable lives.',
          ],
          question: 'You can branch on one value. How do you store and process many values at once?',
        },
      },
    },
    {
      id: 'cs-rung-collections',
      title: 'Module 8: Arrays And List<T>',
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
        coldOpen:
          'List<int> nums; nums.Add("hello"); will not even build, and that is the feature. Those angle brackets are your first meeting with generics, the thing that lets one List type hold ints, strings, or anything, with the compiler guaranteeing what is inside. So when do you reach for an array versus a List, and what does the T actually buy you?',
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
        build: {
          simple: 'Arrays and lists hold many values.',
          actually:
            'An array (int[]) is fixed-size; its count is Length. List<T> grows: Add appends, Remove deletes, Count tracks size, and it is what backend code uses to build results. The <T> is a generic type parameter the compiler enforces, so a List<int> can never hold a string. Last item: nums[nums.Count - 1] or nums[^1].',
          breaks:
            'Reading past the end throws IndexOutOfRangeException at runtime, because the compiler cannot know sizes in advance, unlike a type mismatch which fails the build. Arrays have no Add; reach for List when the size changes.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, try nums.Add("hello") on a List<int> and read the build error. Then try scores.Add(40) on an array.',
            reveal:
              'The List rejects the string at build time (generic type enforced). The array has no Add at all (fixed size). The compiler caught both before running, which is generics earning their keep.',
          },
          {
            task: 'See a runtime vs build-time error: print nums[10] on a 4-item list and run it.',
            reveal:
              'It builds fine but crashes at runtime with an out-of-range exception. Index validity depends on data the compiler cannot see, so it is a runtime error, not a build one.',
          },
        ],
        warStory:
          'A handler returned List<object> instead of List<Order>, so every caller had to cast and guess at the element type. A migration to the typed List<Order> let the compiler catch a dozen places that had been quietly mishandling the wrong shape. Generics turned runtime guesswork into build-time guarantees.',
        tweak: {
          instruction: 'Print nums[10] and run it.',
          reveal:
            'The build succeeds but the run crashes with ArgumentOutOfRangeException. Index errors are runtime errors because the compiler cannot know list sizes in advance.',
        },
        receipt: {
          explain: [
            'Array vs List<T> and what the generic parameter enforces.',
            'Why an out-of-range read is a runtime error, not a build error.',
          ],
          question: 'You can hold a list. How do you visit every item in it?',
        },
      },
    },
    {
      id: 'cs-rung-loops',
      title: 'Module 9: Loops: foreach, for, while',
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
        coldOpen:
          'Change i < 3 to i <= 3 and your loop runs one extra time. That single character is the home of the off-by-one bug, the most famous mistake in programming. C# gives you three loop shapes, and picking the right one makes the boundary obvious instead of dangerous. Which should be your default?',
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
        build: {
          simple: 'Loops repeat work.',
          actually:
            'foreach visits each item with no index (reach for it first); for gives you a counter when you need the index or a numeric range; while runs until a condition flips. The accumulator pattern (declare a total before, add inside, use after) powers summing, counting, and joining.',
          breaks:
            'The < vs <= boundary in a for loop is where off-by-one bugs cluster. A while whose body never changes its condition variable loops forever. foreach avoids both by having no manual boundary, which is why it is the default.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, run the for loop with i < 3, then i <= 3, and count the lines each prints.',
            reveal:
              '0 1 2, then 0 1 2 3. One character (< vs <=) changes the count by one. That is the entire off-by-one story, made concrete.',
          },
          {
            task: 'Write the accumulator yourself: sum a List<int> of {1,2,3,4} with foreach and print the total.',
            reveal:
              '10. Declare total before, add each item inside, read it after. Every sum, count, and join you ever write follows this shape.',
          },
        ],
        warStory:
          'A nightly batch used for (int i = 0; i <= items.Count; i++) and read items[i] one past the end on every run, throwing mid-batch and leaving jobs half-finished. One character, < instead of <=, ended weeks of 3am pages. foreach would have made the boundary impossible to get wrong.',
        tweak: {
          instruction: 'Change the for loop to start at int i = 1 and predict the printed numbers.',
          reveal: 'It prints 1 and 2. The start, the condition, and the step each independently shape the range.',
        },
        receipt: {
          explain: [
            'When to use foreach, for, and while.',
            'The accumulator pattern and where off-by-one lives.',
          ],
          question: 'Lists are ordered by position. How do you look things up by a key instead?',
        },
      },
    },
    {
      id: 'cs-rung-dictionaries',
      title: 'Module 10: Dictionary<TKey, TValue>',
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
        coldOpen:
          'Reading user["email"] for a key that is not there does not return null in C#. It throws KeyNotFoundException and crashes the request. This is a top crash for new C# developers, usually from assuming an optional field always arrives. A dictionary is basically a JSON object, so this is the same skill as handling an optional API field. What is the safe way to read?',
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
        build: {
          simple: 'A dictionary maps keys to values.',
          actually:
            'Dictionary<TKey, TValue> gives fast lookup with both types enforced. Read a present key with []. For maybe-missing keys use the safe forms: TryGetValue(key, out var v) returns a bool, or GetValueOrDefault(key, fallback). Assigning adds or overwrites; ContainsKey asks without reading. A JSON object is conceptually this.',
          breaks:
            'A [] read on a missing key throws KeyNotFoundException at runtime, a top crash from assuming an optional field is always present. TryGetValue in handlers is the habit that prevents it.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, read a missing key two ways: user["email"] (crashes) and the safe TryGetValue form. Compare.',
            command: 'if (user.TryGetValue("email", out var email)) Console.WriteLine(email); else Console.WriteLine("no email");',
            reveal:
              'The [] read throws KeyNotFoundException; TryGetValue returns false and prints "no email" without crashing. That is why TryGetValue dominates real handler code.',
          },
          {
            task: 'Predict: assigning user["role"] = "viewer" when role already exists. Does it add a second key or overwrite?',
            reveal:
              'Overwrites. Keys are unique, so assigning to an existing key replaces its value in place. Assigning a new key adds it.',
          },
        ],
        warStory:
          'A handler read request headers with headers["Authorization"], assuming it was always sent. Unauthenticated requests had no such key, so instead of a clean 401 the service threw KeyNotFoundException and returned a 500, polluting error dashboards. Switching to TryGetValue turned a crash into a correct rejection.',
        tweak: {
          instruction: 'Replace the GetValueOrDefault line with: if (user.TryGetValue("email", out var email)) Console.WriteLine(email); else Console.WriteLine("no email");',
          reveal:
            'It prints no email. TryGetValue returns false for missing keys and never throws, which is why it dominates production code.',
        },
        receipt: {
          explain: [
            'Why a [] read on a missing key crashes and what the safe forms do.',
            'Why a dictionary is the right model for a JSON object.',
          ],
          question: 'You can store and look up data. How do you package reusable behavior that acts on it?',
        },
      },
    },
    {
      id: 'cs-rung-methods',
      title: 'Module 11: Methods: Signatures And Return Types',
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
        coldOpen:
          'A C# method tells you everything in one line before you read its body: decimal CalculateTax(Order order) promises an Order in, a decimal out, and the compiler enforces both. Forget to return on some path and the build fails. That signature is the contract whole teams coordinate through. What exactly does it guarantee?',
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
        build: {
          simple: 'A method takes inputs and returns a result.',
          actually:
            'The signature (return type, name, typed parameters) is the whole contract, enforced both ways: callers cannot pass the wrong type, and the body must return the declared type on every path. void returns nothing. Parameters can have defaults and be named at the call site. One-expression methods use the => arrow form.',
          breaks:
            'Forget to return on some path and the build fails with "not all code paths return a value": the static-typing payoff in one message. A method that prints instead of returning cannot be tested or composed; logic returns, edges print.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, call Greet(42) (an int where a string is declared) and read the error.',
            reveal:
              'A compile-time type error: the parameter is string, so an int argument is rejected before running. The signature enforces the input type for every caller.',
          },
          {
            task: 'Delete the return statement from Greet and rebuild. What does the compiler say?',
            reveal:
              '"Not all code paths return a value." The return type makes forgetting to return impossible. That guarantee is what lets callers trust the output type without reading the body.',
          },
        ],
        warStory:
          'A team needed to change a tax method from returning double to decimal for exact money. Because the return type is part of the signature, the change broke the build at every one of the 30 call sites, forcing each to be reviewed. A dynamic language would have let the wrong type flow silently into invoices.',
        tweak: {
          instruction: 'Remove the return statement from Greet and rebuild.',
          reveal:
            "The compiler reports \"not all code paths return a value\". The return type makes forgetting impossible, which is the static-typing payoff in one error message.",
        },
        receipt: {
          explain: [
            'What a method signature guarantees to callers and the body.',
            'Why returning beats printing inside a method.',
          ],
          question: 'Methods are loose behavior. How do you bundle data and behavior together into a type of your own?',
        },
      },
    },
    {
      id: 'cs-rung-classes',
      title: 'Module 12: Classes, Properties, And Objects',
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
        coldOpen:
          'A teammate writes order.Total = 9999 directly and skips the method that also records the audit log and recalculates tax. Now your books are wrong. C# lets you make that line refuse to compile, so the only way to change Total is through the code you control. That is encapsulation, and it is enforced by one keyword. Which?',
        mental:
          'A class is a blueprint and instances are houses built from it: each house has its own rooms, and private set means only the house keys change the furniture.',
        diagram: {
          nodes: ['Class blueprint', 'new instance', 'Own state', 'private set'],
          explanations: [
            'The class declares the shape once: properties for data, methods for behavior.',
            'Every new Counter() builds an independent object from the blueprint.',
            'Each instance owns its values: incrementing one counter never touches another.',
            'Access modifiers guard the data: outside code can read Value yet only methods inside the class may change it.',
          ],
        },
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
        build: {
          simple: 'A class bundles data and behavior into a type.',
          actually:
            'A class is a blueprint; new makes independent instances, each with its own state. Auto-properties (public int Value { get; private set; }) declare data with controlled access. Constructors run at new time to require initial data. Encapsulation means exposing what callers need and protecting what keeps the object valid.',
          breaks:
            'Without private set, any code can corrupt an object\'s state directly, bypassing the methods that keep it consistent (and that write the audit log, recompute totals, etc.). Access modifiers are what make that line refuse to compile.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, run the Counter example, then add a.Value = 100; outside the class. What happens?',
            reveal:
              'It fails to compile: private set means only code inside Counter can write Value. That compile error IS the encapsulation working, stopping outside code from corrupting state.',
          },
          {
            task: 'Add a constructor public Counter(int start) => Value = start; then create new Counter(10), increment it, and predict the value.',
            reveal:
              '11. The constructor supplied the starting state. Adding it removes the default empty constructor, so new Counter() now requires an argument: the class enforces valid creation.',
          },
        ],
        warStory:
          'An order class exposed a public setter on Total. A new feature set it directly to apply a discount, skipping the method that also adjusted tax and logged the change. Reports drifted out of sync for weeks. Making the setter private and forcing all changes through ApplyDiscount() ended a whole category of "the numbers do not add up" bugs.',
        tweak: {
          instruction: 'Add a constructor: public Counter(int start) => Value = start; then create new Counter(10) and increment it.',
          reveal:
            'It prints 11. Constructors let the creator supply required starting state, and adding one removes the default empty constructor, so new Counter() now needs an argument.',
        },
        receipt: {
          explain: [
            'The difference between a class and an instance, and what a constructor does.',
            'What private set protects and why encapsulation matters.',
          ],
          question: 'You can model data as objects. How do you filter and transform collections of them in one readable line?',
        },
      },
    },
    {
      id: 'cs-rung-linq',
      title: 'Module 13: LINQ: Where, Select, Count',
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
        'LINQ is also the API of Entity Framework Core: the same Where and Select compile into SQL when pointed at a database table. Learning it on lists transfers directly to database queries, which is why this module matters more than any other for backend job-readiness.',
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
        coldOpen:
          'You already learned filter, map, and reduce in JavaScript. C# calls them Where, Select, and Aggregate, and here is the wild part: the exact same chain, pointed at a database, compiles to SQL. Learn LINQ and you are writing queries against lists and against Postgres with one syntax. What does each station do?',
        mental:
          'LINQ is the conveyor belt with named stations: Where inspects and discards, Select reshapes, ToList boxes up the result.',
        diagram: {
          nodes: ['Collection', 'Where', 'Select', 'ToList'],
          explanations: [
            'Any list or sequence enters the belt; the original is never modified.',
            'The Where station tests each item with a lambda and drops the failures.',
            'The Select station reshapes each survivor: from a user to just its email.',
            'ToList runs the belt and boxes the results into a real list. Pointed at a database, the same chain compiles to SQL.',
          ],
        },
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
        build: {
          simple: 'LINQ queries a collection.',
          actually:
            'Where filters (keep items where the lambda is true), Select transforms each item, Count/Any/First answer questions, and ToList runs the chain into a real list. They compose left to right: filter, then reshape. Pointed at a database via Entity Framework, the same chain translates to SQL.',
          breaks:
            'First throws InvalidOperationException when nothing matches; FirstOrDefault returns the type default (0, null) instead. And forgetting ToList leaves a lazy query that re-runs every time you enumerate it.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, chain filter-then-transform in one line: nums.Where(n => n % 2 == 0).Select(n => n * 10).ToList() and print it.',
            reveal:
              '20, 40, 60. Chains read left to right: Where filters, Select reshapes the survivors. This exact shape is most of what backend data code looks like.',
          },
          {
            task: 'Predict the crash: what does nums.First(n => n > 100) do on a list maxing at 6, and what is the safe alternative?',
            reveal:
              'It throws InvalidOperationException because nothing matches. FirstOrDefault returns the type default (0 for int) instead. Reach for the OrDefault variants when "no match" is a normal case.',
          },
        ],
        warStory:
          'A report used orders.First(o => o.Status == "refunded") assuming there was always one. On a quiet day with no refunds it threw and 500ed the dashboard. Switching to FirstOrDefault and handling the null turned a crash into an empty-state message. The same LINQ later ran unchanged against the database via Entity Framework.',
        tweak: {
          instruction: 'Chain it all in one line: nums.Where(n => n % 2 == 0).Select(n => n * 10).ToList() and print it.',
          reveal:
            'It prints 20, 40, 60. Chains read left to right: filter first, then transform the survivors. This shape is most of what backend data code looks like.',
        },
        receipt: {
          explain: [
            'What Where, Select, and the OrDefault variants do.',
            'Why the same LINQ chain works on lists and databases.',
          ],
          question: 'Code can fail mid-operation. How does C# signal and handle errors?',
        },
      },
    },
    {
      id: 'cs-rung-exceptions',
      title: 'Module 14: Exceptions And try / catch',
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
        coldOpen:
          'The most tempting line in error handling is catch (Exception) { }: it makes the red go away. It also swallows every real bug, throws away the stack trace, and ships silently wrong behavior that someone debugs for days. Catching errors well is a discipline. When should you catch, and when should you let it fly?',
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
        build: {
          simple: 'try/catch handles errors.',
          actually:
            'Code that fails throws an exception; try runs the risky code, catch handles a specific type and can recover with a fallback. The exception object carries a message and a stack trace your logs depend on. Catch narrowly (the exception you expect) and let everything else propagate.',
          breaks:
            'catch (Exception) { } swallows every failure, including real bugs, and discards the stack trace, so wrong behavior ships silently. Catch the specific type you can handle; an unexpected exception should crash loudly where you can see it.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, run SafeDivide(10, 0), then delete the try/catch and run again. Compare the two outcomes.',
            reveal:
              'With the catch it returns the fallback 0; without it, 10/0 throws DivideByZeroException and terminates with a stack trace. The catch turned a crash into a handled, recoverable case.',
          },
          {
            task: 'Make the error visible: change the catch to catch (DivideByZeroException ex) and print ex.Message before returning.',
            reveal:
              'It prints "Attempted to divide by zero." before the fallback. The exception object carries the message and stack trace, which is exactly what you log instead of swallowing.',
          },
        ],
        warStory:
          'A service wrapped its whole request handler in catch (Exception) { return Ok(); }. Every failure (database down, null bug, bad input) returned 200 OK with empty data. Monitoring saw all green while customers saw blank pages for two days. Removing the blanket catch surfaced the real errors immediately.',
        tweak: {
          instruction: 'Change the catch to catch (DivideByZeroException ex) and print ex.Message before returning.',
          reveal:
            'It prints "Attempted to divide by zero." before the fallback. The exception object carries the message and the stack trace your logs depend on.',
        },
        receipt: {
          explain: [
            'How try/catch recovers from a specific exception.',
            'Why catching everything silently is dangerous.',
          ],
          question: 'You know every C# building block. Can you combine them into one real program that turns records into a summary?',
        },
      },
    },
    {
      id: 'cs-rung-capstone',
      title: 'Module 15: Capstone: Records To Summary (0 to 1)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 18,
      prompt:
        'Put everything together: model records, filter with LINQ, and build a summary, the exact shape of real backend work.',
      explanation: `This is the payoff module. The program below is a miniature of what a real API endpoint does: take typed records, keep the relevant ones, shape a response.

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
        coldOpen:
          'Here is a real .NET list endpoint: model typed records, keep the relevant ones, shape a response. It uses every module you just finished, and one extra superpower: record User(string Name, bool Active) declares an entire immutable data type in a single line. Swap the list for a database table and this is production code. When you can edit it confidently, you are at 1 in C#.',
        mental:
          'Records in, pipeline through, summary out: the assembly line, now with the compiler guarding every station.',
        diagram: {
          nodes: ['record type', 'List of records', 'Where + Select', 'Summary'],
          explanations: [
            'One line declares the data shape, and the compiler enforces it everywhere.',
            'The list stands in for rows from a database, every element guaranteed to be a User.',
            'The pipeline filters by the business rule and projects the needed field, type-checked end to end.',
            'The output is the response shape. Swap the list for a table and this is an Entity Framework query.',
          ],
        },
        intro: 'Everything from modules 1 through 14 appears in this one program.',
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
        build: {
          simple: 'Combine records and LINQ into a real program.',
          actually:
            'A positional record (record User(string Name, bool Active)) declares an immutable data type with constructor, properties, value equality, and ToString for free, the shape of production DTOs. A List<User> stands in for database rows; Where filters by the business rule, Select projects the response shape, all type-checked end to end.',
          breaks:
            'The business rule lives in the Where lambda; one ! flips it. Confusing the filter (which records) with the projection (which fields) is where these pipelines go wrong. Swap the list for a table and Entity Framework runs the same LINQ as SQL.',
        },
        doThisNow: [
          {
            task: 'On dotnetfiddle.net, run the full endpoint, then flip the filter to !u.Active and rerun. Predict both lines first.',
            reveal:
              'Active: 1, then Sam. One character rewrote the entire business rule, and the types kept everything else intact. That is the power of separating the rule (Where) from the shape (Select).',
          },
          {
            task: 'Name what the one-line record gives you that a hand-written class would need many lines for.',
            reveal:
              'Constructor, get-only properties, value equality, and a readable ToString, all generated. Records are why C# DTOs are one line instead of twenty of boilerplate.',
          },
        ],
        warStory:
          'A new .NET hire shipped their first endpoint on day two: a record DTO, a Where filter on the active flag, a Select to public fields, returned as JSON. Code review had nothing to add, because it was the exact skeleton from this lesson. Recognizing that pattern is what "0 to 1" actually means.',
        tweak: {
          instruction: 'Flip the filter to !u.Active and predict both printed lines.',
          reveal: 'Active: 1 and then Sam. One character changed the business rule, and the types kept everything else intact.',
        },
        receipt: {
          explain: [
            'What a positional record generates for free.',
            'How records plus LINQ compose into a list endpoint.',
          ],
          question: 'You can write C#. What framework turns this into an actual web API, and what else is in the .NET ecosystem?',
        },
      },
    },
    {
      id: 'cs-rung-aspnet',
      title: 'Module 16: Where This Goes: ASP.NET Core And The Ecosystem',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 16,
      prompt:
        'See how the C# you just learned becomes a real web API, and map the .NET ecosystem you will meet next.',
      explanation: `Here is the bridge from console programs to the day job. A minimal ASP.NET Core API is a few lines, and every line uses concepts you now know.

**The minimal API.** WebApplication.CreateBuilder configures the app. MapGet("/health", () => ...) attaches a lambda to a URL: the same lambda syntax from LINQ, returning an object that the framework serializes to JSON automatically. app.Run() starts Kestrel, the built-in production web server, listening for HTTP requests.

**What the framework does per request.** Parses HTTP, matches the route, binds parameters into typed method arguments, runs your lambda or handler, serializes the return value to JSON, writes the response. Your code stays small because the platform owns the plumbing.

**The ecosystem map.** NuGet is the package manager (the npm or pip of .NET). Entity Framework Core talks to databases using the LINQ you learned on lists. xUnit writes tests. Serilog structures logs. Docker images for ASP.NET are first-class and most production deployments run on Linux containers.

**Your route from here.** Console fluency (modules 1 to 15), then a minimal API with two or three routes, then EF Core against SQLite, then auth and deployment. Each step reuses everything below it.`,
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
        coldOpen:
          'Five lines of C# is a complete, production-grade web server: route a URL, return an object, and the framework turns it into JSON and serves it on Kestrel. Every line uses something you already learned (lambdas, types, records). This is the bridge from console exercises to the actual day job. What does each line do?',
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
        build: {
          simple: 'ASP.NET Core turns your C# into a web API.',
          actually:
            'WebApplication.CreateBuilder configures the app, MapGet("/path", lambda) binds a URL to a handler (the same lambda syntax as LINQ), the framework serializes the returned object to JSON automatically, and app.Run() starts Kestrel, the production web server. Per request it parses HTTP, matches the route, binds typed parameters, runs your handler, and writes the response.',
          breaks:
            'The platform owns the plumbing, so handlers stay small; routes are added one MapGet/MapPost line at a time. The ecosystem: NuGet (packages), Entity Framework Core (database via LINQ), xUnit (tests), usually deployed in Linux Docker containers.',
        },
        doThisNow: [
          {
            task: 'When you have .NET locally: dotnet new web, paste the health route, dotnet run, then open http://localhost:5000/health.',
            command: 'dotnet new web && dotnet run',
            reveal:
              'The browser shows {"ok":true,"service":"api"}. You returned a plain object; the framework serialized it to JSON and served it over HTTP. That is a real web service in five lines.',
          },
          {
            task: 'Add a second route with a typed path parameter: app.MapGet("/greet/{name}", (string name) => $"Hello, {name}!"); then call /greet/Kay.',
            reveal:
              'Returns Hello, Kay!. The {name} segment binds into the typed string parameter automatically. Typed parameter binding is modules 3 and 11 doing web work.',
          },
        ],
        warStory:
          'A team coming from heavyweight frameworks expected hundreds of lines of config to stand up an API. Their first ASP.NET Core service was a 20-line Program.cs with three routes, deployed in a Linux container the same afternoon. The minimal API model is why "C# is enterprise-only and slow to start" is a decade out of date.',
        tweak: {
          instruction: 'Add: app.MapGet("/greet/{name}", (string name) => $"Hello, {name}!"); and call /greet/Kay.',
          reveal:
            'It returns Hello, Kay!. The {name} route segment binds into the typed string parameter automatically. Typed parameter binding is modules 3 and 11 doing web work.',
        },
        receipt: {
          explain: [
            'What each line of a minimal API does and who serializes the JSON.',
            'The roles of NuGet, EF Core, and Kestrel in the .NET ecosystem.',
          ],
          command: 'dotnet new web && dotnet run',
          question: 'You can build a .NET API. Which cloud will you deploy it to, and what services will it use?',
        },
      },
    },
  ],
}
