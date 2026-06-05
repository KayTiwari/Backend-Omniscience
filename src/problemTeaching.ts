import type { Problem, Subject } from './course'

type SubjectTeaching = {
  picture: string
  mentalModel: string
  fundamentals: string[]
  diagram: string[]
  diagramExplanations?: string[]
  tutorial: string[]
  advanced: string[]
  interview: string[]
}

export type TeachingModel = SubjectTeaching & {
  problemIntro: string
  practiceMode: string
}

const subjectTeaching: Record<string, SubjectTeaching> = {
  internet: {
    picture: 'Client -> DNS -> TCP -> TLS -> HTTP -> Proxy -> App -> Database -> JSON',
    mentalModel:
      'The web stack is a layered delivery system. Each layer has one job: find the server, connect to it, protect bytes, describe the request, route it, execute backend code, read/write data, then return a response.',
    fundamentals: [
      'DNS (Domain Name System) is the internet phonebook: it turns a human name like api.example.com into an IP address a computer can connect to.',
      'TCP (Transmission Control Protocol) opens a reliable connection between two machines, keeps bytes in order, and resends missing data when packets are lost.',
      'TLS (Transport Layer Security) sits on top of TCP for HTTPS: it verifies the server certificate and encrypts traffic so intermediaries cannot read or tamper with it.',
      'HTTP (Hypertext Transfer Protocol) is the web request/response language: it defines methods like GET/POST, paths like /users/42, headers, status codes, and response bodies such as JSON.',
    ],
    diagram: ['URL', 'DNS', 'TCP', 'TLS', 'HTTP', 'Proxy', 'App', 'DB', 'Response'],
    diagramExplanations: [
      'A URL (Uniform Resource Locator) is the full address of something on the internet. It has four parts: the scheme (https://) tells the browser how to communicate; the host (api.example.com) names the server; the path (/users/42) names the specific resource on that server; and an optional query string (?page=2) passes extra options. Think of it like a postal address: scheme is the delivery method (air vs ground), host is the city and street, path is the apartment number. Every part matters — a wrong scheme, an unreachable host, or a path that does not exist all produce different errors.',
      'DNS (Domain Name System) is the internet\'s phone book. Computers talk to each other using numeric IP addresses like 104.21.3.197, but humans remember names like api.example.com. DNS translates names into numbers. When your browser sees a hostname, it first checks its local cache. If not cached, it asks a DNS resolver (run by your internet provider or Google). The resolver asks the authoritative name server for that domain and returns an IP address. This typically takes 10–100ms but can be cached for hours. If DNS is broken or the name does not exist, the connection fails before a single byte of HTTP is sent.',
      'TCP (Transmission Control Protocol) is how two computers open a reliable two-way conversation. Before any data is exchanged, TCP does a three-way handshake: your computer sends SYN (I want to connect), the server replies SYN-ACK (OK, I see you), your computer sends ACK (great, starting now). After that, both sides have a reliable ordered byte stream — TCP guarantees bytes arrive in order and automatically resends any that are lost. This reliability costs time: the handshake adds one full network round-trip before any useful data flows. That latency cost is why reducing round-trips matters, and why protocols like QUIC (HTTP/3) try to combine the handshake with the first data packet.',
      'TLS (Transport Layer Security) is what makes HTTPS safe. It runs on top of TCP. After the TCP handshake, there is a TLS handshake where the server sends its certificate — a cryptographically signed document that proves it controls the domain, issued by a Certificate Authority (CA) your computer trusts. Your browser verifies the certificate chain. If valid, both sides negotiate shared encryption keys. From that point on, every byte is encrypted: no network middleman can read, modify, or inject data. TLS protects against eavesdropping (a public Wi-Fi snoop), tampering (someone swapping content mid-transit), and impersonation (a fake server pretending to be your bank).',
      'HTTP (Hypertext Transfer Protocol) is the language clients and servers use to ask for and deliver data. A request has a method (GET reads data, POST creates or submits, PUT/PATCH updates, DELETE removes), a path (/users/42), headers (key-value metadata: Authorization proves identity, Content-Type says what format the body is in), and optionally a body (JSON, a file, form data). The server replies with a status code (200 OK, 404 Not Found, 500 Server Error), response headers, and usually a JSON body. HTTP is stateless — each request is independent and the server forgets it immediately, which is why session tokens or cookies are included on every request to prove who you are.',
      'A reverse proxy is a server that sits in front of your app and handles every request first. Common examples are Nginx, Caddy, and cloud load balancers. The proxy terminates TLS (decrypts HTTPS so app servers do not have to), balances load across multiple app instances (so no single server is overwhelmed), routes paths to different services (/api/* goes here, /images/* goes there), and adds useful headers like X-Request-Id (a unique ID for each request) and X-Forwarded-For (the real client IP address). Proxies can also cache responses, enforce rate limits, and reject malformed requests before they ever reach your code.',
      'The app is your backend code. When a request reaches your app server it passes through a middleware pipeline — a series of functions that run on every request in order. Middleware handles logging, authentication checking, request ID generation, and JSON body parsing before any route-specific code runs. Then the router matches the request path and HTTP method to a specific handler function you wrote. The handler reads validated input, calls business logic (looking up a user, calculating a total, sending an email), interacts with databases or external services, then returns a response. Unhandled exceptions must be caught by error middleware and converted to clean JSON error responses — never leaked as raw stack traces.',
      'The database is where your app stores facts that must survive process restarts, be queryable efficiently, and be shared across multiple app servers. Most backend apps use a relational database like PostgreSQL. Data is organized into tables (like spreadsheets: rows are records, columns are fields). The app connects over the network and sends SQL queries: SELECT reads rows, INSERT writes new rows, UPDATE changes existing rows, DELETE removes rows. Database queries are usually the slowest part of a request — commonly 10–100ms each. The most common pitfalls are missing indexes (the database has to scan every row to find yours), N+1 queries (accidentally running one query per item in a list), and hitting the connection pool limit under high traffic.',
      'The response is what travels back through the chain to the client. It has three parts: a status code (2xx = success, 3xx = redirect, 4xx = client error, 5xx = server error), response headers (metadata: Content-Type declares the body format, Cache-Control controls caching, Set-Cookie stores a session token, X-Request-Id lets you trace logs), and a body (usually JSON for APIs). A well-designed response always uses the right status code — 200 for success, 201 for created, 404 for not found, 401 for unauthenticated, 403 for unauthorized. It never exposes internal details like stack traces or database errors in the body. It includes a request ID so a developer can search logs and find exactly what went wrong.',
    ],
    tutorial: ['Read the URL into scheme, host, path, and query.', 'Name what each network layer adds before the app sees anything.', 'Separate infrastructure behavior from application code.', 'End by explaining response status, headers, body, and caching.'],
    advanced: ['HTTP/2 multiplexing', 'CDN/cache validation', 'proxy timeouts', 'TLS termination', 'trace propagation'],
    interview: ['Never say DNS returns a full URL.', 'Do not mix up TCP and TLS.', 'Mention at least one failure mode per layer.', 'Tie answers to logs, traces, or packet-level evidence.'],
  },
  language: {
    picture: 'Input -> parse -> transform -> validate -> handle errors -> test -> ship',
    mentalModel:
      'Backend language skill is the ability to turn messy inputs into correct outputs while keeping logic testable, errors explicit, and side effects isolated.',
    fundamentals: [
      'Control flow means the order your code runs in: if/else chooses a path, loops repeat work, and returns stop a function with a result.',
      'Collections are containers for multiple values, such as arrays/lists for ordered items, maps/dictionaries for key-value lookup, and sets for unique values.',
      'Functions are named chunks of logic: they take inputs, do work, and return outputs so code can be reused and tested in small pieces.',
      'Errors are how programs report that something went wrong; backend code should decide which errors can be handled and which should become clear responses or logs.',
      'Files are data stored outside memory; reading/writing files is a side effect, so production code should handle missing files, permissions, and large file sizes.',
      'Tests are automated checks that prove code behaves the way you expect, especially for normal inputs, edge cases, and failure cases.',
    ],
    diagram: ['Input', 'Types', 'Logic', 'Errors', 'Tests', 'Runtime'],
    diagramExplanations: [
      'Input is any data that enters your backend code from outside: an HTTP request body, a URL parameter, a query string, an environment variable, a file, a database row, or a message from a queue. All external input is untrusted by definition — it can be missing, the wrong type, too large, or intentionally malicious. The first job of backend code is to read input and validate it before doing anything else. Never assume input matches what you expect.',
      'Types describe what shape a value has — is it a number, a string, a list, or a structured object with named fields? In dynamically typed languages like Python and JavaScript, types exist at runtime but the language does not check them for you. In statically typed languages like TypeScript, Go, and Java, the compiler checks types before the program runs. Types serve as documentation that cannot go stale: if a function accepts a User object with an email field, both the compiler and every future reader know exactly what is required.',
      'Logic is the work your backend actually performs: reading data, transforming it, making decisions, calling other services, and preparing a result. Good backend logic is organized into small pure functions — functions whose output depends only on their input, with no hidden side effects like database calls or random numbers mixed in. This makes logic easy to test, easy to reason about, and easy to move around. Separate your business logic from your HTTP layer and your database layer.',
      'Errors are how programs report that something went wrong. Backend code should distinguish between two kinds of errors: operational errors (expected failures like a missing record, a validation failure, or a network timeout) and programmer errors (unexpected bugs like calling a method on undefined). Operational errors should be caught and turned into clear, structured HTTP responses. Programmer errors should crash loudly so you notice them. Never silently swallow an error — it hides bugs and makes debugging impossible.',
      'Tests are automated checks that prove your code behaves the way you expect, especially after changes. A unit test calls one function with known inputs and asserts the output is correct. An integration test runs code against a real database or service to check the pieces fit together. A test that passes on normal input but ignores edge cases (empty input, very large input, duplicate records) is incomplete. Good tests make refactoring safe: if you change the implementation and the tests still pass, you know behavior did not break.',
      'Runtime is the environment where your code actually executes — the operating system process, available memory, CPU, open file handles, and environment variables. Runtime behavior often differs from development: a laptop has different memory limits than a production server, production processes handle many concurrent requests simultaneously, and environment config (database URLs, API keys) comes from env vars not hardcoded values. Backend engineers must think about memory leaks, CPU blocking, graceful shutdown, and process crashes — not just whether the logic is correct.',
    ],
    tutorial: ['Find the input shape.', 'Write the smallest pure transformation.', 'Add invalid input behavior.', 'Wrap side effects at the edge.', 'Prove behavior with tests.'],
    advanced: ['concurrency model', 'memory usage', 'dependency management', 'runtime profiling', 'graceful shutdown'],
    interview: ['Explain tradeoffs in plain language.', 'Use edge cases.', 'Prefer readable code over cleverness.', 'Show how you would test it.'],
  },
  sql: {
    picture: 'Entities -> constraints -> queries -> indexes -> transactions -> migrations',
    mentalModel:
      'Databases protect facts. Start with invariants, model relationships, write queries from access patterns, and use indexes/transactions to make the common paths correct and fast.',
    fundamentals: [
      'A table is a structured list of records, like a spreadsheet where each row is one thing and each column is one fact about that thing.',
      'A primary key is the unique ID for a row, such as user_id; it lets the database and your code refer to one exact record.',
      'A foreign key is a column that points to a row in another table, which is how databases represent relationships like each order belonging to one user.',
      'A join combines rows from multiple tables so one query can answer questions that involve related data.',
      'An index is a lookup structure that helps the database find rows faster, similar to the index in the back of a book.',
      'A transaction groups multiple database changes into one all-or-nothing unit so partial updates do not corrupt important data.',
    ],
    diagram: ['Entity', 'Constraint', 'Query', 'Index', 'Transaction', 'Migration'],
    diagramExplanations: [
      'An entity is a thing your system needs to remember facts about: a User, an Order, a Product, an Invoice. In a relational database, each entity becomes a table. A table has rows (one per record) and columns (one per fact). Every row needs a unique identifier — usually an auto-incrementing integer or a UUID called the primary key. Related entities reference each other through foreign keys: an Order row has a user_id column pointing to the User who placed it.',
      'A constraint is a rule the database enforces automatically to keep data correct. NOT NULL means a column must always have a value. UNIQUE means no two rows can have the same value in that column. FOREIGN KEY means a reference must point to a row that actually exists. CHECK means a value must satisfy a condition. Constraints catch bad data at write time, before it corrupts downstream queries. A missing constraint means the database accepts garbage, and you only find out when a query returns wrong results.',
      'A query is a question you ask the database, written in SQL. SELECT reads rows: SELECT * FROM users WHERE email = \'a@b.com\'. INSERT adds a row. UPDATE changes values. DELETE removes rows. The database executes your query by scanning tables, applying filters, joining related tables, and returning matching rows. How you write a query determines how long it takes — a poorly written query on a large table can take minutes; a well-written one with the right indexes takes milliseconds.',
      'An index is a data structure the database maintains alongside a table to make lookups faster. Without an index, finding a user by email means reading every single row until a match is found — called a sequential scan. With an index on the email column, the database jumps directly to the matching row. Indexes trade write speed and storage for read speed: every INSERT or UPDATE must also update the index. Add indexes on columns you filter or sort by frequently. Too many indexes slow down writes; too few slow down reads.',
      'A transaction groups multiple database operations into one all-or-nothing unit. Imagine transferring money: you subtract from one account and add to another. If the subtraction succeeds but the addition crashes, money is lost. Wrapping both in a transaction means either both changes are committed (saved permanently) or both are rolled back (undone), leaving the database consistent. Transactions also provide isolation: other queries do not see the half-finished state while a transaction is in progress.',
      'A migration is a versioned, repeatable script that changes the database schema — adding a table, adding a column, changing a constraint, dropping an index. Migrations are stored in your codebase as numbered files and run in order. They let you evolve the database schema safely alongside code changes. A good migration is also reversible: it includes a down step that undoes the change so you can roll back a bad deploy. Running migrations on a live database requires care — adding a NOT NULL column to a large table without a default can lock writes for minutes.',
    ],
    tutorial: ['Name the facts that must always be true.', 'Model entities and relationships.', 'Write the reads and writes.', 'Choose indexes from those queries.', 'Define transaction boundaries.'],
    advanced: ['isolation levels', 'deadlocks', 'query plans', 'replication lag', 'online migrations'],
    interview: ['Start with invariants.', 'Explain indexes from queries.', 'Know N+1 symptoms.', 'Discuss migration and rollback risk.'],
  },
  api: {
    picture: 'Client need -> method/path -> request body -> handler -> service -> response',
    mentalModel:
      'An API is how another program asks your backend to do work. To write API code from scratch, decide what the client needs, choose the URL and HTTP method, validate the incoming data, call backend logic, then return a predictable status code and JSON shape.',
    fundamentals: [
      'Resource naming means choosing URL paths that describe things in your system, such as /users or /orders/123, instead of vague action names.',
      'HTTP methods are verbs for API intent: GET reads data, POST creates or submits data, PUT/PATCH update data, and DELETE removes data.',
      'Status codes are three-digit HTTP results: 200 means success, 400 usually means client input was bad, 401/403 are auth problems, 404 means missing, and 500 means server failure.',
      'A request schema defines what the client is allowed or required to send, including field names, types, and validation rules.',
      'A response schema defines what the backend promises to return so clients know exactly what shape of data to expect.',
      'An error envelope is a consistent error response shape, often with a code, message, and details, so clients can handle failures reliably.',
    ],
    diagram: ['Client', 'Route', 'Validate', 'Handler', 'Service', 'JSON/Status'],
    diagramExplanations: [
      'The client is whoever is calling your API: a browser running JavaScript, a mobile app, another backend service, or a command-line tool like curl. The client sends an HTTP request — choosing a method (GET, POST, PUT, DELETE), a path (/users/42), headers (Authorization, Content-Type), and optionally a body (JSON). As an API designer, you never control the client; you only control what your server accepts and returns. That is why clear contracts, good error messages, and consistent response shapes matter — the client has to know exactly what to expect.',
      'A route maps an HTTP method and path pattern to a handler function. When a request arrives, the framework checks its registered routes in order until one matches. For example: GET /users/:id matches GET /users/42 and gives the handler id = "42". If no route matches, the server returns 404. Routes should follow REST conventions: nouns for paths (/orders, not /getOrders), HTTP methods for actions (GET reads, POST creates, PATCH updates, DELETE removes). Route files should be thin — just enough to read input and call a service.',
      'Validation is checking that input from the client is safe, correct, and complete before your business logic trusts it. This means: required fields are present, fields have the right types (a price should be a number, not the string "banana"), values are within allowed ranges (quantity must be positive), formats are valid (emails have an @ sign, UUIDs have 36 characters). Validation errors should return a 400 status with field-level messages so the client knows exactly what to fix. Never skip validation — client data is always untrusted.',
      'A handler is the function that runs when a route matches. Its job is narrow: read validated input, call service code, and return a response. A handler should not contain business logic directly — no database queries, no email sending, no price calculations embedded in the route file. Keep handlers thin: one function call to a service, one response returned. This separation makes the handler testable in isolation and keeps business logic reusable across different routes or interfaces.',
      'A service contains the actual business logic: calculating a price, creating a user account, sending a confirmation email, checking if an item is in stock. Services are plain functions or classes that know nothing about HTTP — they receive structured data, do work, and return a result or throw an error. This separation is valuable: the same service can be called from a REST route, a background job, a CLI command, or a test without any HTTP machinery involved.',
      'The JSON response is your API\'s promise to the caller. It has two parts: a status code and a body. Status codes must be accurate — 200 for a successful read, 201 for a successful creation, 204 for success with no body, 400 for bad input, 401 for missing authentication, 403 for insufficient permission, 404 for a resource that does not exist, 409 for a conflict, 500 for an unexpected server error. The JSON body should have a consistent shape for both success and error cases so clients can parse it reliably. Error responses should include a machine-readable code and a human-readable message, but never internal details like stack traces.',
    ],
    tutorial: [
      'Write one sentence for what the client is trying to do, such as create a user or fetch an order.',
      'Pick the HTTP method and path, such as POST /users for create or GET /users/42 for read.',
      'List every field the request may contain and decide which fields are required, optional, or forbidden.',
      'Write the route handler as a small pipeline: read input, validate input, call service code, return status plus JSON.',
      'Define what happens for bad input, missing records, permission failures, duplicate requests, and unexpected server errors.',
    ],
    advanced: ['cursor pagination', 'idempotency keys', 'webhooks', 'OpenAPI', 'GraphQL/gRPC tradeoffs'],
    interview: ['Use concrete status codes.', 'Explain retry behavior.', 'Design stable error shapes.', 'Mention backward compatibility.'],
  },
  security: {
    picture: 'Threat -> trust boundary -> validation -> authn -> authz -> audit',
    mentalModel:
      'Security starts by asking who can send data, what they can control, what they are allowed to do, and what evidence you retain when something goes wrong.',
    fundamentals: [
      'A trust boundary is the line between code/data you control and code/data someone else can influence, such as browser input, webhooks, files, and network requests.',
      'Authentication, often shortened to authn, answers “who are you?” using passwords, sessions, API keys, OAuth tokens, or certificates.',
      'Authorization, often shortened to authz, answers “are you allowed to do this action on this object?” after identity is known.',
      'Input validation checks that incoming data has the right type, size, format, and allowed values before the backend trusts or stores it.',
      'Secret handling means keeping passwords, tokens, private keys, and database credentials out of source code and logs.',
      'Audit logs are security-relevant records of who did what and when, which helps investigate incidents and prove sensitive actions happened.',
    ],
    diagram: ['Attacker', 'Input', 'Authn', 'Authz', 'Data', 'Audit'],
    diagramExplanations: [
      'The attacker is anyone — human or automated — who sends your backend unexpected, malicious, or crafted input. This is not just hackers: it includes bots scanning for known vulnerabilities, users who accidentally send bad data, and internal services that send malformed messages. Security thinking starts by asking: who can send data to this endpoint, what can they control, and what is the worst thing they could do with that control? Design every endpoint assuming the caller is adversarial.',
      'Input is the attack surface. Every field the client can send is a potential injection point: SQL injection (embedding SQL in a text field), command injection (embedding shell commands), path traversal (../../etc/passwd in a filename), XSS (embedding HTML in data that gets rendered), or SSRF (submitting a URL that makes your server call an internal service). The defense is strict validation and sanitization at every trust boundary — reject unknown fields, validate types and lengths, and use parameterized queries instead of string-building SQL.',
      'Authentication (authn) proves who is making the request. Common mechanisms: session cookies (the server stores a session and gives the browser a cookie to identify it), JWTs (a signed token the client sends in the Authorization header that the server verifies cryptographically), API keys (a secret string the client includes in headers), and OAuth (delegated access via a third-party identity provider). Authentication must happen before your handler logic runs, typically in middleware. A missing or invalid credential should return 401 — meaning "I do not know who you are."',
      'Authorization (authz) checks whether the authenticated caller is allowed to perform this specific action on this specific resource. Authentication and authorization are different: you can know exactly who someone is (authn) while still refusing to let them access another user\'s data (authz). Authorization checks should happen after authentication and before any data is read or written. A failed authorization check returns 403 — meaning "I know who you are, but you cannot do this." Common bugs: checking permission on the resource type but not the specific record (any user can delete any other user\'s data).',
      'Data protection means keeping sensitive information safe at rest and in transit. Never store plaintext passwords — use a slow hashing algorithm like bcrypt or Argon2 that makes brute-force attacks expensive. Never log sensitive fields like passwords, credit card numbers, or social security numbers. Keep secrets (API keys, database credentials, private keys) out of source code and version history — use environment variables or a secrets manager. Encrypt data at rest for sensitive tables. Rotate secrets regularly and revoke immediately when compromised.',
      'An audit log is an append-only record of security-relevant events: who logged in, who changed what data, who was denied access, and when. Audit logs are essential for incident response — when something goes wrong, you need to reconstruct exactly what happened and who did it. Good audit logs include: a timestamp, the actor (user ID or service), the action taken, the resource affected, the outcome (success or failure), and a request ID. Audit logs must be tamper-resistant: store them in a separate system from the data they record, and never let application code delete them.',
    ],
    tutorial: ['Identify the attacker-controlled input.', 'Authenticate the caller.', 'Authorize the object/action.', 'Validate and encode data.', 'Log security-relevant decisions.'],
    advanced: ['OAuth/OIDC', 'CSRF', 'SSRF', 'JWT pitfalls', 'password hashing parameters'],
    interview: ['Separate authn from authz.', 'Never roll your own crypto.', 'Validate at boundaries.', 'Explain the attacker model.'],
  },
  architecture: {
    picture: 'Boundary -> module/service -> data ownership -> async work -> failure recovery',
    mentalModel:
      'Architecture is controlled separation. You decide what owns data, what runs synchronously, what moves to a queue, and how the system recovers when pieces fail.',
    fundamentals: [
      'A module is a small area of code with one responsibility, such as billing, users, or email, so changes stay understandable.',
      'A service boundary decides where one part of the system ends and another begins, including who owns data and who calls whom.',
      'A queue stores work to be done later, which helps move slow or unreliable tasks out of the user-facing request path.',
      'A retry means trying a failed operation again, usually because the failure might be temporary, like a network timeout.',
      'Idempotency means running the same operation more than once has the same final effect, which prevents duplicate charges, emails, or database rows.',
      'Consistency describes how quickly all parts of a system agree on the same facts after data changes.',
    ],
    diagram: ['API', 'Service', 'DB', 'Queue', 'Worker', 'DLQ'],
    diagramExplanations: [
      'The API is the front door of your system: the set of HTTP endpoints (or gRPC methods, or GraphQL queries) that external callers — browsers, mobile apps, other services — use to interact with your backend. A well-designed API is stable and predictable: callers should be able to write code against it and not have it break when you change the internals. The API layer should be thin — it receives requests, validates input, calls services, and returns responses. Business logic belongs deeper in the stack.',
      'A service (in the architectural sense) is a unit of your system with one clear responsibility and ownership of its data. A user service manages user accounts. An order service manages orders. Services communicate with each other via HTTP APIs, gRPC calls, or messages on a queue. The key rule: each service owns its database tables and no other service queries them directly. This boundary means a service can change its internal database schema without breaking other services. When services share a database, every team becomes afraid to change anything.',
      'The database stores the persistent facts of your system — the data that must survive process restarts, be shared across multiple service instances, and be queryable over time. In an architecture context, the database is private to its service. Service A should never run SQL queries against Service B\'s tables; it should call Service B\'s API instead. This keeps each service independently deployable and testable. Multiple services sharing one database creates tight coupling: a schema change in one service breaks code in another.',
      'A queue is a holding area for work that does not need to happen immediately. Instead of sending an email or resizing an image inside the HTTP handler (which adds latency and fails the whole request if the email service is down), you push a message onto a queue and return immediately. The queue stores the message durably — it survives process restarts. A queue decouples the caller (who creates work) from the worker (who does work) so they can scale independently and fail independently. Common queue systems: Redis Streams, RabbitMQ, SQS, and Kafka.',
      'A worker is a long-running process that reads messages from a queue and does the actual work: sending emails, resizing images, generating reports, charging credit cards, syncing data. Workers run outside the HTTP request path so slow work does not make your API slow. Workers should be idempotent — processing the same message twice produces the same result with no side effects. This is necessary because queues sometimes deliver messages more than once. Workers should also handle partial failures gracefully: if processing fails, the message should be retried rather than silently dropped.',
      'A DLQ (Dead Letter Queue) is where messages go after they have failed too many times. If a worker fails to process a message 3 or 5 times in a row (often because the data is malformed or the downstream system is broken), the queue moves the message to the DLQ instead of retrying forever. The DLQ is not a trash can — it is a diagnostics tool. You monitor it, investigate why messages are failing, fix the problem, and replay the messages. Without a DLQ, a single bad message can block an entire queue indefinitely or cause a worker to crash-loop.',
    ],
    tutorial: ['Draw the boundary.', 'Choose synchronous vs asynchronous work.', 'Define data ownership.', 'Add retries and idempotency.', 'Plan observability and recovery.'],
    advanced: ['outbox pattern', 'sagas', 'circuit breakers', 'backpressure', 'eventual consistency'],
    interview: ['Clarify consistency requirements.', 'Do not default to microservices.', 'Explain failure recovery.', 'Show ownership boundaries.'],
  },
  devops: {
    picture: 'Code -> build -> config -> deploy -> health -> observe -> rollback',
    mentalModel:
      'Delivery work makes code repeatable and operable. The service must build the same way, boot from environment config, expose health, and be observable during rollout.',
    fundamentals: [
      'A build artifact is the packaged output of your code, such as compiled files, a server bundle, or a container image that can be deployed.',
      'A container packages an app with its runtime environment so it can run more predictably across machines.',
      'Environment config is runtime configuration from variables or secret stores, such as DATABASE_URL, instead of hardcoded values in code.',
      'A health check is an endpoint or command that tells the platform whether the service is alive and ready to receive traffic.',
      'CI/CD means Continuous Integration and Continuous Delivery/Deployment: automated checks, builds, and releases that reduce manual release mistakes.',
      'A rollback returns production to a previous known-good version when a release breaks behavior or reliability.',
    ],
    diagram: ['Code', 'CI', 'Image', 'Config', 'Deploy', 'Health', 'Rollback'],
    diagramExplanations: [
      'Code is what engineers write and commit to a version control system like Git. A good codebase is reproducible: anyone who checks out the same commit should be able to build and run it with the same behavior. Code should not contain secrets (API keys, database passwords) hardcoded — those belong in environment config. It should include tests, a lockfile for dependencies, and a way to build a deployable artifact. "It works on my machine" is a red flag; "it works from a clean checkout" is the standard.',
      'CI (Continuous Integration) is an automated system that runs every time code is pushed. It checks out the code, installs dependencies, runs linters, type checkers, and tests, and reports pass or fail. The goal is to catch problems immediately — before code merges — rather than discovering them in production. A good CI pipeline is fast (under 10 minutes for most changes), runs on every pull request, and blocks merges when checks fail. Common CI systems: GitHub Actions, GitLab CI, CircleCI, and Buildkite.',
      'A container image is a packaged snapshot of your application and everything it needs to run: the runtime (Node.js, Python), your code, and all dependencies. Images are built from a Dockerfile that describes the steps to assemble the package. An image built once runs identically everywhere — your laptop, a test server, and a production cluster. Images are stored in a registry (Docker Hub, ECR, GCR) and referenced by a tag or digest. Using the same image from CI all the way to production eliminates "it worked in staging" surprises.',
      'Config is all the runtime settings your app needs that differ between environments: the database URL (different for local, staging, and production), secret keys, API keys for third-party services, feature flags, and port numbers. Config must never be hardcoded in the image — hardcoded config means rebuilding the image for every environment. Instead, config is injected at runtime via environment variables or a secrets manager. The app reads process.env.DATABASE_URL and the platform provides the value. This keeps secrets out of version control and allows one image to run in any environment.',
      'Deployment is the process of taking a new version of your app and making it serve live traffic. A good deployment is zero-downtime: new instances start and prove they are healthy before old instances stop accepting connections. Common strategies: rolling (replace instances one at a time), blue-green (spin up a full new fleet, switch traffic, keep old fleet for instant rollback), and canary (send 5% of traffic to the new version, watch metrics, then promote). Deployments should be automated, repeatable, and triggered by the CI pipeline — never by manually copying files to a server.',
      'A health check is how the platform knows your app is alive and ready for traffic. Liveness checks ask "is the process running?" — a failing liveness check causes the platform to restart the container. Readiness checks ask "can this instance serve requests right now?" — a failing readiness check removes the instance from the load balancer without restarting it. Readiness checks fail during startup (while connecting to the database) and should also fail if a critical dependency is unreachable. Without health checks, the platform sends traffic to instances that are crashing or not yet initialized.',
      'A rollback is reverting production to the previous known-good version when a new release causes problems. Good rollback means: keeping the previous image tag available, having a one-command or one-click way to deploy it, and testing the rollback procedure before you need it in an emergency. Rollbacks are complicated by database migrations: a migration that drops a column cannot be undone just by redeploying the old code. This is why migrations should be forward-compatible (add columns before removing old ones, use expand-and-contract patterns) so the old code can run against the new schema during a rollback.',
    ],
    tutorial: ['Build a reproducible artifact.', 'Inject config at runtime.', 'Run checks before deploy.', 'Use readiness before traffic.', 'Watch metrics and logs after release.'],
    advanced: ['zero-downtime deploys', 'secret rotation', 'migration ordering', 'canaries', 'capacity planning'],
    interview: ['Separate build-time and runtime config.', 'Know rollback limits.', 'Explain readiness vs liveness.', 'Mention migration safety.'],
  },
  performance: {
    picture: 'Measure -> identify bottleneck -> change one thing -> verify -> guardrail',
    mentalModel:
      'Performance is evidence-driven. You measure latency, throughput, resource use, and query behavior before choosing caches, indexes, batching, or concurrency changes.',
    fundamentals: [
      'Latency is how long one request or operation takes from start to finish; users feel latency directly as waiting.',
      'Throughput is how much work the system handles over time, such as requests per second or jobs per minute.',
      'p95 and p99 are percentile latency numbers: p95 means 95 percent of requests were faster than that value, which reveals slow tail behavior averages hide.',
      'Query count is the number of database queries one operation runs; too many queries can make an endpoint slow even when each query is small.',
      'Caching stores reused results closer to the caller so repeated work is faster, but it creates freshness and invalidation problems.',
      'Capacity is the amount of traffic, data, CPU, memory, network, or database load the system can handle before it degrades.',
    ],
    diagram: ['Measure', 'Profile', 'Bottleneck', 'Fix', 'Verify', 'Alert'],
    diagramExplanations: [
      'Measuring means collecting real numbers about how your system is performing before touching any code. The key metrics are latency (how long each request takes, measured at p50, p95, and p99 percentiles), throughput (requests per second), error rate (what percentage of requests fail), and resource utilization (CPU, memory, database connections). You cannot improve what you have not measured. Optimizing without measurements leads to guessing: you might speed up code that runs in 2ms while the real bottleneck is a database query taking 800ms.',
      'Profiling means zooming in on a specific request or operation to see exactly where time is spent. Tools like distributed tracing (Jaeger, Datadog APM) break one request into spans — each span shows how long a function call, database query, or external API call took. Profiling reveals the actual bottleneck, which is almost never where you assumed. Common findings: one slow SQL query causing 90% of the latency, an N+1 query pattern making 50 database calls per request instead of one, or a synchronous external API call blocking the entire request.',
      'A bottleneck is the one thing that limits your system\'s speed or capacity. Every system has a bottleneck — the slowest link in the chain. Common bottlenecks: a slow database query that runs on every request, a single-threaded process doing CPU-heavy work, a third-party API with a slow response time, or a database connection pool that is exhausted under load. Identifying the real bottleneck matters because fixing a non-bottleneck has zero effect on overall performance. If the database is at 100% CPU and the app server is at 5%, adding more app servers does nothing.',
      'A fix is the smallest change that removes or reduces the bottleneck. Common fixes: adding a database index (turns an 800ms sequential scan into a 2ms lookup), adding caching (stops repeating an expensive computation), batching N+1 queries into one (reduces 50 queries to 1), moving slow work to a background queue (removes it from the request path entirely), or adding database connection pooling (stops exhausting connections under load). Choose the simplest fix first — cache a query result before rewriting the schema.',
      'Verification means proving the fix actually helped with real measurements, not just intuition. Run the same benchmark or load test before and after the change. Check that p95 latency improved, that database query time dropped, that error rate did not increase. Verification also checks for regressions: a caching layer might improve read latency but introduce stale data bugs. Performance fixes must be measured in production-like conditions — a laptop benchmark rarely predicts production behavior under real concurrency and data volume.',
      'An alert is an automated notification that triggers when a metric crosses a threshold, indicating the system needs attention. Good alerts are actionable: every alert should have a clear response (check these dashboards, run this query, look at these logs). Bad alerts are noisy: alerting on CPU > 50% every hour trains engineers to ignore them. Set alerts on user-visible outcomes: error rate above 1%, p99 latency above 500ms, queue depth growing without bound. Alerts should wake someone up only when action is actually required — alert fatigue causes real problems to be missed.',
    ],
    tutorial: ['Define the user-visible slowness.', 'Measure p95/p99 and error rate.', 'Break time into app, DB, network, and external calls.', 'Apply the smallest fix.', 'Add a regression guard.'],
    advanced: ['load testing', 'cache stampede prevention', 'connection pooling', 'hot partitions', 'backpressure'],
    interview: ['Do not optimize blind.', 'Use percentiles, not just averages.', 'Name bottleneck evidence.', 'Explain cache invalidation risk.'],
  },
  'system-design': {
    picture: 'Requirements -> estimates -> APIs -> data -> scale -> failure modes',
    mentalModel:
      'System design is structured tradeoff narration. Requirements drive traffic estimates, estimates drive storage/API choices, and failure modes drive resilience.',
    fundamentals: [
      'Requirements are the must-have behaviors and constraints, such as who uses the system, what they do, latency goals, privacy needs, and scale.',
      'Traffic estimates are rough calculations for reads, writes, users, storage, and bandwidth so design choices match expected load.',
      'API design defines how clients talk to the system: endpoints, methods, request bodies, responses, pagination, and errors.',
      'A data model defines the main objects in the system, their fields, relationships, and rules about what must always be true.',
      'Storage choice means deciding where data lives, such as a relational database, document store, cache, object storage, search index, or queue.',
      'Failure modes are the ways the system can break, such as timeouts, duplicate messages, bad deploys, overloaded databases, and regional outages.',
    ],
    diagram: ['Requirements', 'Estimate', 'API', 'Data', 'Scale', 'Failures'],
    diagramExplanations: [
      'Requirements are the must-have behaviors and constraints your system needs to satisfy. Before designing anything, clarify: who are the users, what are they doing, how many of them are there, what is the acceptable latency, what data must never be lost, and what regulatory constraints apply? Vague requirements lead to vague designs. In a system design interview, asking clarifying questions is not stalling — it is the correct first move. A design without requirements is fiction.',
      'Estimation means doing rough math to understand the scale of the problem before choosing a solution. Estimate: daily active users → requests per second → database reads and writes per second → storage needed per year → bandwidth. These do not need to be precise, just within an order of magnitude. Estimates drive decisions: 100 writes/second is fine for a single PostgreSQL instance; 100,000 writes/second requires sharding or a different storage technology. Skipping estimates means designing for an imaginary scale.',
      'API design is defining the interface between your system and its callers. Decide: what endpoints exist, what HTTP methods they use, what the request body looks like, what the response body looks like, how errors are represented, and how pagination works for lists. API design happens before implementation because once callers depend on an API shape, changing it breaks them. A stable, well-documented API allows teams to work independently. Common questions: REST vs gRPC vs GraphQL, versioning strategy, and authentication mechanism.',
      'The data model defines what information your system stores, how it is organized, and what rules govern it. Decide: what are the main entities (User, Order, Product), what fields do they have, what are the relationships between them (one user has many orders), and what constraints must always hold (an order total must be positive). Storage choices follow from the data model: a relational database for structured relational data, a document store for flexible schemas, a time-series database for metrics, and object storage for files. Get the data model wrong early and you pay for it forever.',
      'Scale means designing for more load than you currently have — more users, more data, more traffic. Common scaling techniques: horizontal scaling (adding more servers instead of one bigger server), caching (storing computed results closer to the caller), database read replicas (serving reads from a copy of the database so writes go to one place), sharding (splitting data across multiple database instances by user ID or region), and CDNs (serving static assets from servers near the user). Not every system needs all of these — premature scaling adds complexity. Scale to your estimated peak load, not theoretical maximums.',
      'Failure modes are the specific ways your system can break, and how it behaves when each failure occurs. Every component you add is a new failure point: the database can go down, the queue can fill up, the external payment API can timeout, a bad deploy can crash your servers, a network partition can split your cluster. For each failure, ask: what does the user experience, what does the system do (retry, fail fast, degrade gracefully), and how do you detect and recover? Systems that handle failures gracefully are called resilient. A design that only works when everything is healthy is not production-ready.',
    ],
    tutorial: ['Ask clarifying questions.', 'Estimate reads, writes, and storage.', 'Design APIs and data model.', 'Identify bottlenecks.', 'Add reliability and observability.'],
    advanced: ['partitioning', 'multi-region design', 'consistency tradeoffs', 'disaster recovery', 'evolution over time'],
    interview: ['Clarify before designing.', 'Estimate out loud.', 'Trade off explicitly.', 'Return to requirements at the end.'],
  },
  capstone: {
    picture: 'Product goal -> API -> data -> code -> tests -> deploy -> runbook',
    mentalModel:
      'Capstones combine every backend layer. The goal is not just working code; it is a service with contracts, correctness, tests, deployment, monitoring, and recovery.',
    fundamentals: [
      'Scope is the clear boundary of what the project will and will not build, which keeps the capstone from turning into an endless feature pile.',
      'Contracts are promises between parts of the system, such as API schemas, event formats, database constraints, and error responses.',
      'A data model defines what information the app stores and how records relate to each other.',
      'Tests are automated proof that core behavior, edge cases, and failure paths still work after changes.',
      'Deployment is the process of putting the service somewhere real users or other systems can reach it.',
      'A runbook is an operator guide for how to start, check, debug, roll back, and recover the service.',
    ],
    diagram: ['Scope', 'API', 'DB', 'Service', 'Tests', 'Deploy', 'Operate'],
    diagramExplanations: [
      'Scope is the boundary of what you will build. Write one sentence stating the user problem, a list of features you will ship, and an explicit list of features you will not ship. Without a clear scope, projects expand forever — every new idea feels almost free to add. A well-scoped capstone is achievable in a defined time. If you are not sure whether a feature is in scope, it is out of scope.',
      'The API is the contract your service makes with callers. Design it before writing any code: what endpoints exist, what HTTP methods they use, what the request body looks like, and what the response looks like for both success and error. Write this down in a README or spec file. This gives you a target to build toward and makes it obvious when you are finished. An API designed after implementation is shaped by accidents rather than caller needs.',
      'The database schema is the foundation everything else builds on. List entities (User, Order, Product), define their columns and types, add constraints (NOT NULL, UNIQUE, FOREIGN KEY), and write the initial migration before touching any application code. A wrong schema forces you to fight your data model on every query. Get it right upfront — adding columns later is fine, but removing them requires careful migration coordination.',
      'The service layer is where your business rules live. Services receive structured inputs, perform logic, and return results or errors. They know nothing about HTTP — no request objects, no status codes, no JSON serialization inside service code. This separation means the same service can be called from an HTTP route, a background job, a CLI, or a test. Keep each service small and focused on one responsibility.',
      'Tests are not optional for a capstone — they are evidence that the thing works. Write at minimum: the happy path (normal successful case), two error paths (bad input, missing resource), and one edge case (empty list, duplicate, boundary value). Tests should call real endpoints against a real test database, not mocks of your own code. If the tests pass, you can refactor with confidence. If there are no tests, every change is a gamble.',
      'Deployment makes your capstone real — a project that only runs on your laptop is a demo, not a service. Deploy to a real host with environment variables injected via platform config, not hardcoded. Run database migrations as part of the deploy pipeline. Document the deploy process in your README so anyone can reproduce it. A deployable service is one that can fail, be diagnosed, and be brought back — not just one that worked once.',
      'Operating a service means keeping it alive and diagnosable after deploy. At minimum: add a /health endpoint the platform can call, emit structured logs with request ID and status code on every request, and write a brief runbook in your README covering how to check health, read logs, run migrations, and roll back a bad deploy. A service with no operational documentation will be abandoned the first time something breaks at 2am.',
    ],
    tutorial: ['Write the product goal.', 'Define contracts and data.', 'Build core paths.', 'Add tests and failure handling.', 'Deploy with observability and a runbook.'],
    advanced: ['cross-cutting auth', 'background jobs', 'migrations', 'incident drills', 'load testing'],
    interview: ['Tell the end-to-end story.', 'Justify tradeoffs.', 'Show rollback strategy.', 'Connect code to operations.'],
  },
  typescript: {
    picture: 'Unknown input -> runtime validation -> typed DTO -> service result -> HTTP response',
    mentalModel:
      'TypeScript makes internal contracts explicit, but runtime data is still untrusted. The backend pattern is validate unknown input, narrow it, then pass typed data through services and repositories.',
    fundamentals: [
      'Primitive types are basic values like string, number, boolean, null, and undefined.',
      'Object shapes describe which fields an object has and what type each field should be, such as { id: string; email: string }.',
      'A union type means a value can be one of several types, such as string | null or "draft" | "published".',
      'Narrowing is the process of checking a value at runtime so TypeScript can treat it as a more specific type afterward.',
      'A generic is a reusable type with a placeholder, like Array<T>, that preserves information about the value being passed through.',
      'unknown means “I do not know this type yet, so I must check it”; any means “stop checking,” which can hide bugs.',
    ],
    diagram: ['Unknown', 'Validate', 'Narrow', 'DTO', 'Service', 'Result'],
    diagramExplanations: [
      'Unknown is the TypeScript type that means "I have no idea what this is yet — do not trust it." Every JSON request body that arrives at your server is typed as unknown, because TypeScript cannot know at compile time what the client actually sent. Using unknown forces you to check the data before using it. Compare this to any, which says "stop checking" — any defeats the whole point of TypeScript and silently allows bugs to slip through.',
      'Validation is the runtime check that turns unknown data into something you can trust. You check: is the field present? Is it the right type (string, number, array)? Is it within allowed bounds (length, range, format)? Libraries like Zod, Joi, or Yup do this with a schema you define. If validation fails, return a 400 error with field-level messages before any business logic runs. Never skip validation just because you expect the client to send the right thing — they will not, accidentally or intentionally.',
      'Narrowing is how TypeScript uses the results of runtime checks to treat a value as a more specific type. After you check if (typeof value === "string"), TypeScript knows value is a string inside that block and offers string methods. After you check if (user !== null), TypeScript knows user is not null. Narrowing bridges the gap between unknown runtime data and the typed code your services expect — TypeScript enforces that you actually checked the thing before using it as a specific type.',
      'A DTO (Data Transfer Object) is a typed object that represents validated, trusted input to your system. After validation and narrowing, you construct a DTO: a plain object with a known TypeScript interface. For example: { userId: string; amount: number; currency: "USD" | "EUR" }. DTOs make it clear that this data has been checked and is safe to pass into service code. Service functions should accept DTOs as parameters, not raw request bodies — this enforces the validation step and makes services independently testable.',
      'The service receives the DTO and does the actual work: looking up a record, checking a business rule, computing a value, calling an external API, writing to the database. The service returns either a success value or a typed error. Services should never throw generic Error objects for expected failures (record not found, insufficient balance, duplicate email) — those should be typed return values so the caller can handle them explicitly. Unexpected exceptions (database down, bug) can still throw and be caught by global error middleware.',
      'The result is what the service returns. A common pattern is a discriminated union: { ok: true; data: Order } | { ok: false; error: "NOT_FOUND" | "INSUFFICIENT_BALANCE" }. The HTTP handler checks which variant it got and maps it to the right status code and response body. This pattern makes every error path explicit at compile time — the TypeScript compiler forces you to handle both ok: true and ok: false before the code compiles, eliminating unhandled error cases.',
    ],
    tutorial: ['Start with unknown at the boundary.', 'Validate required fields.', 'Use precise types for internal code.', 'Return discriminated results.', 'Map results to HTTP responses.'],
    advanced: ['branded IDs', 'mapped types', 'strict tsconfig', 'exhaustive never checks', 'type-only imports'],
    interview: ['Types do not validate JSON at runtime.', 'Use discriminated unions for state.', 'Avoid any at boundaries.', 'Explain strict mode flags.'],
  },
  'typescript-drills': {
    picture: 'Type annotation -> compiler feedback -> implementation -> tests -> safer refactor',
    mentalModel:
      'TypeScript drills train two muscles at once: writing JavaScript behavior and expressing the contract so the compiler catches misuse before runtime.',
    fundamentals: [
      'A function signature names the inputs and output of a function, which tells callers how to use it correctly.',
      'An array is a variable-length list of same-kind values; a tuple is a fixed-position list where each slot has a known meaning.',
      'An interface describes the fields and methods an object should have, which is useful for DTOs, services, and dependency boundaries.',
      'A union allows a value to be one of several possibilities, which helps model real states like success or failure.',
      'A generic lets one function or type work with many value types while still remembering the specific type.',
      'Utility types are built-in helpers like Partial, Pick, Omit, and Record that transform object types without rewriting them by hand.',
    ],
    diagram: ['Signature', 'Types', 'Implement', 'Compile', 'Test'],
    diagramExplanations: [
      'A function signature is the declaration of what a function expects and what it returns: function add(a: number, b: number): number. The signature is a contract — it tells every caller exactly what to pass and what to expect back. TypeScript uses the signature to catch mistakes at compile time: passing a string where a number is expected is a compile error, not a runtime crash. Write the signature before the body — it forces you to think about the interface before the implementation.',
      'Types are the vocabulary TypeScript uses to describe data shapes. Primitive types (string, number, boolean) describe single values. Object types ({ id: string; email: string }) describe structured data. Array types (string[]) describe lists. Union types (string | null) describe values that can be one of several things. Literal types ("draft" | "published") describe specific string or number values. Getting types right means the compiler finds mismatches before they become runtime bugs.',
      'Implementation is writing the actual runtime JavaScript behavior inside the function body. Types guide what you can do — if a parameter is typed as string | null, TypeScript will not let you call string methods on it without first checking it is not null. This back-and-forth between types and implementation is the TypeScript workflow: types constrain what you can write, and what you write must satisfy the types. When implementation and types disagree, fix the type or fix the implementation — do not use any to silence the error.',
      'Compilation is when TypeScript checks your code for type errors before it runs. The TypeScript compiler (tsc) reads your source, checks every type against every usage, and reports errors if anything does not match. A passing compilation check means: the types you declared are consistent with how you used them. It does not mean the logic is correct — you can have a perfectly typed function that returns the wrong answer. Types prove contracts; tests prove behavior.',
      'Tests prove the runtime behavior is correct by running the actual function with known inputs and asserting the outputs. TypeScript cannot check logic: it cannot tell you that your add(a, b) mistakenly returns a - b. Tests catch that. For a TypeScript drill, write tests that cover: the normal case (valid inputs, expected output), at least one edge case (zero, empty string, boundary value), and one invalid input case (wrong type handled gracefully, null handled). A function that passes TypeScript compilation and all tests is production-ready.',
    ],
    tutorial: ['Read the expected function signature.', 'Model the input and output types first.', 'Implement the runtime behavior.', 'Let compiler errors guide the contract.', 'Run tests and explain the edge case.'],
    advanced: ['generic constraints', 'keyof access', 'mapped types', 'readonly contracts', 'literal unions'],
    interview: ['Say what the compiler proves.', 'Say what runtime tests still prove.', 'Use generics only when they preserve information.', 'Prefer readable types over type gymnastics.'],
  },
  nodejs: {
    picture: 'Request -> event loop -> async IO -> service code -> response/error',
    mentalModel:
      'Node.js is built around an event loop and non-blocking IO. Backend skill means keeping CPU work controlled, async errors handled, streams backpressured, and process config explicit.',
    fundamentals: [
      'The event loop is Node.js’s scheduler: it lets Node start I/O work, keep serving other requests, then resume callbacks or promises when results are ready.',
      'Modules are files or packages you import and export so code can be split into reusable pieces.',
      'npm scripts are named commands in package.json, such as npm run test or npm run dev, that standardize how the project is run.',
      'async/await is syntax for working with promises so asynchronous code reads top-to-bottom while still waiting for I/O.',
      'Streams process data in chunks instead of loading everything into memory, which matters for large files, uploads, downloads, and logs.',
      'process env means environment variables available through process.env, commonly used for ports, database URLs, API keys, and feature flags.',
    ],
    diagram: ['Request', 'Event Loop', 'Async IO', 'Service', 'Error Handler', 'Response'],
    diagramExplanations: [
      'A request enters Node.js as an HTTP event. The framework (Express, Fastify, or the built-in http module) parses the incoming bytes into a structured request object: method, path, headers, and body. Node.js can handle many requests simultaneously, but they share a single thread — so the request handling code must not block that thread with synchronous heavy computation.',
      'The event loop is Node.js\'s core scheduler. Node.js is single-threaded: only one piece of JavaScript runs at a time. The event loop works like a to-do list manager — it picks up a task (an incoming request, a database result, a timer firing), runs it until it either finishes or hits an async operation, then picks up the next task. This means: synchronous CPU work (a for loop computing a hash) blocks every other request waiting to be processed. Keep sync work short; delegate heavy CPU work to worker threads.',
      'Async IO is how Node.js handles slow operations without blocking the event loop. When your code calls a database (await db.query(...)), reads a file (await fs.readFile(...)), or calls an external API (await fetch(...)), Node.js hands the work to the operating system and goes back to processing other requests. When the OS finishes, it puts the result on the event loop queue. The await keyword pauses only the current function — not the whole server. This is why Node.js can serve thousands of concurrent connections with a single thread.',
      'The service is your business logic, called from the route handler after input is validated. Services receive typed, validated data — never raw request objects. They perform the actual work: database reads and writes, calculations, external API calls, sending emails. A Node.js service function is usually async and returns a Promise. It should throw typed errors for expected failure cases (record not found) or return a discriminated result type, so the handler can map them to the right HTTP response.',
      'The error handler is Express middleware that catches everything that goes wrong. In Express, an error handler is a middleware function with four parameters: (err, req, res, next). When any route handler calls next(err) or throws inside an async handler, Express routes the error here. The error handler inspects the error (what type is it? what status code should this be?), logs it with the request ID, and sends a clean JSON error response. Never let unhandled errors leak raw stack traces to the client.',
      'The response is the final output sent back to the caller. A Node.js handler calls res.status(200).json({ data: user }) for success or res.status(404).json({ error: "NOT_FOUND" }) for failure. Choose the right status code. Set Content-Type: application/json. Include a request ID in a response header for log correlation. Once res.json() is called, the response is sent — do not call it twice. Calling next() after sending a response causes "headers already sent" errors.',
    ],
    tutorial: [
      'Start a tiny HTTP server or framework route and prove it can receive one request.',
      'Read params, query strings, headers, and JSON body separately so you know where each input comes from.',
      'Validate input before calling business logic, because client data is always untrusted.',
      'Await database, file, or network calls and decide how timeouts and rejected promises become HTTP errors.',
      'Return one clear JSON response and log the request id, status code, duration, and error when present.',
    ],
    advanced: ['stream backpressure', 'worker threads', 'process lifecycle', 'timeouts/retries', 'observability hooks'],
    interview: ['Explain why CPU blocks the loop.', 'Know Promise rejection paths.', 'Use streams for large payloads.', 'Do not hide config in code.'],
  },
  python: {
    picture: 'Input -> Python data structures -> typed function -> exception/result -> tests',
    mentalModel:
      'Python backend code should be explicit about data shape, errors, dependencies, and tests. Dynamic typing is powerful, but production code still needs contracts and validation.',
    fundamentals: [
      'A list is an ordered collection, a dict maps keys to values, a set stores unique values, and a tuple is an ordered collection usually treated as fixed.',
      'A function is a reusable block of Python code that takes arguments, performs logic, and returns a result.',
      'An exception is Python’s way to signal an error; backend code should catch expected exceptions and let unexpected ones become logged failures.',
      'A module is a Python file you can import from another file, which keeps code organized by responsibility.',
      'Typing means adding type hints like str, int, list[str], or dict[str, int] so humans and tools understand expected data shapes.',
      'A virtual environment is an isolated folder of Python packages for one project so dependencies do not clash with other projects.',
    ],
    diagram: ['Input', 'Data', 'Function', 'Error', 'Test', 'Package'],
    diagramExplanations: [
      'Input in Python can come from many places: command-line arguments (sys.argv), environment variables (os.environ), a web request body (request.json in Flask), a database row, a CSV file, or a queue message. All external input is untrusted. In Python, which is dynamically typed, there is no compiler to catch type mismatches — a function that expects an int silently receives a string and crashes at runtime. Always validate and coerce input explicitly before using it.',
      'Python\'s built-in data structures are the building blocks of backend code. A list ([]) is an ordered sequence. A dict ({}) maps keys to values and is used everywhere for structured data. A set({}) stores unique values. A tuple (()) is like a list but immutable — good for fixed-size data like a (latitude, longitude) pair. Choosing the right data structure matters: checking membership in a set is O(1); in a list it is O(n). Dicts preserve insertion order in Python 3.7+.',
      'A Python function is a named, reusable block of code. It takes arguments, does work, and returns a value. Good backend functions are small and do one thing. They avoid mutating their arguments — instead they return new values. They include type hints for clarity: def create_user(email: str, password: str) -> User: makes the contract obvious. Python does not enforce type hints at runtime, but they help linters, IDEs, and mypy catch mistakes before the code runs.',
      'Python uses exceptions for error handling. When something goes wrong — a file is missing, a network call fails, a value is the wrong type — Python raises an exception. Backend code should use try/except to catch expected exceptions and handle them explicitly: except FileNotFoundError: return a 404. Let unexpected exceptions (bugs) propagate up to a global error handler that logs them and returns a 500. Never use a bare except: that catches everything including keyboard interrupts and makes debugging nearly impossible.',
      'Python tests are written with pytest. A test is a function starting with test_ that calls your code with known inputs and asserts the outputs. Example: def test_create_user_returns_id(): assert create_user("a@b.com").id is not None. Pytest discovers and runs all test_ functions automatically. Use fixtures to set up shared resources (a test database). Use parametrize to run one test with many input/output pairs. Test your happy path, your error paths, and your edge cases (empty string, zero, None).',
      'A Python package is a directory with an __init__.py file that groups related modules together. You share packages through PyPI (the Python Package Index) using pip install. Your project\'s dependencies are declared in requirements.txt or pyproject.toml with pinned versions so every environment installs exactly the same packages. Use a virtual environment (venv) to isolate your project\'s packages from the system Python. Never install packages globally for a project — dependency conflicts between projects are painful to debug.',
    ],
    tutorial: ['Write the simplest function.', 'Use built-in data structures intentionally.', 'Handle invalid input explicitly.', 'Add type hints where they clarify contracts.', 'Parametrize tests.'],
    advanced: ['asyncio cancellation', 'GIL implications', 'context managers', 'packaging', 'serialization boundaries'],
    interview: ['Know mutable default pitfalls.', 'Explain the GIL accurately.', 'Prefer explicit exceptions.', 'Show pytest parametrization.'],
  },
  'python-drills': {
    picture: 'Syntax -> small function -> edge case -> test feedback -> fluency',
    mentalModel:
      'Python drills build fluency from tiny mechanics: loops, methods, comprehensions, dictionaries, slicing, exceptions, decorators, and testable functions.',
    fundamentals: [
      'A for loop repeats work over each item in a collection; a while loop repeats while a condition stays true.',
      'String methods are built-in text helpers like lower, strip, split, replace, startswith, and join.',
      'List methods are built-in list helpers like append, extend, pop, sort, and index for changing or querying ordered collections.',
      'Dict methods are built-in mapping helpers like get, keys, values, items, and setdefault for working with key-value data.',
      'Slicing reads part of a sequence using start, stop, and step, such as items[1:4] or text[::-1].',
      'A comprehension builds a list, dict, or set from a loop expression in one line when the transformation is simple and readable.',
    ],
    diagram: ['Read', 'Loop', 'Transform', 'Return', 'Test'],
    diagramExplanations: [
      'Reading the problem means understanding what input you are given, what output you must produce, and what the constraints are — before writing a single line of code. What is the type of the input: a list, a string, a dict, a number? What edge cases matter: empty input, a single element, duplicates, None? What should the function return when input is invalid? Spending 60 seconds reading carefully prevents an hour of debugging a solution that solves the wrong problem.',
      'A loop repeats code for each item in a collection. A for loop in Python is the idiomatic way to iterate: for item in items: does something for each item. A while loop repeats while a condition is true and is used when you do not know the count in advance. Python encourages iterating over collections directly (for user in users:) rather than using index-based loops (for i in range(len(users)):). Inside a loop, break stops early, continue skips to the next iteration, and else (rarely used) runs if the loop finished without break.',
      'Transformation is turning input into output — the core of most backend functions. Common Python transformations: filtering a list with a condition ([x for x in items if x > 0]), mapping values to new values ([x * 2 for x in items]), grouping by a key using a dict, sorting with sorted(items, key=lambda x: x.name), or accumulating with sum(), max(), min(). List comprehensions are concise and idiomatic for simple one-step transformations. For complex multi-step logic, a regular for loop with clear variable names is easier to read.',
      'Return sends a value back to the caller. Every function should have a clear, consistent return type. If a function can return None (when nothing is found), document that and handle it at the call site. Returning early on error conditions keeps the happy path readable: if not user: return None. Avoid returning different types from different code paths (sometimes a list, sometimes a string) — that makes the caller guess what they received. When a function modifies data rather than computing a result, it can return None explicitly.',
      'A pytest test proves that your function works by calling it with known inputs and asserting the result. assert add(2, 3) == 5 is a complete test. A failing assert raises AssertionError and pytest reports which test failed and what the actual vs expected values were. Write tests for: the normal case, at least one edge case, and the behavior on invalid input. Use pytest.mark.parametrize to run one test function with multiple input/output pairs — this catches corner cases without repeating test code.',
    ],
    tutorial: ['Read the function name and examples.', 'Choose the simplest Python construct.', 'Handle empty or invalid input.', 'Return exactly the expected shape.', 'Explain the idiom you used.'],
    advanced: ['decorators', 'memoization', 'iterators', 'context managers', 'async functions'],
    interview: ['Use idiomatic Python but keep it obvious.', 'Mention complexity when relevant.', 'Test empty inputs.', 'Know when comprehension hurts readability.'],
  },
  flask: {
    picture: 'WSGI request -> Flask route -> request context -> service -> response',
    mentalModel:
      'Flask is intentionally small. It gives routing, request/response helpers, and extension hooks; you must design structure, validation, persistence, auth, and tests deliberately.',
    fundamentals: [
      'An app factory is a function that creates and configures a Flask app, which makes testing and different environments easier.',
      'A route connects a URL path and HTTP method to a Python function that handles the request.',
      'The request context is Flask’s per-request storage that lets code access request, session, and related objects for the current request only.',
      'A blueprint groups related routes and setup code, such as all auth routes or all user routes, so the app stays organized.',
      'Config means settings for the app, such as database URLs, secret keys, debug mode, and feature flags.',
      'Extensions are Flask add-ons for common backend needs like databases, migrations, login, CORS, rate limiting, and admin pages.',
    ],
    diagram: ['WSGI', 'App', 'Route', 'Service', 'DB Session', 'Response'],
    diagramExplanations: [
      'WSGI (Web Server Gateway Interface) is the standard interface between a Python web framework and a production web server like Gunicorn or uWSGI. When a request arrives, the production server (Gunicorn) handles the network details and calls your Flask app through the WSGI interface, passing a dict of request data and a function to send the response. Flask is a WSGI application — your create_app() function returns an object that satisfies the WSGI contract. In development, Flask runs its own built-in server, but in production you always use Gunicorn or similar.',
      'The Flask app object is created by the app factory function: def create_app(config=None): app = Flask(__name__). The factory pattern creates a new app instance for each call, which is essential for testing (each test gets a fresh app with its own config) and for running multiple environments. The factory registers blueprints (route groups), configures extensions (database, login, CORS), and applies settings from environment variables or a config object. Never use a global Flask app for testing — always use the factory.',
      'A route is the mapping from a URL path and HTTP method to a Python function. In Flask: @app.route("/users/<int:user_id>", methods=["GET"]). The function receives the URL variable (user_id) as a parameter and the request body via flask.request. Route functions should be thin: read and validate input, call a service function, convert the result to a JSON response. Do not put business logic or database queries directly in route functions — that mixes concerns and makes testing harder.',
      'A service is a plain Python module or class that contains business logic. Services know nothing about Flask — no flask.request, no jsonify, no HTTP status codes. They receive plain Python arguments and return plain Python values or raise exceptions. This means the same service can be called from a Flask route, a CLI command, a background job, or a pytest test. Services are where you put the real work: checking if a username is taken, calculating an order total, sending a confirmation email.',
      'A database session in Flask-SQLAlchemy is a temporary workspace for database operations within one request. The session tracks objects you have read, modified, or created. At the end of the request, you commit (db.session.commit()) to save changes permanently, or rollback (db.session.rollback()) to discard them. A critical detail: sessions are not automatically closed after each request unless you configure it — a leaked session holds a database connection open, causing connection pool exhaustion under load. Use teardown_appcontext to ensure sessions are always removed after each request.',
      'A Flask response is created with jsonify(): return jsonify({"id": user.id, "email": user.email}), 201. The second argument is the HTTP status code. Flask sets Content-Type: application/json automatically. For errors, raise abort(404) or return jsonify({"error": "NOT_FOUND"}), 404. Register error handlers with @app.errorhandler(404) to produce consistent JSON error shapes instead of Flask\'s default HTML error pages. Never return different response shapes from the same endpoint — clients cannot reliably parse an inconsistent API.',
    ],
    tutorial: ['Create the app factory.', 'Register blueprints.', 'Validate request data.', 'Call a service layer.', 'Manage DB session scope.', 'Test with the Flask client.'],
    advanced: ['WSGI lifecycle', 'SQLAlchemy sessions', 'auth extensions', 'background jobs', 'production server config'],
    interview: ['Explain request context.', 'Use app factory for tests.', 'Keep business logic out of routes.', 'Know what Flask does not include.'],
  },
  django: {
    picture: 'URLConf -> view/DRF action -> serializer -> ORM -> response',
    mentalModel:
      'Django is batteries-included: routing, ORM, migrations, auth, admin, middleware, and settings. Mastery means using the defaults while knowing where query, migration, and permission bugs hide.',
    fundamentals: [
      'A Django project is the whole site configuration; a Django app is one feature area inside it, such as users, billing, or inventory.',
      'A model is a Python class that describes a database table and gives Django ORM methods for creating, reading, updating, and deleting rows.',
      'A migration is a versioned database change generated from model changes so schema updates can be applied safely over time.',
      'A view is the code that receives a web request and returns a response, either as HTML, JSON, redirect, or error.',
      'Serializers and forms validate incoming data and turn Python objects into response data or user-facing form errors.',
      'Settings are configuration values for databases, installed apps, middleware, secrets, static files, logging, and environment-specific behavior.',
    ],
    diagram: ['URL', 'View', 'Serializer', 'Permission', 'ORM', 'Response'],
    diagramExplanations: [
      'Django\'s URL configuration (URLconf) maps URL patterns to views. In urls.py you write: path("users/<int:pk>/", views.UserDetailView.as_view()). Django checks each pattern in order and calls the first matching view. URL patterns can capture variables (<int:pk>) and pass them to the view. The root urls.py can include other URL configs with include(), which is how Django apps stay modular. If no pattern matches, Django returns a 404.',
      'A view is the code that receives a request and returns a response. Class-based views (like APIView in DRF) organize request handling by HTTP method: def get(self, request, pk): handles GET requests. DRF\'s ModelViewSet provides CRUD for a model with almost no code. Views should be thin: read the request, call serializers for validation, check permissions, call business logic, and return a response. Avoid long views with if/else logic — that is a sign business logic has leaked into the view.',
      'A serializer in Django REST Framework does two jobs: it validates incoming request data (like a form), and it converts Python objects (like model instances) into JSON-serializable data for responses. A ModelSerializer generates both from your model definition automatically. Serializers check that required fields are present and have the right types, and they call is_valid() before you trust any data. Always call serializer.is_valid(raise_exception=True) before accessing serializer.validated_data — accessing unvalidated data causes subtle bugs.',
      'Permissions in DRF control who can perform which actions. IsAuthenticated ensures only logged-in users can access the view. IsAdminUser restricts to staff. Custom permissions (by subclassing BasePermission) check object-level rules like "can this user edit this specific order?". Permissions are checked before the view method runs. DRF calls has_permission() for every request and has_object_permission() for single-object operations. A missing permission check means any authenticated user can modify anyone else\'s data.',
      'Django\'s ORM translates Python code into SQL queries. User.objects.filter(email="a@b.com").first() runs SELECT ... WHERE email = \'a@b.com\' LIMIT 1. The ORM is powerful but has common pitfalls. N+1 queries are the most frequent: iterating over a queryset and accessing a related object inside the loop runs one query per iteration. Fix with select_related() (for foreign keys) or prefetch_related() (for many-to-many). Always check the number of queries your views make using Django Debug Toolbar or logging — one endpoint silently running 50 queries is a production problem.',
      'A Django response is returned from a view. DRF views typically use Response(data, status=status.HTTP_200_OK). The status module provides named constants (HTTP_201_CREATED, HTTP_400_BAD_REQUEST) that are clearer than raw numbers. DRF serializes the response data to JSON automatically. For error responses, raise serializers.ValidationError({"email": "already in use"}) from a serializer, or raise PermissionDenied from a permission check — DRF converts these to the correct status codes and JSON shapes automatically.',
    ],
    tutorial: ['Model data with constraints.', 'Create safe migrations.', 'Validate with serializers/forms.', 'Optimize ORM reads.', 'Apply permissions.', 'Test API behavior.'],
    advanced: ['select_related/prefetch_related', 'transaction.atomic', 'middleware', 'signals tradeoffs', 'async caveats'],
    interview: ['Call out N+1 quickly.', 'Respect migration safety.', 'Separate validation from constraints.', 'Know DRF permission flow.'],
  },
}

const fallback: SubjectTeaching = {
  picture: 'Concept -> example -> implementation -> tests -> production behavior',
  mentalModel:
    'Every backend concept should be learned in layers: define the idea, see a small example, implement or reason about it, test it, then connect it to production behavior.',
  fundamentals: [
    'A definition explains the idea in plain English before using jargon, acronyms, or framework-specific details.',
    'Inputs are the data, request, file, event, or user action that starts the backend behavior.',
    'Outputs are what the system returns or changes, such as JSON, a database row, a queued job, a log, or an error.',
    'Boundaries are the edges where data crosses between systems, users, services, processes, or trust levels.',
    'Failure modes are the specific ways this concept can break and what the backend should do when that happens.',
    'Tests are repeatable checks that prove the concept works for normal cases, edge cases, and bad inputs.',
  ],
  diagram: ['Define', 'Example', 'Build', 'Test', 'Operate'],
  diagramExplanations: [
    'Define means stating what the concept is in plain English before using technical vocabulary. A good definition answers: what problem does this solve, what does it do, and what does it not do? Skipping the definition and jumping straight to implementation produces code that works but whose author cannot explain it — a problem in code review, on-call, and interviews.',
    'An example is a small, concrete instance of the concept that makes the definition tangible. For a transaction: "transferring $50 from account A to account B — both the debit and the credit are in one transaction so they either both succeed or both fail." A good example fits in one or two sentences, uses numbers or real-sounding names, and highlights the interesting behavior or edge case.',
    'Build means implementing or reasoning through a working version of the concept. In a coding problem, this means writing the code. In a design problem, this means sketching the architecture. In a lesson problem, this means explaining the mechanism step by step as if you are talking to someone who will have to implement it. The goal is to go from understanding to demonstrated ability.',
    'Test means verifying the implementation handles the normal case, at least one error case, and at least one edge case. Testing is not optional — it is how you prove that "it works" is not just hope. For a concept exercise, testing also means explaining what you would check: what inputs cause failure, what invariants must hold, and how you would detect a regression.',
    'Operate means connecting the concept to production behavior: how would you debug it, what would go wrong under load, what would you monitor, and how would you know it is healthy? Backend engineers who can only build features but not operate them become a liability when things break at 3am. Every concept you learn should end with: "and in production, I would watch for..."',
  ],
  tutorial: ['Define the concept.', 'Walk through a tiny example.', 'Name failure behavior.', 'Prove it with checks.', 'Connect it to production.'],
  advanced: ['scale', 'operability', 'tradeoffs', 'debugging', 'evolution'],
  interview: ['Start simple.', 'Use a concrete example.', 'Name tradeoffs.', 'Mention tests and production evidence.'],
}

function modeFor(problem: Problem) {
  if (problem.type === 'coding') return 'Implement the smallest working version, run tests, then explain why each failing case failed.'
  if (problem.type === 'quiz') return 'Study the model first, then answer. The point is not guessing; it is recognizing the correct production behavior.'
  if (problem.type === 'debug') return 'Start with symptoms and evidence. Avoid changing code until you can name the likely layer and failure mode.'
  if (problem.type === 'design') return 'Clarify requirements, draw boundaries, name data and failure modes, then defend tradeoffs.'
  return 'Read the model, replay it in your own words, then use the prompt to prove you can apply it.'
}

export function getTeachingModel(subject: Subject, problem: Problem): TeachingModel {
  const base = subjectTeaching[subject.id] ?? fallback
  return {
    ...base,
    practiceMode: modeFor(problem),
    problemIntro: `No prior knowledge assumed. For "${problem.title}", start with the plain-English ${subject.title} model before answering. This problem is a ${problem.type} exercise, so the target is understanding first, then proof.`,
  }
}
