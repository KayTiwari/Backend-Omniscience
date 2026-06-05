import type { Problem } from './course'

export const deepDiveProblems: Record<string, Problem[]> = {
  internet: [
    {
      id: 'internet-dns-records',
      title: 'DNS Records In Order',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 18,
      prompt:
        'Map the role of A, AAAA, CNAME, MX, TXT, NS, and SOA records. Then explain which records matter for a backend API hostname.',
      explanation:
        'DNS is the address book before the request. A and AAAA point names to IPs, CNAME aliases one name to another, NS and SOA define authority, TXT often carries verification/security metadata, and MX is for mail. Backend engineers mostly debug A/AAAA/CNAME/TTL issues for APIs, plus TXT records for domains and providers.',
      questions: [
        'Why does a CNAME not directly contain an IP address?',
        'What does TTL change during a production migration?',
        'Why might dig and your browser disagree right after a DNS change?',
      ],
      checklist: [
        'Separate address records from alias records.',
        'Explain authoritative vs recursive DNS.',
        'Tie TTL to rollout and rollback behavior.',
      ],
    },
    {
      id: 'internet-http-methods',
      title: 'Method Semantics',
      type: 'quiz',
      difficulty: 'Core',
      minutes: 10,
      prompt:
        'Which pair best describes PUT and PATCH in a resource-oriented HTTP API?',
      choices: [
        'PUT partially updates a resource; PATCH replaces it',
        'PUT replaces or creates a full resource representation; PATCH applies a partial change',
        'Both mean create only',
        'Neither should ever be retried',
      ],
      correctChoice: 1,
      answer:
        'PUT is usually full replacement and should be idempotent. PATCH represents a partial modification and may or may not be idempotent depending on the patch operation.',
      explanation:
        'HTTP method choice communicates client expectations. GET should be safe, PUT and DELETE should be idempotent, POST is often non-idempotent unless you add idempotency keys, and PATCH requires careful patch semantics.',
      questions: [
        'Why is retrying POST /charges dangerous without an idempotency key?',
        'What does safe mean in HTTP method terminology?',
      ],
      checklist: [
        'Define safe and idempotent separately.',
        'Know where GET, POST, PUT, PATCH, and DELETE fit.',
      ],
    },
  ],
  language: [
    {
      id: 'language-data-shapes',
      title: 'Data Shape Transformer',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 25,
      prompt:
        'Write a function that groups event records by user id and returns counts per event type. This is the small data-shaping muscle behind log processing, analytics, and API response formatting.',
      explanation:
        'Backends constantly reshape data between external contracts, database rows, queue payloads, logs, and internal domain objects. Before frameworks, practice pure transformations that are easy to test.',
      example:
        "groupEvents([{ userId: 'u1', type: 'login' }, { userId: 'u1', type: 'click' }]) returns { u1: { login: 1, click: 1 } }.",
      questions: [
        'Why is a pure data transformation easier to test than a controller?',
        'What should happen when the input is empty?',
      ],
      checklist: [
        'Return a new object without mutating input records.',
        'Count repeated event types correctly.',
        'Handle empty input.',
      ],
    },
    {
      id: 'language-boundaries',
      title: 'Pure Core, Imperative Shell',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Explain the pure core, imperative shell pattern for backend services. Identify which parts of a request handler should be pure and which parts must perform side effects.',
      explanation:
        'A durable backend often keeps business decisions in pure functions and isolates IO at the edges. The controller parses HTTP, the repository talks to storage, and the core decides what should happen. This makes tests faster and failures easier to reason about.',
      questions: [
        'Where should validation live if multiple transports call the same use case?',
        'Why do side effects make retries more dangerous?',
        'How does this pattern help with queue workers?',
      ],
      checklist: [
        'Name at least three side effects in a typical backend flow.',
        'Draw a boundary between transport, use case, and persistence.',
        'Explain how pure functions reduce mocking.',
      ],
    },
  ],
  sql: [
    {
      id: 'sql-normalization',
      title: 'Normalization Before Speed',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Normalize a user/order/product schema to avoid update anomalies, then name the exact place where denormalization might later be justified.',
      explanation:
        'Normalization is about preserving truth. Store each fact once until real read pressure proves otherwise. Denormalization is a deliberate cache or query optimization, not a default modeling style.',
      questions: [
        'What update anomaly happens if product_name is copied into every order row?',
        'Why do foreign keys encode business invariants?',
        'When is a materialized view less risky than duplicating columns manually?',
      ],
      checklist: [
        'Separate entities from relationships.',
        'Use foreign keys for ownership and references.',
        'Identify one safe denormalization strategy.',
      ],
    },
    {
      id: 'sql-join-practice',
      title: 'Join The Mental Model',
      type: 'coding',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Given arrays of users and orders, write a function that returns each user with their order count. Treat this as a code-level analogy for GROUP BY and LEFT JOIN.',
      explanation:
        'Before query planners feel intuitive, joins are just matching sets. A LEFT JOIN keeps the left side even when the right side has no match; aggregation then summarizes matching rows.',
      example:
        "usersWithOrderCounts([{id: 1}], [{userId: 1}, {userId: 1}]) returns [{ id: 1, orderCount: 2 }].",
      questions: [
        'Why should users with zero orders still appear?',
        'What index would help the database version of this operation?',
      ],
      checklist: [
        'Keep users with zero orders.',
        'Count multiple orders for the same user.',
        'Avoid nested loops if you can pre-index orders by userId.',
      ],
    },
  ],
  api: [
    {
      id: 'api-error-shape',
      title: 'Stable Error Shape',
      type: 'design',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Design one JSON error response shape for validation failures, auth failures, conflicts, and dependency errors. Explain which fields are stable for clients.',
      explanation:
        'Clients need predictable failure contracts as much as success contracts. A stable error shape lets frontends display field errors, SDKs branch on machine-readable codes, and logs correlate failures without leaking internals.',
      questions: [
        'Which error fields are safe for clients to depend on?',
        'Why is a raw exception message a bad API response?',
        'How should field-level validation errors be represented?',
      ],
      checklist: [
        'Include a machine-readable code.',
        'Include a human-readable message.',
        'Include field errors for validation.',
        'Avoid leaking stack traces or SQL details.',
      ],
    },
    {
      id: 'api-filter-builder',
      title: 'Filter Builder',
      type: 'coding',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Write a function that converts query parameters into a safe filter object for status, ownerId, and createdAfter. Ignore unknown fields.',
      explanation:
        'Filtering is contract design plus validation. You do not pass raw query strings straight into persistence. You parse, validate, normalize, and only then call a repository/query layer.',
      example:
        "buildFilters({ status: 'open', admin: 'true' }) returns { status: 'open' }.",
      questions: [
        'Why should unknown query parameters be ignored or rejected explicitly?',
        'Where would you validate createdAfter as a date?',
      ],
      checklist: [
        'Whitelist supported filters.',
        'Drop or reject unknown filters deliberately.',
        'Normalize dates into a consistent representation.',
      ],
    },
  ],
  security: [
    {
      id: 'security-threat-model',
      title: 'Threat Model A Route',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Threat model POST /projects/:id/invites. Identify assets, actors, trust boundaries, abuse cases, and controls.',
      explanation:
        'Security gets practical when you attach it to one route. Ask who can call it, what they can change, what secret or privilege is at stake, and what happens if an attacker calls it fast, repeatedly, or with forged identity.',
      questions: [
        'What asset is protected by an invite endpoint?',
        'Which trust boundary sits between the browser and the API?',
        'Which controls prevent invite spam?',
      ],
      checklist: [
        'Name the asset and actors.',
        'Identify authentication and authorization checks.',
        'Add rate limits and audit logging.',
        'Consider enumeration and spam abuse.',
      ],
    },
    {
      id: 'security-token-parser',
      title: 'Bearer Token Parser',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Write a function that extracts a bearer token from an Authorization header. It should accept only the exact Bearer scheme and reject malformed headers.',
      explanation:
        'Auth bugs often start with permissive parsing. Small parsing functions should be boring, strict, and heavily tested because every downstream permission check depends on them.',
      example: "parseBearer('Bearer abc123') returns 'abc123'. parseBearer('Basic abc123') returns null.",
      questions: [
        'Why should malformed auth headers fail closed?',
        'Why is parsing separate from validating the token signature?',
      ],
      checklist: [
        'Accept the Bearer scheme only.',
        'Return null for missing or malformed headers.',
        'Do not trim arbitrary extra token parts into validity.',
      ],
    },
  ],
  architecture: [
    {
      id: 'architecture-idempotent-worker',
      title: 'Idempotent Worker Handler',
      type: 'coding',
      difficulty: 'Hard',
      minutes: 45,
      prompt:
        'Write a pure function that decides whether a job should run, skip, retry, or dead-letter based on attempt count, prior completion, and max attempts.',
      explanation:
        'Queue systems deliver at least once more often than exactly once. Your handler must tolerate duplicates, crashes between side effects, and retries after partial work.',
      questions: [
        'Why is exactly-once delivery usually the wrong assumption?',
        'What state proves a duplicate job should be skipped?',
        'When should a job move to dead-letter?',
      ],
      checklist: [
        'Skip already completed jobs.',
        'Retry transient failures until max attempts.',
        'Dead-letter exhausted jobs.',
        'Keep the decision function pure.',
      ],
    },
  ],
  devops: [
    {
      id: 'devops-env-contract',
      title: 'Environment Contract',
      type: 'design',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Define the required environment variables for a backend service and design startup validation for them.',
      explanation:
        'A service should fail early when required config is missing. Startup validation turns mysterious runtime outages into obvious deploy-time failures.',
      questions: [
        'Which config belongs in env vars and which belongs in code?',
        'Why should secrets never be logged during validation?',
        'What should readiness return if config is invalid?',
      ],
      checklist: [
        'List required variables and types.',
        'Validate at startup.',
        'Keep secrets out of logs.',
        'Fail fast on missing critical config.',
      ],
    },
  ],
  performance: [
    {
      id: 'performance-latency-budget',
      title: 'Latency Budget',
      type: 'design',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Create a latency budget for an endpoint with a 300ms p95 target. Allocate time across app code, DB, cache, network, and downstream APIs.',
      explanation:
        'Performance improves when you budget it. If the whole endpoint must hit 300ms, a single 280ms downstream call leaves no room for serialization, DB work, or retries.',
      questions: [
        'Why is p95 more useful than average latency for user experience?',
        'Which dependency should get a timeout lower than the endpoint target?',
        'How does caching change the budget?',
      ],
      checklist: [
        'Allocate realistic per-dependency time.',
        'Include timeout values.',
        'Track p50, p95, and p99 separately.',
      ],
    },
  ],
}
