import type { TestCase, TestResult } from './types.ts'

// Runs Python via Pyodide loaded from the CDN at runtime (no npm dependency).
// Cast self to avoid depending on the WebWorker lib in tsconfig.
const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null
  postMessage: (msg: unknown) => void
}

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs'

let pyodideReady: Promise<{ runPythonAsync: (code: string) => Promise<unknown> }> | null = null

function getPyodide() {
  if (!pyodideReady) {
    // Variable specifier so TS does not try to resolve the remote module.
    const url = PYODIDE_URL
    pyodideReady = import(/* @vite-ignore */ url).then((m: { loadPyodide: () => Promise<{ runPythonAsync: (code: string) => Promise<unknown> }> }) => m.loadPyodide())
  }
  return pyodideReady
}

ctx.onmessage = async (e: MessageEvent) => {
  const { code, tests } = e.data as { code: string; tests: TestCase[] }
  try {
    const py = await getPyodide()
    const results: TestResult[] = []
    for (const t of tests) {
      try {
        await py.runPythonAsync(code + '\n' + t.body + '\n')
        results.push({ name: t.name, pass: true })
      } catch (err) {
        const lines = String((err as Error)?.message || err).trim().split('\n')
        results.push({ name: t.name, pass: false, message: lines[lines.length - 1] || 'failed' })
      }
    }
    ctx.postMessage({ results })
  } catch (err) {
    ctx.postMessage({ fatal: String((err as Error)?.message || err) })
  }
}
