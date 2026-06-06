// Interview-answer triad per core concept: the escalating answers a learner
// should be able to give. Rendered by the "Explain it in an interview" panel
// (Codex), grouped by subjectId. See PROGRESSION_PLAN.md (Layer A).
//
// simple       = one sentence a junior could say.
// senior       = mechanism + tradeoff, how a senior frames it.
// systemDesign = where it fits in a real system / failure modes it guards.

export type InterviewAnswer = {
  key: string
  topic: string
  subjectId: string
  simple: string
  senior: string
  systemDesign: string
}

export const interviewAnswers: InterviewAnswer[] = [
  {
    key: 'request-lifecycle',
    topic: 'The request lifecycle',
    subjectId: 'internet',
    simple: 'A request travels from the browser to a server and comes back as a response.',
    senior:
      'DNS resolves the host to an IP, TCP opens a connection, TLS encrypts it, then HTTP carries the method, path, headers, and body to the app, which returns a status and body.',
    systemDesign:
      'Every hop is a latency and failure budget: DNS caching, keep-alive/connection reuse, TLS termination at the edge, a reverse proxy and load balancer in front of app servers, and timeouts plus retries at each boundary.',
  },
  {
    key: 'https-tls',
    topic: 'HTTPS / TLS',
    subjectId: 'internet',
    simple: 'HTTPS encrypts traffic so others cannot read or tamper with it.',
    senior:
      'TLS gives confidentiality, integrity, and server identity via a certificate. It does not authenticate the caller; that is a separate login step.',
    systemDesign:
      'Terminate TLS at the load balancer or CDN, rotate certificates automatically, and keep authentication and authorization on every request because transport encryption says nothing about who is calling.',
  },
  {
    key: 'rest',
    topic: 'REST',
    subjectId: 'api',
    simple: 'REST models your data as resources you act on with HTTP methods.',
    senior:
      'Nouns as URLs, verbs as GET/POST/PUT/PATCH/DELETE, status codes for the outcome, and stateless requests so any server can handle any call.',
    systemDesign:
      'Statelessness is what lets you scale horizontally behind a load balancer; pair it with idempotent writes, pagination, and versioning so clients survive change.',
  },
  {
    key: 'idempotency',
    topic: 'Idempotency',
    subjectId: 'api',
    simple: 'Doing the same request twice has the same effect as doing it once.',
    senior:
      'Store an idempotency key with the request result so a retry returns the original response instead of creating a duplicate.',
    systemDesign:
      'Essential for payments and order or loan submission, where retries, refreshes, queue redelivery, and client timeouts all cause duplicates; the key plus stored result makes the whole pipeline safe to retry.',
  },
  {
    key: 'pagination',
    topic: 'Pagination',
    subjectId: 'api',
    simple: 'Return a long list in pages instead of all at once.',
    senior:
      'Offset pagination is simple but drifts and slows on deep pages; keyset (cursor) pagination uses the index and stays correct under inserts.',
    systemDesign:
      'For large or fast-changing feeds use cursors, so page N costs the same as page 1 and concurrent writes do not skip or repeat rows.',
  },
  {
    key: 'status-codes',
    topic: 'HTTP status codes',
    subjectId: 'api',
    simple: 'A number that says how the request went, like 200 OK or 404 Not Found.',
    senior:
      '2xx success, 4xx the client is at fault (400 validation, 401 unauthenticated, 403 unauthorized, 404 missing, 409 conflict, 429 too many), 5xx the server is at fault.',
    systemDesign:
      'Consistent codes drive client retry logic and alerting: 5xx and 429 are retryable with backoff, 4xx are not; map domain errors to codes in one place.',
  },
  {
    key: 'authn-vs-authz',
    topic: 'Authentication vs authorization',
    subjectId: 'security',
    simple: 'Authentication is who you are; authorization is what you are allowed to do.',
    senior:
      'Authenticate once to establish identity (session or token), then authorize every request against permissions or roles for the specific resource.',
    systemDesign:
      'Authorize at the service, not just the gateway; centralize policy, default-deny, and check object ownership on each request to avoid broken-access-control bugs.',
  },
  {
    key: 'jwt-vs-sessions',
    topic: 'Sessions vs JWTs',
    subjectId: 'security',
    simple: 'Sessions store login state on the server; JWTs carry it in a signed token.',
    senior:
      'Sessions are easy to revoke but need shared storage; JWTs scale statelessly but are hard to revoke before expiry and must never hold secrets.',
    systemDesign:
      'Use short-lived access tokens with refresh tokens, or server sessions in a fast shared store; pin the signing algorithm and plan a revocation path (deny-list or short TTLs).',
  },
  {
    key: 'rate-limiting',
    topic: 'Rate limiting',
    subjectId: 'security',
    simple: 'Cap how many requests a client can make in a window.',
    senior:
      'A token bucket allows bursts up to a capacity while bounding the long-run rate; fixed windows are simple but allow a double burst at the boundary.',
    systemDesign:
      'Enforce at the edge with a shared counter (Redis) keyed by user, IP, or route, return 429 with Retry-After, and degrade gracefully instead of collapsing under load.',
  },
  {
    key: 'password-hashing',
    topic: 'Password hashing',
    subjectId: 'security',
    simple: 'Store a scrambled, irreversible version of the password, never the password.',
    senior:
      'Use a slow, salted hash (bcrypt, scrypt, or Argon2) so stolen hashes are expensive to crack, and compare in constant time.',
    systemDesign:
      'Tune the work factor to your hardware, add a pepper from a secret store, and upgrade hashes on next login when you raise the cost.',
  },
  {
    key: 'indexes',
    topic: 'Database indexes',
    subjectId: 'sql',
    simple: 'An index lets the database find rows fast without scanning the whole table.',
    senior:
      'It is a sorted structure on chosen columns; a composite index can satisfy a WHERE and an ORDER BY together, but every index slows writes.',
    systemDesign:
      'Design indexes from real query patterns, watch selectivity (an index on a low-cardinality column will not help), and confirm with EXPLAIN.',
  },
  {
    key: 'transactions-acid',
    topic: 'Transactions and ACID',
    subjectId: 'sql',
    simple: 'A transaction is a group of changes that all succeed or all undo.',
    senior:
      'ACID is atomicity, consistency, isolation, durability; isolation levels trade correctness for concurrency and cause anomalies like lost updates.',
    systemDesign:
      'Keep transactions short to avoid lock contention, pick the isolation level per use case, and use optimistic locking (a version column) for high-contention writes.',
  },
  {
    key: 'n-plus-one',
    topic: 'The N+1 query problem',
    subjectId: 'sql',
    simple: 'Fetching a list, then running one more query per item instead of one for all.',
    senior:
      'It is 1 + N round trips; fix it with a JOIN or a batched IN query (select_related/prefetch in ORMs).',
    systemDesign:
      'It is the most common hidden latency bug; catch it with query-count assertions and an APM, and batch at the data-access layer.',
  },
  {
    key: 'caching',
    topic: 'Caching',
    subjectId: 'performance',
    simple: 'Keep a fast copy of expensive results so you do not recompute them.',
    senior:
      'Cache-aside loads on a miss and stores the result; choose a TTL and an eviction policy (LRU or LFU). The hard part is invalidation.',
    systemDesign:
      'Layer caches (CDN, then app, then Redis, then DB), key carefully, and set staleness tolerance per resource; a cache stampede needs request coalescing or jittered TTLs.',
  },
  {
    key: 'cache-invalidation',
    topic: 'Cache invalidation',
    subjectId: 'performance',
    simple: 'Making sure cached data is not served after it changes.',
    senior:
      'Invalidate or version the key on write, or accept bounded staleness with a TTL; content-hash immutable assets.',
    systemDesign:
      'Choose write-through, write-behind, or TTL per consistency need; for fan-out, publish invalidation events so every cache drops the key.',
  },
  {
    key: 'queues-async',
    topic: 'Queues and async work',
    subjectId: 'architecture',
    simple: 'Hand slow work to a background worker instead of doing it in the request.',
    senior:
      'A producer enqueues a message and a worker processes it later; this smooths spikes and keeps request latency low.',
    systemDesign:
      'Assume at-least-once delivery (so design idempotent consumers), bound retries with backoff, and route poison messages to a dead-letter queue.',
  },
  {
    key: 'retries-backoff',
    topic: 'Retries and backoff',
    subjectId: 'architecture',
    simple: 'Retry a failed call, waiting longer each time.',
    senior:
      'Exponential backoff with full jitter so clients do not retry in synchronized waves and hammer a recovering service.',
    systemDesign:
      'Combine with a circuit breaker and idempotency keys, and cap total attempts so retries do not amplify an outage.',
  },
  {
    key: 'event-driven',
    topic: 'Event-driven architecture',
    subjectId: 'architecture',
    simple: 'Components react to events instead of calling each other directly.',
    senior:
      'Publishers emit events and subscribers react; this decouples services but makes ordering and exactly-once harder.',
    systemDesign:
      'Use an outbox to publish atomically with the DB write, expect duplicates (idempotent handlers), and reach for event sourcing only when the audit log is worth the replay cost.',
  },
  {
    key: 'observability',
    topic: 'Logs, metrics, and traces',
    subjectId: 'devops',
    simple: 'Logs are events, metrics are numbers over time, traces follow one request.',
    senior:
      'Structure logs with a request id, track rate, errors, and latency as metrics, and propagate trace context across services.',
    systemDesign:
      'Correlation IDs stitch logs and traces across hops; alert on SLO burn (p95 latency, error rate), not raw counts.',
  },
  {
    key: 'containers',
    topic: 'Containers',
    subjectId: 'devops',
    simple: 'A container packages your app with everything it needs to run the same anywhere.',
    senior:
      'Lighter than a VM because it shares the host kernel, built from an immutable image; great for consistent deploys and scaling.',
    systemDesign:
      'Run stateless containers behind a load balancer, externalize config and secrets, add health and readiness probes, and roll out with a rollback path.',
  },
  {
    key: 'load-balancing',
    topic: 'Load balancing',
    subjectId: 'system-design',
    simple: 'Spread requests across many servers.',
    senior:
      'A load balancer routes to healthy instances (round-robin or least-connections) and removes failing ones via health checks.',
    systemDesign:
      'Combine with horizontal scaling and stateless services; sticky sessions hurt elasticity, so push session state to a shared store.',
  },
  {
    key: 'monolith-vs-microservices',
    topic: 'Monolith vs microservices',
    subjectId: 'system-design',
    simple: 'One app versus many small services that talk over the network.',
    senior:
      'Monoliths are simpler to build, deploy, and debug; microservices buy independent scaling and team autonomy at the cost of network failure and operational complexity.',
    systemDesign:
      'Start with a monolith and split by clear bounded contexts only when scaling or team friction demands it; each split adds latency, partial failure, and cross-service consistency work (sagas).',
  },
  {
    key: 'object-storage',
    topic: 'File uploads and object storage',
    subjectId: 'files-storage',
    simple: 'Store file bytes in object storage (like S3) and keep only the key in the database.',
    senior:
      'Upload directly to storage with a short-lived presigned URL so your server never proxies the bytes; validate size and content type, and store the resulting key plus metadata in the DB.',
    systemDesign:
      'Serve reads through a CDN, keep buckets private behind signed URLs, use multipart upload for large files, and apply lifecycle rules to expire temp objects; sanitize keys to block path traversal.',
  },
]
