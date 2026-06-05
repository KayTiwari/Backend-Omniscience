import type { GradeResult, TestCase, TestResult } from './types'

// Host-side entry point the UI calls on "Run". Spawns the worker, enforces a
// timeout (so infinite loops cannot hang the page), and resolves a GradeResult.
export function gradeJs(code: string, tests: TestCase[], timeoutMs = 3000): Promise<GradeResult> {
  return new Promise((resolve) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./jsWorker.ts', import.meta.url), { type: 'module' })
    } catch (err) {
      resolve({ passed: false, results: [], error: 'Failed to start runner: ' + String(err) })
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
