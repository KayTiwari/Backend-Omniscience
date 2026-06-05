// Long-form tutorials, ordered so concepts build on each other. Bodies are
// Markdown using indented (4-space) code blocks and bold/quoted emphasis so the
// content stays inside backtick template literals without escaping. Codex can
// render `tutorials` alongside the lessons in each subject (match on subjectId).

export type Tutorial = {
  id: string
  subjectId: string
  title: string
  minutes: number
  body: string
}

export const tutorials: Tutorial[] = [
  {
    id: 'tut-request-lifecycle',
    subjectId: 'internet',
    title: 'How an HTTP Request Actually Travels',
    minutes: 12,
    body: `When you call an API, a lot happens between "send" and "response". Knowing
each hop is what lets you debug latency and failures instead of guessing.

**1. DNS resolution.** The hostname (api.example.com) is turned into an IP
address. Your resolver checks caches first; a cold lookup walks the DNS
hierarchy. DNS resolves names to addresses. It does **not** know about paths,
ports, or whether the server is healthy.

**2. TCP connection.** A three-way handshake (SYN, SYN-ACK, ACK) sets up a
reliable byte stream to the IP on a port (443 for HTTPS). This is pure
plumbing: no application data yet.

**3. TLS handshake.** Over that TCP stream, client and server negotiate keys and
the server proves its identity with a certificate. After this you have
confidentiality and integrity. TLS does **not** authenticate the caller; that is
your application's job on every request.

**4. The HTTP request.** Now you send structured text:

    GET /users/42 HTTP/1.1
    Host: api.example.com
    Authorization: Bearer <token>
    Accept: application/json

A blank line separates headers from the (here empty) body.

**5. The edge.** A load balancer or reverse proxy (Nginx, an ALB) terminates the
connection, maybe terminates TLS, and forwards to one of many app instances.
This is where timeouts, retries, and health checks live.

**6. The app + database.** Your handler runs, likely queries a database, and
builds a response. Most "random" latency lives here: a slow query, a lock, a
connection-pool wait.

**7. The response travels back** the same path. The connection is often kept
alive for reuse.

**Why it matters:** when something is slow or broken, name the hop. "Works in
curl but not the browser" smells like CORS or TLS. "Random 30s hangs with DB CPU
at 95%" smells like a query/lock problem, not the network. The drill
*Parse An HTTP Request Line* makes step 4 concrete.`,
  },
  {
    id: 'tut-status-codes',
    subjectId: 'internet',
    title: 'Status Codes That Actually Matter',
    minutes: 8,
    body: `Status codes are an API contract. Clients branch on them, so getting them
right is not pedantry.

**2xx success.** 200 OK for a normal response, 201 Created when you made a
resource (return its location), 204 No Content when there is nothing to send
back (e.g. a successful DELETE).

**3xx redirection.** 301 permanent vs 302/307 temporary matters for caching and
SEO. 304 Not Modified powers conditional GETs with ETag/If-None-Match.

**4xx client errors** (the caller must change something):
- **400** malformed request (bad JSON, missing field).
- **401 Unauthorized** = not authenticated. You do not know who they are.
- **403 Forbidden** = authenticated but not allowed.
- **404 Not Found** = no such resource (or you are hiding its existence on
  purpose for security).
- **409 Conflict** = state collision (duplicate, version mismatch).
- **422** = well-formed but semantically invalid.
- **429 Too Many Requests** = rate limited; include Retry-After.

**5xx server errors** (your fault): 500 unexpected, 502/503/504 from
proxy/overload/timeout.

**The classic mistake:** returning 200 with an error in the body, or using 401
when you mean 403. The drill *Parse A Query String* and the quiz on
authentication vs authorization reinforce this.`,
  },
  {
    id: 'tut-rest-design',
    subjectId: 'api',
    title: 'Designing a REST API That Ages Well',
    minutes: 14,
    body: `Most API pain is self-inflicted at design time. A few principles keep an API
usable as it grows.

**Model resources, not actions.** Use nouns and HTTP verbs:

    GET    /orders          list
    POST   /orders          create
    GET    /orders/42       read
    PATCH  /orders/42       partial update
    DELETE /orders/42       remove

Avoid /createOrder or /getOrder. The verb is the method.

**Make writes idempotent where you can.** A client that times out will retry. If
POST /orders is not idempotent, retries create duplicate orders. Accept an
Idempotency-Key header and dedupe on it. See the *Idempotent Dedupe* drill.

**Paginate from day one.** Never return an unbounded list. Offset pagination is
simple but drifts when rows are inserted; cursor/keyset pagination is stable
under writes. Both are drills here (*Offset Pagination*, *Cursor Pagination*,
*Keyset Pagination*).

**Validate input and return a consistent error shape:**

    {
      "error": {
        "code": "VALIDATION",
        "message": "email is required",
        "fields": { "email": "required" },
        "requestId": "abc123"
      }
    }

A machine-readable code plus a request id is worth more than a pretty message.
The *Validate A Request Body* and *Error Envelope* drills cover this.

**Version before you need to.** Put it in the path (/v1/...) or a header. The
goal is to evolve without breaking existing clients. Add fields freely; never
repurpose or remove a field in place.

**Be strict in what you send, lenient in what you accept** — within reason.
Reject truly invalid input early with 400/422 rather than silently coercing it.`,
  },
  {
    id: 'tut-indexes',
    subjectId: 'sql',
    title: 'Indexes: Why Your Query Is Slow',
    minutes: 13,
    body: `An index is a sorted data structure (usually a B-tree) that lets the database
find rows without scanning the whole table. Understanding them is the highest-
leverage database skill.

**The symptom.** EXPLAIN ANALYZE shows a Seq Scan over millions of rows with a
filter, often followed by a Sort. That means no usable index for this query.

    Seq Scan on orders  (rows=5,000,000)
      Filter: user_id = $1
    Sort  (actual time=4200ms)

**The fix.** Create an index on the filtered column:

    CREATE INDEX ON orders (user_id);

Now the planner can jump straight to matching rows.

**Composite indexes and order.** A query that filters by one column and sorts by
another can be satisfied by a single composite index:

    CREATE INDEX ON orders (user_id, created_at);

This serves WHERE user_id = $1 ORDER BY created_at with no separate sort step.
**Column order matters:** the index is only usable left-to-right. An index on
(a, b) helps WHERE a = ? and WHERE a = ? AND b = ?, but not WHERE b = ? alone.

**When an index does NOT help.** Low selectivity (e.g. a boolean that is true for
90% of rows) means the planner may correctly choose a scan: reading the index
plus the table is slower than just scanning. Indexes also cost write throughput
and storage, so do not index everything.

**Covering indexes.** If an index contains every column a query needs, the
database answers from the index alone (an index-only scan), skipping the table.

Pair this with the *Read The Plan* debug problem and the *Hash Join* drill to
build a mental model of how joins and lookups execute.`,
  },
  {
    id: 'tut-transactions',
    subjectId: 'sql',
    title: 'Transactions and Isolation Levels',
    minutes: 14,
    body: `A transaction groups operations so they all commit or all roll back. Isolation
controls what concurrent transactions can see of each other.

**ACID in one breath.** Atomicity (all or nothing), Consistency (constraints
hold), Isolation (concurrent txns do not corrupt each other), Durability
(committed data survives a crash).

**The anomalies isolation prevents:**
- **Dirty read:** seeing another transaction's uncommitted write.
- **Non-repeatable read:** the same row returns different values within one
  transaction because another committed in between.
- **Phantom read:** a range query returns different rows because another
  transaction inserted/deleted matching rows.

**The levels** (weak to strong): Read Uncommitted, Read Committed (Postgres
default), Repeatable Read, Serializable. Stronger levels prevent more anomalies
but cost concurrency and can cause more rollbacks.

**The oversold-inventory bug.** Two requests read stock = 1, both decide it is
available, both decrement. You sold two of one item. Fixes:

    -- pessimistic lock
    SELECT stock FROM items WHERE id = $1 FOR UPDATE;

    -- or an atomic conditional update
    UPDATE items SET stock = stock - 1 WHERE id = $1 AND stock > 0;
    -- check rows affected; 0 means it was out of stock

The atomic update is usually best: it pushes the race into the database where it
belongs. The *Oversold Inventory* problem drills exactly this.

**Keep transactions short.** Long transactions hold locks, block others, and
bloat the database's view of old row versions. Never do network calls inside a
transaction.`,
  },
  {
    id: 'tut-auth-sessions-vs-jwt',
    subjectId: 'security',
    title: 'Sessions vs JWT: Choosing How to Authenticate',
    minutes: 13,
    body: `Both prove who a caller is on each request. They make opposite trade-offs.

**Server sessions.** On login you create a random session id, store session
state server-side (DB/Redis), and set it in a cookie. Each request looks up the
session.
- **Pro:** revocation is trivial (delete the row). State stays server-side.
- **Con:** a lookup per request; you need shared session storage across
  instances.

**JWTs.** A signed token containing claims (sub, exp, roles). The server
verifies the signature and trusts the claims without a lookup.
- **Pro:** stateless; any instance can verify; no per-request storage hit.
- **Con:** revocation is hard (the token is valid until it expires). Use short
  lifetimes plus refresh tokens.

**JWT footguns** (the *JWT Footguns* quiz and *Decode A JWT Payload* drill cover
these):
- Never trust the token's own "alg" header. Pin the algorithm server-side;
  otherwise an attacker switches to "none" or downgrades RS256 to HS256 and
  forges tokens.
- JWTs are **signed, not encrypted**. Anyone can read the payload. Put no
  secrets in claims.

**Password storage, regardless of session vs JWT.** Never store plaintext or
fast hashes (MD5/SHA-256). Use a slow, salted KDF: bcrypt, scrypt, or Argon2.
The salt defeats rainbow tables; the slowness defeats brute force.

**Rule of thumb:** default to sessions for first-party web apps (simple,
revocable); reach for JWTs for stateless service-to-service or when a per-request
DB lookup is genuinely a bottleneck.`,
  },
  {
    id: 'tut-caching',
    subjectId: 'performance',
    title: 'Caching Strategies and Their Failure Modes',
    minutes: 13,
    body: `Caching is the fastest way to make a backend faster and the fastest way to
serve stale or wrong data. Know the patterns and their failure modes.

**Where caches live:** browser, CDN (edge), application memory, and a shared
cache like Redis. Each layer trades freshness for speed.

**Cache-aside (lazy loading)** is the default:

    value = cache.get(key)
    if value is None:
        value = db.query(...)
        cache.set(key, value, ttl)
    return value

Simple and resilient: a cache outage just means more DB load.

**Write-through / write-behind** update the cache on writes, trading complexity
for fresher reads.

**Failure modes:**
- **Stampede / thundering herd:** a hot key expires and thousands of requests
  miss at once and slam the DB. Fix with a single-flight lock (one request
  recomputes), early/probabilistic refresh, or serve-stale-while-revalidate.
  The *Cache Stampede* problem drills this.
- **Stale data:** you cached it and the source changed. Bound TTLs and invalidate
  on write where correctness matters.
- **Unbounded growth:** a cache with no eviction becomes a memory leak. Use a
  bounded policy like LRU (build it in the *LRU Cache* drill).

**HTTP caching is caching too.** Cache-Control plus ETag let browsers and CDNs
revalidate cheaply with 304s. The *Cache Header Court* quiz and
*Parse Cache-Control* drill make this concrete.

**Golden rule:** every cached value needs an answer to "how does this get
wrong, and how fresh must it be?"`,
  },
  {
    id: 'tut-queues',
    subjectId: 'architecture',
    title: 'Queues, Idempotency, and Retries',
    minutes: 13,
    body: `Background queues are how backends stay responsive: accept the request, return
fast, do the slow work asynchronously. But "at-least-once" delivery means you
must design for duplicates and failure.

**The shape.** A producer enqueues a message; a worker consumes it and does the
work (send email, charge a card, resize an image). Decoupling means a traffic
spike fills the queue instead of toppling the app.

**At-least-once delivery.** Most brokers guarantee a message is delivered at
least once, which means **sometimes more than once** (a worker crashes after
doing the work but before acking). Therefore:

**Make handlers idempotent.** Processing the same message twice must equal
processing it once. Dedupe on a stable key, or use idempotent operations:

    -- idempotent: setting a state is safe to repeat
    UPDATE orders SET status = 'paid' WHERE id = $1;

    -- NOT idempotent: incrementing repeats the effect
    UPDATE accounts SET balance = balance - 100 WHERE id = $1;

For the second, guard with an idempotency key you have already processed. The
*Idempotent Dedupe* drill builds this.

**Retries with backoff.** Transient failures (a downstream blip) deserve a
retry, but immediate retries amplify outages. Use exponential backoff with
jitter (the *Exponential Backoff* and *Backoff With Full Jitter* drills).

**Dead-letter queues.** A poison message that always fails should not block the
queue forever. After N retries, move it to a DLQ with failure context, alert on
DLQ depth, and provide a replay path. The *Queue With Retries & DLQ* and
*Dead Letter Queue* problems cover this.

**The outbox pattern.** To publish an event AND commit a DB change atomically,
write the event to an "outbox" table in the same transaction, then a relay
publishes it. This avoids the "committed the row but lost the event" bug.`,
  },
  {
    id: 'tut-rate-limiting',
    subjectId: 'security',
    title: 'Rate Limiting Algorithms',
    minutes: 11,
    body: `Rate limiting protects a service from abuse and overload. The algorithm you
choose changes how bursts behave.

**Fixed window.** Count requests per key per clock window (e.g. 100/min). Simple,
but allows a double burst at the boundary: 100 at 11:59:59 and 100 at 12:00:00.
The *Fixed-Window Rate Limiter* drill implements it.

**Sliding window (log).** Keep timestamps of recent requests and evict ones older
than the window. Smooth and accurate, at the cost of storing timestamps. The
*Sliding-Window Rate Limiter* drill builds this.

**Token bucket.** A bucket holds up to N tokens and refills at a steady rate.
Each request spends a token; empty means reject. This **allows controlled bursts**
(up to capacity) while bounding the long-run rate, which is why it is the most
common choice. The *Token Bucket Limiter* drill implements it:

    tokens = min(capacity, tokens + elapsed * refillRate)
    if tokens >= 1: tokens -= 1; allow
    else: reject

**Leaky bucket.** Like token bucket but emphasizes a constant output rate
(smoothing) rather than allowing bursts.

**Distributed reality.** With many app servers, the counter must be shared
(usually Redis) so the limit is global, not per-instance. Decide failure policy:
**fail-open** (allow when the limiter is down, prioritizing availability) or
**fail-closed** (reject, prioritizing protection). The *Distributed Rate Limiter*
design problem works through these trade-offs.

**Always tell the client:** return 429 with a Retry-After header so well-behaved
clients can back off instead of hammering.`,
  },
  {
    id: 'tut-twelve-factor',
    subjectId: 'devops',
    title: 'The Twelve-Factor Backend (the parts that bite)',
    minutes: 10,
    body: `The twelve-factor app is a checklist for services that deploy and scale
cleanly. A few factors cause most real-world pain when ignored.

**Config in the environment.** Never hardcode secrets or per-environment values.
Read them from environment variables so the same build runs in dev, staging, and
prod. A leaked config baked into an image is a security incident.

**Backing services are attached resources.** A database, cache, or queue is
referenced by a URL in config and is swappable. Local Postgres and prod Postgres
differ only by connection string.

**Stateless processes.** Keep no important state in process memory; store it in a
database or cache. This is what lets you run many instances and restart any of
them freely. Sticky in-memory sessions break this (see sessions vs JWT).

**Disposability.** Processes start fast and shut down gracefully. On SIGTERM:
stop accepting new work, finish in-flight requests within a timeout, close pools,
exit. The *Graceful Shutdown* drill implements exactly this, and it is what makes
zero-downtime deploys possible.

**Logs as event streams.** Do not manage log files; write structured logs to
stdout and let the platform aggregate them. Add a request id to every line so you
can trace one request across services. This is the foundation of the
observability work (metrics, logs, traces).

**Dev/prod parity.** The smaller the gap between environments, the fewer "works
on my machine" surprises. Containers help, but pinned dependencies matter just as
much (the *Reproducible Environments* tutorial in the Python track).

Treat these as defaults, not aspirations: most outages trace back to violating
one of them.`,
  },
]
