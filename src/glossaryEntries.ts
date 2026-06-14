import type { DiagramSpec } from './Diagram'
import { glossaryId, glossaryTerms } from './glossary'

// The encyclopedia data model. Every glossary term becomes an entry with at
// least a one-line `short` (carried from glossary.ts). Important terms also get
// a rich `body`, concrete `examples`, `diagrams`, and `related` links. The
// engine is built so enriching the remaining terms is just adding to RICH.

export type GlossaryCategory =
  | 'HTTP & Web'
  | 'APIs'
  | 'Databases'
  | 'Security'
  | 'Caching & Async'
  | 'Scale & Reliability'
  | 'Operations'
  | 'Language & Runtime'

export type GlossaryEntry = {
  term: string
  id: string
  category: GlossaryCategory
  short: string
  aka?: string[]
  body?: string[]
  examples?: string[]
  diagrams?: DiagramSpec[]
  related?: string[]
}

// Terms grouped into categories (mirrors the old appendix areas). Anything not
// listed falls back to 'Operations'.
const CATEGORY_TERMS: Record<GlossaryCategory, string[]> = {
  'HTTP & Web': ['URL', 'DNS', 'TCP', 'TLS', 'HTTP', 'request', 'response', 'header', 'body', 'query string', 'status code', 'reverse proxy', 'CORS', 'request path', 'webhook'],
  APIs: ['API', 'endpoint', 'JSON', 'middleware', 'service', 'service shape', 'business rule', 'validation', 'controller', 'repository', 'config', 'framework', 'API gateway'],
  Databases: ['database', 'SQL', 'PostgreSQL', 'table', 'primary key', 'foreign key', 'index', 'transaction', 'migration', 'N+1 query'],
  Security: ['authentication', 'authorization', 'JWT', 'OAuth', 'CSRF', 'XSS'],
  'Caching & Async': ['cache', 'CDN', 'cache invalidation', 'queue', 'worker', 'dead-letter queue', 'idempotency', 'retry', 'backpressure', 'rate limit'],
  'Scale & Reliability': ['horizontal scaling', 'sharding', 'replication', 'load balancer', 'consistent hashing', 'microservices', 'CAP theorem', 'eventual consistency'],
  Operations: ['deployment', 'CI/CD', 'container', 'observability', 'log', 'metric', 'trace', 'latency', 'SLO', 'graceful shutdown'],
  'Language & Runtime': ['function', 'class', 'object', 'array', 'dictionary', 'for loop', 'while loop', 'runtime', 'concurrency model', 'side effect', 'memory usage', 'dependency management', 'runtime profiling'],
}

function categoryFor(term: string): GlossaryCategory {
  for (const [cat, terms] of Object.entries(CATEGORY_TERMS) as [GlossaryCategory, string[]][]) {
    if (terms.includes(term)) return cat
  }
  return 'Operations'
}

type Rich = {
  body?: string[]
  examples?: string[]
  diagrams?: DiagramSpec[]
  related?: string[]
}

// Deeply authored entries. Keyed by exact term name.
const RICH: Record<string, Rich> = {
  webhook: {
    body: [
      "**Polling is the problem webhooks solve.** Without webhooks, to know when something happens in another service (a payment clears, a build finishes, a file uploads) you have to keep asking: \"anything new yet? ... now? ... now?\" Most of those calls return nothing, wasting requests and adding delay.",
      '**A webhook flips the direction.** You register a URL with the provider once. When the event happens, the provider sends an HTTP POST to your URL with a JSON body describing it. You find out the instant it happens, and you made zero wasted calls.',
      "**Delivery is at-least-once, so duplicates are normal.** The provider retries if your endpoint is slow or errors, which means the same event can arrive twice. Every webhook handler must be idempotent: process by the event's id and skip ids you have already seen.",
      '**You must verify the caller.** Anyone can POST to a public URL. Real providers sign each request (an HMAC of the body in a header); you recompute the signature with your shared secret and reject anything that does not match. Acknowledge fast (return 200 quickly), then do the slow work in a queue, so the provider does not time out and retry.',
    ],
    examples: [
      'Stripe POSTs to your /webhooks/stripe URL when a payment succeeds, so you never poll Stripe asking "paid yet?"',
      'GitHub calls your URL on every push, which is how CI systems start a build the moment you commit.',
      'Shopify notifies your app when an order is placed; Twilio when an SMS is delivered; Slack when someone uses your slash command.',
      'The handler reads event.id, checks a "processed_events" table, and returns early if it has seen that id before (idempotency against retries).',
    ],
    diagrams: [
      {
        caption: 'Polling vs webhook: the webhook removes the wasted "anything new?" calls.',
        layout: 'row',
        nodes: [
          { id: 'you', label: 'Your app', accent: 'compute' },
          { id: 'prov', label: 'Provider', sub: 'Stripe, GitHub', accent: 'edge' },
        ],
        edges: [
          { from: 'you', to: 'prov', label: 'poll: anything new?', dashed: true },
          { from: 'prov', to: 'you', label: 'event: POST /webhook', dashed: false },
        ],
      },
      {
        caption: 'Webhook flow: verify the signature, ack fast, process async, dedupe on event id.',
        layout: 'row',
        nodes: [
          { id: 'ev', label: 'Event fires', sub: 'payment succeeded', accent: 'edge' },
          { id: 'post', label: 'POST your URL', sub: 'signed body', accent: 'compute' },
          { id: 'verify', label: 'Verify + 200', sub: 'check HMAC', accent: 'success' },
          { id: 'queue', label: 'Queue + dedupe', sub: 'by event id', accent: 'queue' },
        ],
      },
    ],
    related: ['idempotency', 'queue', 'API', 'rate limit'],
  },

  replication: {
    body: [
      '**Replication copies the database onto multiple machines** so reads can be spread out and so the system survives a machine dying. It is usually the first database scaling move after indexing and caching.',
      '**Primary-replica (master-slave).** All writes go to one primary; the primary streams its changes to read replicas. Reads fan out across the replicas, so a read-heavy system gets many more read machines. If the primary dies, a replica is promoted to take its place (failover).',
      '**Replication lag is the catch.** Replicas are always slightly behind the primary. A user who writes their new email to the primary and immediately reads from a lagging replica can see the old value, a bug that looks like the write vanished. The fixes are reading your own writes from the primary, or waiting for the replica to catch up.',
      '**Multi-primary (master-master)** lets several nodes accept writes, which scales writes too, but two nodes can edit the same row at once and now you have a conflict to resolve. Most systems avoid this until they truly need write scaling.',
    ],
    examples: [
      'A read-heavy product catalog: 1 primary takes the rare writes, 5 replicas serve the flood of reads, so the system handles 6x the read load.',
      'Failover: the primary\'s disk fails at 2am, a replica is promoted automatically, and the site stays up with a brief blip instead of an outage.',
      'Replication lag bug: a user updates their profile, the next page load hits a replica that has not caught up, and the change appears to have been lost.',
      'Read-your-writes fix: after a write, route that user\'s reads to the primary for a few seconds so they always see their own change.',
    ],
    diagrams: [
      {
        caption: 'Primary-replica: writes hit the primary, which streams changes to read replicas.',
        layout: 'fanout',
        nodes: [
          { id: 'primary', label: 'Primary DB', sub: 'all writes', accent: 'primary' },
          { id: 'r1', label: 'Read replica 1', accent: 'replica' },
          { id: 'r2', label: 'Read replica 2', accent: 'replica' },
          { id: 'r3', label: 'Read replica 3', accent: 'replica' },
        ],
        edges: [
          { from: 'primary', to: 'r1', label: 'stream changes' },
          { from: 'primary', to: 'r2' },
          { from: 'primary', to: 'r3' },
        ],
      },
      {
        caption: 'Reads fan out to replicas; writes still funnel to the one primary.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App servers', accent: 'compute' },
          { id: 'primary', label: 'Primary', sub: 'writes', accent: 'primary' },
          { id: 'replicas', label: 'Replicas', sub: 'reads', accent: 'replica' },
        ],
        edges: [
          { from: 'app', to: 'primary', label: 'write' },
          { from: 'app', to: 'replicas', label: 'read' },
        ],
      },
    ],
    related: ['sharding', 'horizontal scaling', 'eventual consistency', 'CAP theorem', 'database'],
  },

  sharding: {
    body: [
      "**Sharding splits one table's rows across several machines** so that writes and storage scale past what a single database can hold. Each shard holds a slice of the data.",
      '**The shard key is everything.** You pick a column (often a hash of the user id) that decides which shard a row lives on. A good key spreads rows evenly. A bad key creates a hot shard: one machine takes most of the traffic while the others sit idle.',
      '**Cross-shard queries are the cost.** A query that needs rows from many shards has to hit them all and combine the results, which is slow and complex. Joins across shards are painful, which is why teams delay sharding as long as indexes, replicas, and caching can carry the load.',
    ],
    examples: [
      'Shard users by hash(user_id) % 4: each of the 4 machines holds roughly a quarter of users, and one user\'s data always lands on the same shard.',
      'Bad key: sharding a fast-growing app by signup_year puts every new user on the current-year shard, which melts while old-year shards idle.',
      'Hot key: a chat app sharded by channel_id has one channel with 10M members that saturates its single shard.',
    ],
    diagrams: [
      {
        caption: 'Sharding by hash(user_id): each shard owns a slice of the rows.',
        layout: 'fanout',
        nodes: [
          { id: 'router', label: 'Shard router', sub: 'hash(key) % N', accent: 'compute' },
          { id: 's0', label: 'Shard 0', sub: 'users A-...', accent: 'storage' },
          { id: 's1', label: 'Shard 1', accent: 'storage' },
          { id: 's2', label: 'Shard 2', accent: 'storage' },
        ],
      },
    ],
    related: ['replication', 'consistent hashing', 'horizontal scaling', 'database', 'index'],
  },

  'load balancer': {
    body: [
      '**A load balancer is the single front door** in front of a pool of identical servers. Clients only know the balancer\'s address; it forwards each request to a healthy backend, so the pool can grow, shrink, and redeploy invisibly.',
      '**Health checks are most of its value.** The balancer constantly pings each backend and stops routing to any that fail. A crashed server becomes a non-event instead of an outage, because traffic just flows to the survivors.',
      '**Algorithms.** Round-robin rotates evenly; least-connections favors the least-busy server (better when request costs vary); weighted sends more to bigger machines; hash pins a client to a server. **L4** balancers route on IP and port; **L7** balancers read the HTTP request and can route by path or header.',
      '**It needs its own redundancy.** Everything funnels through the balancer, so one balancer is a single point of failure. Production runs them in redundant pairs with automatic failover.',
    ],
    examples: [
      'Round-robin across 3 servers: req1 to A, req2 to B, req3 to C, req4 to A, and so on.',
      'Server B fails its health check and is pulled from rotation within seconds; users never see an error.',
      'An L7 balancer routes /api to the API servers and /static to a separate static-file pool.',
    ],
    diagrams: [
      {
        caption: 'One front door spreads traffic across a pool and routes around failures.',
        layout: 'fanout',
        nodes: [
          { id: 'lb', label: 'Load balancer', sub: 'health checks', accent: 'edge' },
          { id: 'a', label: 'Server A', accent: 'compute' },
          { id: 'b', label: 'Server B', sub: 'down', accent: 'danger' },
          { id: 'c', label: 'Server C', accent: 'compute' },
        ],
        edges: [
          { from: 'lb', to: 'a' },
          { from: 'lb', to: 'b', dashed: true, label: 'removed' },
          { from: 'lb', to: 'c' },
        ],
      },
    ],
    related: ['horizontal scaling', 'reverse proxy', 'consistent hashing', 'microservices'],
  },

  cache: {
    body: [
      '**A cache keeps a copy of expensive-to-fetch data somewhere cheap to read.** Reading from memory is roughly ten thousand times faster than a database query, so serving from cache when you can is the single biggest performance lever in most systems.',
      '**Hit, miss, evict.** A hit means the cache had the data (fast path). A miss means it did not, so you pay the slow fetch and usually store the result for next time. Eviction is the cache throwing data out when memory fills. Hit rate, the fraction of reads served from cache, is the health metric.',
      '**Cache-aside is the common pattern.** The app checks the cache; on a miss it reads the database and writes the value back into the cache with a time-to-live (TTL). The cost of every cache is staleness: the copy can fall behind the source, so each cached thing needs a staleness budget.',
    ],
    examples: [
      'A 95% hit rate in front of a 50ms query means 95% of reads return in under a millisecond and the database does a twentieth of the work.',
      'Cache the rendered homepage for 60 seconds; cache a user session in Redis; cache a country dropdown for a day.',
      'Do not cache an account balance with a long TTL: it is visible money and must reflect writes immediately.',
    ],
    diagrams: [
      {
        caption: 'Cache-aside: check the cache, fall back to the database on a miss, store the result.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App', accent: 'compute' },
          { id: 'cache', label: 'Cache', sub: 'Redis', accent: 'cache' },
          { id: 'db', label: 'Database', accent: 'storage' },
        ],
        edges: [
          { from: 'app', to: 'cache', label: '1. check' },
          { from: 'cache', to: 'db', label: '2. miss -> read', dashed: true },
        ],
      },
    ],
    related: ['CDN', 'cache invalidation', 'latency', 'database'],
  },

  CDN: {
    body: [
      '**A CDN (Content Delivery Network) is a fleet of edge servers near users worldwide.** Static assets (images, CSS, JS, video) and cacheable responses are served from the nearest edge instead of crossing the planet to your origin, which cuts latency and offloads your servers.',
      '**Pull vs push.** A pull CDN fetches from your origin on the first request for a file and caches it at the edge; a push CDN has you upload content ahead of time. Pull is the common default.',
      '**It is a cache, so it can go stale.** Content is served with a TTL or a hashed filename. The standard trick for static assets is a long TTL plus a content hash in the filename, so a deploy changes the URL instead of fighting the cache.',
    ],
    examples: [
      'A user in Tokyo loads your site hosted in Virginia: the CDN serves the images from an edge in Tokyo, not from Virginia.',
      'app.a1b2c3.js cached for a year; the next deploy ships app.d4e5f6.js, a new URL, so caches never serve the old bundle.',
    ],
    diagrams: [
      {
        caption: 'Edge servers near users serve cached content; only misses reach the origin.',
        layout: 'fanout',
        nodes: [
          { id: 'origin', label: 'Origin', sub: 'your server', accent: 'storage' },
          { id: 'e1', label: 'Edge: Tokyo', accent: 'edge' },
          { id: 'e2', label: 'Edge: Frankfurt', accent: 'edge' },
          { id: 'e3', label: 'Edge: Sao Paulo', accent: 'edge' },
        ],
      },
    ],
    related: ['cache', 'latency', 'reverse proxy'],
  },

  'consistent hashing': {
    body: [
      '**The mod-N problem.** To spread keys across servers you might use hash(key) % N. It works until N changes: add one server and the divisor goes from N to N+1, so almost every key now maps somewhere else. Every cache entry misses at once, a cold-cache stampede onto the database, exactly when you were trying to add capacity.',
      '**The ring.** Consistent hashing places both servers and keys on a circle. A key belongs to the next server clockwise from it. Add or remove a server and only the keys in that one arc move; everything else stays put. Adding a fifth node to four reshuffles about a fifth of keys instead of nearly all of them.',
      '**Virtual nodes.** A few servers placed on the ring land unevenly, so each physical server is placed at many points. This smooths the distribution and means a departing server\'s load spreads across all the others rather than dumping onto its single neighbor.',
    ],
    examples: [
      'Naive: a 4-node cache adds a 5th node and ~80% of keys remap and miss at once.',
      'Ring: the same 4-to-5 change moves only ~20% of keys; the rest keep hitting.',
      'Used by distributed caches, sharded stores like DynamoDB, and CDN request routing.',
    ],
    diagrams: [
      {
        caption: 'Adding a node only moves the keys in one arc of the ring, not everything.',
        layout: 'row',
        nodes: [
          { id: 'k', label: 'Key', sub: 'hash to a point', accent: 'compute' },
          { id: 'ring', label: 'Hash ring', sub: 'servers placed on it', accent: 'edge' },
          { id: 's', label: 'Next server', sub: 'clockwise', accent: 'storage' },
        ],
      },
    ],
    related: ['sharding', 'cache', 'load balancer'],
  },

  'CAP theorem': {
    body: [
      '**Once data lives on more than one machine, CAP names a hard truth:** during a network partition you can keep at most two of Consistency (every read sees the latest write), Availability (every request gets a non-error answer), and Partition tolerance. Networks do partition, so the real choice is consistency or availability.',
      '**CP systems choose consistency:** when nodes cannot reach each other, they refuse requests rather than serve possibly-stale data. Right for banking and inventory, where a wrong answer is worse than no answer.',
      '**AP systems choose availability:** they keep answering during a partition and reconcile afterward, accepting brief staleness. Right for social feeds and catalogs, where being up beats being perfectly current.',
      '**It is a per-feature choice, not one company-wide setting.** The same system runs CP for payments and AP for the activity feed.',
    ],
    examples: [
      'Payments (CP): during a partition, reject the transfer and show "try again" rather than risk a wrong balance.',
      'Likes counter (AP): keep serving, let replicas converge, accept that the count is a few seconds behind.',
    ],
    diagrams: [
      {
        caption: 'During a partition you pick: refuse to stay correct (CP), or answer and reconcile later (AP).',
        layout: 'row',
        nodes: [
          { id: 'part', label: 'Partition', sub: 'link fails', accent: 'danger' },
          { id: 'cp', label: 'CP: refuse', sub: 'stay correct', accent: 'primary' },
          { id: 'ap', label: 'AP: answer', sub: 'reconcile later', accent: 'replica' },
        ],
        edges: [
          { from: 'part', to: 'cp' },
          { from: 'part', to: 'ap' },
        ],
      },
    ],
    related: ['eventual consistency', 'replication', 'sharding'],
  },

  queue: {
    body: [
      '**A queue moves slow work out of the request.** The request handler appends a message describing work to do; a separate worker process reads messages and does the work later. The request returns in milliseconds instead of waiting for the slow part.',
      '**It absorbs spikes and outages.** Ten thousand orders in a minute become a backlog the workers drain steadily, and a failing email provider just means messages wait instead of checkout breaking.',
      '**Delivery is at-least-once.** A worker can crash after doing the work but before acknowledging, so the message is redelivered and the work runs twice. Consumers must be idempotent. Messages that fail every retry go to a dead-letter queue for inspection.',
    ],
    examples: [
      'Place order: save the order now (fast), enqueue send-email, notify-warehouse, and track-analytics for workers to handle.',
      'Upload video: store the file and return an id immediately; transcode, thumbnail, and moderate in the background.',
    ],
    diagrams: [
      {
        caption: 'Producer enqueues; workers drain; failed messages land in the dead-letter queue.',
        layout: 'row',
        nodes: [
          { id: 'api', label: 'Request', sub: 'producer', accent: 'compute' },
          { id: 'q', label: 'Queue', accent: 'queue' },
          { id: 'w', label: 'Workers', sub: 'consumers', accent: 'compute' },
          { id: 'dlq', label: 'Dead-letter', sub: 'failed', accent: 'danger' },
        ],
        edges: [
          { from: 'api', to: 'q', label: 'enqueue' },
          { from: 'q', to: 'w', label: 'deliver' },
          { from: 'w', to: 'dlq', label: 'give up', dashed: true },
        ],
      },
    ],
    related: ['worker', 'dead-letter queue', 'idempotency', 'retry', 'backpressure'],
  },

  idempotency: {
    body: [
      '**An operation is idempotent when doing it twice has the same effect as doing it once.** Setting status to "paid" is idempotent; adding 10 to a balance is not. This is the umbrella for the duplicates that queues and webhooks deliver.',
      '**The standard technique.** Give every message or request a unique id. The consumer records processed ids and skips any it has already seen: check, do the work, record the id, all atomically so two workers cannot both pass the check.',
      '**Payment APIs expose it as an idempotency key:** send the same key twice and the second charge returns the first result instead of charging again.',
    ],
    examples: [
      'A retried POST /charge with the same idempotency key returns the original charge rather than billing the card twice.',
      'A webhook handler reads event.id, finds it in the processed table, and returns early.',
    ],
    related: ['queue', 'webhook', 'retry', 'rate limit'],
  },

  'rate limit': {
    body: [
      '**A rate limit caps how many requests a client may make in a window**, protecting a service from abuse, runaway clients, and accidental floods. Over the limit, the server returns 429 Too Many Requests.',
      '**Common algorithms.** Fixed window counts requests per clock interval (simple, but bursty at boundaries). Sliding window smooths that. Token bucket refills tokens at a steady rate and lets short bursts through, which is the most common production choice.',
      '**Where it lives.** Often at the API gateway or a shared store like Redis, so the limit is enforced across all servers rather than per-instance.',
    ],
    examples: [
      'Allow 100 requests per minute per API key; the 101st in that minute gets 429 with a Retry-After header.',
      'Token bucket: 10 tokens, refilled 1/second, so a client can burst 10 then settles to 1/second.',
    ],
    related: ['API gateway', 'idempotency', 'backpressure'],
  },

  'horizontal scaling': {
    body: [
      '**Horizontal scaling (scale out) adds more ordinary machines** and splits work across them, versus vertical scaling (scale up) which buys one bigger machine. Scaling out has no real ceiling and survives a machine dying.',
      '**It requires statelessness.** Scaling out only works when any server can handle any request, so per-user state (sessions) must live in a shared store like Redis or in a token the client carries, not in one server\'s memory.',
      '**A load balancer sits in front** of the pool to spread requests and route around failures.',
    ],
    examples: [
      '4 stateless app servers behind a load balancer handle ~4x the traffic of one, and losing one just trims capacity.',
      'Move sessions from local memory to Redis first, or the new servers appear logged-out to half of requests.',
    ],
    related: ['load balancer', 'sharding', 'replication', 'microservices'],
  },

  DNS: {
    body: [
      '**DNS (Domain Name System) translates a hostname into an IP address.** Before a client can connect to api.example.com it asks DNS for the machine\'s address, like looking up a street address for a building name.',
      '**It is the first hop in every request,** and a common failure point: wrong DNS records, or slow resolution, make a healthy server unreachable.',
      '**Record types you meet:** A (name to IPv4), AAAA (IPv6), CNAME (alias to another name), MX (mail), NS (which servers are authoritative). DNS responses are cached with a TTL to avoid asking every time.',
    ],
    examples: [
      'A record: api.example.com -> 93.184.216.34.',
      'CNAME: www.example.com -> example.com, so both resolve to the same place.',
    ],
    diagrams: [
      {
        caption: 'DNS resolves the name to an IP before any connection is made.',
        layout: 'row',
        nodes: [
          { id: 'c', label: 'Client', accent: 'client' },
          { id: 'dns', label: 'DNS', sub: 'name -> IP', accent: 'edge' },
          { id: 's', label: 'Server', sub: '93.184.216.34', accent: 'compute' },
        ],
        edges: [
          { from: 'c', to: 'dns', label: 'resolve' },
          { from: 'c', to: 's', label: 'connect', dashed: true },
        ],
      },
    ],
    related: ['URL', 'TCP', 'CDN', 'reverse proxy'],
  },

  'reverse proxy': {
    body: [
      '**A reverse proxy sits in front of your app and speaks for it.** It receives client requests and forwards them to backend servers, while handling cross-cutting work: terminating TLS, caching responses, compressing, and serving static files.',
      '**A load balancer is a specialized reverse proxy** focused on spreading traffic across many backends. Tools like Nginx do both jobs.',
      '**Versus a forward proxy:** a forward proxy sits in front of clients and speaks for them (corporate egress); a reverse proxy sits in front of servers and speaks for them.',
    ],
    examples: [
      'Nginx terminates HTTPS, serves /static directly, and forwards /api to the app servers.',
      'It adds headers like X-Forwarded-For so the app still sees the real client IP.',
    ],
    diagrams: [
      {
        caption: 'The reverse proxy fronts the app: TLS, caching, static files, then forwards the rest.',
        layout: 'row',
        nodes: [
          { id: 'c', label: 'Client', accent: 'client' },
          { id: 'rp', label: 'Reverse proxy', sub: 'Nginx', accent: 'edge' },
          { id: 'app', label: 'App servers', accent: 'compute' },
        ],
      },
    ],
    related: ['load balancer', 'CDN', 'TLS', 'horizontal scaling'],
  },

  'API gateway': {
    body: [
      '**An API gateway is the single front door** in front of many services. Clients call the gateway, which routes each request to the right service and centralizes cross-cutting concerns in one place: authentication, rate limiting, request logging, and response aggregation.',
      '**It decouples clients from the service map.** Services can scale, move, and redeploy behind the gateway without clients knowing. It pairs with service discovery, which tracks where each service instance currently lives.',
    ],
    examples: [
      'GET /orders/42 hits the gateway, which authenticates the caller, checks the rate limit, then routes to the orders service.',
      'One place enforces auth for all 12 services, instead of each service reimplementing it.',
    ],
    diagrams: [
      {
        caption: 'One door routes to many services and enforces policy once.',
        layout: 'fanout',
        nodes: [
          { id: 'gw', label: 'API gateway', sub: 'auth, limits', accent: 'edge' },
          { id: 'u', label: 'Users service', accent: 'compute' },
          { id: 'o', label: 'Orders service', accent: 'compute' },
          { id: 'p', label: 'Payments service', accent: 'compute' },
        ],
      },
    ],
    related: ['microservices', 'rate limit', 'reverse proxy', 'authentication'],
  },

  JWT: {
    body: [
      '**A JWT (JSON Web Token) is a signed token the client carries** to prove who it is. At login the server signs a token containing the user id and an expiry; the client sends it in the Authorization: Bearer header on each request, and the server verifies the signature instead of looking anything up.',
      '**Signed, not encrypted.** Anyone can base64-decode a JWT and read its payload. Signing proves it was not tampered with; it hides nothing. Never put secrets inside a JWT.',
      '**Revocation is the hard part.** A signed token is valid until it expires, so you cannot instantly cancel one. The standard mitigation is short lifetimes plus refresh tokens, or a denylist.',
    ],
    examples: [
      'Header.Payload.Signature, e.g. eyJhbGc... where the payload decodes to { "sub": 42, "exp": 1699999999 }.',
      'A leaked JWT keeps working until expiry, which is why lifetimes are kept short.',
    ],
    related: ['authentication', 'authorization', 'OAuth'],
  },

  transaction: {
    body: [
      '**A transaction groups database operations into an all-or-nothing unit.** Either every step commits, or if any fails the whole thing rolls back, so the database never lands in a half-finished state.',
      "**ACID** names the guarantees: Atomicity (all or nothing), Consistency (constraints hold), Isolation (concurrent transactions do not corrupt each other), Durability (a committed result survives a crash).",
      '**The classic example is a transfer:** debit one account and credit another. Wrapped in a transaction, a crash between the two steps rolls both back, so money is never created or destroyed.',
    ],
    examples: [
      'BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;',
      'If the second UPDATE fails, the ROLLBACK undoes the first, so account 1 is not debited without account 2 being credited.',
    ],
    related: ['database', 'SQL', 'eventual consistency'],
  },

  index: {
    body: [
      '**An index is a sorted lookup structure that turns a full-table scan into a direct jump,** like the index at the back of a book versus reading every page. Without one, finding rows by a column means reading every row.',
      '**It is the cheapest database scaling move:** the right index on a column you filter or join by can turn a multi-second query into a millisecond one.',
      '**The cost is writes.** Every index must be updated when rows change, so each one slows inserts and updates slightly. Index the columns you actually query by, not every column.',
    ],
    examples: [
      'A query filtering orders by user_id is slow on 50M rows until you add an index on user_id, then it is instant.',
      'Primary keys are indexed automatically; foreign keys you join on usually earn an explicit index.',
    ],
    related: ['database', 'SQL', 'primary key', 'N+1 query'],
  },

  'eventual consistency': {
    body: [
      '**Eventual consistency means replicas converge over time:** a read may briefly see stale data, but if writes stop, all copies eventually agree. It is the normal mode for AP systems that choose availability over strict correctness.',
      '**Contrast with strong consistency,** where every read always sees the latest write. Strong is required for money and inventory; eventual is fine for likes, view counts, and feeds, where a few seconds of lag is invisible.',
    ],
    examples: [
      'You like a post; the count updates instantly for you but takes a moment to reflect for users reading a different replica.',
      'A newly posted tweet appears for some followers a beat before others as it propagates.',
    ],
    related: ['CAP theorem', 'replication', 'cache invalidation'],
  },
}

export const glossaryEntries: GlossaryEntry[] = glossaryTerms
  .map((t) => {
    const rich = RICH[t.term]
    return {
      term: t.term,
      id: glossaryId(t.term),
      category: categoryFor(t.term),
      short: t.definition,
      aka: t.synonyms,
      ...rich,
    }
  })
  .sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()))

export const glossaryEntryById = new Map(glossaryEntries.map((e) => [e.id, e]))
