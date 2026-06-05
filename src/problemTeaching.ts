import type { Problem, Subject } from './course'

type SubjectTeaching = {
  picture: string
  mentalModel: string
  fundamentals: string[]
  diagram: string[]
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
