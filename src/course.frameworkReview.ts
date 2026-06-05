import type { Problem } from './course'

type ReviewModule = {
  id: string
  title: string
  concepts: string[]
  scenario: string
  build: string
  failure: string
}

function makeReviewProblems(prefix: string, modules: ReviewModule[]): Problem[] {
  return modules.flatMap((module, index) => {
    const order = String(index + 1).padStart(2, '0')
    const concepts = module.concepts.join(', ')
    const baseId = `${prefix}-review-${order}-${module.id}`

    return [
      {
        id: `${baseId}-tutorial`,
        title: `Review ${order}: ${module.title} Tutorial`,
        type: 'lesson',
        difficulty: index < 2 ? 'Core' : index < 4 ? 'Hard' : 'Boss',
        minutes: 35,
        prompt:
          `Study this review module, then explain how ${concepts} work together in a backend. Scenario: ${module.scenario}`,
        explanation:
          `This review ties together ${concepts}. The goal is not to memorize definitions. The goal is to build a working mental model: what receives the request, what validates it, what owns business rules, what persists durable state, what may fail, and what the client/operator observes.`,
        production:
          `In production, these concepts fail together. ${module.failure} You need to explain the failure path, the user-visible behavior, the log/metric/trace that proves it, and the smallest safe fix.`,
        walkthrough: [
          `Draw the backend slice for: ${module.scenario}`,
          `Place each concept on the diagram: ${concepts}.`,
          `Build or sketch the implementation: ${module.build}`,
          'Write the client contract: request, success response, validation error, auth error, and dependency failure.',
          'Add at least one safety mechanism: timeout, transaction, idempotency, rate limit, permission check, or schema constraint.',
          'Write a happy-path test and one failure-path test.',
          'Name the dashboard panel or log query you would use after deploy.',
        ],
        example:
          `Guided example: ${module.build} Then break it intentionally with ${module.failure} and write the guardrail that prevents the same bug from returning.`,
        questions: [
          `How does ${module.concepts[0]} influence the implementation?`,
          `Which concept in this module is the most likely production failure point?`,
          'What should be tested as a pure unit test?',
          'What requires an integration test?',
          'What should the client see when the dependency fails?',
          'What log fields make this debuggable?',
          'What metric or alert would catch the failure before users complain?',
        ],
        checklist: [
          'Can explain the concepts as one connected flow.',
          'Can sketch the implementation before coding.',
          'Can identify the highest-risk boundary.',
          'Can write tests at the right level.',
          'Can describe production observability.',
        ],
      },
      {
        id: `${baseId}-oral-exam`,
        title: `Review ${order}: ${module.title} Oral Exam`,
        type: 'quiz',
        difficulty: index < 2 ? 'Core' : index < 4 ? 'Hard' : 'Boss',
        minutes: 20,
        prompt:
          `Oral exam: A teammate asks why your design for "${module.scenario}" is production-safe. Which answer is strongest?`,
        choices: [
          'It works on my machine and the framework handles the rest.',
          'The route contract, validation, state change, failure response, tests, and observability are all explicit.',
          'The database will reject every bad state, so the API can stay thin.',
          'We can monitor it later after users start using it.',
        ],
        correctChoice: 1,
        answer:
          'A production-safe answer makes the contract, boundaries, state changes, failure behavior, tests, and observability explicit. Frameworks help, but they do not replace engineering judgment.',
        explanation:
          `This exam checks whether you can defend a backend design using evidence. For ${concepts}, you should be able to point to the contract, the code boundary, the data invariant, the test, and the production signal.`,
        production:
          `During design reviews and incidents, vague confidence is not useful. You need concrete proof: what input is accepted, what is rejected, what state changes, what retries, what rolls back, and what metric moves.`,
        walkthrough: [
          'Answer the quiz.',
          'Say the winning answer out loud in your own words.',
          `Apply it to this scenario: ${module.scenario}`,
          'Name one thing you would refuse to deploy without fixing.',
        ],
        questions: [
          'What would make the weak answers dangerous in production?',
          'Which invariant should the database enforce?',
          'Which invariant should the application enforce before the database?',
          'What test would convince a skeptical reviewer?',
        ],
        checklist: [
          'Can defend design choices under review.',
          'Can reject vague production claims.',
          'Can connect tests to risks.',
        ],
      },
    ]
  })
}

export const frameworkReviewProblems: Record<string, Problem[]> = {
  nodejs: makeReviewProblems('nodejs', [
    {
      id: 'runtime-http',
      title: 'Runtime To HTTP',
      concepts: ['V8/libuv', 'event loop phases', 'node:http', 'Express routing'],
      scenario: 'GET /health is fast, but POST /reports sometimes freezes every request for two seconds.',
      build: 'implement a tiny route and move CPU-heavy report generation out of the request path',
      failure: 'a synchronous CPU loop blocks the event loop and raises p99 latency for unrelated users',
    },
    {
      id: 'middleware-validation-errors',
      title: 'Middleware, Validation, And Errors',
      concepts: ['middleware order', 'body parsing', 'request validation', 'error middleware'],
      scenario: 'POST /users accepts bad JSON and sometimes returns stack traces to clients.',
      build: 'write validation middleware and a stable error envelope for create-user requests',
      failure: 'untrusted input crosses the boundary without validation and internal errors leak to clients',
    },
    {
      id: 'auth-rate-limit-cors',
      title: 'Auth, Rate Limits, And Browser Boundaries',
      concepts: ['Bearer auth', 'cookies/sessions', 'CORS', 'login rate limiting'],
      scenario: 'A frontend cannot call the API with cookies, while attackers are hammering login attempts.',
      build: 'configure credentialed CORS, parse auth correctly, and rate-limit by IP plus account',
      failure: 'misconfigured origins break legitimate users and weak limit keys let attackers rotate around protection',
    },
    {
      id: 'data-transactions-jobs',
      title: 'Data, Transactions, And Jobs',
      concepts: ['DB pools', 'transactions', 'queues', 'idempotent workers'],
      scenario: 'Inviting a user sometimes sends two emails or sends an email for an invitation that rolled back.',
      build: 'write transaction-first invitation logic and enqueue the email only after commit',
      failure: 'external side effects happen before durable state is committed or without idempotency keys',
    },
    {
      id: 'ops-launch',
      title: 'Operations And Launch Readiness',
      concepts: ['config validation', 'logging', 'metrics', 'graceful shutdown', 'deployment'],
      scenario: 'A deploy starts returning 500s, but logs lack request IDs and the process exits before closing the pool.',
      build: 'add startup config validation, request-scoped logs, health/readiness, metrics, and SIGTERM drain',
      failure: 'operators cannot distinguish bad config, dependency failure, or shutdown loss during an incident',
    },
  ]),
  python: makeReviewProblems('python', [
    {
      id: 'runtime-packaging-imports',
      title: 'Runtime, Packaging, And Imports',
      concepts: ['CPython', 'virtual environments', 'pyproject.toml', 'imports'],
      scenario: 'The API works locally but CI imports the wrong package and production connects to the DB at import time.',
      build: 'restructure package imports and move connection setup into application startup',
      failure: 'environment drift and import-time side effects make tests flaky and production startup fragile',
    },
    {
      id: 'types-services-errors',
      title: 'Types, Services, And Error Boundaries',
      concepts: ['type hints', 'dataclasses/models', 'service layer', 'domain exceptions'],
      scenario: 'A route mixes validation, business rules, SQL, and HTTP error formatting in one function.',
      build: 'extract command model, service function, repository, and API error translation',
      failure: 'business bugs hide behind framework code and tests become slow integration-only checks',
    },
    {
      id: 'async-clients-timeouts',
      title: 'Async, Clients, And Timeouts',
      concepts: ['asyncio', 'ASGI', 'HTTP clients', 'timeouts', 'cancellation'],
      scenario: 'A FastAPI endpoint has high p99 latency whenever a dependency is slow.',
      build: 'use an async HTTP client with connect/read timeouts and explicit dependency error mapping',
      failure: 'blocking calls or missing timeouts starve workers and make one dependency outage spread',
    },
    {
      id: 'orm-transactions-jobs',
      title: 'ORM, Transactions, And Jobs',
      concepts: ['SQLAlchemy sessions', 'transactions', 'Celery/RQ', 'idempotency'],
      scenario: 'A payment job retries after a network error and creates duplicate side effects.',
      build: 'wrap state changes in a transaction and make the worker idempotent by business key',
      failure: 'retries repeat unsafe operations because durable state and external side effects are not coordinated',
    },
    {
      id: 'testing-observability-incident',
      title: 'Testing, Observability, And Incidents',
      concepts: ['pytest', 'integration tests', 'structured logging', 'metrics', 'incident debugging'],
      scenario: 'After a deploy, 5xx rises but tests only covered the happy path and logs have no correlation IDs.',
      build: 'add failure-path tests, structured request logs, metrics, and an incident triage checklist',
      failure: 'the team cannot reproduce the failure quickly or prove the fix protects the risky branch',
    },
  ]),
  django: makeReviewProblems('django', [
    {
      id: 'request-routing-auth',
      title: 'Routing, Middleware, And Auth',
      concepts: ['URL routing', 'middleware order', 'Django auth', 'CSRF', 'security settings'],
      scenario: 'A browser client gets CSRF failures behind HTTPS and admin sessions behave strangely after deploy.',
      build: 'map middleware order and configure secure cookies, trusted origins, and proxy SSL headers',
      failure: 'proxy and cookie settings disagree with reality, so Django protects users by rejecting requests',
    },
    {
      id: 'models-querysets-performance',
      title: 'Models, QuerySets, And Performance',
      concepts: ['models', 'relationships', 'QuerySet laziness', 'select_related', 'prefetch_related'],
      scenario: 'GET /projects returns correct JSON but performs 101 queries for 50 rows.',
      build: 'scope the queryset and add the right eager-loading strategy plus a query-count test',
      failure: 'lazy ORM access in serializers creates N+1 queries that only appear with realistic data volume',
    },
    {
      id: 'migrations-transactions-side-effects',
      title: 'Migrations, Transactions, And Side Effects',
      concepts: ['migrations', 'data migrations', 'transaction.atomic', 'on_commit', 'Celery'],
      scenario: 'A required field migration locks production and a task sends email for rolled-back data.',
      build: 'plan expand/contract migration and move task enqueueing into transaction.on_commit',
      failure: 'schema changes and side effects are not compatible with rolling deploys or rollback behavior',
    },
    {
      id: 'drf-contracts-permissions',
      title: 'DRF Contracts And Permissions',
      concepts: ['serializers', 'viewsets', 'permissions', 'pagination', 'filtering', 'error shapes'],
      scenario: 'A user can infer another project exists through list filters and inconsistent errors.',
      build: 'scope get_queryset, write object permissions, allowlist filters, paginate, and normalize errors',
      failure: 'authentication exists but authorization and response contracts leak resource information',
    },
    {
      id: 'launch-ops-admin',
      title: 'Launch, Ops, And Admin Safety',
      concepts: ['admin', 'static/media', 'observability', 'health checks', 'launch checklist'],
      scenario: 'The app deploys but static assets break, admin can expose private fields, and there is no slow-query signal.',
      build: 'review collectstatic/media storage, admin permissions, Sentry/logs/metrics, and launch rollback steps',
      failure: 'operational surfaces are treated as afterthoughts even though they are production backend behavior',
    },
  ]),
}
