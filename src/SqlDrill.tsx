import { useMemo, useRef, useState, type KeyboardEvent, type UIEvent } from 'react'
import { Check, Circle, Database, Play } from 'lucide-react'
import { applyEditorKey } from './editorKeys'
import { highlight } from './highlight'
import { gradeSql, type SqlGrade } from './sql/engine'
import { ResultTable } from './sql/ResultTable'
import type { SqlSpec } from './sql/sqlSpecs'

type SqlDrillProps = {
  spec: SqlSpec
  code: string
  onChange: (value: string) => void
  // Called when the learner's result set matches the reference answer.
  onSolved: () => void
}

// A real SQL exercise: write a query, run it against Postgres (PGlite) in the
// browser, and get graded on the result set, not on a JavaScript stand-in.
export function SqlDrill({ spec, code, onChange, onSolved }: SqlDrillProps) {
  const highlightRef = useRef<HTMLPreElement>(null)
  const [running, setRunning] = useState(false)
  const [grade, setGrade] = useState<SqlGrade | null>(null)
  const highlighted = useMemo(() => highlight(code || '\n', 'sql'), [code])

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

  async function run() {
    setRunning(true)
    const result = await gradeSql(spec, code)
    setGrade(result)
    setRunning(false)
    if (result.passed) onSolved()
  }

  return (
    <section className="coding-block sql-drill">
      <div className="coding-heading">
        <div>
          <h3>SQL Workbench</h3>
          <p>{spec.title} · real Postgres in your browser</p>
        </div>
        <button className="run-button" onClick={() => void run()} disabled={running} type="button">
          <Play size={17} />
          {running ? 'Running' : 'Run query'}
        </button>
      </div>

      <div className="coding-instructions">
        <strong>Do this</strong>
        <p>{spec.prompt}</p>
      </div>

      <details className="sql-schema">
        <summary>
          <Database size={14} /> Tables you are querying
        </summary>
        <pre dangerouslySetInnerHTML={{ __html: highlight(spec.setupSql, 'sql') }} />
      </details>

      <div className="code-editor-shell sql-editor-shell">
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
          aria-label={`${spec.title} SQL editor`}
        />
      </div>

      {grade && (
        <div className={`test-results ${grade.passed ? 'pass' : 'fail'}`}>
          <strong>
            {grade.passed
              ? 'Correct. Your result set matches.'
              : grade.ran
                ? 'Query ran, but the result is not what we expected.'
                : 'The query did not run.'}
          </strong>
          {grade.error && <pre className="sql-error">{grade.error}</pre>}
          {grade.reason && !grade.passed && <p>{grade.reason}</p>}
          {grade.result && (
            <div className="sql-result-tables">
              <ResultTable title="Your result" data={grade.result} />
              {!grade.passed && grade.expected && (
                <ResultTable title="Expected" data={grade.expected} />
              )}
            </div>
          )}
        </div>
      )}

      <div className="test-preview sql-checks">
        <strong>What counts as done</strong>
        <ul>
          <li className={grade?.ran ? 'pass' : ''}>
            {grade?.ran ? <Check size={14} /> : <Circle size={14} />}
            <span>The query executes without error</span>
          </li>
          <li className={grade?.passed ? 'pass' : ''}>
            {grade?.passed ? <Check size={14} /> : <Circle size={14} />}
            <span>It returns exactly the expected rows</span>
          </li>
        </ul>
      </div>

      <details className="inline-drill-reveal">
        <summary>Stuck? Show a working query</summary>
        <pre dangerouslySetInnerHTML={{ __html: highlight(spec.solutionSql, 'sql') }} />
        {spec.hint && <p>{spec.hint}</p>}
      </details>
    </section>
  )
}
