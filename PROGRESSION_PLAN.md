# Progression & Positioning Overhaul

Shared plan for **Codex + Claude**. Read this before working the progression/teaching
problem. Append status, do not rewrite others' sections. Ownership rules from
`PLAN.md` still apply: **never edit the other agent's files.**

Source of this plan: a roadmap.sh/backend gap audit (see `backend.pdf`). The
audit's verdict: don't clone roadmap.sh. Win a niche it does not serve.

## Positioning (the wedge)

**Backend Omniscience = backend concepts taught through request lifecycles,
failure modes, and interview answers.** roadmap.sh tells you *what* to learn; we
teach you to *explain it like an engineer who has operated it.*

Tagline to design toward: "Learn backend concepts the way senior engineers
explain them in interviews."

## Diagnosis: why the progression feels like a mess

1. **Within-subject order is arbitrary.** `course.ts` builds each subject's
   `problems` by concatenating ~10 arrays (progression, tutorial, moreTutorial,
   longTutorial, deepDive, roadmapGap, graderDrill, extra, oralExam, capstone).
   Learners get lessons, drills, and quizzes interleaved with no learn-then-do arc.
2. **Subject order is not pedagogical.** Drill subjects (JavaScript Fundamentals,
   Algorithms, etc.) render *after* System Design. Fundamentals should be early;
   System Design last.
3. **Missing layers the audit calls the "money":** the interview-answer triad,
   a request-lifecycle spine, concept-attached projects, and confidence scoring.
4. Topic coverage itself is mostly fine — almost every roadmap node is already
   present. This is an ordering + layering problem, not a "add 100 topics" problem.

## Target learning track (canonical order)

Codex sets the overall `subjects` array order in `course.ts`. Claude orders the
subjects it owns inside `course.extra.ts`. Agreed order:

```
0.  Start Here / Programming Fundamentals   (language, js-fundamentals)
1.  Internet & HTTP                         (internet)
2.  APIs                                     (api)
3.  Auth & Security                          (security)
4.  Databases / SQL                          (sql)
5.  Caching & Performance                    (performance + caching drills)
6.  Queues & Async / Background Jobs         (architecture)
7.  Files / Object Storage                   (gap — add small)
8.  Observability & Ops                      (observability-ops, devops observability)
9.  Deployment / DevOps                      (devops)
10. Scaling & Distributed Systems            (distributed)
11. System Design                            (system-design)
--- parallel tracks (after the spine) ---
12. Language & Framework tracks              (typescript, nodejs, python, flask, django)
13. Practice drill tracks                    (algorithms, utilities, http-networking, ...)
14. Projects                                 (projects.ts — see below)
15. Capstones
```

## Within-subject phase order (the learn-then-defend arc)

Codex sorts each subject's merged `problems` by a phase rank so every subject reads:

```
Start Here glossary (tutorial)  ->  Learn (lessons)  ->  Check (quiz)
  ->  Code (coding drills)  ->  Debug/Design  ->  Project  ->  Defend (oral exam)
```

Suggested rank by `type`: glossary/lesson = 0, quiz = 1, coding = 2, debug = 3,
design = 4, project = 5, oral-exam = 6. Stable-sort within a rank to preserve
authored order. (Keeps existing content; only reorders.)

## The four missing layers

### Layer A — Interview-answer triad  (Claude writes content, Codex renders)
Every core concept gets three escalating answers:
- **simple** — one sentence a junior could say.
- **senior** — how a senior frames it (mechanism + tradeoff).
- **systemDesign** — where it fits in a real system / failure modes it guards.

Example (idempotency): simple "duplicate requests don't cause duplicate effects";
senior "idempotency key stored with request state so retries return the original
result"; systemDesign "protects payment/loan flows from retries, refreshes, queue
redelivery, client timeouts."

- **Claude** creates `src/interviewAnswers.ts` (see contract below).
- **Codex** renders an "Explain it in an interview" panel on the problem/subject
  page (collapsible: Simple / Senior / System design).

### Layer B — Request-lifecycle spine  (Claude content, Codex view)
A "follow the request" mode: submit -> route -> auth -> validation -> service ->
DB txn -> queue -> logs/traces (request id) -> response -> retry/idempotency. Each
hop links to the subject that teaches it and one failure mode.
- **Claude** creates `src/requestLifecycle.ts` (ordered hops + blurb + failure +
  subjectId link).
- **Codex** builds the interactive lifecycle view (its own component; can reuse
  the existing internet diagram styling).

### Layer C — Projects attached to concepts  (Claude content, Codex view)
Project prompts that bundle concepts (URL shortener, webhook receiver, email queue
service, mini loan API, file-upload/redaction API, expense tracker). Each lists the
concepts it exercises and 4-6 build steps; link steps to existing gradable drills by
`problemId` where one fits.
- **Claude** creates `src/projects.ts` (see contract).
- **Codex** adds a Projects view/section and (optional) links from each subject to
  the projects that use it.

### Layer D — Confidence scoring  (Codex owns)
Replace binary "complete" with a per-problem (or per-subject) ladder:
`Not started -> Learned -> Can explain -> Can build -> Can defend`. "Can defend"
ties to the oral-exam / interview-triad. UI + persistence is Codex (`App.tsx`,
progress state). Claude's drills already provide the "Can build" signal (tests pass).

## Integration contracts for new Claude-owned files

```ts
// src/interviewAnswers.ts  (Claude)
export type InterviewAnswer = {
  key: string          // subjectId or concept slug, e.g. 'api-idempotency'
  topic: string        // display name
  subjectId: string    // which subject it belongs under
  simple: string
  senior: string
  systemDesign: string
}
export const interviewAnswers: InterviewAnswer[]
// Codex: group by subjectId; show on that subject's problems.

// src/requestLifecycle.ts  (Claude)
export type LifecycleHop = {
  id: string; label: string; blurb: string;
  failureMode: string; subjectId: string;   // deep-link target
}
export const requestLifecycle: LifecycleHop[]  // ordered

// src/projects.ts  (Claude)
export type ProjectStep = { text: string; drillId?: string } // drillId = grader problemId
export type Project = {
  id: string; title: string; pitch: string;
  concepts: string[]; subjectIds: string[];
  steps: ProjectStep[]; stretch: string[];
}
export const projects: Project[]
```

## Remaining topic gaps to add (low priority — content mostly exists)

Most audit rows are already ✅. Genuinely thin / missing:
- **Files / Object Storage** (uploads, S3/R2, signed URLs) — small subject + 2-3 drills. (Claude drills + Codex/Claude lessons)
- **API extras**: OpenAPI/Swagger shape, webhooks lifecycle (have verify drill; add a lesson). (split)
- **Caching**: cache-invalidation framing, CDN, HTTP cache headers lesson. (have drills; add lesson) (Codex/Claude)
- "Medium/Later" rows (GraphQL, gRPC, Kubernetes, Terraform, DDD, CQRS): **do not chase yet.**

## Divvy / ownership for this overhaul

| Task | Owner | File(s) |
|---|---|---|
| Canonical subject order (overall) | Codex | `src/course.ts` |
| Within-subject phase sort | Codex | `src/course.ts` |
| Order Claude's own subjects | Claude | `src/course.extra.ts` |
| Interview-answer triad **content** | Claude | `src/interviewAnswers.ts` (new) |
| Interview-answer **panel** | Codex | `src/App.tsx`, css |
| Request-lifecycle **data** | Claude | `src/requestLifecycle.ts` (new) |
| Request-lifecycle **view** | Codex | `src/App.tsx` (new component), css |
| Projects **content** | Claude | `src/projects.ts` (new) |
| Projects **view** | Codex | `src/App.tsx`, css |
| Confidence scoring (ladder + state) | Codex | `src/App.tsx`, progress model |
| Files/Object Storage drills | Claude | `src/grader/specs.backend.ts`, `course.extra.ts` |
| Files/Object Storage + caching lessons | Codex | `src/course.ts` |
| Teaching `interview` field -> link to triad | Codex | `src/problemTeaching.ts` |

## Phased rollout (check off as done)

**P0 — fix the spine (do first):**
- [x] Codex: reorder `subjects` to the canonical track order.
- [x] Codex: phase-sort problems within each subject.
- [ ] Claude: reorder `course.extra.ts` subjects; confirm fundamentals/practice land sensibly.

**P1 — the interview wedge:**
- [x] Claude: `src/interviewAnswers.ts` — 22 concept triads across the spine subjects. READY TO RENDER.
- [x] Codex: render the interview triad panel.
- [x] Claude: `src/requestLifecycle.ts` — 11 ordered hops with failure modes + subjectId links. READY TO RENDER.
- [x] Codex: "follow the request" view.

**P2 — projects + confidence:**
- [x] Claude: `src/projects.ts` — 6 projects, all step `drillId`s validated against existing specs. READY TO RENDER.
- [x] Codex: Projects view + confidence ladder.

**P3 — fill thin gaps:**
- [x] Claude: Files/Object Storage subject — 8 drills + from-zero glossary + interview triad. DONE.
- [x] Codex: Caching-invalidation / CDN / HTTP-cache-headers lessons (drills + interview triad already exist).

## Phase 2 — deepen the wedge (interview fluency)

The skeleton is shipped. Phase 2 makes the interview-fluency angle real and closes
the two open UX threads.

**Claude (content + grader):**
- [x] Expand `interviewAnswers.ts` — now **54 triads** across all spine subjects. READY TO RENDER.
- [x] Author concept-specific **Quick Write** content in `src/quickWrite.ts` — 12 prompts
      with expected-answer bullets + production anchors. READY TO RENDER. Contract:
      ```ts
      export type QuickWrite = {
        subjectId: string
        prompt: string           // concept-specific recall prompt (not "explain this idea")
        expected: string[]       // bullets a strong answer must hit
        productionAnchor: string // a real production/debug situation it maps to
      }
      export const quickWrites: QuickWrite[]
      ```
- [ ] (optional) Code-split the grader (dynamic-import Pyodide / TS CDN) to cut the
      ~927 kB bundle.

**Codex (UI + course.ts):**
- [x] Quick Write TODO: render `quickWrites` (prompt -> user writes -> reveal
      expected bullets + production anchor). Replaces the generic recall text.
- [x] Add progressive one-at-a-time unlocks for existing guided/solution MCQ stacks.
- [ ] Add quiz variety beyond MCQ where data supports it: short-answer compare,
      ordering/matching, predict-the-output, and small scenario cards.
- [ ] Keep instant per-question feedback visible for every quiz/check interaction.
- [x] Wire the confidence ladder's **"Can defend"** rung to the oral-exam /
      interview-triad content.
- [x] Make the top page progress bar visibly readable.
- [x] Add a collapsible sidebar/nav so lessons can take center stage.
- [x] Fix the `Apply` mastery step so it is not automatically checked before the learner attempts/checks the prompt.
- [x] Smooth the top progress bar with transform-based scroll tracking.
- [x] Move the sidebar collapse control to a slim edge-tab drawer handle.
- [x] Replace broad hover lift motion with subtler border/shine feedback.

**Current UX audit**
- Per-question feedback exists for guided tutorial checks, solution checks, and normal quiz choices.
- Existing guided/solution MCQ stacks now reveal progressively instead of dumping every question at once.
- The open gap is richer interaction variety beyond MCQ.
- `Can defend` is now explicitly gated by marking interview/defense practice after reviewing the triad.

## Status log (append one line per change)
- 2026-06-05 Claude: created this plan.
- TODO Codex: loop through every Quick Write prompt/model answer and replace generic "this idea" style recall with concept-specific prompts, concrete expected-answer bullets, and production/debug anchors.
- 2026-06-05 Claude: shipped P1 content (`interviewAnswers.ts`, `requestLifecycle.ts`) + P2 content (`projects.ts`). All type-clean; project drillIds validated. Codex can render against the contracts above.
- 2026-06-05 Codex: shipped P0 ordering, P1 interview/lifecycle UI, P2 projects/confidence UI; full check passing locally.
- 2026-06-05 Claude: shipped P3 Files & Object Storage (subject `files-storage`: 8 graded drills, glossary tutorial, interview triad). 0 orphans. Remaining for Codex: master ordering (P0), render P1/P2 layers, caching/CDN lessons.
- 2026-06-05 Codex: added Performance lessons for cache invalidation, CDNs, and HTTP cache headers.
- 2026-06-05 Codex: audited quiz UX; existing MCQ checks now reveal progressively with per-question feedback instead of dumping full stacks.
- 2026-06-05 Codex: rendered Claude's `quickWrites`, gated `Can defend` behind interview practice, improved scroll progress visibility, added collapsible sidebar, and fixed auto-checked Apply.
- 2026-06-05 Codex: polished lesson-focus UX: smoother scroll progress, edge-tab nav collapse handle, and quieter hover states.
- 2026-06-05 Claude: Phase 2 content shipped — interviewAnswers.ts expanded to 54 triads; new quickWrite.ts (12 concept-specific recall prompts). Both wired by subjectId, ready for Codex to render.
- 2026-06-05 Codex: promoted Python drills into a Python Fundamentals track with five from-zero lessons plus 57 auto-graded drills.
