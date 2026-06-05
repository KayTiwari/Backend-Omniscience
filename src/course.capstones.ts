import type { Problem } from './course'

export const capstoneProblems: Record<string, Problem[]> = {
  capstone: [
    {
      id: 'capstone-url-shortener-production',
      title: 'Production URL Shortener Build Plan',
      type: 'design',
      difficulty: 'Boss',
      minutes: 90,
      prompt:
        'Turn the URL shortener system design into an implementation plan. Define API contracts, schema, redirect path, analytics path, caching, abuse controls, deploy plan, and dashboards.',
      explanation:
        'This capstone connects HTTP, API design, SQL, caching, observability, and security. The key production move is separating the hot redirect path from slower analytics writes so redirects stay fast while events are processed asynchronously.',
      questions: [
        'Which endpoint is latency-critical and why?',
        'Where would you use cache-aside?',
        'How do you prevent malicious or spam URLs?',
        'Which metrics tell you redirects are healthy?',
      ],
      checklist: [
        'Define create, resolve, and analytics APIs.',
        'Choose slug generation and collision handling.',
        'Separate redirect reads from analytics writes.',
        'Add abuse detection and rate limits.',
        'Define p95 redirect latency and error alerts.',
      ],
    },
    {
      id: 'capstone-auth-hardening',
      title: 'Harden The Auth Service',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 80,
      prompt:
        'Given your auth service, perform a hardening review. Find risks in registration, login, password reset, session refresh, logout, email verification, and audit logs.',
      explanation:
        'Auth is a chain, and attackers attack the weakest link. Password hashing does not save you from reset-token leakage, weak rate limits, session fixation, open redirects, missing audit trails, or account enumeration.',
      questions: [
        'Which auth responses must be deliberately generic?',
        'How should password reset tokens be stored?',
        'When should sessions be rotated?',
        'Which events belong in an audit log?',
      ],
      checklist: [
        'Use generic login/reset responses.',
        'Hash reset tokens at rest.',
        'Rotate sessions after privilege changes.',
        'Rate limit sensitive flows.',
        'Audit successful and failed security events.',
      ],
    },
    {
      id: 'capstone-ledger-concurrency',
      title: 'Ledger Concurrency Review',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 95,
      prompt:
        'Review a transfer endpoint for race conditions. Explain how you prevent double-spend, duplicate idempotency keys, partial writes, and incorrect balance reads.',
      explanation:
        'A ledger is where backend correctness becomes concrete. You need immutable entries, transactions, idempotency, constraints, and careful balance reads. A pretty API means nothing if concurrent requests can invent money.',
      questions: [
        'Why should ledger entries be append-only?',
        'Where does the idempotency key uniqueness constraint live?',
        'What should happen if two transfers hit the same account concurrently?',
        'Which tests prove the race is fixed?',
      ],
      checklist: [
        'Wrap transfer writes in a transaction.',
        'Use immutable debit/credit entries.',
        'Enforce idempotency with a unique constraint.',
        'Use row locks or atomic conditional writes.',
        'Add concurrent integration tests.',
      ],
    },
    {
      id: 'capstone-notification-reliability',
      title: 'Notification Reliability Drill',
      type: 'design',
      difficulty: 'Boss',
      minutes: 85,
      prompt:
        'Design the failure behavior for a notification system. Cover provider downtime, retries, duplicate sends, user preferences, quiet hours, templates, and delivery status.',
      explanation:
        'Notification systems look simple until reliability and user trust enter the room. You need queues, idempotent provider calls, dedupe keys, retry policies, preference checks, and a clear model for attempted vs delivered.',
      questions: [
        'Which work should happen synchronously in the request path?',
        'How do you avoid duplicate user-visible sends?',
        'What belongs in a delivery status table?',
        'How do quiet hours interact with retries?',
      ],
      checklist: [
        'Queue notification jobs.',
        'Check preferences before sending.',
        'Use idempotency/dedupe keys per recipient message.',
        'Retry transient provider failures.',
        'Track provider responses and delivery status.',
      ],
    },
    {
      id: 'capstone-observability-incident',
      title: 'Incident Command: Slow API',
      type: 'debug',
      difficulty: 'Boss',
      minutes: 70,
      prompt:
        'An API suddenly has p95 latency above 2s and 1.5% 5xx errors. Write your incident response: triage, dashboards, logs, traces, mitigation, rollback, and postmortem.',
      explanation:
        'Senior backend work is not only building systems; it is restoring them calmly. Good incident response follows evidence: scope the blast radius, identify saturation or bad deploys, mitigate first, then root cause.',
      questions: [
        'Which dashboard do you open first?',
        'How do you tell bad deploy from dependency degradation?',
        'What mitigation can reduce load immediately?',
        'What belongs in the postmortem action items?',
      ],
      checklist: [
        'Check traffic, errors, latency, saturation.',
        'Compare deploy timeline to symptom start.',
        'Inspect traces and slow queries.',
        'Define rollback or feature-disable criteria.',
        'Write follow-up prevention tasks.',
      ],
    },
    {
      id: 'capstone-system-design-defense',
      title: 'System Design Defense',
      type: 'design',
      difficulty: 'Boss',
      minutes: 75,
      prompt:
        'Pick one capstone system and defend your design under critique. Explain the simplest version, the scaling path, the data model, failure modes, and what you intentionally did not build.',
      explanation:
        'System design maturity is not maximal complexity. It is being able to justify tradeoffs, sequence the build, and say no to premature machinery while leaving a path to scale.',
      questions: [
        'What is the smallest shippable version?',
        'Which bottleneck appears first at 10x traffic?',
        'Which consistency guarantee matters most?',
        'What are you explicitly not solving yet?',
      ],
      checklist: [
        'State requirements and non-goals.',
        'Draw the core request/data flow.',
        'Choose storage and indexes.',
        'Name failure modes and mitigations.',
        'Describe the next two scaling steps.',
      ],
    },
  ],
}
