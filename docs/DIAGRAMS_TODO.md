# Diagrams to generate

We do not copy AlgoMaster's (or anyone's) diagram images. This is the list of
diagrams we should **create ourselves** with `src/Diagram.tsx` (or by extending
it). Split into "engine ready, just author" and "needs an engine extension
first."

Current diagram engine layouts: `row`, `stack`, `fanout`, `gather` (labeled
boxes + arrows). Anything needing a ring, tree, grid, sequence, or state machine
is an engine gap.

---

## 1. Concept entries that have prose but no diagram (engine ready)

29 encyclopedia entries are written but picture-less. Each wants one small box
diagram.

- **idempotency** — check id -> work -> record, duplicate skips
- **rate limit** — token bucket: tokens refill, request takes one or 429
- **horizontal scaling** — LB -> stateless pool, sessions in Redis
- **JWT** — login -> signed token -> Bearer header -> verify
- **transaction** — BEGIN -> steps -> COMMIT, or ROLLBACK on failure
- **index** — scan every row vs jump via sorted lookup
- **eventual consistency** — write -> replicas converge over time
- **IP address** — name -> IP -> machine
- **port** — one IP, many ports -> different services
- **packet** — message split into packets, routed, reassembled
- **CIDR** — /24 block = network bits fixed, host bits free
- **throughput** — latency vs bandwidth vs throughput (highway analogy)
- **server-sent events** — one connection, server pushes
- **saga** — forward steps + compensating actions backward
- **Technologies** (15): MySQL, MongoDB, Memcached, DynamoDB, Cassandra,
  Elasticsearch, RabbitMQ, Amazon SQS, AWS Lambda, Nginx, ZooKeeper, Docker,
  Prometheus, Apache Spark, Apache Flink — each wants a "where it sits" diagram
  (e.g. RabbitMQ exchange->queues->workers, Lambda event->function, Docker
  image->containers).

## 2. Reference architecture diagrams for the 23 design problems (engine ready)

None exist yet. Each `Design X` prompt wants one end-to-end architecture diagram
(client -> LB -> services -> cache -> db -> queue -> workers). High value, bigger
multi-node diagrams. Priority set:

- URL Shortener, Pastebin, Rate Limiter
- News Feed (push/pull fanout), Instagram, Leaderboard
- WhatsApp/Chat, Live Comments (websocket fanout)
- YouTube/Netflix (transcode + CDN), Google Drive, Object Storage
- Uber (geo matching), Search Autocomplete (trie), Web Crawler (frontier)
- E-commerce, Flash Sale, Payment System
- Key-Value Store, Distributed Cache, CDN, Job Scheduler

## 3. New diagram SHAPES the engine cannot draw yet (extend Diagram.tsx first)

These concepts are best shown in a shape our box+arrow engine does not support.
Build the shape, then author the diagram.

- **Ring (circular)** — consistent hashing (servers + keys on a circle), DynamoDB/
  Cassandra partition ring. Currently faked as a row.
- **Tree** — B-tree (how a database index actually looks), trie (autocomplete
  prefixes), heap. The "8 data structures that power databases" angle.
- **2D grid** — geohash cells / quadtree for location data.
- **Sequence / lifeline** — ordered message exchanges between actors over time:
  TLS handshake, OAuth authorization-code flow, two-phase commit, the full
  request lifecycle, cache-aside read. Our flow boxes approximate this but a real
  sequence diagram (lifelines + numbered messages) reads far better.
- **State machine** — circuit breaker (closed/open/half-open cycle), TCP
  connection states. Currently faked as a row.
- **Layered/encapsulation** — packet wrapping down the OSI/TCP-IP stack (headers
  added per layer). OSI is a stack today; the wrapping version is richer.

## Notes

- Categories 1 and 2 are pure authoring; the engine is ready.
- Category 3 needs `Diagram.tsx` to gain `ring`, `tree`, `grid`, `sequence`, and
  `state` modes. The ring and sequence shapes unlock the most concepts.
