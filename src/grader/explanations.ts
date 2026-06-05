// "Why it works" explanations, keyed by problemId. Shown by the Check-solutions
// UI after a learner checks (especially on a wrong attempt), alongside the
// reference reveal. Kept separate from specs.backend.ts so explanations can grow
// without churning the large spec file. index.ts merges these onto each spec's
// `explanation` field.

export const explanations: Record<string, string> = {
  'internet-request-line':
    'An HTTP request line is just three space-separated tokens: method, target, version. The target carries the path and an optional ?query. Frameworks parse this for you, but knowing the raw shape is what lets you debug proxies and raw sockets.',
  'internet-build-response':
    'A raw response is a status line, headers (CRLF-separated), a blank line, then the body. Content-Length must be the byte length (not character count) so the client knows when the body ends. Get the framing wrong and clients hang or truncate.',
  'internet-content-negotiation':
    'Accept lists media types with optional q-weights (default 1). You sort by q descending and pick the first type you can serve. This is how one endpoint serves JSON or HTML based on what the client asked for.',
  'api-pagination':
    'Cursor pagination returns an opaque pointer to "where you left off" instead of an offset. It stays correct when rows are inserted or deleted between pages, which is exactly where offset pagination drifts and skips or repeats rows.',
  'api-offset-paginate':
    'Offset pagination is page*size arithmetic: simple and jump-to-any-page, but it re-scans skipped rows (slow deep in the list) and drifts under concurrent writes. Fine for small, stable datasets.',
  'api-validate':
    'Validate at the boundary and return a per-field error map so clients can show inline errors. Rejecting bad input early with a structured shape beats a 500 deep in your logic.',
  'api-etag':
    'An ETag is a content fingerprint. A stable hash means an unchanged body yields the same tag, so the client can revalidate with If-None-Match and get a cheap 304 instead of re-downloading.',
  'security-rate-limit':
    'A fixed window counts requests per clock interval. It is simple but allows a double burst at the boundary (full quota at 11:59:59 and again at 12:00:00). That boundary effect is why token/sliding windows exist.',
  'security-token-bucket':
    'Tokens refill at a steady rate up to a capacity; each request spends one. This bounds the long-run rate while still allowing short bursts up to capacity, which is why it is the most common limiter.',
  'security-jwt-payload':
    'A JWT is three base64url segments. The middle one is the payload, readable by anyone (JWTs are signed, not encrypted), so never put secrets in claims. Decoding is not verifying: you still must check the signature server-side.',
  'security-constant-time':
    'Comparing secrets byte-by-byte with early exit leaks how many leading bytes matched via timing. XOR-accumulating every byte and checking once at the end takes the same time regardless, defeating timing attacks.',
  'security-escape-html':
    'XSS happens when untrusted text is rendered as HTML and executes. Escaping the five characters & < > " \' turns markup into inert text. Escape on output, and escape & first so you do not double-escape the others.',
  'security-safe-join':
    'Path traversal uses ../ to escape a base directory. Normalizing the joined path and confirming it still starts with the base catches the escape before you read or write the wrong file.',
  'caching-lru':
    'LRU evicts the entry unused for the longest time. A Map preserves insertion order, so deleting and re-inserting on access keeps most-recent at the end and lets you evict the first (oldest) key in O(1).',
  'caching-memoize':
    'Memoization caches results keyed by arguments so a pure function runs once per distinct input. The win is skipping repeated expensive work; the catch is the cache must be invalidated if inputs map to changing results.',
  'architecture-backoff':
    'Exponential backoff spaces retries out (base * 2^attempt) so a struggling dependency gets breathing room instead of a retry storm. The cap stops delays from growing unbounded.',
  'reliability-full-jitter':
    'If every client backs off by the same amount they retry in synchronized waves. Full jitter randomizes each delay within the capped window so retries spread out, smoothing the load on a recovering service.',
  'architecture-circuit-breaker':
    'After enough consecutive failures the breaker opens and fails fast, so one sick dependency does not tie up all your threads and cascade. A success closes it again. It trades a few rejected calls for system survival.',
  'architecture-idempotency':
    'At-least-once delivery means duplicates are guaranteed. Deduping by a stable key (keeping the first) makes reprocessing the same logical request harmless, which is how you get exactly-once effects on an unreliable network.',
  'queue-dlq':
    'A message that always fails would block the queue forever if retried endlessly. After bounded retries you move it to a dead-letter queue with context, so good work keeps flowing and you can inspect or replay the poison message.',
  'arch-event-sourcing':
    'Instead of storing current state, store the events that produced it; state is a fold over them. This gives a perfect audit log and time travel, at the cost of replay (usually mitigated with snapshots).',
  'arch-saga':
    'You cannot wrap multiple services in one ACID transaction, so a saga runs steps in sequence and, on failure, runs compensating actions in reverse to undo completed steps. Every step and compensation must be idempotent.',
  'tpc-decision':
    'Two-phase commit only commits if every participant votes yes; any no aborts the whole thing. It gives atomicity across nodes but holds locks and blocks on slow/failed participants, which is why sagas are preferred at scale.',
  'db-hash-join':
    'Building a hash map of one side, then probing it while scanning the other, joins in roughly linear time instead of the nested-loop quadratic cost. This is how databases join large unsorted inputs.',
  'db-group-by':
    'Grouping buckets rows by a computed key in one pass. It is the building block under SQL GROUP BY and most aggregation: collect first, then reduce each bucket.',
  'db-optimistic-lock':
    'Optimistic locking stores a version and only updates if it still matches what you read. No locks are held; a concurrent change makes the version mismatch so the late writer is rejected and can retry, avoiding lost updates.',
  'db-keyset-pagination':
    'Keyset pages by "id greater than the last one I saw" instead of an offset. It uses the index directly, so page N is as fast as page 1 and it does not drift under inserts.',
  'perf-percentile':
    'Averages hide the tail; percentiles do not. p95/p99 tell you what your slowest real users experience, which is what SLOs and capacity decisions are about.',
  'perf-topk':
    'Counting then sorting by frequency surfaces the heavy hitters (hot keys, top endpoints). Tie-breaking deterministically keeps the output stable, which matters for tests and dashboards.',
  'scale-sliding-window':
    'A sliding window keeps the timestamps of recent requests and evicts ones older than the window, so it has no boundary burst like a fixed window. The cost is storing per-request timestamps.',
  'ratelimit-leaky-bucket':
    'The leaky bucket fills on each request and drains at a constant rate; it rejects when full. It emphasizes a smooth output rate, in contrast to token bucket which permits bursts.',
  'dist-consistent-hash':
    'Naive hash-mod remaps almost every key when you add a node. Placing nodes and keys on a hash ring and walking clockwise means adding or removing a node only moves the keys between two ring points.',
  'dist-quorum':
    'With R read replicas and W write replicas out of N, requiring R + W > N guarantees a read and a write overlap on at least one replica, so reads see the latest write. It is the knob behind tunable consistency.',
  'dist-vector-clock':
    'Wall clocks across machines cannot order events reliably. A per-node counter map can: if one vector dominates another the events are ordered; if each leads on some node they are truly concurrent (a real conflict to resolve).',
  'protocol-varint':
    'Varints encode small numbers in fewer bytes by using 7 bits per byte plus a continuation bit. It is how protobuf/gRPC keep field tags and lengths compact on the wire.',
  'http-decode-chunked':
    'Chunked transfer sends a hex size, CRLF, that many bytes, CRLF, repeating until a zero-size chunk. It lets a server stream a body of unknown total length without a Content-Length header.',
  'data-luhn':
    'The Luhn checksum doubles every second digit (subtracting 9 if over 9) and sums; a valid number is divisible by 10. It catches most single-digit typos and transpositions in card and account numbers.',
  'json-deep-equal':
    'Reference equality fails for structurally identical objects, so you recurse: same primitive, or same keys with deeply-equal values. This is what test assertions and change detection rely on.',
  'json-stable-stringify':
    'Sorting keys at every level makes serialization deterministic, so the same object always produces the same string. That is what makes hashing, caching by value, and signing payloads reliable.',
  'net-cidr-contains':
    'A CIDR is a network address plus a prefix length. Masking both the candidate and network to the prefix and comparing tells you membership. This is the core check behind SSRF allow/deny lists and firewall rules.',
  'net-is-private-ip':
    'Blocking RFC1918 ranges (10/8, 172.16-31, 192.168) plus loopback is the first line of SSRF defense: it stops a user-supplied URL from reaching internal services or the cloud metadata endpoint.',
}
