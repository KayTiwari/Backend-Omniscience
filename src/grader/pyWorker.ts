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
    const logs: string[] = []
    for (const t of tests) {
      try {
        await py.runPythonAsync(
          'import io, sys\n' +
            '__backend_omniscience_stdout = io.StringIO()\n' +
            '__backend_omniscience_old_stdout = sys.stdout\n' +
            'sys.stdout = __backend_omniscience_stdout\n' +
            'try:\n' +
            code
              .split('\n')
              .map((line) => '    ' + line)
              .join('\n') +
            '\n' +
            t.body
              .split('\n')
              .map((line) => '    ' + line)
              .join('\n') +
            '\nfinally:\n' +
            '    sys.stdout = __backend_omniscience_old_stdout\n' +
            '__backend_omniscience_captured = __backend_omniscience_stdout.getvalue()\n',
        )
        const captured = await py.runPythonAsync('__backend_omniscience_captured')
        if (typeof captured === 'string' && captured.trim()) {
          logs.push(...captured.trimEnd().split('\n'))
        }
        results.push({ name: t.name, pass: true })
      } catch (err) {
        const lines = String((err as Error)?.message || err).trim().split('\n')
        results.push({ name: t.name, pass: false, message: lines[lines.length - 1] || 'failed' })
      }
    }
    ctx.postMessage({ results, logs })
  } catch (err) {
    ctx.postMessage({ fatal: String((err as Error)?.message || err) })
  }
}
