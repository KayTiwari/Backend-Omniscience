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
  {
    id: 'tut-dns',
    subjectId: 'internet',
    title: 'DNS, Domains, and How Names Resolve',
    minutes: 9,
    body: `DNS is the phone book of the internet: it maps human names to addresses. It is
also a frequent, sneaky source of outages.

**The lookup, top down.** To resolve api.example.com your resolver may ask: a
root server (where is .com?), a TLD server (where is example.com?), then the
authoritative server for example.com (what is api?). Results are cached at every
layer based on each record's **TTL**.

**Record types you will meet:**
- **A / AAAA** map a name to an IPv4 / IPv6 address.
- **CNAME** aliases one name to another (api -> lb.provider.net).
- **MX** for mail, **TXT** for verification/SPF, **NS** for delegation.

**TTL is a trade-off.** A long TTL means fast, cached lookups but slow
propagation when you change records. Before a migration, lower the TTL ahead of
time so the cutover is quick.

**Why deploys "fail" on DNS.** A new service has no DNS record yet, or an old IP
is still cached, or a CNAME points at a decommissioned host. "It works by IP but
not by name" is the tell. DNS resolves names to addresses; it knows nothing about
ports, paths, or health.`,
  },
  {
    id: 'tut-nosql-cap',
    subjectId: 'sql',
    title: 'NoSQL and the CAP Theorem',
    minutes: 12,
    body: `"NoSQL" is not one thing; it is a family of databases that drop some relational
guarantees to gain scale, flexibility, or a better fit for a data shape.

**The families:**
- **Key-value** (Redis, DynamoDB): O(1) lookups by key; great for caches,
  sessions, counters.
- **Document** (MongoDB): JSON-ish documents; flexible schema, good when data is
  naturally nested and accessed as a unit.
- **Wide-column** (Cassandra): huge write throughput, queries designed around
  known access patterns.
- **Graph** (Neo4j): relationships are first-class (social graphs, recommendations).

**Model around access patterns.** Relational design normalizes first and joins
later. Many NoSQL stores do the opposite: you **denormalize** and shape data for
the exact queries you will run, because cross-document joins are expensive or
absent.

**CAP theorem.** Under a network **partition** (P, which you cannot avoid in a
distributed system), you must choose:
- **CP** (consistency): refuse some requests to avoid serving stale/conflicting
  data.
- **AP** (availability): keep serving, accepting that replicas may temporarily
  disagree (eventual consistency).

There is no "CA" in a real distributed system; partitions happen, so the real
choice is C vs A during one. **PACELC** extends this: even without a partition
(Else), you trade Latency vs Consistency.

**Practical takeaway:** pick the store for the access pattern, and know whether
your reads can tolerate being a little stale. Most systems mix: Postgres for
transactional truth, Redis for hot reads, a search engine for queries.`,
  },
  {
    id: 'tut-replication-sharding',
    subjectId: 'sql',
    title: 'Replication and Sharding',
    minutes: 12,
    body: `Two different tools for two different problems. Replication is about copies;
sharding is about splitting.

**Replication = copies of the same data.** A primary takes writes and streams
changes to replicas.
- **Read scaling:** send read queries to replicas to offload the primary.
- **High availability:** if the primary dies, promote a replica (failover).
- **The catch: replication lag.** A replica may be milliseconds-to-seconds
  behind. "I saved it but it is not there" often means you wrote to the primary
  and immediately read from a lagging replica. Fix with read-your-writes routing
  (read from primary right after a write) or by waiting for replication.

**Sync vs async.** Synchronous replication waits for a replica to confirm
(safer, slower); asynchronous does not (faster, risks losing the last writes on
failover).

**Sharding = split data across nodes by a key.** When one machine cannot hold
the data or the write load, partition rows across shards (e.g. by user_id).
- **The shard key is everything.** A bad key creates hot shards (one node gets
  all the traffic) or forces cross-shard queries (slow, complex).
- **Rebalancing is hard.** Adding a shard with naive modulo hashing remaps almost
  every key. **Consistent hashing** moves only a fraction of keys (build it in
  the *Consistent Hashing Ring* drill).

**Order of operations:** optimize queries and add indexes first, then a cache,
then read replicas, and only shard when you genuinely must. Sharding adds
permanent complexity.`,
  },
  {
    id: 'tut-monolith-microservices',
    subjectId: 'architecture',
    title: 'Monolith vs Microservices',
    minutes: 11,
    body: `This is an organizational decision disguised as a technical one. Both are valid;
the wrong one for your stage is expensive.

**The modular monolith.** One deployable, clear internal module boundaries, one
database. You get simple local development, easy transactions, and one thing to
deploy and debug. Most products should start here.

**Microservices.** Many small services, each owning its data, communicating over
the network.
- **Real benefits:** independent deploys, independent scaling, team autonomy,
  fault isolation.
- **Real costs:** the network is now in your business logic. You inherit
  distributed transactions, partial failure, eventual consistency, service
  discovery, versioned contracts, and distributed tracing just to debug a single
  request.

**The trap.** A "distributed monolith": services so chatty and coupled that you
pay all the microservice costs and get none of the benefits, because you cannot
deploy one without the others.

**How to decide.** Split a service out when a real force demands it: a part needs
to scale independently, a team needs to own and deploy it independently, or a
fault needs to be isolated. Do not split because microservices are fashionable.

**If you do split:** make each service own its data (no shared database),
communicate via well-defined contracts, design every call for failure (timeouts,
retries with backoff, circuit breakers), and make operations idempotent.`,
  },
  {
    id: 'tut-message-brokers',
    subjectId: 'architecture',
    title: 'Message Brokers: Queues vs Logs',
    minutes: 11,
    body: `Brokers move work and events between services. The big mental split is
"task queue" versus "event log".

**Task queue (RabbitMQ, SQS).** A message is work to be done; once a consumer
acks it, it is gone. Good for jobs: send email, process upload, charge a card.
- Competing consumers share the load.
- Supports priorities, delays, dead-letter queues.

**Event log (Kafka).** Messages are an append-only, replayable log. Consumers
track their own offset and can re-read history.
- Multiple independent consumers read the same events at their own pace.
- Great for event sourcing, analytics pipelines, and fan-out to many systems.
- Partitions give ordering **within a key** and parallelism across keys (the
  *Partition By Key* drill).

**Delivery guarantees.** Most brokers are **at-least-once**: a message may be
delivered more than once (a consumer crashes after working, before acking). So
consumers must be **idempotent** (see the queues tutorial). Exactly-once is
expensive and usually faked with idempotency + dedup.

**Backpressure.** A queue absorbs spikes so a slow downstream does not topple the
upstream. Watch queue depth as a health signal: a growing queue means consumers
cannot keep up, and a flat-lined DLQ depth means poison messages need attention.

**Choosing:** need to distribute jobs to workers? A task queue. Need many systems
to react to the same stream of facts, possibly replaying them? A log like Kafka.`,
  },
  {
    id: 'tut-containers',
    subjectId: 'devops',
    title: 'Containers vs VMs, and What Docker Actually Does',
    minutes: 10,
    body: `Containers package your app with its dependencies so it runs the same
everywhere. Understanding the model prevents a lot of "works locally" pain.

**VM vs container.** A VM virtualizes hardware and runs a full guest OS (heavy,
minutes to boot). A container shares the host kernel and isolates a process with
namespaces and cgroups (light, milliseconds to start). A container is a process,
not a tiny computer.

**The image.** A Dockerfile builds a layered, read-only image. Layers are cached,
so order matters: copy your lockfile and install dependencies **before** copying
source, so a code change does not bust the dependency layer.

    FROM node:22-slim
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --omit=dev      # cached unless deps change
    COPY . .
    CMD ["node", "server.js"]

**Production hygiene:**
- Use small base images and **multi-stage builds** (build with the full toolchain,
  copy only the artifact into a slim final image).
- Run as a non-root user.
- Do not bake secrets into the image; pass config via environment.
- Add a health endpoint so the orchestrator knows when the container is ready.

**Orchestration.** Kubernetes schedules containers across machines, restarts
failed ones, and routes traffic to **ready** ones (readiness probes are what make
zero-downtime deploys work). You do not need Kubernetes to start; a single
container behind a proxy is fine until scale forces more.`,
  },
  {
    id: 'tut-observability',
    subjectId: 'performance',
    title: 'Observability: Logs, Metrics, and Traces',
    minutes: 11,
    body: `You cannot fix what you cannot see. Observability is the difference between
"the site is slow" and "the checkout endpoint p95 tripled because the DB pool is
saturated".

**The three pillars:**
- **Logs:** discrete events ("order 42 created"). Make them **structured** (JSON)
  and attach a **request id** so you can follow one request across services. The
  *Parse An Access Log Line* drill works with this shape.
- **Metrics:** numeric time series (request rate, error rate, latency, queue
  depth, CPU). Cheap to store, great for dashboards and alerts. Latency should be
  tracked as **percentiles** (p50/p95/p99), not averages, because averages hide
  the tail (the *Latency Percentile* and *Cumulative Histogram* drills).
- **Traces:** the path of one request across services, with timing per span.
  This is how you find which hop is slow in a distributed call.

**The golden signals** (a good starting alert set): latency, traffic, errors,
saturation. Alert on symptoms users feel (error rate, p99 latency), not on every
internal metric.

**Error rate, concretely.** Track the fraction of 5xx responses over a window
(the *Error Rate* drill). A spike is your earliest signal something broke.

**Make it actionable.** A log line with no request id, or a metric with no
dashboard or alert, is noise. The goal is: an alert fires, and the linked
dashboard plus traces point you at the failing component in minutes.`,
  },
  {
    id: 'tut-realtime',
    subjectId: 'system-design',
    title: 'Real-Time Delivery: Polling, SSE, and WebSockets',
    minutes: 10,
    body: `When clients need fresh data, you have a spectrum of options trading simplicity
for latency and efficiency.

**Short polling.** The client asks "anything new?" on a timer. Dead simple, works
everywhere, but wastes requests and adds up to one interval of latency. Fine for
low-frequency updates.

**Long polling.** The client makes a request and the server holds it open until
there is data (or a timeout), then the client immediately re-requests. Near
real-time over plain HTTP, but ties up a connection per client and is fiddly.

**Server-Sent Events (SSE).** A one-way stream from server to client over a
single long-lived HTTP response. Built-in reconnection and event ids, simple to
implement. Perfect for feeds, notifications, and progress updates. The format is
just text frames (the *Format A Server-Sent Event* drill):

    event: ping
    data: hello
    id: 1

**WebSockets.** A full-duplex, persistent connection after an HTTP upgrade. Use
when you need **bidirectional**, low-latency messaging: chat, multiplayer,
collaborative editing, live trading.

**Choosing:**
- One-way updates, want simplicity and HTTP semantics? **SSE.**
- Two-way, high-frequency? **WebSockets.**
- Rare updates, maximum compatibility, least effort? **Polling.**

**Scaling gotcha:** persistent connections are stateful. Across many servers you
need a shared pub/sub layer (e.g. Redis) so a message published on one server
reaches clients connected to another.`,
  },
  {
    id: 'tut-testing',
    subjectId: 'devops',
    title: 'A Testing Strategy That Pays Off',
    minutes: 10,
    body: `Tests exist to let you change code with confidence. The goal is maximum
confidence per minute of test runtime and maintenance.

**The pyramid.**
- **Unit tests** (many, fast): one function/module, no I/O. They pin down logic
  and edge cases. The coding drills in this app are essentially unit tests with a
  reference solution.
- **Integration tests** (fewer): real database, real HTTP, real wiring. They
  catch the bugs unit tests cannot: a wrong SQL query, a serialization mismatch,
  a broken migration.
- **End-to-end** (few): the whole system through the front door. Valuable but
  slow and flaky; keep them to critical paths.

**Test behavior, not implementation.** Assert on inputs and outputs, not private
internals, so refactors do not break tests. A test that breaks every refactor is
worse than no test.

**Make failures fast and clear.** A good test names the case and reports
"expected X, got Y" (exactly what the grader's assertEqual does). When it fails,
you should know why without a debugger.

**The N+1 example.** A list endpoint that fires one query per item passes a naive
unit test but explodes in integration. Catch it by asserting the query count
(assertNumQueries / a query log) in an integration test. The *ORM N+1* problem
in the Django track and the *N+1 Query Hunt* drill cover this.

**Determinism.** Flaky tests train you to ignore failures. Control time, randomness,
and ordering (inject a clock or seed, as the jitter and rate-limit drills do) so a
test passes or fails for real reasons only.`,
  },
  {
    id: 'tut-git-workflows',
    subjectId: 'language',
    title: 'Git Workflows That Scale With a Team',
    minutes: 9,
    body: `Git is easy alone and chaotic in a team without a convention. Pick one and be
consistent.

**The mental model.** A commit is a snapshot plus a parent pointer. A branch is
just a movable label pointing at a commit. Merging combines histories; rebasing
replays your commits on top of another branch for a linear history.

**Trunk-based (recommended for most teams).** Short-lived feature branches off
main, small PRs, merge often behind feature flags. This minimizes long-running
divergence and painful merges. Long-lived branches rot.

**Commit hygiene.** Small, focused commits with messages that explain **why**, not
just what. A good message: "Fix oversold inventory by making decrement atomic"
beats "fix bug".

**Rebase vs merge.** Rebase your own local feature branch to keep history clean,
but never rebase shared/public branches others have based work on. Merge to
integrate; rebase to tidy before integrating.

**Resolve conflicts at the source.** A conflict means two changes touched the
same lines. Understand both intents before resolving; do not blindly accept one
side.

**Protect main.** Require PR review and green CI before merge. The point of the
workflow is that main is always deployable.`,
  },
  {
    id: 'tut-oauth',
    subjectId: 'security',
    title: 'OAuth and OpenID Connect, Demystified',
    minutes: 12,
    body: `OAuth 2.0 is about **delegated authorization** ("let this app act on my behalf
without my password"). OpenID Connect (OIDC) adds **authentication** ("who is
this user") on top.

**The roles.** Resource owner (the user), client (your app), authorization server
(issues tokens), resource server (the API). Tokens, not passwords, flow between
them.

**Authorization Code flow (the one to use for web/mobile).**
1. App redirects the user to the authorization server.
2. User authenticates and consents there (your app never sees the password).
3. The server redirects back with a short-lived **authorization code**.
4. Your **backend** exchanges that code (plus a client secret) for an access
   token. Doing the exchange server-side keeps the secret off the client.

**PKCE.** For public clients (SPAs, mobile) that cannot hold a secret, PKCE adds
a one-time code verifier/challenge so an intercepted authorization code is
useless. Use Authorization Code + PKCE for those.

**Tokens.**
- **Access token:** short-lived, sent to the API as a Bearer token.
- **Refresh token:** longer-lived, used to get new access tokens without
  re-login. Store it carefully.
- **ID token (OIDC):** a JWT proving who the user is, for your app to read.

**Anti-patterns:** the Implicit and Resource Owner Password flows are deprecated;
do not use them. And remember an access token is a Bearer credential: anyone
holding it can use it, so always send it over TLS and keep lifetimes short.`,
  },
  {
    id: 'tut-api-styles',
    subjectId: 'api',
    title: 'REST vs GraphQL vs gRPC',
    minutes: 11,
    body: `Three ways for systems to talk, each strongest in a different setting.

**REST (resources over HTTP).** Nouns and verbs, cacheable via HTTP, ubiquitous.
- **Strengths:** simple, debuggable with curl, HTTP caching, huge tooling.
- **Pain:** over-fetching (you get fields you do not need) and under-fetching
  (N round trips to assemble a screen).

**GraphQL (a query language for your API).** The client asks for exactly the
fields it needs from a typed schema, in one request.
- **Strengths:** no over/under-fetching, great for rich frontends with varied
  data needs, strong typing and introspection.
- **Pain:** HTTP caching is harder (usually one POST endpoint), and the
  notorious **N+1**: a naive resolver fires a query per item. Solve it with
  batching/dataloaders. Server complexity and query-cost limiting are real.

**gRPC (contract-first RPC over HTTP/2).** Define services and messages in
protobuf; generate typed clients/servers. Binary, fast, streaming.
- **Strengths:** performance, strong contracts, bidirectional streaming, ideal
  for **internal service-to-service** calls.
- **Pain:** not natively browser-friendly (needs a proxy), binary payloads are
  harder to eyeball.

**How to choose.** Public/partner API or simple CRUD: **REST**. Complex,
data-hungry frontends: **GraphQL**. High-performance internal microservice
traffic: **gRPC**. Many systems use REST/GraphQL at the edge and gRPC between
services.`,
  },
  {
    id: 'tut-owasp',
    subjectId: 'security',
    title: 'The OWASP Risks You Will Actually Hit',
    minutes: 12,
    body: `The OWASP Top 10 catalogs the most common web vulnerabilities. A handful show up
constantly in backends.

**Broken access control (the #1 risk).** The user is authenticated but you forgot
to check they are allowed to touch *this* resource. The classic is IDOR:
GET /orders/123 returns someone else's order because you only checked login, not
ownership. **Fix:** authorize every request against the specific resource, not
just "is logged in".

**Injection (SQL, command, etc.).** Untrusted input concatenated into a query or
shell. **Fix:** parameterized queries / prepared statements, always:

    -- vulnerable
    db.query("SELECT * FROM users WHERE email = '" + email + "'");
    -- safe
    db.query("SELECT * FROM users WHERE email = $1", [email]);

**XSS.** Untrusted data rendered into HTML executes as script. **Fix:** escape on
output (the *Escape HTML* drill) and set a Content-Security-Policy.

**SSRF.** Your server fetches a user-supplied URL and an attacker points it at
internal services or the cloud metadata endpoint. **Fix:** validate the scheme,
resolve and block private/link-local ranges, disable redirects, use an allowlist
(the *SSRF In The Image Fetcher* problem).

**Security misconfiguration & secrets.** Default credentials, verbose error
stacks leaked to clients, secrets committed to git. **Fix:** least privilege,
generic error bodies, secrets in env/secret managers, dependency scanning.

**The throughline:** never trust input, authorize every action, and fail closed.`,
  },
  {
    id: 'tut-connection-pooling',
    subjectId: 'performance',
    title: 'Connection Pooling and Why It Saves You',
    minutes: 9,
    body: `Opening a database connection is expensive (TCP + TLS + auth + backend process).
Doing it per request will melt your database. A pool reuses a small set of
connections.

**How it works.** The app keeps N open connections. A request borrows one, runs
its queries, and returns it. If all are busy, the request waits (up to a timeout)
for one to free up.

**The QueuePool error.** "QueuePool limit reached" or "too many connections"
means demand exceeded the pool and nothing freed up in time. Causes:
- Sessions/connections not released (leaked) because of a missing close on an
  error path. Tie connection lifetime to the request and release in a finally /
  teardown hook (the *Session Leaks* problem in the Flask track).
- Long-running queries or transactions holding connections.
- Pool too small for the concurrency.

**Sizing.** More connections is not always better: each one consumes memory and a
backend process. A common starting point is a small pool per instance, sized so
(instances x pool) stays well under the database's max_connections. Add a
**pgbouncer**-style external pooler when you have many instances.

**Rules:** keep transactions short, never do network calls while holding a
connection, and always release on every path. The pool turns "thousands of
expensive connects" into "a few reused ones".`,
  },
  {
    id: 'tut-migrations',
    subjectId: 'sql',
    title: 'Schema Migrations Without Downtime',
    minutes: 11,
    body: `Changing a schema while the app is live, across a rolling deploy, is where many
outages happen. The safe technique is **expand/contract** (a.k.a. parallel
change).

**The problem.** During a rolling deploy, old and new code run **at the same
time**. A migration that the old code cannot tolerate (a dropped/renamed column)
breaks the still-running old instances.

**Expand/contract for a rename:**
1. **Expand:** add the new column (nullable). Old code ignores it.
2. **Dual-write:** deploy code that writes both old and new columns, reads old.
3. **Backfill:** copy existing data into the new column in batches (avoid one
   giant locking update).
4. **Switch reads:** deploy code that reads the new column.
5. **Contract:** once nothing uses the old column, drop it.

Each step is backward compatible with the previous release, so a rollback is
always safe.

**Locking gotchas (Postgres).** Adding a NOT NULL column with a volatile default,
or adding a constraint, can take a heavy lock and block writes on a large table.
Add the column nullable, backfill in batches, then add the constraint as
NOT VALID and VALIDATE separately (which takes a lighter lock). The
*Zero-Downtime Column Add* problem drills this.

**Golden rule:** never make a single migration that the currently-running code
cannot survive.`,
  },
  {
    id: 'tut-scaling',
    subjectId: 'system-design',
    title: 'Scaling: Vertical, Horizontal, and Load Balancing',
    minutes: 11,
    body: `Scaling is about removing the current bottleneck, in order, without adding
complexity you do not yet need.

**Vertical scaling (scale up).** Bigger machine: more CPU, RAM, faster disk.
Simple and often the right first move, but it has a ceiling and a single point of
failure.

**Horizontal scaling (scale out).** More machines behind a load balancer. Nearly
unlimited, and it adds redundancy. The prerequisite: **stateless app instances**
(no important in-memory state), so any instance can serve any request. Move
sessions/state to a shared store (see twelve-factor).

**Load balancing.** A balancer spreads traffic across instances. Algorithms:
round-robin (simple), least-connections (favors idle instances), and
hashing/sticky (route a key/user to the same instance). It also health-checks
instances and stops sending traffic to unhealthy or not-ready ones.

**The database is usually the real bottleneck.** App servers scale out easily;
the database does not. The progression: optimize queries and indexes, add a
cache, add read replicas for read-heavy load, and only **shard** when one node
genuinely cannot hold the data or write load.

**Protect under overload.** When demand exceeds capacity, degrade gracefully:
rate limit, shed load (reject early with 429/503), use circuit breakers to stop
hammering a failing dependency, and apply backpressure via queues. Falling over
cleanly beats collapsing entirely.

**Order of operations:** measure to find the real bottleneck, then scale that.
Do not shard a database that an index would have fixed.`,
  },
  {
    id: 'tut-serverless-cdn',
    subjectId: 'devops',
    title: 'Serverless, CDNs, and Where Code Runs',
    minutes: 9,
    body: `Not all backend code has to run on a server you manage. Knowing the options keeps
you from over- or under-engineering.

**CDN (content delivery network).** Caches static assets (and increasingly
responses) at edge locations near users. It cuts latency and offloads your
origin. Cache static assets aggressively with content-hashed filenames and long
max-age + immutable; be careful caching dynamic/auth'd responses.

**Serverless functions (FaaS).** You deploy a function; the platform runs it on
demand and scales to zero.
- **Strengths:** no servers to manage, pay-per-use, automatic scaling, great for
  spiky or event-driven workloads (webhooks, image processing, cron jobs).
- **Trade-offs:** **cold starts** (first invocation after idle is slow),
  execution time limits, and statelessness (no in-memory state between calls; use
  external stores). Database connections are tricky at high concurrency; use a
  pooler.

**Managed containers / PaaS.** A middle ground: you ship a container, the
platform runs and scales it. Less ops than raw VMs/Kubernetes, more control than
FaaS.

**How to choose.** Steady, latency-sensitive traffic: long-running servers or
managed containers. Spiky, event-driven, or glue work: serverless functions.
Static and cacheable: push it to the CDN. Most real systems combine all three: a
CDN in front, app servers/containers for core traffic, and functions for events.`,
  },
  {
    id: 'tut-ddd',
    subjectId: 'architecture',
    title: 'Domain-Driven Design: Boundaries That Hold',
    minutes: 11,
    body: `DDD is less about fancy patterns and more about modeling software around the
business and drawing boundaries that do not leak.

**Ubiquitous language.** Code, conversations, and the database should use the same
words the domain experts use. If the business says "shipment" and the code says
"package record", every conversation pays a translation tax. Name things the way
the domain does.

**Bounded contexts.** A large domain is split into contexts, each with its own
model. "Customer" in Billing (has a payment method) is not the same as "Customer"
in Support (has tickets). Forcing one shared model creates a tangled mess; let
each context own its meaning and translate at the edges.

**Building blocks:**
- **Entities** have identity over time (a User with an id).
- **Value objects** are defined by their attributes and are immutable (Money,
  an Address). Two value objects with the same fields are equal.
- **Aggregates** are clusters with one root; you change the aggregate only through
  its root, which enforces invariants (an Order controls its OrderLines so totals
  stay consistent).
- **Repositories** load and save aggregates, hiding the database.

**Why it matters for backends.** Aggregate boundaries often map to transaction
boundaries: one aggregate, one transaction. Bounded contexts often map to
service boundaries when you split a monolith. Get the boundaries right and the
system stays changeable; get them wrong and every feature touches everything.

**Start simple.** You do not need the full toolkit on day one. The highest-value
ideas are ubiquitous language and clear aggregate/context boundaries.`,
  },
  {
    id: 'tut-cqrs-es',
    subjectId: 'architecture',
    title: 'CQRS and Event Sourcing',
    minutes: 12,
    body: `Two related but separate ideas, often confused. You can use either without the
other.

**CQRS (Command Query Responsibility Segregation).** Split the write model
(commands that change state) from the read model (queries). They can use
different shapes and even different stores.
- **Why:** reads and writes have different needs. Writes enforce invariants;
  reads want denormalized, fast-to-serve views. A complex domain write model
  makes a terrible query model.
- **Cost:** two models to keep in sync, usually eventually consistent (the read
  side lags the write side briefly).

**Event sourcing.** Instead of storing current state, store the **sequence of
events** that produced it. Current state is a left-fold over the events:

    events: Deposited(100), Withdrew(30)
    balance = reduce(events) = 70

The *Rebuild State From Events* drill is exactly this fold.
- **Why:** a perfect audit log, time travel (rebuild state at any point), and you
  can build new read models by replaying history.
- **Cost:** more complexity, schema/versioning of events, and you usually keep
  **snapshots** so you do not replay millions of events every time.

**They pair well:** event sourcing on the write side, with projections building
read models (CQRS) by consuming the event stream. The *CQRS projection* and
*Transactional Outbox* problems connect here.

**When to use.** Reach for these in complex domains where audit, temporal
queries, or wildly different read/write needs justify the cost. For CRUD, plain
state storage is simpler and correct.`,
  },
  {
    id: 'tut-saga',
    subjectId: 'architecture',
    title: 'Distributed Transactions and the Saga Pattern',
    minutes: 11,
    body: `Across multiple services or databases you cannot wrap everything in one ACID
transaction. The saga pattern coordinates a multi-step operation that can partly
fail.

**The problem.** "Place order" must reserve inventory, charge payment, and create
a shipment, each owned by a different service. A classic distributed transaction
(two-phase commit) is slow, locks resources, and couples services. 2PC exists
(the *Two-Phase Commit Decision* drill models the vote) but is avoided at scale.

**Sagas: a sequence with compensations.** Run the steps one by one. If a step
fails, run **compensating actions** for the already-completed steps, in reverse,
to undo their effects:

    reserve inventory   -> compensate: release inventory
    charge payment      -> compensate: refund payment
    create shipment     -> (failed here)
    => refund payment, release inventory

The *Saga Compensation* drill implements exactly this rollback.

**Two styles:**
- **Orchestration:** a central coordinator tells each service what to do and
  triggers compensations. Easier to reason about and monitor.
- **Choreography:** services react to each other's events with no central brain.
  More decoupled, harder to follow.

**Make it safe.** Every step and every compensation must be **idempotent**,
because retries and duplicate events are guaranteed. Compensation is not always a
clean undo (you cannot un-send an email), so sometimes you compensate with a
follow-up action (send a correction).

**Bottom line:** embrace eventual consistency across services, and design the
unhappy path (compensations) as carefully as the happy path.`,
  },
  {
    id: 'tut-backpressure',
    subjectId: 'performance',
    title: 'Backpressure and Graceful Degradation',
    minutes: 10,
    body: `Systems do not fail gently by default; they fall over. Backpressure and graceful
degradation are how you stay up under more load than you can handle.

**Backpressure.** When a consumer cannot keep up, the system must signal
"slow down" rather than buffer infinitely until it runs out of memory. A bounded
queue is backpressure: when full, you reject or block the producer. An unbounded
queue just delays the crash and hides the problem.

**Load shedding.** Past capacity, it is better to serve some requests well than
all requests badly. Reject excess early (429/503 with Retry-After) before the
work piles up. Shed low-priority traffic first (health checks and critical paths
survive; nice-to-haves get dropped).

**Graceful degradation.** When a dependency is slow or down, degrade the feature
instead of failing the whole request:
- Serve stale cache data when the source is unavailable.
- Return a partial response (skip the recommendations widget; still show the
  product).
- Use sensible defaults for a non-critical service.

**Circuit breakers.** Stop hammering a failing dependency. After N consecutive
failures, "open" the breaker and fail fast for a cooldown, then "half-open" to
test recovery. This prevents one slow dependency from exhausting all your threads
and cascading the outage. The *Circuit Breaker States* drill models the state
machine.

**Timeouts everywhere.** A call with no timeout can hang forever and tie up a
worker. Every network call needs a timeout, and retries need backoff + jitter so
recovery does not become a self-inflicted DDoS.

**The mindset:** decide in advance what to drop, slow, or stale when you exceed
capacity. Falling over is a choice you make by not planning.`,
  },
  {
    id: 'tut-health-checks',
    subjectId: 'devops',
    title: 'Health Checks: Liveness vs Readiness',
    minutes: 8,
    body: `Two endpoints, two different questions. Confusing them causes restart loops and
traffic sent to instances that cannot serve it.

**Liveness ("am I alive?").** Is the process wedged and unrecoverable (deadlock,
out of memory)? If liveness fails, the orchestrator **restarts** the container.
Keep it cheap and dependency-free: a liveness probe that checks the database will
restart your app during a database blip, turning a small problem into an outage.

**Readiness ("can I serve traffic right now?").** Is the app warmed up and are its
critical dependencies reachable? If readiness fails, the load balancer **stops
sending traffic** but does not restart the process. Readiness may legitimately
check the DB/cache, because if they are unreachable this instance cannot do
useful work.

**Why the distinction matters:**
- On startup, readiness is false until migrations/caches/connections are ready,
  so no requests hit a half-initialized app.
- During a deploy, new instances only receive traffic once **ready**, and old
  instances are drained before shutdown. This is what makes zero-downtime deploys
  work (paired with graceful shutdown).

**Practical shape:**

    GET /livez   -> 200 if the process is running
    GET /readyz  -> 200 only if dependencies are reachable and warm

**Common mistake:** a single /health that checks everything and is used for both.
A dependency hiccup then triggers restarts (liveness) when you only meant to pull
the instance out of rotation (readiness).`,
  },
  {
    id: 'tut-secrets-config',
    subjectId: 'devops',
    title: 'Secrets and Configuration',
    minutes: 9,
    body: `Config is everything that changes between environments; secrets are the subset
that would hurt if leaked. Both belong outside your code.

**Config in the environment.** Read settings from environment variables (or a
config service), not from values baked into the build. The same artifact then
runs in dev, staging, and prod with different config. This is a core twelve-factor
rule.

**Never commit secrets.** API keys, DB passwords, and signing keys in git are a
breach, even in a private repo and even if later deleted (git history keeps
them). Use a .gitignore for env files and scan for accidental commits.

**Use a secret manager.** Vault, AWS Secrets Manager, or your platform's secret
store: secrets are encrypted at rest, access-controlled, audited, and rotatable
without a redeploy. The app fetches them at startup or runtime.

**Rotation and least privilege.** Assume any secret can leak. Make rotation
routine, and scope each credential to the minimum it needs (a read-only DB user
for a reporting service, not the admin role).

**Do not leak secrets at runtime either.** Keep them out of logs, error messages,
and API responses (the error-envelope rule: generic messages to clients,
details to your logs only).

**Local dev.** A .gitignored .env file (loaded by your framework) is fine for
local development, as long as it never holds production secrets and never gets
committed.`,
  },
  {
    id: 'tut-progressive-delivery',
    subjectId: 'devops',
    title: 'Blue-Green, Canary, and Feature Flags',
    minutes: 10,
    body: `Shipping is risky; these techniques shrink the blast radius and make rollback
fast.

**Rolling deploy (the baseline).** Replace instances a few at a time, only sending
traffic to ready ones and draining old ones. Simple, but the new version goes to
everyone as it rolls.

**Blue-green.** Run two identical environments. Blue serves production; you deploy
to green, test it, then flip the load balancer to green. Rollback is flipping
back to blue, which is instant. Cost: double the infrastructure during the
switch, and you must handle database compatibility across both (expand/contract).

**Canary.** Release to a small slice of traffic (say 5%), watch error rate and
latency, then ramp up if healthy or roll back if not. This catches problems real
synthetic tests miss, with limited exposure. It needs good observability to
decide automatically.

**Feature flags.** Decouple **deploy** from **release**. Ship code dark behind a
flag, then turn it on for a cohort or percentage at runtime, no redeploy. Flags
enable canary-by-user, instant kill switches, and trunk-based development (merge
incomplete work safely behind a flag).
- **Discipline required:** flags are tech debt. Remove them once a feature is
  fully rolled out, or you accumulate a combinatorial mess of stale conditionals.

**The common thread:** make releasing reversible and incremental. The question is
never "will something break" but "how fast can we limit and undo it".`,
  },
  {
    id: 'tut-normalization',
    subjectId: 'sql',
    title: 'Normalization and Data Modeling',
    minutes: 11,
    body: `Normalization organizes a relational schema to avoid redundancy and the update
anomalies it causes. Knowing the rules (and when to break them) is core data
modeling.

**The anomalies it prevents.** If a customer's address is copied onto every order
row, changing the address means updating many rows (update anomaly), a new
customer with no order has nowhere to live (insertion anomaly), and deleting the
last order loses the customer (deletion anomaly). Normalization puts each fact in
exactly one place.

**The normal forms, briefly:**
- **1NF:** atomic columns, no repeating groups (no "tags" column holding a CSV).
- **2NF:** no non-key column depends on only part of a composite key.
- **3NF:** no non-key column depends on another non-key column (no transitive
  dependencies). "Every non-key fact depends on the key, the whole key, and
  nothing but the key."

In practice, aiming for **3NF** handles most cases: separate entities into their
own tables and link them with foreign keys.

**Model relationships explicitly.** One-to-many is a foreign key on the many side;
many-to-many needs a join table (student_courses linking students and courses).

**When to denormalize.** Normalization optimizes writes and integrity but can make
read-heavy queries do many joins. Deliberately denormalize for performance when
measured: cache computed aggregates, duplicate a hot column to avoid a join, or
keep a read model (CQRS). The rule: normalize for correctness first, denormalize
for proven performance needs, and know which copy is the source of truth.

**NoSQL flips the default.** Document/wide-column stores often denormalize from
the start, modeling around access patterns instead of relationships (see the
NoSQL tutorial).`,
  },
  {
    id: 'tut-idempotency',
    subjectId: 'architecture',
    title: 'Idempotency and the Exactly-Once Lie',
    minutes: 10,
    body: `"Exactly-once delivery" is mostly a myth in distributed systems. What you can
build is **exactly-once effects** on top of at-least-once delivery, using
idempotency.

**Why duplicates are guaranteed.** A client times out and retries. A message
broker redelivers after a consumer crashes before acking. A load balancer retries
a request. You will process the same logical operation more than once, so design
for it.

**Idempotent operations.** An operation is idempotent if doing it twice equals
doing it once. Some are naturally so:

    -- idempotent: setting an absolute state
    UPDATE orders SET status = 'paid' WHERE id = $1;
    -- NOT idempotent: a relative change repeats its effect
    UPDATE accounts SET balance = balance - 100 WHERE id = $1;

**Idempotency keys.** For non-idempotent work (charge a card, create an order),
the client sends a unique Idempotency-Key. You store the key with the result; a
repeat with the same key returns the stored result instead of doing the work
again. The *Idempotent Dedupe* drill builds this.

    if key in processed: return processed[key]
    result = doWork()
    processed[key] = result   # atomically, ideally in the same txn
    return result

**The race.** Two concurrent requests with the same key must not both do the work.
Use a unique constraint on the key (the second insert fails) or a lock, so exactly
one wins.

**Takeaway:** assume at-least-once everywhere, make handlers idempotent, and you
get the exactly-once behavior users actually care about, without pretending the
network is reliable.`,
  },
  {
    id: 'tut-webhooks',
    subjectId: 'api',
    title: 'Webhooks: Receiving Events Safely',
    minutes: 10,
    body: `A webhook is another service calling your endpoint when something happens
(payment succeeded, repo pushed). Receiving them safely has a few non-obvious
rules.

**Verify the signature.** Anyone can POST to your public URL, so a provider signs
each payload with an HMAC over the **raw body** plus a timestamp. Recompute it and
compare in constant time. Verify against the raw bytes, not the parsed object,
because re-serializing changes them. The *Verify A Webhook* drill covers this.

**Reject replays.** An attacker can capture and resend a valid signed request.
Reject requests whose timestamp is too old, and ideally dedupe on the event id.

**Respond fast, process async.** Providers retry if you do not return 2xx quickly,
which can cause duplicate processing and timeouts. Acknowledge immediately (return
200), then do the real work on a queue.

**Be idempotent.** Because providers retry, you will receive the same event more
than once. Dedupe on the event id so processing twice is harmless (see the
idempotency tutorial).

**Return the right codes.** 2xx = received (the provider stops retrying). A 4xx
for a bad signature; a 5xx if you genuinely failed and want a retry. Returning 200
on failure means the event is lost forever.

**Make testing possible.** Webhooks are async and external; log every received
event with its id, and provide a way to replay one in development.`,
  },
  {
    id: 'tut-profiling',
    subjectId: 'performance',
    title: 'Profiling: Finding the Slow Endpoint',
    minutes: 10,
    body: `Performance work without measurement is guessing. The discipline: measure, find
the real bottleneck, fix that one thing, measure again.

**Start at the percentiles.** Look at p95/p99 latency per endpoint, not averages.
Averages hide the tail where real users hurt. One slow endpoint usually dominates;
fix it before anything else (the *Latency Percentile* drill).

**The usual suspect: the database.** Most "slow endpoint" tickets are a slow query
or too many queries. Two patterns dominate:
- **Missing index** -> a sequential scan. EXPLAIN ANALYZE shows it; add the right
  index (see the indexes tutorial).
- **N+1 queries** -> one query to list items, then one per item. 1 + 50 queries
  where 2 would do. Fix with a join, an IN query, or eager loading
  (select_related/prefetch in Django, dataloaders in GraphQL). The *N+1 Query
  Hunt* drill covers this.

**Then the obvious wins:**
- Add caching for hot, rarely-changing reads (mind the failure modes).
- Remove blocking work from the request path; push it to a queue.
- Watch for accidental O(n^2) in code and serialization of large payloads.

**Profile, do not guess.** Use a profiler / APM to see where time actually goes
(DB vs CPU vs external call). The biggest mistake is optimizing the part that was
never the bottleneck.

**Load test before you ship.** Behavior under 1 user and under 1000 differs
(connection pools, locks, GC). Test at expected and 10x traffic so the surprise
is in staging, not production.`,
  },
  {
    id: 'tut-logging',
    subjectId: 'devops',
    title: 'Logging That Helps at 3 AM',
    minutes: 9,
    body: `Logs are written for the person debugging an incident half-asleep. Optimize for
that moment.

**Structured, not prose.** Emit JSON (or key=value), not free-text sentences. You
cannot grep or aggregate "User Bob had a problem with order 42". You can query
{ "event": "order_failed", "orderId": 42, "userId": "bob" }.

**Correlate with a request id.** Generate an id per incoming request (or accept a
trace header), attach it to every log line and pass it downstream. Now you can
follow one request across services with a single filter. This is the single most
useful logging practice.

**Log levels with intent.**
- ERROR: something failed that needs attention.
- WARN: recovered from something suspicious.
- INFO: significant business events (order created).
- DEBUG: detail for development, usually off in prod.
Do not log every line at INFO; noise hides signal.

**Never log secrets or PII.** Tokens, passwords, full card numbers, personal data:
keep them out of logs (mask them, as in the *Mask PII* drill). A log aggregator is
a juicy target and often less protected than your database.

**Write to stdout.** In twelve-factor style, log to standard out and let the
platform collect, ship, and rotate. Do not manage log files in the app.

**Make errors actionable.** An error log should answer "what failed, for whom, and
with what context" so the on-call engineer can act without reproducing it. Pair
logs with metrics (rates, percentiles) and traces (where the time went).`,
  },
  {
    id: 'tut-outbox',
    subjectId: 'architecture',
    title: 'The Dual-Write Problem and the Outbox',
    minutes: 10,
    body: `A subtle, common bug: you update the database AND publish an event, and the two
can get out of sync. The outbox pattern fixes it.

**The dual-write problem.** Your handler does two writes to two systems:

    db.save(order)            // 1: commit to the database
    broker.publish(event)     // 2: publish to Kafka/RabbitMQ

If the process crashes between 1 and 2, the order exists but no event was sent
(downstream never learns). If you reorder them and 1 fails after 2, you published
an event for an order that does not exist. There is no atomic transaction across a
database and a broker.

**The outbox pattern.** Write the event to an **outbox table in the same database
transaction** as the business change:

    BEGIN;
      INSERT INTO orders ...;
      INSERT INTO outbox (event_type, payload) VALUES (...);
    COMMIT;

Now the order and the intent-to-publish commit atomically. A separate **relay**
process polls the outbox (or tails the DB change log) and publishes events to the
broker, marking them sent. The *Transactional Outbox* problem drills this.

**Why it works.** The only source of truth is the database transaction. If it
commits, the event is guaranteed to be in the outbox and will eventually be
published (at-least-once, so consumers must be idempotent). If it rolls back,
neither happened.

**The trade-off:** events are published slightly after the commit (eventual), and
you run a relay. That is a small price for never losing or inventing events.

**Related:** change data capture (CDC) tools like Debezium implement the relay by
reading the database's write-ahead log directly.`,
  },
  {
    id: 'tut-search',
    subjectId: 'sql',
    title: 'Full-Text Search and Inverted Indexes',
    minutes: 9,
    body: `"WHERE description LIKE '%shoe%'" does not scale and does not rank. Real search
uses an inverted index, the data structure behind every search engine.

**The inverted index.** Instead of mapping documents to their words, it maps each
word to the list of documents containing it:

    "shoe"  -> [doc1, doc7, doc42]
    "red"   -> [doc7, doc99]

A query for "red shoe" intersects the two lists, so lookups are fast no matter how
many documents there are. Building one is a great exercise (tokenize, then map
terms to doc ids, like a specialized groupBy).

**Analysis matters as much as the index.** Before indexing, text is processed:
lowercasing, tokenizing, removing stop words ("the", "a"), and **stemming**
("running" -> "run") so "run" matches "running". The same analysis runs on the
query so they line up.

**Ranking.** Search returns results in relevance order, classically with TF-IDF or
BM25: a term is more significant if it appears often in a document (term
frequency) but is rare across all documents (inverse document frequency). This is
why "the" barely affects ranking but "photosynthesis" does.

**Where it runs.** Postgres has built-in full-text search (tsvector/tsquery) which
is plenty for many apps. Dedicated engines (Elasticsearch, OpenSearch) add
scale, faceting, fuzzy matching, and aggregations.

**Keep it in sync.** The search index is a derived read model of your source data.
Update it on writes (often via the outbox/event stream), and accept that it is
eventually consistent with the database.`,
  },
  {
    id: 'tut-clocks',
    subjectId: 'system-design',
    title: 'Clocks, Ordering, and Why Time Is Hard',
    minutes: 10,
    body: `In a distributed system you cannot trust wall-clock timestamps to order events.
Understanding why prevents a class of subtle bugs.

**Wall clocks drift and jump.** Each machine's clock is slightly off and gets
corrected by NTP, which can jump time backward. So "event A has an earlier
timestamp than B" does not reliably mean A happened first. Never use timestamps
from different machines to decide ordering in a way that affects correctness.

**Logical clocks (Lamport).** A counter that increments on each event and travels
with messages (receiver sets its clock to max(local, received) + 1). It gives a
consistent "happened-before" ordering without synchronized wall clocks, though it
cannot tell you two events were truly concurrent.

**Vector clocks.** A per-node counter map. Comparing two vector clocks tells you
if one happened before the other or if they are **concurrent** (genuinely
independent, a conflict to resolve). The *Compare Vector Clocks* drill implements
exactly this, returning before/after/concurrent/equal.

**Why it matters practically:**
- **Last-write-wins** using wall clocks can silently drop data when clocks
  disagree. Some stores use vector clocks to detect conflicts instead.
- Distributed unique ids (Snowflake-style) combine a timestamp with a node id and
  a sequence so ids are roughly time-ordered without colliding across machines.
- "Read your own writes" breaks under replication lag, a time/ordering problem in
  disguise (see the replication tutorial).

**Takeaway:** for correctness, reason about causality (what caused what), not the
clock on the wall. Use logical or vector clocks when ordering across nodes must be
reliable.`,
  },
]
