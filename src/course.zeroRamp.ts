import type { Problem } from './course'

export const zeroRampProblems: Record<string, Problem[]> = {
  'js-fundamentals': [
    {
      id: 'js-zero-what-is-code',
      title: 'Start Here: JavaScript From Zero',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Learn what a JavaScript program is before using methods: files, statements, values, variables, functions, parameters, return values, and console output.',
      explanation:
        'JavaScript runs one statement after another. A value is data like 42 or "Kay". A variable is a name that points at a value. A function is a reusable block of code that can receive inputs called parameters and send a result back with return. console.log prints for humans; return gives a value back to code and tests.',
      production:
        'Backend JavaScript is mostly functions wired to HTTP, databases, queues, and files. If you cannot explain variables, function inputs, return values, and control flow, Express routes and Node services feel like magic instead of ordinary code.',
      walkthrough: [
        'Create a file such as app.js.',
        'Declare values with const when the name will not be reassigned and let when it will.',
        'Write a function with function name(parameter) { ... }.',
        'Use return to give the caller a result.',
        'Use console.log only when you want to print while learning or debugging.',
        'Run the file with node app.js.',
      ],
      example:
        'const name = "Kay"; function greet(user) { return "Hello, " + user; } console.log(greet(name));',
      questions: [
        'What is the difference between a value and a variable?',
        'What is the difference between console.log and return?',
        'When should you use const instead of let?',
        'What does a function parameter do?',
      ],
      checklist: [
        'Can create a .js file and run it with node.',
        'Can declare const and let variables.',
        'Can write a function with parameters and a return value.',
        'Can explain why tests check return values, not console output.',
      ],
    },
    {
      id: 'js-zero-variables',
      title: 'Variables: const And let',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Practice binding names to values. Return an object with a constant name, a mutable count after incrementing it, and a combined label.',
      example: "makeProfile() should return { name: 'backend', count: 2, label: 'backend:2' }.",
      checklist: [
        'Use const for a name that is not reassigned.',
        'Use let for a value you increment.',
        'Return the object instead of logging it.',
      ],
    },
    {
      id: 'js-zero-function-return',
      title: 'Function: Parameters And Return',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Write a function that accepts firstName and lastName parameters and returns one full name string.',
      example: "fullName('Ada', 'Lovelace') should return 'Ada Lovelace'.",
      checklist: [
        'Define a function with two parameters.',
        'Combine strings with a space between them.',
        'Use return, not console.log.',
      ],
    },
    {
      id: 'js-zero-if-else',
      title: 'If / Else: Choose A Branch',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Write a tiny access decision function. Return "allow" when a user is active and has the admin role; otherwise return "deny".',
      example: "canAccess({ active: true, role: 'admin' }) should return 'allow'.",
      checklist: [
        'Use if/else to choose a path.',
        'Check both active and role.',
        'Return a stable string from every branch.',
      ],
    },
  ],
  'python-fundamentals': [
    {
      id: 'py-rung-print',
      title: 'Rung 1: Run Code And Print',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 8,
      prompt:
        'Write your first Python: print text and numbers, and see the output appear.',
      explanation:
        'A Python program runs one line at a time, top to bottom. print() shows a value to you. Text goes inside quotes; numbers do not. The output is your first feedback loop: write a line, run it, read what came back.',
      walkthrough: [
        'Put text inside quotes: "hello".',
        'Numbers need no quotes: 2 + 2 is math.',
        'print() shows the value it is given.',
        'Run the file and read the output line by line.',
      ],
      checklist: [
        'Put text values inside quotes.',
        'Use print to see a value.',
        'Know that 2 + 2 adds but "2" + "2" joins text.',
      ],
      interactive: {
        intro: 'This is the whole loop you will repeat forever: write a line, run it, read the output.',
        example: {
          code: 'print("Hello, world!")\nprint(2 + 2)',
          output: 'Hello, world!\n4',
          explain: 'Line 1 prints the text between the quotes. Line 2 does the math first, then prints the result 4.',
        },
        predicts: [
          {
            question: 'What does print(2 + 2) show?',
            options: ['4', '2 + 2', '22'],
            correct: 0,
            why: 'Without quotes, 2 + 2 is real math, so Python prints the number 4.',
          },
          {
            question: 'What does print("2" + "2") show?',
            options: ['4', '22', 'Error'],
            correct: 1,
            why: 'Quotes make them text, and + joins text end to end, so you get 22.',
          },
        ],
        tweak: {
          instruction: 'Change "Hello, world!" to your own name in quotes, then run it again.',
          reveal: 'print shows whatever text is inside the quotes. The quotes just mark where the text starts and ends.',
        },
        writeDrillId: 'py-zero-say-hello',
      },
    },
    {
      id: 'py-rung-types',
      title: 'Rung 2: Values And Types',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 8,
      prompt:
        'Learn the four everyday Python types: int, float, str, and bool.',
      explanation:
        'Every value has a type. Whole numbers are int. Numbers with a decimal point are float. Text in quotes is str. True and False are bool. The type decides what you can do with a value, so mixing them up is a top beginner bug.',
      walkthrough: [
        'Whole numbers like 42 are int.',
        'Decimals like 3.14 are float.',
        'Anything in quotes is str, even "42".',
        'True and False are bool.',
      ],
      checklist: [
        'Name int, float, str, and bool.',
        'Know quotes make a value a string.',
        'Use type() to check a value.',
      ],
      interactive: {
        example: {
          code: 'print(type(42))\nprint(type(3.14))\nprint(type("Kay"))\nprint(type(True))',
          output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
          explain: 'type() reports the kind of each value. The quotes around "Kay" are what make it a str.',
        },
        predicts: [
          {
            question: 'What type is 42?',
            options: ['int', 'float', 'str'],
            correct: 0,
            why: 'A whole number with no decimal point is an int (integer).',
          },
          {
            question: 'What type is "42" (with quotes)?',
            options: ['int', 'str', 'bool'],
            correct: 1,
            why: 'Anything in quotes is a str (string), even when it looks like a number.',
          },
        ],
        tweak: {
          instruction: 'Change 3.14 to 3 and run. Watch the type change.',
          reveal: '3.14 has a decimal point so it is a float; 3 has none so it is an int.',
        },
        writeDrillId: 'py-zero-variable-return',
      },
    },
    {
      id: 'py-rung-variables',
      title: 'Rung 3: Variables',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 9,
      prompt:
        'Learn how a name points at a value, and how reassigning repoints it.',
      explanation:
        'A variable is a name that points at a value. name = "Kay" makes name point at the text "Kay". You can repoint a name at any time. In count = count + 1, the right side runs first using the old value, then the result is stored back in the name.',
      walkthrough: [
        'Use name = value to bind a name.',
        'The right side is evaluated first.',
        'Reassigning a name repoints it at a new value.',
        'print several names at once with commas.',
      ],
      checklist: [
        'Bind a name to a value with =.',
        'Explain that a name points at a value.',
        'Trace count = count + 1 step by step.',
      ],
      interactive: {
        example: {
          code: 'name = "Kay"\ncount = 1\ncount = count + 1\nprint(name, count)',
          output: 'Kay 2',
          explain: 'count starts at 1. count + 1 evaluates to 2 using the old value, then 2 is stored back in count.',
        },
        predicts: [
          {
            question: 'After count = count + 1, what is count?',
            options: ['1', '2', 'count + 1'],
            correct: 1,
            why: 'The right side runs first: 1 + 1 is 2, and that value is stored back in count.',
          },
          {
            question: 'A variable name like name...',
            options: ['holds the only copy of the text forever', 'points at a value you can replace', 'cannot change once set'],
            correct: 1,
            why: 'A name points at a value, and you can repoint it at a new value any time.',
          },
        ],
        tweak: {
          instruction: 'Add a line name = "Sam" just before print and run.',
          reveal: 'Reassigning repoints the name, so print shows the latest value, Sam.',
        },
        writeDrillId: 'py-zero-variable-return',
      },
    },
    {
      id: 'py-rung-strings',
      title: 'Rung 4: Strings',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt:
        'Work with text: f-strings, indexing, length, and common string methods.',
      explanation:
        'Strings are text. f-strings let you drop values into text with {curly braces}. Indexing with [0] reads a single character, counting from zero. len() counts characters. Methods like .upper() and .strip() return a new string and leave the original unchanged.',
      walkthrough: [
        'Use f"Hello, {name}" to build text from values.',
        'Read one character with text[0]; counting starts at 0.',
        'Count characters with len(text).',
        'Methods like .upper() return a new string.',
      ],
      checklist: [
        'Build a string with an f-string.',
        'Read a character by index starting at 0.',
        'Know that string methods return a new value.',
      ],
      interactive: {
        example: {
          code: 'first = "ada"\nprint(first.upper())\nprint(f"Hello, {first}!")\nprint(first[0])\nprint(len(first))',
          output: 'ADA\nHello, ada!\na\n3',
          explain: '.upper() returns a caps copy, the f-string inserts first, [0] is the first letter, and len counts 3 characters.',
        },
        predicts: [
          {
            question: 'What does first[0] give?',
            options: ['the whole word', "the first letter 'a'", 'an error'],
            correct: 1,
            why: 'Indexing starts at 0, so [0] is the first character.',
          },
          {
            question: 'What is len("ada")?',
            options: ['2', '3', '4'],
            correct: 1,
            why: 'len counts the characters a, d, a, which is 3.',
          },
        ],
        tweak: {
          instruction: 'Change {first} in the f-string to {first.upper()} and run.',
          reveal: 'f-strings run the code inside the braces, so you get Hello, ADA!.',
        },
        writeDrillId: 'py-clean-name',
      },
    },
    {
      id: 'py-rung-numbers',
      title: 'Rung 5: Numbers And Math',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 9,
      prompt:
        'Use Python arithmetic: divide, floor-divide, remainder, and power.',
      explanation:
        'Python does math with +, -, *, and /. Plain / always gives a float. // is floor division: it keeps the whole part and drops the remainder. % gives the remainder. ** is power. These small operators show up constantly in real backend logic.',
      walkthrough: [
        '/ always returns a float, even 4 / 2.',
        '// keeps only the whole part.',
        '% returns the remainder.',
        '** raises to a power.',
      ],
      checklist: [
        'Tell / and // apart.',
        'Use % to get a remainder.',
        'Use ** for powers.',
      ],
      interactive: {
        example: {
          code: 'print(7 + 3)\nprint(7 / 2)\nprint(7 // 2)\nprint(7 % 2)\nprint(2 ** 3)',
          output: '10\n3.5\n3\n1\n8',
          explain: '/ gives 3.5, // drops the remainder to 3, % keeps the remainder 1, and ** is power so 2 cubed is 8.',
        },
        predicts: [
          {
            question: 'What does 7 // 2 give?',
            options: ['3.5', '3', '4'],
            correct: 1,
            why: '// is floor division: it drops the remainder and keeps the whole part, 3.',
          },
          {
            question: 'What does 7 % 2 give?',
            options: ['3', '1', '0'],
            correct: 1,
            why: '% is the remainder: 7 divided by 2 leaves 1 left over.',
          },
        ],
        tweak: {
          instruction: 'Change 2 ** 3 to 10 ** 2 and predict before you run.',
          reveal: '** is power, so 10 ** 2 is 10 squared, which is 100.',
        },
        writeDrillId: 'py-zero-total-cost',
      },
    },
    {
      id: 'py-rung-booleans',
      title: 'Rung 6: Booleans And Logic',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 9,
      prompt:
        'Combine True and False with and, or, and not.',
      explanation:
        'Comparisons like == and >= produce a bool. and is True only when both sides are True. or is True when at least one side is True. not flips a bool. This is the logic behind every permission check and branch decision.',
      walkthrough: [
        '== compares for equality and returns a bool.',
        'and needs both sides True.',
        'or needs at least one side True.',
        'not flips True to False.',
      ],
      checklist: [
        'Know and needs both sides true.',
        'Know or needs one side true.',
        'Use not to flip a boolean.',
      ],
      interactive: {
        example: {
          code: 'active = True\nrole = "admin"\nprint(active and role == "admin")\nprint(not active)\nprint(role == "user" or active)',
          output: 'True\nFalse\nTrue',
          explain: 'Both sides of line 1 are True. not active flips True to False. Line 3 is True because active is True.',
        },
        predicts: [
          {
            question: 'Is active and role == "admin" True or False?',
            options: ['True', 'False'],
            correct: 0,
            why: 'Both sides are true, and and needs both true, so the result is True.',
          },
          {
            question: 'Is role == "user" or active True or False?',
            options: ['True', 'False'],
            correct: 0,
            why: 'or is true when at least one side is true, and active is True.',
          },
        ],
        tweak: {
          instruction: 'Change active to False and re-read each line.',
          reveal: 'With active False: line 1 is False, line 2 is True, and line 3 is False because neither side is true.',
        },
        writeDrillId: 'py-zero-if-else',
      },
    },
    {
      id: 'py-rung-conditionals',
      title: 'Rung 7: If / Elif / Else',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 10,
      prompt:
        'Choose one path out of several with if, elif, and else.',
      explanation:
        'if checks a condition and runs its indented block when True. elif checks another condition only if the earlier ones failed. else runs when nothing matched. Python takes the first branch that matches and skips the rest, so order matters.',
      walkthrough: [
        'Indent the block that belongs to each branch.',
        'elif is checked only if earlier branches failed.',
        'else is the fallback when nothing matched.',
        'Only the first matching branch runs.',
      ],
      checklist: [
        'Indent the block under each branch.',
        'Explain when elif is checked.',
        'Know only the first matching branch runs.',
      ],
      interactive: {
        example: {
          code: 'score = 72\nif score >= 90:\n    grade = "A"\nelif score >= 70:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)',
          output: 'B',
          explain: '72 is not >= 90, but it is >= 70, so the elif branch sets grade to B and the else is skipped.',
        },
        predicts: [
          {
            question: 'With score 72, which branch runs?',
            options: ['the >= 90 branch', 'the >= 70 branch', 'the else branch'],
            correct: 1,
            why: '72 is not >= 90, but it is >= 70, so the elif wins and the rest is skipped.',
          },
          {
            question: 'Why is the else branch skipped here?',
            options: ['else only runs on errors', 'an earlier branch already matched', 'else needs its own if'],
            correct: 1,
            why: 'Once a branch matches, Python skips every later branch in the chain.',
          },
        ],
        tweak: {
          instruction: 'Change score to 95 and trace which branch runs.',
          reveal: '95 >= 90 is true, so grade becomes A and the elif and else are skipped.',
        },
        writeDrillId: 'py-max-of-three',
      },
    },
    {
      id: 'py-rung-lists',
      title: 'Rung 8: Lists',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt:
        'Store ordered items: index, append, length, and slicing.',
      explanation:
        'A list holds ordered items in square brackets. Index from the front with [0] or from the back with [-1]. append() adds to the end. len() counts items. A slice [1:3] takes a range, including the start and stopping before the end.',
      walkthrough: [
        'Make a list with [a, b, c].',
        '[0] is the first item; [-1] is the last.',
        'append adds to the end.',
        'A slice [1:3] stops before index 3.',
      ],
      checklist: [
        'Read items by index, including [-1].',
        'Add an item with append.',
        'Know a slice stops before its end index.',
      ],
      interactive: {
        example: {
          code: 'nums = [10, 20, 30]\nnums.append(40)\nprint(nums[0])\nprint(nums[-1])\nprint(len(nums))\nprint(nums[1:3])',
          output: '10\n40\n4\n[20, 30]',
          explain: 'append puts 40 at the end. [0] is 10, [-1] is now 40, len is 4, and the slice [1:3] is [20, 30].',
        },
        predicts: [
          {
            question: 'After append(40), what is nums[-1]?',
            options: ['10', '30', '40'],
            correct: 2,
            why: 'append adds to the end, and [-1] reads the last item, which is now 40.',
          },
          {
            question: 'What does nums[1:3] give?',
            options: ['[10, 20]', '[20, 30]', '[20, 30, 40]'],
            correct: 1,
            why: 'A slice [1:3] takes index 1 up to but not including 3, so 20 and 30.',
          },
        ],
        tweak: {
          instruction: 'Change nums[1:3] to nums[:2] and predict the result.',
          reveal: '[:2] means from the start up to index 2, so [10, 20].',
        },
        writeDrillId: 'py-build-range',
      },
    },
    {
      id: 'py-rung-loops',
      title: 'Rung 9: For And While Loops',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt:
        'Repeat work with for loops, range, and an accumulator.',
      explanation:
        'A for loop runs its block once per item. To total a list, start an accumulator at 0 and add each item. range(n) produces 0 up to but not including n. Use for when you know the items; use while when you wait for a condition to change.',
      walkthrough: [
        'for item in items repeats once per item.',
        'Start an accumulator at 0 before the loop.',
        'range(n) goes from 0 up to n minus 1.',
        'range(start, stop) starts where you say.',
      ],
      checklist: [
        'Total a list with a running accumulator.',
        'Know range(n) stops before n.',
        'Pick for when the items are known.',
      ],
      interactive: {
        example: {
          code: 'total = 0\nfor n in [1, 2, 3, 4]:\n    total = total + n\nprint(total)\n\nfor i in range(3):\n    print(i)',
          output: '10\n0\n1\n2',
          explain: 'The first loop adds 1+2+3+4 into total, giving 10. range(3) yields 0, 1, 2.',
        },
        predicts: [
          {
            question: 'What is total after the first loop?',
            options: ['4', '10', '1234'],
            correct: 1,
            why: 'Each pass adds the next number: 1 + 2 + 3 + 4 is 10.',
          },
          {
            question: 'What does range(3) produce?',
            options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3'],
            correct: 1,
            why: 'range(3) starts at 0 and stops before 3, giving 0, 1, 2.',
          },
        ],
        tweak: {
          instruction: 'Change range(3) to range(1, 4) and predict the printed numbers.',
          reveal: 'range(1, 4) starts at 1 and stops before 4, so it prints 1, 2, 3.',
        },
        writeDrillId: 'py-sum-loop',
      },
    },
    {
      id: 'py-rung-dicts',
      title: 'Rung 10: Dicts',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt:
        'Map keys to values: lookup, .get with a default, and adding keys.',
      explanation:
        'A dict maps keys to values, like a labeled box. user["name"] looks up a key and returns its value, but crashes if the key is missing. user.get("email", "none") returns a fallback instead of crashing. Assigning to a new key adds it. Dicts are how backends model records.',
      walkthrough: [
        'Make a dict with {"key": value}.',
        'Look up a value with dict["key"].',
        'Use .get(key, default) to avoid a crash.',
        'Assign a new key to add it.',
      ],
      checklist: [
        'Look up a value by key.',
        'Use .get with a default for missing keys.',
        'Add a key by assigning to it.',
      ],
      interactive: {
        example: {
          code: 'user = {"name": "Kay", "role": "admin"}\nprint(user["name"])\nprint(user.get("email", "none"))\nuser["active"] = True\nprint(user)',
          output: "Kay\nnone\n{'name': 'Kay', 'role': 'admin', 'active': True}",
          explain: 'Square brackets read the name. .get returns the fallback because email is missing. Assigning active adds a new key.',
        },
        predicts: [
          {
            question: 'What does user.get("email", "none") return?',
            options: ['an error', 'none', 'email'],
            correct: 1,
            why: 'The key email is missing, so .get returns the fallback you gave it: none.',
          },
          {
            question: 'What does user["name"] return?',
            options: ['name', 'Kay', 'admin'],
            correct: 1,
            why: 'Square brackets look up a key and return its value; name maps to Kay.',
          },
        ],
        tweak: {
          instruction: 'Change user["name"] to user["role"] and predict the output.',
          reveal: 'It looks up the role key, so it prints admin.',
        },
        writeDrillId: 'py-safe-get',
      },
    },
    {
      id: 'py-rung-functions',
      title: 'Rung 11: Functions',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt:
        'Package reusable behavior with def, parameters, defaults, and return.',
      explanation:
        'A function packages behavior you can reuse. Parameters are inputs; a default value is used when a caller leaves one out. return hands a value back so other code and tests can use it. print only shows text and cannot be tested, so logic should return.',
      walkthrough: [
        'Define with def name(params):.',
        'A default like greeting="Hello" fills in missing args.',
        'return hands the value back to the caller.',
        'Prefer return over print for logic.',
      ],
      checklist: [
        'Define a function with parameters.',
        'Use a default parameter value.',
        'Explain why return beats print for logic.',
      ],
      interactive: {
        example: {
          code: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Kay"))\nprint(greet("Sam", "Hi"))',
          output: 'Hello, Kay!\nHi, Sam!',
          explain: 'The first call uses the default greeting Hello. The second passes Hi, which replaces the default.',
        },
        predicts: [
          {
            question: 'What does greet("Kay") return?',
            options: ['Hello, Kay!', 'Kay', 'Hi, Kay!'],
            correct: 0,
            why: 'No greeting was passed, so the default Hello is used.',
          },
          {
            question: 'Why use return instead of print inside a function?',
            options: ['return is faster', 'return hands the value back so other code and tests can use it', 'print is only for errors'],
            correct: 1,
            why: 'return gives a value to the caller; print only shows text and cannot be tested.',
          },
        ],
        tweak: {
          instruction: 'Call greet() with no arguments and predict what happens.',
          reveal: 'name has no default, so Python raises a TypeError: greet needs at least a name.',
        },
        writeDrillId: 'py-zero-function-params',
      },
    },
    {
      id: 'py-rung-transform',
      title: 'Rung 12: Filter, Transform, Accumulate',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'The core data move: keep some items, change others, build a new list.',
      explanation:
        'Most real code reshapes data. Filtering keeps items that pass a test. Transforming makes a new value from each item. A list comprehension [expr for item in items] writes both moves in one readable line. This is the muscle behind nearly every backend handler.',
      walkthrough: [
        'Filter by adding only items that pass an if.',
        'Transform by computing a new value per item.',
        'A comprehension combines both in one line.',
        '% 2 == 0 is the classic even-number test.',
      ],
      checklist: [
        'Filter a list with an if inside the loop.',
        'Transform each item into a new value.',
        'Read a simple list comprehension.',
      ],
      interactive: {
        example: {
          code: 'nums = [1, 2, 3, 4, 5, 6]\nevens = []\nfor n in nums:\n    if n % 2 == 0:\n        evens.append(n)\nprint(evens)\nprint([n * n for n in evens])',
          output: '[2, 4, 6]\n[4, 16, 36]',
          explain: 'The loop keeps only even numbers. The comprehension then squares each one: 2*2, 4*4, 6*6.',
        },
        predicts: [
          {
            question: 'What ends up in evens?',
            options: ['[1, 3, 5]', '[2, 4, 6]', '[1, 2, 3, 4, 5, 6]'],
            correct: 1,
            why: 'The if keeps only numbers where n % 2 == 0, the even ones.',
          },
          {
            question: 'What does [n * n for n in evens] do?',
            options: ['filters evens again', 'squares each even number', 'sorts the list'],
            correct: 1,
            why: 'It builds a new list by squaring each item: 2*2, 4*4, 6*6.',
          },
        ],
        tweak: {
          instruction: 'Change the condition to n % 2 == 1 and predict the new evens list.',
          reveal: '== 1 keeps the odd numbers instead, so you get [1, 3, 5].',
        },
        writeDrillId: 'py-squares-even',
      },
    },
    {
      id: 'py-rung-errors',
      title: 'Rung 13: Errors And try / except',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 10,
      prompt:
        'Handle expected failures with try and except instead of crashing.',
      explanation:
        'When something goes wrong, Python raises an exception and stops. try runs risky code; except catches a specific failure and lets you recover, such as returning None. Catch expected operational failures you can handle; let real bugs surface with their message so you can fix them.',
      walkthrough: [
        'Put risky code inside try.',
        'Catch a specific error type in except.',
        'Return a safe fallback when you can recover.',
        'Do not catch errors just to hide them.',
      ],
      checklist: [
        'Wrap risky code in try.',
        'Catch a specific exception type.',
        'Know when catching is the wrong move.',
      ],
      interactive: {
        example: {
          code: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))',
          output: '5.0\nNone',
          explain: '10 / 2 succeeds and returns 5.0. 10 / 0 raises ZeroDivisionError, the except catches it, and the function returns None.',
        },
        predicts: [
          {
            question: 'What does safe_divide(10, 0) return?',
            options: ['0', 'None', 'a crash'],
            correct: 1,
            why: 'Dividing by zero raises ZeroDivisionError, the except catches it, and the function returns None.',
          },
          {
            question: 'When should you catch an exception?',
            options: ['always, to hide every error', 'when you have a useful fallback for an expected failure', 'never'],
            correct: 1,
            why: 'Catch expected failures you can handle; let real bugs surface with their message.',
          },
        ],
        tweak: {
          instruction: 'Remove the try/except and call safe_divide(10, 0).',
          reveal: 'Without the guard, Python stops and shows ZeroDivisionError: division by zero.',
        },
        writeDrillId: 'py-safe-divide',
      },
    },
    {
      id: 'py-rung-capstone',
      title: 'Rung 14: Build A Summary (0 to 1)',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Put it together: take a list of records, filter them, and return a summary.',
      explanation:
        'This is what backend code actually does: take a list of dict records from a database or API, keep the ones that matter, and build a summary to return. You now have every piece: lists, dicts, a comprehension, a filter, and len. This is the 1 in 0 to 1.',
      walkthrough: [
        'Model each record as a dict.',
        'Filter the list with a comprehension and an if.',
        'Count results with len.',
        'Return a summary dict, do not just print.',
      ],
      checklist: [
        'Filter a list of dicts by a field.',
        'Count the matches with len.',
        'Return a summary dict.',
      ],
      interactive: {
        intro: 'Everything so far was a building block. This is the shape of real backend work.',
        example: {
          code: 'users = [\n    {"name": "Kay", "active": True},\n    {"name": "Sam", "active": False},\n    {"name": "Lee", "active": True},\n]\nactive_names = [u["name"] for u in users if u["active"]]\nsummary = {"active_count": len(active_names), "names": active_names}\nprint(summary)',
          output: "{'active_count': 2, 'names': ['Kay', 'Lee']}",
          explain: 'The comprehension keeps names where active is True (Kay and Lee), then summary packages the count and the names.',
        },
        predicts: [
          {
            question: 'What is summary["active_count"]?',
            options: ['3', '2', '1'],
            correct: 1,
            why: 'Two users have active True (Kay and Lee), so the count is 2.',
          },
          {
            question: 'This pattern, looping a list of dicts to filter and summarize, is...',
            options: ['rare in real apps', 'exactly what backends do with database and API records', 'only useful for math'],
            correct: 1,
            why: 'Most backend work is shaping lists of records from a database or API into a response.',
          },
        ],
        tweak: {
          instruction: 'Change one user\'s active value and predict the new count and names.',
          reveal: 'The count and names follow whichever users have active set to True.',
        },
        writeDrillId: 'py-zero-active-summary',
      },
    },
    {
      id: 'py-zero-say-hello',
      title: 'Write It: Return A Greeting',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 8,
      prompt:
        'Write a function hello() that returns the string "Hello, world!".',
      example: 'hello() should return "Hello, world!".',
      checklist: [
        'Use def to define the function.',
        'Return the string, do not print it.',
        'Match the text exactly.',
      ],
    },
    {
      id: 'py-zero-total-cost',
      title: 'Write It: Total Cost',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 9,
      prompt:
        'Write total_cost(price, quantity) that returns price times quantity.',
      example: 'total_cost(3, 4) should return 12.',
      checklist: [
        'Take two parameters.',
        'Multiply them.',
        'Return the result.',
      ],
    },
    {
      id: 'py-zero-active-summary',
      title: 'Write It: Active User Summary',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Write summarize(users) that returns a dict with active_count and names for users whose active is True.',
      example: "summarize([{'name': 'Kay', 'active': True}, {'name': 'Sam', 'active': False}]) should return {'active_count': 1, 'names': ['Kay']}.",
      checklist: [
        'Filter the users by the active field.',
        'Collect the matching names in order.',
        'Return a dict with active_count and names.',
      ],
    },
    {
      id: 'python-zero-files-imports-run',
      title: 'Start Here: Python Files, Imports, And Running Code',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 22,
      prompt:
        'Learn how Python code exists on disk and runs: .py files, indentation, variables, functions, imports, __name__, print, return, and python file.py.',
      explanation:
        'A Python program usually lives in a .py file. Python runs the file top to bottom. Indentation creates blocks for functions, if statements, and loops. import brings in code from another module. print shows text to a human; return sends a value back to the caller. The if __name__ == "__main__" block is code that runs only when the file is executed directly.',
      production:
        'Python backend apps are many files importing each other: app setup, routes/views, services, repositories, settings, and tests. Import-time side effects are a common production trap, so beginners need to know what runs when a file is imported versus executed.',
      walkthrough: [
        'Create a file such as app.py.',
        'Declare a variable with name = value.',
        'Define a function with def name(params): and indented body.',
        'Use return for testable results and print for human debugging.',
        'Import standard-library code with import json or from pathlib import Path.',
        'Run the file with python app.py or python3 app.py.',
      ],
      example:
        'def greet(name):\n    return f"Hello, {name}"\n\nif __name__ == "__main__":\n    print(greet("Kay"))',
      questions: [
        'What does indentation mean in Python?',
        'What is the difference between importing a file and running it directly?',
        'Why is return better than print for code you want to test?',
        'What does import do?',
      ],
      checklist: [
        'Can create and run a .py file.',
        'Can define variables and functions.',
        'Can explain import and __name__.',
        'Can separate print from return.',
      ],
    },
    {
      id: 'py-zero-variable-return',
      title: 'Variables And Return',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Practice assigning names and returning a value. Return a dict with a name, count, and label.',
      example: "make_profile() should return {'name': 'backend', 'count': 2, 'label': 'backend:2'}.",
      checklist: [
        'Assign values to names.',
        'Update count before returning.',
        'Return a dict, not printed text.',
      ],
    },
    {
      id: 'py-zero-function-params',
      title: 'Function Parameters',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Write a function that accepts first_name and last_name and returns one full name string.',
      example: "full_name('Ada', 'Lovelace') should return 'Ada Lovelace'.",
      checklist: [
        'Use def with two parameters.',
        'Return a string with a space between names.',
        'Do not print inside the function.',
      ],
    },
    {
      id: 'py-zero-if-else',
      title: 'If / Else: Choose A Branch',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Write a tiny access decision function. Return "allow" when a user is active and has role admin; otherwise return "deny".',
      example: "can_access({'active': True, 'role': 'admin'}) should return 'allow'.",
      checklist: [
        'Use if/else to choose a path.',
        'Check both active and role.',
        'Return a stable string from every branch.',
      ],
    },
  ],
  flask: [
    {
      id: 'flask-zero-install-file-run',
      title: 'Start Here: Create And Run A Flask App',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 28,
      prompt:
        'Learn the absolute first Flask workflow: create a folder, install Flask, create app.py, import Flask, define a route, return text or JSON, and run the development server.',
      explanation:
        'A Flask app starts as ordinary Python code. You install the flask package, import Flask, create an app object, attach route functions with @app.get or @app.route, and run the app with flask --app app run or python app.py during learning. Flask maps an HTTP request to your Python function and turns the function return value into an HTTP response.',
      production:
        'The built-in Flask development server is for learning and local work, not production. Production uses a WSGI server such as Gunicorn. Also, Flask does not automatically validate JSON, manage your database schema, or create a service layer; those are choices you add deliberately.',
      walkthrough: [
        'Create a project folder and a virtual environment.',
        'Install Flask with pip install flask.',
        'Create app.py.',
        'Write from flask import Flask, jsonify, request.',
        'Create app = Flask(__name__).',
        'Add @app.get("/health") above a function that returns {"ok": True}.',
        'Run flask --app app run and open /health in the browser or curl.',
      ],
      example:
        'from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.get("/health")\ndef health():\n    return jsonify({"ok": True})',
      questions: [
        'What does from flask import Flask do?',
        'What is the app object?',
        'What does @app.get("/health") connect?',
        'Why is the Flask dev server not the production server?',
      ],
      checklist: [
        'Can create app.py and import Flask.',
        'Can define one route function.',
        'Can run the local Flask server.',
        'Can explain route function to HTTP response.',
      ],
    },
  ],
  django: [
    {
      id: 'django-zero-install-project-run',
      title: 'Start Here: Create And Run A Django Project',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 32,
      prompt:
        'Learn the absolute first Django workflow: install Django, create a project, run manage.py, create an app, wire a URL to a view, and run the development server.',
      explanation:
        'A Django project is a Python package with settings, URL configuration, and server entrypoints. A Django app is a feature module inside the project, such as users or billing. You create a project with django-admin startproject, run commands with python manage.py, create feature apps with startapp, map URLs in urls.py, and write views that receive a request and return a response.',
      production:
        'Django gives more structure than Flask, but you still need to know the files. settings.py controls installed apps, database, security, and middleware. urls.py maps paths to views. manage.py runs local commands. Production does not use runserver; it uses WSGI/ASGI with a real web server and production settings.',
      walkthrough: [
        'Install Django with pip install django.',
        'Run django-admin startproject config .',
        'Run python manage.py runserver to start locally.',
        'Create a feature app with python manage.py startapp core.',
        'Add core to INSTALLED_APPS in settings.py.',
        'Write a view function that returns JsonResponse.',
        'Add a path in urls.py that points to the view.',
      ],
      example:
        'from django.http import JsonResponse\n\ndef health(request):\n    return JsonResponse({"ok": True})\n\n# urls.py\npath("health/", health)',
      questions: [
        'What is the difference between a Django project and a Django app?',
        'What does manage.py do?',
        'Where do URLs get mapped to views?',
        'Why is runserver not the production server?',
      ],
      checklist: [
        'Can create a Django project and feature app.',
        'Can explain manage.py, settings.py, urls.py, and views.py.',
        'Can wire one URL to one view.',
        'Can explain dev server versus production server.',
      ],
    },
  ],
}
