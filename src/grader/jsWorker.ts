import { runTests } from './core'
import type { TestCase } from './types'

// Runs the learner's code off the main thread. Cast self to avoid depending on
// the WebWorker lib being present in tsconfig.
const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null
  postMessage: (msg: unknown) => void
}

function formatLogArg(value: unknown): string {
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

ctx.onmessage = (e: MessageEvent) => {
  const { code, tests } = e.data as { code: string; tests: TestCase[] }
  const logs: string[] = []
  const originalLog = console.log
  const originalWarn = console.warn
  const originalError = console.error
  const capture = (...args: unknown[]) => logs.push(args.map(formatLogArg).join(' '))
  console.log = capture
  console.warn = capture
  console.error = capture
  try {
    ctx.postMessage({ results: runTests(code, tests), logs })
  } catch (err) {
    // A throw here means the solution failed to even compile/define.
    ctx.postMessage({ fatal: String((err as Error)?.message || err), logs })
  } finally {
    console.log = originalLog
    console.warn = originalWarn
    console.error = originalError
  }
}
