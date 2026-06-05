// Additional curriculum, authored alongside Codex's src/course.ts.
//
// This file is intentionally self-contained: the Problem/Subject types below
// mirror the ones in course.ts so this module compiles on its own while course.ts
// is still being edited. To wire it in, either:
//   1) merge extraProblems into the matching subject by id, e.g.
//        subjects.find(s => s.id === key)!.problems.push(...extraProblems[key])
//   2) append extraSubjects to the subjects array.
// Once merged, you can delete the local types and import them from './course'.

import {
  Braces,
  Cloud,
  ServerCog,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { NodeJsIcon, PythonIcon, FlaskIcon, DjangoIcon } from './TechIcons'

export type ProblemType = 'lesson' | 'coding' | 'quiz' | 'debug' | 'design'
export type Difficulty = 'Warmup' | 'Core' | 'Hard' | 'Boss'

export type Problem = {
  id: string
  title: string
  type: ProblemType
  difficulty: Difficulty
  minutes: number
  prompt: string
  example?: string
  checklist: string[]
  answer?: string
  choices?: string[]
  correctChoice?: number
}

export type Subject = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon | ComponentType<{ size?: number; className?: string }>
  color: string
  problems: Problem[]
}

// ---------------------------------------------------------------------------
// More problems for Codex's existing subjects (keyed by subject id).
// ---------------------------------------------------------------------------

export const extraProblems: Record<string, Problem[]> = {
  internet: [
    {
      id: 'internet-caching-headers',
      title: 'Cache Header Court',
      type: 'quiz',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'You serve a user avatar that rarely changes but must update within a day if replaced. Which response header strategy fits best?',
      choices: [
        'Cache-Control: no-store',
        'Cache-Control: public, max-age=86400, must-revalidate + ETag',
        'Cache-Control: private, max-age=31536000, immutable',
        'Expires header only, set one year out',
      ],
      correctChoice: 1,
      answer:
        'A bounded max-age plus an ETag lets caches serve fast and revalidate cheaply with 304s. "immutable"/1-year is for content-hashed assets; no-store defeats caching entirely.',
      checklist: [
        'Explain how ETag + If-None-Match produces a 304.',
        'Say when immutable + content hashing is the right call instead.',
      ],
    },
    {
      id: 'internet-tls-handshake',
      title: 'What TLS Actually Buys You',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 15,
      prompt:
        'Describe what a TLS handshake establishes and which guarantees it does and does not provide for a backend API.',
      example:
        'TLS gives confidentiality + integrity + server identity. It does NOT prove the client is who they say they are (that is authentication, a separate concern).',
      checklist: [
        'Separate encryption from authentication of the caller.',
        'Explain why HTTPS does not remove the need for authz on each request.',
        'Mention certificate validation and what a CA vouches for.',
      ],
    },
  ],

  language: [
    {
      id: 'language-graceful-shutdown',
      title: 'Graceful Shutdown',
      type: 'coding',
      difficulty: 'Hard',
      minutes: 40,
      prompt:
        'Make a server drain cleanly on SIGTERM: stop accepting new connections, let in-flight requests finish within a timeout, close DB pools, then exit. Force-exit if the timeout passes.',
      example:
        'On SIGTERM: server.close() -> wait for active requests (max 10s) -> pool.end() -> process.exit(0).',
      checklist: [
        'Trap SIGTERM and SIGINT.',
        'Stop accepting new work before draining.',
        'Bound the drain with a timeout and force-exit on overrun.',
        'Release external resources (DB, queues) before exit.',
      ],
    },
  ],

  sql: [
    {
      id: 'sql-explain-plan',
      title: 'Read The Plan',
      type: 'debug',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'A query is slow. EXPLAIN ANALYZE shows a Seq Scan on a 5M-row table filtering by user_id, then a Sort. Walk through your diagnosis and fix.',
      example:
        'Seq Scan + Filter: user_id = $1 (rows=5,000,000) ... Sort (actual time=4200ms).',
      checklist: [
        'Identify why the planner chose a Seq Scan.',
        'Propose the index (and column order) that removes both the scan and the sort.',
        'Explain how a composite index can satisfy WHERE + ORDER BY together.',
        'Note when an index will NOT help (low selectivity).',
      ],
    },
    {
      id: 'sql-safe-migration',
      title: 'Zero-Downtime Column Add',
      type: 'design',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'Add a NOT NULL column with a default to a hot 50M-row table in Postgres without locking out writes. Design the rollout.',
      checklist: [
        'Explain the lock risk of a naive ALTER with a volatile default.',
        'Sequence it: add nullable -> backfill in batches -> set default -> add constraint NOT VALID -> VALIDATE.',
        'Keep old and new code compatible during the rollout (expand/contract).',
        'Describe the rollback at each step.',
      ],
    },
  ],

  api: [
    {
      id: 'api-error-envelope',
      title: 'Error Envelope',
      type: 'coding',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Design a consistent JSON error shape and a handler that maps domain errors to it. Validation, not-found, and unexpected errors must all be distinguishable by clients.',
      example:
        '{"error":{"code":"VALIDATION","message":"email is required","fields":{"email":"required"},"requestId":"abc123"}}',
      checklist: [
        'Use a stable machine-readable code separate from the human message.',
        'Map error classes to status codes in one place.',
        'Never leak stack traces or internals in the body.',
        'Include a request id for correlation with logs.',
      ],
    },
    {
      id: 'api-webhook-verify',
      title: 'Verify A Webhook',
      type: 'coding',
      difficulty: 'Hard',
      minutes: 35,
      prompt:
        'You receive webhooks from a provider that signs each payload with an HMAC over the raw body plus a timestamp. Implement verification that resists tampering and replay.',
      checklist: [
        'Compute HMAC over the RAW body, not the parsed object.',
        'Use a constant-time comparison.',
        'Reject stale timestamps to limit replay.',
        'Return 2xx fast and process asynchronously.',
      ],
    },
  ],

  security: [
    {
      id: 'security-jwt-pitfalls',
      title: 'JWT Footguns',
      type: 'quiz',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'Which is the most dangerous real-world JWT mistake?',
      choices: [
        'Storing the token in memory',
        'Accepting the "alg" header from the token (including "none")',
        'Using a 1-hour expiry',
        'Including a user id claim',
      ],
      correctChoice: 1,
      answer:
        'Trusting the token-supplied alg lets attackers switch to "none" or downgrade RS256->HS256 and forge tokens. Pin the algorithm server-side and never honor the header.',
      checklist: [
        'Explain the alg-confusion / "none" attack.',
        'Note that JWTs are signed, not encrypted (no secrets in claims).',
        'Describe revocation challenges vs server sessions.',
      ],
    },
    {
      id: 'security-ssrf',
      title: 'SSRF In The Image Fetcher',
      type: 'debug',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'An endpoint fetches a user-supplied image URL server-side to thumbnail it. Show how this becomes SSRF and how you lock it down.',
      example:
        'POST /thumbnail {"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/"}',
      checklist: [
        'Explain how internal/metadata endpoints get reached.',
        'Validate scheme + resolve DNS and block private/link-local ranges.',
        'Disable redirects or re-validate each hop.',
        'Prefer an allowlist and a dedicated egress path.',
      ],
    },
  ],

  architecture: [
    {
      id: 'architecture-dlq',
      title: 'Dead Letter Queue',
      type: 'design',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'A worker keeps failing on a handful of poison messages and blocks the queue. Design retry + dead-lettering so good work keeps flowing.',
      checklist: [
        'Bound retries with exponential backoff + jitter.',
        'Move exhausted messages to a DLQ with failure context.',
        'Make handlers idempotent so retries are safe.',
        'Add visibility/alerting on DLQ depth and a replay path.',
      ],
    },
  ],

  devops: [
    {
      id: 'devops-zero-downtime',
      title: 'Zero-Downtime Deploy',
      type: 'design',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'Design a deploy where users never hit a 502 and a bad release can roll back fast. Assume a load balancer in front of N app instances.',
      checklist: [
        'Use readiness probes so traffic only hits ready instances.',
        'Roll instances gradually (rolling/blue-green/canary) and drain connections.',
        'Keep DB migrations backward compatible (expand/contract).',
        'Define the rollback trigger and how state is handled.',
      ],
    },
  ],

  performance: [
    {
      id: 'performance-cache-stampede',
      title: 'Cache Stampede',
      type: 'debug',
      difficulty: 'Hard',
      minutes: 25,
      prompt:
        'A popular key expires and thousands of requests simultaneously miss the cache and slam the database. Diagnose and fix without giving stale data forever.',
      checklist: [
        'Explain the thundering-herd on expiry.',
        'Apply a lock / single-flight so one request recomputes.',
        'Use early/probabilistic refresh before hard expiry.',
        'Consider serve-stale-while-revalidate as a fallback.',
      ],
    },
  ],

  'system-design': [
    {
      id: 'design-rate-limiter',
      title: 'Distributed Rate Limiter',
      type: 'design',
      difficulty: 'Boss',
      minutes: 50,
      prompt:
        'Design an API rate limiter (e.g. 100 req/min/key) that works across many app servers. Compare algorithms and pick one.',
      checklist: [
        'Compare fixed window, sliding window, and token bucket.',
        'Explain the shared-state problem across instances (Redis).',
        'Handle bursts vs smoothness and clock skew.',
        'Decide fail-open vs fail-closed when the store is down.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// New framework tracks: Node.js, Python, Flask, Django.
// ---------------------------------------------------------------------------

// Compact builder for auto-graded coding problems. The id MUST match a grader
// spec problemId (tsSpecs / pySpecs) so the editor + Check solutions appear.
export function drill(id: string, title: string, difficulty: Difficulty = 'Core', minutes = 12): Problem {
  return {
    id,
    title,
    type: 'coding',
    difficulty,
    minutes,
    prompt:
      'Coding drill: ' + title + '. Write your solution in the editor, then click Check solutions to run the tests.',
    checklist: ['All tests pass when you click Check solutions.'],
  }
}

export const extraSubjects: Subject[] = [
  {
    id: 'typescript',
    title: 'TypeScript',
    subtitle: 'Types, narrowing, DTOs, runtime validation, and safer Node backends.',
    icon: Braces,
    color: '#0f8b8d',
    problems: [
      {
        id: 'typescript-why-before-node',
        title: 'Why TypeScript Before Node',
        type: 'lesson',
        difficulty: 'Warmup',
        minutes: 15,
        prompt:
          'Explain why TypeScript belongs before serious Node.js backend work: contracts, refactors, DTOs, config, service boundaries, and safer async code.',
        example:
          'TypeScript catches internal misuse like passing a ProjectId where a UserId is expected, but HTTP JSON still needs runtime validation.',
        checklist: [
          'Explain compile-time types vs runtime data.',
          'Name three backend boundaries that should be typed.',
          'Explain why runtime validation is still required.',
        ],
      },
      {
        id: 'typescript-request-dto',
        title: 'Request DTO Shape',
        type: 'coding',
        difficulty: 'Warmup',
        minutes: 25,
        prompt:
          'Define a CreateUserInput type and sketch a validator that accepts unknown JSON before a service receives typed data.',
        checklist: [
          'Use unknown at the HTTP boundary.',
          'Validate required fields.',
          'Return a typed object only after validation.',
          'Do not leak raw request bodies into services.',
        ],
      },
      {
        id: 'typescript-discriminated-result',
        title: 'Discriminated Result',
        type: 'coding',
        difficulty: 'Core',
        minutes: 25,
        prompt:
          'Model a Result<T> union with ok true/false branches, then explain how a route maps each branch to HTTP responses.',
        checklist: [
          'Use a discriminator.',
          'Type success payloads generically.',
          'Type expected errors explicitly.',
          'Handle every branch exhaustively.',
        ],
      },
    ],
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    subtitle: 'Event loop, streams, async patterns, and Express in production.',
    icon: NodeJsIcon,
    color: '#43853d',
    problems: [
      {
        id: 'nodejs-event-loop',
        title: 'Event Loop, Honestly',
        type: 'quiz',
        difficulty: 'Core',
        minutes: 12,
        prompt:
          'A request handler does a heavy synchronous JSON.parse of a 40MB string. Under load, what happens and why?',
        choices: [
          'Node spawns a thread per request, so it is fine',
          'The event loop blocks, stalling all other requests until it finishes',
          'V8 automatically offloads it to a worker',
          'Only that one request is slow; others are unaffected',
        ],
        correctChoice: 1,
        answer:
          'Node runs JS on a single event-loop thread. CPU-bound sync work blocks every other request. Offload to a worker thread, stream the parse, or push the work off the hot path.',
        checklist: [
          'Name the event loop phases at a high level.',
          'Distinguish I/O-bound (great for Node) from CPU-bound (dangerous).',
          'List ways to keep the loop unblocked (worker_threads, streaming, queues).',
        ],
      },
      {
        id: 'nodejs-streams-backpressure',
        title: 'Stream With Backpressure',
        type: 'coding',
        difficulty: 'Hard',
        minutes: 40,
        prompt:
          'Stream a large file to an HTTP response (or transform it line by line) without loading it all into memory, respecting backpressure.',
        example:
          'pipeline(fs.createReadStream(path), transform, res, cb) — let pipeline manage backpressure and cleanup.',
        checklist: [
          'Use pipeline/pipe so backpressure is honored.',
          'Avoid buffering the whole file in memory.',
          'Handle stream errors and clean up file handles.',
          'Set appropriate Content-Type and status before piping.',
        ],
      },
      {
        id: 'nodejs-async-errors',
        title: 'The Error That Vanished',
        type: 'debug',
        difficulty: 'Core',
        minutes: 25,
        prompt:
          'An Express route does `await db.query(...)` in a try/catch, but a rejected promise still crashes the process with an unhandledRejection. Find the bug and the general rule.',
        checklist: [
          'Spot the missing await / un-awaited promise.',
          'Explain why async errors skip Express error middleware unless forwarded.',
          'Add a next(err) path or an async wrapper.',
          'Add a last-resort unhandledRejection handler that logs and exits.',
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    subtitle: 'GIL, asyncio, typing, packaging, and pragmatic concurrency.',
    icon: PythonIcon,
    color: '#3776ab',
    problems: [
      {
        id: 'python-gil',
        title: 'GIL Reality Check',
        type: 'quiz',
        difficulty: 'Core',
        minutes: 12,
        prompt:
          'You need to speed up a CPU-bound function across cores in CPython. What actually helps?',
        choices: [
          'threading.Thread — more threads, more cores',
          'asyncio — it is concurrent',
          'multiprocessing / a process pool',
          'Adding more @lru_cache decorators',
        ],
        correctChoice: 2,
        answer:
          'The GIL serializes Python bytecode, so threads do not parallelize CPU work. Use processes (multiprocessing/ProcessPoolExecutor) for CPU-bound work; threads/asyncio are for I/O-bound.',
        checklist: [
          'State what the GIL does and does not allow.',
          'Map CPU-bound -> processes, I/O-bound -> threads/async.',
          'Mention that native extensions can release the GIL.',
        ],
      },
      {
        id: 'python-asyncio-gather',
        title: 'Fan-Out With Timeouts',
        type: 'coding',
        difficulty: 'Hard',
        minutes: 35,
        prompt:
          'Call 20 downstream services concurrently with asyncio, each with a per-call timeout, returning partial results and recording which ones failed.',
        example:
          'await asyncio.gather(*tasks, return_exceptions=True) with asyncio.wait_for around each call.',
        checklist: [
          'Bound each call with asyncio.wait_for.',
          'Use gather(return_exceptions=True) so one failure does not sink all.',
          'Cap concurrency with a Semaphore if needed.',
          'Separate successes from failures in the result.',
        ],
      },
      {
        id: 'python-packaging',
        title: 'Reproducible Environments',
        type: 'lesson',
        difficulty: 'Warmup',
        minutes: 15,
        prompt:
          'Explain how to make a Python backend reproducible across dev, CI, and prod: virtual envs, pinned dependencies, and pyproject.',
        checklist: [
          'Isolate with a venv (or container).',
          'Pin exact versions (lockfile) vs loose ranges.',
          'Separate runtime from dev dependencies.',
          'Note why "works on my machine" usually means an unpinned dep.',
        ],
      },
    ],
  },
  {
    id: 'flask',
    title: 'Flask',
    subtitle: 'App factory, blueprints, request context, and SQLAlchemy sessions.',
    icon: FlaskIcon,
    color: '#5c5c5c',
    problems: [
      {
        id: 'flask-app-factory',
        title: 'App Factory + Blueprints',
        type: 'coding',
        difficulty: 'Core',
        minutes: 35,
        prompt:
          'Refactor a single-file Flask app into a create_app() factory with blueprints and config objects so it is testable and supports multiple environments.',
        example:
          'def create_app(config): app = Flask(__name__); app.config.from_object(config); app.register_blueprint(users_bp); return app',
        checklist: [
          'Move setup into create_app() so tests can build isolated apps.',
          'Split routes into blueprints by domain.',
          'Load config per environment (dev/test/prod).',
          'Avoid import-time side effects / global app state.',
        ],
      },
      {
        id: 'flask-request-context',
        title: 'WSGI & Request Context',
        type: 'quiz',
        difficulty: 'Core',
        minutes: 12,
        prompt:
          'Why can a classic Flask view block other requests, and what makes `g` and `request` work without you passing them around?',
        choices: [
          'Flask is async by default; it never blocks',
          'WSGI is synchronous per worker; concurrency comes from multiple workers/threads, and request/g are context-locals',
          'Flask uses threads for every line of code',
          'request is a global singleton shared across all users',
        ],
        correctChoice: 1,
        answer:
          'Classic Flask is WSGI/synchronous: a worker handles one request at a time, so you scale with multiple workers/threads (gunicorn). request/g are context-locals bound to the active request, not true globals.',
        checklist: [
          'Explain WSGI worker concurrency (gunicorn workers/threads).',
          'Describe app vs request context.',
          'Note when to reach for async (ASGI) instead.',
        ],
      },
      {
        id: 'flask-sqlalchemy-session',
        title: 'Session Leaks',
        type: 'debug',
        difficulty: 'Hard',
        minutes: 30,
        prompt:
          'Under load a Flask + SQLAlchemy app exhausts the connection pool and throws QueuePool limit errors. Diagnose the session lifecycle bug and fix it.',
        checklist: [
          'Tie session scope to the request (scoped_session / Flask-SQLAlchemy).',
          'Ensure sessions are removed/closed at request teardown.',
          'Avoid long-lived module-level sessions.',
          'Right-size pool_size + max_overflow for worker count.',
        ],
      },
    ],
  },
  {
    id: 'django',
    title: 'Django',
    subtitle: 'ORM performance, migrations, and Django REST Framework APIs.',
    icon: DjangoIcon,
    color: '#0c4b33',
    problems: [
      {
        id: 'django-orm-nplus1',
        title: 'ORM N+1',
        type: 'debug',
        difficulty: 'Core',
        minutes: 25,
        prompt:
          'A Django list view renders 50 orders and fires 150+ queries. Identify the N+1 and fix it with the right ORM tools.',
        example:
          'for o in Order.objects.all(): o.customer.name  # one query per order',
        checklist: [
          'Use select_related for forward FK/one-to-one (JOIN).',
          'Use prefetch_related for reverse/many-to-many.',
          'Confirm with django-debug-toolbar or assertNumQueries.',
          'Only fetch needed columns (.only()/.values()).',
        ],
      },
      {
        id: 'django-safe-migration',
        title: 'Migration Without Downtime',
        type: 'design',
        difficulty: 'Hard',
        minutes: 30,
        prompt:
          'Rename a column used by a live Django app across a rolling deploy without breaking the running old code. Design the migration steps.',
        checklist: [
          'Use expand/contract: add new column, dual-write, backfill, switch reads, drop old.',
          'Keep each migration backward compatible with the previous release.',
          'Beware long locks; batch data migrations.',
          'Sequence code deploys around the schema changes.',
        ],
      },
      {
        id: 'django-drf-endpoint',
        title: 'A Real DRF Endpoint',
        type: 'coding',
        difficulty: 'Core',
        minutes: 40,
        prompt:
          'Build a paginated, filterable read API for a model with DRF: serializer, viewset, pagination, and validation, returning stable error shapes.',
        checklist: [
          'Define a ModelSerializer with explicit fields (no accidental over-exposure).',
          'Use a ViewSet + router, with pagination configured.',
          'Add filtering/ordering via query params.',
          'Validate input and return DRF-standard error responses.',
        ],
      },
    ],
  },
]
