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
    fundamentals: ['DNS answers names, not routes', 'TCP provides ordered bytes', 'TLS protects the connection', 'HTTP defines request/response semantics'],
    guidedExample: 'Trace GET /users/42 through DNS, TCP, TLS, HTTP headers, reverse proxy routing, app code, database read, response serialization, and client caching.',
    advanced: ['HTTP/2 multiplexing and head-of-line tradeoffs', 'CDN and browser cache validation', 'timeouts at every hop', 'load balancer and proxy header behavior'],
    interview: ['Never say DNS returns a URL', 'separate authentication from TLS', 'name where retries are safe', 'draw the request path before optimizing'],
  },
  language: {
    subject: 'Backend Language Core',
    fundamentals: ['control flow', 'collections', 'errors', 'files', 'tests', 'dependency boundaries'],
    guidedExample: 'Build a small log-processing CLI, then split parsing, aggregation, formatting, and filesystem access into testable pieces.',
    advanced: ['concurrency model', 'memory and CPU costs', 'package locking', 'structured errors', 'graceful shutdown'],
    interview: ['Talk in invariants and failure modes', 'prefer boring readable code', 'show how you would test edge cases', 'know your runtime model'],
  },
  sql: {
    subject: 'SQL & Databases',
    fundamentals: ['tables and rows', 'keys and constraints', 'joins', 'indexes', 'transactions', 'isolation'],
    guidedExample: 'Design users, orders, and payments tables, then write the read queries, write transaction, indexes, and migration plan.',
    advanced: ['locking and deadlocks', 'replication lag', 'sharding keys', 'query plans', 'online migrations'],
    interview: ['Start with data invariants', 'derive indexes from queries', 'explain isolation with a race', 'do not index everything'],
  },
  api: {
    subject: 'APIs',
    fundamentals: ['resource naming', 'methods', 'status codes', 'schemas', 'pagination', 'error envelopes'],
    guidedExample: 'Design POST /orders and GET /orders with validation, idempotency, cursor pagination, errors, and versioning.',
    advanced: ['backward compatibility', 'webhook signatures', 'OpenAPI contracts', 'GraphQL/gRPC tradeoffs', 'client retry policy'],
    interview: ['Use concrete status codes', 'explain idempotency for writes', 'name retryable errors', 'design errors for clients first'],
  },
  security: {
    subject: 'Security',
    fundamentals: ['identity', 'authentication', 'authorization', 'input validation', 'secrets', 'least privilege'],
    guidedExample: 'Secure a profile update endpoint with session/JWT auth, object-level authorization, CSRF awareness, rate limits, and audit logs.',
    advanced: ['OAuth flows', 'SSRF defenses', 'JWT pitfalls', 'password hashing parameters', 'threat modeling'],
    interview: ['Distinguish 401 from 403', 'never roll your own crypto', 'validate at trust boundaries', 'explain attacker incentives'],
  },
  architecture: {
    subject: 'Architecture & Messaging',
    fundamentals: ['modules', 'services', 'queues', 'retries', 'idempotency', 'consistency'],
    guidedExample: 'Move email sending out of a request into a job queue with retries, idempotency keys, dead-letter handling, and observability.',
    advanced: ['outbox pattern', 'sagas', 'circuit breakers', 'backpressure', 'eventual consistency'],
    interview: ['State the consistency model', 'draw boundaries and data ownership', 'explain failure recovery', 'avoid microservices as a reflex'],
  },
  devops: {
    subject: 'DevOps & Delivery',
    fundamentals: ['build', 'container', 'config', 'deploy', 'health check', 'rollback'],
    guidedExample: 'Package an API into a production Docker image, configure environment variables, run migrations, and deploy with readiness checks.',
    advanced: ['blue/green deploys', 'zero-downtime migrations', 'CI gates', 'secret rotation', 'capacity planning'],
    interview: ['Separate build-time from runtime config', 'know rollback limits after migrations', 'make health checks dependency-aware', 'watch logs and metrics during deploy'],
  },
  performance: {
    subject: 'Performance & Scaling',
    fundamentals: ['latency', 'throughput', 'capacity', 'caching', 'database access', 'measurement'],
    guidedExample: 'Diagnose a slow endpoint by measuring p95 latency, DB query count, cache hit rate, payload size, and external dependency time.',
    advanced: ['load testing', 'cache stampede prevention', 'connection pools', 'backpressure', 'hot partition detection'],
    interview: ['Measure before optimizing', 'talk p95/p99 not only averages', 'identify bottlenecks by evidence', 'explain cache invalidation tradeoffs'],
  },
  'system-design': {
    subject: 'System Design',
    fundamentals: ['requirements', 'traffic estimates', 'data model', 'API shape', 'storage choice', 'failure modes'],
    guidedExample: 'Design a URL shortener from API to datastore to cache to analytics, including redirects, abuse limits, and observability.',
    advanced: ['multi-region tradeoffs', 'partitioning', 'consistency choices', 'disaster recovery', 'evolution under scale'],
    interview: ['Clarify requirements first', 'estimate before choosing technology', 'name bottlenecks and mitigations', 'trade off explicitly'],
  },
  capstone: {
    subject: 'Capstones',
    fundamentals: ['scope', 'contracts', 'data model', 'tests', 'deployment', 'operational readiness'],
    guidedExample: 'Plan a production-grade backend project by writing the API contract, schema, service boundaries, test matrix, deploy plan, and runbook.',
    advanced: ['cross-cutting auth', 'observability', 'migrations', 'background jobs', 'failure drills'],
    interview: ['Tell the story end-to-end', 'justify tradeoffs', 'show test and rollback strategy', 'connect product requirements to technical choices'],
  },
  typescript: {
    subject: 'TypeScript',
    fundamentals: ['primitive types', 'object shapes', 'unions', 'narrowing', 'generics', 'unknown vs any'],
    guidedExample: 'Model a CreateUser request DTO, validate unknown JSON, return a typed service Result, and map it to an HTTP response.',
    advanced: ['branded IDs', 'exhaustive never checks', 'utility types', 'strict tsconfig', 'type-only imports'],
    interview: ['Types do not validate runtime JSON', 'prefer discriminated unions for states', 'avoid any at boundaries', 'explain strict mode flags'],
  },
  nodejs: {
    subject: 'Node.js',
    fundamentals: ['event loop', 'modules', 'npm scripts', 'async/await', 'streams', 'process config'],
    guidedExample: 'Build a small HTTP API route, parse input, call async services, stream a response when needed, and handle errors centrally.',
    advanced: ['backpressure', 'worker threads', 'cluster/process management', 'timeouts', 'observability hooks'],
    interview: ['Explain why CPU work blocks the loop', 'know Promise error paths', 'use streams for large payloads', 'do not hide config in code'],
  },
  python: {
    subject: 'Python',
    fundamentals: ['data structures', 'functions', 'exceptions', 'modules', 'typing', 'virtual environments'],
    guidedExample: 'Write a small service function with typed inputs, validation, repository dependency injection, and pytest cases.',
    advanced: ['asyncio cancellation', 'GIL implications', 'packaging', 'context managers', 'serialization boundaries'],
    interview: ['Know mutable default pitfalls', 'explain GIL accurately', 'prefer explicit exceptions', 'show pytest parametrization'],
  },
  flask: {
    subject: 'Flask',
    fundamentals: ['app object', 'routes', 'request context', 'response objects', 'blueprints', 'extensions'],
    guidedExample: 'Build a Flask CRUD endpoint with an app factory, config object, blueprint, service layer, database session, and tests.',
    advanced: ['WSGI lifecycle', 'SQLAlchemy session scope', 'auth extensions', 'background jobs', 'production server config'],
    interview: ['Explain request context without hand-waving', 'use app factory for testability', 'keep business logic out of routes', 'know what Flask does not provide'],
  },
  django: {
    subject: 'Django',
    fundamentals: ['project/app layout', 'models', 'migrations', 'views', 'forms/serializers', 'settings'],
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
