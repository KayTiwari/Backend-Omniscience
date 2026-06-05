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
}

// A gradable drill. `problemId` lets you attach a spec to a course problem.
export type GradeSpec = {
  problemId: string
  title: string
  language: 'js'
  starter: string
  tests: TestCase[]
  // A known-good solution, used by the self-test to prove the spec is sound.
  reference: string
}
