import type { Problem, Subject } from './course'

type SubjectTeaching = {
  picture: string
  mentalModel: string
  fundamentals: string[]
  diagram: string[]
  tutorial: string[]
  advanced: string[]
  interview: string[]
}

export type TeachingModel = SubjectTeaching & {
  problemIntro: string
  practiceMode: string
}

const subjectTeaching: Record<string, SubjectTeaching> = {
  internet: {
    picture: 'Client -> DNS -> TCP -> TLS -> HTTP -> Proxy -> App -> Database -> JSON',
    mentalModel:
      'The web stack is a layered delivery system. Each layer has one job: find the server, connect to it, protect bytes, describe the request, route it, execute backend code, read/write data, then return a response.',
    fundamentals: [
      'DNS (Domain Name System) is the internet phonebook: it turns a human name like api.example.com into an IP address a computer can connect to.',
      'TCP (Transmission Control Protocol) opens a reliable connection between two machines, keeps bytes in order, and resends missing data when packets are lost.',
      'TLS (Transport Layer Security) sits on top of TCP for HTTPS: it verifies the server certificate and encrypts traffic so intermediaries cannot read or tamper with it.',
      'HTTP (Hypertext Transfer Protocol) is the web request/response language: it defines methods like GET/POST, paths like /users/42, headers, status codes, and response bodies such as JSON.',
    ],
    diagram: ['URL', 'DNS', 'TCP', 'TLS', 'HTTP', 'Proxy', 'App', 'DB', 'Response'],
    tutorial: ['Read the URL into scheme, host, path, and query.', 'Name what each network layer adds before the app sees anything.', 'Separate infrastructure behavior from application code.', 'End by explaining response status, headers, body, and caching.'],
    advanced: ['HTTP/2 multiplexing', 'CDN/cache validation', 'proxy timeouts', 'TLS termination', 'trace propagation'],
    interview: ['Never say DNS returns a full URL.', 'Do not mix up TCP and TLS.', 'Mention at least one failure mode per layer.', 'Tie answers to logs, traces, or packet-level evidence.'],
  },
  language: {
    picture: 'Input -> parse -> transform -> validate -> handle errors -> test -> ship',
    mentalModel:
      'Backend language skill is the ability to turn messy inputs into correct outputs while keeping logic testable, errors explicit, and side effects isolated.',
    fundamentals: ['control flow', 'collections', 'functions', 'errors', 'files', 'tests'],
    diagram: ['Input', 'Types', 'Logic', 'Errors', 'Tests', 'Runtime'],
    tutorial: ['Find the input shape.', 'Write the smallest pure transformation.', 'Add invalid input behavior.', 'Wrap side effects at the edge.', 'Prove behavior with tests.'],
    advanced: ['concurrency model', 'memory usage', 'dependency management', 'runtime profiling', 'graceful shutdown'],
    interview: ['Explain tradeoffs in plain language.', 'Use edge cases.', 'Prefer readable code over cleverness.', 'Show how you would test it.'],
  },
  sql: {
    picture: 'Entities -> constraints -> queries -> indexes -> transactions -> migrations',
    mentalModel:
      'Databases protect facts. Start with invariants, model relationships, write queries from access patterns, and use indexes/transactions to make the common paths correct and fast.',
    fundamentals: ['tables', 'primary keys', 'foreign keys', 'joins', 'indexes', 'transactions'],
    diagram: ['Entity', 'Constraint', 'Query', 'Index', 'Transaction', 'Migration'],
    tutorial: ['Name the facts that must always be true.', 'Model entities and relationships.', 'Write the reads and writes.', 'Choose indexes from those queries.', 'Define transaction boundaries.'],
    advanced: ['isolation levels', 'deadlocks', 'query plans', 'replication lag', 'online migrations'],
    interview: ['Start with invariants.', 'Explain indexes from queries.', 'Know N+1 symptoms.', 'Discuss migration and rollback risk.'],
  },
  api: {
    picture: 'Client contract -> validation -> service -> response -> versioning',
    mentalModel:
      'An API is a contract between clients and backend behavior. Good APIs are predictable about resources, schemas, errors, pagination, idempotency, and compatibility.',
    fundamentals: ['resource naming', 'HTTP methods', 'status codes', 'request schemas', 'response schemas', 'error envelopes'],
    diagram: ['Client', 'Route', 'Validate', 'Service', 'Serialize', 'Error/Status'],
    tutorial: ['Define the client need.', 'Pick method and path.', 'Specify request and response shapes.', 'Handle errors explicitly.', 'Plan versioning and compatibility.'],
    advanced: ['cursor pagination', 'idempotency keys', 'webhooks', 'OpenAPI', 'GraphQL/gRPC tradeoffs'],
    interview: ['Use concrete status codes.', 'Explain retry behavior.', 'Design stable error shapes.', 'Mention backward compatibility.'],
  },
  security: {
    picture: 'Threat -> trust boundary -> validation -> authn -> authz -> audit',
    mentalModel:
      'Security starts by asking who can send data, what they can control, what they are allowed to do, and what evidence you retain when something goes wrong.',
    fundamentals: ['trust boundaries', 'authentication', 'authorization', 'input validation', 'secret handling', 'audit logs'],
    diagram: ['Attacker', 'Input', 'Authn', 'Authz', 'Data', 'Audit'],
    tutorial: ['Identify the attacker-controlled input.', 'Authenticate the caller.', 'Authorize the object/action.', 'Validate and encode data.', 'Log security-relevant decisions.'],
    advanced: ['OAuth/OIDC', 'CSRF', 'SSRF', 'JWT pitfalls', 'password hashing parameters'],
    interview: ['Separate authn from authz.', 'Never roll your own crypto.', 'Validate at boundaries.', 'Explain the attacker model.'],
  },
  architecture: {
    picture: 'Boundary -> module/service -> data ownership -> async work -> failure recovery',
    mentalModel:
      'Architecture is controlled separation. You decide what owns data, what runs synchronously, what moves to a queue, and how the system recovers when pieces fail.',
    fundamentals: ['modules', 'service boundaries', 'queues', 'retries', 'idempotency', 'consistency'],
    diagram: ['API', 'Service', 'DB', 'Queue', 'Worker', 'DLQ'],
    tutorial: ['Draw the boundary.', 'Choose synchronous vs asynchronous work.', 'Define data ownership.', 'Add retries and idempotency.', 'Plan observability and recovery.'],
    advanced: ['outbox pattern', 'sagas', 'circuit breakers', 'backpressure', 'eventual consistency'],
    interview: ['Clarify consistency requirements.', 'Do not default to microservices.', 'Explain failure recovery.', 'Show ownership boundaries.'],
  },
  devops: {
    picture: 'Code -> build -> config -> deploy -> health -> observe -> rollback',
    mentalModel:
      'Delivery work makes code repeatable and operable. The service must build the same way, boot from environment config, expose health, and be observable during rollout.',
    fundamentals: ['build artifacts', 'containers', 'environment config', 'health checks', 'CI/CD', 'rollback'],
    diagram: ['Code', 'CI', 'Image', 'Config', 'Deploy', 'Health', 'Rollback'],
    tutorial: ['Build a reproducible artifact.', 'Inject config at runtime.', 'Run checks before deploy.', 'Use readiness before traffic.', 'Watch metrics and logs after release.'],
    advanced: ['zero-downtime deploys', 'secret rotation', 'migration ordering', 'canaries', 'capacity planning'],
    interview: ['Separate build-time and runtime config.', 'Know rollback limits.', 'Explain readiness vs liveness.', 'Mention migration safety.'],
  },
  performance: {
    picture: 'Measure -> identify bottleneck -> change one thing -> verify -> guardrail',
    mentalModel:
      'Performance is evidence-driven. You measure latency, throughput, resource use, and query behavior before choosing caches, indexes, batching, or concurrency changes.',
    fundamentals: ['latency', 'throughput', 'p95/p99', 'query count', 'caching', 'capacity'],
    diagram: ['Measure', 'Profile', 'Bottleneck', 'Fix', 'Verify', 'Alert'],
    tutorial: ['Define the user-visible slowness.', 'Measure p95/p99 and error rate.', 'Break time into app, DB, network, and external calls.', 'Apply the smallest fix.', 'Add a regression guard.'],
    advanced: ['load testing', 'cache stampede prevention', 'connection pooling', 'hot partitions', 'backpressure'],
    interview: ['Do not optimize blind.', 'Use percentiles, not just averages.', 'Name bottleneck evidence.', 'Explain cache invalidation risk.'],
  },
  'system-design': {
    picture: 'Requirements -> estimates -> APIs -> data -> scale -> failure modes',
    mentalModel:
      'System design is structured tradeoff narration. Requirements drive traffic estimates, estimates drive storage/API choices, and failure modes drive resilience.',
    fundamentals: ['requirements', 'traffic estimates', 'API design', 'data model', 'storage choice', 'failure modes'],
    diagram: ['Requirements', 'Estimate', 'API', 'Data', 'Scale', 'Failures'],
    tutorial: ['Ask clarifying questions.', 'Estimate reads, writes, and storage.', 'Design APIs and data model.', 'Identify bottlenecks.', 'Add reliability and observability.'],
    advanced: ['partitioning', 'multi-region design', 'consistency tradeoffs', 'disaster recovery', 'evolution over time'],
    interview: ['Clarify before designing.', 'Estimate out loud.', 'Trade off explicitly.', 'Return to requirements at the end.'],
  },
  capstone: {
    picture: 'Product goal -> API -> data -> code -> tests -> deploy -> runbook',
    mentalModel:
      'Capstones combine every backend layer. The goal is not just working code; it is a service with contracts, correctness, tests, deployment, monitoring, and recovery.',
    fundamentals: ['scope', 'contracts', 'data model', 'tests', 'deployment', 'runbook'],
    diagram: ['Scope', 'API', 'DB', 'Service', 'Tests', 'Deploy', 'Operate'],
    tutorial: ['Write the product goal.', 'Define contracts and data.', 'Build core paths.', 'Add tests and failure handling.', 'Deploy with observability and a runbook.'],
    advanced: ['cross-cutting auth', 'background jobs', 'migrations', 'incident drills', 'load testing'],
    interview: ['Tell the end-to-end story.', 'Justify tradeoffs.', 'Show rollback strategy.', 'Connect code to operations.'],
  },
  typescript: {
    picture: 'Unknown input -> runtime validation -> typed DTO -> service result -> HTTP response',
    mentalModel:
      'TypeScript makes internal contracts explicit, but runtime data is still untrusted. The backend pattern is validate unknown input, narrow it, then pass typed data through services and repositories.',
    fundamentals: ['primitive types', 'object shapes', 'unions', 'narrowing', 'generics', 'unknown over any'],
    diagram: ['Unknown', 'Validate', 'Narrow', 'DTO', 'Service', 'Result'],
    tutorial: ['Start with unknown at the boundary.', 'Validate required fields.', 'Use precise types for internal code.', 'Return discriminated results.', 'Map results to HTTP responses.'],
    advanced: ['branded IDs', 'mapped types', 'strict tsconfig', 'exhaustive never checks', 'type-only imports'],
    interview: ['Types do not validate JSON at runtime.', 'Use discriminated unions for state.', 'Avoid any at boundaries.', 'Explain strict mode flags.'],
  },
  'typescript-drills': {
    picture: 'Type annotation -> compiler feedback -> implementation -> tests -> safer refactor',
    mentalModel:
      'TypeScript drills train two muscles at once: writing JavaScript behavior and expressing the contract so the compiler catches misuse before runtime.',
    fundamentals: ['function signatures', 'arrays/tuples', 'interfaces', 'unions', 'generics', 'utility types'],
    diagram: ['Signature', 'Types', 'Implement', 'Compile', 'Test'],
    tutorial: ['Read the expected function signature.', 'Model the input and output types first.', 'Implement the runtime behavior.', 'Let compiler errors guide the contract.', 'Run tests and explain the edge case.'],
    advanced: ['generic constraints', 'keyof access', 'mapped types', 'readonly contracts', 'literal unions'],
    interview: ['Say what the compiler proves.', 'Say what runtime tests still prove.', 'Use generics only when they preserve information.', 'Prefer readable types over type gymnastics.'],
  },
  nodejs: {
    picture: 'Request -> event loop -> async IO -> service code -> response/error',
    mentalModel:
      'Node.js is built around an event loop and non-blocking IO. Backend skill means keeping CPU work controlled, async errors handled, streams backpressured, and process config explicit.',
    fundamentals: ['event loop', 'modules', 'npm scripts', 'async/await', 'streams', 'process env'],
    diagram: ['Request', 'Event Loop', 'Async IO', 'Service', 'Error Handler', 'Response'],
    tutorial: ['Keep route handlers thin.', 'Parse and validate input.', 'Await dependencies with timeouts.', 'Centralize errors.', 'Log request ids and outcomes.'],
    advanced: ['stream backpressure', 'worker threads', 'process lifecycle', 'timeouts/retries', 'observability hooks'],
    interview: ['Explain why CPU blocks the loop.', 'Know Promise rejection paths.', 'Use streams for large payloads.', 'Do not hide config in code.'],
  },
  python: {
    picture: 'Input -> Python data structures -> typed function -> exception/result -> tests',
    mentalModel:
      'Python backend code should be explicit about data shape, errors, dependencies, and tests. Dynamic typing is powerful, but production code still needs contracts and validation.',
    fundamentals: ['dict/list/set/tuple', 'functions', 'exceptions', 'modules', 'typing', 'virtual environments'],
    diagram: ['Input', 'Data', 'Function', 'Error', 'Test', 'Package'],
    tutorial: ['Write the simplest function.', 'Use built-in data structures intentionally.', 'Handle invalid input explicitly.', 'Add type hints where they clarify contracts.', 'Parametrize tests.'],
    advanced: ['asyncio cancellation', 'GIL implications', 'context managers', 'packaging', 'serialization boundaries'],
    interview: ['Know mutable default pitfalls.', 'Explain the GIL accurately.', 'Prefer explicit exceptions.', 'Show pytest parametrization.'],
  },
  'python-drills': {
    picture: 'Syntax -> small function -> edge case -> test feedback -> fluency',
    mentalModel:
      'Python drills build fluency from tiny mechanics: loops, methods, comprehensions, dictionaries, slicing, exceptions, decorators, and testable functions.',
    fundamentals: ['for/while loops', 'string methods', 'list methods', 'dict methods', 'slicing', 'comprehensions'],
    diagram: ['Read', 'Loop', 'Transform', 'Return', 'Test'],
    tutorial: ['Read the function name and examples.', 'Choose the simplest Python construct.', 'Handle empty or invalid input.', 'Return exactly the expected shape.', 'Explain the idiom you used.'],
    advanced: ['decorators', 'memoization', 'iterators', 'context managers', 'async functions'],
    interview: ['Use idiomatic Python but keep it obvious.', 'Mention complexity when relevant.', 'Test empty inputs.', 'Know when comprehension hurts readability.'],
  },
  flask: {
    picture: 'WSGI request -> Flask route -> request context -> service -> response',
    mentalModel:
      'Flask is intentionally small. It gives routing, request/response helpers, and extension hooks; you must design structure, validation, persistence, auth, and tests deliberately.',
    fundamentals: ['app factory', 'routes', 'request context', 'blueprints', 'config', 'extensions'],
    diagram: ['WSGI', 'App', 'Route', 'Service', 'DB Session', 'Response'],
    tutorial: ['Create the app factory.', 'Register blueprints.', 'Validate request data.', 'Call a service layer.', 'Manage DB session scope.', 'Test with the Flask client.'],
    advanced: ['WSGI lifecycle', 'SQLAlchemy sessions', 'auth extensions', 'background jobs', 'production server config'],
    interview: ['Explain request context.', 'Use app factory for tests.', 'Keep business logic out of routes.', 'Know what Flask does not include.'],
  },
  django: {
    picture: 'URLConf -> view/DRF action -> serializer -> ORM -> response',
    mentalModel:
      'Django is batteries-included: routing, ORM, migrations, auth, admin, middleware, and settings. Mastery means using the defaults while knowing where query, migration, and permission bugs hide.',
    fundamentals: ['project/apps', 'models', 'migrations', 'views', 'serializers/forms', 'settings'],
    diagram: ['URL', 'View', 'Serializer', 'Permission', 'ORM', 'Response'],
    tutorial: ['Model data with constraints.', 'Create safe migrations.', 'Validate with serializers/forms.', 'Optimize ORM reads.', 'Apply permissions.', 'Test API behavior.'],
    advanced: ['select_related/prefetch_related', 'transaction.atomic', 'middleware', 'signals tradeoffs', 'async caveats'],
    interview: ['Call out N+1 quickly.', 'Respect migration safety.', 'Separate validation from constraints.', 'Know DRF permission flow.'],
  },
}

const fallback: SubjectTeaching = {
  picture: 'Concept -> example -> implementation -> tests -> production behavior',
  mentalModel:
    'Every backend concept should be learned in layers: define the idea, see a small example, implement or reason about it, test it, then connect it to production behavior.',
  fundamentals: ['definition', 'inputs', 'outputs', 'boundaries', 'failure modes', 'tests'],
  diagram: ['Define', 'Example', 'Build', 'Test', 'Operate'],
  tutorial: ['Define the concept.', 'Walk through a tiny example.', 'Name failure behavior.', 'Prove it with checks.', 'Connect it to production.'],
  advanced: ['scale', 'operability', 'tradeoffs', 'debugging', 'evolution'],
  interview: ['Start simple.', 'Use a concrete example.', 'Name tradeoffs.', 'Mention tests and production evidence.'],
}

function modeFor(problem: Problem) {
  if (problem.type === 'coding') return 'Implement the smallest working version, run tests, then explain why each failing case failed.'
  if (problem.type === 'quiz') return 'Study the model first, then answer. The point is not guessing; it is recognizing the correct production behavior.'
  if (problem.type === 'debug') return 'Start with symptoms and evidence. Avoid changing code until you can name the likely layer and failure mode.'
  if (problem.type === 'design') return 'Clarify requirements, draw boundaries, name data and failure modes, then defend tradeoffs.'
  return 'Read the model, replay it in your own words, then use the prompt to prove you can apply it.'
}

export function getTeachingModel(subject: Subject, problem: Problem): TeachingModel {
  const base = subjectTeaching[subject.id] ?? fallback
  return {
    ...base,
    practiceMode: modeFor(problem),
    problemIntro: `For "${problem.title}", learn the ${subject.title} mental model before answering. This problem is a ${problem.type} exercise, so the target is understanding first, then proof.`,
  }
}
