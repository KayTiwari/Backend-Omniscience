import type { Problem } from './course'

export const frameworkTutorialProblems: Record<string, Problem[]> = {
  nodejs: [
    {
      id: 'nodejs-tutorial-request-to-response',
      title: 'Tutorial: Build A Node API From Request To Response',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 45,
      prompt:
        'Walk through a Node backend request from socket accept to JSON response. Then sketch a tiny Express-style app with routing, validation, service logic, persistence, and error handling.',
      explanation:
        'A Node backend is not just a route handler. The runtime accepts connections, the HTTP layer parses bytes into request objects, middleware enriches or rejects the request, the route maps intent to application logic, the service enforces business rules, repositories talk to storage, and an error layer turns failures into stable responses. If you can name each layer, you can debug where a bug actually lives.',
      production:
        'Production failures are usually layer-confusion failures: validation in the service but not at the boundary, database errors leaking through the route, missing timeouts around downstream calls, or logs without request IDs. This lesson gives you the map you need before the Node mastery drills start drilling the pieces.',
      walkthrough: [
        'Draw the request path: client, load balancer, Node process, middleware, route, service, repository, database, response.',
        'Write the route contract for POST /projects: method, path, body, success response, validation errors, auth errors.',
        'Sketch middleware order: request ID, logging timer, JSON body parser, auth, route, not-found, error handler.',
        'Move business rules out of the route into a service function.',
        'Put SQL or persistence calls behind a repository function.',
        'Define the error envelope before writing the first handler.',
        'List tests: validation failure, auth failure, happy path, repository failure, and unknown route.',
      ],
      example:
        'POST /projects -> validate body -> require user -> createProject service -> projectsRepository.insert -> 201 JSON -> structured log with requestId, route, status, durationMs.',
      questions: [
        'Which layer should reject malformed JSON or missing fields?',
        'Which layer should decide whether a user may create a project?',
        'Why should database details not leak into the route response?',
        'What does the error middleware know that an individual route should not repeat?',
        'What log fields would let you trace one failed request?',
      ],
      checklist: [
        'Can draw the full request path.',
        'Can write a route contract before implementation.',
        'Can separate middleware, route, service, and repository responsibilities.',
        'Can name tests for success and failure paths.',
      ],
    },
    {
      id: 'nodejs-tutorial-express-postgres-redis',
      title: 'Tutorial: Express, Postgres, Redis, And Jobs Together',
      type: 'design',
      difficulty: 'Hard',
      minutes: 60,
      prompt:
        'Design a production Node service that uses Express for HTTP, Postgres for source-of-truth data, Redis for rate limits/cache, and a worker for email jobs.',
      explanation:
        'Real backends are compositions. Express handles request lifecycle, Postgres protects durable truth, Redis handles fast coordination or ephemeral data, and workers handle side effects that should not block the request. The skill is knowing which responsibility belongs where.',
      production:
        'Putting everything in the request path creates slow, fragile APIs. Sending email before commit causes ghost emails. Caching without invalidation creates stale reads. Retrying jobs without idempotency creates duplicate side effects. This walkthrough connects the tools to the failure modes.',
      walkthrough: [
        'Define the user action: invite a teammate to a project.',
        'HTTP route validates input and authenticates the caller.',
        'Service checks membership permission and writes an Invitation row inside a transaction.',
        'After commit, enqueue send-invite-email with invitation id as idempotency key.',
        'Worker loads the invitation fresh, sends email, records provider status, and retries transient failures.',
        'Redis stores rate-limit counters and short-lived cache entries, not irreplaceable business truth.',
        'Metrics include request latency, DB query duration, queue depth, worker failures, and email provider errors.',
      ],
      example:
        'POST /projects/:id/invitations returns 202 after durable write + enqueue. The worker owns provider retries, and every job can be safely retried by invitation id.',
      questions: [
        'Why enqueue after the transaction commits?',
        'What belongs in Postgres instead of Redis?',
        'How do you prevent duplicate invite emails?',
        'What happens if Redis is down during login rate limiting?',
        'Which metric tells you workers are falling behind?',
      ],
      checklist: [
        'Can assign each responsibility to Express, Postgres, Redis, or worker.',
        'Can explain transaction plus queue ordering.',
        'Can design idempotent job payloads.',
        'Can name useful production metrics.',
      ],
    },
    {
      id: 'nodejs-tutorial-node-launch-review',
      title: 'Tutorial: Node Launch Review',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 55,
      prompt:
        'Review a Node API before launch. Find gaps in config, validation, auth, transactions, jobs, logging, metrics, shutdown, and deployment.',
      explanation:
        'A launch review is a structured attempt to break your own backend before users do. You are checking whether the service fails closed, recovers cleanly, emits useful evidence, and has tests around the risky contracts.',
      production:
        'The biggest difference between a hobby backend and a production backend is not syntax. It is whether startup fails on bad config, requests have bounded timeouts, sensitive errors are hidden, workers are idempotent, deploys drain cleanly, and operators can see what went wrong.',
      walkthrough: [
        'Config: every required env var is parsed, typed, and validated at startup.',
        'HTTP: body size limits, CORS allowlist, auth middleware, not-found handler, and error envelope are present.',
        'Data: every multi-row write has a transaction and every external side effect has idempotency.',
        'Security: cookies/JWTs, password hashing, rate limits, and dependency updates are reviewed.',
        'Reliability: DB pools, downstream timeouts, retries with jitter, and graceful shutdown are configured.',
        'Observability: logs, metrics, traces, request IDs, and alertable symptoms are defined.',
        'Tests: unit, route, integration, and worker tests cover success plus at least one failure per contract.',
      ],
      example:
        'Launch blocker: POST /payments writes a charge row and calls the provider without idempotency. Fix: idempotency key + transaction + provider status reconciliation + duplicate request test.',
      questions: [
        'Which bad config should crash the process at startup?',
        'Which errors should be shown to clients and which should only be logged?',
        'Where do you need idempotency?',
        'How does the service drain on SIGTERM?',
        'What single dashboard would you open during the first incident?',
      ],
      checklist: [
        'Can perform a launch review without relying on memory.',
        'Can identify blockers by production risk.',
        'Can turn a review finding into a test.',
        'Can explain how to observe the system after launch.',
      ],
    },
  ],
  python: [
    {
      id: 'python-tutorial-api-service-shape',
      title: 'Tutorial: Python API Service Shape',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 45,
      prompt:
        'Design the shape of a Python backend before choosing Flask, FastAPI, or Django. Separate transport, validation, services, repositories, jobs, config, tests, and observability.',
      explanation:
        'Python backend skill starts with boundaries. Framework code should translate HTTP into commands and responses. Services should hold business behavior. Repositories should isolate persistence. Settings should load once and fail fast. Tests should target the smallest layer that proves the behavior.',
      production:
        'Python makes it easy to hide global state, import-time side effects, and blocking calls inside convenient functions. Those shortcuts become hard-to-debug production failures when workers fork, async routes block, or tests accidentally mock the entire system.',
      walkthrough: [
        'Choose a sample feature: create user, create project, or enqueue report generation.',
        'Write a command/data object for the request before writing framework code.',
        'Write a service function that accepts dependencies explicitly.',
        'Write repository methods for data access and keep transaction lifetime visible.',
        'Translate domain exceptions into HTTP responses at the edge.',
        'Load settings from env with typed parsing and explicit defaults.',
        'Write tests for service logic first, then one integration test through the framework.',
      ],
      example:
        'FastAPI route -> Pydantic request -> service.create_project(command, repo, clock) -> repository transaction -> response DTO.',
      questions: [
        'What code should run at import time and what should run at startup?',
        'How do service tests differ from route tests?',
        'Why pass dependencies instead of importing global clients everywhere?',
        'Where should domain exceptions become HTTP status codes?',
        'How do you avoid blocking an async route?',
      ],
      checklist: [
        'Can draw framework edge, service layer, repository layer, and job layer.',
        'Can explain dependency injection without magic.',
        'Can choose the right test level for a behavior.',
        'Can name Python-specific production traps.',
      ],
    },
    {
      id: 'python-tutorial-fastapi-worker-capstone',
      title: 'Tutorial: FastAPI With Background Work',
      type: 'design',
      difficulty: 'Hard',
      minutes: 60,
      prompt:
        'Walk through a FastAPI service that accepts uploads, stores metadata in Postgres, places processing work on a queue, and exposes status endpoints.',
      explanation:
        'A robust Python API does not process expensive work synchronously inside a request. It stores enough durable state to recover, enqueues a small idempotent job, and lets workers do the slow work with retries and progress updates.',
      production:
        'Upload systems fail in messy ways: oversized bodies, partial files, duplicate submissions, worker crashes, provider timeouts, and users refreshing status pages. The design has to make every step restartable and observable.',
      walkthrough: [
        'Endpoint accepts metadata and an upload reference, with size/type validation at the boundary.',
        'Database row records status=pending and an idempotency key.',
        'After commit, queue a process_upload job with upload id only.',
        'Worker locks or claims the job, streams the file, updates progress, and writes final status.',
        'Status endpoint returns stable states: pending, processing, complete, failed.',
        'Retries are bounded and failures land in a visible state with error code.',
        'Tests cover duplicate submission, worker retry, invalid upload, and status transitions.',
      ],
      example:
        'POST /uploads -> 202 {id,status:"pending"}; GET /uploads/:id -> {id,status,progress,errorCode}; worker owns expensive processing.',
      questions: [
        'Why should the job payload contain ids rather than a full object?',
        'What must be inside the DB transaction?',
        'How do you make upload processing idempotent?',
        'Which state transitions should be impossible?',
        'What metric reveals stuck workers?',
      ],
      checklist: [
        'Can design a resumable background workflow.',
        'Can separate request latency from processing latency.',
        'Can model status transitions and failure states.',
        'Can write tests for worker behavior.',
      ],
    },
    {
      id: 'python-tutorial-python-incident-review',
      title: 'Tutorial: Python Incident Review',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 55,
      prompt:
        'Diagnose a Python API whose p99 latency rose after deploy. Walk through logs, metrics, traces, code changes, database behavior, async blocking, and mitigation.',
      explanation:
        'Incident response is disciplined narrowing. You start with symptoms, compare before/after, isolate the layer, confirm with evidence, mitigate user impact, then write the regression test or monitor that would have caught it earlier.',
      production:
        'Python incidents often come from blocking work in async code, slow ORM queries, connection pool exhaustion, bad retries, process memory growth, or worker count mismatch. The cure is evidence, not vibes.',
      walkthrough: [
        'State the symptom in numbers: p99, error rate, affected endpoints, start time.',
        'Correlate with deploys, traffic, DB CPU, queue depth, and downstream latency.',
        'Use traces to split request time into framework, service, DB, and external calls.',
        'Check for blocking calls inside async routes or accidental sequential IO.',
        'Mitigate with rollback, feature flag, lower timeout, queue diversion, or capacity.',
        'Write a post-incident test, benchmark, dashboard, or alert tied to the root cause.',
      ],
      example:
        'Root cause: async endpoint called requests.get without timeout. Mitigation: rollback. Fix: httpx AsyncClient with timeout + route test using fake slow dependency + p99 alert.',
      questions: [
        'What evidence distinguishes CPU saturation from DB wait?',
        'How do you prove a call is blocking the event loop?',
        'When is rollback better than patching forward?',
        'What should the incident timeline include?',
        'Which regression test protects the fix?',
      ],
      checklist: [
        'Can triage from symptom to layer.',
        'Can choose a mitigation before a perfect root cause.',
        'Can identify common Python latency traps.',
        'Can turn an incident into a durable guardrail.',
      ],
    },
  ],
  django: [
    {
      id: 'django-tutorial-drf-request-map',
      title: 'Tutorial: DRF Request Map',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 45,
      prompt:
        'Trace a Django REST Framework request through URL routing, middleware, authentication, permissions, serializer validation, viewset action, ORM, and response rendering.',
      explanation:
        'Django and DRF give you a lot of machinery. Mastery means knowing where each decision happens: middleware wraps the whole request, auth identifies the user, permissions decide access, serializers validate and represent data, viewsets orchestrate actions, and the ORM talks to the database lazily.',
      production:
        'DRF bugs often come from putting business logic in serializers, forgetting queryset scoping, triggering N+1 queries, or assuming authentication automatically means authorization. A request map helps you place checks where they actually protect the system.',
      walkthrough: [
        'Start at urls.py: route names, path params, router-generated actions.',
        'Identify middleware order: security, sessions, CSRF, auth, custom request ID.',
        'Describe authentication and how request.user is populated.',
        'Apply permission classes before object access and object permissions after loading.',
        'Use serializers for validation and representation, not hidden side effects.',
        'Use selectors/querysets for reads and services/commands for writes.',
        'Return a stable response shape and test query counts.',
      ],
      example:
        'GET /projects -> ProjectViewSet.list -> get_queryset scoped to request.user -> serializer output -> paginated response.',
      questions: [
        'Where should object-level permission checks happen?',
        'Why is get_queryset a security boundary?',
        'When should you use select_related vs prefetch_related?',
        'What logic belongs in a serializer and what belongs in a service?',
        'How do you test that a user cannot see another project?',
      ],
      checklist: [
        'Can trace a DRF request end to end.',
        'Can explain queryset scoping as authz.',
        'Can keep serializers from becoming business-service junk drawers.',
        'Can test permissions and query counts.',
      ],
    },
    {
      id: 'django-tutorial-models-migrations-capstone',
      title: 'Tutorial: Models, Migrations, And Zero-Downtime Changes',
      type: 'design',
      difficulty: 'Hard',
      minutes: 60,
      prompt:
        'Design Django models for projects, memberships, invitations, and audit logs, then plan a safe migration that adds required slugs to a hot table.',
      explanation:
        'Django models are both domain vocabulary and database schema. You need field choices, constraints, indexes, relationship names, and migration plans that respect production traffic. The ORM is friendly, but the database still enforces reality.',
      production:
        'Unsafe migrations can lock tables, break rolling deploys, or leave old code unable to run. Production Django engineers think in expand/contract: add compatible schema, backfill safely, deploy code that uses it, then tighten constraints.',
      walkthrough: [
        'Model Project, Membership with role, Invitation with status, and AuditLog as append-only.',
        'Add unique constraints for membership and invitation idempotency.',
        'Choose indexes for common list/filter patterns.',
        'Plan slug rollout: add nullable field, deploy writer, backfill in batches, validate uniqueness, enforce not null, remove fallback.',
        'Use data migrations with historical models and batching.',
        'Write tests for constraints and migration-compatible behavior.',
      ],
      example:
        'Bad: add slug NOT NULL UNIQUE to 20M rows in one deploy. Good: nullable slug -> code writes slug -> batched backfill -> unique index -> not-null constraint -> cleanup.',
      questions: [
        'What should be unique in Membership?',
        'Why are historical models needed in data migrations?',
        'What makes a migration unsafe during rolling deploys?',
        'Which indexes support project list views?',
        'How do you roll back halfway through expand/contract?',
      ],
      checklist: [
        'Can design relationships with constraints.',
        'Can identify dangerous migrations.',
        'Can write an expand/contract rollout.',
        'Can connect ORM choices to SQL behavior.',
      ],
    },
    {
      id: 'django-tutorial-django-launch-review',
      title: 'Tutorial: Django Launch Review',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 55,
      prompt:
        'Perform a launch review for a Django/DRF app. Check settings, auth, permissions, migrations, static/media, admin safety, Celery jobs, tests, query performance, and observability.',
      explanation:
        'Django ships with strong defaults, but production still needs a deliberate review. DEBUG, ALLOWED_HOSTS, secure cookies, proxy headers, CSRF origins, migrations, admin permissions, worker tasks, and query counts all need explicit attention.',
      production:
        'Many Django outages are boring and preventable: DEBUG left on, bad ALLOWED_HOSTS, proxy SSL misconfiguration, slow admin queries, Celery tasks firing before commit, missing indexes, or object access leaks. Launch review catches boring failures before they become loud.',
      walkthrough: [
        'Settings: DEBUG false, allowed hosts, secure cookies, HSTS, proxy SSL header, CSRF trusted origins.',
        'Auth: custom user decision, password hashing, session/cookie flags, object permissions.',
        'Data: migrations reviewed, zero-downtime rollout planned, indexes for hot queries.',
        'DRF: pagination, filtering allowlist, stable error envelope, OpenAPI docs.',
        'Workers: Celery tasks use on_commit, retries, idempotency, and visible failure states.',
        'Ops: collectstatic/media storage, admin restrictions, Sentry/logs/metrics/traces, health checks.',
        'Tests: API permission branches, serializer validation, query counts, migrations, and task behavior.',
      ],
      example:
        'Launch blocker: invite email sent in serializer before transaction commit. Fix: service layer writes Invitation in atomic block, transaction.on_commit enqueues Celery task, test proves rollback sends no email.',
      questions: [
        'Which production settings are launch blockers?',
        'How do you prevent object permission leaks?',
        'Why should Celery enqueue inside transaction.on_commit?',
        'What query-count test belongs on every list endpoint?',
        'What admin actions are dangerous without extra permission checks?',
      ],
      checklist: [
        'Can run a Django launch checklist confidently.',
        'Can identify deploy-blocking settings mistakes.',
        'Can reason about transactions plus Celery.',
        'Can test permissions, query counts, and failures.',
      ],
    },
  ],
}
