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
- [x] HTTP methods & status codes — Q (Codex), C `internet-status-codes` (parseQuery)
- [x] HTTP messages / headers — C `internet-build-response`, `internet-parse-cookies`
- [x] Content negotiation / caching headers — Q (Claude), C `internet-content-negotiation`
- [ ] DNS, domains, hosting, browsers — L/Q (Codex)
- [x] TLS/HTTPS — L (Claude)

### Languages, Git, Package managers
- [ ] Pick a language, package managers — L (Codex)
- [ ] Git basics & workflows — L/Q (Codex)
- [x] Node.js / Python framework tracks — L/Q/C (Claude: course.extra + drills)

### Databases
- [x] SQL, indexes, transactions, isolation — L/Q/debug (Codex), C `db-hash-join`, `db-group-by`
- [x] Schema design / migrations / N+1 — design (Codex + Claude.extra)
- [ ] NoSQL, replication, sharding, CAP — L/Q (Codex)

### APIs
- [x] REST, pagination, validation, versioning — (Codex), C `api-pagination`, `api-offset-paginate`, `api-validate`, `api-etag`
- [x] Webhooks / idempotency — (Claude.extra), C `architecture-idempotency`
- [ ] GraphQL, gRPC, OpenAPI — L/Q (Codex)

### Auth & Security
- [x] Passwords, JWT, CSRF, SSRF, rate limits — (Codex + Claude.extra)
- [x] Coding: `security-rate-limit`, `security-token-bucket`, `security-constant-time`, `security-jwt-payload`, `security-escape-html`, `security-strong-password` (Claude)
- [ ] OAuth/OpenID/SAML flows — L/Q (Codex)

### Caching
- [x] Strategies, CDN, Redis — (Codex.extra cache-aside, stampede)
- [x] Coding: `caching-lru`, `caching-memoize` (Claude)

### Architecture & Messaging
- [x] Queues, DLQ, outbox, retries, circuit breaker — (Codex + Claude.extra)
- [x] Coding: `architecture-backoff`, `architecture-circuit-breaker`, `queue-dlq` (Claude)
- [ ] Patterns (monolith/microservices/serverless/12-factor) — L/Q (Codex)

### DevOps, Scale, Observability, Real-time
- [x] Docker, deploys, zero-downtime, observability — (Codex + Claude.extra)
- [x] Coding: `perf-percentile`, `perf-topk`, `perf-chunk` (Claude)
- [x] Real-time (SSE/WebSocket/polling) — C `realtime-sse-format` (Claude), L/Q (Codex)
- [ ] Testing & CI/CD — L/Q (Codex)

## Next up
- Claude: keep adding coding drills (target real code for every section above).
- Codex: lessons + quizzes for the unchecked `[ ]` rows, and wire `gradeJs` into
  the coding-problem UI (editor + run + results).
