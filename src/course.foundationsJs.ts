import type { Problem } from './course'

// JavaScript from absolute zero: a module sequence where every lesson shows real
// code with verified output, asks for predictions, embeds a runnable drill,
// and closes with a Lock It In recap. Outputs verified with Node.

export const jsFoundations: Problem[] = [
  {
    id: 'js-rung-print',
    title: 'Module 1: Run JavaScript And Print',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 8,
    prompt: 'Write your first JavaScript: print text and numbers and read the output.',
    explanation: `JavaScript started as the browser language and now runs servers through Node.js. Everything in this course works in both places.

A program is a list of statements that run top to bottom. console.log shows a value so you can see what your code did. Text lives inside quotes; numbers stand alone. This write, run, read loop is the whole rhythm of programming, and you are about to do it for the first time.`,
    production:
      'console.log is also the simplest debugging tool you will ever use. Production code replaces it with structured loggers, but the habit of printing a value to confirm what the code actually sees starts here and never stops being useful.',
    walkthrough: [
      'Put text inside quotes: "hello".',
      'Numbers need no quotes: 2 + 2 is math.',
      'Run a file with: node app.js.',
      'Read output line by line, matching each line to the statement that printed it.',
    ],
    questions: [
      'What does console.log do?',
      'Why does "2" + "2" behave differently from 2 + 2?',
    ],
    checklist: [
      'Print text and numbers with console.log.',
      'Explain the difference between "2" and 2.',
      'Run a JavaScript file or snippet end to end.',
    ],
    interactive: {
      coldOpen:
        'console.log("2" + "2") does not print 4. It prints 22. Before you write a line of backend code, you need to feel why, because that one quirk is behind a surprising number of real bugs. Let us run it and see.',
      intro: 'The loop you will repeat forever: write a line, run it, read what came back.',
      example: {
        code: 'console.log("Hello, world!");\nconsole.log(2 + 2);',
        output: 'Hello, world!\n4',
        explain:
          'Line 1 prints the text between quotes. Line 2 does the math first and prints the result 4.',
      },
      predicts: [
        {
          question: 'What does console.log(2 + 2) show?',
          options: ['4', '2 + 2', '22'],
          correct: 0,
          why: 'Without quotes, 2 + 2 is arithmetic, so the printed value is 4.',
        },
        {
          question: 'What does console.log("2" + "2") show?',
          options: ['4', '22', 'an error'],
          correct: 1,
          why: 'Quotes make text, and + joins text end to end, producing 22.',
        },
      ],
      build: {
        simple: 'console.log prints things, and + adds.',
        actually:
          'Programs run top to bottom, one statement at a time. + does math on numbers but joins strings end to end, so the quotes around a value decide whether + adds or concatenates.',
        breaks:
          'Numbers arriving as text (from a form, a URL, JSON) make + silently concatenate instead of add. "2" + "2" is "22", and a total quietly becomes nonsense with no error.',
      },
      doThisNow: [
        {
          task: 'Run both versions back to back in your terminal and watch + change behavior with quotes.',
          command: 'node -e \'console.log(2 + 2); console.log("2" + "2")\'',
          reveal:
            'First line prints 4 (math on numbers); second prints 22 (text joined). Same operator, opposite jobs, decided entirely by the quotes.',
        },
        {
          task: 'Make it print your own name with a greeting, using + to join two strings.',
          command: 'node -e \'console.log("Hi, " + "your-name")\'',
          reveal:
            'You get Hi, your-name. + on two strings joins them; the quotes mark where each piece of text begins and ends.',
        },
      ],
      warStory:
        'A checkout once added a shipping fee to an item price and charged customers wildly wrong totals. Both values had arrived as strings from the form, so + concatenated: "10" + "5" became "105" dollars. One missing conversion, no error, real refunds.',
      tweak: {
        instruction: 'Change the text to your own name and run it again.',
        reveal: 'console.log prints whatever is between the quotes. The quotes only mark where text starts and ends.',
      },
      receipt: {
        explain: [
          'Programs run top to bottom and console.log shows a value.',
          'Why + adds numbers but joins strings.',
        ],
        command: 'node -e \'console.log("2" + "2")\'',
        question: 'Quotes changed everything. How do you ask JavaScript what type a value really is?',
      },
      writeDrillId: 'js-zero-hello',
      recap: [
        'Programs run top to bottom, one statement at a time.',
        'console.log shows you a value.',
        'Quotes make text; no quotes makes numbers and math.',
      ],
    },
  },
  {
    id: 'js-rung-types',
    title: 'Module 2: Values And typeof',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 9,
    prompt: 'Meet the everyday JavaScript types: number, string, boolean, and the typeof operator.',
    explanation: `Every value has a type, and the type decides what the value can do.

**number.** All numbers share one type: 42 and 3.14 are both number. There is no separate integer type.

**string.** Text in quotes. "42" looks like a number but the quotes make it text.

**boolean.** Exactly true or false, written lowercase.

**typeof.** An operator that names the type of any value: typeof 42 gives "number". When code misbehaves, typeof is how you check what you actually have, because JavaScript will quietly mix types in ways that surprise beginners.`,
    production:
      'Type confusion is the classic JavaScript bug: an id arrives as the string "42" from a URL, gets compared to the number 42, and the check fails silently. Backend code converts and verifies types at the boundary, and typeof is the inspection tool.',
    walkthrough: [
      'Print typeof for a number, a string, and a boolean.',
      'Note that "42" is a string because of the quotes.',
      'Remember there is one number type for integers and decimals.',
    ],
    questions: [
      'What is typeof "42"?',
      'Why does JavaScript have one number type?',
    ],
    checklist: [
      'Name the three everyday primitive types.',
      'Use typeof to inspect a value.',
      'Spot a number wearing string quotes.',
    ],
    interactive: {
      coldOpen:
        'typeof null returns "object". That is wrong, everyone agrees it is wrong, and it has shipped in every JavaScript engine for almost thirty years because fixing it would break the web. Bugs hide in gaps like this, so the move is to inspect types, not assume them.',
      example: {
        code: 'console.log(typeof 42);\nconsole.log(typeof "42");\nconsole.log(typeof true);',
        output: 'number\nstring\nboolean',
        explain: 'typeof names each type. The quotes around "42" are what make it a string.',
      },
      predicts: [
        {
          question: 'What is typeof "hello"?',
          options: ['text', 'string', 'word'],
          correct: 1,
          why: 'JavaScript calls text values strings, so typeof reports "string".',
        },
        {
          question: 'What is typeof 3.14?',
          options: ['float', 'double', 'number'],
          correct: 2,
          why: 'JavaScript has a single number type covering integers and decimals.',
        },
      ],
      build: {
        simple: 'Every value has a type.',
        actually:
          'The everyday types are number (one type for integers and decimals), string (text in quotes), and boolean (true/false). typeof names the type of any value, which is how you inspect what you really have.',
        breaks:
          'An id arrives as the string "42" from a URL and gets compared to the number 42; the check fails silently. typeof at the boundary catches this before the bug does.',
      },
      doThisNow: [
        {
          task: 'Inspect three values with typeof, then check the famous wrong one: typeof null.',
          command: 'node -e \'console.log(typeof 42, typeof "42", typeof null)\'',
          reveal:
            'number, string, object. The last is the historical bug: null is not an object, but typeof says so. Remember it, because it bites code that checks typeof x === "object".',
        },
        {
          task: 'Prove the string-vs-number trap: compare typeof of an id from a URL to a real number.',
          command: 'node -e \'const id="42"; console.log(typeof id, id === 42)\'',
          reveal:
            'string, false. The id is text, so strict comparison to the number 42 is false. This is the single most common type bug in request handling.',
        },
      ],
      warStory:
        'An API treated a product id from the query string as a number without converting it. Every lookup compared "42" === 42, always false, so valid products returned 404. typeof on the value would have shown the string in seconds.',
      tweak: {
        instruction: 'Print typeof undefined and typeof null and look closely at the second one.',
        reveal:
          'typeof undefined is "undefined", but typeof null is "object". That second result is a famous historical bug kept for compatibility, and it is worth remembering.',
      },
      receipt: {
        explain: [
          'The three everyday types and the one-number-type rule.',
          'How typeof reveals a number wearing string quotes.',
        ],
        command: 'node -e \'console.log(typeof "42")\'',
        question: 'You can see a value\'s type. How do you give that value a name you can reuse?',
      },
      recap: [
        'Three everyday types: number, string, boolean.',
        'typeof tells you what a value is.',
        '"42" with quotes is a string even though it looks numeric.',
      ],
    },
  },
  {
    id: 'js-rung-variables',
    title: 'Module 3: Variables: const And let',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 10,
    prompt: 'Bind names to values with const and let, and learn which to reach for first.',
    explanation: `A variable is a name pointing at a value. JavaScript gives you two declaration keywords with one rule between them.

**const.** The name cannot be reassigned. Use it by default; most values in real code never need to change, and const tells every reader so.

**let.** The name can be reassigned, for counters and accumulators. In count = count + 1, the right side computes first using the old value, then the result is stored back.

**Reading order.** Declarations read as: make a name, point it at this value. Reassignment repoints an existing name. The old value is simply no longer referenced.

You may also meet var in old code. It predates const and let and has looser scoping rules; new code does not use it.`,
    production:
      'const-by-default is a team convention with teeth: a reviewer who sees let knows the value changes somewhere and reads more carefully. Accidental reassignment bugs disappear when const throws the moment someone tries.',
    walkthrough: [
      'Declare with const first; switch to let only when reassignment is needed.',
      'Trace count = count + 1 in two steps: compute right side, store result.',
      'Try reassigning a const and read the error message.',
    ],
    questions: [
      'When do you need let instead of const?',
      'What happens when you reassign a const?',
    ],
    checklist: [
      'Declare values with const and let.',
      'Trace a reassignment step by step.',
      'Explain why const is the default.',
    ],
    interactive: {
      coldOpen:
        'Two keywords declare a variable, and which one you reach for is a message to every future reader. One of them makes a whole class of bug impossible by refusing to compile when you slip. Which should be your default, and why does the other one make reviewers slow down?',
      example: {
        code: 'const name = "Kay";\nlet count = 1;\ncount = count + 1;\nconsole.log(name, count);',
        output: 'Kay 2',
        explain:
          'count starts at 1. The right side computes 2 using the old value, then 2 is stored back. name stays const and never changes.',
      },
      predicts: [
        {
          question: 'After count = count + 1, what is count?',
          options: ['1', '2', 'count + 1'],
          correct: 1,
          why: 'The right side runs first: 1 + 1 is 2, then 2 is stored in count.',
        },
        {
          question: 'What does name = "Sam" do when name was declared with const?',
          options: ['renames it', 'throws a TypeError', 'creates a second name'],
          correct: 1,
          why: 'const blocks reassignment. The runtime throws "Assignment to constant variable" the moment the line runs.',
        },
      ],
      build: {
        simple: 'A variable is a name for a value.',
        actually:
          'const names a value that never gets reassigned; let names one that does. Reassignment computes the right side first using the old value, then stores the result. Use const by default so most names are guaranteed stable.',
        breaks:
          'Accidental reassignment bugs vanish when const throws the instant someone tries. Reach for let only when a value genuinely changes (counters, accumulators); a let signals "this moves, read carefully."',
      },
      doThisNow: [
        {
          task: 'Trigger const protecting you: try to reassign a const and read the exact error.',
          command: 'node -e \'const name="Kay"; name="Sam"; console.log(name)\'',
          reveal:
            'TypeError: Assignment to constant variable. That error is const doing its job, catching a mistake at the moment it happens instead of letting a wrong value flow downstream.',
        },
        {
          task: 'Now trace a counter: run the let example and confirm count ends at 2.',
          command: 'node -e \'let count=1; count=count+1; console.log(count)\'',
          reveal:
            'Prints 2. The right side (1 + 1) computes with the old value first, then the result is stored back into count. That is every accumulator you will ever write.',
        },
      ],
      warStory:
        'A config object was declared with let and accidentally reassigned in a far-off branch, wiping every setting under certain inputs. Switching it to const turned a silent production misconfiguration into an immediate, obvious error at the offending line.',
      tweak: {
        instruction: 'Add name = "Sam"; before the console.log and run it.',
        reveal:
          'TypeError: Assignment to constant variable. That error is const doing its job: the declaration promised this name never moves.',
      },
      receipt: {
        explain: [
          'Why const is the default and let is the exception.',
          'How a reassignment evaluates and stores.',
        ],
        command: 'node -e \'const x=1; x=2\'',
        question: 'You can name values. How do you build and reshape text, the thing backends handle most?',
      },
      writeDrillId: 'js-zero-variables',
      recap: [
        'A variable is a name pointing at a value.',
        'const by default; let only when the value must change.',
        'Reassignment computes the right side first, then stores.',
      ],
    },
  },
  {
    id: 'js-rung-strings',
    title: 'Module 4: Strings And Template Literals',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 11,
    prompt: 'Work with text: template literals, indexing, length, and the everyday string methods.',
    explanation: `Backend JavaScript spends most of its life handling text: request fields, JSON keys, log lines.

**Template literals.** Backticks with embedded expressions: \`Hello, \${name}!\`. This is the modern way to build text, replacing chains of + concatenation.

**Length and indexing.** text.length counts characters (a property, no parentheses). text[0] reads the first character, counting from zero.

**Methods return new strings.** toUpperCase, toLowerCase, trim, replace, and split all leave the original untouched and hand back a new value. If you want the result, assign it.

**Questions about text.** includes, startsWith, and endsWith return booleans, which makes them the building blocks of validation.`,
    production:
      'Normalizing input is daily work: trim whitespace, lowercase the email, check a prefix before routing. The bug to watch for is calling a method and discarding the result, because strings never change in place.',
    walkthrough: [
      'Build a sentence with a template literal instead of +.',
      'Read one character with [0] and the count with .length.',
      'Chain methods: " Ada ".trim().toUpperCase() runs left to right.',
      'Get a boolean answer with includes.',
    ],
    questions: [
      'What can go inside the braces of a template literal?',
      'Why does text.toUpperCase() leave text unchanged?',
    ],
    checklist: [
      'Build a string with a template literal.',
      'Use length, indexing, and two string methods.',
      'Explain string immutability.',
    ],
    interactive: {
      coldOpen:
        'You call email.trim() to clean up a signup, save the user, and the leading spaces are still there. The method ran. The result was thrown away. Strings in JavaScript never change in place, and forgetting that quietly ships dirty data. Let us see it happen.',
      example: {
        code: 'const first = "ada";\nconsole.log(first.toUpperCase());\nconsole.log(`Hello, ${first}!`);\nconsole.log(first[0]);\nconsole.log(first.length);',
        output: 'ADA\nHello, ada!\na\n3',
        explain:
          'toUpperCase returns a capitalized copy while first stays "ada", which is why the template line still prints lowercase. [0] reads the first character and length counts 3.',
      },
      predicts: [
        {
          question: 'After first.toUpperCase() runs, what does first hold?',
          options: ['"ADA"', '"ada"', 'undefined'],
          correct: 1,
          why: 'String methods return new strings. The original is immutable and never changes.',
        },
        {
          question: 'What does `${2 + 3} items` produce?',
          options: ['"2 + 3 items"', '"5 items"', 'an error'],
          correct: 1,
          why: 'The braces run any expression and splice the result into the text.',
        },
      ],
      build: {
        simple: 'You build and tidy text with string methods.',
        actually:
          'Template literals (`Hello, ${name}!`) build text with embedded expressions. length and [0] read it. Methods like trim, toUpperCase, and replace return a NEW string and leave the original untouched, so you must use the return value.',
        breaks:
          'Calling a method and discarding its result is the everyday bug: email.trim() alone does nothing; you need email = email.trim(). Strings are immutable, so "in place" edits silently no-op.',
      },
      doThisNow: [
        {
          task: 'Prove immutability: run trim() without capturing it, then with. Watch the difference.',
          command: 'node -e \'let e="  a@b.com  "; e.trim(); console.log("["+e+"]"); e=e.trim(); console.log("["+e+"]")\'',
          reveal:
            'The first log still shows the spaces; the method returned a clean copy you ignored. The second log is trimmed because you stored the result. Always assign what a string method returns.',
        },
        {
          task: 'Build a greeting with a template literal that calls a method inside the braces.',
          command: 'node -e \'const n="ada"; console.log(`Hello, ${n.toUpperCase()}!`)\'',
          reveal:
            'Prints Hello, ADA!. Template braces accept any expression, including method calls, which is why they replaced long chains of + concatenation.',
        },
      ],
      warStory:
        'A signup normalized emails with email.toLowerCase() but forgot to assign it back. Users who typed Kay@Site.com and kay@site.com became two separate accounts, and "email already exists" checks missed the duplicate. One missing assignment, two months of confused support tickets.',
      tweak: {
        instruction: 'Change the template to `Hello, ${first.toUpperCase()}!` and predict before running.',
        reveal: 'It prints Hello, ADA!. Template braces accept full expressions, including method calls.',
      },
      receipt: {
        explain: [
          'How template literals embed expressions in text.',
          'Why string methods return a new value and the original never changes.',
        ],
        command: 'node -e \'let s=" a "; console.log("["+s.trim()+"]")\'',
        question: 'Text is handled. Why does adding two numbers from a form sometimes give you the wrong total?',
      },
      writeDrillId: 'jsf-shout',
      recap: [
        'Template literals build text: `Hello, ${name}!`.',
        'Strings are immutable; methods return new strings.',
        'includes, startsWith, endsWith answer questions as booleans.',
      ],
    },
  },
  {
    id: 'js-rung-numbers',
    title: 'Module 5: Numbers And The Coercion Trap',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 11,
    prompt: 'Do math safely and learn the famous trap: + with a string glues instead of adding.',
    explanation: `JavaScript math is straightforward right up until a string gets involved.

**The operators.** + - * / and % behave as expected on numbers. Division keeps decimals: 7 / 2 is 3.5, with no integer truncation.

**The coercion trap.** When either side of + is a string, JavaScript converts the other side and concatenates: 2 + "2" is "22". This single rule causes more beginner bugs than any other, because form inputs, URL parameters, and JSON fields often arrive as strings.

**The fix.** Convert deliberately before doing math: Number("2") gives 2, and parseInt("42", 10) parses integers from text. Convert at the boundary, then trust your numbers everywhere after.

**NaN.** Converting nonsense produces NaN (Not a Number), which silently poisons every calculation it touches. Number.isNaN(x) detects it.`,
    production:
      'The string "2" + 2 bug ships to production constantly: a quantity from a form gets concatenated instead of added and an order total becomes 1010 instead of 12. Defensive teams convert and validate numbers the moment they enter the system.',
    walkthrough: [
      'Confirm 7 / 2 is 3.5; JavaScript division keeps decimals.',
      'Trigger the trap on purpose: 2 + "2".',
      'Fix it with Number() before adding.',
      'Produce NaN once with Number("abc") so you recognize it later.',
    ],
    questions: [
      'Why is 2 + "2" equal to "22"?',
      'Where do string-numbers come from in real systems?',
      'What does NaN do to later math?',
    ],
    checklist: [
      'Use the five arithmetic operators.',
      'Demonstrate and fix the string + number trap.',
      'Detect NaN with Number.isNaN.',
    ],
    interactive: {
      coldOpen:
        'An order for 2 items at quantity 2 charges the customer for 22. No exception, no warning, just a wrong number on a real invoice. The values came from a form as text, and one operator behaved differently than you assumed. This trap ships to production more than any other in JavaScript.',
      mental:
        'The + operator is a chameleon: between numbers it adds, anywhere near a string it glues.',
      diagram: {
        nodes: ['number + number', 'string near +', 'Number() converts', 'NaN poisons'],
        explanations: [
          'Pure arithmetic: 7 + 3 is 10, and division keeps decimals.',
          'One string operand flips + into concatenation: 2 + "2" is "22". Form inputs and URL params arrive as strings, so this trap is everywhere.',
          'Convert deliberately at the boundary: Number("2") is 2, then math is safe everywhere after.',
          'Converting nonsense yields NaN, which silently corrupts every later calculation. Number.isNaN detects it.',
        ],
      },
      example: {
        code: 'console.log(7 + 3);\nconsole.log(7 / 2);\nconsole.log(7 % 2);\nconsole.log(2 + "2");\nconsole.log(Number("2") + 2);',
        output: '10\n3.5\n1\n22\n4',
        explain:
          'Division keeps the decimal: 3.5. Line 4 is the trap: a string on either side of + means concatenation, so you get "22". Number("2") converts first, restoring real addition.',
      },
      predicts: [
        {
          question: 'What does "10" + 5 produce?',
          options: ['15', '"105"', 'an error'],
          correct: 1,
          why: 'One string operand turns + into concatenation: "10" glued to "5" is "105".',
        },
        {
          question: 'What does 7 / 2 give in JavaScript?',
          options: ['3', '3.5', '4'],
          correct: 1,
          why: 'JavaScript division always keeps decimals. There is no integer division operator.',
        },
      ],
      build: {
        simple: 'Numbers do math with the usual operators.',
        actually:
          'Division keeps decimals (7 / 2 is 3.5) and % gives the remainder. But + concatenates if either side is a string, so convert text to numbers at the boundary with Number() or parseInt before doing math, then trust them everywhere after.',
        breaks:
          'Form, URL, and JSON values arrive as strings, so 2 + "2" is "22". And converting nonsense yields NaN, which silently poisons every later calculation; Number.isNaN(x) is how you catch it.',
      },
      doThisNow: [
        {
          task: 'Run the trap and the fix side by side. Watch Number() restore real addition.',
          command: 'node -e \'console.log(2 + "2"); console.log(Number("2") + 2)\'',
          reveal:
            'First prints "22" (string glued), second prints 4 (converted, then added). Converting at the boundary is the entire defense against the most common JS number bug.',
        },
        {
          task: 'Make NaN on purpose and watch it spread, so you recognize it in the wild.',
          command: 'node -e \'console.log(Number("abc")); console.log(Number("abc") + 1)\'',
          reveal:
            'Both print NaN. Once NaN enters a calculation everything downstream becomes NaN, which is why you validate conversions before trusting the result.',
        },
      ],
      warStory:
        'A donations page added a tip to a base amount, both pulled from form fields as strings. "50" + "5" became "505", so a $55 donation was logged as $505. The fix was one Number() at the boundary; the lesson was to never trust the type of incoming data.',
      tweak: {
        instruction: 'Print Number("abc") and then Number("abc") + 1.',
        reveal:
          'Both print NaN. Once NaN enters a calculation, everything downstream becomes NaN, which is why you validate conversions at the boundary.',
      },
      receipt: {
        explain: [
          'Why a string near + concatenates instead of adding.',
          'How to convert safely and detect NaN.',
        ],
        command: 'node -e \'console.log(Number("2") + 2)\'',
        question: 'Math is safe now. Why do experienced developers refuse to use == and always reach for ===?',
      },
      writeDrillId: 'js-zero-total-cost',
      recap: [
        'Division keeps decimals: 7 / 2 is 3.5.',
        'A string near + means gluing: 2 + "2" is "22".',
        'Convert with Number() at the boundary, then do math.',
      ],
    },
  },
  {
    id: 'js-rung-booleans',
    title: 'Module 6: Comparisons: Always ===',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 10,
    prompt: 'Compare values with === and combine conditions with &&, ||, and !.',
    explanation: `JavaScript has two equality operators, and the difference is a core professional habit.

**=== strict equality.** Compares value and type. "5" === 5 is false because a string is never strictly equal to a number. This is the one to use, always.

**== loose equality.** Converts types before comparing, so "5" == 5 is true. The conversion rules are long and surprising, which makes == a bug generator. Professional codebases ban it with a lint rule.

**Logic.** && is AND, || is OR, ! flips. Both && and || short-circuit: they stop evaluating as soon as the answer is decided, which makes patterns like user && user.active safe when user might be missing.

**Truthiness.** In a condition, JavaScript treats 0, "", null, undefined, and NaN as false and almost everything else as true. Handy and dangerous: a quantity of 0 is falsy even when it is a legitimate value.`,
    production:
      'The id arrives as "42" from the URL and the record id is 42. With == the check passes by accident and hides the type bug; with === it fails loudly in development where you can fix it. Loud and early beats quiet and late.',
    walkthrough: [
      'Compare "5" and 5 with both operators and study the difference.',
      'Combine two checks with && and with ||.',
      'Lean on short-circuiting: cheap or null-safe checks go on the left.',
      'List the falsy values from memory: 0, "", null, undefined, NaN.',
    ],
    questions: [
      'Why do teams ban ==?',
      'When does && skip its right side?',
      'Which legitimate values are falsy?',
    ],
    checklist: [
      'Use === and !== for every comparison.',
      'Explain short-circuit evaluation.',
      'Name the falsy values.',
    ],
    interactive: {
      coldOpen:
        '0 == false is true. "" == false is true. null == undefined is true. JavaScript has a second equality operator that quietly converts types before comparing, and its rules are a minefield. Professional teams ban it outright with a lint rule. What do they use instead, and why is "failing loudly" the goal?',
      example: {
        code: 'console.log("5" == 5);\nconsole.log("5" === 5);\n\nconst active = true;\nconst role = "admin";\nconsole.log(active && role === "admin");\nconsole.log(!active);',
        output: 'true\nfalse\ntrue\nfalse',
        explain:
          'Loose == converts the string and says true. Strict === sees different types and says false. The && line needs both sides true, and ! flips.',
      },
      predicts: [
        {
          question: 'What is 0 == false?',
          options: ['true', 'false', 'an error'],
          correct: 0,
          why: 'Loose equality converts both sides and finds them equal. Exactly this kind of surprise is why === is the rule.',
        },
        {
          question: 'With user = null, what does user && user.active do?',
          options: [
            'throws because user is null',
            'short-circuits to null without reading .active',
            'returns true',
          ],
          correct: 1,
          why: '&& stops at the first falsy value. user is null, so .active is never touched and no error is thrown.',
        },
      ],
      build: {
        simple: 'Use == to check if two things are equal.',
        actually:
          'Use === (and !==): it compares value AND type, so "5" === 5 is false. == converts types first with long, surprising rules. && / || short-circuit, which makes user && user.active safe when user might be missing. Falsy values: 0, "", null, undefined, NaN.',
        breaks:
          'With ==, an id of "42" from a URL equals the number 42 by accident, hiding a type bug until production. With === it fails in development where you can fix it. And 0 being falsy bites legitimate zero quantities.',
      },
      doThisNow: [
        {
          task: 'Run the two equality operators on the same pair and watch them disagree.',
          command: 'node -e \'console.log("5" == 5); console.log("5" === 5)\'',
          reveal:
            'true then false. == converted the string and called them equal; === saw a string vs a number and said false. The false is the honest answer you want surfacing early.',
        },
        {
          task: 'Prove short-circuiting is null-safe: read a property off a null value guarded by &&.',
          command: 'node -e \'const user=null; console.log(user && user.active)\'',
          reveal:
            'Prints null, no crash. && stops at the first falsy value, so user.active is never evaluated. This is the everyday guard against "cannot read property of null".',
        },
      ],
      warStory:
        'A feature flag check used == against a value that sometimes arrived as the string "0" and sometimes the number 0. Loose equality made them tangle with false in different ways, so the flag flickered on and off unpredictably. Switching to === and explicit conversion ended a week of "cannot reproduce" reports.',
      tweak: {
        instruction: 'Print "" == false and "" === false.',
        reveal:
          'true then false. The empty string converts to false under loose equality. Strict equality refuses the conversion, which is the behavior you want.',
      },
      receipt: {
        explain: [
          'Why === is the rule and == is banned.',
          'How short-circuiting makes && null-safe, and which values are falsy.',
        ],
        command: 'node -e \'console.log("5" === 5)\'',
        question: 'You can compare values. How do you make your code take different paths based on the answer?',
      },
      recap: [
        'Always === and !==; let lint ban ==.',
        '&& and || stop early once the answer is known.',
        'Falsy: 0, "", null, undefined, NaN.',
      ],
    },
  },
  {
    id: 'js-rung-if-else',
    title: 'Module 7: If / Else If / Else',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 10,
    prompt: 'Choose a path with if chains, and learn why condition order decides behavior.',
    explanation: `Branching is how code makes decisions, and the shape is the same in every C-family language: a condition in parentheses, a block in braces.

**The chain.** if runs first. Each else if is tried only after everything above failed. else catches the rest. The first match wins and the remaining branches are skipped entirely, so order conditions from most specific to least.

**Return early.** Inside a function, returning from a branch ends the function immediately. Guard clauses use this: handle the error case first and return, then write the happy path without nesting.

**The ternary.** condition ? a : b picks between two values inline: const label = score >= 70 ? "pass" : "fail". Use it for simple picks; use a chain when there are several branches or side effects.`,
    production:
      'Authorization handlers are if chains, and the order is the security model: check banned before checking subscribed, or a banned subscriber gets in. Reviewers read branch order as carefully as the conditions themselves.',
    walkthrough: [
      'Write a chain ordered from highest threshold down.',
      'Add an else so every input lands somewhere.',
      'Rewrite a simple two-way pick as a ternary.',
      'Try a guard clause: if (invalid) return early.',
    ],
    questions: [
      'Why does the first matching branch win?',
      'What is a guard clause?',
      'When is a ternary the wrong choice?',
    ],
    checklist: [
      'Write an if / else if / else chain.',
      'Order conditions correctly.',
      'Use a ternary for a two-way pick.',
    ],
    interactive: {
      coldOpen:
        'A login handler checks if (subscribed) before if (banned). A banned subscriber walks right in. The conditions were both correct; the order was the bug. In an if chain, the first match wins and the rest never run, so the sequence IS the logic. Where does order silently decide who gets access?',
      example: {
        code: 'const score = 72;\nlet grade;\n\nif (score >= 90) {\n  grade = "A";\n} else if (score >= 70) {\n  grade = "B";\n} else {\n  grade = "C";\n}\n\nconsole.log(grade);\nconsole.log(score >= 70 ? "pass" : "fail");',
        output: 'B\npass',
        explain:
          '72 fails the >= 90 test, passes >= 70, so grade is B and the else never runs. The ternary picks "pass" the same way.',
      },
      predicts: [
        {
          question: 'With score = 95, which branch assigns grade?',
          options: ['the >= 90 branch', 'the >= 70 branch', 'both'],
          correct: 0,
          why: 'The chain stops at the first match. 95 also passes >= 70, but that branch is never reached.',
        },
        {
          question: 'If the >= 70 check were written first, what happens to a 95?',
          options: [
            'still gets an A',
            'gets a B because the broader condition matched first',
            'the compiler reorders the chain',
          ],
          correct: 1,
          why: 'Chains evaluate top to bottom. A broad condition placed early swallows the inputs meant for narrower branches below.',
        },
      ],
      build: {
        simple: 'if / else if / else picks one path.',
        actually:
          'The chain runs top to bottom; the first true branch wins and the rest are skipped. Order conditions from most specific to least. Guard clauses (handle the bad case and return early) keep the happy path flat, and a ternary handles simple two-way picks inline.',
        breaks:
          'A broad condition placed before a narrow one swallows inputs meant for the narrow branch. In authorization that is a security hole: check banned before subscribed, or a banned subscriber slips through.',
      },
      doThisNow: [
        {
          task: 'Run the grade chain, then move the >= 70 check above the >= 90 check and rerun. Watch a 95 become a B.',
          command: 'node -e \'const s=95; if(s>=70){console.log("B")}else if(s>=90){console.log("A")}\'',
          reveal:
            'It prints B. The broad >= 70 matched first, so the A branch is unreachable. Order in an if chain is logic, not style.',
        },
        {
          task: 'Trace a guard clause: with score 65, predict the branch, then run the original chain to confirm.',
          command: 'node -e \'const s=65; console.log(s>=90?"A":s>=70?"B":"C")\'',
          reveal:
            'Both thresholds fail, so it lands on C. Most-specific-first ordering is what makes each branch reachable.',
        },
      ],
      warStory:
        'A pricing tier check listed the cheapest plan condition first, and because every paying customer also satisfied it, everyone got billed at the lowest tier. Revenue quietly leaked for a month. The conditions were right; reordering them most-specific-first fixed the bug in one commit.',
      tweak: {
        instruction: 'Change score to 65 and trace which branch runs before executing.',
        reveal: 'Both numbered checks fail, the else catches it, grade is C, and the ternary prints fail.',
      },
      receipt: {
        explain: [
          'Why the first matching branch wins and order matters.',
          'What a guard clause is and when a ternary fits.',
        ],
        command: 'node -e \'const s=72; console.log(s>=90?"A":s>=70?"B":"C")\'',
        question: 'You can branch on one value. How do you store and process many values at once?',
      },
      writeDrillId: 'js-zero-if-else',
      recap: [
        'First matching branch wins; the rest are skipped.',
        'Order conditions from most specific to least.',
        'Guard clauses return early and keep the happy path flat.',
      ],
    },
  },
  {
    id: 'js-rung-arrays',
    title: 'Module 8: Arrays',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Store ordered data: indexing, push, length, slice, and includes.',
    explanation: `An array is an ordered list in square brackets, and it is the container backend code lives in: rows from a database, items in a cart, lines in a file.

**Reading.** nums[0] is the first item; counting starts at zero. The last item is nums[nums.length - 1]. Reading past the end gives undefined rather than an error, which can hide bugs, so watch for it.

**Growing.** push adds to the end and is the everyday way arrays grow while you build up results.

**Slicing.** nums.slice(1, 3) copies a range, including the start index and stopping before the end index. The original array is untouched.

**Asking.** includes answers membership with a boolean, and indexOf reports a position (or -1 for missing, a convention worth memorizing).`,
    production:
      'API responses are arrays of records, and handlers loop, filter, and slice them constantly. The undefined-on-overrun behavior means a wrong index check returns undefined that flows onward until something crashes far from the cause, which is why bounds discipline matters.',
    walkthrough: [
      'Build an array and read the first and last items.',
      'Grow it with push and watch length change.',
      'Copy a range with slice and confirm the original is intact.',
      'Ask membership questions with includes.',
    ],
    questions: [
      'What does reading nums[99] on a 4-item array return?',
      'What does slice(1, 3) include and exclude?',
      'What does indexOf return for a missing value?',
    ],
    checklist: [
      'Index from the front and the back.',
      'Grow an array with push.',
      'Slice a range without mutating the original.',
    ],
    interactive: {
      coldOpen:
        'Read item 99 of a 4-item array and JavaScript does not throw. It hands you undefined, which slips downstream and crashes something far away with a message that points nowhere near the real bug. Arrays are where backend data lives, so their quiet edges are worth feeling firsthand.',
      example: {
        code: 'const nums = [10, 20, 30];\nnums.push(40);\n\nconsole.log(nums[0]);\nconsole.log(nums[nums.length - 1]);\nconsole.log(nums.length);\nconsole.log(nums.slice(1, 3));\nconsole.log(nums.includes(20));',
        output: '10\n40\n4\n[ 20, 30 ]\ntrue',
        explain:
          'push put 40 at the end, so the last item is 40 and length is 4. slice(1, 3) copies indexes 1 and 2. includes answers with a boolean.',
      },
      predicts: [
        {
          question: 'After push(40), what is nums[3]?',
          options: ['30', '40', 'undefined'],
          correct: 1,
          why: 'Indexes start at 0, so slot 3 is the fourth item: the freshly pushed 40.',
        },
        {
          question: 'What does nums[99] return?',
          options: ['an error', 'undefined', '0'],
          correct: 1,
          why: 'JavaScript returns undefined for out-of-range reads instead of throwing, so the mistake travels silently.',
        },
        {
          question: 'Why can nums.push work when nums is const?',
          options: [
            'push secretly reassigns',
            'const locks the binding, and the array contents stay mutable',
            'it cannot; this throws',
          ],
          correct: 1,
          why: 'const prevents repointing the name at a different array. Changing what is inside the array is allowed.',
        },
      ],
      build: {
        simple: 'An array is an ordered list you can read and grow.',
        actually:
          'Index from zero; the last item is length - 1. push appends, slice(start, end) copies a range (start included, end excluded) without mutating, and includes answers membership as a boolean. const locks the name, not the contents, so push works on a const array.',
        breaks:
          'Reading past the end returns undefined instead of throwing, so a wrong index travels silently until something downstream breaks. Bounds discipline is what keeps that from happening.',
      },
      doThisNow: [
        {
          task: 'Watch the silent overrun: read a valid index and an out-of-range one on the same array.',
          command: 'node -e \'const a=[10,20,30]; console.log(a[2], a[99])\'',
          reveal:
            '30 undefined. No error for index 99. That undefined is exactly what sneaks into later code and crashes somewhere unrelated. Always check bounds before trusting an index.',
        },
        {
          task: 'Confirm slice does not mutate: slice a range, then print the original.',
          command: 'node -e \'const a=[10,20,30,40]; console.log(a.slice(0,2)); console.log(a)\'',
          reveal:
            '[10,20] then the full [10,20,30,40]. slice copies (start included, end excluded) and leaves the source intact, unlike push which changes it.',
        },
      ],
      warStory:
        'A pagination helper read results[pageSize] to peek at "the next item" for a has-more flag. On the last page that index was out of range, returning undefined, which the code treated as a real item and rendered a blank row forever. The overrun never threw; it just lied.',
      tweak: {
        instruction: 'Change slice(1, 3) to slice(0, 2) and predict the printed pair.',
        reveal: '[ 10, 20 ]. Slices include the start index and stop just before the end index.',
      },
      receipt: {
        explain: [
          'How to index, grow, and slice an array safely.',
          'Why out-of-range reads return undefined instead of throwing.',
        ],
        command: 'node -e \'const a=[1,2,3]; console.log(a[99])\'',
        question: 'You can hold a list. How do you visit every item in it?',
      },
      drills: ['jsf-contains', 'jsf-first-n'],
      recap: [
        'Index from zero; last item is length - 1.',
        'push grows; slice copies without mutating.',
        'Out-of-range reads return undefined silently.',
      ],
    },
  },
  {
    id: 'js-rung-loops',
    title: 'Module 9: Loops: for...of, for, while',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 11,
    prompt: 'Repeat work with the three loop shapes and the accumulator pattern.',
    explanation: `Three loops cover everything, and choosing the right one makes intent readable.

**for...of.** The default for collections: for (const n of nums) visits each item in order with no index bookkeeping. Reach for this one first.

**for.** The counted loop: for (let i = 0; i < 3; i++) gives you the index itself. Note the let; the counter changes every pass. The boundary between < and <= is where off-by-one bugs live.

**while.** Repeats while a condition holds, for work without a known count: retrying, draining a queue. The body must change something the condition reads or the loop never ends.

**The accumulator.** Declare a total before the loop, fold each item in, use the result after. Summing, counting, and collecting all follow this one shape.`,
    production:
      'Most production loops are for...of over rows or messages. Manual index loops are where boundary bugs concentrate, so modern style reserves them for when the index is genuinely needed and reaches for array methods otherwise.',
    walkthrough: [
      'Total a list with for...of and an accumulator.',
      'Print 0, 1, 2 with a for loop; note i < 3 stops before 3.',
      'Write a while with a condition that visibly moves toward false.',
    ],
    questions: [
      'Why prefer for...of over a counted for?',
      'What makes a while loop infinite?',
    ],
    checklist: [
      'Sum a list with for...of.',
      'Write a counted for loop with a correct boundary.',
      'Explain the accumulator pattern.',
    ],
    interactive: {
      coldOpen:
        'Change one character, < to <=, and your loop runs one extra time. That single boundary is where the most famous bug in programming lives: the off-by-one. Three loop shapes cover all repetition, and picking the right one makes the intent (and the boundary) obvious.',
      example: {
        code: 'let total = 0;\nfor (const n of [1, 2, 3, 4]) {\n  total += n;\n}\nconsole.log(total);\n\nfor (let i = 0; i < 3; i++) {\n  console.log(i);\n}',
        output: '10\n0\n1\n2',
        explain:
          'The first loop folds 1+2+3+4 into total. The counted loop starts at 0 and stops when i < 3 fails, printing 0, 1, 2.',
      },
      predicts: [
        {
          question: 'How many lines does for (let i = 0; i <= 3; i++) print?',
          options: ['3', '4', 'infinite'],
          correct: 1,
          why: '<= includes 3 itself: 0, 1, 2, 3. The boundary operator is the entire off-by-one story.',
        },
        {
          question: 'Why is the loop counter let instead of const?',
          options: [
            'style preference',
            'i++ reassigns it every pass, which const forbids',
            'loops require let',
          ],
          correct: 1,
          why: 'The counter is reassigned each iteration. A const counter throws on the first i++.',
        },
      ],
      build: {
        simple: 'Loops repeat work.',
        actually:
          'for...of visits each item with no index bookkeeping (reach for it first); for gives you the index when you need it; while runs until a condition flips. The accumulator pattern (declare a total, fold each item in, use it after) covers summing, counting, and collecting.',
        breaks:
          'The < vs <= boundary in a counted loop is where off-by-one bugs cluster. And a while whose body never moves the condition toward false runs forever.',
      },
      doThisNow: [
        {
          task: 'Feel the off-by-one: run the same loop with < 3 and then <= 3 and count the lines.',
          command: 'node -e \'for(let i=0;i<3;i++)process.stdout.write(i+" "); console.log(); for(let i=0;i<=3;i++)process.stdout.write(i+" ")\'',
          reveal:
            '0 1 2, then 0 1 2 3. The single character < vs <= changes the count by one. That boundary is the entire off-by-one story, made concrete.',
        },
        {
          task: 'Write the accumulator yourself: sum [1,2,3,4] with a for...of loop.',
          command: 'node -e \'let t=0; for(const n of [1,2,3,4]) t+=n; console.log(t)\'',
          reveal:
            '10. Declare the total before, fold each item in inside, read the result after. Every sum, count, and collect you write follows this shape.',
        },
      ],
      warStory:
        'A batch job processed records with for (let i = 0; i <= items.length; i++). The <= read one index past the end on every run, hit undefined, and threw mid-batch, leaving jobs half-finished. One character, < instead of <=, ended the nightly pages.',
      tweak: {
        instruction: 'Change the counted loop to start at i = 1 and predict the output.',
        reveal: 'It prints 1 and 2. Start, condition, and step each independently shape the range.',
      },
      receipt: {
        explain: [
          'When to use for...of, for, and while.',
          'The accumulator pattern and where off-by-one lives.',
        ],
        command: 'node -e \'let t=0;for(const n of [1,2,3])t+=n;console.log(t)\'',
        question: 'You can loop over a list. How do you model a single record with named fields?',
      },
      writeDrillId: 'jsf-sum-for',
      recap: [
        'for...of by default; for when you need the index.',
        'Accumulator: declare before, fold inside, use after.',
        'while bodies must move the condition toward false.',
      ],
    },
  },
  {
    id: 'js-rung-objects',
    title: 'Module 10: Objects',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt: 'Model records with objects: dot access, missing keys, ?? defaults, and Object.keys.',
    explanation: `An object holds named fields, and it is how JavaScript represents a record: a user, an order, a config. JSON is this exact shape written as text, which makes objects the center of backend work.

**Access.** user.name reads a field. user["name"] does the same and also works when the key lives in a variable.

**Missing fields.** Reading an absent field gives undefined with no error. Chasing a field on undefined is what throws, one step later, which is why missing data crashes far from its cause.

**Defaults.** The ?? operator fills in only for null and undefined: user.email ?? "none". Optional chaining user?.profile?.city walks a path and yields undefined instead of throwing when a link is missing.

**Inspection.** Object.keys lists field names, Object.values the values, Object.entries both. These power every loop over a record.

**Writing.** Assigning to a new field adds it; assigning to an existing one overwrites.`,
    production:
      'Every JSON request body parses into an object, and optional fields are the norm. Handlers read fields defensively with ?? and ?. because clients omit fields constantly. The "cannot read properties of undefined" error is the most common crash in Node backends, and this module is its vaccine.',
    walkthrough: [
      'Build an object literal with two fields.',
      'Read a present field, then a missing one.',
      'Fill a default with ?? and walk a deep path with ?. once.',
      'List the keys with Object.keys.',
    ],
    questions: [
      'What does reading a missing field return?',
      'How does ?? differ from ||?',
      'Why does ?. exist?',
    ],
    checklist: [
      'Read and add object fields.',
      'Default a missing field with ??.',
      'List keys with Object.keys.',
    ],
    interactive: {
      coldOpen:
        '"Cannot read properties of undefined" is the single most common crash in Node backends. It happens because reading a missing field returns undefined silently, and the explosion comes one step later when you reach into that undefined. Every JSON request body is an object with optional fields, so this is the crash waiting in every handler.',
      mental:
        'An object is a labeled filing cabinet: a missing folder hands you undefined, and opening a folder inside a missing drawer is the crash.',
      diagram: {
        nodes: ['Object', 'Dot read', 'Missing field', '?? default', '?. safe walk'],
        explanations: [
          'Named fields holding values: the record shape of JavaScript, and exactly what JSON parses into.',
          'user.name reads a field; user["name"] does the same when the key lives in a variable.',
          'Reading an absent field quietly returns undefined. The error comes one step later, far from the cause.',
          'The ?? operator fills in only for null and undefined, so legitimate zeros and empty strings survive.',
          'user?.profile?.city walks a path and yields undefined instead of throwing when a link is missing.',
        ],
      },
      example: {
        code: 'const user = { name: "Kay", role: "admin" };\n\nconsole.log(user.name);\nconsole.log(user.email ?? "none");\nuser.active = true;\nconsole.log(Object.keys(user));',
        output: "Kay\nnone\n[ 'name', 'role', 'active' ]",
        explain:
          'user.email is undefined, so ?? supplies the fallback. Assigning active adds a third field, which Object.keys then lists.',
      },
      predicts: [
        {
          question: 'What does user.address.city throw when address is missing?',
          options: [
            'nothing; it returns undefined',
            "TypeError: Cannot read properties of undefined (reading 'city')",
            'a KeyError',
          ],
          correct: 1,
          why: 'user.address is undefined, and reading .city on undefined throws. user.address?.city is the safe walk.',
        },
        {
          question: 'What does 0 ?? 5 give, versus 0 || 5?',
          options: ['0 and 5', '5 and 5', '0 and 0'],
          correct: 0,
          why: '?? replaces only null and undefined, so 0 survives. || replaces every falsy value, so 0 becomes 5. Pick ?? when 0 or "" are legitimate.',
        },
      ],
      build: {
        simple: 'An object is a bag of named fields.',
        actually:
          'Read with user.name or user["key"]. Missing fields return undefined, not an error. ?? supplies a default only for null/undefined (so 0 and "" survive), ?. walks a path safely, and Object.keys/values/entries iterate a record. JSON parses into exactly this shape.',
        breaks:
          'Reaching into a missing field (user.address.city when address is absent) throws "cannot read properties of undefined" one step after the real omission. ?. and ?? are the vaccines.',
      },
      doThisNow: [
        {
          task: 'Trigger the famous crash, then prevent it with optional chaining. Run both.',
          command: 'node -e \'const u={name:"Kay"}; try{console.log(u.address.city)}catch(e){console.log(e.message)} console.log(u.address?.city)\'',
          reveal:
            'First prints "Cannot read properties of undefined (reading \\\'city\\\')"; second prints undefined with no crash. ?. turns a missing link into a safe undefined instead of an explosion.',
        },
        {
          task: 'See why ?? beats || for defaults: run 0 ?? 5 and 0 || 5.',
          command: 'node -e \'console.log(0 ?? 5); console.log(0 || 5)\'',
          reveal:
            '0 then 5. ?? only replaces null/undefined, so a legitimate 0 survives; || replaces every falsy value and wrongly turns 0 into 5. Reach for ?? when 0 or "" are valid.',
        },
      ],
      warStory:
        'An endpoint read req.body.address.zip to compute shipping. Most clients sent address, so it passed every test. A mobile build that omitted address crashed the handler with "cannot read properties of undefined" for thousands of users. One ?. would have degraded gracefully instead.',
      tweak: {
        instruction: 'Print user?.profile?.city with no profile field on user.',
        reveal: 'undefined, with no crash. Optional chaining turns a missing link into undefined instead of a TypeError.',
      },
      receipt: {
        explain: [
          'Why missing fields read as undefined and crash one step later.',
          'When to use ?? versus || and why ?. exists.',
        ],
        command: 'node -e \'const u={}; console.log(u.a?.b)\'',
        question: 'You can model a record. How do you package reusable behavior that acts on it?',
      },
      writeDrillId: 'jsf-key-count',
      recap: [
        'Objects are records; JSON is this shape as text.',
        'Missing fields read as undefined; the crash comes one step later.',
        '?? for defaults, ?. for safe deep walks.',
      ],
    },
  },
  {
    id: 'js-rung-functions',
    title: 'Module 11: Functions And Arrows',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt: 'Package behavior: declarations, parameters, defaults, return, and arrow functions.',
    explanation: `A function takes inputs, does work, and returns a result. JavaScript gives the same idea two everyday syntaxes.

**Declarations.** function greet(name) { return ... } is the classic form, good for named, standalone behavior.

**Arrow functions.** const square = (x) => x * x is the compact form. A single expression after the arrow returns implicitly. Arrows dominate modern code, especially as inline arguments to array methods, where you have already been reading them.

**Defaults.** greet(name, greeting = "Hello") fills in missing arguments.

**Return ends the function.** The moment return runs, the function is done. Code after it never executes, and a function that falls off the end without returning gives undefined.

**Return beats print.** A returned value can be tested, stored, and passed onward. console.log only shows a human something. Logic returns; edges print.`,
    production:
      'Handlers, middleware, and callbacks are all functions passed to other functions, usually as arrows. Reading (req, res) => ... fluently is reading Express. The discipline of returning values instead of printing is what makes code testable at all.',
    walkthrough: [
      'Write a declaration with a default parameter.',
      'Write the same behavior as an arrow.',
      'Confirm code after return never runs.',
      'Return the value; log only at the call site.',
    ],
    questions: [
      'When does an arrow function return implicitly?',
      'What does a function with no return give back?',
    ],
    checklist: [
      'Write a function declaration and an arrow.',
      'Use a default parameter.',
      'Explain why return beats print.',
    ],
    interactive: {
      coldOpen:
        'A function that console.logs its answer is almost useless to other code; a function that returns its answer can be tested, stored, and chained. That one distinction (return, not print) is what makes code testable at all, and it is the line between a script and a system. Feel the difference.',
      example: {
        code: 'function greet(name, greeting = "Hello") {\n  return `${greeting}, ${name}!`;\n}\n\nconst square = (x) => x * x;\n\nconsole.log(greet("Kay"));\nconsole.log(greet("Sam", "Hi"));\nconsole.log(square(6));',
        output: 'Hello, Kay!\nHi, Sam!\n36',
        explain:
          'The first call uses the default greeting. The arrow squares with an implicit return: no braces, no return keyword needed for a single expression.',
      },
      predicts: [
        {
          question: 'What does greet("Kay") use for greeting?',
          options: ['undefined', 'the default "Hello"', 'an empty string'],
          correct: 1,
          why: 'Missing arguments take their declared defaults.',
        },
        {
          question: 'What does a function return if it never hits a return statement?',
          options: ['null', 'undefined', '0'],
          correct: 1,
          why: 'Falling off the end of a function yields undefined, a frequent source of mystery undefineds downstream.',
        },
      ],
      build: {
        simple: 'A function takes inputs and gives back a result.',
        actually:
          'Declarations (function greet(){}) and arrows (const sq = x => x*x) are two syntaxes for the same idea; a single-expression arrow returns implicitly. Default parameters fill missing arguments, return ends the function, and a returned value can be tested and reused while a print only shows a human.',
        breaks:
          'A function that falls off the end without returning gives undefined, which becomes a mystery undefined downstream. And code after a return is unreachable, a common dead-code surprise.',
      },
      doThisNow: [
        {
          task: 'Prove return beats print: call a function that returns vs one that only logs, and try to use each result.',
          command: 'node -e \'const r=(x)=>x*x; const p=(x)=>{console.log(x*x)}; console.log("usable:", r(6) + 1); console.log("usable:", p(6) + 1)\'',
          reveal:
            'The returning function gives 37 (36 + 1, usable). The printing one logs 36 then prints "usable: NaN", because it returned undefined and undefined + 1 is NaN. Logic returns; only edges print.',
        },
        {
          task: 'Show code after return is dead: add a line after return and confirm it never runs.',
          command: 'node -e \'function f(){return 1; console.log("after")} console.log(f())\'',
          reveal:
            'Prints only 1. The "after" log never runs because return ends the function immediately. Anything below a return on the same path is unreachable.',
        },
      ],
      warStory:
        'A validation helper console.logged "invalid" instead of returning false. Callers checked its return value, always got undefined (falsy), and treated everything as valid. Bad data sailed through for weeks. The fix was one word: return where it had been logging.',
      tweak: {
        instruction: 'Add console.log("after") on a line after the return inside greet, then call it.',
        reveal: 'The log never prints. return ends the function immediately; code after it is unreachable.',
      },
      receipt: {
        explain: [
          'The two function syntaxes and implicit arrow return.',
          'Why returning a value beats printing it.',
        ],
        command: 'node -e \'const sq=x=>x*x; console.log(sq(6))\'',
        question: 'You can write functions. What three of them replace almost every loop you would ever write?',
      },
      writeDrillId: 'js-zero-function-return',
      recap: [
        'Arrows with one expression return implicitly.',
        'Defaults fill missing arguments.',
        'return ends the function; no return means undefined.',
      ],
    },
  },
  {
    id: 'js-rung-transform',
    title: 'Module 12: map, filter, reduce',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'The data trio: filter chooses, map transforms, reduce folds. Most backend code is these three.',
    explanation: `Loops with accumulators work, but JavaScript names the three patterns so code states its intent.

**filter chooses.** nums.filter((n) => n % 2 === 0) keeps the items where the arrow returns true. Same length or shorter, same items, nothing transformed.

**map transforms.** evens.map((n) => n * n) builds a new array by passing every item through the arrow. Always the same length, every item replaced by the arrow result.

**reduce folds.** nums.reduce((sum, n) => sum + n, 0) carries an accumulator across the items: start at 0, fold each item in, return the final value. Sums, counts, and groupings are reduces.

**Chains.** They return new arrays, so they chain: users.filter(...).map(...) reads as choose, then shape. The original array is never mutated, which means no spooky action at a distance.`,
    production:
      'This is the literal shape of handler code: filter rows by a flag, map to the response fields, reduce for a total. The same vocabulary appears in Python, C# LINQ, Java streams, and SQL, so this module is learning every backend language at once.',
    walkthrough: [
      'Filter evens from a list and read the arrow as a yes/no test.',
      'Map the survivors to their squares.',
      'Reduce the original list to a sum, naming the accumulator.',
      'Chain filter then map in one expression.',
    ],
    questions: [
      'Which of the trio changes array length, and which changes items?',
      'What are the two arguments reduce passes to its arrow?',
      'Why does chaining work?',
    ],
    checklist: [
      'Filter with a predicate arrow.',
      'Map a transformation.',
      'Reduce to a single value.',
    ],
    interactive: {
      coldOpen:
        'Almost every backend handler is the same three moves: choose some rows, reshape them, fold them into a total. JavaScript names them filter, map, and reduce, and the exact same trio shows up in Python, C# LINQ, Java streams, and SQL. Learn them once here and you are reading every backend language at once.',
      mental:
        'filter is a sieve, map is a paint sprayer, reduce is a snowball rolling downhill gathering everything into one.',
      diagram: {
        nodes: ['Array', 'filter: choose', 'map: transform', 'reduce: fold'],
        explanations: [
          'The raw list: rows, items, messages. Untouched by everything that follows, because all three return new values.',
          'Keeps the items where the arrow test is true. Same items, possibly fewer.',
          'Passes every item through the arrow and collects the results. Same length, new items.',
          'Carries an accumulator across the items and returns the final value: sums, counts, groupings.',
        ],
      },
      example: {
        code: 'const nums = [1, 2, 3, 4, 5, 6];\n\nconst evens = nums.filter((n) => n % 2 === 0);\nconsole.log(evens);\n\nconsole.log(evens.map((n) => n * n));\n\nconsole.log(nums.reduce((sum, n) => sum + n, 0));',
        output: '[ 2, 4, 6 ]\n[ 4, 16, 36 ]\n21',
        explain:
          'filter keeps 2, 4, 6. map squares each survivor. reduce starts the sum at 0 and folds all six numbers into 21.',
      },
      predicts: [
        {
          question: 'What does nums.filter((n) => n > 4) produce?',
          options: ['[ 5, 6 ]', '[ 4, 5, 6 ]', '[ true, true ]'],
          correct: 0,
          why: 'filter keeps the items where the test is true: 5 and 6. It returns the items themselves, never the booleans.',
        },
        {
          question: 'Which one always returns an array of the same length?',
          options: ['filter', 'map', 'reduce'],
          correct: 1,
          why: 'map transforms every item one-for-one. filter can shrink, and reduce returns a single value.',
        },
        {
          question: 'In reduce((sum, n) => sum + n, 0), what is the 0?',
          options: [
            'the first item of the array',
            'the starting value of the accumulator',
            'the index',
          ],
          correct: 1,
          why: 'The second argument seeds the accumulator. The fold starts at 0 and each pass returns the next accumulator value.',
        },
      ],
      build: {
        simple: 'Three methods process a list.',
        actually:
          'filter keeps items where the test is true (same or fewer), map transforms every item one-for-one (same length), reduce folds items into a single value with a seeded accumulator. All return new values, so they chain: filter(...).map(...) reads as choose, then shape.',
        breaks:
          'Mixing them up is the usual slip: reaching for map when you mean filter, or forgetting reduce\'s seed value. And expecting them to mutate the original (they never do) leads to "why is my array unchanged" confusion.',
      },
      doThisNow: [
        {
          task: 'Run the trio on one array, then chain filter into map. Watch each shape the data differently.',
          command: 'node -e \'const n=[1,2,3,4,5,6]; console.log(n.filter(x=>x%2===0)); console.log(n.map(x=>x*x)); console.log(n.reduce((s,x)=>s+x,0))\'',
          reveal:
            '[2,4,6], then [1,4,9,16,25,36], then 21. filter chose, map transformed every item, reduce folded all six into one number. Three intents, three methods.',
        },
        {
          task: 'Chain choose-then-shape: filter the evens, then multiply each by 10.',
          command: 'node -e \'const n=[1,2,3,4,5,6]; console.log(n.filter(x=>x%2===0).map(x=>x*10))\'',
          reveal:
            '[20,40,60]. Because each method returns a new array, they chain left to right. This one line is the skeleton of most list endpoints you will ever write.',
        },
      ],
      warStory:
        'A report needed "total revenue from paid orders." The first version looped with a manual index and an accumulator, 12 lines with an off-by-one. The rewrite was orders.filter(o => o.paid).reduce((s,o) => s + o.amount, 0): one readable line, no boundary to get wrong.',
      tweak: {
        instruction: 'Chain them: nums.filter((n) => n % 2 === 0).map((n) => n * 10) and predict.',
        reveal: '[ 20, 40, 60 ]. Choose, then shape. This one line is the skeleton of most list endpoints you will ever write.',
      },
      receipt: {
        explain: [
          'What filter, map, and reduce each do to a list.',
          'Why they chain and never mutate the original.',
        ],
        command: 'node -e \'console.log([1,2,3,4].filter(x=>x%2===0).map(x=>x*10))\'',
        question: 'You have every piece. Can you combine them into one real program that turns records into a summary?',
      },
      drills: ['jsf-filter-evens', 'jsf-map-double'],
      recap: [
        'filter chooses, map transforms, reduce folds.',
        'All three return new arrays or values; nothing mutates.',
        'filter(...).map(...) is the universal backend data move.',
      ],
    },
  },
  {
    id: 'js-rung-capstone',
    title: 'Module 13: Capstone: Records To Summary (0 to 1)',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 15,
    prompt: 'Combine everything: take records, filter them, shape a summary. This is real backend code.',
    explanation: `This program is a miniature API endpoint, built entirely from modules 1 through 12.

The data is an array of objects, exactly what a database query or JSON request body gives you. The pipeline filters the active records and maps out the names: choose, then shape. The summary is a new object holding a count and a list, which is precisely the JSON a real endpoint would return.

Read it, predict it, then flip the filter and watch one character change the business rule. When you can modify this program with confidence, you are no longer at zero in JavaScript, and everything in Backend Language Core and API Design will look familiar instead of foreign.`,
    production:
      'Swap the literal array for rows from a database and the console.log for res.json(summary), and this is a production list endpoint, unchanged in shape. Recognizing this skeleton means you can read most handler code in any Node codebase on day one.',
    walkthrough: [
      'Read the records and say their shape out loud: array of objects with name and active.',
      'Trace the filter: which records survive?',
      'Trace the map: what does each survivor become?',
      'Read the summary object and connect it to a JSON response.',
    ],
    questions: [
      'What database concept does the users array stand in for?',
      'Which modules does this program combine?',
      'What changes to return inactive users instead?',
    ],
    checklist: [
      'Trace the full pipeline by hand.',
      'Modify the filter and predict the result.',
      'Explain how this maps to an API endpoint.',
    ],
    interactive: {
      mental:
        'Records in, pipeline through, summary out: the assembly line every backend endpoint runs.',
      diagram: {
        nodes: ['Array of objects', 'filter (rule)', 'map (shape)', 'Summary', 'JSON out'],
        explanations: [
          'The input is what a database query or request body gives you: a list of records.',
          'The filter arrow is the business rule: which records matter for this request.',
          'The map arrow is the response shape: which fields the client actually needs.',
          'A new object packages the result: a count, a list, whatever the contract promises.',
          'Serialized to JSON, this is the response body. Swap the literal array for rows and this is production code.',
        ],
      },
      coldOpen:
        'Here is a real list endpoint: take records, keep the ones that matter, shape them, return a summary. It is built from nothing but the twelve modules you just finished. Swap the array for a database query and the log for res.json, and this is production code, unchanged. When you can edit it confidently, you are no longer at zero.',
      intro: 'Everything from the previous twelve modules in one real program.',
      example: {
        code: 'const users = [\n  { name: "Kay", active: true },\n  { name: "Sam", active: false },\n  { name: "Lee", active: true },\n];\n\nconst activeNames = users\n  .filter((u) => u.active)\n  .map((u) => u.name);\n\nconst summary = { activeCount: activeNames.length, names: activeNames };\nconsole.log(summary);',
        output: "{ activeCount: 2, names: [ 'Kay', 'Lee' ] }",
        explain:
          'filter keeps Kay and Lee, map extracts their names, and the summary object packages the count with the list, ready to be serialized as JSON.',
      },
      predicts: [
        {
          question: 'What is summary.activeCount?',
          options: ['3', '2', '1'],
          correct: 1,
          why: 'Two records have active set to true: Kay and Lee.',
        },
        {
          question: 'To get inactive users instead, you change...',
          options: [
            'the filter arrow to (u) => !u.active',
            'the map arrow',
            'the summary object keys',
          ],
          correct: 0,
          why: 'The filter is the business rule. One ! flips it; the rest of the pipeline is untouched.',
        },
        {
          question: 'In a real API, what replaces console.log(summary)?',
          options: ['nothing', 'sending the object as a JSON response', 'a database write'],
          correct: 1,
          why: 'Endpoints return their summary as JSON. The shape of the code stays exactly the same.',
        },
      ],
      build: {
        simple: 'Take records and produce a summary.',
        actually:
          'An array of objects (a query result or request body) flows through filter (the business rule) and map (the response shape) into a summary object, which becomes the JSON response. Every module 1 through 12 appears in these few lines.',
        breaks:
          'The business rule lives entirely in the filter arrow; one ! flips it without touching the rest. Confusing the filter (which records) with the map (which fields) is the usual place these pipelines go wrong.',
      },
      doThisNow: [
        {
          task: 'Run the full endpoint logic and read the summary it produces.',
          command: 'node -e \'const u=[{name:"Kay",active:true},{name:"Sam",active:false},{name:"Lee",active:true}]; const a=u.filter(x=>x.active).map(x=>x.name); console.log({activeCount:a.length, names:a})\'',
          reveal:
            "{ activeCount: 2, names: [ 'Kay', 'Lee' ] }. Filter chose the active users, map pulled their names, the object packaged the result. That is a list endpoint in three lines.",
        },
        {
          task: 'Change the business rule with one character: flip the filter to inactive users and rerun.',
          command: 'node -e \'const u=[{name:"Kay",active:true},{name:"Sam",active:false},{name:"Lee",active:true}]; const a=u.filter(x=>!x.active).map(x=>x.name); console.log({count:a.length, names:a})\'',
          reveal:
            "{ count: 1, names: [ 'Sam' ] }. One ! rewrote the entire business rule, and the rest of the pipeline held. That is the power of separating the rule (filter) from the shape (map).",
        },
      ],
      warStory:
        'A new engineer shipped their first endpoint on day two: filter active accounts, map to the public fields, return the summary. Code review had nothing to add, because the shape was the same skeleton from this lesson. Recognizing that pattern is what "no longer at zero" actually means.',
      tweak: {
        instruction: 'Flip the filter to !u.active and predict both fields of the summary.',
        reveal: "{ activeCount: 1, names: [ 'Sam' ] }. One character changed the rule, and the pipeline held.",
      },
      receipt: {
        explain: [
          'How filter, map, and an object compose into a list endpoint.',
          'Why the filter arrow is where the business rule lives.',
        ],
        command: 'node -e \'const a=[1,2,3].filter(x=>x>1); console.log({count:a.length})\'',
        question: 'You are no longer at zero in JavaScript. Which backend concept do you want to build next?',
      },
      writeDrillId: 'js-zero-active-summary',
      recap: [
        'Array of objects in, filtered and mapped, summary object out.',
        'The filter arrow is the business rule.',
        'This exact skeleton is a production list endpoint.',
      ],
    },
  },
]
