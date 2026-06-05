import type { TestCase, TestResult } from './types'

// Pure runner: evaluates `code` (the learner's solution) and then each test
// body in the same scope, capturing per-test pass/fail. No DOM, no worker, so
// it is unit-testable in Node as well as runnable inside a Web Worker.
//
// Security note: this uses `new Function`, so it is NOT a hard sandbox. It runs
// inside a Web Worker (separate thread, no DOM) which is acceptable for a
// single-user learning tool. For untrusted code, swap in a WASM executor
// (see README). Each test runs in its own try/catch so one failure does not
// abort the rest.
// Returns TestResult[]. Console output is captured by the worker (which overrides
// the global console), so runTests stays a pure results runner.
export function runTests(code: string, tests: TestCase[]): TestResult[] {
  function assert(cond: unknown, msg?: string): void {
    if (!cond) throw new Error(msg || 'assertion failed')
  }
  function assertEqual(actual: unknown, expected: unknown, msg?: string): void {
    const a = JSON.stringify(actual)
    const b = JSON.stringify(expected)
    if (a !== b) {
      throw new Error((msg ? msg + ': ' : '') + 'expected ' + b + ', got ' + a)
    }
  }

  const harness = tests
    .map(
      (t, i) =>
        `__results__.push((function(){ try { ${t.body}\n; return { name: __names__[${i}], pass: true }; } ` +
        `catch (e) { return { name: __names__[${i}], pass: false, message: String((e && e.message) || e) }; } })());`,
    )
    .join('\n')

  const source = code + '\n' + harness
  const fn = new Function('assert', 'assertEqual', '__results__', '__names__', source)
  const results: TestResult[] = []
  fn(assert, assertEqual, results, tests.map((t) => t.name))
  return results
}
