// The "follow the request" spine: the path one request takes through a backend,
// each hop linked to the subject that teaches it and one failure mode to know.
// Rendered by the lifecycle view (Codex). See PROGRESSION_PLAN.md (Layer B).

export type LifecycleHop = {
  id: string
  label: string
  blurb: string
  failureMode: string
  subjectId: string
}

export const requestLifecycle: LifecycleHop[] = [
  {
    id: 'client',
    label: 'Client sends the request',
    blurb:
      'The browser or app resolves the host via DNS, opens a TCP connection, negotiates TLS, then sends an HTTP request (method, path, headers, body).',
    failureMode: 'DNS or TLS errors, wrong base URL, missing auth header.',
    subjectId: 'internet',
  },
  {
    id: 'edge',
    label: 'Edge: load balancer / reverse proxy',
    blurb:
      'A load balancer terminates TLS and routes to a healthy app instance; a reverse proxy may add caching, compression, and timeouts.',
    failureMode: 'All instances unhealthy, proxy timeout shorter than the app, sticky-session imbalance.',
    subjectId: 'system-design',
  },
  {
    id: 'route',
    label: 'Routing: the API matches the endpoint',
    blurb:
      'The framework matches the method and path to a handler and parses path and query params.',
    failureMode: '404 on a typo, 405 on the wrong method, ambiguous route order.',
    subjectId: 'api',
  },
  {
    id: 'auth',
    label: 'Auth middleware validates the caller',
    blurb:
      'Authentication confirms identity (session or token); authorization checks the caller may act on this resource.',
    failureMode: '401 vs 403 confusion, trusting the token alg, missing object-ownership check.',
    subjectId: 'security',
  },
  {
    id: 'validation',
    label: 'Validation checks the payload',
    blurb:
      'Untrusted input is validated against a schema at the boundary and rejected early with a structured error.',
    failureMode: 'Unvalidated input reaching services, 500s that should be 400s, leaking internals.',
    subjectId: 'api',
  },
  {
    id: 'service',
    label: 'Service layer runs business logic',
    blurb:
      'Thin handlers call a service layer that holds the domain rules and invariants, keeping logic out of the controller.',
    failureMode: 'Fat controllers, logic duplicated across endpoints, hidden side effects.',
    subjectId: 'architecture',
  },
  {
    id: 'database',
    label: 'Database transaction writes data',
    blurb:
      'Reads and writes run against indexed tables inside a transaction so related changes commit atomically.',
    failureMode: 'N+1 queries, missing index, long transaction holding locks, lost update.',
    subjectId: 'sql',
  },
  {
    id: 'queue',
    label: 'Queue schedules async work',
    blurb:
      'Slow or external work (email, thumbnails, webhooks) is enqueued so the request returns fast; a worker processes it later.',
    failureMode: 'Duplicate processing, no dead-letter queue, unbounded retries.',
    subjectId: 'architecture',
  },
  {
    id: 'observability',
    label: 'Logs and traces capture the request id',
    blurb:
      'Structured logs, metrics, and a propagated trace/correlation id make this request debuggable across services.',
    failureMode: 'No correlation id, unstructured logs, alerting on raw counts instead of SLOs.',
    subjectId: 'devops',
  },
  {
    id: 'response',
    label: 'Response returns to the client',
    blurb:
      'The handler returns a status code, headers, and a body (often JSON) in a consistent shape, with cache headers where useful.',
    failureMode: 'Wrong status code, inconsistent error shape, leaking stack traces.',
    subjectId: 'api',
  },
  {
    id: 'retry',
    label: 'Failure: retry and idempotency',
    blurb:
      'On a network failure the client retries with backoff; an idempotency key makes the retry safe so no duplicate effect occurs.',
    failureMode: 'Double charges on retry, retry storms without jitter, no circuit breaker.',
    subjectId: 'api',
  },
]
