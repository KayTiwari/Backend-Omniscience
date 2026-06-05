import { runTests } from './core'
import { specs } from './specs'

// Proves every spec's reference solution passes its own tests, and that a
// broken (empty) solution is correctly failed. Run with esbuild + node.
let ok = true

for (const spec of specs) {
  const passing = runTests(spec.reference, spec.tests)
  const allPass = passing.length > 0 && passing.every((r) => r.pass)
  console.log(`${allPass ? 'PASS' : 'FAIL'}  reference: ${spec.title}`)
  if (!allPass) {
    ok = false
    passing.filter((r) => !r.pass).forEach((r) => console.log(`    x ${r.name}: ${r.message}`))
  }

  const broken = runTests('', spec.tests)
  const allFail = broken.every((r) => !r.pass)
  console.log(`${allFail ? 'PASS' : 'FAIL'}  broken detected: ${spec.title}`)
  if (!allFail) ok = false
}

if (!ok) throw new Error('grader self-test failed')
console.log('\nAll grader self-tests passed.')
