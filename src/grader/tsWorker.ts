import { runTests } from './core'
import type { TestCase } from './types'

// Grades TypeScript drills: loads the TypeScript compiler from the CDN (no npm
// dependency), transpiles the learner's code to JS, then runs it against the
// tests with the shared runner. Note: transpileModule strips types and reports
// syntax errors but does not enforce type errors; references are verified under
// --strict offline. A future upgrade can add in-browser type checking via
// @typescript/vfs.
const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null
  postMessage: (msg: unknown) => void
}

const TS_URL = 'https://cdn.jsdelivr.net/npm/typescript@5.6.3/+esm'

let tsReady: Promise<{ transpileModule: (code: string, opts: unknown) => { outputText: string }; ScriptTarget: { ES2020: number } }> | null = null

function getTs() {
  if (!tsReady) {
    const url = TS_URL
    tsReady = import(/* @vite-ignore */ url).then((m: { default?: unknown }) => (m.default ?? m) as never)
  }
  return tsReady
}

function fmt(value: unknown): string {
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

ctx.onmessage = async (e: MessageEvent) => {
  const { code, tests } = e.data as { code: string; tests: TestCase[] }
  const logs: string[] = []
  const orig = { log: console.log, warn: console.warn, error: console.error }
  const capture = (...args: unknown[]) => logs.push(args.map(fmt).join(' '))
  console.log = capture
  console.warn = capture
  console.error = capture
  try {
    const tsmod = await getTs()
    const js = tsmod.transpileModule(code, { compilerOptions: { target: tsmod.ScriptTarget.ES2020 } }).outputText
    ctx.postMessage({ results: runTests(js, tests), logs })
  } catch (err) {
    ctx.postMessage({ fatal: String((err as Error)?.message || err), logs })
  } finally {
    console.log = orig.log
    console.warn = orig.warn
    console.error = orig.error
  }
}
