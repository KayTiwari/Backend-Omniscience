import type { Problem } from './course'

type CapstoneProject = {
  id: string
  title: string
  stack: string
  product: string
  features: string[]
  data: string[]
  productionRisks: string[]
}

function makeCapstones(prefix: string, projects: CapstoneProject[]): Problem[] {
  return projects.map((project, index) => ({
    id: `${prefix}-capstone-project-${index + 1}-${project.id}`,
    title: `Capstone Project ${index + 1}: ${project.title}`,
    type: 'coding',
    difficulty: 'Boss',
    minutes: 180,
    prompt:
      `Build a production-shaped ${project.stack} backend for ${project.product}. This is a cumulative coding assessment: write the API contract, implement the core flow, add tests, and document the production failure modes.`,
    explanation:
      `This capstone is where the separate lessons stop being separate. You should combine routing, validation, auth, authorization, persistence, transactions, background work, testing, observability, deployment thinking, and incident readiness. The deliverable is not only code: it is code plus the ability to defend why the backend behaves correctly under failure.`,
    production:
      `A strong backend capstone proves you can think beyond CRUD. Production risk areas for this project: ${project.productionRisks.join('; ')}. You should make those risks explicit in the design, tests, logs, metrics, and rollback plan.`,
    walkthrough: [
      'Write the product contract first: endpoints, request bodies, response DTOs, status codes, and error envelope.',
      `Implement these core features: ${project.features.join('; ')}.`,
      `Model durable data and invariants: ${project.data.join('; ')}.`,
      'Separate transport code from service/business logic and persistence/repository logic.',
      'Add validation at the boundary and authorization at the resource boundary.',
      'Use transactions for multi-step state changes and idempotency for retryable writes.',
      'Add tests in layers: pure service tests, route/API tests, persistence tests, and one failure-mode regression test.',
      'Add production notes: config, secrets, logs, metrics, health/readiness, deploy, rollback, and incident triage.',
      'Finish by doing an oral defense: explain every endpoint from request to database to response.',
    ],
    example:
      `Suggested README outline: Overview -> API Contract -> Data Model -> Core Flows -> Tests -> Production Risks -> Observability -> Deployment -> Incident Playbook.`,
    questions: [
      'What is the source of truth for each piece of state?',
      'Which endpoint is most dangerous if retried?',
      'Where do you need resource-level authorization?',
      'What database constraint protects the most important invariant?',
      'Which side effect must happen after commit?',
      'What should the client see during a dependency outage?',
      'What logs and metrics prove the system is healthy?',
      'Which test would have caught the most embarrassing production bug?',
      'How would you roll this out and roll it back?',
    ],
    checklist: [
      'API contract written before implementation.',
      'Data model includes constraints and indexes.',
      'Authn and authz are tested.',
      'Validation and error envelope are stable.',
      'Transactions and idempotency protect risky writes.',
      'Background side effects are retry-safe.',
      'Tests cover success and failure paths.',
      'Production notes include observability and rollback.',
    ],
  }))
}

export const frameworkCapstoneProjectProblems: Record<string, Problem[]> = {
  nodejs: makeCapstones('nodejs', [
    {
      id: 'project-collaboration-api',
      title: 'Project Collaboration API',
      stack: 'Node.js/Express/Postgres/Redis',
      product: 'teams that create projects, invite members, assign tasks, and receive email notifications',
      features: [
        'register/login/logout or authenticated test users',
        'project CRUD',
        'membership roles',
        'invitation flow',
        'task assignment',
        'email worker job',
      ],
      data: [
        'users',
        'projects',
        'memberships with unique user/project',
        'invitations with idempotency key',
        'tasks with assignee',
        'audit log',
      ],
      productionRisks: [
        'duplicate invites',
        'authorization leaks between projects',
        'email before transaction commit',
        'missing request correlation',
      ],
    },
    {
      id: 'rate-limited-public-api',
      title: 'Rate-Limited Public API',
      stack: 'Node.js/Express/Redis/Postgres',
      product: 'developers consuming an API-key-protected public service',
      features: [
        'API key issuance',
        'per-key rate limiting',
        'usage logging',
        'pagination',
        'OpenAPI contract',
        'admin revoke key flow',
      ],
      data: [
        'api keys hashed at rest',
        'usage events',
        'rate limit counters',
        'revocation timestamps',
        'resources returned by key scope',
      ],
      productionRisks: [
        'high-cardinality metrics',
        'raw API key leaks',
        'rate limiter fail-open/fail-closed tradeoff',
        'pagination drift',
      ],
    },
    {
      id: 'durable-job-queue',
      title: 'Durable Job Queue Service',
      stack: 'Node.js/Postgres workers',
      product: 'internal services that enqueue, lease, retry, and dead-letter background work',
      features: [
        'enqueue',
        'lease next job',
        'acknowledge',
        'retry with backoff',
        'dead-letter queue',
        'worker heartbeat',
      ],
      data: [
        'jobs table',
        'attempts',
        'lease owner/deadline',
        'idempotency key',
        'dead-letter reason',
      ],
      productionRisks: [
        'two workers processing one job',
        'abandoned leases',
        'retry storms',
        'silent dead-letter growth',
      ],
    },
  ]),
  python: makeCapstones('python', [
    {
      id: 'fastapi-upload-pipeline',
      title: 'FastAPI Upload Pipeline',
      stack: 'Python/FastAPI/Postgres/worker queue',
      product: 'users uploading files for asynchronous validation and processing',
      features: [
        'create upload',
        'validate metadata',
        'store upload status',
        'enqueue processing job',
        'poll status',
        'download result',
      ],
      data: [
        'uploads',
        'processing attempts',
        'status transitions',
        'result objects',
        'idempotency keys',
      ],
      productionRisks: [
        'oversized input',
        'blocking async routes',
        'worker retry duplicates',
        'orphaned temp files',
      ],
    },
    {
      id: 'python-payments-ledger',
      title: 'Python Payments Ledger',
      stack: 'Python API/Postgres/SQLAlchemy',
      product: 'accounts that transfer balances with immutable ledger entries',
      features: [
        'create account',
        'transfer funds',
        'idempotent transfer retry',
        'read balance',
        'list ledger entries',
        'admin reversal note',
      ],
      data: [
        'accounts',
        'ledger entries',
        'transfer request idempotency keys',
        'balances or computed views',
        'audit metadata',
      ],
      productionRisks: [
        'double spending',
        'lost rollback',
        'Decimal precision loss',
        'concurrent transfer races',
      ],
    },
    {
      id: 'python-incident-ready-api',
      title: 'Incident-Ready Service',
      stack: 'Python/FastAPI or Flask/Postgres',
      product: 'a small API deliberately instrumented for debugging real incidents',
      features: [
        'health and readiness',
        'request IDs',
        'structured logs',
        'dependency timeout wrapper',
        'metrics endpoint',
        'failure injection route for tests',
      ],
      data: [
        'service configuration',
        'dependency status',
        'request/error counters',
        'latency histograms',
        'incident notes',
      ],
      productionRisks: [
        'unknown dependency latency',
        'missing correlation IDs',
        'tests that skip failure paths',
        'alerts without actionability',
      ],
    },
  ]),
  django: makeCapstones('django', [
    {
      id: 'drf-project-management',
      title: 'DRF Project Management API',
      stack: 'Django/DRF/Postgres/Celery',
      product: 'project teams with memberships, invitations, task lists, comments, and audit logs',
      features: [
        'ProjectViewSet',
        'membership roles',
        'invite action',
        'task CRUD',
        'comment creation',
        'Celery email',
      ],
      data: [
        'Project',
        'Membership',
        'Invitation',
        'Task',
        'Comment',
        'AuditLog',
      ],
      productionRisks: [
        'get_queryset leaking objects',
        'serializer side effects',
        'N+1 query explosions',
        'Celery enqueue before commit',
      ],
    },
    {
      id: 'django-migration-heavy-app',
      title: 'Migration-Heavy SaaS App',
      stack: 'Django/Postgres',
      product: 'a live SaaS app that must add slugs, roles, and audit logs without downtime',
      features: [
        'model constraints',
        'data migration',
        'expand/contract rollout',
        'backfill command',
        'query count test',
        'rollback notes',
      ],
      data: [
        'nullable slug rollout',
        'role enum',
        'audit table',
        'unique constraints',
        'indexes for list views',
      ],
      productionRisks: [
        'table locks',
        'rolling deploy incompatibility',
        'slow backfills',
        'irreversible data migration',
      ],
    },
    {
      id: 'django-admin-ops-console',
      title: 'Django Admin Ops Console',
      stack: 'Django/DRF/Admin/Celery',
      product: 'internal operators who need safe admin workflows for support and incident response',
      features: [
        'custom admin list/search',
        'restricted admin actions',
        'read-only sensitive fields',
        'support notes',
        'async resend email task',
        'audit trail',
      ],
      data: [
        'operator actions',
        'support notes',
        'audit log',
        'email task records',
        'permission groups',
      ],
      productionRisks: [
        'admin exposing private data',
        'unsafe bulk actions',
        'missing audit history',
        'slow admin queries under incident pressure',
      ],
    },
  ]),
}
