import type { Problem } from './course'

const coding = 'coding' as const

export const graderDrillProblems: Record<string, Problem[]> = {
  internet: [
    {
      id: 'internet-request-line',
      title: 'Parse An HTTP Request Line',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Implement parseRequestLine(line). Split a raw HTTP request line into method, path, query, and version.',
      explanation:
        'Framework routers begin with this primitive: method plus target plus protocol version. Query parsing comes after the request target is separated from the path.',
      example: "parseRequestLine('GET /users?page=2 HTTP/1.1') returns { method: 'GET', path: '/users', query: 'page=2', version: 'HTTP/1.1' }.",
      questions: [
        'Which part of the request line becomes the route path?',
        'Why should query string parsing happen after splitting the request target?',
      ],
      checklist: ['Extract method.', 'Separate path from query.', 'Preserve the HTTP version.'],
    },
    {
      id: 'internet-parse-cookies',
      title: 'Parse A Cookie Header',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Implement parseCookies(header). Convert a Cookie header into an object of cookie names to values.',
      explanation:
        'Sessions often start as one Cookie header. Before auth middleware can load a session, the backend has to parse semicolon-separated key/value pairs consistently.',
      example: "parseCookies('sid=abc; theme=dark') returns { sid: 'abc', theme: 'dark' }.",
      questions: [
        'Why are cookies sent automatically by browsers?',
        'What security attributes are not visible in the Cookie request header?',
      ],
      checklist: ['Split on semicolons.', 'Trim cookie names and values.', 'Handle empty headers.'],
    },
    {
      id: 'internet-build-response',
      title: 'Build A Raw HTTP Response',
      type: coding,
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Implement buildResponse(status, body). Return a raw HTTP/1.1 response string with status line, Content-Length, CRLF separators, and body.',
      explanation:
        'HTTP responses are structured bytes. Content-Length tells the client where the response body ends when the connection may stay open.',
      questions: [
        'Why does Content-Length count bytes rather than characters?',
        'What separates headers from the response body?',
      ],
      checklist: ['Write a valid status line.', 'Use CRLF separators.', 'Include Content-Length.'],
    },
    {
      id: 'internet-content-negotiation',
      title: 'Content Negotiation',
      type: coding,
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Implement chooseType(accept, available). Parse an Accept header and return the highest-q available media type.',
      explanation:
        'Content negotiation lets one endpoint choose a representation the client can consume. q-values express client preference; the server still decides from formats it supports.',
      questions: [
        'What does q=0.8 mean?',
        'Why should unsupported Accept types return null or 406?',
      ],
      checklist: ['Parse comma-separated media types.', 'Respect q-values.', 'Return null when none match.'],
    },
    {
      id: 'http-parse-auth',
      title: 'Parse An Authorization Header',
      type: coding,
      difficulty: 'Warmup',
      minutes: 18,
      prompt:
        'Implement parseAuth(header). Split an Authorization header into scheme and token. Empty input should return null.',
      explanation:
        'Authentication middleware starts by parsing the wire format. This drill keeps parsing separate from trusting: extracting a Bearer token is not the same thing as verifying it.',
      questions: [
        'Why should parsing and verification be separate steps?',
        'What should middleware do when the header is missing?',
      ],
      checklist: ['Handle empty headers.', 'Preserve the auth scheme.', 'Return the remaining token string.'],
    },
  ],
  api: [
    {
      id: 'api-offset-paginate',
      title: 'Offset Pagination',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Implement offsetPaginate(items, page, perPage). Return page items and metadata.',
      explanation:
        'Offset pagination is easy to understand and fine for small stable lists. It becomes expensive and inconsistent when lists are large or changing while users paginate.',
      questions: [
        'Why is page usually 1-based in public APIs?',
        'What breaks when rows are inserted between offset-paginated requests?',
      ],
      checklist: ['Slice the correct page.', 'Return total and totalPages.', 'Preserve page metadata.'],
    },
    {
      id: 'api-validate',
      title: 'Validate A Request Body',
      type: coding,
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Implement validate(rules, obj). Return field-level required/type errors for a request body.',
      explanation:
        'Validation turns untrusted JSON into a known shape. Good validation fails early, returns client-actionable errors, and prevents deeper code from guessing about types.',
      questions: [
        'Why should validation happen before database writes?',
        'What is the difference between validation and authorization?',
      ],
      checklist: ['Detect missing required fields.', 'Detect wrong primitive types.', 'Return stable field errors.'],
    },
    {
      id: 'api-etag',
      title: 'Generate A Weak ETag',
      type: coding,
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Implement etag(body). Return a stable hex hash for a response body.',
      explanation:
        'ETags let clients revalidate cached resources cheaply. The exact hash algorithm matters less here than stability: same body, same tag; changed body, changed tag.',
      questions: [
        'How does If-None-Match use an ETag?',
        'Why are content-hashed assets easy to cache aggressively?',
      ],
      checklist: ['Return a string.', 'Stay stable for identical input.', 'Change when body changes.'],
    },
    {
      id: 'json-stable-stringify',
      title: 'Stable JSON Stringify',
      type: coding,
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Implement stableStringify(v). Return deterministic JSON with object keys sorted recursively.',
      explanation:
        'Stable JSON matters for signatures, cache keys, ETags, tests, and change detection. Same logical object should produce the same bytes even if key insertion order differs.',
      questions: [
        'Why do signatures need deterministic serialization?',
        'Why should nested object keys be sorted too?',
      ],
      checklist: ['Sort object keys.', 'Handle nested objects.', 'Preserve arrays in order.'],
    },
    {
      id: 'json-flatten',
      title: 'Flatten Nested Object',
      type: coding,
      difficulty: 'Core',
      minutes: 25,
      prompt:
        "Implement flatten(obj). Convert nested objects into dot-path keys, like { a: { b: 1 } } into { 'a.b': 1 }.",
      explanation:
        'Flattening shows up in logs, metrics labels, config inspection, form errors, and search indexing. The backend lesson is to transform shape deliberately instead of sprinkling ad hoc property access everywhere.',
      questions: [
        'Where would flattened paths help an API client?',
        'Why should arrays usually keep their original order?',
      ],
      checklist: ['Walk nested objects recursively.', 'Join paths with dots.', 'Keep leaf values unchanged.'],
    },
  ],
  performance: [
    {
      id: 'caching-memoize',
      title: 'Memoize A Function',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Implement memoize(fn). Cache function results by argument list.',
      explanation:
        'Memoization is the smallest version of caching. It teaches key design, cache hits, and invalidation risk before you reach for Redis or a CDN.',
      questions: ['What makes a good cache key?', 'Why is memoizing impure functions dangerous?'],
      checklist: ['Cache by arguments.', 'Avoid recomputing hits.', 'Return distinct results for distinct keys.'],
    },
    {
      id: 'caching-lru',
      title: 'LRU Cache',
      type: coding,
      difficulty: 'Hard',
      minutes: 45,
      prompt:
        'Implement an LRU cache with get and put. Evict the least recently used item when capacity is exceeded.',
      explanation:
        'Real caches have finite memory. LRU approximates usefulness by keeping recently accessed items and evicting stale ones.',
      questions: ['Why does get update recency?', 'What happens if capacity is too small?'],
      checklist: ['Track recency.', 'Evict least recently used.', 'Update existing keys safely.'],
    },
    {
      id: 'perf-chunk',
      title: 'Chunk Work',
      type: coding,
      difficulty: 'Warmup',
      minutes: 15,
      prompt:
        'Implement chunk(arr, size). Split an array into smaller batches.',
      explanation:
        'Batching controls memory, request size, and downstream pressure. It is the simple primitive behind paged jobs and bulk processing.',
      questions: ['Why batch a large migration?', 'What can go wrong with huge batches?'],
      checklist: ['Return sub-arrays.', 'Keep the final remainder.', 'Handle empty arrays.'],
    },
    {
      id: 'perf-percentile',
      title: 'Latency Percentile',
      type: coding,
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Implement percentile(values, p) using nearest-rank percentile.',
      explanation:
        'Backend performance is about distributions. p95 and p99 show tail pain that averages hide.',
      questions: ['Why does p99 matter for APIs?', 'Why should you avoid mutating the input array?'],
      checklist: ['Sort a copy.', 'Handle empty input.', 'Return nearest-rank values.'],
    },
    {
      id: 'perf-topk',
      title: 'Top-K Frequent',
      type: coding,
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Implement topKFrequent(items, k). Return the k most frequent values, breaking ties by smaller value first.',
      explanation:
        'Top-K shows up in logs, analytics, rate-limit offenders, search terms, and observability dashboards.',
      questions: ['Why is counting first better than repeated scanning?', 'How should ties be deterministic?'],
      checklist: ['Count frequencies.', 'Sort by count descending.', 'Break ties deterministically.'],
    },
    {
      id: 'cache-evict-expired',
      title: 'Evict Expired Entries',
      type: coding,
      difficulty: 'Warmup',
      minutes: 18,
      prompt:
        'Implement evictExpired(entries, now). Given cache entries with expiresAt timestamps, return keys that are still valid.',
      explanation:
        'TTL eviction is the smallest version of cache lifecycle management. Backends need explicit expiration so stale data does not live forever.',
      questions: ['Why should cache entries expire?', 'What can go wrong if clocks disagree?'],
      checklist: ['Compare expiresAt to now.', 'Return only valid keys.', 'Preserve input order.'],
    },
    {
      id: 'ratelimit-leaky-bucket',
      title: 'Leaky Bucket Limiter',
      type: coding,
      difficulty: 'Hard',
      minutes: 35,
      prompt:
        'Implement leakyBucket(times, capacity, leakPerSec). Return whether each timestamped request is allowed.',
      explanation:
        'Leaky bucket smooths request flow by draining over time. It teaches the production idea that rate limiters are state machines, not just counters.',
      questions: [
        'How does leaky bucket differ from token bucket?',
        'Why do distributed rate limiters need shared state?',
      ],
      checklist: ['Track water level.', 'Drain based on elapsed time.', 'Reject requests above capacity.'],
    },
    {
      id: 'parse-duration',
      title: 'Parse A Duration',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        "Implement parseDuration(s). Parse strings such as '90s', '2m', and '1h30m' into seconds.",
      explanation:
        'Backends constantly parse human-readable durations for TTLs, job delays, lock leases, and timeouts. Bad parsing turns config into an outage.',
      questions: ['Where do backend systems use durations?', 'Why should invalid duration config fail fast?'],
      checklist: ['Support h, m, and s units.', 'Sum multiple units.', 'Return seconds.'],
    },
  ],
  security: [
    {
      id: 'security-constant-time',
      title: 'Constant-Time Compare',
      type: coding,
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Implement constantTimeEqual(a, b). Compare same-length strings without early exit.',
      explanation:
        'Secret comparison should avoid timing leaks. This drill teaches the idea, though production code should use vetted crypto library functions.',
      questions: ['Why is early exit observable?', 'Why should production code use platform crypto helpers?'],
      checklist: ['Compare every character for same-length inputs.', 'Reject different lengths.', 'Do not return early on mismatch.'],
    },
    {
      id: 'security-escape-html',
      title: 'Escape HTML',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Implement escapeHtml(s). Escape &, <, >, double quote, and single quote.',
      explanation:
        'XSS often starts when untrusted text becomes HTML. Escaping converts dangerous characters into inert entities.',
      questions: ['Why must ampersand be escaped first?', 'Where should templating frameworks handle this automatically?'],
      checklist: ['Escape five dangerous characters.', 'Do not double-skip ampersands.', 'Return a string.'],
    },
    {
      id: 'security-strong-password',
      title: 'Password Strength',
      type: coding,
      difficulty: 'Warmup',
      minutes: 15,
      prompt:
        'Implement isStrong(pw). Require length >= 8 plus lowercase, uppercase, and digit.',
      explanation:
        'Password policy is only one layer. You still need breached-password checks, rate limits, MFA, and safe hashing.',
      questions: ['Why is composition policy not enough by itself?', 'Where does password hashing fit?'],
      checklist: ['Check length.', 'Require lower and upper case.', 'Require a digit.'],
    },
    {
      id: 'security-token-bucket',
      title: 'Token Bucket Limiter',
      type: coding,
      difficulty: 'Hard',
      minutes: 45,
      prompt:
        'Implement tokenBucket(times, capacity, refillPerSec). Return whether each timestamped request is allowed.',
      explanation:
        'Token bucket rate limiting allows bursts up to capacity while smoothing long-term request rate.',
      questions: ['How does token bucket differ from fixed window?', 'Why are distributed limiters harder?'],
      checklist: ['Refill based on elapsed time.', 'Cap tokens at capacity.', 'Consume one token per allowed request.'],
    },
    {
      id: 'security-jwt-payload',
      title: 'Decode A JWT Payload',
      type: coding,
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Implement jwtPayload(token). Decode the middle JWT segment as JSON without verifying it.',
      explanation:
        'Decoding is not verification. A backend must validate signature, issuer, audience, expiration, and algorithm before trusting JWT claims.',
      questions: ['Why is decoding a JWT not authentication?', 'Which JWT fields must be validated?'],
      checklist: ['Split token segments.', 'Base64url-decode the payload.', 'Parse JSON claims.'],
    },
    {
      id: 'auth-has-scope',
      title: 'Scope Check',
      type: coding,
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Implement hasScope(granted, required). Return true only when every required scope is present.',
      explanation:
        'Scopes are a compact authorization primitive. The important backend habit is fail-closed: missing one required permission should deny access.',
      questions: [
        'Why must every required scope be present?',
        'How are scopes different from resource ownership checks?',
      ],
      checklist: ['Require all scopes.', 'Allow empty requirements.', 'Fail closed when a scope is missing.'],
    },
  ],
  architecture: [
    {
      id: 'architecture-backoff',
      title: 'Exponential Backoff',
      type: coding,
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Implement backoff(attempt, base, cap). Return an exponential retry delay capped at max.',
      explanation:
        'Backoff gives struggling dependencies room to recover. Without it, retries can amplify an outage.',
      questions: ['Why add jitter in production?', 'Why cap retries?'],
      checklist: ['Double delay per attempt.', 'Apply the cap.', 'Use zero-based attempts.'],
    },
    {
      id: 'reliability-retry-schedule',
      title: 'Retry Schedule',
      type: coding,
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Implement retrySchedule(maxRetries, base, cap). Return the backoff delay for each retry.',
      explanation:
        'Retry schedules define how much pressure your service applies to a dependency during failure. Capping prevents retries from growing without bound.',
      questions: [
        'Why do retries amplify outages without backoff?',
        'What does the cap protect?',
      ],
      checklist: ['Return one delay per retry.', 'Double delays.', 'Cap at the maximum.'],
    },
    {
      id: 'architecture-idempotency',
      title: 'Idempotent Dedupe',
      type: coding,
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Implement dedupeByKey(items, keyFn). Keep the first item for each key.',
      explanation:
        'Idempotency often reduces to recognizing a repeated logical operation and returning the original outcome instead of doing the side effect again.',
      questions: ['Why keep the first request for an idempotency key?', 'What should happen if the duplicate payload differs?'],
      checklist: ['Track seen keys.', 'Preserve order.', 'Drop later duplicates.'],
    },
    {
      id: 'architecture-circuit-breaker',
      title: 'Circuit Breaker States',
      type: coding,
      difficulty: 'Hard',
      minutes: 35,
      prompt:
        'Implement circuitStates(events, threshold). Open after consecutive failures and close after success.',
      explanation:
        'Circuit breakers stop a failing dependency from consuming all resources. The state machine is small, but the operational effect is huge.',
      questions: ['What is the difference between open and closed?', 'Why do real breakers need half-open state?'],
      checklist: ['Count consecutive failures.', 'Open at threshold.', 'Close on success.'],
    },
    {
      id: 'queue-dlq',
      title: 'Queue With Retries And DLQ',
      type: coding,
      difficulty: 'Hard',
      minutes: 40,
      prompt:
        'Implement runQueue(messages, failKeys, maxRetries). Process successes and dead-letter poison messages.',
      explanation:
        'A dead-letter queue keeps poison messages from blocking the whole system while preserving them for inspection and replay.',
      questions: ['Why not retry forever?', 'What metadata should go with a DLQ message?'],
      checklist: ['Process successful messages once.', 'Retry failures.', 'Dead-letter exhausted messages.'],
    },
    {
      id: 'realtime-sse-format',
      title: 'Format A Server-Sent Event',
      type: coding,
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Implement formatSSE(msg). Format event, data, and id fields as a Server-Sent Event string.',
      explanation:
        'SSE is a simple HTTP-friendly realtime primitive for server-to-client streams. The wire format is line based and ends each message with a blank line.',
      questions: ['When is SSE simpler than WebSockets?', 'Why must each event end with a blank line?'],
      checklist: ['Include data.', 'Include optional event and id.', 'End with a blank line.'],
    },
    {
      id: 'lb-expand-weights',
      title: 'Expand Weighted Pool',
      type: coding,
      difficulty: 'Warmup',
      minutes: 18,
      prompt:
        'Implement expandWeights(items). Expand [{ id, weight }] into a flat pool with each id repeated by weight.',
      explanation:
        'Weighted pools are the simplest mental model behind weighted load balancing, canary routing, and traffic splitting.',
      questions: ['Why weight a server or version differently?', 'What breaks if weights are misconfigured?'],
      checklist: ['Repeat ids by weight.', 'Preserve item order.', 'Return a flat list.'],
    },
    {
      id: 'sla-error-budget',
      title: 'Error Budget',
      type: coding,
      difficulty: 'Core',
      minutes: 20,
      prompt:
        'Implement errorBudgetMs(slaPercent, periodMs). Return allowed downtime in milliseconds for the period.',
      explanation:
        'Error budgets turn reliability into math. Instead of saying “be reliable,” you calculate how much failure a service can afford before engineering priorities change.',
      questions: [
        'How does an error budget connect product risk to engineering work?',
        'Why is 99.9% not the same as 100%?',
      ],
      checklist: ['Compute unavailable fraction.', 'Multiply by period.', 'Round to milliseconds.'],
    },
  ],
  sql: [
    {
      id: 'db-group-by',
      title: 'Group By',
      type: coding,
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Implement groupBy(items, keyFn). Return an object mapping keys to arrays of matching items.',
      explanation:
        'GROUP BY is a database primitive, but the mental model is ordinary bucketing: compute a key and append each row to that bucket.',
      questions: ['How does GROUP BY relate to aggregation?', 'Why does key choice matter?'],
      checklist: ['Compute a key per item.', 'Create buckets lazily.', 'Preserve items within each bucket.'],
    },
    {
      id: 'db-hash-join',
      title: 'Hash Join',
      type: coding,
      difficulty: 'Hard',
      minutes: 35,
      prompt:
        'Implement hashJoin(left, right, key). Return merged rows where both sides share the same key value.',
      explanation:
        'Hash joins avoid comparing every row to every other row by indexing one side, then probing it with the other side.',
      questions: ['Which side would you hash if one table is much smaller?', 'Why does an index make joins cheaper?'],
      checklist: ['Index the right side.', 'Return only matches.', 'Merge matching row objects.'],
    },
  ],
}
