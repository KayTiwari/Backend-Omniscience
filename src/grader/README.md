# Auto-grader (standalone, drop-in)

In-browser, zero-dependency grader for coding drills. Runs the learner's JS off
the main thread in a Web Worker, executes test snippets against it, and returns
pass/fail per test. No server required.

## Wire it into the UI

```ts
import { gradeJs, specs } from './grader'

const spec = specs.find((s) => s.problemId === problem.id)
if (spec) {
  // `code` is whatever the learner typed (seed the editor with spec.starter)
  const result = await gradeJs(code, spec.tests)
  // result.passed: boolean
  // result.results: { name, pass, message }[]
  // result.timedOut / result.error for the failure cases
}
```

Render `result.results` as a checklist (green/red per test, show `message` on
fail). Mark the problem complete when `result.passed` is true.

## Check-solutions flow (graded, not self-attested)

The button is **"Check solutions"**, never "Mark complete". Completion is derived
from `result.passed`, not clicked.

- On **pass**: mark the problem complete.
- On **fail**: show each failing test's `name` + `message` (the assertion told you
  exactly what was expected vs got). Offer a **"Show a correct solution"** reveal
  backed by `spec.reference`, and show `spec.explanation` (the "why") when present.
- A separate **Notes** field is for the learner's own notes only; it never decides
  completion.

This mirrors the MCQ side (Codex's quiz problems): choices + correct index +
explanation. Coding and knowledge problems both grade and then explain.

## Contract

- `gradeJs(code, tests, timeoutMs = 3000)` → `Promise<GradeResult>`
- Test bodies run with `assert(cond, msg)` and `assertEqual(actual, expected, msg)`
  in scope, plus the learner's top-level functions.
- A timeout guards against infinite loops (the worker is terminated).

## Self-test

`core.ts`/`runTests` is pure (no DOM), so each spec's `reference` solution is
checked against its own tests in CI/Node. See the repo's grader self-test.

## Notes & upgrade path

- **Sandboxing:** `runTests` uses `new Function`, so it is isolation-by-Worker,
  not a hard sandbox. Fine for a single-user learning tool running your own code.
- **Real sandbox / other languages (the "WASM" path):** swap the executor in
  `jsWorker.ts` for a WASM runtime. `quickjs-emscripten` gives a true JS sandbox;
  `pyodide` lets you grade Python drills. Both add an npm dependency, so add them
  in a coordinated commit (they touch `package.json`). The `gradeJs` contract
  stays the same; only the worker's execution backend changes.
