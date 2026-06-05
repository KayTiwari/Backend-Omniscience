# Backend Omniscience — Build Plan & Agent Coordination

Goal: cover **every concept in the roadmap.sh/backend roadmap** with three kinds
of practice — **explanations (lessons), quizzes (MCQ), and coding questions where
the learner writes real code that is auto-graded.**

Two agents are working this repo in parallel (Codex + Claude). To avoid
collisions we own **separate files** and never edit each other's.

## Ownership (do not edit the other agent's files)

| Area | Owner | Files |
|---|---|---|
| Course UI / navigation / progress | Codex | `src/App.tsx`, `src/*.css`, `index.html` |
| Lessons + quizzes + design/debug prompts | Codex | `src/course.ts` |
| Extra lessons/quizzes per subject | Claude | `src/course.extra.ts` |
| Auto-grader engine | Claude | `src/grader/core.ts`, `gradeJs.ts`, `jsWorker.ts`, `types.ts` |
| Coding drills (real code + tests) | Claude | `src/grader/specs.ts`, `src/grader/specs.backend.ts` |
| This plan | shared (append, don't rewrite) | `PLAN.md` |

## Integration contract

- A coding problem in `course.ts` links to a drill by `problemId`.
- UI does: `const spec = specs.find(s => s.problemId === problem.id)`, seed the
  editor with `spec.starter`, then on Run call `gradeJs(code, spec.tests)`.
- `gradeJs` returns `{ passed, results: {name,pass,message}[], timedOut?, error? }`.
- Every drill ships a `reference` solution; `selftest.ts` proves all references
  pass and broken solutions fail. **Run the self-test after adding drills.**

## Roadmap coverage checklist

Legend: L = lesson, Q = quiz, C = coding drill. Mark `[x]` when done.

### Internet & HTTP
- [x] How the internet works / request lifecycle — L (Codex), C `internet-request-line`
- [x] HTTP methods & status codes — Q (Codex), C `internet-query-parser` (parseQuery)
- [x] HTTP messages / headers — C `internet-build-response`, `internet-parse-cookies`
- [x] Content negotiation / caching headers — Q (Claude), C `internet-content-negotiation`
- [x] DNS, domains, hosting, browsers — L/Q (Codex)
- [x] TLS/HTTPS — L (Claude)

### Languages, Git, Package managers
- [x] Pick a language, package managers — L (Codex)
- [x] Git basics & workflows — L/Q (Codex)
- [x] Node.js / Python framework tracks — L/Q/C (Claude: course.extra + drills)

### Databases
- [x] SQL, indexes, transactions, isolation — L/Q/debug (Codex), C `db-hash-join`, `db-group-by`
- [x] Schema design / migrations / N+1 — design (Codex + Claude.extra)
- [x] NoSQL, replication, sharding, CAP — L/Q (Codex)

### APIs
- [x] REST, pagination, validation, versioning — (Codex), C `api-pagination`, `api-offset-paginate`, `api-validate`, `api-etag`
- [x] Webhooks / idempotency — (Claude.extra), C `architecture-idempotency`
- [x] GraphQL, gRPC, OpenAPI — L/Q (Codex)

### Auth & Security
- [x] Passwords, JWT, CSRF, SSRF, rate limits — (Codex + Claude.extra)
- [x] Coding: `security-rate-limit`, `security-token-bucket`, `security-constant-time`, `security-jwt-payload`, `security-escape-html`, `security-strong-password` (Claude)
- [x] OAuth/OpenID/SAML flows — L/Q (Codex)

### Caching
- [x] Strategies, CDN, Redis — (Codex.extra cache-aside, stampede)
- [x] Coding: `caching-lru`, `caching-memoize` (Claude)

### Architecture & Messaging
- [x] Queues, DLQ, outbox, retries, circuit breaker — (Codex + Claude.extra)
- [x] Coding: `architecture-backoff`, `architecture-circuit-breaker`, `queue-dlq` (Claude)
- [x] Patterns (monolith/microservices/serverless/12-factor) — L/Q (Codex)

### DevOps, Scale, Observability, Real-time
- [x] Docker, deploys, zero-downtime, observability — (Codex + Claude.extra)
- [x] Coding: `perf-percentile`, `perf-topk`, `perf-chunk` (Claude)
- [x] Real-time (SSE/WebSocket/polling) — C `realtime-sse-format` (Claude), L/Q (Codex)
- [x] Testing & CI/CD — L/Q (Codex)

## Interaction model (graded, not self-attested) — agreed direction

The experience must *grade*, not let the learner mark themselves done.

- **No "Mark complete" button.** Replace with **"Check solutions"**. Completion is
  derived from passing, never clicked.
- **Acceptance criteria are real, gradable questions:**
  - Knowledge problems (lesson/quiz/design/debug): each criterion becomes a
    multiple-choice question with `choices`, a correct index, and an
    `explanation`. A problem can hold several such MCQs.
  - Coding problems: the criteria are the grader `tests`; "Check solutions" runs
    `gradeJs(code, spec.tests)`.
- **"Your answers" → optional Notes only.** It never decides completion.
- **Explain on wrong/incomplete:**
  - MCQ: show which option is correct and the `explanation` of why.
  - Coding: show each failing test's message, and a "Show a correct solution"
    reveal backed by `spec.reference` (and `spec.explanation` if present).
- **State:** unanswered → attempted (some wrong) → passed. Only "passed" marks the
  problem complete.

### Data shape implications
- Quiz/MCQ item: { prompt, choices: string[], correctIndex: number, explanation }.
  A problem may carry an array of these as its acceptance criteria.
- Coding drill (GradeSpec, owned by Claude): now also has optional
  `explanation` (the "why it works") alongside `reference` and `tests`.

### Owners
- UI behavior (Check button, MCQ evaluation, explanation reveal, notes): Codex (App.tsx).
- Coding grading + reference + explanation: Claude (grader module).
- Converting existing checklists into MCQ acceptance criteria: split by subject in PLAN.

## Next up
- Codex: implement the Check-solutions UI + MCQ evaluation + explanation reveal;
  migrate checklists to MCQ acceptance criteria.
- Claude: keep adding coding drills (with explanations) and tutorials.
- Add broader capstones that combine several sections into one production-style build.
