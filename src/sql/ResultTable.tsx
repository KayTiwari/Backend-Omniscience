import type { QueryResult } from './engine'

// Renders a Postgres result set as a table. Shared by the graded SQL drills and
// the runnable lesson examples so they look identical.
export function ResultTable({ title, data }: { title?: string; data: QueryResult }) {
  return (
    <div className="sql-result">
      {title && <span className="sql-result-title">{title}</span>}
      {data.columns.length === 0 ? (
        <p className="sql-empty">No columns returned.</p>
      ) : (
        <div className="sql-table-scroll">
          <table>
            <thead>
              <tr>
                {data.columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.length === 0 ? (
                <tr>
                  <td colSpan={data.columns.length} className="sql-empty">
                    0 rows
                  </td>
                </tr>
              ) : (
                data.rows.map((row, r) => (
                  <tr key={r}>
                    {data.columns.map((col) => (
                      <td key={col}>{formatCell(row[col])}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (value instanceof Date) return value.toISOString()
  return String(value)
}
