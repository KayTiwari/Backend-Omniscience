import { specs as rawSpecs } from './specs'
import { pySpecs as rawPySpecs } from './pySpecs'
import { tsSpecs as rawTsSpecs } from './tsSpecs'
import { explanations } from './explanations'
import { gradeJs } from './gradeJs'
import { gradePy } from './pyGrade'
import { gradeTs } from './tsGrade'
import type { GradeResult, GradeSpec } from './types'

export type { TestCase, TestResult, GradeResult, GradeSpec } from './types'
export { runTests } from './core'
export { gradeJs } from './gradeJs'
export { gradePy } from './pyGrade'
export { gradeTs } from './tsGrade'
export { explanations } from './explanations'

function withExplanation(s: GradeSpec): GradeSpec {
  return explanations[s.problemId] ? { ...s, explanation: explanations[s.problemId] } : s
}

// JavaScript drills (Codex's core/framework + Claude's backend set).
export const specs: GradeSpec[] = rawSpecs.map(withExplanation)

// Real Python drills, graded by Pyodide.
export const pySpecs: GradeSpec[] = rawPySpecs.map(withExplanation)

// Real TypeScript drills, transpiled + run by the TS compiler.
export const tsSpecs: GradeSpec[] = rawTsSpecs.map(withExplanation)

// Every drill, all languages.
export const allSpecs: GradeSpec[] = [...specs, ...tsSpecs, ...pySpecs]

// Dispatch by language so the UI does not care which runtime grades it.
export function grade(spec: GradeSpec, code: string): Promise<GradeResult> {
  if (spec.language === 'py') return gradePy(code, spec.tests)
  if (spec.language === 'ts') return gradeTs(code, spec.tests)
  return gradeJs(code, spec.tests)
}
