import type { Problem } from './course'

// System Design from the fundamentals up: the architecture-level concepts the
// "30 concepts" lists and the system-design-primer cover, taught as an
// interactive module ladder. Concepts that have their own course (caching,
// queues, SQL, HTTP, REST) are framed and cross-referenced here rather than
// re-taught. Each module opens the System Design course (modules sort first),
// and several wire to the runnable distributed-systems drills as practice.

export const systemDesignFoundations: Problem[] = [
  {
    id: 'sysd-rung-scaling',
    title: 'Module 1: Scaling Up vs Scaling Out',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt:
      'The first lever in every system design: make one machine bigger, or add more machines. Learn the trade and the rule that makes scaling out possible.',
    explanation: `When traffic outgrows a server you have two moves, and the choice shapes everything after it.

**Vertical scaling (scale up).** Buy a bigger machine: more CPU, more RAM. Simple, no code changes, and it is the right first move surprisingly often. The ceiling is hard, though: the biggest machine you can rent is finite, it costs a premium, and that one box is a single point of failure.

**Horizontal scaling (scale out).** Add more ordinary machines and split work across them. No real ceiling, and losing one machine degrades capacity instead of taking you down. This is how every large system is built.

**The rule that unlocks it: statelessness.** Scaling out only works when any machine can handle any request. The moment a server keeps a user's session in its own memory, requests must return to that exact box, and you are stuck. Push shared state out to a database, a cache like Redis, or a token the client carries. Stateless app servers are the precondition for everything in this course.

**Single point of failure (SPOF).** Any component with no backup that takes the system down when it dies. Scaling out removes SPOFs from the app tier; the rest of the design is hunting the remaining ones (the load balancer, the primary database) and adding redundancy.`,
    production:
      'The pragmatic order in real systems: scale up until it hurts, because it buys time with no architectural change, then scale out once you have made the app tier stateless. Teams that skip statelessness discover it the hard way when sticky sessions pin all traffic to one overloaded box during a spike.',
    walkthrough: [
      'Name the ceiling on vertical scaling: the biggest single machine, plus it being a SPOF.',
      'State the precondition for horizontal scaling: any server handles any request.',
      'Move session state out of app memory into a shared store or a client token.',
      'Hunt the remaining SPOFs after the app tier is replicated.',
    ],
    questions: [
      'Why does horizontal scaling require stateless servers?',
      'When is scaling up still the right first move?',
      'What is a single point of failure?',
    ],
    checklist: [
      'Contrast vertical and horizontal scaling with their ceilings.',
      'Explain why statelessness is the precondition for scaling out.',
      'Identify a single point of failure in a simple architecture.',
    ],
    interactive: {
      coldOpen:
        'Your app is slow under load, so you add a second server behind a load balancer. Half your users instantly appear logged out. You added capacity and created a bug. One property of your servers decides whether scaling out works at all. Which one, and why does session storage break it?',
      mental:
        'Vertical scaling is a taller ladder: quick, but there is a top rung. Horizontal scaling is more ladders side by side: set them up once (everyone climbs any ladder) and you can always add another.',
      diagram: {
        nodes: ['One server maxed', 'Scale up: bigger box', 'Hit the ceiling', 'Make it stateless', 'Scale out: many boxes'],
        explanations: [
          'A single server saturates: CPU pinned, requests queueing. This is where every scaling story starts.',
          'Vertical scaling swaps in a bigger machine. Zero code change, instant relief, and the right first move more often than people admit.',
          'The biggest rentable machine is finite and pricey, and it is one box: if it dies, everything dies.',
          'Push session and other per-user state into a shared cache, the database, or a client-held token, so no request depends on a specific server.',
          'Now add ordinary machines behind a load balancer. Capacity grows linearly and one machine dying just trims capacity.',
        ],
      },
      example: {
        code: '# One app server, stateful sessions in local memory:\n1 server  @ ~1,000 rps  -> saturated, sessions pinned here\n\n# Make it stateless (sessions in Redis), add 3 more behind an LB:\n4 servers @ ~1,000 rps each  -> ~4,000 rps, any server serves anyone',
        output:
          'vertical only: capped by the largest machine, and it is a SPOF\nhorizontal: ~4x throughput, survives losing a server, scales further by adding boxes',
        explain:
          'The unlock was not the extra machines, it was moving sessions to Redis so any server can serve any request. Without that step the new boxes sit idle while traffic pins to the original.',
      },
      predicts: [
        {
          question: 'A login session is stored in one server\'s memory. What breaks when you add a second server behind a load balancer?',
          options: [
            'nothing, it just works',
            'requests routed to the other server appear logged out',
            'the database falls over',
          ],
          correct: 1,
          why: 'The session only exists on the first box. Any request the load balancer sends to the second server has no session there. Shared session state (Redis, or a token) is the fix.',
        },
        {
          question: 'Which is the genuine ceiling of vertical scaling?',
          options: [
            'it requires rewriting the app',
            'the largest single machine is finite, and it is one point of failure',
            'it cannot use a database',
          ],
          correct: 1,
          why: 'Scaling up needs no rewrite, but you eventually hit the biggest box money can rent, and that box dying takes everything with it.',
        },
      ],
      build: {
        simple: 'When one server is not enough, add more.',
        actually:
          'Scale up first (a bigger box, no rewrite) until you hit the ceiling of the largest single machine, which is also a single point of failure. Then scale out: make servers stateless (sessions in Redis or a token) so any server serves any request, and add boxes behind a load balancer.',
        breaks:
          'Anything stored on one server (sessions, local caches, uploaded files) breaks the moment a second server exists, because requests routed elsewhere cannot see it. Statelessness is the precondition, not an afterthought.',
      },
      doThisNow: [
        {
          task: 'Do the capacity math: one server handles ~1,000 rps and is maxed. You need ~4,500 rps with headroom. How many stateless servers, and what must change first?',
          reveal:
            'Five servers (5,000 rps leaves headroom), but only after moving sessions to a shared store. Without that, the extra boxes sit idle while traffic pins to the original. The unlock is statelessness, not the hardware.',
        },
        {
          task: 'Audit a design for scale-out blockers: an app stores sessions in memory, caches dashboards locally, and writes uploads to local disk. List what must move before adding a second server.',
          reveal:
            'All three: sessions to Redis/a token, the dashboard cache to a shared Redis, uploads to object storage (S3). Each is per-server state that becomes inconsistent the instant a second box appears.',
        },
      ],
      warStory:
        'A team scaled out before going stateless. Users got randomly logged out as the load balancer bounced them between servers with different in-memory sessions. Support called it "the ghost logout bug" for a week before someone moved sessions to Redis and it vanished.',
      tweak: {
        instruction: 'Your app caches computed dashboards in each server\'s local memory. Decide what changes before you can scale out.',
        reveal:
          'Move the cache to a shared layer like Redis. Per-server local caches are a milder version of the session problem: each box has different data, hit rates collapse, and behavior becomes inconsistent across servers.',
      },
      receipt: {
        explain: [
          'When to scale up vs scale out, and the ceiling of each.',
          'Why statelessness is the precondition for horizontal scaling.',
        ],
        question: 'You have many servers now. What decides which one handles each request?',
      },
      recap: [
        'Scale up first (no rewrite), scale out for the real ceiling and fault tolerance.',
        'Statelessness is the precondition: any server must handle any request.',
        'A SPOF is any unbackuped component whose death takes the system down.',
      ],
    },
  },
  {
    id: 'sysd-rung-load-balancing',
    title: 'Module 2: Load Balancers And Reverse Proxies',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt:
      'Once you have many servers, something must spread traffic across them. Learn load balancers, their algorithms, health checks, and how a reverse proxy differs.',
    explanation: `Scaling out creates a new question: which of the N servers handles this request? A load balancer answers it.

**The load balancer.** A single front door that receives every request and forwards it to a healthy backend. Clients only know the load balancer's address; the pool behind it can grow, shrink, and redeploy invisibly.

**L4 vs L7.** A Layer 4 balancer routes on IP and port without reading the request: fast and protocol-agnostic. A Layer 7 balancer reads the HTTP request and can route on path, headers, or cookies (send /api here, /images there): smarter, slightly costlier. Most web systems use L7.

**Algorithms.** Round-robin rotates evenly. Least-connections favors the least-busy server, better when request costs vary. Weighted variants send more traffic to bigger machines. Hash-based pins a given client or key to a server.

**Health checks.** The balancer pings each backend and stops sending traffic to ones that fail. This is what turns a dead server from an outage into a non-event, and it is most of the load balancer's value.

**Reverse proxy.** A server that sits in front of your app and speaks for it: terminating TLS, caching responses, compressing, and serving static files. A load balancer is one kind of reverse proxy specialized for distribution; tools like Nginx do both. The balancer itself needs redundancy, or it becomes the new single point of failure.`,
    production:
      'The load balancer health check is the unsung hero of uptime: a crashed server is removed from rotation in seconds and users never notice. The classic trap is making the balancer a SPOF, which is why production runs balancers in redundant pairs with automatic failover.',
    walkthrough: [
      'Put one load balancer in front of the stateless server pool from Module 1.',
      'Choose L7 to route by path; choose an algorithm (round-robin to start).',
      'Configure health checks so dead backends leave rotation automatically.',
      'Make the balancer itself redundant so it is not the new SPOF.',
    ],
    questions: [
      'What does an L7 balancer let you do that L4 cannot?',
      'Why are health checks most of a load balancer\'s value?',
      'How does a reverse proxy differ from a load balancer?',
    ],
    checklist: [
      'Explain L4 vs L7 routing.',
      'Pick a balancing algorithm for varying request costs.',
      'Explain why the balancer needs its own redundancy.',
    ],
    interactive: {
      coldOpen:
        'A server crashes at 3am. Nobody gets paged, no user notices, and you read about it in a graph the next morning. The thing that turned a dead server into a non-event is one humble feature of the load balancer, and it is most of the reason the load balancer exists. What is it?',
      mental:
        'A load balancer is the host at a busy restaurant: every guest checks in at one desk, the host seats them at whichever table is free, and quietly stops seating anyone at a table that just had a spill.',
      diagram: {
        nodes: ['Client', 'Load balancer', 'Health checks', 'Algorithm', 'Backend pool'],
        explanations: [
          'Every client talks to one stable address and never knows how many servers are behind it.',
          'The balancer is the single front door. The pool behind it scales and redeploys without clients noticing.',
          'It continuously pings backends and pulls failing ones from rotation, turning a crash into a non-event.',
          'Round-robin, least-connections, weighted, or hash decides which healthy backend gets this request.',
          'Stateless servers (Module 1) receive the forwarded request. Any of them can serve anyone.',
        ],
      },
      example: {
        code: '# Round-robin across 3 healthy backends:\nreq1 -> A   req2 -> B   req3 -> C   req4 -> A ...\n\n# Server B fails its health check:\nB removed from rotation\nreq5 -> A   req6 -> C   req7 -> A ...',
        output:
          'healthy: traffic spread evenly across A, B, C\nB down: balancer routes around it within a health-check interval, users unaffected',
        explain:
          'No human paged, no error shown. The health check noticed B, pulled it, and kept serving from A and C. That automatic rerouting is the point of the layer.',
      },
      predicts: [
        {
          question: 'Requests need to route to /api and /static differently. Which balancer can do that?',
          options: ['L4 (IP/port only)', 'L7 (reads the HTTP request)', 'neither'],
          correct: 1,
          why: 'Routing on path means reading the HTTP request, which is Layer 7. An L4 balancer sees only IP and port and cannot tell /api from /static.',
        },
        {
          question: 'A backend crashes mid-day. With health checks configured, users see...',
          options: [
            'errors until someone restarts it',
            'nothing: the balancer stops routing to it within seconds',
            'slower responses from every server',
          ],
          correct: 1,
          why: 'The failed health check removes the server from rotation automatically. This is the load balancer earning its keep.',
        },
        {
          question: 'You run exactly one load balancer in front of everything. The risk is...',
          options: [
            'none, balancers never fail',
            'the balancer is now the single point of failure',
            'it makes servers stateful',
          ],
          correct: 1,
          why: 'Everything funnels through it, so its death is total. Production runs balancers redundantly with failover.',
        },
      ],
      build: {
        simple: 'A load balancer spreads requests across servers.',
        actually:
          'It is the stable front door: clients know only its address, while the pool behind it grows and shrinks invisibly. L7 routes on path/headers (L4 only on IP/port), algorithms like round-robin or least-connections decide the target, and health checks pull dead servers from rotation automatically.',
        breaks:
          'A single load balancer is the new single point of failure: everything funnels through it. Production runs balancers in redundant pairs with failover, or the front door becomes the outage.',
      },
      doThisNow: [
        {
          task: 'Pick the algorithm: your backends have wildly different request costs (one runs slow reports). Round-robin or least-connections, and why?',
          reveal:
            'Least-connections. It favors whichever server is least busy right now, so a box stuck on slow reports stops receiving new work. Round-robin would keep piling requests onto the overloaded one regardless.',
        },
        {
          task: 'Watch a real round-robin in action against a public service that rotates IPs. Run the lookup a few times and note the order changing.',
          command: 'for i in 1 2 3; do dig +short google.com | head -1; done',
          reveal:
            'The first IP often rotates between runs: DNS-level load balancing spreading you across machines. The same idea, one layer down from the application load balancer.',
        },
      ],
      warStory:
        'A company ran one beefy load balancer "because it never fails." It failed during a routine kernel update and took down every service behind it at once, even though all the app servers were healthy. The postmortem action item was a single line: run the balancer in a redundant pair.',
      tweak: {
        instruction: 'Your backends have very different request costs (some hit a slow report generator). Pick a better algorithm than round-robin.',
        reveal:
          'Least-connections: it favors whichever server is least busy right now, so a box stuck on slow reports stops receiving new work. Round-robin would keep piling requests on it regardless.',
      },
      receipt: {
        explain: [
          'L4 vs L7 routing and when each fits.',
          'Why health checks are most of a balancer\'s value, and why it needs its own redundancy.',
        ],
        command: 'for i in 1 2 3; do dig +short google.com | head -1; done',
        question: 'Traffic is spread across servers. How do you stop them from doing the same expensive work over and over?',
      },
      writeDrillId: 'msg-round-robin',
      recap: [
        'A load balancer is the stable front door that spreads traffic across a scaling pool.',
        'L7 routes on the HTTP request; health checks make server death invisible.',
        'A reverse proxy fronts the app (TLS, caching, static files); the balancer needs its own redundancy.',
      ],
    },
  },
  {
    id: 'sysd-rung-caching-cdn',
    title: 'Module 3: Caching And CDNs At Scale',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt:
      'The cheapest request is the one you never serve. Learn where caches sit in a large system and how a CDN pushes content to the edge.',
    explanation: `Read-heavy systems live or die on caching. This module is the system-design view; the Caching course teaches the mechanics in depth.

**Caches sit at every layer.** The browser caches responses, a CDN caches at the network edge, a reverse proxy caches in front of the app, the app caches in Redis, and the database caches hot pages. Each layer that answers a request spares every layer behind it.

**The CDN.** A network of edge servers near users worldwide. Static assets (images, CSS, JS, video) and cacheable API responses are served from the nearest edge, cutting latency and offloading your origin. A pull CDN fetches from your origin on the first request and caches it; a push CDN has you upload content ahead of time. Pull is the common default.

**Read scaling.** Caching turns a read-heavy system from a database problem into a memory problem: if 95% of reads are cache hits, the database does a twentieth of the work. This is usually the single biggest scaling win available.

**The cost is staleness.** Every cache is a copy that can fall behind the source, so each cached thing carries a TTL or an explicit invalidation. Deciding where staleness is acceptable, and for how long, is the whole craft. The Caching course covers invalidation, eviction, and stampedes.`,
    production:
      'A CDN in front of static assets and a Redis layer in front of hot queries are the two highest-leverage moves for a read-heavy system, often before any database sharding is needed. The recurring incident is a cache serving deleted or stale content, which is why TTLs back up every explicit invalidation.',
    walkthrough: [
      'Trace a read through the cache layers: browser, CDN, proxy, app cache, database.',
      'Put a CDN in front of static assets and cacheable responses.',
      'Estimate the database load drop from a high cache hit rate.',
      'Assign a staleness budget per cached thing (see the Caching course).',
    ],
    questions: [
      'How does a 95% cache hit rate change database load?',
      'What is the difference between a pull and a push CDN?',
      'What does every cache trade away for speed?',
    ],
    checklist: [
      'Name the cache layers between user and database.',
      'Explain what a CDN serves and why it cuts latency.',
      'State the staleness trade every cache makes.',
    ],
    interactive: {
      coldOpen:
        'Your database is melting under 10,000 reads a second. You could shard it, hire a DBA, and lose a month. Or you could stop asking it the same question 9,500 times. A read-heavy system is usually not a database problem at all. What turns it into a cheap memory problem instead?',
      mental:
        'A CDN is a chain of neighborhood warehouses: instead of everyone ordering from the distant factory (your origin), each region keeps copies of the popular items next door.',
      diagram: {
        nodes: ['Browser cache', 'CDN edge', 'Reverse proxy', 'App cache (Redis)', 'Database'],
        explanations: [
          'The user\'s own cache: the fastest possible hit is the request that never leaves the device.',
          'Edge servers near the user serve static assets and cacheable responses, cutting latency and sparing the origin.',
          'A cache in front of the app can serve repeated responses without waking the application at all.',
          'The shared application cache holds hot query results and computed values, a millisecond away versus tens for the database.',
          'The source of truth, and the thing every layer above exists to protect from load.',
        ],
      },
      example: {
        code: '# 10,000 reads/sec, 95% served from cache:\ncache hits:  9,500/sec  -> answered from memory/edge\ncache misses:  500/sec  -> reach the database',
        output:
          'database sees 500 rps instead of 10,000: a 20x reduction\nlatency for the 95%: sub-millisecond instead of tens of ms',
        explain:
          'The database did not get faster; the system stopped asking it the same questions. A high hit rate converts a read-heavy database problem into a cheap memory problem.',
      },
      predicts: [
        {
          question: 'A user in Tokyo loads your site hosted in Virginia. A CDN helps most by...',
          options: [
            'making the database faster',
            'serving static assets from an edge near Tokyo',
            'adding more app servers',
          ],
          correct: 1,
          why: 'The CDN keeps copies near the user, so assets travel a short distance instead of crossing the Pacific to your origin every time.',
        },
        {
          question: 'You raise a product cache\'s hit rate from 50% to 95%. The database read load...',
          options: ['barely changes', 'drops roughly tenfold', 'doubles'],
          correct: 1,
          why: 'Misses fall from 50% to 5%, so the database handles about a tenth of the reads it did before. Hit rate is the lever.',
        },
      ],
      build: {
        simple: 'Cache things so you do not recompute them.',
        actually:
          'Caches sit at every layer (browser, CDN edge, reverse proxy, Redis, database), and each hit spares every layer behind it. A high hit rate turns a read-heavy database problem into a cheap memory problem. A CDN serves content from edges near users; pull CDNs fetch-on-first-request and are the default.',
        breaks:
          'Every cache is a copy that can fall behind the source, so each cached thing needs a TTL or explicit invalidation. The recurring incident is serving deleted or stale content because the staleness budget was wrong (or global).',
      },
      doThisNow: [
        {
          task: 'Do the hit-rate math: 10,000 reads/sec at a 95% cache hit rate. How many reach the database, and what is the reduction?',
          reveal:
            '500 reads/sec hit the database (5% of 10,000): a 20x reduction. The database did not get faster; the system stopped asking it the same question. Hit rate is the single biggest lever in a read-heavy system.',
        },
        {
          task: 'Set a staleness budget per data type: a product description, an account balance, and a public blog post. Which can you cache for an hour, and which not at all?',
          reveal:
            'Product description: an hour is fine. Blog post: minutes to hours, with invalidation on edit. Account balance: do not cache, or invalidate on every write, because it is visible money that must reflect writes immediately. Staleness is per-data-type, never one global setting.',
        },
      ],
      warStory:
        'A store cached product pages aggressively with a long TTL and forgot to invalidate on price change. A flash sale ended, prices went back up, but the CDN kept serving the sale price for an hour. The company honored every order placed at the stale price. The fix was invalidation on write, backed by a TTL.',
      tweak: {
        instruction: 'You cache a user\'s account balance with a 1-hour TTL. Decide whether that is safe.',
        reveal:
          'Not safe: a balance is visible money and must reflect writes immediately, so invalidate on write or do not cache it. A product description, by contrast, tolerates an hour stale. The staleness budget is per-data-type, never one global setting.',
      },
      receipt: {
        explain: [
          'How a high cache hit rate collapses database load.',
          'Why every cached thing needs a per-type staleness budget.',
        ],
        question: 'Caching handles reads. What do you do when the database itself cannot keep up with writes?',
      },
      writeDrillId: 'caching-lru',
      recap: [
        'Caches sit at every layer; each hit spares every layer behind it.',
        'A CDN serves content from edges near users; pull is the common default.',
        'Caching trades freshness for speed, so each cached thing needs a staleness budget.',
      ],
    },
  },
  {
    id: 'sysd-rung-db-scaling',
    title: 'Module 4: Scaling The Database',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 16,
    prompt:
      'The database is usually the hardest thing to scale. Learn replication, sharding, partitioning, federation, and denormalization, and when each applies.',
    explanation: `Stateless app servers scale trivially; the database holds the state, so it is the real challenge. There is a ladder of moves, roughly in order.

**Replication.** Copy the database to multiple machines. In master-slave (primary-replica), writes go to the primary and reads fan out to replicas: this scales reads and adds failover. In master-master, multiple nodes accept writes, which scales writes but invites conflicts. Replicas lag the primary slightly, so a just-written value may not appear on a replica yet (replication lag).

**Federation.** Split databases by feature: a users database, an orders database, a products database. Each is smaller, independently scalable, and has its own load. The cost is that cross-feature joins now span databases.

**Sharding (horizontal partitioning).** Split one table's rows across machines by a shard key: users A-M here, N-Z there, or by hash of user id. Each shard holds a slice, so writes and storage scale. The shard key choice is everything: a bad key creates a hot shard that takes all the traffic while others idle, and cross-shard queries get expensive.

**Vertical partitioning.** Split a table by columns: keep hot, small columns in one table and rarely-read large ones (a blob, a bio) in another, so the common query touches less data.

**Denormalization.** Deliberately duplicate data to avoid expensive joins at read time: store a copy of the author's name on each post so rendering a feed needs no join. It trades write complexity and storage for read speed, the right trade for read-heavy systems.

**The order in practice:** indexes and query tuning first (cheapest), then read replicas, then caching, and only then sharding, which is the most invasive and is usually delayed as long as possible.`,
    production:
      'Sharding is the move teams dread, because it complicates every query and migration, so the real skill is postponing it with indexes, replicas, and caching. Replication lag is a frequent subtle bug: a user updates their profile, the next read hits a lagging replica, and the change appears to vanish.',
    walkthrough: [
      'Add read replicas to scale reads and gain failover; note the lag trade.',
      'Federate by feature when one database serves too many concerns.',
      'Choose a shard key that spreads load evenly and avoids hot shards.',
      'Denormalize a hot read path to remove a join, accepting write duplication.',
    ],
    questions: [
      'What does master-slave replication scale, and what is its lag trade?',
      'Why is the shard key the most important sharding decision?',
      'When is denormalization the right trade?',
    ],
    checklist: [
      'Explain replication, sharding, federation, and denormalization.',
      'Pick a shard key and explain how it avoids a hot shard.',
      'Order the database scaling moves from cheapest to most invasive.',
    ],
    interactive: {
      coldOpen:
        'A user changes their email, hits reload, and sees the old one. The write succeeded. Nothing is broken. This is the quiet tax of scaling a database, and it is also why teams dread the one scaling move that complicates every query they will ever write. Which move, and what is the lag bug?',
      mental:
        'Replication is photocopying the whole ledger so many clerks can read at once. Sharding is splitting the ledger by last name across clerks so each holds less. Denormalization is writing the customer\'s name on every invoice so you never flip back to look it up.',
      diagram: {
        nodes: ['Index + tune', 'Read replicas', 'Caching', 'Federation', 'Sharding'],
        explanations: [
          'The cheapest scaling: the right indexes and query rewrites often buy years before anything structural is needed.',
          'Copy the database; send reads to replicas and writes to the primary. Scales reads and adds failover, at the cost of replication lag.',
          'A cache layer (Module 3) absorbs hot reads so the database sees a fraction of them.',
          'Split databases by feature so each is smaller and independently scalable; cross-feature joins now cross databases.',
          'Split one table\'s rows across machines by a shard key. Scales writes and storage, but the key choice makes or breaks it.',
        ],
      },
      example: {
        code: '# Shard 4 ways by hash(user_id):\nhash("user-42") % 4 = 0  -> shard 0\nhash("user-99") % 4 = 3  -> shard 3\n\n# Bad key: shard by signup_year on a fast-growing app\n2026 -> one shard takes nearly all new writes (hot shard)',
        output:
          'hash(user_id): writes and storage spread evenly across 4 shards\nsignup_year: the current year is a hot shard while old years idle',
        explain:
          'Same number of shards, opposite outcomes. Hashing a high-cardinality key spreads load; a low-cardinality or time-based key concentrates it. The shard key is the whole game.',
      },
      predicts: [
        {
          question: 'A user updates their email, then immediately reloads and sees the old one. Most likely cause?',
          options: [
            'the write failed silently',
            'the reload hit a read replica that has not caught up (replication lag)',
            'the cache is broken',
          ],
          correct: 1,
          why: 'Writes go to the primary; reads fan out to replicas that lag slightly. The read landed on a replica before the change propagated. Read-your-writes routing or reading from the primary fixes it.',
        },
        {
          question: 'Why do teams delay sharding as long as possible?',
          options: [
            'it is expensive to license',
            'it complicates every query, join, and migration across shards',
            'it makes reads slower',
          ],
          correct: 1,
          why: 'Once data spans shards, cross-shard queries and transactions get hard and migrations get delicate. Indexes, replicas, and caching are reached for first precisely to avoid it.',
        },
        {
          question: 'Storing the author name on each post so the feed needs no join is...',
          options: ['normalization', 'denormalization', 'sharding'],
          correct: 1,
          why: 'It duplicates data to skip a read-time join: denormalization. The trade is keeping the copies in sync on writes, worth it for a hot read path.',
        },
      ],
      build: {
        simple: 'When the database is too big, split it up.',
        actually:
          'There is a ladder, cheapest first: index and tune, then read replicas (scale reads, add failover, accept lag), then caching, then federation (split by feature), and finally sharding (split one table\'s rows by a shard key). Denormalize hot read paths to skip joins.',
        breaks:
          'Replication lag means a just-written value may not appear on a lagging replica yet. And a bad shard key creates a hot shard that takes all the traffic while others idle. The shard key is the whole game.',
      },
      doThisNow: [
        {
          task: 'Choose a shard key for a chat app: hash(message_id), channel_id, or signup_year? Pick one and say what each does to load.',
          reveal:
            'hash(message_id) spreads writes evenly (high cardinality). channel_id risks a hot shard if one channel is huge. signup_year is the worst: the current year takes nearly all new writes while old years idle. Spread requires a high-cardinality, evenly-distributed key.',
        },
        {
          task: 'Diagnose the lag bug: a user updates their profile and the reload shows the old value. Name the cause and one fix.',
          reveal:
            'The reload hit a read replica that has not caught up with the primary (replication lag). Fix with read-your-writes routing (send that user\'s reads to the primary briefly) or read from the primary for just-written data.',
        },
      ],
      warStory:
        'A chat app sharded by hash(channel_id). It worked until a celebrity AMA channel hit 10 million members and saturated its single shard while the others idled. The fix was sharding by message id within the channel and giving the whale channels dedicated infrastructure. Hot keys are the standard sharding failure.',
      tweak: {
        instruction: 'You shard a chat app by hash(channel_id), but one channel has 10 million members and saturates its shard. What broke, and what is one fix?',
        reveal:
          'A hot key: one channel\'s traffic all lands on one shard. Fixes include a finer key (shard by message id within that channel), giving the whale channel its own dedicated infrastructure, or caching its reads aggressively. Hot keys are the standard sharding failure.',
      },
      receipt: {
        explain: [
          'The database scaling ladder from cheapest to most invasive.',
          'Why the shard key makes or breaks sharding, and what replication lag is.',
        ],
        question: 'You can scale reads and writes. Should you even be using a relational database for this data?',
      },
      writeDrillId: 'msg-partition',
      recap: [
        'Replication scales reads and adds failover; replicas lag the primary.',
        'Sharding scales writes and storage; the shard key must spread load to avoid hot shards.',
        'Tune, replicate, and cache before sharding, the most invasive move.',
      ],
    },
  },
  {
    id: 'sysd-rung-sql-nosql',
    title: 'Module 5: SQL vs NoSQL',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt:
      'Not every system wants a relational database. Learn the four NoSQL families, what each is for, and how to choose by access pattern.',
    explanation: `Relational databases (PostgreSQL, MySQL) are the right default: ACID transactions, flexible queries with joins, and decades of tooling. NoSQL is what you reach for when a specific access pattern or scale need outgrows that default.

**Key-value stores** (Redis, DynamoDB). A giant dictionary: get and put by key, blazing fast, no queries across values. Sessions, caches, feature flags, counters.

**Document stores** (MongoDB). Store whole JSON-like documents and query inside them. Good when each record is self-contained and the shape varies: product catalogs, user profiles, content.

**Wide-column stores** (Cassandra). Rows with huge, flexible column sets, built to take enormous write volume across many machines. Time-series, event logs, sensor data, feeds.

**Graph databases** (Neo4j). Nodes and edges with relationships as first-class data. When the questions are about connections: social graphs, recommendations, fraud rings.

**How to choose.** Relational by default. Go NoSQL when you have a clear pattern it serves better: extreme write scale (wide-column), simple key lookups at massive scale (key-value), deeply nested or schema-flexible records (document), or relationship-heavy traversal (graph). The honest secret: most products are fine on PostgreSQL far longer than people expect, and many large systems run several stores side by side, each for what it is best at.`,
    production:
      'The expensive mistake runs both directions: forcing graph-shaped or write-firehose workloads into relational tables, and reaching for a trendy NoSQL store for ordinary CRUD that PostgreSQL would have served for years. The decision follows the access pattern, never the hype.',
    walkthrough: [
      'Default to relational; require a reason to leave it.',
      'Match each NoSQL family to the access pattern it serves.',
      'Name the trade NoSQL usually makes (joins and transactions for scale and flexibility).',
      'Accept that real systems mix stores, one per job.',
    ],
    questions: [
      'What access pattern suits a wide-column store?',
      'When is a graph database the clear choice?',
      'Why is relational still the right default?',
    ],
    checklist: [
      'Name the four NoSQL families and a use for each.',
      'Choose a store from an access pattern.',
      'Explain why relational is the default.',
    ],
    interactive: {
      coldOpen:
        'Two teams fail in opposite directions. One forces a social graph into SQL tables and writes nightmare recursive joins. The other reaches for a trendy NoSQL store for plain orders and payments, then misses transactions for a year. The right call is never the hype; it is the access pattern. How do you read the pattern?',
      mental:
        'Relational is a Swiss Army knife: flexible, the right grab by default. The NoSQL families are specialized tools: pick one up only when its specific job is the whole job.',
      diagram: {
        nodes: ['Key-value', 'Document', 'Wide-column', 'Graph', 'Relational (default)'],
        explanations: [
          'A dictionary at scale: get/put by key, no cross-value queries. Sessions, caches, counters.',
          'Self-contained JSON documents you can query inside. Catalogs, profiles, flexible-shape content.',
          'Flexible columns built for massive write volume across machines. Time-series, logs, feeds.',
          'Nodes and edges where relationships are the data. Social graphs, recommendations, fraud.',
          'ACID, joins, mature tooling. The right default, and where most products should stay until an access pattern forces a move.',
        ],
      },
      example: {
        code: '# Match the workload to the store:\nuser sessions, 1ms lookups by id      -> key-value (Redis)\n50M sensor readings/min, write-heavy  -> wide-column (Cassandra)\n"friends of friends who like X"        -> graph (Neo4j)\norders, payments, inventory (joins)    -> relational (PostgreSQL)',
        output:
          'each workload names a different best-fit store\nand a real product often uses several at once, one per pattern',
        explain:
          'There is no single winner. The store follows the access pattern: key lookups, write firehose, relationship traversal, or transactional joins.',
      },
      predicts: [
        {
          question: 'You need to ingest 50 million write-heavy sensor readings per minute across many machines. Best fit?',
          options: ['graph database', 'wide-column store', 'a single relational primary'],
          correct: 1,
          why: 'Wide-column stores like Cassandra are built for exactly this: enormous write throughput spread across nodes. A single relational primary would be overwhelmed.',
        },
        {
          question: 'The core query is "friends of friends who liked this." Which store fits best?',
          options: ['key-value', 'graph', 'document'],
          correct: 1,
          why: 'Relationship traversal is what graph databases are for. Expressing multi-hop friend relationships as relational joins gets painful fast.',
        },
        {
          question: 'A new app does ordinary CRUD with orders, users, and payments. The right default is...',
          options: [
            'a document store, for flexibility',
            'relational, for transactions and joins',
            'whichever is newest',
          ],
          correct: 1,
          why: 'Transactional, join-heavy CRUD is the relational sweet spot, and most products stay there far longer than expected. Leave it only for a concrete access-pattern reason.',
        },
      ],
      build: {
        simple: 'There are SQL databases and NoSQL databases.',
        actually:
          'Relational is the default: ACID, joins, mature tooling. The four NoSQL families each serve one pattern: key-value (fast lookups by key), document (self-contained JSON records), wide-column (massive write volume), graph (relationship traversal). Choose by access pattern, and real systems mix several.',
        breaks:
          'The mistake runs both ways: forcing graph or write-firehose workloads into relational tables, or grabbing trendy NoSQL for ordinary transactional CRUD that PostgreSQL would serve for years. Hype is not an access pattern.',
      },
      doThisNow: [
        {
          task: 'Match four workloads to a store: 1ms session lookups by id; 50M sensor writes/min; "friends of friends who liked X"; orders + payments with transactions.',
          reveal:
            'Key-value (Redis) for sessions, wide-column (Cassandra) for the sensor firehose, graph (Neo4j) for relationship traversal, relational (PostgreSQL) for transactional commerce. Four patterns, four best-fit stores, often in one product.',
        },
        {
          task: 'Defend the default: a new app does CRUD over orders, users, and payments. Argue for relational in one sentence.',
          reveal:
            'Transactional, join-heavy CRUD is the relational sweet spot, and most products stay there far longer than expected. Leaving it needs a concrete access-pattern reason, not novelty.',
        },
      ],
      warStory:
        'A startup built its orders system on a document store "to be web-scale." When they needed to debit inventory and record payment atomically, they discovered they had traded away the exact transactions and joins relational gives for free. They migrated to PostgreSQL the next year. The access pattern was relational all along.',
      tweak: {
        instruction: 'You picked MongoDB for an orders system and now need a transaction that debits inventory and records payment atomically. What did the choice cost?',
        reveal:
          'Multi-document transactions and joins are the relational sweet spot you gave up. Document stores can do transactions now, but for join-heavy, strongly-transactional commerce data, relational was the simpler fit. Choosing by hype instead of access pattern is the classic error.',
      },
      receipt: {
        explain: [
          'The four NoSQL families and the pattern each serves.',
          'Why relational is the default and when to leave it.',
        ],
        question: 'You spread data across machines. When those machines disagree, which do you sacrifice: consistency or availability?',
      },
      recap: [
        'Relational is the default: ACID, joins, mature tooling.',
        'Key-value, document, wide-column, and graph each serve a specific access pattern.',
        'Choose by the access pattern, and expect real systems to mix stores.',
      ],
    },
  },
  {
    id: 'sysd-rung-cap',
    title: 'Module 6: CAP, Consistency, And Availability',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 15,
    prompt:
      'The deepest trade in distributed systems: when the network splits, you choose consistency or availability. Learn CAP and the patterns it implies.',
    explanation: `Once data lives on more than one machine, a hard truth appears, and CAP names it.

**CAP theorem.** A distributed system can guarantee at most two of Consistency (every read sees the latest write), Availability (every request gets a non-error response), and Partition tolerance (the system keeps working when the network between nodes fails). Networks do partition, so partition tolerance is not optional. The real choice, during a partition, is consistency or availability.

**CP systems** choose consistency: when nodes cannot reach each other, they refuse requests rather than serve possibly-stale data. Right when correctness is non-negotiable: banking, inventory, anything where a wrong answer is worse than no answer.

**AP systems** choose availability: they keep answering during a partition and reconcile differences afterward, accepting that some reads are briefly stale. Right when being up matters more than being perfectly current: social feeds, product catalogs, likes.

**Consistency patterns.** Strong consistency: reads always see the latest write (the CP promise). Eventual consistency: replicas converge over time, so reads may briefly lag but agree eventually (the AP norm). Weak consistency: no guarantee a read sees a recent write at all, used where speed dominates (live video, telemetry).

**Availability patterns.** Failover keeps a standby ready: active-passive promotes the standby when the primary dies; active-active runs both live behind a balancer. Replication (Module 4) underlies both. More nines of availability cost real money, so you target the level the product needs, not the maximum.`,
    production:
      'CAP is not a one-time architecture choice; it is a per-feature choice. The same company runs CP for payments (a wrong balance is unacceptable) and AP for the activity feed (a few seconds stale is invisible). Quorum reads and writes are the common knob for tuning where a system sits on the consistency-availability line.',
    walkthrough: [
      'State why partition tolerance is mandatory, making the real trade C vs A.',
      'Classify a feature as CP or AP by asking if a stale answer is acceptable.',
      'Match strong, eventual, and weak consistency to their use cases.',
      'Pick an availability pattern (active-passive vs active-active) and its cost.',
    ],
    questions: [
      'During a network partition, what is the actual CAP choice?',
      'When is eventual consistency acceptable, and when is it not?',
      'What does active-active failover buy over active-passive?',
    ],
    checklist: [
      'Explain CAP and why P is not optional.',
      'Classify a feature as CP or AP from its tolerance for staleness.',
      'Distinguish strong, eventual, and weak consistency.',
    ],
    interactive: {
      coldOpen:
        'The network between your servers splits in two. Right now, for this request, you must choose: refuse to answer and stay correct, or answer and risk being wrong. There is no third option, and the "right" choice is opposite for a bank transfer and a likes counter. This is the deepest trade in distributed systems.',
      mental:
        'A partition is two clerks who lose their phone line. CP clerks stop taking orders until the line is back (never disagree). AP clerks keep taking orders and reconcile their notebooks later (always open, briefly out of sync).',
      diagram: {
        nodes: ['Network partition', 'Choose: C or A', 'CP: refuse, stay correct', 'AP: answer, reconcile later', 'Per-feature choice'],
        explanations: [
          'The link between nodes fails. This will happen, so the system must tolerate it; the only question is how it behaves meanwhile.',
          'During the split you cannot have both perfect consistency and full availability. You pick which to sacrifice.',
          'CP refuses requests it cannot answer correctly. Banking and inventory pick this: no answer beats a wrong one.',
          'AP keeps answering with possibly-stale data and converges once the link returns. Feeds and catalogs pick this: up beats perfect.',
          'It is not one company-wide choice: payments go CP, the activity feed goes AP, in the same system.',
        ],
      },
      example: {
        code: '# Same outage, two features:\nPayments (CP):  partition -> reject the transfer, show "try again"\nActivity feed (AP): partition -> serve a slightly stale feed, sync later',
        output:
          'CP payments: never shows a wrong balance, may briefly refuse writes\nAP feed: always loads, may be seconds behind reality',
        explain:
          'Both are correct designs for their feature. A wrong balance is a disaster; a feed that is five seconds stale is invisible. CAP is chosen per feature, not once per company.',
      },
      predicts: [
        {
          question: 'A bank account transfer during a network partition should...',
          options: [
            'proceed and reconcile later (AP)',
            'refuse rather than risk a wrong balance (CP)',
            'always succeed no matter what',
          ],
          correct: 1,
          why: 'Money demands correctness: a wrong balance is worse than a temporary "try again." That is the CP choice.',
        },
        {
          question: 'A "likes" counter that is occasionally a few seconds behind is using...',
          options: ['strong consistency', 'eventual consistency', 'a broken database'],
          correct: 1,
          why: 'Replicas converge over time and brief staleness is fine for likes. Eventual consistency is the right, deliberate trade here.',
        },
        {
          question: 'Why is partition tolerance treated as mandatory in CAP?',
          options: [
            'it is the easiest to implement',
            'real networks partition, so the system must keep functioning when they do',
            'it is required by law',
          ],
          correct: 1,
          why: 'You cannot wish away network failures between machines, so P is a given. That is what reduces the live choice to consistency vs availability.',
        },
      ],
      build: {
        simple: 'A distributed system picks two of consistency, availability, partition tolerance.',
        actually:
          'Networks partition, so P is mandatory; the live choice during a split is C or A. CP systems refuse rather than serve stale data (banking, inventory). AP systems keep answering and reconcile later (feeds, catalogs). Consistency comes in strong, eventual, and weak flavors matched to how fresh data must be.',
        breaks:
          'CAP is not one company-wide decision; it is per-feature. Treating it as a single architecture choice means either payments that go stale or feeds that go down. The same system runs CP for money and AP for likes.',
      },
      doThisNow: [
        {
          task: 'Classify three features as CP or AP: a bank transfer, a likes counter, and a checkout inventory reservation. Justify each in a phrase.',
          reveal:
            'Transfer: CP (a wrong balance is a disaster, refuse instead). Likes: AP (a few seconds stale is invisible). Checkout reservation: CP at the reserve step to avoid overselling the last unit, even if browsing stays AP. Same system, different choices.',
        },
        {
          task: 'Resolve the oversell risk: an AP catalog lets two buyers both see "1 left" during a partition. Where do you add a CP step?',
          reveal:
            'Keep browsing AP for availability, but make the reserve/checkout step CP so the system refuses to confirm stock it cannot verify. Splitting the decision by sub-feature is the real-world pattern.',
        },
      ],
      warStory:
        'A flash-sale site ran fully AP for speed. During a brief partition, the "1 left" item sold to dozens of buyers who all saw stock. Refunding and apologizing cost more than the sale. They moved the reserve step to a CP path; browsing stayed AP. CAP is chosen per feature.',
      tweak: {
        instruction: 'An e-commerce site shows product inventory counts. Argue for CP vs AP, and note the risk of each.',
        reveal:
          'AP keeps the catalog browsable during partitions but can oversell (two buyers see the last unit). CP refuses to confirm stock it cannot verify, avoiding oversell but sometimes blocking purchases. Many shops choose AP for browsing and CP at the checkout/reserve step, splitting the decision by sub-feature.',
      },
      receipt: {
        explain: [
          'Why partition tolerance is mandatory, leaving C-vs-A as the live choice.',
          'How CP and AP fit different features in the same system.',
        ],
        question: 'When you add or remove a server from a distributed cache, how do you avoid reshuffling every key?',
      },
      writeDrillId: 'dist-quorum',
      recap: [
        'Networks partition, so the live CAP choice is consistency vs availability.',
        'CP refuses to stay correct; AP stays up and reconciles later.',
        'Strong, eventual, and weak consistency match correctness-critical to speed-critical features.',
      ],
    },
  },
  {
    id: 'sysd-rung-consistent-hashing',
    title: 'Module 7: Consistent Hashing',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt:
      'When you spread keys across N machines, what happens when N changes? Naive hashing remaps everything. Consistent hashing barely moves a thing.',
    explanation: `Distributing keys across servers (cache nodes, shards) starts with hash(key) % N. It works until N changes, and then it falls apart.

**The mod-N problem.** With 4 cache nodes you place a key at hash(key) % 4. Add a fifth node and now everything uses % 5, so almost every key maps to a different node. Every cache entry misses at once: a cold-cache stampede onto the database, exactly when you were trying to add capacity.

**The ring.** Consistent hashing places both servers and keys on a circle (a hash ring). A key belongs to the next server clockwise from it. Add or remove a server and only the keys between it and its neighbor move; everything else stays put. Adding a fifth node to four reshuffles roughly 1/5 of keys instead of nearly all of them.

**Virtual nodes.** A few servers placed on the ring land unevenly, so each physical server is placed at many points (virtual nodes). This smooths the distribution and means a removed server's load spreads across all the others rather than dumping entirely onto its one neighbor.

**Where it is used.** Distributed caches (Memcached clients), sharded databases and DynamoDB-style stores, and CDN request routing all rely on it. Whenever a system adds and removes nodes while keeping data placement stable, consistent hashing is underneath.`,
    production:
      'The mod-N stampede is a real outage pattern: a team adds a cache node during a traffic spike, the naive hash remaps every key, every read misses, and the database falls over from the very change meant to help. Consistent hashing exists to make adding capacity safe.',
    walkthrough: [
      'Show how mod-N remaps almost all keys when N changes.',
      'Place servers and keys on a ring; assign each key to the next server clockwise.',
      'Add a node and confirm only a fraction of keys move.',
      'Add virtual nodes to smooth the distribution.',
    ],
    questions: [
      'Why does hash(key) % N remap nearly everything when N changes?',
      'How does the ring limit how many keys move when a node is added?',
      'What problem do virtual nodes solve?',
    ],
    checklist: [
      'Explain the mod-N remapping problem.',
      'Describe key placement on a hash ring.',
      'Explain why virtual nodes smooth the load.',
    ],
    interactive: {
      coldOpen:
        'Traffic spikes, so you add a fifth cache node to help. The instant it joins, almost every cached key remaps to a different node, every read misses, and the stampede onto your database takes the whole site down. The capacity you added caused the outage. One hashing trick makes adding a node move only 1/5 of keys instead of all of them.',
      mental:
        'Consistent hashing is a clock face with servers pinned at some hours and keys at others: each key belongs to the next server clockwise. Move one server and only the keys in its slice change hands; the rest never notice.',
      diagram: {
        nodes: ['Keys on a ring', 'Servers on the ring', 'Key -> next server clockwise', 'Add a node', 'Virtual nodes'],
        explanations: [
          'Hash every key to a point on a circle (say 0 to 2^32).',
          'Hash each server to points on the same circle.',
          'A key is owned by the first server clockwise from it. Lookup is just "walk clockwise."',
          'A new server inserts at its hash point and takes only the keys between it and the previous server. Everything else stays put.',
          'Each server is placed at many points so load spreads evenly and a departing server\'s keys scatter across all others, not just one neighbor.',
        ],
      },
      example: {
        code: '# Naive hash, 4 -> 5 nodes:\nkeys remapped: ~80% (almost everything)\n\n# Consistent hashing, 4 -> 5 nodes:\nkeys remapped: ~20% (only one slice of the ring)',
        output:
          'mod-N: adding a node cold-misses almost the entire cache at once\nring: adding a node moves ~1/5 of keys, the rest keep hitting',
        explain:
          'Same operation, wildly different blast radius. The ring localizes the disruption to one arc, which is what makes scaling the cache or shard tier survivable.',
      },
      predicts: [
        {
          question: 'A 4-node cache uses hash(key) % 4. You add a 5th node. What happens to the cache?',
          options: [
            'one quarter of keys move',
            'almost every key remaps and misses at once',
            'nothing changes',
          ],
          correct: 1,
          why: 'Switching the divisor from 4 to 5 changes the result for nearly every key, so the whole cache effectively cold-starts. This is the stampede consistent hashing prevents.',
        },
        {
          question: 'With consistent hashing, adding one node to a ring of four moves roughly...',
          options: ['all keys', 'about a fifth of keys', 'no keys'],
          correct: 1,
          why: 'Only the keys in the arc the new node now owns move; the rest keep their server. The disruption is localized to one slice.',
        },
        {
          question: 'Virtual nodes exist mainly to...',
          options: [
            'make lookups faster',
            'spread load evenly and scatter a removed node\'s keys across all others',
            'reduce memory use',
          ],
          correct: 1,
          why: 'A few single points land unevenly and dump a whole departing node\'s load on one neighbor. Many virtual points per server smooth both problems.',
        },
      ],
      build: {
        simple: 'Spread keys across servers with a hash.',
        actually:
          'Naive hash(key) % N breaks when N changes: switching the divisor remaps nearly every key. Consistent hashing places servers and keys on a ring; a key belongs to the next server clockwise, so adding a node moves only its arc. Virtual nodes place each server at many points to smooth the load.',
        breaks:
          'The mod-N stampede: add a cache node during a spike, every key remaps, every read misses, and the database falls over from the change meant to help. Without virtual nodes, a departing node dumps all its load on one neighbor.',
      },
      doThisNow: [
        {
          task: 'Compute the blast radius: going from 4 to 5 nodes, what fraction of keys move under mod-N versus a hash ring?',
          reveal:
            'mod-N: ~80% (almost everything, since the divisor changed). Hash ring: ~20% (only the arc the new node owns). Same operation, wildly different disruption. The ring is what makes adding capacity survivable.',
        },
        {
          task: 'Reason about removal: a node leaves the ring with no virtual nodes. Where does its load go, and why is that dangerous?',
          reveal:
            'All of it lands on the single next server clockwise, which can overload and cascade. Virtual nodes scatter the departing load across every remaining server, turning a spike into a gentle, even rise.',
        },
      ],
      warStory:
        'A team added a Memcached node during a traffic surge, using a client that did plain mod-N hashing. Every key remapped, the cache went cold instantly, and the read stampede took down the database for 20 minutes, during the surge. Switching the client to consistent hashing made future node additions a non-event.',
      tweak: {
        instruction: 'A node leaves the ring. Without virtual nodes, where does its load go, and why is that bad?',
        reveal:
          'All of it lands on the single next server clockwise, which can overload and cascade. Virtual nodes scatter the departing load across every remaining server, turning a dangerous spike into a gentle, even rise.',
      },
      receipt: {
        explain: [
          'Why mod-N remaps almost everything when N changes.',
          'How the ring and virtual nodes localize and smooth disruption.',
        ],
        question: 'You can scale the data tier. How do you split the application itself into independent pieces?',
      },
      writeDrillId: 'dist-consistent-hash',
      recap: [
        'hash(key) % N remaps almost everything when N changes: a cold-cache stampede.',
        'A hash ring moves only one slice of keys when a node joins or leaves.',
        'Virtual nodes smooth distribution and spread a departing node\'s load.',
      ],
    },
  },
  {
    id: 'sysd-rung-services',
    title: 'Module 8: Microservices, API Gateway, And Service Discovery',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt:
      'How a system splits into independently deployable services, the single front door clients talk to, and how services find each other.',
    explanation: `As a system and its team grow, one big deployable (the monolith) can become a bottleneck. Splitting into services is one answer, with real costs.

**Monolith vs microservices.** A monolith is one codebase deployed as one unit: simple to build, test, and run, and the right starting point for almost everything. Microservices split the system into independently deployable services owning their own data (a users service, an orders service). This lets teams ship independently and scale hot services alone, at the price of network calls, distributed failures, and operational overhead. The honest guidance: start monolith, split only when team size or scaling pain demands it.

**API gateway.** With many services, clients should not call each one directly. An API gateway is the single front door: it receives every external request and routes it to the right service, while centralizing cross-cutting concerns: authentication, rate limiting, request logging, and response aggregation. One place to enforce policy, one address for clients.

**Service discovery.** Services run on machines that come and go (autoscaling, redeploys, crashes), so their addresses change constantly. Service discovery is the registry that answers "where is the orders service right now?" Services register themselves on startup and look others up by name, so callers never hardcode an address. The load balancer's health checks and this registry together keep traffic flowing only to live instances.`,
    production:
      'The common mistake is reaching for microservices too early, paying all the distributed-systems tax (network failures, eventual consistency, tracing across services) before the team or scale justifies it. The gateway and service discovery are what keep a real microservice mesh navigable; without them, clients hardcode addresses and every deploy risks breakage.',
    walkthrough: [
      'Start with a monolith; name the signal that justifies splitting.',
      'Put an API gateway in front so clients have one door and policy has one home.',
      'Register services in a discovery registry so callers resolve by name, not address.',
      'Let health checks plus discovery route only to live instances.',
    ],
    questions: [
      'What does a microservice split buy, and what does it cost?',
      'What cross-cutting concerns belong at the API gateway?',
      'Why is service discovery necessary in a dynamic deployment?',
    ],
    checklist: [
      'Contrast monolith and microservices with their trade-offs.',
      'List concerns an API gateway centralizes.',
      'Explain what service discovery resolves.',
    ],
    interactive: {
      coldOpen:
        'A four-person startup splits its app into twelve microservices "to be ready for scale." Six months later they are drowning in network failures, distributed bugs, and twelve deploy pipelines, serving a thousand users a monolith would have handled on one box. When does splitting help, and what two pieces keep a real mesh from becoming chaos?',
      mental:
        'The API gateway is the front desk of an office building: visitors check in at one lobby, get directed to the right floor, and security/sign-in happen once at the door. Service discovery is the building directory that updates as tenants move floors.',
      diagram: {
        nodes: ['Client', 'API gateway', 'Service discovery', 'Users service', 'Orders service'],
        explanations: [
          'External clients talk to one address and never need to know the internal service map.',
          'The single front door: routes each request, and enforces auth, rate limits, and logging in one place.',
          'The live registry of where each service instance is right now, updated as instances start, stop, and move.',
          'An independently deployable service owning its own data and scaling on its own.',
          'Another service; it calls the users service by name through discovery, never by a hardcoded address.',
        ],
      },
      example: {
        code: '# Client never calls services directly:\nclient -> api-gateway -> (auth, rate limit) -> route\n  GET /orders/42  -> orders service (discovered at 10.0.3.7:8080)\n  GET /users/42   -> users service  (discovered at 10.0.1.4:8080)\n\n# An instance redeploys to a new address:\norders service re-registers -> gateway/callers resolve the new one automatically',
        output:
          'one front door, policy enforced once, clients decoupled from the service map\naddresses change freely; discovery keeps routing correct',
        explain:
          'The client sees a stable API. Behind the gateway, services scale and move, and discovery keeps everyone pointed at live instances without anyone editing a config.',
      },
      predicts: [
        {
          question: 'A new product with a 4-person team is choosing its architecture. The usual right call is...',
          options: [
            'microservices from day one for future scale',
            'a monolith, splitting only when scale or team size demands it',
            'one service per database table',
          ],
          correct: 1,
          why: 'Microservices add network failures, distributed data, and ops overhead. A small team ships far faster on a monolith and splits later for concrete reasons.',
        },
        {
          question: 'Authentication and rate limiting for 12 microservices are best enforced...',
          options: [
            'separately inside each of the 12 services',
            'once at the API gateway',
            'in the client app',
          ],
          correct: 1,
          why: 'The gateway is the single front door, the natural home for cross-cutting policy. Duplicating auth across 12 services invites drift and gaps.',
        },
        {
          question: 'The orders service redeploys onto a new IP. Why does service discovery matter here?',
          options: [
            'it makes the service faster',
            'callers resolve it by name, so the address change does not break them',
            'it encrypts the traffic',
          ],
          correct: 1,
          why: 'Instances come and go in dynamic deployments. Discovery is the live registry that lets callers find the current address instead of hardcoding one that goes stale.',
        },
      ],
      build: {
        simple: 'Split a big app into smaller services.',
        actually:
          'A monolith is one deployable, simple and the right start. Microservices split into independently deployable, data-owning services so teams ship and scale separately. An API gateway is the single front door (auth, rate limits, routing in one place), and service discovery is the live registry that resolves services by name as their addresses change.',
        breaks:
          'Splitting too early pays the full distributed-systems tax (network failures, eventual consistency, cross-service tracing) before the team or scale justifies it. A feature that was one function call becomes several fallible network hops.',
      },
      doThisNow: [
        {
          task: 'Decide: a 4-person team building a new product. Monolith or microservices, and what one signal would later justify splitting?',
          reveal:
            'Monolith. Split only when a concrete signal appears: teams blocking each other on one deploy pipeline, or one component needing to scale very differently from the rest. Scale-readiness is not a reason; actual pain is.',
        },
        {
          task: 'Place the policy: you have 12 services that all need auth and rate limiting. Where does that logic live, and why not in each service?',
          reveal:
            'At the API gateway, the single front door. Duplicating auth across 12 services invites drift and gaps where one service forgets a check. One home for cross-cutting policy keeps it consistent.',
        },
      ],
      warStory:
        'A team split a working monolith into 8 services for a resume-driven rewrite. A simple "place order" feature then spanned 4 services, so every order was 4 network hops that could each fail or partially succeed. Debugging needed distributed tracing they had not built. They re-merged three services within the year. Split for a reason, not by default.',
      tweak: {
        instruction: 'A team splits a working monolith into 8 microservices and a simple feature now spans 4 services. What tax did they take on?',
        reveal:
          'A call that was an in-process function is now 4 network hops that can each fail, lag, or partially succeed, plus distributed tracing to debug it and eventual consistency across service databases. That tax is worth paying at scale and crushing before it. Split for a reason, not by default.',
      },
      receipt: {
        explain: [
          'The monolith-vs-microservices trade and when to split.',
          'What an API gateway and service discovery each handle.',
        ],
        question: 'Services need to talk to each other. Should that be a direct request, or a message on a queue?',
      },
      recap: [
        'Start monolith; split into services only when team or scale demands it.',
        'An API gateway is the single front door and the home for cross-cutting policy.',
        'Service discovery resolves services by name as their addresses change.',
      ],
    },
  },
  {
    id: 'sysd-rung-communication',
    title: 'Module 9: Communication Styles',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt:
      'Services and clients talk in several shapes: REST, RPC, GraphQL, WebSockets, and webhooks. Learn what each is for.',
    explanation: `Not all communication is a client asking a server for data. Five styles cover almost everything.

**REST.** Resources as URLs, HTTP verbs as actions (the API course teaches this in depth). The default for public and service APIs: cacheable, stateless, universally understood. Can be chatty, since rich screens may need several round trips.

**RPC.** Call a remote function as if it were local: getUser(42). gRPC is the common modern form, using binary Protocol Buffers over HTTP/2: fast and compact, ideal for high-volume internal service-to-service calls. Less browser-friendly and less self-describing than REST.

**GraphQL.** The client sends a query describing exactly the fields it wants, and the server returns precisely that, in one request. Solves REST's over-fetching and under-fetching for complex, nested data and varied clients. The cost is server complexity and harder caching.

**WebSockets.** A persistent, two-way connection so the server can push to the client the instant something happens, without the client asking. For realtime: chat, live dashboards, multiplayer, collaborative editing. Costs a held-open connection per client, which the realtime-chat design prompt explores.

**Webhooks.** The inverse of polling: instead of you repeatedly asking another service "anything new?", it calls your URL when an event happens. Stripe calls your endpoint when a payment succeeds. Efficient and timely, but you must verify the caller (signatures) and handle retries and duplicates, since delivery is at-least-once.

**Choosing.** REST for standard APIs, RPC for fast internal calls, GraphQL for flexible client-driven reads, WebSockets for server-pushed realtime, webhooks for event notifications between systems.`,
    production:
      'A common architecture uses several at once: REST or GraphQL at the public edge, gRPC between internal services for speed, WebSockets for the realtime features, and webhooks to integrate third parties. The frequent webhook bug is trusting an unverified caller or breaking on a duplicate delivery, which is why signature checks and idempotency are mandatory.',
    walkthrough: [
      'Default to REST for standard request/response APIs.',
      'Use gRPC for high-volume internal service-to-service calls.',
      'Reach for GraphQL when clients need varied, nested data in one request.',
      'Use WebSockets for server push and webhooks for cross-system events.',
    ],
    questions: [
      'When does GraphQL beat REST?',
      'Why is gRPC favored for internal service calls?',
      'What must a webhook receiver always do, and why?',
    ],
    checklist: [
      'Match REST, RPC, GraphQL, WebSockets, and webhooks to their use cases.',
      'Explain over-fetching and how GraphQL addresses it.',
      'Name the webhook receiver\'s obligations (verify, handle retries/duplicates).',
    ],
    interactive: {
      coldOpen:
        'A mobile screen needs a user and their last three orders. With one API style that is two round trips and a pile of fields you throw away; with another it is a single request for exactly what you want. And when Stripe needs to tell you a payment cleared, it does not wait for you to ask. Five communication styles, each built for a different shape of conversation.',
      mental:
        'REST is mailing a labeled form and getting one back. RPC is a quick phone call to a colleague. GraphQL is a precise order ("just these fields, please"). WebSockets is leaving the line open to talk both ways. Webhooks is "do not call us, we will call you."',
      diagram: {
        nodes: ['REST', 'RPC / gRPC', 'GraphQL', 'WebSockets', 'Webhooks'],
        explanations: [
          'Resources and HTTP verbs. The cacheable, universal default for public and service APIs.',
          'Call a remote function like a local one. gRPC over HTTP/2 is fast and compact for internal calls.',
          'The client asks for exactly the fields it needs in one request, ending over- and under-fetching.',
          'A persistent two-way connection so the server pushes the moment something changes. Realtime features.',
          'An event provider calls your URL when something happens, replacing polling. Verify and dedupe every delivery.',
        ],
      },
      example: {
        code: '# A mobile screen needs a user plus their last 3 orders:\nREST:    GET /users/42  then  GET /users/42/orders?limit=3   (2 round trips)\nGraphQL: one query -> { user(id:42){ name orders(last:3){ total } } }  (1 round trip)\n\n# A payment succeeds at Stripe:\nWebhook: Stripe -> POST https://yourapp.com/webhooks/stripe  (you verify + dedupe)',
        output:
          'GraphQL collapses the round trips and returns exactly the requested fields\nthe webhook means you never poll Stripe asking "paid yet?"',
        explain:
          'Each style removes a specific pain: GraphQL the extra round trips and over-fetching, the webhook the wasteful polling. The right choice follows the interaction shape, not fashion.',
      },
      predicts: [
        {
          question: 'A screen needs slightly different nested fields per client, and REST forces several round trips or over-fetching. The fitting choice is...',
          options: ['gRPC', 'GraphQL', 'webhooks'],
          correct: 1,
          why: 'GraphQL lets each client request exactly the fields it needs in one query, which is precisely the over/under-fetching problem REST struggles with for varied nested data.',
        },
        {
          question: 'Two internal services exchange millions of high-volume calls. The efficient choice is...',
          options: ['REST over JSON', 'gRPC over Protocol Buffers', 'webhooks'],
          correct: 1,
          why: 'gRPC uses compact binary over HTTP/2, far cheaper than JSON REST at high volume. It is less browser-friendly, which does not matter for internal calls.',
        },
        {
          question: 'Your endpoint receives a webhook. Before trusting it you must...',
          options: [
            'nothing, webhooks are pre-verified',
            'verify the signature and handle retries/duplicates',
            'poll the sender to confirm',
          ],
          correct: 1,
          why: 'Anyone can POST to a public URL, and delivery is at-least-once, so you verify the signature and make processing idempotent. Skipping either is a classic webhook bug.',
        },
      ],
      build: {
        simple: 'Services send requests to each other.',
        actually:
          'Five styles, each for a shape of conversation: REST (cacheable resource APIs, the default), gRPC (fast binary internal calls), GraphQL (client asks for exact fields in one request), WebSockets (persistent two-way for realtime push), webhooks (a provider calls your URL on an event instead of you polling).',
        breaks:
          'Webhook receivers must verify the signature (anyone can POST to a public URL) and tolerate duplicates (delivery is at-least-once). Skipping either is the classic webhook bug: a forged event or a double-processed payment.',
      },
      doThisNow: [
        {
          task: 'Pick the style for three needs: millions of internal service-to-service calls; a screen needing varied nested fields in one request; getting notified when a Stripe payment clears.',
          reveal:
            'gRPC for the high-volume internal calls (compact binary), GraphQL for the exact-fields-in-one-request screen, a webhook for the Stripe event (no polling). Each removes a specific pain the others cannot.',
        },
        {
          task: 'Fix a mismatch: a live collaborative editor polls REST every second and feels laggy. What style fits, and why?',
          reveal:
            'WebSockets. Edits must propagate the instant they happen, both directions. One held-open connection pushing changes beats wasteful, laggy per-second polling. This is the realtime-chat design territory.',
        },
      ],
      warStory:
        'A startup processed Stripe webhooks without verifying signatures. An attacker POSTed a fake "payment succeeded" event and got a paid subscription for free. They also double-shipped orders whenever Stripe retried a delivery. Two fixes (signature verification and idempotency) closed both holes; both are mandatory, never optional.',
      tweak: {
        instruction: 'You build a live collaborative document editor on plain REST polling every second. What style fits better, and why?',
        reveal:
          'WebSockets: edits must propagate the instant they happen, in both directions. Polling every second is wasteful and laggy, holding open one connection and pushing changes as they occur is what realtime collaboration needs. This is exactly the Realtime Chat design prompt\'s territory.',
      },
      receipt: {
        explain: [
          'What REST, gRPC, GraphQL, WebSockets, and webhooks each fit.',
          'Why webhook receivers must verify signatures and dedupe.',
        ],
        question: 'You can design the pieces. How do you size a system on the back of a napkin before you build it?',
      },
      recap: [
        'REST is the default; gRPC is fast internal calls; GraphQL gives clients exact fields in one request.',
        'WebSockets push from server to client in realtime; webhooks notify across systems.',
        'Webhook receivers must verify signatures and tolerate duplicate deliveries.',
      ],
    },
  },
  {
    id: 'sysd-rung-estimation',
    title: 'Module 10: Estimation And The Design Framework',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 15,
    prompt:
      'Tie it together: a repeatable framework for any design problem, and the back-of-the-envelope math that grounds it. Then take on the design prompts below.',
    explanation: `Concepts only matter when you can deploy them on a real problem under pressure. This is the method.

**The framework.** Walk every design problem the same way: (1) Clarify requirements, functional (what it does) and non-functional (scale, latency, consistency). (2) Estimate the scale: users, reads/sec, writes/sec, storage. (3) Define the API: the handful of endpoints. (4) Design the data model and pick stores (Module 5). (5) Sketch the high-level architecture: clients, load balancer, app tier, data tier, caches, queues. (6) Scale it and hunt bottlenecks: where does it break first, and which earlier module fixes it? (7) Name the trade-offs you chose. Following the same path every time means you never freeze on a blank page.

**Back-of-the-envelope estimation.** Rough numbers decide architecture. Powers of two: a thousand is ~2^10, a million ~2^20, a billion ~2^30. Latency numbers worth knowing: memory read ~100 nanoseconds, an SSD read ~100 microseconds, a network round trip within a datacenter ~0.5 milliseconds, and cross-continent ~100+ milliseconds. From "100M users, each making 10 requests a day" you derive ~12,000 requests/sec average, and you plan for peaks several times that.

**Finding the bottleneck.** Every design has one part that breaks first. Read-heavy points at caching and replicas (Modules 3, 4). Write-heavy points at sharding and queues (Modules 4, and the Queues course). A hot key points at consistent hashing (Module 7). Realtime points at WebSockets (Module 9). The design prompts in this course (URL Shortener, Notification Pipeline, Realtime Chat) are where you run the whole framework end to end.`,
    production:
      'Senior engineers are not the ones who memorize architectures; they are the ones who run this framework calmly and name the bottleneck before guessing at a fix. The estimation step is what separates a grounded design ("12k rps, so we need caching and replicas") from hand-waving.',
    walkthrough: [
      'Run the seven steps in order: requirements, scale, API, data, architecture, scale-out, trade-offs.',
      'Do the back-of-envelope math: derive requests/sec and storage from user counts.',
      'Identify the bottleneck and name the module that addresses it.',
      'Apply the framework to the URL Shortener, Notification Pipeline, and Realtime Chat prompts below.',
    ],
    questions: [
      'What are the seven steps of the design framework?',
      'How do you turn "100M users, 10 requests/day" into requests per second?',
      'How does the read/write balance point you at a scaling technique?',
    ],
    checklist: [
      'Recite the design framework steps in order.',
      'Do a back-of-the-envelope rps and storage estimate.',
      'Map a bottleneck to the module that solves it.',
    ],
    interactive: {
      coldOpen:
        '"Design Twitter." The blank page is where most people freeze. The engineers who do not freeze are not smarter; they run the same seven-step checklist every time and ground it with napkin math. "100M users at 10 requests a day" is about 12,000 requests a second, and that one number decides half your architecture. Let us make the freeze impossible.',
      mental:
        'The framework is a pre-flight checklist: pilots do not improvise the order, they run the same list every time so nothing is missed under pressure. A design interview is the same calm list.',
      diagram: {
        nodes: ['Requirements', 'Estimate scale', 'API + data', 'Architecture', 'Scale + bottleneck', 'Trade-offs'],
        explanations: [
          'Pin down what it must do (functional) and its scale, latency, and consistency needs (non-functional). Most design failures are skipped clarification.',
          'Back-of-envelope the users, reads/sec, writes/sec, and storage. The numbers decide the architecture.',
          'Define the few core endpoints and the data model, and pick stores by access pattern (Module 5).',
          'Sketch clients, load balancer, app tier, data tier, caches, and queues: the skeleton from Modules 1 to 4.',
          'Find what breaks first and apply the right module: caching/replicas for reads, sharding/queues for writes, consistent hashing for hot keys.',
          'State what you traded (consistency for availability, write speed for read complexity) so the design is a decision, not an accident.',
        ],
      },
      example: {
        code: '# "Design a system for 100M users, ~10 requests each per day."\nrequests/day = 100M * 10 = 1B\nseconds/day  ~= 86,400\navg rps      = 1B / 86,400 ~= ~12,000 rps\npeak rps     ~= 3-5x average ~= ~40,000-60,000 rps',
        output:
          '~12k rps average, plan for ~50k peak\n=> needs a load balancer + many app servers (M1, M2), heavy caching (M3),\n   read replicas (M4); a single box is nowhere near enough',
        explain:
          'Two lines of arithmetic turned a vague prompt into concrete requirements that name which modules you need. That is the entire value of the estimation step.',
      },
      predicts: [
        {
          question: 'A design problem is 99% reads and 1% writes. Your first scaling moves point at...',
          options: [
            'sharding the write path',
            'caching and read replicas',
            'a message queue',
          ],
          correct: 1,
          why: 'Read-heavy systems are won with caching (Module 3) and read replicas (Module 4). Sharding and queues are write-path tools, less urgent when writes are 1%.',
        },
        {
          question: 'Roughly, 1 billion requests spread evenly across a day is about...',
          options: ['~1,200 rps', '~12,000 rps', '~120,000 rps'],
          correct: 1,
          why: 'A day is ~86,400 seconds, and 1B / 86,400 is about 12,000 rps. Knowing a day is ~10^5 seconds makes this instant.',
        },
        {
          question: 'The most common reason a design interview goes badly is...',
          options: [
            'not memorizing enough architectures',
            'skipping requirements and scale estimation and jumping to a solution',
            'using the wrong programming language',
          ],
          correct: 1,
          why: 'Designs fail at the start, not the middle. Clarifying requirements and estimating scale is what makes every later choice defensible instead of arbitrary.',
        },
      ],
      build: {
        simple: 'There is a process for designing any system.',
        actually:
          'Run seven steps every time: clarify requirements, estimate scale, define the API, design the data model and pick stores, sketch the architecture, scale it and find the bottleneck, name the trade-offs. Ground it with napkin math (a day is ~10^5 seconds; memory ~100ns, datacenter round trip ~0.5ms, cross-continent ~100ms).',
        breaks:
          'Designs fail at the start, not the middle: skipping requirements and scale estimation and jumping to a solution. Without the numbers, every later choice is a guess instead of a consequence.',
      },
      doThisNow: [
        {
          task: 'Do the napkin math: 100M users make ~10 requests/day each. Derive average requests/sec, then a peak estimate.',
          reveal:
            '1B requests/day / ~86,400 sec ≈ ~12,000 rps average; plan ~3-5x for peak, so ~40,000-60,000 rps. That single number says: load balancer + many app servers + heavy caching + read replicas. A single box is nowhere close.',
        },
        {
          task: 'Run the first two framework steps on the URL Shortener prompt below: requirements (functional + non-functional) and a scale estimate.',
          reveal:
            'Functional: create short link, redirect, basic analytics. Non-functional: redirects must be fast (read-heavy) and highly available. Scale: ~10x more reads than writes means read-dominated, which points at caching and replicas first. You just turned a blank prompt into a plan.',
        },
      ],
      warStory:
        'In interviews, the candidates who freeze are the ones who jump straight to drawing boxes. The ones who pass open with "let me clarify requirements and estimate scale," derive ~12k rps out loud, and let that number justify every later choice. Same knowledge, opposite outcome, decided by running the checklist.',
      tweak: {
        instruction: 'Open the URL Shortener prompt below and run just the first two framework steps: requirements and a scale estimate.',
        reveal:
          'Functional: create short link, redirect, basic analytics. Non-functional: redirects must be fast (read-heavy) and highly available. Scale: if 100M new links/month and reads are 10x writes, you are read-dominated, which immediately points at caching and replicas before anything else. You just turned a blank prompt into a plan.',
      },
      receipt: {
        explain: [
          'The seven-step design framework, in order.',
          'How napkin math turns a vague prompt into concrete architecture needs.',
        ],
        question: 'Which design prompt below will you run the full framework on first?',
      },
      recap: [
        'Run the same seven steps every time: requirements, scale, API, data, architecture, bottleneck, trade-offs.',
        'Back-of-envelope math (powers of two, latency numbers) turns vague prompts into concrete needs.',
        'The read/write balance and hot spots name which module solves the bottleneck.',
      ],
    },
  },
]
