import type { Problem } from './course'

export const roadmapGapProblems: Record<string, Problem[]> = {
  language: [
    {
      id: 'language-package-managers',
      title: 'Package Manager Contract',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 18,
      prompt:
        'Explain what a package manager, manifest, lockfile, registry, and semantic version range do for a backend service.',
      explanation:
        'A backend is only as reproducible as its dependency graph. The manifest declares intent, the lockfile pins exact resolved versions, the registry distributes packages, and semver ranges decide what updates are allowed. Production builds should use lockfiles so deploys are repeatable.',
      questions: [
        'Why should CI install from the lockfile instead of resolving fresh versions?',
        'What risk does a broad dependency range introduce?',
        'Why do backend services care about transitive dependencies?',
      ],
      checklist: [
        'Define manifest and lockfile separately.',
        'Explain semver ranges at a high level.',
        'Describe deterministic installs in CI.',
      ],
    },
    {
      id: 'language-git-workflow',
      title: 'Git Workflow For Backend Teams',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 22,
      prompt:
        'Describe a backend-safe Git workflow from feature branch to production. Include reviews, migrations, feature flags, and rollback awareness.',
      explanation:
        'Git is not just storage for code. It is the collaboration and release history of the service. Backend changes often include schema migrations, config, deploy order, and operational risk, so the workflow must make review, checks, and rollback visible.',
      questions: [
        'Why are database migrations more dangerous than pure UI changes?',
        'When would you split one feature into multiple pull requests?',
        'What should a reviewer look for in a backend PR besides code style?',
      ],
      checklist: [
        'Use small reviewed branches.',
        'Run checks before merge.',
        'Call out migrations and deploy order.',
        'Know whether rollback is safe.',
      ],
    },
  ],
  sql: [
    {
      id: 'db-nosql-document-model',
      title: 'Document Model Tradeoffs',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Compare a relational schema with a document database model for user profiles, orders, and audit events. Decide what you would store where.',
      explanation:
        'NoSQL is not a ladder above SQL. It is a set of tradeoffs. Document databases can make aggregate reads simple and flexible, but joins, constraints, and multi-entity consistency get harder. Pick the model based on access patterns and invariants.',
      questions: [
        'Which data changes shape often enough to benefit from documents?',
        'Which data needs relational constraints?',
        'How do access patterns drive document boundaries?',
      ],
      checklist: [
        'Name one strength of document databases.',
        'Name one relational invariant that documents make harder.',
        'Tie the choice to read/write access patterns.',
      ],
    },
    {
      id: 'db-replication-sharding-cap',
      title: 'Replication, Sharding, CAP',
      type: 'design',
      difficulty: 'Hard',
      minutes: 40,
      prompt:
        'Design read scaling for a globally used product catalog. Explain replicas, replication lag, sharding, and what CAP means during a network partition.',
      explanation:
        'Replication copies data to improve reads and resilience; sharding splits data to distribute write/storage load. CAP is about what a distributed system can guarantee during a partition: you choose between serving possibly stale/partial data or refusing some operations to preserve consistency.',
      questions: [
        'Why can a read replica return stale data?',
        'What key would you shard a product catalog by and why?',
        'What does availability mean during a partition?',
      ],
      checklist: [
        'Separate replicas from shards.',
        'Discuss replication lag.',
        'Choose a shard key with tradeoffs.',
        'Explain CAP without slogans.',
      ],
    },
  ],
  api: [
    {
      id: 'api-openapi-contract',
      title: 'OpenAPI As A Contract',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 22,
      prompt:
        'Explain how OpenAPI helps backend teams build, review, test, and version REST APIs.',
      explanation:
        'OpenAPI turns an API from tribal knowledge into a contract. It can generate docs, SDKs, mock servers, schema checks, and review diffs. The contract is most valuable when it is treated as source of truth or generated reliably from source of truth.',
      questions: [
        'What breaks when API docs drift from implementation?',
        'Which parts of an endpoint should OpenAPI describe?',
        'How can CI use an OpenAPI diff?',
      ],
      checklist: [
        'Describe request and response schemas.',
        'Include status codes and errors.',
        'Use contracts in reviews and tests.',
      ],
    },
    {
      id: 'api-graphql-vs-rest',
      title: 'GraphQL vs REST',
      type: 'quiz',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'Which situation is the strongest reason to consider GraphQL over a set of REST endpoints?',
      choices: [
        'You want to avoid authentication entirely',
        'Clients need flexible, nested reads across related resources without many bespoke endpoints',
        'You never want to think about database performance',
        'You only serve one tiny internal script',
      ],
      correctChoice: 1,
      answer:
        'GraphQL shines when clients need flexible graph-shaped reads. It does not remove auth, caching, pagination, N+1, or performance concerns.',
      explanation:
        'GraphQL moves selection power to the client and centralizes a typed schema. That can reduce endpoint sprawl, but it adds resolver performance, query complexity limits, caching complexity, and schema governance.',
      questions: [
        'Why can GraphQL make N+1 problems easier to hide?',
        'What is query complexity limiting?',
        'Why is REST often simpler for command-style writes?',
      ],
      checklist: [
        'Name a GraphQL strength.',
        'Name a GraphQL operational risk.',
        'Compare schema evolution with REST versioning.',
      ],
    },
    {
      id: 'api-grpc-boundary',
      title: 'gRPC Service Boundary',
      type: 'design',
      difficulty: 'Hard',
      minutes: 30,
      prompt:
        'Decide whether internal service-to-service calls should use REST, gRPC, or messages. Use latency, streaming, contract strictness, and client ecosystem as criteria.',
      explanation:
        'gRPC is strong for typed internal contracts, low-latency calls, and streaming over HTTP/2. It is less convenient for public browser APIs and human debugging than JSON/REST. The right transport follows the boundary and failure mode.',
      questions: [
        'Why does gRPC often fit internal service calls?',
        'When is a queue better than any synchronous RPC?',
        'What do you lose compared with curl-friendly REST?',
      ],
      checklist: [
        'Compare synchronous and asynchronous boundaries.',
        'Mention typed protobuf contracts.',
        'Discuss streaming and deadline propagation.',
      ],
    },
  ],
  security: [
    {
      id: 'security-oauth-oidc',
      title: 'OAuth And OpenID Connect',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 35,
      prompt:
        'Explain the difference between OAuth 2.0 and OpenID Connect using a login-with-GitHub style flow.',
      explanation:
        'OAuth is primarily delegated authorization: one app gets scoped access to resources. OpenID Connect adds identity on top of OAuth through an ID token and standard user identity claims. Confusing access tokens and ID tokens creates serious auth bugs.',
      questions: [
        'What is an authorization code exchanged for?',
        'What is the difference between an access token and an ID token?',
        'Why should public clients use PKCE?',
      ],
      checklist: [
        'Define authorization code flow.',
        'Separate OAuth from OIDC.',
        'Mention scopes, redirect URIs, and PKCE.',
      ],
    },
    {
      id: 'security-saml-mental-model',
      title: 'SAML Mental Model',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 25,
      prompt:
        'Explain SAML SSO in enterprise terms: identity provider, service provider, assertion, signature, and metadata.',
      explanation:
        'SAML is common in enterprise SSO. The identity provider authenticates the user and sends a signed assertion to the service provider. The service provider validates signature, audience, issuer, timing, and attributes before creating a session.',
      questions: [
        'Why must assertions be signed?',
        'What is SP metadata used for?',
        'Which validation prevents an assertion for one app being used at another?',
      ],
      checklist: [
        'Identify IdP and SP roles.',
        'Validate signature and audience.',
        'Map attributes to local users safely.',
      ],
    },
  ],
  architecture: [
    {
      id: 'architecture-monolith-modular',
      title: 'Modular Monolith First',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Explain why a modular monolith is often the correct starting architecture before microservices.',
      explanation:
        'A modular monolith can enforce boundaries in one deployable unit. You avoid distributed tracing, network failures, data ownership fights, and deployment choreography until the organization or scaling profile truly needs separate services.',
      questions: [
        'What makes a monolith modular instead of tangled?',
        'Which problems do microservices add?',
        'When does splitting a service become worth it?',
      ],
      checklist: [
        'Name module boundaries.',
        'Keep data ownership clear.',
        'Avoid premature network boundaries.',
      ],
    },
    {
      id: 'architecture-twelve-factor',
      title: 'Twelve-Factor Service',
      type: 'design',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Apply twelve-factor app principles to a backend API. Focus on config, logs, backing services, processes, disposability, and dev/prod parity.',
      explanation:
        'Twelve-factor principles make services easier to deploy repeatedly. The heart of it is stateless processes, environment-based config, logs as streams, attached backing services, and fast startup/shutdown.',
      questions: [
        'Why should logs go to stdout/stderr in containerized apps?',
        'Why should local and production environments be similar?',
        'What state should never live only inside one app process?',
      ],
      checklist: [
        'Use env config.',
        'Treat backing services as attached resources.',
        'Keep processes disposable.',
        'Emit logs as streams.',
      ],
    },
    {
      id: 'architecture-serverless-fit',
      title: 'Serverless Fit Check',
      type: 'quiz',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'Which workload is usually the best fit for serverless functions?',
      choices: [
        'A long-running WebSocket server with sticky connections',
        'A short image metadata extraction task triggered by file upload',
        'A database that needs local disk durability',
        'A latency-critical service requiring warm state on every request',
      ],
      correctChoice: 1,
      answer:
        'Short event-driven tasks are a classic serverless fit. Long-lived connections, warm in-memory state, and local durability are weaker fits.',
      explanation:
        'Serverless trades server management for platform constraints: cold starts, execution limits, statelessness, provider coupling, and different observability/deploy workflows.',
      questions: [
        'What is a cold start?',
        'Why does statelessness matter more in serverless?',
        'How do execution limits shape workload choice?',
      ],
      checklist: [
        'Pick event-driven short tasks.',
        'Name serverless constraints.',
        'Consider observability and vendor coupling.',
      ],
    },
  ],
  devops: [
    {
      id: 'devops-ci-cd-pipeline',
      title: 'CI/CD Pipeline Order',
      type: 'design',
      difficulty: 'Core',
      minutes: 30,
      prompt:
        'Design a CI/CD pipeline for a backend API from pull request to production. Put each step in the order it should run.',
      explanation:
        'A good pipeline catches cheap failures early and expensive failures later. Format/lint/type checks run fast, unit tests prove logic, integration tests prove dependencies, build proves packaging, deploy uses environments, and smoke tests prove the release works.',
      questions: [
        'Why should lint/type checks run before integration tests?',
        'Where do migrations fit?',
        'What should happen after production deploy?',
      ],
      checklist: [
        'Order fast checks before slow checks.',
        'Build the deploy artifact once.',
        'Run migrations deliberately.',
        'Smoke test after deploy.',
      ],
    },
    {
      id: 'devops-testing-pyramid',
      title: 'Testing Pyramid For Backends',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 25,
      prompt:
        'Explain unit, integration, contract, end-to-end, load, and smoke tests for backend services. Put them in a practical test strategy.',
      explanation:
        'Backend tests should give fast feedback without lying. Unit tests cover pure logic, integration tests cover databases and dependencies, contract tests protect API boundaries, smoke tests verify deploys, load tests explore capacity, and end-to-end tests cover critical flows sparingly.',
      questions: [
        'Why should most tests be below end-to-end tests?',
        'What does a contract test protect?',
        'Why do smoke tests run after deploy?',
      ],
      checklist: [
        'Separate test types by purpose.',
        'Keep fast tests numerous.',
        'Use slower tests for high-value flows.',
        'Include deploy verification.',
      ],
    },
  ],
}
