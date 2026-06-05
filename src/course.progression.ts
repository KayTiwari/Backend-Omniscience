import type { Problem } from './course'

type ProgressionSpec = {
  subject: string
  fundamentals: string[]
  guidedExample: string
  advanced: string[]
  interview: string[]
}

const specs: Record<string, ProgressionSpec> = {
  internet: {
    subject: 'Internet & HTTP',
    fundamentals: [
      'DNS, the Domain Name System, turns a hostname like api.example.com into an IP address; it does not return routes, JSON, headers, or database data',
      'TCP, the Transmission Control Protocol, creates a reliable ordered byte connection between two machines',
      'TLS, Transport Layer Security, verifies the server and encrypts traffic for HTTPS',
      'HTTP, the Hypertext Transfer Protocol, defines requests and responses with methods, paths, headers, status codes, and bodies',
    ],
    guidedExample: 'Trace GET /users/42 through DNS, TCP, TLS, HTTP headers, reverse proxy routing, app code, database read, response serialization, and client caching.',
    advanced: ['HTTP/2 multiplexing and head-of-line tradeoffs', 'CDN and browser cache validation', 'timeouts at every hop', 'load balancer and proxy header behavior'],
    interview: ['Never say DNS returns a URL', 'separate authentication from TLS', 'name where retries are safe', 'draw the request path before optimizing'],
  },
  language: {
    subject: 'Backend Language Core',
    fundamentals: [
      'control flow is the order code runs through if/else branches, loops, returns, and exceptions',
      'collections are containers such as arrays, lists, maps, dictionaries, and sets for storing multiple values',
      'errors are signals that something went wrong and must be handled, returned, or logged clearly',
      'files are persistent data outside memory, so code must handle missing paths, permissions, and large inputs',
      'tests are automated checks that prove normal cases, edge cases, and failure cases still work',
      'dependency boundaries separate pure logic from outside systems like files, databases, APIs, and clocks',
    ],
    guidedExample: 'Build a small log-processing CLI, then split parsing, aggregation, formatting, and filesystem access into testable pieces.',
    advanced: ['concurrency model', 'memory and CPU costs', 'package locking', 'structured errors', 'graceful shutdown'],
    interview: ['Talk in invariants and failure modes', 'prefer boring readable code', 'show how you would test edge cases', 'know your runtime model'],
  },
  sql: {
    subject: 'SQL & Databases',
    fundamentals: [
      'tables store records as rows and facts as columns',
      'keys and constraints keep records identifiable and protect rules the data must always obey',
      'joins combine related rows from multiple tables in one query',
      'indexes help the database find rows faster for common filters and sort orders',
      'transactions make a group of reads and writes succeed or fail as one unit',
      'isolation describes what concurrent transactions are allowed to see while other work is happening',
    ],
    guidedExample: 'Design users, orders, and payments tables, then write the read queries, write transaction, indexes, and migration plan.',
    advanced: ['locking and deadlocks', 'replication lag', 'sharding keys', 'query plans', 'online migrations'],
    interview: ['Start with data invariants', 'derive indexes from queries', 'explain isolation with a race', 'do not index everything'],
  },
  api: {
    subject: 'APIs',
    fundamentals: [
      'resource naming means choosing URL paths that describe backend things, such as /users or /orders/123',
      'methods are HTTP verbs like GET, POST, PATCH, and DELETE that communicate the intent of an API request',
      'status codes are numeric HTTP results that tell the client whether the request succeeded, failed from bad input, failed from auth, or failed on the server',
      'schemas describe the exact fields, types, and rules for request and response JSON',
      'pagination splits large result sets into pages or cursors so one API call does not return unlimited data',
      'error envelopes are consistent JSON error shapes with a code, message, and details clients can rely on',
    ],
    guidedExample: 'Design POST /orders and GET /orders with validation, idempotency, cursor pagination, errors, and versioning.',
    advanced: ['backward compatibility', 'webhook signatures', 'OpenAPI contracts', 'GraphQL/gRPC tradeoffs', 'client retry policy'],
    interview: ['Use concrete status codes', 'explain idempotency for writes', 'name retryable errors', 'design errors for clients first'],
  },
  security: {
    subject: 'Security',
    fundamentals: [
      'identity is the account, service, user, or machine making a request',
      'authentication proves who the caller is with a password, session, token, key, or certificate',
      'authorization decides whether that authenticated caller may perform an action on a specific resource',
      'input validation rejects unsafe, malformed, too-large, or unexpected data before trusting it',
      'secrets are credentials like API keys and passwords that must not be committed, leaked, or logged',
      'least privilege means every user, token, and service gets only the permissions it needs, not broad power',
    ],
    guidedExample: 'Secure a profile update endpoint with session/JWT auth, object-level authorization, CSRF awareness, rate limits, and audit logs.',
    advanced: ['OAuth flows', 'SSRF defenses', 'JWT pitfalls', 'password hashing parameters', 'threat modeling'],
    interview: ['Distinguish 401 from 403', 'never roll your own crypto', 'validate at trust boundaries', 'explain attacker incentives'],
  },
  architecture: {
    subject: 'Architecture & Messaging',
    fundamentals: [
      'modules group related code so one responsibility can be understood and changed in isolation',
      'services are independently owned pieces of backend behavior with clear data and API boundaries',
      'queues store work for later so slow or unreliable tasks do not block the user-facing request',
      'retries run an operation again when a temporary failure might recover',
      'idempotency makes repeated attempts safe by ensuring the final result does not duplicate side effects',
      'consistency describes when different parts of the system agree on the same data after a change',
    ],
    guidedExample: 'Move email sending out of a request into a job queue with retries, idempotency keys, dead-letter handling, and observability.',
    advanced: ['outbox pattern', 'sagas', 'circuit breakers', 'backpressure', 'eventual consistency'],
    interview: ['State the consistency model', 'draw boundaries and data ownership', 'explain failure recovery', 'avoid microservices as a reflex'],
  },
  devops: {
    subject: 'DevOps & Delivery',
    fundamentals: [
      'a build turns source code into a repeatable artifact that can be run or deployed',
      'a container packages the app and runtime dependencies into an image that runs predictably',
      'config is environment-specific runtime data such as ports, database URLs, feature flags, and secrets',
      'a deploy moves a tested build into an environment where traffic can reach it',
      'a health check tells the platform whether the service is alive, ready, and safe to send traffic to',
      'a rollback returns production to a previous version when a release causes damage',
    ],
    guidedExample: 'Package an API into a production Docker image, configure environment variables, run migrations, and deploy with readiness checks.',
    advanced: ['blue/green deploys', 'zero-downtime migrations', 'CI gates', 'secret rotation', 'capacity planning'],
    interview: ['Separate build-time from runtime config', 'know rollback limits after migrations', 'make health checks dependency-aware', 'watch logs and metrics during deploy'],
  },
  performance: {
    subject: 'Performance & Scaling',
    fundamentals: [
      'latency is how long one request or operation takes',
      'throughput is how much work the system completes per unit of time',
      'capacity is the limit of traffic, data, CPU, memory, database, or network load the system can handle',
      'caching stores reused data closer to the caller so repeated requests can be faster',
      'database access is often the slowest part of backend work, so query count, indexes, and connection use matter',
      'measurement means using logs, metrics, traces, and profiles before guessing what to optimize',
    ],
    guidedExample: 'Diagnose a slow endpoint by measuring p95 latency, DB query count, cache hit rate, payload size, and external dependency time.',
    advanced: ['load testing', 'cache stampede prevention', 'connection pools', 'backpressure', 'hot partition detection'],
    interview: ['Measure before optimizing', 'talk p95/p99 not only averages', 'identify bottlenecks by evidence', 'explain cache invalidation tradeoffs'],
  },
  'system-design': {
    subject: 'System Design',
    fundamentals: [
      'requirements define what the system must do, who uses it, and what constraints matter',
      'traffic estimates approximate reads, writes, users, storage, and bandwidth so design choices fit scale',
      'a data model names the objects, fields, relationships, and invariants the system stores',
      'API shape defines endpoints, methods, request bodies, responses, errors, and pagination',
      'storage choice decides whether data belongs in SQL, NoSQL, cache, object storage, search, queue, or another tool',
      'failure modes are the realistic ways the design can break and how the system should survive or recover',
    ],
    guidedExample: 'Design a URL shortener from API to datastore to cache to analytics, including redirects, abuse limits, and observability.',
    advanced: ['multi-region tradeoffs', 'partitioning', 'consistency choices', 'disaster recovery', 'evolution under scale'],
    interview: ['Clarify requirements first', 'estimate before choosing technology', 'name bottlenecks and mitigations', 'trade off explicitly'],
  },
  capstone: {
    subject: 'Capstones',
    fundamentals: [
      'scope defines what the project includes and excludes so the build stays finishable',
      'contracts are promises between clients, services, databases, and events about data shape and behavior',
      'a data model defines what the app stores and how records connect',
      'tests prove the most important behavior and failure paths still work',
      'deployment makes the backend reachable in a real environment',
      'operational readiness means the service has logs, health checks, rollback plans, and debugging instructions',
    ],
    guidedExample: 'Plan a production-grade backend project by writing the API contract, schema, service boundaries, test matrix, deploy plan, and runbook.',
    advanced: ['cross-cutting auth', 'observability', 'migrations', 'background jobs', 'failure drills'],
    interview: ['Tell the story end-to-end', 'justify tradeoffs', 'show test and rollback strategy', 'connect product requirements to technical choices'],
  },
  typescript: {
    subject: 'TypeScript',
    fundamentals: [
      'primitive types are basic values such as string, number, boolean, null, and undefined',
      'object shapes describe which fields an object has and what type each field should be',
      'unions allow a value to be one of several possible types or states',
      'narrowing uses runtime checks so TypeScript can treat a value as a more specific type',
      'generics let reusable code preserve the specific type flowing through it',
      'unknown requires checking before use, while any disables useful type checking and can hide bugs',
    ],
    guidedExample: 'Model a CreateUser request DTO, validate unknown JSON, return a typed service Result, and map it to an HTTP response.',
    advanced: ['branded IDs', 'exhaustive never checks', 'utility types', 'strict tsconfig', 'type-only imports'],
    interview: ['Types do not validate runtime JSON', 'prefer discriminated unions for states', 'avoid any at boundaries', 'explain strict mode flags'],
  },
  nodejs: {
    subject: 'Node.js',
    fundamentals: [
      'the event loop schedules asynchronous work so Node can wait for I/O without blocking every request',
      'modules are imported files or packages that split code into reusable pieces',
      'npm scripts are named project commands like npm run dev, npm run test, and npm run build',
      'async/await is syntax for writing promise-based asynchronous code in a readable order',
      'streams process data in chunks so large files and responses do not have to fit in memory all at once',
      'process config is runtime configuration from process.env, such as ports, URLs, secrets, and feature flags',
    ],
    guidedExample: 'Build a small HTTP API route, parse input, call async services, stream a response when needed, and handle errors centrally.',
    advanced: ['backpressure', 'worker threads', 'cluster/process management', 'timeouts', 'observability hooks'],
    interview: ['Explain why CPU work blocks the loop', 'know Promise error paths', 'use streams for large payloads', 'do not hide config in code'],
  },
  python: {
    subject: 'Python',
    fundamentals: [
      'data structures are containers like lists, dicts, sets, and tuples for organizing values',
      'functions package reusable logic with inputs and a return value',
      'exceptions signal errors and let code decide what can be handled versus what should fail loudly',
      'modules are Python files you import to organize code by responsibility',
      'typing adds hints such as str, int, list[str], and dict[str, int] so contracts are easier to understand',
      'virtual environments isolate one project’s installed packages from every other Python project',
    ],
    guidedExample: 'Write a small service function with typed inputs, validation, repository dependency injection, and pytest cases.',
    advanced: ['asyncio cancellation', 'GIL implications', 'packaging', 'context managers', 'serialization boundaries'],
    interview: ['Know mutable default pitfalls', 'explain GIL accurately', 'prefer explicit exceptions', 'show pytest parametrization'],
  },
  flask: {
    subject: 'Flask',
    fundamentals: [
      'the app object is the Flask application that owns routes, config, extensions, and request handling',
      'routes connect URL paths and HTTP methods to Python functions',
      'request context is Flask’s per-request storage for request data, session data, and helpers',
      'response objects define what status, headers, and body Flask sends back to the client',
      'blueprints group related routes and setup code so large apps stay organized',
      'extensions add common backend capabilities like database access, migrations, login, CORS, and rate limits',
    ],
    guidedExample: 'Build a Flask CRUD endpoint with an app factory, config object, blueprint, service layer, database session, and tests.',
    advanced: ['WSGI lifecycle', 'SQLAlchemy session scope', 'auth extensions', 'background jobs', 'production server config'],
    interview: ['Explain request context without hand-waving', 'use app factory for testability', 'keep business logic out of routes', 'know what Flask does not provide'],
  },
  django: {
    subject: 'Django',
    fundamentals: [
      'project/app layout means one Django project contains configuration while apps hold feature areas like users or billing',
      'models are Python classes that describe database tables and ORM behavior',
      'migrations are versioned database schema changes that keep environments in sync',
      'views receive requests and return responses such as HTML, JSON, redirects, or errors',
      'forms and serializers validate incoming data and convert between Python objects and request/response formats',
      'settings configure databases, installed apps, middleware, secrets, logging, static files, and environment behavior',
    ],
    guidedExample: 'Build a DRF endpoint with model constraints, serializer validation, permissions, pagination, and query optimization.',
    advanced: ['select_related/prefetch_related', 'transaction.atomic', 'middleware', 'signals tradeoffs', 'async caveats'],
    interview: ['Call out N+1 queries fast', 'respect migration safety', 'explain model validation vs database constraints', 'know DRF permission flow'],
  },
}

function list(items: string[]) {
  return items.join(', ')
}

function makeProblems(subjectId: string, spec: ProgressionSpec): Problem[] {
  return [
    {
      id: `${subjectId}-progression-01-fundamentals-map`,
      title: 'Progression 01: Fundamentals Map',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 18,
      prompt: `Build the fundamentals map for ${spec.subject}. Explain each base concept and how it supports the next layer: ${list(spec.fundamentals)}.`,
      explanation: `${spec.subject} gets easier when you can see the dependency chain. Fundamentals are not trivia; they are the vocabulary you use when debugging, designing, and interviewing under pressure.`,
      production: `Production incidents usually expose a missing fundamental. Before reaching for advanced tools, verify the simple model: inputs, outputs, boundaries, state, failure behavior, and observability.`,
      walkthrough: [
        'Define each fundamental in one sentence.',
        'Put the concepts in the order a request, job, or deploy would encounter them.',
        'Name one bug that appears when each concept is misunderstood.',
        'Tie the list to one real backend workflow.',
      ],
      questions: [
        `Which ${spec.subject} concept must be understood first?`,
        'Which concept creates the most production bugs when skipped?',
        'What would you test to prove this foundation is correct?',
      ],
      checklist: [
        'Defines every listed fundamental.',
        'Orders the concepts from basic to more advanced.',
        'Names at least two failure modes.',
        'Connects the map to a backend workflow.',
      ],
    },
    {
      id: `${subjectId}-progression-02-guided-example`,
      title: 'Progression 02: Guided Example',
      type: 'design',
      difficulty: 'Core',
      minutes: 28,
      prompt: spec.guidedExample,
      explanation: `A guided example turns vocabulary into engineering motion. For ${spec.subject}, the goal is to narrate what you would build, what code boundary owns each responsibility, and what evidence proves it works.`,
      production: 'Production-ready examples include happy path, validation, error behavior, logging/metrics, tests, and a rollback or recovery story when the change is risky.',
      walkthrough: [
        'Start with the smallest working version.',
        'Add validation and error behavior.',
        'Add tests for normal and failure paths.',
        'Name the logs, metrics, traces, or query plans that prove it works.',
        'Explain how the example evolves without breaking callers.',
      ],
      questions: [
        'What is the smallest correct implementation?',
        'Which part should be pure/testable without framework glue?',
        'What evidence would make you comfortable deploying it?',
      ],
      checklist: [
        'Includes a minimal implementation plan.',
        'Separates framework or IO code from core logic where relevant.',
        'Includes tests and operational evidence.',
        'Explains how to extend the example safely.',
      ],
    },
    {
      id: `${subjectId}-progression-03-advanced-production`,
      title: 'Progression 03: Advanced Production',
      type: 'debug',
      difficulty: 'Hard',
      minutes: 35,
      prompt: `A production issue appears in ${spec.subject}. Diagnose it using advanced concepts: ${list(spec.advanced)}. Explain what you inspect first, what data you need, and how you fix it without creating a second incident.`,
      explanation: `Advanced ${spec.subject} knowledge is the ability to reason under constraints: partial information, real users, deploy risk, performance pressure, and unclear ownership boundaries.`,
      production: `Senior backend work is controlled change. The fix should include diagnosis, mitigation, permanent repair, regression tests, observability, and a rollout plan.`,
      walkthrough: [
        'Write the symptom in user-visible terms.',
        'List the signals you would inspect before changing code.',
        'Choose the lowest-risk mitigation.',
        'Describe the permanent fix and regression test.',
        'Define the rollout and rollback plan.',
      ],
      questions: [
        'What signal distinguishes root cause from symptom?',
        'What is the safest mitigation?',
        'What regression test prevents this from returning?',
      ],
      checklist: [
        'Uses at least three advanced concepts correctly.',
        'Separates mitigation from permanent fix.',
        'Includes observability and regression tests.',
        'Mentions rollout or rollback risk.',
      ],
    },
    {
      id: `${subjectId}-progression-04-interview-gauntlet`,
      title: 'Progression 04: Interview Gauntlet',
      type: 'quiz',
      difficulty: 'Boss',
      minutes: 22,
      prompt: `In an interview, you are asked to explain ${spec.subject} from fundamentals to advanced production tradeoffs. Which answer style is strongest?`,
      choices: [
        `Start with fundamentals, apply them to a concrete example, then discuss advanced tradeoffs, failure modes, and tests. Tips: ${list(spec.interview)}.`,
        'Name several tools quickly and say the framework usually handles the details.',
        'Jump straight to scaling concerns before clarifying requirements or correctness.',
        'Give only definitions and avoid discussing production failures or tradeoffs.',
      ],
      correctChoice: 0,
      answer: `Strong backend interview answers are layered: fundamentals -> concrete example -> advanced tradeoffs -> evidence. For ${spec.subject}, remember: ${list(spec.interview)}.`,
      explanation: `Interviewers are usually testing how you think, not whether you can recite buzzwords. A strong answer shows order, judgment, production awareness, and the ability to test your own claims.`,
      production: 'The same structure works in design reviews and incidents: start with the model, apply it to the concrete system, then explain tradeoffs and evidence.',
      questions: [
        'What clarifying question would you ask first?',
        'Which pitfall would make the answer sound junior?',
        'What production example proves you understand the topic?',
      ],
      checklist: [
        'Starts from fundamentals.',
        'Uses a concrete example.',
        'Discusses tradeoffs and failure modes.',
        'Includes testing or operational evidence.',
      ],
    },
  ]
}

export const progressionProblems: Record<string, Problem[]> = Object.fromEntries(
  Object.entries(specs).map(([subjectId, spec]) => [subjectId, makeProblems(subjectId, spec)]),
)
