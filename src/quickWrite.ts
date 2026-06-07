// Concept-specific "Quick Write" recall prompts. Each asks the learner to write a
// real answer (not "explain this idea"), then reveals the bullets a strong answer
// must hit plus a production/debug situation it maps to. Rendered by Codex's Quick
// Write panel (see PROGRESSION_PLAN.md Phase 2), grouped by subjectId.

export type QuickWrite = {
  subjectId: string
  prompt: string
  expected: string[]
  productionAnchor: string
}

export const quickWrites: QuickWrite[] = [
  {
    subjectId: 'internet',
    prompt:
      'Walk through what happens between typing a URL and seeing the response. Name each network layer and what it adds.',
    expected: [
      'DNS resolves the host to an IP',
      'TCP opens a reliable, ordered connection',
      'TLS encrypts the channel and verifies the server',
      'HTTP carries method, path, headers, and body',
      'a reverse proxy / load balancer may sit in front',
      'the response has a status, headers, and body',
    ],
    productionAnchor:
      'A user says the site is slow only on the first load: cold DNS + TLS handshake happen before any app code runs.',
  },
  {
    subjectId: 'api',
    prompt:
      'Design the response contract for a "create user" endpoint, including the success case and the three main failure cases.',
    expected: [
      '201 with the created resource on success',
      '400 with a per-field error map on validation failure',
      '409 on a duplicate/conflict',
      'a stable error shape with a machine-readable code',
      'never leak stack traces or internals',
      'support an idempotency key so retries are safe',
    ],
    productionAnchor:
      'A mobile client retries on a flaky network and creates duplicate users: it needed an idempotency key.',
  },
  {
    subjectId: 'security',
    prompt:
      'A request arrives with a token. List every check you run before you trust it and act on the resource.',
    expected: [
      'verify the token signature server-side',
      'pin the algorithm, never trust the token-supplied alg',
      'check expiry',
      'authorize: does this user have the permission',
      'check object ownership, not just the role',
      'default-deny when unsure',
    ],
    productionAnchor:
      'An IDOR bug: user A reads user B invoice by changing the id, because only authentication, not ownership, was checked.',
  },
  {
    subjectId: 'sql',
    prompt:
      'A list endpoint got slow as data grew. Explain how you diagnose it and the two most likely fixes.',
    expected: [
      'run EXPLAIN ANALYZE',
      'look for a Seq Scan + Filter or a Sort step',
      'add an index matching the WHERE and ORDER BY',
      'check for N+1 queries from the ORM',
      'batch with a JOIN or an IN clause',
      'verify with query counts / timing',
    ],
    productionAnchor:
      'A dashboard times out as the table grows: an unindexed filter is doing a full scan over millions of rows.',
  },
  {
    subjectId: 'performance',
    prompt:
      'Design a caching strategy for a read-heavy endpoint, including how you keep it fresh.',
    expected: [
      'cache-aside: load on miss, store with a TTL',
      'choose an eviction policy (LRU/LFU)',
      'invalidate or version the key on write',
      'layer caches: CDN -> app -> Redis -> DB',
      'guard against stampede with jitter or coalescing',
      'pick a staleness tolerance per resource',
    ],
    productionAnchor:
      'A product page hammers the DB at launch: add cache-aside with a short TTL and stampede protection on the hot key.',
  },
  {
    subjectId: 'architecture',
    prompt:
      'You must send a confirmation email on signup without slowing the request. Design it and handle failure.',
    expected: [
      'enqueue the job and return fast',
      'a worker processes it asynchronously',
      'assume at-least-once delivery, so make it idempotent',
      'retry transient failures with backoff',
      'dead-letter after N failures',
      'monitor queue depth and DLQ depth',
    ],
    productionAnchor:
      'The email provider has an outage: jobs retry with backoff and poison messages land in a DLQ instead of blocking the queue.',
  },
  {
    subjectId: 'devops',
    prompt:
      'Explain how a zero-downtime deploy works, including the role of health checks.',
    expected: [
      'build one immutable artifact, promote it',
      'roll out gradually (or blue-green/canary)',
      'readiness gates traffic to warmed instances',
      'drain old instances with graceful shutdown',
      'liveness restarts wedged processes',
      'keep the DB backward compatible + a rollback plan',
    ],
    productionAnchor:
      'A deploy briefly 502s because new pods received traffic before warming up: the readiness probe was missing.',
  },
  {
    subjectId: 'system-design',
    prompt:
      'Design a URL shortener at a high level: data model, read path, and how it scales.',
    expected: [
      'map short code -> long URL with a unique index',
      'generate codes (counter + base62, or a hash)',
      'cache hot codes',
      'return a 301/302 redirect',
      'rate-limit creation to stop abuse',
      'replicate/shard as reads grow',
    ],
    productionAnchor:
      'Reads vastly outnumber writes: a cache plus read replicas absorb redirects while the DB mostly handles creates.',
  },
  {
    subjectId: 'distributed',
    prompt:
      'Explain how a system stays correct when data is replicated across nodes.',
    expected: [
      'a primary takes writes and replicates to others',
      'quorum: R + W > N guarantees read/write overlap',
      'replicas can lag (eventual consistency)',
      'consensus (Raft/Paxos) for leader + replicated log',
      'CAP: choose CP or AP under a partition',
      'route read-after-write to the primary when needed',
    ],
    productionAnchor:
      'A user changes a setting, refreshes, and sees the old value: a stale read from a lagging replica.',
  },
  {
    subjectId: 'files-storage',
    prompt:
      'Design an image upload feature end to end: how the bytes are stored and served.',
    expected: [
      'client uploads via a presigned URL (server never proxies bytes)',
      'validate size and content type',
      'store the key + metadata in the DB, not the bytes',
      'sanitize the key to block path traversal',
      'serve reads through a CDN',
      'a lifecycle rule expires temp uploads',
    ],
    productionAnchor:
      'The app server runs out of memory buffering large uploads: switch to direct-to-storage presigned uploads.',
  },
  {
    subjectId: 'language',
    prompt:
      'Explain how you make a function robust: input handling, errors, and proving it works.',
    expected: [
      'validate and normalize inputs at the edge',
      'keep a pure core, push side effects to the boundary',
      'handle invalid input explicitly (no silent failure)',
      'use clear, typed errors',
      'cover edge cases with tests',
      'favor readable over clever',
    ],
    productionAnchor:
      'A null from an upstream API crashes a handler: the function never guarded its inputs.',
  },

  {
    subjectId: 'internet',
    prompt: 'Explain what TLS does and does not give you, and where you terminate it.',
    expected: [
      'confidentiality + integrity + server identity',
      'it does NOT authenticate the caller (separate login)',
      'a certificate vouches for the server, validated against a CA',
      'terminate at the load balancer or CDN edge',
      'rotate certificates automatically',
      'still authorize every request behind TLS',
    ],
    productionAnchor:
      'Someone argues "we use HTTPS so the endpoint is secure": transport encryption says nothing about who is calling.',
  },
  {
    subjectId: 'api',
    prompt: 'Design an idempotent "create payment" endpoint so retries never double-charge.',
    expected: [
      'client sends an Idempotency-Key',
      'store the key with the request result',
      'a repeat key returns the original response',
      'same key + different body -> 409 conflict',
      'covers client timeouts, refreshes, and proxy retries',
      'expire keys after a sensible window',
    ],
    productionAnchor:
      'A network blip makes the app retry a charge: without a key the customer is billed twice.',
  },
  {
    subjectId: 'security',
    prompt: 'Walk through storing and checking a password safely.',
    expected: [
      'never store the plaintext',
      'hash with a slow, salted KDF (bcrypt/scrypt/Argon2)',
      'tune the work factor to your hardware',
      'compare in constant time',
      'upgrade the hash on login when you raise the cost',
      'rate-limit login attempts',
    ],
    productionAnchor:
      'A DB dump leaks: fast/unsalted hashes are cracked in minutes; a slow salted KDF buys time.',
  },
  {
    subjectId: 'sql',
    prompt: 'Two requests update the same row at once. How do you prevent a lost update?',
    expected: [
      'wrap the read-modify-write in a transaction',
      'optimistic locking: a version column, update only if it matches',
      'or pessimistic: SELECT ... FOR UPDATE',
      'the late writer is rejected and retries',
      'keep transactions short to limit lock contention',
      'pick an isolation level per use case',
    ],
    productionAnchor:
      'Two admins edit the same order; one edit silently overwrites the other without a version check.',
  },
  {
    subjectId: 'performance',
    prompt: 'Your cache speeds reads but serves stale data after writes. Fix it.',
    expected: [
      'invalidate or version the key on write',
      'or accept bounded staleness with a short TTL',
      'content-hash immutable assets',
      'choose write-through vs write-behind vs TTL per need',
      'publish invalidation events for fan-out',
      'decide staleness tolerance per resource',
    ],
    productionAnchor:
      'A user updates their avatar but the old one shows for an hour: the cache key was never invalidated.',
  },
  {
    subjectId: 'architecture',
    prompt: 'A queue guarantees at-least-once delivery. How do you avoid double side effects?',
    expected: [
      'design idempotent consumers',
      'dedupe by a stable message/event id',
      'use an outbox to publish atomically with the DB write',
      'bound retries with backoff',
      'dead-letter poison messages',
      'exactly-once effects, not exactly-once delivery',
    ],
    productionAnchor:
      'A worker crashes after doing the work but before acking: the message is redelivered and runs again.',
  },
  {
    subjectId: 'devops',
    prompt: 'A deploy is failing in production. Explain how you limit damage and recover.',
    expected: [
      'roll back to the previous artifact fast',
      'canary/blue-green to limit blast radius next time',
      'health checks pull bad instances from rotation',
      'feature flags as a kill switch',
      'keep DB changes backward compatible (expand/contract)',
      'alert on SLO burn to catch it early',
    ],
    productionAnchor:
      'A bad release 500s for 5% of users; a canary + instant rollback turns an outage into a blip.',
  },
  {
    subjectId: 'system-design',
    prompt: 'Design a rate limiter for a public API across many servers.',
    expected: [
      'a shared counter/store (Redis), not per-instance memory',
      'key by user/IP/route',
      'token bucket for bursts, sliding window for smoothness',
      'return 429 with Retry-After',
      'enforce at the edge/gateway',
      'fail open or closed deliberately',
    ],
    productionAnchor:
      'Per-instance limits let a client get N times the quota by hitting N servers behind the load balancer.',
  },
  {
    subjectId: 'distributed',
    prompt: 'You must shard a growing dataset. How do you choose keys and add capacity?',
    expected: [
      'partition by a high-cardinality shard key',
      'avoid hotspots (no low-cardinality key)',
      'consistent hashing so adding a node moves few keys',
      'avoid cross-shard transactions',
      'plan resharding/rebalancing',
      'replicate each shard for availability',
    ],
    productionAnchor:
      'Sharding by country overloads one shard; a hash of user id spreads load evenly.',
  },
  {
    subjectId: 'files-storage',
    prompt: 'Design a large-file upload so your API servers do not buffer the bytes.',
    expected: [
      'issue a short-lived presigned URL',
      'client uploads directly to object storage',
      'validate size and content type',
      'use multipart upload for big files',
      'store the key + metadata in the DB',
      'serve reads via a CDN',
    ],
    productionAnchor:
      'App servers OOM buffering 1 GB uploads; presigned direct-to-storage removes them from the data path.',
  },
  {
    subjectId: 'devops',
    prompt: 'You get paged: error rate is spiking. What signals do you check, in order?',
    expected: [
      'the SLO/error-rate dashboard first',
      'recent deploys/config changes',
      'traces for the failing endpoint',
      'a correlation id from a sample error to its logs',
      'dependency health (DB, downstream)',
      'mitigate (rollback/flag) before root-causing',
    ],
    productionAnchor:
      'p99 latency tripled right after a deploy: the trace shows a new N+1 query against the DB.',
  },
]
