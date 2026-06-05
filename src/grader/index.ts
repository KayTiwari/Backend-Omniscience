import { specs as rawSpecs } from './specs'
import { pySpecs as rawPySpecs } from './pySpecs'
import { explanations } from './explanations'
import { gradeJs } from './gradeJs'
import { gradePy } from './pyGrade'
import type { GradeResult, GradeSpec } from './types'

export type { TestCase, TestResult, GradeResult, GradeSpec } from './types'
export { runTests } from './core'
export { gradeJs } from './gradeJs'
export { gradePy } from './pyGrade'
export { explanations } from './explanations'

function withExplanation(s: GradeSpec): GradeSpec {
  return explanations[s.problemId] ? { ...s, explanation: explanations[s.problemId] } : s
}

// JavaScript drills (Codex's core/framework + Claude's backend set).
export const specs: GradeSpec[] = rawSpecs.map(withExplanation)

// Real Python drills, graded by Pyodide.
export const pySpecs: GradeSpec[] = rawPySpecs.map(withExplanation)

// Every drill, both languages.
export const allSpecs: GradeSpec[] = [...specs, ...pySpecs]

// Dispatch by language so the UI does not care which runtime grades it.
export function grade(spec: GradeSpec, code: string): Promise<GradeResult> {
  return spec.language === 'py' ? gradePy(code, spec.tests) : gradeJs(code, spec.tests)
}
