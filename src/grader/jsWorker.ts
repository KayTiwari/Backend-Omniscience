import { runTests } from './core'
import type { TestCase } from './types'

// Runs the learner's code off the main thread. Cast self to avoid depending on
// the WebWorker lib being present in tsconfig.
const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null
  postMessage: (msg: unknown) => void
}

ctx.onmessage = (e: MessageEvent) => {
  const { code, tests } = e.data as { code: string; tests: TestCase[] }
  try {
    ctx.postMessage({ results: runTests(code, tests) })
  } catch (err) {
    // A throw here means the solution failed to even compile/define.
    ctx.postMessage({ fatal: String((err as Error)?.message || err) })
  }
}
