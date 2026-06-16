import { useMemo, useState } from 'react'
import { Database, Play } from 'lucide-react'
import { highlight } from './highlight'
import { previewSql, type SqlGrade } from './sql/engine'
import { ResultTable } from './sql/ResultTable'

type SqlExampleProps = {
  code: string
  setupSql: string
  // Authored output shown before the learner runs it (and if the engine fails).
  fallbackOutput: string
  explain?: string
}

// A runnable lesson example: the query is real. Clicking Run seeds Postgres
// (PGlite) with setupSql, executes code, and shows the actual result table.
export function SqlExample({ code, setupSql, fallbackOutput, explain }: SqlExampleProps) {
  const [running, setRunning] = useState(false)
  const [grade, setGrade] = useState<SqlGrade | null>(null)
  const highlighted = useMemo(() => highlight(code, 'sql'), [code])

  async function run() {
    setRunning(true)
    setGrade(await previewSql(setupSql, code))
    setRunning(false)
  }

  return (
    <section className="interactive-lesson sql-example" aria-label="Runnable SQL example">
      <div className="interactive-step">
        <div className="sql-example-head">
          <span className="interactive-badge">Run real SQL</span>
          <button className="run-button" onClick={() => void run()} disabled={running} type="button">
            <Play size={16} />
            {running ? 'Running' : 'Run query'}
          </button>
        </div>

        <details className="sql-schema">
          <summary>
            <Database size={14} /> Sample tables
          </summary>
          <pre dangerouslySetInnerHTML={{ __html: highlight(setupSql, 'sql') }} />
        </details>

        <pre className="interactive-code"><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>

        {grade?.error && <pre className="sql-error">{grade.error}</pre>}

        {grade?.result ? (
          <div className="sql-result-tables">
            <ResultTable title="Result" data={grade.result} />
          </div>
        ) : (
          <details className="interactive-run">
            <summary>Expected output</summary>
            <pre className="interactive-output"><code>{fallbackOutput}</code></pre>
          </details>
        )}

        {explain && <p className="sql-example-explain">{explain}</p>}
      </div>
    </section>
  )
}
