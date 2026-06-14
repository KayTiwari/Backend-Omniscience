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
        caption: 'Servers and keys sit on a ring; each key belongs to the next server clockwise.',
        layout: 'ring',
        nodes: [
          { id: 's0', label: 'Server 0', accent: 'storage' },
          { id: 'k1', label: 'Key A', accent: 'compute' },
          { id: 's1', label: 'Server 1', accent: 'storage' },
          { id: 'k2', label: 'Key B', accent: 'compute' },
          { id: 's2', label: 'Server 2', accent: 'storage' },
          { id: 'k3', label: 'Key C', accent: 'compute' },
          { id: 's3', label: 'Server 3', accent: 'storage' },
        ],
        edges: [
          { from: 'k1', to: 's1', label: 'clockwise' },
          { from: 'k2', to: 's2' },
          { from: 'k3', to: 's3' },
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
    diagrams: [
      {
        caption: 'Check the id first; a duplicate skips the work entirely.',
        layout: 'row',
        nodes: [
          { id: 'msg', label: 'Message + id', accent: 'compute' },
          { id: 'seen', label: 'Seen this id?', accent: 'edge' },
          { id: 'skip', label: 'Yes -> skip', accent: 'success' },
          { id: 'do', label: 'No -> do + record', accent: 'primary' },
        ],
        edges: [
          { from: 'msg', to: 'seen' },
          { from: 'seen', to: 'skip', label: 'duplicate' },
          { from: 'seen', to: 'do', label: 'first time' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Token bucket: tokens refill steadily; a request takes one, or gets 429.',
        layout: 'row',
        nodes: [
          { id: 'refill', label: 'Refill', sub: '1 token/sec', accent: 'edge' },
          { id: 'bucket', label: 'Bucket', sub: 'holds 10', accent: 'cache' },
          { id: 'ok', label: 'Take token -> allow', accent: 'success' },
          { id: 'deny', label: 'Empty -> 429', accent: 'danger' },
        ],
        edges: [
          { from: 'refill', to: 'bucket' },
          { from: 'bucket', to: 'ok', label: 'has token' },
          { from: 'bucket', to: 'deny', label: 'empty' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Stateless servers behind a load balancer; sessions live in a shared store.',
        layout: 'fanout',
        nodes: [
          { id: 'lb', label: 'Load balancer', accent: 'edge' },
          { id: 'a', label: 'Server A', sub: 'stateless', accent: 'compute' },
          { id: 'b', label: 'Server B', sub: 'stateless', accent: 'compute' },
          { id: 'c', label: 'Server C', sub: 'stateless', accent: 'compute' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Login mints a signed token; later requests carry it and the server verifies it.',
        layout: 'sequence',
        actors: [
          { label: 'Client', accent: 'client' },
          { label: 'Server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'POST /login (credentials)' },
          { from: 1, to: 1, label: 'sign JWT' },
          { from: 1, to: 0, label: 'token', dashed: true },
          { from: 0, to: 1, label: 'GET /data + Bearer token' },
          { from: 1, to: 1, label: 'verify signature' },
          { from: 1, to: 0, label: '200 data', dashed: true },
        ],
      },
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
    diagrams: [
      {
        caption: 'All steps commit together, or a failure rolls every step back.',
        layout: 'sequence',
        actors: [
          { label: 'App', accent: 'compute' },
          { label: 'Database', accent: 'storage' },
        ],
        messages: [
          { from: 0, to: 1, label: 'BEGIN' },
          { from: 0, to: 1, label: 'debit account 1' },
          { from: 0, to: 1, label: 'credit account 2' },
          { from: 0, to: 1, label: 'COMMIT (all or nothing)' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Without an index you scan every row; with one you jump straight to it.',
        layout: 'row',
        nodes: [
          { id: 'scan', label: 'No index', sub: 'scan every row', accent: 'danger' },
          { id: 'idx', label: 'Index', sub: 'sorted lookup', accent: 'edge' },
          { id: 'row', label: 'Jump to row', accent: 'success' },
        ],
        edges: [{ from: 'idx', to: 'row', label: 'direct' }],
      },
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
    diagrams: [
      {
        caption: 'A write reaches replicas over time; reads briefly differ, then converge.',
        layout: 'fanout',
        nodes: [
          { id: 'w', label: 'Write', accent: 'primary' },
          { id: 'r1', label: 'Replica 1', sub: 'updated', accent: 'success' },
          { id: 'r2', label: 'Replica 2', sub: 'catching up', accent: 'cache' },
          { id: 'r3', label: 'Replica 3', sub: 'stale briefly', accent: 'default' },
        ],
      },
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
    diagrams: [
      {
        caption: 'A name resolves to an IP, which addresses the actual machine.',
        layout: 'row',
        nodes: [
          { id: 'name', label: 'api.example.com', accent: 'client' },
          { id: 'ip', label: '93.184.216.34', sub: 'IPv4', accent: 'edge' },
          { id: 'm', label: 'Machine', accent: 'compute' },
        ],
        edges: [
          { from: 'name', to: 'ip', label: 'DNS' },
          { from: 'ip', to: 'm', label: 'routes to' },
        ],
      },
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
    diagrams: [
      {
        caption: 'One IP, many ports, each routing to a different service.',
        layout: 'fanout',
        nodes: [
          { id: 'ip', label: 'One IP', accent: 'edge' },
          { id: 'web', label: ':443 web', accent: 'compute' },
          { id: 'db', label: ':5432 database', accent: 'storage' },
          { id: 'redis', label: ':6379 Redis', accent: 'cache' },
        ],
      },
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
    diagrams: [
      {
        caption: 'A message is split into packets, routed independently, and reassembled.',
        layout: 'row',
        nodes: [
          { id: 'msg', label: 'Message', accent: 'compute' },
          { id: 'pkts', label: 'Packets', sub: 'routed alone', accent: 'queue' },
          { id: 'rebuild', label: 'Reassembled', sub: 'in order', accent: 'success' },
        ],
      },
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
    diagrams: [
      {
        caption: '/24 fixes the first 24 bits (the network); the rest address hosts.',
        layout: 'row',
        nodes: [
          { id: 'net', label: 'Network bits', sub: '/24 fixed', accent: 'primary' },
          { id: 'host', label: 'Host bits', sub: '256 addresses', accent: 'compute' },
        ],
        edges: [],
      },
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
    diagrams: [
      {
        caption: 'Latency is the wait; bandwidth the lanes; throughput the cars that actually arrive.',
        layout: 'row',
        nodes: [
          { id: 'lat', label: 'Latency', sub: 'delay/request', accent: 'compute' },
          { id: 'bw', label: 'Bandwidth', sub: 'max capacity', accent: 'edge' },
          { id: 'tp', label: 'Throughput', sub: 'real rate', accent: 'success' },
        ],
        edges: [],
      },
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
    diagrams: [
      {
        caption: 'Writes to the primary; reads fan out to replicas, the usual scaling path.',
        layout: 'fanout',
        nodes: [
          { id: 'p', label: 'Primary', sub: 'writes', accent: 'primary' },
          { id: 'r1', label: 'Replica', accent: 'replica' },
          { id: 'r2', label: 'Replica', accent: 'replica' },
        ],
      },
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
    diagrams: [
      {
        caption: 'A collection of self-contained documents you query inside.',
        layout: 'row',
        nodes: [
          { id: 'q', label: 'Query', accent: 'compute' },
          { id: 'coll', label: 'Collection', sub: 'JSON documents', accent: 'storage' },
        ],
      },
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
    diagrams: [
      {
        caption: 'A plain key-value cache in front of the database.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App', accent: 'compute' },
          { id: 'mc', label: 'Memcached', sub: 'key -> value', accent: 'cache' },
          { id: 'db', label: 'Database', accent: 'storage' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Keys are partitioned around a ring; a bad key creates a hot partition.',
        layout: 'ring',
        nodes: [
          { id: 'p0', label: 'Partition 0', accent: 'storage' },
          { id: 'k1', label: 'Key A', accent: 'compute' },
          { id: 'p1', label: 'Partition 1', accent: 'storage' },
          { id: 'k2', label: 'Key B', accent: 'compute' },
          { id: 'p2', label: 'Partition 2', accent: 'storage' },
        ],
      },
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
    diagrams: [
      {
        caption: 'No single primary: nodes form a ring and every node takes writes.',
        layout: 'ring',
        nodes: [
          { id: 'n0', label: 'Node 0', accent: 'replica' },
          { id: 'n1', label: 'Node 1', accent: 'replica' },
          { id: 'n2', label: 'Node 2', accent: 'replica' },
          { id: 'n3', label: 'Node 3', accent: 'replica' },
        ],
      },
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
    diagrams: [
      {
        caption: 'An inverted index maps each term to the documents that contain it.',
        layout: 'row',
        nodes: [
          { id: 'q', label: 'Search query', accent: 'compute' },
          { id: 'idx', label: 'Inverted index', sub: 'term -> docs', accent: 'edge' },
          { id: 'res', label: 'Ranked results', accent: 'success' },
        ],
      },
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
    diagrams: [
      {
        caption: 'An exchange routes messages into queues; workers each take one.',
        layout: 'row',
        nodes: [
          { id: 'ex', label: 'Exchange', sub: 'routes', accent: 'edge' },
          { id: 'q', label: 'Queue', accent: 'queue' },
          { id: 'w', label: 'Workers', sub: 'one each', accent: 'compute' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Managed queue: producers send, consumers drain, failures go to a DLQ.',
        layout: 'row',
        nodes: [
          { id: 'p', label: 'Producer', accent: 'compute' },
          { id: 'q', label: 'SQS queue', accent: 'queue' },
          { id: 'c', label: 'Consumer', sub: 'Lambda/worker', accent: 'compute' },
          { id: 'dlq', label: 'Dead-letter', accent: 'danger' },
        ],
        edges: [
          { from: 'p', to: 'q', label: 'send' },
          { from: 'q', to: 'c', label: 'receive' },
          { from: 'c', to: 'dlq', label: 'fails', dashed: true },
        ],
      },
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
    diagrams: [
      {
        caption: 'An event triggers a function that scales from zero automatically.',
        layout: 'row',
        nodes: [
          { id: 'ev', label: 'Event', sub: 'S3, SQS, HTTP', accent: 'edge' },
          { id: 'fn', label: 'Lambda', sub: 'your code', accent: 'compute' },
          { id: 'out', label: 'Result', accent: 'success' },
        ],
      },
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
    diagrams: [
      {
        caption: 'The front door: TLS, static files, and proxying to the app.',
        layout: 'row',
        nodes: [
          { id: 'c', label: 'Client', accent: 'client' },
          { id: 'nx', label: 'Nginx', sub: 'TLS, static, proxy', accent: 'edge' },
          { id: 'app', label: 'App servers', accent: 'compute' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Cluster nodes coordinate through ZooKeeper: leader, locks, config.',
        layout: 'gather',
        nodes: [
          { id: 'n1', label: 'Node', accent: 'compute' },
          { id: 'n2', label: 'Node', accent: 'compute' },
          { id: 'n3', label: 'Node', accent: 'compute' },
          { id: 'zk', label: 'ZooKeeper', sub: 'coordination', accent: 'edge' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Build one image; run many identical containers from it anywhere.',
        layout: 'fanout',
        nodes: [
          { id: 'img', label: 'Image', sub: 'built once', accent: 'edge' },
          { id: 'c1', label: 'Container', sub: 'dev', accent: 'compute' },
          { id: 'c2', label: 'Container', sub: 'prod', accent: 'compute' },
          { id: 'c3', label: 'Container', sub: 'CI', accent: 'compute' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Prometheus scrapes metrics from services, then powers alerts and dashboards.',
        layout: 'row',
        nodes: [
          { id: 'svc', label: 'Services', sub: 'expose metrics', accent: 'compute' },
          { id: 'prom', label: 'Prometheus', sub: 'scrape + store', accent: 'edge' },
          { id: 'out', label: 'Alerts + Grafana', accent: 'success' },
        ],
      },
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
    diagrams: [
      {
        caption: 'A big batch job is split across a cluster and processed in parallel.',
        layout: 'fanout',
        nodes: [
          { id: 'job', label: 'Batch job', sub: 'TBs of data', accent: 'compute' },
          { id: 'w1', label: 'Worker', accent: 'storage' },
          { id: 'w2', label: 'Worker', accent: 'storage' },
          { id: 'w3', label: 'Worker', accent: 'storage' },
        ],
      },
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
    diagrams: [
      {
        caption: 'Events stream in continuously; Flink processes them in real time.',
        layout: 'row',
        nodes: [
          { id: 'stream', label: 'Event stream', sub: 'Kafka', accent: 'queue' },
          { id: 'flink', label: 'Flink', sub: 'stateful, live', accent: 'compute' },
          { id: 'out', label: 'Real-time output', accent: 'success' },
        ],
      },
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
    diagrams: [
      {
        caption: 'One connection stays open; the server pushes events as they happen.',
        layout: 'sequence',
        actors: [
          { label: 'Client', accent: 'client' },
          { label: 'Server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'open connection' },
          { from: 1, to: 0, label: 'event 1', dashed: true },
          { from: 1, to: 0, label: 'event 2', dashed: true },
          { from: 1, to: 0, label: 'event 3', dashed: true },
        ],
      },
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
    diagrams: [
      {
        caption: 'Steps run forward; a failure runs compensating actions in reverse.',
        layout: 'row',
        nodes: [
          { id: 's1', label: 'Reserve', accent: 'compute' },
          { id: 's2', label: 'Charge', accent: 'compute' },
          { id: 's3', label: 'Ship', sub: 'fail -> undo', accent: 'danger' },
        ],
      },
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
  URL: {
    body: [
      "**A URL is a structured address** with four parts that each decide one thing: how to talk, to whom, about what, and with which options. scheme://host/path?query.",
      "**The parts.** The scheme (https) sets the protocol and encryption. The host (api.example.com) names the machine via DNS. The path (/users/42) names the resource the server routes to. The query string (?limit=10) carries options as key=value pairs.",
      "**Every request starts here:** the browser splits the URL, resolves the host to an IP, opens a connection, and sends a request for the path.",
    ],
    examples: [
      'https://api.example.com/users/42?fields=name -> scheme https, host api.example.com, path /users/42, query fields=name.',
      'A bare https://example.com requests the root path /.',
    ],
    diagrams: [
      {
        caption: 'Four parts, four jobs: protocol, machine, resource, options.',
        layout: 'row',
        nodes: [
          { id: 's', label: 'scheme', sub: 'https', accent: 'edge' },
          { id: 'h', label: 'host', sub: 'which machine', accent: 'compute' },
          { id: 'p', label: 'path', sub: 'which resource', accent: 'primary' },
          { id: 'q', label: 'query', sub: 'options', accent: 'default' },
        ],
        edges: [],
      },
    ],
    related: ['DNS', 'HTTP', 'query string', 'request path'],
  },

  TCP: {
    body: [
      "**TCP (Transmission Control Protocol) creates a reliable, ordered byte stream** between two machines. It guarantees that bytes arrive, in order, with no duplicates, retransmitting anything lost. HTTP runs on top of it.",
      "**The handshake.** Before any data flows, the two sides establish a connection with a three-step handshake (SYN, SYN-ACK, ACK). This round trip is why opening a new connection has a latency cost, and why connection reuse matters.",
      "**Reliable, not fast.** TCP trades a little speed for correctness. When loss-tolerant speed matters more (video, games), UDP is used instead.",
    ],
    examples: [
      'Loading a web page opens a TCP connection to port 443, then HTTP messages flow over it.',
      'A lost packet is detected and retransmitted by TCP; the application never sees the gap.',
    ],
    diagrams: [
      {
        caption: 'The three-way handshake establishes the connection before data flows.',
        layout: 'sequence',
        actors: [
          { label: 'Client', accent: 'client' },
          { label: 'Server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'SYN' },
          { from: 1, to: 0, label: 'SYN-ACK', dashed: true },
          { from: 0, to: 1, label: 'ACK' },
          { from: 0, to: 1, label: 'data flows' },
        ],
      },
    ],
    related: ['UDP', 'HTTP', 'TLS', 'packet'],
  },

  TLS: {
    body: [
      "**TLS (Transport Layer Security) encrypts a connection and proves the server is who it claims to be.** HTTPS is HTTP over TLS. It gives three guarantees: confidentiality (nobody reads the traffic), integrity (nobody alters it), and authentication (you reached the real server, via a certificate).",
      "**The handshake.** After the TCP connection, TLS negotiates: the server presents a certificate, the two sides agree on keys, and from then on the bytes are encrypted. This adds a round trip on top of TCP.",
      "**Why it matters.** Without TLS, anyone on the network path (the coffee-shop wifi, the ISP) can read or tamper with the traffic, including session cookies.",
    ],
    examples: [
      'The padlock in the browser means TLS verified the certificate and encrypted the connection.',
      'An expired certificate fails the handshake and the browser warns the user.',
    ],
    diagrams: [
      {
        caption: 'TLS negotiates a certificate and keys, then encrypts everything after.',
        layout: 'sequence',
        actors: [
          { label: 'Client', accent: 'client' },
          { label: 'Server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'hello' },
          { from: 1, to: 0, label: 'certificate', dashed: true },
          { from: 0, to: 1, label: 'agree on keys' },
          { from: 0, to: 1, label: 'encrypted data' },
        ],
      },
    ],
    related: ['TCP', 'HTTP', 'authentication', 'header'],
  },

  HTTP: {
    body: [
      "**HTTP is the request-response protocol of the web.** A client sends a request (a method, a path, headers, and maybe a body) and the server returns a response (a status code, headers, and a body). That exchange is the whole of it.",
      "**Stateless by design.** Each request stands alone; the server does not remember the last one. State is carried explicitly, in cookies, tokens, or the request itself, which is what lets any server handle any request and makes horizontal scaling possible.",
      "**Versions.** HTTP/1.1 is text and one request at a time per connection; HTTP/2 multiplexes many over one connection; HTTP/3 runs over UDP for lower latency. The message shape stays the same.",
    ],
    examples: [
      'GET /users/42 returns 200 with a JSON body; POST /users creates and returns 201.',
      'Because HTTP is stateless, a login is carried as a cookie or token on every later request.',
    ],
    diagrams: [
      {
        caption: 'One request in, one response out: the whole protocol.',
        layout: 'sequence',
        actors: [
          { label: 'Client', accent: 'client' },
          { label: 'Server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'GET /users/42' },
          { from: 1, to: 0, label: '200 + JSON', dashed: true },
        ],
      },
    ],
    related: ['request', 'response', 'status code', 'TCP'],
  },

  request: {
    body: [
      "**An HTTP request is the client's message to the server,** with a strict three-part shape: a request line (method, path, version), headers (labeled metadata), a blank line, then an optional body.",
      "**The request line is the verb and noun:** GET /users/42 HTTP/2. The method says the kind of action; the path says which resource.",
      "**Headers carry metadata:** Host (which site), Authorization (credentials), Content-Type (the body format), Accept (formats the client wants back). The body, on POST and PUT, carries the data.",
    ],
    examples: [
      'POST /users with Content-Type: application/json and a JSON body creates a user.',
      'curl -v shows the raw request lines (marked with >).',
    ],
    diagrams: [
      {
        caption: 'Request line, headers, blank line, then optional body.',
        layout: 'stack',
        nodes: [
          { id: 'line', label: 'Request line', sub: 'GET /users/42', accent: 'primary' },
          { id: 'headers', label: 'Headers', sub: 'Host, Auth, Accept', accent: 'edge' },
          { id: 'body', label: 'Body', sub: 'POST/PUT data', accent: 'compute' },
        ],
      },
    ],
    related: ['response', 'HTTP', 'header', 'body'],
  },

  response: {
    body: [
      "**An HTTP response is the server's reply,** mirroring the request shape: a status line (version + three-digit code), headers, a blank line, then the body.",
      "**The status line is the verdict:** HTTP/2 200. The code is the one-glance result the client reads before anything else.",
      "**Response headers describe the payload and the response:** Content-Type tells the client how to read the body (text/html renders, application/json parses), plus cache and date headers. Your backend code sets all of it.",
    ],
    examples: [
      '200 OK with Content-Type: application/json and a JSON body for an API read.',
      'A 404 carries an error body; a 201 carries the created resource.',
    ],
    diagrams: [
      {
        caption: 'Status line, headers, blank line, then the body your code built.',
        layout: 'stack',
        nodes: [
          { id: 'status', label: 'Status line', sub: 'HTTP/2 200', accent: 'success' },
          { id: 'headers', label: 'Headers', sub: 'Content-Type', accent: 'edge' },
          { id: 'body', label: 'Body', sub: 'HTML or JSON', accent: 'compute' },
        ],
      },
    ],
    related: ['request', 'status code', 'header', 'body'],
  },

  header: {
    body: [
      "**A header is a labeled metadata line on an HTTP message,** written Name: value. Headers describe the request or response without being the actual content: who is asking, what format the body is, what the client accepts, how to cache.",
      "**Common ones.** On requests: Host, Authorization, Content-Type, Accept, User-Agent, Cookie. On responses: Content-Type, Cache-Control, Set-Cookie, Location. Header names are case-insensitive.",
      "**They are the control plane of HTTP:** auth, caching, content negotiation, and CORS are all decided by headers, separate from the body that carries the data.",
    ],
    examples: [
      'Authorization: Bearer eyJ... carries a token; Content-Type: application/json declares the body format.',
      'Cache-Control: max-age=300 tells caches to reuse the response for five minutes.',
    ],
    diagrams: [
      {
        caption: 'Headers are labeled metadata around the body.',
        layout: 'row',
        nodes: [
          { id: 'name', label: 'Name', sub: 'Content-Type', accent: 'edge' },
          { id: 'val', label: 'Value', sub: 'application/json', accent: 'compute' },
        ],
        edges: [],
      },
    ],
    related: ['request', 'response', 'CORS', 'status code'],
  },

  body: {
    body: [
      "**The body is the payload of an HTTP message,** the actual data, separated from the headers by a blank line. A request body carries what you are sending (a JSON object on POST); a response body carries what you get back (HTML for a page, JSON for an API, bytes for an image).",
      "**The Content-Type header tells the receiver how to read it.** A body of JSON with Content-Type: application/json gets parsed as data; the same bytes labeled text/html would be rendered. Mismatches are a common integration bug.",
      "**Not every message has one.** GET requests rarely carry a body; a 204 response has none. The body is for when there is data to move.",
    ],
    examples: [
      'A POST /users body: {"name": "Kay", "role": "admin"}.',
      'A response body is HTML for a browser, JSON for an API client.',
    ],
    diagrams: [
      {
        caption: 'Headers describe; the body carries the data.',
        layout: 'row',
        nodes: [
          { id: 'headers', label: 'Headers', sub: 'Content-Type', accent: 'edge' },
          { id: 'blank', label: 'Blank line', accent: 'default' },
          { id: 'body', label: 'Body', sub: 'JSON / HTML', accent: 'compute' },
        ],
      },
    ],
    related: ['header', 'request', 'response', 'JSON'],
  },

  'query string': {
    body: [
      "**The query string is everything after the ? in a URL,** a set of key=value pairs joined by &. It carries options: filters, pagination, search terms, sort order.",
      "**Order does not matter, and every value arrives as text.** ?limit=10 gives the server the string \"10\", which it must parse and validate before using as a number. This is the same coercion trap as form input.",
      "**It tweaks how a resource is returned, not which resource.** The path names the resource; the query shapes the response (which fields, which page, what filter).",
    ],
    examples: [
      '/products?category=books&page=2&sort=price filters, paginates, and sorts.',
      'A value of 10 arrives as the string "10"; the backend converts and bounds-checks it.',
    ],
    diagrams: [
      {
        caption: 'Key=value pairs after the ?, joined by &.',
        layout: 'row',
        nodes: [
          { id: 'path', label: '/products', sub: 'the resource', accent: 'primary' },
          { id: 'q1', label: 'category=books', accent: 'compute' },
          { id: 'q2', label: 'page=2', accent: 'compute' },
        ],
        edges: [],
      },
    ],
    related: ['URL', 'request path', 'validation', 'API'],
  },

  'status code': {
    body: [
      "**A status code is the three-digit verdict on the status line of every HTTP response,** and the first digit tells the story. 2xx worked, 3xx look elsewhere, 4xx the client erred, 5xx the server erred.",
      "**The codes you meet daily.** 200 OK, 201 Created, 204 No Content; 301/302 redirects, 304 Not Modified; 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests; 500 Internal Server Error, 502/503 infrastructure.",
      "**The load-bearing split is 4xx vs 5xx: whose fault.** A 4xx says fix the request; a 5xx says the server failed. Monitoring alarms on 5xx because those are your bugs.",
    ],
    examples: [
      '401 means who are you (no valid credentials); 403 means you may not (known but forbidden).',
      'Returning 500 for bad user input pollutes error dashboards; use 400.',
    ],
    diagrams: [
      {
        caption: 'The first digit is the family: success, redirect, client error, server error.',
        layout: 'row',
        nodes: [
          { id: 'c2', label: '2xx', sub: 'worked', accent: 'success' },
          { id: 'c3', label: '3xx', sub: 'moved', accent: 'edge' },
          { id: 'c4', label: '4xx', sub: 'client erred', accent: 'cache' },
          { id: 'c5', label: '5xx', sub: 'server erred', accent: 'danger' },
        ],
        edges: [],
      },
    ],
    related: ['response', 'HTTP', 'request'],
  },

  CORS: {
    body: [
      "**CORS (Cross-Origin Resource Sharing) is the browser rule that controls which sites may call your API from JavaScript.** By default a page on site A cannot read responses from site B; CORS headers from the server opt specific origins back in.",
      "**How it works.** For certain requests the browser first sends a preflight OPTIONS asking \"may site A call this?\" The server answers with Access-Control-Allow-Origin and friends. If the headers permit it, the real request proceeds; otherwise the browser blocks the response.",
      "**It is enforced by the browser, not the server.** curl and server-to-server calls ignore CORS entirely. It protects users in browsers, not the API itself, which still needs its own auth.",
    ],
    examples: [
      'A frontend on app.com calling api.com needs api.com to return Access-Control-Allow-Origin: https://app.com.',
      'A blocked CORS request shows a console error even though the server received and answered it.',
    ],
    diagrams: [
      {
        caption: 'The browser preflights a cross-origin call; the server allows or denies the origin.',
        layout: 'sequence',
        actors: [
          { label: 'Browser', accent: 'client' },
          { label: 'API server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'OPTIONS preflight' },
          { from: 1, to: 0, label: 'Allow-Origin: app.com', dashed: true },
          { from: 0, to: 1, label: 'real request' },
        ],
      },
    ],
    related: ['header', 'request', 'authentication', 'API'],
  },

  'request path': {
    body: [
      "**The request path is the part of the URL after the host:** /users/42. The server's router reads it to decide which code handles the request.",
      "**Paths are the nouns of an API.** /users is a collection; /users/42 is one item; /users/42/orders is a nested relationship. The HTTP method (the verb) plus the path (the noun) together pick the handler.",
      "**Routing matches the path to a handler,** often with parameters: /users/:id captures 42 into id. Most 404s and routing bugs are a path not matching the route the developer expected.",
    ],
    examples: [
      'GET /users/42 routes to the get-user handler with id 42.',
      'A trailing-slash or case mismatch between the request path and the route causes a 404.',
    ],
    diagrams: [
      {
        caption: 'The router matches the path to a handler.',
        layout: 'row',
        nodes: [
          { id: 'path', label: '/users/42', accent: 'primary' },
          { id: 'router', label: 'Router', sub: 'match route', accent: 'edge' },
          { id: 'handler', label: 'Handler', sub: 'get user 42', accent: 'compute' },
        ],
      },
    ],
    related: ['URL', 'endpoint', 'API', 'status code'],
  },

  API: {
    body: [
      "**An API (Application Programming Interface) is a contract one program exposes so another can ask it to do work or return data.** It is the documented set of requests a server accepts and the responses it returns, so clients build against it without ever seeing the server's code.",
      "**Why it matters.** The contract is the boundary that lets teams work in parallel: the mobile, web, and partner teams all integrate against the same surface while the backend rewrites its internals freely.",
      "**Most backend APIs are HTTP + JSON** (REST or GraphQL at the edge, gRPC between services). Designing one well is choosing routes, error shapes, validation, and pagination that stay pleasant after years.",
    ],
    examples: [
      'GET /users/42 returns {"id": 42, "name": "Kay"}; the client never sees the database behind it.',
      'Changing a response field is a breaking contract change that affects every client.',
    ],
    diagrams: [
      {
        caption: 'The API is the documented contract between client and server.',
        layout: 'row',
        nodes: [
          { id: 'client', label: 'Client', accent: 'client' },
          { id: 'api', label: 'API', sub: 'the contract', accent: 'edge' },
          { id: 'server', label: 'Server', sub: 'hidden internals', accent: 'compute' },
        ],
      },
    ],
    related: ['endpoint', 'JSON', 'HTTP', 'API gateway'],
  },

  endpoint: {
    body: [
      "**An endpoint is one callable operation of an API:** a method plus a path, like GET /users/:id. It is the specific door a client knocks on to do one thing.",
      "**Method plus path picks the handler.** The same path with different methods is different endpoints: GET /users (list), POST /users (create), GET /users/42 (read one), DELETE /users/42 (remove).",
      "**A well-named endpoint reads as a sentence:** the verb is the method, the noun is the path. Verbs in the path (/getUsers) are a smell, because the method already says the action.",
    ],
    examples: [
      'POST /orders creates an order; GET /orders/7 reads order 7.',
      'GET /users and POST /users are two endpoints sharing one path.',
    ],
    diagrams: [
      {
        caption: 'Method + path resolves to one handler.',
        layout: 'row',
        nodes: [
          { id: 'm', label: 'GET', sub: 'method', accent: 'edge' },
          { id: 'p', label: '/users/42', sub: 'path', accent: 'primary' },
          { id: 'h', label: 'Handler', accent: 'compute' },
        ],
      },
    ],
    related: ['API', 'request path', 'controller', 'middleware'],
  },

  JSON: {
    body: [
      "**JSON (JavaScript Object Notation) is how APIs write data as text.** Objects in braces with quoted keys, arrays in brackets, plus strings, numbers, true/false, and null. Six types, and every language can read and write it.",
      "**The strict rules trip people:** keys must be double-quoted, no trailing commas, no comments, double quotes only. These are stricter than JavaScript itself, so hand-written JSON breaks on exactly those.",
      "**Parse and serialize.** Languages convert between text and live data (JSON.parse / JSON.stringify and equivalents). APIs serialize on the way out and parse on the way in.",
    ],
    examples: [
      '{"name": "Kay", "active": true, "orders": [{"id": 101}]} is a valid nested object.',
      "{'name': 'Kay'} is invalid JSON: single quotes are a JavaScript habit, not JSON.",
    ],
    diagrams: [
      {
        caption: 'Six value types make up the whole grammar.',
        layout: 'row',
        nodes: [
          { id: 'obj', label: 'Object {}', accent: 'compute' },
          { id: 'arr', label: 'Array []', accent: 'edge' },
          { id: 'prim', label: 'string/number', sub: 'bool/null', accent: 'default' },
        ],
        edges: [],
      },
    ],
    related: ['API', 'body', 'dictionary', 'validation'],
  },

  middleware: {
    body: [
      "**Middleware is code that runs in a chain around your request handler,** each piece doing one cross-cutting job before (or after) the handler: parsing the body, checking auth, logging, rate limiting, handling errors.",
      "**The chain shape.** A request passes through each middleware in order, and each can pass it along, modify it, or stop it short (rejecting an unauthenticated request before it reaches the handler). The response passes back out through them.",
      "**Why it exists:** to keep cross-cutting concerns out of every handler. Auth, logging, and CORS live in one place in the chain instead of being copy-pasted into each route.",
    ],
    examples: [
      'app.use(authMiddleware) checks the token on every route before the handler runs.',
      'An error-handling middleware at the end turns any thrown error into a clean JSON response.',
    ],
    diagrams: [
      {
        caption: 'The request passes through each middleware before reaching the handler.',
        layout: 'row',
        nodes: [
          { id: 'req', label: 'Request', accent: 'client' },
          { id: 'auth', label: 'Auth', accent: 'edge' },
          { id: 'log', label: 'Logging', accent: 'edge' },
          { id: 'h', label: 'Handler', accent: 'compute' },
        ],
      },
    ],
    related: ['controller', 'endpoint', 'authentication', 'rate limit'],
  },

  service: {
    body: [
      "**A service is the layer that holds business logic,** sitting between the thin controller (which speaks HTTP) and the repository (which speaks to the database). It is where the rules of the domain live.",
      "**Why separate it.** A controller that mixes HTTP parsing, business rules, and SQL is hard to test and reuse. Pulling the logic into a service lets you unit-test it without HTTP or a database, and call it from a queue worker or a CLI too.",
      "**A pure service core** takes plain inputs, returns plain outputs, and keeps side effects (database, network) at the edges, which is the most testable shape of backend code.",
    ],
    examples: [
      'createOrder(input) validates, applies pricing rules, and calls the repository, with no HTTP knowledge.',
      'The same order service is called by the HTTP controller and by a background job.',
    ],
    diagrams: [
      {
        caption: 'The service holds business logic between the controller and the data layer.',
        layout: 'row',
        nodes: [
          { id: 'ctrl', label: 'Controller', sub: 'HTTP', accent: 'edge' },
          { id: 'svc', label: 'Service', sub: 'business logic', accent: 'compute' },
          { id: 'repo', label: 'Repository', sub: 'data', accent: 'storage' },
        ],
      },
    ],
    related: ['controller', 'repository', 'business rule', 'service shape'],
  },

  'service shape': {
    body: [
      "**A service method has a recognizable shape:** read the input, validate it, apply the business rule, perform the effect (write to the database, call another service), and return a result. The same pipeline appears in every well-structured handler.",
      "**The order matters.** Validate before doing anything; keep the pure decision (the business rule) separate from the side effect, so the decision is testable and the effect is at the edge.",
      "**Recognizing the shape** lets you read unfamiliar handler code quickly and write new ones without reinventing the structure each time.",
    ],
    examples: [
      'transfer(input): validate amounts -> check balance (rule) -> write the two ledger rows (effect) -> return the result.',
      'Validation up front means the effect never runs on bad input.',
    ],
    diagrams: [
      {
        caption: 'Read, validate, decide, effect, return: the universal handler pipeline.',
        layout: 'row',
        nodes: [
          { id: 'in', label: 'Read input', accent: 'client' },
          { id: 'val', label: 'Validate', accent: 'edge' },
          { id: 'rule', label: 'Business rule', accent: 'compute' },
          { id: 'eff', label: 'Effect + return', accent: 'storage' },
        ],
      },
    ],
    related: ['service', 'validation', 'business rule', 'side effect'],
  },

  'business rule': {
    body: [
      "**A business rule is a decision the domain requires,** independent of HTTP or the database: a transfer cannot overdraw an account, a discount applies only above $50, an order cannot ship before payment clears.",
      "**Keep rules pure and central.** A rule expressed as a pure function (inputs in, decision out) is trivially testable and lives in one place, rather than being scattered and duplicated across controllers and queries.",
      "**Rules versus mechanics.** Parsing JSON and writing SQL are mechanics; deciding whether the transfer is allowed is the rule. Mixing them is what makes code hard to change when the business changes.",
    ],
    examples: [
      'canWithdraw(balance, amount) returns whether the withdrawal is allowed, with no database call.',
      'A pricing rule lives in one function, so changing the discount threshold is a one-line edit.',
    ],
    diagrams: [
      {
        caption: 'The pure rule decides; the effect acts on the decision.',
        layout: 'row',
        nodes: [
          { id: 'in', label: 'Inputs', accent: 'client' },
          { id: 'rule', label: 'Business rule', sub: 'pure decision', accent: 'compute' },
          { id: 'out', label: 'Allow / deny', accent: 'success' },
        ],
      },
    ],
    related: ['service', 'service shape', 'side effect', 'validation'],
  },

  validation: {
    body: [
      "**Validation checks that incoming data is acceptable before any logic runs.** Every request body is text composed by software you do not control, so validation is the bouncer at the door.",
      "**The four checks, in order:** presence (required fields exist), type (the quantity is a number), format (the email matches a pattern), and bounds (1 <= quantity <= 100). Also allowlist fields, so a request cannot set role: admin just because the field landed in the write.",
      "**Fail fast with one clear error.** Collect all field errors and return them together as a 400, so the client fixes everything in one round trip. Validation is also the first security layer: most injection and corrupt-data incidents enter through an unvalidated field.",
    ],
    examples: [
      'A signup with email "kay@" and quantity "-3" fails format and bounds, returning a 400 with per-field details.',
      'Allowlisting drops an uninvited "role": "admin" field instead of honoring it.',
    ],
    diagrams: [
      {
        caption: 'Presence, type, format, bounds, then trust the data.',
        layout: 'row',
        nodes: [
          { id: 'p', label: 'Presence', accent: 'edge' },
          { id: 't', label: 'Type', accent: 'edge' },
          { id: 'f', label: 'Format', accent: 'edge' },
          { id: 'b', label: 'Bounds', accent: 'success' },
        ],
        edges: [],
      },
    ],
    related: ['business rule', 'service shape', 'status code', 'XSS'],
  },

  controller: {
    body: [
      "**A controller is the thin layer that speaks HTTP,** translating a request into a service call and the result back into a response. It parses input, calls the service, and formats the output, and holds no business logic itself.",
      "**Keep it thin (a controller diet).** When business rules leak into the controller, they become untestable without HTTP and impossible to reuse from a worker or CLI. The controller's job is plumbing, not decisions.",
      "**The pipeline:** parse and validate the request, call the service, map the result (or a thrown error) to a status code and body.",
    ],
    examples: [
      'createUserController reads the body, calls userService.create, and returns 201 with the new user.',
      'A controller that contains SQL and pricing math is doing too much; move that into a service.',
    ],
    diagrams: [
      {
        caption: 'Thin controller: parse, call the service, format the response.',
        layout: 'row',
        nodes: [
          { id: 'req', label: 'Request', accent: 'client' },
          { id: 'ctrl', label: 'Controller', sub: 'thin', accent: 'edge' },
          { id: 'svc', label: 'Service', accent: 'compute' },
        ],
      },
    ],
    related: ['service', 'middleware', 'endpoint', 'repository'],
  },

  repository: {
    body: [
      "**A repository is the layer that talks to the database,** hiding the storage details (SQL, the ORM, the query) behind methods like findUser(id) and saveOrder(order). The rest of the app asks for data without knowing how it is stored.",
      "**Why the boundary.** It keeps SQL out of the business logic, makes the service testable with a fake repository, and lets you change the storage (swap databases, add a cache) without touching the rules.",
      "**It is the data edge of the service shape:** the service decides, the repository performs the read or write.",
    ],
    examples: [
      'orderRepository.findById(7) returns an order; the service never writes SQL.',
      'Tests pass an in-memory fake repository so the service runs without a database.',
    ],
    diagrams: [
      {
        caption: 'The repository hides storage details behind simple methods.',
        layout: 'row',
        nodes: [
          { id: 'svc', label: 'Service', accent: 'compute' },
          { id: 'repo', label: 'Repository', sub: 'findById, save', accent: 'edge' },
          { id: 'db', label: 'Database', accent: 'storage' },
        ],
      },
    ],
    related: ['service', 'database', 'controller', 'N+1 query'],
  },

  config: {
    body: [
      "**Config is the set of values that change per environment** without changing code: the database URL, API keys, feature flags, the port. Dev, staging, and production run the same code with different config.",
      "**It comes from the environment, not the source.** Reading config from environment variables (or a config service) keeps secrets out of git and lets the same build run anywhere. Required config should be validated at startup, failing loudly if missing.",
      "**Config vs code:** if a value differs between environments or must stay secret, it is config. Baking it into the code forces a rebuild to change it and risks leaking secrets.",
    ],
    examples: [
      'process.env.DATABASE_URL differs per environment; the code reads the name, never the value.',
      'A missing required env var should crash at startup, not silently mid-request.',
    ],
    diagrams: [
      {
        caption: 'Config flows from the environment into the same code per deployment.',
        layout: 'row',
        nodes: [
          { id: 'env', label: 'Environment', sub: 'env vars', accent: 'edge' },
          { id: 'app', label: 'App', sub: 'reads config', accent: 'compute' },
        ],
        edges: [],
      },
    ],
    related: ['deployment', 'framework', 'dependency management', 'authentication'],
  },

  framework: {
    body: [
      "**A framework provides the structure and plumbing for an app** so you write the parts that are unique to it. A web framework (Express, Flask, Django, ASP.NET) handles parsing HTTP, routing, and the response, calling your handler functions at the right time.",
      "**Framework vs library.** You call a library; a framework calls you. The framework owns the main loop and the flow; you fill in the handlers, models, and config it asks for.",
      "**It is a trade.** A framework saves you from reinventing routing, validation, and serialization, at the cost of learning its conventions and living within its structure.",
    ],
    examples: [
      'Express routes GET /users to your handler; you never write the HTTP parsing.',
      'Django gives you an ORM, admin, and auth out of the box; you write the app on top.',
    ],
    diagrams: [
      {
        caption: 'The framework owns the flow and calls your handlers.',
        layout: 'row',
        nodes: [
          { id: 'fw', label: 'Framework', sub: 'routing, HTTP', accent: 'edge' },
          { id: 'h', label: 'Your handlers', accent: 'compute' },
        ],
        edges: [{ from: 'fw', to: 'h', label: 'calls' }],
      },
    ],
    related: ['middleware', 'controller', 'runtime', 'dependency management'],
  },

  database: {
    body: [
      "**A database is a separate program whose job is keeping data safe and queryable.** Unlike your app's variables, it survives restarts, accepts many connections at once, and answers questions over millions of rows in milliseconds.",
      "**Relational databases (PostgreSQL, MySQL)** store data in tables of typed columns with relationships between them, and guarantee ACID transactions. NoSQL databases trade some of that for specific scale or flexibility (key-value, document, wide-column, graph).",
      "**It is usually the hardest thing to scale,** because it holds the state. Stateless app servers scale trivially; the database is scaled with indexes, replicas, caching, and eventually sharding.",
    ],
    examples: [
      'Users, orders, and payments live in a relational database with foreign keys linking them.',
      'When an app is slow, the database is the first suspect.',
    ],
    diagrams: [
      {
        caption: 'Tables of rows and columns, queried by the app.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App', accent: 'compute' },
          { id: 'db', label: 'Database', sub: 'tables, rows', accent: 'storage' },
        ],
      },
    ],
    related: ['SQL', 'table', 'index', 'transaction'],
  },

  SQL: {
    body: [
      "**SQL (Structured Query Language) is how you ask a relational database for data.** You describe what you want and the database figures out how to get it. SELECT reads, INSERT/UPDATE/DELETE write.",
      "**Every query is a pipeline:** FROM picks the table, WHERE filters rows, GROUP BY buckets them, ORDER BY sorts, LIMIT cuts. Each clause reshapes the table flowing through it.",
      "**It is the most transferable backend skill,** because the same language (with small dialect differences) runs PostgreSQL, MySQL, SQLite, and more.",
    ],
    examples: [
      "SELECT name FROM users WHERE role = 'admin' ORDER BY name LIMIT 10.",
      'A JOIN combines rows from two tables on a matching key.',
    ],
    diagrams: [
      {
        caption: 'A query is a pipeline that reshapes the table at each clause.',
        layout: 'row',
        nodes: [
          { id: 'from', label: 'FROM', sub: 'table', accent: 'storage' },
          { id: 'where', label: 'WHERE', sub: 'filter', accent: 'edge' },
          { id: 'order', label: 'ORDER + LIMIT', sub: 'sort + cut', accent: 'compute' },
        ],
      },
    ],
    related: ['database', 'table', 'index', 'PostgreSQL'],
  },

  PostgreSQL: {
    body: [
      "**PostgreSQL is a powerful open-source relational database,** a common default for new backends. It gives you ACID transactions, joins, strict SQL, rich types (JSON, arrays, geospatial), and extensions.",
      "**Why teams pick it.** It is free, reliable, feature-rich, and handles a wide range of workloads, from transactional apps to analytical queries, far longer than people expect before any specialized store is needed.",
      "**Scales the usual way:** indexes and query tuning, then read replicas, then partitioning and sharding. Managed versions (Amazon RDS, Aurora) remove most of the operational work.",
    ],
    examples: [
      'A typical web app runs entirely on PostgreSQL for years before needing anything else.',
      'Its JSONB columns let you store flexible documents inside a relational database.',
    ],
    diagrams: [
      {
        caption: 'A relational core: tables, transactions, and joins.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App', accent: 'compute' },
          { id: 'pg', label: 'PostgreSQL', sub: 'ACID, joins', accent: 'storage' },
        ],
      },
    ],
    related: ['database', 'SQL', 'MySQL', 'transaction'],
  },

  table: {
    body: [
      "**A table holds one kind of thing,** laid out like a spreadsheet: a users table, an orders table. Each row is one record; each column is a typed field every row has.",
      "**Columns have types** the database enforces (text, integer, timestamp, boolean), so data that does not fit is rejected at the door, a type system for storage.",
      "**Tables relate to each other** through keys: a primary key uniquely identifies each row, and a foreign key in one table points at the primary key of another, which is what makes the data relational.",
    ],
    examples: [
      'A users table with columns id, name, role, email; one row per user.',
      'An orders table with a user_id column referencing the users table.',
    ],
    diagrams: [
      {
        caption: 'Rows are records; columns are typed fields.',
        layout: 'row',
        nodes: [
          { id: 'rows', label: 'Rows', sub: 'records', accent: 'compute' },
          { id: 'cols', label: 'Columns', sub: 'typed fields', accent: 'edge' },
        ],
        edges: [],
      },
    ],
    related: ['database', 'primary key', 'foreign key', 'SQL'],
  },

  'primary key': {
    body: [
      "**A primary key is the column that uniquely identifies each row,** usually an id. The database enforces that it is unique and never null, so a second row with the same id is rejected.",
      "**It is the anchor other tables point at.** Because a primary key is guaranteed unique, foreign keys in other tables can reference it to link records reliably.",
      "**It is indexed automatically,** so lookups by primary key are fast. Ids that sort by creation time (auto-increment, or Snowflake-style) also make pagination and indexes more efficient than random ones.",
    ],
    examples: [
      'users.id is the primary key; orders.user_id references it.',
      'Inserting a duplicate id is rejected with a uniqueness violation, never a silent overwrite.',
    ],
    diagrams: [
      {
        caption: 'A unique, never-null id that other tables can safely reference.',
        layout: 'row',
        nodes: [
          { id: 'pk', label: 'Primary key', sub: 'unique id', accent: 'primary' },
          { id: 'fk', label: 'Foreign key', sub: 'points here', accent: 'edge' },
        ],
        edges: [{ from: 'fk', to: 'pk', label: 'references' }],
      },
    ],
    related: ['foreign key', 'table', 'index', 'database'],
  },

  'foreign key': {
    body: [
      "**A foreign key is a column that points at another table's primary key,** linking records: orders.user_id references users.id, so each order knows its owner.",
      "**The database can enforce it,** refusing an order whose user_id has no matching user (referential integrity). That guarantees the link is always valid.",
      "**It is what JOINs follow.** A query that needs a user's name with their orders joins the two tables on the foreign key. Indexing the foreign key keeps those joins fast.",
    ],
    examples: [
      'orders.user_id (foreign key) -> users.id (primary key).',
      'A JOIN ON orders.user_id = users.id pairs each order with its user.',
    ],
    diagrams: [
      {
        caption: 'A foreign key links rows across tables.',
        layout: 'row',
        nodes: [
          { id: 'o', label: 'orders', sub: 'user_id (FK)', accent: 'compute' },
          { id: 'u', label: 'users', sub: 'id (PK)', accent: 'primary' },
        ],
        edges: [{ from: 'o', to: 'u', label: 'references' }],
      },
    ],
    related: ['primary key', 'table', 'index', 'N+1 query'],
  },

  migration: {
    body: [
      "**A migration is a versioned, repeatable change to the database schema:** add a column, create a table, change a type. Each migration is a script, applied in order, so every environment ends up with the same structure.",
      "**Why versioned.** Code changes alongside the schema it needs. Migrations live in source control and run as part of deployment, so dev, staging, and production stay in sync, and a new teammate's database is built by replaying them.",
      "**The careful part is production.** A migration on a huge table can lock it or take a long time; safe migrations are written to be backward-compatible and applied without downtime.",
    ],
    examples: [
      'A migration adds an email_verified column with a default, then a later one backfills it.',
      'Running pending migrations is a deploy step, so the schema matches the new code.',
    ],
    diagrams: [
      {
        caption: 'Ordered schema changes replay to bring any database up to date.',
        layout: 'row',
        nodes: [
          { id: 'm1', label: 'Migration 1', accent: 'edge' },
          { id: 'm2', label: 'Migration 2', accent: 'edge' },
          { id: 'm3', label: 'Migration 3', accent: 'success' },
        ],
      },
    ],
    related: ['database', 'table', 'deployment', 'CI/CD'],
  },

  'N+1 query': {
    body: [
      "**The N+1 query is a classic performance bug:** one query to fetch a list, then one more query per item in a loop, so a list of 100 becomes 101 queries instead of one or two.",
      "**Where it hides.** It is easy to write accidentally with an ORM: you load 100 orders, then access each order's user inside a loop, and the ORM silently fires a query per access.",
      "**The fix is a single JOIN or a batched load** (fetch all the needed users in one query, often called eager loading). Watching the query count in development is how you catch it before it reaches production.",
    ],
    examples: [
      'Loading 100 posts then accessing each post.author fires 1 + 100 = 101 queries.',
      'A JOIN, or loading all authors in one IN (...) query, replaces the 100 with one.',
    ],
    diagrams: [
      {
        caption: 'One list query plus one per item, where a single JOIN would do.',
        layout: 'fanout',
        nodes: [
          { id: 'list', label: '1 list query', accent: 'compute' },
          { id: 'q1', label: '+ query per row', accent: 'danger' },
          { id: 'q2', label: '+ query per row', accent: 'danger' },
          { id: 'q3', label: '+ query per row', accent: 'danger' },
        ],
      },
    ],
    related: ['index', 'database', 'repository', 'latency'],
  },

  authentication: {
    body: [
      "**Authentication answers who are you.** It proves the identity of whoever is making a request, with passwords, sessions, tokens (JWT), API keys, or OAuth. It happens before your handler logic, usually in middleware.",
      "**It is distinct from authorization** (what you may do). You can know exactly who someone is and still refuse the action. A missing or invalid credential returns 401 (who are you?); a known-but-forbidden one returns 403.",
      "**Passwords are never stored in the clear,** only as slow salted hashes. Sessions and tokens are the two common ways to stay logged in after the initial check.",
    ],
    examples: [
      'A login verifies the password hash, then issues a session cookie or JWT.',
      'A request with no valid credential is rejected with 401 before reaching the handler.',
    ],
    diagrams: [
      {
        caption: 'Login proves identity; later requests carry the proof.',
        layout: 'sequence',
        actors: [
          { label: 'Client', accent: 'client' },
          { label: 'Server', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'login (credentials)' },
          { from: 1, to: 0, label: 'session / token', dashed: true },
          { from: 0, to: 1, label: 'request + credential' },
        ],
      },
    ],
    related: ['authorization', 'JWT', 'OAuth', 'JWT'],
  },

  authorization: {
    body: [
      "**Authorization answers what may you do.** After authentication establishes who you are, authorization decides whether you may perform this action on this resource: may this user delete that post, read that account, access that admin page.",
      "**It runs after authn, before the effect.** A failed authorization returns 403 Forbidden (I know who you are, but no), versus 401 for unauthenticated. The check must be on the specific resource, not just the type.",
      "**The classic bug** is checking permission on the resource type but not the specific record, so any logged-in user can read another user's data by changing an id. Always scope the check to the actual object.",
    ],
    examples: [
      'A user may edit their own profile (allow) but not another user\'s (403).',
      'An admin-only route checks the role after authentication confirms the identity.',
    ],
    diagrams: [
      {
        caption: 'First who are you (authn), then may you do this (authz).',
        layout: 'row',
        nodes: [
          { id: 'authn', label: 'Authenticate', sub: 'who', accent: 'edge' },
          { id: 'authz', label: 'Authorize', sub: 'may you', accent: 'compute' },
          { id: 'act', label: 'Action', accent: 'success' },
        ],
      },
    ],
    related: ['authentication', 'JWT', 'multi-tenancy', 'security'],
  },

  OAuth: {
    body: [
      "**OAuth is a protocol for delegated access:** it lets a user grant one app limited access to their data in another, without sharing their password. It is what powers Sign in with Google and connect your account flows.",
      "**The authorization-code flow.** The app sends the user to the provider (Google) to log in and consent; the provider redirects back with a short code; the app exchanges that code for an access token it uses to call the provider's API on the user's behalf.",
      "**It separates authentication from authorization of access.** The user never gives the app their provider password; the app gets a scoped, revocable token instead.",
    ],
    examples: [
      'Sign in with Google: you log in at Google, which hands your app a token, never your Google password.',
      'A scoped token lets an app read your calendar but not your email.',
    ],
    diagrams: [
      {
        caption: 'The user authorizes at the provider, which returns a token to the app.',
        layout: 'sequence',
        actors: [
          { label: 'App', accent: 'compute' },
          { label: 'User', accent: 'client' },
          { label: 'Provider', accent: 'edge' },
        ],
        messages: [
          { from: 0, to: 1, label: 'redirect to provider' },
          { from: 1, to: 2, label: 'log in + consent' },
          { from: 2, to: 0, label: 'code -> token', dashed: true },
        ],
      },
    ],
    related: ['authentication', 'authorization', 'JWT'],
  },

  CSRF: {
    body: [
      "**CSRF (Cross-Site Request Forgery) tricks a logged-in user's browser into making an unwanted request to a site they are authenticated with.** Because the browser auto-sends cookies, a hidden form on a malicious page can act as the victim.",
      "**The attack.** You are logged into your bank; you visit a malicious page that auto-submits a transfer form to the bank; the browser attaches your bank session cookie, and the transfer looks legitimate.",
      "**The defenses.** A CSRF token (a secret the server checks that an attacker cannot know), the SameSite cookie attribute (which stops cookies on cross-site requests), and checking the Origin header.",
    ],
    examples: [
      'A hidden form on evil.com POSTs to bank.com/transfer using your logged-in cookie.',
      'SameSite=Lax cookies are not sent on the cross-site POST, blocking the attack.',
    ],
    diagrams: [
      {
        caption: 'A malicious page rides the victim\'s session cookie to a trusted site.',
        layout: 'sequence',
        actors: [
          { label: 'Evil page', accent: 'danger' },
          { label: 'Browser', accent: 'client' },
          { label: 'Bank', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'auto-submit form' },
          { from: 1, to: 2, label: 'POST + your cookie' },
        ],
      },
    ],
    related: ['XSS', 'authentication', 'header', 'security'],
  },

  XSS: {
    body: [
      "**XSS (Cross-Site Scripting) is injecting code into a page so it runs in other users' browsers.** A comment containing a script tag, stored and rendered raw, executes for everyone who views it, able to steal cookies or act as them.",
      "**It is the same disease as SQL injection, in HTML:** user data treated as code. The cure is output escaping, rendering user text as text (the script tag shows as harmless characters) rather than as live HTML.",
      "**Modern frameworks escape by default** (React, for example) unless you explicitly opt out with a dangerously-named API. The dangerous spots are raw HTML insertion and unescaped templates.",
    ],
    examples: [
      'A comment of <script>steal(document.cookie)</script> rendered raw runs for every viewer.',
      'Escaping renders it as visible text instead of executing it.',
    ],
    diagrams: [
      {
        caption: 'User data rendered as code runs in the victim\'s browser; escaping neutralizes it.',
        layout: 'row',
        nodes: [
          { id: 'inj', label: 'Injected script', accent: 'danger' },
          { id: 'render', label: 'Rendered raw', sub: 'runs', accent: 'danger' },
          { id: 'esc', label: 'Escaped', sub: 'shown as text', accent: 'success' },
        ],
        edges: [{ from: 'inj', to: 'render' }, { from: 'inj', to: 'esc' }],
      },
    ],
    related: ['CSRF', 'validation', 'authentication', 'security'],
  },

  'cache invalidation': {
    body: [
      "**Cache invalidation is removing or refreshing a cached copy when the underlying truth changes.** It is the famously hard part of caching, because copies of old data keep getting served after the source was updated.",
      "**Three strategies.** TTL: entries expire on a clock (simple, always the default). Invalidate-on-write: when code updates the database, it also deletes the relevant cache keys (near-zero staleness, but every write must know every dependent key). Write-through: writes update cache and database together.",
      "**TTL backs up everything.** Even with explicit invalidation, a short TTL is the safety net for the key someone forgot, so a missed invalidation heals in minutes instead of forever.",
    ],
    examples: [
      'A price update deletes cache:product:42 and the cached search page; a 300s TTL covers any key that was missed.',
      'A deleted post that keeps appearing is an invalidation bug: a derived cache was never cleared.',
    ],
    diagrams: [
      {
        caption: 'On write, delete the dependent keys; TTL is the backstop.',
        layout: 'row',
        nodes: [
          { id: 'write', label: 'Write', accent: 'primary' },
          { id: 'del', label: 'Delete keys', sub: 'on write', accent: 'edge' },
          { id: 'ttl', label: 'TTL backstop', sub: 'heals misses', accent: 'cache' },
        ],
      },
    ],
    related: ['cache', 'CDN', 'eventual consistency', 'hot key'],
  },

  worker: {
    body: [
      "**A worker is a process that pulls jobs from a queue and does the slow work,** outside the request path. While the web tier answers users fast, workers drain the backlog: sending emails, transcoding video, generating reports.",
      "**It scales independently** of the web tier. If the queue backs up, you add workers; the user-facing servers are unaffected. Workers are usually idempotent, since queues deliver at least once and a job can be redelivered.",
      "**It is the consumer half of a queue.** The producer (a request) enqueues; the worker dequeues and processes, acknowledging when done so the message is removed.",
    ],
    examples: [
      'A web request enqueues send-receipt; a pool of workers sends the emails seconds later.',
      'Queue depth climbing triggers autoscaling to add more workers.',
    ],
    diagrams: [
      {
        caption: 'Workers drain the queue outside the request path.',
        layout: 'row',
        nodes: [
          { id: 'q', label: 'Queue', accent: 'queue' },
          { id: 'w', label: 'Workers', sub: 'process jobs', accent: 'compute' },
        ],
        edges: [{ from: 'q', to: 'w', label: 'pull + ack' }],
      },
    ],
    related: ['queue', 'dead-letter queue', 'idempotency', 'backpressure'],
  },

  'dead-letter queue': {
    body: [
      "**A dead-letter queue (DLQ) is where messages go after they fail every retry.** Instead of dropping them (silent data loss) or retrying forever (a poison message that wedges the queue), the system moves them aside with their error history.",
      "**A DLQ is an inbox, not a trash can.** Its value comes from three things: an alert when messages land, enough context to diagnose (payload, attempt count, errors), and a replay path so that after the bug is fixed an operator can push them back through.",
      "**DLQ depth should be zero.** Anything above is a pile of failures with names and payloads, which is exactly what makes it actionable. A DLQ with no alert is silent data loss with extra steps.",
    ],
    examples: [
      'After 5 failed attempts, a message moves to the DLQ and pages on-call.',
      'A malformed message that crashes the consumer goes to the DLQ instead of looping forever.',
    ],
    diagrams: [
      {
        caption: 'Exhausted messages move aside with their error history.',
        layout: 'row',
        nodes: [
          { id: 'q', label: 'Queue', accent: 'queue' },
          { id: 'w', label: 'Worker', accent: 'compute' },
          { id: 'dlq', label: 'Dead-letter', sub: 'alert + replay', accent: 'danger' },
        ],
        edges: [
          { from: 'q', to: 'w' },
          { from: 'w', to: 'dlq', label: 'give up', dashed: true },
        ],
      },
    ],
    related: ['queue', 'worker', 'retry', 'idempotency'],
  },

  retry: {
    body: [
      "**A retry is attempting a failed operation again,** because the failure might be temporary: a network timeout, a 503, a brief outage. The skill is retrying the right failures the right way.",
      "**Classify first.** Transient failures (timeouts, 5xx) deserve a retry; permanent ones (a malformed payload, a 400) do not, because they will fail identically every time. Retrying a permanent failure just wastes capacity.",
      "**Backoff plus jitter.** Wait longer after each attempt (1s, 2s, 4s, capped), and add randomness so a thousand clients that failed together do not retry in synchronized waves and pile onto a recovering service.",
    ],
    examples: [
      'A timeout calling a payment provider is retried with exponential backoff; a 400 is not.',
      'Jitter spreads a thousand simultaneous retries into a smooth trickle.',
    ],
    diagrams: [
      {
        caption: 'Retry transient failures with growing, jittered delays.',
        layout: 'row',
        nodes: [
          { id: 'fail', label: 'Transient fail', accent: 'danger' },
          { id: 'wait', label: 'Backoff + jitter', accent: 'edge' },
          { id: 'retry', label: 'Retry', accent: 'compute' },
        ],
      },
    ],
    related: ['idempotency', 'circuit breaker', 'queue', 'dead-letter queue'],
  },

  backpressure: {
    body: [
      "**Backpressure is the signal that says slow down** when a consumer cannot keep up with a producer. Without it, a fast producer overwhelms a slow consumer, filling memory or queues until something crashes.",
      "**How it shows up.** A bounded queue that blocks or rejects when full, a TCP window that throttles the sender, a streaming API that pauses reading. The slow stage pushes back on the fast one instead of silently drowning.",
      "**It is the healthy alternative to load shedding and OOM.** Either the system propagates backpressure to the source (the user waits, the upstream slows), or it sheds load deliberately. Ignoring it means an unbounded queue and a crash.",
    ],
    examples: [
      'A bounded queue rejects new work when full, forcing the producer to slow or shed.',
      'A streaming consumer pauses reading so the producer stops sending faster than it can process.',
    ],
    diagrams: [
      {
        caption: 'The slow consumer signals upstream to slow down.',
        layout: 'row',
        nodes: [
          { id: 'prod', label: 'Producer', sub: 'fast', accent: 'compute' },
          { id: 'q', label: 'Bounded queue', sub: 'full -> push back', accent: 'queue' },
          { id: 'cons', label: 'Consumer', sub: 'slow', accent: 'edge' },
        ],
        edges: [
          { from: 'prod', to: 'q' },
          { from: 'cons', to: 'q', label: 'slow down', dashed: true },
        ],
      },
    ],
    related: ['queue', 'load shedding', 'rate limit', 'worker'],
  },

  microservices: {
    body: [
      "**Microservices split a system into small, independently deployable services that each own their data.** A users service, an orders service, a payments service, each shipped and scaled on its own.",
      "**The benefit and the cost.** Teams ship independently and scale hot services alone; the price is network calls that can fail, distributed data, and operational overhead. The honest guidance: start with a monolith and split only when team size or scaling pain demands it.",
      "**They need a gateway and discovery.** An API gateway is the single front door; service discovery tracks where each service currently lives. Without them, clients hardcode addresses and every deploy risks breakage.",
    ],
    examples: [
      'An order spanning inventory, payment, and shipping is now four network calls instead of one in-process function.',
      'A small team ships far faster on a monolith and splits later for concrete reasons.',
    ],
    diagrams: [
      {
        caption: 'Independent services behind one gateway, each owning its data.',
        layout: 'fanout',
        nodes: [
          { id: 'gw', label: 'API gateway', accent: 'edge' },
          { id: 'u', label: 'Users service', accent: 'compute' },
          { id: 'o', label: 'Orders service', accent: 'compute' },
          { id: 'p', label: 'Payments service', accent: 'compute' },
        ],
      },
    ],
    related: ['API gateway', 'service discovery', 'distributed transaction', 'horizontal scaling'],
  },

  deployment: {
    body: [
      "**A deployment is the act of getting new code running in production.** Modern deployments are automated and frequent: build an artifact, run tests, ship it, and roll it out without taking the system down.",
      "**Strategies that avoid downtime.** Rolling (replace instances a few at a time), blue-green (run the new version alongside the old, then switch traffic), and canary (send a small percentage to the new version first, watch, then ramp).",
      "**Safety comes from reversibility.** Health checks gate the rollout, and a fast rollback (or a feature flag) means a bad deploy is a blip, not an outage. Frequent small deploys are safer than rare big ones.",
    ],
    examples: [
      'A rolling deploy replaces pods gradually; failing health checks halt it and roll back.',
      'A canary sends 5% of traffic to the new version, watches error rates, then ramps to 100%.',
    ],
    diagrams: [
      {
        caption: 'Build, test, then roll out gradually with a fast rollback.',
        layout: 'row',
        nodes: [
          { id: 'build', label: 'Build', accent: 'edge' },
          { id: 'test', label: 'Test', accent: 'compute' },
          { id: 'rollout', label: 'Roll out', sub: 'canary / rolling', accent: 'success' },
        ],
      },
    ],
    related: ['CI/CD', 'container', 'graceful shutdown', 'config'],
  },

  'CI/CD': {
    body: [
      "**CI/CD automates the path from a commit to production.** Continuous Integration (CI) runs the build and tests on every change, catching breakage early. Continuous Delivery/Deployment (CD) takes passing changes and ships them, automatically or at the push of a button.",
      "**The pipeline.** Commit triggers: install dependencies, run tests and linters, build an artifact (often a container image), and deploy. A red step blocks the merge, so broken code does not reach the main branch.",
      "**Why it matters.** It makes shipping calm and frequent. Without CI/CD, releases are rare, manual, and scary; with it, they are routine and reversible, and the test suite is the safety net that makes merging safe.",
    ],
    examples: [
      'A pull request runs the full test suite; the merge is blocked until it is green.',
      'Merging to main builds the image and deploys it through a rolling rollout automatically.',
    ],
    diagrams: [
      {
        caption: 'Commit, test, build, deploy: automated on every change.',
        layout: 'row',
        nodes: [
          { id: 'commit', label: 'Commit', accent: 'client' },
          { id: 'test', label: 'Test', accent: 'edge' },
          { id: 'build', label: 'Build', accent: 'compute' },
          { id: 'deploy', label: 'Deploy', accent: 'success' },
        ],
      },
    ],
    related: ['deployment', 'container', 'migration', 'testing'],
  },

  container: {
    body: [
      "**A container packages an app with its dependencies into an image that runs identically everywhere:** laptop, CI, production. It ends works-on-my-machine by shipping the environment with the code.",
      "**Lighter than a virtual machine.** A container shares the host OS kernel and isolates just the app, so it starts in milliseconds and uses far less than a VM, which bundles a whole operating system. You build an image once and run many identical containers from it.",
      "**It is the unit of deployment** for most modern backends, and what orchestrators like Kubernetes schedule, scale, and heal.",
    ],
    examples: [
      'A Dockerfile builds an image; the same bytes run in dev and prod.',
      'Ten identical containers from one image run behind a load balancer.',
    ],
    diagrams: [
      {
        caption: 'Build one image; run many identical containers anywhere.',
        layout: 'fanout',
        nodes: [
          { id: 'img', label: 'Image', sub: 'built once', accent: 'edge' },
          { id: 'c1', label: 'Container', sub: 'dev', accent: 'compute' },
          { id: 'c2', label: 'Container', sub: 'prod', accent: 'compute' },
        ],
      },
    ],
    related: ['Docker', 'Kubernetes', 'deployment', 'CI/CD'],
  },

  observability: {
    body: [
      "**Observability is being able to understand what a system is doing from the outside,** through three pillars: logs (what happened), metrics (how much/how fast), and traces (where the time went across services).",
      "**Why it matters.** During an incident, observability is the difference between reasoning from evidence and guessing. A system you cannot observe is one you debug by restarting and hoping.",
      "**The three complement each other.** A metric alarm tells you something is wrong, a trace shows which service is slow, and logs show the specific error. Tie them together with a request id that threads through all three.",
    ],
    examples: [
      'A latency metric spikes, a trace points at the payments service, and its logs show the timeout.',
      'A request id ties a user\'s support ticket to the exact logs and trace.',
    ],
    diagrams: [
      {
        caption: 'Logs, metrics, and traces answer different questions.',
        layout: 'row',
        nodes: [
          { id: 'log', label: 'Logs', sub: 'what happened', accent: 'compute' },
          { id: 'metric', label: 'Metrics', sub: 'how much', accent: 'edge' },
          { id: 'trace', label: 'Traces', sub: 'where the time went', accent: 'primary' },
        ],
        edges: [],
      },
    ],
    related: ['log', 'metric', 'trace', 'SLO'],
  },

  log: {
    body: [
      "**A log is a timestamped record of something that happened:** a request served, an error thrown, a job processed. Logs are the narrative of a system, read line by line during debugging.",
      "**Structured beats free-text.** A log line as structured data (JSON with fields like level, request_id, user_id, message) can be searched, filtered, and aggregated; a plain sentence cannot. Include a request id so you can follow one request across services.",
      "**Log the right things.** Errors with context, key decisions, and security-relevant events, but never secrets (passwords, tokens) or floods of noise. Logs are shipped to a central system (the ELK stack, a cloud service) for search.",
    ],
    examples: [
      '{"level":"error","request_id":"req_8f3a","msg":"payment timeout"} is searchable; "payment failed" is not.',
      'Never log a password or token; redact sensitive fields.',
    ],
    diagrams: [
      {
        caption: 'Structured log lines ship to a central, searchable store.',
        layout: 'row',
        nodes: [
          { id: 'app', label: 'App', accent: 'compute' },
          { id: 'log', label: 'Structured logs', sub: 'JSON + request id', accent: 'edge' },
          { id: 'store', label: 'Log search', sub: 'ELK / cloud', accent: 'storage' },
        ],
      },
    ],
    related: ['observability', 'metric', 'trace', 'Elasticsearch'],
  },

  metric: {
    body: [
      "**A metric is a number measured over time:** requests per second, error rate, p99 latency, queue depth, memory used. Metrics answer how much and how fast, and they power dashboards and alerts.",
      "**Percentiles beat averages.** An average latency hides the tail; p99 (the latency your unluckiest 1% of users feel) is what reveals real problems. Watch p50, p95, and p99 together.",
      "**Alerts fire on metrics crossing thresholds:** error rate above 1%, queue depth climbing, latency past the budget. Good alerts are actionable and tied to user impact, not noise.",
    ],
    examples: [
      'A dashboard of request rate, error rate, and p99 latency (a service\'s golden signals).',
      'An alert when the 5xx rate exceeds 1% for five minutes.',
    ],
    diagrams: [
      {
        caption: 'Numbers over time drive dashboards and alerts; watch the tail.',
        layout: 'row',
        nodes: [
          { id: 'm', label: 'Metric', sub: 'p99 latency', accent: 'edge' },
          { id: 'dash', label: 'Dashboard', accent: 'compute' },
          { id: 'alert', label: 'Alert', sub: 'threshold', accent: 'danger' },
        ],
      },
    ],
    related: ['observability', 'latency', 'SLO', 'Prometheus'],
  },

  trace: {
    body: [
      "**A trace follows one request across every service it touches,** showing where the time went. Each hop is a span with a start and duration, and the spans nest to form the full picture of a single request's journey.",
      "**Why it matters in distributed systems.** When a request crosses a gateway, three services, a cache, and a database, a metric tells you it was slow but not where. A trace shows the database query took 400ms while everything else was fast.",
      "**It works via a shared trace id** propagated through every call, so the spans from different services can be stitched back together (OpenTelemetry, Jaeger, AWS X-Ray).",
    ],
    examples: [
      'A trace reveals the payments service spent 90% of the request time waiting on a slow query.',
      'A trace id threads through the gateway, services, and database for one request.',
    ],
    diagrams: [
      {
        caption: 'One request, spans across services, showing where time went.',
        layout: 'row',
        nodes: [
          { id: 'gw', label: 'Gateway', sub: '5ms', accent: 'edge' },
          { id: 'svc', label: 'Service', sub: '20ms', accent: 'compute' },
          { id: 'db', label: 'Database', sub: '400ms', accent: 'danger' },
        ],
      },
    ],
    related: ['observability', 'log', 'metric', 'latency'],
  },

  latency: {
    body: [
      "**Latency is the delay for one operation:** how long a single request takes to come back. It is distinct from throughput (how many per second) and bandwidth (max capacity).",
      "**Measure it in percentiles.** p50 is the median, p99 is what your unluckiest 1% feel. Tail latency (p99, p99.9) matters because a request that touches ten services is only as fast as its slowest hop, so slow tails compound.",
      "**The latency ladder** is worth knowing: memory ~100ns, Redis ~1ms, a SQL query ~10ms, a cross-continent round trip ~100ms. Architecture choices (caching, regions, replicas) are about moving work to a cheaper rung.",
    ],
    examples: [
      'A p99 latency of 800ms means 1% of users wait nearly a second, even if the median is 50ms.',
      'Caching turns a 50ms query into a sub-millisecond memory read for cache hits.',
    ],
    diagrams: [
      {
        caption: 'Watch the tail: p99 is what unlucky users feel.',
        layout: 'row',
        nodes: [
          { id: 'p50', label: 'p50', sub: 'median', accent: 'success' },
          { id: 'p95', label: 'p95', accent: 'edge' },
          { id: 'p99', label: 'p99', sub: 'the tail', accent: 'danger' },
        ],
        edges: [],
      },
    ],
    related: ['throughput', 'metric', 'cache', 'SLO'],
  },

  SLO: {
    body: [
      "**An SLO (Service Level Objective) is a target for reliability:** 99.9% of requests succeed, or p99 latency stays under 300ms, measured over a window. It turns vague goals into a number you hold the service to.",
      "**The error budget.** 99.9% available means 0.1% is allowed to fail, which is your error budget. As long as you are within budget, you can ship fast; burning through it means slowing down to stabilize. It makes reliability a deliberate trade, not an absolute.",
      "**SLO vs SLA.** An SLO is your internal target; an SLA is the contractual promise to customers (often looser, with penalties). Alerts are tuned to the SLO so you act before customers notice.",
    ],
    examples: [
      'SLO: 99.9% of API requests return under 300ms over 30 days.',
      'Spending the error budget means freezing risky deploys to recover reliability.',
    ],
    diagrams: [
      {
        caption: 'A reliability target with an error budget you spend deliberately.',
        layout: 'row',
        nodes: [
          { id: 'target', label: 'SLO', sub: '99.9%', accent: 'primary' },
          { id: 'budget', label: 'Error budget', sub: '0.1%', accent: 'cache' },
          { id: 'act', label: 'Burned -> slow down', accent: 'danger' },
        ],
      },
    ],
    related: ['metric', 'latency', 'observability', 'deployment'],
  },

  'graceful shutdown': {
    body: [
      "**Graceful shutdown is finishing in-flight work before a process exits,** instead of dropping it. When a deploy or a scale-down sends a stop signal (SIGTERM), the process stops taking new requests, finishes the ones in progress, closes connections cleanly, then exits.",
      "**Why it matters.** Without it, every deploy drops the requests that were mid-flight, returning errors to users for no reason. Containers and orchestrators send SIGTERM and wait a grace period before force-killing (SIGKILL).",
      "**The steps:** stop accepting new work, drain (let active requests complete), flush buffers and close the database and queue connections, then exit. Workers stop pulling new jobs and finish the current one before quitting.",
    ],
    examples: [
      'On SIGTERM the server stops accepting connections, finishes active requests, then exits within the grace period.',
      'A worker stops claiming new jobs and finishes its current one before shutting down.',
    ],
    diagrams: [
      {
        caption: 'Stop accepting, drain in-flight work, close cleanly, then exit.',
        layout: 'sequence',
        actors: [
          { label: 'Orchestrator', accent: 'edge' },
          { label: 'Process', accent: 'compute' },
        ],
        messages: [
          { from: 0, to: 1, label: 'SIGTERM' },
          { from: 1, to: 1, label: 'stop new + drain' },
          { from: 1, to: 0, label: 'exit cleanly', dashed: true },
        ],
      },
    ],
    related: ['deployment', 'container', 'worker', 'Kubernetes'],
  },

  function: {
    body: [
      "**A function is a named, reusable block of code that takes inputs (arguments) and returns an output.** It is the smallest unit of organized behavior: name a piece of work once, then call it from many places instead of repeating it.",
      "**Functions are the vocabulary of a program.** Good ones do one thing, have a clear name, and are easy to test in isolation because the same inputs give the same output. Pure functions (no side effects) are the easiest to reason about.",
      "**They compose.** A request handler calls a validation function, which calls a parsing function; small functions stacked into bigger behavior is how readable code is built.",
    ],
    examples: [
      'function total(items) returns the sum; called from checkout, cart, and the receipt.',
      'A pure formatPrice(cents) always returns the same string for the same input.',
    ],
    diagrams: [
      {
        caption: 'Inputs in, one job, an output back.',
        layout: 'row',
        nodes: [
          { id: 'in', label: 'Arguments', accent: 'client' },
          { id: 'fn', label: 'Function', sub: 'one job', accent: 'compute' },
          { id: 'out', label: 'Return value', accent: 'success' },
        ],
        edges: [
          { from: 'in', to: 'fn' },
          { from: 'fn', to: 'out' },
        ],
      },
    ],
    related: ['side effect', 'class', 'object', 'controller'],
  },

  class: {
    body: [
      "**A class is a blueprint for objects, bundling data (fields) and the behavior that operates on it (methods).** From one class you create many objects, each with its own data but the same methods.",
      "**It models a thing in your domain:** a User class with an email field and a verify() method, an Order with items and a total() method. Encapsulation means the object guards its own data, exposing methods rather than letting outside code poke at fields directly.",
      "**Not everything needs a class.** In backends, classes shine for stateful domain models and services; plain functions and data often serve better for simple transformations. Use the one that makes the code clearest.",
    ],
    examples: [
      'class Order { items; total() {...} } creates many order objects from one blueprint.',
      'A User object hides its password hash, exposing only a checkPassword() method.',
    ],
    diagrams: [
      {
        caption: 'One blueprint, many objects with their own data.',
        layout: 'fanout',
        nodes: [
          { id: 'cls', label: 'class User', sub: 'blueprint', accent: 'primary' },
          { id: 'o1', label: 'object', sub: 'ana@...', accent: 'compute' },
          { id: 'o2', label: 'object', sub: 'ben@...', accent: 'compute' },
        ],
      },
    ],
    related: ['object', 'function', 'service', 'business rule'],
  },

  object: {
    body: [
      "**An object is a concrete bundle of related data, often with behavior attached.** It is an instance: where a class is the blueprint, the object is the actual thing in memory with real values.",
      "**Two senses, both common.** In object-oriented code, an object is an instance of a class (a specific User). In data terms, an object is a key-value structure (a JSON object), which is how most backend data travels and is stored.",
      "**Objects are how you pass structured data around:** a request body parsed into an object, a database row mapped to an object, a function returning an object with several named fields.",
    ],
    examples: [
      '{ id: 7, email: "ana@x.com" } is a data object with named fields.',
      'new User("ana@x.com") is an object: one instance of the User class.',
    ],
    diagrams: [
      {
        caption: 'A bundle of named fields, sometimes with methods.',
        layout: 'stack',
        nodes: [
          { id: 'o', label: 'object', accent: 'compute' },
          { id: 'id', label: 'id: 7', accent: 'edge' },
          { id: 'email', label: 'email: ana@x.com', accent: 'edge' },
        ],
      },
    ],
    related: ['class', 'JSON', 'dictionary', 'array'],
  },

  array: {
    body: [
      "**An array is an ordered list of values, accessed by index.** It is the workhorse collection: a list of items in a cart, rows from a query, messages in a queue. Position matters and is preserved.",
      "**Indexing is O(1); searching is O(n).** Jumping to the 5th element is instant; finding whether a value exists means scanning unless you switch to a dictionary or set. Knowing that trade-off is the difference between a fast loop and an accidentally quadratic one.",
      "**Arrays are everywhere in backends:** the JSON array a list endpoint returns, the batch a worker processes, the page of results you slice with limit and offset.",
    ],
    examples: [
      'items[0] is instant; checking if a value is in a 10,000-item array scans all 10,000.',
      'A list endpoint returns a JSON array of order objects.',
    ],
    diagrams: [
      {
        caption: 'Ordered values by index: jump fast, search slow.',
        layout: 'row',
        nodes: [
          { id: 'a', label: '[0]', accent: 'compute' },
          { id: 'b', label: '[1]', accent: 'compute' },
          { id: 'c', label: '[2]', accent: 'compute' },
          { id: 'd', label: '[3]', accent: 'compute' },
        ],
        edges: [],
      },
    ],
    related: ['dictionary', 'object', 'for loop', 'JSON'],
  },

  dictionary: {
    body: [
      "**A dictionary (hash map, object, dict) stores key-value pairs with fast lookup by key.** Where an array finds things by position, a dictionary finds them by name, in roughly O(1) regardless of size.",
      "**It is the right tool for lookups.** Caching by id, counting occurrences, de-duplicating, joining two lists by a shared key: all are dictionary jobs. Reaching for an array scan where a dictionary fits is the most common accidental slowdown in everyday code.",
      "**Keys are unique and unordered** (in the classic sense). The value can be anything: a number, an object, another dictionary. JSON objects are dictionaries on the wire.",
    ],
    examples: [
      'userById["u_7"] returns the user instantly, no scan.',
      'Counting word frequencies: counts[word] = (counts[word] or 0) + 1.',
    ],
    diagrams: [
      {
        caption: 'Find by key in roughly constant time.',
        layout: 'row',
        nodes: [
          { id: 'k', label: 'key "u_7"', accent: 'client' },
          { id: 'map', label: 'dictionary', sub: 'hash', accent: 'compute' },
          { id: 'v', label: 'value', sub: 'user object', accent: 'success' },
        ],
        edges: [
          { from: 'k', to: 'map' },
          { from: 'map', to: 'v' },
        ],
      },
    ],
    related: ['array', 'object', 'cache', 'JSON'],
  },

  'for loop': {
    body: [
      "**A for loop repeats a block once for each item in a collection, or a fixed number of times.** It is how you process every row, sum every price, or transform every element of a list.",
      "**Watch what is inside the loop.** A database query or network call inside a loop is the classic N+1 trap: a thousand items become a thousand round trips. Batch the work outside the loop instead.",
      "**Modern languages favor expressive forms** (map, filter, for-each) over manual index counters, but the idea is the same: do something for each item. The cost is the body times the count, so keep the body cheap.",
    ],
    examples: [
      'for item in cart: total += item.price sums a cart in one pass.',
      'A query inside a for loop over 1,000 users is 1,000 round trips: the N+1 trap.',
    ],
    diagrams: [
      {
        caption: 'Run the body once per item; keep the body cheap.',
        layout: 'ring',
        nodes: [
          { id: 'next', label: 'Next item', accent: 'edge' },
          { id: 'body', label: 'Run body', accent: 'compute' },
          { id: 'done', label: 'Done?', accent: 'primary' },
        ],
      },
    ],
    related: ['while loop', 'array', 'N+1 query', 'function'],
  },

  'while loop': {
    body: [
      "**A while loop repeats as long as a condition stays true.** Use it when you do not know the count up front: keep reading until the stream ends, keep retrying until success, keep polling until a job finishes.",
      "**The condition must eventually become false,** or you have an infinite loop that pins a CPU. Every while loop needs a guaranteed way out: a counter, a timeout, a break on a terminal condition.",
      "**Common backend uses:** draining a queue while messages remain, paginating while a next cursor exists, retrying with backoff while attempts are left and the error is transient.",
    ],
    examples: [
      'while queue.has_messages(): process(queue.pop()) drains until empty.',
      'while attempts < 5 and failed: retry with backoff, then give up.',
    ],
    diagrams: [
      {
        caption: 'Repeat while the condition holds; guarantee an exit.',
        layout: 'ring',
        nodes: [
          { id: 'check', label: 'Condition?', accent: 'primary' },
          { id: 'body', label: 'Run body', accent: 'compute' },
          { id: 'exit', label: 'Exit when false', accent: 'edge' },
        ],
      },
    ],
    related: ['for loop', 'retry', 'backpressure', 'worker'],
  },

  runtime: {
    body: [
      "**The runtime is the system that actually executes your code:** Node for JavaScript, CPython for Python, the JVM for Java, the .NET CLR for C#. It manages memory, schedules work, and provides the standard library your code calls into.",
      "**It shapes how your backend behaves.** Node's single-threaded event loop favors many concurrent I/O-bound requests; a thread-per-request model handles CPU-bound work differently. Knowing your runtime's concurrency model explains why some code scales and some blocks everything.",
      "**Runtime also means when the program is running** (as opposed to compile time). A runtime error happens during execution, with real data, where a type error would have been caught earlier.",
    ],
    examples: [
      'Node runs your JS on one thread with an event loop; a CPU-heavy task blocks it.',
      'A null value crashing the program is a runtime error, not a compile-time one.',
    ],
    diagrams: [
      {
        caption: 'The runtime executes your code and manages its resources.',
        layout: 'stack',
        nodes: [
          { id: 'code', label: 'Your code', accent: 'client' },
          { id: 'rt', label: 'Runtime', sub: 'Node / CPython / JVM', accent: 'compute' },
          { id: 'os', label: 'OS + hardware', accent: 'storage' },
        ],
      },
    ],
    related: ['concurrency model', 'memory usage', 'framework', 'runtime profiling'],
  },

  'concurrency model': {
    body: [
      "**A concurrency model is how a runtime does many things at once.** The big families: an event loop (Node, single thread, async I/O), threads (multiple OS threads sharing memory), processes (isolated, multiple cores), and coroutines / green threads (lightweight, cooperatively scheduled).",
      "**It dictates what scales.** An event loop handles thousands of idle-waiting connections cheaply but stalls on CPU-bound work, because one slow computation blocks everything. Threads use multiple cores but bring locks and race conditions.",
      "**Match the model to the workload.** I/O-bound (waiting on databases and APIs) loves async / event loops; CPU-bound (crunching numbers) wants real parallelism across cores or processes.",
    ],
    examples: [
      'Node serves 10,000 idle WebSocket connections on one thread, but a tight CPU loop freezes them all.',
      'A CPU-heavy report runs in a worker process so it does not block the event loop.',
    ],
    diagrams: [
      {
        caption: 'One loop for I/O waiting; processes for CPU parallelism.',
        layout: 'row',
        nodes: [
          { id: 'loop', label: 'Event loop', sub: 'I/O-bound', accent: 'compute' },
          { id: 'threads', label: 'Threads', sub: 'shared memory', accent: 'edge' },
          { id: 'proc', label: 'Processes', sub: 'CPU-bound', accent: 'primary' },
        ],
        edges: [],
      },
    ],
    related: ['runtime', 'worker', 'backpressure', 'thread'],
  },

  'side effect': {
    body: [
      "**A side effect is anything a function does beyond returning a value:** writing to a database, sending an email, mutating shared state, logging, calling an API. Side effects are how a program touches the outside world.",
      "**They are necessary but worth isolating.** Pure functions (input to output, no side effects) are trivial to test and reason about; effectful code needs mocks, ordering care, and idempotency. Keeping the pure core separate from the effectful edges makes a codebase testable.",
      "**Effects are where bugs and retries get tricky.** Sending an email twice on a retry, double-charging a card, a stale cache: all are side effects that happened when they should not have, which is why idempotency matters.",
    ],
    examples: [
      'calculateTotal(cart) is pure; chargeCard(cart) has a side effect (money moves).',
      'A retried request with a side effect can send two emails unless it is idempotent.',
    ],
    diagrams: [
      {
        caption: 'Beyond the return value, the function touches the world.',
        layout: 'fanout',
        nodes: [
          { id: 'fn', label: 'Function', accent: 'compute' },
          { id: 'ret', label: 'Return value', accent: 'success' },
          { id: 'db', label: 'Write DB', accent: 'storage' },
          { id: 'email', label: 'Send email', accent: 'edge' },
        ],
      },
    ],
    related: ['function', 'idempotency', 'testing', 'retry'],
  },

  'memory usage': {
    body: [
      "**Memory usage is how much RAM your process holds while running.** It matters because memory is finite: exceed the limit and the process is killed (OOM) or the machine swaps to disk and crawls.",
      "**Common culprits.** Loading a huge result set fully into memory instead of streaming it, an unbounded cache or queue that grows forever, or a memory leak where references are kept and never freed. Watch resident memory over time; a steady climb is a leak.",
      "**The fix is usually bounding and streaming.** Process large data in chunks, cap caches with an eviction policy, and apply backpressure so a fast producer cannot pile work up in memory.",
    ],
    examples: [
      'Loading a million rows at once OOMs; streaming them in batches stays flat.',
      'An unbounded in-memory cache grows until the process is killed.',
    ],
    diagrams: [
      {
        caption: 'A steady climb in resident memory signals a leak.',
        layout: 'row',
        nodes: [
          { id: 'load', label: 'Load all at once', sub: 'spikes', accent: 'danger' },
          { id: 'stream', label: 'Stream in chunks', sub: 'flat', accent: 'success' },
        ],
        edges: [],
      },
    ],
    related: ['runtime', 'backpressure', 'cache', 'runtime profiling'],
  },

  'dependency management': {
    body: [
      "**Dependency management is how a project declares, installs, and pins the third-party libraries it relies on.** A manifest lists what you need (package.json, requirements.txt, go.mod); a lockfile pins the exact resolved versions so every install is identical.",
      "**The lockfile is what makes builds reproducible.** Without it, two installs days apart can pull different versions and behave differently, which is the classic works-on-my-machine bug. Commit the lockfile.",
      "**Dependencies are also a risk surface.** Each one is code you run and trust: it can have bugs, vulnerabilities, or a supply-chain compromise. Keep them updated, audited, and as few as you can justify.",
    ],
    examples: [
      'package.json lists ranges; package-lock.json pins exact versions for reproducible installs.',
      'A security advisory on a transitive dependency means bumping and re-locking.',
    ],
    diagrams: [
      {
        caption: 'Manifest declares; lockfile pins; install is reproducible.',
        layout: 'row',
        nodes: [
          { id: 'man', label: 'Manifest', sub: 'package.json', accent: 'client' },
          { id: 'lock', label: 'Lockfile', sub: 'exact versions', accent: 'compute' },
          { id: 'install', label: 'Install', sub: 'reproducible', accent: 'success' },
        ],
      },
    ],
    related: ['framework', 'CI/CD', 'container', 'deployment'],
  },

  'runtime profiling': {
    body: [
      "**Runtime profiling measures where a running program actually spends time and memory,** so you optimize the real bottleneck instead of a guessed one. A profiler samples the call stack or instruments functions to show the hot paths.",
      "**Measure before you optimize.** Intuition about what is slow is wrong more often than not; the profiler points at the one function eating 80% of the time, which is usually not where you expected. Optimizing anything else is wasted effort.",
      "**Two flavors.** A CPU profile shows which functions burn cycles (a flame graph); a memory profile shows what is holding RAM and what is leaking. Pair profiling with the metric that flagged the problem (a latency or memory alarm).",
    ],
    examples: [
      'A flame graph shows 80% of request time is in one JSON serialization call.',
      'A heap profile reveals a cache that never evicts, explaining the slow memory climb.',
    ],
    diagrams: [
      {
        caption: 'Measure the running program, then fix the real hot path.',
        layout: 'row',
        nodes: [
          { id: 'run', label: 'Profile', sub: 'sample stacks', accent: 'edge' },
          { id: 'hot', label: 'Hot path', sub: '80% of time', accent: 'danger' },
          { id: 'fix', label: 'Optimize that', accent: 'success' },
        ],
      },
    ],
    related: ['latency', 'memory usage', 'metric', 'observability'],
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
