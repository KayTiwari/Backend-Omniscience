// Proves the SQL course is sound:
//  1. every drill's reference answer passes its own seeded schema, and
//  2. every runnable lesson example executes against Postgres without error.
// Run with: node --experimental-strip-types src/sql/selftest.ts
import { gradeSql, previewSql } from './engine.ts'
import { sqlSpecs } from './sqlSpecs.ts'
import { sqlFoundations } from '../course.foundationsSql.ts'

let failures = 0

for (const spec of sqlSpecs) {
  const grade = await gradeSql(spec, spec.solutionSql)
  if (!grade.passed) {
    failures++
    console.error(`FAIL drill ${spec.problemId}: ${grade.error ?? grade.reason ?? 'reference did not pass itself'}`)
  } else {
    const rows = grade.result?.rows.length ?? 0
    console.log(`ok   drill ${spec.problemId}  (${rows} rows · [${grade.result?.columns.join(', ')}])`)
  }
}

const runnableExamples = sqlFoundations.filter((p) => p.interactive?.example.setupSql)
for (const problem of runnableExamples) {
  const ex = problem.interactive!.example
  const out = await previewSql(ex.setupSql!, ex.code)
  if (!out.ran) {
    failures++
    console.error(`FAIL example ${problem.id}: ${out.error}`)
  } else {
    const rows = out.result?.rows.length ?? 0
    console.log(`ok   example ${problem.id}  (${rows} rows · [${out.result?.columns.join(', ')}])`)
  }
}

if (failures > 0) {
  throw new Error(`${failures} SQL self-test(s) failed.`)
}
console.log(`\nAll ${sqlSpecs.length} drills + ${runnableExamples.length} runnable examples passed self-test.`)
