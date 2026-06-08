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

  {
    key: 'dns',
    topic: 'DNS',
    subjectId: 'internet',
    simple: 'DNS turns a domain name into the IP address of a server.',
    senior:
      'A recursive resolver walks root, TLD, and authoritative servers and caches answers by TTL; A/AAAA/CNAME/MX records map names to addresses and services.',
    systemDesign:
      'DNS is also a routing tool: low-TTL failover, geo/latency routing, and weighted records for blue-green, but resolver caching means changes are not instant.',
  },
  {
    key: 'http-methods',
    topic: 'HTTP methods',
    subjectId: 'internet',
    simple: 'GET reads, POST creates, PUT/PATCH update, DELETE removes.',
    senior:
      'GET is safe (no side effects); GET, PUT, and DELETE are idempotent; POST is neither, which matters for retries and caching.',
    systemDesign:
      'Idempotent methods are safe to retry through proxies and load balancers, so design writes around it (PUT with a client-supplied id, or POST plus an idempotency key).',
  },
  {
    key: 'validation',
    topic: 'Input validation',
    subjectId: 'api',
    simple: 'Check incoming data is well-formed before you use it.',
    senior:
      'Validate at the boundary against a schema, coerce types, and return a per-field error map; treat the body as unknown until validated.',
    systemDesign:
      'Boundary validation keeps bad data out of services and the DB, turns 500s into 400s, and is a security control against injection and oversized payloads.',
  },
  {
    key: 'api-versioning',
    topic: 'API versioning',
    subjectId: 'api',
    simple: 'Version your API so changes do not break existing clients.',
    senior:
      'Version via URL (/v2) or header; add fields backward-compatibly and bump the version only for breaking changes.',
    systemDesign:
      'Run versions side by side, deprecate on a timeline using usage metrics, and prefer additive evolution so a hard version bump is rare.',
  },
  {
    key: 'webhooks',
    topic: 'Webhooks',
    subjectId: 'api',
    simple: 'Your server gets called by another service when an event happens.',
    senior:
      'Verify the signature over the raw body, ack fast with 2xx and process async, and dedupe by event id because providers retry.',
    systemDesign:
      'Treat webhooks as at-least-once: idempotent handlers, a queue behind the endpoint, a dead-letter path, and a replay tool for missed events.',
  },
  {
    key: 'oauth',
    topic: 'OAuth 2.0',
    subjectId: 'security',
    simple: 'OAuth lets an app act on your behalf without seeing your password.',
    senior:
      'The authorization-code flow swaps a short-lived code for access and refresh tokens scoped to specific permissions; the app never holds the credentials.',
    systemDesign:
      'Use PKCE for public clients, keep access tokens short with refresh rotation, validate scope on every call, and add OpenID Connect when you need identity.',
  },
  {
    key: 'sql-injection',
    topic: 'SQL injection',
    subjectId: 'security',
    simple: 'Attacker input changes the meaning of your SQL query.',
    senior:
      'Never concatenate input into SQL; use parameterized queries so input is always data, never code.',
    systemDesign:
      'Parameterize everywhere, run least-privilege DB users, and layer validation and an ORM; defense in depth limits the blast radius if one layer slips.',
  },
  {
    key: 'xss',
    topic: 'Cross-site scripting (XSS)',
    subjectId: 'security',
    simple: 'Attacker input runs as a script in the browser of another user.',
    senior:
      'Untrusted data rendered as HTML executes; escape on output by context and set a Content-Security-Policy.',
    systemDesign:
      'Encode per context (HTML, attribute, JS, URL), prefer auto-escaping frameworks, use CSP as a backstop, and set cookies HttpOnly so stolen scripts cannot read them.',
  },
  {
    key: 'csrf',
    topic: 'Cross-site request forgery (CSRF)',
    subjectId: 'security',
    simple: 'Another site tricks the browser of a logged-in user into calling your API.',
    senior:
      'Cookies are sent automatically, so defend cookie auth with SameSite cookies plus a CSRF token, or use header-based tokens.',
    systemDesign:
      'SameSite=Lax/Strict plus a double-submit or synchronizer token; APIs using the Authorization header are largely immune since browsers do not attach it automatically.',
  },
  {
    key: 'cors',
    topic: 'CORS',
    subjectId: 'security',
    simple: 'Browser rules for which sites may call your API from a page.',
    senior:
      'The browser preflights cross-origin requests and blocks the response unless your server returns the right Access-Control-Allow-* headers.',
    systemDesign:
      'Allowlist specific origins (never reflect arbitrary ones with credentials), and remember CORS is a browser protection, not server authorization, which you still enforce.',
  },
  {
    key: 'secrets-management',
    topic: 'Secrets management',
    subjectId: 'security',
    simple: 'Keep passwords and keys out of your code.',
    senior:
      'Load secrets from the environment or a secret manager, never commit them, and scope each to least privilege.',
    systemDesign:
      'Encrypt at rest, rotate routinely, audit access, and keep secrets out of logs and responses; assume any secret can leak and make rotation cheap.',
  },
  {
    key: 'normalization',
    topic: 'Normalization',
    subjectId: 'sql',
    simple: 'Organize tables so each fact lives in exactly one place.',
    senior:
      'Normal forms remove redundancy and update anomalies; aim for 3NF, then denormalize deliberately for read performance.',
    systemDesign:
      'Normalize for write integrity, denormalize (aggregates, read models) for proven read hotspots, and always know which copy is the source of truth.',
  },
  {
    key: 'orm',
    topic: 'ORMs',
    subjectId: 'sql',
    simple: 'A library that maps database rows to objects so you write less SQL.',
    senior:
      'ORMs speed up CRUD and migrations but hide query cost; lazy loading is the classic N+1 trap.',
    systemDesign:
      'Use the ORM for the common 90% and drop to raw SQL for hot or complex queries; always inspect the generated SQL and query counts under load.',
  },
  {
    key: 'connection-pooling',
    topic: 'Connection pooling',
    subjectId: 'sql',
    simple: 'Reuse a small set of DB connections instead of opening one per request.',
    senior:
      'Connections are expensive and the DB caps them; a pool bounds concurrency and reuses them.',
    systemDesign:
      'Size the pool to the DB limit divided across instances; many replicas times a big pool exhausts the DB, so add a proxy like PgBouncer at scale.',
  },
  {
    key: 'sql-vs-nosql',
    topic: 'SQL vs NoSQL',
    subjectId: 'sql',
    simple: 'SQL is structured tables with relations; NoSQL trades that for flexibility and scale.',
    senior:
      'Relational gives joins, transactions, and strong consistency; document and wide-column stores model around access patterns and scale horizontally, often eventually consistent.',
    systemDesign:
      'Choose by access pattern: relational by default for transactional integrity, NoSQL for massive scale, flexible schema, or a key-value/document shape, accepting denormalization.',
  },
  {
    key: 'replication',
    topic: 'Replication',
    subjectId: 'sql',
    simple: 'Keep copies of the database on multiple servers.',
    senior:
      'A primary takes writes and streams to read replicas, which can lag, so reads may be stale.',
    systemDesign:
      'Scale reads with replicas and survive failure with failover; route read-after-write to the primary or wait for replication, and watch replication lag.',
  },
  {
    key: 'cdn',
    topic: 'CDN',
    subjectId: 'performance',
    simple: 'Servers near users that cache your content for fast delivery.',
    senior:
      'The CDN caches static and cacheable responses at the edge, cutting latency and origin load; cache keys and TTLs control freshness.',
    systemDesign:
      'Push static and cacheable dynamic content to the edge, use cache-control plus content hashing for immutability, and purge or version on deploy.',
  },
  {
    key: 'http-cache-headers',
    topic: 'HTTP cache headers',
    subjectId: 'performance',
    simple: 'Headers that tell clients and proxies how long to cache a response.',
    senior:
      'Cache-Control sets max-age and public/private; ETag and Last-Modified enable cheap 304 revalidation.',
    systemDesign:
      'Long max-age plus immutable for content-hashed assets, short max-age plus must-revalidate plus ETag for changing data, and no-store only for truly sensitive responses.',
  },
  {
    key: 'dead-letter-queue',
    topic: 'Dead-letter queues',
    subjectId: 'architecture',
    simple: 'A side queue for messages that keep failing.',
    senior:
      'After bounded retries, move the poison message to a DLQ with context so the main queue keeps flowing.',
    systemDesign:
      'Alert on DLQ depth, store enough context to debug, and provide a replay path once fixed; without a DLQ one bad message blocks everything.',
  },
  {
    key: 'outbox',
    topic: 'Transactional outbox',
    subjectId: 'architecture',
    simple: 'Write the event in the same transaction as the data, then publish it.',
    senior:
      'The outbox avoids the dual-write problem: a relay reads committed outbox rows and publishes them, so you never lose or phantom-publish events.',
    systemDesign:
      'Pairs with idempotent consumers for exactly-once effects; the relay is at-least-once, so dedupe downstream.',
  },
  {
    key: 'saga',
    topic: 'Sagas',
    subjectId: 'architecture',
    simple: 'A multi-step workflow across services that undoes itself on failure.',
    senior:
      'Each step has a compensating action; on failure you run compensations in reverse instead of one ACID transaction you cannot have across services.',
    systemDesign:
      'Choreography (events) or orchestration (a coordinator); every step and compensation must be idempotent, and you accept temporary inconsistency.',
  },
  {
    key: 'scheduled-jobs',
    topic: 'Scheduled jobs',
    subjectId: 'architecture',
    simple: 'Run work on a schedule, like a nightly cleanup.',
    senior:
      'Cron-style triggers enqueue jobs; make them idempotent and guard against overlapping runs.',
    systemDesign:
      'In a cluster use a distributed lock or a single scheduler so a job runs once, not once per instance; monitor for missed and long-running runs.',
  },
  {
    key: 'ci-cd',
    topic: 'CI/CD',
    subjectId: 'devops',
    simple: 'Automatically build, test, and ship code on every change.',
    senior:
      'CI runs tests on each push; CD promotes one immutable artifact through environments.',
    systemDesign:
      'Gate deploys on tests, ship the same artifact to staging then prod, make rollback a button, and pair with progressive delivery to limit blast radius.',
  },
  {
    key: 'health-checks',
    topic: 'Health checks',
    subjectId: 'devops',
    simple: 'Endpoints that tell the platform if your app is alive and ready.',
    senior:
      'Liveness failure restarts the container; readiness failure pulls it from the load balancer without restarting.',
    systemDesign:
      'Keep liveness cheap and dependency-free; readiness checks dependencies so traffic only hits warmed instances, which is what makes zero-downtime deploys work.',
  },
  {
    key: 'progressive-delivery',
    topic: 'Blue-green and canary',
    subjectId: 'devops',
    simple: 'Ways to release new code with low risk.',
    senior:
      'Blue-green flips traffic between two full environments for instant rollback; canary ramps a small traffic slice while watching metrics.',
    systemDesign:
      'Both need DB backward compatibility (expand/contract) and good observability; feature flags decouple deploy from release for per-user rollout and kill switches.',
  },
  {
    key: 'cap-theorem',
    topic: 'CAP theorem',
    subjectId: 'system-design',
    simple: 'Under a network partition you cannot have both consistency and availability.',
    senior:
      'When partitioned you choose CP (reject to stay consistent) or AP (serve possibly stale data); with no partition you can have both.',
    systemDesign:
      'Pick per use case: payments lean CP, feeds and carts often AP with eventual consistency; most systems mix both per data type.',
  },
  {
    key: 'sharding',
    topic: 'Sharding',
    subjectId: 'system-design',
    simple: 'Split data across servers when one cannot hold or serve it all.',
    senior:
      'Partition by a shard key (hash or range); the key decides balance and whether cross-shard queries are needed.',
    systemDesign:
      'Pick a high-cardinality key to avoid hotspots, avoid cross-shard transactions, and plan resharding (consistent hashing limits key movement).',
  },
  {
    key: 'api-gateway',
    topic: 'API gateway',
    subjectId: 'system-design',
    simple: 'A single entry point in front of your services.',
    senior:
      'It handles routing, auth, rate limiting, and TLS termination so each service does not reimplement them.',
    systemDesign:
      'Centralizes cross-cutting concerns and a stable client contract; keep business logic out of it to avoid a new monolith, and run it highly available.',
  },
  {
    key: 'consensus-quorum',
    topic: 'Consensus and quorums',
    subjectId: 'distributed',
    simple: 'Nodes agree on a value by majority.',
    senior:
      'Quorum reads/writes (R + W > N) guarantee overlap so you read the latest write; consensus protocols like Raft elect a leader and replicate a log.',
    systemDesign:
      'Used for leader election and consistent replication; tune R and W for read- vs write-heavy, accepting higher latency for stronger consistency.',
  },
  {
    key: 'consistent-hashing',
    topic: 'Consistent hashing',
    subjectId: 'distributed',
    simple: 'A way to spread keys across nodes so adding one moves few keys.',
    senior:
      'Place nodes and keys on a hash ring and walk clockwise; adding or removing a node only remaps keys between two ring points, not all of them.',
    systemDesign:
      'Used by caches and sharded stores to scale without mass remapping; virtual nodes smooth out hotspots and uneven distribution.',
  },
  {
    key: 'big-o',
    topic: 'Big-O complexity',
    subjectId: 'algorithms',
    simple: 'Big-O describes how runtime or space grows as the input grows.',
    senior:
      'Focus on the dominant term and worst case: O(1), O(log n), O(n), O(n log n), O(n^2); a hash lookup is O(1), a nested loop O(n^2).',
    systemDesign:
      'It sets real capacity limits: an O(n^2) report that is fine at 1k rows melts at 1M, so pick algorithms and indexes whose cost grows sub-linearly with data and traffic.',
  },
  {
    key: 'dynamic-programming',
    topic: 'Dynamic programming',
    subjectId: 'algorithms',
    simple: 'DP solves a problem by reusing answers to overlapping subproblems.',
    senior:
      'Define the state and recurrence, then memoize (top-down) or fill a table (bottom-up) to avoid recomputing; it turns exponential into polynomial.',
    systemDesign:
      'The framing matters more than the puzzles: cache expensive overlapping computations, and recognize when a greedy shortcut is wrong and you need the full table.',
  },
  {
    key: 'recursion',
    topic: 'Recursion',
    subjectId: 'algorithms',
    simple: 'A function that calls itself on a smaller input until a base case.',
    senior:
      'Every recursion needs a base case and progress toward it; watch stack depth and switch to iteration or memoization when it gets deep.',
    systemDesign:
      'Deep recursion risks a stack overflow on large inputs; trees and divide-and-conquer fit naturally, but bound the depth or go iterative.',
  },
  {
    key: 'sql-joins',
    topic: 'SQL joins',
    subjectId: 'sql',
    simple: 'A join combines rows from two tables on a matching key.',
    senior:
      'INNER keeps only matches; LEFT keeps all left rows; the join key should be indexed or it becomes a slow scan.',
    systemDesign:
      'Joins are where query plans live or die: index the join columns, watch fan-out multiplying rows, and pre-aggregate or denormalize hot read paths.',
  },
  {
    key: 'sql-window-functions',
    topic: 'SQL window functions',
    subjectId: 'sql',
    simple: 'Window functions compute across related rows without collapsing them.',
    senior:
      'RANK, ROW_NUMBER, and running SUM over PARTITION BY ... ORDER BY keep every row while adding an aggregate, unlike GROUP BY which collapses them.',
    systemDesign:
      'They do top-N-per-group, running totals, and latest-per-key in one query instead of N+1 app loops; mind the sort cost on large partitions.',
  },
]
