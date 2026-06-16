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
    synonyms: ['database index'],
  },
  {
    term: 'transaction',
    definition: 'An all-or-nothing group of database operations that commit together or roll back together.',
    synonyms: ['DB transaction'],
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
    synonyms: ['message queue', 'job queue'],
  },
  {
    term: 'worker',
    definition: 'A process that consumes background jobs from a queue and performs work outside the request path.',
    synonyms: ['background worker'],
  },
  {
    term: 'dead-letter queue',
    definition: 'A place for jobs that failed too many times so they can be inspected instead of retried forever.',
    synonyms: ['DLQ'],
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
