import type { Problem } from './course'

export const tutorialProblems: Record<string, Problem[]> = {
  internet: [
    {
      id: 'tutorial-internet-browser-to-api',
      title: 'Tutorial: Browser To API Mental Model',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 22,
      prompt:
        'Build the first mental model: a backend request is a chain of name resolution, connection setup, protocol negotiation, routing, application logic, storage, and response serialization.',
      explanation:
        'Do not begin with frameworks. Begin with the request. The browser or client needs an IP address, opens a connection, negotiates TLS for HTTPS, sends an HTTP message, and waits for a response. Your backend is only one part of that chain.',
      production:
        'When production breaks, the symptom rarely says "DNS" or "connection pool" on the first line. A clear request-chain model lets you ask better questions and isolate the failing layer quickly.',
      walkthrough: [
        'Start with the hostname and decide whether DNS, cache, or hosts file answers it.',
        'Open a TCP connection and then TLS if the URL is HTTPS.',
        'Send an HTTP request with method, path, headers, and optional body.',
        'Route through CDN/load balancer/reverse proxy into the app.',
        'Run app logic, call storage/dependencies, serialize response, and return headers/body.',
      ],
      questions: [
        'Which step happens before TLS can start?',
        'Where can a load balancer reject a request before app code runs?',
        'Which layer owns HTTP status codes?',
        'What log or trace would prove the request reached your app?',
      ],
      checklist: [
        'Explain the request chain in order.',
        'Name at least one failure mode per layer.',
        'Connect each layer to a debugging signal.',
      ],
    },
    {
      id: 'tutorial-internet-headers-bodies',
      title: 'Tutorial: Headers, Bodies, And Contracts',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Learn the division of responsibility between HTTP headers and bodies, then explain how content type, authorization, caching, and correlation IDs fit into that split.',
      explanation:
        'Headers describe metadata about the request or response: content type, auth credentials, caching directives, tracing IDs, cookies, and conditional requests. The body carries the representation or command payload.',
      production:
        'Bad headers create subtle outages: wrong Content-Type breaks parsers, missing request IDs ruin tracing, loose Cache-Control leaks stale data, and missing Authorization changes the entire security path.',
      walkthrough: [
        'Read Content-Type before parsing the body.',
        'Read Authorization/Cookie before loading identity.',
        'Read request/correlation IDs before logging downstream calls.',
        'Set Cache-Control and ETag based on data freshness rules.',
        'Return a response body whose shape matches the documented contract.',
      ],
      questions: [
        'Why should Content-Type be checked before JSON parsing?',
        'Which headers help debug one request across services?',
        'Why is Cache-Control part of correctness, not just performance?',
      ],
      checklist: [
        'Separate metadata from representation.',
        'Know the purpose of common backend headers.',
        'Tie headers to parsing, auth, caching, and observability.',
      ],
    },
    {
      id: 'tutorial-internet-timeouts-retries',
      title: 'Tutorial: Timeouts And Retries',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Explain how client timeout, proxy timeout, app timeout, database timeout, and retry policy interact for one endpoint.',
      explanation:
        'Every network call needs a deadline. Without timeouts, resources wait forever. Without retry limits and backoff, clients can multiply load during an outage. Good backends budget time across dependencies.',
      production:
        'Timeout mismatches are a classic incident cause. If the proxy gives up at 30s but the app keeps working for 90s, the system burns capacity on responses nobody will receive.',
      walkthrough: [
        'Pick an endpoint target such as p95 under 300ms.',
        'Set dependency timeouts lower than the caller timeout.',
        'Retry only safe/idempotent operations or operations protected by idempotency keys.',
        'Add exponential backoff and jitter.',
        'Log timeout reason and dependency name.',
      ],
      questions: [
        'Why should downstream timeouts be shorter than upstream timeouts?',
        'Which HTTP methods are naturally safer to retry?',
        'Why do retries need jitter?',
      ],
      checklist: [
        'Define a timeout budget.',
        'Distinguish retryable and non-retryable work.',
        'Explain how retries can worsen outages.',
      ],
    },
  ],
  language: [
    {
      id: 'tutorial-language-service-shape',
      title: 'Tutorial: Shape Of A Backend Service',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 24,
      prompt:
        'Learn the basic file/module shape of a backend service: entrypoint, routes/controllers, use cases/services, repositories, config, tests, and scripts.',
      explanation:
        'Backend code gets easier when responsibilities have homes. The entrypoint starts the process, routes translate HTTP, services encode business rules, repositories talk to storage, config loads environment, and tests prove behavior.',
      production:
        'A clear service shape reduces incident debugging time. You can find where a request enters, where data is written, where config is loaded, and where the business rule lives.',
      walkthrough: [
        'Start at the process entrypoint and identify startup config.',
        'Find a route/controller and trace how it parses input.',
        'Move from the route into a use case/service function.',
        'Find repository/database calls and side effects.',
        'Find tests that prove the behavior without needing the whole app.',
      ],
      questions: [
        'What belongs in a controller but not a service?',
        'Why should config validation happen at startup?',
        'What makes a use case easier to unit test?',
      ],
      checklist: [
        'Name common backend layers.',
        'Assign responsibilities to each layer.',
        'Trace one request through the code shape.',
      ],
    },
    {
      id: 'tutorial-language-error-handling',
      title: 'Tutorial: Error Handling Ladder',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Build an error-handling ladder from local validation errors to dependency failures to programmer bugs.',
      explanation:
        'Not all errors are equal. Validation errors are client-actionable. Auth errors are security decisions. Conflicts are business state. Dependency failures may be retryable. Programmer bugs should be logged loudly and hidden from clients.',
      production:
        'Poor error handling either leaks internals or hides useful signals. A production service needs stable client errors and rich internal logs at the same time.',
      walkthrough: [
        'Classify the error before choosing a status code.',
        'Return stable machine-readable codes to clients.',
        'Log internal context with request ID and dependency name.',
        'Decide whether the operation can be retried.',
        'Alert on bug classes and dependency failure rates.',
      ],
      questions: [
        'Why should clients not see stack traces?',
        'Which errors should be counted in SLO burn?',
        'How do you preserve debugging context without leaking secrets?',
      ],
      checklist: [
        'Separate validation, auth, conflict, dependency, and bug errors.',
        'Map each class to client response and log behavior.',
        'Explain retryability.',
      ],
    },
    {
      id: 'tutorial-language-testing-pure-core',
      title: 'Tutorial: Test The Pure Core First',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Learn why backend tests should start with pure logic before moving to database, HTTP, and end-to-end tests.',
      explanation:
        'Pure functions are cheap to test and hard to fake. Once business rules are proven in isolation, integration tests can focus on wiring, persistence, transactions, and contracts instead of every branch of logic.',
      production:
        'Fast, reliable tests let teams deploy more often. Slow flaky tests get ignored, and ignored tests stop protecting production.',
      walkthrough: [
        'Extract one business decision into a pure function.',
        'Write table-driven tests for edge cases.',
        'Write one integration test for database behavior.',
        'Write one contract or API test for the endpoint shape.',
        'Keep end-to-end tests for only the highest-value flows.',
      ],
      questions: [
        'What makes a test flaky?',
        'Why are pure logic tests faster than HTTP tests?',
        'What should integration tests prove?',
      ],
      checklist: [
        'Identify pure logic.',
        'Choose the right test level.',
        'Avoid testing everything through the UI/API.',
      ],
    },
  ],
  sql: [
    {
      id: 'tutorial-sql-rows-relations',
      title: 'Tutorial: Rows, Relations, And Invariants',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 26,
      prompt:
        'Learn to model backend data by asking: what are the entities, relationships, invariants, and access patterns?',
      explanation:
        'A schema is a correctness tool before it is a storage detail. Tables hold facts, foreign keys express relationships, unique constraints prevent duplicate truths, and transactions protect multi-step changes.',
      production:
        'The database is the last line of defense when multiple app servers race. If an invariant matters, encode it where concurrency is controlled.',
      walkthrough: [
        'List nouns in the product flow as candidate entities.',
        'Identify one-to-many and many-to-many relationships.',
        'Write invariants such as unique email or non-negative inventory.',
        'Choose constraints before writing app code checks.',
        'List the read queries that need indexes.',
      ],
      questions: [
        'Why is a unique database constraint stronger than an app-only check?',
        'What is an invariant?',
        'How do access patterns affect index design?',
      ],
      checklist: [
        'Identify entities and relationships.',
        'Name invariants.',
        'Map common queries to indexes.',
      ],
    },
    {
      id: 'tutorial-sql-indexes-plans',
      title: 'Tutorial: Indexes And Query Plans',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Explain how an index changes the work a database does, and how to read a simple query plan for scan, filter, sort, and limit.',
      explanation:
        'An index is a precomputed access path. It speeds reads that match its shape but costs storage and write work. Query plans reveal whether the database is scanning too much, sorting too much, or using the access path you expected.',
      production:
        'Most backend performance incidents eventually touch the database. Query plans turn guessing into evidence.',
      walkthrough: [
        'Start with the WHERE columns.',
        'Add ORDER BY and LIMIT to understand index order.',
        'Compare expected rows vs actual rows.',
        'Look for sequential scans on large tables.',
        'Measure with EXPLAIN ANALYZE after adding an index.',
      ],
      questions: [
        'Why can two single-column indexes be worse than one composite index?',
        'Why do writes get slower with many indexes?',
        'What does a sort node suggest?',
      ],
      checklist: [
        'Explain index shape.',
        'Read scan/filter/sort clues.',
        'Measure before and after.',
      ],
    },
    {
      id: 'tutorial-sql-transactions-locks',
      title: 'Tutorial: Transactions And Locks',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 32,
      prompt:
        'Learn how transactions group writes, how locks prevent unsafe races, and why isolation level changes what concurrent requests can observe.',
      explanation:
        'Transactions give all-or-nothing behavior. Locks coordinate concurrent access. Isolation defines which intermediate states are visible. Backend correctness depends on choosing the right transaction boundary.',
      production:
        'Double charges, oversold inventory, and inconsistent ledgers come from weak transaction thinking. These bugs do not show up reliably until concurrency arrives.',
      walkthrough: [
        'Identify all writes that must commit or roll back together.',
        'Find the row or invariant that concurrent requests compete for.',
        'Use atomic conditional update or row lock where needed.',
        'Handle deadlocks/retries explicitly.',
        'Write a concurrent test that would fail without the transaction.',
      ],
      questions: [
        'What is the read-modify-write race?',
        'When is SELECT FOR UPDATE useful?',
        'Why should transactions be kept short?',
      ],
      checklist: [
        'Define transaction boundary.',
        'Identify race-prone invariants.',
        'Choose atomic update or lock.',
      ],
    },
  ],
  api: [
    {
      id: 'tutorial-api-resource-modeling',
      title: 'Tutorial: Resource Modeling',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 24,
      prompt:
        'Learn how to turn product actions into resources, methods, paths, status codes, and response shapes.',
      explanation:
        'REST design is not about pretty URLs. It is about making resources and state transitions predictable. The method describes intent, the path names the resource, and the status code describes the result.',
      production:
        'Predictable APIs reduce client bugs and support burden. Ad hoc endpoints multiply edge cases and make versioning painful.',
      walkthrough: [
        'Name the resource being read or changed.',
        'Pick the method based on safety and idempotency.',
        'Define request schema and response schema.',
        'Define errors before implementation.',
        'Document examples for success and failure.',
      ],
      questions: [
        'When is POST better than PUT?',
        'What should a client do with 409?',
        'Why should errors have stable machine-readable codes?',
      ],
      checklist: [
        'Model resources first.',
        'Choose methods deliberately.',
        'Define success and error contracts.',
      ],
    },
    {
      id: 'tutorial-api-validation-versioning',
      title: 'Tutorial: Validation And Versioning',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Explain how request validation and API versioning protect clients and servers over time.',
      explanation:
        'Validation protects the server from unknown input. Versioning protects clients from unexpected change. A backend contract should evolve through additive changes where possible and explicit version changes when necessary.',
      production:
        'Breaking API changes become production incidents for clients. Strong validation and conservative evolution keep integrations stable.',
      walkthrough: [
        'Reject or ignore unknown fields intentionally.',
        'Return field-level validation errors.',
        'Prefer additive response fields over removing/renaming fields.',
        'Use contract tests to detect breaking changes.',
        'Publish migration notes when a version changes.',
      ],
      questions: [
        'Which response changes are usually backwards compatible?',
        'Why can strict clients break on new fields?',
        'How does OpenAPI help review API changes?',
      ],
      checklist: [
        'Validate inputs at the boundary.',
        'Define compatibility rules.',
        'Use contracts in CI.',
      ],
    },
    {
      id: 'tutorial-api-webhooks',
      title: 'Tutorial: Webhooks And Idempotency',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'Learn how to receive webhooks safely: signature verification, event IDs, idempotent processing, retries, and dead-letter handling.',
      explanation:
        'A webhook is an inbound message from another system. It can be duplicated, delayed, forged, or delivered out of order. Treat it like a message queue crossing a trust boundary.',
      production:
        'Payment, billing, and integration systems often depend on webhooks. Duplicate or forged webhook handling can create money movement bugs or security incidents.',
      walkthrough: [
        'Read raw body before verifying the signature.',
        'Verify timestamp and signature with the provider secret.',
        'Store event ID with a unique constraint.',
        'Process idempotently or enqueue for async handling.',
        'Return fast and retry failed internal work separately.',
      ],
      questions: [
        'Why verify the raw body instead of parsed JSON?',
        'What proves a webhook is a duplicate?',
        'Why should webhook handlers be fast?',
      ],
      checklist: [
        'Verify signature.',
        'Use event IDs for idempotency.',
        'Handle retries and out-of-order events.',
      ],
    },
  ],
  security: [
    {
      id: 'tutorial-security-authn-authz',
      title: 'Tutorial: Authentication vs Authorization',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 24,
      prompt:
        'Learn the difference between proving who the caller is and deciding what that caller may do.',
      explanation:
        'Authentication identifies the caller. Authorization checks permission for a specific action on a specific resource. A logged-in user can still be forbidden from another user’s data.',
      production:
        'Broken authorization is one of the most damaging backend bug classes because it often exposes real user data while every login check still appears to pass.',
      walkthrough: [
        'Authenticate the request and load the principal.',
        'Load the target resource.',
        'Check action-specific permission against that resource.',
        'Return 401 for missing/invalid identity and 403 for known-but-forbidden identity.',
        'Log authorization denials without leaking sensitive resource details.',
      ],
      questions: [
        'Why is authz resource-specific?',
        'When should an API hide existence with 404?',
        'What should be in an authorization audit log?',
      ],
      checklist: [
        'Define authn.',
        'Define authz.',
        'Apply checks per resource/action.',
      ],
    },
    {
      id: 'tutorial-security-sessions-tokens',
      title: 'Tutorial: Sessions, JWTs, And Refresh',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Compare server-side sessions, stateless access tokens, refresh tokens, and logout behavior.',
      explanation:
        'Sessions keep authority server-side. JWTs carry signed claims client-side. Refresh tokens extend login safely only if rotation, revocation, storage, and theft handling are designed carefully.',
      production:
        'Token mistakes create long-lived account takeover. Logout, revocation, rotation, and device/session visibility matter as much as login.',
      walkthrough: [
        'Choose session or token based on client and architecture.',
        'Keep access token lifetime short.',
        'Rotate refresh tokens and detect reuse.',
        'Store secrets/tokens with browser threat model in mind.',
        'Audit login, refresh, logout, and revocation events.',
      ],
      questions: [
        'Why are long-lived access tokens risky?',
        'What does refresh token rotation detect?',
        'Why is logout harder with stateless JWTs?',
      ],
      checklist: [
        'Compare sessions and JWTs.',
        'Explain refresh token rotation.',
        'Define logout/revocation behavior.',
      ],
    },
    {
      id: 'tutorial-security-input-output',
      title: 'Tutorial: Input And Output Safety',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Learn how validation, parameterization, escaping, and allowlists work together to prevent injection bugs.',
      explanation:
        'Validation says whether input is allowed. Parameterization keeps input as data rather than code. Escaping makes output safe for a target context. Allowlists make dangerous choices explicit.',
      production:
        'Most severe injection bugs are boring string-boundary mistakes. The fix is not cleverness; it is using the right boundary tool every time.',
      walkthrough: [
        'Validate shape and allowed values at the API boundary.',
        'Use parameterized queries for SQL.',
        'Escape untrusted output for HTML/URL/shell context as appropriate.',
        'Avoid passing user input into file paths, URLs, or commands without allowlists.',
        'Add security tests for dangerous examples.',
      ],
      questions: [
        'Why is escaping context-specific?',
        'Why do parameterized queries beat manual SQL escaping?',
        'What is an allowlist safer than a blocklist?',
      ],
      checklist: [
        'Validate input.',
        'Parameterize storage queries.',
        'Escape output by context.',
      ],
    },
  ],
  architecture: [
    {
      id: 'tutorial-architecture-modules',
      title: 'Tutorial: Module Boundaries',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Learn to split a backend into modules by business capability, data ownership, and change rate.',
      explanation:
        'A module boundary is a promise: code inside can change together, code outside should depend on a small interface. Good module boundaries make monoliths healthier and microservice extraction less chaotic later.',
      production:
        'Messy boundaries turn every feature into a risky global refactor. Clear boundaries lower coordination cost and reduce accidental coupling.',
      walkthrough: [
        'Group code by business capability rather than technical layer alone.',
        'Assign data ownership to one module.',
        'Expose narrow functions/events instead of shared internals.',
        'Watch for circular dependencies.',
        'Split only when ownership or scaling justifies it.',
      ],
      questions: [
        'What makes two modules too tightly coupled?',
        'Why is shared database ownership dangerous?',
        'When should a module become a service?',
      ],
      checklist: [
        'Define module ownership.',
        'Keep interfaces narrow.',
        'Avoid circular dependencies.',
      ],
    },
    {
      id: 'tutorial-architecture-messaging',
      title: 'Tutorial: Messaging And Async Work',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Learn when to move work out of the request path using queues, events, workers, retries, and dead-letter queues.',
      explanation:
        'Synchronous requests should do only what must complete before responding. Background workers handle slow, retryable, or fanout work. Events communicate that something happened; jobs command work to be done.',
      production:
        'Queues absorb spikes and isolate dependency failures, but they introduce eventual consistency, duplicate delivery, ordering concerns, and operational backlog.',
      walkthrough: [
        'Identify slow or unreliable side effects.',
        'Decide whether the work is a command job or domain event.',
        'Make handlers idempotent.',
        'Set retry/backoff/dead-letter policy.',
        'Monitor queue depth, age, and failure rate.',
      ],
      questions: [
        'What is the difference between an event and a job?',
        'Why must workers be idempotent?',
        'Which metric shows workers are falling behind?',
      ],
      checklist: [
        'Choose sync vs async deliberately.',
        'Design retries and DLQ.',
        'Monitor queue health.',
      ],
    },
    {
      id: 'tutorial-architecture-consistency',
      title: 'Tutorial: Consistency And Distributed Boundaries',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 34,
      prompt:
        'Learn how consistency changes when data and workflows cross service boundaries.',
      explanation:
        'Inside one database transaction, consistency is comparatively simple. Across services, you deal with partial failure, retries, duplicate messages, out-of-order events, and reconciliation.',
      production:
        'Distributed correctness bugs are expensive because no single stack trace owns the failure. You need idempotency, outbox patterns, reconciliation, and clear ownership.',
      walkthrough: [
        'Identify the system of record for each fact.',
        'Avoid dual writes without an outbox or transaction boundary.',
        'Publish events after durable state changes.',
        'Make consumers idempotent and replay-safe.',
        'Add reconciliation jobs for missed or inconsistent state.',
      ],
      questions: [
        'What is the dual-write problem?',
        'Why does an outbox help?',
        'What does reconciliation repair?',
      ],
      checklist: [
        'Name the source of truth.',
        'Avoid unsafe dual writes.',
        'Plan replay and reconciliation.',
      ],
    },
  ],
  devops: [
    {
      id: 'tutorial-devops-local-to-prod',
      title: 'Tutorial: Local To Production Path',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 26,
      prompt:
        'Learn the path from local dev to production: scripts, environment, build artifact, container, deploy target, and smoke test.',
      explanation:
        'A backend does not become production software until the build and deploy path is repeatable. The same commands should build the same artifact, with config supplied by environment rather than hand-edited files.',
      production:
        'Manual deploy steps are hidden outage generators. Repeatability is what lets you ship, roll back, and recover under pressure.',
      walkthrough: [
        'Run local scripts for lint/test/build.',
        'Validate environment variables.',
        'Build one artifact or image.',
        'Deploy to a target environment.',
        'Run smoke tests and check dashboards.',
      ],
      questions: [
        'Why build once and promote the artifact?',
        'What should a smoke test verify?',
        'Why should config differ from code?',
      ],
      checklist: [
        'Define build command.',
        'Validate config.',
        'Deploy repeatably.',
        'Smoke test after deploy.',
      ],
    },
    {
      id: 'tutorial-devops-observability-signals',
      title: 'Tutorial: Logs, Metrics, Traces',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Learn what logs, metrics, and traces each answer during debugging.',
      explanation:
        'Metrics tell you what changed and how much. Logs tell you what happened at specific points. Traces show the path and timing across services. Together they turn production behavior into evidence.',
      production:
        'Without observability, incidents become guessing sessions. With good signals, you can quickly separate bad deploys, dependency failures, traffic spikes, and data issues.',
      walkthrough: [
        'Use metrics for RED: rate, errors, duration.',
        'Use structured logs with request IDs for event details.',
        'Use traces for cross-service latency and dependency calls.',
        'Build dashboards around user-facing SLOs.',
        'Alert on symptoms before internals.',
      ],
      questions: [
        'What question does a trace answer better than a log?',
        'Why alert on symptoms?',
        'Which fields belong in every structured request log?',
      ],
      checklist: [
        'Differentiate logs, metrics, traces.',
        'Define request ID propagation.',
        'Connect signals to SLOs.',
      ],
    },
    {
      id: 'tutorial-devops-migrations-rollbacks',
      title: 'Tutorial: Migrations And Rollbacks',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 32,
      prompt:
        'Learn how to deploy database migrations safely with rolling app deploys and rollback constraints.',
      explanation:
        'Code can usually roll back faster than data. Safe migration strategy uses expand/contract: add compatible structures, dual-write/backfill, switch reads, then remove old structures later.',
      production:
        'Unsafe migrations can lock tables, break old app versions, or make rollback impossible. This is one of the most common places backend deployments fail.',
      walkthrough: [
        'Add new nullable column/table without breaking old code.',
        'Deploy code that writes both old and new shapes if needed.',
        'Backfill data in batches.',
        'Switch reads to the new shape.',
        'Drop old shape only after all app versions are safe.',
      ],
      questions: [
        'Why is dropping a column dangerous in a rolling deploy?',
        'What is expand/contract?',
        'Why should backfills be batched?',
      ],
      checklist: [
        'Keep migrations backward compatible.',
        'Batch expensive data changes.',
        'Plan rollback before deploy.',
      ],
    },
  ],
  performance: [
    {
      id: 'tutorial-performance-measure-first',
      title: 'Tutorial: Measure Before Optimizing',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 24,
      prompt:
        'Learn the performance workflow: define target, measure baseline, find bottleneck, change one thing, measure again.',
      explanation:
        'Optimization without measurement is storytelling. Backend performance work should move a metric such as p95 latency, query count, throughput, memory, or error rate.',
      production:
        'Random optimization wastes time and can make systems less reliable. Measurement keeps the work tied to user experience and capacity.',
      walkthrough: [
        'Define the user-facing target.',
        'Record baseline p50/p95/p99 and error rate.',
        'Identify the largest contributor with traces/profiling.',
        'Make one change.',
        'Compare before and after under similar load.',
      ],
      questions: [
        'Why can average latency hide pain?',
        'What is a bottleneck?',
        'Why change one thing at a time?',
      ],
      checklist: [
        'Define a performance target.',
        'Measure baseline.',
        'Validate improvement.',
      ],
    },
    {
      id: 'tutorial-performance-caching-layers',
      title: 'Tutorial: Caching Layers',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Learn the roles of browser cache, CDN cache, application memory cache, Redis, and database buffer/cache.',
      explanation:
        'Caching is not one thing. Each layer has different ownership, invalidation, freshness, latency, and failure behavior. The closer to the user, the faster the cache; the closer to the database, the easier consistency often becomes.',
      production:
        'Wrong caching creates stale data, privacy leaks, or stampedes. Correct caching can remove enormous load from databases and app servers.',
      walkthrough: [
        'Classify data as public/private and static/dynamic.',
        'Pick the nearest safe cache layer.',
        'Define TTL and invalidation on writes.',
        'Prevent stampedes with locks or stale-while-revalidate.',
        'Measure hit rate and stale/error behavior.',
      ],
      questions: [
        'Why should private user data avoid public CDN caching?',
        'What is a cache stampede?',
        'When is stale data acceptable?',
      ],
      checklist: [
        'Choose cache layer by data type.',
        'Define TTL/invalidation.',
        'Monitor hit rate and stampedes.',
      ],
    },
  ],
  capstone: [
    {
      id: 'tutorial-capstone-how-to-build',
      title: 'Tutorial: How To Attack A Capstone',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 35,
      prompt:
        'Learn the capstone workflow: requirements, core model, API, data, correctness, failure modes, observability, deploy, then scale.',
      explanation:
        'A capstone is not a giant coding prompt. It is a production thinking rehearsal. Start with the smallest correct system, then add constraints and scale only when the basic behavior is clear.',
      production:
        'Real backend projects fail when teams jump to infrastructure before clarifying invariants, data ownership, and failure behavior.',
      walkthrough: [
        'Write functional and non-functional requirements.',
        'Model the core data and invariants.',
        'Define APIs and error contracts.',
        'Choose transaction/idempotency strategy.',
        'Add observability and deployment plan.',
        'Describe how the design changes at 10x and 100x scale.',
      ],
      questions: [
        'What is the smallest correct version?',
        'Which invariant must never break?',
        'What is the first scaling bottleneck?',
        'How will you know production is healthy?',
      ],
      checklist: [
        'State requirements and non-goals.',
        'Define data model and APIs.',
        'Plan correctness before scale.',
        'Add operations and observability.',
      ],
    },
    {
      id: 'tutorial-capstone-review-rubric',
      title: 'Tutorial: Capstone Review Rubric',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Use this rubric to review any capstone: correctness, security, reliability, performance, operability, simplicity, and evolution path.',
      explanation:
        'Backend mastery is visible in tradeoff review. A strong design explains not only what it builds, but why that design is correct enough, safe enough, observable enough, and simple enough for the current stage.',
      production:
        'Design reviews prevent expensive rebuilds. They catch missing indexes, unsafe retries, weak authz, impossible rollbacks, and unclear ownership before code hardens around them.',
      walkthrough: [
        'Check correctness invariants first.',
        'Review auth, input, secrets, and abuse controls.',
        'Review retries, idempotency, and dependency failure behavior.',
        'Review indexes, caching, and load assumptions.',
        'Review logs, metrics, alerts, runbooks, and rollback.',
        'Ask what can be removed or deferred.',
      ],
      questions: [
        'Which review category catches double-charge bugs?',
        'Which category catches missing dashboards?',
        'Which category catches premature microservices?',
      ],
      checklist: [
        'Review across seven categories.',
        'Find at least one risk per category.',
        'Turn risks into concrete follow-up work.',
      ],
    },
  ],
}
