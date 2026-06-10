import {
  type LucideIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import {
  HttpIcon,
  TerminalIcon,
  PostgreSQLIcon,
  ApiIcon,
  PadlockIcon,
  ArchitectureIcon,
  DevOpsIcon,
  LightningIcon,
  ServerClusterIcon,
  TrophyIcon,
} from './TechIcons'
import { capstoneProblems } from './course.capstones'
import { deepDiveProblems } from './course.deepdive'
import { extraProblems, extraSubjects } from './course.extra'
import { frameworkCapstoneProjectProblems } from './course.frameworkCapstoneProjects'
import { frameworkMasteryProblems } from './course.frameworkMastery'
import { frameworkRapidReviewProblems } from './course.frameworkRapidReview'
import { frameworkReviewProblems } from './course.frameworkReview'
import { frameworkTutorialProblems } from './course.frameworkTutorials'
import { graderDrillProblems } from './course.graderDrills'
import { moreTutorialProblems } from './course.moreTutorials'
import { nodeFundamentalProblems } from './course.nodeFundamentals'
import { oralExamProblems } from './course.oralExams'
import { progressionProblems } from './course.progression'
import { roadmapGapProblems } from './course.roadmapGaps'
import { typescriptFundamentalProblems } from './course.typescriptFundamentals'
import { tutorialProblems } from './course.tutorials'
import { zeroRampProblems } from './course.zeroRamp'
import { csharpSubject } from './course.csharp'
import { foundationProblems } from './course.foundations'
import { tutorials as longTutorials } from './tutorials'

export type ProblemType = 'lesson' | 'coding' | 'quiz' | 'debug' | 'design'

// One multiple-choice "predict the output" check tied to a concrete code snippet.
// Unlike the auto-generated guided questions, the options and the correct index
// are authored, so beginners answer questions about real Python, not study habits.
export type PredictCheck = {
  question: string
  options: string[]
  correct: number
  why: string
}

// Foundational, hands-on lesson content. When a Problem carries this, the app
// shows a runnable worked example, authored predict-the-output checks, and a
// "change one thing" tweak instead of the generic teaching scaffold.
export type InteractiveLesson = {
  intro?: string
  example: { code: string; output: string; explain?: string }
  predicts: PredictCheck[]
  tweak?: { instruction: string; reveal: string }
  // Drill problem ids whose runnable editor + tests are embedded directly in the
  // lesson body. Falls back to writeDrillId when omitted.
  drills?: string[]
  writeDrillId?: string
  // Up to three takeaways shown as a "Lock It In" recap at the end of the
  // lesson. Retention consolidation: the learner re-reads exactly what to keep.
  recap?: string[]
}

export type Problem = {
  id: string
  title: string
  type: ProblemType
  difficulty: ProblemDifficulty
  minutes: number
  prompt: string
  explanation?: string
  production?: string
  walkthrough?: string[]
  example?: string
  questions?: string[]
  checklist: string[]
  answer?: string
  choices?: string[]
  correctChoice?: number
  interactive?: InteractiveLesson
}

export type ProblemDifficulty = 'Warmup' | 'Core' | 'Hard' | 'Boss'

export type Subject = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon | ComponentType<{ size?: number; className?: string }>
  color: string
  problems: Problem[]
}

const longTutorialProblems = longTutorials.reduce<Record<string, Problem[]>>((acc, tutorial) => {
  acc[tutorial.subjectId] ??= []
  acc[tutorial.subjectId].push({
    id: tutorial.id,
    title: `Tutorial: ${tutorial.title}`,
    type: 'lesson',
    difficulty: 'Core',
    minutes: tutorial.minutes,
    prompt: `Study this tutorial, then explain the concept back in your own words and connect it to at least one backend failure mode.`,
    explanation: tutorial.body,
    production:
      'This long-form tutorial is meant to build the mental model before you move into quizzes, debugging prompts, and runnable coding drills. In production, the engineer with the clearest model usually finds the fault fastest.',
    questions: [
      'What is the core concept this tutorial is teaching?',
      'Which production failure mode does this help you diagnose?',
      'Which coding drill or design prompt should you do next to prove the concept?',
    ],
    checklist: [
      'Summarize the tutorial without rereading it.',
      'Name one production implication.',
      'Complete the next related drill or review question.',
    ],
  })
  return acc
}, {})

const coreSubjects: Subject[] = [
  {
    id: 'internet',
    title: 'Internet & HTTP',
    subtitle: 'DNS, TCP, HTTP, requests, status codes, and the web stack.',
    icon: HttpIcon,
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
        explanation:
          'A request is a chain of translations and handoffs. DNS turns the hostname api.example.com into an IP address. TCP opens a reliable byte stream to that IP and port. TLS wraps that stream so the client can verify the server and encrypt the bytes. HTTP is the message format sent over that connection: method, path, headers, and sometimes a body. A load balancer or reverse proxy receives the HTTP request first in many production systems, chooses an app instance, and forwards the request with useful headers like request id or original client IP. The app server routes GET /users/42 to code, checks auth, validates input, queries a database or cache, serializes JSON, and sends an HTTP response back through the same layers.',
        production:
          'When production is slow or broken, you debug this chain one boundary at a time. DNS can point at the wrong place, TCP can fail because a port is closed, TLS can fail because a certificate is expired, proxies can timeout, app code can throw, databases can be slow, and clients can misunderstand status codes or response headers. The senior move is naming the layer before guessing the fix.',
        walkthrough: [
          'Start with the URL: scheme https, hostname api.example.com, path /users/42.',
          'Check DNS: the client needs an IP address for the hostname. DNS does not return the path, method, headers, or JSON.',
          'Open TCP: the client connects to the server IP on port 443. TCP gives reliable ordered bytes, not encryption.',
          'Negotiate TLS: the server presents a certificate, keys are negotiated, and the connection becomes encrypted.',
          'Send HTTP: the client sends a request line, headers such as Host and Authorization, and optionally a body.',
          'Pass through infrastructure: CDN, load balancer, or reverse proxy may terminate TLS, add headers, route, cache, or reject.',
          'Run backend code: the app route validates the request, checks permissions, calls services, and reads or writes storage.',
          'Return response: the backend serializes JSON, sets status and headers, then bytes travel back to the client.',
        ],
        example:
          'Browser cache miss -> recursive DNS lookup -> TCP handshake -> TLS handshake -> HTTP request -> load balancer -> app route -> database query -> JSON response.',
        questions: [
          'Which layer turns a hostname into an IP address?',
          'What does TCP provide that UDP does not?',
          'What does TLS add on top of TCP?',
          'Where do HTTP headers enter the request?',
          'Which layer would you inspect first for an expired certificate error?',
          'Which layer would you inspect first for a slow SQL query?',
        ],
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
    icon: TerminalIcon,
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
    icon: PostgreSQLIcon,
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
    icon: ApiIcon,
    color: '#f59f00',
    problems: [
      {
        id: 'api-json-response',
        title: 'Build A JSON Response',
        type: 'coding',
        difficulty: 'Warmup',
        minutes: 18,
        prompt:
          'Implement buildJsonResponse(data, status). Return an object with status, JSON Content-Type header, and a string body made with JSON.stringify.',
        explanation:
          'Every API endpoint eventually has to turn backend data into an HTTP response. This drill teaches the smallest response shape: status code, headers, and serialized JSON body.',
        questions: [
          'Why does an API response need a Content-Type header?',
          'Why should the response body be a string by the time it leaves the backend?',
        ],
        checklist: [
          'Return the requested status code.',
          'Set Content-Type to application/json.',
          'Serialize the data into the body.',
        ],
      },
      {
        id: 'api-route-match',
        title: 'Match Method And Path',
        type: 'coding',
        difficulty: 'Warmup',
        minutes: 22,
        prompt:
          'Implement matchRoute(method, path). Recognize GET /users, POST /users, and GET /users/:id. Return a route name and params, or null when nothing matches.',
        explanation:
          'Routing is the first backend decision after HTTP parsing. The server uses the method and path to decide which handler should run.',
        questions: [
          'Why are GET /users and POST /users different routes even though the path is the same?',
          'What does a path parameter represent?',
        ],
        checklist: [
          'Use both method and path.',
          'Extract the user id from /users/:id.',
          'Return null for unknown routes.',
        ],
      },
      {
        id: 'api-create-user-validation',
        title: 'Validate Create User Input',
        type: 'coding',
        difficulty: 'Core',
        minutes: 28,
        prompt:
          'Implement validateCreateUser(body). It should require a non-empty email string containing @ and a non-empty name string. Return an array of field error objects.',
        explanation:
          'API code should not trust JSON just because it parsed. Validation turns unknown client input into something the service layer can safely use.',
        questions: [
          'Why should validation happen before calling database code?',
          'Why is an array of field errors more useful than one vague error string?',
        ],
        checklist: [
          'Reject missing or invalid email.',
          'Reject missing or invalid name.',
          'Return stable field-level error objects.',
        ],
      },
      {
        id: 'api-result-to-response',
        title: 'Map Service Results To HTTP',
        type: 'coding',
        difficulty: 'Core',
        minutes: 30,
        prompt:
          'Implement resultToResponse(result). Convert service results like ok, validation_error, not_found, and conflict into status codes and JSON response bodies.',
        explanation:
          'A service can return business outcomes without knowing HTTP. The API layer maps those outcomes into status codes and response shapes clients understand.',
        questions: [
          'Why should a validation failure usually be 400?',
          'Why should a duplicate unique value often become 409 Conflict?',
        ],
        checklist: [
          'Map success to 200.',
          'Map validation errors to 400.',
          'Map missing records to 404.',
          'Map conflicts to 409.',
        ],
      },
      {
        id: 'api-create-user-handler',
        title: 'Tiny Create User Handler',
        type: 'coding',
        difficulty: 'Core',
        minutes: 40,
        prompt:
          'Implement handleCreateUser(req, users). Validate JSON body, reject duplicate emails, create a user with the next id, and return a JSON-style response object.',
        explanation:
          'This is the smallest full API handler loop: read request data, validate it, check existing state, perform the action, and return a clear HTTP result.',
        questions: [
          'What work belongs in the handler versus the service layer?',
          'Why should duplicate email return a different response from invalid JSON?',
        ],
        checklist: [
          'Validate body before writing.',
          'Reject duplicate emails with 409.',
          'Create the user and return 201.',
          'Do not mutate input when validation fails.',
        ],
      },
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
    icon: PadlockIcon,
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
    icon: ArchitectureIcon,
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
    icon: DevOpsIcon,
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
    icon: LightningIcon,
    color: '#d9480f',
    problems: [
      {
        id: 'performance-cache-invalidation-lesson',
        title: 'Cache Invalidation From Zero',
        type: 'lesson',
        difficulty: 'Warmup',
        minutes: 22,
        prompt:
          'Explain cache invalidation to a beginner. Include what a cache stores, why stale data happens, and three ways to keep cached data correct enough.',
        explanation:
          'A cache is a faster copy of data that normally lives somewhere slower, such as a database or an upstream API. Invalidation is the act of removing, replacing, or aging out that copy when the real data changes. The hard part is choosing how fresh the copy must be: a product image can be stale for minutes, but an account balance cannot.',
        production:
          'Bad invalidation causes users to see old prices, wrong permissions, outdated inventory, or privacy leaks. Good invalidation starts from the business rule: how stale can this data be before it becomes incorrect or dangerous?',
        walkthrough: [
          'Name the source of truth, such as PostgreSQL or an upstream service.',
          'Name the cached copy, such as browser cache, CDN, process memory, or Redis.',
          'Choose a freshness rule: explicit delete on write, versioned keys, short TTL, or stale-while-revalidate.',
          'Define the failure mode: serving stale data, stampede on miss, or deleting too much cache.',
        ],
        questions: [
          'When is a short TTL enough?',
          'When should a write explicitly delete or replace a cache key?',
          'Why is cache invalidation a correctness problem, not only a speed problem?',
        ],
        checklist: [
          'Define cache, source of truth, and stale data.',
          'Compare TTL, explicit invalidation, and versioned keys.',
          'Name one production bug caused by stale cache.',
          'Tie the strategy to the data freshness requirement.',
        ],
      },
      {
        id: 'performance-cdn-lesson',
        title: 'CDNs From Zero',
        type: 'lesson',
        difficulty: 'Warmup',
        minutes: 24,
        prompt:
          'Explain what a CDN is and when a backend should use one. Include static assets, API responses, cache keys, and private data risk.',
        explanation:
          'A CDN (Content Delivery Network) is a global network of edge servers that stores and serves content close to users. Instead of every request crossing the internet to your origin server, cacheable responses can be served from a nearby edge location. CDNs are excellent for static assets and carefully cacheable public responses.',
        production:
          'A CDN reduces latency and origin load, but it can also spread mistakes globally. The dangerous bug is caching private user data with public headers or forgetting that Authorization, cookies, query strings, and locale can change the correct response.',
        walkthrough: [
          'Use a CDN for immutable static assets like app.abcd1234.js, images, and public downloads.',
          'Cache public API reads only when the response is safe to share across users.',
          'Define the cache key: host, path, query params, headers, cookies, or auth state.',
          'Plan purge or versioning before deploy so bad content can be removed quickly.',
        ],
        questions: [
          'Why are content-hashed assets good CDN targets?',
          'Why should authenticated user data usually avoid public CDN caching?',
          'What belongs in a CDN cache key?',
        ],
        checklist: [
          'Define CDN as edge caching close to users.',
          'Separate static assets from dynamic API responses.',
          'Mention cache-key correctness and private data risk.',
          'Explain purge, versioning, or short TTL as a rollback path.',
        ],
      },
      {
        id: 'performance-http-cache-headers-lesson',
        title: 'HTTP Cache Headers From Zero',
        type: 'lesson',
        difficulty: 'Core',
        minutes: 28,
        prompt:
          'Teach the HTTP headers that control caching. Explain Cache-Control, max-age, private/public, no-store, ETag, If-None-Match, and 304.',
        explanation:
          'HTTP cache headers are instructions attached to responses. Cache-Control says whether a browser, proxy, or CDN may store the response and for how long. ETag gives the response a version label; later, the client can send If-None-Match with that label, and the server can answer 304 Not Modified instead of resending the body.',
        production:
          'Correct headers make repeated reads fast without changing app code. Wrong headers can leak private pages, pin old JavaScript in browsers, overload origins with unnecessary revalidation, or make clients ignore fresh data.',
        walkthrough: [
          'Use Cache-Control: no-store for secrets, account pages, and responses that must not be saved.',
          'Use private when a browser may cache a response but shared caches must not.',
          'Use public, max-age, and immutable for content-hashed static assets.',
          'Use ETag plus If-None-Match when clients should revalidate cheaply before downloading a body again.',
        ],
        questions: [
          'What is the difference between no-store and max-age=0?',
          'Why does private matter when cookies or Authorization are involved?',
          'How does ETag avoid resending an unchanged response body?',
        ],
        checklist: [
          'Define Cache-Control and max-age.',
          'Separate public, private, and no-store.',
          'Explain ETag, If-None-Match, and 304.',
          'Give one safe header policy for static assets and one for private data.',
        ],
      },
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
    icon: ServerClusterIcon,
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
    icon: TrophyIcon,
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

const subjectOrder = [
  'language',
  'js-fundamentals',
  'python-fundamentals',
  'csharp-fundamentals',
  'internet',
  'api',
  'security',
  'sql',
  'performance',
  'architecture',
  'files-storage',
  'files',
  'observability-ops',
  'devops',
  'distributed',
  'system-design',
  'typescript',
  'nodejs',
  'python',
  'flask',
  'django',
  'typescript-drills',
  'api-drills',
  'sql-drills',
  'security-drills',
  'http-networking',
  'utilities',
  'algorithms',
  'capstone',
]

const subjectRank = new Map(subjectOrder.map((id, index) => [id, index]))

function getProblemPhaseRank(problem: Problem) {
  const title = problem.title.toLowerCase()
  const id = problem.id.toLowerCase()

  // Foundational rung ladders open every course, ahead of glossaries and
  // tutorials, so a true beginner always starts at zero.
  if (id.includes('-rung-') || title.startsWith('rung ')) return -1
  if (id.includes('glossary') || title.includes('glossary')) return 0
  if (id.includes('tutorial') || title.startsWith('tutorial:')) return 0
  if (problem.type === 'lesson') return 1
  if (problem.type === 'quiz') return 2
  if (problem.type === 'coding') return 3
  if (problem.type === 'debug') return 4
  if (problem.type === 'design') {
    if (id.includes('project') || id.includes('capstone') || title.includes('project')) return 6
    return 5
  }
  if (id.includes('oral') || title.includes('oral exam')) return 7
  return 8
}

// Strip noisy display prefixes from titles (keep "Review"). Applied after the
// phase sort so getProblemPhaseRank still sees the original "Tutorial:"/etc.
function cleanProblemTitle(title: string): string {
  return title
    .replace(/^Tutorial:\s*/i, '')
    .replace(/^Progression\s+\d+:\s*/i, '')
    .replace(/^\d+\.\s+/, '')
    .trim()
}

function sortProblemsByPhase(problems: Problem[]) {
  return problems
    .map((problem, index) => ({ problem, index }))
    .sort((left, right) => {
      const rankDelta = getProblemPhaseRank(left.problem) - getProblemPhaseRank(right.problem)
      return rankDelta || left.index - right.index
    })
    .map(({ problem }) => ({ ...problem, title: cleanProblemTitle(problem.title) }))
}

function sortSubjectsByTrack(items: Subject[]) {
  return items
    .map((subject, index) => ({ subject, index }))
    .sort((left, right) => {
      const leftRank = subjectRank.get(left.subject.id) ?? subjectOrder.length + left.index
      const rightRank = subjectRank.get(right.subject.id) ?? subjectOrder.length + right.index
      return leftRank - rightRank
    })
    .map(({ subject }) => subject)
}

const mergedSubjects: Subject[] = [
  ...coreSubjects.map((subject) => ({
    ...subject,
    problems: sortProblemsByPhase([
      ...(foundationProblems[subject.id] ?? []),
      ...subject.problems,
      ...(zeroRampProblems[subject.id] ?? []),
      ...(progressionProblems[subject.id] ?? []),
      ...(tutorialProblems[subject.id] ?? []),
      ...(moreTutorialProblems[subject.id] ?? []),
      ...(longTutorialProblems[subject.id] ?? []),
      ...(deepDiveProblems[subject.id] ?? []),
      ...(roadmapGapProblems[subject.id] ?? []),
      ...(graderDrillProblems[subject.id] ?? []),
      ...(extraProblems[subject.id] ?? []),
      ...(oralExamProblems[subject.id] ?? []),
      ...(capstoneProblems[subject.id] ?? []),
    ]),
  })),
  ...[...extraSubjects, csharpSubject].map((subject) => ({
    ...subject,
    problems: sortProblemsByPhase([
      ...(foundationProblems[subject.id] ?? []),
      ...(zeroRampProblems[subject.id] ?? []),
      ...subject.problems,
      ...(progressionProblems[subject.id] ?? []),
      ...(subject.id === 'typescript' ? typescriptFundamentalProblems : []),
      ...(subject.id === 'nodejs' ? nodeFundamentalProblems : []),
      ...(frameworkTutorialProblems[subject.id] ?? []),
      ...(frameworkReviewProblems[subject.id] ?? []),
      ...(frameworkMasteryProblems[subject.id] ?? []),
      ...(frameworkRapidReviewProblems[subject.id] ?? []),
      ...(frameworkCapstoneProjectProblems[subject.id] ?? []),
    ]),
  })),
]

export const subjects: Subject[] = sortSubjectsByTrack(mergedSubjects)

export const allProblems = subjects.flatMap((subject) =>
  subject.problems.map((problem) => ({ ...problem, subjectId: subject.id })),
)
