export type GlossaryTerm = {
  term: string
  definition: string
  synonyms?: string[]
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'API',
    definition: 'Application Programming Interface: the contract one program exposes so another program can ask it to do work or return data.',
    synonyms: ['Application Programming Interface'],
  },
  {
    term: 'endpoint',
    definition: 'A specific API route plus method, such as GET /users/:id, that a client can call.',
    synonyms: ['route handler', 'handler'],
  },
  {
    term: 'request',
    definition: 'A message from a client to a server. In HTTP it includes a method, path, headers, and sometimes a body.',
    synonyms: ['HTTP request'],
  },
  {
    term: 'response',
    definition: 'The server message sent back to the client. In HTTP it includes a status code, headers, and usually a body.',
    synonyms: ['HTTP response'],
  },
  {
    term: 'DNS',
    definition: 'Domain Name System: translates human names like api.example.com into IP addresses computers can connect to.',
    synonyms: ['Domain Name System'],
  },
  {
    term: 'TCP',
    definition: 'Transmission Control Protocol: creates a reliable, ordered byte stream between two machines.',
    synonyms: ['Transmission Control Protocol'],
  },
  {
    term: 'TLS',
    definition: 'Transport Layer Security: verifies the server and encrypts traffic. HTTPS is HTTP over TLS.',
    synonyms: ['Transport Layer Security', 'SSL'],
  },
  {
    term: 'HTTP',
    definition: 'Hypertext Transfer Protocol: the web request/response protocol with methods, paths, headers, status codes, and bodies.',
    synonyms: ['Hypertext Transfer Protocol'],
  },
  {
    term: 'URL',
    definition: 'Uniform Resource Locator: the full address for a resource, including scheme, host, path, and optional query string.',
    synonyms: ['Uniform Resource Locator'],
  },
  {
    term: 'query string',
    definition: 'The part of a URL after ?, used to send small option values like page=2 or sort=-createdAt.',
    synonyms: ['query params', 'query parameters'],
  },
  {
    term: 'status code',
    definition: 'A three-digit HTTP result code. 2xx means success, 4xx means client problem, and 5xx means server problem.',
    synonyms: ['status codes', 'HTTP status'],
  },
  {
    term: 'header',
    definition: 'Key-value metadata attached to a request or response, such as Content-Type, Authorization, or Cache-Control.',
    synonyms: ['headers', 'HTTP header', 'HTTP headers'],
  },
  {
    term: 'body',
    definition: 'The main payload of a request or response, often JSON for APIs or bytes for files.',
    synonyms: ['payload'],
  },
  {
    term: 'JSON',
    definition: 'JavaScript Object Notation: a text format for structured data made of objects, arrays, strings, numbers, booleans, and null.',
    synonyms: ['JavaScript Object Notation'],
  },
  {
    term: 'reverse proxy',
    definition: 'A server in front of your app that can terminate TLS, route traffic, load balance, cache, and add request metadata.',
    synonyms: ['proxy', 'load balancer'],
  },
  {
    term: 'middleware',
    definition: 'Code that runs before or around route handlers, often for auth, logging, body parsing, request IDs, or errors.',
    synonyms: ['middleware pipeline'],
  },
  {
    term: 'service',
    definition: 'A layer or module that owns business logic outside the HTTP controller and database details.',
    synonyms: ['service layer'],
  },
  {
    term: 'service shape',
    definition: 'The boundary layout of a backend service: controllers, services, repositories, config, tests, and side effects each have a clear home.',
    synonyms: ['backend shape', 'application shape'],
  },
  {
    term: 'business rule',
    definition: 'A product or domain rule the system must enforce, such as who can approve a loan or when an order can be cancelled.',
    synonyms: ['domain rule', 'business logic'],
  },
  {
    term: 'config',
    definition: 'Runtime settings supplied outside the code, commonly through environment variables, config files, or secret stores.',
    synonyms: ['configuration', 'environment variable', 'env var'],
  },
  {
    term: 'validation',
    definition: 'Checking untrusted input before using it, usually for required fields, types, ranges, formats, and allowed values.',
    synonyms: ['input validation', 'schema validation'],
  },
  {
    term: 'authentication',
    definition: 'Proving who the caller is, usually with a session cookie, token, or OAuth flow.',
    synonyms: ['authn', 'login'],
  },
  {
    term: 'authorization',
    definition: 'Deciding what an authenticated caller is allowed to do.',
    synonyms: ['authz', 'permission check'],
  },
  {
    term: 'JWT',
    definition: 'JSON Web Token: a signed token format commonly used to carry claims about a user or session.',
    synonyms: ['JSON Web Token'],
  },
  {
    term: 'OAuth',
    definition: 'A delegated authorization protocol that lets an app access resources without handling the user password directly.',
    synonyms: ['OAuth2', 'OAuth 2.0'],
  },
  {
    term: 'CORS',
    definition: 'Cross-Origin Resource Sharing: browser rules and headers that control which origins may call an API.',
    synonyms: ['Cross-Origin Resource Sharing'],
  },
  {
    term: 'CSRF',
    definition: 'Cross-Site Request Forgery: an attack where a site tricks a browser into sending an unwanted authenticated request.',
    synonyms: ['Cross-Site Request Forgery'],
  },
  {
    term: 'XSS',
    definition: 'Cross-Site Scripting: injecting script into a page so it runs in another user’s browser.',
    synonyms: ['Cross-Site Scripting'],
  },
  {
    term: 'database',
    definition: 'A durable system for storing and querying facts that must survive process restarts and be shared across servers.',
    synonyms: ['DB'],
  },
  {
    term: 'SQL',
    definition: 'Structured Query Language: the language used to read and change data in relational databases.',
    synonyms: ['Structured Query Language'],
  },
  {
    term: 'PostgreSQL',
    definition: 'A production-grade open-source relational database commonly used for backend applications.',
    synonyms: ['Postgres'],
  },
  {
    term: 'table',
    definition: 'A structured collection of rows and columns in a relational database.',
    synonyms: ['relation'],
  },
  {
    term: 'primary key',
    definition: 'The unique identifier for a database row.',
    synonyms: ['PK'],
  },
  {
    term: 'foreign key',
    definition: 'A database column that references a row in another table to represent a relationship.',
    synonyms: ['FK'],
  },
  {
    term: 'index',
    definition: 'A database lookup structure that speeds reads for selected columns at the cost of storage and slower writes.',
    synonyms: ['database index', 'DB indexes', 'DB index'],
  },
  {
    term: 'transaction',
    definition: 'An all-or-nothing group of database operations that commit together or roll back together.',
    synonyms: ['DB transaction', 'transactions'],
  },
  {
    term: 'migration',
    definition: 'A versioned database schema change, such as adding a table, column, index, or constraint.',
    synonyms: ['schema migration'],
  },
  {
    term: 'N+1 query',
    definition: 'A performance bug where one initial query is followed by one query per item, often accidentally.',
    synonyms: ['N+1'],
  },
  {
    term: 'cache',
    definition: 'A faster copy of data kept near where it is used to reduce latency, load, or repeated work.',
    synonyms: ['caching'],
  },
  {
    term: 'CDN',
    definition: 'Content Delivery Network: geographically distributed servers that cache and serve assets or responses close to users.',
    synonyms: ['Content Delivery Network'],
  },
  {
    term: 'cache invalidation',
    definition: 'The act of expiring or replacing cached data so users do not keep seeing stale values.',
    synonyms: ['invalidation'],
  },
  {
    term: 'queue',
    definition: 'A buffer for asynchronous work. Producers add jobs; workers process them later.',
    synonyms: ['message queue', 'message queues', 'job queue'],
  },
  {
    term: 'worker',
    definition: 'A process that consumes background jobs from a queue and performs work outside the request path.',
    synonyms: ['background worker'],
  },
  {
    term: 'dead-letter queue',
    definition: 'A place for jobs that failed too many times so they can be inspected instead of retried forever.',
    synonyms: ['DLQ', 'dead-letter queues'],
  },
  {
    term: 'backpressure',
    definition: 'A system’s way of slowing, rejecting, or buffering input when downstream work cannot keep up.',
    synonyms: ['bounded queue'],
  },
  {
    term: 'idempotency',
    definition: 'Making repeated attempts produce the same effect as one attempt, which is critical for retries and payments.',
    synonyms: ['idempotent'],
  },
  {
    term: 'retry',
    definition: 'Trying a failed operation again, usually with limits and backoff so you do not amplify an outage.',
    synonyms: ['retries', 'retry policy'],
  },
  {
    term: 'rate limit',
    definition: 'A rule that caps how many requests a caller can make in a time window.',
    synonyms: ['rate limiting'],
  },
  {
    term: 'observability',
    definition: 'The ability to understand system behavior from telemetry such as logs, metrics, and traces.',
    synonyms: ['telemetry'],
  },
  {
    term: 'log',
    definition: 'A timestamped event record written by software so engineers can inspect what happened.',
    synonyms: ['logs', 'structured log', 'structured logs'],
  },
  {
    term: 'metric',
    definition: 'A numeric time-series measurement such as request count, error rate, latency, or CPU usage.',
    synonyms: ['metrics'],
  },
  {
    term: 'trace',
    definition: 'A record of one request as it moves through services, usually with spans for each hop.',
    synonyms: ['tracing', 'distributed trace'],
  },
  {
    term: 'latency',
    definition: 'How long an operation takes, usually measured in milliseconds.',
    synonyms: ['response time'],
  },
  {
    term: 'SLO',
    definition: 'Service Level Objective: a measurable reliability target, such as 99.9% of requests under 300ms.',
    synonyms: ['Service Level Objective'],
  },
  {
    term: 'deployment',
    definition: 'The process of shipping a version of software to an environment where it can run.',
    synonyms: ['deploy'],
  },
  {
    term: 'CI/CD',
    definition: 'Continuous Integration and Continuous Delivery/Deployment: automated testing and release pipelines.',
    synonyms: ['continuous integration', 'continuous delivery'],
  },
  {
    term: 'container',
    definition: 'A packaged runtime environment for an app and its dependencies, commonly built with Docker.',
    synonyms: ['Docker container'],
  },
  {
    term: 'horizontal scaling',
    definition: 'Adding more instances or machines instead of making one machine bigger.',
    synonyms: ['scale out'],
  },
  {
    term: 'sharding',
    definition: 'Splitting data across multiple databases or partitions so no single node stores everything.',
    synonyms: ['partitioning'],
  },
  {
    term: 'replication',
    definition: 'Keeping copies of data on multiple nodes for availability, read scale, or disaster recovery.',
    synonyms: ['replica'],
  },
  {
    term: 'CAP theorem',
    definition: 'A distributed-systems tradeoff: during a network partition, a system must choose consistency or availability.',
    synonyms: ['CAP'],
  },
  {
    term: 'eventual consistency',
    definition: 'A model where replicas may temporarily disagree but converge if no new writes arrive.',
    synonyms: ['eventually consistent'],
  },
  {
    term: 'concurrency model',
    definition: 'How a runtime handles multiple tasks at once, such as threads, event loops, async/await, or worker processes.',
    synonyms: ['concurrency'],
  },
  {
    term: 'memory usage',
    definition: 'How much RAM a process consumes, including objects, buffers, caches, stacks, and runtime overhead.',
    synonyms: ['memory'],
  },
  {
    term: 'dependency management',
    definition: 'How a project declares, installs, pins, updates, and audits external libraries.',
    synonyms: ['dependencies'],
  },
  {
    term: 'runtime profiling',
    definition: 'Measuring where a running program spends CPU, memory, or time so bottlenecks are based on evidence.',
    synonyms: ['profiling'],
  },
  {
    term: 'graceful shutdown',
    definition: 'Stopping a process without dropping in-flight requests or corrupting work: stop accepting, drain, close, exit.',
    synonyms: ['shutdown'],
  },
  {
    term: 'controller',
    definition: 'The HTTP-facing layer that receives a request, extracts input, calls services, and returns a response.',
    synonyms: ['route controller'],
  },
  {
    term: 'repository',
    definition: 'A data-access layer that hides database queries behind methods the service layer can call.',
    synonyms: ['repository pattern', 'data access layer'],
  },
  {
    term: 'side effect',
    definition: 'Work that changes or depends on the outside world, such as database writes, file I/O, network calls, email, logs, or time.',
    synonyms: ['side effects'],
  },
  {
    term: 'request path',
    definition: 'The route portion of an HTTP request URL, such as /users/42, used by the router to choose a handler.',
    synonyms: ['path'],
  },
  {
    term: 'runtime',
    definition: 'The environment where code executes: process, memory, CPU, event loop, threads, files, and environment variables.',
  },
  {
    term: 'framework',
    definition: 'A library that provides application structure, such as routing, middleware, request parsing, and response helpers.',
  },
  {
    term: 'function',
    definition: 'A reusable block of code that accepts inputs, performs work, and may return a value.',
    synonyms: ['functions'],
  },
  {
    term: 'class',
    definition: 'A blueprint for objects that bundles state and methods together.',
    synonyms: ['classes'],
  },
  {
    term: 'object',
    definition: 'A value that groups related data and behavior, often through named properties.',
    synonyms: ['objects'],
  },
  {
    term: 'array',
    definition: 'An ordered collection of values indexed by position.',
    synonyms: ['arrays', 'list', 'lists'],
  },
  {
    term: 'dictionary',
    definition: 'A key-value collection used for fast lookup by key. In JavaScript this is often an object or Map; in Python it is dict.',
    synonyms: ['dict', 'map', 'hash map'],
  },
  {
    term: 'for loop',
    definition: 'A loop used to repeat work for each item in a collection or range.',
    synonyms: ['for...of loop'],
  },
  {
    term: 'while loop',
    definition: 'A loop that repeats while a condition remains true.',
  },
  {
    term: 'webhook',
    definition:
      'A user-defined HTTP callback: instead of you polling another service for changes, it POSTs to your URL the moment an event happens.',
    synonyms: ['HTTP callback', 'webhooks'],
  },
  {
    term: 'load balancer',
    definition:
      'A server that spreads incoming requests across a pool of backend machines and stops routing to ones that fail their health check.',
    synonyms: ['load balancing'],
  },
  {
    term: 'consistent hashing',
    definition:
      'A way to map keys to servers on a ring so that adding or removing a server moves only a small fraction of keys instead of nearly all of them.',
  },
  {
    term: 'API gateway',
    definition:
      'A single front door in front of many services that routes each request and centralizes auth, rate limiting, and logging.',
  },
  {
    term: 'microservices',
    definition:
      'An architecture that splits a system into small, independently deployable services that each own their data.',
    synonyms: ['microservice'],
  },
  {
    term: 'bloom filter',
    definition:
      'A tiny probabilistic structure that answers "have I definitely never seen this?" with no false negatives, used to skip expensive lookups.',
  },
  {
    term: 'write-ahead log',
    definition:
      'A durable append-only log a database writes changes to before applying them, so a crash can be replayed and nothing committed is lost.',
    synonyms: ['WAL'],
  },
  {
    term: 'heartbeat',
    definition:
      'A periodic "I am alive" signal a node sends so the system can detect failures and react when the beats stop.',
  },
  {
    term: 'quorum',
    definition:
      'The minimum number of nodes that must agree for a read or write to count, the knob that tunes consistency versus availability.',
  },
  {
    term: 'leader election',
    definition:
      'The process by which distributed nodes agree on a single coordinator, and pick a new one when it fails.',
  },
  {
    term: 'distributed lock',
    definition:
      'A lock shared across machines so only one node performs a critical action at a time, even though they do not share memory.',
  },
  {
    term: 'strong consistency',
    definition:
      'A guarantee that every read returns the most recent write, the opposite end of the spectrum from eventual consistency.',
  },
  {
    term: 'service discovery',
    definition:
      'A registry that tracks where each service instance currently lives, so callers resolve services by name instead of a hardcoded address.',
  },
  {
    term: 'checksum',
    definition:
      'A small value computed from data so the receiver can detect corruption: recompute it and compare.',
  },
  {
    term: 'IP address',
    definition:
      'The numeric address that identifies a machine on a network, so packets know where to go. IPv4 looks like 93.184.216.34; IPv6 is longer.',
  },
  {
    term: 'port',
    definition:
      'A number (0-65535) that picks which program on a machine a connection is for, so one IP can run many services. HTTPS is 443, HTTP is 80.',
  },
  {
    term: 'UDP',
    definition:
      'A fast, connectionless transport that fires packets with no delivery or ordering guarantees. Used for video, games, and DNS where speed beats reliability.',
    synonyms: ['User Datagram Protocol'],
  },
  {
    term: 'packet',
    definition:
      'A small unit of data with addressing metadata that travels the network independently and may arrive out of order or not at all.',
  },
  {
    term: 'CIDR',
    definition:
      'Notation like 10.0.0.0/24 that describes a block of IP addresses, where the /N says how many leading bits are fixed.',
    synonyms: ['subnet', 'subnetting'],
  },
  {
    term: 'NAT',
    definition:
      'Network Address Translation: lets many devices share one public IP by rewriting addresses at the router.',
    synonyms: ['Network Address Translation'],
  },
  {
    term: 'firewall',
    definition:
      'A filter that allows or blocks network traffic by rules on source, destination, port, and protocol.',
  },
  {
    term: 'OSI model',
    definition:
      'A seven-layer model of how network communication is organized, from physical wires up to the application.',
  },
  {
    term: 'throughput',
    definition:
      'The actual rate of useful work a system delivers (requests/sec, bytes/sec), distinct from latency (delay per request) and bandwidth (max capacity).',
  },
  {
    term: 'MySQL',
    definition: 'A widely used open-source relational database, the classic LAMP-stack SQL database.',
  },
  {
    term: 'MongoDB',
    definition: 'A document database that stores flexible JSON-like documents and queries inside them.',
  },
  {
    term: 'Redis',
    definition: 'An in-memory key-value store used as a cache, session store, rate-limit counter, queue, and leaderboard.',
  },
  {
    term: 'Memcached',
    definition: 'A simple, fast in-memory cache for key-value data, older and more minimal than Redis.',
  },
  {
    term: 'DynamoDB',
    definition: "Amazon's managed key-value and document store: serverless, single-digit-millisecond latency, scales to any size.",
  },
  {
    term: 'Cassandra',
    definition: 'A wide-column store built for massive write throughput across many nodes, with tunable consistency.',
  },
  {
    term: 'Elasticsearch',
    definition: 'A search and analytics engine built on an inverted index, for full-text search, logs, and aggregations.',
  },
  {
    term: 'Kafka',
    definition: 'A distributed, durable, partitioned event log for high-throughput streaming and pub/sub between systems.',
    synonyms: ['Apache Kafka'],
  },
  {
    term: 'RabbitMQ',
    definition: 'A traditional message broker with flexible routing, used as a task and message queue between services.',
  },
  {
    term: 'Amazon SQS',
    definition: "AWS's fully managed message queue: simple, durable, at-least-once delivery, with a built-in dead-letter queue.",
    synonyms: ['SQS'],
  },
  {
    term: 'Amazon S3',
    definition: "AWS's object storage: store and serve files/blobs by key with very high durability, the standard for static assets and backups.",
    synonyms: ['S3'],
  },
  {
    term: 'AWS Lambda',
    definition: 'Serverless functions: run code on demand with no servers to manage, billed per request and millisecond.',
    synonyms: ['Lambda'],
  },
  {
    term: 'Nginx',
    definition: 'A high-performance web server, reverse proxy, and load balancer, often the front door to an app.',
  },
  {
    term: 'ZooKeeper',
    definition: 'A coordination service for distributed systems: leader election, configuration, and locks.',
    synonyms: ['Apache ZooKeeper'],
  },
  {
    term: 'Docker',
    definition: 'A tool that packages an app and its dependencies into a container image that runs the same everywhere.',
  },
  {
    term: 'Kubernetes',
    definition: 'A container orchestrator that schedules, scales, heals, and networks containers across a cluster.',
    synonyms: ['k8s'],
  },
  {
    term: 'Prometheus',
    definition: 'A metrics and monitoring system that scrapes time-series data and powers alerting and dashboards.',
  },
  {
    term: 'Apache Spark',
    definition: 'A distributed engine for large-scale batch and analytics processing across a cluster.',
    synonyms: ['Spark'],
  },
  {
    term: 'Apache Flink',
    definition: 'A distributed engine for stateful stream processing: real-time analytics over event streams.',
    synonyms: ['Flink'],
  },
  {
    term: 'fanout',
    definition:
      'Delivering one event to many recipients. Fanout-on-write pushes to all followers at write time; fanout-on-read assembles on demand.',
    synonyms: ['fan-out'],
  },
  {
    term: 'hot key',
    definition:
      'A single key (one celebrity, one viral item, one giant tenant) that takes a hugely disproportionate share of traffic and overloads its shard.',
    synonyms: ['hot partition'],
  },
  {
    term: 'unique ID generation',
    definition:
      'Producing globally unique ids at scale without a single bottleneck: UUIDs, Snowflake-style time+machine ids, or a ticket server.',
  },
  {
    term: 'distributed counting',
    definition:
      'Counting at massive scale (likes, views) without a single hot row, using sharded counters or approximate structures.',
  },
  {
    term: 'long polling',
    definition:
      'A near-real-time technique where the client holds a request open until the server has data, between plain polling and WebSockets.',
  },
  {
    term: 'server-sent events',
    definition:
      'A one-way stream over HTTP where the server pushes updates to the client on a single long-lived connection.',
    synonyms: ['SSE'],
  },
  {
    term: 'geohash',
    definition:
      'An encoding of latitude and longitude into a short string so nearby places share a prefix, used to index location data.',
  },
  {
    term: 'single point of failure',
    definition:
      'Any component with no backup whose failure takes the whole system down. Removing SPOFs means adding redundancy everywhere.',
    synonyms: ['SPOF'],
  },
  {
    term: 'multi-region',
    definition:
      'Running a system in several geographic regions for lower latency and disaster tolerance, with the consistency and routing costs that brings.',
  },
  {
    term: 'distributed transaction',
    definition:
      'A transaction spanning multiple services or databases, coordinated with two-phase commit or, more commonly, a saga.',
  },
  {
    term: 'saga',
    definition:
      'A sequence of local transactions across services, each with a compensating action to undo it, used instead of a distributed lock-step transaction.',
  },
  {
    term: 'circuit breaker',
    definition:
      'A guard that stops calling a failing dependency after repeated errors, failing fast for a cooldown so the dependency can recover.',
  },
  {
    term: 'load shedding',
    definition:
      'Deliberately dropping or rejecting low-priority work under overload so the system stays up for the rest, instead of collapsing.',
  },
  {
    term: 'chunked upload',
    definition:
      'Splitting a large file into parts uploaded independently (and resumably) to object storage, then assembled, instead of one giant request.',
  },
  {
    term: 'multi-tenancy',
    definition:
      'Serving many customers (tenants) from shared infrastructure while isolating their data, on a spectrum from shared tables to dedicated stacks.',
  },
  {
    term: 'Amazon EC2',
    definition:
      "AWS's rentable virtual machines: you pick an instance type (CPU, memory), launch servers in minutes, and pay by the second while they run. The general-purpose way to run your own software in the cloud.",
    synonyms: ['EC2', 'Elastic Compute Cloud'],
  },
  {
    term: 'Amazon EBS',
    definition:
      'Elastic Block Store: a durable virtual disk you attach to an EC2 instance. It persists independently of the instance, can be snapshotted to S3, and survives a reboot.',
    synonyms: ['EBS', 'Elastic Block Store'],
  },
  {
    term: 'Auto Scaling',
    definition:
      'An AWS feature that adds or removes EC2 instances automatically based on demand (a target metric or schedule), so capacity tracks traffic instead of being fixed.',
    synonyms: ['Auto Scaling Group', 'ASG'],
  },
  {
    term: 'Elastic Load Balancing',
    definition:
      "AWS's managed load balancer. It spreads incoming traffic across healthy instances or containers, runs health checks, and is the front door for an Auto Scaling group.",
    synonyms: ['ELB', 'Application Load Balancer', 'ALB'],
  },
  {
    term: 'Amazon RDS',
    definition:
      'Relational Database Service: managed Postgres, MySQL, or SQL Server where AWS handles backups, patching, replication, and failover, so you run a relational database without operating the server.',
    synonyms: ['RDS', 'Relational Database Service'],
  },
  {
    term: 'Amazon Aurora',
    definition:
      "AWS's cloud-native relational database, wire-compatible with Postgres and MySQL, that separates compute from a distributed storage layer for higher throughput and faster failover than standard RDS.",
    synonyms: ['Aurora'],
  },
  {
    term: 'Amazon ElastiCache',
    definition:
      'Managed Redis or Memcached. It puts an in-memory cache in front of a database to absorb hot reads and hold sessions or rate-limit counters, without you running the cache servers.',
    synonyms: ['ElastiCache'],
  },
  {
    term: 'Amazon CloudFront',
    definition:
      "AWS's CDN: it caches and serves content from edge locations near users, fronting S3 or your application to cut latency and offload the origin.",
    synonyms: ['CloudFront'],
  },
  {
    term: 'Amazon Route 53',
    definition:
      "AWS's DNS service. It translates your domain into the right address and can route by latency, geography, weighting, or health, doubling as a traffic-steering and failover tool.",
    synonyms: ['Route 53'],
  },
  {
    term: 'Amazon VPC',
    definition:
      'Virtual Private Cloud: your own isolated network inside AWS. You define subnets (public and private), route tables, and security groups to control what can talk to what.',
    synonyms: ['VPC', 'Virtual Private Cloud'],
  },
  {
    term: 'AWS IAM',
    definition:
      'Identity and Access Management: who can do what in your AWS account. Policies grant least-privilege permissions to users, groups, and roles, and roles let services assume temporary credentials.',
    synonyms: ['IAM', 'Identity and Access Management'],
  },
  {
    term: 'Amazon CloudWatch',
    definition:
      "AWS's monitoring service: it collects metrics, logs, and alarms across services so you can see latency, errors, and resource use, and trigger alerts or scaling actions.",
    synonyms: ['CloudWatch'],
  },
  {
    term: 'AWS CloudTrail',
    definition:
      'An audit log of API activity in your AWS account: who called what, when, and from where. It answers "who changed this?" for security and compliance, distinct from CloudWatch performance monitoring.',
    synonyms: ['CloudTrail'],
  },
  {
    term: 'Amazon SNS',
    definition:
      'Simple Notification Service: pub/sub messaging that fans one published message out to many subscribers (queues, Lambdas, HTTP endpoints, email). Pairs with SQS for fan-out pipelines.',
    synonyms: ['SNS', 'Simple Notification Service'],
  },
  {
    term: 'AWS Fargate',
    definition:
      'A serverless way to run containers: you give it a container and resource size and AWS runs it without you managing EC2 hosts. A compute backend for ECS and EKS.',
    synonyms: ['Fargate'],
  },
  {
    term: 'Amazon ECS',
    definition:
      "Elastic Container Service: AWS's own orchestrator for running and scaling Docker containers, either on EC2 hosts you manage or serverless on Fargate.",
    synonyms: ['ECS', 'Elastic Container Service'],
  },
  {
    term: 'Amazon EKS',
    definition:
      'Elastic Kubernetes Service: managed Kubernetes on AWS. You get the standard Kubernetes API while AWS runs the control plane, useful when you want Kubernetes portability.',
    synonyms: ['EKS', 'Elastic Kubernetes Service'],
  },
  {
    term: 'AWS CloudFormation',
    definition:
      "Infrastructure as code for AWS: you declare resources in a template and CloudFormation creates, updates, and deletes them as one managed stack, so environments are reproducible.",
    synonyms: ['CloudFormation'],
  },
  {
    term: 'Amazon API Gateway',
    definition:
      'A managed front door for APIs: it terminates HTTPS, authenticates, throttles, and routes requests to Lambda or backend services, handling the cross-cutting concerns at the edge.',
    synonyms: ['API Gateway'],
  },
  {
    term: 'AWS Secrets Manager',
    definition:
      'A managed store for secrets (database passwords, API keys) with encryption, fine-grained access, and automatic rotation, so credentials stay out of code and config files.',
    synonyms: ['Secrets Manager'],
  },
  {
    term: 'AWS KMS',
    definition:
      'Key Management Service: creates and controls the encryption keys other AWS services use, so data at rest in S3, EBS, or RDS is encrypted with keys you govern and audit.',
    synonyms: ['KMS', 'Key Management Service'],
  },
  {
    term: 'Amazon Cognito',
    definition:
      'A managed user-identity service: sign-up, sign-in, social and SSO login, and token issuance for your app, so you do not build authentication and a user store from scratch.',
    synonyms: ['Cognito'],
  },
  {
    term: 'AWS Step Functions',
    definition:
      'A managed workflow engine: it coordinates multiple Lambdas and services as a state machine with retries, branching, and error handling, replacing brittle glue code for multi-step processes.',
    synonyms: ['Step Functions'],
  },
  {
    term: 'LLM',
    definition:
      'Large Language Model: a model that, given text, predicts the next token. Chat, code, and agents are all that one prediction run in a loop. It generates plausible text; it does not look up facts.',
    synonyms: ['large language model'],
  },
  {
    term: 'token',
    definition:
      'The unit an LLM reads and writes: a chunk of text, roughly 3-4 characters of English (~750 words per 1,000 tokens). Cost, context limits, and rate limits are all measured in tokens.',
    synonyms: ['tokens', 'tokenization'],
  },
  {
    term: 'context window',
    definition:
      'The maximum number of tokens a model can consider at once. The system prompt, conversation history, retrieved documents, the question, and the generated reply must all fit inside it.',
    synonyms: ['context length'],
  },
  {
    term: 'prompt',
    definition:
      'The text you send an LLM: the instructions plus the conversation. It is the only lever you have at inference time, so shaping it is how you steer the model.',
    synonyms: ['prompting'],
  },
  {
    term: 'system prompt',
    definition:
      'A top-level instruction that sets persistent behavior and rules for an LLM (its role, format, and constraints), separate from the user turns it applies to.',
    synonyms: ['system message'],
  },
  {
    term: 'prompt engineering',
    definition:
      'Giving a next-token predictor enough context and constraint that the most probable continuation is the answer you want: specificity, examples, role, and structure.',
  },
  {
    term: 'hallucination',
    definition:
      'When an LLM states a plausible-sounding but false fact, citation, or API. It is the same next-token mechanism as a correct answer, unguarded by grounding or verification.',
    synonyms: ['confabulation'],
  },
  {
    term: 'temperature',
    definition:
      'A sampling control for how random an LLM\'s next-token choice is: low is focused and repetitive, high is varied and creative. Some newer models manage sampling for you instead of exposing it.',
  },
  {
    term: 'inference',
    definition:
      'Running a trained model to get an output: text in, prediction out. Every API call is inference. It is distinct from training, which happened once and is frozen into the weights.',
  },
  {
    term: 'fine-tuning',
    definition:
      'Continuing a model\'s training on your own examples to specialize its behavior. Heavier than prompting or retrieval; most teams reach for prompts and RAG first.',
  },
  {
    term: 'embedding',
    definition:
      'A vector of numbers representing the meaning of text, positioned so similar meanings land near each other. The basis of semantic search and retrieval.',
    synonyms: ['embeddings', 'vector embedding'],
  },
  {
    term: 'vector database',
    definition:
      'A store that holds embeddings and finds the nearest vectors to a query vector quickly, powering semantic search over millions of documents.',
    synonyms: ['vector store', 'vector index'],
  },
  {
    term: 'semantic search',
    definition:
      'Search by meaning instead of keywords: embed the query, find the nearest document vectors. It matches "I forgot my login" to "reset your password" despite no shared words.',
  },
  {
    term: 'RAG',
    definition:
      'Retrieval-Augmented Generation: retrieve relevant documents first, then have the LLM answer using only them. The main defense against hallucination and the way to ground answers in your data.',
    synonyms: ['retrieval-augmented generation'],
  },
  {
    term: 'tool use',
    definition:
      'Letting an LLM call functions you define (look up an order, query a DB, send an email). The model requests a tool with arguments; your code executes it and returns the result.',
    synonyms: ['function calling'],
  },
  {
    term: 'AI agent',
    definition:
      'An LLM running tool use in a loop, choosing each step toward a goal. It differs from a workflow by giving control flow to the model. Worth it only for genuinely open-ended tasks.',
    synonyms: ['agent', 'agentic loop'],
  },
  {
    term: 'prompt injection',
    definition:
      'An attack where hidden instructions in untrusted content (a document, a web page, an email) hijack an LLM into ignoring its rules. The SQL injection of LLM apps; defended with least privilege, not prompts alone.',
  },
  {
    term: 'structured output',
    definition:
      'Constraining an LLM\'s response to a JSON schema so it is reliably parseable. Turns "usually valid JSON" into "always this shape," which a backend can consume directly.',
    synonyms: ['JSON mode', 'structured outputs'],
  },
  {
    term: 'prompt caching',
    definition:
      'Reusing a stable prompt prefix (system prompt, tools, knowledge) so repeated tokens are served from cache at a fraction of the cost and latency. A strict prefix match: one byte change invalidates it.',
  },
  {
    term: 'eval',
    definition:
      'A graded test set for a non-deterministic LLM feature. Since output varies, you score against examples (deterministically or with an LLM judge) instead of asserting exact equality.',
    synonyms: ['evals', 'LLM eval'],
  },
  {
    term: 'agent knowledge core',
    definition:
      'The single source of truth that defines an agent fleet: the agent types, the shared behavioral rules, and the system standards every agent inherits. Change it once and every agent changes; without it, definitions drift across prompts until two agents that should match no longer do.',
    synonyms: ['knowledge core', 'agent core'],
  },
  {
    term: 'agent type',
    definition:
      'A named agent role with a fixed contract: its purpose, the tools it may call, the constraints it must obey, and the shape of its output. Typing an agent turns an ad-hoc prompt into a unit you can review, reuse, and enforce.',
    synonyms: ['agent role'],
  },
  {
    term: 'agent behavioral rules',
    definition:
      'The shared laws every agent obeys regardless of type: ground claims before stating them, protect secrets, escalate on low confidence, stop after a step budget. They live in the knowledge core and are inherited, not copy-pasted into each prompt.',
    synonyms: ['behavioral rules', 'agent rules'],
  },
  {
    term: 'agent capability',
    definition:
      'A power granted to an agent, defined by the narrowest set of tools that does the job (a default-deny allow-list) plus the constraints that bound it: step, cost, and approval limits. Adding a capability is a tool-access decision first and a prompt second.',
    synonyms: ['agent capabilities', 'agent tool access'],
  },
  {
    term: 'handoff protocol',
    definition:
      'The typed payload one agent passes to another when delegating work: what was done, what was found, what to do next, and what is forbidden. A clean handoff keeps the receiving agent grounded and bounded; passing the raw transcript leaks constraints and budget.',
    synonyms: ['agent handoff', 'handoff'],
  },
  {
    term: 'agent memory',
    definition:
      'The engineered recall around a stateless model: working memory (curated task state kept in the context window across a multi-step loop) and persistent memory (facts written to a store and retrieved on later runs). The model remembers nothing between calls; you build both.',
    synonyms: ['working memory', 'persistent memory'],
  },
  {
    term: 'context sharing',
    definition:
      'How collaborating agents share state without inheriting every transcript: a shared scratchpad (a blackboard) plus typed handoffs, where each agent reads the curated slice it needs and writes back a curated result. Sharing raw transcripts blows the budget and leaks constraints.',
    synonyms: ['blackboard', 'shared context'],
  },
  {
    term: 'multi-agent system',
    definition:
      'A workflow where several specialized agents collaborate, each with its own type, tools, and memory, coordinating through handoffs and shared context. Worth the complexity only when one agent cannot hold the whole job; otherwise it multiplies cost and failure modes.',
    synonyms: ['multi-agent', 'agent orchestration', 'agent fleet'],
  },
  {
    term: 'agent discovery',
    definition:
      'How agents and tools find each other at runtime: a registry lists what exists, what it does, and how to call it, so an agent looks up a capability instead of hardcoding it. Service discovery applied to agents and tools, and the idea behind protocols like MCP.',
    synonyms: ['capability discovery', 'agent registry', 'tool registry'],
  },
  {
    term: 'agent governance',
    definition:
      'The control structure over an agent fleet: shared standards (schemas, logging, naming), review for adding types or granting tools, versioned definitions, audit logs of every tool call, and human-approval gates on risky actions. The platform layer that keeps a growing fleet consistent and accountable.',
    synonyms: ['agent governance structures'],
  },
  {
    term: 'Model Context Protocol',
    definition:
      'An open protocol (MCP) that lets agents discover and call tools and data sources through one common contract, instead of every team hand-wiring every tool into every agent. Service discovery and a standard interface for the agent ecosystem.',
    synonyms: ['MCP'],
  },
  {
    term: 'CRUD',
    definition:
      'Create, Read, Update, Delete: the four basic operations a data API exposes over a resource, usually mapped to POST, GET, PUT or PATCH, and DELETE.',
  },
  {
    term: 'REST',
    definition:
      'An API style that models the server as resources addressed by URLs and acted on with HTTP methods, using status codes and representations (usually JSON) instead of custom verbs.',
    synonyms: ['RESTful'],
  },
  {
    term: 'routing',
    definition:
      'Matching an incoming request method and path to the handler that should serve it. The first decision a web framework makes on every request.',
    synonyms: ['request routing', 'route matching'],
  },
  {
    term: 'filtering',
    definition:
      'Narrowing a list endpoint to rows that match query criteria (status=open, owner=me), applied as WHERE conditions so the client receives only what it asked for.',
  },
  {
    term: 'sorting',
    definition:
      'Ordering a list endpoint by one or more fields (sort=-created_at), applied as ORDER BY so results arrive in a defined, stable order.',
  },
  {
    term: 'pagination',
    definition:
      'Returning a large result set in pages instead of all at once, by offset and limit or by a cursor, so responses stay bounded in size and cost.',
    synonyms: ['paging', 'cursor pagination'],
  },
  {
    term: 'slug',
    definition:
      'A short, URL-safe identifier derived from text (my-first-post), used in place of a raw id so links are readable and stable.',
    synonyms: ['slugs', 'URL slug'],
  },
  {
    term: 'short-code generation',
    definition:
      'Producing a compact, unique, URL-safe code (often base62) to stand in for a longer value, as a URL shortener maps abc123 to a full link. It must guarantee uniqueness, usually via a unique index or a counter.',
    synonyms: ['short code'],
  },
  {
    term: 'fast ack',
    definition:
      'Acknowledging a request immediately with a 2xx and doing the real work asynchronously afterward, so the caller is not blocked and the provider does not time out and retry.',
    synonyms: ['fast acknowledgement', 'ack then process'],
  },
  {
    term: 'conditional request',
    definition:
      'An HTTP request that only proceeds if a precondition holds, using ETag with If-None-Match or If-Modified-Since, so the server can answer 304 Not Modified and skip resending unchanged data.',
    synonyms: ['conditional requests'],
  },
  {
    term: 'redirect',
    definition:
      'An HTTP response (301, 302, 307, 308) that points the client at a different URL via the Location header. 301 and 308 are permanent; 302 and 307 are temporary.',
    synonyms: ['redirects', 'HTTP redirect'],
  },
  {
    term: 'HTTP caching',
    definition:
      'Caching at the HTTP layer using response headers (Cache-Control, ETag, Expires) so browsers, CDNs, and proxies can reuse responses without re-asking the origin.',
    synonyms: ['response caching'],
  },
  {
    term: 'cache-aside',
    definition:
      'A caching pattern where the application checks the cache first and, on a miss, loads from the source, stores it in the cache, and returns it. The cache is populated lazily, on demand.',
    synonyms: ['look-aside cache', 'lazy caching'],
  },
  {
    term: 'TTL',
    definition:
      'Time To Live: how long a cached value or record stays valid before it expires and must be refreshed. The simplest cache-invalidation strategy.',
    synonyms: ['time to live'],
  },
  {
    term: 'eviction',
    definition:
      'Removing entries from a full cache to make room for new ones, by a policy such as LRU (least recently used) or LFU (least frequently used). Distinct from expiry, which is time-based.',
    synonyms: ['cache eviction', 'LRU'],
  },
  {
    term: 'exponential backoff',
    definition:
      'Retrying a failed operation after waiting longer each time (1s, 2s, 4s, and so on), usually with jitter, so a struggling dependency is not hammered by synchronized retries.',
    synonyms: ['backoff', 'backoff and jitter'],
  },
  {
    term: 'background job',
    definition:
      'Work deferred out of the request path to a worker that runs it later (send an email, process a video), so the user gets a fast response and slow work happens asynchronously.',
    synonyms: ['background jobs', 'async job'],
  },
  {
    term: 'HMAC signature',
    definition:
      'A keyed hash (hash-based message authentication code) attached to a message so the receiver can verify it came from a holder of the shared secret and was not altered. The standard way to authenticate webhooks.',
    synonyms: ['HMAC signatures', 'HMAC'],
  },
  {
    term: 'replay protection',
    definition:
      'Stopping an attacker from re-sending a previously valid request, by rejecting stale timestamps and remembering recently seen nonces or event ids so each request is accepted only once.',
    synonyms: ['anti-replay'],
  },
  {
    term: 'audit log',
    definition:
      'An append-only record of who did what and when (actor, action, target, timestamp), kept for accountability and incident review rather than for application logic.',
    synonyms: ['audit logs', 'audit trail'],
  },
  {
    term: 'auth',
    definition:
      'Shorthand for the pair of authentication (proving who you are) and authorization (deciding what you may do). The two are distinct steps and are easy to confuse.',
  },
  {
    term: 'aggregation',
    definition:
      'Summarizing many rows into fewer using functions like COUNT, SUM, AVG, MIN, and MAX with GROUP BY, so a query returns totals per category instead of raw rows.',
    synonyms: ['aggregate query', 'GROUP BY'],
  },
  {
    term: 'optimistic locking',
    definition:
      'Concurrency control that lets readers proceed and detects a conflict at write time with a version column or timestamp, retrying if the row changed underneath. It avoids holding a lock, at the cost of occasional retries.',
    synonyms: ['optimistic concurrency'],
  },
  {
    term: 'relational modeling',
    definition:
      'Designing data as tables with keys and relationships (one-to-many, many-to-many) and normalizing to remove duplication, so the schema enforces integrity through foreign keys and joins.',
    synonyms: ['data modeling', 'schema design'],
  },
  {
    term: 'apdex',
    definition:
      'Application Performance Index: a single score from 0 to 1 that buckets request latencies into satisfied, tolerating, and frustrated against a target, giving one number for user-perceived speed.',
    synonyms: ['Apdex score'],
  },
  {
    term: 'error rate',
    definition:
      'The fraction of requests that fail over a window (failed responses divided by total), a primary signal of service health and a common SLO and alert threshold.',
    synonyms: ['failure rate'],
  },
  {
    term: 'percentile',
    definition:
      'A latency cut point: p99 is the value 99 percent of requests come in under. Tail percentiles like p95 and p99 reveal the slow experiences that an average hides.',
    synonyms: ['percentiles', 'p99', 'tail latency'],
  },
  {
    term: 'status workflow',
    definition:
      'A defined set of states a record moves through (draft to submitted to approved to paid) with allowed transitions, so a status can change only along legal edges. A state machine for a row.',
    synonyms: ['status state machine', 'state workflow'],
  },
  {
    term: 'top-k',
    definition:
      'Finding the k highest-ranked items (the top 10 by score) from a large set, often with a heap or a sorted structure, instead of sorting everything. Common for leaderboards and trending lists.',
    synonyms: ['top-k query', 'top n'],
  },
  {
    term: 'shell',
    definition:
      'A program that reads a line of text, runs the program you named with the arguments you gave, prints its output, and waits for the next line. bash, zsh, and sh are common shells. The command line is this read-run-print loop.',
    synonyms: ['command shell', 'bash', 'zsh'],
  },
  {
    term: 'terminal',
    definition:
      'The window that shows text and takes your keystrokes. It displays whatever the shell and programs print. The terminal is the screen; the shell is the program running inside it that interprets your commands.',
    synonyms: ['terminal emulator', 'console'],
  },
  {
    term: 'command-line prompt',
    definition:
      'The text the shell prints when it is idle and ready for input, often ending in $ (or # for root). When the prompt is showing, the shell is waiting; when it is gone, a program is still running.',
    synonyms: ['shell prompt', 'prompt'],
  },
  {
    term: 'working directory',
    definition:
      'The one directory your shell is currently sitting in. Every relative path is resolved against it, and pwd prints it. Each terminal tab has its own working directory.',
    synonyms: ['current directory', 'cwd', 'pwd'],
  },
  {
    term: 'pwd',
    definition:
      'Print working directory: the command that shows the full absolute path of the directory you are currently in. The first thing to check when a command behaves unexpectedly.',
    synonyms: ['print working directory'],
  },
  {
    term: 'ls',
    definition:
      'Lists the contents of a directory. ls -l shows the long form (permissions, owner, size, date), ls -a shows hidden dotfiles, and ls -la shows both.',
    synonyms: ['list directory'],
  },
  {
    term: 'cd',
    definition:
      'Change directory: moves your shell into another directory. cd path goes there, cd .. goes up one level, and cd with no argument returns to your home directory.',
    synonyms: ['change directory'],
  },
  {
    term: 'absolute path',
    definition:
      'A file address that starts at the root (/) and is the same no matter where you are standing, like /home/abhi/notes.txt. Scripts and config prefer absolute paths because they are location-independent.',
    synonyms: ['full path'],
  },
  {
    term: 'relative path',
    definition:
      'A file address resolved against your current working directory, like notes.txt or ../config. The same relative path points at different files depending on your pwd.',
    synonyms: ['relative file path'],
  },
  {
    term: 'home directory',
    definition:
      'Your personal directory (for example /home/abhi or /Users/abhi), where your files and dotfiles live. The shell expands ~ to it, and cd with no argument jumps there.',
    synonyms: ['~', 'home folder'],
  },
  {
    term: 'root directory',
    definition:
      'The single top of the filesystem, written /. Every absolute path begins here. Not to be confused with the root user (the administrator account) or a user home directory.',
    synonyms: ['filesystem root', '/'],
  },
  {
    term: 'cat',
    definition:
      'Prints the entire contents of a file to the screen, and can join (concatenate) multiple files. Great for short files; a mistake for huge ones, which flood the terminal.',
    synonyms: ['concatenate'],
  },
  {
    term: 'less',
    definition:
      'A pager that opens a file in a scrollable view (arrow keys, /search, q to quit) without loading it all into memory. The safe way to read large files.',
    synonyms: ['pager'],
  },
  {
    term: 'head',
    definition:
      'Prints the first lines of a file (10 by default; head -n N for N lines). Handy for peeking at the start of a file or the top of command output.',
    synonyms: ['head command'],
  },
  {
    term: 'tail',
    definition:
      'Prints the last lines of a file (10 by default; tail -n N for N). tail -f follows the file and prints new lines as they are written, the standard way to watch a live log; tail -F survives log rotation.',
    synonyms: ['tail command', 'tail -f'],
  },
  {
    term: 'mkdir',
    definition:
      'Makes a new directory. mkdir -p makes a whole nested path at once and succeeds even if it already exists.',
    synonyms: ['make directory'],
  },
  {
    term: 'touch',
    definition:
      'Creates an empty file if it does not exist, or updates a file timestamp if it does. The quickest way to make a placeholder file.',
    synonyms: ['touch command'],
  },
  {
    term: 'cp',
    definition:
      'Copies a file (cp a b) or a directory tree (cp -r dir1 dir2), leaving the original in place. Copying a large file takes real time because all the bytes are read and rewritten.',
    synonyms: ['copy file'],
  },
  {
    term: 'mv',
    definition:
      'Moves a file or directory, which is also how you rename (move to a new name in the same directory). Within one filesystem mv is instant because only the directory entry changes, no bytes move.',
    synonyms: ['move', 'rename file'],
  },
  {
    term: 'rm',
    definition:
      'Deletes files (rm file) and directory trees (rm -r dir). There is no recycle bin: removal is immediate and usually unrecoverable. rm -i prompts first; rm -rf forces without asking, so treat it with care.',
    synonyms: ['remove file', 'delete file'],
  },
  {
    term: 'file permissions',
    definition:
      'The read/write/execute rights a file grants to three classes: the owning user, the owning group, and everyone else. Shown by ls -l as ten characters (type plus three rwx groups) and set with chmod.',
    synonyms: ['unix permissions', 'rwx', 'permission bits'],
  },
  {
    term: 'chmod',
    definition:
      'Changes a file permission bits, either symbolically (chmod +x, chmod g-w) or with octal (chmod 644, chmod 755). Octal sums r=4, w=2, x=1 per class. chmod +x is how you make a script runnable.',
    synonyms: ['change mode', 'chmod +x'],
  },
  {
    term: 'chown',
    definition:
      'Changes who owns a file: chown user file sets the owner, chown user:group file sets owner and group. Often needs sudo. A frequent fix for a server that cannot read its own files.',
    synonyms: ['change owner'],
  },
  {
    term: 'pipe',
    definition:
      'The | operator, which connects one program standard output to the next program standard input with no temp file, like cat log | grep ERROR | wc -l. Composing small single-purpose tools this way is the heart of the command line.',
    synonyms: ['pipeline', '|'],
  },
  {
    term: 'redirection',
    definition:
      'Sending a program stream to or from a file: > writes stdout (overwriting), >> appends, < feeds a file in as stdin, 2> captures stderr, and 2>&1 merges stderr into stdout.',
    synonyms: ['redirect', 'output redirection'],
  },
  {
    term: 'standard streams',
    definition:
      'The three default channels every program has: standard input (stdin, fd 0), standard output (stdout, fd 1) for normal results, and standard error (stderr, fd 2) for errors. Pipes and redirects rewire where they go.',
    synonyms: ['stdin', 'stdout', 'stderr'],
  },
  {
    term: 'grep',
    definition:
      'Searches text for lines matching a pattern (a regular expression) and prints them, from files or piped input. Key flags: -i ignore case, -r recurse a tree, -n line numbers, -v invert, -c count.',
    synonyms: ['grep command', 'text search'],
  },
  {
    term: 'find',
    definition:
      'Walks a directory tree and returns paths matching tests like -name, -type, -size, and -mtime, and can act on them with -delete or -exec. Where grep searches inside files, find searches for the files themselves.',
    synonyms: ['find command', 'file search'],
  },
  {
    term: 'uname',
    definition:
      'Prints system information: uname -a shows the kernel, architecture, and OS in one line, and uname -r just the kernel release. The first command for "what is this machine".',
    synonyms: ['uname -a', 'uname -r'],
  },
  {
    term: 'uptime',
    definition:
      'Shows how long the machine has been running and the load average (roughly how many processes are competing for CPU over the last 1, 5, and 15 minutes). Compare the load to the core count to judge saturation.',
    synonyms: ['load uptime'],
  },
  {
    term: 'load average',
    definition:
      'Three numbers (1, 5, 15 minute) for how many processes are running or waiting, including for disk. Meaningful only against the CPU core count: 1.0 saturates 1 core but idles an 8-core box.',
    synonyms: ['system load'],
  },
  {
    term: 'hostname',
    definition:
      'Prints (or sets) the machine name. hostname -i prints its IP address. Useful to confirm which server you are actually on before running a command.',
    synonyms: ['machine name'],
  },
  {
    term: 'df',
    definition:
      'Disk free: shows space used and available per mounted filesystem. df -h gives human units and a Use% column. Finds which filesystem is full, not what filled it (that is du).',
    synonyms: ['df -h', 'disk free'],
  },
  {
    term: 'du',
    definition:
      'Disk usage: sums the size of files in a directory tree. du -sh * shows the total of each item here; pair with sort -h to find the directory that ate the disk. The complement to df.',
    synonyms: ['du -sh', 'disk usage'],
  },
  {
    term: 'free',
    definition:
      'Shows memory used, free, and available. free -m reports in megabytes. "available" (what apps can still use, including reclaimable cache) matters more than raw "free", because Linux uses spare RAM as disk cache.',
    synonyms: ['free -m', 'memory usage command'],
  },
  {
    term: 'lsblk',
    definition:
      'Lists block devices (disks and partitions) as a tree with their mount points. Shows the physical storage layout beneath the filesystems that df reports on.',
    synonyms: ['list block devices'],
  },
  {
    term: 'mount',
    definition:
      'Attaches a filesystem to a directory (the mount point) so its files become accessible, and lists what is currently mounted. A filesystem must be mounted before you can read or write it; findmnt shows the mount tree.',
    synonyms: ['mount point', 'findmnt'],
  },
  {
    term: 'process',
    definition:
      'A running instance of a program, with its own memory and a numeric process id (PID). Everything executing on a Linux box is a process owned by some user; you list them with ps/top and signal them with kill.',
    synonyms: ['running program'],
  },
  {
    term: 'PID',
    definition:
      'Process id: the number the kernel assigns each running process. You target a process by its PID (kill 4471) or find it by name with pgrep. PID 1 is the init/systemd process that starts everything else.',
    synonyms: ['process id'],
  },
  {
    term: 'ps',
    definition:
      'Lists processes. ps aux shows every process with its user, PID, CPU, and memory; ps aux | grep name filters to what you care about. A snapshot, where top is a live view.',
    synonyms: ['ps aux', 'process status'],
  },
  {
    term: 'top',
    definition:
      'A live, auto-updating, sorted view of running processes by CPU or memory. The fastest way to spot what is saturating a machine. htop is a friendlier interactive version.',
    synonyms: ['htop', 'process monitor'],
  },
  {
    term: 'kill',
    definition:
      'Sends a signal to a process by PID. kill PID sends SIGTERM (a catchable "please shut down"); kill -9 PID sends SIGKILL (forced, uncatchable, last resort). pkill/killall signal by name.',
    synonyms: ['kill -9', 'pkill', 'killall'],
  },
  {
    term: 'signal',
    definition:
      'A numbered message sent to a process. SIGTERM (15) and SIGINT (2, from Ctrl-C) are catchable so a program can clean up; SIGKILL (9) and SIGSTOP cannot be caught. Graceful shutdown relies on handling SIGTERM.',
    synonyms: ['SIGTERM', 'SIGKILL', 'unix signal'],
  },
  {
    term: 'job control',
    definition:
      'Managing programs started from your shell: & runs in the background, Ctrl-Z suspends the foreground job, bg resumes it in the background, fg brings it forward, and jobs lists them. nohup/disown keep a job alive after the terminal closes.',
    synonyms: ['bg', 'fg', 'jobs'],
  },
  {
    term: 'sudo',
    definition:
      'Runs a single command as another user (root by default) for permitted users, after your own password, with an audit log. Safer than logging in as root because it is per-command and recorded.',
    synonyms: ['superuser do'],
  },
  {
    term: 'root user',
    definition:
      'The superuser, user id 0, allowed to read, write, and kill anything. You rarely log in as root; you elevate single commands with sudo. Distinct from the root directory (/).',
    synonyms: ['superuser', 'uid 0'],
  },
  {
    term: 'user and group',
    definition:
      'Every file and process belongs to a user and a group; group membership lets several users share access via the group permission bits. id shows your user, group, and memberships; usermod -aG adds a user to a group.',
    synonyms: ['unix users', 'unix groups', 'id'],
  },
  {
    term: 'ip command',
    definition:
      'The modern tool for network interfaces and routes: ip addr shows your IP addresses, ip route shows how packets leave the machine. Replaces the deprecated ifconfig.',
    synonyms: ['ip addr', 'ifconfig'],
  },
  {
    term: 'ping',
    definition:
      'Sends ICMP echo requests to check whether a host answers and how long the round trip takes. A failed ping does not always mean down: some hosts and firewalls block ICMP, so test the real port too.',
    synonyms: ['ping command', 'ICMP echo'],
  },
  {
    term: 'ss',
    definition:
      'Shows socket statistics: ss -tlnp lists which TCP ports are listening and which process owns each. The fast modern replacement for netstat; the quick check that your service is actually bound.',
    synonyms: ['netstat', 'ss -tlnp'],
  },
  {
    term: 'dig',
    definition:
      'Queries DNS, resolving a name to IP addresses and showing records. dig +short example.com prints just the answer; host is a shorter version. The tool to confirm a name resolves to the right address.',
    synonyms: ['dig command', 'host command', 'DNS lookup'],
  },
  {
    term: 'curl',
    definition:
      'Makes HTTP (and other protocol) requests from the command line. curl -v shows the full handshake and headers, curl -I just the response headers and status. The single most useful tool for debugging an HTTP endpoint.',
    synonyms: ['curl command'],
  },
  {
    term: 'wget',
    definition:
      'Downloads files over HTTP(S) and FTP from the command line, and can mirror sites. Where curl is built for inspecting requests, wget is built for retrieving files (wget -c resumes a partial download).',
    synonyms: ['wget command'],
  },
  {
    term: 'SSH',
    definition:
      'Secure shell: an encrypted remote login and command channel. ssh user@host opens a shell on a remote machine; the same protocol carries scp and rsync. How you reach every server you do not sit in front of.',
    synonyms: ['secure shell', 'ssh'],
  },
  {
    term: 'SSH key',
    definition:
      'A key pair for password-free SSH login: a private key you keep secret and a public key you place in the server ~/.ssh/authorized_keys. ssh-keygen makes the pair; far harder to brute-force than a password. Keep the private key chmod 600.',
    synonyms: ['ssh-keygen', 'key pair', 'authorized_keys'],
  },
  {
    term: 'scp',
    definition:
      'Secure copy: copies a file to or from a remote host over SSH (scp file user@host:/path). Simple for one-off transfers; for repeated or large syncs, rsync is faster because it sends only what changed.',
    synonyms: ['secure copy'],
  },
  {
    term: 'rsync',
    definition:
      'Synchronizes files and directories, locally or over SSH, transferring only changed parts and preserving permissions and timestamps. rsync -a --delete makes a destination match a source. Far faster than scp for repeated transfers.',
    synonyms: ['rsync -a', 'remote sync'],
  },
  {
    term: 'tar',
    definition:
      'Bundles many files into one archive (tape archive). tar -cf creates, -xf extracts, -tf lists; add z for gzip compression (tar -czf archive.tar.gz folder). Does not compress by itself; the z flag adds it.',
    synonyms: ['tarball', 'tar -czf'],
  },
  {
    term: 'gzip',
    definition:
      'Compresses a single file in place to file.gz (gunzip reverses it). Often paired with tar via the z flag for compressed tarballs. Compression shrinks bytes; archiving (tar) bundles files; the two are separate jobs.',
    synonyms: ['gunzip', 'gz'],
  },
  {
    term: 'package manager',
    definition:
      'A tool that installs software plus its dependencies from a trusted repository, verifies signatures, and tracks what is installed for clean updates and removal. apt (Debian/Ubuntu) and dnf (RHEL/Fedora) are the common ones.',
    synonyms: ['apt', 'dnf', 'yum'],
  },
  {
    term: 'make',
    definition:
      'Builds software from a Makefile of rules. In the from-source three-step (./configure, make, make install), make compiles the code and make install copies the result into system paths. configure prepares the build for your system.',
    synonyms: ['make install', 'configure make'],
  },
  {
    term: 'which',
    definition:
      'Prints the full path of a program the shell would run for a given name (which node -> /usr/bin/node). Reveals which copy wins when a tool is installed more than once; whereis also finds related files.',
    synonyms: ['which command', 'whereis'],
  },
  {
    term: 'environment variable',
    definition:
      'A named value programs read for configuration (database URLs, API keys, ports). echo $NAME reads one, export NAME=value sets it for child processes. The standard way twelve-factor apps stay the same across dev, staging, and prod.',
    synonyms: ['env var', 'export', 'env'],
  },
  {
    term: 'PATH',
    definition:
      'The environment variable listing the colon-separated directories the shell searches, left to right, to turn a command name into a program. "command not found" means it is in none of them; two copies means the earlier one wins.',
    synonyms: ['$PATH', 'search path'],
  },
  {
    term: 'shell script',
    definition:
      'A file of shell commands run top to bottom, turning a sequence into a reusable program. A shebang (#!/usr/bin/env bash) picks the interpreter, $1/$@ read arguments, and set -euo pipefail makes it stop on the first failure.',
    synonyms: ['bash script', 'shebang'],
  },
  {
    term: 'exit code',
    definition:
      'The number a command returns when it finishes: 0 means success, non-zero means failure. $? holds the last one. Scripts and CI branch on it (cmd1 && cmd2, if cmd; then ...), which is how success and failure drive control flow.',
    synonyms: ['exit status', 'return code', '$?'],
  },
  {
    term: 'cron',
    definition:
      'A scheduler that runs commands automatically on a five-field schedule (minute, hour, day-of-month, month, day-of-week). crontab -e edits jobs. It runs them in a minimal environment, so use absolute paths and redirect output to a log.',
    synonyms: ['crontab', 'cron job'],
  },
  {
    term: 'systemd',
    definition:
      'The init system on most modern Linux distros: it starts services at boot, supervises and restarts them, and collects their logs. systemctl controls services (start/stop/enable); journalctl reads their logs.',
    synonyms: ['systemctl', 'service manager'],
  },
  {
    term: 'journalctl',
    definition:
      'Reads the systemd journal (each service captured stdout/stderr). journalctl -u nginx shows one service logs, -f follows live, -e jumps to the end, --since filters by time, -p err by priority. First stop when a service will not start.',
    synonyms: ['journal logs', 'systemd logs'],
  },
  {
    term: 'sed',
    definition:
      'A stream editor that transforms text line by line. sed \'s/old/new/g\' substitutes text in a stream or file; sed -i edits the file in place. Common in pipelines and scripts for find-and-replace on the fly.',
    synonyms: ['stream editor'],
  },
  {
    term: 'awk',
    definition:
      'A field-aware text processor. awk \'{print $2}\' prints the second whitespace-separated field; it can also filter (awk \'$3 > 100\') and compute (awk \'{s+=$1} END{print s}\'). The power tool for columnar text.',
    synonyms: ['awk command'],
  },
  {
    term: 'sort',
    definition:
      'Orders lines of text. sort -n sorts numerically (so 9 before 10), -r reverses, -k sorts by a field, -h handles human sizes (2G > 900M). Almost always precedes uniq, which only collapses adjacent duplicates.',
    synonyms: ['sort command'],
  },
  {
    term: 'uniq',
    definition:
      'Collapses adjacent duplicate lines; uniq -c prefixes each with a count. Because it only sees neighbors, you sort first. sort | uniq -c | sort -rn is the count-and-rank idiom for finding the most common values.',
    synonyms: ['uniq -c'],
  },
  {
    term: 'cut',
    definition:
      'Extracts columns from each line: cut -d"," -f1 takes the first comma-separated field. Defaults to tab-delimited, so set -d for other separators. A quick way to slice structured text; awk handles messier whitespace.',
    synonyms: ['cut command'],
  },
  {
    term: 'wc',
    definition:
      'Counts lines, words, and bytes. wc -l counts lines (the most common use), -w words, -c bytes. Frequently the last stage of a pipeline: ... | grep ERROR | wc -l counts matches.',
    synonyms: ['word count', 'wc -l'],
  },
  {
    term: 'alias',
    definition:
      'A short name for a longer command (alias ll=\'ls -la\'). Defined in a shell it lasts only that session; put it in ~/.bashrc to keep it. For anything that needs arguments mid-command, use a shell function instead.',
    synonyms: ['shell alias'],
  },
  {
    term: 'man',
    definition:
      'Opens the manual page for a command (man ls), shown in the less pager (/search, q to quit). --help prints a shorter inline summary; apropos searches man pages by keyword when you do not know the command name.',
    synonyms: ['man page', 'manual', '--help'],
  },
  {
    term: 'AWS region',
    definition:
      'A geographic location (us-east-1, eu-west-1) with its own isolated copy of AWS services. You choose a region for latency to users, data-residency rules, and cost. Regions are isolated from each other, so multi-region is a deliberate, costlier choice.',
    synonyms: ['region'],
  },
  {
    term: 'availability zone',
    definition:
      'One or more physically separate data centers within an AWS region, linked by fast low-latency networking. Spreading resources across AZs survives a single data-center failure; it is the cheapest reliability win on AWS.',
    synonyms: ['AZ'],
  },
  {
    term: 'shared responsibility model',
    definition:
      'The split where AWS secures the cloud (hardware, data centers, managed-service internals) and you secure what is in the cloud (IAM, security groups, your data, patching what you run). Most breaches are on the customer side: public buckets, broad IAM, leaked keys.',
    synonyms: ['shared responsibility'],
  },
  {
    term: 'IAM role',
    definition:
      'An IAM identity that anything (an EC2 instance, a Lambda, another account) can temporarily assume to get short-lived credentials from STS, scoped by the role policies. Roles replace long-lived access keys for workloads, so there is nothing static to leak.',
    synonyms: ['assume role', 'instance role'],
  },
  {
    term: 'IAM policy',
    definition:
      'A JSON document listing allowed (or denied) actions on resources (effect + action + resource), attached to a user, group, or role. The default is implicit deny; you only get what a policy explicitly allows, and an explicit Deny always wins.',
    synonyms: ['policy document'],
  },
  {
    term: 'AWS STS',
    definition:
      'Security Token Service: issues short-lived, auto-expiring credentials when an identity assumes a role. The mechanism behind role assumption, cross-account access, and federation; even a leaked STS credential dies quickly.',
    synonyms: ['STS', 'temporary credentials'],
  },
  {
    term: 'service role',
    definition:
      'A role an AWS service assumes to act on your behalf (a Lambda execution role, an ECS task role), scoped to exactly what that workload needs. The standard way services get permissions without embedded keys.',
    synonyms: ['execution role', 'task role'],
  },
  {
    term: 'least privilege',
    definition:
      'Granting the minimum permissions needed and no more, scoped to specific actions and resource ARNs. Start from deny-all and add specific allows; never start from admin and trim. The single most effective control for limiting breach blast radius.',
    synonyms: ['least-privilege', 'principle of least privilege'],
  },
  {
    term: 'subnet',
    definition:
      'A slice of a VPC IP range pinned to one availability zone. A subnet is "public" if its route table sends internet-bound traffic to an internet gateway, "private" if it does not. Load balancers go in public subnets; app servers and databases go in private ones.',
    synonyms: ['VPC subnet'],
  },
  {
    term: 'route table',
    definition:
      'The set of rules that decide where network traffic from a subnet goes. A route sending 0.0.0.0/0 to an internet gateway makes a subnet public; sending it to a NAT gateway gives outbound-only access. What makes a subnet public or private.',
    synonyms: ['routes'],
  },
  {
    term: 'internet gateway',
    definition:
      'A VPC component that allows two-way traffic between a public subnet and the internet. A subnet is public only because its route table points internet-bound traffic at an internet gateway (IGW).',
    synonyms: ['IGW'],
  },
  {
    term: 'NAT gateway',
    definition:
      'A managed component (in a public subnet) that lets private-subnet resources make outbound internet connections (to download packages, call APIs) while staying unreachable from inbound. Bills per hour and per GB processed, a frequent hidden cost.',
    synonyms: ['NAT', 'network address translation gateway'],
  },
  {
    term: 'security group',
    definition:
      'A stateful, allow-only firewall attached to a resource (instance, RDS). You allow inbound/outbound by port and source; return traffic is automatically permitted. Reference other security groups as the source (not IPs) so rules survive scaling.',
    synonyms: ['SG'],
  },
  {
    term: 'network ACL',
    definition:
      'A stateless, ordered firewall at the subnet boundary that supports explicit allow and deny and evaluates each direction independently (you must allow return/ephemeral ports). A coarse subnet-level backstop; security groups are the everyday tool.',
    synonyms: ['NACL'],
  },
  {
    term: 'VPC endpoint',
    definition:
      'A private connection from your VPC to an AWS service (S3, DynamoDB, and others) that keeps traffic on the AWS network instead of the internet. Gateway endpoints (S3/DynamoDB) are free and cut NAT cost and data exposure; interface endpoints cover most other services.',
    synonyms: ['gateway endpoint', 'interface endpoint', 'PrivateLink'],
  },
  {
    term: 'AMI',
    definition:
      'Amazon Machine Image: the disk image an EC2 instance boots from (OS, runtime, pre-installed software). Baking a custom AMI makes instances start fast and identically; an Auto Scaling Group launches new instances from it.',
    synonyms: ['Amazon Machine Image', 'machine image'],
  },
  {
    term: 'EC2 user data',
    definition:
      'A startup script that runs the first time an EC2 instance boots, used to configure a fresh instance (install packages, fetch config, start the app). Combined with an AMI and an Auto Scaling Group, it makes instances self-configure on launch.',
    synonyms: ['user data', 'cloud-init'],
  },
  {
    term: 'Amazon EFS',
    definition:
      'Elastic File System: a shared NFS file system many EC2 instances can mount at once, scaling automatically. For shared files across a fleet or lift-and-shift apps expecting a POSIX file system; costs more per GB than S3 or EBS.',
    synonyms: ['EFS', 'Elastic File System'],
  },
  {
    term: 'Application Load Balancer',
    definition:
      'A layer-7 (HTTP) load balancer that routes requests across targets (EC2, ECS tasks, Lambda) by path or host rules, with health checks that drain unhealthy targets. The workhorse front for containerized and EC2 services.',
    synonyms: ['ALB'],
  },
  {
    term: 'Amazon EventBridge',
    definition:
      'A managed event bus where producers emit events and rules route them to targets by content, with schemas and SaaS sources. For event-driven architectures that need routing and decoupling by event type, beyond a simple queue.',
    synonyms: ['EventBridge', 'event bus'],
  },
  {
    term: 'Amazon Kinesis',
    definition:
      'A managed service for ingesting and processing high-volume, ordered, replayable streams (clickstreams, metrics, logs) where multiple consumers read at their own offset. For real-time analytics firehoses, not simple task queues (use SQS for those).',
    synonyms: ['Kinesis', 'data stream'],
  },
  {
    term: 'AWS X-Ray',
    definition:
      'A distributed tracing service that follows a single request across services and shows a timeline of where the latency or error went. Essential once a request fans out across Lambda, queues, and databases.',
    synonyms: ['X-Ray', 'distributed tracing'],
  },
  {
    term: 'AWS Systems Manager Parameter Store',
    definition:
      'A store for configuration and secrets (SecureString values are encrypted with KMS), free for standard parameters. A cheap fit for non-rotating config and secrets; Secrets Manager is preferred when you need automatic rotation.',
    synonyms: ['Parameter Store', 'SSM Parameter Store'],
  },
  {
    term: 'AWS WAF',
    definition:
      'A web application firewall you attach to CloudFront, an ALB, or API Gateway, with rules against SQL injection, XSS, bad bots, and rate-based abuse. Filters malicious requests at the edge before they reach your application.',
    synonyms: ['WAF', 'web application firewall'],
  },
  {
    term: 'AWS Shield',
    definition:
      'DDoS protection for AWS endpoints. Shield Standard is automatic and free; Shield Advanced adds higher-tier protection, cost protection, and a response team. Works with WAF and CloudFront to keep volumetric attacks off your origin.',
    synonyms: ['Shield', 'DDoS protection'],
  },
  {
    term: 'AWS CDK',
    definition:
      'Cloud Development Kit: define infrastructure in a real programming language (TypeScript, Python) with loops, types, and reusable constructs; it synthesizes CloudFormation under the hood. For teams that want abstraction over raw templates.',
    synonyms: ['CDK', 'Cloud Development Kit'],
  },
  {
    term: 'AWS CodePipeline',
    definition:
      'Orchestrates a deployment pipeline (build with CodeBuild, deploy with CodeDeploy) that runs on every commit, with stages, tests as gates, manual approvals, and rollout strategies. Ships application changes through one automated, reviewable path.',
    synonyms: ['CodePipeline', 'CodeBuild', 'CodeDeploy'],
  },
]

export type GlossaryMatch = {
  label: string
  entry: GlossaryTerm
}

export function glossaryId(term: string) {
  return `glossary-${term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

export const glossaryMatchers = glossaryTerms
  .flatMap((entry) => [entry.term, ...(entry.synonyms ?? [])].map((label) => ({ label, entry })))
  .sort((a, b) => b.label.length - a.label.length)
