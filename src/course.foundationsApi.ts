import type { Problem } from './course'

// API design from absolute zero: what an API is, how to shape routes, errors,
// validation, and pagination. Builds directly on the HTTP foundations ladder.

export const apiFoundations: Problem[] = [
  {
    id: 'api-rung-what-is-an-api',
    title: 'Module 1: What Is An API?',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 11,
    prompt: 'Understand an API as a contract: agreed requests in, agreed responses out.',
    explanation: `API stands for Application Programming Interface, and the useful translation is: a menu. A restaurant menu lists what you can order and what you will get; you cannot order off-menu, and the kitchen's mess stays hidden. An API does the same for software.

**The contract.** An API documents which requests a server accepts (methods, paths, body shapes) and which responses it returns (codes, body shapes). Clients build against the contract without ever seeing the server's code, database, or language.

**Why contracts matter.** The mobile team, the web team, and a partner company can all integrate against the same documented surface while the backend team rewrites internals freely. The contract is the boundary that lets teams work in parallel, which is most of why APIs exist.

**Design is deciding the menu.** Everything in this ladder (routes, errors, validation, pagination) is choosing contract details that stay pleasant after years of growth. Good API design is empathy for a stranger integrating at 2am with nothing but your docs.`,
    production:
      'Breaking the contract breaks every client at once, which is why changing a published API field is a versioning event with migration plans. Teams that treat the contract casually spend their lives on integration support tickets.',
    walkthrough: [
      'Say the definition: an API is a documented request/response contract.',
      'Name what the contract hides (code, database, internals).',
      'Name two clients that could share one API.',
    ],
    questions: [
      'What does the menu analogy capture about APIs?',
      'Why can the backend change its database without telling clients?',
    ],
    checklist: [
      'Define an API as a contract.',
      'Explain what it hides and what it exposes.',
      'Give an example of two clients sharing one API.',
    ],
    interactive: {
      coldOpen:
        'Your backend team rewrites the entire service from Python to C# over a weekend. Not a single client app changes a line of code, and nobody notices. How is that possible? One idea makes it work, and breaking it is how you take down every client at once.',
      mental:
        'An API is a restaurant menu: you can only order what is listed, the kitchen chaos stays hidden, and changing the menu surprises every regular at once.',
      diagram: {
        nodes: ['Client', 'Contract', 'Hidden internals', 'Response'],
        explanations: [
          'Any program that sends requests: a browser app, a mobile app, a partner server. All of them read the same menu.',
          'The documented surface: which methods and paths exist, what bodies they take, what responses they return. This is what API design designs.',
          'The database, the language, the framework, the messy refactors: invisible behind the contract, free to change any time.',
          'The agreed shape comes back: status code plus JSON body. Clients build against this and nothing else.',
        ],
      },
      example: {
        code: '# The contract for one endpoint, written as docs:\nGET /users/{id}',
        output:
          'Request:  GET /users/42        (no body)\nSuccess:  200, {"id": 42, "name": "Kay", "role": "admin"}\nMissing:  404, {"error": "user_not_found"}\n\nThe client never sees: the database, the language, the server code.',
        explain:
          'Three lines of contract are enough for a stranger to integrate. Everything behind the line can change freely as long as these three lines stay true.',
      },
      predicts: [
        {
          question: 'The backend team migrates from Python to C#. What must stay the same?',
          options: [
            'the server hardware',
            'the request and response contract',
            'nothing',
          ],
          correct: 1,
          why: 'Clients depend only on the contract. Honor it and the rewrite is invisible; break it and every client breaks.',
        },
        {
          question: 'Renaming the response field "name" to "fullName" is...',
          options: [
            'an internal detail',
            'a breaking contract change affecting every client',
            'fine if done quickly',
          ],
          correct: 1,
          why: 'Response shape is the contract. Every client reading .name breaks the moment the field moves.',
        },
      ],
      build: {
        simple: 'An API lets one program talk to another.',
        actually:
          'An API is a documented contract: which methods and paths exist, what bodies they take, what responses they return. Clients build against the contract only; everything behind it (database, language, framework) is free to change.',
        breaks:
          'Renaming a response field from name to fullName looks internal but breaks every client reading .name the instant it ships. Contract changes ripple to everyone; internal changes ripple to no one.',
      },
      doThisNow: [
        {
          task: 'Call a real public API and read its contract in action. Note the JSON shape it promises.',
          command: 'curl -s https://api.github.com/users/torvalds | head -n 12',
          reveal:
            'You get a documented JSON shape: login, id, name, and more. Every tool built on the GitHub API depends on those field names staying put. That stable shape is the contract.',
        },
        {
          task: 'Write the three-line contract for DELETE /users/{id} yourself: request, success, missing.',
          reveal:
            'Request: DELETE /users/42. Success: 204 with no body. Missing: 404 with an error shape. You just did API design.',
        },
      ],
      warStory:
        'A company renamed a JSON field to be "cleaner" in a minor release. Within an hour, mobile apps that shipped months earlier (and could not be updated quickly) were crashing in users\' hands. Field names in a public response are a promise you cannot quietly take back.',
      tweak: {
        instruction: 'Write the three-line contract for DELETE /users/{id}.',
        reveal:
          'Request: DELETE /users/42. Success: 204 with no body. Missing: 404 with an error shape. You just did API design.',
      },
      receipt: {
        explain: [
          'What an API contract is and what it deliberately hides.',
          'Why internal rewrites are safe but contract changes are not.',
        ],
        command: 'curl -s https://api.github.com/users/torvalds',
        question: 'The contract says bodies are JSON. What exactly are the rules of JSON?',
      },
      recap: [
        'An API is a documented request/response contract: a menu.',
        'The contract hides internals and frees teams to work in parallel.',
        'Changing the contract is a big deal; changing internals is not.',
      ],
    },
  },
  {
    id: 'api-rung-json',
    title: 'Module 2: JSON: The Data Language',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 11,
    prompt: 'Read and write JSON fluently: the six value types and the rules that trip people.',
    explanation: `JSON (JavaScript Object Notation) is how APIs write data as text. It looks like JavaScript objects because it grew from them, and every language can read and write it.

**Six types.** Objects in braces with "quoted" keys, arrays in brackets, strings in double quotes, numbers, true/false, and null. That is the entire grammar.

**The strict rules.** Keys must be double-quoted ("name", never name or 'name'). No trailing commas. No comments. Double quotes only. These rules are stricter than JavaScript itself, and each one is a parse error waiting for hand-written JSON.

**Nesting tells stories.** An object can hold arrays of objects: a user with a list of orders, each order with items. Reading nested JSON by indenting it mentally is the core skill, and it is the same skill as reading the objects-and-arrays modules of the language courses.

**Parsing and serializing.** Languages convert between text and live data: JSON.parse and JSON.stringify in JavaScript, equivalents everywhere else. APIs serialize on the way out and parse on the way in.`,
    production:
      'JSON parse errors at integration boundaries are daily noise: a trailing comma from a hand-edited config, a single-quoted key from a template. Knowing the strict rules cold turns a cryptic "unexpected token" into a ten-second fix.',
    walkthrough: [
      'Write a user object with a nested array of order objects.',
      'Break it on purpose: trailing comma, single quotes. Read the errors.',
      'Round-trip it: parse the text, read a field, stringify it back.',
    ],
    questions: [
      'What are the six JSON value types?',
      'Which JavaScript habits are illegal in JSON?',
    ],
    checklist: [
      'Write valid nested JSON by hand.',
      'Name the strict rules.',
      'Round-trip with parse and stringify.',
    ],
    interactive: {
      coldOpen:
        'A config file fails to load with "unexpected token." The file looks perfect. The culprit is one trailing comma or one single quote: habits that are legal in JavaScript and illegal in JSON. Knowing the strict rules cold turns a cryptic error into a ten-second fix.',
      mental:
        'JSON is the shipping container of data: one standard shape that every language can load, ship, and unload.',
      diagram: {
        nodes: ['Object {}', 'Array []', 'Primitives', 'parse / stringify'],
        explanations: [
          'Braces hold key-value pairs with double-quoted keys: a record, like a user.',
          'Brackets hold an ordered list: usually many records, like rows from a query.',
          'Strings in double quotes, bare numbers, true, false, and null. Six types total; that is the entire grammar.',
          'Every language converts both ways: parse turns text into live data, stringify turns data into text for the wire.',
        ],
      },
      example: {
        code: 'const text = \'{"name": "Kay", "active": true, "orders": [{"id": 101, "amount": 40}]}\';\n\nconst user = JSON.parse(text);\nconsole.log(user.orders[0].amount);\nconsole.log(JSON.stringify({ ok: true }));',
        output: '40\n{"ok":true}',
        explain:
          'parse turns text into a live object you can walk with dots and brackets. stringify goes the other way, producing the exact text an API would send.',
      },
      predicts: [
        {
          question: "Is {'name': 'Kay'} valid JSON?",
          options: ['yes', 'no: JSON requires double quotes', 'only in JavaScript'],
          correct: 1,
          why: 'Single quotes are a JavaScript habit. JSON keys and strings take double quotes only.',
        },
        {
          question: 'What is user.orders[0].amount after the parse above?',
          options: ['"40"', '40', 'undefined'],
          correct: 1,
          why: 'JSON numbers parse into real numbers. The path walks: object, array, first item, field.',
        },
        {
          question: 'Is {"items": [1, 2, 3,]} valid?',
          options: ['yes', 'no: trailing comma'],
          correct: 1,
          why: 'JSON forbids trailing commas. This is among the most common hand-written JSON errors.',
        },
      ],
      build: {
        simple: 'JSON is how APIs write data as text.',
        actually:
          'It has exactly six value types (object, array, string, number, boolean, null) and strict rules: double-quoted keys, no trailing commas, no comments. Languages parse text into live data and stringify data back into text.',
        breaks:
          'Hand-edited JSON breaks on the rules JavaScript forgives: a single-quoted key, a trailing comma, a stray comment. Each is a parse error, and the message ("unexpected token") rarely points at the real spot.',
      },
      doThisNow: [
        {
          task: 'Validate a real JSON snippet from the terminal. Pretty-print it to confirm it parses.',
          command: 'echo \'{"name":"Kay","orders":[{"id":101}]}\' | python3 -m json.tool',
          reveal:
            'A valid document prints back indented. The tool walks the same grammar a server uses: object, then array, then nested object. Indenting JSON mentally is the core reading skill.',
        },
        {
          task: 'Now break it on purpose: add a trailing comma and re-run. Read the error.',
          command: 'echo \'{"items":[1,2,3,]}\' | python3 -m json.tool',
          reveal:
            'It fails with a parse error pointing near the comma. JSON forbids trailing commas even though JavaScript allows them. This is the most common hand-written JSON mistake.',
        },
      ],
      warStory:
        'A deploy failed at 2am because someone added a helpful // comment to a JSON config. JSON has no comments. The parser rejected the whole file, and the service would not boot. The strict rules exist so every language agrees on exactly one grammar.',
      tweak: {
        instruction: 'Add a second order to the array in the text and re-run the parse.',
        reveal:
          'user.orders.length becomes 2, and user.orders[1] is your new object. Arrays of objects are the shape of every API list response.',
      },
      receipt: {
        explain: [
          'The six JSON types and the strict rules that differ from JavaScript.',
          'What parse and stringify do at the boundaries of an API.',
        ],
        command: 'echo \'{"a":1}\' | python3 -m json.tool',
        question: 'JSON is the data. How do you organize the URLs that carry it?',
      },
      recap: [
        'Six types: object, array, string, number, boolean, null.',
        'Double quotes, no trailing commas, no comments.',
        'parse text to data; stringify data to text.',
      ],
    },
  },
  {
    id: 'api-rung-resources',
    title: 'Module 3: Resources And Routes',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Design routes as nouns: collections, items, nesting, and where the verbs actually live.',
    explanation: `REST routing has one big idea: paths are nouns, methods are verbs. Get that and route design mostly writes itself.

**Collections and items.** /users is the collection; /users/42 is one item. GET, POST against the collection; GET, PUT, PATCH, DELETE against the item. Five meaningful endpoints from two paths.

**Plural nouns, no verbs in paths.** /users not /user, and never /getUsers or /createUser: the method already says that. A path with a verb in it is usually a sign the method is being ignored.

**Nesting shows ownership.** /users/42/orders reads as the orders belonging to user 42. One level of nesting is clarifying; three levels is a maze, and the flat alternative /orders?user_id=42 often serves better.

**Actions that defy nouns.** Some operations are genuinely verbs: retry, publish, cancel. The honest pattern is POST to an action subresource: POST /exports/7/retries. Forcing everything into pure nouns is dogma; keeping 95% nouns is design.`,
    production:
      'Inconsistent routing is death by a thousand cuts: /users here, /getProducts there, and every new client integration starts with archaeology. Teams write route conventions down precisely because the cost of inconsistency compounds for years.',
    walkthrough: [
      'Write the five standard routes for a products resource.',
      'Nest one level: reviews of a product.',
      'Convert /createOrder and /getOrderById into proper routes.',
      'Pick a pattern for a cancel action.',
    ],
    questions: [
      'Why do verbs not belong in paths?',
      'When is nesting worth it, and when is a query filter better?',
    ],
    checklist: [
      'Write collection and item routes for a resource.',
      'Fix a verb-in-path route.',
      'Express ownership with one nesting level.',
    ],
    interactive: {
      coldOpen:
        'You see POST /products/create in a codebase. Something is duplicated. POST already means create, so the word create in the path is doing nothing except inviting chaos: /create here, /add there, /new somewhere else, all for the same job. What is the rule that prevents this?',
      mental:
        'Routes are nouns on doors, and the HTTP method is what you do when you walk through: same door, different verbs.',
      diagram: {
        nodes: ['/users', '/users/42', '/users/42/orders', 'POST actions'],
        explanations: [
          'The collection. GET lists it, POST creates into it. Plural noun, no verbs in the path.',
          'One item by id. GET reads it, PATCH edits it, DELETE removes it. The standard surface is these two paths times the verbs.',
          'One nesting level reads as ownership: the orders belonging to user 42. Deeper nesting becomes a maze; query filters often serve better.',
          'Operations that defy nouns (retry, publish, cancel) become POST to an action subresource. Keep them rare and consistent.',
        ],
      },
      example: {
        code: '# One resource, the complete standard surface:',
        output:
          'GET    /products        list products\nPOST   /products        create a product\nGET    /products/7      read product 7\nPATCH  /products/7      update part of product 7\nDELETE /products/7      remove product 7\n\nGET    /products/7/reviews   reviews belonging to product 7',
        explain:
          'Two nouns and one nesting level produce the whole surface. The verbs live entirely in the methods column.',
      },
      predicts: [
        {
          question: 'What is wrong with POST /products/create?',
          options: [
            'nothing',
            'the verb is duplicated: POST already means create',
            'POST cannot have a path',
          ],
          correct: 1,
          why: 'POST /products already says create. Verbs in paths drift into inconsistency (/create, /add, /new) that clients must memorize.',
        },
        {
          question: 'All orders for user 42, flat style?',
          options: ['GET /orders?user_id=42', 'GET /users/42/getOrders', 'POST /orders/byUser'],
          correct: 0,
          why: 'A collection filtered by a query parameter. The nested GET /users/42/orders is the other defensible spelling; the verb versions are not.',
        },
      ],
      build: {
        simple: 'Routes are the URLs your API answers.',
        actually:
          'Paths are nouns, methods are verbs. /products is the collection, /products/7 is the item, and the five standard endpoints come from those two paths times the verbs. One nesting level shows ownership.',
        breaks:
          'Verbs leak into paths (/getProducts, /createOrder) the moment a team stops enforcing the convention. Every new client then starts with archaeology, and the inconsistency compounds for years.',
      },
      doThisNow: [
        {
          task: 'Write the five standard routes for a products resource, then nest one level for reviews.',
          reveal:
            'GET /products, POST /products, GET /products/7, PATCH /products/7, DELETE /products/7, then GET /products/7/reviews. Two nouns and one nesting level produce the whole surface.',
        },
        {
          task: 'Fix two bad routes: /createOrder and /getOrderById. Rewrite them the REST way.',
          reveal:
            'POST /orders and GET /orders/{id}. The verb moves out of the path and into the method, where clients, caches, and proxies already look for it.',
        },
      ],
      warStory:
        'A platform grew to dozens of endpoints with no route convention: /users, /getProducts, /order_create. Onboarding a new partner took weeks of guesswork. The eventual cleanup was a multi-quarter migration. Writing the convention down on day one would have cost an afternoon.',
      tweak: {
        instruction: 'Design the routes for canceling order 7, both the status-change spelling and the action spelling.',
        reveal:
          'PATCH /orders/7 with {"status": "canceled"} treats it as data; POST /orders/7/cancellations treats it as an action. Both are defensible; pick one convention and never mix.',
      },
      receipt: {
        explain: [
          'Why paths are nouns and methods are verbs.',
          'When nesting shows ownership and when a query filter is cleaner.',
        ],
        command: 'curl -s https://api.github.com/repos/torvalds/linux/issues',
        question: 'Routes and verbs are set. What should the server send back when the request goes wrong?',
      },
      writeDrillId: 'api-route-match',
      recap: [
        'Paths are plural nouns; methods are the verbs.',
        'Collection /users plus item /users/42 covers the standard surface.',
        'One nesting level for ownership; queries for filters.',
      ],
    },
  },
  {
    id: 'api-rung-errors',
    title: 'Module 4: Error Responses Worth Reading',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Design the error half of the contract: right codes, stable shapes, actionable messages.',
    explanation: `Half of an API's responses are errors, and the error contract is where good APIs separate from miserable ones.

**One stable shape.** Every error returns the same envelope: a machine-readable code, a human-readable message, and optionally details per field. Clients write one error handler instead of guessing per endpoint.

**The code is for programs; the message is for people.** "error": "email_taken" lets client code branch reliably; "message": "That email is already registered" is what a user might see. Never make clients parse prose to find out what happened.

**Field-level details for validation.** A 400 that says which fields failed and why ("email": "must be a valid address") turns a guessing game into a form highlight. This single design choice saves more integration hours than any other.

**Say enough, never too much.** Stack traces, SQL fragments, and internal paths in error bodies are gifts to attackers and embarrassments in screenshots. Log the detail server-side with a request id, and return the id in the error so support can correlate.`,
    production:
      'When an integration partner reports "your API is broken", the first artifact exchanged is an error body. A response carrying a code, a message, and a request id resolves the ticket in one email; a bare 500 with an HTML error page starts a week of archaeology.',
    walkthrough: [
      'Define one error envelope for the whole API.',
      'Write the 400 for two invalid fields with per-field details.',
      'Write the 409 for a duplicate email.',
      'Add a request id and say what it is for.',
    ],
    questions: [
      'Why one error shape across the API?',
      'Who reads the code and who reads the message?',
      'What must never appear in an error body?',
    ],
    checklist: [
      'Design a stable error envelope.',
      'Return field-level validation details.',
      'Keep internals out of error bodies.',
    ],
    interactive: {
      coldOpen:
        'A partner emails: "your API is broken." If your error body has a code, a message, and a request id, you reply once and the ticket closes. If it returns a bare 500 with an HTML error page, you have just signed up for a week of archaeology. The error half of the contract is where good APIs separate from miserable ones.',
      mental:
        'An error response is an incident report form: the same fields every time, so anyone can file one and anyone can read one.',
      diagram: {
        nodes: ['Status code', 'error code', 'message', 'details', 'request_id'],
        explanations: [
          'The HTTP verdict picks the family: 400 invalid input, 404 missing, 409 conflict, 500 our fault.',
          'A stable machine-readable identifier like email_taken. Client code branches on this, never on prose.',
          'A human sentence safe to show a user. Free to be reworded without breaking anyone.',
          'Per-field explanations for validation failures, so a form can highlight exactly what to fix in one round trip.',
          'A correlation id that finds the full story in server logs. Support trades this id instead of stack traces.',
        ],
      },
      example: {
        code: '# POST /users with a bad email and a short password:',
        output:
          'HTTP/2 400\ncontent-type: application/json\n\n{\n  "error": "validation_failed",\n  "message": "Two fields need attention.",\n  "details": {\n    "email": "must be a valid email address",\n    "password": "must be at least 12 characters"\n  },\n  "request_id": "req_8f3a2c"\n}',
        explain:
          'A machine code to branch on, a human sentence, per-field details for the form, and an id that finds the server-side logs. Every error in the API wears this same envelope.',
      },
      predicts: [
        {
          question: 'Why "error": "email_taken" instead of only a prose message?',
          options: [
            'it is shorter',
            'client code can branch on a stable code; prose changes and breaks parsers',
            'JSON requires it',
          ],
          correct: 1,
          why: 'Programs need stable identifiers. The moment a client greps prose for "already registered", any copy edit breaks them.',
        },
        {
          question: 'A stack trace in a production error body is...',
          options: [
            'helpful transparency',
            'an information leak: internals belong in logs, found via the request id',
            'required for debugging',
          ],
          correct: 1,
          why: 'Attackers read stack traces as maps. The request id gives support the same power without the exposure.',
        },
      ],
      build: {
        simple: 'When something goes wrong, the API returns an error.',
        actually:
          'Every error wears one envelope: a machine-readable code clients branch on, a human message, per-field details for validation, and a request id that finds the full story in the logs. Codes are for programs; messages are for people.',
        breaks:
          'A stack trace or SQL fragment in an error body is a map for attackers and an embarrassment in screenshots. And clients that grep prose ("already registered") break the instant someone edits the copy.',
      },
      doThisNow: [
        {
          task: 'Trigger a real API error and read its shape. Does it carry a stable code and a message?',
          command: 'curl -s https://api.github.com/repos/torvalds/this-repo-does-not-exist',
          reveal:
            'GitHub returns a JSON body with a "message" and a documentation_url, not an HTML page or a stack trace. Stable, readable, safe to show. That is the error contract done well.',
        },
        {
          task: 'Write the 409 body for a duplicate email yourself, reusing the same envelope as the example.',
          reveal:
            '{"error":"email_taken","message":"That email is already registered.","request_id":"..."}. Same envelope, different code: that consistency is the whole design.',
        },
      ],
      warStory:
        'A production API leaked full stack traces in 500 bodies, including database table names and file paths. A security researcher mapped the entire internal structure from error pages alone. The fix: log the detail with a request id, return only the id. Same debuggability, no exposure.',
      tweak: {
        instruction: 'Write the 409 body for a duplicate email using the same envelope.',
        reveal:
          '{"error": "email_taken", "message": "That email is already registered.", "request_id": "..."}. Same envelope, different code: that consistency is the whole design.',
      },
      receipt: {
        explain: [
          'The one error envelope and who reads each field.',
          'Why internals belong in logs behind a request id, never in the body.',
        ],
        command: 'curl -s https://api.github.com/repos/torvalds/nope',
        question: 'Errors are well-shaped now. How do you stop bad input from reaching your logic in the first place?',
      },
      writeDrillId: 'api-result-to-response',
      recap: [
        'One error envelope everywhere: code, message, details, request id.',
        'Codes for programs, messages for humans, field details for forms.',
        'Internals go to logs; the request id connects the two.',
      ],
    },
  },
  {
    id: 'api-rung-validation',
    title: 'Module 5: Validate At The Door',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Never trust input: check presence, type, format, and bounds before anything else runs.',
    explanation: `Every request body is text composed by software you do not control. Validation is the bouncer at the door, and it runs before any business logic touches the data.

**The four checks, in order.** Presence: required fields exist. Type: the quantity is a number, the email a string. Format: the email matches an email shape, the date parses. Bounds: quantity between 1 and 100, name under 200 characters. Each check catches a different real-world failure.

**Reject unknown fields, or at least ignore them.** A request setting "role": "admin" on a self-service signup should not work just because the field landed in the database write. Allowlisting expected fields is the safe default.

**Fail fast with the 400 envelope.** Collect all field errors in one pass and return them together (the previous module's shape), so the client fixes everything in one round trip instead of playing whack-a-mole.

**Validation is not security by itself,** but it is the first layer: most injection attacks and corrupt-data incidents enter through an unvalidated field. The security ladder picks this thread up directly.`,
    production:
      'The unvalidated-input incident is a classic: a negative quantity creating a refund, an oversized payload taking down a parser, an admin flag honored from a public form. Teams codify validation into schemas (Zod, JSON Schema, FluentValidation) so the contract and the checks are the same artifact.',
    walkthrough: [
      'List the four checks in order for a signup body.',
      'Decide the policy for unknown fields.',
      'Return all field errors in one 400.',
      'Connect one check to a real incident it prevents.',
    ],
    questions: [
      'Why validate before business logic?',
      'What does allowlisting fields prevent?',
      'Why return all errors at once?',
    ],
    checklist: [
      'Apply presence, type, format, and bounds checks.',
      'Handle unknown fields deliberately.',
      'Return a complete 400 in one pass.',
    ],
    interactive: {
      coldOpen:
        'A self-service signup form sends {"email":"...","role":"admin"}. If your endpoint writes whatever it receives, that user just made themselves an administrator. The fix is one validation rule, and it has a name: allowlisting. Most corrupt-data and injection incidents enter through exactly one unvalidated field.',
      mental:
        'Validation is a bouncer with a four-point checklist (presence, type, format, bounds) and a guest list: unknown fields do not get in.',
      diagram: {
        nodes: ['Presence', 'Type', 'Format', 'Bounds', 'Allowlist'],
        explanations: [
          'Required fields exist at all. Missing email on a signup stops here.',
          'Each field is the right kind: quantity is a number, email a string. Text from forms and URLs fails here constantly.',
          'The value has the right shape: the email matches an address pattern, the date parses.',
          'The value is in range: quantity between 1 and 100, name under 200 characters. Negative quantities die here.',
          'Only declared fields are accepted; everything else is dropped. This single check kills mass-assignment attacks like a self-granted admin role.',
        ],
      },
      example: {
        code: '# POST /signup body from an untrusted client:\n{\n  "email": "kay@",\n  "quantity": "-3",\n  "role": "admin"\n}',
        output:
          'presence  ok: both expected fields exist\ntype      fail: quantity is a string, expected number\nformat    fail: email does not match a valid address\nbounds    (not reached for quantity; would fail at -3)\nunknown   "role" is not an accepted field: dropped\n\n=> 400 with details for email and quantity',
        explain:
          'Four mechanical checks plus a field allowlist catch three problems before any code that could be damaged by them runs. The attempted role escalation dies silently.',
      },
      predicts: [
        {
          question: 'Why did "role": "admin" get dropped rather than validated?',
          options: [
            'it was misspelled',
            'it is not in the endpoint’s accepted fields: clients cannot grant themselves roles',
            'admin is a reserved word',
          ],
          correct: 1,
          why: 'Allowlisting means the endpoint declares what it accepts and everything else is ignored. Mass-assignment vulnerabilities are exactly this check missing.',
        },
        {
          question: 'The quantity "-3" arrives as a string. Which two checks does it fail?',
          options: ['presence and format', 'type and bounds', 'only bounds'],
          correct: 1,
          why: 'It is a string where a number is expected (type), and once converted, -3 is below the minimum (bounds). Both belong in the 400 details.',
        },
      ],
      build: {
        simple: 'Check the input before you use it.',
        actually:
          'Four checks in order (presence, type, format, bounds) run before any business logic, plus a field allowlist so only declared fields are accepted. Collect every failure and return them together in one 400.',
        breaks:
          'Skip the allowlist and a public form can set role:admin (mass assignment). Skip bounds and a negative quantity triggers a refund. Each missing check is a specific, real incident.',
      },
      doThisNow: [
        {
          task: 'Walk the four checks against a hostile body: {"email":"kay@","quantity":"-3","role":"admin"}. Name which check each field fails.',
          reveal:
            'email fails format; quantity fails type (string) then bounds (-3); role is not an accepted field, so the allowlist drops it. Three problems caught before any code that could be damaged runs.',
        },
        {
          task: 'Write the 400 body this produces, reusing the error envelope from the previous lesson.',
          reveal:
            '{"error":"validation_failed","details":{"email":"must be a valid email address","quantity":"must be a number between 1 and 100"}}. Two lessons composing into one response.',
        },
      ],
      warStory:
        'An e-commerce bug let users submit a negative quantity. The checkout math dutifully produced a negative total: a refund. People found it and "bought" their way to free money until a bounds check shipped. Validation is the cheapest insurance in the stack.',
      tweak: {
        instruction: 'Write the 400 body this validation produces, using the error envelope from the previous module.',
        reveal:
          '{"error": "validation_failed", "message": "...", "details": {"email": "must be a valid email address", "quantity": "must be a number between 1 and 100"}}. Two modules composing into one response.',
      },
      receipt: {
        explain: [
          'The four checks in order and why they run before business logic.',
          'How allowlisting fields stops mass-assignment attacks.',
        ],
        command: 'curl -s -X POST https://httpbin.org/post -d "quantity=-3"',
        question: 'Input is safe. A list endpoint could still return ten million rows. How do you slice it?',
      },
      writeDrillId: 'api-create-user-validation',
      recap: [
        'Validate first: presence, type, format, bounds.',
        'Allowlist fields; never honor surprise data like role.',
        'One 400 with every field error beats a round trip per mistake.',
      ],
    },
  },
  {
    id: 'api-rung-pagination',
    title: 'Module 6: Pagination: Lists That Scale',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Return big collections in pages: limit and offset, the response envelope, and why order is mandatory.',
    explanation: `GET /orders against a table with ten million rows cannot return everything. Pagination is the contract for slicing lists, and every list endpoint needs it from day one.

**Limit and offset.** ?limit=10&offset=20 asks for ten items starting after the first twenty: page three. The backend translates directly into the SQL LIMIT and OFFSET from the database ladder, with a hard cap on limit so nobody asks for a million.

**The response envelope.** Return the items plus the numbers a client needs to render paging: total count, current limit and offset, or a flag like has_more. A bare array forces clients to guess whether more exists.

**Stable order is mandatory.** Without an explicit ORDER BY underneath, pages overlap and skip as the database pleases. Sort by something unique (created_at plus id as a tiebreak) so page boundaries hold still.

**The deeper trade.** Offset pagination degrades on huge tables (the database walks past every skipped row) and pages drift when rows are inserted mid-browse. Cursor pagination (a token meaning "after this row") fixes both, costs more to build, and is the standard for feeds. Knowing when to upgrade is the design judgment.`,
    production:
      'Pagination bugs are the duplicate-and-missing-rows class: a client paging through orders sees order 200 twice and never sees 201, because new rows shifted every offset mid-walk. Cursor pagination exists because real feeds hit this constantly.',
    walkthrough: [
      'Design the query parameters with defaults and a maximum limit.',
      'Design the envelope: items plus paging metadata.',
      'Specify the stable sort underneath.',
      'Say when you would reach for cursors instead.',
    ],
    questions: [
      'What does offset 20 limit 10 return?',
      'Why must the limit have a server-side cap?',
      'What breaks without a stable order?',
    ],
    checklist: [
      'Design limit/offset parameters with caps.',
      'Return a paging envelope, never a bare array.',
      'Pin the underlying sort.',
    ],
    interactive: {
      coldOpen:
        'A user pages through orders and sees order 200 twice, then never sees 201. No code is buggy. The list just shifted under them because there was no stable sort and new rows kept arriving. GET /orders on a ten-million-row table cannot return everything, and slicing it wrong lies to users.',
      mental:
        'Pagination is reading a book: limit is the page size, offset is how deep you are, and ORDER BY is the binding that keeps pages from shuffling.',
      diagram: {
        nodes: ['Stable sort', 'Skip offset', 'Take limit', 'Envelope'],
        explanations: [
          'An explicit ORDER BY with a unique tiebreak pins every row in place. Without it, page boundaries drift and rows repeat or vanish.',
          'OFFSET skips past the rows earlier pages already showed.',
          'LIMIT takes one page worth, capped server-side so nobody requests a million rows.',
          'The response wraps items with total, limit, offset, and has_more, so clients can render controls without guessing.',
        ],
      },
      example: {
        code: 'GET /orders?limit=2&offset=2',
        output:
          '{\n  "items": [\n    {"id": 103, "amount": 120},\n    {"id": 104, "amount": 15}\n  ],\n  "total": 4,\n  "limit": 2,\n  "offset": 2,\n  "has_more": false\n}',
        explain:
          'Four orders sorted by id, skip two (101, 102), take two: 103 and 104, the last page. The envelope tells the client everything needed to render controls and know it is done.',
      },
      predicts: [
        {
          question: 'With total 4 and limit 2, how many pages exist?',
          options: ['1', '2', '4'],
          correct: 1,
          why: 'Four items in slices of two is two pages. Clients compute this from the envelope, which is why the envelope exists.',
        },
        {
          question: 'A client sends ?limit=1000000. The server should...',
          options: [
            'obey: the client asked',
            'clamp to its documented maximum and proceed',
            'return a 500',
          ],
          correct: 1,
          why: 'An uncapped limit lets one request hold the database and exhaust memory. Clamp (or 400) per the documented contract.',
        },
        {
          question: 'Pages without ORDER BY underneath produce...',
          options: [
            'consistent pages anyway',
            'rows that repeat on one page and vanish from another',
            'a database error',
          ],
          correct: 1,
          why: 'Unordered results may return in any sequence each query. Offsets only mean something against a pinned order; this is the SQL ladder paying off.',
        },
      ],
      build: {
        simple: 'Pagination returns a list one page at a time.',
        actually:
          'limit and offset slice the list (capped server-side), the response wraps items with total/limit/offset/has_more, and a stable ORDER BY with a unique tiebreak pins every row so page boundaries hold still.',
        breaks:
          'Offset pagination degrades on huge tables (the database walks past every skipped row) and pages drift when rows are inserted mid-browse. Cursor pagination (a token meaning "after this row") fixes both and is the standard for feeds.',
      },
      doThisNow: [
        {
          task: 'Page through a real paginated API and watch the page parameter change what you get.',
          command: 'curl -s "https://api.github.com/repositories?per_page=3" | grep \'"full_name"\'',
          reveal:
            'You get exactly three repositories. GitHub also returns a Link header with the next page cursor: a real cursor-pagination contract in the wild, exactly the upgrade this lesson describes.',
        },
        {
          task: 'Write the request for the first page of 2 items and predict has_more before checking the example.',
          reveal:
            'GET /orders?limit=2&offset=0 returns the first two with has_more true: two more remain past this page.',
        },
      ],
      warStory:
        'An analytics export paged with offset over a table that grew during the run. Rows shifted, so the export double-counted some orders and skipped others. The totals were wrong for a quarter before anyone noticed. A stable sort and cursors would have prevented it.',
      tweak: {
        instruction: 'Write the request for the first page of 2, and predict has_more.',
        reveal:
          'GET /orders?limit=2&offset=0 returns the first two with has_more true: two more remain past this page.',
      },
      receipt: {
        explain: [
          'How limit, offset, and a stable sort produce correct pages.',
          'When offset pagination breaks and why cursors replace it.',
        ],
        command: 'curl -s "https://api.github.com/repositories?per_page=3"',
        question: 'You can design a whole REST API now. What stops a stranger from calling the parts they should not?',
      },
      writeDrillId: 'api-pagination',
      recap: [
        'limit + offset slice the list; the server caps the limit.',
        'Envelope: items, total, limit, offset, has_more.',
        'Stable sort underneath, or pages lie.',
      ],
    },
  },
]
