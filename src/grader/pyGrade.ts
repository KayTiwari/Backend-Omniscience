import type { GradeResult, TestCase, TestResult } from './types.ts'

// Host-side entry point for Python drills. Same contract as gradeJs, but a longer
// default timeout because the first run downloads + boots Pyodide (a few seconds).
export function gradePy(code: string, tests: TestCase[], timeoutMs = 25000): Promise<GradeResult> {
  return new Promise((resolve) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./pyWorker.ts', import.meta.url), { type: 'module' })
    } catch (err) {
      resolve({ passed: false, results: [], error: 'Failed to start Python runner: ' + String(err) })
      return
    }

    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ passed: false, results: [], timedOut: true })
    }, timeoutMs)

    worker.onmessage = (e: MessageEvent) => {
      clearTimeout(timer)
      worker.terminate()
      const data = e.data as { results?: TestResult[]; fatal?: string }
      if (data.fatal) {
        resolve({ passed: false, results: [], error: data.fatal })
        return
      }
      const results = data.results || []
      resolve({ passed: results.length > 0 && results.every((r) => r.pass), results })
    }

    worker.onerror = (err: ErrorEvent) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ passed: false, results: [], error: err.message || 'Runner error' })
    }

    worker.postMessage({ code, tests })
  })
}
