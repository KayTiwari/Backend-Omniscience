import {
  Braces,
  Cloud,
  Database,
  Gauge,
  GitBranch,
  KeyRound,
  Network,
  ServerCog,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { deepDiveProblems } from './course.deepdive'
import { extraProblems, extraSubjects } from './course.extra'
import { graderDrillProblems } from './course.graderDrills'
import { roadmapGapProblems } from './course.roadmapGaps'

export type ProblemType = 'lesson' | 'coding' | 'quiz' | 'debug' | 'design'

export type Problem = {
  id: string
  title: string
  type: ProblemType
  difficulty: ProblemDifficulty
  minutes: number
  prompt: string
  explanation?: string
  example?: string
  questions?: string[]
  checklist: string[]
  answer?: string
  choices?: string[]
  correctChoice?: number
}

export type ProblemDifficulty = 'Warmup' | 'Core' | 'Hard' | 'Boss'

export type Subject = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  color: string
  problems: Problem[]
}

const coreSubjects: Subject[] = [
  {
    id: 'internet',
    title: 'Internet & HTTP',
    subtitle: 'DNS, TCP, HTTP, requests, status codes, and the web stack.',
    icon: Network,
    color: '#e84a5f',
    problems: [
      {
        id: 'internet-request-life',
        title: 'Trace A Request',
        type: 'lesson',
        difficulty: 'Warmup',
        minutes: 18,
        prompt:
          'Explain every major hop between typing https://api.example.com/users/42 and receiving JSON. Include DNS, TCP, TLS, HTTP, the reverse proxy, the app server, and the database.',
        example:
          'Browser cache miss -> recursive DNS lookup -> TCP handshake -> TLS handshake -> HTTP request -> load balancer -> app route -> database query -> JSON response.',
        checklist: [
          'Mention what DNS resolves and what it does not resolve.',
          'Separate TCP connection setup from TLS negotiation.',
          'Explain where HTTP headers and body enter the picture.',
          'Name at least two backend failure points in the chain.',
        ],
      },
      {
        id: 'internet-status-codes',
        title: 'Status Code Court',
        type: 'quiz',
        difficulty: 'Core',
        minutes: 12,
        prompt:
          'A user is authenticated but is not allowed to access an admin endpoint. Which status code should the API usually return?',
        choices: ['401 Unauthorized', '403 Forbidden', '404 Not Found', '409 Conflict'],
        correctChoice: 1,
        answer:
          'Use 403 when the user is known but lacks permission. Use 401 when authentication is missing or invalid.',
        checklist: [
          'Distinguish authentication from authorization.',
          'Explain when hiding existence with 404 might be acceptable.',
        ],
      },
      {
        id: 'internet-query-parser',
        title: 'Parse A Query String',
        type: 'coding',
        difficulty: 'Core',
        minutes: 25,
        prompt:
          'Implement a small query string parser. It should turn a=1&b=2 into an object, percent-decode keys and values, and return an empty object for an empty query string.',
        example: "parseQuery('q=hello%20world') should return { q: 'hello world' }.",
        checklist: [
          'Split key/value pairs on ampersands.',
          'Decode percent-encoded keys and values.',
          'Handle empty input without throwing.',
          'Keep the parser deterministic and side-effect free.',
        ],
      },
      {
        id: 'internet-raw-server',
        title: 'Tiny HTTP Server',
        type: 'coding',
        difficulty: 'Hard',
        minutes: 45,
        prompt:
          'Write a tiny TCP server without a web framework. It should parse the first request line and return valid HTTP for GET /health and GET /time. Any other route returns 404.',
        example:
          'GET /health HTTP/1.1 should return status 200, Content-Type: application/json, and {"ok":true}.',
        checklist: [
          'Return valid CRLF-separated HTTP response headers.',
          'Include Content-Length.',
          'Handle unknown routes with 404.',
          'Keep framework helpers out of the solution.',
        ],
      },
    ],
  },
  {
    id: 'language',
    title: 'Backend Language Core',
    subtitle: 'Error handling, files, tests, concurrency, and process boundaries.',
    icon: Braces,
    color: '#2f80ed',
    problems: [
      {
        id: 'language-cli-log-parser',
        title: 'Log Parser CLI',
        type: 'coding',
        difficulty: 'Core',
        minutes: 50,
        prompt:
          'Build a CLI that reads an access log file and prints total requests, top 5 paths, 5xx count, and p95 latency. Treat malformed lines as recoverable errors.',
        example:
          '2026-06-05T10:15:01Z GET /api/users 200 34ms',
        checklist: [
          'Accept the log file path as an argument.',
          'Do not crash on malformed lines.',
          'Compute p95 from parsed latencies.',
          'Add tests for parsing and aggregation.',
        ],
      },
      {
        id: 'language-retry',
        title: 'Retry With Backoff',
        type: 'coding',
        difficulty: 'Hard',
        minutes: 40,
        prompt:
          'Implement a retry helper for flaky operations. It should support max attempts, exponential backoff, jitter, and a way to skip retries for permanent errors.',
        checklist: [
          'Retries only transient failures.',
          'Adds jitter so callers do not synchronize.',
          'Stops after max attempts.',
          'Has deterministic tests by injecting time/randomness.',
        ],
      },
      {
        id: 'language-error-taxonomy',
        title: 'Error Taxonomy',
        type: 'design',
        difficulty: 'Core',
        minutes: 20,
        prompt:
          'Design an error strategy for a backend API. Separate validation errors, auth errors, dependency failures, conflicts, and programmer bugs. Decide what gets logged and what gets shown to clients.',
        checklist: [
          'Map each category to an HTTP status.',
          'Avoid leaking internals to clients.',
          'Preserve enough context for debugging.',
        ],
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL & PostgreSQL',
    subtitle: 'Schemas, indexes, joins, transactions, isolation, and query plans.',
    icon: Database,
    color: '#00a878',
    problems: [
      {
        id: 'sql-ledger-schema',
        title: 'Payment Ledger Schema',
        type: 'design',
        difficulty: 'Hard',
        minutes: 45,
        prompt:
          'Design a PostgreSQL schema for a payment ledger. It must support users, accounts, immutable ledger entries, idempotency keys, and balance queries.',
        checklist: [
          'Use append-only ledger entries.',
          'Represent debits and credits safely.',
          'Add uniqueness for idempotency keys.',
          'Explain how balances are computed or cached.',
        ],
      },
      {
        id: 'sql-index-detective',
        title: 'Index Detective',
        type: 'debug',
        difficulty: 'Core',
        minutes: 30,
        prompt:
          'A query filters by account_id and created_at, orders by created_at desc, and limits 50 rows. The table has 80 million rows. Propose an index and explain why it helps.',
        example:
          'SELECT * FROM ledger_entries WHERE account_id = $1 AND created_at >= $2 ORDER BY created_at DESC LIMIT 50;',
        answer:
          'A composite index like (account_id, created_at DESC) lets Postgres seek to one account and read recent rows in order, avoiding a large scan and sort.',
        checklist: [
          'Use a composite index in the same shape as the filter/order.',
          'Explain why separate indexes may not be enough.',
          'Mention checking EXPLAIN ANALYZE.',
        ],
      },
      {
        id: 'sql-transaction-race',
        title: 'Oversold Inventory',
        type: 'debug',
        difficulty: 'Boss',
        minutes: 55,
        prompt:
          'Two checkout requests decrement the same inventory row at the same time and inventory goes negative. Diagnose the race and propose a transaction-safe fix.',
        checklist: [
          'Identify read-modify-write as the race.',
          'Use an atomic conditional update or row lock.',
          'Handle the no-rows-updated case.',
          'Explain isolation level tradeoffs.',
        ],
      },
    ],
  },
  {
    id: 'api',
    title: 'API Design',
    subtitle: 'REST, contracts, validation, pagination, versioning, and clients.',
    icon: GitBranch,
    color: '#f59f00',
    problems: [
      {
        id: 'api-pagination',
        title: 'Cursor Pagination',
        type: 'coding',
        difficulty: 'Hard',
        minutes: 60,
        prompt:
          'Design and implement cursor pagination for GET /events. Sort by created_at desc and id desc. The cursor must be opaque to clients.',
        checklist: [
          'Use a stable tie-breaker column.',
          'Encode cursor data opaquely.',
          'Return nextCursor only when more data exists.',
          'Explain why offset pagination can break at scale.',
        ],
      },
      {
        id: 'api-contract-review',
        title: 'Contract Review',
        type: 'debug',
        difficulty: 'Core',
        minutes: 25,
        prompt:
          'Review this route: POST /createUser accepts any JSON and returns 200 for success or failure with { success: boolean }. Rewrite the contract.',
        checklist: [
          'Use resource-oriented naming.',
          'Validate request shape.',
          'Use meaningful status codes.',
          'Return error details clients can act on.',
        ],
      },
      {
        id: 'api-idempotency',
        title: 'Idempotent Create',
        type: 'design',
        difficulty: 'Boss',
        minutes: 45,
        prompt:
          'Design idempotency for POST /charges so client retries cannot double-charge a customer.',
        checklist: [
          'Require an idempotency key.',
          'Store request hash and final response.',
          'Handle in-flight duplicate requests.',
          'Define key expiration behavior.',
        ],
      },
    ],
  },
  {
    id: 'security',
    title: 'Auth & Security',
    subtitle: 'Sessions, JWTs, OAuth, hashing, CORS, CSRF, rate limits, secrets.',
    icon: ShieldCheck,
    color: '#7c3aed',
    problems: [
      {
        id: 'security-passwords',
        title: 'Password Storage',
        type: 'quiz',
        difficulty: 'Warmup',
        minutes: 10,
        prompt: 'Which approach is appropriate for storing user passwords?',
        choices: [
          'Encrypt passwords with AES and keep the key in env vars.',
          'Hash passwords with a slow password hashing algorithm and per-password salt.',
          'Hash passwords with SHA-256.',
          'Store only the first 8 characters of the password.',
        ],
        correctChoice: 1,
        answer:
          'Use a password hashing algorithm such as Argon2id, bcrypt, or scrypt with salts and sensible cost parameters.',
        checklist: [
          'Know the difference between encryption and hashing.',
          'Avoid fast general-purpose hashes for passwords.',
        ],
      },
      {
        id: 'security-csrf',
        title: 'CSRF Threat Model',
        type: 'design',
        difficulty: 'Hard',
        minutes: 35,
        prompt:
          'Your app uses cookie-based sessions. Explain when CSRF matters and design defenses for unsafe methods.',
        checklist: [
          'Explain why cookies are sent automatically.',
          'Use SameSite where appropriate.',
          'Use CSRF tokens for unsafe state-changing requests.',
          'Separate CSRF from CORS.',
        ],
      },
      {
        id: 'security-rate-limit',
        title: 'Login Rate Limiter',
        type: 'coding',
        difficulty: 'Boss',
        minutes: 70,
        prompt:
          'Implement a rate limiter for login attempts. It should limit by IP and account identifier, support Redis, and avoid allowing attackers to enumerate valid emails.',
        checklist: [
          'Track by both IP and account identifier.',
          'Use generic login errors.',
          'Include expiration windows.',
          'Describe behavior if Redis is down.',
        ],
      },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    subtitle: 'Boundaries, queues, events, retries, idempotency, and monoliths.',
    icon: Workflow,
    color: '#10a6a6',
    problems: [
      {
        id: 'architecture-background-jobs',
        title: 'Background Job System',
        type: 'design',
        difficulty: 'Hard',
        minutes: 50,
        prompt:
          'Design a background job system for sending emails and processing uploads. Include retries, dead letters, observability, and idempotent handlers.',
        checklist: [
          'Define producer and worker responsibilities.',
          'Use retry limits and backoff.',
          'Add dead-letter handling.',
          'Make job handlers idempotent.',
        ],
      },
      {
        id: 'architecture-refactor',
        title: 'Controller Diet',
        type: 'coding',
        difficulty: 'Core',
        minutes: 45,
        prompt:
          'Take a controller that validates input, checks permissions, queries the DB, sends an email, and formats a response. Refactor it into clearer boundaries.',
        checklist: [
          'Keep HTTP-specific work in the controller.',
          'Move business rules into a service/use case.',
          'Keep persistence behind a repository or query module.',
          'Make side effects explicit.',
        ],
      },
      {
        id: 'architecture-outbox',
        title: 'Transactional Outbox',
        type: 'lesson',
        difficulty: 'Boss',
        minutes: 35,
        prompt:
          'Explain the transactional outbox pattern and why it helps when a service must update a database and publish an event reliably.',
        checklist: [
          'Name the dual-write problem.',
          'Write event rows in the same DB transaction.',
          'Use a relay/worker to publish events.',
          'Handle duplicate publishing safely.',
        ],
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps For Backend',
    subtitle: 'Linux, Docker, CI, deployment, logs, metrics, and cloud basics.',
    icon: Cloud,
    color: '#52616b',
    problems: [
      {
        id: 'devops-dockerfile',
        title: 'Production Dockerfile',
        type: 'coding',
        difficulty: 'Core',
        minutes: 40,
        prompt:
          'Write a production Dockerfile for a backend service. Use a multi-stage build, non-root user, healthcheck, and minimal runtime image.',
        checklist: [
          'Separate build and runtime stages.',
          'Avoid running as root.',
          'Set only necessary environment defaults.',
          'Keep image size reasonable.',
        ],
      },
      {
        id: 'devops-deploy-debug',
        title: 'Deploy Failed At 2 AM',
        type: 'debug',
        difficulty: 'Hard',
        minutes: 35,
        prompt:
          'A deployment passes CI but crashes after rollout. Logs say connection refused to the database. List your triage path from fastest checks to deeper causes.',
        checklist: [
          'Check config and secret names first.',
          'Verify network/security group access.',
          'Check migrations and DB availability.',
          'Define rollback criteria.',
        ],
      },
      {
        id: 'devops-observability',
        title: 'Observability Baseline',
        type: 'design',
        difficulty: 'Core',
        minutes: 30,
        prompt:
          'Define baseline logs, metrics, and traces for a new API. Include request IDs and the dashboards you want before launch.',
        checklist: [
          'Use structured logs.',
          'Track latency, error rate, traffic, and saturation.',
          'Propagate request IDs.',
          'Add service-level alerts.',
        ],
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Scale',
    subtitle: 'Caching, profiling, load testing, N+1 queries, pools, and queues.',
    icon: Gauge,
    color: '#d9480f',
    problems: [
      {
        id: 'performance-n-plus-one',
        title: 'N+1 Query Hunt',
        type: 'debug',
        difficulty: 'Core',
        minutes: 35,
        prompt:
          'An endpoint that returns 50 projects makes 151 database queries. Identify the likely N+1 pattern and propose fixes.',
        checklist: [
          'Spot nested per-row queries.',
          'Use joins, batching, or preloading.',
          'Add query count tests or instrumentation.',
          'Measure before and after.',
        ],
      },
      {
        id: 'performance-cache',
        title: 'Cache Aside Strategy',
        type: 'design',
        difficulty: 'Hard',
        minutes: 45,
        prompt:
          'Design caching for product detail pages. Include key shape, TTL, invalidation, stampede prevention, and stale data tradeoffs.',
        checklist: [
          'Define cache keys and TTL.',
          'Explain invalidation on writes.',
          'Prevent cache stampedes.',
          'Describe stale-while-revalidate tradeoffs.',
        ],
      },
      {
        id: 'performance-load-test',
        title: 'Load Test Readout',
        type: 'debug',
        difficulty: 'Boss',
        minutes: 50,
        prompt:
          'A load test shows p50 80ms, p95 900ms, p99 4s, CPU 45%, DB connections maxed, and error rate 2%. Explain what you investigate next.',
        checklist: [
          'Do not stop at average latency.',
          'Connect tail latency to resource saturation.',
          'Investigate pool sizing and slow queries.',
          'Suggest one experiment at a time.',
        ],
      },
    ],
  },
  {
    id: 'system-design',
    title: 'System Design',
    subtitle: 'End-to-end backend systems with production constraints.',
    icon: ServerCog,
    color: '#364fc7',
    problems: [
      {
        id: 'design-url-shortener',
        title: 'URL Shortener',
        type: 'design',
        difficulty: 'Core',
        minutes: 45,
        prompt:
          'Design a URL shortener. Cover APIs, storage, slug generation, redirects, analytics, abuse controls, and high-read scaling.',
        checklist: [
          'Define core endpoints.',
          'Choose slug generation strategy.',
          'Separate redirect path from analytics writes.',
          'Discuss cache and abuse prevention.',
        ],
      },
      {
        id: 'design-notifications',
        title: 'Notification Pipeline',
        type: 'design',
        difficulty: 'Hard',
        minutes: 60,
        prompt:
          'Design a notification service for email, SMS, and push. Include preferences, templates, providers, retries, rate limits, and delivery status.',
        checklist: [
          'Separate channel-agnostic and channel-specific concerns.',
          'Use queues and idempotent sends.',
          'Track provider responses.',
          'Respect user preferences and quiet hours.',
        ],
      },
      {
        id: 'design-chat',
        title: 'Realtime Chat',
        type: 'design',
        difficulty: 'Boss',
        minutes: 75,
        prompt:
          'Design realtime chat for teams. Cover message storage, WebSockets, fanout, presence, ordering, offline delivery, and moderation.',
        checklist: [
          'Define connection and message flows.',
          'Handle ordering and duplicate delivery.',
          'Plan horizontal WebSocket scaling.',
          'Include moderation and retention concerns.',
        ],
      },
    ],
  },
  {
    id: 'capstone',
    title: 'Capstone Gauntlet',
    subtitle: 'Build complete systems that combine multiple backend muscles.',
    icon: KeyRound,
    color: '#0b7285',
    problems: [
      {
        id: 'capstone-auth-service',
        title: 'Auth Service',
        type: 'coding',
        difficulty: 'Boss',
        minutes: 180,
        prompt:
          'Build an auth service with registration, login, logout, session refresh, password reset, email verification, rate limits, and audit logs.',
        checklist: [
          'Store passwords safely.',
          'Use secure session or token flows.',
          'Add rate limits and generic errors.',
          'Write integration tests for auth flows.',
        ],
      },
      {
        id: 'capstone-job-queue',
        title: 'Job Queue',
        type: 'coding',
        difficulty: 'Boss',
        minutes: 210,
        prompt:
          'Build a small durable job queue with enqueue, lease, acknowledge, retry, dead-letter, and worker heartbeat behavior.',
        checklist: [
          'Prevent two workers from processing the same job.',
          'Retry failed jobs with backoff.',
          'Recover abandoned leases.',
          'Expose metrics for queue depth and failures.',
        ],
      },
      {
        id: 'capstone-ledger-api',
        title: 'Ledger API',
        type: 'coding',
        difficulty: 'Boss',
        minutes: 240,
        prompt:
          'Build a ledger API with accounts, transfers, idempotency keys, immutable entries, balance reads, and transaction-safe writes.',
        checklist: [
          'Use database transactions.',
          'Keep ledger entries immutable.',
          'Prevent double processing with idempotency keys.',
          'Test concurrent transfer attempts.',
        ],
      },
    ],
  },
]

export const subjects: Subject[] = [
  ...coreSubjects.map((subject) => ({
    ...subject,
    problems: [
      ...subject.problems,
      ...(deepDiveProblems[subject.id] ?? []),
      ...(roadmapGapProblems[subject.id] ?? []),
      ...(graderDrillProblems[subject.id] ?? []),
      ...(extraProblems[subject.id] ?? []),
    ],
  })),
  ...extraSubjects,
]

export const allProblems = subjects.flatMap((subject) =>
  subject.problems.map((problem) => ({ ...problem, subjectId: subject.id })),
)
