import type { Problem } from './course'

export const moreTutorialProblems: Record<string, Problem[]> = {
  internet: [
    {
      id: 'tutorial-internet-debugging-playbook',
      title: 'Tutorial: HTTP Debugging Playbook',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Learn a repeatable playbook for debugging broken API calls from client symptom to server evidence.',
      explanation:
        'Debugging an API call is a narrowing exercise. First prove whether the request leaves the client, reaches the edge, reaches the app, reaches dependencies, and returns a response the client can parse. Each hop has a tool: browser network tab, curl, dig, logs, traces, metrics, and database query plans.',
      production:
        'Production debugging rewards disciplined narrowing. Jumping straight to app code wastes time when the failure is DNS, TLS, CORS, proxy timeout, request size, or dependency saturation.',
      walkthrough: [
        'Reproduce with the smallest request using curl or an API client.',
        'Check DNS and TLS if the connection never reaches HTTP.',
        'Inspect method, path, headers, body size, and Content-Type.',
        'Find the request ID at the edge and in app logs.',
        'Follow traces into DB/cache/downstream calls.',
        'Classify the failure as client contract, network/edge, app bug, dependency, or capacity.',
      ],
      questions: [
        'What does curl prove that the browser network tab may hide?',
        'How do you tell a proxy timeout from an app exception?',
        'Which evidence proves the database was the bottleneck?',
        'What should you capture before declaring root cause?',
      ],
      checklist: [
        'Use a consistent narrowing order.',
        'Collect request IDs and timestamps.',
        'Tie each symptom to one layer of the request path.',
      ],
    },
    {
      id: 'tutorial-internet-cors-cookies',
      title: 'Tutorial: CORS, Cookies, And Browser Boundaries',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Understand why browser API calls fail differently than server-to-server calls when cookies, CORS, SameSite, and credentials are involved.',
      explanation:
        'CORS is a browser enforcement mechanism, not an API security boundary by itself. Cookies are automatically attached based on domain/path/SameSite/Secure rules. Credentialed cross-origin requests require both browser options and server headers to agree.',
      production:
        'Many auth incidents look like "login works locally but not in production" because cookie domain, HTTPS, SameSite, reverse proxies, or CORS headers changed between environments.',
      walkthrough: [
        'Identify the page origin and API origin.',
        'Decide whether the request is simple or needs a preflight.',
        'Set Access-Control-Allow-Origin to the exact allowed origin for credentialed requests.',
        'Enable credentials on both client and server when cookies are required.',
        'Check Set-Cookie attributes: HttpOnly, Secure, SameSite, Domain, Path.',
        'Verify the browser actually stores and sends the cookie.',
      ],
      questions: [
        'Why can a server-to-server request ignore CORS?',
        'Why can Access-Control-Allow-Origin: * not be used with credentials?',
        'How does SameSite=Lax differ from SameSite=None?',
      ],
      checklist: [
        'Separate CORS from authentication.',
        'Explain credentialed browser requests.',
        'Debug cookie storage and sending rules.',
      ],
    },
  ],
  language: [
    {
      id: 'tutorial-language-concurrency-models',
      title: 'Tutorial: Backend Concurrency Models',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 34,
      prompt:
        'Compare event loops, threads, processes, async/await, worker pools, and queues as ways backend systems handle concurrency.',
      explanation:
        'Concurrency is not one implementation. Node leans on an event loop for IO concurrency. Python has threads, processes, and asyncio with GIL tradeoffs. Java and Go have their own models. Backend engineers choose based on whether work is IO-bound, CPU-bound, latency-sensitive, or durable background work.',
      production:
        'The wrong concurrency model causes outages: CPU-heavy work blocks event loops, unbounded threads exhaust memory, async functions hide un-awaited failures, and queues without backpressure grow forever.',
      walkthrough: [
        'Classify the work as IO-bound, CPU-bound, or durable background work.',
        'Keep CPU-heavy work out of event-loop request handlers.',
        'Limit concurrency with pools/semaphores instead of spawning unbounded work.',
        'Use queues when work can happen after the response or needs retries.',
        'Measure saturation: CPU, event-loop lag, thread pool queue, queue depth.',
      ],
      questions: [
        'Why is async/await not magic parallel CPU execution?',
        'When is a worker process better than a thread?',
        'Which metric reveals event-loop blocking?',
      ],
      checklist: [
        'Classify workload type.',
        'Choose a bounded concurrency mechanism.',
        'Know what saturation signal to watch.',
      ],
    },
    {
      id: 'tutorial-language-config-secrets',
      title: 'Tutorial: Configuration And Secrets',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 26,
      prompt:
        'Learn how backend services load config safely and avoid leaking secrets through code, logs, builds, and client bundles.',
      explanation:
        'Configuration changes behavior by environment; secrets grant access. They should be validated at startup, kept out of source control, excluded from client-side bundles, and redacted in logs. A missing env var should fail fast instead of causing weird runtime behavior later.',
      production:
        'Mismanaged config creates silent production bugs: wrong database URL, disabled auth, bad callback URL, leaked API key, or a secret accidentally baked into a Docker image.',
      walkthrough: [
        'List required config with type and allowed values.',
        'Validate config once at startup.',
        'Load secrets from a secret manager or platform env.',
        'Never log raw secret values.',
        'Separate server-only env vars from browser-exposed env vars.',
        'Rotate secrets and know which deploys need restarting.',
      ],
      questions: [
        'Why should config validation happen before the server starts listening?',
        'What makes a value a secret rather than ordinary config?',
        'Why are browser-exposed env vars not secret?',
      ],
      checklist: [
        'Validate required config.',
        'Redact secrets in logs.',
        'Separate server and client exposure.',
      ],
    },
  ],
  sql: [
    {
      id: 'tutorial-sql-migration-sequencing',
      title: 'Tutorial: Safe Migration Sequencing',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 36,
      prompt:
        'Walk through the exact sequence for a zero-downtime column rename during rolling deploys.',
      explanation:
        'A column rename is dangerous because old app versions and new app versions may run at the same time. The safe approach is expand/contract: add the new shape, write both, backfill, read new, then remove old only after no old code remains.',
      production:
        'Schema changes are one of the few backend changes that can break rollback. If code rolls back but the old column is gone, production is down until another migration repairs it.',
      walkthrough: [
        'Add the new nullable column without removing the old one.',
        'Deploy code that writes both old and new columns.',
        'Backfill existing rows in small batches.',
        'Deploy code that reads the new column but can tolerate old data.',
        'Stop writing the old column after confidence.',
        'Drop the old column in a later deploy window.',
      ],
      questions: [
        'Why is direct rename unsafe in a rolling deploy?',
        'What should happen if backfill fails halfway?',
        'Why should destructive migrations be delayed?',
      ],
      checklist: [
        'Use expand/contract.',
        'Keep each deploy backward compatible.',
        'Batch backfills and monitor locks.',
      ],
    },
    {
      id: 'tutorial-sql-read-models',
      title: 'Tutorial: Read Models And Materialization',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 32,
      prompt:
        'Learn when to introduce read models, materialized views, summary tables, or search indexes instead of forcing every read from normalized transactional tables.',
      explanation:
        'The write model protects correctness. The read model serves query shape. When reads become expensive, you can materialize a view of the data optimized for the UI or API, accepting refresh lag and sync complexity deliberately.',
      production:
        'High-traffic backends often fail because one endpoint asks normalized tables to produce a dashboard-shaped response thousands of times per minute. Read models move that cost to write time or async processing.',
      walkthrough: [
        'Start with normalized transactional tables.',
        'Measure the read query and identify repeated expensive joins/aggregates.',
        'Choose a read model: materialized view, summary table, cache, or search index.',
        'Define refresh strategy: synchronous write, async event, scheduled refresh, or lazy rebuild.',
        'Expose staleness expectations to clients and operations.',
      ],
      questions: [
        'What correctness risk does a read model introduce?',
        'How do you rebuild a corrupt read model?',
        'When is a cache not enough?',
      ],
      checklist: [
        'Separate write model from read model.',
        'Define refresh and rebuild behavior.',
        'Measure read improvement and staleness.',
      ],
    },
  ],
  api: [
    {
      id: 'tutorial-api-pagination-sequence',
      title: 'Tutorial: Pagination Progression',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Learn pagination in order: unbounded list, limit/offset, cursor, keyset, and consistency tradeoffs.',
      explanation:
        'Pagination exists because unbounded lists are a denial-of-service bug wearing a friendly face. Offset pagination is simple, cursor pagination improves client flow, and keyset pagination keeps large changing lists fast and stable.',
      production:
        'Slow list endpoints are common production pain. Pagination choices affect database load, user-visible duplicates/skips, and whether indexes can satisfy ordering efficiently.',
      walkthrough: [
        'Ban unbounded list responses.',
        'Add limit with a maximum page size.',
        'Use offset pagination for small admin-style lists.',
        'Use cursor/keyset pagination for large user-facing feeds.',
        'Sort by stable columns with a tie-breaker such as id.',
        'Return opaque cursors rather than exposing implementation details.',
      ],
      questions: [
        'Why can offset pagination skip or duplicate items?',
        'What makes a cursor stable?',
        'Why should cursors be opaque?',
      ],
      checklist: [
        'Choose pagination by data size/change rate.',
        'Use stable ordering.',
        'Cap page size.',
      ],
    },
    {
      id: 'tutorial-api-command-query-split',
      title: 'Tutorial: Commands vs Queries',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 28,
      prompt:
        'Learn to separate read endpoints from write endpoints and why their API contracts, caching, validation, and observability differ.',
      explanation:
        'Queries ask for information and should be safe. Commands change state and require validation, authorization, idempotency, and audit thinking. Treating them the same causes confusing contracts.',
      production:
        'A GET endpoint that changes state can be triggered by crawlers, prefetchers, caches, and retries. A write endpoint without idempotency can duplicate money movement or emails.',
      walkthrough: [
        'Classify endpoint as query or command.',
        'For queries, design filters, pagination, caching, and projection.',
        'For commands, design validation, authz, idempotency, and conflict handling.',
        'Log command intent and outcome for audit.',
        'Use different performance budgets for reads and writes.',
      ],
      questions: [
        'Why should GET be safe?',
        'Which endpoints need idempotency keys?',
        'How do cache rules differ for commands and queries?',
      ],
      checklist: [
        'Separate reads and writes.',
        'Protect commands with idempotency/authz.',
        'Optimize queries with filters/pagination/cache.',
      ],
    },
  ],
  security: [
    {
      id: 'tutorial-security-oauth-flow-walkthrough',
      title: 'Tutorial: OAuth Flow Walkthrough',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 38,
      prompt:
        'Walk through OAuth authorization code with PKCE from login button to local session creation.',
      explanation:
        'OAuth login has multiple actors: browser, your app, authorization server, token endpoint, and resource/userinfo endpoint. PKCE protects public clients by proving the code exchange belongs to the party that started the flow.',
      production:
        'OAuth bugs create account takeover, token leakage, or login CSRF. Redirect URI validation, state, nonce, PKCE, token storage, and issuer/audience checks are not optional details.',
      walkthrough: [
        'Generate state, nonce, and PKCE verifier/challenge.',
        'Redirect browser to the authorization endpoint with exact redirect URI and scopes.',
        'Receive authorization code and verify state.',
        'Exchange code plus verifier at token endpoint server-side where appropriate.',
        'Validate ID token issuer, audience, nonce, signature, and expiry for OIDC.',
        'Create your own app session and store provider tokens safely only if needed.',
      ],
      questions: [
        'What does state protect?',
        'What does PKCE protect?',
        'Why do you create your own session instead of using the provider token directly everywhere?',
      ],
      checklist: [
        'Use state and PKCE.',
        'Validate OIDC tokens.',
        'Create a local session boundary.',
      ],
    },
    {
      id: 'tutorial-security-ssrf-file-upload',
      title: 'Tutorial: SSRF And File Upload Threats',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 34,
      prompt:
        'Learn two classic backend attack surfaces: fetching user-provided URLs and accepting user-provided files.',
      explanation:
        'SSRF happens when your server fetches a URL chosen by an attacker, letting them reach internal metadata services or private networks. File uploads can hide malware, oversized payloads, path traversal, decompression bombs, or content-type lies.',
      production:
        'These bugs are severe because they abuse backend trust. Your server has network reach and storage privileges the attacker does not.',
      walkthrough: [
        'For URL fetches, allowlist schemes and destinations.',
        'Resolve DNS and block private/link-local/internal IP ranges after redirects too.',
        'Set tight timeouts and response size limits.',
        'For uploads, stream to controlled storage, not arbitrary paths.',
        'Verify size, type, extension, and scan if needed.',
        'Serve uploaded files from a separate domain/bucket without code execution.',
      ],
      questions: [
        'Why is blocking only localhost insufficient for SSRF?',
        'Why can Content-Type be trusted only weakly?',
        'Why should uploads be served from separate storage?',
      ],
      checklist: [
        'Block internal network targets.',
        'Limit size/time/redirects.',
        'Store and serve uploads safely.',
      ],
    },
  ],
  architecture: [
    {
      id: 'tutorial-architecture-saga-walkthrough',
      title: 'Tutorial: Saga Walkthrough',
      type: 'lesson',
      difficulty: 'Boss',
      minutes: 40,
      prompt:
        'Learn how a saga coordinates a multi-step workflow without a distributed database transaction.',
      explanation:
        'A saga breaks a long business process into local transactions plus compensating actions. Instead of pretending the whole distributed workflow is atomic, you explicitly model partial success and recovery.',
      production:
        'Sagas are how real systems handle bookings, payments, fulfillment, and provisioning across services. The hard part is not the happy path; it is deciding what to do after step three fails.',
      walkthrough: [
        'List each local transaction in order.',
        'Define the durable state after each step.',
        'Define the compensating action for each completed step.',
        'Make each step idempotent and retryable.',
        'Persist saga state so workers can resume after crashes.',
        'Add manual intervention path for unrecoverable states.',
      ],
      questions: [
        'Why is compensation not always a perfect undo?',
        'Where should saga state live?',
        'How do retries interact with compensation?',
      ],
      checklist: [
        'Model steps and compensations.',
        'Persist progress.',
        'Handle retries and manual repair.',
      ],
    },
    {
      id: 'tutorial-architecture-event-sourcing',
      title: 'Tutorial: Event Sourcing Mental Model',
      type: 'lesson',
      difficulty: 'Boss',
      minutes: 38,
      prompt:
        'Learn how event sourcing stores facts as an append-only event stream and rebuilds current state by replaying events.',
      explanation:
        'In event sourcing, the source of truth is not the current row; it is the history of events. Current state is a projection. This gives auditability and replay power, but demands careful event versioning, ordering, and projection rebuilds.',
      production:
        'Event sourcing is powerful for audit-heavy domains like ledgers, but it adds operational complexity. Use it when history is a core product requirement, not because it sounds advanced.',
      walkthrough: [
        'Define domain events in past tense.',
        'Append events immutably with aggregate id and version.',
        'Rebuild current state by replaying events in order.',
        'Create projections/read models for queries.',
        'Version event schemas and support replay from old events.',
        'Snapshot only as an optimization, never as sole truth.',
      ],
      questions: [
        'Why should events be past tense?',
        'What is a projection?',
        'How do snapshots differ from source of truth?',
      ],
      checklist: [
        'Store immutable events.',
        'Replay to build state.',
        'Plan projections and versioning.',
      ],
    },
  ],
  devops: [
    {
      id: 'tutorial-devops-release-strategies',
      title: 'Tutorial: Release Strategies',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 32,
      prompt:
        'Compare rolling, blue-green, canary, and feature-flag releases for backend services.',
      explanation:
        'Release strategy controls blast radius. Rolling deploys replace instances gradually. Blue-green swaps environments. Canary sends a slice of traffic first. Feature flags separate deploy from release.',
      production:
        'Most production incidents are made worse by deploying to everyone at once with no fast disable path. A good release strategy lets you stop, roll back, or turn off the risky path quickly.',
      walkthrough: [
        'Use rolling deploys for ordinary compatible changes.',
        'Use blue-green when environment swap and quick rollback matter.',
        'Use canary when you need real traffic validation with low blast radius.',
        'Use feature flags for risky behavior changes.',
        'Watch golden signals during rollout and define abort thresholds.',
      ],
      questions: [
        'Why do feature flags not replace tests?',
        'What metric should stop a canary?',
        'Why must database migrations be compatible with rolling deploys?',
      ],
      checklist: [
        'Choose a release strategy by risk.',
        'Define rollback/abort criteria.',
        'Monitor during rollout.',
      ],
    },
    {
      id: 'tutorial-devops-runbooks',
      title: 'Tutorial: Runbooks And On-Call Readiness',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 26,
      prompt:
        'Learn what a useful backend runbook contains and how it helps during incidents.',
      explanation:
        'A runbook is executable operational knowledge: what alert fired, what it means, where to look, what commands are safe, how to mitigate, and when to escalate. It should be written for a tired engineer at 3 AM.',
      production:
        'Without runbooks, incidents depend on whoever remembers the system. With runbooks, response becomes calmer, faster, and less personality-dependent.',
      walkthrough: [
        'Start with alert name and user impact.',
        'Link dashboards, logs, traces, and deploy history.',
        'List safe diagnostic commands and queries.',
        'List mitigations such as rollback, scale, disable flag, drain queue.',
        'Define escalation path and postmortem notes.',
      ],
      questions: [
        'What makes a runbook dangerous?',
        'Why should mitigation steps be explicit?',
        'How do runbooks improve onboarding?',
      ],
      checklist: [
        'Tie alerts to impact.',
        'Provide evidence links.',
        'Document safe mitigation steps.',
      ],
    },
  ],
  performance: [
    {
      id: 'tutorial-performance-load-testing',
      title: 'Tutorial: Load Testing Without Lying',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 34,
      prompt:
        'Learn how to design a load test that says something useful about backend capacity.',
      explanation:
        'A load test is an experiment. It needs representative traffic, realistic data, clear success criteria, controlled ramp-up, and measurement of latency percentiles, errors, and saturation. A synthetic test that ignores auth, cache, DB size, and write mix can be worse than no test.',
      production:
        'Capacity surprises become outages. Honest load testing finds bottlenecks before real users do and gives you confidence in scaling plans.',
      walkthrough: [
        'Define the question: capacity, regression, soak, or spike.',
        'Use realistic request mix and data volume.',
        'Ramp load gradually and watch p50/p95/p99 plus error rate.',
        'Watch saturation: CPU, memory, DB pool, queue depth, downstream limits.',
        'Stop at defined failure thresholds.',
        'Record bottleneck and next experiment.',
      ],
      questions: [
        'Why is p95 more useful than average during load tests?',
        'What makes test traffic unrealistic?',
        'Why should each test answer one question?',
      ],
      checklist: [
        'Define workload and success criteria.',
        'Measure latency, errors, and saturation.',
        'Document bottleneck and next step.',
      ],
    },
    {
      id: 'tutorial-performance-backpressure',
      title: 'Tutorial: Backpressure',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'Learn how backpressure prevents a fast producer from overwhelming a slow consumer.',
      explanation:
        'Backpressure is controlled refusal or slowing. It appears in streams, queues, HTTP rate limits, database pools, and worker systems. Without it, systems accept more work than they can finish and fail catastrophically.',
      production:
        'A backend without backpressure turns latency into outages. Queues grow, memory spikes, retries amplify, and users wait for work that should have been rejected or deferred.',
      walkthrough: [
        'Identify producer and consumer.',
        'Define the bounded buffer or concurrency limit.',
        'Choose behavior at capacity: wait, shed, reject, sample, or degrade.',
        'Expose capacity signals through metrics.',
        'Tell clients how to retry with 429/Retry-After or async job status.',
      ],
      questions: [
        'Why is an unbounded queue dangerous?',
        'When should a service shed load?',
        'How does database pool size create backpressure?',
      ],
      checklist: [
        'Bound queues/concurrency.',
        'Define overload behavior.',
        'Expose saturation metrics.',
      ],
    },
  ],
  'system-design': [
    {
      id: 'tutorial-system-design-requirements',
      title: 'Tutorial: Requirements Before Architecture',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 32,
      prompt:
        'Learn to start every system design with functional requirements, non-functional requirements, scale assumptions, and non-goals.',
      explanation:
        'System design without requirements becomes architecture fan fiction. Requirements decide the data model, API, consistency, storage, caching, and deployment shape.',
      production:
        'Teams waste months building the wrong system when they skip requirements. A simple monolith may be correct for one requirement set; a distributed architecture may be necessary for another.',
      walkthrough: [
        'List core user actions.',
        'List latency, availability, durability, privacy, and compliance needs.',
        'Estimate traffic, storage, and growth.',
        'Write non-goals to prevent scope creep.',
        'Only then choose storage, APIs, and boundaries.',
      ],
      questions: [
        'Which requirement changes the storage choice?',
        'Which requirement changes consistency needs?',
        'What is a useful non-goal?',
      ],
      checklist: [
        'Separate functional and non-functional requirements.',
        'Make scale assumptions explicit.',
        'State non-goals.',
      ],
    },
    {
      id: 'tutorial-system-design-evolution',
      title: 'Tutorial: Evolving A System From V1 To Scale',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 36,
      prompt:
        'Learn how to present a system design as stages: simplest correct version, first bottleneck, second bottleneck, and mature architecture.',
      explanation:
        'Strong system design does not start with the final architecture. It starts with a correct minimal system, then explains what changes as traffic, data, team size, and failure requirements grow.',
      production:
        'Evolutionary design prevents premature complexity while still preparing for scale. It also makes tradeoffs reviewable because each added component answers a specific pressure.',
      walkthrough: [
        'Design V1 as one app and one database if possible.',
        'Identify the first bottleneck with evidence.',
        'Add cache/read replica/queue only when it answers that bottleneck.',
        'Split services only when ownership or scale requires it.',
        'Describe migration steps between stages.',
      ],
      questions: [
        'What is premature in the initial version?',
        'What evidence justifies adding a queue?',
        'How do you migrate without downtime?',
      ],
      checklist: [
        'Present staged architecture.',
        'Tie each component to pressure.',
        'Include migration path.',
      ],
    },
  ],
  capstone: [
    {
      id: 'tutorial-capstone-implementation-slices',
      title: 'Tutorial: Capstone Implementation Slices',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 34,
      prompt:
        'Learn how to break a capstone into implementation slices that each produce a working, testable increment.',
      explanation:
        'A production system should be built in vertical slices, not giant horizontal phases. Each slice should touch API, domain logic, persistence, tests, and observability for one narrow behavior.',
      production:
        'Vertical slicing reduces integration risk. You discover contract, schema, and operational issues early instead of after weeks of isolated layer work.',
      walkthrough: [
        'Pick the smallest user-visible behavior.',
        'Define API request/response and errors.',
        'Implement domain logic and persistence.',
        'Add tests and one dashboard/log signal.',
        'Deploy behind a flag if risky.',
        'Repeat with the next behavior.',
      ],
      questions: [
        'Why are vertical slices safer than building all database tables first?',
        'Which slice proves the riskiest assumption?',
        'How do feature flags help capstone rollout?',
      ],
      checklist: [
        'Break capstone into vertical slices.',
        'Make each slice testable.',
        'Add observability per slice.',
      ],
    },
  ],
}
