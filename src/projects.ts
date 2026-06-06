// Concept-attached project prompts. Each bundles concepts into a buildable
// service; steps link to a gradable drill (problemId) where one fits, so a
// project doubles as a guided path through existing drills. Rendered by the
// Projects view (Codex). See PROGRESSION_PLAN.md (Layer C).

export type ProjectStep = { text: string; drillId?: string }

export type Project = {
  id: string
  title: string
  pitch: string
  concepts: string[]
  subjectIds: string[]
  steps: ProjectStep[]
  stretch: string[]
}

export const projects: Project[] = [
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    pitch: 'Turn long URLs into short codes that redirect, fast and abuse-resistant.',
    concepts: ['routing', 'short-code generation', 'DB indexes', 'caching', 'redirects', 'rate limiting'],
    subjectIds: ['api', 'sql', 'performance', 'security'],
    steps: [
      { text: 'Match POST /shorten and GET /:code to handlers.', drillId: 'apidrill-route-match' },
      { text: 'Generate a unique short code and store it with a unique index.', drillId: 'sqldrill-distinct' },
      { text: 'Cache code -> URL lookups with a TTL so hot links skip the DB.', drillId: 'cache-ttl' },
      { text: 'Return a 301/302 redirect for a hit and 404 for a miss.', drillId: 'apidrill-status-for-error' },
      { text: 'Rate-limit creation per client to stop abuse.', drillId: 'security-rate-limit' },
    ],
    stretch: ['Custom aliases with collision handling', 'Click analytics via an async event', 'Expiring links'],
  },
  {
    id: 'webhook-receiver',
    title: 'Webhook Receiver',
    pitch: 'Accept signed webhooks from a provider and process them exactly once.',
    concepts: ['HMAC signatures', 'replay protection', 'idempotency', 'retries', 'fast ack'],
    subjectIds: ['api', 'security', 'architecture'],
    steps: [
      { text: 'Verify the HMAC over the raw body and reject stale timestamps.', drillId: 'security-constant-time' },
      { text: 'Return 2xx fast, then process asynchronously.', drillId: 'backpressure-bounded-queue' },
      { text: 'Dedupe by event id so redelivery is harmless.', drillId: 'reliability-dedupe-window' },
      { text: 'Retry downstream calls with backoff.', drillId: 'reliability-retry-until' },
      { text: 'Return a consistent error envelope on bad input.', drillId: 'apidrill-error-envelope' },
    ],
    stretch: ['Per-provider signing schemes', 'Dead-letter after N failures', 'Replay tool for failed events'],
  },
  {
    id: 'email-queue',
    title: 'Email Queue Service',
    pitch: 'Send email reliably through a queue with retries and a dead-letter path.',
    concepts: ['message queues', 'background jobs', 'retries', 'exponential backoff', 'dead-letter queues', 'idempotency'],
    subjectIds: ['architecture'],
    steps: [
      { text: 'Enqueue a send request and return immediately.', drillId: 'backpressure-bounded-queue' },
      { text: 'Worker pulls jobs and assigns them across consumers.', drillId: 'msg-round-robin' },
      { text: 'Retry transient failures with capped attempts.', drillId: 'reliability-retry-until' },
      { text: 'Move poison messages to a dead-letter queue.', drillId: 'queue-dlq' },
      { text: 'Make the send idempotent so a retry never double-sends.', drillId: 'architecture-idempotency' },
    ],
    stretch: ['Scheduled/delayed sends', 'Per-tenant rate limits', 'Bounce/complaint handling via webhooks'],
  },
  {
    id: 'expense-tracker',
    title: 'Expense Tracker API',
    pitch: 'A multi-user CRUD API with ownership, filtering, sorting, and pagination.',
    concepts: ['auth', 'authorization', 'relational modeling', 'filtering', 'sorting', 'pagination'],
    subjectIds: ['api', 'security', 'sql'],
    steps: [
      { text: 'Authorize each request and scope rows to the owner.', drillId: 'apidrill-authorize' },
      { text: 'Filter expenses with a WHERE-style predicate.', drillId: 'sqldrill-select-where' },
      { text: 'Parse and apply a sort param.', drillId: 'apidrill-parse-sort' },
      { text: 'Sort the result set.', drillId: 'sqldrill-order-by' },
      { text: 'Return a paginated list envelope with meta.', drillId: 'apidrill-list-envelope' },
    ],
    stretch: ['Monthly rollups (GROUP BY)', 'CSV export', 'Soft delete with audit'],
  },
  {
    id: 'loan-application',
    title: 'Mini Loan Application API',
    pitch: 'A submission workflow where retries are safe and every change is audited.',
    concepts: ['transactions', 'status workflow', 'idempotency', 'optimistic locking', 'audit logs'],
    subjectIds: ['sql', 'api', 'security'],
    steps: [
      { text: 'Validate the application payload at the boundary.', drillId: 'apidrill-validate-body' },
      { text: 'Make submission idempotent so a retry returns the original result.', drillId: 'architecture-idempotency' },
      { text: 'Advance status transitions inside a transaction.', drillId: 'sqldrill-update-where' },
      { text: 'Guard concurrent edits with an optimistic lock.', drillId: 'db-optimistic-lock' },
      { text: 'Map domain errors to status codes consistently.', drillId: 'apidrill-status-for-error' },
    ],
    stretch: ['Append-only audit log', 'State machine validation', 'Reviewer approval roles (RBAC)'],
  },
  {
    id: 'caching-proxy',
    title: 'Caching Proxy',
    pitch: 'A read-through proxy that caches upstream responses and respects HTTP caching.',
    concepts: ['HTTP caching', 'cache-aside', 'TTL', 'eviction', 'conditional requests', 'invalidation'],
    subjectIds: ['performance', 'api'],
    steps: [
      { text: 'Read through the cache, loading from upstream on a miss.', drillId: 'cache-aside' },
      { text: 'Honor Cache-Control / max-age from the upstream.', drillId: 'http-parse-cache-control' },
      { text: 'Revalidate with ETag and return 304 when unchanged.', drillId: 'http-conditional-get' },
      { text: 'Evict under memory pressure (LFU).', drillId: 'cache-lfu' },
      { text: 'Expire entries with a TTL.', drillId: 'cache-ttl' },
    ],
    stretch: ['Stale-while-revalidate', 'Per-route cache rules', 'Cache stampede protection'],
  },
]
