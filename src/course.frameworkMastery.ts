import type { Problem, ProblemType } from './course'

type MasteryItem = {
  title: string
  focus: string
  task: string
}

const typeCycle: ProblemType[] = ['lesson', 'coding', 'quiz', 'debug', 'design']

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function makeMasteryTrack(prefix: string, items: MasteryItem[]): Problem[] {
  return items.map((item, index) => {
    const type = typeCycle[index % typeCycle.length]
    const order = String(index + 1).padStart(2, '0')
    const previous = index > 0 ? items[index - 1] : undefined
    const next = items[index + 1]
    const progression =
      previous && next
        ? `This builds on ${previous.title} and prepares you for ${next.title}.`
        : previous
          ? `This builds on ${previous.title} and turns the track toward capstone-level judgment.`
          : `This is the foundation for the rest of the ${prefix.toUpperCase()} path.`
    const action =
      type === 'coding'
        ? `Write the smallest implementation that proves ${item.focus}. Start with a pure function or minimal route contract, run it against edge cases, then explain how the same idea appears in a real backend.`
        : type === 'debug'
          ? `Read the scenario as if it came from a production incident. Identify the broken assumption, list the evidence you would gather, then write the fix or guardrail.`
          : type === 'design'
            ? `Design the backend slice on paper first: inputs, outputs, storage, failures, tests, and rollout. Then turn that design into pseudocode or a small implementation sketch.`
            : type === 'quiz'
              ? `Answer in complete sentences, then defend your answer by naming a failure mode, a test, and a production signal.`
              : `Study the concept, write a tiny example, and explain the request/runtime/data flow without looking at the notes.`

    return {
      id: `${prefix}-mastery-${order}-${slugify(item.title)}`,
      title: `${order}. ${item.title}`,
      type,
      difficulty:
        index < 10 ? 'Warmup' : index < 28 ? 'Core' : index < 42 ? 'Hard' : 'Boss',
      minutes: type === 'coding' ? 35 : type === 'debug' || type === 'design' ? 30 : 22,
      prompt:
        type === 'coding'
          ? `Coding assessment: ${item.task}. ${action}`
          : type === 'debug'
            ? `Debugging assessment: diagnose a realistic failure involving ${item.focus}. ${action}`
            : type === 'design'
              ? `Design assessment: design the backend approach for ${item.focus}. ${action}`
              : type === 'quiz'
                ? `Checkpoint question: explain the key tradeoffs of ${item.focus} and pick the safest production default. ${action}`
                : `Tutorial: learn ${item.focus} in the correct progression, then explain it in your own words. ${action}`,
      explanation:
        `${item.title} is part ${index + 1} of this framework mastery path. ${progression} The point is to build from mental model to implementation: understand what the runtime/framework is doing, know the API shape you would write, then know how it fails under production pressure. Focus: ${item.focus}. Do not treat this as trivia: write or sketch the contract, name the boundary where untrusted input enters, and describe the exact behavior a client or operator should observe.`,
      production:
        `In production, ${item.focus} affects reliability, maintainability, performance, or security. You should be able to explain the happy path, the failure mode, the observability signal, and the safest default before writing code. A strong backend engineer can say what breaks first, which logs or metrics prove it, how users experience it, and how to roll out the fix without guessing.`,
      walkthrough: [
        `Restate the concept in one sentence: ${item.focus}.`,
        `Complete the concrete task: ${item.task}`,
        'Write the smallest working example, route, function, model, serializer, query, or pseudocode that demonstrates the idea.',
        'Mark every boundary: user input, framework parsing, business logic, persistence, network dependency, response shape.',
        'Add the minimum safety layer: validation, authorization, timeout, transaction, idempotency, logging, or metric.',
        'Test the happy path, one edge case, and one failure path.',
        'Explain how this connects to the previous lesson and what the next lesson depends on.',
        'Finish by writing the production symptom you would watch for after deployment.',
      ],
      example:
        type === 'coding'
          ? `Example workflow: define the input contract -> implement the smallest behavior -> add one invalid-input branch -> add one production guardrail -> run the tests -> write down what request or metric proves it works.`
          : type === 'debug'
            ? `Example workflow: symptom -> suspected layer -> evidence -> reproduction -> fix -> regression test -> production monitor.`
            : type === 'design'
              ? `Example workflow: API contract -> data model -> transaction or consistency rule -> failure behavior -> observability -> deployment/rollback note.`
              : `Example workflow: explain it out loud, then write a tiny code or request example that makes the concept concrete.`,
      questions: [
        `What problem does ${item.focus} solve?`,
        `What is the most common beginner mistake with ${item.focus}?`,
        `What is the smallest example that proves you understand ${item.title}?`,
        `Where does untrusted input cross a boundary in this lesson?`,
        `What validation or guardrail belongs closest to that boundary?`,
        `How would you test ${item.focus} without relying only on manual clicking?`,
        `What metric, log, or error would reveal this failing in production?`,
        `How does this connect to ${previous ? previous.title : 'the foundation of the track'}?`,
      ],
      checklist: [
        'Explain the concept clearly.',
        'Show or sketch the smallest implementation.',
        'Write the client-visible contract.',
        'Identify the runtime/framework boundary.',
        'Name production failure modes.',
        'Include tests or verification steps.',
        'Connect it to the previous concepts in this track.',
      ],
      choices:
        type === 'quiz'
          ? [
              'Use the framework default without understanding the failure mode',
              'Understand the concept, define the contract, test it, and monitor it',
              'Skip tests until production traffic proves the design',
              'Hide every error from logs to reduce noise',
            ]
          : undefined,
      correctChoice: type === 'quiz' ? 1 : undefined,
      answer:
        type === 'quiz'
          ? 'The safest default is to understand the concept, define the contract, test it, and monitor the production failure mode.'
          : undefined,
    }
  })
}

export const frameworkMasteryProblems: Record<string, Problem[]> = {
  nodejs: makeMasteryTrack('nodejs', [
    { title: 'Runtime, V8, And libuv', focus: 'how Node.js runs JavaScript on V8 and delegates async IO through libuv', task: 'write notes and a tiny script that proves synchronous code blocks later timers.' },
    { title: 'Event Loop Phases', focus: 'timers, pending callbacks, poll, check, close callbacks, and microtasks', task: 'write a script that logs setTimeout, setImmediate, Promise microtasks, and process.nextTick order.' },
    { title: 'CommonJS vs ES Modules', focus: 'module formats, import/export, require, package type, and interop boundaries', task: 'convert a tiny CommonJS utility to ESM and explain what changed.' },
    { title: 'npm, package.json, And Lockfiles', focus: 'scripts, dependencies, devDependencies, semver ranges, npm ci, and package-lock reproducibility', task: 'create scripts for dev, test, lint, build, and start with a reproducible install strategy.' },
    { title: 'Environment And Process Basics', focus: 'process.env, argv, exit codes, signals, cwd, and stdout/stderr', task: 'write a CLI that reads an env var and exits non-zero when config is missing.' },
    { title: 'HTTP Server Without Express', focus: 'the built-in http module, request streams, response headers, and routing by method/path', task: 'implement GET /health and POST /echo using node:http only.' },
    { title: 'Express App Structure', focus: 'app setup, routers, middleware order, request/response lifecycle, and 404 handling', task: 'create an Express app with a router, JSON middleware, health route, and not-found handler.' },
    { title: 'Middleware Pipeline', focus: 'how middleware composes, calls next, short-circuits, and centralizes cross-cutting behavior', task: 'write request-id, timing, and auth middleware in the correct order.' },
    { title: 'Request Validation', focus: 'parsing, validating, normalizing, and rejecting untrusted JSON before business logic', task: 'implement a validation middleware that returns field-level errors.' },
    { title: 'Error Middleware', focus: 'async errors, next(err), operational vs programmer errors, and stable error responses', task: 'wrap async route handlers and route thrown errors into a consistent JSON envelope.' },
    { title: 'Async/Await Failure Modes', focus: 'un-awaited promises, Promise.all behavior, cancellation gaps, and unhandled rejections', task: 'fix a route that starts async work without awaiting or returning it.' },
    { title: 'Timers And Scheduling', focus: 'setTimeout, setInterval, drift, cron-like jobs, and why jobs should not live only in web dynos', task: 'write a heartbeat timer and explain why production scheduled jobs need coordination.' },
    { title: 'Streams Fundamentals', focus: 'Readable, Writable, Transform, pipeline, chunks, buffering, and backpressure', task: 'stream a large file through a transform without buffering it all.' },
    { title: 'File Uploads', focus: 'multipart parsing, temp storage, size limits, content-type distrust, and object storage handoff', task: 'design an upload endpoint with size limits and safe storage.' },
    { title: 'Database Access With Pools', focus: 'connection pools, pool exhaustion, query timeouts, and transaction clients', task: 'write a repository function that uses a pooled client and releases it safely.' },
    { title: 'Transactions In Node', focus: 'begin/commit/rollback, using one client per transaction, and avoiding parallel queries on the same transaction', task: 'write a transfer function that rolls back on any error.' },
    { title: 'Authentication Middleware', focus: 'Bearer parsing, session lookup, attaching principal, and failing closed', task: 'write middleware that parses Authorization and attaches req.user or returns 401.' },
    { title: 'Authorization In Route Handlers', focus: 'resource-level permission checks after loading the target object', task: 'protect PATCH /projects/:id so only owners can update.' },
    { title: 'Cookies And Sessions', focus: 'Set-Cookie flags, signed cookies, session stores, SameSite, Secure, HttpOnly', task: 'configure a session cookie for production HTTPS and explain each flag.' },
    { title: 'JWT Verification', focus: 'signature, issuer, audience, expiry, algorithm pinning, and claim mapping', task: 'write pseudocode for verifying a JWT before trusting sub/scopes.' },
    { title: 'CORS In Express', focus: 'origin allowlists, preflight requests, credentials, and browser-only enforcement', task: 'configure CORS for one frontend origin with cookies enabled.' },
    { title: 'Rate Limiting', focus: 'per-IP and per-account limiting, Redis counters, sliding windows, and fail-open/fail-closed choices', task: 'design a Redis-backed login limiter.' },
    { title: 'Logging With Context', focus: 'structured logs, request IDs, user IDs, route names, latency, and error causes', task: 'add request-scoped logging to every route.' },
    { title: 'Metrics For APIs', focus: 'request count, error count, duration histograms, saturation, and custom business counters', task: 'define metrics for an Express API and where they increment.' },
    { title: 'Tracing Downstream Calls', focus: 'trace IDs, spans, parent/child timing, and dependency visibility', task: 'instrument an outbound HTTP call with span timing and error attributes.' },
    { title: 'Testing Pure Services', focus: 'testing business logic without Express, DB, or network dependencies', task: 'extract route logic into a pure service and unit test edge cases.' },
    { title: 'Testing Routes', focus: 'supertest-style route tests, fixtures, auth setup, and error assertions', task: 'write route tests for success, validation failure, auth failure, and not found.' },
    { title: 'Integration Tests With Databases', focus: 'test database setup, migrations, transactions, cleanup, and deterministic fixtures', task: 'write an integration test that proves a repository writes and reads correctly.' },
    { title: 'Worker Threads', focus: 'offloading CPU-bound work, message passing, worker pools, and failure handling', task: 'move CPU-heavy parsing into a worker and return the result to the route.' },
    { title: 'Child Processes', focus: 'spawn vs exec, stdout/stderr streams, exit codes, timeouts, and command injection risk', task: 'run a safe child process with args array and timeout.' },
    { title: 'Queues And Workers', focus: 'producer/consumer split, retries, idempotency, job payloads, and DLQs', task: 'design a background email worker with retry and dedupe.' },
    { title: 'Graceful Shutdown', focus: 'SIGTERM, stop accepting requests, drain inflight work, close DB pools, and exit deadlines', task: 'implement a shutdown handler that closes server and pool.' },
    { title: 'Health And Readiness', focus: 'liveness vs readiness, dependency checks, startup delay, and load balancer behavior', task: 'write /health and /ready semantics for an API.' },
    { title: 'Configuration Validation', focus: 'required env vars, parsing numbers/URLs/booleans, defaults, and fail-fast startup', task: 'write a config loader that validates DATABASE_URL and PORT.' },
    { title: 'Security Headers', focus: 'Helmet-style headers, CSP basics, HSTS, frame options, and content sniffing', task: 'configure safe default headers and explain tradeoffs.' },
    { title: 'Input Size Limits', focus: 'JSON body limits, upload limits, timeout limits, and slowloris protection', task: 'configure body parsing and server timeouts for safe defaults.' },
    { title: 'Dependency Management', focus: 'npm audit limits, lockfile updates, supply-chain risk, and package maintenance', task: 'create a dependency update checklist for production services.' },
    { title: 'TypeScript For Backends', focus: 'types at boundaries, runtime validation, tsconfig strictness, and avoiding any leaks', task: 'type a request DTO and validate it at runtime.' },
    { title: 'Repository Pattern', focus: 'isolating persistence details behind small query modules or repositories', task: 'refactor direct route SQL into a repository and service.' },
    { title: 'OpenAPI Generation', focus: 'documenting Express routes, schemas, examples, errors, and contract drift', task: 'write an OpenAPI spec for three routes and error responses.' },
    { title: 'API Versioning', focus: 'versioned routers, backwards compatibility, deprecation headers, and migration docs', task: 'design v1/v2 route compatibility for a renamed field.' },
    { title: 'WebSocket Server Basics', focus: 'connection lifecycle, auth at upgrade, heartbeats, backpressure, and horizontal scaling', task: 'design authenticated WebSocket presence updates.' },
    { title: 'Server-Sent Events', focus: 'SSE formatting, reconnects, event IDs, and when SSE beats WebSockets', task: 'implement an SSE endpoint that streams progress events.' },
    { title: 'Caching In Node APIs', focus: 'memory cache vs Redis vs CDN, TTL, invalidation, and stampede protection', task: 'cache a product lookup with TTL and stale fallback.' },
    { title: 'Production Dockerfile', focus: 'multi-stage build, npm ci, non-root user, small image, and runtime env', task: 'write a Dockerfile for an Express API.' },
    { title: 'Deployment On Vercel/Serverless', focus: 'serverless function lifecycle, cold starts, connection reuse, and platform limits', task: 'explain what changes when an Express route becomes serverless.' },
    { title: 'Memory Leak Debugging', focus: 'heap growth, retained objects, listeners, caches, and heap snapshots', task: 'diagnose an API whose memory rises after every request.' },
    { title: 'Event Loop Lag Debugging', focus: 'detecting sync blocking, CPU spikes, JSON parsing, crypto, and compression stalls', task: 'debug high p99 latency with event-loop lag metrics.' },
    { title: 'Node Production Review', focus: 'reviewing a full Node backend for correctness, security, performance, and operability', task: 'perform a launch review of a Node API using a checklist.' },
    { title: 'Node Capstone API', focus: 'building a complete Express/Postgres/Redis backend from contract to deploy', task: 'build an auth-protected projects API with tests, logs, metrics, Dockerfile, and deploy notes.' },
  ]),
  python: makeMasteryTrack('python', [
    { title: 'Python Runtime And CPython', focus: 'how CPython executes code, manages objects, and differs from the language spec', task: 'write notes that distinguish Python the language from CPython the implementation.' },
    { title: 'Virtual Environments', focus: 'venv, isolated interpreters, dependency paths, and reproducible local setup', task: 'create a venv and document activation/install/test commands.' },
    { title: 'pyproject.toml And Packaging', focus: 'project metadata, build systems, dependency groups, and modern Python packaging', task: 'write a pyproject for a backend service with runtime and dev deps.' },
    { title: 'Dependency Pinning', focus: 'requirements files, lockfiles, hashes, and reproducible CI installs', task: 'design a dependency pinning strategy for dev, CI, and production.' },
    { title: 'Python Module Imports', focus: 'packages, modules, import path, __init__.py, and avoiding import-time side effects', task: 'refactor an import-time DB connection into startup code.' },
    { title: 'Type Hints For Backends', focus: 'typing primitives, Protocol, TypedDict, dataclasses, Pydantic-style validation, and mypy limits', task: 'type a service function and explain what runtime validation still needs to do.' },
    { title: 'Data Classes And Models', focus: 'dataclasses, attrs/Pydantic concepts, immutability, defaults, and validation boundaries', task: 'model a CreateUser command with explicit fields and defaults.' },
    { title: 'Exceptions And Error Boundaries', focus: 'custom exceptions, exception chaining, logging context, and API error translation', task: 'translate domain exceptions into stable API responses.' },
    { title: 'Context Managers', focus: 'with blocks, resource cleanup, DB sessions, file handles, and custom context managers', task: 'write a context manager that opens and closes a resource safely.' },
    { title: 'Iterators And Generators', focus: 'lazy iteration, yield, memory-efficient processing, and streaming responses', task: 'process a large CSV lazily without reading it all into memory.' },
    { title: 'Decorators For Cross-Cutting Behavior', focus: 'wrapping functions for timing, retries, auth checks, and preserving metadata', task: 'write a timing decorator that logs duration and re-raises errors.' },
    { title: 'The GIL', focus: 'global interpreter lock, CPU-bound vs IO-bound work, native extensions, and process pools', task: 'choose between threads/processes/async for three workloads.' },
    { title: 'Threading For IO', focus: 'ThreadPoolExecutor, shared state, locks, and when threads help Python backends', task: 'parallelize blocking HTTP calls with bounded threads.' },
    { title: 'Multiprocessing For CPU', focus: 'ProcessPoolExecutor, serialization cost, worker count, and CPU-bound parallelism', task: 'offload CPU-heavy image hashing to a process pool.' },
    { title: 'asyncio Fundamentals', focus: 'event loop, coroutines, tasks, await, gather, cancellation, and timeouts', task: 'call multiple async dependencies with per-call timeout and partial results.' },
    { title: 'ASGI vs WSGI', focus: 'sync request model, async request model, servers, lifespan, and framework fit', task: 'explain when FastAPI/ASGI beats Flask/WSGI and when it does not matter.' },
    { title: 'HTTP Clients', focus: 'requests/httpx, timeouts, retries, connection pooling, and JSON parsing', task: 'write a client function with connect/read timeouts and structured errors.' },
    { title: 'FastAPI Basics', focus: 'path operations, dependency injection, Pydantic models, status codes, and OpenAPI', task: 'build POST /users with validation and a stable error response.' },
    { title: 'Flask Basics', focus: 'routes, request/response, app factory, blueprints, and config', task: 'build a create_app factory with a users blueprint.' },
    { title: 'Django vs Flask vs FastAPI', focus: 'framework tradeoffs, batteries-included vs minimalism, sync vs async, admin/ORM/DRF', task: 'choose a framework for three product scenarios and defend the choice.' },
    { title: 'SQLAlchemy Core And ORM', focus: 'engines, sessions, identity map, lazy loading, queries, and transactions', task: 'write repository functions with explicit session lifetime.' },
    { title: 'Alembic Migrations', focus: 'revision files, autogenerate limits, upgrade/downgrade, and online migration safety', task: 'write an expand/contract migration plan.' },
    { title: 'Transactions In Python', focus: 'session begin/commit/rollback, exception safety, and short transaction boundaries', task: 'write a transfer service that rolls back on failure.' },
    { title: 'Repository And Service Layers', focus: 'separating web framework, business logic, persistence, and side effects', task: 'refactor a route into command model, service, and repository.' },
    { title: 'Configuration Loading', focus: 'environment variables, .env in dev, secret managers, type parsing, and fail-fast settings', task: 'write a settings loader with required DATABASE_URL and DEBUG boolean parsing.' },
    { title: 'Logging', focus: 'logging module, structured logs, request IDs, exception info, and redaction', task: 'configure JSON logs with request_id and no secrets.' },
    { title: 'Metrics And Instrumentation', focus: 'counters, histograms, labels, request latency, errors, and saturation', task: 'define Prometheus-style metrics for a Python API.' },
    { title: 'Testing With pytest', focus: 'fixtures, parametrization, monkeypatch, temp dirs, and test organization', task: 'write parametrized tests for validation edge cases.' },
    { title: 'Integration Testing', focus: 'test database, fixtures, transaction cleanup, factory data, and realistic dependency tests', task: 'test a repository against a real Postgres test database.' },
    { title: 'Mocking And Fakes', focus: 'unittest.mock, fakes, contract-preserving doubles, and avoiding over-mocking', task: 'replace an email provider with a fake in service tests.' },
    { title: 'Celery/RQ Background Jobs', focus: 'task queues, retries, idempotency, broker/backends, and worker deployment', task: 'design an email task with retry and idempotency key.' },
    { title: 'Scheduler Jobs', focus: 'cron, APScheduler, leader election, duplicate execution, and observability', task: 'design a daily cleanup job that cannot run twice concurrently.' },
    { title: 'File Processing', focus: 'streaming, temp files, uploads, MIME checks, object storage, and cleanup', task: 'process a large upload safely with size limits.' },
    { title: 'Security Basics', focus: 'password hashing, secrets, CSRF, CORS, SSRF, safe deserialization, and dependency risk', task: 'write a security checklist for a Python backend launch.' },
    { title: 'Serialization Boundaries', focus: 'JSON, datetime/timezone, Decimal, UUID, and stable API output', task: 'serialize a money/date response without losing precision.' },
    { title: 'Timezone Handling', focus: 'aware datetimes, UTC storage, user display timezone, and DST edge cases', task: 'design timestamp handling for scheduled notifications.' },
    { title: 'Performance Profiling', focus: 'cProfile, py-spy, query counts, memory profiling, and benchmark traps', task: 'profile a slow endpoint and identify CPU vs DB time.' },
    { title: 'Caching In Python', focus: 'functools.lru_cache, Redis, cache keys, TTL, invalidation, and serialization', task: 'cache an expensive lookup with TTL and invalidation on write.' },
    { title: 'Dependency Injection Without Magic', focus: 'passing dependencies explicitly, factories, testability, and avoiding global clients', task: 'refactor global DB/email clients into injected dependencies.' },
    { title: 'CLI Management Commands', focus: 'argparse/typer, admin scripts, idempotent maintenance jobs, and safe dry-runs', task: 'write a dry-run capable backfill command.' },
    { title: 'Dockerizing Python', focus: 'slim images, wheels, non-root user, uv/pip install, and gunicorn/uvicorn commands', task: 'write a Dockerfile for a Python API.' },
    { title: 'Gunicorn/Uvicorn Workers', focus: 'worker count, sync vs async workers, timeouts, preload, and graceful reload', task: 'choose worker settings for a CPU-light IO-heavy API.' },
    { title: 'Health Checks', focus: 'liveness/readiness, dependency checks, startup lifespan, and load balancer routing', task: 'implement /health and /ready for a Python service.' },
    { title: 'OpenAPI And Client Contracts', focus: 'schema generation, examples, error envelopes, and contract tests', task: 'publish an OpenAPI contract and test it against route responses.' },
    { title: 'Auth In Python APIs', focus: 'sessions, JWTs, OAuth clients, dependencies/middleware, and authorization checks', task: 'protect a route with authn and resource-level authz.' },
    { title: 'Async Pitfalls', focus: 'blocking calls inside async routes, forgotten awaits, task cancellation, and loop starvation', task: 'debug an async endpoint with high p99 latency.' },
    { title: 'Production Incident Debugging', focus: 'logs, traces, metrics, dependency failures, deployment correlation, and mitigation', task: 'write a triage plan for a Python API with rising 5xx.' },
    { title: 'Python Launch Review', focus: 'reviewing a Python backend for config, tests, migrations, security, performance, and deploy readiness', task: 'perform a launch checklist for a Python API.' },
    { title: 'Python Capstone API', focus: 'building a full Python backend with API, DB, auth, jobs, tests, observability, and deploy plan', task: 'build a FastAPI or Django REST API with Postgres, background jobs, tests, and production docs.' },
    { title: 'Python Mastery Oral Exam', focus: 'explaining Python backend architecture end-to-end under production constraints', task: 'defend every major choice in your Python backend: framework, DB, jobs, auth, tests, deploy, and observability.' },
  ]),
  django: makeMasteryTrack('django', [
    { title: 'Django Project Anatomy', focus: 'project vs app, settings, urls, asgi/wsgi, manage.py, and app boundaries', task: 'create a project with two apps and explain what belongs in each.' },
    { title: 'Settings And Environments', focus: 'settings modules, environment variables, secrets, DEBUG, ALLOWED_HOSTS, and database config', task: 'split dev/prod settings and validate required env vars.' },
    { title: 'URL Routing', focus: 'path converters, include, namespacing, reverse, and URL design', task: 'write namespaced URLs for users and projects APIs.' },
    { title: 'Views: Function, Class, Generic', focus: 'FBVs, CBVs, generic views, request/response, and choosing simplest view style', task: 'implement the same read endpoint as FBV and CBV and compare.' },
    { title: 'Middleware Order', focus: 'request/response middleware, auth/session/csrf order, and short-circuiting', task: 'add request-id middleware and explain where it belongs.' },
    { title: 'Models And Fields', focus: 'field types, null vs blank, defaults, choices, constraints, and model methods', task: 'model Project, Membership, and Invitation with correct fields.' },
    { title: 'Relationships', focus: 'ForeignKey, OneToOne, ManyToMany, through models, on_delete behavior, and related names', task: 'model project memberships with roles using a through table.' },
    { title: 'QuerySets Laziness', focus: 'lazy evaluation, chaining, slicing, caching, and when queries execute', task: 'predict how many queries a chained QuerySet performs.' },
    { title: 'Filtering And Managers', focus: 'custom managers, QuerySet methods, reusable filters, and domain-specific query APIs', task: 'create an active() QuerySet method and use it in a manager.' },
    { title: 'select_related vs prefetch_related', focus: 'JOIN-based eager loading vs separate-query prefetching and when to use each', task: 'fix an N+1 view using the correct eager-loading tool.' },
    { title: 'Aggregation And Annotation', focus: 'Count/Sum/Avg, annotate, aggregate, grouping, and filtered aggregations', task: 'annotate projects with member_count and latest_activity.' },
    { title: 'Transactions And atomic', focus: 'transaction.atomic, savepoints, select_for_update, on_commit, and short transactions', task: 'write an invite acceptance flow inside atomic.' },
    { title: 'Migrations Basics', focus: 'makemigrations, migration files, dependencies, schema history, and review discipline', task: 'read a generated migration and explain each operation.' },
    { title: 'Data Migrations', focus: 'RunPython, historical models, batching, idempotency, and rollback behavior', task: 'write a batched data migration plan for a new slug field.' },
    { title: 'Zero-Downtime Migrations', focus: 'expand/contract, rolling deploy compatibility, locks, and destructive change timing', task: 'rename a field safely across multiple deploys.' },
    { title: 'Admin Site', focus: 'ModelAdmin, list_display, filters, search, permissions, and operational admin safety', task: 'configure admin for Project without exposing sensitive fields.' },
    { title: 'Forms And Validation', focus: 'forms, ModelForm, clean methods, field errors, and server-side validation', task: 'write a form that validates invite email and role.' },
    { title: 'Django Auth Model', focus: 'User, custom user model timing, groups, permissions, sessions, and password hashing', task: 'decide whether to create a custom user model at project start.' },
    { title: 'Authentication Backends', focus: 'custom auth backends, login flow, session persistence, and request.user', task: 'design an email-login backend and test it.' },
    { title: 'Authorization Patterns', focus: 'object permissions, decorators, mixins, DRF permissions, and queryset scoping', task: 'prevent users from reading projects they do not belong to.' },
    { title: 'CSRF Protection', focus: 'CSRF middleware, tokens, unsafe methods, trusted origins, and API/browser differences', task: 'debug a CSRF failure in production behind HTTPS proxy.' },
    { title: 'Django Security Settings', focus: 'SECURE_SSL_REDIRECT, HSTS, secure cookies, allowed hosts, and proxy SSL header', task: 'write production security settings for HTTPS deployment.' },
    { title: 'Static And Media Files', focus: 'collectstatic, WhiteNoise/CDN, user uploads, storage backends, and safe serving', task: 'configure static assets and private media uploads.' },
    { title: 'Email Sending', focus: 'email backends, templates, async sending, retries, and deliverability basics', task: 'send invite emails through a background task.' },
    { title: 'Django REST Framework Intro', focus: 'serializers, views, viewsets, routers, status codes, and browsable API', task: 'build a ProjectViewSet with list/retrieve/create.' },
    { title: 'DRF Serializers', focus: 'Serializer vs ModelSerializer, validation, nested output, write-only fields, and representation', task: 'write separate read and write serializers for Project.' },
    { title: 'DRF ViewSets And Routers', focus: 'ModelViewSet, actions, routers, basename, and route generation', task: 'add a custom invite action to a ProjectViewSet.' },
    { title: 'DRF Permissions', focus: 'IsAuthenticated, custom permissions, object permissions, and queryset filtering', task: 'write a permission class for project membership.' },
    { title: 'DRF Pagination', focus: 'page number, limit/offset, cursor pagination, ordering, and response metadata', task: 'configure cursor pagination for an activity feed.' },
    { title: 'DRF Filtering And Search', focus: 'django-filter, search fields, ordering filters, and safe query params', task: 'add status/owner/search filters to a list endpoint.' },
    { title: 'DRF Error Shapes', focus: 'ValidationError, exception handlers, field errors, non_field_errors, and stable API errors', task: 'customize DRF errors into a stable envelope.' },
    { title: 'OpenAPI With Django', focus: 'schema generation, drf-spectacular, examples, auth docs, and contract review', task: 'document three endpoints with examples and error responses.' },
    { title: 'Testing Django Models', focus: 'TestCase, pytest-django, factories, constraints, and model method tests', task: 'test Membership uniqueness and role validation.' },
    { title: 'Testing Django APIs', focus: 'APIClient, auth fixtures, assertNumQueries, status/errors, and JSON assertions', task: 'test list/create/update permission branches.' },
    { title: 'Performance Query Counts', focus: 'assertNumQueries, django-debug-toolbar, indexes, only/defer, and values queries', task: 'reduce a list endpoint from 101 queries to 3.' },
    { title: 'Caching In Django', focus: 'per-view cache, low-level cache, Redis backend, cache keys, and invalidation', task: 'cache a public project summary and invalidate on update.' },
    { title: 'Celery With Django', focus: 'task definitions, broker, retries, transactions, on_commit, and idempotent tasks', task: 'enqueue email only after DB transaction commits.' },
    { title: 'Signals: Use Sparingly', focus: 'post_save/pre_save, hidden side effects, transaction timing, and alternatives', task: 'refactor a post_save email signal into an explicit service call.' },
    { title: 'Service Layer In Django', focus: 'fat models vs services, selectors, commands, and avoiding business logic in serializers', task: 'move invitation acceptance out of serializer into service.' },
    { title: 'Managers, Selectors, Commands', focus: 'organizing reads and writes with explicit query modules and command services', task: 'create selectors for project reads and commands for writes.' },
    { title: 'Django Templates For Admin-ish Views', focus: 'template inheritance, context data, escaping, forms, and server-rendered workflows', task: 'build a safe internal project detail page.' },
    { title: 'Internationalization And Timezones', focus: 'USE_TZ, timezone-aware datetimes, translation strings, and user locale display', task: 'store UTC and render user-local scheduled time.' },
    { title: 'File Uploads In Django', focus: 'FileField, storage, upload limits, validators, private files, and async processing', task: 'build a document upload flow with validation and background scan.' },
    { title: 'Deployment With Gunicorn/Uvicorn', focus: 'WSGI/ASGI deployment, workers, static files, env settings, and graceful shutdown', task: 'write a deployment command and worker-count rationale.' },
    { title: 'Django Behind A Proxy', focus: 'SECURE_PROXY_SSL_HEADER, host headers, CSRF trusted origins, and forwarded proto', task: 'debug HTTPS redirect loops behind a load balancer.' },
    { title: 'Observability In Django', focus: 'structured request logs, query timing, Sentry, metrics, traces, and admin actions', task: 'instrument a DRF endpoint with request ID and query count logs.' },
    { title: 'Django Incident Debugging', focus: 'slow ORM queries, migration locks, cache outages, worker exhaustion, and bad deploys', task: 'triage a Django API with rising p95 and DB CPU.' },
    { title: 'Django Launch Checklist', focus: 'settings, migrations, collectstatic, admin, auth, tests, monitoring, and rollback', task: 'perform a launch review for a Django REST app.' },
    { title: 'Django Capstone API', focus: 'building a complete Django/DRF backend with auth, permissions, models, migrations, tasks, tests, and deploy', task: 'build a project-management API with memberships, invites, audit logs, Celery email, and DRF docs.' },
    { title: 'Django Mastery Oral Exam', focus: 'explaining Django architecture from request to ORM to response under production constraints', task: 'defend your Django backend design, query plan, migration plan, permissions, tests, and deployment.' },
  ]),
}
