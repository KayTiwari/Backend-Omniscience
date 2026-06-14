# Diagrams to generate

We do not copy AlgoMaster's (or anyone's) diagram images. This is the list of
diagrams we should **create ourselves** with `src/Diagram.tsx` (or by extending
it). Split into "engine ready, just author" and "needs an engine extension
first."

Current diagram engine layouts: `row`, `stack`, `fanout`, `gather` (labeled
boxes + arrows). Anything needing a ring, tree, grid, sequence, or state machine
is an engine gap.

---

## Status

- Engine extended with **ring** and **sequence** shapes (done). Tree, grid, and
  state shapes still pending.
- 18 diagrams backfilled (consistent hashing ring, JWT/transaction sequences,
  idempotency, rate limit, index, throughput, eventual consistency, IP, port,
  packet, horizontal scaling, DynamoDB, Cassandra, RabbitMQ, SQS, Lambda, Docker).
- **12 entries still picture-less:** CIDR, MySQL, MongoDB, Memcached,
  Elasticsearch, Nginx, ZooKeeper, Prometheus, Apache Spark, Apache Flink,
  server-sent events, saga.

## 1. Concept entries that have prose but no diagram (engine ready)

The 12 above. Each wants one small box diagram.

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

- **Ring (circular)** — DONE. Used by consistent hashing, DynamoDB, Cassandra.
- **Sequence / lifeline** — DONE. Used by JWT and transaction. Still to author:
  TLS handshake, OAuth authorization-code flow, two-phase commit, the full
  request lifecycle, cache-aside read.
- **Tree** — TODO. B-tree (how a database index actually looks), trie
  (autocomplete prefixes), heap.
- **2D grid** — TODO. geohash cells / quadtree for location data.
- **State machine** — TODO. circuit breaker (closed/open/half-open cycle), TCP
  connection states. Currently faked as a row.
- **Layered/encapsulation** — TODO. packet wrapping down the OSI/TCP-IP stack.

## Notes

- Categories 1 and 2 are pure authoring; the engine is ready.
- Category 3 needs `Diagram.tsx` to gain `ring`, `tree`, `grid`, `sequence`, and
  `state` modes. The ring and sequence shapes unlock the most concepts.
