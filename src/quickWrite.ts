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
]
