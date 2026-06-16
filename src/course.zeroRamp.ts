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
      title: 'Module 1: Run Code And Print',
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
        coldOpen:
          'print("2" + "2") does not print 4. It prints 22. Before you write a line of backend Python, you need to feel why, because that one quirk is behind a surprising number of real bugs. Let us run it and see.',
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
        build: {
          simple: 'print shows things and + adds.',
          actually:
            'Code runs top to bottom, one line at a time. + does math on numbers but joins strings end to end, so the quotes around a value decide whether + adds or concatenates.',
          breaks:
            'Numbers arriving as text (from a form, a URL, JSON) make + silently concatenate instead of add. "2" + "2" is "22", and a total quietly becomes nonsense with no error.',
        },
        doThisNow: [
          {
            task: 'Run both versions back to back in your terminal and watch + change behavior with quotes.',
            command: 'python3 -c \'print(2 + 2); print("2" + "2")\'',
            reveal:
              'First line prints 4 (math on numbers); second prints 22 (text joined). Same operator, opposite jobs, decided entirely by the quotes.',
          },
          {
            task: 'Make it greet you by name, joining two strings with +.',
            command: 'python3 -c \'print("Hi, " + "your-name")\'',
            reveal:
              'You get Hi, your-name. + on two strings joins them; the quotes mark where each piece of text begins and ends.',
          },
        ],
        warStory:
          'A checkout added a shipping fee to an item price and charged wildly wrong totals. Both values had arrived as strings from the form, so + concatenated: "10" + "5" became "105" dollars. One missing conversion, no error, real refunds.',
        tweak: {
          instruction: 'Change "Hello, world!" to your own name in quotes, then run it again.',
          reveal: 'print shows whatever text is inside the quotes. The quotes just mark where the text starts and ends.',
        },
        receipt: {
          explain: [
            'Code runs top to bottom and print shows a value.',
            'Why + adds numbers but joins strings.',
          ],
          command: 'python3 -c \'print("2" + "2")\'',
          question: 'Quotes changed everything. How do you ask Python what type a value really is?',
        },
        writeDrillId: 'py-zero-say-hello',
      },
    },
    {
      id: 'py-rung-types',
      title: 'Module 2: Values And Types',
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
        coldOpen:
          'An id arrives from a web address as the text "42", you compare it to the number 42, and the check quietly fails: they are different types. Type confusion is the classic Python beginner bug. The tool that saves you is one function you can run on any value. What is it?',
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
        build: {
          simple: 'Every value has a type.',
          actually:
            'int is a whole number, float has a decimal point, str is text in quotes, bool is True/False. The type decides what you can do with a value, and type(x) reports it. "42" with quotes is a str even though it looks numeric.',
          breaks:
            'Mixing types is a top beginner bug: a string "42" from a URL compared to the number 42 is never equal, so a lookup silently fails. type() at the boundary catches it before the bug does.',
        },
        doThisNow: [
          {
            task: 'Check four types at once, then the famous trap: is the string "42" equal to the number 42?',
            command: 'python3 -c \'print(type(42), type(3.14), type("42")); print("42" == 42)\'',
            reveal:
              'int, float, str, then False. The quoted "42" is a str, so it is never equal to the int 42. This is the single most common type bug in request handling.',
          },
          {
            task: 'Change a float to an int and watch the type flip: print type(3.14) then type(3).',
            command: 'python3 -c \'print(type(3.14)); print(type(3))\'',
            reveal:
              "float then int. The decimal point is the whole difference: 3.14 is a float, 3 is an int. Same digit, different type.",
          },
        ],
        warStory:
          'An API treated a product id from the query string as a number without converting it. Every lookup compared "42" == 42, always False, so valid products returned 404. A single type() check would have shown the string in seconds.',
        tweak: {
          instruction: 'Change 3.14 to 3 and run. Watch the type change.',
          reveal: '3.14 has a decimal point so it is a float; 3 has none so it is an int.',
        },
        receipt: {
          explain: [
            'The four everyday types and what quotes do to a value.',
            'How type() reveals a number wearing string quotes.',
          ],
          command: 'python3 -c \'print(type("42"))\'',
          question: 'You can see a value\'s type. How do you give that value a name to reuse?',
        },
        writeDrillId: 'py-zero-variable-return',
      },
    },
    {
      id: 'py-rung-variables',
      title: 'Module 3: Variables',
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
        coldOpen:
          'count = count + 1 looks like it says "count equals count plus one," which is impossible. It is not an equation; it is an instruction: compute the right side first with the old value, then store the result back. Get this one idea and every counter and accumulator you ever write makes sense. Trace it.',
        mental:
          'A variable is a name tag on a box: assignment moves the tag to a new box, and the old box just loses its tag.',
        diagram: {
          nodes: ['name = value', 'Right side first', 'Re-tag', 'Old value dropped'],
          explanations: [
            'Assignment binds a name to a value. The name is the tag; the value is the box.',
            'In count = count + 1, the right side computes first using the current value.',
            'The result gets the tag: count now points at the new value.',
            'Nothing points at the old value anymore, and Python cleans it up. Names move; values never change in place.',
          ],
        },
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
        build: {
          simple: 'A variable is a name for a value.',
          actually:
            'name = value binds a name to a value, and you can repoint it any time. Assignment is not an equation: the right side is computed first (using the current value), then the result is stored back into the name. Values never change in place; names just move.',
          breaks:
            'Reading count = count + 1 as an equation ("count equals count plus 1") makes no sense and stalls beginners. As an instruction (evaluate right, then store) it is the foundation of every loop counter and running total.',
        },
        doThisNow: [
          {
            task: 'Trace a counter by running it: start count at 1, do count = count + 1, and print it.',
            command: 'python3 -c \'count = 1; count = count + 1; print(count)\'',
            reveal:
              'Prints 2. The right side (1 + 1) computed with the old value first, then 2 was stored back into count. That is every accumulator you will ever write.',
          },
          {
            task: 'Repoint a name: set name to "Kay", then reassign it to "Sam" before printing.',
            command: 'python3 -c \'name = "Kay"; name = "Sam"; print(name)\'',
            reveal:
              'Prints Sam. Reassigning moved the name tag to a new value; the old "Kay" is simply dropped. A name points at a value you can replace.',
          },
        ],
        warStory:
          'A beginner wrote total = total + price inside a loop but reset total = 0 inside the loop too, so it forgot every previous item and ended equal to the last price. Understanding that assignment evaluates-then-stores (and where to put the reset) is what makes accumulators reliable.',
        tweak: {
          instruction: 'Add a line name = "Sam" just before print and run.',
          reveal: 'Reassigning repoints the name, so print shows the latest value, Sam.',
        },
        receipt: {
          explain: [
            'Why assignment is an instruction, not an equation.',
            'How count = count + 1 evaluates then stores.',
          ],
          command: 'python3 -c \'c=1; c=c+1; print(c)\'',
          question: 'You can name values. How do you build and reshape text, the thing backends handle most?',
        },
        writeDrillId: 'py-zero-variable-return',
      },
    },
    {
      id: 'py-rung-strings',
      title: 'Module 4: Strings',
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
        coldOpen:
          'You call email.strip() to clean up a signup, save the user, and the spaces are still there. The method ran. The result was thrown away, because Python strings never change in place. Forgetting that quietly ships dirty data. Watch it happen, then learn the clean way to build text.',
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
        build: {
          simple: 'You build and tidy text with string tools.',
          actually:
            'f-strings (f"Hello, {name}") drop values into text. [0] reads a character, len() counts them. Methods like .upper() and .strip() return a NEW string and leave the original alone, so you must use the return value.',
          breaks:
            'Calling a method and discarding its result does nothing: email.strip() alone leaves the spaces; you need email = email.strip(). Strings are immutable, so "in place" edits silently no-op.',
        },
        doThisNow: [
          {
            task: 'Prove immutability: strip() a string without capturing it, then with. Watch the difference.',
            command: 'python3 -c \'e = "  a@b.com  "; e.strip(); print("["+e+"]"); e = e.strip(); print("["+e+"]")\'',
            reveal:
              'The first print still shows the spaces; the method returned a clean copy you ignored. The second is trimmed because you stored the result. Always assign what a string method returns.',
          },
          {
            task: 'Compute inside an f-string: print f"Hello, {first.upper()}!".',
            command: 'python3 -c \'first = "ada"; print(f"Hello, {first.upper()}!")\'',
            reveal:
              'Prints Hello, ADA!. f-string braces run any expression, including method calls, which is why they replaced clumsy + concatenation.',
          },
        ],
        warStory:
          'A signup normalized emails with email.lower() but forgot to assign it back. Users who typed Kay@Site.com and kay@site.com became two separate accounts, and the "already exists" check missed the duplicate. One missing assignment, weeks of confused support tickets.',
        tweak: {
          instruction: 'Change {first} in the f-string to {first.upper()} and run.',
          reveal: 'f-strings run the code inside the braces, so you get Hello, ADA!.',
        },
        receipt: {
          explain: [
            'How f-strings build text and why strings are immutable.',
            'Why a string method\'s result must be assigned to be kept.',
          ],
          command: 'python3 -c \'s=" a "; print("["+s.strip()+"]")\'',
          question: 'Text is handled. Why does adding two numbers from a form sometimes give the wrong total?',
        },
        writeDrillId: 'py-clean-name',
      },
    },
    {
      id: 'py-rung-numbers',
      title: 'Module 5: Numbers And Math',
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
        coldOpen:
          'In Python, 7 / 2 is 3.5, but 7 // 2 is 3. One slash versus two changes the answer, and reaching for the wrong one quietly corrupts totals and averages. There are a few small operators here that show up constantly in real backend logic. What does each do?',
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
        build: {
          simple: 'Python does math with the usual operators.',
          actually:
            '/ always returns a float (even 4 / 2 is 2.0), // is floor division (drops the remainder), % is the remainder, ** is power. These small operators drive real logic: % for even/odd and batching, // for paging, ** for growth.',
          breaks:
            'Mixing up / and // corrupts results: use / where you needed a whole number and you carry a stray .0; use // where you needed the fraction and you silently drop it. Pick the one that matches the answer you want.',
        },
        doThisNow: [
          {
            task: 'Run all five operators on 7 (and 2 ** 3) and read each result. Note how / and // differ.',
            command: 'python3 -c \'print(7/2, 7//2, 7%2, 2**3)\'',
            reveal:
              '3.5, 3, 1, 8. / keeps the fraction, // drops it, % is the leftover, ** is power. Reaching for the right one is the whole skill.',
          },
          {
            task: 'Use % for an even/odd check: print whether 7 and 10 are even.',
            command: 'python3 -c \'print(7 % 2 == 0, 10 % 2 == 0)\'',
            reveal:
              'False, True. n % 2 == 0 is the canonical even test, and % shows up everywhere: wrap-around indexing, batching every Nth item, alternating rows.',
          },
        ],
        warStory:
          'A pagination helper used / instead of // to compute the page count and got 3.5 pages, which crashed when used as an index. Floor division (//) was the fix. Choosing / vs // deliberately is a small habit that prevents a class of off-by-fraction bugs.',
        tweak: {
          instruction: 'Change 2 ** 3 to 10 ** 2 and predict before you run.',
          reveal: '** is power, so 10 ** 2 is 10 squared, which is 100.',
        },
        receipt: {
          explain: [
            'What /, //, %, and ** each do.',
            'Why choosing / vs // deliberately avoids subtle bugs.',
          ],
          command: 'python3 -c \'print(7/2, 7//2, 7%2)\'',
          question: 'Numbers are safe. How do you combine true/false conditions to make decisions?',
        },
        writeDrillId: 'py-zero-total-cost',
      },
    },
    {
      id: 'py-rung-booleans',
      title: 'Module 6: Booleans And Logic',
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
        coldOpen:
          'Every permission check, validation rule, and branch in a backend comes down to combining True and False with and, or, not. Get the words in the wrong order in an access check and you have a security hole. These three words are small, but the logic they build is where real bugs (and breaches) hide.',
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
        build: {
          simple: 'Combine conditions with and, or, not.',
          actually:
            'Comparisons (==, >=, etc.) produce a bool. and is True only when both sides are True; or is True when at least one is; not flips it. This is the logic behind every permission check and branch.',
          breaks:
            'Order and grouping decide meaning: active and is_owner or is_admin is not the same as active and (is_owner or is_admin). In an access check, the wrong grouping silently lets the wrong people in.',
        },
        doThisNow: [
          {
            task: 'Run the three boolean lines, then flip active to False and predict each before rerunning.',
            command: 'python3 -c \'active=True; role="admin"; print(active and role=="admin", not active, role=="user" or active)\'',
            reveal:
              'True False True. With active=False it becomes False True False, because line 1 needs both sides and line 3 has neither true. Re-reading boolean lines carefully is how access bugs get caught.',
          },
          {
            task: 'See why grouping matters: compare True and False or True with True and (False or True).',
            command: 'python3 -c \'print(True and False or True); print(True and (False or True))\'',
            reveal:
              'Both happen to print True here, but the evaluation differs, and with other values they diverge. In a real permission check, parentheses are the difference between a gate and a hole.',
          },
        ],
        warStory:
          'An access check read active and is_owner or is_admin with no parentheses. Python grouped it as (active and is_owner) or is_admin, so any admin flag bypassed the active check, including deactivated admins. One pair of parentheses separated a gate from a backdoor.',
        tweak: {
          instruction: 'Change active to False and re-read each line.',
          reveal: 'With active False: line 1 is False, line 2 is True, and line 3 is False because neither side is true.',
        },
        receipt: {
          explain: [
            'What and, or, and not each require.',
            'Why grouping conditions correctly matters in access checks.',
          ],
          command: 'python3 -c \'print(True and (False or True))\'',
          question: 'You can evaluate a condition. How do you take different paths based on it?',
        },
        writeDrillId: 'py-zero-if-else',
      },
    },
    {
      id: 'py-rung-conditionals',
      title: 'Module 7: If / Elif / Else',
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
        coldOpen:
          'A login check tests if subscribed before if banned, and a banned subscriber walks right in. Both conditions were correct; the order was the bug. Python takes the first branch that matches and skips the rest, so the order of an if/elif chain IS the logic. Where does order silently decide who gets in?',
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
        build: {
          simple: 'if / elif / else picks a path.',
          actually:
            'if runs its indented block when its condition is True; elif is checked only if earlier branches failed; else is the fallback. Python takes the first matching branch and skips the rest, so order conditions from most specific to least.',
          breaks:
            'A broad condition placed before a narrow one swallows the narrow one\'s inputs. In authorization that is a security hole: check banned before subscribed, or a banned subscriber slips through the subscriber branch.',
        },
        doThisNow: [
          {
            task: 'See order decide the result with a one-line conditional expression: a 95 scored against >= 70 first, then >= 90.',
            command: 'python3 -c \'s=95; print("B" if s>=70 else "A" if s>=90 else "C")\'',
            reveal:
              'B. The broad >= 70 matched first, so the A case is unreachable, exactly like a misordered if/elif chain. Order is logic, not formatting.',
          },
          {
            task: 'Predict the original (most-specific-first) chain: with score 95, which grade, and why are elif/else skipped?',
            reveal:
              'A. 95 >= 90 matches first, so grade is A and every later branch is skipped. Most-specific-first ordering is what keeps each branch reachable.',
          },
        ],
        warStory:
          'A pricing tier check listed the cheapest-plan condition first. Because every paying customer also satisfied it, everyone was billed at the lowest tier and revenue leaked for a month. The conditions were all correct; reordering them most-specific-first fixed it in one commit.',
        tweak: {
          instruction: 'Change score to 95 and trace which branch runs.',
          reveal: '95 >= 90 is true, so grade becomes A and the elif and else are skipped.',
        },
        receipt: {
          explain: [
            'Why the first matching branch wins and the rest are skipped.',
            'Why condition order is a correctness (and security) decision.',
          ],
          question: 'You can branch on one value. How do you store and process many values at once?',
        },
        writeDrillId: 'py-max-of-three',
      },
    },
    {
      id: 'py-rung-lists',
      title: 'Module 8: Lists',
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
        coldOpen:
          'A list is where backend data lives: rows from a database, items in a cart, messages to process. Python lets you read from the back with [-1] and slice ranges, which is elegant until an off-by-one in a slice quietly returns the wrong window. Where do index 0, index -1, and slice boundaries actually land?',
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
        build: {
          simple: 'A list holds ordered items.',
          actually:
            'Index from the front with [0] or the back with [-1]. append() adds to the end, len() counts items, and a slice [1:3] takes a range that includes the start and stops before the end. Python lists grow freely, unlike fixed arrays in some languages.',
          breaks:
            'The slice rule (start included, end excluded) is the off-by-one trap: [1:3] gives two items, not three. And [-1] is the last item, so reaching for [len(nums)] instead throws an index error.',
        },
        doThisNow: [
          {
            task: 'Run the list operations and read each result. Note that the slice [1:3] gives two items, not three.',
            command: 'python3 -c \'nums=[10,20,30]; nums.append(40); print(nums[0], nums[-1], len(nums), nums[1:3])\'',
            reveal:
              '10 40 4 [20, 30]. append put 40 at the end, [-1] reads it, and the slice stops before index 3, so it returns [20, 30]: start included, end excluded.',
          },
          {
            task: 'Predict then check: change the slice to nums[:2]. What does it return and why?',
            command: 'python3 -c \'nums=[10,20,30,40]; print(nums[:2])\'',
            reveal:
              '[10, 20]. An empty start means "from the beginning," up to but not including index 2. The end is always excluded.',
          },
        ],
        warStory:
          'A "show the next item" feature read results[page_size] to peek ahead for a has-more flag. On the last page that index was past the end, throwing IndexError mid-render. Slicing (results[page_size:page_size+1]) returns an empty list safely instead of crashing.',
        tweak: {
          instruction: 'Change nums[1:3] to nums[:2] and predict the result.',
          reveal: '[:2] means from the start up to index 2, so [10, 20].',
        },
        receipt: {
          explain: [
            'How [0], [-1], append, and slices behave.',
            'Why a slice excludes its end index.',
          ],
          command: 'python3 -c \'print([10,20,30][1:3])\'',
          question: 'You can hold a list. How do you visit every item in it?',
        },
        writeDrillId: 'py-build-range',
      },
    },
    {
      id: 'py-rung-loops',
      title: 'Module 9: For And While Loops',
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
        coldOpen:
          'range(3) gives 0, 1, 2, not 1, 2, 3 and not 0, 1, 2, 3. That off-by-one boundary is the most famous mistake in programming, and Python puts it right in your first loop. Master the loop and the accumulator pattern and you can sum, count, and collect anything. Where exactly does range stop?',
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
        build: {
          simple: 'Loops repeat work.',
          actually:
            'A for loop runs its block once per item. The accumulator pattern (start a total at 0 before the loop, add inside, use after) powers summing, counting, and collecting. range(n) yields 0 up to but not including n; range(start, stop) starts where you say. Use while when you wait for a condition.',
          breaks:
            'range\'s exclusive stop is the off-by-one home: range(3) is 0,1,2, so range(len(items)) is exactly the valid indices and range(len(items)+1) walks off the end. And a while whose body never changes its condition loops forever.',
        },
        doThisNow: [
          {
            task: 'Run the accumulator and a range loop, and confirm range(3) prints 0, 1, 2 (not 1, 2, 3).',
            command: 'python3 -c \'t=0\\nfor n in [1,2,3,4]: t+=n\\nprint(t)\\nfor i in range(3): print(i)\'',
            reveal:
              '10, then 0 1 2. The accumulator folded the list into 10; range(3) stopped before 3. If the \\n is awkward in your shell, paste it into a file: the boundary is the lesson.',
          },
          {
            task: 'Predict the shift: change range(3) to range(1, 4). What prints, and why?',
            reveal:
              '1, 2, 3. range(start, stop) begins at start and stops before stop, so 1 up to (not including) 4. Both ends follow the exclusive-stop rule.',
          },
        ],
        warStory:
          'A migration looped with for i in range(len(items) + 1) and read items[i], walking one past the end on every run and throwing IndexError mid-batch. range(len(items)) is exactly the valid indices. One +1 was the difference between a clean run and nightly pages.',
        tweak: {
          instruction: 'Change range(3) to range(1, 4) and predict the printed numbers.',
          reveal: 'range(1, 4) starts at 1 and stops before 4, so it prints 1, 2, 3.',
        },
        receipt: {
          explain: [
            'The accumulator pattern and where off-by-one lives.',
            'Exactly where range starts and stops.',
          ],
          command: 'python3 -c \'print(list(range(3)))\'',
          question: 'Lists are ordered by position. How do you look things up by a key instead?',
        },
        writeDrillId: 'py-sum-loop',
      },
    },
    {
      id: 'py-rung-dicts',
      title: 'Module 10: Dicts',
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
        coldOpen:
          'Reading user["email"] for a key that is not there does not return nothing in Python. It raises KeyError and crashes the request. This is a top beginner crash, usually from assuming an optional field always arrives. A dict is basically a JSON object, so this is the same skill as handling an optional API field. What is the safe way to read?',
        mental:
          'A dict is a row of labeled boxes: square brackets demand the box exists, .get peeks politely and brings a fallback.',
        diagram: {
          nodes: ['Key: value', '[] lookup', '.get fallback', 'Assign adds'],
          explanations: [
            'Each entry maps a key to a value: the record shape of Python, and what JSON objects become.',
            'user["name"] returns the value or raises KeyError when the key is absent. Loud and immediate.',
            'user.get("email", "none") returns the fallback instead of raising: the polite read for optional fields.',
            'Assigning to a new key adds it; assigning to an existing key overwrites. Keys stay unique.',
          ],
        },
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
        build: {
          simple: 'A dict maps keys to values.',
          actually:
            'Each entry maps a key to a value: the record shape of Python, and what JSON objects become. user["name"] reads a key (or raises KeyError if missing). user.get("email", "none") returns a fallback instead of raising. Assigning a new key adds it; an existing key overwrites.',
          breaks:
            'A [] read on a missing key raises KeyError and crashes, a top beginner mistake from assuming optional fields are always present. .get with a default is the polite read for anything that might be absent.',
        },
        doThisNow: [
          {
            task: 'Read a missing key two ways: with [] (crashes) and with .get (safe). Compare.',
            command: 'python3 -c \'u={"name":"Kay"}; print(u.get("email","none")); print(u["email"])\'',
            reveal:
              'First prints "none"; the second raises KeyError and stops. .get with a fallback is why it dominates real handler code that reads optional fields.',
          },
          {
            task: 'Predict: assigning u["role"] = "viewer" when role already exists. Add a key or overwrite?',
            reveal:
              'Overwrites. Keys are unique, so assigning to an existing key replaces its value; assigning a brand-new key adds it.',
          },
        ],
        warStory:
          'A handler read request data with body["address"], assuming it was always sent. Requests that omitted it raised KeyError, so instead of a clean 400 the service threw a 500 and polluted error dashboards. Switching to body.get("address") turned a crash into a handled missing-field case.',
        tweak: {
          instruction: 'Change user["name"] to user["role"] and predict the output.',
          reveal: 'It looks up the role key, so it prints admin.',
        },
        receipt: {
          explain: [
            'Why a [] read on a missing key crashes and what .get does.',
            'Why a dict is the right model for a JSON object.',
          ],
          command: 'python3 -c \'print({"a":1}.get("b","none"))\'',
          question: 'You can store and look up data. How do you package reusable behavior that acts on it?',
        },
        writeDrillId: 'py-safe-get',
      },
    },
    {
      id: 'py-rung-functions',
      title: 'Module 11: Functions',
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
        coldOpen:
          'A function that prints its answer is almost useless to other code; a function that returns its answer can be tested, stored, and reused. That one distinction (return, not print) is what makes code testable at all, and it is the line between a script and a system. Feel the difference.',
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
        build: {
          simple: 'A function packages reusable behavior.',
          actually:
            'def name(params): defines it. Parameters are inputs; a default (greeting="Hello") fills in when a caller omits one. return hands a value back so other code and tests can use it. A function with no return gives None.',
          breaks:
            'A function that prints instead of returning cannot be tested or composed: callers get None. Logic returns; only the edges of the program print. And a required parameter with no default raises TypeError if a caller forgets it.',
        },
        doThisNow: [
          {
            task: 'Prove return gives a usable value while print does not. Run a returning lambda, add 1 to its result, then compare to print.',
            command: 'python3 -c \'sq = lambda x: x*x; print("usable:", sq(6) + 1); print("printed:", print(6*6))\'',
            reveal:
              'usable: 37, then printed: 36 followed by "printed: None": print returns None, so it cannot be reused, while the returning function\'s value can be added to and passed on. Logic returns; only edges print.',
          },
          {
            task: 'Predict the error: call greet() with no arguments. What happens and why?',
            reveal:
              'TypeError: greet is missing the required name argument, which has no default. Required parameters must be supplied; defaults are for the optional ones.',
          },
        ],
        warStory:
          'A validation helper printed "invalid" instead of returning False. Callers checked its return value, always got None (falsy by accident), and treated everything as valid. Bad data sailed through for weeks. The fix was one word: return where it had been printing.',
        tweak: {
          instruction: 'Call greet() with no arguments and predict what happens.',
          reveal: 'name has no default, so Python raises a TypeError: greet needs at least a name.',
        },
        receipt: {
          explain: [
            'How parameters, defaults, and return work.',
            'Why returning a value beats printing it.',
          ],
          command: 'python3 -c \'sq = lambda x: x*x; print(sq(6))\'',
          question: 'You can write functions. How do you keep some items, change others, and build a new list in one move?',
        },
        writeDrillId: 'py-zero-function-params',
      },
    },
    {
      id: 'py-rung-transform',
      title: 'Module 12: Filter, Transform, Accumulate',
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
        coldOpen:
          'Almost every backend handler does the same thing: keep some items, change others, build a new list. Python writes all three in one readable line, the list comprehension, that replaces a loop, an if, and an append. This is the muscle behind nearly every endpoint. How does the one-liner work?',
        mental:
          'A comprehension is the sieve and the paint sprayer in one line: choose with the if, transform with the expression.',
        diagram: {
          nodes: ['List', 'if filters', 'Expression maps', 'New list'],
          explanations: [
            'The source list flows in unchanged; comprehensions always build a new list.',
            'The trailing if keeps only items where the test is true.',
            'The leading expression decides what each survivor becomes: n * n turns values into squares.',
            'The result is a fresh list, ready to chain or return. This one line replaces a loop, an if, and an append.',
          ],
        },
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
        build: {
          simple: 'Reshape a list by keeping and changing items.',
          actually:
            'Filtering keeps items that pass a test; transforming makes a new value from each. A list comprehension [expr for item in items if test] does both in one line: the if filters, the expression maps, and a fresh list comes out. It replaces a loop plus an if plus an append.',
          breaks:
            'Comprehensions always build a NEW list; the source is untouched. Mixing up the filter (which items) and the expression (what each becomes) is the usual slip, as is cramming so much logic in that it stops being readable.',
        },
        doThisNow: [
          {
            task: 'Filter then transform in one comprehension: from 1..6, keep evens and square them.',
            command: 'python3 -c \'print([n*n for n in range(1,7) if n % 2 == 0])\'',
            reveal:
              '[4, 16, 36]. The if kept 2, 4, 6; the expression squared each. One line did the work of a loop, a condition, and an append.',
          },
          {
            task: 'Flip the test to n % 2 == 1 and predict the result before running.',
            command: 'python3 -c \'print([n for n in range(1,7) if n % 2 == 1])\'',
            reveal:
              '[1, 3, 5]. Changing the filter test from even to odd changes which items survive; the rest of the comprehension is untouched.',
          },
        ],
        warStory:
          'A report summed revenue from paid orders with a hand-written loop, an if, an accumulator, and an off-by-one. The rewrite was sum(o["amount"] for o in orders if o["paid"]): one readable line, no boundary to get wrong. Comprehensions are how Python backends express the keep-and-transform move.',
        tweak: {
          instruction: 'Change the condition to n % 2 == 1 and predict the new evens list.',
          reveal: '== 1 keeps the odd numbers instead, so you get [1, 3, 5].',
        },
        receipt: {
          explain: [
            'How a list comprehension filters and transforms in one line.',
            'Why it always builds a new list and never mutates the source.',
          ],
          command: 'python3 -c \'print([n*n for n in range(1,7) if n%2==0])\'',
          question: 'Code can fail mid-operation. How does Python signal and handle errors?',
        },
        writeDrillId: 'py-squares-even',
      },
    },
    {
      id: 'py-rung-errors',
      title: 'Module 13: Errors And try / except',
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
        coldOpen:
          'The most tempting line in error handling is a bare except: that makes the crash go away. It also swallows every real bug and hides the message that would have told you what broke. Handling errors well is a discipline: catch what you can recover from, and let real bugs surface. When do you catch, and when do you let it fly?',
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
        build: {
          simple: 'try/except handles errors.',
          actually:
            'When something goes wrong, Python raises an exception and stops. try runs risky code; except catches a specific type and lets you recover (return None, a fallback, a clean error). Catch expected, recoverable failures; let real bugs surface with their message.',
          breaks:
            'A bare except: swallows everything, including real bugs, and hides the traceback you need to fix them. Catch the specific exception you can handle (ZeroDivisionError, KeyError); an unexpected one should crash loudly where you can see it.',
        },
        doThisNow: [
          {
            task: 'Run safe_divide(10, 0) (returns None), then try the bare division to see the crash it prevents.',
            command: 'python3 -c \'print(10 / 0)\'',
            reveal:
              'ZeroDivisionError: division by zero, and the program stops. Inside try/except that becomes a recoverable None. The except turned a crash into a handled case.',
          },
          {
            task: 'Decide: should you catch the error from int("abc"), or from a genuine logic bug like calling a function that does not exist? Why the difference?',
            reveal:
              'Catch int("abc") (a ValueError you expect from bad user input and can handle). Do NOT catch the missing-function bug: that is a programming error you want to surface loudly and fix, not hide.',
          },
        ],
        warStory:
          'A service wrapped its whole handler in try/except: pass. Every failure (database down, a null bug, bad input) was silently swallowed and returned empty data. Monitoring stayed green while customers saw blank pages for two days. Removing the blanket except surfaced the real errors instantly.',
        tweak: {
          instruction: 'Remove the try/except and call safe_divide(10, 0).',
          reveal: 'Without the guard, Python stops and shows ZeroDivisionError: division by zero.',
        },
        receipt: {
          explain: [
            'How try/except recovers from a specific, expected failure.',
            'Why a bare except that hides everything is dangerous.',
          ],
          command: 'python3 -c \'print(10 / 0)\'',
          question: 'You know every Python building block. Can you combine them into one real program that turns records into a summary?',
        },
        writeDrillId: 'py-safe-divide',
      },
    },
    {
      id: 'py-rung-capstone',
      title: 'Module 14: Build A Summary (0 to 1)',
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
        coldOpen:
          'Here is what a real backend endpoint does: take a list of records, keep the ones that matter, and return a summary. The program below is exactly that, built from nothing but the pieces you just learned. Swap the list for a database query and it is production code. When you can edit it confidently, you are at 1.',
        mental:
          'Records in, pipeline through, summary out: the same assembly line as every backend in every language.',
        diagram: {
          nodes: ['List of dicts', 'Filter', 'Project', 'Summary dict'],
          explanations: [
            'The input mirrors a database result or parsed JSON: a list of records with named fields.',
            'The if clause keeps the records that matter: the business rule in one expression.',
            'The expression extracts what the response needs: just the names.',
            'A dict packages the count and the list: serialized, this is a JSON API response.',
          ],
        },
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
        build: {
          simple: 'Take records and produce a summary.',
          actually:
            'A list of dict records (a database result or parsed JSON) flows through a comprehension that filters by the business rule (if u["active"]) and projects the needed field (u["name"]), then a summary dict packages the count and the list. Serialized, that dict is a JSON API response.',
          breaks:
            'The business rule lives entirely in the if; one change flips it. Confusing the filter (which records) with the projection (which field) is where these pipelines go wrong.',
        },
        doThisNow: [
          {
            task: 'Run the full endpoint logic and read the summary it produces.',
            command: 'python3 -c \'users=[{"name":"Kay","active":True},{"name":"Sam","active":False},{"name":"Lee","active":True}]; a=[u["name"] for u in users if u["active"]]; print({"active_count":len(a),"names":a})\'',
            reveal:
              "{'active_count': 2, 'names': ['Kay', 'Lee']}. The comprehension filtered to active users and projected their names; the dict packaged the result. That is a list endpoint in three lines.",
          },
          {
            task: 'Flip the business rule with one change: filter for inactive users instead and rerun.',
            command: 'python3 -c \'users=[{"name":"Kay","active":True},{"name":"Sam","active":False},{"name":"Lee","active":True}]; a=[u["name"] for u in users if not u["active"]]; print({"count":len(a),"names":a})\'',
            reveal:
              "{'count': 1, 'names': ['Sam']}. One word (not) rewrote the entire business rule, and the rest of the pipeline held. That is the power of separating the rule (filter) from the shape (projection).",
          },
        ],
        warStory:
          'A new engineer shipped their first endpoint on day two: filter active accounts, project the public fields, return the summary dict as JSON. Code review had nothing to add, because it was the exact skeleton from this lesson. Recognizing that pattern is what "0 to 1" actually means.',
        tweak: {
          instruction: 'Change one user\'s active value and predict the new count and names.',
          reveal: 'The count and names follow whichever users have active set to True.',
        },
        receipt: {
          explain: [
            'How a comprehension and a dict compose into a list endpoint.',
            'Why the filter is where the business rule lives.',
          ],
          command: 'python3 -c \'print([n for n in [1,2,3] if n>1])\'',
          question: 'You are at 1 in Python. Which backend concept do you want to build next?',
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
