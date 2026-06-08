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
]

export type GlossaryMatch = {
  label: string
  entry: GlossaryTerm
}

export const glossaryMatchers = glossaryTerms
  .flatMap((entry) => [entry.term, ...(entry.synonyms ?? [])].map((label) => ({ label, entry })))
  .sort((a, b) => b.label.length - a.label.length)
