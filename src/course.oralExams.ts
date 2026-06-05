import type { Problem } from './course'

export const oralExamProblems: Record<string, Problem[]> = {
  internet: [
    {
      id: 'oral-internet-request-defense',
      title: 'Oral Exam: One Request, All Layers',
      type: 'design',
      difficulty: 'Boss',
      minutes: 35,
      prompt:
        'Explain one API request from DNS to database and back. Your answer must include where latency, security, caching, and observability appear.',
      explanation:
        'This is the backbone explanation. If you can narrate one request across layers, you can debug production systems because every outage is some layer of this story behaving badly.',
      questions: [
        'Where can this request be cached?',
        'Where can identity be checked?',
        'Where can a timeout happen?',
        'Which logs/traces prove the request path?',
      ],
      checklist: [
        'Start with DNS and connection setup.',
        'Mention TLS and HTTP parsing.',
        'Walk through routing, auth, app logic, and DB.',
        'End with response headers/body and observability.',
      ],
    },
  ],
  sql: [
    {
      id: 'oral-db-correctness-performance',
      title: 'Oral Exam: Correctness Before Speed',
      type: 'design',
      difficulty: 'Boss',
      minutes: 35,
      prompt:
        'Defend a database design by explaining entities, constraints, indexes, transactions, and the first performance bottleneck you expect.',
      explanation:
        'Database mastery is not memorizing syntax. It is knowing which facts must be true, encoding those truths with constraints/transactions, and then making the common access paths fast with indexes.',
      questions: [
        'Which invariant belongs in the database instead of app code?',
        'Which query needs the first index?',
        'Which transaction could deadlock?',
        'Which read can tolerate staleness?',
      ],
      checklist: [
        'Name core entities and relationships.',
        'Use constraints for invariants.',
        'Choose indexes from access patterns.',
        'Discuss transaction boundaries and isolation.',
      ],
    },
  ],
  api: [
    {
      id: 'oral-api-contract-defense',
      title: 'Oral Exam: API Contract Defense',
      type: 'design',
      difficulty: 'Boss',
      minutes: 30,
      prompt:
        'Defend an API endpoint contract. Include method, path, request schema, response schema, error shape, pagination/idempotency if relevant, and versioning.',
      explanation:
        'Good APIs are boring in the best way: predictable, documented, stable, and explicit about errors. This oral exam forces you to think like both server and client.',
      questions: [
        'What can clients safely depend on?',
        'Which errors are retryable?',
        'How does this endpoint evolve without breaking old clients?',
      ],
      checklist: [
        'Use resource-oriented naming.',
        'Define schemas and status codes.',
        'Include stable error shapes.',
        'Explain backwards compatibility.',
      ],
    },
  ],
  security: [
    {
      id: 'oral-security-route-review',
      title: 'Oral Exam: Security Route Review',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 35,
      prompt:
        'Pick any state-changing endpoint and review it for authentication, authorization, validation, CSRF/CORS, rate limiting, secrets, logging, and abuse cases.',
      explanation:
        'Security review is systematic. You do not wait for intuition. You walk the route through identity, permission, input, side effects, browser behavior, abuse volume, and observability.',
      questions: [
        'Who is allowed to call this route?',
        'What input can become code, SQL, HTML, or a URL?',
        'What should be rate limited?',
        'What should never appear in logs?',
      ],
      checklist: [
        'Separate authn from authz.',
        'Validate and encode untrusted input.',
        'Include browser-specific risks.',
        'Add rate limits and audit logs.',
      ],
    },
  ],
  architecture: [
    {
      id: 'oral-architecture-boundary-choice',
      title: 'Oral Exam: Boundary Choice',
      type: 'design',
      difficulty: 'Boss',
      minutes: 40,
      prompt:
        'Choose between a module, service, queue, and external provider for a new capability. Defend the boundary using ownership, latency, failure mode, scaling, and deploy independence.',
      explanation:
        'Architecture is boundary design. The wrong boundary creates needless network hops or tangled ownership. The right boundary makes change safer and failure more contained.',
      questions: [
        'Who owns the data?',
        'Does the caller need an immediate answer?',
        'What happens when the dependency is down?',
        'Can this be a module before it is a service?',
      ],
      checklist: [
        'Define ownership.',
        'Choose sync vs async communication.',
        'Discuss failure isolation.',
        'Avoid premature service extraction.',
      ],
    },
  ],
  devops: [
    {
      id: 'oral-devops-production-readiness',
      title: 'Oral Exam: Production Readiness',
      type: 'design',
      difficulty: 'Boss',
      minutes: 35,
      prompt:
        'Before launch, prove a backend service is production-ready. Cover build, config, deploy, migrations, secrets, logs, metrics, alerts, rollback, and runbooks.',
      explanation:
        'A service is not production-ready because it works locally. It is ready when it can be deployed repeatedly, observed clearly, operated during failure, and rolled back safely.',
      questions: [
        'What fails the readiness check?',
        'Which alerts page a human?',
        'What is the rollback plan?',
        'Where is the runbook?',
      ],
      checklist: [
        'Validate config and secrets.',
        'Automate build and deploy.',
        'Define health/readiness checks.',
        'Add dashboards, alerts, and rollback steps.',
      ],
    },
  ],
}
