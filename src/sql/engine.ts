// Real Postgres in the browser via PGlite. The whole point of the SQL drills is
// that learners write actual SQL and it runs against a real database, instead of
// simulating query semantics in JavaScript. PGlite is loaded lazily so the ~3MB
// wasm only downloads when someone opens a SQL drill.

import type { PGlite } from '@electric-sql/pglite'

let dbPromise: Promise<PGlite> | null = null

async function getDb(): Promise<PGlite> {
  if (!dbPromise) {
    dbPromise = import('@electric-sql/pglite').then(({ PGlite }) => new PGlite())
  }
  return dbPromise
}

export type QueryResult = {
  columns: string[]
  rows: Record<string, unknown>[]
}

// Every drill runs against a clean database. Dropping and recreating the public
// schema is the fastest way to reset state between the reference run and the
// learner run without spinning up a new Postgres each time.
async function reset(db: PGlite) {
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;')
}

// Seed the database, run a statement, and capture a result set.
//  - For a SELECT drill, `stmt` is the query and we return its rows.
//  - For a mutation drill (UPDATE/INSERT/DELETE), `captureSql` selects the
//    resulting table state so we can compare what the statement *did*.
export async function runScenario(
  setupSql: string,
  stmt: string,
  captureSql?: string,
): Promise<QueryResult> {
  const db = await getDb()
  await reset(db)
  await db.exec(setupSql)
  if (captureSql) {
    await db.exec(stmt)
    return toResult(await db.query(captureSql))
  }
  return toResult(await db.query(stmt))
}

type RawResult = { rows: unknown[]; fields: { name: string }[] }

function toResult(res: RawResult): QueryResult {
  return {
    columns: res.fields.map((f) => f.name),
    rows: (res.rows as Record<string, unknown>[]) ?? [],
  }
}

// All database access is serialized: each scenario resets shared state, so two
// runs must never interleave.
let lock: Promise<unknown> = Promise.resolve()
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lock.then(fn, fn)
  lock = run.catch(() => undefined)
  return run
}

export type SqlGrade = {
  // The learner's SQL executed without error.
  ran: boolean
  // The learner's result set matches the reference result set.
  passed: boolean
  error?: string
  reason?: string
  result?: QueryResult
  expected?: QueryResult
}

export type SqlScenario = {
  setupSql: string
  solutionSql: string
  captureSql?: string
  // ORDER BY drills care about row order; most drills compare as a set.
  orderMatters?: boolean
}

export async function gradeSql(scenario: SqlScenario, learnerSql: string): Promise<SqlGrade> {
  return withLock(async () => {
    let expected: QueryResult
    try {
      expected = await runScenario(scenario.setupSql, scenario.solutionSql, scenario.captureSql)
    } catch (err) {
      return { ran: false, passed: false, error: `Reference query failed: ${message(err)}` }
    }

    let actual: QueryResult
    try {
      actual = await runScenario(scenario.setupSql, learnerSql, scenario.captureSql)
    } catch (err) {
      return { ran: false, passed: false, error: message(err), expected }
    }

    const verdict = compare(expected, actual, scenario.orderMatters === true)
    return {
      ran: true,
      passed: verdict.equal,
      reason: verdict.reason,
      result: actual,
      expected,
    }
  })
}

// Run a snippet just to show its output (used by runnable lesson examples, where
// there is no reference answer to grade against). Handles multi-statement
// snippets (e.g. an UPDATE followed by a SELECT) and shows the last statement
// that returns rows.
export async function previewSql(setupSql: string, sql: string): Promise<SqlGrade> {
  return withLock(async () => {
    try {
      const db = await getDb()
      await reset(db)
      await db.exec(setupSql)
      const results = (await db.exec(sql)) as RawResult[]
      let last: RawResult | undefined
      for (const r of results) if (r.fields && r.fields.length > 0) last = r
      return { ran: true, passed: true, result: last ? toResult(last) : { columns: [], rows: [] } }
    } catch (err) {
      return { ran: false, passed: false, error: message(err) }
    }
  })
}

function message(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return String((err as Error).message)
  return String(err)
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return '∅'
  if (typeof value === 'bigint') return value.toString()
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'number') return Object.is(value, -0) ? '0' : String(value)
  return String(value)
}

function rowKey(row: Record<string, unknown>, columns: string[]): string {
  return columns.map((c) => `${c}=${cell(row[c])}`).join('')
}

type Verdict = { equal: boolean; reason?: string }

function compare(expected: QueryResult, actual: QueryResult, orderMatters: boolean): Verdict {
  const expectedCols = [...expected.columns].sort()
  const actualCols = [...actual.columns].sort()
  if (expectedCols.length !== actualCols.length || expectedCols.some((c, i) => c !== actualCols[i])) {
    return {
      equal: false,
      reason: `Columns don't match. Expected [${expected.columns.join(', ')}], got [${actual.columns.join(', ')}].`,
    }
  }

  if (expected.rows.length !== actual.rows.length) {
    return {
      equal: false,
      reason: `Expected ${expected.rows.length} row(s), got ${actual.rows.length}.`,
    }
  }

  const cols = expectedCols
  if (orderMatters) {
    for (let i = 0; i < expected.rows.length; i++) {
      if (rowKey(expected.rows[i], cols) !== rowKey(actual.rows[i], cols)) {
        return { equal: false, reason: `Row ${i + 1} differs, or the ordering is wrong.` }
      }
    }
    return { equal: true }
  }

  const expectedKeys = expected.rows.map((r) => rowKey(r, cols)).sort()
  const actualKeys = actual.rows.map((r) => rowKey(r, cols)).sort()
  for (let i = 0; i < expectedKeys.length; i++) {
    if (expectedKeys[i] !== actualKeys[i]) {
      return { equal: false, reason: 'The rows returned are not the ones expected.' }
    }
  }
  return { equal: true }
}
