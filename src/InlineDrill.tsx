import { useMemo, useRef, type KeyboardEvent, type UIEvent } from 'react'
import { Check, Circle, Play } from 'lucide-react'
import { applyEditorKey } from './editorKeys'
import { highlight } from './highlight'
import type { GradeResult, GradeSpec } from './grader/types'

type InlineDrillProps = {
  spec: GradeSpec
  code: string
  onChange: (value: string) => void
  onRun: () => void
  running: boolean
  result?: GradeResult
}

// A full, runnable coding box (editor + tests + results) that can live inside a
// lesson body. It mirrors the main coding-block UI but is self-contained so a
// single lesson can embed several of these without depending on the active
// problem.
export function InlineDrill({
  spec,
  code,
  onChange,
  onRun,
  running,
  result,
}: InlineDrillProps) {
  const highlightRef = useRef<HTMLPreElement>(null)
  const highlighted = useMemo(() => highlight(code || '\n', spec.language), [code, spec.language])

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const editor = event.currentTarget
    const next = applyEditorKey(
      { end: editor.selectionEnd, start: editor.selectionStart, value: editor.value },
      event.key,
    )
    if (!next) return
    event.preventDefault()
    onChange(next.value)
    requestAnimationFrame(() => editor.setSelectionRange(next.start, next.end))
  }

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (!highlightRef.current) return
    highlightRef.current.scrollTop = event.currentTarget.scrollTop
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft
  }

  return (
    <section className="inline-drill">
      <div className="inline-drill-heading">
        <span className="interactive-badge">Write it</span>
        <button className="run-button" onClick={onRun} disabled={running} type="button">
          <Play size={16} />
          {running ? 'Running' : 'Run tests'}
        </button>
      </div>

      <div className="test-preview">
        <strong>Tests you need to pass</strong>
        <ul>
          {spec.tests.map((test) => {
            const testResult = result?.results.find((entry) => entry.name === test.name)
            const state = testResult ? (testResult.pass ? 'pass' : 'fail') : ''
            return (
              <li key={test.name} className={state}>
                {testResult?.pass ? <Check size={14} /> : <Circle size={14} />}
                <span>{test.name}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="code-editor-shell">
        <pre
          ref={highlightRef}
          className="code-highlight"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
        <textarea
          className="code-editor"
          value={code}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          aria-label={`${spec.title} code editor`}
        />
      </div>

      {result && (
        <div className={`test-results ${result.passed ? 'pass' : 'fail'}`}>
          <strong>{result.passed ? 'All tests passed.' : 'Tests need work.'}</strong>
          {result.error && <p>{result.error}</p>}
          {result.timedOut && <p>Execution timed out.</p>}
          <ul>
            {result.results.map((entry) => (
              <li key={entry.name} className={entry.pass ? 'pass' : 'fail'}>
                {entry.pass ? <Check size={15} /> : <Circle size={15} />}
                <span>
                  {entry.name}
                  {entry.message && <small>{entry.message}</small>}
                </span>
              </li>
            ))}
          </ul>
          {result.logs && result.logs.length > 0 && (
            <div className="console-output">
              <strong>Console output</strong>
              <pre>{result.logs.join('\n')}</pre>
            </div>
          )}
        </div>
      )}

      <details className="inline-drill-reveal">
        <summary>Stuck? Show a working solution</summary>
        <pre dangerouslySetInnerHTML={{ __html: highlight(spec.reference, spec.language) }} />
        {spec.explanation && <p>{spec.explanation}</p>}
      </details>
    </section>
  )
}
