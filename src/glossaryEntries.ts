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
  | 'Technologies'
  | 'Patterns'
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
  'HTTP & Web': ['URL', 'DNS', 'TCP', 'TLS', 'HTTP', 'request', 'response', 'header', 'body', 'query string', 'status code', 'reverse proxy', 'CORS', 'request path', 'webhook', 'IP address', 'port', 'UDP', 'packet', 'CIDR', 'NAT', 'firewall', 'OSI model'],
  APIs: ['API', 'endpoint', 'JSON', 'middleware', 'service', 'service shape', 'business rule', 'validation', 'controller', 'repository', 'config', 'framework', 'API gateway'],
  Databases: ['database', 'SQL', 'PostgreSQL', 'table', 'primary key', 'foreign key', 'index', 'transaction', 'migration', 'N+1 query', 'write-ahead log', 'checksum'],
  Security: ['authentication', 'authorization', 'JWT', 'OAuth', 'CSRF', 'XSS'],
  'Caching & Async': ['cache', 'CDN', 'cache invalidation', 'queue', 'worker', 'dead-letter queue', 'idempotency', 'retry', 'backpressure', 'rate limit', 'bloom filter'],
  'Scale & Reliability': ['horizontal scaling', 'sharding', 'replication', 'load balancer', 'consistent hashing', 'microservices', 'CAP theorem', 'eventual consistency', 'strong consistency', 'heartbeat', 'quorum', 'leader election', 'distributed lock', 'service discovery'],
  Operations: ['deployment', 'CI/CD', 'container', 'observability', 'log', 'metric', 'trace', 'latency', 'SLO', 'graceful shutdown'],
  Technologies: ['MySQL', 'MongoDB', 'Redis', 'Memcached', 'DynamoDB', 'Cassandra', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'Amazon SQS', 'Amazon S3', 'AWS Lambda', 'Nginx', 'ZooKeeper', 'Docker', 'Kubernetes', 'Prometheus', 'Apache Spark', 'Apache Flink'],
  Patterns: ['fanout', 'hot key', 'unique ID generation', 'distributed counting', 'long polling', 'server-sent events', 'geohash', 'single point of failure', 'multi-region', 'distributed transaction', 'saga', 'circuit breaker', 'load shedding', 'chunked upload', 'multi-tenancy'],
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
    related: ['CAP theorem', 'strong consistency', 'replication', 'cache invalidation'],
  },

  'strong consistency': {
    body: [
      '**Strong consistency guarantees every read returns the most recent write,** no matter which node answers. The instant a write commits, all readers see it. It is the intuitive model and the one money requires.',
      '**It costs latency and availability.** Guaranteeing every reader sees the latest write means coordinating across nodes (waiting for a quorum, or routing reads to the primary), which is slower and, during a network partition, may mean refusing to answer at all (the CP side of CAP).',
      '**Use it where a stale answer is a real bug:** account balances, inventory counts at checkout, unique-username checks. Use eventual consistency where brief lag is invisible.',
    ],
    examples: [
      'A bank balance: after a withdrawal commits, every subsequent read must show the lower balance, never the old one.',
      'A unique-username check must see other in-flight signups, so it reads with strong consistency.',
    ],
    diagrams: [
      {
        caption: 'Strong: the read waits for the write to be visible everywhere before answering.',
        layout: 'row',
        nodes: [
          { id: 'w', label: 'Write commits', accent: 'primary' },
          { id: 'sync', label: 'Replicate', sub: 'wait for quorum', accent: 'compute' },
          { id: 'r', label: 'Read', sub: 'sees latest', accent: 'success' },
        ],
      },
    ],
    related: ['eventual consistency', 'CAP theorem', 'quorum', 'transaction'],
  },

  'bloom filter': {
    body: [
      '**A bloom filter answers one question cheaply: "have I definitely never seen this key?"** It is a small bit array plus a few hash functions. Adding a key flips a few bits on; checking a key tests those bits. If any is 0, the key is definitely absent. If all are 1, it is probably present.',
      '**No false negatives, some false positives.** It will never wrongly say "absent" for a key it holds, but it can wrongly say "maybe present" for one it does not, because bits collide. You tune the false-positive rate by sizing the array and the number of hashes.',
      '**Why it matters: skip expensive lookups.** Databases (Cassandra, Bigtable) put a bloom filter in front of each on-disk file so a read can skip files that definitely lack the key, avoiding a disk hit. A web crawler checks one before fetching a URL it may have already crawled. Tiny memory, huge savings.',
    ],
    examples: [
      'A 1 MB bloom filter can track millions of keys and answer "definitely not here" in nanoseconds, saving a disk or network read.',
      'Cassandra checks a per-file bloom filter before reading that file, so a missing key touches no disk.',
      'A "have you seen this URL?" check: a 0 bit means never, so the crawler fetches; all 1s means maybe, so it does the real check.',
    ],
    diagrams: [
      {
        caption: 'Any 0 bit means definitely absent; all 1s means probably present (check for real).',
        layout: 'row',
        nodes: [
          { id: 'key', label: 'Key', accent: 'compute' },
          { id: 'hash', label: 'k hash funcs', sub: 'set/test bits', accent: 'edge' },
          { id: 'bits', label: 'Bit array', sub: 'any 0 = absent', accent: 'cache' },
        ],
      },
    ],
    related: ['cache', 'index', 'database', 'checksum'],
  },

  'write-ahead log': {
    body: [
      '**A write-ahead log (WAL) is how databases make crashes survivable.** Before applying a change to the actual data files, the database appends a record of that change to a durable, append-only log and flushes it to disk. Only then does it acknowledge the write.',
      '**Recovery is replay.** If the process crashes mid-write, on restart the database replays the log from the last checkpoint, reapplying committed changes and discarding incomplete ones. Nothing acknowledged is ever lost: that is the Durability in ACID.',
      '**Appends are fast.** Writing sequentially to the end of a log is far cheaper than updating scattered data pages, so the WAL also batches and speeds up writes. It is the same idea behind replication (replicas consume the log) and event sourcing.',
    ],
    examples: [
      'PostgreSQL writes every change to its WAL first; a crash mid-transaction is recovered by replaying the log on startup.',
      'Replication ships the WAL to replicas, which replay it to stay in sync with the primary.',
    ],
    diagrams: [
      {
        caption: 'Append to the durable log first, then apply to data files; recover by replaying.',
        layout: 'row',
        nodes: [
          { id: 'w', label: 'Write', accent: 'compute' },
          { id: 'wal', label: 'WAL', sub: 'append + flush', accent: 'storage' },
          { id: 'data', label: 'Data files', sub: 'apply after', accent: 'primary' },
        ],
      },
    ],
    related: ['transaction', 'replication', 'database', 'checksum'],
  },

  heartbeat: {
    body: [
      '**A heartbeat is a periodic "I am alive" message** a node sends to a coordinator or its peers, every second or few seconds. As long as the beats arrive, the node is considered healthy.',
      '**Missing beats trigger action.** If a node misses several heartbeats in a row, the system declares it dead and reacts: a load balancer pulls it from rotation, a cluster reassigns its work, a leader election starts. The beat interval and the miss threshold trade detection speed against false alarms from a brief network blip.',
      '**It is the foundation of failure detection** in distributed systems: load balancer health checks, cluster membership, and primary failover all rest on heartbeats.',
    ],
    examples: [
      'A worker sends a heartbeat every 5s; after 3 missed beats the scheduler reassigns its jobs to another worker.',
      'A database replica heartbeats the primary; when the beats stop, failover promotes a replica.',
    ],
    diagrams: [
      {
        caption: 'Beats arrive: healthy. Beats stop: declared dead, work reassigned.',
        layout: 'row',
        nodes: [
          { id: 'node', label: 'Node', accent: 'compute' },
          { id: 'coord', label: 'Coordinator', sub: 'watches beats', accent: 'edge' },
          { id: 'react', label: 'No beat -> react', sub: 'reassign / failover', accent: 'danger' },
        ],
        edges: [
          { from: 'node', to: 'coord', label: 'beat every 5s' },
          { from: 'coord', to: 'react', label: 'missed', dashed: true },
        ],
      },
    ],
    related: ['load balancer', 'leader election', 'quorum', 'service discovery'],
  },

  quorum: {
    body: [
      '**A quorum is the minimum number of nodes that must agree for an operation to count.** In a replicated store with N copies, a write may require W acknowledgements and a read R responses.',
      '**The overlap rule.** If W + R > N, every read is guaranteed to overlap with the latest write on at least one node, which gives strong consistency. Lowering W or R increases availability and speed but risks reading stale data.',
      '**It is the tuning knob for CAP.** A store like Cassandra or DynamoDB lets you choose W and R per operation, sliding between fast-and-eventually-consistent and slow-and-strongly-consistent. Quorums also underlie consensus and leader election: a leader needs a majority to act.',
    ],
    examples: [
      'N=3, W=2, R=2: W+R=4 > 3, so reads always see the latest write (strong). Tolerates one node down.',
      'N=3, W=1, R=1: fast and highly available, but a read can miss a recent write (eventual).',
    ],
    diagrams: [
      {
        caption: 'W + R > N means the read set overlaps the write set, so reads see the latest write.',
        layout: 'gather',
        nodes: [
          { id: 'n1', label: 'Node 1', sub: 'wrote', accent: 'primary' },
          { id: 'n2', label: 'Node 2', sub: 'wrote', accent: 'primary' },
          { id: 'n3', label: 'Node 3', accent: 'replica' },
          { id: 'read', label: 'Read 2 of 3', sub: 'overlaps a writer', accent: 'success' },
        ],
      },
    ],
    related: ['strong consistency', 'eventual consistency', 'replication', 'leader election', 'CAP theorem'],
  },

  'leader election': {
    body: [
      '**Leader election is how distributed nodes agree on a single coordinator.** Many tasks need exactly one node in charge (assigning work, accepting writes, running a scheduled job), so the cluster elects a leader and the rest follow.',
      '**When the leader dies, elect a new one.** Followers detect the missing heartbeat, then run an election: they vote, and a candidate that wins a majority (a quorum) becomes the new leader. Requiring a majority prevents two leaders existing at once (split-brain).',
      '**Algorithms like Raft and Paxos** formalize this. You rarely implement it yourself; you rely on it inside tools like ZooKeeper, etcd, and Kafka, which use leader election under the hood.',
    ],
    examples: [
      'Kafka elects a leader broker per partition; producers and consumers talk to the leader, and a new one is elected if it fails.',
      'A cron job that must run once across 5 servers: the elected leader runs it, avoiding 5 duplicate runs.',
    ],
    diagrams: [
      {
        caption: 'Followers detect the dead leader, vote, and a majority winner becomes the new leader.',
        layout: 'row',
        nodes: [
          { id: 'dead', label: 'Leader dies', accent: 'danger' },
          { id: 'vote', label: 'Followers vote', sub: 'need a majority', accent: 'compute' },
          { id: 'new', label: 'New leader', accent: 'success' },
        ],
      },
    ],
    related: ['quorum', 'heartbeat', 'distributed lock', 'consistent hashing'],
  },

  'distributed lock': {
    body: [
      '**A distributed lock lets only one node perform a critical action at a time,** even though the nodes share no memory. It is the cross-machine version of a mutex.',
      '**Why you need it.** Five servers each run a "charge subscriptions" job at midnight. Without coordination, a customer is charged five times. A distributed lock ensures exactly one server holds the lock and does the work.',
      '**The hard parts.** The lock must expire (a holder that crashes must not block forever), so it carries a TTL with a fencing token to stop a slow, resumed holder from acting after its lease expired. Redis (Redlock) and ZooKeeper/etcd are common implementations. Often the better move is to make the operation idempotent so a missed lock is harmless.',
    ],
    examples: [
      'Redis SET lock NX PX 30000: only one node gets the lock; it auto-releases after 30s if the holder dies.',
      'A nightly billing job acquires a lock so only one of many instances runs it.',
    ],
    diagrams: [
      {
        caption: 'Only the lock holder runs the critical section; others wait or skip.',
        layout: 'gather',
        nodes: [
          { id: 'a', label: 'Node A', sub: 'holds lock', accent: 'success' },
          { id: 'b', label: 'Node B', sub: 'waits', accent: 'default' },
          { id: 'c', label: 'Node C', sub: 'waits', accent: 'default' },
          { id: 'job', label: 'Critical job', sub: 'runs once', accent: 'primary' },
        ],
        edges: [{ from: 'a', to: 'job', label: 'holder runs' }],
      },
    ],
    related: ['idempotency', 'leader election', 'quorum', 'cache'],
  },

  'service discovery': {
    body: [
      '**Service discovery is the live registry of where each service is right now.** In a dynamic deployment, instances start, stop, crash, and move addresses constantly (autoscaling, redeploys), so callers cannot hardcode an address.',
      '**How it works.** Each service registers itself on startup (and deregisters or stops heartbeating on shutdown). Callers look up a service by name and get a current, healthy address. A load balancer plus this registry keeps traffic flowing only to live instances.',
      '**Two styles.** Client-side discovery: the caller queries the registry and picks an instance. Server-side: a load balancer or gateway does the lookup. Tools: Consul, etcd, and the built-in discovery in Kubernetes and cloud platforms.',
    ],
    examples: [
      'The orders service redeploys to a new IP, re-registers, and callers resolve the new address automatically with no config edit.',
      'Kubernetes gives each service a stable DNS name that resolves to whatever pods are currently healthy.',
    ],
    diagrams: [
      {
        caption: 'Services register; callers resolve by name to a current, healthy address.',
        layout: 'row',
        nodes: [
          { id: 'svc', label: 'Service instance', sub: 'registers', accent: 'compute' },
          { id: 'reg', label: 'Registry', sub: 'name -> address', accent: 'edge' },
          { id: 'caller', label: 'Caller', sub: 'looks up by name', accent: 'compute' },
        ],
        edges: [
          { from: 'svc', to: 'reg', label: 'register + heartbeat' },
          { from: 'caller', to: 'reg', label: 'resolve' },
        ],
      },
    ],
    related: ['microservices', 'API gateway', 'load balancer', 'heartbeat'],
  },

  checksum: {
    body: [
      '**A checksum detects data corruption.** You run the data through a function that produces a small fixed-size value, send or store it alongside the data, and the receiver recomputes it. If the two differ, the data was corrupted in transit or on disk.',
      '**It catches accidental damage, not tampering.** A simple checksum (CRC32) catches bit flips from a flaky network or a bad disk sector. It does not stop a malicious change, since an attacker can recompute it; for that you need a cryptographic hash or signature.',
      '**Everywhere quietly.** TCP checksums every segment, storage systems checksum blocks to detect bit rot, and distributed systems checksum messages and files to verify a transfer arrived intact.',
    ],
    examples: [
      'A file download ships with a SHA-256 sum; you recompute it locally and compare to confirm the download was not corrupted.',
      'TCP drops and retransmits any segment whose checksum does not match.',
    ],
    diagrams: [
      {
        caption: 'Recompute on arrival and compare: a mismatch means corruption.',
        layout: 'row',
        nodes: [
          { id: 'send', label: 'Data + checksum', accent: 'compute' },
          { id: 'recv', label: 'Recompute', sub: 'on arrival', accent: 'edge' },
          { id: 'cmp', label: 'Match?', sub: 'no = corrupt', accent: 'danger' },
        ],
      },
    ],
    related: ['write-ahead log', 'TCP', 'bloom filter'],
  },

  'IP address': {
    body: [
      '**An IP address is the numeric address of a machine on a network.** Every packet carries a source and destination IP so routers know where to send it, the way a letter needs a street address.',
      '**IPv4 vs IPv6.** IPv4 is four numbers like 93.184.216.34, about 4 billion total, which the internet has run out of. IPv6 is much longer (eight hex groups) and effectively unlimited. Public IPs are globally unique; private ranges (10.x, 192.168.x) are reused inside networks and hidden behind NAT.',
      '**DNS turns names into IPs.** You type api.example.com; DNS resolves it to an IP before any connection is made.',
    ],
    examples: [
      'Public IPv4: 93.184.216.34. Private: 192.168.1.10 (only meaningful inside your home network).',
      'localhost is 127.0.0.1, the machine talking to itself.',
    ],
    related: ['DNS', 'port', 'packet', 'CIDR', 'NAT'],
  },

  port: {
    body: [
      '**A port is a number that picks which program on a machine a connection is for.** One IP address runs many services; the port (0-65535) routes the traffic to the right one. An address is "IP:port", like 93.184.216.34:443.',
      '**Well-known ports.** 80 is HTTP, 443 is HTTPS, 22 is SSH, 5432 is PostgreSQL, 6379 is Redis. Ports under 1024 are reserved; apps usually use higher ones in development (3000, 8080).',
      "**Only one program can listen on a port at a time,** which is why \"address already in use\" appears when you start a server on a port another process already holds.",
    ],
    examples: [
      'A web server listens on 443; a database on 5432; both on the same machine, told apart by port.',
      'curl http://localhost:3000 connects to whatever is listening on port 3000.',
    ],
    related: ['IP address', 'TCP', 'HTTP'],
  },

  UDP: {
    body: [
      '**UDP (User Datagram Protocol) fires packets with no guarantees.** Unlike TCP, it does not establish a connection, confirm delivery, or reorder packets. It just sends, which makes it fast and lightweight.',
      '**The trade is reliability for speed.** A lost UDP packet is simply gone; the application decides whether to care. This is right when a late packet is worse than a missing one.',
      '**Where it wins:** live video and voice (a dropped frame is better than a stutter waiting for retransmission), online games, and DNS (one small request, one small reply, retry if needed).',
    ],
    examples: [
      'A video call uses UDP: a lost frame is skipped, because pausing to resend it would freeze the call.',
      'DNS uses UDP for its quick request/response, falling back to TCP for large replies.',
    ],
    diagrams: [
      {
        caption: 'TCP guarantees ordered, confirmed delivery; UDP just sends, trading reliability for speed.',
        layout: 'row',
        nodes: [
          { id: 'tcp', label: 'TCP', sub: 'reliable, ordered', accent: 'primary' },
          { id: 'udp', label: 'UDP', sub: 'fast, no guarantees', accent: 'edge' },
        ],
        edges: [{ from: 'tcp', to: 'udp', label: 'vs', dashed: true }],
      },
    ],
    related: ['TCP', 'packet', 'IP address', 'DNS'],
  },

  packet: {
    body: [
      '**A packet is a small chunk of data with addressing metadata** that travels the network on its own. Big messages are split into many packets, each routed independently, then reassembled at the destination.',
      '**They can arrive out of order, late, or not at all.** Each packet may take a different path. TCP numbers them and reassembles and retransmits so the application sees an ordered, complete stream; UDP leaves that to you.',
      '**Each packet carries headers** (source and destination IP and port, sequence numbers) wrapping the actual payload, added and peeled off layer by layer as it moves down and up the stack.',
    ],
    examples: [
      'A 1 MB file becomes hundreds of packets that may take different routes and arrive scrambled, then TCP reorders them.',
      'A router reads each packet\'s destination IP and forwards it one hop closer.',
    ],
    related: ['TCP', 'UDP', 'IP address', 'OSI model'],
  },

  CIDR: {
    body: [
      '**CIDR notation describes a block of IP addresses** with a slash and a number: 10.0.0.0/24. The /N says how many leading bits are fixed (the network part); the rest are free for hosts.',
      '**The /N is the size.** /24 fixes 24 bits, leaving 8 bits = 256 addresses. /16 leaves 16 bits = 65,536. Smaller /N means a bigger block. /32 is a single address.',
      "**Used everywhere addresses are grouped:** subnets, routing tables, and firewall and cloud security rules (\"allow 10.0.0.0/8\" means the whole private range). Checking whether an IP falls in a block is a core networking operation.",
    ],
    examples: [
      '10.0.0.0/24 covers 10.0.0.0 through 10.0.0.255 (256 addresses).',
      'A security group rule "allow 0.0.0.0/0" means allow every IP on the internet (use with care).',
    ],
    related: ['IP address', 'NAT', 'firewall'],
  },

  NAT: {
    body: [
      '**NAT (Network Address Translation) lets many devices share one public IP.** Your phone, laptop, and TV all have private addresses (192.168.x); the router rewrites their traffic to use its single public IP on the way out, and reverses it on the way back.',
      '**Why it exists.** IPv4 ran out of addresses, so NAT stretches one public IP across a whole network. It also incidentally hides internal devices, since the outside world only sees the router.',
      '**The catch.** Outside machines cannot directly start a connection to a device behind NAT (there is no public address for it), which is why incoming connections need port forwarding and peer-to-peer apps need tricks to punch through.',
    ],
    examples: [
      'Your home: 5 devices on 192.168.1.x all appear to websites as one public IP, the router translating each connection.',
      'A server behind NAT needs port forwarding so outside traffic on a port reaches it.',
    ],
    diagrams: [
      {
        caption: 'The router rewrites many private addresses to one shared public IP.',
        layout: 'gather',
        nodes: [
          { id: 'a', label: 'Laptop', sub: '192.168.1.2', accent: 'client' },
          { id: 'b', label: 'Phone', sub: '192.168.1.3', accent: 'client' },
          { id: 'router', label: 'Router (NAT)', sub: 'one public IP', accent: 'edge' },
        ],
      },
    ],
    related: ['IP address', 'CIDR', 'firewall'],
  },

  firewall: {
    body: [
      '**A firewall allows or blocks network traffic by rules.** Each rule matches on source and destination IP, port, and protocol, and says allow or deny. Default-deny (block everything, then allow what you need) is the safe posture.',
      '**Where it sits.** At the network edge, on each host, or as a cloud "security group." A common setup: allow 443 (HTTPS) from anywhere to the load balancer, allow the database port only from the app servers, deny everything else.',
      '**It is a perimeter, not a complete defense.** A firewall stops unwanted connections, but it does not validate the content of allowed traffic, so application-layer security (auth, validation) still matters.',
    ],
    examples: [
      'A cloud security group: inbound 443 from 0.0.0.0/0, inbound 5432 only from the app subnet, everything else denied.',
      'A database should never accept connections from the public internet; the firewall enforces that.',
    ],
    diagrams: [
      {
        caption: 'Rules on IP, port, and protocol let some traffic through and drop the rest.',
        layout: 'row',
        nodes: [
          { id: 'in', label: 'Incoming traffic', accent: 'client' },
          { id: 'fw', label: 'Firewall', sub: 'allow / deny rules', accent: 'edge' },
          { id: 'app', label: 'Allowed -> app', accent: 'success' },
        ],
        edges: [
          { from: 'in', to: 'fw' },
          { from: 'fw', to: 'app', label: 'matches allow' },
        ],
      },
    ],
    related: ['CIDR', 'IP address', 'port', 'reverse proxy'],
  },

  'OSI model': {
    body: [
      '**The OSI model is a seven-layer map of how network communication is organized,** from the physical wire up to the application. Each layer does one job and talks only to the layers above and below it.',
      '**The seven layers (bottom to top):** Physical (cables, signals), Data Link (MAC addresses, switches), Network (IP addresses, routers), Transport (TCP/UDP, ports), Session, Presentation (encryption, TLS), Application (HTTP, DNS). A handy mnemonic is "Please Do Not Throw Sausage Pizza Away."',
      '**Why it helps.** It gives a shared vocabulary for where a problem lives: a cable issue is Layer 1, a routing issue Layer 3, an HTTP bug Layer 7. In practice the simpler TCP/IP model (Link, Internet, Transport, Application) is what engineers use day to day.',
    ],
    examples: [
      'Your HTTP request (L7) is wrapped in TCP (L4), then IP (L3), then Ethernet (L2), then sent as signals (L1), and unwrapped in reverse at the server.',
      '"It\'s a Layer 8 problem" is engineer slang for user error, the joke layer above the seven.',
    ],
    diagrams: [
      {
        caption: 'Seven layers, each wrapping the one above as data moves down to the wire.',
        layout: 'stack',
        nodes: [
          { id: 'l7', label: 'Application', sub: 'HTTP, DNS', accent: 'compute' },
          { id: 'l4', label: 'Transport', sub: 'TCP, UDP, ports', accent: 'edge' },
          { id: 'l3', label: 'Network', sub: 'IP, routers', accent: 'primary' },
          { id: 'l1', label: 'Physical / Link', sub: 'MAC, cables', accent: 'storage' },
        ],
      },
    ],
    related: ['TCP', 'UDP', 'IP address', 'packet'],
  },

  throughput: {
    body: [
      '**Throughput is the actual rate of useful work delivered:** requests per second, bytes per second, messages processed per minute. It answers "how much is the system really getting done?"',
      '**Three numbers people confuse.** Latency is the delay for one request (how long you wait). Bandwidth is the maximum capacity of the pipe (the theoretical ceiling). Throughput is the real rate achieved (often below bandwidth, limited by latency, contention, or a bottleneck).',
      '**The highway analogy:** latency is how long your car takes to drive the road, bandwidth is how many lanes there are, throughput is how many cars actually arrive per minute. A read-heavy system raises throughput with caching and replicas; a write-heavy one with sharding and queues.',
    ],
    examples: [
      'A pipe with high bandwidth but high latency can still have low throughput if requests wait on each other (fixed by concurrency).',
      'Adding read replicas raises read throughput without changing any single request\'s latency.',
    ],
    related: ['latency', 'horizontal scaling', 'load balancer', 'cache'],
  },

  MySQL: {
    body: [
      '**MySQL is a classic open-source relational database,** the SQL in the old LAMP stack and still one of the most deployed databases. Like PostgreSQL it gives you tables, joins, transactions, and ACID guarantees.',
      '**MySQL vs PostgreSQL.** Both are excellent default choices. PostgreSQL is generally richer (stricter SQL, advanced types, JSON, extensions); MySQL is famously fast for simple read-heavy workloads and has huge operational tooling. For most new projects either is fine; pick the one your team knows.',
      '**Scales the usual way:** indexes, read replicas, then sharding. Managed versions (Amazon RDS, Aurora, PlanetScale) remove most of the operational burden.',
    ],
    examples: [
      'A typical web app: users, orders, and payments in MySQL with read replicas for the read-heavy pages.',
      'WordPress, the most-installed CMS, runs on MySQL.',
    ],
    related: ['SQL', 'PostgreSQL', 'database', 'replication', 'index'],
  },

  MongoDB: {
    body: [
      '**MongoDB is the popular document database.** Instead of rows in fixed tables, it stores flexible JSON-like documents and lets you query inside them. Good when records are self-contained and their shape varies.',
      '**When to reach for it.** Content, catalogs, user profiles, and event payloads where each document holds everything it needs and a rigid schema would fight you. It scales out with built-in sharding and replica sets.',
      '**The trade.** You give up easy multi-table joins and (historically) strong multi-document transactions, though modern MongoDB supports transactions. For join-heavy, strongly-transactional data (commerce, ledgers), relational is usually simpler.',
    ],
    examples: [
      'A CMS where each article document holds its title, body, tags, and author inline, no joins needed.',
      'Storing varied event payloads whose fields differ by event type.',
    ],
    related: ['database', 'SQL', 'sharding', 'eventual consistency'],
  },

  Redis: {
    body: [
      '**Redis is an in-memory key-value store, the Swiss Army knife of fast shared state.** Because it lives in RAM, reads and writes take well under a millisecond, and it does far more than plain caching.',
      '**What teams use it for:** a cache in front of the database, session storage, rate-limit counters, real-time leaderboards (sorted sets), distributed locks, pub/sub, and lightweight queues. Its rich data types (strings, hashes, lists, sets, sorted sets) are why it covers so many jobs.',
      '**The trade.** It is memory-bound and primarily a fast, mostly-ephemeral layer; it offers persistence and replication but is usually paired with a durable database as the source of truth.',
    ],
    examples: [
      'Cache hot query results with a TTL; store sessions; keep a sliding-window rate-limit counter.',
      'A game leaderboard as a Redis sorted set: O(log n) updates and instant top-N reads.',
    ],
    diagrams: [
      {
        caption: 'Redis sits between the app and the database as a fast shared layer.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App servers', accent: 'compute' },
          { id: 'redis', label: 'Redis', sub: 'in-memory', accent: 'cache' },
          { id: 'db', label: 'Database', sub: 'source of truth', accent: 'storage' },
        ],
      },
    ],
    related: ['cache', 'Memcached', 'rate limit', 'distributed lock'],
  },

  Memcached: {
    body: [
      '**Memcached is a bare-bones, very fast in-memory cache.** It stores simple key-value pairs and does one thing well: caching. It predates Redis and is deliberately minimal.',
      '**Memcached vs Redis.** Memcached is simpler and slightly faster for plain string caching and multi-threaded. Redis offers rich data types, persistence, pub/sub, and more, which is why most new systems pick Redis unless they specifically want the simplest possible cache.',
    ],
    examples: [
      'Cache rendered HTML fragments or database query results as opaque strings.',
    ],
    related: ['cache', 'Redis', 'CDN'],
  },

  DynamoDB: {
    body: [
      "**DynamoDB is Amazon's managed key-value and document store.** It is serverless (no nodes to run), delivers single-digit-millisecond latency, and scales to virtually any size automatically. You provision or auto-scale capacity and AWS handles the rest.",
      '**Design around access patterns.** DynamoDB rewards designing your keys for the exact queries you need (often single-table design). It is superb for high-scale key lookups; it is not the tool for ad-hoc queries and rich joins.',
      '**Consistency knob.** Reads are eventually consistent by default for speed, with an option for strongly consistent reads. It uses partitioning and replication under the hood, so a bad partition key creates a hot partition.',
    ],
    examples: [
      'Session store, shopping carts, user profiles, and IoT data at massive scale with predictable latency.',
      'A bad partition key (low cardinality) concentrates traffic on one partition: the hot-key problem.',
    ],
    related: ['Cassandra', 'sharding', 'consistent hashing', 'eventual consistency', 'Amazon S3'],
  },

  Cassandra: {
    body: [
      '**Cassandra is a wide-column store built for enormous write throughput.** It spreads data across many nodes with no single primary, so writes scale linearly and there is no single point of failure.',
      '**Where it wins:** write-heavy, always-on workloads like time-series, event logs, sensor data, messaging, and feeds. It offers tunable consistency via read/write quorums, sliding between fast-eventual and strong.',
      '**The trade.** You model tables around specific queries up front (query-first design), and ad-hoc queries and joins are not its strength. It chooses availability and partition tolerance (AP) by default.',
    ],
    examples: [
      'Storing billions of time-series sensor readings written continuously across a cluster.',
      'A messaging app keeping per-user message timelines that take constant heavy writes.',
    ],
    related: ['DynamoDB', 'sharding', 'quorum', 'eventual consistency', 'consistent hashing'],
  },

  Elasticsearch: {
    body: [
      '**Elasticsearch is a search and analytics engine.** It builds an inverted index (term to the documents containing it) so full-text search over huge corpora returns in milliseconds, with relevance ranking, fuzzy matching, and aggregations.',
      '**Common uses:** product and site search, log search and analytics (the ELK stack: Elasticsearch, Logstash, Kibana), and dashboards over large datasets.',
      '**The trade.** It is a search layer, not a primary database: you typically keep the source of truth elsewhere and index into Elasticsearch. Keeping that index in sync is the operational work.',
    ],
    examples: [
      'Full-text product search with typo tolerance and faceted filters.',
      'Centralized log search across thousands of servers via the ELK stack.',
    ],
    related: ['index', 'database', 'observability', 'log'],
  },

  Kafka: {
    body: [
      '**Kafka is a distributed, durable event log.** Producers append events to topics; consumers read them at their own pace. Unlike a traditional queue that deletes a message once consumed, Kafka retains the log, so many independent consumers can each read the whole stream and replay it.',
      '**Partitions give ordering and scale.** Each topic is split into partitions; events with the same key go to the same partition and stay ordered, while partitions spread load across the cluster. This is the partition-key idea applied to streaming.',
      '**Where it shines:** high-throughput pipelines, event-driven architectures, decoupling services, and feeding analytics (often with Spark or Flink). It is heavier to operate than a simple queue, so reach for it when you need durable, replayable, high-volume streams.',
    ],
    examples: [
      'Every user action published to Kafka, then consumed independently by analytics, search indexing, and notifications.',
      'A payments event stream replayed to rebuild a downstream database after a bug fix.',
    ],
    diagrams: [
      {
        caption: 'One topic, many partitions; multiple consumer groups each read the whole log independently.',
        layout: 'fanout',
        nodes: [
          { id: 'topic', label: 'Kafka topic', sub: 'partitioned log', accent: 'queue' },
          { id: 'analytics', label: 'Analytics', accent: 'compute' },
          { id: 'search', label: 'Search indexer', accent: 'compute' },
          { id: 'notify', label: 'Notifications', accent: 'compute' },
        ],
      },
    ],
    related: ['queue', 'RabbitMQ', 'Amazon SQS', 'Apache Flink', 'backpressure'],
  },

  RabbitMQ: {
    body: [
      '**RabbitMQ is a traditional message broker.** Producers send messages to exchanges, which route them to queues by rules, and consumers process and acknowledge them. A message is typically delivered to one consumer and then removed.',
      '**Versus Kafka.** RabbitMQ excels at flexible routing and per-message work distribution (task queues), with lower setup overhead for classic queueing. Kafka is for high-throughput, retained, replayable event streams. Use RabbitMQ for "do this task once"; use Kafka for "stream these events to everyone."',
    ],
    examples: [
      'A task queue: enqueue send-email jobs, and a pool of workers each pull and process one.',
      'Routing orders to different queues by region via an exchange.',
    ],
    related: ['queue', 'Kafka', 'Amazon SQS', 'worker', 'dead-letter queue'],
  },

  'Amazon SQS': {
    body: [
      "**Amazon SQS is AWS's fully managed message queue.** No brokers to run: you create a queue and send and receive messages. It gives durable, at-least-once delivery, automatic scaling, and a built-in dead-letter queue for messages that keep failing.",
      '**Standard vs FIFO.** Standard queues are highest-throughput with best-effort ordering and possible duplicates (so make consumers idempotent). FIFO queues guarantee order and exactly-once processing within a message group, at lower throughput.',
      '**The easy default on AWS** for decoupling services and smoothing spikes, often paired with Lambda or worker fleets.',
    ],
    examples: [
      'A web tier drops "process order" messages on SQS; a Lambda or worker pool drains them.',
      'A FIFO queue keyed by order id keeps each order\'s events in sequence.',
    ],
    related: ['queue', 'dead-letter queue', 'idempotency', 'AWS Lambda', 'Kafka'],
  },

  'Amazon S3': {
    body: [
      "**Amazon S3 is AWS's object storage:** store and retrieve files (objects) by key in buckets, with extremely high durability (designed for eleven nines) and effectively unlimited scale. It is the default place to put anything that is a file rather than a row.",
      '**What goes in S3:** user uploads, images and video, backups, logs, data-lake files, and static website assets. You serve it directly or put a CDN (CloudFront) in front for low-latency global delivery.',
      '**Why not the database.** Storing large blobs in a relational database bloats it and slows everything; S3 is cheaper, more durable, and built for it. The database keeps only the metadata and the S3 key.',
    ],
    examples: [
      'A photo app stores originals in S3, serves resized variants via CloudFront, and keeps only the keys in its database.',
      'Nightly database backups and application logs archived to S3.',
    ],
    diagrams: [
      {
        caption: 'Files live in S3; the database stores only metadata and the object key; a CDN fronts delivery.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App', accent: 'compute' },
          { id: 's3', label: 'Amazon S3', sub: 'objects by key', accent: 'storage' },
          { id: 'cdn', label: 'CloudFront', sub: 'CDN', accent: 'edge' },
        ],
        edges: [
          { from: 'app', to: 's3', label: 'store / fetch' },
          { from: 's3', to: 'cdn', label: 'serve' },
        ],
      },
    ],
    related: ['CDN', 'database', 'AWS Lambda', 'DynamoDB'],
  },

  'AWS Lambda': {
    body: [
      '**AWS Lambda runs your code without servers.** You upload a function; AWS runs it on demand in response to events (an HTTP call via API Gateway, a file landing in S3, a message on SQS), scales it automatically from zero to thousands of concurrent runs, and bills per request and millisecond.',
      '**When it fits:** event-driven glue, APIs with spiky or low traffic, scheduled jobs, and processing pipelines. You stop thinking about servers, capacity, and patching.',
      '**The trades:** cold starts (the first call after idle is slower), execution time limits, and statelessness (no local state between runs). For steady high-volume workloads, containers can be cheaper.',
    ],
    examples: [
      'A thumbnail generator: an S3 upload event triggers a Lambda that resizes the image.',
      'A low-traffic API where paying per request beats running an always-on server.',
    ],
    related: ['container', 'Amazon S3', 'Amazon SQS', 'API gateway', 'horizontal scaling'],
  },

  Nginx: {
    body: [
      '**Nginx is a high-performance web server and reverse proxy.** It is frequently the front door of a system: terminating TLS, serving static files, compressing responses, and forwarding dynamic requests to app servers. It also works as a load balancer.',
      '**Why it is everywhere:** it handles many thousands of concurrent connections efficiently with a small footprint, which is why it fronts a huge share of the web.',
    ],
    examples: [
      'Nginx terminates HTTPS, serves /static directly, and proxies /api to the application servers.',
      'Used as an L7 load balancer spreading traffic across a backend pool.',
    ],
    related: ['reverse proxy', 'load balancer', 'TLS', 'CDN'],
  },

  ZooKeeper: {
    body: [
      '**ZooKeeper is a coordination service for distributed systems.** It provides the hard primitives clusters need: leader election, distributed locks, configuration storage, and membership, all with strong consistency.',
      '**You rarely use it directly;** it sits under other systems (older Kafka, HBase, and many clusters) to keep their nodes in agreement. etcd plays a similar role for Kubernetes.',
    ],
    examples: [
      'A cluster uses ZooKeeper to elect one leader node and fail over to a new one when it dies.',
      'Storing configuration that all nodes watch for changes.',
    ],
    related: ['leader election', 'distributed lock', 'quorum', 'service discovery'],
  },

  Docker: {
    body: [
      '**Docker packages an app and its dependencies into a container image** that runs identically on a laptop, a CI runner, and production. It ends "works on my machine" by shipping the environment with the code.',
      '**Containers vs virtual machines.** A container shares the host OS kernel and isolates just the app, so it is far lighter and faster to start than a VM, which bundles a whole operating system. You build an image once and run many identical containers from it.',
      '**It is the unit of deployment** for most modern backends, and what orchestrators like Kubernetes schedule.',
    ],
    examples: [
      'A Dockerfile builds an image with your app, runtime, and libraries; the same image runs in dev and prod.',
      'CI builds the image, tests it, and ships the exact bytes that were tested.',
    ],
    related: ['container', 'Kubernetes', 'deployment', 'CI/CD'],
  },

  Kubernetes: {
    body: [
      '**Kubernetes orchestrates containers across a cluster of machines.** You declare the desired state (run 5 copies of this container, expose it on this port) and Kubernetes makes it so: scheduling containers onto nodes, restarting crashed ones, scaling on load, rolling out updates, and networking them together.',
      '**What it gives you:** self-healing (a dead container is replaced), horizontal autoscaling, rolling deploys with rollback, service discovery, and load balancing, all declaratively.',
      '**The trade: complexity.** Kubernetes is powerful and operationally heavy. Small teams often start with a managed platform (or serverless) and adopt it when scale and many services justify it.',
    ],
    examples: [
      'Declare "5 replicas of the API"; a node dies, and Kubernetes reschedules its containers elsewhere automatically.',
      'A rolling deploy replaces pods gradually and rolls back if health checks fail.',
    ],
    diagrams: [
      {
        caption: 'Declare desired state; the orchestrator schedules and heals containers across nodes.',
        layout: 'fanout',
        nodes: [
          { id: 'cp', label: 'Control plane', sub: 'desired state', accent: 'edge' },
          { id: 'n1', label: 'Node 1', sub: 'pods', accent: 'compute' },
          { id: 'n2', label: 'Node 2', sub: 'pods', accent: 'compute' },
          { id: 'n3', label: 'Node 3', sub: 'pods', accent: 'compute' },
        ],
      },
    ],
    related: ['Docker', 'container', 'horizontal scaling', 'service discovery', 'load balancer'],
  },

  Prometheus: {
    body: [
      '**Prometheus is a metrics and monitoring system.** It scrapes numeric time-series from your services (request rate, error rate, latency, queue depth, memory) on an interval, stores them, and lets you query and alert on them.',
      '**The metrics pillar of observability.** Paired with Grafana for dashboards and Alertmanager for alerting, it answers "how much, how fast, how many" over time, complementing logs (what happened) and traces (where the time went).',
    ],
    examples: [
      'Alert when the 5xx error rate exceeds 1% for 5 minutes, or when queue depth keeps climbing.',
      'A Grafana dashboard of p99 latency and request rate, both scraped by Prometheus.',
    ],
    related: ['metric', 'observability', 'SLO', 'log', 'trace'],
  },

  'Apache Spark': {
    body: [
      '**Apache Spark is a distributed engine for large-scale data processing.** It spreads a big batch job (terabytes of data) across a cluster and processes it in parallel in memory, far faster than older disk-based approaches.',
      '**Used for:** ETL pipelines, analytics, and machine-learning feature processing over huge datasets. It is a batch and micro-batch engine; for true low-latency streaming, Flink is the specialist.',
    ],
    examples: [
      'A nightly job aggregating a day of event logs into reporting tables across a cluster.',
      'Processing a data-lake of files in S3 into cleaned, joined datasets.',
    ],
    related: ['Apache Flink', 'Kafka', 'Amazon S3', 'sharding'],
  },

  'Apache Flink': {
    body: [
      '**Apache Flink is a distributed engine for stateful stream processing.** It processes events continuously as they arrive (not in nightly batches), maintaining state across them, which makes it the tool for real-time analytics.',
      '**Used for:** live dashboards, fraud detection, real-time aggregations and counting, and alerting on event streams, usually reading from Kafka. Spark does big batch jobs; Flink does low-latency streaming.',
    ],
    examples: [
      'Computing a real-time leaderboard or per-minute click counts from a Kafka stream.',
      'Flagging fraudulent transactions within seconds as events flow in.',
    ],
    related: ['Kafka', 'Apache Spark', 'eventual consistency', 'queue'],
  },

  fanout: {
    body: [
      '**Fanout is delivering one event to many recipients,** the core of feeds, notifications, and chat groups. There are two strategies with opposite trade-offs.',
      '**Fanout-on-write (push).** When a user posts, immediately write a copy into each follower\'s feed. Reads are then instant (the feed is precomputed), but a celebrity with 50M followers triggers 50M writes per post: the hot-key problem.',
      '**Fanout-on-read (pull).** Store the post once; build each follower\'s feed on demand by pulling from everyone they follow. Cheap writes, but reads are expensive and slow. Real systems go hybrid: push for normal users, pull for celebrities.',
    ],
    examples: [
      'Twitter-style feed: push posts into follower timelines, except for celebrities whose posts are pulled at read time.',
      'A group chat fans one message out to every member\'s connection.',
    ],
    diagrams: [
      {
        caption: 'Fanout-on-write: one post is copied into every follower\'s feed at write time.',
        layout: 'fanout',
        nodes: [
          { id: 'post', label: 'New post', accent: 'compute' },
          { id: 'f1', label: 'Follower feed 1', accent: 'storage' },
          { id: 'f2', label: 'Follower feed 2', accent: 'storage' },
          { id: 'f3', label: 'Follower feed 3', accent: 'storage' },
        ],
      },
    ],
    related: ['hot key', 'queue', 'cache', 'eventual consistency'],
  },

  'hot key': {
    body: [
      '**A hot key is one key that takes a wildly disproportionate share of traffic:** a celebrity account, a viral product, a giant tenant, the current-day partition. It overloads whichever shard or cache node owns it while the others sit idle.',
      '**Why it hurts.** Sharding assumes traffic spreads across keys. One hot key breaks that assumption, recreating a single bottleneck on top of a distributed system.',
      '**Fixes.** Cache the hot key aggressively so most reads never reach the shard; split it into sub-keys (a counter into N shards summed on read); give the whale its own dedicated infrastructure; or add a small per-node local cache in front of the shared cache.',
    ],
    examples: [
      'A flash sale\'s single product is one hot inventory key every buyer hits at once.',
      'A chat channel with 10M members saturates its shard while small channels idle.',
    ],
    diagrams: [
      {
        caption: 'One hot key concentrates load on its shard while the others stay cold.',
        layout: 'fanout',
        nodes: [
          { id: 'traffic', label: 'Traffic', accent: 'compute' },
          { id: 's0', label: 'Shard 0', sub: 'HOT', accent: 'danger' },
          { id: 's1', label: 'Shard 1', sub: 'idle', accent: 'default' },
          { id: 's2', label: 'Shard 2', sub: 'idle', accent: 'default' },
        ],
        edges: [
          { from: 'traffic', to: 's0', label: '90%' },
          { from: 'traffic', to: 's1', dashed: true },
          { from: 'traffic', to: 's2', dashed: true },
        ],
      },
    ],
    related: ['sharding', 'consistent hashing', 'cache', 'distributed counting', 'fanout'],
  },

  'unique ID generation': {
    body: [
      '**Generating globally unique ids at scale is harder than it looks,** because a single auto-increment column is a bottleneck and a single point of failure once many machines need ids at once.',
      '**The options.** UUIDs are random and need no coordination, but are large and not sortable. Snowflake-style ids pack a timestamp, a machine id, and a per-millisecond sequence into a 64-bit number that is unique, compact, and roughly time-sortable. A ticket server hands out ranges of ids to each machine to amortize coordination.',
      '**Time-sortable matters** because ids that sort by creation time make database indexes and pagination far more efficient than random UUIDs.',
    ],
    examples: [
      'Snowflake id: [timestamp | machine id | sequence] = a unique, sortable 64-bit number with no central coordinator.',
      'A ticket server gives machine A ids 1-1000 and machine B 1001-2000, so neither coordinates per id.',
    ],
    diagrams: [
      {
        caption: 'A Snowflake id packs time, machine, and a sequence number, so each node mints ids alone.',
        layout: 'row',
        nodes: [
          { id: 'ts', label: 'Timestamp', sub: '41 bits', accent: 'primary' },
          { id: 'm', label: 'Machine id', sub: '10 bits', accent: 'edge' },
          { id: 'seq', label: 'Sequence', sub: '12 bits', accent: 'compute' },
        ],
        edges: [],
      },
    ],
    related: ['sharding', 'primary key', 'database', 'index'],
  },

  'distributed counting': {
    body: [
      '**Counting at massive scale (likes, views, votes) cannot use a single row,** because every increment contending on one row creates a hot key that serializes all the writes.',
      '**Sharded counters.** Split the count into N sub-counters on different shards; each increment hits a random one; reads sum all N. The contention drops by a factor of N, at the cost of a sum on read.',
      '**Approximate counting.** When exactness does not matter (a view count of "2.3M"), structures like HyperLogLog count unique items in tiny memory, and batching or sampling cut write volume further.',
    ],
    examples: [
      'A viral video\'s view counter split into 100 sub-counters so 100x fewer writes contend on each.',
      'HyperLogLog estimates unique visitors from billions of events using kilobytes of memory.',
    ],
    diagrams: [
      {
        caption: 'Spread increments across N sub-counters; sum them on read.',
        layout: 'fanout',
        nodes: [
          { id: 'inc', label: 'Increments', accent: 'compute' },
          { id: 'c0', label: 'Counter 0', accent: 'cache' },
          { id: 'c1', label: 'Counter 1', accent: 'cache' },
          { id: 'c2', label: 'Counter 2', accent: 'cache' },
        ],
      },
    ],
    related: ['hot key', 'sharding', 'cache', 'eventual consistency'],
  },

  'long polling': {
    body: [
      '**Real-time updates sit on a spectrum,** from cheap-and-laggy to instant-and-costly. Long polling is the middle.',
      '**The four rungs.** Plain polling asks "anything new?" on a timer (wasteful, laggy). Long polling holds the request open until the server has data, then returns and the client reconnects (near real-time over plain HTTP). Server-sent events keep one connection open for a one-way server-to-client stream. WebSockets keep a persistent two-way connection for true bidirectional real-time.',
      '**Choosing.** Polling for rarely-changing data, long polling or SSE for server-to-client updates (notifications, live feeds), WebSockets for two-way realtime (chat, multiplayer, collaborative editing).',
    ],
    examples: [
      'A notifications badge can use SSE; a chat app needs WebSockets; a status page can poll every 30s.',
      'Long polling powered live updates before WebSockets were widespread and still works through old proxies.',
    ],
    diagrams: [
      {
        caption: 'From wasteful polling to instant two-way WebSockets.',
        layout: 'row',
        nodes: [
          { id: 'poll', label: 'Polling', sub: 'laggy', accent: 'default' },
          { id: 'long', label: 'Long polling', accent: 'compute' },
          { id: 'sse', label: 'SSE', sub: 'one-way push', accent: 'edge' },
          { id: 'ws', label: 'WebSockets', sub: 'two-way', accent: 'success' },
        ],
      },
    ],
    related: ['server-sent events', 'webhook', 'HTTP', 'fanout'],
  },

  'server-sent events': {
    body: [
      '**Server-sent events (SSE) keep one HTTP connection open for a one-way stream** from server to client. The server pushes updates as they happen; the client just listens. It is simpler than WebSockets when you only need server-to-client.',
      '**When to use it:** live notifications, activity feeds, progress updates, and dashboards, anything where the client only consumes. For two-way (the client also sends frequently), use WebSockets.',
    ],
    examples: [
      'A build dashboard streams log lines to the browser via SSE as they are produced.',
      'A notification feed pushes new items over a single SSE connection.',
    ],
    related: ['long polling', 'webhook', 'HTTP'],
  },

  geohash: {
    body: [
      '**A geohash encodes a latitude/longitude into a short string** where nearby places share a common prefix. This turns "find things near me" (a hard 2D range query) into a fast prefix lookup.',
      '**Why it matters for location systems.** Ride-hailing, food delivery, and "nearby" features need to find points close to a location among millions. Indexing by geohash (or a quadtree) lets you query a small set of cells around the user instead of scanning everything.',
      '**The edge case:** two points can be close but fall in different cells (across a boundary), so queries check neighboring cells too.',
    ],
    examples: [
      'Uber finds nearby drivers by looking up the rider\'s geohash cell and its neighbors.',
      'A "restaurants near me" query reads a few geohash cells instead of every restaurant.',
    ],
    diagrams: [
      {
        caption: 'Nearby points share a geohash prefix, so proximity becomes a prefix lookup.',
        layout: 'row',
        nodes: [
          { id: 'loc', label: 'Lat / lng', accent: 'compute' },
          { id: 'gh', label: 'Geohash', sub: 'shared prefix = near', accent: 'edge' },
          { id: 'near', label: 'Nearby cells', sub: 'small lookup', accent: 'success' },
        ],
      },
    ],
    related: ['index', 'sharding', 'cache'],
  },

  'single point of failure': {
    body: [
      '**A single point of failure (SPOF) is any component with no backup whose death takes the whole system down.** The single database primary, the one load balancer, the one cache, the one DNS provider.',
      '**Removing SPOFs means redundancy everywhere.** Replicate the database with failover; run load balancers in redundant pairs; spread across availability zones and regions; use multiple providers for critical dependencies. The goal is that any one component can die without an outage.',
      '**Find them by asking, for each box in your diagram, "what happens if this dies right now?"** If the answer is "everything stops," that box needs a backup.',
    ],
    examples: [
      'One primary database is a SPOF until you add a replica that can be promoted on failure.',
      'A single load balancer is a SPOF; production runs an active-passive or active-active pair.',
    ],
    diagrams: [
      {
        caption: 'A lone component is a SPOF; redundancy removes it.',
        layout: 'row',
        nodes: [
          { id: 'one', label: 'One primary', sub: 'SPOF', accent: 'danger' },
          { id: 'pair', label: 'Primary + standby', sub: 'failover', accent: 'success' },
        ],
        edges: [{ from: 'one', to: 'pair', label: 'add redundancy', dashed: true }],
      },
    ],
    related: ['replication', 'load balancer', 'multi-region', 'heartbeat'],
  },

  'multi-region': {
    body: [
      '**Multi-region means running in several geographic regions at once,** for two reasons: lower latency (serve users from a region near them) and disaster tolerance (a whole region can fail without an outage).',
      '**The hard part is data.** Active-passive keeps one region live and a standby ready to promote (simple, some downtime on failover). Active-active runs all regions live (no downtime, but now writes happen in multiple places and you face cross-region replication lag and conflicts).',
      '**Routing.** Geo-DNS or anycast sends each user to the nearest healthy region. Most systems keep strongly-consistent data (payments) in one region and replicate read-heavy data widely.',
    ],
    examples: [
      'Serve EU users from Frankfurt and US users from Virginia, each with a local replica.',
      'A region outage fails over to another with minimal disruption.',
    ],
    diagrams: [
      {
        caption: 'Users route to the nearest region; regions replicate across the world.',
        layout: 'fanout',
        nodes: [
          { id: 'dns', label: 'Geo-routing', sub: 'nearest region', accent: 'edge' },
          { id: 'us', label: 'US region', accent: 'compute' },
          { id: 'eu', label: 'EU region', accent: 'compute' },
          { id: 'ap', label: 'APAC region', accent: 'compute' },
        ],
      },
    ],
    related: ['replication', 'CDN', 'single point of failure', 'eventual consistency', 'CAP theorem'],
  },

  'distributed transaction': {
    body: [
      '**A distributed transaction spans multiple services or databases** that must all succeed or all fail together, even though they do not share one database\'s transaction. Doing this correctly is genuinely hard.',
      '**Two-phase commit (2PC)** has a coordinator ask everyone to "prepare," then "commit" only if all agreed. It is strongly consistent but slow and fragile: if the coordinator dies mid-commit, participants are stuck holding locks.',
      '**Sagas are the common alternative.** Instead of one atomic transaction, run a sequence of local transactions, each with a compensating action that undoes it. If step 3 fails, run the compensations for steps 2 and 1. Eventually consistent, but resilient and lock-free, which is why microservices favor it.',
    ],
    examples: [
      'An order spans inventory, payment, and shipping services; a saga reserves stock, charges, and ships, compensating backward on any failure.',
      '2PC across two databases guarantees both commit or neither, at the cost of holding locks until everyone agrees.',
    ],
    diagrams: [
      {
        caption: 'A saga runs local steps forward, and compensating actions backward on failure.',
        layout: 'row',
        nodes: [
          { id: 's1', label: 'Reserve stock', accent: 'compute' },
          { id: 's2', label: 'Charge card', accent: 'compute' },
          { id: 's3', label: 'Ship', sub: 'fails -> compensate', accent: 'danger' },
        ],
      },
    ],
    related: ['saga', 'transaction', 'idempotency', 'eventual consistency', 'microservices'],
  },

  saga: {
    body: [
      '**A saga is how microservices do a transaction without a distributed lock-step commit.** It is a sequence of local transactions, one per service, where each step has a compensating action that semantically undoes it.',
      '**Forward and backward.** Steps run in order; if one fails, the saga runs the compensations for the steps that already succeeded, in reverse. There is no global rollback, just deliberate undo steps (refund the charge, release the reservation).',
      '**Orchestration vs choreography.** An orchestrator service can drive the steps centrally, or services can react to each other\'s events (choreography). Either way, each step must be idempotent, since retries happen.',
    ],
    examples: [
      'Trip booking: reserve flight, reserve hotel, charge card; if the charge fails, cancel the hotel and flight reservations.',
      'Compensation is not a database rollback: it is a new action that reverses the effect (issue a refund).',
    ],
    related: ['distributed transaction', 'idempotency', 'queue', 'microservices', 'eventual consistency'],
  },

  'circuit breaker': {
    body: [
      '**A circuit breaker stops your service from hammering a failing dependency.** After a threshold of consecutive errors, it "opens": further calls fail fast for a cooldown instead of waiting on a timeout, giving the struggling dependency room to recover.',
      '**The states.** Closed (calls pass through normally). Open (calls fail immediately, no request sent). Half-open (after the cooldown, let a trial request through; success closes the breaker, failure re-opens it).',
      '**Why it matters.** Without it, a slow dependency ties up every caller\'s threads waiting on timeouts, and the failure cascades upstream until the whole system stalls. The breaker contains the blast radius.',
    ],
    examples: [
      'The payments service starts timing out; the breaker opens, so checkout fails fast with a clear error instead of hanging.',
      'After 30 seconds the breaker half-opens, tests one call, and closes again once payments recover.',
    ],
    diagrams: [
      {
        caption: 'Closed passes calls; open fails fast; half-open tests recovery.',
        layout: 'row',
        nodes: [
          { id: 'closed', label: 'Closed', sub: 'calls pass', accent: 'success' },
          { id: 'open', label: 'Open', sub: 'fail fast', accent: 'danger' },
          { id: 'half', label: 'Half-open', sub: 'test one', accent: 'compute' },
        ],
        edges: [
          { from: 'closed', to: 'open', label: 'errors' },
          { from: 'open', to: 'half', label: 'cooldown' },
        ],
      },
    ],
    related: ['retry', 'load shedding', 'single point of failure', 'graceful shutdown'],
  },

  'load shedding': {
    body: [
      '**Load shedding keeps a system alive under overload by deliberately dropping work** it cannot handle, instead of trying to serve everything and collapsing. Better to reject 10% than to fail 100%.',
      '**How it is done.** Reject low-priority requests first (background jobs before user-facing ones), return 429/503 early, put a bounded queue with a waiting room in front of a spike, or degrade gracefully (serve cached or partial results). Autoscaling helps, but it is not instant, so shedding covers the gap.',
      '**Related: backpressure** is the upstream signal that says "slow down," and a circuit breaker sheds load toward a failing dependency.',
    ],
    examples: [
      'Under a traffic spike, the API returns 503 for non-critical endpoints to protect checkout.',
      'A flash sale puts buyers through a waiting room, admitting them at a rate the system can serve.',
    ],
    diagrams: [
      {
        caption: 'Under overload, drop low-priority work so the critical path survives.',
        layout: 'row',
        nodes: [
          { id: 'flood', label: 'Overload', accent: 'danger' },
          { id: 'shed', label: 'Shed low-priority', sub: '429 / 503', accent: 'compute' },
          { id: 'core', label: 'Critical path up', accent: 'success' },
        ],
      },
    ],
    related: ['backpressure', 'rate limit', 'circuit breaker', 'queue'],
  },

  'chunked upload': {
    body: [
      '**Large files are not uploaded in one giant request;** they are split into chunks uploaded independently. A failed chunk retries on its own, the upload resumes after a dropped connection, and chunks upload in parallel for speed.',
      '**The flow.** The client asks the server to start a multipart upload, uploads each part (often directly to object storage via a presigned URL, bypassing your app server), then tells the server to assemble them. Your app handles small control calls; the heavy bytes go straight to storage.',
      '**Why direct-to-storage.** Routing gigabytes through your application servers wastes their capacity. Presigned URLs let the client upload to S3 directly while your server only authorizes and tracks it.',
    ],
    examples: [
      'A 4 GB video uploads as hundreds of parts directly to S3; a dropped connection resumes from the last completed part.',
      'The app server issues a presigned URL; the client PUTs the bytes to storage without touching the app tier.',
    ],
    diagrams: [
      {
        caption: 'Split into parts, upload directly to storage, then assemble.',
        layout: 'row',
        nodes: [
          { id: 'file', label: 'Large file', accent: 'compute' },
          { id: 'parts', label: 'Chunks', sub: 'parallel, resumable', accent: 'queue' },
          { id: 's3', label: 'Object storage', sub: 'presigned URLs', accent: 'storage' },
        ],
      },
    ],
    related: ['Amazon S3', 'backpressure', 'retry', 'CDN'],
  },

  'multi-tenancy': {
    body: [
      '**Multi-tenancy is serving many customers (tenants) from shared infrastructure** while keeping their data isolated. It is the default for SaaS, because running a separate stack per customer does not scale economically.',
      '**The isolation spectrum.** Shared tables with a tenant_id column on every row (cheapest, most efficient, but a missing tenant_id filter leaks data across customers). Schema-per-tenant (more isolation, more overhead). Database-per-tenant (strong isolation, highest cost). Most SaaS starts shared and isolates the biggest or most-regulated tenants.',
      '**The constant risk: tenant data leakage.** Every query must scope to the tenant. This is enforced with mandatory filters, row-level security, or a data-access layer that injects the tenant id, never trusting individual queries to remember.',
    ],
    examples: [
      'A SaaS app keeps all customers in shared tables with a tenant_id, enforced by row-level security so no query can see another tenant.',
      'A large enterprise customer gets its own dedicated database for compliance, while everyone else shares.',
    ],
    diagrams: [
      {
        caption: 'From shared tables to dedicated databases: more isolation, more cost.',
        layout: 'row',
        nodes: [
          { id: 'shared', label: 'Shared tables', sub: 'tenant_id', accent: 'compute' },
          { id: 'schema', label: 'Schema per tenant', accent: 'edge' },
          { id: 'db', label: 'DB per tenant', sub: 'most isolated', accent: 'storage' },
        ],
      },
    ],
    related: ['authorization', 'sharding', 'database', 'security'],
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
