import type { Problem } from './course'

// A broad set of system-design practice problems, grouped the way real
// interview prep is (basics, real-time, social, streaming, location, search,
// commerce, payments, infrastructure, counting, async). Each is an open design
// prompt with a checklist pointing at the concepts taught in the System Design
// modules and the encyclopedia. Appended after the concept modules and the
// original three prompts in the System Design course.

function design(
  id: string,
  title: string,
  difficulty: Problem['difficulty'],
  minutes: number,
  prompt: string,
  checklist: string[],
): Problem {
  return { id, title, type: 'design', difficulty, minutes, prompt, checklist }
}

export const systemDesignPractice: Problem[] = [
  // ----- Basics -----
  design(
    'design-pastebin',
    'Pastebin',
    'Core',
    45,
    'Design a paste-sharing service: users submit text and get a short URL; others read it. Cover storage, key generation, expiry, size limits, and read-heavy scaling.',
    [
      'Separate write (create paste) from the read-heavy fetch path.',
      'Generate short unique keys and store large bodies in object storage, not the row.',
      'Cache hot pastes behind a CDN; set TTL and expiry.',
      'Add abuse limits (size caps, rate limits) on creation.',
    ],
  ),
  // (A "Distributed Rate Limiter" design prompt already exists in the
  // system-design subject, so it is not duplicated here.)

  // ----- Real-time -----
  design(
    'design-whatsapp',
    'WhatsApp / Chat',
    'Hard',
    60,
    'Design a 1:1 and group messaging system. Cover message delivery, online presence, ordering, offline queueing, delivery/read receipts, and fanout to group members.',
    [
      'Use persistent connections (WebSockets) with a connection registry per server.',
      'Guarantee per-conversation ordering and at-least-once delivery with dedupe.',
      'Queue messages for offline users and deliver on reconnect.',
      'Plan group fanout and horizontal scaling of the connection tier.',
    ],
  ),
  design(
    'design-live-comments',
    'Live Comments',
    'Hard',
    50,
    'Design real-time comments on a live stream watched by millions: new comments appear instantly for all viewers. Cover fanout, ordering, and hot-event load.',
    [
      'Push with WebSockets or SSE; do not have clients poll.',
      'Fan out one comment to millions of viewers via pub/sub.',
      'Shed or sample load on a viral event; accept eventual ordering.',
      'Cache and paginate the comment history separately from the live feed.',
    ],
  ),

  // ----- Social -----
  design(
    'design-news-feed',
    'News Feed',
    'Hard',
    60,
    'Design a social news feed (Facebook/Twitter style). Cover the fanout-on-write vs fanout-on-read trade, ranking, caching, and the celebrity (hot-key) problem.',
    [
      'Compare push (fanout on write) vs pull (fanout on read) and pick per user type.',
      'Handle celebrities with millions of followers as a hot-key special case.',
      'Cache precomputed feeds; rank with a scoring step.',
      'Use eventual consistency: a new post can reach followers a beat late.',
    ],
  ),
  design(
    'design-instagram',
    'Instagram',
    'Hard',
    60,
    'Design a photo-sharing app: upload, store, and serve images at scale, plus a feed of who you follow. Cover media storage, CDN delivery, and the follow graph.',
    [
      'Store originals in object storage; serve via CDN with resized variants.',
      'Process uploads async (resize, thumbnail, moderate) with a queue and workers.',
      'Build the feed from the follow graph (reuse the News Feed trade-offs).',
      'Shard the metadata database by user; index the follow relationships.',
    ],
  ),
  design(
    'design-leaderboard',
    'Real-time Leaderboard',
    'Core',
    45,
    'Design a leaderboard that ranks millions of players and updates in real time. Cover the ranking data structure, top-N reads, and a player\'s own rank.',
    [
      'Use a sorted structure (Redis sorted set) for O(log n) updates and range reads.',
      'Serve top-N from cache; compute an arbitrary player rank efficiently.',
      'Shard by game or region; merge for global views.',
      'Decide consistency: a slightly stale rank is usually fine (eventual).',
    ],
  ),

  // ----- Streaming & storage -----
  design(
    'design-youtube',
    'YouTube / Netflix',
    'Boss',
    75,
    'Design a video platform: upload, transcode, store, and stream video to a global audience. Cover the upload pipeline, adaptive bitrate, CDN delivery, and metadata.',
    [
      'Async transcode uploads into multiple bitrates via a queue and worker farm.',
      'Store video segments in object storage; deliver from CDN edges near users.',
      'Use adaptive bitrate streaming so playback adjusts to bandwidth.',
      'Separate the metadata/catalog database from the media storage.',
    ],
  ),
  design(
    'design-google-drive',
    'Google Drive / Dropbox',
    'Hard',
    60,
    'Design a file storage and sync service. Cover upload/download, chunking, deduplication, sync across devices, sharing, and consistency.',
    [
      'Chunk files and store chunks in object storage; dedupe identical chunks by hash.',
      'Track file metadata and versions in a database separate from the blobs.',
      'Sync changes across devices with a change log and conflict handling.',
      'Enforce sharing permissions (an authorization boundary) on every access.',
    ],
  ),
  design(
    'design-object-storage',
    'Object Storage (S3)',
    'Boss',
    75,
    'Design a durable object store: PUT/GET objects by key with very high durability and availability. Cover partitioning, replication, durability, and metadata.',
    [
      'Partition objects across nodes by key (consistent hashing).',
      'Replicate each object across machines/zones for durability; use checksums to detect bit rot.',
      'Keep a metadata service mapping keys to where chunks live.',
      'Choose availability and eventual consistency for reads at scale.',
    ],
  ),

  // ----- Location -----
  design(
    'design-uber',
    'Uber / Ride Matching',
    'Boss',
    75,
    'Design a ride-hailing system: match riders to nearby drivers in real time and track location. Cover geospatial indexing, driver location updates, and matching.',
    [
      'Index driver locations geospatially (geohash / quadtree) for nearby queries.',
      'Ingest frequent driver location updates as a write-heavy stream.',
      'Match riders to drivers with a low-latency proximity search.',
      'Handle surge and hot cities; keep the trip state machine consistent.',
    ],
  ),

  // ----- Search & aggregation -----
  design(
    'design-autocomplete',
    'Search Autocomplete',
    'Hard',
    55,
    'Design search-as-you-type suggestions returning the top completions for a prefix in milliseconds, at scale. Cover the data structure, ranking, and caching.',
    [
      'Use a prefix structure (trie) with precomputed top-K per prefix.',
      'Serve from a cache; rebuild rankings offline from query logs.',
      'Return within a tight latency budget; debounce on the client.',
      'Shard the trie by prefix; handle typos and personalization later.',
    ],
  ),
  design(
    'design-web-crawler',
    'Web Crawler',
    'Hard',
    60,
    'Design a web crawler that fetches billions of pages, avoids re-crawling, respects politeness, and stores results. Cover the frontier, dedup, and scaling.',
    [
      'Manage a URL frontier (queue) with politeness and priority.',
      'Dedupe seen URLs with a bloom filter to skip the expensive fetch.',
      'Distribute crawling across workers; respect robots.txt and rate limits.',
      'Store and index extracted content for downstream search.',
    ],
  ),

  // ----- Commerce & payments -----
  design(
    'design-ecommerce',
    'E-commerce / Amazon',
    'Boss',
    75,
    'Design an online store: catalog, cart, checkout, inventory, and orders. Cover catalog reads, inventory consistency, and the order pipeline.',
    [
      'Serve the catalog read-heavy via caching and replicas.',
      'Keep inventory strongly consistent at checkout to avoid overselling.',
      'Process orders through a queue: payment, fulfillment, notification.',
      'Use idempotency keys so a retried checkout does not double-charge.',
    ],
  ),
  design(
    'design-flash-sale',
    'Flash Sale / Ticketmaster',
    'Boss',
    70,
    'Design a system that sells limited stock to a sudden flood of buyers without overselling. Cover the inventory hot key, queueing, and fairness.',
    [
      'Protect the single hot inventory key from a thundering herd.',
      'Admit buyers through a queue / waiting room to flatten the spike.',
      'Reserve stock atomically (a distributed lock or atomic decrement) so it never goes negative.',
      'Make the purchase idempotent and time-box reservations.',
    ],
  ),
  design(
    'design-payment',
    'Payment System',
    'Boss',
    75,
    'Design a payment system that moves money correctly. Cover the ledger, idempotency, external provider integration, retries, and reconciliation.',
    [
      'Use database transactions and an immutable double-entry ledger.',
      'Make charges idempotent with idempotency keys against retries.',
      'Integrate providers via webhooks; verify signatures and dedupe.',
      'Reconcile against the provider and handle partial failures (CP, not AP).',
    ],
  ),

  // ----- Infrastructure -----
  design(
    'design-key-value-store',
    'Distributed Key-Value Store',
    'Boss',
    75,
    'Design a distributed key-value store like DynamoDB. Cover partitioning, replication, the consistency knob, and failure handling.',
    [
      'Partition keys across nodes with consistent hashing and virtual nodes.',
      'Replicate each key N ways; tune consistency with read/write quorums (W+R>N).',
      'Detect node failure with heartbeats; reassign and heal.',
      'Choose availability and eventual consistency; offer strong reads when needed.',
    ],
  ),
  design(
    'design-distributed-cache',
    'Distributed Cache',
    'Hard',
    60,
    'Design a distributed cache like Redis Cluster. Cover sharding, eviction, replication, and what happens when a node is added or removed.',
    [
      'Shard keys across nodes with consistent hashing so adding a node moves few keys.',
      'Choose an eviction policy (LRU) and bound memory per node.',
      'Replicate hot shards for read scaling and failover.',
      'Protect against stampedes when a hot key expires.',
    ],
  ),
  design(
    'design-cdn',
    'CDN',
    'Hard',
    60,
    'Design a content delivery network: serve cached content from edges near users and fall back to the origin. Cover edge placement, cache fill, and invalidation.',
    [
      'Place edge caches by region; route users to the nearest healthy edge.',
      'Fill on miss (pull) and serve static assets with long TTL + hashed URLs.',
      'Invalidate or version content on deploy; handle the origin being down.',
      'Measure hit rate; protect the origin from a cold-cache stampede.',
    ],
  ),
  design(
    'design-job-scheduler',
    'Job Scheduler',
    'Hard',
    60,
    'Design a distributed job scheduler that runs tasks once at a time (cron) or in the future, reliably, across many workers. Cover dedup, retries, and exactly-once.',
    [
      'Persist scheduled jobs durably; a worker leases one at a time.',
      'Ensure a job runs once across many workers (leader election or a lock).',
      'Retry failures with backoff; route exhausted jobs to a dead-letter queue.',
      'Recover abandoned leases when a worker dies (heartbeats).',
    ],
  ),
]
