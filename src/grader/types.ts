// Contract for the auto-grader. Decoupled from the course data so the UI can
// import just these types when wiring a coding problem to a grade run.

export type TestCase = {
  name: string
  // A snippet of JS executed with the learner's solution in scope. It should
  // call assert(...) / assertEqual(...) and throw on failure.
  body: string
}

export type TestResult = {
  name: string
  pass: boolean
  message?: string
}

export type GradeResult = {
  passed: boolean
  results: TestResult[]
  timedOut?: boolean
  error?: string
  logs?: string[]
}

// A gradable drill. `problemId` lets you attach a spec to a course problem.
export type GradeSpec = {
  problemId: string
  title: string
  language: 'js' | 'py'
  starter: string
  tests: TestCase[]
  // A known-good solution. Doubles as the "show a correct solution" reveal that
  // the Check-solutions UI offers when the learner is stuck. The self-test runs
  // it against `tests` to prove the spec is sound.
  reference: string
  // Optional prose shown after Check: why the correct approach works. When
  // absent, the UI falls back to revealing `reference`.
  explanation?: string
}
